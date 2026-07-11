"""RegIntel-AI backend entrypoint: FastAPI app, middleware, and route registration."""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import chat, obligations, tasks, upload
from app.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="RegIntel-AI",
    description="SEBI Compliance Intelligence Platform — AI-powered obligation extraction API.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(obligations.router)
app.include_router(chat.router)
app.include_router(tasks.router)


@app.get("/", tags=["health"])
async def root() -> dict:
    """Basic health check / service info."""
    return {
        "service": "RegIntel-AI backend",
        "status": "ok",
        "gemini_model": settings.gemini_model,
    }


@app.get("/health", tags=["health"])
async def health() -> dict:
    if not settings.gemini_api_key:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GEMINI_API_KEY is not configured on the server.",
        )
    return {"status": "ok"}
