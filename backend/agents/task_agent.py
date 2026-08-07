import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from database.task import save_task
from google import genai
from config import GOOGLE_API_KEY


client = genai.Client(api_key=GOOGLE_API_KEY)


def extract_task(user_input: str):

    # ==========================================
    # TANGGAL BERDASARKAN TIMEZONE INDONESIA
    # ==========================================
    now = datetime.now(ZoneInfo("Asia/Jakarta"))

    today = now.date()
    tomorrow = today + timedelta(days=1)
    day_after_tomorrow = today + timedelta(days=2)

    prompt = f"""
Kamu adalah AI Scheduler.

Gunakan tanggal referensi sistem berikut:

Hari ini: {today}
Besok: {tomorrow}
Lusa: {day_after_tomorrow}

PENTING:
- Jangan menentukan tanggal hari ini sendiri.
- Gunakan tanggal referensi sistem di atas.
- Jika pengguna mengatakan "hari ini", gunakan {today}.
- Jika pengguna mengatakan "besok", gunakan {tomorrow}.
- Jika pengguna mengatakan "lusa", gunakan {day_after_tomorrow}.
- Jika pengguna mengatakan "minggu depan", hitung berdasarkan {today}.
- Jika pengguna mengatakan nama hari seperti "senin depan",
  hitung berdasarkan {today}.
- Jangan menggunakan tanggal dari percakapan sebelumnya.
- task_date harus menggunakan format YYYY-MM-DD.

Jika pengguna tidak memberikan jam:
- Tentukan jam yang wajar berdasarkan jenis kegiatan.
- Pastikan start_time dan end_time valid.

Balas HANYA JSON tanpa markdown.

Format:

{{
    "title": "",
    "description": "",
    "task_date": "YYYY-MM-DD",
    "start_time": "HH:MM",
    "end_time": "HH:MM",
    "duration": 0,
    "priority": "Low",
    "status": "Pending"
}}

Kalimat pengguna:
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
        "Besok jam 8 pagi presentasi Data Mining "
        "selama 2 jam prioritas tinggi"
    )

    print(json.dumps(
        hasil,
        indent=4,
        ensure_ascii=False
    ))

    response = save_task(hasil)

    print("\n✅ Task berhasil disimpan ke Supabase.")

    if response.data:
        print("ID :", response.data[0]["id"])