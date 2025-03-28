from fastapi import APIRouter
from services.flow import get_current_rhythm_phase
from services.mood import get_user_mood
from services.core_context import should_activate_focus_mode

router = APIRouter()

@router.get("/focus/evaluate/{user_id}")
async def evaluate_focus_state(user_id: str):
    mood = get_user_mood(user_id)
    rhythm = get_current_rhythm_phase(user_id)
    result = should_activate_focus_mode(mood, rhythm)
    return {
        "user_id": user_id,
        "mood": mood,
        "rhythm_phase": rhythm,
        **result
    }
