from textblob import TextBlob

def analyze_emotion(text, typing_metrics, face_emotion=None):
    sentiment = TextBlob(text).sentiment.polarity
    speed = typing_metrics.get("speed", 0)
    hesitation = typing_metrics.get("hesitation", 0)

    if face_emotion in ["angry", "disgusted"]:
        return "Frustrated"
    elif face_emotion in ["sad"]:
        return "Low"
    elif face_emotion == "happy" and sentiment > 0.3:
        return "Joyful"
    elif hesitation > 2 and sentiment < -0.2:
        return "Stressed"
    elif speed > 300 and sentiment > 0.3:
        return "Energized"
    elif sentiment < -0.4:
        return "Anxious"
    else:
        return "Neutral"

def get_nudge_for_mood(mood: str) -> str:
    nudge_map = {
        "Stressed": "Take 3 deep breaths 🌬️",
        "Low": "Try a quick walk 🚶‍♂️",
        "Frustrated": "Step away for 5 min ⏳",
        "Anxious": "Try this calming GIF 🧘",
        "Energized": "Keep the momentum going! ⚡",
        "Joyful": "Spread some of that joy! 🎉"
    }
    return nudge_map.get(mood, "")

def get_self_care_ritual(mood: str) -> dict:
    rituals = {
        "Stressed": {
            "title": "Box Breathing",
            "type": "breath",
            "instructions": "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s"
        },
        "Anxious": {
            "title": "Grounding Exercise",
            "type": "mindfulness",
            "instructions": "Name 5 things you can see, 4 you can touch, 3 you can hear..."
        },
        "Low": {
            "title": "Mood Boost Music",
            "type": "audio",
            "url": "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0"
        },
        "Frustrated": {
            "title": "Mini Reset Walk",
            "type": "action",
            "instructions": "Get outside and walk for 5 minutes. No phone."
        },
        "Joyful": {
            "title": "Gratitude Flash",
            "type": "journal",
            "instructions": "Write down 3 things you're grateful for."
        },
    }
    return rituals.get(mood, {"title": "Take a moment", "type": "rest", "instructions": "Pause and breathe."})

