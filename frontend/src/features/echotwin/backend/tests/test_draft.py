from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_smart_draft_requires_profile():
    response = client.post("/draft", json={
        "user_id": "unknown-user",
        "type": "email",
        "prompt": "Follow up with client"
    })
    assert response.status_code == 404 or response.status_code == 500
