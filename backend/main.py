from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "tasks.json"

app = FastAPI(title="Todo API")


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    completed: bool = False


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_data_file() -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]", encoding="utf-8")


def read_tasks() -> list[dict]:
    ensure_data_file()
    try:
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def write_tasks(tasks: list[dict]) -> None:
    DATA_FILE.write_text(json.dumps(tasks, indent=2), encoding="utf-8")


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "message": "Todo backend is running",
        "timestamp": now_iso(),
    }


@app.get("/api/tasks")
def get_tasks() -> list[dict]:
    return read_tasks()


@app.post("/api/tasks")
def create_task(payload: TaskCreate) -> dict[str, Any]:
    tasks = read_tasks()
    task = {
        "id": str(uuid4()),
        "title": payload.title.strip(),
        "description": payload.description.strip(),
        "completed": payload.completed,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    tasks.insert(0, task)
    write_tasks(tasks)
    return task


@app.put("/api/tasks/{task_id}")
def update_task(task_id: str, payload: TaskCreate) -> dict[str, Any]:
    tasks = read_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["title"] = payload.title.strip()
            task["description"] = payload.description.strip()
            task["completed"] = payload.completed
            task["updatedAt"] = now_iso()
            write_tasks(tasks)
            return task

    raise HTTPException(status_code=404, detail="Task not found")


@app.patch("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: str) -> dict[str, Any]:
    tasks = read_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task.get("completed", False)
            task["updatedAt"] = now_iso()
            write_tasks(tasks)
            return task

    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str) -> dict[str, str]:
    tasks = read_tasks()
    filtered = [task for task in tasks if task["id"] != task_id]

    if len(filtered) == len(tasks):
        raise HTTPException(status_code=404, detail="Task not found")

    write_tasks(filtered)
    return {"message": "Task deleted successfully"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
