from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_style_profile_minimum_samples():
    response = client.post("/style-profile/", json={
        "user_id": "test-user-1",
        "samples": ["Hello world", "Another test", "Final example"]
    })
    assert response.status_code == 200
    assert "tone_profile" in response.json()

def test_create_style_profile_too_few_samples():
    response = client.post("/style-profile/", json={
        "user_id": "test-user-2",
        "samples": ["Only one"]
    })
    assert response.status_code == 400
