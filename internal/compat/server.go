package compat

import (
	"context"
	"net/http"
	"sync/atomic"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// Server is the legacy-frontend adapter. It owns the twanksta HTTP contract
// (/search/ /auto/ /more/ + static files) and translates it to/from core. It is
// the only package that imports net/http and emits HTML.
type Server struct {
	store atomic.Pointer[core.Store]
	gen   core.FormGenerator
	// staticDir holds the mirrored twanksta frontend (index pages, /source/*,
	// /icons/*). Served as-is; the JS talks to the handlers below.
	staticDir string
	// articlesDir holds optional per-lemma articles (articles/<slug>.md),
	// rendered to HTML on demand. Empty disables the /article/ route.
	articlesDir string
	// assetsDir holds static assets referenced by article markdown (images
	// etc.), served at /assets/.
	assetsDir string
}

func NewServer(store *core.Store, gen core.FormGenerator, staticDir string) *Server {
	s := &Server{gen: gen, staticDir: staticDir}
	s.store.Store(store)
	return s
}

// SetArticlesDir enables article serving from dir (articles/<slug>.md).
func (s *Server) SetArticlesDir(dir string) *Server { s.articlesDir = dir; return s }

// SetAssetsDir enables static asset serving at /assets/ from dir.
func (s *Server) SetAssetsDir(dir string) *Server { s.assetsDir = dir; return s }

// current returns the active store. It is read via the atomic pointer so the
// watcher can swap in a freshly loaded store without any request seeing a
// half-built index.
func (s *Server) current() *core.Store { return s.store.Load() }

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/search/", s.handleSearch)
	mux.HandleFunc("/auto/", s.handleAuto)
	mux.HandleFunc("/more/", s.handleMore)
	if s.articlesDir != "" {
		mux.HandleFunc("/article/", s.handleArticle)
	}
	if s.assetsDir != "" {
		mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir(s.assetsDir))))
	}
	if s.staticDir != "" {
		mux.Handle("/", http.FileServer(http.Dir(s.staticDir)))
	} else {
		mux.Handle("/", s.embeddedStatic())
	}
	return mux
}

// GET /search/?s=&language=&dia=  -> #results
func (s *Server) handleSearch(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	lang := parseLang(q.Get("language"))
	hits := s.current().Search(q.Get("s"), lang)

	vms := make([]resultVM, 0, len(hits))
	for _, lemma := range hits {
		for _, e := range lemma.Senses {
			vms = append(vms, resultVM{
				Word: lemma.Word, Class: string(e.Class), Gender: e.Gender, Desc: e.Desc,
				Senses:   e.Translations[lang],
				HasForms: e.POS != core.POSOther,
			})
		}
	}
	htmlFragment(w)
	if len(vms) == 0 {
		_, _ = w.Write([]byte(`<div id='search-status'>Nothing was found.</div>`))
		return
	}
	_ = searchTmpl.Execute(w, vms)
}

// GET /auto/?s=&language=&dia=  -> #suggest-wrap
func (s *Server) handleAuto(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	lang := parseLang(q.Get("language"))
	hits := s.current().Suggest(q.Get("s"), lang, 10)

	vms := make([]suggestVM, 0, len(hits))
	for _, lemma := range hits {
		vm := suggestVM{Word: lemma.Word}
		if len(lemma.Senses) > 0 {
			if senses := lemma.Senses[0].Translations[lang]; len(senses) > 0 {
				vm.First = senses[0]
			}
		}
		vms = append(vms, vm)
	}
	htmlFragment(w)
	_ = suggestTmpl.Execute(w, vms)
}

// POST /more/  body: word=&numb=&desc=  -> .spoiler-body
// We regenerate live by word (numb/dia echoed by the frontend are advisory).
// A homonym word has several senses; each is rendered as its own table, in
// source order.
func (s *Server) handleMore(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	word := r.PostForm.Get("word")
	_ = parseDialect(r.PostForm.Get("desc")) // dialect, unused until FST supports it

	senses := s.current().Lookup(word)
	htmlFragment(w)
	if len(senses) == 0 {
		return
	}
	for _, e := range senses {
		p, err := core.Generate(context.Background(), s.gen, word, e)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// Layout depends on POS; each renderer arranges the flat canonical slots
		// into its legacy table shape.
		switch e.POS {
		case core.POSNoun:
			_ = nounTableTmpl.Execute(w, nounTableVMFrom(e.Gender, p))
		case core.POSVerb:
			_ = verbTableTmpl.Execute(w, verbTableVMFrom(p))
		case core.POSAdj:
			_ = adjTableTmpl.Execute(w, adjTableVMFrom(p))
		}
	}
}

func htmlFragment(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
}
