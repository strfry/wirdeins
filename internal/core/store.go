package core

import (
	"fmt"
	"io/fs"
	"path/filepath"
	"sort"
	"strings"

	"github.com/BurntSushi/toml"
)

// Store is the in-memory index over all editable entries. 10k entries is tiny;
// we load the whole entries/*.toml tree into RAM at startup. Lookup for /search/
// and /auto/ runs entirely here; only /more/ (form tables) reaches out to the
// FormGenerator.
type Store struct {
	// byWord indexes every homonym sense under its headword, preserving source
	// order. A word with several POS/meanings has several *Entry under one key —
	// nothing is "last wins" here.
	byWord map[string][]*Entry
	// lemmas are the decoded Lemmas, sorted by headword, so Search/Suggest
	// iterate in a deterministic order (maps alone have no order). The Entry
	// pointers in byWord point into these Lemmas' Senses.
	lemmas []Lemma
}

// Load reads every entries/**/*.toml under dir into memory. Each file is one
// Lemma (headword + homonym senses); the senses are indexed under the headword.
// Unknown override slots are rejected so a typo'd hand edit fails loudly rather
// than silently never rendering.
func Load(dir string) (*Store, error) {
	s := &Store{byWord: map[string][]*Entry{}}
	err := filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() || !strings.HasSuffix(path, ".toml") {
			return nil
		}
		var lemma Lemma
		if _, err := toml.DecodeFile(path, &lemma); err != nil {
			return fmt.Errorf("%s: %w", path, err)
		}
		for i := range lemma.Senses {
			e := &lemma.Senses[i]
			if err := validateOverrides(lemma.Word, e); err != nil {
				return fmt.Errorf("%s: %w", path, err)
			}
			s.byWord[lemma.Word] = append(s.byWord[lemma.Word], e)
		}
		s.lemmas = append(s.lemmas, lemma)
		return nil
	})
	if err != nil {
		return nil, err
	}
	sort.Slice(s.lemmas, func(i, j int) bool { return s.lemmas[i].Word < s.lemmas[j].Word })
	return s, nil
}

// validateOverrides rejects any override keyed by a slot the entry's POS does
// not have. An unknown slot is a data error — a typo'd or stale hand edit that
// would otherwise silently never render. This is the load-time guard the
// editable-source design relies on (fail loud, not silently drop).
func validateOverrides(word string, e *Entry) error {
	valid := map[Slot]bool{}
	for _, s := range SlotsFor(e.POS) {
		valid[s] = true
	}
	for slot := range e.Overrides {
		if !valid[slot] {
			return fmt.Errorf("%s (%s): override slot %q not in the %s inventory", word, e.POS, slot, e.POS)
		}
	}
	return nil
}

// Lookup returns every homonym sense for an exact headword, in source order.
func (s *Store) Lookup(word string) []*Entry { return s.byWord[word] }

// fold normalizes for diacritic-insensitive matching: the site lets users type
// a/e/i/o/u for ā/ē/ī/ō/ū.
func fold(s string) string {
	r := strings.NewReplacer("ā", "a", "ē", "e", "ī", "i", "ō", "o", "ū", "u")
	return r.Replace(strings.ToLower(s))
}

// Search finds lemmas by Prussian headword or by any translation in lang.
// Direction (Prussian->target vs target->Prussian) is auto-detected exactly
// like twanksta: try both sides, matching substrings. Results are in a stable
// order (headword-sorted). This is a sketch; ranking/paging is a later concern.
func (s *Store) Search(query string, lang Lang) []*Lemma {
	q := fold(strings.TrimSpace(query))
	if q == "" {
		return nil
	}
	var hits []*Lemma
	for i := range s.lemmas {
		l := &s.lemmas[i]
		if strings.Contains(fold(l.Word), q) {
			hits = append(hits, l)
			continue
		}
		for _, e := range l.Senses {
			if sensesContain(e.Translations[lang], q) {
				hits = append(hits, l)
				break
			}
		}
	}
	return hits
}

// Suggest is the autocomplete feed for /auto/. Like twanksta it auto-detects
// direction: a prefix match on the Prussian headword OR on any translation in
// lang.
func (s *Store) Suggest(prefix string, lang Lang, limit int) []*Lemma {
	p := fold(strings.TrimSpace(prefix))
	if p == "" {
		return nil
	}
	var hits []*Lemma
	for i := range s.lemmas {
		l := &s.lemmas[i]
		if strings.HasPrefix(fold(l.Word), p) {
			hits = append(hits, l)
			continue
		}
		for _, e := range l.Senses {
			if sensesPrefix(e.Translations[lang], p) {
				hits = append(hits, l)
				break
			}
		}
	}
	if limit > 0 && len(hits) > limit {
		hits = hits[:limit]
	}
	return hits
}

func sensesContain(senses []string, q string) bool {
	for _, sense := range senses {
		if strings.Contains(fold(sense), q) {
			return true
		}
	}
	return false
}

func sensesPrefix(senses []string, p string) bool {
	for _, sense := range senses {
		if strings.HasPrefix(fold(sense), p) {
			return true
		}
	}
	return false
}
