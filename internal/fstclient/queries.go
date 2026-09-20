package fstclient

import (
	"strings"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// Query construction: canonical core.Slot -> the input string(s) base.gen (the
// twanksta full-form LUT) expects. base.gen matches tag strings LITERALLY, in
// ANALYZER order, which differs per POS — verified empirically against
// build/base.gen.hfstol:
//
//	noun            {word}+N+{Num}+{Case}+{Gender}
//	adj (positive)  {word}+Adj+{Num}+{Case}+{Gender}
//	adj (degree)    {word}+Adj+{Cmp|Sup}+{Num}+{Case}+{Gender}
//	verb finite     {word}+V+Ind+{Pres|Pret}+{Pers}[+{Num}]   (P3 has no number)
//	verb subj       {word}+V+Subj+{Pers}[+{Num}]
//	verb opt        {word}+V+Opt+P3
//	verb imp        {word}+V+Imp+P2+{Num}
//	participle      {word}+V+Part+{Pres|Pass|Pret}+ ...case/number/gender...
//
// PARTICIPLE TAG ORDER IS INCONSISTENT inside verbs.lexc: the nominatives were
// emitted as +Gender+Num+Case, the oblique cases as +Num+Case+Gender (same
// lemma, both orders present). Rather than track which slot uses which, we emit
// BOTH orders per participle slot and let the lookup answer whichever it has.
//
// Case uses +Akk (base.gen predates the +Akk->acc rename); the canonical slot
// says "acc", so the reverse maps below restore +Akk.
//
// NOTE on adverbs: adjective adverbs (e.g. begalbis -> begalbjai) DO exist in
// base.gen, but as a separate lexeme keyed on the adverb's own headword
// (begalbjai+Adv), which the adjective's query path can't reach. They are
// therefore carried as overrides by the migration, not queried here.

var (
	fstNum  = map[string]string{"sg": "Sg", "pl": "Pl"}
	fstCase = map[string]string{"nom": "Nom", "gen": "Gen", "dat": "Dat", "acc": "Akk"}
	fstGend = map[string]string{"masc": "Masc", "fem": "Fem", "neut": "Neut"}
	fstPers = map[string]string{"p1": "P1", "p2": "P2", "p3": "P3"}
)

// slotQueries returns, for every slot the entry's POS may carry, the candidate
// base.gen input string(s) that generate it (usually one; two for participles).
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

// nounQuery: p = {case, number}; gender is the entry-level fact.
func nounQuery(word, gender string, p []string) []string {
	if len(p) != 2 {
		return nil
	}
	c, n, g := fstCase[p[0]], fstNum[p[1]], fstGend[gender]
	if c == "" || n == "" || g == "" {
		return nil
	}
	return []string{word + "+N+" + n + "+" + c + "+" + g}
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
	c, n, g := fstCase[p[0]], fstNum[p[1]], fstGend[p[2]]
	if c == "" || n == "" || g == "" {
		return nil
	}
	return []string{word + "+Adj" + deg + "+" + n + "+" + c + "+" + g}
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

// participleQuery: p = {part, type, case, number, gender}. Emits both tag orders
// (see the package note on verbs.lexc's inconsistency).
func participleQuery(word string, p []string) []string {
	if len(p) != 5 {
		return nil
	}
	c, n, g := fstCase[p[2]], fstNum[p[3]], fstGend[p[4]]
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
		typ = "Pret"
	default:
		return nil
	}
	base := word + "+V+Part+" + typ + "+"
	return []string{
		base + n + "+" + c + "+" + g, // Num+Case+Gender (obliques)
		base + g + "+" + n + "+" + c, // Gender+Num+Case (nominatives)
	}
}
