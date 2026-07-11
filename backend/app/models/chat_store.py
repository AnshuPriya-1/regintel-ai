"""
Persists AI Compliance Assistant conversations (Phase 5).

Follows the same simple JSON-file-behind-a-lock pattern used by
`store.py` and `document_store.py` elsewhere in this codebase, keeping the
project on a single, consistent, dependency-free persistence approach
rather than introducing a database.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock

_lock = Lock()

BASE_DIR = Path(__file__).resolve().parents[2]
CHATS_DIR = BASE_DIR / "data" / "chats"
CHATS_FILE = CHATS_DIR / "chats.json"


def _read() -> dict:
    if not CHATS_FILE.exists():
        return {"chats": {}}
    try:
        with open(CHATS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"chats": {}}


def _write(data: dict) -> None:
    CHATS_DIR.mkdir(parents=True, exist_ok=True)
    with open(CHATS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)


def create_chat(chat_id: str, title: str) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    chat = {
        "chat_id": chat_id,
        "title": title,
        "created_at": now,
        "updated_at": now,
        "messages": [],
    }
    with _lock:
        data = _read()
        data.setdefault("chats", {})
        data["chats"][chat_id] = chat
        _write(data)
    return chat


def get_chat(chat_id: str) -> dict | None:
    with _lock:
        data = _read()
    return data.get("chats", {}).get(chat_id)


def append_message(chat_id: str, message: dict) -> None:
    with _lock:
        data = _read()
        chat = data.get("chats", {}).get(chat_id)
        if chat is None:
            raise KeyError(f"Chat '{chat_id}' does not exist")
        chat["messages"].append(message)
        chat["updated_at"] = datetime.now(timezone.utc).isoformat()
        _write(data)


def list_chats() -> list[dict]:
    with _lock:
        data = _read()
    chats = list(data.get("chats", {}).values())
    chats.sort(key=lambda c: c.get("updated_at", ""), reverse=True)
    return chats


def delete_chat(chat_id: str) -> bool:
    with _lock:
        data = _read()
        chats = data.get("chats", {})
        if chat_id not in chats:
            return False
        del chats[chat_id]
        _write(data)
    return True
