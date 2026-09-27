// Command lexload proves that the core Store can be built directly from a
// Lexonomy dictionary SQLite (core.LoadLexonomy) instead of the entries/*.toml
// tree, and that Lookup/Search run unchanged on the result. It is an evaluation
// harness, not part of the server.
//
//	go run ./cmd/lexload [path/to/prussian.sqlite]
package main

import (
	"flag"
	"fmt"
	"log"
	"sort"

	"github.com/strfry/prussian-dictionary/internal/core"
)

func main() {
	db := flag.String("db", "../lexonomy/run/data/dicts/prussian.sqlite",
		"path to a Lexonomy dictionary SQLite")
	flag.Parse()

	s, err := core.LoadLexonomy(*db)
	if err != nil {
		log.Fatalf("LoadLexonomy: %v", err)
	}
	fmt.Printf("loaded %d lemmas from %s\n\n", s.Len(), *db)

	// 1) exact lookup of the seeded entry, showing the parsed override.
	fmt.Println("== Lookup(\"Adwēnts\") ==")
	for _, e := range s.Lookup("Adwēnts") {
		fmt.Printf("  pos=%s gender=%s paradigm=%s desc=%q\n",
			e.POS, e.Gender, e.Paradigm, e.Desc)
		fmt.Printf("    de=%v en=%v\n", e.Translations[core.LangDE], e.Translations[core.LangEN])
		if len(e.Overrides) > 0 {
			slots := make([]string, 0, len(e.Overrides))
			for sl := range e.Overrides {
				slots = append(slots, string(sl))
			}
			sort.Strings(slots)
			for _, sl := range slots {
				fmt.Printf("    override %s = %q\n", sl, e.Overrides[core.Slot(sl)])
			}
		}
	}

	// 2) diacritic-folded search by a German translation, direction auto-detected.
	fmt.Println("\n== Search(\"Wagen\", de) (first 5) ==")
	hits := s.Search("Wagen", core.LangDE)
	for i, l := range hits {
		if i >= 5 {
			fmt.Printf("  ... and %d more\n", len(hits)-5)
			break
		}
		fmt.Printf("  %s -> de=%v\n", l.Word, l.Senses[0].Translations[core.LangDE])
	}

	// 3) prefix autocomplete.
	fmt.Println("\n== Suggest(\"deiw\", en, 5) ==")
	for _, l := range s.Suggest("deiw", core.LangEN, 5) {
		fmt.Printf("  %s\n", l.Word)
	}
}
