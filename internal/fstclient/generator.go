// Package fstclient is a CLIENT/adapter to the Prussian FST — not the FST
// itself. The real morphology lives in ../fst; the built transducers live in
// ../fst/build. This package turns an entry into the exact query strings the
// generator expects, shells out to the `hfst-optimized-lookup` CLI, and maps
// the surface forms back onto the canonical core.Slot vocabulary. It implements
// the core.FormGenerator port and is the ONLY place that knows how forms are
// physically produced.
//
// Transducer: build/base.gen.hfstol — the twanksta full-form lookup table.
// It is class-agnostic (keyed on lemma+tags) and complete across POS, so this
// step needs no per-family/stem transducers (those are being reorganized).
// Where base.gen has no form for a query it emits a "+?" line; we treat that as
// "not covered" (empty), and overrides / honest blanks take over.
//
// One `hfst-optimized-lookup` process is spawned per /more/ request, batching
// all of an entry's queries through a single stdin/stdout round-trip. The C
// tool starts in milliseconds; if this ever shows up in profiles, a warm
// long-lived process speaking the same line protocol is a drop-in replacement.
package fstclient

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"strings"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// Generator implements core.FormGenerator by calling hfst-optimized-lookup.
type Generator struct {
	fstPath string // path to base.gen.hfstol
	tool    string // lookup binary, normally "hfst-optimized-lookup" on PATH
}

// New builds a generator that queries the transducer at fstPath.
func New(fstPath string) *Generator {
	return &Generator{fstPath: fstPath, tool: "hfst-optimized-lookup"}
}

var _ core.FormGenerator = (*Generator)(nil)

// Generate builds every base.gen query the entry's POS implies, runs them in one
// lookup call, and returns the covered forms keyed by canonical slot. Uncovered
// slots are simply absent from the result (honest gaps, not stubs).
func (g *Generator) Generate(ctx context.Context, word string, e *core.Entry) (core.Paradigm, error) {
	sq := slotQueries(word, e)
	if len(sq) == 0 {
		return core.Paradigm{}, nil
	}

	seen := map[string]bool{}
	queries := make([]string, 0, len(sq))
	for _, cands := range sq {
		for _, q := range cands {
			if !seen[q] {
				seen[q] = true
				queries = append(queries, q)
			}
		}
	}

	res, err := g.lookup(ctx, queries)
	if err != nil {
		return nil, err
	}

	out := core.Paradigm{}
	for slot, cands := range sq {
		for _, q := range cands { // first candidate order that resolves wins
			if forms := res[q]; len(forms) > 0 {
				out[slot] = strings.Join(forms, " / ") // free variants, twanksta-style
				break
			}
		}
	}
	return out, nil
}

// lookup runs the queries through `hfst-optimized-lookup -q <fst>` (quiet: no
// weight column) and parses the result. Input: one query per line on stdin.
// Output per line: "input<TAB>surface" for a real form, or
// "input<TAB>input<TAB>+?" when the transducer has no form — the "+?" third
// field is the discriminator (a real form may legitimately equal the input).
func (g *Generator) lookup(ctx context.Context, queries []string) (map[string][]string, error) {
	cmd := exec.CommandContext(ctx, g.tool, "-q", g.fstPath)
	cmd.Stdin = strings.NewReader(strings.Join(queries, "\n") + "\n")
	var stdout, stderr bytes.Buffer
	cmd.Stdout, cmd.Stderr = &stdout, &stderr
	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("%s %s: %w: %s", g.tool, g.fstPath, err, strings.TrimSpace(stderr.String()))
	}
	return parseLookup(stdout.String()), nil
}

func parseLookup(s string) map[string][]string {
	res := map[string][]string{}
	for _, line := range strings.Split(s, "\n") {
		line = strings.TrimRight(line, "\r")
		if line == "" {
			continue
		}
		f := strings.Split(line, "\t")
		if len(f) < 2 {
			continue
		}
		if len(f) >= 3 && f[2] == "+?" { // uncovered input
			continue
		}
		res[f[0]] = append(res[f[0]], f[1])
	}
	return res
}
