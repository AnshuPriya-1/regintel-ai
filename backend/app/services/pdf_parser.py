"""PDF text extraction and chunking, built on PyMuPDF (fitz)."""
from __future__ import annotations

import fitz  # PyMuPDF

from app.config import settings
from app.utils.exceptions import InvalidFileError, PdfExtractionError
from app.utils.logger import get_logger

logger = get_logger(__name__)


def validate_pdf(filename: str, content: bytes) -> None:
    """Raise InvalidFileError if the upload isn't a usable PDF."""
    if not filename.lower().endswith(".pdf"):
        raise InvalidFileError("Only PDF files are supported.")

    if not content:
        raise InvalidFileError("The uploaded file is empty.")

    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise InvalidFileError(f"File exceeds the {settings.max_upload_mb}MB upload limit.")

    if not content.startswith(b"%PDF-"):
        raise InvalidFileError("The uploaded file is not a valid PDF.")


def extract_text(content: bytes) -> tuple[str, int]:
    """
    Extract all text from a PDF's bytes.

    Returns (full_text, page_count).
    """
    try:
        with fitz.open(stream=content, filetype="pdf") as doc:
            page_count = doc.page_count
            pages_text = [page.get_text("text") for page in doc]
    except Exception as exc:  # PyMuPDF raises a variety of internal errors
        logger.exception("Failed to extract text from PDF")
        raise PdfExtractionError("Could not extract text from the PDF. The file may be corrupted or scanned/image-only.") from exc

    full_text = "\n".join(pages_text).strip()
    if not full_text:
        raise PdfExtractionError(
            "No extractable text found in this PDF. Scanned/image-only PDFs are not supported yet."
        )

    return full_text, page_count


def extract_pages(content: bytes) -> list[str]:
    """
    Extract text per page (not joined), used by the AI Compliance Assistant
    (Phase 5) to build page-aware chunks so retrieved answers can cite a
    page number. `extract_text` above remains unchanged and is still what
    the obligation-extraction pipeline uses.
    """
    try:
        with fitz.open(stream=content, filetype="pdf") as doc:
            return [page.get_text("text") for page in doc]
    except Exception as exc:
        logger.exception("Failed to extract per-page text from PDF")
        raise PdfExtractionError("Could not extract text from the PDF. The file may be corrupted or scanned/image-only.") from exc


def chunk_text(text: str, chunk_size: int | None = None, overlap: int | None = None) -> list[str]:
    """
    Split long text into overlapping chunks so each fits comfortably within a
    single Gemini request. Splits on paragraph boundaries where possible to
    avoid cutting a clause in half.
    """
    chunk_size = chunk_size or settings.chunk_size_chars
    overlap = overlap or settings.chunk_overlap_chars

    if len(text) <= chunk_size:
        return [text]

    chunks: list[str] = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)

        if end < text_len:
            boundary = text.rfind("\n\n", start, end)
            if boundary == -1 or boundary <= start:
                boundary = text.rfind("\n", start, end)
            if boundary > start:
                end = boundary

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        if end >= text_len:
            break
        start = max(end - overlap, start + 1)

    return chunks
