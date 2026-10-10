(function () { "use strict";
/*
 * Prussian custom entry editor for the lexicalcomputing NVH Lexonomy fork.
 * Route A — config-level custom editor (no Lexonomy source fork, no rebuild).
 *
 * Loaded by the fork as `new Function("return " + editing.js)()`
 * (js/nvh-store.js:150); it expects the returned object to expose
 * `.editor({node,entry,readOnly,onChange,onValidChange})` + `.getValue()`
 * (+ optional `.update(entry)`, `.destroy()`, `.isValid`). The raw NVH "code"
 * tab stays available as a fallback (nvh-store.js:47).
 *
 * NOTE: file must be a single EXPRESSION (the IIFE) — no leading `return`, and
 * the first token must be `(function...` or the prepended `return` hits ASI and
 * yields `undefined`.
 *
 * ---------------------------------------------------------------------------
 * REAL schema (from corpus/parsed/twanksta_dmlex.nvh, DMLex-flavoured NVH):
 *
 *   entry: <headword>
 *     id: <headword>|<paradigm>|<desc>     # composite key (read-only here)
 *     pos: noun                            # bare POS
 *     gender: masc                         # separate node (nouns)
 *     paradigm: 56                         # TOP-LEVEL (not under legacy)
 *     label: MK                            # 0..n source labels
 *     stemOverrides: obl=Patall …          # Stufe 1 (role=stem …), lean NVH
 *     inflectedForm: <surface form>        # 0..n Stufe 2 override, lean NVH
 *       tag: sg.dat                        # slot key
 *     sense:
 *       en|de|lt|lv|pl|ru: <translation>   # 0..n each (multi-valued)
 *       example: <attested form>           # 0..n attested inflected forms
 *         sourceIdentity / sourceElaboration / label / legacy.desc
 *     legacy:
 *       desc: [Advent MK]
 *     pronunciation: / relation:           # some entries (preserved verbatim)
 *
 * Older entries with fused `pos: noun-masc` and `legacy.paradigm` are read too;
 * writes go back to wherever the entry keeps the value. Stufe 2 overrides are
 * stored exactly as gen/compress_forms.py writes them: a top-level
 * `inflectedForm` node with a `tag` child (NOT an `override` under the sense).
 *
 * Design defaults (see README): single sense; pos/gender read top-level (fall
 * back to fused); paradigm read/written top-level (fall back to legacy);
 * examples read-only; every node we don't render is preserved in place so
 * getValue() never drops data (variant/relation stubs survive untouched).
 *
 * ======================== FLEXION SERVER =========================
 * The inflection table comes from fetchForms() below, which POSTs to the
 * generator service (`web/flexsrv.py` in the dictionary repo):
 *
 *   uv run python web/flexsrv.py                 # 127.0.0.1:8080
 *
 * The service wraps the real, data-free generator (`gen/generator.py`, atom
 * FSTs in build/) — the inflection cells are generated, not a mock rule. The
 * endpoint contract (see web/editor_api.py and web/README.md):
 *
 *   POST /generate {headword, pos, gender, paradigm, stems, overrides}
 *     → {family, resolved, stems, delivered, roles, note,
 *        tables: [{title, blocks:[{columns, rows, cells}]}],
 *        slots: [{slot, label, group, role, form, ruleForms, source}]}
 *
 *   roles carries every generator role with its rule `default` stem, so the
 *   Stufe-1 boxes can show and change the derived stems (source stem|rule).
 *   source ∈ {"rule", "override", "none"}; "none" = the grammar has no form
 *   for this cell (source: override — the override input still applies).
 *   OVERRIDE WINS: a cell's `form` is the NVH `override` when one exists,
 *   `ruleForms` always shows what the rule alone produces.
 *
 * FLEX_URL is overridable per deployment (Lexonomy config `editing.js` is
 * uploaded once, so the default points at the dev-local service; override in
 * a page via `window.PFX_FLEX_URL`).
 * =====================================================================
 */

   // ------------------------- NVH tree helpers -------------------------

   function childByName(node, name) {
      return (node.children || []).find(c => c.name === name) || null;
   }
   function childrenByName(node, name) {
      return (node.children || []).filter(c => c.name === name);
   }
   function childValue(node, name, dflt) {
      const c = node && childByName(node, name);
      return c ? c.value : (dflt === undefined ? "" : dflt);
   }
   function mkNode(name, value, parentPath, children) {
      return {
         name: name,
         value: value == null ? "" : String(value),
         children: children || [],
         path: parentPath ? parentPath + "." + name : name,
      };
   }
   function ensureChild(parent, name) {
      let c = childByName(parent, name);
      if (!c) {
         c = mkNode(name, "", parent.path);
         (parent.children = parent.children || []).push(c);
      }
      return c;
   }
   function setChildValue(parent, name, value) {
      ensureChild(parent, name).value = value == null ? "" : String(value);
   }
   function removeNode(parent, node) {
      parent.children = (parent.children || []).filter(c => c !== node);
   }

   // pos "noun-masc" <-> {base:"noun", gender:"masc"}
   const GENDERED = { noun: true };

   // Wortarten der NVH (fst WS3), 1:1 auf die FST-Tags. `inflects`: kann ein
   // Paradigma tragen (pron/num P21–24 flektieren über die adj-Atome). Die übrigen
   // sind invariabel. Kein `encl` — Enklise ist +Pron+Encl, keine Wortart.
   const POS_TAGS = [
      {v:"noun",  t:"noun",  fst:"+N",      inflects:true},
      {v:"adj",   t:"adj — adjective", fst:"+A", inflects:true},
      {v:"verb",  t:"verb",  fst:"+V",      inflects:true},
      {v:"pron",  t:"pron — pronoun", fst:"+Pron", inflects:true},
      {v:"num",   t:"num — numeral", fst:"+Num", inflects:true},
      {v:"adv",   t:"adv — adverb", fst:"+Adv"},
      {v:"prep",  t:"prep — preposition", fst:"+Pr"},
      {v:"postp", t:"postp — postposition", fst:"+Po"},
      {v:"intj",  t:"intj — interjection", fst:"+Interj"},
      {v:"part",  t:"part — particle", fst:"+Pcle"},
      {v:"cconj", t:"cconj — coordinating conjunction", fst:"+CC"},
      {v:"sconj", t:"sconj — subordinating conjunction", fst:"+CS"},
   ];
   const NUMTYPE_POS = { noun: true, adj: true, num: true };
   function posTag(base){ return POS_TAGS.find(p => p.v === base) || null; }
   // Ohne Paradigma invariabel (wie fst build_analyzer.classify_entry):
   // invariable Wortart oder indeklinables Nomen. Leere/unbekannte POS nicht.
   function isInvariable(entry){
      const base = entryPos(entry).base;
      const tag = posTag(base);
      if (!tag || entryParadigm(entry)) return false;
      return !tag.inflects || base === "noun" || base === "pron" || base === "num";
   }
   function splitPos(v) {
      const i = v.indexOf("-");
      if (i < 0) return { base: v, gender: "" };
      return { base: v.slice(0, i), gender: v.slice(i + 1) };
   }
   function joinPos(base, gender) {
      return GENDERED[base] && gender ? base + "-" + gender : base;
   }

   // Real NVH layout (corpus/parsed/twanksta_dmlex.nvh): `pos` is the bare POS,
   // `gender` a separate top-level node, `paradigm` top-level. Older entries may
   // still carry the fused `noun-masc` + `legacy.paradigm`; both are read, and
   // writes go back to wherever the entry keeps the value.
   function entryPos(entry) {
      const parsed = splitPos(childValue(entry, "pos", ""));
      return {
         base: parsed.base,
         gender: childValue(entry, "gender", "") || parsed.gender,
      };
   }
   function setEntryPos(entry, base, gender) {
      if (childValue(entry, "pos", "").indexOf("-") >= 0) {   // fused (old)
         setChildValue(entry, "pos", joinPos(base, gender));
         return;
      }
      setChildValue(entry, "pos", base);
      const existing = childByName(entry, "gender");
      if (GENDERED[base] && gender) ensureChild(entry, "gender").value = gender;
      else if (existing) existing.value = "";
   }
   function entryParadigm(entry) {
      const top = childByName(entry, "paradigm");
      if (top) return top.value;
      const legacy = childByName(entry, "legacy");
      return legacy ? childValue(legacy, "paradigm", "") : "";
   }
   function setEntryNumtype(entry, value) {
      const node = childByName(entry, "numtype");
      if (value) setChildValue(entry, "numtype", value);
      else if (node) removeNode(entry, node);
   }
   function setEntryParadigm(entry, value) {
      if (childByName(entry, "paradigm")) setChildValue(entry, "paradigm", value);
      else setChildValue(ensureChild(entry, "legacy"), "paradigm", value);
   }

   // A brand-new (unsaved) entry has no `sense` yet — it is optional in the
   // schema (min 0). The editor must create one on demand, otherwise a new
   // entry offers nowhere to type.
   function isNewEntry() {
      try {
         const store = (typeof window !== "undefined") && window.store;
         return !!(store && store.data && store.data.entryId === "new");
      } catch (e) { return false; }
   }
   function addSense(entry) {
      const sense = mkNode("sense", "", entry.path);
      (entry.children = entry.children || []).push(sense);
      return sense;
   }

   // Stufe 1: delivered stems, one scalar node `stemOverrides: role=stem …`
   // at entry level (same shape as the lean NVH in gen/compress_forms.py).
   function stemOverrides(entry) {
      const map = {};
      const node = childByName(entry, "stemOverrides");
      if (node && node.value) {
         node.value.trim().split(/\s+/).forEach(tok => {
            const i = tok.indexOf("=");
            if (i > 0) map[tok.slice(0, i)] = tok.slice(i + 1);
         });
      }
      return map;
   }
   function setStemOverride(entry, role, stem) {
      const map = stemOverrides(entry);
      if (stem === "" || stem == null) delete map[role];
      else map[role] = stem;
      const node = childByName(entry, "stemOverrides");
      const roles = Object.keys(map);
      if (!roles.length) { if (node) removeNode(entry, node); return; }
      const value = roles.map(r => r + "=" + map[r]).join(" ");
      if (node) node.value = value;
      else (entry.children = entry.children || []).push(
         mkNode("stemOverrides", value, entry.path));
   }

   // Stufe 2: overrides are top-level `inflectedForm` nodes keyed by their
   // `tag` child (the lean-NVH shape of gen/compress_forms.py) — NOT a node
   // under the sense. `tag` is the slot key, e.g. sg.dat / prt.sp3.
   function overridesMap(entry) {
      const map = {};
      if (!entry) return map;
      childrenByName(entry, "inflectedForm").forEach(node => {
         const tag = childValue(node, "tag", "");
         if (tag) map[tag] = node.value;
      });
      return map;
   }
   function setOverride(entry, slot, form) {
      const existing = childrenByName(entry, "inflectedForm")
         .filter(n => childValue(n, "tag", "") === slot);
      if (form === "" || form == null) {
         existing.forEach(n => removeNode(entry, n));
         return;
      }
      if (!existing.length) {
         (entry.children = entry.children || []).push(
            mkNode("inflectedForm", form, entry.path,
               [mkNode("tag", slot, entry.path + ".inflectedForm")]));
      } else {
         existing[0].value = form;
         existing.slice(1).forEach(n => removeNode(entry, n));
      }
   }

   // --------------------------- flexion server ---------------------------
   //
   // The service decides labels, grouping, slot order and which paradigm it
   // resolved (verb 87 → 87a/87b), so the editor renders `slots` as given and
   // keeps only its own override round-trip. No rule knowledge in this file.

   // Local dev: the scratch service runs at 127.0.0.1:8080. Anywhere else the
   // service is exposed under the same origin at /flexsrv (Uberspace web
   // backend), so a relative URL works without per-deployment config.
   // window.PFX_FLEX_URL overrides both.
   function defaultFlexUrl() {
      try {
         const host = (typeof location !== "undefined" && location.hostname) || "";
         if (host && !/^(localhost|127\.|\[::1\]|0\.0\.0\.0)$/.test(host)) return "/flexsrv";
      } catch (e) { /* no location (node harness) */ }
      return "http://127.0.0.1:8080";
   }
   const FLEX_URL = (typeof window !== "undefined" && window.PFX_FLEX_URL)
      || defaultFlexUrl();

   async function fetchForms(req) {
      const res = await fetch(FLEX_URL + "/generate", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(req),
      });
      let data = null;
      try { data = await res.json(); } catch (e) { /* non-JSON error page */ }
      if (!res.ok) {
         const msg = (data && data.error) || ("HTTP " + res.status);
         return { slots: [], note: "Flexion service: " + msg };
      }
      // Keep the caller's overrides visible even if the service dropped them
      // (it shouldn't — an override outside the paradigm is echoed back).
      if (req.overrides) {
         const known = new Set(data.slots.map(s => s.slot));
         Object.keys(req.overrides).forEach(slot => {
            if (!known.has(slot)) {
               data.slots.push({ slot, label: slot, group: "Override", form: req.overrides[slot], ruleForms: [], source: "override" });
            }
         });
      }
      return data;
   }

   // -------------------------------- Editor --------------------------------

   const S = { root:null, entry:null, sense:null, onChange:()=>{}, readOnly:false };

   function unwrap(node){ return (node && node.jquery) ? node[0] : (node[0] || node); }
   function emitChange(){ S.onChange && S.onChange(); }

   function el(tag, attrs, kids){
      const e = document.createElement(tag);
      if (attrs) for (const k in attrs){
         if (k === "class") e.className = attrs[k];
         else if (k === "text") e.textContent = attrs[k];
         else e.setAttribute(k, attrs[k]);
      }
      (kids || []).forEach(c => e.appendChild(c));
      return e;
   }
   function field(label, control){
      return el("label", {class:"pfx-field"}, [ el("span",{class:"pfx-lbl",text:label}), control ]);
   }
   function textInput(value, onInput, extra){
      const inp = el("input", Object.assign({type:"text", value:value||"", class:"pfx-inp"}, extra||{}));
      inp.disabled = S.readOnly;
      inp.addEventListener("input", () => onInput(inp.value.trim()));
      return inp;
   }
   function select(options, value, onChange){
      // `browser-default` is Materialize's opt-out: without it `select` is display:none.
      const sel = el("select", {class:"pfx-inp browser-default"});
      sel.disabled = S.readOnly;
      options.forEach(o => {
         const opt = el("option", {value:o.v, text:o.t});
         if (o.v === value) opt.setAttribute("selected","selected");
         sel.appendChild(opt);
      });
      sel.value = value;
      sel.addEventListener("change", () => onChange(sel.value));
      return sel;
   }

   const LANGS = ["de","en","lt","lv","pl","ru"];

   function renderTranslations(container){
      container.innerHTML = "";
      LANGS.forEach(lang => {
         const nodes = childrenByName(S.sense, lang);
         const row = el("div", {class:"pfx-trow"});
         row.appendChild(el("span", {class:"pfx-tlang", text:lang}));
         const vals = el("div", {class:"pfx-tvals"});
         nodes.forEach(n => {
            const wrap = el("span", {class:"pfx-tval"});
            wrap.appendChild(textInput(n.value, v => { n.value = v; emitChange(); }));
            if (!S.readOnly){
               const x = el("button", {class:"pfx-x", text:"×", title:"remove"});
               x.addEventListener("click", () => { removeNode(S.sense, n); emitChange(); renderTranslations(container); });
               wrap.appendChild(x);
            }
            vals.appendChild(wrap);
         });
         if (!S.readOnly){
            const add = el("button", {class:"pfx-add", text:"+ "+lang});
            add.addEventListener("click", () => {
               (S.sense.children = S.sense.children || []).push(mkNode(lang, "", S.sense.path));
               emitChange(); renderTranslations(container);
            });
            vals.appendChild(add);
         }
         row.appendChild(vals);
         container.appendChild(row);
      });
   }

   function renderExamples(container){
      container.innerHTML = "";
      const exs = childrenByName(S.sense, "example");
      if (!exs.length){ container.appendChild(el("div",{class:"pfx-muted",text:"— no attestations —"})); return; }
      exs.forEach(ex => {
         const gram = childValue(ex, "sourceElaboration", "");
         const src = childValue(ex, "sourceIdentity", "");
         container.appendChild(el("div", {class:"pfx-ex"}, [
            el("span", {class:"pfx-exform", text:ex.value}),
            el("span", {class:"pfx-exgram", text:gram}),
            el("span", {class:"pfx-exsrc", text:src ? "["+src+"]" : ""}),
         ]));
      });
   }

   // ── Inflection grid (like wirdeins.twanksta.org) ─────────────────────
   // The service sends the matrix (tables → blocks → cells); the editor only
   // renders it. Each cell COMBINES display and editor: it shows the form as
   // clickable text; clicking swaps it for a text box. Enter commits the
   // override, an empty box clears it back to the rule default, Escape reverts.
   // A cell the grammar leaves empty ("none") is editable too.

   // Override, das nichts ändert: die Regel liefert genau diese Form (ohne Varianten).
   function isRedundant(cell){
      const rule = cell.ruleForms || [];
      return cell.source === "override" && rule.length === 1 && rule[0] === cell.form;
   }
   function sourceClass(cell){
      if (isRedundant(cell)) return "pfx-redundant";
      const source = cell.source;
      return source === "override" ? "pfx-over" : source === "rule" ? "pfx-rule" : "pfx-gap";
   }
   function sourceBadge(cell){
      if (isRedundant(cell)) return el("span", {class: "pfx-badge pfx-b-redundant", text: "= rule",
         title: "override equals the generated form — can be removed"});
      const source = cell.source;
      const text = source === "override" ? "override" : source === "rule" ? "rule" : "gap";
      const cls = source === "override" ? "pfx-b-over" : source === "rule" ? "pfx-b-rule" : "pfx-b-gap";
      return el("span", {class: "pfx-badge " + cls, text: text});
   }
   // Stufe-2-Schreibpfad: leerer Wert oder gleich der Regelform ⇒ kein Override.
   function commitOverride(cell, value, container){
      value = (value || "").trim();
      const dflt = (cell.ruleForms && cell.ruleForms[0]) || "";
      const next = (value === "" || value === dflt) ? "" : value;
      const current = cell.source === "override" ? cell.form : "";
      if (next === current){ renderParadigm(container); return; }
      setOverride(S.entry, cell.slot, next);
      emitChange();
      renderParadigm(container);
   }
   function renderGridCell(cell, container){
      const td = el("td", {class: "pfx-cell " + sourceClass(cell), title: cell.slot});
      const line = el("div", {class: "pfx-cellform"});
      const display = el("span", {class: "pfx-cellval", text: cell.form || "—"});
      display.title = S.readOnly ? cell.slot
         : (cell.ruleForms && cell.ruleForms.length ? "rule: " + cell.ruleForms.join(" | ") : cell.slot)
           + " — click to edit";
      line.appendChild(display);
      line.appendChild(sourceBadge(cell));
      td.appendChild(line);

      function edit(){
         if (S.readOnly) return;
         td.innerHTML = "";
         const inp = el("input", {type: "text", class: "pfx-ov",
            value: cell.source === "override" ? cell.form : ""});
         inp.placeholder = (cell.ruleForms && cell.ruleForms.length)
            ? cell.ruleForms.join(" | ") : "form";
         inp.title = cell.slot + " — Enter=apply, empty=default, Esc=cancel";
         td.appendChild(inp);
         inp.focus();
         inp.select();
         let settled = false;
         function finish(value){ if (settled) return; settled = true; commitOverride(cell, value, container); }
         inp.addEventListener("keydown", e => {
            if (e.key === "Enter"){ e.preventDefault(); finish(inp.value); }
            else if (e.key === "Escape"){ e.preventDefault(); settled = true; renderParadigm(container); }
         });
         inp.addEventListener("blur", () => finish(inp.value));
      }
      display.addEventListener("click", edit);
      display.addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); edit(); } });
      return td;
   }
   function renderBlock(block, container){
      const table = el("table", {class: "pfx-grid"});
      const header = el("tr");
      header.appendChild(el("th", {class: "pfx-corner", text: block.corner || ""}));
      block.columns.forEach(col => header.appendChild(el("th", {class: "pfx-colhead", text: col})));
      table.appendChild(header);
      block.rows.forEach((rowLabel, r) => {
         const tr = el("tr");
         tr.appendChild(el("th", {class: "pfx-rowhead", text: rowLabel}));
         block.cells[r].forEach(cell => tr.appendChild(renderGridCell(cell, container)));
         table.appendChild(tr);
      });
      const box = el("div", {class: "pfx-block"});
      if (block.title) box.appendChild(el("div", {class: "pfx-blocktitle", text: block.title}));
      box.appendChild(table);
      return box;
   }
   function renderTable(spec, container){
      const box = el("div", {class: "pfx-tableblock"});
      if (spec.title) box.appendChild(el("h6", {class: "pfx-h", text: spec.title}));
      const row = el("div", {class: "pfx-blocks"});
      spec.blocks.forEach(block => row.appendChild(renderBlock(block, container)));
      box.appendChild(row);
      return box;
   }

   // Fallback for entries the service could not lay out (unknown paradigm:
   // tables is empty, but overrides still come back and must stay editable).
   function renderFlat(res, container){
      const table = el("table", {class: "pfx-table"});
      table.appendChild(el("tr", null, [
         el("th",{text:"Slot"}), el("th",{text:"Form"}), el("th",{text:"Override"})]));
      res.slots.forEach(cell => {
         const formCell = el("td", {class: "pfx-form " + sourceClass(cell), text: cell.form || "—"});
         formCell.appendChild(sourceBadge(cell));
         const inp = el("input", {type: "text", class: "pfx-ov",
            placeholder: (cell.ruleForms && cell.ruleForms.length)
               ? cell.ruleForms.join(" | ") : "override",
            value: cell.source === "override" ? cell.form : ""});
         inp.disabled = S.readOnly;
         inp.addEventListener("change", () => commitOverride(cell, inp.value, container));
         table.appendChild(el("tr", null, [
            el("td",{class:"pfx-slot",text:cell.label||cell.slot}), formCell,
            el("td",null,[inp])]));
      });
      return table;
   }

   // Stufe 1: delivered stems. One editable box per role, the rule default as
   // placeholder; typing a corrected stem regenerates the whole paradigm.
   function stemBadge(source){
      return source === "stem"
         ? el("span", {class:"pfx-badge pfx-b-over", text:"stem"})
         : el("span", {class:"pfx-badge pfx-b-rule", text:"rule"});
   }
   function renderStems(res, container){
      const roles = res.roles || [];
      if (!roles.length) return null;
      const box = el("div", {class:"pfx-stems"});
      roles.forEach(role => {
         const row = el("div", {class:"pfx-stemrow"});
         row.appendChild(el("span", {class:"pfx-stemrole", text: role.label || role.role}));
         const slot = el("span", {class:"pfx-stembox"});
         row.appendChild(slot);
         box.appendChild(row);

         function edit(){
            if (S.readOnly) return;
            slot.innerHTML = "";
            const input = el("input", {type:"text", class:"pfx-ov pfx-steminp",
               value: role.source === "stem" ? role.stem : ""});
            input.placeholder = role.default || "stem";
            input.title = role.role + " — Enter=apply, empty=rule, Esc=cancel";
            slot.appendChild(input);
            input.focus(); input.select();
            let settled = false;
            function finish(value){
               if (settled) return; settled = true;
               value = (value || "").trim();
               const next = (value === "" || value === role.default) ? "" : value;
               const current = role.source === "stem" ? role.stem : "";
               if (next === current){ renderParadigm(container); return; }
               setStemOverride(S.entry, role.role, next);
               emitChange();
               renderParadigm(container);
            }
            input.addEventListener("keydown", e => {
               if (e.key === "Enter"){ e.preventDefault(); finish(input.value); }
               else if (e.key === "Escape"){ e.preventDefault(); settled = true; renderParadigm(container); }
            });
            input.addEventListener("blur", () => finish(input.value));
         }
         const value = el("span", {class:"pfx-cellval pfx-stemval", text: role.stem || "—"});
         value.title = "rule: " + (role.default || "—") + " — click to correct";
         value.addEventListener("click", edit);
         slot.appendChild(value);
         slot.appendChild(stemBadge(role.source));
      });
      return box;
   }

   async function renderParadigm(container){
      if (isInvariable(S.entry)) return;   // keine Formtabelle, kein /generate
      container.innerHTML = "";
      container.appendChild(el("div",{class:"pfx-muted",text:"Loading paradigm…"}));
      const posInfo = entryPos(S.entry);
      const req = {
         headword: S.entry.value,
         pos: posInfo.base,
         gender: posInfo.gender,
         paradigm: entryParadigm(S.entry),
         stems: stemOverrides(S.entry),
         overrides: overridesMap(S.entry),
      };
      const res = await fetchForms(req);
      container.innerHTML = "";
      const tables = res.tables || [];
      // Unbekanntes Paradigma: Meldung oben, nicht als Fußnote.
      const unknown = !!res.unknownParadigm;
      if (unknown) container.appendChild(el("div", {class:"pfx-note pfx-warn", text:res.note}));
      // Stufe-1-Stammboxen kommen aus den Generator-Rollen (Regel-Default je
      // Rolle) — auch ohne vorhandenen Override, damit man einen anlegen kann.
      const stems = renderStems(res, container);
      if (stems){
         container.appendChild(el("div", {class:"pfx-stemhead",
            text:"Stems (stage 1 — manual correction)"}));
         container.appendChild(stems);
      }
      if (!res.slots.length && !tables.length){
         if (!stems) container.appendChild(el("div",{class:"pfx-note", text:res.note || "no inflection"}));
         return;
      }
      if (tables.length){
         tables.forEach(spec => container.appendChild(renderTable(spec, container)));
         // Overrides outside the paradigm vocabulary must stay editable.
         const covered = {};
         tables.forEach(t => t.blocks.forEach(b => b.cells.forEach(row =>
            row.forEach(cell => { if (cell) covered[cell.slot] = true; }))));
         const stray = (res.slots || []).filter(c => !covered[c.slot]);
         if (stray.length) container.appendChild(renderFlat({slots: stray}, container));
      } else {
         container.appendChild(renderFlat(res, container));
      }

      // Provenienzzeile: was der Generator aufgelöst hat (Verb 87 → 87a/87b).
      const bits = [];
      if (res.family) bits.push("family " + res.family);
      const redundant = (res.slots || []).filter(isRedundant).length;
      if (redundant) bits.push(redundant + " override(s) = rule");
      if (res.resolved && res.resolved !== res.paradigm) {
         bits.push("paradigm " + res.paradigm + " → " + res.resolved);
      }
      if (res.stems) {
         Object.keys(res.stems).forEach(role => {
            if (res.stems[role]) bits.push("stem " + role + " = " + res.stems[role]);
         });
      }
      if (bits.length) container.appendChild(el("div",{class:"pfx-muted",text:bits.join(" · ")}));
      if (res.note && !unknown) container.appendChild(el("div",{class:"pfx-note",text:res.note}));
   }

   function render(){
      const host = unwrap(S.root);
      host.innerHTML = "";
      const wrap = el("div", {class:"pfx-editor"});

      // headword + pos/gender + paradigm (entry / legacy level)
      const head = el("div", {class:"pfx-core"});
      head.appendChild(field("Headword", textInput(S.entry.value, v => {
         S.entry.value = v; emitChange(); renderParadigm(paraBox);
      })));
      const posInfo = entryPos(S.entry);
      const posOptions = [{v:"",t:"—"}].concat(POS_TAGS);
      // Unbekannter NVH-Wert bleibt wählbar, sonst ginge er beim Speichern verloren.
      if (posInfo.base && !posTag(posInfo.base)) posOptions.push({v:posInfo.base, t:posInfo.base});
      head.appendChild(field("POS", select(posOptions, posInfo.base, base => {
            setEntryPos(S.entry, base, entryPos(S.entry).gender);
            emitChange(); render(); // re-render: gender/numtype/paradigm/inflection depend on base
         })));
      if (GENDERED[posInfo.base]){
         head.appendChild(field("Gender", select(
            [{v:"",t:"—"},{v:"masc",t:"masc"},{v:"fem",t:"fem"},{v:"neut",t:"neut"}], posInfo.gender, g => {
               setEntryPos(S.entry, entryPos(S.entry).base, g); emitChange(); renderParadigm(paraBox);
            })));
      }
      const numtype = childValue(S.entry, "numtype", "");
      if (NUMTYPE_POS[posInfo.base] || numtype){
         head.appendChild(field("Numtype", select(
            [{v:"",t:"—"},{v:"card",t:"card"},{v:"ord",t:"ord"}], numtype, v => {
               setEntryNumtype(S.entry, v); emitChange();
            })));
      }
      const tag = posTag(posInfo.base);
      if (!tag || tag.inflects || entryParadigm(S.entry)){
         // Leer ⇄ gesetzt wechselt invariabel ⇄ flektierend: dann erst beim
         // Verlassen des Felds neu aufbauen (render() mitten im Tippen nähme den Fokus).
         const wasInvariable = isInvariable(S.entry);
         const parInp = textInput(entryParadigm(S.entry), v => {
            setEntryParadigm(S.entry, v); emitChange();
            if (isInvariable(S.entry) === wasInvariable) renderParadigm(paraBox);
         });
         parInp.addEventListener("change", () => {
            if (isInvariable(S.entry) !== wasInvariable) render();
         });
         head.appendChild(field("Paradigm", parInp));
      }
      wrap.appendChild(head);

      if (!S.sense){
         const note = el("div", {class:"pfx-note"});
         note.appendChild(el("span", {text: S.readOnly
            ? "This entry has no sense (variant/reference entry). Its structure is preserved on save."
            : "This entry has no sense yet."}));
         if (!S.readOnly){
            const add = el("button", {class:"pfx-add", text:"＋ Add sense"});
            add.addEventListener("click", () => {
               S.sense = addSense(S.entry);
               emitChange();
               render();
            });
            note.appendChild(document.createTextNode(" "));
            note.appendChild(add);
         }
         wrap.appendChild(note);
         host.appendChild(wrap);
         var paraBox = el("div"); // unused, keeps closure refs valid
         return;
      }

      wrap.appendChild(el("h6",{class:"pfx-h",text:"Translations"}));
      const trBox = el("div"); wrap.appendChild(trBox); renderTranslations(trBox);

      const invariable = isInvariable(S.entry);
      if (invariable){
         // Kein Paradigma, keine Formtabelle → /generate gar nicht erst rufen.
         wrap.appendChild(el("div", {class:"pfx-muted", text: posInfo.base === "noun"
            ? "Indeclinable noun (no paradigm)"
            : "Invariable — no paradigm (FST " + posTag(posInfo.base).fst + ")"}));
         var paraBox = el("div"); // detached; renderParadigm returns early anyway
      } else {
         wrap.appendChild(el("h6",{class:"pfx-h",text:"Inflection (generated)"}));
         var paraBox = el("div", {class:"pfx-para"}); wrap.appendChild(paraBox);
      }

      wrap.appendChild(el("h6",{class:"pfx-h",text:"Attestations (read-only)"}));
      const exBox = el("div", {class:"pfx-exlist"}); wrap.appendChild(exBox); renderExamples(exBox);

      host.appendChild(wrap);
      if (!invariable) renderParadigm(paraBox);
   }

   const api = {
      isValid: true,
      editor: function (opts){
         S.root = opts.node;
         S.entry = opts.entry;
         S.readOnly = !!opts.readOnly;
         S.onChange = opts.onChange || (()=>{});
         S.sense = childByName(S.entry, "sense"); // single-sense schema
         if (!S.sense && !S.readOnly && (isNewEntry() || !S.entry.value)){
            S.sense = addSense(S.entry);          // new entry: make one to type into
         }
         render();
         (opts.onValidChange || (()=>{}))(true);
      },
      update: function (entry){
         S.entry = entry;
         S.sense = childByName(S.entry, "sense");
         if (!S.sense && !S.readOnly && (isNewEntry() || !S.entry.value)){
            S.sense = addSense(S.entry);
         }
         render();
      },
      getValue: function (){ return S.entry; },
      destroy: function (){ if (S.root) unwrap(S.root).innerHTML = ""; },
   };
   return api;
})();
