from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from mood_engine import analyze_emotion
from datetime import datetime
from fastapi.responses import JSONResponse
from collections import Counter
from datetime import datetime
from mood_engine import analyze_emotion, get_nudge_for_mood
from mood_engine import get_self_care_ritual
from google_auth import get_auth_url, exchange_code
from fastapi.responses import RedirectResponse, HTMLResponse
from db import init_db
from mood_engine import analyze_emotion, get_nudge_for_mood, get_self_care_ritual
from openai import OpenAI
from db import SessionLocal, CoachSession
from collections import defaultdict
from fastapi.responses import FileResponse
import os
import pytz
import json
import asyncio
import uuid
import csv

asyncio.run(init_db())

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    mood_history = [],
    user_feedback = [],
    user_sessions = {}  # Temp: user_id → creds
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

)

@app.get("/mood-vs-calendar")
async def mood_vs_calendar():
    before_events = [m for m in mood_history if m["context"] == "before_event"]
    no_events = [m for m in mood_history if m["context"] == "no_event"]
    
    def average_mood(entries):
        score = lambda mood: {"Low": 1, "Stressed": 2, "Neutral": 3, "Joyful": 5}.get(mood, 3)
        return sum(score(m["mood"]) for m in entries) / len(entries) if entries else 0

    return {
        "before_event_avg": average_mood(before_events),
        "no_event_avg": average_mood(no_events)
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        payload = json.loads(data)
        mood = analyze_emotion(
            payload["text"],
            payload["typing_metrics"],
            payload.get("face_emotion")
        )
        mood_history.append({"mood": mood, "timestamp": datetime.utcnow().isoformat()})
        await websocket.send_json({"mood": mood})

@app.get("/mood-history")
async def get_mood_history():
    return JSONResponse(content=mood_history[-100:])  # last 100 entries

@app.get("/mood-summary")
async def get_mood_summary():
    if not mood_history:
        return {}

    counter = Counter(entry["mood"] for entry in mood_history)
    most_common_mood = counter.most_common(1)[0][0]

    hours = [datetime.fromisoformat(entry["timestamp"]).hour for entry in mood_history]
    mood_by_hour = {}
    for entry in mood_history:
        hour = datetime.fromisoformat(entry["timestamp"]).hour
        mood = entry["mood"]
        mood_by_hour.setdefault(hour, []).append(mood)

    best_hour = max(mood_by_hour.items(), key=lambda x: Counter(x[1]).most_common(1)[0][1])[0]

    return {
        "most_common_mood": most_common_mood,
        "best_hour": best_hour
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        payload = json.loads(data)
        mood = analyze_emotion(
            payload["text"],
            payload["typing_metrics"],
            payload.get("face_emotion")
        )
        nudge = get_nudge_for_mood(mood)
        mood_history.append({"mood": mood, "timestamp": datetime.utcnow().isoformat()})
        await websocket.send_json({"mood": mood, "nudge": nudge})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        payload = json.loads(data)
        mood = analyze_emotion(
            payload["text"],
            payload["typing_metrics"],
            payload.get("face_emotion")
        )
        nudge = get_nudge_for_mood(mood)
        ritual = get_self_care_ritual(mood)
        mood_history.append({"mood": mood, "timestamp": datetime.utcnow().isoformat()})
        await websocket.send_json({
            "mood": mood,
            "nudge": nudge,
            "ritual": ritual
        })       

@app.post("/feedback")
async def record_feedback(data: dict):
    user_feedback.append({
        "timestamp": datetime.utcnow().isoformat(),
        "mood": data["mood"],
        "nudge": data["nudge"],
        "accepted": data["accepted"]
    })
    return {"status": "saved"}

@app.get("/auth/login")
async def login():
    auth_url = get_auth_url()
    return RedirectResponse(auth_url)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")
    creds = exchange_code(code)
    user_id = "default_user"  # In real app, map per-user
    user_sessions[user_id] = creds
    return HTMLResponse(content="<h3>✅ Google Calendar Connected. You may close this tab.</h3>")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        payload = json.loads(data)
        
        mood = analyze_emotion(
            payload["text"],
            payload["typing_metrics"],
            payload.get("face_emotion")
        )
        
        nudge = get_nudge_for_mood(mood)
        ritual = get_self_care_ritual(mood)

        # ✅ Add calendar event proximity check here
        context = "no_event"
        try:
            creds = await load_token("default_user")  # Replace with real user ID
            if creds:
                from googleapiclient.discovery import build
                service = build("calendar", "v3", credentials=creds)
                now = datetime.utcnow()
                window_start = (now - timedelta(minutes=15)).isoformat() + "Z"
                window_end = (now + timedelta(minutes=15)).isoformat() + "Z"

                events = service.events().list(
                    calendarId='primary',
                    timeMin=window_start,
                    timeMax=window_end,
                    singleEvents=True,
                    orderBy="startTime"
                ).execute().get("items", [])

                if events:
                    context = "before_event"
        except Exception as e:
            print("Calendar context check failed:", e)

        # ✅ Append mood with calendar context
        mood_history.append({
            "mood": mood,
            "timestamp": datetime.utcnow().isoformat(),
            "context": context
        })

        await websocket.send_json({
            "mood": mood,
            "nudge": nudge,
            "ritual": ritual
        })

@app.post("/ai-coach")
async def ai_coach(request: Request):
    body = await request.json()
    mood_log = mood_history[-50:]  # Limit to recent entries
    feedback_log = user_feedback[-50:]

    prompt = f"""
You are PulseSync AI Coach. The user’s recent moods: {mood_log}.
Their nudge feedback: {feedback_log}.
Suggest:
- A 1-line summary of their mood trend
- A self-care habit they should build
- A question for today’s check-in
"""

    res = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"response": res.choices[0].message.content.strip()}

@app.post("/ai-coach")
async def ai_coach(request: Request):
    body = await request.json()
    mood_log = mood_history[-50:]
    feedback_log = user_feedback[-50:]

    prompt = f"""You are PulseSync AI Coach. User’s recent moods: {mood_log}.
Feedback: {feedback_log}.
Give:
1. 1-line mood trend summary
2. 1 habit to build
3. 1 check-in question"""

    res = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    reply = res.choices[0].message.content.strip()

    # 🧠 Split into parts
    parts = reply.split("\n")
    summary = parts[0].strip()
    habit = parts[1].strip()
    question = parts[2].strip()

    async with SessionLocal() as session:
        log = CoachSession(
            id=str(uuid.uuid4()),
            summary=summary,
            habit=habit,
            check_in=question
        )
        session.add(log)
        await session.commit()

    return {"summary": summary, "habit": habit, "check_in": question}

@app.get("/coach-history")
async def get_coach_history():
    async with SessionLocal() as session:
        result = await session.execute(select(CoachSession).order_by(CoachSession.timestamp.desc()).limit(10))
        return [dict(row._mapping) for row in result.fetchall()]

@app.get("/calendar-history")
async def get_calendar_history():
    by_day = defaultdict(list)

    for entry in mood_history:
        day = entry["timestamp"].split("T")[0]
        by_day[day].append(entry["mood"])

    def mood_score(moods):
        map = {"Low": 1, "Stressed": 2, "Neutral": 3, "Energized": 4, "Joyful": 5}
        return round(sum(map.get(m, 3) for m in moods) / len(moods), 2)

    return [
        {"date": day, "score": mood_score(moods), "top_mood": max(set(moods), key=moods.count)}
        for day, moods in by_day.items()
    ]

@app.get("/calendar-history")
async def get_calendar_history():
    from collections import defaultdict

    by_day = defaultdict(list)
    breaks_by_day = defaultdict(int)

    for entry in mood_history:
        day = entry["timestamp"].split("T")[0]
        by_day[day].append(entry["mood"])
        if entry.get("context") == "scheduled_break":
            breaks_by_day[day] += 1

    def mood_score(moods):
        map = {"Low": 1, "Stressed": 2, "Neutral": 3, "Energized": 4, "Joyful": 5}
        return round(sum(map.get(m, 3) for m in moods) / len(moods), 2)

    return [
        {
            "date": day,
            "score": mood_score(moods),
            "top_mood": max(set(moods), key=moods.count),
            "breaks": breaks_by_day.get(day, 0)
        }
        for day, moods in by_day.items()
    ]

@app.get("/day-log/{date}")
async def get_day_log(date: str):  # Format: 'YYYY-MM-DD'
    logs = [
        entry for entry in mood_history
        if entry["timestamp"].startswith(date)
    ]
    return logs

@app.get("/export/mood-history/json")
async def export_json():
    return mood_history  # or wrap in {"data": mood_history}

@app.get("/export/mood-history/csv")
async def export_csv():
    filename = "mood_export.csv"
    with open(filename, "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["timestamp", "mood", "context"])
        writer.writeheader()
        writer.writerows(mood_history)

    return FileResponse(filename, media_type="text/csv", filename=filename)