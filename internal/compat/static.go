package compat

import (
	"embed"
	"io/fs"
	"net/http"
)

// web holds the embedded browser harness (index.html, app.js, style.css). It is
// a stand-in for the mirrored twanksta frontend and is served at / when no
// --static dir is given. The fragment contract (/search/ /auto/ /more/) is
// unchanged — the JS just drops the returned HTML into #results, #suggest-wrap
// and .spoiler-body like the live site does.
//
//go:embed web
var web embed.FS

func (s *Server) embeddedStatic() http.Handler {
	sub, err := fs.Sub(web, "web")
	if err != nil {
		panic(err)
	}
	return http.FileServer(http.FS(sub))
}
