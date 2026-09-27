package core

// LoadLexonomy is an alternative storage backend: instead of the entries/*.toml
// tree (see store.go), it reads the editable source straight out of a Lexonomy
// per-dictionary SQLite. This targets the lexicalcomputing fork, which stores
// one entry per row as an **NVH** document (Nested Value Hierarchy — a simple
// indentation-based `name: value` tree; see the fork's website/nvh.py) in the
// entries.nvh column. This loader parses those documents into the same Lemma
// model and hands them to Store.index, so everything downstream
// (Lookup/Search/Suggest and the FormGenerator) is byte-for-byte unaffected —
// only the serialization changes (TOML file <-> NVH-in-a-column).
//
// The NVH shape is our own (mirrored by the twanksta->NVH importer):
//
//	entry: <headword>
//	  sense: <pos>
//	    gender: masc
//	    desc: [Abasus E 294]
//	    paradigm: 32
//	    en: cart
//	    de: Wagen
//	    override: deiwu
//	      slot: sg.dat
//
// We shell out to the `sqlite3` CLI rather than link a driver: the project has
// no cgo/SQLite dependency and already talks to external tools this way (the FST
// generator shells out to hfst-optimized-lookup).

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"sort"
	"strings"
)

// LoadLexonomy reads every entry from a Lexonomy dictionary SQLite at dbPath and
// builds the same in-memory Store that Load builds from TOML. Overrides are
// validated against the POS slot inventory exactly as for the TOML backend, so a
// stale slot from a hand edit in Lexonomy fails loudly here too.
func LoadLexonomy(dbPath string) (*Store, error) {
	rows, err := sqliteEntriesNVH(dbPath)
	if err != nil {
		return nil, err
	}
	s := &Store{byWord: map[string][]*Entry{}}
	for i, doc := range rows {
		roots := parseNVH(doc)
		for _, root := range roots {
			if root.Name != "entry" {
				continue
			}
			lemma := lemmaFromNVH(root)
			if err := s.index(lemma); err != nil {
				return nil, fmt.Errorf("entry #%d (%s): %w", i+1, lemma.Word, err)
			}
		}
	}
	sort.Slice(s.lemmas, func(i, j int) bool { return s.lemmas[i].Word < s.lemmas[j].Word })
	return s, nil
}

// nvhNode is one node of a parsed NVH tree: a name, its inline value, and any
// indented children.
type nvhNode struct {
	Name     string
	Value    string
	Children []*nvhNode
}

// transLangs is the set of translation-target node names we recognise as
// language buckets; anything else under a sense is ignored on read.
var transLangs = map[string]bool{
	string(LangEN): true, string(LangDE): true, string(LangLT): true,
	string(LangLV): true, string(LangPL): true, string(LangRU): true,
}

// lemmaFromNVH maps one parsed `entry:` node onto a core.Lemma. The entry's
// value is the headword; each `sense:` child is one homonym Entry whose value is
// the POS. Repeated language nodes accumulate into the translation buckets.
func lemmaFromNVH(root *nvhNode) Lemma {
	lemma := Lemma{Word: root.Value}
	for _, sn := range root.Children {
		if sn.Name != "sense" {
			continue
		}
		e := Entry{POS: POS(sn.Value)}
		for _, c := range sn.Children {
			switch {
			case c.Name == "gender":
				e.Gender = c.Value
			case c.Name == "desc":
				e.Desc = c.Value
			case c.Name == "paradigm":
				e.Paradigm = c.Value
			case c.Name == "audio":
				e.Audio = c.Value
			case c.Name == "override":
				var slot string
				for _, oc := range c.Children {
					if oc.Name == "slot" {
						slot = oc.Value
					}
				}
				if slot != "" {
					if e.Overrides == nil {
						e.Overrides = map[Slot]string{}
					}
					e.Overrides[Slot(slot)] = c.Value
				}
			case transLangs[c.Name]:
				if e.Translations == nil {
					e.Translations = map[Lang][]string{}
				}
				e.Translations[Lang(c.Name)] = append(e.Translations[Lang(c.Name)], c.Value)
			}
		}
		lemma.Senses = append(lemma.Senses, e)
	}
	return lemma
}

// parseNVH parses an NVH document into its top-level nodes. Indentation is
// leading spaces/tabs (our importer emits two spaces per level); depth is the
// byte length of that prefix. Blank lines and #-comments are skipped. A line is
// `name: value` split on the FIRST colon, both sides trimmed — matching
// nvh.py's parse rules so the two sides agree.
func parseNVH(doc string) []*nvhNode {
	var roots []*nvhNode
	type frame struct {
		indent int
		node   *nvhNode
	}
	var stack []frame
	for _, line := range strings.Split(doc, "\n") {
		if strings.TrimSpace(line) == "" || strings.HasPrefix(strings.TrimSpace(line), "#") {
			continue
		}
		indent := len(line) - len(strings.TrimLeft(line, " \t"))
		name, value, _ := strings.Cut(line[indent:], ":")
		node := &nvhNode{Name: strings.TrimSpace(name), Value: strings.TrimSpace(value)}
		for len(stack) > 0 && stack[len(stack)-1].indent >= indent {
			stack = stack[:len(stack)-1]
		}
		if len(stack) == 0 {
			roots = append(roots, node)
		} else {
			p := stack[len(stack)-1].node
			p.Children = append(p.Children, node)
		}
		stack = append(stack, frame{indent, node})
	}
	return roots
}

// sqliteEntriesNVH returns the nvh column of every row of the entries table, in
// id order, by invoking the sqlite3 CLI in JSON mode.
func sqliteEntriesNVH(dbPath string) ([]string, error) {
	// Lexonomy keeps the dictionary in WAL mode, so a reader must see the
	// WAL-merged current state — which a plain (read-write) handle does, and
	// which mode=ro/immutable do NOT (mode=ro cannot open a WAL db with an active
	// -wal; immutable ignores the -wal and reads the stale committed snapshot,
	// which would hide just-saved edits). We are the same owner as Lexonomy, so a
	// plain handle is fine and WAL supports our concurrent read. Fall back to an
	// immutable snapshot only for a file we cannot open read-write, e.g. a
	// root-owned DB in local Docker eval (not WAL there, so the snapshot is live).
	var out []byte
	var err error
	for _, arg := range []string{dbPath, "file:" + dbPath + "?immutable=1"} {
		out, err = exec.Command("sqlite3", "-json", arg,
			"SELECT nvh FROM entries ORDER BY id").Output()
		if err == nil {
			break
		}
	}
	if err != nil {
		return nil, fmt.Errorf("sqlite3 %s: %w", dbPath, err)
	}
	out = []byte(strings.TrimSpace(string(out)))
	if len(out) == 0 || string(out) == "[]" {
		return nil, nil
	}
	var recs []struct {
		NVH string `json:"nvh"`
	}
	if err := json.Unmarshal(out, &recs); err != nil {
		return nil, fmt.Errorf("decode sqlite3 json: %w", err)
	}
	nvhs := make([]string, len(recs))
	for i, r := range recs {
		nvhs[i] = r.NVH
	}
	return nvhs, nil
}
