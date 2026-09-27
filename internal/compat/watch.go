package compat

import (
	"log"
	"path/filepath"
	"strings"
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
	s.runWatch(w, entriesDir, func(string) bool { return true },
		func() { s.reload(entriesDir) })
	return nil
}

// WatchLexonomy is the Watch twin for the Lexonomy SQLite backend: it reloads
// the store whenever the dictionary database file changes, so an edit saved in
// the Lexonomy editor appears in this frontend within one debounce interval.
// fsnotify watches the containing directory (SQLite in "delete" journal mode
// rewrites the db file in place and creates/removes a sibling -journal file);
// events are filtered to that db file and its journal/WAL companions.
func (s *Server) WatchLexonomy(dbPath string) error {
	w, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}
	dir := filepath.Dir(dbPath)
	if err := w.Add(dir); err != nil {
		_ = w.Close()
		return err
	}
	base := filepath.Base(dbPath)
	s.runWatch(w, dbPath,
		func(name string) bool { return strings.HasPrefix(filepath.Base(name), base) },
		func() { s.reloadLexonomy(dbPath) })
	return nil
}

// runWatch is the shared debounced event loop: on any accepted event it arms a
// 200ms timer (coalescing bursts), and on expiry runs reload. want filters which
// events a backend cares about; name is used only for error logging.
func (s *Server) runWatch(w *fsnotify.Watcher, name string, want func(string) bool, reload func()) {
	go func() {
		defer w.Close()
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
				if !want(ev.Name) {
					continue
				}
				timer = time.After(200 * time.Millisecond)
			case err, ok := <-w.Errors:
				if !ok {
					return
				}
				log.Printf("watch %s: %v", name, err)
			case <-timer:
				timer = nil
				reload()
			}
		}
	}()
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

func (s *Server) reloadLexonomy(dbPath string) {
	st, err := core.LoadLexonomy(dbPath)
	if err != nil {
		log.Printf("reload %s: %v", dbPath, err)
		return
	}
	s.store.Store(st)
	log.Printf("reloaded entries from %s", dbPath)
}
