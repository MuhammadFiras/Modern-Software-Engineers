from __future__ import annotations
from typing import List, Optional

from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    content: str = Field(..., min_length=1)


class NoteResponse(BaseModel):
    id: int
    content: str
    created_at: str


class ActionItemExtractRequest(BaseModel):
    text: str = Field(..., min_length=1)
    save_note: bool = False


class ActionItemExtractResponseItem(BaseModel):
    id: int
    text: str


class ActionItemExtractResponse(BaseModel):
    note_id: Optional[int]
    items: List[ActionItemExtractResponseItem]


class ActionItemResponse(BaseModel):
    id: int
    note_id: Optional[int]
    text: str
    done: bool
    created_at: str


class ActionItemDoneRequest(BaseModel):
    done: bool = True


class ActionItemDoneResponse(BaseModel):
    id: int
    done: bool