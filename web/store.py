"""Wörterbuch-Store: die Einträge der Lexonomy-SQLite im Speicher.

Quelle ist die Dictionary-SQLite von Lexonomy (``entries.nvh``) — die einzige
editierbare Quelle. Der Store hält alle Einträge (10k, winzig) im RAM und
beantwortet Lookup/Suche/Autocomplete für den wirdeins-Adapter; Formen erzeugt
er nicht (siehe ``wirdeins.entry_cells``).

Morphologische Felder (``pos``, ``gender``, ``paradigm``, ``stemOverrides``,
``inflectedForm``/``tag``) liest **derselbe** NVH-Leser wie der Analyzer-Bake
(``fst/gen/compress_forms.parse_nvh``) — es gibt genau eine Lesart dieser Felder.
Für die Anzeige (Übersetzungen, ``legacy.desc``) wird der Eintrag zusätzlich als
Baum gelesen.

Aktualität: ``Watcher`` fragt jede Sekunde ``max(history.id)`` ab. Lexonomy
schreibt bei jedem Speichern/Anlegen/Löschen eine ``history``-Zeile; die
``entry_id``s seit dem letzten Stand werden einzeln nachgeladen. Bei einem
Re-Import (History gelöscht/umgeschrieben) oder einer großen Änderungsmenge wird
alles neu geladen.
"""

from __future__ import annotations

import logging
import sqlite3
import threading
import unicodedata
from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field
from pathlib import Path

from engine import build_analyzer as ba
from engine import compress_forms as cf

log = logging.getLogger(__name__)

LANGS = ("en", "de", "lt", "lv", "pl", "ru")

# Ab so vielen geänderten Einträgen seit dem letzten Stand: komplett neu laden.
FULL_RELOAD_THRESHOLD = 500


# ── NVH als Baum (nur für die Anzeige-Felder) ────────────────────────────────


@dataclass
class Node:
    name: str
    value: str
    children: list[Node] = field(default_factory=list)

    def first(self, name: str) -> Node | None:
        return next((c for c in self.children if c.name == name), None)


def parse_tree(text: str) -> list[Node]:
    """NVH → Wurzelknoten. Tiefe = Einrückung; ``name: value`` am ersten ``:``."""
    roots: list[Node] = []
    stack: list[tuple[int, Node]] = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        indent = len(line) - len(line.lstrip(" \t"))
        name, _, value = stripped.partition(":")
        node = Node(name.strip(), value.strip())
        while stack and stack[-1][0] >= indent:
            stack.pop()
        (stack[-1][1].children if stack else roots).append(node)
        stack.append((indent, node))
    return roots


# ── Eintrag ──────────────────────────────────────────────────────────────────


def _nfc(text: str) -> str:
    return unicodedata.normalize("NFC", text)


def fold(text: str) -> str:
    """Diakritika-unempfindlich wie twanksta: ā/ē/ī/ō/ū dürfen als a/e/i/o/u getippt werden."""
    text = _nfc(text).lower()
    for long, short in (("ā", "a"), ("ē", "e"), ("ī", "i"), ("ō", "o"), ("ū", "u")):
        text = text.replace(long, short)
    return text


@dataclass(frozen=True)
class Entry:
    """Ein Lexonomy-Eintrag (= eine Lesart; Homonyme sind eigene Einträge)."""

    id: int
    headword: str
    morph: cf.Entry                      # morphologische Felder, Analyzer-Lesart
    desc: str = ""
    translations: Mapping[str, tuple[str, ...]] = field(default_factory=dict)

    @property
    def paradigm(self) -> str:
        return self.morph.paradigm

    @property
    def gender(self) -> str:
        return self.morph.gender

    @property
    def family(self) -> str | None:
        """Flexionsfamilie wie im Analyzer: ``noun``/``adj``/``verb``, ``invar`` oder None."""
        return ba.classify_entry(self.morph)

    @property
    def inflects(self) -> bool:
        return self.family in ("noun", "adj", "verb")


def parse_entry(entry_id: int, nvh: str) -> Entry | None:
    """Eine ``entries.nvh``-Zelle → Entry (None, wenn sie keinen ``entry:``-Knoten hat)."""
    root = next((n for n in parse_tree(nvh) if n.name == "entry"), None)
    morphs = cf.parse_nvh(nvh)
    if root is None or not morphs:
        return None
    translations: dict[str, list[str]] = {}
    for sense in (c for c in root.children if c.name == "sense"):
        for child in sense.children:
            if child.name in LANGS and child.value:
                translations.setdefault(child.name, []).append(child.value)
    legacy = root.first("legacy")
    desc_node = legacy.first("desc") if legacy else None
    return Entry(
        id=entry_id,
        headword=_nfc(root.value),
        morph=morphs[0],
        desc=desc_node.value if desc_node else "",
        translations={lang: tuple(vs) for lang, vs in translations.items()},
    )


# ── Store ────────────────────────────────────────────────────────────────────


class Store:
    """Unveränderlicher Schnappschuss; Änderungen erzeugen einen neuen Store."""

    def __init__(self, entries: Iterable[Entry], cursor: int = 0) -> None:
        self.cursor = cursor                       # max(history.id) dieses Stands
        self.entries: dict[int, Entry] = {e.id: e for e in entries}
        ordered = sorted(self.entries.values(), key=lambda e: (e.headword, e.id))
        self._ordered = ordered
        self._by_word: dict[str, list[Entry]] = {}
        for e in ordered:
            self._by_word.setdefault(e.headword, []).append(e)
        # Vorab gefaltet: Suche/Autocomplete scannen linear über 10k Einträge.
        self._folded = [(e, fold(e.headword),
                         {lang: tuple(fold(t) for t in ts)
                          for lang, ts in e.translations.items()})
                        for e in ordered]

    def __len__(self) -> int:
        return len(self.entries)

    def with_changes(self, changed: Mapping[int, Entry | None], cursor: int) -> Store:
        """Neuer Store: ``changed[id] = Entry`` ersetzt/fügt hinzu, ``None`` löscht."""
        entries = dict(self.entries)
        for entry_id, entry in changed.items():
            if entry is None:
                entries.pop(entry_id, None)
            else:
                entries[entry_id] = entry
        return Store(entries.values(), cursor)

    def lookup(self, word: str) -> list[Entry]:
        """Alle Einträge mit genau diesem Headword, in ID-Reihenfolge."""
        return list(self._by_word.get(_nfc(word.strip()), ()))

    def search(self, query: str, lang: str) -> list[Entry]:
        """Teilstring im Headword ODER in einer Übersetzung (Richtung automatisch)."""
        q = fold(query.strip())
        if not q:
            return []
        return [e for e, word, trans in self._folded
                if q in word or any(q in t for t in trans.get(lang, ()))]

    def suggest(self, prefix: str, lang: str, limit: int = 10) -> list[Entry]:
        """Präfix auf Headword oder Übersetzung; ein Treffer je Headword."""
        p = fold(prefix.strip())
        if not p:
            return []
        hits: list[Entry] = []
        seen: set[str] = set()
        for e, word, trans in self._folded:
            if e.headword in seen:
                continue
            if word.startswith(p) or any(t.startswith(p) for t in trans.get(lang, ())):
                hits.append(e)
                seen.add(e.headword)
                if len(hits) >= limit:
                    break
        return hits


# ── Lexonomy-SQLite ──────────────────────────────────────────────────────────


def connect(db_path: str | Path) -> sqlite3.Connection:
    """Lesende Verbindung, die den WAL-Stand sieht.

    Lexonomy betreibt die Dictionary-DB im WAL-Modus; ``mode=ro`` kann eine DB mit
    aktivem ``-wal`` nicht öffnen und ``immutable=1`` ignoriert das WAL (zeigte
    gerade Gespeichertes nicht). Also ein normales Handle — wir schreiben nie —
    und ``immutable`` nur als Rückfall für eine Datei ohne Schreibrecht
    (root-eigene Kopie in einem Container; dort ist sie nicht im WAL-Betrieb).
    """
    path = Path(db_path)
    if not path.is_file():
        raise FileNotFoundError(f"Lexonomy dictionary not found: {path}")
    try:
        conn = sqlite3.connect(path, check_same_thread=False)
        conn.execute("SELECT 1 FROM entries LIMIT 1")
    except sqlite3.OperationalError:
        conn = sqlite3.connect(f"file:{path}?immutable=1", uri=True,
                               check_same_thread=False)
    conn.isolation_level = None                    # BEGIN/COMMIT explizit
    return conn


def _max_history(conn: sqlite3.Connection) -> int:
    return conn.execute("SELECT coalesce(max(id), 0) FROM history").fetchone()[0]


def _parse_rows(rows: Iterable[tuple[int, str]]) -> list[Entry]:
    out = []
    for entry_id, nvh in rows:
        entry = parse_entry(entry_id, nvh or "")
        if entry is None:
            log.warning("entry #%s: kein entry:-Knoten, übersprungen", entry_id)
            continue
        out.append(entry)
    return out


def load(conn: sqlite3.Connection) -> Store:
    """Alle Einträge plus der History-Stand, aus einem konsistenten Schnappschuss."""
    conn.execute("BEGIN")
    try:
        rows = conn.execute("SELECT id, nvh FROM entries ORDER BY id").fetchall()
        cursor = _max_history(conn)
    finally:
        conn.execute("COMMIT")
    return Store(_parse_rows(rows), cursor)


def refresh(conn: sqlite3.Connection, store: Store) -> Store | None:
    """Neuer Store, falls sich seit ``store.cursor`` etwas getan hat, sonst None."""
    conn.execute("BEGIN")
    try:
        head = _max_history(conn)
        if head == store.cursor:
            return None
        if head < store.cursor:
            changed_ids = None                     # History zurückgesetzt → alles
        else:
            changed_ids = {row[0] for row in conn.execute(
                "SELECT DISTINCT entry_id FROM history WHERE id > ?", (store.cursor,))}
            if len(changed_ids) > FULL_RELOAD_THRESHOLD:
                changed_ids = None
        if changed_ids is None:
            rows = conn.execute("SELECT id, nvh FROM entries ORDER BY id").fetchall()
        else:
            marks = ",".join("?" * len(changed_ids))
            rows = conn.execute(
                f"SELECT id, nvh FROM entries WHERE id IN ({marks})",
                tuple(changed_ids)).fetchall()
    finally:
        conn.execute("COMMIT")
    if changed_ids is None:
        log.info("full reload (history %s → %s)", store.cursor, head)
        return Store(_parse_rows(rows), head)
    present = {e.id: e for e in _parse_rows(rows)}
    changed = {entry_id: present.get(entry_id) for entry_id in changed_ids}
    log.info("reloaded %d entr%s (history %s → %s)", len(changed),
             "y" if len(changed) == 1 else "ies", store.cursor, head)
    return store.with_changes(changed, head)


class LiveStore:
    """Hält den aktuellen Store; ein Hintergrund-Thread zieht Änderungen nach.

    Leser greifen über ``current`` zu — eine einfache Attributzuweisung tauscht
    den Schnappschuss aus, kein Request sieht einen halb gebauten Index.
    """

    def __init__(self, db_path: str | Path, interval: float = 1.0) -> None:
        self.db_path = Path(db_path)
        self.interval = interval
        self._conn = connect(self.db_path)
        self.current: Store = load(self._conn)
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None

    def poll(self) -> bool:
        """Einmal nachsehen; True, wenn ein neuer Stand übernommen wurde."""
        try:
            fresh = refresh(self._conn, self.current)
        except sqlite3.Error as exc:
            log.warning("refresh %s: %s", self.db_path, exc)
            return False
        if fresh is None:
            return False
        self.current = fresh
        return True

    def start(self) -> LiveStore:
        def run() -> None:
            while not self._stop.wait(self.interval):
                self.poll()
        self._thread = threading.Thread(target=run, name="store-watch", daemon=True)
        self._thread.start()
        return self

    def stop(self) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=5)
        self._conn.close()
