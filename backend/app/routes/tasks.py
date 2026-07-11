"""Workflow Automation Engine routes (Phase 5) — GET/generate/update tasks."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from app.models import store, task_store
from app.schemas.task import (
    CommentCreateRequest,
    GenerateTasksResponse,
    Task,
    TaskListResponse,
    TaskUpdateRequest,
)
from app.services.workflow_generator import generate_tasks_from_obligations
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["workflow"])


@router.get("/tasks", response_model=TaskListResponse)
async def list_tasks() -> TaskListResponse:
    """Returns every workflow task generated so far."""
    tasks = task_store.get_all_tasks()
    return TaskListResponse(count=len(tasks), tasks=tasks)


@router.post("/tasks/generate", response_model=GenerateTasksResponse)
async def generate_tasks() -> GenerateTasksResponse:
    """
    Generates workflow tasks from the current set of extracted obligations
    (GET /obligations). Idempotent: obligations that already have a task
    are skipped, so this is safe to call repeatedly (e.g. after every
    /upload) without creating duplicates.
    """
    data = store.get_all_obligations()
    obligations = data.get("obligations", [])

    if not obligations:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="No obligations found. Upload a regulatory document first.",
        )

    new_tasks, skipped = generate_tasks_from_obligations(obligations)
    logger.info("Generated %d task(s), skipped %d already-existing", len(new_tasks), skipped)

    return GenerateTasksResponse(generated=len(new_tasks), skipped_existing=skipped, tasks=new_tasks)


@router.patch("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, payload: TaskUpdateRequest) -> Task:
    """Updates a task's status, progress, evidence flag, and/or owner."""
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="No fields to update.")

    updated = task_store.update_task(task_id, updates)
    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task not found.")

    return updated


@router.post("/tasks/{task_id}/comments", response_model=Task)
async def add_comment(task_id: str, payload: CommentCreateRequest) -> Task:
    """Adds a comment to a task's activity log."""
    comment = {
        "author": payload.author,
        "text": payload.text,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    updated = task_store.add_comment(task_id, comment)
    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Task not found.")

    return updated
