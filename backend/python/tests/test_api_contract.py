from fastapi.testclient import TestClient

from backend.python.app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_cookie_consent():
    response = client.post("/api/cookies/consent", json={"consent": "accepted"})
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_auth_providers_shape():
    response = client.get("/api/auth/providers")
    assert response.status_code == 200
    payload = response.json()
    assert "providers" in payload
    assert {"google", "github", "yandex"}.issubset(payload["providers"].keys())


def test_practice_plan_shape():
    response = client.get("/api/practice/plan", params={"profession": "frontend"})
    assert response.status_code == 200
    payload = response.json()
    assert "plan" in payload
    assert len(payload["plan"]) >= 1


def test_roadmap_api_by_profession():
    profession = "contract-test-roadmap"
    roadmap = {
        "nodes": [
            {"id": "one", "data": {"label": "One"}, "position": {"x": 0, "y": 0}},
            {"id": "two", "data": {"label": "Two"}, "position": {"x": 100, "y": 0}},
            {"id": "three", "data": {"label": "Three"}, "position": {"x": 200, "y": 0}},
            {"id": "four", "data": {"label": "Four"}, "position": {"x": 300, "y": 0}},
        ],
        "edges": [],
    }

    saved = client.put(f"/api/roadmaps/{profession}", json={"title": "Contract Test", "data": roadmap})
    assert saved.status_code == 200
    assert saved.json()["data"]["nodes"][0]["id"] == "one"

    loaded = client.get(f"/api/roadmaps/{profession}")
    assert loaded.status_code == 200
    assert loaded.json()["profession_id"] == profession

    progress = client.put(f"/api/roadmaps/{profession}/progress", json={"progress": {"completed": {"one": True}}})
    assert progress.status_code == 200
    assert progress.json()["profession_id"] == profession

    calculated = client.post(
        f"/api/roadmaps/{profession}/progress/calculate",
        json={"progress": {"completed": {"one": True}}},
    )
    assert calculated.status_code == 200
    assert calculated.json()["percent"] == 25


def test_ai_fallback_task_shape():
    response = client.post(
        "/api/ai/practice/task",
        json={"profession": "frontend", "stepId": "frontend-html"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "task" in payload
    assert "step" in payload
