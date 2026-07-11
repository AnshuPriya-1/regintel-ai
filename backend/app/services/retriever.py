"""
Retrieval step of the AI Compliance Assistant's RAG pipeline (Phase 5).

Question -> search uploaded document chunks -> return Top-K relevant chunks.

No external vector database is introduced here: chunks are scored with a
lightweight TF-IDF-style bag-of-words similarity, which is more than
sufficient for the modest per-tenant document volumes this app handles and
keeps the backend dependency-free (reuses only the stdlib).
"""
from __future__ import annotations

import math
import re
from collections import Counter

from app.config import settings
from app.models import document_store
from app.models.document_store import ChunkRecord

_TOKEN_RE = re.compile(r"[a-zA-Z0-9]+")

_STOPWORDS = {
    "the", "a", "an", "of", "to", "and", "or", "in", "on", "for", "is", "are",
    "was", "were", "be", "been", "this", "that", "with", "as", "by", "at",
    "it", "its", "shall", "will", "must", "any", "not", "from", "which",
    "such", "these", "those", "into", "under", "than", "then",
}


def _tokenize(text: str) -> list[str]:
    return [t.lower() for t in _TOKEN_RE.findall(text) if t.lower() not in _STOPWORDS and len(t) > 1]


def build_page_aware_chunks(
    pages: list[str],
    chunk_size: int | None = None,
    overlap: int | None = None,
) -> list[ChunkRecord]:
    """
    Group page texts into chunks close to `chunk_size` characters, tracking
    which pages each chunk spans so retrieved chunks can be cited by page
    number. Mirrors `pdf_parser.chunk_text`'s size/overlap behaviour but is
    page-boundary aware, which the plain text chunker (used for obligation
    extraction) doesn't need to be.
    """
    chunk_size = chunk_size or settings.chunk_size_chars
    overlap = overlap or settings.chunk_overlap_chars

    chunks: list[ChunkRecord] = []
    buffer = ""
    page_start = 1
    chunk_index = 0

    for page_num, page_text in enumerate(pages, start=1):
        page_text = page_text.strip()
        if not page_text:
            continue
        if not buffer:
            page_start = page_num

        buffer = f"{buffer}\n\n{page_text}" if buffer else page_text

        if len(buffer) >= chunk_size:
            chunks.append(
                {
                    "id": f"c{chunk_index}",
                    "document": "",  # filled in by caller
                    "chunk_index": chunk_index,
                    "page_start": page_start,
                    "page_end": page_num,
                    "text": buffer.strip(),
                }
            )
            chunk_index += 1
            # Carry a small overlap forward so context isn't lost at chunk edges.
            buffer = buffer[-overlap:] if overlap else ""
            page_start = page_num

    if buffer.strip():
        chunks.append(
            {
                "id": f"c{chunk_index}",
                "document": "",
                "chunk_index": chunk_index,
                "page_start": page_start,
                "page_end": len(pages),
                "text": buffer.strip(),
            }
        )

    return chunks


class _ScoredChunk:
    __slots__ = ("chunk", "score")

    def __init__(self, chunk: ChunkRecord, score: float):
        self.chunk = chunk
        self.score = score


def search(question: str, top_k: int = 5) -> list[ChunkRecord]:
    """
    Score every indexed chunk against the question using TF-IDF cosine
    similarity and return the Top-K matches (highest score first).

    Returns an empty list if no documents have been indexed yet, or if
    nothing scores above a minimal relevance floor — both cases the caller
    treats as "not found in the uploaded documents".
    """
    all_chunks = document_store.get_all_chunks()
    if not all_chunks:
        return []

    query_tokens = _tokenize(question)
    if not query_tokens:
        return []

    # Document frequency across the corpus, for IDF weighting.
    doc_token_sets = [set(_tokenize(c["text"])) for c in all_chunks]
    n_docs = len(doc_token_sets)
    df: Counter[str] = Counter()
    for token_set in doc_token_sets:
        for tok in token_set:
            df[tok] += 1

    def idf(token: str) -> float:
        return math.log((n_docs + 1) / (df.get(token, 0) + 1)) + 1.0

    query_counts = Counter(query_tokens)
    query_vec = {tok: cnt * idf(tok) for tok, cnt in query_counts.items()}
    query_norm = math.sqrt(sum(v * v for v in query_vec.values())) or 1.0

    scored: list[_ScoredChunk] = []
    for chunk, token_set in zip(all_chunks, doc_token_sets):
        chunk_counts = Counter(_tokenize(chunk["text"]))
        overlap = query_vec.keys() & chunk_counts.keys()
        if not overlap:
            continue

        dot = sum(query_vec[tok] * chunk_counts[tok] * idf(tok) for tok in overlap)
        chunk_norm = math.sqrt(sum((cnt * idf(tok)) ** 2 for tok, cnt in chunk_counts.items())) or 1.0
        score = dot / (query_norm * chunk_norm)

        if score > 0:
            scored.append(_ScoredChunk(chunk, score))

    scored.sort(key=lambda s: s.score, reverse=True)
    return [s.chunk for s in scored[:top_k] if s.score >= 0.03]
