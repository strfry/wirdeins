# Prussian dictionary web (Lexonomy editor + flexsrv)

The web/integration half of the Prussian dictionary. It owns the **Lexonomy
custom entry editor** (uploaded as dictionary config) and `flexsrv`, the HTTP
edge that serves the **real generator's** inflection tables to that editor. The
morphology itself lives in the `fst` repo — this repo only consumes it.

## Layout

- `editor/custom_editor.js` — the editor (contract: `editor()` + `getValue()`,
  plus `update()` / `destroy()` / `isValid`).
- `editor/custom_editor.css` — styles, injected while the editor is mounted.
- `editor/preview.html` — standalone harness with sample entries; calls the service.
- `flexsrv.py` — the flexion service (dev-only, stdlib `http.server`).
- `paradigm_layout.py` — slot cells → table grid, shared with the (future)
  wirdeins compatibility server.
- `engine.py` — locates the `fst` engine (`PRUSSIAN_FST_ROOT` or the sibling
  `../fst`) and re-exports its `generator`.
- `tests/test_flexsrv.py` — service tests (build the atom FSTs on demand).

## Run it (dev)

```bash
(cd ../fst && make atoms)          # build the generator's atom FSTs (once)
uv run python flexsrv.py          # flexion service on http://127.0.0.1:8080
python3 -m http.server -d editor 8777   # → http://localhost:8777/preview.html
```

`preview.html?flex=http://host:port` points the harness at another instance.

## Flexion service contract

`POST /generate` (`Content-Type: application/json`):

```json
{ "headword": "Dēiws", "pos": "noun-masc", "gender": "masc",
  "paradigm": "36", "overrides": {"sg.dat": "deiwu"},
  "stems": {"obl": "dēiw"} }
```

Response:

```json
{ "lemma": "Dēiws", "pos": "noun", "gender": "masc", "paradigm": "36",
  "resolved": "36", "family": "astem", "stems": {"obl": "Dēiw"},
  "roles": [{"role": "obl", "stem": "Dēiw"}],
  "slots": [{"slot": "sg.nom", "label": "Nom. Sg.", "group": "Deklination",
             "role": "obl", "form": "Dēiws", "ruleForms": ["Dēiws"],
             "source": "rule"}],
  "tables": [{"title": null, "blocks": [
     {"title": null, "corner": "Kasus",
      "columns": ["Singular", "Plural"],
      "rows": ["Nominativ", "Genitiv", "Dativ", "Akkusativ"],
      "cells": [[{"slot": "sg.nom", "form": "Dēiws", "source": "rule", …}, …], …]}]}],
  "note": null }
```

- `tables` is the grid of the original wirdeins.twanksta.org: noun/adjective/
  participle = case × number per gender block; adjective adds a `Steigerung`
  and an `Adverb` table; verb = person × tense, then one participle table per
  tense/voice. The editor renders `tables`. `slots` stays as a flat list for
  API consumers (same cells).
- `source ∈ {"rule", "override", "none"}` — `override` wins over `rule`;
  `none` is a grammar gap (still editable, an override fills it).
- Unknown paradigm: `tables: []`, `slots` carries the overrides,
  `resolved: null` and a `note` instead of an error.
- `stems` (Stufe 1) is the NVH `stemOverrides` round-trip; `overrides`
  (Stufe 2) is the per-cell `override` node.
- Other endpoints: `GET /health`, `GET /paradigms?pos=noun`,
  `GET /slots?pos=&paradigm=`. CORS `*`; `OPTIONS` preflight answered.

`resolve_paradigm` handles variants (verb 87 → 87a/87b) from the lemma, so the
`resolved` field may differ from `paradigm`.

The response shape is the same override round-trip as `PLAN_nvh_overrides.md`
(rule < override).

## How it wires into Lexonomy

The fork loads it purely from dictionary config (verified against the fork
source, commit fetched 2026-09-30):

- Backend `ops.py` reads uploaded `custom_editor.js` / `custom_editor.css` into
  `config['editing']['js']` / `['css']`.
- Frontend `js/nvh-store.js` does `new Function("return " + editing.js)()` and
  accepts the returned object because it exposes `.editor()` + `.getValue()`
  (the "new-style" contract; `nvh-store.js:154`).
- `riot/nvh-editor/nvh-custom-editor.riot` mounts it with
  `editor({node, entry, readOnly, onChange, onValidChange})`.
- The raw NVH **"code" tab stays available** as a fallback (`nvh-store.js:47`).

**Upload:** Dictionary → *Configure* → *Entry editing* → custom editor → upload
`custom_editor.js` and `custom_editor.css`.

## NVH shape (real, from `corpus/parsed/twanksta_dmlex.nvh`)

DMLex-flavoured NVH. Note this differs from the stale
`dictionary/internal/core/lexonomy.go` model (which expected `gender`/`override`
under the sense and `paradigm` directly under it):

```
entry: <headword>
  id: <headword>|<paradigm>|<desc>     # composite key (read-only)
  pos: noun                            # bare POS
  gender: masc                         # separate node (nouns)
  paradigm: 56                         # TOP-LEVEL (not under legacy)
  label: MK                            # 0..n source labels
  stemOverrides: obl=Patall pres=rusē  # Stufe 1, role=stem … (lean-NVH shape)
  inflectedForm: <surface form>        # 0..n Stufe 2 override (lean-NVH shape)
    tag: sg.dat                        # slot key
  sense:
    en|de|lt|lv|pl|ru: <translation>   # 0..n each (multi-valued)
    example: <attested form>           # 0..n attested inflected forms
      sourceIdentity / sourceElaboration / label / legacy.desc
  legacy:
    desc: [Advent MK]
  pronunciation: / relation:           # some entries (preserved verbatim)
```

Older entries that fuse `pos: noun-masc` and keep the paradigm under
`legacy.paradigm` are still read; writes go back to wherever the entry keeps the
value.

Design defaults adopted (all reversible):
- **Single sense** — 0/9902 entries have ≥2 senses; if one ever does, the first
  is edited and the rest preserved untouched.
- **pos/gender**: `pos` is the bare POS and `gender` a separate top-level node;
  the editor reads/writes both (falls back to fused `noun-masc`).
- **paradigm** read/written at top-level `paradigm` (falls back to
  `legacy.paradigm`).
- **Stufe 1 (delivered stems)**: entry-level scalar `stemOverrides: role=stem …`
  — the same shape the lean NVH uses (`gen/compress_forms.py`), written in role
  order. A stem equal to the rule default is not stored.
- **Stufe 2 (cell overrides)**: top-level `inflectedForm` node with a `tag`
  child — exactly what `gen/compress_forms.py` writes (NOT an `override` node
  under the sense). Multiple surfaces per slot are collapsed to one on write.
- **examples** shown read-only next to the generated paradigm.
- **every node the editor does not render is preserved in place** so
  `getValue()` never drops data (variant/relation stubs survive untouched).

The editor mutates this tree in place; `getValue()` hands the same root back and
Lexonomy re-normalizes it via `nvhToJson(jsonToNvh(...))`.

## How the editor talks to the service

`fetchForms({headword, pos, gender, paradigm, stems, overrides})` POSTs to
`FLEX_URL + "/generate"` (`FLEX_URL` = `window.PFX_FLEX_URL` or
`http://127.0.0.1:8080`) and renders the returned `tables` as a grid — casus ×
getal per genus, degrees/adverb, or verb tense/mood — exactly like
wirdeins.twanksta.org.

**Two correction levels, both inline (display = editor):**

- **Stufe 1 — stems.** Above the tables, one box per role (`res.roles`: label,
  `stem`, rule `default`, `source`). The rule stem is the default; typing a
  corrected stem regenerates the whole paradigm (e.g. gemination `Patals →
  obl=Patall`, thematic vowel `rusītwei → pres=rusē`, ablaut `kalbītwei →
  pret=kalbē`). Stored as the entry-level `stemOverrides` scalar.
- **Stufe 2 — cells.** Every form is clickable text; clicking turns it into a
  text box. Enter commits the override, an empty box clears it back to the rule
  default, Escape reverts. A value equal to the rule form is stored as no
  override. Stored as a top-level `inflectedForm` node with a `tag` child.

Both are the same round-trip as `PLAN_nvh_overrides.md` (rule < stem <
override): a delivered stem rewrites the rule for its whole role, a cell
override wins over everything for that single slot.

The service is reachable directly via `fetch` (CORS `*`), so no patch to
Lexonomy's backend (`lexonomy.py`) is needed while editing locally. In
production the same contract can be served by the Go `dictionary` service /
`Prussian_MCP`.
