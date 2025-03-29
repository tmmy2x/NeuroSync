from fastapi import FastAPI, Request
from scheduler import suggest_break
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from scheduler import suggest_break, insert_event


def suggest_break(creds: Credentials, current_mood: str):
    service = build("calendar", "v3", credentials=creds)

    now = datetime.utcnow().isoformat() + 'Z'
    end = (datetime.utcnow() + timedelta(hours=6)).isoformat() + 'Z'
    events = service.events().list(
        calendarId='primary', timeMin=now, timeMax=end,
        singleEvents=True, orderBy='startTime'
    ).execute().get("items", [])

    gaps = []
    last_end = datetime.utcnow()
    for event in events:
        start = datetime.fromisoformat(event["start"]["dateTime"])
        if (start - last_end).total_seconds() > 900:
            gaps.append((last_end, start))
        last_end = datetime.fromisoformat(event["end"]["dateTime"])

    if not gaps:
        return None

    break_start, break_end = gaps[0]
    return {
        "start": break_start.isoformat(),
        "end": (break_start + timedelta(minutes=15)).isoformat(),
        "title": f"🧘 Mood Reset: {current_mood}"
    }

def insert_event(creds, suggestion):
    service = build("calendar", "v3", credentials=creds)
    event = {
        "summary": suggestion["title"],
        "start": {"dateTime": suggestion["start"], "timeZone": "UTC"},
        "end": {"dateTime": suggestion["end"], "timeZone": "UTC"},
    }
    created_event = service.events().insert(calendarId="primary", body=event).execute()
    return created_event

app = FastAPI()

@app.post("/schedule-engine")
async def create_suggested_break(request: Request):
    payload = await request.json()
    # Here you'd pass real OAuth2 credentials from the user session (mocked for now)
    fake_creds = None  # Replace with actual `Credentials` object

    suggestion = suggest_break(fake_creds, payload["mood"])
    if suggestion:
        return suggestion
    else:
        return {"message": "No open slots found"}
    
# Mock user_sessions for demonstration purposes
user_sessions = {}

@app.post("/schedule-engine")
async def schedule_break(request: Request):
    payload = await request.json()
    user_id = "default_user"
    creds = user_sessions.get(user_id)

    if not creds:
        return {"error": "Not authenticated"}

    suggestion = suggest_break(creds, payload["mood"])
    if suggestion:
        event = insert_event(creds, suggestion)
        return {"message": "Break scheduled", "event": event}
    return {"message": "No open slots"}
