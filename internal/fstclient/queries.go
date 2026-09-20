package fstclient

import (
	"strings"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// Query construction: canonical core.Slot -> the base.gen input string. base.gen
// (the twanksta full-form LUT) matches tag strings LITERALLY. It was rebuilt with
// ONE consistent component order per POS (gender-first for nominal declension),
// so each slot maps to exactly one query — verified empirically against
// build/base.gen.hfstol:
//
//	noun            {word}+N+{Gender}+{Num}+{Case}
//	adj (positive)  {word}+Adj+{Gender}+{Num}+{Case}
//	adj (degree)    {word}+Adj+{Cmp|Sup}+{Gender}+{Num}+{Case}
//	verb finite     {word}+V+Ind+{Pres|Pret}+{Pers}[+{Num}]   (P3 has no number)
//	verb subj       {word}+V+Subj+{Pers}[+{Num}]
//	verb opt        {word}+V+Opt+P3
//	verb imp        {word}+V+Imp+P2+{Num}
//	participle      {word}+V+Part+{Pres|Past|Pass}+{Gender}+{Num}+{Case}
//
// Case uses +Acc; the canonical slot says "acc", so the reverse maps below
// restore +Acc.
//
// NOTE on adverbs: adjective adverbs (e.g. begalbis -> begalbjai) DO exist in
// base.gen, but as a separate lexeme keyed on the adverb's own headword
// (begalbjai+Adv), which the adjective's query path can't reach. They are
// therefore carried as overrides by the migration, not queried here.

var (
	fstNum  = map[string]string{"sg": "Sg", "pl": "Pl"}
	fstCase = map[string]string{"nom": "Nom", "gen": "Gen", "dat": "Dat", "acc": "Acc"}
	fstGend = map[string]string{"masc": "Masc", "fem": "Fem", "neut": "Neut"}
	fstPers = map[string]string{"p1": "P1", "p2": "P2", "p3": "P3"}
)

// slotQueries returns, for every slot the entry's POS may carry, the base.gen
// input string that generates it (exactly one per slot).
func slotQueries(word string, e *core.Entry) map[core.Slot][]string {
	out := map[core.Slot][]string{}
	for _, s := range core.SlotsFor(e.POS) {
		if qs := queryForSlot(word, e.POS, e.Gender, s); len(qs) > 0 {
			out[s] = qs
		}
	}
	return out
}

func queryForSlot(word string, pos core.POS, gender string, slot core.Slot) []string {
	p := strings.Split(string(slot), ".")
	switch pos {
	case core.POSNoun:
		return nounQuery(word, gender, p)
	case core.POSAdj:
		return adjQuery(word, p)
	case core.POSVerb:
		return verbQuery(word, p)
	}
	return nil
}

// nounQuery: p = {number, case}; gender is the entry-level fact.
func nounQuery(word, gender string, p []string) []string {
	if len(p) != 2 {
		return nil
	}
	n, c, g := fstNum[p[0]], fstCase[p[1]], fstGend[gender]
	if c == "" || n == "" || g == "" {
		return nil
	}
	return []string{word + "+N+" + g + "+" + n + "+" + c}
}

// adjQuery handles positive/comparative/superlative declension. (Adverbs are
// overrides, see the package note.)
func adjQuery(word string, p []string) []string {
	if p[0] == "adv" {
		return nil
	}
	deg := ""
	if p[0] == "cmp" || p[0] == "sup" {
		if p[0] == "cmp" {
			deg = "+Cmp"
		} else {
			deg = "+Sup"
		}
		p = p[1:]
	}
	if len(p) != 3 {
		return nil
	}
	g, n, c := fstGend[p[0]], fstNum[p[1]], fstCase[p[2]]
	if c == "" || n == "" || g == "" {
		return nil
	}
	return []string{word + "+Adj" + deg + "+" + g + "+" + n + "+" + c}
}

// verbQuery handles finite forms and the three participle declensions.
func verbQuery(word string, p []string) []string {
	switch p[0] {
	case "part":
		return participleQuery(word, p)
	case "opt":
		return []string{word + "+V+Opt+P3"}
	case "imp":
		if len(p) != 2 {
			return nil
		}
		if n := fstNum[p[1]]; n != "" {
			return []string{word + "+V+Imp+P2+" + n}
		}
		return nil
	}
	// finite indicative/subjunctive: {tense, person[, number]}
	var moodTense string
	switch p[0] {
	case "pres":
		moodTense = "Ind+Pres"
	case "past":
		moodTense = "Ind+Pret"
	case "subj":
		moodTense = "Subj"
	default:
		return nil
	}
	if len(p) < 2 {
		return nil
	}
	pers := fstPers[p[1]]
	if pers == "" {
		return nil
	}
	q := word + "+V+" + moodTense + "+" + pers
	if len(p) == 3 { // p1/p2 carry a number; p3 does not
		n := fstNum[p[2]]
		if n == "" {
			return nil
		}
		q += "+" + n
	}
	return []string{q}
}

// participleQuery: p = {part, type, gender, number, case}.
func participleQuery(word string, p []string) []string {
	if len(p) != 5 {
		return nil
	}
	g, n, c := fstGend[p[2]], fstNum[p[3]], fstCase[p[4]]
	if c == "" || n == "" || g == "" {
		return nil
	}
	var typ string
	switch p[1] {
	case "pres":
		typ = "Pres"
	case "pass":
		typ = "Pass"
	case "past":
		typ = "Past"
	default:
		return nil
	}
	return []string{word + "+V+Part+" + typ + "+" + g + "+" + n + "+" + c}
}
