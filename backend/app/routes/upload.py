"""POST /upload — accepts a SEBI PDF, runs the extraction pipeline, returns obligations."""
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.models import document_store, store
from app.schemas.obligation import UploadResponse
from app.services import pdf_parser, retriever
from app.services.extractor import extract_obligations
from app.services.workflow_generator import generate_tasks_from_obligations
from app.utils.exceptions import (
    ExtractionParsingError,
    GeminiServiceError,
    InvalidFileError,
    PdfExtractionError,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)) -> UploadResponse:
    """
    Accepts a PDF regulatory document, extracts its text, sends it to Gemini
    for compliance obligation extraction, and returns the structured result.
    """
    content = await file.read()

    try:
        pdf_parser.validate_pdf(file.filename or "", content)
        text, page_count = pdf_parser.extract_text(content)
        records, chunks_processed = extract_obligations(text, source_document=file.filename or "unknown.pdf")
    except InvalidFileError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except PdfExtractionError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except GeminiServiceError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
    except ExtractionParsingError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    # Index page-aware chunks for the AI Compliance Assistant (Phase 5) so
    # this document becomes searchable/retrievable for grounded Q&A. This is
    # additive: it does not affect the obligation-extraction response below.
    try:
        pages = pdf_parser.extract_pages(content)
        chunks = retriever.build_page_aware_chunks(pages)
        for chunk in chunks:
            chunk["document"] = file.filename or "unknown.pdf"
        document_store.save_document_chunks(file.filename or "unknown.pdf", chunks)
    except Exception:  # pragma: no cover - never block the extraction response
        logger.exception("Failed to index document chunks for the AI Assistant; obligations were still saved.")

    store.save_obligations(records)

    version1 = store.get_version(1)

    # If Version 1 is empty, save there.
    if not version1 or not version1.get("obligations"):
        store.save_version(1, records)
    else:
        # Otherwise overwrite Version 2.
        store.save_version(2, records)
    logger.info("Upload '%s' processed: %d obligation(s) extracted", file.filename, len(records))

    # Turn the newly extracted obligations into workflow tasks (Phase 5).
    # Additive and best-effort: never block the extraction response below.
    try:
        new_tasks, _ = generate_tasks_from_obligations([r.model_dump() for r in records])
        logger.info("Generated %d workflow task(s) for '%s'", len(new_tasks), file.filename)
    except Exception:  # pragma: no cover - never block the extraction response
        logger.exception("Failed to auto-generate workflow tasks; obligations were still saved.")

    return UploadResponse(
        filename=file.filename or "unknown.pdf",
        pages=page_count,
        characters_extracted=len(text),
        chunks_processed=chunks_processed,
        obligations=records,
    )
