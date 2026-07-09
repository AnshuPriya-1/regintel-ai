"""Pydantic models describing compliance obligations and API payloads."""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

RiskLevel = Literal["High", "Medium", "Low"]


class Obligation(BaseModel):
    """A single compliance obligation extracted from a regulatory document."""

    clause: str = Field(..., description="Clause / section number the obligation is derived from, e.g. '4.2'")
    regulation: str = Field(..., description="Name of the regulation, circular or framework")
    department: str = Field(..., description="Department responsible for fulfilling the obligation")
    action: str = Field(..., description="The concrete action required to comply")
    deadline: str = Field(..., description="Deadline or due date/cadence for the action")
    frequency: str = Field(..., description="How often the obligation recurs, e.g. 'Annual', 'One-time'")
    evidence: str = Field(..., description="Evidence/artifact required to prove compliance")
    penalty: str = Field(..., description="Penalty or consequence for non-compliance")
    risk: RiskLevel = Field(..., description="Assessed risk level of non-compliance")


class ObligationRecord(Obligation):
    """An obligation as stored server-side, enriched with extraction metadata."""

    id: str
    source_document: str
    extracted_at: datetime


class UploadResponse(BaseModel):
    """Response returned by POST /upload."""

    filename: str
    pages: int
    characters_extracted: int
    chunks_processed: int
    obligations: list[ObligationRecord]


class ObligationsListResponse(BaseModel):
    """Response returned by GET /obligations."""

    count: int
    obligations: list[ObligationRecord]


class ErrorResponse(BaseModel):
    detail: str
