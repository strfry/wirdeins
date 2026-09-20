package core

import "testing"

// The canonical inventories are pinned: counts, spot members, uniqueness.
// These are the shared key space for FST output and TOML overrides — changing
// them is a data-format change, not a refactor.
func TestSlotInventories(t *testing.T) {
	if len(NounSlots) != 8 {
		t.Errorf("NounSlots = %d, want 8", len(NounSlots))
	}
	if len(AdjSlots) != 75 {
		t.Errorf("AdjSlots = %d, want 75 (3 degrees x 24 + 3 adverbs)", len(AdjSlots))
	}
	if len(VerbSlots) != 18 {
		t.Errorf("VerbSlots = %d, want 18 (3 tenses x 5 + opt + 2 imp)", len(VerbSlots))
	}
	if len(ParticipleSlots) != 72 {
		t.Errorf("ParticipleSlots = %d, want 72 (3 types x 24)", len(ParticipleSlots))
	}

	member := func(slots []Slot, want Slot) bool {
		for _, s := range slots {
			if s == want {
				return true
			}
		}
		return false
	}
	for _, s := range []Slot{
		"nom.sg", "acc.pl", // nouns
		"nom.sg.masc", "cmp.nom.sg.masc", "sup.acc.pl.neut", "adv", "adv.cmp", "adv.sup", // adj
		"pres.p1.sg", "pres.p3", "past.p2.pl", "subj.p3", "opt", "imp.sg", "imp.pl", // verbs
		"part.pres.nom.sg.masc", "part.past.nom.sg.neut", "part.pass.dat.pl.fem", // participles
	} {
		if !member(SlotsFor(POSNoun), s) && !member(SlotsFor(POSAdj), s) && !member(SlotsFor(POSVerb), s) {
			t.Errorf("slot %q missing from every inventory", s)
		}
	}

	// The p3 slots must carry no number; degrees never collide with participles.
	for _, bad := range []Slot{"pres.p3.sg", "cmp.part.nom.sg.masc", "nom.sg.masc.masc"} {
		if member(SlotsFor(POSVerb), bad) || member(SlotsFor(POSAdj), bad) {
			t.Errorf("slot %q unexpectedly in inventory", bad)
		}
	}

	seen := map[Slot]bool{}
	for _, inv := range [][]Slot{NounSlots, AdjSlots, VerbSlots, ParticipleSlots} {
		for _, s := range inv {
			if seen[s] {
				t.Errorf("slot %q appears in more than one inventory", s)
			}
			seen[s] = true
		}
	}
}

// Fixture entries (and later, every parsed entries/*.toml) must only use
// slots their POS actually has.
func TestFixtureOverridesUseCanonicalSlots(t *testing.T) {
	s, err := Load("testdata/entries")
	if err != nil {
		t.Fatal(err)
	}
	for word, senses := range s.byWord {
		for _, e := range senses {
			valid := map[Slot]bool{}
			for _, s := range SlotsFor(e.POS) {
				valid[s] = true
			}
			for slot := range e.Overrides {
				if !valid[slot] {
					t.Errorf("%s (%s): override slot %q not in the %s inventory", word, e.POS, slot, e.POS)
				}
			}
		}
	}
}
