package core

import "testing"

// a two-sense entry with a repeated translation and an override, in the NVH
// shape our importer emits.
const sampleNVH = `entry: abazs
  sense: noun
    gender: masc
    desc: [Abasus E 294]
    paradigm: 32
    en: cart
    de: Wagen
    lt: vežimas
    lt: ratai
    override: deiwu
      slot: sg.dat
  sense: verb
    desc: [test MK]
    en: to cart
`

func TestParseNVHEntry(t *testing.T) {
	roots := parseNVH(sampleNVH)
	if len(roots) != 1 || roots[0].Name != "entry" {
		t.Fatalf("want 1 entry root, got %d (%+v)", len(roots), roots)
	}
	l := lemmaFromNVH(roots[0])

	if l.Word != "abazs" {
		t.Errorf("word = %q, want abazs", l.Word)
	}
	if len(l.Senses) != 2 {
		t.Fatalf("senses = %d, want 2", len(l.Senses))
	}

	n := l.Senses[0]
	if n.POS != POSNoun || n.Gender != "masc" || n.Desc != "[Abasus E 294]" || n.Paradigm != "32" {
		t.Errorf("sense0 fields wrong: %+v", n)
	}
	if got := n.Translations[LangLT]; len(got) != 2 || got[0] != "vežimas" || got[1] != "ratai" {
		t.Errorf("lt translations = %v, want [vežimas ratai]", got)
	}
	if n.Translations[LangDE][0] != "Wagen" || n.Translations[LangEN][0] != "cart" {
		t.Errorf("de/en translations wrong: %v / %v", n.Translations[LangDE], n.Translations[LangEN])
	}
	if got := n.Overrides[Slot("sg.dat")]; got != "deiwu" {
		t.Errorf("override sg.dat = %q, want deiwu", got)
	}

	v := l.Senses[1]
	if v.POS != POSVerb || v.Translations[LangEN][0] != "to cart" {
		t.Errorf("sense1 wrong: %+v", v)
	}
}
