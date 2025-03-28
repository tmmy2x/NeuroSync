# focus.py

import datetime
from typing import Dict, Optional
from models.focus_state import FocusState
from database.query import (
    save_focus_session,
    get_current_focus_state,
    clear_active_focus_state,
)
from engine.distraction_watcher import monitor_distractions
from engine.music_engine import start_music_preset, stop_music
from utils.user_rhythm import is_peak_focus_time
from utils.emotion_tracker import is_cognitive_bandwidth_optimal


class FocusEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def start_focus_bubble(self, preset: str = "deep_work") -> FocusState:
        now = datetime.datetime.utcnow()
        if not is_peak_focus_time(self.user_id, now):
            raise ValueError("Not an optimal focus time based on rhythm profile.")

        if not is_cognitive_bandwidth_optimal(self.user_id):
            raise ValueError("Current emotional state not ideal for focus mode.")

        state = FocusState(
            user_id=self.user_id,
            start_time=now,
            end_time=None,
            active=True,
            preset=preset,
            distraction_score=0
        )

        save_focus_session(state)
        start_music_preset(preset)
        monitor_distractions(self.user_id, live_mode=True)
        return state

    def end_focus_bubble(self) -> FocusState:
        state = get_current_focus_state(self.user_id)
        if not state or not state.active:
            raise RuntimeError("No active Focus Bubble session to end.")

        state.end_time = datetime.datetime.utcnow()
        state.active = False
        stop_music(self.user_id)
        clear_active_focus_state(self.user_id)
        save_focus_session(state)  # Overwrite with end time

        return state

    def get_focus_status(self) -> Optional[FocusState]:
        return get_current_focus_state(self.user_id)
