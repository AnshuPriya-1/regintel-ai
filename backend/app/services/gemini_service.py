"""Thin wrapper around the Gemini API for compliance-obligation extraction calls."""
from __future__ import annotations

import google.generativeai as genai

from app.config import settings
from app.services.prompt_templates import (
    CHAT_SYSTEM_PROMPT,
    EXTRACTION_SYSTEM_PROMPT,
    build_chat_user_prompt,
    build_user_prompt,
)
from app.utils.exceptions import GeminiServiceError
from app.utils.logger import get_logger

logger = get_logger(__name__)

_model: genai.GenerativeModel | None = None
_chat_model: genai.GenerativeModel | None = None


def _get_model() -> genai.GenerativeModel:
    """Lazily configure and cache the Gemini client so import-time never needs a key."""
    global _model
    if _model is None:
        if not settings.gemini_api_key:
            raise GeminiServiceError(
                "GEMINI_API_KEY is not set. Add it to backend/.env before uploading documents."
            )
        genai.configure(api_key=settings.gemini_api_key)
        _model = genai.GenerativeModel(
            model_name=settings.gemini_model,
            system_instruction=EXTRACTION_SYSTEM_PROMPT,
            generation_config={
                "temperature": 0.1,
                "response_mime_type": "application/json",
            },
        )
    return _model


def extract_obligations_from_chunk(chunk_text: str, chunk_index: int, total_chunks: int) -> str:
    """
    Send a single chunk of document text to Gemini and return the raw JSON text
    response. Raises GeminiServiceError on any failure.
    """
    model = _get_model()
    prompt = build_user_prompt(chunk_text, chunk_index, total_chunks)

    try:
        response = model.generate_content(prompt)
    except Exception as exc:
        logger.exception("Gemini API call failed on chunk %d/%d", chunk_index + 1, total_chunks)
        raise GeminiServiceError(f"Gemini API request failed: {exc}") from exc

    text = getattr(response, "text", None)
    if not text:
        raise GeminiServiceError("Gemini returned an empty response.")

    return text


def _get_chat_model() -> genai.GenerativeModel:
    """Lazily configure and cache the Gemini client used by the AI Compliance Assistant."""
    global _chat_model
    if _chat_model is None:
        if not settings.gemini_api_key:
            raise GeminiServiceError(
                "GEMINI_API_KEY is not set. Add it to backend/.env before using the AI Assistant."
            )
        genai.configure(api_key=settings.gemini_api_key)
        _chat_model = genai.GenerativeModel(
            model_name=settings.gemini_model,
            system_instruction=CHAT_SYSTEM_PROMPT,
            generation_config={
                "temperature": 0.1,
                "response_mime_type": "application/json",
            },
        )
    return _chat_model


def generate_chat_answer(
    question: str,
    context_chunks: list[dict],
    related_obligations: list[dict],
) -> str:
    """
    Ask Gemini to answer `question` using only `context_chunks` (and any
    matched structured obligations) as grounding. Returns the raw JSON text
    response. Raises GeminiServiceError on any failure.
    """
    model = _get_chat_model()
    prompt = build_chat_user_prompt(question, context_chunks, related_obligations)

    try:
        response = model.generate_content(prompt)
    except Exception as exc:
        logger.exception("Gemini chat API call failed")
        raise GeminiServiceError(f"Gemini API request failed: {exc}") from exc

    text = getattr(response, "text", None)
    if not text:
        raise GeminiServiceError("Gemini returned an empty response.")

    return text
