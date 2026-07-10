from typing import Dict, List


def detect_changes(old_obligations: List[dict], new_obligations: List[dict]) -> Dict:
    """
    Compare two obligation lists and detect:
    - Added obligations
    - Removed obligations
    - Modified obligations
    """

    old_map = {
        item["clause_number"]: item
        for item in old_obligations
    }

    new_map = {
        item["clause_number"]: item
        for item in new_obligations
    }

    added = []
    removed = []
    modified = []

    # Detect Added & Modified
    for clause, new_item in new_map.items():

        if clause not in old_map:
            added.append({
                "type": "Added",
                "clause": clause,
                "new_action": new_item["action_required"],
            })

        else:
            old_item = old_map[clause]

            if old_item["action_required"] != new_item["action_required"]:
                modified.append({
                    "type": "Modified",
                    "clause": clause,
                    "old_action": old_item["action_required"],
                    "new_action": new_item["action_required"],
                })

    # Detect Removed
    for clause, old_item in old_map.items():

        if clause not in new_map:
            removed.append({
                "type": "Removed",
                "clause": clause,
                "old_action": old_item["action_required"],
            })

    return {
        "added": added,
        "modified": modified,
        "removed": removed,
    }