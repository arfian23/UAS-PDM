from fastapi import APIRouter
from pydantic import BaseModel

from agents.planner_agent import planner

router = APIRouter(
    prefix="/planner",
    tags=["Planner"]
)


class PlannerInput(BaseModel):
    text: str


@router.post("/")
def create_planner(user: PlannerInput):

    answer = planner(user.text)

    return {
        "response": answer
    }