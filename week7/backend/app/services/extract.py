"""Service for extracting action items from note text.

Supported patterns (case-insensitive):
  - Keyword prefixes : TODO: / ACTION: / TASK:
                       optionally preceded by a Markdown list marker ("- " or "* ")
  - Markdown checkboxes : "- [ ] …" or "* [ ] …"
  - Exclamation heuristic : any line ending with '!' (leading list marker stripped)

Extracted strings are returned *without* their prefix/marker so only the
meaningful action text is kept.
"""

import re

# ---------------------------------------------------------------------------
# Compiled patterns
# ---------------------------------------------------------------------------

# Matches keyword prefixes (TODO / ACTION / TASK) with an optional leading
# Markdown list marker, and open-checkbox items ("- [ ]" / "* [ ]").
# Capture group 1: the clean action text that follows the prefix.
_ACTION_PREFIX_RE = re.compile(
    r"""
    ^                               # start of line
    (?:
        [-*]\s*\[\s*\]\s*           # markdown open-checkbox: - [ ] or * [ ]
      | (?:[-*]\s+)?                # optional list marker for keyword prefixes
        (?:TODO|ACTION|TASK):\s*    # keyword prefix (case-insensitive via flag)
    )
    (.+)                            # capture group 1: action text
    $                               # end of line
    """,
    re.IGNORECASE | re.VERBOSE,
)

# Matches lines that end with '!', stripping an optional leading list marker.
# Capture group 1: the text including the trailing '!'.
_EXCLAMATION_RE = re.compile(
    r"^(?:[-*]\s+)?(.+!)\s*$",
    re.IGNORECASE,
)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def extract_action_items(text: str) -> list[str]:
    """Parse *text* line-by-line and return a list of clean action item strings.

    A line is considered an action item when it:

    * starts with a recognised keyword prefix (TODO / ACTION / TASK,
      case-insensitive), optionally preceded by a Markdown list marker
      ("- " or "* "); OR
    * is a Markdown open-checkbox ("- [ ] …" or "* [ ] …"); OR
    * ends with an exclamation mark (legacy heuristic; leading list marker
      is stripped before the text is stored).

    The returned strings are stripped of any prefix/marker so they contain
    only the meaningful action text.
    """
    results: list[str] = []

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        # --- keyword prefix / checkbox ---
        m = _ACTION_PREFIX_RE.match(line)
        if m:
            results.append(m.group(1).strip())
            continue

        # --- exclamation-mark heuristic (legacy) ---
        m = _EXCLAMATION_RE.match(line)
        if m:
            results.append(m.group(1).strip())

    return results
