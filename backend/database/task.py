from database.supabase import supabase


def save_task(task: dict):
    """
    Menyimpan task ke tabel tasks
    """

    response = (
        supabase
        .table("tasks")
        .insert(task)
        .execute()
    )

    return response