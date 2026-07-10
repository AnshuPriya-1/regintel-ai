"""GET /obligations — returns the latest extracted compliance obligations."""
from fastapi import APIRouter

from app.models import store
from app.schemas.obligation import ObligationsListResponse
from app.services.change_detector import detect_changes

router = APIRouter(tags=["obligations"])


@router.get("/obligations", response_model=ObligationsListResponse)
async def list_obligations() -> ObligationsListResponse:
    data = store.get_all_obligations()

    obligations = data.get("obligations", [])

    return ObligationsListResponse(
        count=len(obligations),
        obligations=obligations,
    )


@router.get("/changes")
async def get_changes():
    old = store.get_version(1)
    new = store.get_version(2)

    changes = detect_changes(
        old.get("obligations", []),
        new.get("obligations", []),
    )

    return {
        "oldTitle": old.get("document", "Version 1"),
        "newTitle": new.get("document", "Version 2"),

        "added": [
            {
                "clause": item["clause"],
                "text": item["new_action"],
            }
            for item in changes["added"]
        ],

        "modified": [
            {
                "clause": item["clause"],
                "old": item["old_action"],
                "new": item["new_action"],
            }
            for item in changes["modified"]
        ],

        "removed": [
            {
                "clause": item["clause"],
                "text": item["old_action"],
            }
            for item in changes["removed"]
        ],
    }