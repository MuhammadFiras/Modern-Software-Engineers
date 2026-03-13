from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from .db import init_db
from .routers import action_items, notes
from . import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Action Item Extractor", lifespan=lifespan)

# ensure directories, mount static as before
Path("week2/frontend").mkdir(parents=True, exist_ok=True)  # kept for compatibility
app.mount("/static", StaticFiles(directory=str(Path(__file__).resolve().parents[1] / "frontend")), name="static")

# routers
app.include_router(notes.router)
app.include_router(action_items.router)

# keep existing index endpoint
@app.get("/", response_class=HTMLResponse)
def index() -> str:
    html_path = Path(__file__).resolve().parents[1] / "frontend" / "index.html"
    return html_path.read_text(encoding="utf-8")