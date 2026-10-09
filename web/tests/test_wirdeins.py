"""Tests für den wirdeins-Adapter (web/wirdeins.py) und den Store (web/store.py).

Gegenstand ist der Weg Lexonomy-SQLite → Store → Legacy-HTML-Fragment. Die
Einträge kommen aus ``fixtures/entries.nvh`` (Auszug der lean NVH
``corpus/parsed/twanksta_dmlex.nvh``) und werden in eine frische SQLite mit dem
Lexonomy-Schema (``entries`` + ``history``, WAL) geschrieben — so wie Lexonomy
sie nach einem Import hält.

Die ``/more/``-Fixtures (``fixtures/more-*.html``) sind vom Live-Original
wirdeins.twanksta.org mitgeschnitten. Der Vergleich ist strukturell (Elemente,
Klassen, Text), nicht byte-genau: die Live-Fragmente enthalten DB-Leerraum in
den Spans und PHP-Slash-Entities; ``normalize`` neutralisiert genau das.
"""

from __future__ import annotations

import re
import sqlite3
import sys
import threading
import urllib.parse
import urllib.request
from pathlib import Path

import pytest

WEB = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(WEB))

import editor_api  # noqa: E402
import flexsrv  # noqa: E402
import store  # noqa: E402
import wirdeins  # noqa: E402

FIXTURES = Path(__file__).resolve().parent / "fixtures"


@pytest.fixture(scope="module", autouse=True)
def atoms():
    health = editor_api.health_payload()
    if not health["ok"]:
        pytest.skip(f"{len(health['missing'])} atoms missing — `make atoms` in fst")


def split_entries(text: str) -> list[str]:
    return [chunk if chunk.startswith("entry:") else "entry:" + chunk
            for chunk in re.split(r"(?m)^entry:", text) if chunk.strip()]


def write_db(path: Path, nvhs: list[str]) -> None:
    """Lexonomy-artige Dictionary-DB: ein Eintrag + eine ``create``-History-Zeile je NVH."""
    conn = sqlite3.connect(path)
    conn.executescript("""
        PRAGMA journal_mode=WAL;
        CREATE TABLE entries (id INTEGER PRIMARY KEY AUTOINCREMENT, nvh TEXT,
                              json JSON, title TEXT, sortkey TEXT);
        CREATE TABLE history (id INTEGER PRIMARY KEY AUTOINCREMENT, entry_id INTEGER,
                              [action] TEXT, [when] DATETIME, email TEXT, nvh TEXT,
                              historiography TEXT);
    """)
    for nvh in nvhs:
        cur = conn.execute("INSERT INTO entries(nvh) VALUES (?)", (nvh,))
        conn.execute("INSERT INTO history(entry_id, action, [when], email, nvh) "
                     "VALUES (?, 'create', datetime('now'), 'test@example.org', ?)",
                     (cur.lastrowid, nvh))
    conn.commit()
    conn.close()


def lexonomy_save(path: Path, entry_id: int, nvh: str | None) -> None:
    """Was Lexonomys ``ops.updateEntry``/``deleteEntry`` an der DB tun."""
    conn = sqlite3.connect(path)
    if nvh is None:
        conn.execute("DELETE FROM entries WHERE id=?", (entry_id,))
        action = "delete"
    else:
        conn.execute("INSERT OR REPLACE INTO entries(id, nvh) VALUES (?, ?)",
                     (entry_id, nvh))
        action = "update"
    conn.execute("INSERT INTO history(entry_id, action, [when], email, nvh) "
                 "VALUES (?, ?, datetime('now'), 'test@example.org', ?)",
                 (entry_id, action, nvh))
    conn.commit()
    conn.close()


@pytest.fixture
def db(tmp_path) -> Path:
    path = tmp_path / "prussian.sqlite"
    write_db(path, split_entries((FIXTURES / "entries.nvh").read_text(encoding="utf-8")))
    return path


@pytest.fixture
def live(db):
    live = store.LiveStore(db)
    yield live
    live.stop()


def normalize(html: str) -> str:
    html = html.replace("&#47;", "/")             # PHP htmlspecialchars-Slash
    html = re.sub(r"\s+", " ", html)
    html = html.replace("> ", ">").replace(" <", "<")
    return html.strip()


# ── Store ────────────────────────────────────────────────────────────────────

def test_store_reads_the_lexonomy_entries(live):
    s = live.current
    assert len(s) == 7 and s.cursor == 7
    deiws, = s.lookup("Dēiws")
    assert (deiws.family, deiws.paradigm, deiws.gender) == ("noun", "36", "masc")
    assert deiws.desc == "[Deiws 37]"
    assert deiws.translations["en"] == ("God",)
    kalb, = s.lookup("kalbītwei")
    assert dict(kalb.morph.stems) == {"partPresAct": "kalbant", "pret": "kalbē"}
    assert kalb.morph.attested["opt"] == ("kalbisei",)


def test_search_matches_headword_and_translation_diacritic_insensitive(live):
    s = live.current
    assert [e.headword for e in s.search("deiws", "en")] == ["Dēiws"]
    assert [e.headword for e in s.search("quarrel", "en")] == ["kalbītwei"]
    assert [e.headword for e in s.search("Gott", "de")] == ["Dēiws"]
    assert s.search("Gott", "en") == []
    assert s.search("  ", "en") == []


def test_suggest_is_one_hit_per_headword(live):
    assert [e.headword for e in live.current.suggest("wil", "en")] == ["wilnis"]


# ── Fragmente ────────────────────────────────────────────────────────────────

@pytest.mark.parametrize("word, fixture", [
    ("Dēiws", "more-noun-deiws.html"),
    ("kalbītwei", "more-verb-kalbitwei.html"),
    ("begalbis", "more-adj-begalbis.html"),
])
def test_more_matches_the_live_fragments(live, word, fixture):
    want = normalize((FIXTURES / fixture).read_text(encoding="utf-8"))
    got = normalize(wirdeins.render_more(live.current, word))
    assert got == want


def test_more_uses_the_analyzer_cells_including_overrides(live):
    kalb, = live.current.lookup("kalbītwei")
    cells = wirdeins.entry_cells(kalb)
    assert cells["opt"] == ("kalbisei",)                     # Override ersetzt
    assert cells["part.prs.act.msc.sg.nom"] == ("kalbants",)  # gelieferter Stamm
    assert cells["prt.sg1"] == ("kalbēi",)


def test_more_picks_the_clicked_homonym(live):
    s = live.current
    first = wirdeins.render_more(s, "wilnis", numb="40", desc="[Wilnis E 477]")
    second = wirdeins.render_more(s, "wilnis", numb="41", desc="[Wilnis E 566]")
    adj = wirdeins.render_more(s, "wilnis", numb="27", desc="aj [Wilnis E 477 VM]")
    assert first.count('id="subst"') == 1 and second.count('id="subst"') == 1
    assert first != second
    assert 'class="ohoo"' in adj and 'class="ohoo"' not in first
    # Ohne Hinweise: alle Lesarten des Headwords.
    everything = wirdeins.render_more(s, "wilnis")
    assert everything == first + second + adj


def test_more_for_an_unknown_word_is_empty(live):
    assert wirdeins.render_more(live.current, "nīkas") == ""


def test_search_fragment_carries_paradigm_and_desc_for_more(live):
    html = wirdeins.render_search(live.current, "wilnis", "en")
    assert html.count("<li>") == 3
    assert "<span class='numb'>41</span>" in html
    assert "<span class='desc'>[Wilnis E 566]</span>" in html
    assert "Show form" in html
    assert wirdeins.render_search(live.current, "xyzzy", "en") == \
        "<div id='search-status'>Nothing was found.</div>"


def test_search_fragment_escapes_html(db):
    lexonomy_save(db, 1, "entry: <b>x</b>\n  pos: noun\n  sense:\n    en: <i>y</i>\n")
    s = store.load(store.connect(db))
    html = wirdeins.render_search(s, "x", "en")
    assert "<b>" not in html and "&lt;b&gt;x&lt;/b&gt;" in html


# ── Live-Nachladen ───────────────────────────────────────────────────────────

def test_a_lexonomy_save_is_picked_up(db, live):
    before = live.current
    deiws, = before.lookup("Dēiws")
    assert live.poll() is False                              # nichts passiert
    edited = split_entries((FIXTURES / "entries.nvh").read_text(encoding="utf-8"))[0] \
        .replace("en: God", "en: God (edited)")
    lexonomy_save(db, deiws.id, edited)
    assert live.poll() is True
    assert live.current.lookup("Dēiws")[0].translations["en"] == ("God (edited)",)
    assert live.current.cursor == 8 and len(live.current) == 7
    assert before.lookup("Dēiws")[0].translations["en"] == ("God",)  # Schnappschuss


def test_a_lexonomy_delete_and_create_are_picked_up(db, live):
    deiws, = live.current.lookup("Dēiws")
    lexonomy_save(db, deiws.id, None)
    lexonomy_save(db, 100, "entry: nawas\n  pos: noun\n  sense:\n    en: new\n")
    assert live.poll() is True
    assert live.current.lookup("Dēiws") == []
    assert [e.headword for e in live.current.search("new", "en")] == ["nawas"]


def test_a_history_reset_triggers_a_full_reload(db, live):
    conn = sqlite3.connect(db)
    conn.execute("DELETE FROM history")                      # wie import2dict --purge
    conn.execute("DELETE FROM sqlite_sequence WHERE name='history'")
    conn.execute("DELETE FROM entries WHERE id > 1")
    conn.commit()
    conn.close()
    lexonomy_save(db, 1, "entry: aīns\n  pos: noun\n  sense:\n    en: one\n")
    assert live.poll() is True
    assert [e.headword for e in live.current.entries.values()] == ["aīns"]


# ── HTTP ─────────────────────────────────────────────────────────────────────

@pytest.fixture
def server(live):
    httpd = flexsrv.serve("127.0.0.1", 0, flexsrv.create_app(live))
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{httpd.server_address[1]}"
    httpd.shutdown()
    httpd.server_close()


def _fetch(url: str, data: bytes | None = None) -> tuple[str, str]:
    with urllib.request.urlopen(url, data=data, timeout=10) as response:
        return response.headers["Content-Type"], response.read().decode("utf-8")


def test_fragments_over_http(server):
    q = urllib.parse.urlencode({"s": "dēiws", "language": "miks", "dia": "semba"})
    ctype, body = _fetch(f"{server}/search/?{q}")
    assert ctype.startswith("text/html") and "Gott" in body
    _, body = _fetch(f"{server}/auto/?{urllib.parse.urlencode({'s': 'kalb', 'language': 'engl'})}")
    assert '<a class="suggest" href="#kalbītwei">' in body
    # Wie das Frontend: der Body ist unkodiert zusammengesetzt (jQuery-String).
    _, body = _fetch(f"{server}/more/", "word=Dēiws&numb=36&desc=[Deiws 37]".encode("utf-8"))
    assert "Dēiwas" in body


def test_frontend_and_editor_api_share_the_server(server):
    ctype, body = _fetch(f"{server}/")
    assert ctype.startswith("text/html") and "app_n-min.js" in body
    _, body = _fetch(f"{server}/source/style_a.css")
    assert body
    _, body = _fetch(f"{server}/health")
    assert '"ok": true' in body
