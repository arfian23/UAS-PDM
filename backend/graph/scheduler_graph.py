from typing import TypedDict, Optional

from langgraph.graph import StateGraph, END

from agents.planner_agent import planner
from agents.optimizer_agent import optimizer


class SchedulerState(TypedDict):
    user_query: str
    response: str
    task: Optional[dict]


# -----------------------
# Planner Agent
# -----------------------
def planner_node(state: SchedulerState):

    result = planner(state["user_query"])

    return {
        "response": result.get("response", ""),
        "task": result.get("task")
    }


# -----------------------
# Optimizer Agent
# -----------------------
def optimizer_node(state: SchedulerState):

    result = optimizer(state["task"])

    response = state["response"]

    if result["response"]:
        response += "\n\n" + result["response"]

    return {
        "response": response,
        "task": state["task"]
    }


# -----------------------
# Graph
# -----------------------
builder = StateGraph(SchedulerState)

builder.add_node("planner", planner_node)
builder.add_node("optimizer", optimizer_node)

builder.set_entry_point("planner")

builder.add_edge("planner", "optimizer")
builder.add_edge("optimizer", END)

graph = builder.compile()


if __name__ == "__main__":

    result = graph.invoke(
        {
            "user_query": "Saya ingin menjadwalkan presentasi AI hari Senin jam 09.00 sampai 11.00"
        }
    )

    print("\n==============================")
    print("HASIL GRAPH")
    print("==============================")

    print(result["response"])