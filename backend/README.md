# RegIntel-AI Backend

FastAPI service that extracts SEBI compliance obligations from uploaded PDFs using Gemini.

## Setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env   # then fill in GEMINI_API_KEY
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

Swagger UI: http://localhost:8000/docs

## Endpoints

- `POST /upload` — multipart form upload, field name `file` (PDF only). Extracts text, chunks it,
  sends each chunk to Gemini, and returns structured obligations.
- `GET /obligations` — returns all obligations extracted so far (in-memory store), most recent first.
- `GET /health` — 200 if `GEMINI_API_KEY` is configured, 503 otherwise.

## Architecture

```
app/
  main.py              FastAPI app, CORS, router registration
  config.py            Environment-driven settings (pydantic-settings)
  routes/
    upload.py           POST /upload — thin controller, delegates to services
    obligations.py       GET /obligations
  services/
    pdf_parser.py        PyMuPDF text extraction + chunking
    gemini_service.py    Gemini API client
    prompt_templates.py  Extraction system/user prompts
    extractor.py          Orchestrates chunking -> Gemini -> validation -> dedupe
  schemas/
    obligation.py         Pydantic request/response models
  models/
    store.py              In-memory obligation store (swap for a DB later)
  utils/
    logger.py             Shared logging config
    exceptions.py          Domain exceptions -> HTTP error mapping
```

Business logic lives entirely in `services/`; routes only validate input, call services, and map
exceptions to HTTP status codes.

## Notes

- Persistence is in-memory (`models/store.py`) and resets on restart — sufficient for a hackathon demo.
  Swap in a real database by changing only that module.
- Scanned/image-only PDFs aren't supported (no OCR) — PyMuPDF needs an embedded text layer.
