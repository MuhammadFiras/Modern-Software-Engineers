from __future__ import annotations

import os
import re
from typing import List
import json
from typing import Any
from ollama import chat
from dotenv import load_dotenv

load_dotenv()

BULLET_PREFIX_PATTERN = re.compile(r"^\s*([-*•]|\d+\.)\s+")
KEYWORD_PREFIXES = (
    "todo:",
    "action:",
    "next:",
)


def _is_action_line(line: str) -> bool:
    stripped = line.strip().lower()
    if not stripped:
        return False
    if BULLET_PREFIX_PATTERN.match(stripped):
        return True
    if any(stripped.startswith(prefix) for prefix in KEYWORD_PREFIXES):
        return True
    if "[ ]" in stripped or "[todo]" in stripped:
        return True
    return False


def extract_action_items(text: str) -> List[str]:
    lines = text.splitlines()
    extracted: List[str] = []
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        if _is_action_line(line):
            cleaned = BULLET_PREFIX_PATTERN.sub("", line)
            cleaned = cleaned.strip()
            # Trim common checkbox markers
            cleaned = cleaned.removeprefix("[ ]").strip()
            cleaned = cleaned.removeprefix("[todo]").strip()
            extracted.append(cleaned)
    # Fallback: if nothing matched, heuristically split into sentences and pick imperative-like ones
    if not extracted:
        sentences = re.split(r"(?<=[.!?])\s+", text.strip())
        for sentence in sentences:
            s = sentence.strip()
            if not s:
                continue
            if _looks_imperative(s):
                extracted.append(s)
    # Deduplicate while preserving order
    seen: set[str] = set()
    unique: List[str] = []
    for item in extracted:
        lowered = item.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        unique.append(item)
    return unique

def extract_action_items_llm(text: str) -> List[str]:
    """
    Extract action items using an LLM via Ollama.
    Returns a list of strings representing the extracted tasks.
    """
    # Jika teks kosong, langsung kembalikan list kosong
    if not text.strip():
        return []
        
    system_prompt = """
    You are an AI assistant that extracts action items, tasks, and to-dos from unstructured notes.
    You must strictly output a JSON object with a single key "action_items" containing a list of strings.
    Example output:
    {"action_items": ["Buy milk", "Call John"]}
    If there are no action items, output {"action_items": []}.
    Do NOT include any markdown formatting, conversational text, or explanations. Just the JSON.
    """
    
    try:
        # Memanggil Ollama menggunakan model llama3.1:8b
        response = chat(
            model="llama3.1:8b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            format="json",  # Memaksa output berupa JSON valid
            options={"temperature": 0.0}  # Suhu 0 agar hasilnya konsisten dan tidak berhalusinasi
        )
        
        # Mengubah string JSON dari LLM menjadi dictionary Python
        result = json.loads(response.message.content)
        
        # Mengambil list dari key "action_items"
        return result.get("action_items", [])
        
    except Exception as e:
        print(f"Error during LLM extraction: {e}")
        # Kembalikan list kosong jika terjadi error (misal Ollama mati atau JSON gagal diparsing)
        return []


def _looks_imperative(sentence: str) -> bool:
    words = re.findall(r"[A-Za-z']+", sentence)
    if not words:
        return False
    first = words[0]
    # Crude heuristic: treat these as imperative starters
    imperative_starters = {
        "add",
        "create",
        "implement",
        "fix",
        "update",
        "write",
        "check",
        "verify",
        "refactor",
        "document",
        "design",
        "investigate",
    }
    return first.lower() in imperative_starters
