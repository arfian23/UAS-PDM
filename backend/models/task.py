from pydantic import BaseModel
from typing import Optional
from datetime import date, time


class Task(BaseModel):
    title: str
    description: Optional[str] = None
    task_date: date
    start_time: time
    end_time: time
    duration: int
    priority: str = "Medium"
    status: str = "Pending"