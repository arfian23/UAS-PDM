import json
from datetime import datetime
from database.task import save_task
from google import genai
from config import GOOGLE_API_KEY

client = genai.Client(api_key=GOOGLE_API_KEY)


def extract_task(user_input: str):

    today = datetime.today().strftime("%Y-%m-%d")

    prompt = f"""
Kamu adalah AI Scheduler.

Hari ini adalah {today}.

Jika pengguna mengatakan:
- hari ini
- besok
- lusa
- minggu depan
- senin depan

maka hitung berdasarkan tanggal hari ini.

Balas HANYA JSON tanpa markdown.

Format:

{{
    "title":"",
    "description":"",
    "task_date":"YYYY-MM-DD",
    "start_time":"HH:MM",
    "end_time":"HH:MM",
    "duration":0,
    "priority":"Low",
    "status":"Pending"
}}


Kalimat:
{user_input}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    return json.loads(text)


if __name__ == "__main__":

    hasil = extract_task(
        "Besok jam 8 pagi presentasi Data Mining selama 2 jam prioritas tinggi"
    )

    print(json.dumps(hasil, indent=4, ensure_ascii=False))

    response = save_task(hasil)

    print("\n✅ Task berhasil disimpan ke Supabase.")

    if response.data:
        print("ID :", response.data[0]["id"])