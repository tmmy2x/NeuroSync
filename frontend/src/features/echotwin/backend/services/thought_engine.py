import redis
import openai
import os
from dotenv import load_dotenv
import numpy as np
import json

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def save_thought(user_id: str, title: str, content: str):
    key = f"thoughts:{user_id}:{title}"
    r.set(key, content)

def continue_thought(thought: str, traits: dict) -> str:
    prompt = (
        f"You are continuing the user's thought below in their tone and style:\n"
        f"---\nTraits: {traits}\n---\n"
        f"Partial Thought:\n{thought}\n\n"
        f"Continue the idea seamlessly:"
    )

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response["choices"][0]["message"]["content"]

def list_thought_titles(user_id: str) -> list[str]:
    pattern = f"thoughts:{user_id}:*"
    keys = r.keys(pattern)
    titles = [key.split(":")[-1] for key in keys]
    return titles

def get_thought(user_id: str, title: str) -> str:
    key = f"thoughts:{user_id}:{title}"
    return r.get(key) or ""

def embed_text(text: str) -> list[float]:
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response["data"][0]["embedding"]

def save_thought(user_id: str, title: str, content: str):
    key = f"thoughts:{user_id}:{title}"
    r.set(key, content)

    # Save vector embedding
    embedding = embed_text(content)
    vector_key = f"thought_vectors:{user_id}:{title}"
    r.set(vector_key, json.dumps(embedding))

    def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    a = np.array(vec1)
    b = np.array(vec2)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def search_thoughts(user_id: str, query: str) -> list[dict]:
    query_vec = embed_text(query)
    vector_keys = r.keys(f"thought_vectors:{user_id}:*")

    scored = []
    for key in vector_keys:
        raw = r.get(key)
        if not raw: continue
        stored_vec = json.loads(raw)
        score = cosine_similarity(query_vec, stored_vec)
        title = key.split(":")[-1]
        scored.append({"title": title, "score": score})

    top_matches = sorted(scored, key=lambda x: x["score"], reverse=True)[:3]
    return top_matches
