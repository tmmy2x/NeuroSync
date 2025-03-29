import datetime
from typing import List, Dict, Optional
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Emotion → preferred task type
EMOTION_TASK_MAP = {
    "focused": ["deep_work", "creative"],
    "calm": ["planning", "admin", "learning"],
    "tired": ["admin", "review", "simple"],
    "anxious": ["simple", "cleanup"],
    "energized": ["creative", "strategic", "deep_work"]
}

def score_task(task: Dict, emotion: str, history: Dict) -> float:
    priority_score = task.get("priority", 3) * 2

    # Emotion match boost
    task_type = task.get("type", "general")
    emotion_match = 1 if task_type in EMOTION_TASK_MAP.get(emotion, []) else -1

    # Past success history
    task_id = task.get("id")
    success_rate = history.get(task_id, {}).get("success_rate", 0.5)
    success_score = (success_rate - 0.5) * 2  # Range [-1, +1]

    return priority_score + emotion_match + success_score

def suggest_tasks(
    tasks: List[Dict],
    emotion: str,
    history: Dict,
    current_time: Optional[datetime.datetime] = None
) -> List[Dict]:
    if current_time is None:
        current_time = datetime.datetime.now()

    # Score and sort tasks
    for task in tasks:
        task["score"] = score_task(task, emotion, history)

    sorted_tasks = sorted(tasks, key=lambda x: x["score"], reverse=True)

    # Assign time blocks to top 3
    suggestions = []
    start = current_time

    for task in sorted_tasks[:3]:
        duration = datetime.timedelta(minutes=task.get("duration", 60))
        task["start"] = start.strftime("%H:%M")
        task["end"] = (start + duration).strftime("%H:%M")
        suggestions.append(task)
        start += duration

    return suggestions

from moodmorph.mood_analysis import get_current_emotion

if __name__ == "__main__":
    tasks = [
        {"id": "task_1", "name": "Write blog", "priority": 5, "duration": 60, "type": "creative", "energy_cost": 3},
        {"id": "task_2", "name": "Clean inbox", "priority": 3, "duration": 30, "type": "admin", "energy_cost": 1},
        {"id": "task_3", "name": "Fix bug", "priority": 4, "duration": 90, "type": "deep_work", "energy_cost": 4}
    ]

    history = {
        "task_1": {"success_rate": 0.8},
        "task_2": {"success_rate": 0.6},
        "task_3": {"success_rate": 0.4}
    }

    emotion = get_current_emotion()

    suggestions = suggest_tasks(tasks, emotion, history)

    print("\n🌟 FlowForge Suggestions:")
    for s in suggestions:
        print(f"{s['start']} - {s['end']}: {s['name']} (Score: {s['score']:.2f})")
