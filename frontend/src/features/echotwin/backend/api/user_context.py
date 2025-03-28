from fastapi import APIRouter, HTTPException
from db.postgres import fetch_profile_metadata
from services.mood import get_user_mood
from services.flow import get_current_rhythm_phase

router = APIRouter()

@router.get("/user/context/{user_id}")
async def get_user_context(user_id: str):
    try:
        tone_profile = fetch_profile_metadata(user_id)
        mood = get_user_mood(user_id)
        rhythm_phase = get_current_rhythm_phase(user_id)

        return {
            "user_id": user_id,
            "tone_profile": tone_profile,
            "mood": mood,
            "rhythm_phase": rhythm_phase
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
