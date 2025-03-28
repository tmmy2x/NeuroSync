import os
import json
import psycopg2
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT"),
    database=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD")
)

def save_profile_metadata(user_id: str, profile: dict):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO tone_profiles (user_id, traits, created_at)
            VALUES (%s, %s, NOW())
            ON CONFLICT (user_id) DO UPDATE SET traits = EXCLUDED.traits;
        """, (user_id, json.dumps(profile["traits"])))
        conn.commit()

def fetch_profile_metadata(user_id: str) -> dict | None:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT traits FROM tone_profiles WHERE user_id = %s
        """, (user_id,))
        row = cur.fetchone()
        if row:
            return row[0]  # JSONB column (traits)
        return None

def delete_profile_metadata(user_id: str) -> bool:
    with conn.cursor() as cur:
        cur.execute("DELETE FROM tone_profiles WHERE user_id = %s", (user_id,))
        deleted = cur.rowcount > 0
        conn.commit()
        return deleted
