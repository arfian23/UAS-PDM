# Smart Scheduler AI

Smart Scheduler AI adalah aplikasi Multi-Agent AI yang membantu pengguna mengelola jadwal menggunakan bahasa alami.

## Tech Stack

- Python
- FastAPI
- Gemini API
- LangChain
- Supabase
- PostgreSQL

---

## Features

- ✅ CRUD Task
- ✅ AI Task Agent
- ✅ Planner Agent
- 🔄 Optimizer Agent (Coming Soon)
- 🔄 LangGraph Coordinator (Coming Soon)

---

## Project Structure

```
backend/
│
├── agents/
├── api/
├── database/
├── models/
├── services/
├── graph/
└── main.py
```

---

## Installation

Clone repository

```bash
git clone https://github.com/USERNAME/scheduler-ai.git
```

Masuk folder

```bash
cd scheduler-ai
```

---

## Create Virtual Environment

Windows

```bash
python -m venv .venv
```

Activate

PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Create Environment File

Copy

```
.env.example
```

menjadi

```
.env
```

Isi dengan

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_KEY=YOUR_SUPABASE_KEY
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
```

---

## Run Backend

Masuk folder backend

```bash
cd backend
```

Jalankan

```bash
python -m uvicorn main:app --reload
```

Swagger UI

```
http://127.0.0.1:8000/docs
```

---

## API

### Task

- GET /tasks
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}

### AI

- POST /agent/task
- POST /agent/planner

---

## Author

Arfian