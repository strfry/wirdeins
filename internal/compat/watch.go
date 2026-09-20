package compat

import (
	"log"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/strfry/prussian-dictionary/internal/core"
)

// Watch reloads the store whenever anything under entriesDir changes, so an
// author editing entries/*.toml sees corrections immediately. Reloads are
// debounced (rapid writes coalesce into one) and atomic: a fresh Store is built
// and swapped in via the server's atomic pointer only after it loads cleanly —
// a half-saved file leaves the previous store in place.
func (s *Server) Watch(entriesDir string) error {
	w, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}
	if err := w.Add(entriesDir); err != nil {
		_ = w.Close()
		return err
	}

	go func() {
		var timer <-chan time.Time
		for {
			select {
			case ev, ok := <-w.Events:
				if !ok {
					return
				}
				if ev.Op&(fsnotify.Write|fsnotify.Create|fsnotify.Remove|fsnotify.Rename) == 0 {
					continue
				}
				timer = time.After(200 * time.Millisecond)
			case err, ok := <-w.Errors:
				if !ok {
					return
				}
				log.Printf("watch %s: %v", entriesDir, err)
			case <-timer:
				timer = nil
				s.reload(entriesDir)
			}
		}
	}()
	return nil
}

func (s *Server) reload(entriesDir string) {
	st, err := core.Load(entriesDir)
	if err != nil {
		log.Printf("reload %s: %v", entriesDir, err)
		return
	}
	s.store.Store(st)
	log.Printf("reloaded entries from %s", entriesDir)
}
