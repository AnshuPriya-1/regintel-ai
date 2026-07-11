"""Pydantic models for the Workflow Automation Engine (Phase 5)."""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

TaskStatus = Literal["To Do", "In Progress", "Review", "Completed"]
Priority = Literal["Critical", "High", "Medium", "Low"]


class Comment(BaseModel):
    author: str
    text: str
    created_at: datetime


class Task(BaseModel):
    """A single actionable workflow task generated from a compliance obligation."""

    id: str
    title: str
    description: str
    regulation: str
    clause: str
    department: str
    owner: str
    priority: Priority
    status: TaskStatus = "To Do"
    due_date: str
    progress: int = 0
    evidence: bool = False
    dependencies: list[str] = Field(default_factory=list)
    comments: list[Comment] = Field(default_factory=list)
    source_obligation_id: str
    created_at: datetime


class TaskListResponse(BaseModel):
    count: int
    tasks: list[Task]


class TaskUpdateRequest(BaseModel):
    status: TaskStatus | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    evidence: bool | None = None
    owner: str | None = None


class CommentCreateRequest(BaseModel):
    author: str
    text: str


class GenerateTasksResponse(BaseModel):
    generated: int
    skipped_existing: int
    tasks: list[Task]
