package fstclient

import "testing"

// Real tag sequences as they occur in the project's FST sources (fst/lexc/*.lexc
// analyzers and fst/gen/*.lexc generators) — including the two participle tag
// orders that coexist in verbs.lexc.
func TestSlotForTags(t *testing.T) {
	tests := []struct {
		tags string
		want string // canonical slot, "" for ignorable/unmappable
	}{
		// nouns.lexc analyzer: +N+number+case+gender (gender dropped for nouns)
		{"+N+Sg+Nom+Masc", "nom.sg"},
		{"+N+Pl+Nom+Masc", "nom.pl"},
		{"+N+Sg+Akk+Neut", "acc.sg"},
		{"+N+Pl+Dat+Fem", "dat.pl"},
		// gen/astem.lexc noun generator: bare +number+case
		{"+Sg+Nom", "nom.sg"},
		{"+Sg+Akk", "acc.sg"}, // +Akk -> acc rename (known bug)
		{"+Pl+Dat", "dat.pl"},
		// adjectives.lexc analyzer: +Adj+number+case+gender
		{"+Adj+Sg+Nom+Masc", "nom.sg.masc"},
		{"+Adj+Pl+Akk+Fem", "acc.pl.fem"},
		// gen/adj.lexc adjective generator: +Adj+gender+number+case
		{"+Adj+Masc+Sg+Nom", "nom.sg.masc"},
		{"+Adj+Neut+Pl+Akk", "acc.pl.neut"},
		// participle generator tags: +Part+{Act,Pass}+gender+number+case
		{"+Part+Pass+Masc+Sg+Nom", "part.pass.nom.sg.masc"},
		{"+Part+Pass+Neut+Pl+Dat", "part.pass.dat.pl.neut"},
		{"+Part+Act+Masc+Sg+Nom", "part.past.nom.sg.masc"}, // +Act = pret participle
		{"+Part+Act+Fem+Pl+Akk", "part.past.acc.pl.fem"},
		// verbs.lexc participle analyzer, order variant 1: +V+Part+Pres+number+case+gender
		{"+V+Part+Pres+Sg+Nom+Masc", "part.pres.nom.sg.masc"},
		{"+V+Part+Pass+Pl+Akk+Neut", "part.pass.acc.pl.neut"},
		// verbs.lexc participle analyzer, order variant 2: +V+Part+Pret+gender+number+case
		{"+V+Part+Pret+Masc+Sg+Nom", "part.past.nom.sg.masc"},
		{"+V+Part+Pret+Neut+Sg+Nom", "part.past.nom.sg.neut"},
		// finite verbs: +V+mood(+tense)+person+number
		{"+V+Ind+Pres+P1+Sg", "pres.p1.sg"},
		{"+V+Ind+Pres+P2+Pl", "pres.p2.pl"},
		{"+V+Ind+Pres+P3", "pres.p3"}, // no number: 3sg == 3pl
		{"+V+Ind+Pret+P1+Pl", "past.p1.pl"},
		{"+V+Ind+Pret+P3", "past.p3"},
		{"+V+Imp+P2+Sg", "imp.sg"},
		{"+V+Imp+P2+Pl", "imp.pl"},
		{"+V+Opt+P3", "opt"},
		{"+V+Subj+P1+Sg", "subj.p1.sg"},
		{"+V+Subj+P3", "subj.p3"},
		// analyzer enrichment tags must not block the mapping
		{"+V+Imp+P2+Pl+GovAkk", "imp.pl"},
		{"+V+Imp+P2+Sg+Refl", "imp.sg"},
		{"+V+Imp+P2+Pl+PPēn+GovDat", "imp.pl"},
		{"+V+Ind+Pres+P1+Sg+PPezze", "pres.p1.sg"},
		{"+V+Ind+Pres+P1+Sg+Refl+GovDat", "pres.p1.sg"},
		// ignorable / unmappable
		{"+V+Inf", ""},                  // headword covers the infinitive
		{"+V+Rel+P3", ""},               // modus relativus: corpus-only, no table
		{"+V+Imp+P2+Sg+Encl", "imp.sg"}, // enclitic subject pronoun: same form identity
		{"@P.standard.prusaspira@", ""},
		{"DEAC", ""},
		{"+GovAkk", ""},
		{"+WTF", ""},
		{"", ""},
	}
	for _, tt := range tests {
		if got, ok := slotForTags(tt.tags); string(got) != tt.want || (tt.want != "") != ok {
			t.Errorf("slotForTags(%q) = (%q, %v), want (%q, %v)", tt.tags, got, ok, tt.want, tt.want != "")
		}
	}
}
