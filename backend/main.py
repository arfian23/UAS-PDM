from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.planner import router as planner_router
from api.task import router as task_router
from api.agent import router as agent_router
from api.graph import router as graph_router

app = FastAPI(
    title="Smart Scheduler AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "uas-pdm-production.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router)
app.include_router(agent_router)
app.include_router(planner_router)
app.include_router(graph_router)

@app.get("/")
def home():
    return {
        "message": "Smart Scheduler AI is running 🚀"
    }