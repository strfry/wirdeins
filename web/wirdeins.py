"""wirdeins-Kompatibilitätsadapter: der HTTP-Vertrag von wirdeins.twanksta.org.

Das gespiegelte Frontend (``wirdeins/``: ``index.html`` + ``source/app_n-min.js``)
spricht drei Fragment-Endpunkte an und setzt die zurückgelieferten HTML-Stücke
unverändert in die Seite:

    GET  /search/?s=&language=&dia=    → #results
    GET  /auto/?s=&language=&dia=      → #suggest-wrap
    POST /more/  word=&numb=&desc=     → .spoiler-body (Formtabelle)

Die Formen einer Tabelle kommen aus ``entry_cells`` — das ist **dieselbe**
Zellberechnung, mit der der Analyzer gebacken wird
(``build_analyzer.entry_forms``: ``generate(Stufe 0/1) ⊕ Overrides``, ein Override
ersetzt den Slot). wirdeins zeigt also genau die Formen, die der Analyzer
erkennt, und denselben Stand wie der Editor — ohne eigenen Build-Schritt.
"""

from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
from pathlib import Path
from typing import Any

import bottle
from jinja2 import Environment, FileSystemLoader, select_autoescape

from engine import LOCK
from engine import build_analyzer as ba
from engine import generator as gen
from store import Entry, Store

HERE = Path(__file__).resolve().parent
STATIC = HERE / "wirdeins"

_templates = Environment(
    loader=FileSystemLoader(HERE / "templates"),
    autoescape=select_autoescape(default=True, default_for_string=True),
    keep_trailing_newline=True,
)

# twanksta-Sprachcodes auf der Leitung → unsere Übersetzungs-Knoten in der NVH.
LEGACY_LANG = {"engl": "en", "miks": "de", "leit": "lt", "latt": "lv",
               "pols": "pl", "mask": "ru"}


def parse_lang(code: str) -> str:
    return LEGACY_LANG.get(code, "en")     # Default wie die Auswahl im Frontend


# ── Formen ───────────────────────────────────────────────────────────────────

Cells = Mapping[str, Sequence[str]]


def entry_cells(entry: Entry) -> dict[str, tuple[str, ...]]:
    """Slot → Formen des Eintrags, exakt wie im Analyzer gebacken."""
    if not entry.inflects:
        return {}
    with LOCK:
        cells = ba.entry_forms(entry.morph)
    if ba.pos_head(entry.morph):
        # Numeralia/Pronomina steigern nicht: nur Positiv- bzw. Nomen-Slots.
        keep = set(gen.NOUN_SLOTS if entry.family == "noun" else gen.ADJ_POS_SLOTS)
        cells = {slot: forms for slot, forms in cells.items() if slot in keep}
    return {slot: tuple(sorted(forms)) for slot, forms in cells.items() if forms}


def _cell(cells: Cells, slot: str) -> str:
    """Anzeige einer Zelle; Varianten eines Slots stehen nebeneinander."""
    return ", ".join(cells.get(slot, ()))


# ── Tabellen (Slot → Raster des Originals) ───────────────────────────────────

_CASES = (("Nominative", "nom"), ("Genitive", "gen"),
          ("Dative", "dat"), ("Accusative", "acc"))
# Anzeige-Genus des Originals ↔ Genus-Komponente der Slot-Keys.
_GENDERS = (("masc", "msc"), ("fem", "fem"), ("neut", "neu"))


def _gender_table(cells: Cells, prefix: str, gender: str, slot_gender: str,
                  width: str) -> dict[str, Any]:
    head = f"{prefix}.{slot_gender}" if prefix else slot_gender
    return {"width": width, "gender": gender, "rows": [
        {"case": label, "sg": _cell(cells, f"{head}.sg.{case}"),
         "pl": _cell(cells, f"{head}.pl.{case}")}
        for label, case in _CASES]}


def _spoiler_trio(cells: Cells, prefix: str, closed: bool) -> dict[str, Any]:
    trio = {gender: _gender_table(cells, prefix, gender, slot_gender, "98%")
            for gender, slot_gender in _GENDERS}
    return {"title": _cell(cells, f"{prefix}.msc.sg.nom"), "closed": closed, **trio}


def noun_view(entry: Entry, cells: Cells) -> dict[str, Any]:
    return {"gender": entry.gender, "rows": [
        {"case": label, "sg": _cell(cells, f"sg.{case}"),
         "pl": _cell(cells, f"pl.{case}")}
        for label, case in _CASES]}


def adj_view(entry: Entry, cells: Cells) -> dict[str, Any]:
    view = {gender: _gender_table(cells, "", gender, slot_gender, "auto")
            for gender, slot_gender in _GENDERS}
    return {**view,
            "positive": _cell(cells, "msc.sg.nom"),
            "cmp": _spoiler_trio(cells, "comp", closed=False),
            "sup": _spoiler_trio(cells, "superl", closed=False),
            "adv": _cell(cells, "adv"),
            "adv_cmp": _cell(cells, "adv.comp"),
            "adv_sup": _cell(cells, "adv.superl")}


# Die sechs Pronomen-Zeilen einer finiten Zeitform (3. Person numerusfusioniert).
_FINITE_ROWS = (("as", "sg1"), ("tū", "sg2"), ("tāns/tenā/tennan", "sp3"),
                ("mes", "pl1"), ("jūs", "pl2"), ("tenēi/tennas", "sp3"))

# Perfekt/Futur sind periphrastisch: Hilfsverb + kongruierendes Part.Perf.Akt.
# im Nominativ. Das sind keine Slots — die Hilfsverbformen sind feste
# Funktionswörter nur für diese Darstellung. (Pronomen, Perf-Aux, Fut-Aux,
# Partizip-Slots: zwei = „masc / fem“, einer = neutrum.)
_PERIPHRASTIC = (
    ("as", "asma", "wīrst", ("msc.sg", "fem.sg")),
    ("tū", "assei", "wīrst", ("msc.sg", "fem.sg")),
    ("tāns/tenā", "ast", "wīrst", ("msc.sg", "fem.sg")),
    ("tennan", "ast", "wīrst", ("neu.sg",)),
    ("mes", "asmai", "wīrstmai", ("msc.pl", "fem.pl")),
    ("jūs", "astei", "wīrstei", ("msc.pl", "fem.pl")),
    ("tenēi/tennas", "ast", "wīrst", ("msc.pl", "fem.pl")),
)

_PARTICIPLES = (("Present", "part.prs.act", False),
                ("Past", "part.prf.act", True),
                ("Passive", "part.prf.pss", True))


def verb_view(entry: Entry, cells: Cells) -> dict[str, Any]:
    def finite(tense: str) -> list[dict[str, str]]:
        return [{"pronoun": pronoun, "form": _cell(cells, f"{tense}.{pn}")}
                for pronoun, pn in _FINITE_ROWS]

    def periphrastic(aux_index: int) -> list[dict[str, str]]:
        lines = []
        for row in _PERIPHRASTIC:
            part = " / ".join(_cell(cells, f"part.prf.act.{gn}.nom") for gn in row[3])
            lines.append({"pronoun": row[0], "form": f"{row[aux_index]} {part}"})
        return lines

    return {
        "present": finite("prs"), "past": finite("prt"),
        "perfect": periphrastic(1), "future": periphrastic(2),
        "subjunctive": finite("subj"),
        "optative": _cell(cells, "opt"),
        "imp_sg": _cell(cells, "imprt.sg2"), "imp_pl": _cell(cells, "imprt.pl2"),
        "participles": [{"label": label,
                         "spoiler": _spoiler_trio(cells, prefix, closed)}
                        for label, prefix, closed in _PARTICIPLES],
    }


_VIEWS = {"noun": noun_view, "adj": adj_view, "verb": verb_view}


def render_forms(entry: Entry) -> str:
    """Formtabelle eines Eintrags als Legacy-HTML ('' ohne Flexion)."""
    view = _VIEWS.get(entry.family or "")
    if view is None:
        return ""
    return _templates.get_template(f"{entry.family}.html").render(
        **view(entry, entry_cells(entry)))


# ── Fragmente ────────────────────────────────────────────────────────────────


def render_search(store: Store, query: str, lang: str) -> str:
    hits = store.search(query, lang)
    if not hits:
        return "<div id='search-status'>Nothing was found.</div>"
    results = [{"word": e.headword, "numb": e.paradigm, "gender": e.gender,
                "desc": e.desc, "senses": e.translations.get(lang, ()),
                "has_forms": e.inflects} for e in hits]
    return _templates.get_template("search.html").render(results=results)


def render_auto(store: Store, prefix: str, lang: str) -> str:
    suggestions = []
    for e in store.suggest(prefix, lang, limit=10):
        senses = e.translations.get(lang, ())
        suggestions.append({"word": e.headword, "first": senses[0] if senses else ""})
    return _templates.get_template("auto.html").render(suggestions=suggestions)


def pick_entries(store: Store, word: str, numb: str = "", desc: str = "") -> list[Entry]:
    """Die Einträge zu einem „Show form“-Klick.

    Das Frontend schickt Headword, ``numb`` (Paradigma) und ``desc`` des
    angeklickten Treffers zurück; damit wird unter Homonymen der gemeinte
    Eintrag gewählt. Passt kein Filter, bleiben alle Einträge des Headwords.
    """
    candidates = store.lookup(word)
    for key, wanted in ((lambda e: e.paradigm, numb), (lambda e: e.desc, desc)):
        wanted = wanted.strip()
        if len(candidates) > 1 and wanted:
            narrowed = [e for e in candidates if key(e).strip() == wanted]
            candidates = narrowed or candidates
    return candidates


def render_more(store: Store, word: str, numb: str = "", desc: str = "") -> str:
    return "".join(render_forms(e) for e in pick_entries(store, word, numb, desc))


# ── HTTP (bottle) ────────────────────────────────────────────────────────────


def _html(body: str) -> str:
    bottle.response.content_type = "text/html; charset=utf-8"
    return body


def install(app: bottle.Bottle, current: Callable[[], Store],
            static_dir: Path = STATIC) -> None:
    """Die Fragment-Endpunkte und das statische Frontend unter ``/``.

    ``current`` liefert den jeweils aktuellen Store (der Watcher tauscht ihn aus).
    """

    @app.get("/search/")
    def search():
        q = bottle.request.query.decode()
        return _html(render_search(current(), q.get("s", ""), parse_lang(q.get("language", ""))))

    @app.get("/auto/")
    def auto():
        q = bottle.request.query.decode()
        return _html(render_auto(current(), q.get("s", ""), parse_lang(q.get("language", ""))))

    @app.post("/more/")
    def more():
        f = bottle.request.forms.decode()
        # `dia` (semba|pameddi) wird noch nicht ausgewertet: Dialektvarianten
        # gibt es im Generator bisher nicht.
        return _html(render_more(current(), f.get("word", ""), f.get("numb", ""),
                                 f.get("desc", "")))

    @app.get("/")
    def index():
        return bottle.static_file("index.html", root=str(static_dir))

    @app.get("/<path:path>")
    def static(path):
        return bottle.static_file(path, root=str(static_dir))
