from __future__ import annotations

from fastapi import APIRouter, HTTPException

from .. import db
from ..schemas import NoteCreate, NoteResponse

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("", response_model=NoteResponse, status_code=201)
def create_note(payload: NoteCreate) -> NoteResponse:
    content = payload.content.strip()
    if not content:  # extra guard; validator already enforces min_length
        raise HTTPException(status_code=400, detail="content is required")

    note_id = db.insert_note(content)
    note = db.get_note(note_id)
    # the insert should always succeed, but be explicit for type checkers
    if note is None:
        raise HTTPException(status_code=500, detail="failed to create note")

    return NoteResponse(id=note["id"], content=note["content"], created_at=note["created_at"])


@router.get("/{note_id}", response_model=NoteResponse)
def get_single_note(note_id: int) -> NoteResponse:
    row = db.get_note(note_id)
    if row is None:
        raise HTTPException(status_code=404, detail="note not found")
    return NoteResponse(id=row["id"], content=row["content"], created_at=row["created_at"])

@router.get("/")
def get_all_notes():
    rows = db.list_notes()
    return [{"id": r["id"], "content": r["content"], "created_at": r["created_at"]} for r in rows]