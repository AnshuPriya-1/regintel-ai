"""
Workflow Automation Engine (Phase 5).

Converts AI-extracted compliance obligations (Phase 4) into structured,
trackable workflow tasks: Regulation -> Compliance Requirement -> Task ->
Responsible Team -> Due Date -> Status.

Generation is deterministic (rule-based over the already-AI-extracted
obligation fields) rather than an extra LLM call: the obligation's
`department`, `deadline` and `risk` were already produced by Gemini during
extraction (Phase 4), so re-deriving the task from them is reproducible,
free, and never fails/hallucinates a due date. This keeps task generation
instant and offline-safe while still being fully AI-grounded end to end.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.models import task_store
from app.schemas.task import Task

_RISK_TO_PRIORITY = {
    "High": "Critical",
    "Medium": "Medium",
    "Low": "Low",
}


def _priority_for(risk: str) -> str:
    return _RISK_TO_PRIORITY.get(risk, "Medium")


def _owner_for(department: str) -> str:
    # No HR/roster system exists yet — assign to the department itself as a
    # placeholder owner; a real deployment would map this to a person.
    return f"{department} Lead"


def generate_tasks_from_obligations(obligations: list[dict]) -> tuple[list[Task], int]:
    """
    Build one workflow Task per obligation that doesn't already have one.

    Returns (new_tasks, skipped_existing_count).
    """
    existing_ids = task_store.get_existing_obligation_ids()
    now = datetime.now(timezone.utc)

    new_tasks: list[Task] = []
    skipped = 0

    for ob in obligations:
        ob_id = ob.get("id")
        if not ob_id or ob_id in existing_ids:
            skipped += 1
            continue

        task = Task(
            id=str(uuid.uuid4()),
            title=ob["action"],
            description=(
                f"Fulfil the obligation under {ob['regulation']} (Clause {ob['clause']}): "
                f"{ob['action']}. Required evidence: {ob['evidence']}."
            ),
            regulation=ob["regulation"],
            clause=ob["clause"],
            department=ob["department"],
            owner=_owner_for(ob["department"]),
            priority=_priority_for(ob.get("risk", "Medium")),
            status="To Do",
            due_date=ob["deadline"],
            progress=0,
            evidence=False,
            dependencies=[],
            comments=[],
            source_obligation_id=ob_id,
            created_at=now,
        )
        new_tasks.append(task)

    if new_tasks:
        task_store.save_tasks(new_tasks)

    return new_tasks, skipped
