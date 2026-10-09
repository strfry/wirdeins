"""Paradigma-Layout: Slot-Zellen → Tabellenraster (wie wirdeins.twanksta.org).

Die Editor-API (``editor_api``) liefert das Raster als JSON an den
Lexonomy-Editor. (Der wirdeins-Adapter rendert das Legacy-HTML mit eigenen,
vom Original mitgeschnittenen Templates.) Reine Abbildung — kein HTTP, kein IO.

Die Slot-Beschriftungen und das Raster stehen hier (nicht im Generator), damit
der Generator datenfrei bleibt und beide Konsumenten dieselbe Anzeige bekommen.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from engine import generator as gen

# ── Slot-Beschriftung ────────────────────────────────────────────────────────
# Der Generator kennt nur die Key-Vokabulare (_GENDER/_NUMBER/_CASE/…); die
# deutschen Namen der Anzeige stehen hier, damit der Generator datenfrei
# bleibt und der Dienst trotzdem eine fertige Tabelle liefert.

_GENDER_EN = {"msc": "Masc.", "fem": "Fem.", "neu": "Neut."}
_NUMBER_EN = {"sg": "Sg.", "pl": "Pl."}
_CASE_EN = {"nom": "Nom.", "gen": "Gen.", "dat": "Dat.", "acc": "Acc."}
_PERSON_EN = {"sg1": "1st Sg.", "sg2": "2nd Sg.", "sp3": "3rd Sg./Pl.",
              "pl1": "1st Pl.", "pl2": "2nd Pl."}
_DEGREE_EN = {"comp": "Comparative", "superl": "Superlative"}
_PART_TENSE_EN = {"prs": "Pres.", "prf": "Perf."}
_PART_VOICE_EN = {"act": "Active", "pss": "Passive"}
_FINITE_EN = {"prs": "Present", "prt": "Past"}

# Slot prefix → group (group order = table order).
_GROUPS: tuple[tuple[tuple[str, ...], str], ...] = (
    (("sg", "pl"), "Declension"),
    (("msc", "fem", "neu"), "Positive"),
    (("comp",), "Comparative"),
    (("superl",), "Superlative"),
    (("adv",), "Adverb"),
    (("prs",), "Present"),
    (("prt",), "Past"),
    (("subj",), "Subjunctive"),
    (("opt",), "Optative"),
    (("imprt",), "Imperative"),
    (("part",), "Participle"),
)
_GROUP_OF = {head: name for heads, name in _GROUPS for head in heads}

# Stufe-1 roles → display name. A role is one atom FST (one stem); the names
# say which stem the user is correcting.
_ROLE_LABEL = {
    "obl": "Oblique/nominal stem",
    "pos": "Positive stem",
    "adv": "Adverb stem",
    "cmp": "Comparative stem",
    "sup": "Superlative stem",
    "pres": "Present stem",
    "pret": "Past stem",
    "nonfin": "Infinitive/non-finite stem",
    "partPresAct": "Present participle stem",
    "partPerfAct": "Past active participle stem",
    "partPerfPass": "Past passive participle stem",
}


def role_label(role: str) -> str:
    return _ROLE_LABEL.get(role, role)


def slot_label(slot: str) -> str:
    """``comp.msc.sg.nom`` → ``Comparative Masc. Nom. Sg.`` (unknown → key).

    Total: an override with a made-up slot key must not raise — the key comes
    back unchanged.
    """
    try:
        return _slot_label(slot)
    except KeyError:
        return slot


def _slot_label(slot: str) -> str:
    parts = slot.split(".")
    head = parts[0]
    if head in gen._NUMBER and len(parts) == 2:                 # noun
        return f"{_CASE_EN[parts[1]]} {_NUMBER_EN[head]}"
    if head in _GENDER_EN and len(parts) == 3:                   # adj. positive
        return f"{_GENDER_EN[head]} {_CASE_EN[parts[2]]} {_NUMBER_EN[parts[1]]}"
    if head in _DEGREE_EN and len(parts) == 4:                   # adj. comp/superl
        return (f"{_DEGREE_EN[head]} {_GENDER_EN[parts[1]]} "
                f"{_CASE_EN[parts[3]]} {_NUMBER_EN[parts[2]]}")
    if head == "adv":
        return "Adverb" if len(parts) == 1 else f"Adverb ({_DEGREE_EN[parts[1]]})"
    if head == "part" and len(parts) == 6:
        return (f"Part. {_PART_TENSE_EN[parts[1]]} {_PART_VOICE_EN[parts[2]]} "
                f"{_GENDER_EN[parts[3]]} {_CASE_EN[parts[5]]} {_NUMBER_EN[parts[4]]}")
    if head in gen._FINITE_TENSE and len(parts) == 2:            # finite verb
        return f"{_FINITE_EN[head]} {_PERSON_EN[parts[1]]}"
    if head == "subj" and len(parts) == 2:
        return f"Subjunctive {_PERSON_EN[parts[1]]}"
    if head == "opt":
        return "Optative 3rd Sg."
    if head == "imprt" and len(parts) == 2:
        return f"Imperative {_PERSON_EN[parts[1]]}"
    return slot


def slot_group(slot: str) -> str:
    return _GROUP_OF.get(slot.split(".")[0], "Inflection")


def slot_meta(pos: str, paradigm: str, lemma: str = "") -> list[dict[str, str]]:
    """Slot-Vokabular des Paradigmas in Rollenreihenfolge, je Slot seine IDs."""
    try:
        par = gen.paradigm_spec(pos, paradigm, lemma)
    except KeyError:
        return []
    meta: dict[str, dict[str, str]] = {}
    for role, spec in par.roles.items():
        for slot in spec.slots:
            meta.setdefault(slot, {"slot": slot, "label": slot_label(slot),
                                   "group": slot_group(slot), "role": role})
    return list(meta.values())


# ── Tabellenlayout (wie wirdeins.twanksta.org) ───────────────────────────────
# Der Generator liefert Zellen flach; das Original ordnet sie zu Matrizen:
# Nomen/Adjektiv/Partizip = Kasus (Zeile) × Numerus (Spalte), ein Block je Genus;
# Adjektiv zusätzlich Steigerung + Adverb; Verb = Person (Zeile) × Zeit/Wijs
# (Spalte). Die Struktur steht hier, damit der Editor nur noch rendert.

_CASE_ROWS = (("nom", "Nominative"), ("gen", "Genitive"),
              ("dat", "Dative"), ("acc", "Accusative"))
_NUM_COLS = (("sg", "Singular"), ("pl", "Plural"))
_GENDER_BLOCKS = (("msc", "Masculine"), ("fem", "Feminine"), ("neu", "Neuter"))
_PERSON_ROWS = (("sg1", "1st Sg."), ("sg2", "2nd Sg."), ("sp3", "3rd Sg./Pl."),
                ("pl1", "1st Pl."), ("pl2", "2nd Pl."))
_DEGREES = (("", "Positive"), ("comp", "Comparative"), ("superl", "Superlative"))
_PARTICIPLES = (("part.prs.act", "Present participle active"),
                ("part.prf.act", "Past participle active"),
                ("part.prf.pss", "Past participle passive"))


def _blank_cell(slot: str) -> dict[str, Any]:
    """Zelle ohne Regelform: im Raster sichtbar und overridbar (Lücke)."""
    return {"slot": slot, "label": slot_label(slot), "group": slot_group(slot),
            "role": None, "form": None, "ruleForms": [], "source": "none"}


def _declension_table(title: str, prefix: str, gendered: bool,
                      cells: Mapping[str, dict], present: set[str],
                      corner: str = "Case") -> dict[str, Any] | None:
    """Kasus × Numerus, ein Block je Genus (bzw. ein Block ohne Genus)."""
    genders = _GENDER_BLOCKS if gendered else ((None, None),)
    blocks: list[dict[str, Any]] = []
    seen = False
    for gender, glabel in genders:
        matrix = []
        for case, _ in _CASE_ROWS:
            row = []
            for number, _ in _NUM_COLS:
                parts = ([prefix] if prefix else []) \
                    + ([gender] if gender else []) + [number, case]
                slot = ".".join(parts)
                seen = seen or slot in present
                row.append(dict(cells.get(slot) or _blank_cell(slot)))
            matrix.append(row)
        blocks.append({"title": glabel, "corner": corner,
                       "columns": [label for _, label in _NUM_COLS],
                       "rows": [label for _, label in _CASE_ROWS],
                       "cells": matrix})
    return {"title": title or None, "blocks": blocks} if seen else None


def _one_row_table(title: str, specs: list[tuple[str, str]],
                   cells: Mapping[str, dict], present: set[str],
                   columns: list[str]) -> dict[str, Any] | None:
    """Eine Zeile mit benannten Spalten (Steigerung, Adverb, Optativ)."""
    row = []
    seen = False
    for slot, _ in specs:
        seen = seen or slot in present
        row.append(dict(cells.get(slot) or _blank_cell(slot)))
    if not seen:
        return None
    return {"title": title or None, "blocks": [{
        "title": None, "corner": "", "columns": columns,
        "rows": [""], "cells": [row]}]}


def build_tables(pos: str, cells: Mapping[str, dict],
                  present: set[str]) -> list[dict[str, Any]]:
    """Slots → Tabellenblöcke in der Reihenfolge des Originals."""
    tables: list[dict[str, Any]] = []

    if pos == "noun":
        table = _declension_table("", "", gendered=False, cells=cells,
                                  present=present)
        if table:
            tables.append(table)
        return tables

    if pos == "adj":
        pos_table = _declension_table("", "", gendered=True, cells=cells,
                                      present=present)
        if pos_table:
            tables.append(pos_table)
        cmp_table = _one_row_table(
            "Comparison",
            [(f"{degree}.msc.sg.nom", label) for degree, label in _DEGREES[1:]],
            cells, present, ["Positive", "Comparative", "Superlative"])
        if cmp_table:
            # Positiv-Spalte zuerst, dann die beiden Gradformen.
            cmp_table["blocks"][0]["cells"][0].insert(
                0, dict(cells.get("msc.sg.nom") or _blank_cell("msc.sg.nom")))
            tables.append(cmp_table)
        # Steigerung dekliniert wie der Positiv (3 Genera × 4 Kasus × 2 Numeri).
        for prefix, label in (("comp", "Comparative"), ("superl", "Superlative")):
            degree_table = _declension_table(label, prefix, gendered=True,
                                             cells=cells, present=present)
            if degree_table:
                tables.append(degree_table)
        adv_table = _one_row_table(
            "Adverb",
            [("adv", "Adverb"), ("adv.comp", "Komparativ"), ("adv.superl", "Superlativ")],
            cells, present, ["Positive", "Comparative", "Superlative"])
        if adv_table:
            tables.append(adv_table)
        return tables

    # pos == "verb": finit nach Wijs, danach Partizipien als Deklination.
    present_tenses = [t for t in ("prs", "prt") if any(
        f"{t}.{person}" in present for person, _ in _PERSON_ROWS)]
    if present_tenses:
        matrix = []
        for person, _ in _PERSON_ROWS:
            matrix.append([dict(cells.get(f"{tense}.{person}")
                                or _blank_cell(f"{tense}.{person}"))
                           for tense in present_tenses])
        tables.append({"title": "Indicative", "blocks": [{
            "title": None, "corner": "Person",
            "columns": [_FINITE_EN[t].capitalize() for t in present_tenses],
            "rows": [label for _, label in _PERSON_ROWS], "cells": matrix}]})

    if any(f"subj.{person}" in present for person, _ in _PERSON_ROWS):
        matrix = [[dict(cells.get(f"subj.{person}") or _blank_cell(f"subj.{person}"))]
                  for person, _ in _PERSON_ROWS]
        tables.append({"title": "Subjunctive", "blocks": [{
            "title": None, "corner": "Person", "columns": [""],
            "rows": [label for _, label in _PERSON_ROWS], "cells": matrix}]})

    if "opt" in present:
        tables.append(_one_row_table("Optative", [("opt", "3rd Sg.")],
                                     cells, present, ["3. Sg."]))
    if any(f"imprt.{person}" in present for person in ("sg2", "pl2")):
        matrix = [[dict(cells.get(f"imprt.{person}") or _blank_cell(f"imprt.{person}"))]
                  for person in ("sg2", "pl2")]
        tables.append({"title": "Imperative", "blocks": [{
            "title": None, "corner": "Person", "columns": [""],
            "rows": ["2nd Sg.", "2nd Pl."], "cells": matrix}]})

    for prefix, label in _PARTICIPLES:
        table = _declension_table(label, prefix, gendered=True,
                                  cells=cells, present=present)
        if table:
            tables.append(table)

    return [t for t in tables if t]


