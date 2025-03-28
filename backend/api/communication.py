# communication.py

from typing import Optional, Dict, Any
from models.communication import CommunicationInsight
from utils.tone_analyzer import analyze_tone_profile
from utils.sentiment_analyzer import detect_sentiment_shift
from database.query import save_communication_log
from datetime import datetime


class CommunicationEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def analyze_message(self, text: str, context: Optional[Dict[str, Any]] = None) -> CommunicationInsight:
        tone_result = analyze_tone_profile(text)
        sentiment_result = detect_sentiment_shift(text)

        insight = CommunicationInsight(
            user_id=self.user_id,
            message=text,
            timestamp=datetime.utcnow(),
            tone=tone_result["tone"],
            tone_score=tone_result["confidence"],
            sentiment=sentiment_result["label"],
            sentiment_score=sentiment_result["score"],
            clarity_score=self._estimate_clarity(text),
            metadata=context or {}
        )

        save_communication_log(insight)
        return insight

    def _estimate_clarity(self, text: str) -> float:
        words = text.split()
        avg_word_length = sum(len(w) for w in words) / len(words) if words else 0
        filler_words = ["um", "like", "you know", "actually"]
        filler_count = sum(text.lower().count(w) for w in filler_words)
        clarity_penalty = 0.1 * filler_count

        base_score = max(0.3, min(1.0, 1.2 - (avg_word_length / 12)))
        return round(base_score - clarity_penalty, 2)
