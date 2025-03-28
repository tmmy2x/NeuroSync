import redis
import json

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def store_embedding_vector(user_id: str, embedding: list[float]):
    r.set(f"user:{user_id}:embedding", json.dumps(embedding))
