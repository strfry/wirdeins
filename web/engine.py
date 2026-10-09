"""Zur Engine (``fst``): listenloser Generator + Atom-FSTs.

Die ``fst``-Quelle wird **nicht** kopiert — der Web-Teil konsumiert sie als
Abhängigkeit. Reihenfolge der Auflösung:

1. ``PRUSSIAN_FST_ROOT`` (Umgebungsvariable, absoluter Pfad), sonst
2. das Geschwister-Repo ``../fst`` neben diesem Repo.

``generator`` leitet seine Atom-/Build-Pfade selbst aus seiner Repo-Wurzel ab,
deshalb genügt es, ``<fst>/gen`` auf den Importpfad zu legen und das Modul zu
importieren.
"""

from __future__ import annotations

import os
import sys
import threading
from pathlib import Path

# .../prussian  (die fst- und dictionary-Repos liegen als Geschwister darin)
REPO = Path(__file__).resolve().parents[2]


def fst_root() -> Path:
    env = os.environ.get("PRUSSIAN_FST_ROOT")
    root = (Path(env).expanduser() if env else REPO / "fst").resolve()
    if not (root / "gen" / "generator.py").is_file():
        raise RuntimeError(
            f"fst engine not found at {root} (gen/generator.py missing) — "
            f"set PRUSSIAN_FST_ROOT to the prussian-fst checkout")
    return root


FST_ROOT = fst_root()
if str(FST_ROOT / "gen") not in sys.path:
    sys.path.insert(0, str(FST_ROOT / "gen"))

import generator  # fst engine; re-exported below
import compress_forms  # NVH reader + usable_stems (same as the analyzer bake)
import build_analyzer  # entry_forms/classify_entry: the analyzer's own cell logic

# pyhfst-Lookup ist nicht als threadsicher dokumentiert (vgl.
# src/prussian_fst/api.py:_PIPELINE_LOCK) — jeder Generator-Aufruf, egal ob aus
# der Editor-API oder dem wirdeins-Adapter, läuft unter diesem einen Lock.
LOCK = threading.Lock()

__all__ = ["FST_ROOT", "LOCK", "REPO", "build_analyzer", "compress_forms",
           "fst_root", "generator"]

