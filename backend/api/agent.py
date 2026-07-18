from fastapi import APIRouter
from pydantic import BaseModel

from agents.task_agent import extract_task
from database.supabase import supabase

router = APIRouter()


class UserInput(BaseModel):
    text: str


@router.post("/agent/task")
def create_task_from_ai(user: UserInput):

    task = extract_task(user.text)

    result = (
        supabase
        .table("tasks")
        .insert(task)
        .execute()
    )

    return result.data