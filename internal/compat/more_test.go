package compat

import (
	"net/http/httptest"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"testing"

	"github.com/strfry/prussian-dictionary/internal/core"
	"github.com/strfry/prussian-dictionary/internal/fstclient"
)

// fstGenPath resolves the base.gen.hfstol transducer for the integration test
// and skips (rather than fails) when the FST toolchain/artifact is unavailable,
// so the suite still runs in environments without the built FST.
func fstGenPath(t *testing.T) string {
	if _, err := exec.LookPath("hfst-optimized-lookup"); err != nil {
		t.Skip("hfst-optimized-lookup not on PATH")
	}
	p := os.Getenv("PRUSSIAN_FST_GEN")
	if p == "" {
		p = filepath.Join("..", "..", "..", "fst", "build", "base.gen.hfstol")
	}
	if _, err := os.Stat(p); err != nil {
		t.Skipf("base.gen.hfstol not found at %s (set PRUSSIAN_FST_GEN)", p)
	}
	return p
}

// TestMoreMatchesLiveFragments renders /more/ for one entry per POS and
// compares against fragments captured from the live site
// (testdata/more-*.html). The live fragments contain DB-junk whitespace
// (trailing spaces/tabs inside spans, newlines inside composed forms) and
// PHP's htmlspecialchars slash entities; normalize() neutralizes exactly that
// so the comparison is about elements, classes, and text content.
//
// normalize is intentionally STRUCTURAL, not byte-exact: it collapses whitespace
// and strips spaces around tags. It proves element/class/text equivalence with
// the live site (verified for numb 36/136/27), not byte fidelity — a pure
// whitespace reformat of a template would not be caught here.
func TestMoreMatchesLiveFragments(t *testing.T) {
	store, err := core.Load("../core/testdata/entries")
	if err != nil {
		t.Fatal(err)
	}
	srv := NewServer(store, fstclient.New(fstGenPath(t)), "")

	cases := []struct{ word, fixture string }{
		{"Dēiws", "testdata/more-noun-deiws.html"},
		{"kalbītwei", "testdata/more-verb-kalbitwei.html"},
		{"begalbis", "testdata/more-adj-begalbis.html"},
	}
	for _, tc := range cases {
		t.Run(tc.word, func(t *testing.T) {
			form := url.Values{"word": {tc.word}, "numb": {"1"}, "desc": {""}}
			req := httptest.NewRequest("POST", "/more/", strings.NewReader(form.Encode()))
			req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
			rec := httptest.NewRecorder()
			srv.Handler().ServeHTTP(rec, req)

			wantRaw, err := os.ReadFile(tc.fixture)
			if err != nil {
				t.Fatal(err)
			}
			want, got := normalize(string(wantRaw)), normalize(rec.Body.String())
			if got != want {
				t.Errorf("rendered /more/ for %s diverges from %s\nfirst diff:\n%s",
					tc.word, tc.fixture, firstDiff(want, got))
			}
		})
	}
}

var (
	wsRe   = regexp.MustCompile(`\s+`)
	spcRe1 = regexp.MustCompile(`> `)
	spcRe2 = regexp.MustCompile(` <`)
)

func normalize(s string) string {
	s = strings.ReplaceAll(s, "&#47;", "/") // PHP htmlspecialchars slash entity
	s = wsRe.ReplaceAllString(s, " ")
	s = spcRe1.ReplaceAllString(s, ">")
	s = spcRe2.ReplaceAllString(s, "<")
	return strings.TrimSpace(s)
}

// firstDiff prints a context window around the first differing byte.
func firstDiff(want, got string) string {
	i := 0
	for i < len(want) && i < len(got) && want[i] == got[i] {
		i++
	}
	lo, hi := i-120, i+120
	if lo < 0 {
		lo = 0
	}
	w := "... " + want[lo:min(hi, len(want))] + " ..."
	g := "... " + got[lo:min(hi, len(got))] + " ..."
	return "want: " + w + "\n got: " + g
}
