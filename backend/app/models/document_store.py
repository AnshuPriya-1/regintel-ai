"""
Persists document text chunks produced during upload so the AI Compliance
Assistant (Phase 5) can retrieve them later for grounded, RAG-based answers.

This mirrors the read/write pattern already used in `store.py` for
obligations: a simple JSON file behind a thread lock. No new database or
vector store is introduced — retrieval scoring happens in-process in
`app/services/retriever.py`.
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from threading import Lock
from typing import TypedDict

_lock = Lock()

BASE_DIR = Path(__file__).resolve().parents[2]
DOCUMENTS_DIR = BASE_DIR / "data" / "documents"
CHUNKS_FILE = DOCUMENTS_DIR / "chunks.json"


class ChunkRecord(TypedDict):
    id: str
    document: str
    chunk_index: int
    page_start: int
    page_end: int
    text: str


def _read() -> dict:
    if not CHUNKS_FILE.exists():
        return {"documents": {}}
    try:
        with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"documents": {}}


def _write(data: dict) -> None:
    DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def save_document_chunks(document: str, chunks: list[ChunkRecord]) -> None:
    """Store (or overwrite) the retrievable chunks for a given document."""
    with _lock:
        data = _read()
        data.setdefault("documents", {})
        data["documents"][document] = {
            "uploaded_at": str(date.today()),
            "chunks": chunks,
        }
        _write(data)


def get_all_chunks() -> list[ChunkRecord]:
    """Flatten and return every chunk from every indexed document."""
    with _lock:
        data = _read()

    all_chunks: list[ChunkRecord] = []
    for doc_entry in data.get("documents", {}).values():
        all_chunks.extend(doc_entry.get("chunks", []))
    return all_chunks


def has_documents() -> bool:
    with _lock:
        data = _read()
    return bool(data.get("documents"))


def list_documents() -> list[str]:
    with _lock:
        data = _read()
    return list(data.get("documents", {}).keys())
