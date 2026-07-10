import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

OBLIGATION_PATH = os.path.join(
    BASE_DIR,
    "data",
    "obligations",
    "master.json"
)


def save_obligations(data):
    with open(OBLIGATION_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)