import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_draft(prompt: str, draft_type: str, traits: dict) -> str:
    system_prompt = (
        f"You are the user's AI writing assistant. "
        f"Generate a {draft_type} in the user's tone and style based on the following traits:\n"
        f"{traits}\n\n"
        f"Ensure the output matches the tone, phrasing, and structure the user typically uses."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        temperature=0.7
    )

    return response["choices"][0]["message"]["content"]

def refine_draft(draft: str, instruction: str) -> str:
    prompt = (
        f"Refine the following text based on this instruction: '{instruction}'\n\n"
        f"---\n\n{draft}\n\n---"
    )

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response["choices"][0]["message"]["content"]
