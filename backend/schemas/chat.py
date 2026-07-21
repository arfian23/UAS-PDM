from typing import Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class TaskAI(BaseModel):
    title: str
    description: str
    task_date: str
    start_time: str
    end_time: str
    duration: int
    priority: str
    status: str


class ChatResponse(BaseModel):
    response: str
    task: Optional[TaskAI] = None