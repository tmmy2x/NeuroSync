import json
import os

def get_current_emotion(path: str = "shared/emotion_state.json") -> str:
    try:
        with open(path, "r") as f:
            state = json.load(f)
            return state.get("emotion", "calm")
    except Exception as e:
        print(f"[MoodMorph] Failed to read emotion file: {e}")
        return "calm"
    
import json
from datetime import datetime

def save_emotion(emotion: str, source: str):
    payload = {
        "emotion": emotion,
        "source": source,
        "timestamp": datetime.utcnow().isoformat()
    }
    with open("shared/emotion_state.json", "w") as f:
        json.dump(payload, f)
