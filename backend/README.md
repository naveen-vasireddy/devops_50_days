# Todo List Backend

This is a Python FastAPI backend for a todo app.

## Features

- Get all tasks
- Create a new task
- Update a task
- Toggle a task's completion state
- Delete a task
- Health check endpoint

## Available routes

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle`
- `DELETE /api/tasks/:id`

## Run locally

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server runs on `http://localhost:8000`.
