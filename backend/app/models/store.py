"""
Minimal in-memory store for extracted obligations.

For a hackathon-scope backend this avoids standing up a database while still
giving GET /obligations somewhere to read from. Swap this out for a real
persistence layer (Postgres, etc.) without touching the routes layer, since
routes only depend on the functions below.
"""
from threading import Lock

from app.schemas.obligation import ObligationRecord

_lock = Lock()
_obligations: list[ObligationRecord] = []


def save_obligations(records: list[ObligationRecord]) -> None:
    """Append newly extracted obligations to the store."""
    with _lock:
        _obligations.extend(records)


def get_all_obligations() -> list[ObligationRecord]:
    """Return the most recently extracted obligations first."""
    with _lock:
        return list(reversed(_obligations))


def clear_obligations() -> None:
    with _lock:
        _obligations.clear()
