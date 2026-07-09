"""
Orchestrates the full extraction pipeline: chunk document text, call Gemini
for each chunk, validate/parse the JSON responses into Obligation models,
and de-duplicate the combined result.
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

from pydantic import TypeAdapter, ValidationError

from app.schemas.obligation import Obligation, ObligationRecord
from app.services import gemini_service
from app.services.pdf_parser import chunk_text
from app.utils.exceptions import ExtractionParsingError
from app.utils.logger import get_logger

logger = get_logger(__name__)

_obligation_list_adapter = TypeAdapter(list[Obligation])


def _parse_obligations_json(raw_text: str) -> list[Obligation]:
    """Parse and validate a Gemini JSON response into a list of Obligation models."""
    cleaned = raw_text.strip()

    # Defensive cleanup in case the model wraps output in markdown fences
    # despite instructions not to.
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("Gemini response was not valid JSON: %s", raw_text[:500])
        raise ExtractionParsingError("Gemini returned malformed JSON.") from exc

    if not isinstance(data, list):
        raise ExtractionParsingError("Gemini response JSON was not a list of obligations.")

    try:
        return _obligation_list_adapter.validate_python(data)
    except ValidationError as exc:
        logger.error("Gemini obligations failed schema validation: %s", exc)
        raise ExtractionParsingError(f"Gemini obligations failed schema validation: {exc}") from exc


def _dedupe(obligations: list[Obligation]) -> list[Obligation]:
    """Remove exact duplicate obligations that can appear across overlapping chunks."""
    seen: set[tuple[str, str, str]] = set()
    unique: list[Obligation] = []
    for ob in obligations:
        key = (ob.clause.strip().lower(), ob.action.strip().lower(), ob.deadline.strip().lower())
        if key not in seen:
            seen.add(key)
            unique.append(ob)
    return unique


def extract_obligations(document_text: str, source_document: str) -> tuple[list[ObligationRecord], int]:
    """
    Run the full extraction pipeline over a document's text.

    Returns (obligation_records, chunks_processed).
    """
    chunks = chunk_text(document_text)
    logger.info("Extracting obligations from %d chunk(s) of '%s'", len(chunks), source_document)

    all_obligations: list[Obligation] = []
    for i, chunk in enumerate(chunks):
        raw_response = gemini_service.extract_obligations_from_chunk(chunk, i, len(chunks))
        chunk_obligations = _parse_obligations_json(raw_response)
        logger.info("Chunk %d/%d yielded %d obligation(s)", i + 1, len(chunks), len(chunk_obligations))
        all_obligations.extend(chunk_obligations)

    deduped = _dedupe(all_obligations)
    extracted_at = datetime.now(timezone.utc)

    records = [
        ObligationRecord(
            id=str(uuid.uuid4()),
            source_document=source_document,
            extracted_at=extracted_at,
            **ob.model_dump(),
        )
        for ob in deduped
    ]

    return records, len(chunks)
