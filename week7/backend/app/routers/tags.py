from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Tag
from ..schemas import TagCreate, TagRead

router = APIRouter(prefix="/tags", tags=["tags"])


@router.post("/", response_model=TagRead, status_code=201)
def create_tag(payload: TagCreate, db: Session = Depends(get_db)) -> TagRead:
    # Check if tag already exists
    existing = db.execute(select(Tag).where(Tag.name == payload.name)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Tag already exists")
    
    tag = Tag(name=payload.name)
    db.add(tag)
    db.flush()
    db.refresh(tag)
    return TagRead.model_validate(tag)


@router.get("/", response_model=list[TagRead])
def list_tags(db: Session = Depends(get_db)) -> list[TagRead]:
    stmt = select(Tag)
    rows = db.execute(stmt).scalars().all()
    return [TagRead.model_validate(row) for row in rows]