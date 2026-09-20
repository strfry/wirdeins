package core

import "context"

// FormGenerator is the port for producing inflected forms. The FST adapter
// (internal/fstclient) implements it; core depends only on this interface, so the
// generation mechanism (hfst CLI, sidecar, in-process) is swappable.
//
// Per the design decision, forms are generated LIVE per /more/ request rather
// than precomputed — editing an entry's TOML takes effect immediately with no
// build step.
type FormGenerator interface {
	// Generate returns every form the FST can produce for the entry, keyed by
	// canonical Slot. It reads only word/POS/Gender (not Overrides): applying
	// overrides is core's job (see Generate below), so the FST stays a pure
	// morphology source. Slots the FST cannot cover are simply absent. The
	// headword is passed separately because it lives on the Lemma, not the Entry.
	Generate(ctx context.Context, word string, e *Entry) (Paradigm, error)
}

// Generate produces the final paradigm for an entry: FST forms first, then
// per-entry overrides layered on top. This is the whole "merge rule" and it is
// deliberately trivial and transparent.
//
// POSOther has no inflection table. A ClassIrregular entry skips the FST
// entirely and trusts its Overrides alone — the escape hatch for suppletive
// words where FST output would be wrong rather than merely incomplete.
func Generate(ctx context.Context, g FormGenerator, word string, e *Entry) (Paradigm, error) {
	out := Paradigm{}
	if e.POS != POSOther && e.Class != ClassIrregular {
		base, err := g.Generate(ctx, word, e)
		if err != nil {
			return nil, err
		}
		for slot, form := range base {
			out[slot] = form
		}
	}
	for slot, form := range e.Overrides { // overrides win
		out[slot] = form
	}
	return out, nil
}
