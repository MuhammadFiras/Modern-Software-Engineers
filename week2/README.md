# Action Item Extractor (Week 2)

This directory contains the implementation and supporting materials for the **Action Item Extractor** developed during Week 2 of the Modern Software Development course. The purpose of the extractor is to parse meeting notes and identify actionable tasks using a simple natural language processing approach.

---

## 🧠 Overview

The Action Item Extractor reads from a collection of note files and uses keyword-based heuristics to identify lines that represent tasks or action items. It is designed as a lightweight proof-of-concept demonstrating text processing and automated extraction logic.

## 📁 Project Structure

```
week2/
├── app/
│   ├── __init__.py
│   ├── db.py                # database utilities (SQLite)
│   ├── main.py              # FastAPI app entry point
│   ├── schemas.py           # Pydantic models used by the API
│   ├── routers/
│   │   ├── action_items.py  # endpoint logic for action item extraction
│   │   └── notes.py         # simple notes endpoint
│   └── services/
│       └── extract.py       # core extraction logic
├── data/                    # sample data and support files
├── tests/                   # unit tests for extraction and routes
│   ├── test_extract.py
│   └── __init__.py
├── __pycache__/
├── README.md                # this documentation file
└── assignment.md            # original assignment prompt
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or newer
- Dependencies listed in `requirements.txt` (if provided)

### Installation

```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Running the Application

```bash
uvicorn week2.app.main:app --reload
```

Visit `http://localhost:8000/docs` to explore the Swagger UI.

## 🔍 How It Works

The extractor service in `week2/app/services/extract.py` defines a function that:
1. Reads text input (note content).
2. Splits lines and searches for verbs or keywords like "TODO", "action", "follow up", etc.
3. Constructs a list of detected action items and returns them as JSON.

The API route `/action-items` accepts POST requests with a `Note` schema containing a `text` field. It returns the parsed items.

## ✅ Testing

Unit tests located in `week2/tests` verify both the extraction logic and API route behavior. To run tests:

```bash
pytest week2/tests
```

## 📦 Sample Data

The `week2/data` directory includes example notes and a SQLite seed (if used) to demonstrate extraction results.

## 🤝 Contributions

This week’s implementation is mostly for learning; improvements could include:
- Using an NLP library (spaCy, NLTK) for more robust detection.
- Persisting results in a database.
- Adding frontend UI to display items.

## 📝 License

This code is provided as part of a course assignment and may be reused for educational purposes.

---

Feel free to explore and extend the extractor as you study text-processing techniques!