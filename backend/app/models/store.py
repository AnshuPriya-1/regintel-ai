import json
from pathlib import Path
from threading import Lock
from datetime import date

from app.schemas.obligation import ObligationRecord

_lock = Lock()

BASE_DIR = Path(__file__).resolve().parents[2]

OBLIGATIONS_DIR = BASE_DIR / "data" / "obligations"

MASTER_FILE = OBLIGATIONS_DIR / "master.json"
VERSION1_FILE = OBLIGATIONS_DIR / "version_1.json"
VERSION2_FILE = OBLIGATIONS_DIR / "version_2.json"


def _write(path: Path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, default=str)


def _read(path: Path):
    if not path.exists():
        return {}

    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


def save_obligations(records: list[ObligationRecord]) -> None:
    """
    Save the latest uploaded obligations into master.json
    """

    data = {
        "document": "Master Circular",
        "version": "master",
        "uploaded_at": str(date.today()),
        "obligations": [record.model_dump() for record in records],
    }

    with _lock:
        _write(MASTER_FILE, data)


def save_version(version: int, records: list[ObligationRecord]) -> None:
    """
    Save Version 1 or Version 2.
    """

    data = {
        "document": "Master Circular",
        "version": str(version),
        "uploaded_at": str(date.today()),
        "obligations": [record.model_dump() for record in records],
    }

    with _lock:
        if version == 1:
            _write(VERSION1_FILE, data)
        elif version == 2:
            _write(VERSION2_FILE, data)
        else:
            raise ValueError("Version must be 1 or 2")


def get_version(version: int):
    if version == 1:
        return _read(VERSION1_FILE)

    if version == 2:
        return _read(VERSION2_FILE)

    raise ValueError("Version must be 1 or 2")


def get_all_obligations():
    return _read(MASTER_FILE)


def clear_obligations():
    _write(
        MASTER_FILE,
        {
            "document": "",
            "version": "",
            "uploaded_at": "",
            "obligations": [],
        },
    )