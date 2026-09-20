package compat

import (
	"html/template"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// adjTableTmpl reproduces the legacy /more/ fragment for adjectives: three
// .ohoo gender tables (positive degree), then the .newline block with the
// degree table (positive headline + comparative/superlative spoilers) and the
// adverb table. Comparative starts open, superlative closed. Captured verbatim
// from the live site.
var adjTableTmpl = template.Must(template.Must(template.Must(
	template.New("adj").Parse(substDefine)).Parse(spoilerTrioDefine)).Parse(`    		<div class="ohoo">{{template "subst" .Masc}}</div>
				 <div class="ohoo">{{template "subst" .Fem}}</div>
				<div class="ohoo">{{template "subst" .Neut}}</div>
							<div class="newline">

					<div class="ohoo">
					<table id="subst" width="auto">
				<tbody>
				<tr>
					<th class="null"></th>
					<th class="hea2">Adjective</th>
					<th class="hea2">Comparative</th>
					<th class="hea2">Superlative</th>
				</tr>
				<tr>
					<th class="hea"></th>
					<td><span class="verb">{{.Positive}}</span>
					</td>
					<td>{{template "spoilerTrio" .Cmp}}					</td>
					<td>{{template "spoilerTrio" .Sup}}</td>
				</tr>
			</tbody>
				</table>
				</div>

					<div class="ohoo">
					<table id="subst" width="auto">
				<tbody>
				<tr>
					<th class="null"></th>
					<th class="hea2">Adverb</th>
					<th class="hea2">Comparative</th>
					<th class="hea2">Superlative</th>
				</tr>
				<tr>
					<th class="hea"></th>
					<td><span class="verb">{{.Adv}}</span>
					</td>
					<td><span class="verb">{{.AdvCmp}}</span>
					</td>
					<td><span class="verb">{{.AdvSup}}</span>
					</td>
				</tr>
			</tbody>
				</table>
				</div>
					</div>
`))

// --- view models ---

type adjTableVM struct {
	Masc, Fem, Neut genderTableVM // positive degree
	Positive        string        // degree-table headline (nom.sg.masc)
	Cmp, Sup        spoilerTrioVM
	Adv             string
	AdvCmp          string
	AdvSup          string
}

func adjTableVMFrom(p core.Paradigm) adjTableVM {
	vm := adjTableVM{
		Positive: p["nom.sg.masc"],
		Cmp:      spoilerTrioVM{Title: p["cmp.nom.sg.masc"]}, // starts open
		Sup:      spoilerTrioVM{Title: p["sup.nom.sg.masc"]}, // also open (unlike verb participles)
		Adv:      p["adv"],
		AdvCmp:   p["adv.cmp"],
		AdvSup:   p["adv.sup"],
	}
	vm.Masc = genderTable("auto", "masc", p, slotMapper("", "masc"))
	vm.Fem = genderTable("auto", "fem", p, slotMapper("", "fem"))
	vm.Neut = genderTable("auto", "neut", p, slotMapper("", "neut"))
	vm.Cmp.Masc = genderTable("98%", "masc", p, slotMapper("cmp.", "masc"))
	vm.Cmp.Fem = genderTable("98%", "fem", p, slotMapper("cmp.", "fem"))
	vm.Cmp.Neut = genderTable("98%", "neut", p, slotMapper("cmp.", "neut"))
	vm.Sup.Masc = genderTable("98%", "masc", p, slotMapper("sup.", "masc"))
	vm.Sup.Fem = genderTable("98%", "fem", p, slotMapper("sup.", "fem"))
	vm.Sup.Neut = genderTable("98%", "neut", p, slotMapper("sup.", "neut"))
	return vm
}
