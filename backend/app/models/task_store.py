"""
Persists workflow tasks generated from compliance obligations (Phase 5).

Mirrors the read/write pattern already used in `store.py` and
`document_store.py`: a simple JSON file behind a thread lock. No new
database is introduced.
"""
from __future__ import annotations

import json
from pathlib import Path
from threading import Lock

from app.schemas.task import Task

_lock = Lock()

BASE_DIR = Path(__file__).resolve().parents[2]
TASKS_DIR = BASE_DIR / "data" / "tasks"
TASKS_FILE = TASKS_DIR / "tasks.json"


def _read() -> list[dict]:
    if not TASKS_FILE.exists():
        return []
    try:
        with open(TASKS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []


def _write(data: list[dict]) -> None:
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    with open(TASKS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, default=str)


def get_all_tasks() -> list[dict]:
    return _read()


def get_existing_obligation_ids() -> set[str]:
    """IDs of obligations that already have a task generated for them (idempotency)."""
    return {t["source_obligation_id"] for t in _read()}


def save_tasks(new_tasks: list[Task]) -> None:
    """Append newly generated tasks to the store."""
    with _lock:
        data = _read()
        data.extend(t.model_dump() for t in new_tasks)
        _write(data)


def get_task(task_id: str) -> dict | None:
    for t in _read():
        if t["id"] == task_id:
            return t
    return None


def update_task(task_id: str, updates: dict) -> dict | None:
    with _lock:
        data = _read()
        for t in data:
            if t["id"] == task_id:
                t.update(updates)
                _write(data)
                return t
    return None


def add_comment(task_id: str, comment: dict) -> dict | None:
    with _lock:
        data = _read()
        for t in data:
            if t["id"] == task_id:
                t.setdefault("comments", []).append(comment)
                _write(data)
                return t
    return None


def clear_tasks() -> None:
    with _lock:
        _write([])
