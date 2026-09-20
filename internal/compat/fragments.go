package compat

import (
	"html/template"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// These templates reproduce the exact HTML fragments the legacy twanksta
// frontend expects to drop into #results, #suggest-wrap, and .spoiler-body.
// Markup captured verbatim from the live site — do not "clean it up", the
// bundled app_n-min.js / CSS depend on these class names and shapes.

// searchResult: injected into #results by /search/.
// `numb` carries the inflection class so the frontend can echo it back to
// /more/; the FST regenerates by word regardless.
var tmplFuncs = template.FuncMap{"inc": func(i int) int { return i + 1 }}

var searchTmpl = template.Must(template.New("search").Funcs(tmplFuncs).Parse(`<ul>
{{range .}}	<li><span class='word'>{{.Word}}</span> <span class='numb'>{{.Class}}</span> <span class="gend">{{.Gender}}</span>  <span class='desc'>{{.Desc}}</span>
		<span class="translat">{{range $i, $s := .Senses}}<span class='translation-child'><span class='translation-number'>{{inc $i}}</span> {{$s}}</span>{{end}}</span>
{{if .HasForms}}		<span class="more"><small>&#9658;</small> Show form</span>
		<div class="spoiler-body" id="parad"></div>
{{end}}	</li>
{{end}}</ul>
`))

// suggestTmpl: injected into #suggest-wrap by /auto/.
var suggestTmpl = template.Must(template.New("auto").Parse(
	`{{range .}}<a class="suggest" href="#{{.Word}}"><b>{{.Word}}</b>{{if .First}}<span class='translation-child'><span class='translation-number'>1</span> {{.First}}</span>{{end}}</a>{{end}}`))

// nounTable: injected into .spoiler-body by /more/ for a declension.
var nounTableTmpl = template.Must(template.New("noun").Parse(`<table id="subst">
<tbody>
<tr><th class="null">{{.Gender}}</th><th class="hea2">sing</th><th class="hea2">plur</th></tr>
{{range .Rows}}<tr><th class="hea">{{.Case}}</th><td><span class="verb">{{.Sg}}</span></td><td><span class="verb">{{.Pl}}</span></td></tr>
{{end}}</tbody></table>
`))

// --- view models: the compat layer's arrangement of core data ---

type resultVM struct {
	Word, Class, Gender, Desc string
	Senses                    []string
	HasForms                  bool
}

type suggestVM struct {
	Word  string
	First string // first sense, if any
}

type nounRow struct{ Case, Sg, Pl string }
type nounTableVM struct {
	Gender string
	Rows   []nounRow
}

// genderTableVM is one gender's 4-case declension — the shape shared by the
// adjective .ohoo tables (width "auto") and the participle/degree spoilers
// (width "98%"). The plain noun table keeps its own template above.
type genderTableVM struct {
	Width  string // "", "auto", "98%"
	Gender string
	Rows   []nounRow
}

// substCases is the legacy case order every subst-shaped table uses.
var substCases = []struct{ Label, Key string }{
	{"Nominative", "nom"}, {"Genitive", "gen"}, {"Dative", "dat"}, {"Accusative", "acc"},
}

// nounRowOrder maps the canonical core slots to the legacy table layout. This
// is exactly the "compat arranges flat slots into a layout" responsibility;
// core stays layout-agnostic.
var nounRowOrder = []struct {
	Label  string
	Sg, Pl core.Slot
}{
	{"Nominative", "sg.nom", "pl.nom"},
	{"Genitive", "sg.gen", "pl.gen"},
	{"Dative", "sg.dat", "pl.dat"},
	{"Accusative", "sg.acc", "pl.acc"},
}

func nounTableVMFrom(gender string, p core.Paradigm) nounTableVM {
	vm := nounTableVM{Gender: gender}
	for _, r := range nounRowOrder {
		vm.Rows = append(vm.Rows, nounRow{Case: r.Label, Sg: p[r.Sg], Pl: p[r.Pl]})
	}
	return vm
}

// substDefine is the shared gender-declension table; templates that embed it
// parse this define alongside their own body.
const substDefine = `{{define "subst"}}<table id="subst"{{if .Width}} width="{{.Width}}"{{end}}>
				<tbody>
				<tr>
					<th class="null">{{.Gender}}</th>
					<th class="hea2">sing</th>
					<th class="hea2">plur</th>
				</tr>
				{{range .Rows}}<tr>
					<th class="hea">{{.Case}}</th>
					<td><span class="verb">{{.Sg}}</span>
					</td>
					<td><span class="verb">{{.Pl}}</span></td>
				</tr>
				{{end}}</tbody>
				</table>{{end}}`

// spoilerTrioVM is a collapsed headline plus the three gender tables inside a
// spoiler-body2 — shared by verb participles and adjective degrees.
type spoilerTrioVM struct {
	Title     string // headline, always the masc.sg.nom form
	Closed    bool   // Present participle starts open, everything else closed
	Masc, Fem genderTableVM
	Neut      genderTableVM
}

// spoilerTrioDefine reproduces that spoiler block (including the legacy
// unbalanced </td> after the fem table — do not "clean it up").
const spoilerTrioDefine = `{{define "spoilerTrio"}}{{if .Closed}}					<span class="spoiler-title2 closed"><span class="arrow">&#9658; </span>					<span>{{.Title}}</span></span>{{else}} <span class="spoiler-title2"><span class="arrow">&#9658; </span> 					<span>{{.Title}}</span></span>{{end}}

<div class="spoiler-body2">
		<table width="100%"><tr><td>
			{{template "subst" .Masc}}</td>

				<td>{{template "subst" .Fem}}
			</td>
			</td>

				<td>{{template "subst" .Neut}}</td></tr>
</table></div>{{end}}`

// genderTable builds one gender's table; slot maps (case key, number) to the
// canonical slot carrying the form for that cell.
func genderTable(width, gender string, p core.Paradigm, slot func(kasus, num string) core.Slot) genderTableVM {
	vm := genderTableVM{Width: width, Gender: gender}
	for _, c := range substCases {
		vm.Rows = append(vm.Rows, nounRow{
			Case: c.Label, Sg: p[slot(c.Key, "sg")], Pl: p[slot(c.Key, "pl")],
		})
	}
	return vm
}

// slotMapper is the slot mapper for {prefix}{gender}.{number}.{case} paradigms
// (adjectives and participles).
func slotMapper(prefix, gender string) func(kasus, num string) core.Slot {
	return func(k, n string) core.Slot {
		return core.Slot(prefix + gender + "." + n + "." + k)
	}
}
