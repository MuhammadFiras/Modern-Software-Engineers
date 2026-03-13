# Action Item Extractor (Week 2)

Minimal FastAPI + SQLite starter that turns free‑form notes into actionable
checklists.  This project was built as part of the CS 146 “Modern Software
Development” weekly assignments; Week 2 focuses on adding an LLM‑powered
extractor and improving the backend/front‑end structure.

## Features

* FastAPI backend with sqlite3 persistence via a simple DB layer.
* `/action-items/extract` – heuristic extraction from raw text.
* `/action-items/extract-llm` – LLM (Ollama)‑driven extraction.
* Basic notes storage with list/retrieve endpoints.
* Pydantic schemas for request/response validation.
* Static HTML/JS frontend to exercise the API (no build step).
* pytest tests for extraction logic and endpoints.
* Pre‑commit configuration (black/ruff) included.

## Getting started

```bash
# from the repo root
cd week2

# create & activate venv
python -m venv .venv
source .venv/bin/activate   # or `.venv\Scripts\activate` on Windows

pip install -e .[dev]       # installs FastAPI, ollama client, pytest, etc.