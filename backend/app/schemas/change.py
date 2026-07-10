from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

from app.schemas.obligation import ObligationRecord


ChangeType = Literal["Added", "Modified", "Removed"]


class ChangeRecord(BaseModel):
    type: ChangeType
    clause: str
    old: ObligationRecord | None = None
    new: ObligationRecord | None = None


class ChangesResponse(BaseModel):
    added: list[ObligationRecord]
    modified: list[ChangeRecord]
    removed: list[ObligationRecord]