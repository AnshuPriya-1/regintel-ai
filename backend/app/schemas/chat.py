"""Pydantic models for the AI Compliance Assistant (Phase 5 — RAG chat)."""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

RiskLevel = Literal["High", "Medium", "Low", "Not Applicable"]


class ChatSource(BaseModel):
    """A single grounding citation returned alongside an assistant answer."""

    document: str = Field(..., description="Source document filename")
    page: int | None = Field(None, description="Page number the chunk was taken from, if known")
    clause: str | None = Field(None, description="Clause/section number referenced, if identifiable")
    excerpt: str = Field(..., description="Short excerpt of the retrieved chunk used as evidence")


class ChatMessage(BaseModel):
    """A single message (user or assistant) inside a conversation."""

    id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime

    # Assistant-only enrichment fields (None for user messages).
    sources: list[ChatSource] = Field(default_factory=list)
    confidence: int | None = None
    risk: RiskLevel | None = None
    departments: list[str] = Field(default_factory=list)
    clauses: list[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    """Request body for POST /chat."""

    question: str = Field(..., min_length=1, max_length=4000)
    chat_id: str | None = Field(None, description="Existing conversation to continue; omit to start a new one")


class ChatResponse(BaseModel):
    """Response body for POST /chat."""

    chat_id: str
    message_id: str
    answer: str
    sources: list[ChatSource]
    confidence: int
    risk: RiskLevel
    departments: list[str]
    clauses: list[str]
    created_at: datetime


class ChatSessionSummary(BaseModel):
    """Lightweight summary of a conversation, used to render the history panel."""

    chat_id: str
    title: str
    updated_at: datetime
    message_count: int


class ChatHistoryResponse(BaseModel):
    """Response body for GET /chat/history."""

    chats: list[ChatSessionSummary]


class ChatDetailResponse(BaseModel):
    """Response body for GET /chat/{chat_id}."""

    chat_id: str
    title: str
    messages: list[ChatMessage]


class ChatDeleteResponse(BaseModel):
    """Response body for DELETE /chat/{chat_id}."""

    chat_id: str
    deleted: bool
