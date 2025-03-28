# prediction.py

from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from models.prediction import PredictionResult
from database.query import (
    get_emotion_history,
    get_focus_history,
    get_communication_logs,
)
from engine.forecast_algorithms import (
    forecast_emotion_trend,
    forecast_focus_dips,
    simulate_team_shift,
)


class PredictionEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def forecast_user_energy(self, days_ahead: int = 7) -> PredictionResult:
        emotion_data = get_emotion_history(self.user_id)
        focus_data = get_focus_history(self.user_id)

        emotion_trend = forecast_emotion_trend(emotion_data, days=days_ahead)
        focus_trend = forecast_focus_dips(focus_data, days=days_ahead)

        result = PredictionResult(
            user_id=self.user_id,
            target="user_energy",
            days=days_ahead,
            data={
                "emotion_forecast": emotion_trend,
                "focus_forecast": focus_trend
            },
            generated_at=datetime.utcnow()
        )

        return result

    def simulate_team_dynamics(self, org_id: str) -> PredictionResult:
        logs = get_communication_logs(org_id=org_id)
        team_sim = simulate_team_shift(logs)

        result = PredictionResult(
            user_id=self.user_id,
            target="team_simulation",
            days=7,
            data=team_sim,
            generated_at=datetime.utcnow()
        )

        return result
