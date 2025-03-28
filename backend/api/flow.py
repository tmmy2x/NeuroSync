# flow.py
import datetime
from typing import List, Optional, Dict, Any
from utils.time_utils import get_user_rhythm, get_current_time_block
from engine.task_scorer import score_tasks
from engine.smart_scheduler import suggest_schedule
from engine.rescheduler import handle_conflicts
from database.models import Task, UserContext
from models.suggestions import FlowSuggestion


class FlowEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.context: UserContext = self._load_user_context()
        self.tasks: List[Task] = self._load_tasks()

    def _load_user_context(self) -> UserContext:
        from database.query import get_user_context
        return get_user_context(self.user_id)

    def _load_tasks(self) -> List[Task]:
        from database.query import get_user_tasks
        return get_user_tasks(self.user_id)

    def generate_flow(self, date: Optional[datetime.date] = None) -> FlowSuggestion:
        if not date:
            date = datetime.date.today()

        rhythm_profile = get_user_rhythm(self.context)
        current_block = get_current_time_block(datetime.datetime.now(), rhythm_profile)

        scored_tasks = score_tasks(self.tasks, self.context, rhythm_profile)
        proposed_schedule = suggest_schedule(
            tasks=scored_tasks,
            user_context=self.context,
            date=date,
            time_block=current_block
        )

        resolved_schedule = handle_conflicts(
            schedule=proposed_schedule,
            existing_tasks=self.tasks,
            user_context=self.context
        )

        return FlowSuggestion(
            user_id=self.user_id,
            date=date,
            suggestions=resolved_schedule,
            notes=self._generate_notes(resolved_schedule)
        )

    def _generate_notes(self, schedule: List[Dict[str, Any]]) -> str:
        focus_count = sum(1 for item in schedule if item['type'] == 'focus')
        buffer_count = sum(1 for item in schedule if item['type'] == 'buffer')

        return (
            f"{focus_count} deep work block(s), {buffer_count} buffer zone(s) suggested "
            "based on your current energy profile. Adjustments made for recent fatigue signals."
        )
