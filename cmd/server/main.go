// Command server wires the three layers together: the editable TOML source
// (core.Store), the FST form generator (fst.Generator), and the legacy-frontend
// adapter (compat.Server). Everything below the compat package is unaware of the
// twanksta contract.
package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/strfry/prussian-dictionary/internal/compat"
	"github.com/strfry/prussian-dictionary/internal/core"
	"github.com/strfry/prussian-dictionary/internal/fstclient"
)

func main() {
	addr := flag.String("addr", ":8080", "listen address")
	entriesDir := flag.String("entries", "entries", "editable TOML source dir")
	lexonomyDB := flag.String("lexonomy", "", "read entries from a Lexonomy dict SQLite instead of -entries (live-reloaded on change)")
	staticDir := flag.String("static", "", "mirrored twanksta frontend dir (optional)")
	articlesDir := flag.String("articles", "articles", "per-lemma article markdown dir (optional)")
	assetsDir := flag.String("assets", "assets", "static asset dir served at /assets/ (optional)")
	fstPath := flag.String("fst", "../fst/build/base.gen.hfstol", "path to base.gen.hfstol (queried via hfst-optimized-lookup)")
	flag.Parse()

	// The store comes from one of two interchangeable backends: the TOML source
	// tree, or a Lexonomy dictionary SQLite (the editor's store). Everything
	// downstream sees the same *core.Store either way.
	var (
		store *core.Store
		err   error
	)
	if *lexonomyDB != "" {
		store, err = core.LoadLexonomy(*lexonomyDB)
	} else {
		store, err = core.Load(*entriesDir)
	}
	if err != nil {
		log.Fatalf("load entries: %v", err)
	}

	gen := fstclient.New(*fstPath)
	srv := compat.NewServer(store, gen, *staticDir).
		SetArticlesDir(*articlesDir).
		SetAssetsDir(*assetsDir)

	if *lexonomyDB != "" {
		err = srv.WatchLexonomy(*lexonomyDB)
	} else {
		err = srv.Watch(*entriesDir)
	}
	if err != nil {
		log.Fatalf("watch entries: %v", err)
	}

	log.Printf("listening on %s", *addr)
	log.Fatal(http.ListenAndServe(*addr, srv.Handler()))
}
