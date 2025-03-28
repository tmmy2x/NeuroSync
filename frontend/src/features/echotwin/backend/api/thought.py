from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.postgres import fetch_profile_metadata
from services.thought_engine import save_thought, continue_thought

router = APIRouter()

class ThoughtSaveRequest(BaseModel):
    user_id: str
    title: str
    content: str

class ThoughtContinueRequest(BaseModel):
    user_id: str
    thought: str

class ThoughtSearchRequest(BaseModel):
    user_id: str
    query: str

@router.post("/save")
async def save_user_thought(req: ThoughtSaveRequest):
    save_thought(req.user_id, req.title, req.content)
    return {"message": "Thought saved"}

@router.post("/continue")
async def continue_user_thought(req: ThoughtContinueRequest):
    traits = fetch_profile_metadata(req.user_id)
    if not traits:
        raise HTTPException(status_code=404, detail="User style profile not found")

    continuation = continue_thought(req.thought, traits)
    return {"continuation": continuation}

@router.get("/{user_id}")
async def list_thoughts(user_id: str):
    from services.thought_engine import list_thought_titles
    titles = list_thought_titles(user_id)
    return {"thoughts": titles}

@router.get("/{user_id}/{title}")
async def get_saved_thought(user_id: str, title: str):
    from services.thought_engine import get_thought
    content = get_thought(user_id, title)
    return {"title": title, "content": content}

@router.post("/search")
async def search_thoughts(req: ThoughtSearchRequest):
    from services.thought_engine import search_thoughts

    matches = search_thoughts(req.user_id, req.query)
    return {"matches": matches}