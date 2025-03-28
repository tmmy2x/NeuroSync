from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.embedding import create_tone_profile
from db.postgres import save_profile_metadata
from db.redis_client import store_embedding_vector

router = APIRouter()

class ProfileRequest(BaseModel):
    user_id: str
    samples: list[str]

@router.post("/")
async def generate_style_profile(req: ProfileRequest):
    if len(req.samples) < 3:
        raise HTTPException(status_code=400, detail="Please provide at least 3 writing samples.")
    
    tone_profile = create_tone_profile(req.user_id, req.samples)
    store_embedding_vector(req.user_id, tone_profile["embedding"])
    save_profile_metadata(req.user_id, tone_profile)

    return {"message": "Profile created", "tone_profile": tone_profile}

@router.get("/{user_id}")
async def get_style_profile(user_id: str):
    from db.postgres import fetch_profile_metadata

    profile = fetch_profile_metadata(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {"user_id": user_id, "traits": profile}

@router.delete("/{user_id}")
async def delete_style_profile(user_id: str):
    from db.postgres import delete_profile_metadata

    deleted = delete_profile_metadata(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {"message": f"Profile for {user_id} deleted"}
