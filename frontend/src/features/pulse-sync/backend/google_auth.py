from fastapi.responses import RedirectResponse
from fastapi import Request
import os
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from db import SessionLocal, UserSession
import json

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/auth/callback"
SCOPES = ["https://www.googleapis.com/auth/calendar"]

flow = Flow.from_client_config(
    {
        "web": {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    },
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI
)

def get_auth_url():
    auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline', include_granted_scopes='true')
    return auth_url

def exchange_code(code: str) -> Credentials:
    flow.fetch_token(code=code)
    return flow.credentials

async def save_token(user_id: str, creds):
    async with SessionLocal() as session:
        user = UserSession(user_id=user_id, token_json=creds.to_json())
        await session.merge(user)
        await session.commit()

async def load_token(user_id: str):
    async with SessionLocal() as session:
        result = await session.execute(select(UserSession).where(UserSession.user_id == user_id))
        user = result.scalar()
        if user:
            from google.oauth2.credentials import Credentials
            return Credentials.from_authorized_user_info(json.loads(user.token_json))
        return None