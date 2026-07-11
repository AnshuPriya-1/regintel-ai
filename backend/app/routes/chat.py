"""AI Compliance Assistant routes (Phase 5) — RAG chat over uploaded SEBI circulars."""
from fastapi import APIRouter, HTTPException, status

from app.models import chat_store
from app.schemas.chat import (
    ChatDeleteResponse,
    ChatDetailResponse,
    ChatHistoryResponse,
    ChatRequest,
    ChatResponse,
    ChatSessionSummary,
)
from app.services import chat_service
from app.utils.exceptions import GeminiServiceError
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/chat", tags=["assistant"])


@router.post("", response_model=ChatResponse)
async def ask_question(payload: ChatRequest) -> ChatResponse:
    """
    Answer a question using only the uploaded SEBI compliance documents
    (retrieval-augmented generation). Creates a new conversation if
    `chat_id` is omitted.
    """
    try:
        result = chat_service.ask(payload.question, payload.chat_id)
    except GeminiServiceError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    return ChatResponse(**result)


@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history() -> ChatHistoryResponse:
    """Returns a summary of every conversation, most recently updated first."""
    chats = chat_store.list_chats()
    return ChatHistoryResponse(
        chats=[
            ChatSessionSummary(
                chat_id=c["chat_id"],
                title=c["title"],
                updated_at=c["updated_at"],
                message_count=len(c.get("messages", [])),
            )
            for c in chats
        ]
    )


@router.get("/{chat_id}", response_model=ChatDetailResponse)
async def get_chat(chat_id: str) -> ChatDetailResponse:
    """Returns the full message history for a single conversation."""
    chat = chat_store.get_chat(chat_id)
    if chat is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    return ChatDetailResponse(chat_id=chat["chat_id"], title=chat["title"], messages=chat["messages"])


@router.delete("/{chat_id}", response_model=ChatDeleteResponse)
async def delete_chat(chat_id: str) -> ChatDeleteResponse:
    """Deletes a conversation and all of its messages."""
    deleted = chat_store.delete_chat(chat_id)
    if not deleted:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    return ChatDeleteResponse(chat_id=chat_id, deleted=True)
