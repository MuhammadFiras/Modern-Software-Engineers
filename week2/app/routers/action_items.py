from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException

from .. import db
from ..services.extract import extract_action_items
from ..services.extract import extract_action_items_llm
from ..schemas import (
    ActionItemDoneRequest,
    ActionItemDoneResponse,
    ActionItemExtractRequest,
    ActionItemExtractResponse,
    ActionItemExtractResponseItem,
    ActionItemResponse,
)

router = APIRouter(prefix="/action-items", tags=["action-items"])


@router.post("/extract", response_model=ActionItemExtractResponse)
def extract(payload: ActionItemExtractRequest) -> ActionItemExtractResponse:
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    note_id: Optional[int] = None
    if payload.save_note:
        note_id = db.insert_note(text)

    items = extract_action_items(text)
    ids = db.insert_action_items(items, note_id=note_id)
    resp_items = [
        ActionItemExtractResponseItem(id=i, text=t) for i, t in zip(ids, items)
    ]
    return ActionItemExtractResponse(note_id=note_id, items=resp_items)


@router.get("", response_model=List[ActionItemResponse])
def list_all(note_id: Optional[int] = None) -> List[ActionItemResponse]:
    rows = db.list_action_items(note_id=note_id)
    return [
        ActionItemResponse(
            id=r["id"],
            note_id=r["note_id"],
            text=r["text"],
            done=bool(r["done"]),
            created_at=r["created_at"],
        )
        for r in rows
    ]


@router.post("/{action_item_id}/done", response_model=ActionItemDoneResponse)
def mark_done(
    action_item_id: int, payload: ActionItemDoneRequest
) -> ActionItemDoneResponse:
    row = db.get_action_item(action_item_id)
    if row is None:
        raise HTTPException(status_code=404, detail="action item not found")
    db.mark_action_item_done(action_item_id, payload.done)
    return ActionItemDoneResponse(id=action_item_id, done=payload.done)

@router.post("/extract-llm")
def extract_llm(payload: ActionItemExtractRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    note_id: Optional[int] = None
    if payload.save_note:
        note_id = db.insert_note(text)

    # Memanggil fungsi AI yang kita buat di TODO 1
    items = extract_action_items_llm(text)
    ids = db.insert_action_items(items, note_id=note_id)
    
    return {"note_id": note_id, "items": [{"id": i, "text": t} for i, t in zip(ids, items)]}