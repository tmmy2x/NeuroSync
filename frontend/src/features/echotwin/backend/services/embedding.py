import openai
import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def get_average_embedding(samples: list[str]) -> list[float]:
    embeddings = [
        openai.Embedding.create(input=sample, model="text-embedding-ada-002")["data"][0]["embedding"]
        for sample in samples
    ]
    return np.mean(embeddings, axis=0).tolist()

def extract_tone_traits(samples: list[str]) -> dict:
    prompt = (
        "Analyze the following writing samples and return a JSON object with tone, style, and key traits:\n\n"
        + "\n\n---\n\n".join(samples)
    )
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response["choices"][0]["message"]["content"]

def create_tone_profile(user_id: str, samples: list[str]) -> dict:
    if not moderate_samples(samples):
        raise ValueError("One or more writing samples were flagged by moderation.")
    
    embedding = get_average_embedding(samples)
    traits = extract_tone_traits(samples)
    return {
        "user_id": user_id,
        "embedding": embedding,
        "traits": traits
    }

def moderate_samples(samples: list[str]) -> bool:
    for sample in samples:
        result = openai.Moderation.create(input=sample)
        flagged = result["results"][0]["flagged"]
        if flagged:
            return False
    return True
