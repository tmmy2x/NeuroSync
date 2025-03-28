from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from fastapi import Request
from dotenv import load_dotenv
from fastapi import Body
from slack_sdk.webhook import WebhookClient
from datetime import datetime
from jose import JWTError, jwt
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from datetime import datetime, timedelta, timezone
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from collections import defaultdict
from apscheduler.schedulers.background import BackgroundScheduler
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from fastapi.responses import FileResponse
import random, asyncio
import openai
import os


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
slack_client = WebClient(token=SLACK_BOT_TOKEN)


# Simple dict: { "2025-03-27": "Deployed new system, had bugs" }
day_context_notes = {}

# In-memory config (DB optional)
nudge_config = {
    "tone": "Empathetic",
    "praise_template": "Appreciate your effort, {user}! Your positivity is noticed.",
    "break_template": "Take a breather, {user}. Consider a short break to recharge."
}

# Secret key & algo
SECRET_KEY = "neuro-secret-key"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user DB
fake_users = {
    "admin": {"username": "admin", "password": "admin123", "role": "admin"},
    "jordan": {"username": "jordan", "password": "pass", "role": "member"},
}

xp_store = {}
badge_store = {}

BADGE_TIERS = [
    {"name": "Newcomer", "threshold": 1},
    {"name": "Appreciated", "threshold": 3},
    {"name": "Team Hero", "threshold": 5},
    {"name": "Culture Champion", "threshold": 10},
]

# ✅ Use timezone-aware datetime
now = datetime.now(timezone.utc)

communication_log = [
    {"from": "Ava", "to": "Jordan", "timestamp": (now - timedelta(minutes=45)).isoformat()},
    {"from": "Jordan", "to": "Ava", "timestamp": (now - timedelta(minutes=30)).isoformat()},
    {"from": "Ava", "to": "Leo", "timestamp": (now - timedelta(minutes=90)).isoformat()},
    {"from": "Leo", "to": "Ava", "timestamp": (now - timedelta(minutes=10)).isoformat()},
    {"from": "Leo", "to": "Jordan", "timestamp": (now - timedelta(minutes=60)).isoformat()},
    {"from": "Jordan", "to": "Leo", "timestamp": (now - timedelta(minutes=20)).isoformat()},
]



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    emotion_history = {},
    praise_log = [],
    xp_event_log = []

)

emotion_labels = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm']
MAX_HISTORY = 288  # 24 hours at 5-minute intervals

def scheduled_slack_import():
    print("[Scheduled] Importing Slack messages...")
    try:
        import_from_slack()
        print("[Scheduled] Import complete.")
    except Exception as e:
        print(f"[Scheduled] Error: {e}")

scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_slack_import, "interval", hours=1)
scheduler.start()

def generate_emotions():
    return {emotion: random.randint(10, 100) for emotion in emotion_labels}

def store_emotion_snapshot(team_snapshot):
    now = datetime.utcnow().isoformat()
    for member in team_snapshot:
        entry = {"timestamp": now, "emotions": member["emotions"]}
        name = member["name"]
        emotion_history.setdefault(name, []).append(entry)
        # Trim to max history length
        if len(emotion_history[name]) > MAX_HISTORY:
            emotion_history[name] = emotion_history[name][-MAX_HISTORY:]

def authenticate_user(username, password):
    user = fake_users.get(username)
    if user and user["password"] == password:
        return user
    return None

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/api/team-emotions")
def get_team_emotions():
    team = [
        {"name": "Jordan", "emotions": generate_emotions()},
        {"name": "Ava", "emotions": generate_emotions()},
        {"name": "Leo", "emotions": generate_emotions()},
    ]
    return {"team": team}

@app.websocket("/ws/emotions")
async def websocket_emotions(websocket: WebSocket):
    await websocket.accept()
    while True:
        team = [
            {"name": "Jordan", "emotions": generate_emotions()},
            {"name": "Ava", "emotions": generate_emotions()},
            {"name": "Leo", "emotions": generate_emotions()},
        ]
        store_emotion_snapshot(team)
        await websocket.send_json({"team": team})
        await asyncio.sleep(300)  # 5 minutes

@app.get("/api/team-emotions/history")
def get_emotion_history():
    return emotion_history

@app.post("/api/nudges/gpt")
async def generate_nudges(request: Request):
    body = await request.json()
    history = body.get("emotion_history", {})

    nudges = []

    for name, entries in history.items():
        last_entries = entries[-5:] if len(entries) >= 5 else entries
        recent_trends = []

        for e in last_entries:
            joy = e["emotions"].get("joy", 0)
            sadness = e["emotions"].get("sadness", 0)
            anger = e["emotions"].get("anger", 0)
            calm = e["emotions"].get("calm", 0)

            sentiment = "neutral"
            if joy > 60 and calm > 50:
                sentiment = "positive"
            elif sadness > 50 or anger > 50:
                sentiment = "negative"

            recent_trends.append(sentiment)

        pos = recent_trends.count("positive")
        neg = recent_trends.count("negative")

        if neg >= 3:
            nudges.append({
                "user": name,
                "type": "AI Nudge",
                "message": f"{name} may be experiencing stress. Consider offering a wellness check-in or async support.",
            })
        elif pos >= 3:
            nudges.append({
                "user": name,
                "type": "AI Nudge",
                "message": f"{name} is showing strong positive energy. Acknowledge their momentum with praise or visibility.",
            })

    return {"nudges": nudges}

@app.post("/api/nudges/gpt")
async def generate_gpt_nudges(request: Request):
    body = await request.json()
    history = body.get("emotion_history", {})

    # Summarize history into pseudo-input
    summary_lines = []
    for name, entries in history.items():
        last5 = entries[-5:]
        emotions = []
        for e in last5:
            emotions.append(e["emotions"])
        summary_lines.append(f"{name}: {emotions}")

    prompt = f"""
You are an empathetic workplace coach. Given the last 5 mood snapshots per team member (joy, sadness, anger, calm, etc.), generate personalized nudges for each one who might benefit from a manager check-in, praise, or rest.

Each message should be supportive and human. Return in JSON format:
[
  {{
    "user": "Jordan",
    "type": "GPT Nudge",
    "message": "Jordan has had 3 low-calm days. Acknowledge their hard work and suggest a midweek recharge."
  }},
  ...
]

Mood Snapshots:
{chr(10).join(summary_lines)}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an empathetic team wellness coach."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    # Safely extract response JSON
    import json
    try:
        suggestions = json.loads(response["choices"][0]["message"]["content"])
    except Exception as e:
        suggestions = [{"user": "System", "type": "Error", "message": f"Failed to parse GPT output: {str(e)}"}]

    return {"nudges": suggestions}

@app.post("/api/praise")
async def send_praise(data: dict = Body(...)):
    user = data.get("user")
    sender = data.get("sender", "System")
    message = data.get("message", "Keep up the great work!")
    via = data.get("via", "slack")

    timestamp = datetime.utcnow().isoformat()
    entry = {"user": user, "sender": sender, "message": message, "via": via, "timestamp": timestamp}
    praise_log.append(entry)

    # 🟢 Add XP
    xp_store[user] = xp_store.get(user, 0) + 10

    # 🏅 Check badge
    for badge in BADGE_TIERS:
        if xp_store[user] >= badge["threshold"] * 10:
            badge_store[user] = badge["name"]

    return {"status": "sent", "log": entry}

    # Send via Slack (optional)
    if via == "slack":
        webhook = WebhookClient(os.getenv("SLACK_WEBHOOK_URL"))
        webhook.send(text=f":star: *Praise from {sender} to {user}*\n> {message}")

    return {"status": "sent", "log": entry}
   
    # Add XP to recipient
    xp_store[user] = xp_store.get(user, 0) + 10

    # NEW: Add XP to sender
    if sender:
        xp_store[sender] = xp_store.get(sender, 0) + 5  # Less than receiving

    xp_event_log.append({
    "user": user,
    "source": sender,
    "type": "praise_received",
    "xp": 10,
    "message": message,
    "timestamp": timestamp
})

if sender:
    xp_event_log.append({
        "user": sender,
        "source": user,
        "type": "praise_given",
        "xp": 5,
        "message": f"Sent praise to {user}",
        "timestamp": timestamp
    })

    
    badge_emojis = {
    "Newcomer": ["🎉", "👍", "🙌"],
    "Appreciated": ["🎯", "💖", "🌟"],
    "Team Hero": ["👑", "🚀", "💪"],
    "Culture Champion": ["🧠", "💎", "🏆"],
}



@app.get("/api/praise/logs")
def get_praise_logs():
    return {"logs": praise_log}

@app.get("/api/nudge-config")
def get_nudge_config():
    return nudge_config

@app.post("/api/nudge-config")
async def update_nudge_config(data: dict = Body(...)):
    for key in ["tone", "praise_template", "break_template"]:
        if key in data:
            nudge_config[key] = data[key]
    return nudge_config

@app.get("/api/praise/inbox/{username}")
def get_user_praise(username: str):
    return {"inbox": [entry for entry in praise_log if entry["user"].lower() == username.lower()]}

@app.post("/token")
async def login(data: dict = Body(...)):
    user = authenticate_user(data["username"], data["password"])
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": user["username"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/praise/inbox/{username}")
def get_user_praise(username: str, user=Depends(get_current_user)):
    if user["sub"] != username and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized")
    return {"inbox": [entry for entry in praise_log if entry["user"].lower() == username.lower()]}

@app.get("/api/nudge-config")
def get_nudge_config(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return nudge_config

@app.get("/api/gamification/xp")
def get_xp():
    return {"xp": xp_store, "badges": badge_store}

@app.get("/api/gamification/leaderboard")
def get_leaderboard():
    sorted_users = sorted(xp_store.items(), key=lambda x: -x[1])
    return [{"user": u, "xp": xp_store[u], "badge": badge_store.get(u, None)} for u, _ in sorted_users]

@app.get("/api/xp-history/{username}")
def get_xp_history(username: str):
    return {
        "history": [e for e in xp_event_log if e["user"].lower() == username.lower()]
    }

@app.get("/api/praise/emojis/{username}")
def get_available_emojis(username: str):
    badge = badge_store.get(username)
    unlocked = []

    if not badge:
        return {"emojis": ["🎉", "👍", "🙌"]}  # default

    for tier, emojis in badge_emojis.items():
        unlocked += emojis
        if tier == badge:
            break

    return {"emojis": unlocked}

# 🧠 Flow API endpoint
@app.get("/api/communication/flow")
def get_comm_flow():
    return {"flow": communication_log}

@app.post("/api/slack/import")
def import_from_slack(request: Request):
    channel_id = request.query_params.get("channel_id")

    if not channel_id:
        return {"error": "Missing channel_id"}
    try:
        result = slack_client.conversations_list()
        channels = result["channels"]
        imported = []
        user_cache = {}

        def get_username(user_id):
            if user_id in user_cache:
                return user_cache[user_id]
            info = slack_client.users_info(user=user_id)
            username = info["user"]["real_name"]
            user_cache[user_id] = username
            return username

        for channel in channels[:1]:  # Limit for demo
            history = slack_client.conversations_history(channel=channel_id, limit=100)
    
            threads = defaultdict(str)  # thread_ts → parent_user_id
    
            for msg in reversed(history["messages"]):  # older messages first
                user_id = msg.get("user")
                ts = float(msg.get("ts"))
                if not user_id or not ts:
                    continue

                from_user = get_username(user_id)
                to_user = "Unknown"

                # Detect replies
                thread_ts = msg.get("thread_ts")
                if thread_ts and thread_ts != msg["ts"]:
                    parent_id = threads.get(thread_ts)
                    if parent_id:
                        to_user = get_username(parent_id)
                elif thread_ts:  # this is the parent/root message
                    threads[thread_ts] = user_id

                communication_log.append({
                    "from": from_user,
                    "to": to_user,
                    "timestamp": datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
                })

                imported.append(from_user)

        return {"status": "success", "imported": list(set(imported))}

    except SlackApiError as e:
        return {"error": str(e)}

@app.get("/api/slack/channels")
def get_slack_channels():
    try:
        result = slack_client.conversations_list()
        channels = [{"id": c["id"], "name": c["name"]} for c in result["channels"]]
        return {"channels": channels}
    except SlackApiError as e:
        return {"error": str(e)}
    
@app.get("/api/communication/thread-lags")
def thread_lags():
    threads = {}
    reply_lags = []

    for msg in communication_log:
        thread_key = f"{msg['from']}::{msg['to']}"
        ts = datetime.fromisoformat(msg["timestamp"])

        if msg["to"] == "Unknown":
            threads[thread_key] = ts
        else:
            root_ts = threads.get(f"{msg['to']}::{msg['from']}")
            if root_ts:
                lag = (ts - root_ts).total_seconds() / 60.0
                reply_lags.append({
                    "thread": f"{msg['to']} → {msg['from']}",
                    "reply_at": ts.isoformat(),
                    "lag_minutes": round(lag, 1)
                })

    return {"threads": reply_lags}

@app.get("/api/insights/stress-days")
def top_stress_days():
    day_scores = defaultdict(list)  # date → emotion delta per user

    for user, logs in emotion_history.items():
        for entry in logs:
            ts = datetime.fromisoformat(entry["timestamp"])
            day = ts.date().isoformat()
            emotions = entry["emotions"]

            # Define "stress" score (anger + sadness - calm - joy)
            stress_score = (
                emotions.get("anger", 0)
                + emotions.get("sadness", 0)
                - emotions.get("calm", 0)
                - emotions.get("joy", 0)
            )
            day_scores[day].append(stress_score)

    # Average by day and sort
    ranked = sorted([
        {"date": day, "score": round(sum(vals)/len(vals), 2), "count": len(vals)}
        for day, vals in day_scores.items()
    ], key=lambda x: -x["score"])

    return {"top_stress_days": ranked[:5]}

@app.get("/api/insights/day-notes")
def get_day_notes():
    return day_context_notes

@app.post("/api/insights/day-notes")
async def add_day_note(data: dict = Body(...)):
    date = data.get("date")
    note = data.get("note")
    if not date or not note:
        return {"error": "Missing fields"}
    day_context_notes[date] = note
    return {"status": "saved", "notes": day_context_notes}

@app.get("/api/insights/emotion-diversity")
def emotion_diversity():
    diversity_by_day = defaultdict(lambda: defaultdict(int))

    for user, logs in emotion_history.items():
        for entry in logs:
            ts = datetime.fromisoformat(entry["timestamp"])
            day = ts.date().isoformat()
            for emotion, value in entry["emotions"].items():
                if value > 0.2:  # ignore subtle noise
                    diversity_by_day[day][emotion] += 1

    index = []
    for day, counts in diversity_by_day.items():
        unique = len(counts)
        total = sum(counts.values())
        score = round(unique / 6 * 100)  # out of 6 emotion types
        index.append({
            "date": day,
            "unique_emotions": unique,
            "score": score,
            "sample_count": total
        })

    return {"diversity": sorted(index, key=lambda x: x["date"], reverse=True)}

@app.get("/api/export/pdf")
def export_team_report():
    filename = "team_health_report.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, height - 50, "NeuroBoard™ Team Health Report")

    y = height - 80
    c.setFont("Helvetica", 12)

    # 🔹 Collab Score
    collab = get_collab_health()
    c.drawString(40, y, f"📊 Collaboration Health Score: {collab['score']} / 100")
    y -= 20

    # 🔹 Top Stress Days
    stress = top_stress_days()["top_stress_days"]
    c.drawString(40, y, "📅 Top Stress Days:")
    y -= 15
    for d in stress:
        c.drawString(60, y, f"- {d['date']} → Score: {d['score']}")
        y -= 15

    # 🔹 Emotion Diversity
    diversity = emotion_diversity()["diversity"]
    c.drawString(40, y, "📊 Emotional Diversity:")
    y -= 15
    for d in diversity[:3]:
        c.drawString(60, y, f"- {d['date']}: {d['score']}/100 from {d['sample_count']} entries")
        y -= 15

    c.showPage()
    c.save()

    return FileResponse(filename, media_type='application/pdf', filename=filename)

@app.get("/api/insights/emotion-trends")
def emotion_trends(user: str = None, emotion: str = None, days: int = 30):
    from datetime import timedelta
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    trend = defaultdict(list)

    for uname, logs in emotion_history.items():
        if user and uname != user:
            continue
        for entry in logs:
            ts = datetime.fromisoformat(entry["timestamp"])
            if ts < cutoff:
                continue
            e = entry["emotions"]
            if emotion:
                trend[uname].append({ "timestamp": entry["timestamp"], "value": e.get(emotion, 0) })
            else:
                trend[uname].append({ "timestamp": entry["timestamp"], **e })

    return {"trend": trend}

@app.get("/api/prediction/burnout")
def predict_burnout(days: int = 14):
    from collections import defaultdict
    import numpy as np

    timeline = []
    now = datetime.now(timezone.utc)

    # Compile past metrics by day
    daily_scores = defaultdict(list)

    for user, logs in emotion_history.items():
        for entry in logs:
            ts = datetime.fromisoformat(entry["timestamp"])
            day = ts.date().isoformat()
            emotions = entry["emotions"]
            score = (
                emotions.get("anger", 0)
                + emotions.get("sadness", 0)
                - emotions.get("calm", 0)
                - emotions.get("joy", 0)
            )
            daily_scores[day].append(score)

    # Normalize to daily burnout index
    days_sorted = sorted(daily_scores.keys())
    history = []
    for day in days_sorted:
        avg = round(np.mean(daily_scores[day]), 2)
        history.append({"date": day, "score": avg})

    # Predict forward using simple decay + slope model
    recent = [h["score"] for h in history[-7:]]
    slope = (recent[-1] - recent[0]) / max(1, len(recent) - 1)

    for i in range(days):
        future_score = recent[-1] + (slope * (i + 1))
        future_score = round(min(max(future_score, -2), 5), 2)
        future_date = (now + timedelta(days=i)).date().isoformat()
        timeline.append({"date": future_date, "predicted_score": future_score})

    return {
        "history": history[-7:],
        "forecast": timeline
    }

@app.get("/api/prediction/burnout")
def predict_burnout(days: int = 14):
    ...
    trigger_alert = False
    for f in timeline:
        if f["predicted_score"] > 3.5:
            trigger_alert = True
            break

    return {
        "history": history[-7:],
        "forecast": timeline,
        "trigger_alert": trigger_alert
    }

@app.get("/api/prediction/user-burnout")
def user_burnout_prediction(days: int = 14):
    user_scores = defaultdict(list)

    for user, logs in emotion_history.items():
        for entry in logs:
            ts = datetime.fromisoformat(entry["timestamp"])
            day = ts.date().isoformat()
            e = entry["emotions"]
            score = e.get("anger", 0) + e.get("sadness", 0) - e.get("calm", 0) - e.get("joy", 0)
            user_scores[user].append((day, score))

    result = []
    for user, history in user_scores.items():
        history.sort()
        scores = [s for _, s in history[-7:]]
        if not scores:
            continue
        slope = (scores[-1] - scores[0]) / max(1, len(scores) - 1)
        forecast = round(min(max(scores[-1] + slope * days, -2), 5), 2)
        result.append({"user": user, "last_score": round(scores[-1], 2), "forecast": forecast})

    return {"users": sorted(result, key=lambda x: -x["forecast"])}

@app.post("/api/simulation/burnout")
def simulate_burnout(data: dict = Body(...)):
    days = data.get("days", 14)
    meeting_reduction = data.get("meeting_reduction", 0.0)  # 0.5 for 50%
    praise_boost = data.get("praise_boost", 0.0)  # 0.2 for 20%
    quiet_hours = data.get("quiet_hours", 0.0)  # 0.1 for 10% lag reduction

    now = datetime.now(timezone.utc)
    simulated = []

    base_score = 3.0  # starting average

    for i in range(days):
        score = base_score
        score -= meeting_reduction * 1.2
        score -= praise_boost * 0.8
        score -= quiet_hours * 1.0
        score = round(min(max(score, -2), 5), 2)
        simulated.append({"date": (now + timedelta(days=i)).date().isoformat(), "simulated_score": score})

    return {"simulation": simulated}
