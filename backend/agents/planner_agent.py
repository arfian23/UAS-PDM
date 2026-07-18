import json
from langchain_google_genai import ChatGoogleGenerativeAI
from config import GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0
)

def create_plan(user_input, existing_tasks):

    prompt = f"""
Kamu adalah AI Planner.

Task yang sudah ada:

{existing_tasks}

User ingin:

{user_input}

Buat jadwal baru.

Balas HANYA JSON ARRAY.

Format:

[
  {{
    "title":"",
    "description":"",
    "task_date":"",
    "start_time":"",
    "end_time":"",
    "duration":120,
    "priority":"Medium",
    "status":"Pending"
  }}
]
"""

    response = llm.invoke(prompt)

    return json.loads(response.content)