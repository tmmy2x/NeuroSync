# seed.py

import uuid
import random
import datetime
from database.models import User, Org, Task, EmotionSnapshot, FocusSession, CommunicationLog
from database.query import (
    create_org,
    create_user,
    save_tasks,
    save_emotion_snapshots,
    save_focus_sessions,
    save_communication_logs,
)


def generate_mock_tasks(user_id: str) -> list[Task]:
    titles = ["Write Q2 Report", "Design Sprint Brief", "Client Feedback Review", "Research AI Trends"]
    return [
        Task(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title=random.choice(titles),
            due_date=datetime.date.today() + datetime.timedelta(days=random.randint(1, 7)),
            priority=random.choice(["high", "medium", "low"]),
            status=random.choice(["pending", "in_progress"]),
            tags=["demo"]
        )
        for _ in range(4)
    ]


def generate_mock_emotions(user_id: str) -> list[EmotionSnapshot]:
    base_time = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    emotions = ["positive", "neutral", "negative"]
    return [
        EmotionSnapshot(
            id=str(uuid.uuid4()),
            user_id=user_id,
            timestamp=base_time + datetime.timedelta(days=i),
            sentiment_label=random.choice(emotions),
            sentiment_score=round(random.uniform(0.2, 0.9), 2),
            emotion_keywords=["demo", "focus", "energy"],
            raw_input="Seeded mood entry",
            source="text",
            metadata={"source": "seed"}
        )
        for i in range(7)
    ]


def generate_mock_focus(user_id: str) -> list[FocusSession]:
    base_time = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    return [
        FocusSession(
            id=str(uuid.uuid4()),
            user_id=user_id,
            start_time=base_time + datetime.timedelta(days=i, hours=9),
            end_time=base_time + datetime.timedelta(days=i, hours=11),
            active=False,
            preset="deep_work",
            distraction_score=random.randint(0, 3)
        )
        for i in range(5)
    ]


def generate_mock_comm_logs(org_id: str) -> list[CommunicationLog]:
    messages = [
        "Let's sync up later today.",
        "Need help reviewing the spec?",
        "Please prioritize client issue first.",
        "Love the new dashboard design!"
    ]
    return [
        CommunicationLog(
            id=str(uuid.uuid4()),
            org_id=org_id,
            user_id=str(uuid.uuid4()),
            message=random.choice(messages),
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 6)),
            tone=random.choice(["supportive", "assertive"]),
            tone_score=round(random.uniform(0.6, 1.0), 2),
            sentiment=random.choice(["positive", "neutral"]),
            sentiment_score=round(random.uniform(0.4, 0.9), 2),
            clarity_score=round(random.uniform(0.6, 1.0), 2),
            metadata={"source": "seed"}
        )
        for _ in range(6)
    ]


def seed_demo_organization(owner_id: str, org_name: str = "Demo Org"):
    org_id = str(uuid.uuid4())
    create_org(Org(id=org_id, name=org_name, owner_id=owner_id))

    # Tasks & data for this user/org
    tasks = generate_mock_tasks(owner_id)
    emotions = generate_mock_emotions(owner_id)
    focus_blocks = generate_mock_focus(owner_id)
    comm_logs = generate_mock_comm_logs(org_id)

    save_tasks(tasks)
    save_emotion_snapshots(emotions)
    save_focus_sessions(focus_blocks)
    save_communication_logs(comm_logs)

    print(f"✅ Seeded demo org '{org_name}' with data for user: {owner_id}")

if __name__ == "__main__":
    user_id = str(uuid.uuid4())
    create_user(User(id=user_id, name="Demo User", email="demo@neurosync.ai"))
    seed_demo_organization(owner_id=user_id, org_name="NeuroSync Demo Org")
