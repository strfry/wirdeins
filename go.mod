module github.com/strfry/prussian-dictionary

go 1.27

require (
	github.com/BurntSushi/toml v1.6.0 // TOML source loader (internal/core/store.go) + migration encoder
	github.com/fsnotify/fsnotify v1.7.0
	github.com/yuin/goldmark v1.8.6
)

require golang.org/x/sys v0.4.0 // indirect
