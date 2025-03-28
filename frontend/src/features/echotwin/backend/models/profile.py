from pydantic import BaseModel

class ToneProfile(BaseModel):
    user_id: str
    embedding: list[float]
    traits: dict
