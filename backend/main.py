from fastapi import FastAPI
from api.planner import router as planner_router
from api.task import router as task_router
from api.agent import router as agent_router

app = FastAPI(
    title="Smart Scheduler AI",
    version="1.0.0"
)

# Register semua router
app.include_router(task_router)
app.include_router(agent_router)
app.include_router(planner_router)


@app.get("/")
def home():
    return {
        "message": "Smart Scheduler AI is running 🚀"
    }