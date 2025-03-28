from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import mood, flow, echo, focus, emotion, communication, prediction, simulation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Unified route registration
app.include_router(mood.router, prefix="/api/mood")
app.include_router(flow.router, prefix="/api/flow")
app.include_router(echo.router, prefix="/api/echo")
app.include_router(focus.router, prefix="/api/focus")
app.include_router(emotion.router, prefix="/api/emotion")
app.include_router(communication.router, prefix="/api/communication")
app.include_router(prediction.router, prefix="/api/prediction")
app.include_router(simulation.router, prefix="/api/simulation")
