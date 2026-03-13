# Claude AI Developer Guide for Week 4 Starter App

## 🏗️ Repository Structure
- `backend/app/routers/`: FastAPI endpoint handlers live here.
- `backend/app/schemas.py`: Pydantic models for API validation.
- `backend/app/models.py`: SQLAlchemy database models.
- `frontend/`: Static HTML, CSS, and vanilla JS (served by FastAPI).
- `data/`: SQLite database and `seed.sql`.
- `docs/`: TASKS and API documentation.

## 🚀 Environment & Run Commands
Always assume we are operating inside the `week4/` directory.
- **Environment**: Conda environment must be active (`conda activate cs146s`).
- **Run App**: `make run` (App runs on http://localhost:8000, Swagger UI on http://localhost:8000/docs).
- **Run Tests**: `make test` (runs pytest on the backend).
- **Code Formatting**: `make format` (runs black).
- **Code Linting**: `make lint` (runs ruff).

## 🛡️ Style and Safety Guardrails
1. **Test-Driven Workflow**: When asked to add a new endpoint, ALWAYS write a failing test first in `backend/tests/`, implement the code, and then run `make test` to verify.
2. **Strict Typing**: Never use `Dict[str, Any]` in routers. Always define proper Pydantic schemas in `schemas.py`.
3. **Pre-commit Routine**: After writing or modifying Python code, always run `make format` and `make lint` before declaring the task complete.
4. **Database Safety**: Do not drop or wipe the SQLite database directly. Use the provided `seed.sql` if data reset is needed.