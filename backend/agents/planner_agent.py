import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from google import genai

from config import GOOGLE_API_KEY
from rag.retriever import retrieve


client = genai.Client(api_key=GOOGLE_API_KEY)


SYSTEM_PROMPT = """
Anda adalah Planner Agent pada Smart Scheduler AI.

Tugas Anda hanya menyusun rencana jadwal berdasarkan permintaan pengguna
dan knowledge yang diperoleh melalui RAG.

Anda BUKAN Optimizer Agent.

Optimizer Agent akan memeriksa bentrok jadwal setelah Anda selesai.

Oleh karena itu:
- Jangan mengatakan jadwal telah berhasil dibuat.
- Jangan mengatakan jadwal telah berhasil dijadwalkan.
- Jangan mengatakan jadwal telah disimpan.
- Jangan mengatakan jadwal sudah final.
- Jangan menyebutkan proses optimasi.
- Cukup jelaskan hasil perencanaan awal secara singkat.

Jika knowledge menunjukkan adanya kalender akademik, hari libur,
jam operasional, prioritas, atau aturan penjadwalan,
tampilkan sebagai catatan kepada pengguna.

ATURAN:

1. Jika pengguna meminta membuat jadwal, ekstrak menjadi object task.

2. Jika pengguna hanya bertanya biasa, isi task = null.

3. Gunakan informasi TANGGAL SISTEM yang diberikan pada prompt
   sebagai acuan tanggal.

4. Jika pengguna menggunakan tanggal relatif seperti:
   - hari ini
   - besok
   - lusa

   gunakan tanggal yang sudah dihitung oleh sistem.

5. Jangan mengambil tanggal hari ini dari KNOWLEDGE.

6. KNOWLEDGE hanya digunakan sebagai referensi:
   - aturan penjadwalan
   - kalender akademik
   - hari libur
   - jam operasional
   - prioritas tugas

7. Waktu HARUS menggunakan format HH:MM.

8. Hitung duration dalam menit.

Contoh:
09:00 - 11:00
duration = 120

9. Response WAJIB JSON VALID.

10. Jangan gunakan markdown.

11. Jangan gunakan ```json.

12. Response hanya menjelaskan hasil perencanaan awal.

13. Gunakan kalimat seperti:
   - Jadwal awal telah direncanakan.
   - Berdasarkan kalender akademik...
   - Berdasarkan aturan penjadwalan...

FORMAT WAJIB:

{
    "response": "",
    "task": {
        "title": "",
        "description": "",
        "task_date": "YYYY-MM-DD",
        "start_time": "HH:MM",
        "end_time": "HH:MM",
        "duration": 120,
        "priority": "Medium",
        "status": "Pending"
    }
}

Jika bukan membuat jadwal:

{
    "response": "",
    "task": null
}
"""


def planner(user_query: str):

    # ==========================================
    # TANGGAL SISTEM
    # ==========================================

    now = datetime.now(ZoneInfo("Asia/Jakarta"))

    today = now.date()
    tomorrow = today + timedelta(days=1)
    day_after_tomorrow = today + timedelta(days=2)

    today_str = today.strftime("%Y-%m-%d")
    tomorrow_str = tomorrow.strftime("%Y-%m-%d")
    day_after_tomorrow_str = day_after_tomorrow.strftime("%Y-%m-%d")

    # ==========================================
    # RETRIEVE KNOWLEDGE DARI RAG
    # ==========================================

    knowledge = retrieve(user_query)

    context = "\n\n".join(
        [
            f"File : {item['filename']}\n\n{item['content']}"
            for item in knowledge
        ]
    )

    # ==========================================
    # PROMPT PLANNER
    # ==========================================

    prompt = f"""
{SYSTEM_PROMPT}

==============================
TANGGAL SISTEM
==============================

Zona waktu: Asia/Jakarta

Hari ini:
{today_str}

Besok:
{tomorrow_str}

Lusa:
{day_after_tomorrow_str}

WAJIB gunakan tanggal di atas apabila pengguna menggunakan
kata "hari ini", "besok", atau "lusa".

Jangan menghitung ulang tanggal tersebut menggunakan knowledge.

==============================
KNOWLEDGE RAG
==============================

{context}

==============================
PERMINTAAN PENGGUNA
==============================

{user_query}

Kembalikan JSON VALID SAJA.
"""

    # ==========================================
    # GEMINI
    # ==========================================

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    text = response.text.strip()

    text = (
        text.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    # ==========================================
    # PARSE RESPONSE
    # ==========================================

    try:

        data = json.loads(text)

        if data.get("task"):

            task = data["task"]

            task.setdefault("priority", "Medium")
            task.setdefault("status", "Pending")
            task.setdefault("description", "")

            # ==================================
            # VALIDASI TANGGAL RELATIF
            # ==================================

            query_lower = user_query.lower()

            if "lusa" in query_lower:
                task["task_date"] = day_after_tomorrow_str

            elif "besok" in query_lower:
                task["task_date"] = tomorrow_str

            elif "hari ini" in query_lower:
                task["task_date"] = today_str

            # ==================================
            # HITUNG DURASI
            # ==================================

            if "duration" not in task or not task["duration"]:

                try:

                    start = datetime.strptime(
                        task["start_time"],
                        "%H:%M"
                    )

                    end = datetime.strptime(
                        task["end_time"],
                        "%H:%M"
                    )

                    duration = int(
                        (end - start).total_seconds() / 60
                    )

                    # Jika melewati tengah malam
                    if duration < 0:
                        duration += 24 * 60

                    task["duration"] = duration

                except Exception:

                    task["duration"] = 60

        return data

    except Exception as error:

        print("Gagal parsing response Planner Agent:", error)
        print("Response Gemini:", text)

        return {
            "response": text,
            "task": None
        }


if __name__ == "__main__":

    hasil = planner(
        "Besok jam 08.00 presentasi AI sampai jam 10.00 prioritas tinggi"
    )

    print(
        json.dumps(
            hasil,
            indent=4,
            ensure_ascii=False
        )
    )