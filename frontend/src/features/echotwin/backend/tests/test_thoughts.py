from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_save_and_continue_thought():
    thought = "This is an incomplete thought about productivity..."
    save_response = client.post("/thought/save", json={
        "user_id": "test-user-3",
        "title": "test-thought",
        "content": thought
    })
    assert save_response.status_code == 200

    continue_response = client.post("/thought/continue", json={
        "user_id": "test-user-3",
        "thought": thought
    })
    assert continue_response.status_code == 200
    assert "continuation" in continue_response.json()
