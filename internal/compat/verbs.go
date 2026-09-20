package compat

import (
	"html/template"

	"github.com/strfry/prussian-dictionary/internal/core"
)

// The legacy verb layout shows periphrastic Perfect/Future as composed cells
// ("asma kalbīwuns / kalbīwusi"). Per the core slot decision these are NOT
// slots: compat composes them from the aux paradigm below plus the number/
// gender-agreeing past.part nominative (see verbTableVMFrom). The auxiliaries
// are fixed function words needed only for this legacy rendering, so they
// live here as constants rather than as entries.
var periphrasticRows = []struct {
	Pronoun           string
	PerfAux, FutAux   string
	PartMasc, PartFem core.Slot // non-empty -> "masc / fem" alternation
	PartNeut          core.Slot // non-empty -> bare neuter form
}{
	{"as", "asma", "wīrst", "part.past.nom.sg.masc", "part.past.nom.sg.fem", ""},
	{"tū", "assei", "wīrst", "part.past.nom.sg.masc", "part.past.nom.sg.fem", ""},
	{"tāns/tenā", "ast", "wīrst", "part.past.nom.sg.masc", "part.past.nom.sg.fem", ""},
	{"tennan", "ast", "wīrst", "", "", "part.past.nom.sg.neut"},
	{"mes", "asmai", "wīrstmai", "part.past.nom.pl.masc", "part.past.nom.pl.fem", ""},
	{"jūs", "astei", "wīrstei", "part.past.nom.pl.masc", "part.past.nom.pl.fem", ""},
	{"tenēi/tennas", "ast", "wīrst", "part.past.nom.pl.masc", "part.past.nom.pl.fem", ""},
}

// participleFor composes the agreeing participle part of one periphrastic row.
func participleFor(p core.Paradigm, row int) string {
	r := periphrasticRows[row]
	if r.PartNeut != "" {
		return p[r.PartNeut]
	}
	return p[r.PartMasc] + " / " + p[r.PartFem]
}

// verbTableTmpl reproduces the legacy /more/ fragment for verbs: the
// .left-verbs indicative block (Present/Past, then the composed Perfect and
// Future columns) and the .right-verbs column (Optative, Imperative, the three
// participle spoilers, Subjunctive). Captured verbatim from the live site —
// do not "clean it up", the bundled app_n-min.js / CSS depend on these shapes.
var verbTableTmpl = template.Must(template.Must(template.Must(
	template.New("verb").Parse(substDefine)).Parse(spoilerTrioDefine)).Parse(`   
<div class="left-verbs">

          <table width="100%" class="table-hi" style="table-layout:fixed;" border="0" cellspacing="0" cellpadding="0">
            <tbody><tr height="10px">
              <td width="14px" nowrap="">&nbsp;
                  </td>
              <td rowspan="2" align="left" class="heading-title" nowrap="">
                <h3>Indicative mood</h3>
              </td>
              <td width="100%" nowrap="">&nbsp;
                  </td>
            </tr>
            <tr height="10px">
              <td style="border-top:1px solid #e7ecef ;border-left:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
              <td style="border-top:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
            </tr>
            <tr height="100%">
              <td colspan="3" align="left" valign="top" style="border-left:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:1px solid #e7ecef ;border-top:0; padding: 5px; padding-left: 6px">


                <table class="response" width="100%" height="100%" border="0" cellspacing="4" cellpadding="0">
                  <tbody><tr>
                    <td valign="top"><span class="head">Present</span><br>{{range .Present}}<tt></tt><span class="pronoun">{{.Pronoun}} </span><tt></tt><span class="verb">{{.Form}}</span><br>{{end}}
                    </td>
                    <td valign="top">
                	<span class="head">Past</span><br>{{range .Past}}<tt></tt><span class="pronoun">{{.Pronoun}} </span><tt></tt><span class="verb">{{.Form}}</span><br>{{end}}
                    </td>
                  </tr>
                  <tr>
                    <td valign="top"><span class="head">Perfect</span><br>{{range .Perfect}}<tt></tt><span class="pronoun">{{.Pronoun}} </span><tt></tt><span class="verb">{{.Form}}</span><br>{{end}}
                    </td>
                    <td valign="top"><span class="head">Future</span><br>{{range .Future}}<tt></tt><span class="pronoun">{{.Pronoun}} </span><tt></tt><span class="verb">{{.Form}}</span><br>{{end}}
                    </td>
                  </tr>
                </tbody></table>

                    </td>
            </tr>
          </tbody></table>

</div>
<div class="right-verbs">

<table width="100%" height="40%" border="0" style="padding-right:0px">
      <tbody>
              <td width="35%" style="padding-left:5px">
           <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody><tr height="10px">
              <td width="14px" nowrap=""> &nbsp;
                  </td>
              <td rowspan="2" align="center" style="padding: 5px" nowrap="">
                <h3>Optative</h3>
              </td>
              <td width="100%" nowrap=""> &nbsp;
                  </td>
            </tr>
            <tr height="10px">
              <td style="border-top:1px solid #e7ecef ;border-left:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
              <td style="border-top:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
            </tr>
            <tr class="infinitive-content">
              <td colspan="3" align="left" valign="bottom" style="border-left:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:1px solid #e7ecef ;border-top:0 ; padding: 5px ;padding-left: 6px">
                <tt></tt>

                <span class="verb">{{.Optative}}</span><br><br>

              </td>
            </tr>
          </tbody></table>
        </td>
        <td width="35%" style="padding-left:5px">
          <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody><tr height="10px">
              <td width="15px" nowrap=""> &nbsp;
                  </td>
              <td rowspan="2" align="center" style="padding: 5px;" nowrap="">
                <h3>Imperative</h3>
              </td>
              <td width="100%" nowrap="">&nbsp;
                  </td>
            </tr>
            <tr height="10px">
              <td style="border-top:1px solid #e7ecef ;border-left:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
              <td style="border-top:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
            </tr>
            <tr height="100%">
              <td colspan="3" align="left" valign="top" style="border-left:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:1px solid #e7ecef ;border-top:0 ; padding: 5px ;padding-left: 6px">
                <tt></tt>

               <span class="pronoun">(tū) </span>
<span class="verb">{{.ImpSg}}</span><br>
			   <span class="pronoun">(jūs) </span>
			   <span class="verb">{{.ImpPl}}</span>

              </td>
            </tr>
          </tbody></table>
        </td>
      <tr>
       <td colspan="2" style="padding-left:5px">
        <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
             <tbody><tr height="10px">
              <td width="18px" nowrap=""> &nbsp;
                  </td>
              <td rowspan="2" align="center" style="padding: 5px 17px" nowrap="">
                <h3>Participle</h3>
              </td>
              <td width="55%" nowrap=""> &nbsp;
                  </td>
            </tr>
            <tr height="10px">
              <td style="border-top:1px solid #e7ecef ;border-left:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
              <td style="border-top:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
            </tr>
            <tr height="100%">
              <td colspan="3" align="left" valign="top" style="border-left:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:1px solid #e7ecef ;border-top:0 ; padding: 5px;padding-left: 6px">
                <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>{{range .Participles}}                    <tr><td valign="top" align="center" style="padding-top: 10px">                   <span class="head">{{.Label}}</span><br><tt></tt>
{{template "spoilerTrio" .Spoiler}}
                    </td>
                    </tr>{{end}}
                  </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-left:5px">
        <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody><tr height="10px">
              <td width="18px" nowrap=""> &nbsp;
                  </td>
              <td rowspan="2" align="center" style="padding: 3px" nowrap="">
                <h3>Subjunctive</h3>
              </td>
              <td width="100%" nowrap=""> &nbsp;
              </td>
            </tr>
            <tr height="10px">
              <td style="border-top:1px solid #e7ecef ;border-left:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
              <td style="border-top:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:0 ;">&nbsp;</td>
            </tr>
            <tr class="infinitive-content">
              <td colspan="3" align="left" valign="top" style="border-left:1px solid #e7ecef ;border-right:1px solid #e7ecef ;border-bottom:1px solid #e7ecef ;border-top:0 ; padding: 5px ;padding-left: 6px;">{{range $i, $l := .Subjunctive}}{{if $i}}<tt></tt>{{end}}<span class="pronoun">{{$l.Pronoun}} </span><tt></tt><span class="verb">{{$l.Form}}</span><br>{{end}}

              </td>
            </tr>
          </tbody></table></td>
      </tr>
    </tbody></table>

</div>
`))

// --- view models ---

type verbFormLine struct{ Pronoun, Form string }

type verbParticipleVM struct {
	Label   string // Present / Past / Passive
	Spoiler spoilerTrioVM
}

type verbTableVM struct {
	Present, Past, Perfect, Future []verbFormLine
	Optative                       string
	ImpSg, ImpPl                   string
	Participles                    []verbParticipleVM
	Subjunctive                    []verbFormLine
}

// finiteRows are the six legacy pronoun rows of a synthetic tense column.
var finiteRows = []struct {
	Pronoun string
	Slot    func(tense string) core.Slot
}{
	{"as", func(t string) core.Slot { return core.Slot(t + ".p1.sg") }},
	{"tū", func(t string) core.Slot { return core.Slot(t + ".p2.sg") }},
	{"tāns/tenā/tennan", func(t string) core.Slot { return core.Slot(t + ".p3") }},
	{"mes", func(t string) core.Slot { return core.Slot(t + ".p1.pl") }},
	{"jūs", func(t string) core.Slot { return core.Slot(t + ".p2.pl") }},
	{"tenēi/tennas", func(t string) core.Slot { return core.Slot(t + ".p3") }},
}

func finiteCell(p core.Paradigm, tense string) []verbFormLine {
	var lines []verbFormLine
	for _, r := range finiteRows {
		lines = append(lines, verbFormLine{Pronoun: r.Pronoun, Form: p[r.Slot(tense)]})
	}
	return lines
}

func verbTableVMFrom(p core.Paradigm) verbTableVM {
	vm := verbTableVM{
		Present:     finiteCell(p, "pres"),
		Past:        finiteCell(p, "past"),
		Subjunctive: finiteCell(p, "subj"),
		Optative:    p["opt"],
		ImpSg:       p["imp.sg"],
		ImpPl:       p["imp.pl"],
	}
	// Periphrastic Perfect/Future: aux + agreeing past.part nominative.
	for i, r := range periphrasticRows {
		vm.Perfect = append(vm.Perfect, verbFormLine{r.Pronoun, r.PerfAux + " " + participleFor(p, i)})
		vm.Future = append(vm.Future, verbFormLine{r.Pronoun, r.FutAux + " " + participleFor(p, i)})
	}
	for _, part := range []struct {
		Label, Prefix string
		Closed        bool
	}{
		{"Present", "pres", false},
		{"Past", "past", true},
		{"Passive", "pass", true},
	} {
		prefix := "part." + part.Prefix + "."
		spoiler := spoilerTrioVM{
			Title:  p[core.Slot(prefix+"nom.sg.masc")],
			Closed: part.Closed,
		}
		spoiler.Masc = genderTable("98%", "masc", p, slotMapper(prefix, "masc"))
		spoiler.Fem = genderTable("98%", "fem", p, slotMapper(prefix, "fem"))
		spoiler.Neut = genderTable("98%", "neut", p, slotMapper(prefix, "neut"))
		vm.Participles = append(vm.Participles, verbParticipleVM{Label: part.Label, Spoiler: spoiler})
	}
	return vm
}
