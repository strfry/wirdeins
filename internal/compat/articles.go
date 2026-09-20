package compat

import (
	"bytes"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/yuin/goldmark"
)

// handleArticle serves the optional per-lemma article articles/<slug>.md,
// rendered to HTML via goldmark. Articles are read from disk on every request
// (cheap, always current) — they are deliberately NOT cached in the store, so
// an author's edits show up immediately without a reload.
func (s *Server) handleArticle(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimPrefix(r.URL.Path, "/article/")
	if !safeSlug(slug) {
		http.NotFound(w, r)
		return
	}
	data, err := os.ReadFile(filepath.Join(s.articlesDir, slug+".md"))
	if err != nil {
		http.NotFound(w, r)
		return
	}
	var buf bytes.Buffer
	if err := goldmark.Convert(data, &buf); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write(buf.Bytes())
}

// safeSlug rejects any path that could escape the articles dir or otherwise
// address an unexpected file. Normal slugs (produced by core/migrate) contain
// no separators and no dot-dot.
func safeSlug(s string) bool {
	if s == "" || strings.ContainsAny(s, `/\`) || strings.Contains(s, "..") {
		return false
	}
	return true
}
