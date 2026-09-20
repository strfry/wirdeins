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
	staticDir := flag.String("static", "", "mirrored twanksta frontend dir (optional)")
	articlesDir := flag.String("articles", "articles", "per-lemma article markdown dir (optional)")
	assetsDir := flag.String("assets", "assets", "static asset dir served at /assets/ (optional)")
	fstPath := flag.String("fst", "../fst/build/base.gen.hfstol", "path to base.gen.hfstol (queried via hfst-optimized-lookup)")
	flag.Parse()

	store, err := core.Load(*entriesDir)
	if err != nil {
		log.Fatalf("load entries: %v", err)
	}

	gen := fstclient.New(*fstPath)
	srv := compat.NewServer(store, gen, *staticDir).
		SetArticlesDir(*articlesDir).
		SetAssetsDir(*assetsDir)

	if err := srv.Watch(*entriesDir); err != nil {
		log.Fatalf("watch entries: %v", err)
	}

	log.Printf("listening on %s", *addr)
	log.Fatal(http.ListenAndServe(*addr, srv.Handler()))
}
