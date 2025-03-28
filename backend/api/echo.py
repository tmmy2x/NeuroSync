# echo.py

from typing import Optional, Dict, Any
from models.tone_profile import ToneProfile
from models.draft import EchoDraft
from utils.llm_client import EchoLLMClient
from database.query import (
    get_user_tone_profile,
    save_draft_history,
    get_thought_seed,
)
from engine.semantic_matcher import continue_from_seed


class EchoEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.tone_profile: ToneProfile = self._load_tone_profile()
        self.llm = EchoLLMClient()

    def _load_tone_profile(self) -> ToneProfile:
        return get_user_tone_profile(self.user_id)

    def generate_draft(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> EchoDraft:
        payload = {
            "prompt": prompt,
            "tone": self.tone_profile.dict(),
            "context": context or {}
        }

        result = self.llm.generate_tonal_draft(payload)

        draft = EchoDraft(
            user_id=self.user_id,
            prompt=prompt,
            content=result["content"],
            tone_applied=result.get("tone_applied"),
            suggestions=result.get("suggestions", []),
            confidence=result.get("confidence", 0.85)
        )

        save_draft_history(self.user_id, draft)
        return draft

    def continue_thought(self, thought_id: str) -> EchoDraft:
        seed = get_thought_seed(self.user_id, thought_id)
        if not seed:
            raise ValueError(f"No thought seed found for ID: {thought_id}")

        extended = continue_from_seed(seed=seed, tone=self.tone_profile)

        return EchoDraft(
            user_id=self.user_id,
            prompt=seed.seed_text,
            content=extended["content"],
            tone_applied=extended.get("tone_applied"),
            suggestions=extended.get("suggestions", []),
            confidence=extended.get("confidence", 0.82)
        )
