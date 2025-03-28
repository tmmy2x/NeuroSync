from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.postgres import fetch_profile_metadata
from services.drafting import generate_draft

router = APIRouter()

class DraftRequest(BaseModel):
    user_id: str
    type: str  # e.g. 'email', 'note', 'message'
    prompt: str

@router.post("/")
async def smart_draft(req: DraftRequest):
    traits = fetch_profile_metadata(req.user_id)
    if not traits:
        raise HTTPException(status_code=404, detail="No style profile found")

    try:
        draft = generate_draft(req.prompt, req.type, traits)
        return {"draft": draft}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RefineRequest(BaseModel):
    draft: str
    refinement: str  # e.g. "Make it more formal"

@router.post("/refine")
async def refine_draft(req: RefineRequest):
    from services.drafting import refine_draft

    try:
        result = refine_draft(req.draft, req.refinement)
        return {"refined": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
