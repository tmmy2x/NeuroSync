from fastapi import FastAPI
from api.style_profile import router as style_profile_router
from api.draft import router as draft_router
from api.thought import router as thought_router
from api.user_context import router as context_router
from api.focus import router as focus_router

app = FastAPI(title="EchoTwin API")

# Register feature routes
app.include_router(style_profile_router, prefix="/style-profile", tags=["Style Profile"])
app.include_router(draft_router, prefix="/draft", tags=["Smart Drafts"])
app.include_router(thought_router, prefix="/thought", tags=["Thought Continuation"])
app.include_router(context_router, tags=["User Context"])
app.include_router(focus_router, prefix="/focus", tags=["Focus Bubble Engine"])


print("✅ Connected to PostgreSQL successfully")