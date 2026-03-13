import os
import pytest

from ..app.services.extract import extract_action_items, extract_action_items_llm
from ..app.services import extract  # import module for patching in LLM tests




def test_extract_bullets_and_checkboxes():
    text = """
    Notes from meeting:
    - [ ] Set up database
    * implement API extract endpoint
    1. Write tests
    Some narrative sentence.
    """.strip()

    items = extract_action_items(text)
    assert "Set up database" in items
    assert "implement API extract endpoint" in items
    assert "Write tests" in items


def test_extract_action_items_llm_bullets():
    text = """
    Notes:
    - [ ] Set up database
    * implement API
    """
    items = extract_action_items_llm(text)
    assert len(items) > 0
    assert any("database" in item.lower() for item in items)

def test_extract_action_items_llm_keywords():
    text = """
    TODO: fix bug in production
    ACTION: call the client
    """
    items = extract_action_items_llm(text)
    assert len(items) == 2

def test_extract_action_items_llm_empty():
    text = ""
    items = extract_action_items_llm(text)
    assert items == []
