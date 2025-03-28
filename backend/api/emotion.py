# emotion.py

from typing import Dict, Any, Optional
from models.emotion import EmotionResult
from utils.nlp_utils import analyze_sentiment, extract_emotion_keywords
from database.query import save_emotion_snapshot
import datetime


class EmotionEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def detect_emotion_from_text(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> EmotionResult:
        sentiment_score, sentiment_label = analyze_sentiment(text)
        emotion_keywords = extract_emotion_keywords(text)

        emotion_result = EmotionResult(
            user_id=self.user_id,
            timestamp=datetime.datetime.utcnow(),
            source="text",
            sentiment_score=sentiment_score,
            sentiment_label=sentiment_label,
            emotion_keywords=emotion_keywords,
            raw_input=text,
            metadata=metadata or {}
        )

        save_emotion_snapshot(emotion_result)
        return emotion_result

    def get_latest_emotion(self) -> Optional[EmotionResult]:
        from database.query import get_latest_emotion
        return get_latest_emotion(self.user_id)
