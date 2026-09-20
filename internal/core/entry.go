// Package core holds the frontend-agnostic domain: the editable dictionary
// source (one TOML file per lemma), lookup/search, and the port through which
// inflected forms are produced. Nothing in here knows about the legacy
// twanksta HTTP contract or its HTML — that lives entirely in internal/compat.
package core

// Lang is a translation target language, in our own stable codes (ISO-ish),
// NOT the legacy "engl/miks/leit/..." wire codes. The compat adapter maps
// between the two.
type Lang string

const (
	LangEN Lang = "en"
	LangDE Lang = "de"
	LangLT Lang = "lt"
	LangLV Lang = "lv"
	LangPL Lang = "pl"
	LangRU Lang = "ru"
)

// POS is the part of speech; it selects how the compat layer arranges a
// Paradigm into a table, and constrains which Slots are meaningful.
type POS string

const (
	POSNoun  POS = "noun"
	POSVerb  POS = "verb"
	POSAdj   POS = "adj"
	POSOther POS = "other" // adverbs, particles, MWEs — no inflection table
)

// Class is the transparent inflection class, e.g. "astem-a", "istem", or the
// escape hatch "irregular". It replaces twanksta's opaque paradigm number.
// core hands it verbatim to the FormGenerator; the FST decides what it means.
type Class string

const ClassIrregular Class = "irregular"

// Slot is the canonical identity of a single inflected form, e.g. "sg.nom",
// "pl.gen", "masc.sg.nom", "past.p1.pl", "part.pres.masc.sg.nom". This
// vocabulary is the shared key space between FST output and per-entry Overrides;
// the full inventory and naming rules live in slots.go (the single source of
// truth), and FST tags round-trip onto it via internal/fstclient/tags.go.
type Slot string

// Lemma is one dictionary headword and its homonym senses. It is the unit of
// storage (one entries/<slug>.toml file) and of lookup identity: a word with
// several POS/meanings is one Lemma with several Senses, ordered as in the
// source. Array position IS sense identity — there is deliberately no hom
// number, because no external referent needs a stable sense ID yet.
type Lemma struct {
	Word   string  `toml:"word"`
	Senses []Entry `toml:"sense"`
}

// Entry is one editable dictionary sense — a single homonym of a Lemma. Only
// curated facts live here; inflected forms are NOT stored, they are generated
// (except Overrides). The headword lives on the wrapping Lemma, not here.
type Entry struct {
	POS    POS    `toml:"pos"`              // "noun" | "verb" | "adj" | "other"
	Class  Class  `toml:"class,omitempty"`  // transparent inflection class, or "irregular"
	Gender string `toml:"gender,omitempty"` // "masc" | "fem" | "neut" | "" — for nouns/adjs
	Desc   string `toml:"desc,omitempty"`   // attestation / citation, e.g. "[Deiws 37]"
	Audio  string `toml:"audio,omitempty"`  // optional audio ref
	// Paradigm is the raw twanksta paradigm number (e.g. "36"), preserved as
	// provenance from the migration. It is NOT used yet — base.gen is class-
	// agnostic — but it is the key for the future per-family generator mapping.
	Paradigm string `toml:"paradigm,omitempty"`
	// Translations: target language -> ordered senses.
	Translations map[Lang][]string `toml:"translations,omitempty"`
	// Overrides: canonical slot -> surface form. Wins over FST output when
	// merging. For a fully irregular entry, the complete table lives here.
	Overrides map[Slot]string `toml:"overrides,omitempty"`
}

// Paradigm is a flat, generated set of forms keyed by canonical slot. core
// produces it (FST + override merge) without knowing how it will be laid out;
// the compat adapter arranges known slots into the legacy HTML table.
type Paradigm map[Slot]string
