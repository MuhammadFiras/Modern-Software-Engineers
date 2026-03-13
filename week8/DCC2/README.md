# Developer Control Center — Django + React

A full-stack CRUD app for managing notes and action items, built with **Django REST Framework** (Python) on the backend and **React** (Vite) on the frontend.

## Tech Stack
- **Backend:** Python 3.10+, Django 4.2, Django REST Framework, SQLite
- **Frontend:** React 18, Vite 5, plain CSS

## Prerequisites
- Python 3.10 or later
- Node.js 18+ and npm

## Setup & Run

### 1. Backend (Django)

```bash
cd DCC2/backend

# Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server (runs on http://127.0.0.1:8000)
python manage.py runserver
```

### 2. Frontend (React)

Open a **second terminal**:

```bash
cd DCC2/frontend

npm install
npm run dev
# Runs on http://localhost:3001
```

Open **http://localhost:3001** in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes/ | List all notes |
| POST | /api/notes/ | Create a note |
| GET | /api/notes/:id/ | Get a note |
| PUT | /api/notes/:id/ | Update a note |
| DELETE | /api/notes/:id/ | Delete a note |
| GET | /api/action-items/ | List all action items |
| POST | /api/action-items/ | Create an action item |
| GET | /api/action-items/:id/ | Get an action item |
| PUT | /api/action-items/:id/ | Update an action item |
| DELETE | /api/action-items/:id/ | Delete an action item |

## Environment Configuration
- No `.env` file needed — Django uses SQLite by default (`db.sqlite3` in `backend/`).
- The Vite dev server proxies `/api` requests to `http://127.0.0.1:8000`.

## Known Issues / Notes
- This is a development setup; CORS is set to allow all origins.
- No authentication is implemented.
