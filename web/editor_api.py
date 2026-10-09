"""Editor-API: Generator-Ausgabe für den Lexonomy-Editor.

Eine Naht: der Editor
(``editor/custom_editor.js``) ruft ``POST /generate`` und bekommt die
Flexionstabelle, die der **echte** Generator liefert — nicht die Mock-Regel
aus dem Editor.

Der Kern kommt unverändert aus ``gen/generator.py``: ``generate(pos, paradigm,
lemma, stems)`` → ``{slot: (form, …)}``, getrieben von den gebauten Atomen in
``build/``. Der Dienst ergänzt nur, was die HTTP-Kante braucht:

* Slot-Reihenfolge nach Rolle (grammatisch, nicht alphabetisch),
* deutsche Slot-/Gruppennamen (der Editor ist eine de-UI),
* das Tabellenraster des Originals (wirdeins.twanksta.org): Kasus × Numerus
  je Genus, Steigerung/Adverb, Verb nach Wijs/Zeit — siehe ``tables``,
* ``source`` je Zelle: ``override`` (aus dem NVH) schlägt ``rule``,
* Zellen **ohne** Form bleiben im Response (Lücken der Grammatik sind
  editierbar — dort greift der Override),
* CORS, weil Lexonomy auf einem anderen Origin läuft.

Endpunkte (als bottle-Routen, ``install(app)``)::

    GET  /health              → {ok, atoms: n, missing: [...]}
    GET  /paradigms?pos=noun  → [{paradigm, family, roles, slots:[…]}]
    GET  /slots?pos=&paradigm=→ {roles, slots:[…]}   (nur Vokabular, kein FST)
    POST /generate            → siehe unten
    OPTIONS *                 → CORS-Preflight

``POST /generate`` Request::

    {"headword": "Dēiws", "pos": "noun-masc", "gender": "masc",
     "paradigm": "36", "overrides": {"sg.dat": "deiwu"},
     "stems": {"obl": "dēiw"}}          # optional, Stufe 1

Response::

    {"lemma": …, "pos": "noun", "gender": "masc", "paradigm": "36",
     "resolved": "36", "family": "astem", "stems": {"obl": "dēiw"},
     "delivered": {"obl": "dēiw"},
     "roles": [{"role": "obl", "label": "Obliquer/Nominalstamm",
                "stem": "dēiw", "default": "dēiw", "source": "stem"}],
     "slots": [{"slot": "sg.nom", "label": "Nom. Sg.", "group": "Deklination",
                "role": "obl", "form": "Dēiws", "ruleForms": ["Dēiws"],
                "source": "rule"}, …],
     "tables": [{"title": …, "blocks": [{"title": …,
                 "columns": ["Singular", "Plural"],
                 "rows": ["Nominativ", …],
                 "cells": [[{…cell…}, …], …]}]}],
     "note": "unknown paradigm '99' for pos='noun'"}

``roles`` ist die Stufe-1-Sicht: je Rolle der wirksame ``stem``, der Regel-
``default`` (ohne gelieferten Stamm) und ``source`` (``stem``/``rule``) — daraus
baut der Editor die Stamm-Textboxen. ``delivered`` sind genau die gelieferten
Stämme (Eingabe), ``stems`` der wirksame Satz.

``slots`` ist die flache Liste (stabil für API-Konsumenten), ``tables`` dieselben
Zellen im Raster des Originals wirdeins.twanksta.org: Nomen/Adjektiv/Partizip =
Kasus × Numerus je Genus, Adjektiv zusätzlich Steigerung/Adverb, Verb = Person ×
Zeit/Wijs. Der Editor rendert ``tables``; ein unbekanntes Paradigma liefert
``tables: []`` und die Overrides weiterhin in ``slots``.

Wortarten (``POS_FAMILY``): noun/adj/verb, pron/num (mit Paradigma über die
adj-Atome) und die invariablen adv/prep/postp/intj/part/cconj/sconj. Ein
invariabler Eintrag (invariable Wortart oder Nomen ohne Paradigma) ist kein
Fehler: ``tables: []``, Overrides in ``slots``, ``note: "invariable (+Adv) — …"``.

Gestartet wird der Dienst über ``flexsrv.py`` (zusammen mit dem
wirdeins-Adapter). Voraussetzung: ``make atoms`` im fst-Repo; ``/health``
sagt, was fehlt.
"""

from __future__ import annotations

import json
import unicodedata
from collections.abc import Mapping
from typing import Any

import bottle

from engine import LOCK
from engine import build_analyzer
from engine import generator as gen
from paradigm_layout import (
    build_tables,
    role_label,
    slot_group,
    slot_label,
    slot_meta,
)

__all__ = ["ApiError", "generate_payload", "health_payload", "install",
           "paradigms_payload", "role_label", "slot_label", "split_pos"]

# NVH-Wortart → Flexionsfamilie des Generators (``None`` = invariabel). Vokabular
# wie fst ``build_analyzer``: offene Klassen + ``INVARIABLE_TAG``; Pronomina/
# Numeralia mit Formtabelle (P21–24) flektieren über die adj-Atome. Kein ``encl`` —
# Enklise ist ein Pronomen-Merkmal (+Pron+Encl), keine Wortart.
POS_FAMILY = {"noun": "noun", "adj": "adj", "verb": "verb",
              "pron": "adj", "num": "adj",
              "adv": None, "prep": None, "postp": None, "intj": None,
              "part": None, "cconj": None, "sconj": None}
POS_CHOICES = tuple(POS_FAMILY)

# ── Anfrage → Response ───────────────────────────────────────────────────────


class ApiError(Exception):
    """Client-Fehler (→ 400) mit deutscher Meldung für die UI."""


def _norm_lemma(text: str) -> str:
    return unicodedata.normalize("NFC", (text or "").strip())


def split_pos(value: str) -> tuple[str, str]:
    """NVH ``noun-masc`` → ``("noun", "masc")`` (POS und Genus sind verschmolzen)."""
    value = (value or "").strip()
    base, _, gender = value.partition("-")
    base = base.lower()
    if base not in POS_CHOICES:
        raise ApiError(f"unknown POS {value!r} (expected: {', '.join(POS_CHOICES)})")
    return base, gender.strip().lower()


def _str_map(raw: Any, field: str) -> dict[str, str]:
    if raw is None:
        return {}
    if not isinstance(raw, dict):
        raise ApiError(f"{field} must be an object")
    out: dict[str, str] = {}
    for key, value in raw.items():
        if value is None or str(value).strip() == "":
            continue
        out[str(key)] = _norm_lemma(str(value))
    return out


def is_invariable(pos: str, paradigm: str) -> bool:
    """Ohne Paradigma invariabel — dieselbe Regel wie ``build_analyzer.classify_entry``
    (invariable Wortart oder indeklinables Nomen); Wortarten ohne Familie immer."""
    if POS_FAMILY.get(pos) is None:
        return True
    return not paradigm and (pos in build_analyzer.INVARIABLE_TAG or pos == "noun")


def _override_cells(overrides: Mapping[str, str]) -> list[dict[str, Any]]:
    return [{"slot": slot, "label": slot_label(slot), "group": slot_group(slot),
             "role": None, "form": form, "ruleForms": [], "source": "override"}
            for slot, form in overrides.items()]


def generate_payload(request: Mapping[str, Any]) -> dict[str, Any]:
    """Der Endpoint-Kern — ohne HTTP, damit Tests ihn direkt aufrufen."""
    headword = _norm_lemma(str(request.get("headword") or ""))
    raw_pos = str(request.get("pos") or "")
    entry_pos, pos_gender = split_pos(raw_pos)
    gender = _norm_lemma(str(request.get("gender") or "")).lower() or pos_gender
    paradigm = str(request.get("paradigm") or "").strip()
    overrides = _str_map(request.get("overrides"), "overrides")
    stems = _str_map(request.get("stems"), "stems")

    if not headword:
        raise ApiError("headword is missing")
    if is_invariable(entry_pos, paradigm):
        tag = ("indeclinable noun" if entry_pos == "noun"
               else build_analyzer.INVARIABLE_TAG.get(entry_pos, entry_pos))
        return {
            "lemma": headword, "pos": entry_pos, "gender": gender,
            "paradigm": paradigm, "resolved": None, "family": None,
            "stems": {}, "delivered": {}, "roles": [], "tables": [],
            "slots": _override_cells(overrides),
            "note": f"invariable ({tag}) — no inflection",
        }
    # pron/num flektieren über die adj-Atome; die Response behält die NVH-Wortart.
    pos = POS_FAMILY[entry_pos]
    if not paradigm:
        raise ApiError("paradigm is missing (Twanksta paradigm number)")
    if gender and gender not in ("masc", "fem", "neut"):
        raise ApiError(f"unknown gender {gender!r} (masc|fem|neut)")

    with LOCK:
        try:
            resolved = gen.resolve_paradigm(pos, paradigm, headword)
            par = gen.paradigm_spec(pos, paradigm, headword)
        except KeyError:
            note = f"unknown paradigm {paradigm!r} for pos={pos!r}"
            # Overrides stay visible: an override is never "gone", just unproducible.
            return {
                "lemma": headword, "pos": entry_pos, "gender": gender,
                "paradigm": paradigm, "resolved": None, "family": None,
                "stems": {}, "delivered": {}, "roles": [], "note": note,
                "tables": [],
                "slots": _override_cells(overrides),
            }
        bad_roles = [role for role in stems if role not in par.roles]
        if bad_roles:
            raise ApiError(f"unknown role(s) {', '.join(map(repr, bad_roles))} "
                           f"for {pos}/{paradigm} (known: {', '.join(par.roles)})")
        try:
            forms_by_slot = gen.generate(pos, paradigm, lemma=headword, stems=stems,
                                         gender=gender or None)
        except FileNotFoundError:
            raise ApiError("generator atoms are missing — run `make atoms`") from None
        except ValueError as exc:
            if "STEM_ALPHABET" in str(exc):
                raise ApiError("a delivered stem contains characters outside "
                               "the allowed alphabet") from None
            raise ApiError(str(exc)) from None
        defaults = gen.default_stems(pos, paradigm, lemma=headword)
        used_stems = dict(defaults)
        used_stems.update(stems)

    meta = {entry["slot"]: entry for entry in slot_meta(pos, resolved, headword)}
    cells: dict[str, dict[str, Any]] = {}
    for entry in meta.values():
        slot = entry["slot"]
        forms = list(forms_by_slot.get(slot, ()))
        if slot in overrides:
            cells[slot] = {**entry, "form": overrides[slot],
                           "ruleForms": forms, "source": "override"}
        else:
            cells[slot] = {**entry, "form": forms[0] if forms else None,
                           "ruleForms": forms, "source": "rule" if forms else "none"}
    cells_list = list(cells.values())
    # Overrides außerhalb des Paradigma-Vokabulars: der Editor darf sie nicht
    # stillschweigend aus dem NVH verlieren.
    extra = []
    for slot, form in overrides.items():
        if slot in meta:
            continue
        extra.append({"slot": slot, "label": slot_label(slot),
                      "group": slot_group(slot), "role": None,
                      "form": form, "ruleForms": [], "source": "override"})
        cells[slot] = extra[-1]

    return {
        "lemma": headword, "pos": entry_pos, "gender": gender,
        "paradigm": paradigm, "resolved": resolved, "family": par.family,
        "stems": used_stems,
        "delivered": dict(stems),
        "roles": [{"role": role, "label": role_label(role),
                   "stem": used_stems.get(role, ""),
                   "default": defaults.get(role, ""),
                   "source": "stem" if role in stems else "rule"}
                  for role in par.roles],
        "slots": cells_list + extra,
        "tables": build_tables(pos, cells, set(meta)),
        "note": None,
    }


def paradigms_payload(pos: str) -> list[dict[str, Any]]:
    """Paradigmen-Liste für die Auswahl im Editor (Vokabular, kein FST-Zugriff)."""
    family = POS_FAMILY.get(pos)
    if not family:
        raise ApiError(f"unknown or invariable POS {pos!r} "
                       f"(expected: {', '.join(p for p, f in POS_FAMILY.items() if f)})")
    out = []
    for (par_pos, paradigm), par in sorted(gen.PARADIGMS.items()):
        if par_pos != family:
            continue
        roles = []
        for role, spec in par.roles.items():
            slots = [s for s in spec.slots]
            roles.append({"role": role, "slots": [
                {"slot": s, "label": slot_label(s), "group": slot_group(s)}
                for s in slots]})
        out.append({"pos": pos, "paradigm": paradigm, "family": par.family,
                    "roles": roles,
                    "atoms": [gen.atom_name(family, paradigm, role)
                              for role in par.roles]})
    return out


def health_payload() -> dict[str, Any]:
    """Ist der Generator lauffähig? (Atome gebaut, Genus-Vokabular vorhanden.)"""
    missing = [path.name for _, _, _, path in gen.atom_targets()
               if not path.exists()]
    return {"ok": not missing, "atoms": len(gen.atom_targets()),
            "missing": missing,
            "accent": (gen.ATOM_DIR / "gen-accent.hfst").exists(),
            "pos": list(POS_CHOICES)}


# ── HTTP (bottle) ────────────────────────────────────────────────────────────

# CORS: der Editor läuft auf dem Lexonomy-Origin.
_CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
}


def _json(code: int, payload: Any) -> bottle.HTTPResponse:
    body = json.dumps(payload, ensure_ascii=False)
    return bottle.HTTPResponse(
        body=body, status=code,
        headers={"Content-Type": "application/json; charset=utf-8", **_CORS})


def _api(handler):
    """ApiError/KeyError/ValueError → 400, alles andere → 500 — immer als JSON."""
    def wrapped(*args, **kwargs):
        try:
            return _json(200, handler(*args, **kwargs))
        except (ApiError, KeyError, ValueError) as exc:
            return _json(400, {"error": str(exc)})
        except Exception as exc:       # noqa: BLE001  # pragma: no cover (500)
            print(f"[editor-api] intern: {exc!r}", flush=True)
            return _json(500, {"error": f"Generator-Fehler: {exc}"})
    return wrapped


def _query(name: str, default: str = "") -> str:
    return bottle.request.query.getunicode(name, default=default) or default


def install(app: bottle.Bottle) -> None:
    """Die Editor-Endpunkte (``/health``, ``/paradigms``, ``/slots``, ``/generate``)."""

    @app.get("/health")
    @_api
    def health():
        return health_payload()

    @app.get("/paradigms")
    @_api
    def paradigms():
        pos = _query("pos", "noun").lower()
        return {"pos": pos, "paradigms": paradigms_payload(pos)}

    @app.get("/slots")
    @_api
    def slots():
        pos = _query("pos").lower()
        paradigm = _query("paradigm")
        lemma = _query("lemma")
        family = POS_FAMILY.get(pos)
        if not family:
            raise ApiError("pos is missing or invariable (noun|adj|verb|pron|num)")
        resolved = gen.resolve_paradigm(family, paradigm, lemma)
        return {"pos": pos, "paradigm": paradigm, "resolved": resolved,
                "slots": slot_meta(family, resolved, lemma)}

    @app.post("/generate")
    @_api
    def generate():
        raw = bottle.request.body.read()
        try:
            request = json.loads(raw.decode("utf-8")) if raw else {}
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ApiError(f"invalid JSON: {exc}") from None
        if not isinstance(request, dict):
            raise ApiError("request body must be a JSON object")
        return generate_payload(request)

    # Preflight nur für die Editor-Pfade — ein OPTIONS-Catch-all ließe jeden
    # unbekannten GET mit 405 statt 404 enden.
    for path in ("/health", "/paradigms", "/slots", "/generate"):
        app.route(path, method="OPTIONS", callback=_preflight)


def _preflight() -> bottle.HTTPResponse:
    return bottle.HTTPResponse(status=204, headers={**_CORS, "Content-Length": "0"})
