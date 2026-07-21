from database.supabase import supabase
from datetime import datetime


def time_to_minutes(time_str):
    parts = str(time_str).split(":")
    h = int(parts[0])
    m = int(parts[1])
    return h * 60 + m


def optimizer(task):

    if task is None:
        return {
            "response": "",
            "task": None
        }

    result = (
        supabase
        .table("tasks")
        .select("*")
        .eq("task_date", task["task_date"])
        .execute()
    )

    tasks = result.data

    start = time_to_minutes(task["start_time"])
    end = time_to_minutes(task["end_time"])

    for item in tasks:

        old_start = time_to_minutes(item["start_time"])
        old_end = time_to_minutes(item["end_time"])

        if start < old_end and end > old_start:

            new_start = old_end
            new_end = new_start + task["duration"]

            hh1 = new_start // 60
            mm1 = new_start % 60

            hh2 = new_end // 60
            mm2 = new_end % 60

            #Update task ke waktu baru
            task["start_time"] = f"{hh1:02}:{mm1:02}"
            task["end_time"] = f"{hh2:02}:{mm2:02}"

            recommendation = (
                f"Terjadi bentrok dengan jadwal '{item['title']}'. "
                f"Jadwal telah dioptimalkan secara otomatis ke "
                f"{task['start_time']} - {task['end_time']}."
            )

            return {
                "response": recommendation,
                "task": task
            }

    return {
        "response": "Tidak ditemukan bentrok jadwal.",
        "task": task
    }