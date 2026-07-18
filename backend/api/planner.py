from fastapi import APIRouter
from pydantic import BaseModel

from agents.planner_agent import create_plan
from database.supabase import supabase

router = APIRouter()

class PlannerInput(BaseModel):
    text: str


@router.post("/agent/planner")
def planner(user: PlannerInput):

    existing = (
        supabase
        .table("tasks")
        .select("*")
        .execute()
    )

    plans = create_plan(
        user.text,
        existing.data
    )

    for task in plans:
        (
            supabase
            .table("tasks")
            .insert(task)
            .execute()
        )

    return plans