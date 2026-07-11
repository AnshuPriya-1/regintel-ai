"""
Orchestrates the AI Compliance Assistant's RAG pipeline (Phase 5):

    question -> retrieve top-K chunks -> build grounded Gemini prompt
             -> generate grounded answer -> attach citations -> persist

Reuses the existing Gemini service, obligation store, and document/chat
stores rather than introducing new infrastructure.
"""
from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timezone

from app.models import chat_store, store
from app.services import gemini_service, retriever
from app.utils.exceptions import ExtractionParsingError, GeminiServiceError
from app.utils.logger import get_logger

logger = get_logger(__name__)

NOT_AVAILABLE_MESSAGE = "This information is not available in the uploaded compliance documents."

TOP_K = 5
_CLAUSE_RE = re.compile(r"\b\d{1,2}(?:\.\d{1,2}){1,3}\b")


def _new_chat_title(question: str) -> str:
    title = question.strip().replace("\n", " ")
    return title[:60] + ("…" if len(title) > 60 else "")


def _related_obligations(context_chunks: list[dict]) -> list[dict]:
    """
    Cross-reference retrieved chunks against already-extracted structured
    obligations (from the /upload -> Gemini extraction pipeline) so the
    assistant can ground department/risk/clause fields in real data instead
    of asking the chat model to infer them from raw text alone.
    """
    if not context_chunks:
        return []

    documents = {c["document"] for c in context_chunks}
    all_clauses: set[str] = set()
    for chunk in context_chunks:
        all_clauses.update(_CLAUSE_RE.findall(chunk["text"]))

    data = store.get_all_obligations()
    obligations = data.get("obligations", [])

    matched = [
        ob
        for ob in obligations
        if ob.get("source_document") in documents or ob.get("clause") in all_clauses
    ]
    return matched[:10]


def _parse_answer_json(raw_text: str) -> dict:
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("Gemini chat response was not valid JSON: %s", raw_text[:500])
        raise ExtractionParsingError("Gemini returned malformed JSON for the chat answer.") from exc

    if not isinstance(data, dict):
        raise ExtractionParsingError("Gemini chat response JSON was not an object.")

    return data


def _build_sources(context_chunks: list[dict], clauses: list[str]) -> list[dict]:
    sources = []
    for chunk in context_chunks:
        chunk_clauses = _CLAUSE_RE.findall(chunk["text"])
        matched_clause = next((c for c in clauses if c in chunk_clauses), chunk_clauses[0] if chunk_clauses else None)
        excerpt = chunk["text"][:220].strip()
        sources.append(
            {
                "document": chunk["document"],
                "page": chunk["page_start"],
                "clause": matched_clause,
                "excerpt": excerpt + ("…" if len(chunk["text"]) > 220 else ""),
            }
        )
    return sources


def ask(question: str, chat_id: str | None) -> dict:
    """
    Run the full RAG pipeline for one question and persist both the user
    message and the assistant's grounded answer. Returns a dict matching
    `ChatResponse`.
    """
    if chat_id is None:
        chat_id = str(uuid.uuid4())
        chat_store.create_chat(chat_id, _new_chat_title(question))
    elif chat_store.get_chat(chat_id) is None:
        chat_store.create_chat(chat_id, _new_chat_title(question))

    now = datetime.now(timezone.utc)
    user_message = {
        "id": str(uuid.uuid4()),
        "role": "user",
        "content": question,
        "created_at": now.isoformat(),
        "sources": [],
        "confidence": None,
        "risk": None,
        "departments": [],
        "clauses": [],
    }
    chat_store.append_message(chat_id, user_message)

    context_chunks = retriever.search(question, top_k=TOP_K)

    if not context_chunks:
        answer_payload = {
            "answer": NOT_AVAILABLE_MESSAGE,
            "confidence": 0,
            "risk": "Not Applicable",
            "departments": [],
            "clauses": [],
        }
        sources: list[dict] = []
    else:
        related = _related_obligations(context_chunks)
        try:
            raw = gemini_service.generate_chat_answer(question, context_chunks, related)
            answer_payload = _parse_answer_json(raw)
        except (GeminiServiceError, ExtractionParsingError) as exc:
            logger.warning("Falling back to not-available answer after Gemini error: %s", exc)
            answer_payload = {
                "answer": NOT_AVAILABLE_MESSAGE,
                "confidence": 0,
                "risk": "Not Applicable",
                "departments": [],
                "clauses": [],
            }

        if answer_payload.get("answer", "").strip() == NOT_AVAILABLE_MESSAGE:
            sources = []
        else:
            sources = _build_sources(context_chunks, answer_payload.get("clauses", []))

    assistant_message = {
        "id": str(uuid.uuid4()),
        "role": "assistant",
        "content": answer_payload.get("answer", NOT_AVAILABLE_MESSAGE),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "sources": sources,
        "confidence": int(answer_payload.get("confidence", 0) or 0),
        "risk": answer_payload.get("risk") or "Not Applicable",
        "departments": answer_payload.get("departments", []) or [],
        "clauses": answer_payload.get("clauses", []) or [],
    }
    chat_store.append_message(chat_id, assistant_message)

    return {
        "chat_id": chat_id,
        "message_id": assistant_message["id"],
        "answer": assistant_message["content"],
        "sources": sources,
        "confidence": assistant_message["confidence"],
        "risk": assistant_message["risk"],
        "departments": assistant_message["departments"],
        "clauses": assistant_message["clauses"],
        "created_at": assistant_message["created_at"],
    }
