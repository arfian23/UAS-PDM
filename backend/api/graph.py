from fastapi import APIRouter

from graph.scheduler_graph import graph
from schemas.chat import ChatRequest, ChatResponse, TaskAI
from agents.optimizer_agent import optimizer

router = APIRouter(
    prefix="/graph",
    tags=["LangGraph"]
)


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    result = graph.invoke(
        {
            "user_query": request.message
        }
    )

    task = None

    if result.get("task") is not None:
        task = TaskAI(**result["task"])

    return ChatResponse(
        response=result["response"],
        task=task
    )

def optimizer_node(state):

    result = optimizer(state["task"])

    if result["response"] != "Tidak ditemukan bentrok jadwal.":

        state["response"] += "\n\n" + result["response"]

    return {
        "response": state["response"],
        "task": state["task"]
    }