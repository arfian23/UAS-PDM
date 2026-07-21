import json
from datetime import datetime

from google import genai

from config import GOOGLE_API_KEY
from rag.retriever import retrieve

client = genai.Client(api_key=GOOGLE_API_KEY)


SYSTEM_PROMPT = f"""
Anda adalah Planner Agent pada Smart Scheduler AI.

Tugas Anda hanya menyusun rencana jadwal berdasarkan permintaan pengguna dan knowledge (RAG).

Anda BUKAN Optimizer Agent.

Optimizer Agent akan memeriksa bentrok jadwal setelah Anda selesai.

Oleh karena itu:

- Jangan mengatakan jadwal telah berhasil dibuat.
- Jangan mengatakan jadwal telah berhasil dijadwalkan.
- Jangan mengatakan jadwal telah disimpan.
- Jangan mengatakan jadwal sudah final.

Cukup jelaskan hasil perencanaan awal secara singkat.

Jika knowledge menunjukkan adanya kalender akademik, hari libur, atau aturan penjadwalan, tampilkan sebagai catatan kepada pengguna.

Hari ini adalah {datetime.now().strftime("%Y-%m-%d")}.

Gunakan KNOWLEDGE sebagai referensi utama.

ATURAN:

1. Jika pengguna meminta membuat jadwal, ekstrak menjadi object task.
2. Jika pengguna hanya bertanya biasa, isi task = null.
3. Jika ada kata:
   - hari ini
   - besok
   - lusa
   - senin depan
   - minggu depan

   ubah menjadi tanggal YYYY-MM-DD.

4. Waktu HARUS format HH:MM.

5. Hitung duration dalam menit.

Contoh:
09:00 - 11:00
duration = 120

6. Response WAJIB JSON VALID.
7. Jangan gunakan markdown.
8. Jangan gunakan ```json.
9. Response hanya menjelaskan hasil perencanaan awal.

10. Jangan menyebutkan proses optimasi.

11. Jangan menyatakan jadwal berhasil dijadwalkan.

12. Gunakan kalimat seperti:

- Jadwal awal telah direncanakan.
- Berdasarkan kalender akademik...
- Berdasarkan aturan penjadwalan...

FORMAT WAJIB:

{{
  "response":"",

  "task": {{
      "title":"",
      "description":"",
      "task_date":"YYYY-MM-DD",
      "start_time":"HH:MM",
      "end_time":"HH:MM",
      "duration":120,
      "priority":"Medium",
      "status":"Pending"
  }}
}}

Jika bukan membuat jadwal:

{{
   "response":"",
   "task":null
}}
"""


def planner(user_query: str):

    knowledge = retrieve(user_query)

    context = "\n\n".join(
        [
            f"File : {item['filename']}\n\n{item['content']}"
            for item in knowledge
        ]
    )

    prompt = f"""
{SYSTEM_PROMPT}

=========================
KNOWLEDGE
=========================

{context}

=========================
PERTANYAAN
=========================

{user_query}

Kembalikan JSON VALID SAJA.
"""

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

    try:

        data = json.loads(text)

        if data.get("task"):

            task = data["task"]

            task.setdefault("priority", "Medium")
            task.setdefault("status", "Pending")
            task.setdefault("description", "")

            if "duration" not in task:

                try:

                    start = datetime.strptime(
                        task["start_time"],
                        "%H:%M"
                    )

                    end = datetime.strptime(
                        task["end_time"],
                        "%H:%M"
                    )

                    task["duration"] = int(
                        (end - start).total_seconds() / 60
                    )

                except Exception:

                    task["duration"] = 60

        return data

    except Exception:

        return {
            "response": text,
            "task": None
        }


if __name__ == "__main__":

    hasil = planner(
        "Besok jam 08.00 presentasi AI sampai jam 10.00 prioritas tinggi"
    )

    print(json.dumps(hasil, indent=4, ensure_ascii=False))