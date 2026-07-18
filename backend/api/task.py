from fastapi import APIRouter
from models.task import Task
from database.supabase import supabase

router = APIRouter()


# CREATE
@router.post("/tasks")
def create_task(task: Task):

    result = (
        supabase
        .table("tasks")
        .insert(task.model_dump(mode="json"))
        .execute()
    )

    return result.data


# READ
@router.get("/tasks")
def get_tasks():

    result = (
        supabase
        .table("tasks")
        .select("*")
        .order("task_date")
        .execute()
    )

    return result.data


# UPDATE
@router.put("/tasks/{task_id}")
def update_task(task_id: str, task: Task):

    result = (
        supabase
        .table("tasks")
        .update(task.model_dump(mode="json"))
        .eq("id", task_id)
        .execute()
    )

    return result.data


# DELETE
@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):

    result = (
        supabase
        .table("tasks")
        .delete()
        .eq("id", task_id)
        .execute()
    )

    return result.data