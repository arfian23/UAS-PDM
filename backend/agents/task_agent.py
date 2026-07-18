import json

from langchain_google_genai import ChatGoogleGenerativeAI

from config import GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0
)

def extract_task(user_input: str):

    prompt = f"""
Kamu adalah AI Scheduler.

Ubah kalimat berikut menjadi JSON.

Balas HANYA JSON.

Format:

{{
"title":"",
"description":"",
"task_date":"",
"start_time":"",
"end_time":"",
"duration":0,
"priority":"",
"status":"Pending"
}}

Kalimat:

{user_input}
"""

    response = llm.invoke(prompt)

    return json.loads(response.content)