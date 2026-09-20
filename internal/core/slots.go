package core

// The canonical Slot inventory. This file is the single source of truth for
// the key space shared by FST output and per-entry Overrides (entries/*.toml).
// It is deliberately written as deterministic cross-products in fixed order so
// the enumeration is checkable (see fst/tags_test.go for the FST-tag side and
// compat tests for the legacy-layout side).
//
// Naming rules:
//
//	noun       {case}.{number}                     — gender is an entry-level
//	                                                 fact (Entry.Gender), not a
//	                                                 slot dimension
//	adj        {case}.{number}.{gender}            — positive degree, bare
//	           cmp.{case}.{number}.{gender}        — comparative declines fully
//	           sup.{case}.{number}.{gender}        — so does the superlative
//	           adv / adv.cmp / adv.sup             — adverb degrees
//	verb       {pres|past|subj}.{p1.sg|p2.sg|p3|p1.pl|p2.pl}
//	                                                 — flat: Pres/Pret are
//	                                                 indicative, Subjunctive has
//	                                                 its own tense-like prefix;
//	                                                 p3 carries no number: 3rd
//	                                                 person never distinguishes
//	                                                 number (FST tags agree)
//	           opt                                 — a single form
//	           imp.sg / imp.pl                     — 2nd person only
//	participle part.{pres|past|pass}.{case}.{number}.{gender}
//	                                                 — one shared "part." prefix
//	                                                 keeps participles out of the
//	                                                 finite prefix space (past.p1
//	                                                 vs part.past.*); they decline
//	                                                 like adjectives (24 each)
//
// Deliberately NOT slots:
//
//	infinitive   the headword itself
//	Perfect/Fut. periphrastic; composed at render time from the aux paradigm
//	             (compat constants) + number/gender-agreeing past.part nominative
//	government   +GovAkk/+GovDat/+GovGen, +PP*, +Refl are analyzer enrichment;
//	             for the dictionary they live in Desc (later: an explicit TOML
//	             field when the cg3 resolver needs them)
//
// Canonical component order inside a slot is fixed; the FST adapter normalizes
// the project's several tag orderings onto it (see internal/fstclient/tags.go).

// Slot components. fst maps the FST multichar symbols onto exactly these.
const (
	NumSg = "sg"
	NumPl = "pl"

	CaseNom = "nom"
	CaseGen = "gen"
	CaseDat = "dat"
	CaseAcc = "acc" // FST still says +Akk; the adapter renames (known bug)

	GenderMasc = "masc"
	GenderFem  = "fem"
	GenderNeut = "neut"

	TensePres = "pres"
	TensePast = "past" // the -uns participle type; FST generator calls it +Act
	TenseSubj = "subj"

	MoodOpt = "opt"
	MoodImp = "imp"

	Pers1 = "p1"
	Pers2 = "p2"
	Pers3 = "p3"

	DegCmp = "cmp"
	DegSup = "sup"
	DegAdv = "adv"

	PartPres = "pres"
	PartPast = "past"
	PartPass = "pass"
)

// canonical component orders.
var (
	slotCases    = []string{CaseNom, CaseGen, CaseDat, CaseAcc}
	slotNumbers  = []string{NumSg, NumPl}
	slotGenders  = []string{GenderMasc, GenderFem, GenderNeut}
	slotTenses   = []string{TensePres, TensePast, TenseSubj}
	slotPersNums = []struct{ Person, Number string }{ // p3 has no number
		{Pers1, NumSg}, {Pers2, NumSg}, {Pers3, ""}, {Pers1, NumPl}, {Pers2, NumPl},
	}
)

// declined returns case.number[.gender] in canonical order.
func declined(gender string) []Slot {
	var out []Slot
	for _, c := range slotCases {
		for _, n := range slotNumbers {
			s := Slot(c + "." + n)
			if gender != "" {
				s += "." + Slot(gender)
			}
			out = append(out, s)
		}
	}
	return out
}

// NounSlots: 4 cases x 2 numbers. Gender is Entry.Gender, not a slot.
var NounSlots = declined("")

// AdjSlots: the full adjective paradigm as twanksta stores it — positive,
// comparative and superlative each decline in 3 genders x 4 cases x 2 numbers,
// plus the three adverb degrees. (cmp/sup are NOT single forms.)
var AdjSlots = func() []Slot {
	var out []Slot
	for _, deg := range []string{"", DegCmp + ".", DegSup + "."} {
		for _, g := range slotGenders {
			for _, s := range declined(g) {
				out = append(out, Slot(deg)+s)
			}
		}
	}
	adv := []string{DegAdv, DegAdv + "." + DegCmp, DegAdv + "." + DegSup}
	for _, a := range adv {
		out = append(out, Slot(a))
	}
	return out
}()

// VerbSlots: synthetic finite forms. Periphrastic Perfect/Future are composed
// at render time, so they have no slots here.
var VerbSlots = func() []Slot {
	var out []Slot
	for _, t := range slotTenses {
		for _, pn := range slotPersNums {
			s := Slot(t + "." + pn.Person)
			if pn.Number != "" {
				s += "." + Slot(pn.Number)
			}
			out = append(out, s)
		}
	}
	out = append(out, MoodOpt, MoodImp+"."+NumSg, MoodImp+"."+NumPl)
	return out
}()

// ParticipleSlots: pres/past/pass participles, each a full 3-gender
// declension. The past participle is what the periphrastic tenses agree with.
var ParticipleSlots = func() []Slot {
	var out []Slot
	for _, t := range []string{PartPres, PartPast, PartPass} {
		for _, g := range slotGenders {
			for _, c := range slotCases {
				for _, n := range slotNumbers {
					out = append(out, Slot("part."+t+"."+c+"."+n+"."+g))
				}
			}
		}
	}
	return out
}()

// SlotsFor returns the slot inventory a POS may draw on. Used to validate
// Overrides when loading entries/*.toml (unknown-slot = data error).
func SlotsFor(pos POS) []Slot {
	switch pos {
	case POSNoun:
		return NounSlots
	case POSAdj:
		return AdjSlots
	case POSVerb:
		return append(append([]Slot{}, VerbSlots...), ParticipleSlots...)
	}
	return nil
}
