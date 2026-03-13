"""Tests for the extract_action_items service function.

Coverage matrix
---------------
- TODO: / ACTION: / TASK:  keyword prefixes (direct and with list marker)
- Case-insensitivity for all keyword prefixes
- Markdown open-checkbox  - [ ]  and  * [ ]
- Exclamation-mark heuristic (plain and with list marker)
- Non-actionable / edge-case lines that must produce no output
- Integration test with a realistic mixed-content note
"""

import pytest

from backend.app.services.extract import extract_action_items


# ---------------------------------------------------------------------------
# Keyword-prefix patterns
# ---------------------------------------------------------------------------


class TestTodoPrefix:
    """TODO: prefix is recognised and stripped from the returned text."""

    def test_direct(self):
        assert extract_action_items("TODO: write tests") == ["write tests"]

    def test_with_dash_list_marker(self):
        assert extract_action_items("- TODO: write tests") == ["write tests"]

    def test_with_asterisk_list_marker(self):
        assert extract_action_items("* TODO: write tests") == ["write tests"]

    def test_case_insensitive_lower(self):
        assert extract_action_items("todo: lowercase task") == ["lowercase task"]

    def test_case_insensitive_mixed(self):
        assert extract_action_items("Todo: Mixed Case") == ["Mixed Case"]


class TestActionPrefix:
    """ACTION: prefix is recognised and stripped from the returned text."""

    def test_direct(self):
        assert extract_action_items("ACTION: review PR") == ["review PR"]

    def test_with_dash_list_marker(self):
        assert extract_action_items("- ACTION: review PR") == ["review PR"]

    def test_with_asterisk_list_marker(self):
        assert extract_action_items("* ACTION: deploy app") == ["deploy app"]

    def test_case_insensitive_lower(self):
        assert extract_action_items("action: send email") == ["send email"]

    def test_case_insensitive_mixed(self):
        assert extract_action_items("Action: Follow up") == ["Follow up"]


class TestTaskPrefix:
    """TASK: prefix is recognised and stripped from the returned text."""

    def test_direct(self):
        assert extract_action_items("TASK: update docs") == ["update docs"]

    def test_with_dash_list_marker(self):
        assert extract_action_items("- TASK: update docs") == ["update docs"]

    def test_with_asterisk_list_marker(self):
        assert extract_action_items("* TASK: update docs") == ["update docs"]

    def test_case_insensitive_lower(self):
        assert extract_action_items("task: fix linting") == ["fix linting"]

    def test_case_insensitive_mixed(self):
        assert extract_action_items("Task: Refactor module") == ["Refactor module"]


# ---------------------------------------------------------------------------
# Markdown open-checkbox patterns
# ---------------------------------------------------------------------------


class TestMarkdownCheckbox:
    """Open-checkbox items (- [ ] / * [ ]) are extracted with marker stripped."""

    def test_dash_checkbox(self):
        assert extract_action_items("- [ ] buy milk") == ["buy milk"]

    def test_asterisk_checkbox(self):
        assert extract_action_items("* [ ] call dentist") == ["call dentist"]

    def test_checkbox_loose_inner_spacing(self):
        # Allow whitespace inside the brackets
        assert extract_action_items("-  [  ]  something") == ["something"]

    def test_closed_checkbox_is_ignored(self):
        # - [x] is a *completed* item and must NOT be extracted
        assert extract_action_items("- [x] already done") == []

    def test_closed_checkbox_capital_x_ignored(self):
        assert extract_action_items("- [X] also done") == []


# ---------------------------------------------------------------------------
# Exclamation-mark heuristic (legacy behaviour preserved)
# ---------------------------------------------------------------------------


class TestExclamationMark:
    """Lines ending with '!' are extracted; any leading list marker is stripped."""

    def test_plain_exclamation(self):
        assert extract_action_items("Ship it!") == ["Ship it!"]

    def test_exclamation_with_dash_marker(self):
        assert extract_action_items("- Ship it!") == ["Ship it!"]

    def test_exclamation_with_asterisk_marker(self):
        assert extract_action_items("* Deploy now!") == ["Deploy now!"]


# ---------------------------------------------------------------------------
# Non-actionable / edge-case lines
# ---------------------------------------------------------------------------


class TestNonActionable:
    """Lines without recognised markers must not appear in the output."""

    def test_plain_sentence(self):
        assert extract_action_items("This is just a note") == []

    def test_empty_string(self):
        assert extract_action_items("") == []

    def test_whitespace_only(self):
        assert extract_action_items("   \n   \n") == []

    def test_blank_lines_in_multiline(self):
        text = "\n\nTODO: first task\n\n\nTODO: second task\n\n"
        items = extract_action_items(text)
        assert items == ["first task", "second task"]

    def test_unrelated_colon_line(self):
        # "NOTE:" is not a recognised prefix
        assert extract_action_items("NOTE: remember this") == []

    def test_done_checkbox_ignored(self):
        assert extract_action_items("- [x] finished") == []


# ---------------------------------------------------------------------------
# Multiple items in a single call
# ---------------------------------------------------------------------------


class TestMultipleItems:
    """extract_action_items correctly returns several items from one text."""

    def test_all_three_keywords_in_one_block(self):
        text = "TODO: write tests\nACTION: review PR\nTASK: update docs"
        items = extract_action_items(text)
        assert items == ["write tests", "review PR", "update docs"]

    def test_keywords_with_list_markers_in_one_block(self):
        text = "- TODO: fix bug\n* ACTION: deploy app\n- TASK: write tests"
        items = extract_action_items(text)
        assert "fix bug" in items
        assert "deploy app" in items
        assert "write tests" in items

    def test_both_checkbox_styles(self):
        text = "- [ ] buy milk\n* [ ] call dentist"
        items = extract_action_items(text)
        assert items == ["buy milk", "call dentist"]


# ---------------------------------------------------------------------------
# Integration: realistic mixed-content note
# ---------------------------------------------------------------------------


def test_extract_action_items_full_note():
    """A realistic meeting note returns exactly the six expected action texts."""
    text = """
    Meeting notes – 2024-01-15

    We discussed the upcoming release.

    - TODO: write tests
    - ACTION: review PR
    TASK: update docs
    - [ ] buy milk
    * [ ] call dentist
    - Ship it!

    Just some background info here.
    Not actionable at all.
    """.strip()

    items = extract_action_items(text)

    assert "write tests" in items
    assert "review PR" in items
    assert "update docs" in items
    assert "buy milk" in items
    assert "call dentist" in items
    assert "Ship it!" in items
    assert len(items) == 6
