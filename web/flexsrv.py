"""flexsrv: ein Prozess für den Lexonomy-Editor und wirdeins.

Zwei Kanten über demselben Generator (``fst``-Atome) und derselben Quelle
(Lexonomy-SQLite):

* **Editor-API** (``editor_api``): ``/health``, ``/paradigms``, ``/slots``,
  ``POST /generate`` — JSON mit CORS, für ``editor/custom_editor.js``.
* **wirdeins** (``wirdeins``): ``/search/``, ``/auto/``, ``POST /more/`` und das
  gespiegelte Frontend unter ``/`` — nur mit ``--db``, denn dafür braucht es die
  Einträge.

Die Einträge liest ``store.LiveStore`` aus der Lexonomy-Dictionary-SQLite und
zieht jede gespeicherte Änderung binnen ~1 s nach (``history``-Zähler) — kein
Build-Schritt, kein Export.

Starten::

    uv run python web/flexsrv.py --db ../lexonomy/data/dicts/prussian.sqlite
    uv run python web/flexsrv.py                       # nur Editor-API
    uv run python web/flexsrv.py --host 0.0.0.0 --port 9000 --db …

Voraussetzung: ``make atoms`` im fst-Repo (``/health`` sagt, was fehlt).
"""

from __future__ import annotations

import argparse
import logging
import socketserver
import sys
from pathlib import Path
from wsgiref.simple_server import WSGIRequestHandler, WSGIServer, make_server

import bottle

import editor_api
import wirdeins
from store import LiveStore

log = logging.getLogger("flexsrv")


def create_app(live: LiveStore | None = None,
               static_dir: Path = wirdeins.STATIC) -> bottle.Bottle:
    app = bottle.Bottle()
    editor_api.install(app)
    if live is not None:
        wirdeins.install(app, lambda: live.current, static_dir)
    return app


class _ThreadingWSGIServer(socketserver.ThreadingMixIn, WSGIServer):
    daemon_threads = True


class _QuietHandler(WSGIRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        log.info("%s %s", self.address_string(), fmt % args)


def serve(host: str, port: int, app: bottle.Bottle | None = None) -> WSGIServer:
    """Threaded stdlib-WSGI-Server (``serve_forever``/``shutdown``) für ``app``.

    Generator-Aufrufe serialisiert ``engine.LOCK``; die Threads sorgen nur dafür,
    dass ein langsamer Client die übrigen nicht blockiert. Hinter einem
    Reverse-Proxy reicht das für wirdeins; die App ist WSGI und läuft genauso
    unter gunicorn & Co.
    """
    return make_server(host, port, app or create_app(),
                       server_class=_ThreadingWSGIServer, handler_class=_QuietHandler)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--db", type=Path,
                        help="Lexonomy dictionary SQLite (enables wirdeins)")
    parser.add_argument("--static", type=Path, default=wirdeins.STATIC,
                        help="wirdeins frontend dir served at / (default: web/wirdeins)")
    parser.add_argument("--poll", type=float, default=1.0,
                        help="seconds between checks for Lexonomy edits")
    args = parser.parse_args(argv)
    logging.basicConfig(level=logging.INFO, format="[%(name)s] %(message)s")

    health = editor_api.health_payload()
    if not health["ok"]:
        log.warning("%d of %d atoms missing — run `make atoms` in fst "
                    "(the generator then raises FileNotFoundError)",
                    len(health["missing"]), health["atoms"])

    live = None
    if args.db:
        live = LiveStore(args.db, interval=args.poll).start()
        log.info("%d entries from %s (history %d), watching for edits",
                 len(live.current), args.db, live.current.cursor)

    log.info("http://%s:%d  (atoms %d/%d%s)", args.host, args.port,
             health["atoms"] - len(health["missing"]), health["atoms"],
             ", wirdeins on /" if live else ", editor API only")
    serve(args.host, args.port, create_app(live, args.static)).serve_forever()
    return 0


if __name__ == "__main__":
    sys.exit(main())
