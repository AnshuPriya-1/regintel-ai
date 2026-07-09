"""GET /obligations — returns the latest extracted compliance obligations."""
from fastapi import APIRouter

from app.models import store
from app.schemas.obligation import ObligationsListResponse

router = APIRouter(tags=["obligations"])


@router.get("/obligations", response_model=ObligationsListResponse)
async def list_obligations() -> ObligationsListResponse:
    """Returns all obligations extracted so far, most recent first."""
    obligations = store.get_all_obligations()
    return ObligationsListResponse(count=len(obligations), obligations=obligations)
