// Command migrate converts the twanksta dictionary dump into the editable
// per-lemma TOML source (entries/<slug>.toml) that core.Load reads.
//
// It carries over the curated facts (headword, gender, translations,
// attestation, audio) and derives POS from the shape of the twanksta `forms`
// block. Inflected forms are NOT copied — they are generated live from the FST
// at /more/ time. The one exception is an adjective's adverbs: those exist in
// the FST only as a SEPARATE lexeme keyed on the adverb's own headword
// (begalbjai+Adv), which the adjective's generation path can't reach, so they
// are written as overrides.
//
// Homonyms (several twanksta entries sharing a headword) are grouped into one
// file: each becomes a [[sense]] block under a single `word`, in source order.
// Array position is the sense's identity, so nothing gets suffixed or dropped.
//
//	go run ./cmd/migrate -in ../corpus/parsed/twanksta_entries.json -out entries
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/BurntSushi/toml"

	"github.com/strfry/prussian-dictionary/internal/core"
)

type twEntry struct {
	Word         string                     `json:"word"`
	Paradigm     string                     `json:"paradigm"`
	Gender       string                     `json:"gender"`
	Desc         string                     `json:"desc"`
	Audio        string                     `json:"audio"`
	Translations map[string][]string        `json:"translations"`
	Forms        map[string]json.RawMessage `json:"forms"`
}

type twAdverb struct {
	Positive    string `json:"positive"`
	Comparative string `json:"comparative"`
	Superlative string `json:"superlative"`
}

// twanksta wire language code -> our stable core.Lang.
var langMap = map[string]core.Lang{
	"engl": core.LangEN, "miks": core.LangDE, "leit": core.LangLT,
	"latt": core.LangLV, "pols": core.LangPL, "mask": core.LangRU,
}

func main() {
	in := flag.String("in", "../corpus/parsed/twanksta_entries.json", "twanksta_entries.json")
	out := flag.String("out", "entries", "output dir for entries/*.toml")
	flag.Parse()

	raw, err := os.ReadFile(*in)
	if err != nil {
		log.Fatalf("read %s: %v", *in, err)
	}
	var tw []twEntry
	if err := json.Unmarshal(raw, &tw); err != nil {
		log.Fatalf("parse %s: %v", *in, err)
	}
	if err := os.MkdirAll(*out, 0o755); err != nil {
		log.Fatalf("mkdir %s: %v", *out, err)
	}

	var perPOS = map[core.POS]int{}
	// Group twanksta entries by headword, preserving source order, so homonyms
	// collapse into one Lemma with one [[sense]] per twanksta entry.
	var order []string
	byWord := map[string][]twEntry{}
	for _, t := range tw {
		if _, ok := byWord[t.Word]; !ok {
			order = append(order, t.Word)
		}
		byWord[t.Word] = append(byWord[t.Word], t)
	}

	written := 0
	for _, word := range order {
		lemma := core.Lemma{Word: word}
		for _, t := range byWord[word] {
			pos := derivePOS(t.Forms)
			e := core.Entry{
				POS:          pos,
				Gender:       t.Gender,
				Desc:         t.Desc,
				Audio:        t.Audio,
				Paradigm:     t.Paradigm,
				Translations: mapTranslations(t.Translations),
			}
			if pos == core.POSAdj {
				e.Overrides = adverbOverrides(t.Forms)
			}
			lemma.Senses = append(lemma.Senses, e)
			perPOS[pos]++
		}

		name := slug(word)
		f, err := os.Create(filepath.Join(*out, name+".toml"))
		if err != nil {
			log.Fatalf("create %s: %v", name, err)
		}
		if err := toml.NewEncoder(f).Encode(lemma); err != nil {
			log.Fatalf("encode %s: %v", name, err)
		}
		f.Close()
		written++
	}

	fmt.Printf("wrote %d files (one per distinct word) to %s/\n", written, *out)
	fmt.Printf("  noun=%d adj=%d verb=%d other=%d\n",
		perPOS[core.POSNoun], perPOS[core.POSAdj], perPOS[core.POSVerb], perPOS[core.POSOther])
}

func derivePOS(f map[string]json.RawMessage) core.POS {
	if f == nil {
		return core.POSOther
	}
	if _, ok := f["indicative"]; ok {
		return core.POSVerb
	}
	if _, ok := f["subjunctive"]; ok {
		return core.POSVerb
	}
	if _, ok := f["comparative"]; ok {
		return core.POSAdj
	}
	if _, ok := f["superlative"]; ok {
		return core.POSAdj
	}
	if _, ok := f["adverb"]; ok {
		return core.POSAdj
	}
	if _, ok := f["declension"]; ok {
		return core.POSNoun
	}
	return core.POSOther
}

func mapTranslations(t map[string][]string) map[core.Lang][]string {
	out := map[core.Lang][]string{}
	for k, v := range t {
		if l, ok := langMap[k]; ok && len(v) > 0 {
			out[l] = v
		}
	}
	if len(out) == 0 {
		return nil
	}
	return out
}

// adverbOverrides carries an adjective's adverbs over as data: they live in the
// FST only under the adverb's own lemma (begalbjai+Adv), unreachable from the
// adjective's query path, so the migration writes them as overrides.
func adverbOverrides(f map[string]json.RawMessage) map[core.Slot]string {
	raw, ok := f["adverb"]
	if !ok {
		return nil
	}
	var a twAdverb
	if json.Unmarshal(raw, &a) != nil {
		return nil
	}
	ov := map[core.Slot]string{}
	if a.Positive != "" {
		ov["adv"] = a.Positive
	}
	if a.Comparative != "" {
		ov["adv.cmp"] = a.Comparative
	}
	if a.Superlative != "" {
		ov["adv.sup"] = a.Superlative
	}
	if len(ov) == 0 {
		return nil
	}
	return ov
}

// slug turns a headword into a filesystem-safe base name, keeping macrons so
// files stay findable by lemma.
func slug(w string) string {
	r := strings.NewReplacer(
		"/", "-", "\\", "-", "?", "", "*", "-", ":", "-",
		"\"", "-", "<", "-", ">", "-", "|", "-", " ", "_",
	)
	s := strings.TrimSpace(r.Replace(w))
	if s == "" {
		s = "_"
	}
	return s
}
