package fstclient

// The FST-tag <-> Slot mapping. The project's FSTs emit the SAME grammatical
// dimensions in several different tag orders — the documented inconsistency
// the slot-vocabulary exploration found:
//
//	nouns.lexc     (analyzer):   +N+Sg+Nom+Masc        (number case gender)
//	gen/astem.lexc  (noun gen):   +Sg+Nom               (gender sits on the stem)
//	adjectives.lexc (analyzer):   +Adj+Sg+Nom+Masc
//	gen/adj.lexc    (adj gen):    +Adj+Masc+Sg+Nom      (gender number case)
//	gen/adj.lexc    (part gen):   +Part+Pass+Masc+Sg+Nom / +Part+Act+...
//	verbs.lexc      (finite):     +V+Ind+Pres+P1+Sg / +V+Imp+P2+Pl / +V+Opt+P3 / +V+Subj+P3
//	verbs.lexc      (participle): +V+Part+Pres+Sg+Nom+Masc AND +V+Part+Pret+Masc+Sg+Nom
//	                            (both orders occur in the same file!)
//
// slotForTags therefore parses dimension-blind and composes the canonical
// core.Slot in core's fixed order. Normalizations applied on the way:
//
//	+Akk -> acc    known bug in symbols.lexc, rename pending; the adapter
//	                 normalizes until the FST is fixed
//	+Act -> past   the generator calls the -uns/-usis participle "+Act", the
//	                 analyzer calls it "+Pret"; both are the past.part
//	P3   -> p3     no number: 3rd person never distinguishes number
//
// Dropped as analyzer enrichment (a slot is form identity, not syntax):
//	+N +Adj +V POS markers; +Inf (the headword); +Gov* +PP* +Refl; +Card +Ord
//	+Encl; +Rel (modus relativus — corpus-only hearsay forms, no table);
//	flag diacritics @P.*@; DEAC. Anything unmappable returns ok=false — the
// caller logs and skips, because FST coverage keeps exceeding dictionary needs.

import (
	"strings"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// tagDims holds one parsed tag sequence.
type tagDims struct {
	pos      string // N, Adj, V, Pron, ...
	num      string // Sg, Pl
	kasus    string // Nom, Gen, Dat, Akk
	gender   string // Masc, Fem, Neut
	person   string // P1, P2, P3
	tense    string // Pres, Pret
	mood     string // Ind, Imp, Opt, Subj
	deg      string // Cmp, Sup
	partType string // Act, Pass (participle type; Pres/Pret ride d.tense)
	isPart   bool   // +Part seen
	isInf    bool   // +Inf seen
}

// slotForTags maps one FST tag sequence to its canonical slot. ok=false means
// the analysis carries no dictionary form (enrichment, POS marker, unknown).
//
// This is the ANALYSIS direction (tags -> slot). Generation (slot -> query, see
// queries.go) does not use it; it is retained for consuming analyzer output and
// for wiring the per-family generator transducers once those are reorganized.
func slotForTags(tags string) (core.Slot, bool) {
	var d tagDims
	for _, t := range strings.Split(tags, "+") {
		switch t {
		case "": // leading "+"
		case "Sg", "Pl":
			d.num = t
		case "Nom", "Gen", "Dat", "Akk":
			d.kasus = t
		case "Masc", "Fem", "Neut":
			d.gender = t
		case "P1", "P2", "P3":
			d.person = t
		case "Pres", "Pret":
			d.tense = t
		case "Ind", "Imp", "Opt", "Subj":
			d.mood = t
		case "Cmp", "Sup":
			d.deg = t
		case "Pass", "Act":
			d.partType = t
		case "Inf":
			d.isInf = true
		case "Part": // POS marker AND participle flag (gen/adj.lexc)
			d.pos, d.isPart = t, true
		case "N", "Adj", "V", "Pron", "Num", "Adv", "Prp", "Psp",
			"Cnj", "SCnj", "Pcl", "IJ", "PropN":
			d.pos = t
		// Analyzer enrichment: dropped, never blocks a mapping.
		case "Refl", "Card", "Ord", "Encl":
		case "GovAkk", "GovDat", "GovGen",
			"PPezze", "PPiz", "PPkīrsa", "PPna", "PPpa", "PPpas", "PPpra",
			"PPprēi", "PPprīki", "PPpēr", "PPsirzdau", "PPsēn", "PPzūrgi", "PPēn":
		default:
			// Flag diacritics (@P...@) and DEAC are expected noise; anything
			// else is unmappable — skip the whole analysis.
			if !strings.HasPrefix(t, "@") && t != "DEAC" {
				return "", false
			}
		}
	}
	return d.slot()
}

func (d tagDims) slot() (core.Slot, bool) {
	if d.isInf {
		return "", false // infinitive = headword, not a slot
	}
	if d.mood != "" {
		return d.verbSlot()
	}
	if d.isPart || d.partType != "" {
		return d.participleSlot()
	}
	if d.pos == "V" {
		return "", false // V without finite mood or participle tags
	}
	if d.pos == "Adj" || d.deg != "" {
		return d.adjSlot()
	}
	// Nouns: bare generator tags (+Sg+Nom) or analyzer tags (+N+Sg+Nom+Masc —
	// the gender there duplicates Entry.Gender and is dropped). A gender-
	// bearing declension without an +Adj marker is treated as adjectival.
	if d.kasus != "" && d.num != "" {
		if d.gender != "" && d.pos != "N" {
			return d.adjSlot()
		}
		return core.Slot(strings.ToLower(d.num) + "." + kasus[d.kasus]), true
	}
	return "", false
}

func (d tagDims) verbSlot() (core.Slot, bool) {
	switch d.mood {
	case "Opt":
		return core.MoodOpt, true // a single form (analyzer: +V+Opt+P3)
	case "Imp":
		if d.num == "" {
			return "", false
		}
		return core.Slot(core.MoodImp + "." + strings.ToLower(d.num)), true
	case "Ind", "Subj":
	default:
		return "", false
	}
	// Ind needs Pres/Pret; Subj carries its own prefix.
	var tense string
	switch {
	case d.mood == "Subj":
		tense = core.TenseSubj
	case d.tense == "Pres":
		tense = core.TensePres
	case d.tense == "Pret":
		tense = core.TensePast
	default:
		return "", false
	}
	var person string
	switch d.person {
	case "P1":
		person = core.Pers1
	case "P2":
		person = core.Pers2
	case "P3":
		person = core.Pers3
	default:
		return "", false
	}
	if person == core.Pers3 {
		return core.Slot(tense + "." + person), true // 3sg == 3pl, no number
	}
	if d.num == "" {
		return "", false
	}
	return core.Slot(tense + "." + person + "." + strings.ToLower(d.num)), true
}

func (d tagDims) participleSlot() (core.Slot, bool) {
	var typ string
	switch {
	case d.partType == "Pass":
		typ = core.PartPass
	case d.partType == "Act":
		typ = core.PartPast // +Act IS the -uns/-usis (pret) participle
	case d.tense == "Pres":
		typ = core.PartPres
	case d.tense == "Pret":
		typ = core.PartPast
	default:
		return "", false
	}
	return d.declinedSlot("part." + typ)
}

func (d tagDims) adjSlot() (core.Slot, bool) {
	var deg string
	switch d.deg {
	case "":
	case "Cmp":
		deg = core.DegCmp + "."
	case "Sup":
		deg = core.DegSup + "."
	default:
		return "", false
	}
	slot, ok := d.declinedSlot("")
	if !ok {
		return "", false
	}
	return core.Slot(deg) + slot, true
}

// declinedSlot composes {prefix.}{gender}.{number}.{case}.
func (d tagDims) declinedSlot(prefix string) (core.Slot, bool) {
	if d.kasus == "" || d.num == "" || d.gender == "" {
		return "", false
	}
	s := gender[d.gender] + "." + strings.ToLower(d.num) + "." + kasus[d.kasus]
	if prefix != "" {
		s = prefix + "." + s
	}
	return core.Slot(s), true
}

// symbol -> canonical component; +Akk renamed to acc (known bug in symbols.lexc).
var (
	kasus = map[string]string{
		"Nom": core.CaseNom, "Gen": core.CaseGen, "Dat": core.CaseDat, "Akk": core.CaseAcc,
	}
	gender = map[string]string{
		"Masc": core.GenderMasc, "Fem": core.GenderFem, "Neut": core.GenderNeut,
	}
)
