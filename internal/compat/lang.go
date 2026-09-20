package compat

import "github.com/strfry/prussian-dictionary/internal/core"

// legacyLang maps twanksta's wire language codes to our core.Lang. The frontend
// sends these verbatim in the `language` query param.
var legacyLang = map[string]core.Lang{
	"engl": core.LangEN,
	"miks": core.LangDE,
	"leit": core.LangLT,
	"latt": core.LangLV,
	"pols": core.LangPL,
	"mask": core.LangRU,
}

func parseLang(s string) core.Lang {
	if l, ok := legacyLang[s]; ok {
		return l
	}
	return core.LangEN // default, matches the frontend's default select
}

// Dialect: the `dia` param is "semba" (Sambian) | "pameddi" (Pomesanian).
// Kept as a plain string for now; when the FST/overrides gain dialect variants
// this becomes a core concept.
func parseDialect(s string) string {
	switch s {
	case "semba", "pameddi":
		return s
	default:
		return "semba"
	}
}
