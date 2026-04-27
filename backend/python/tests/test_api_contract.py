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


def test_ai_fallback_task_shape():
    response = client.post(
        "/api/ai/practice/task",
        json={"profession": "frontend", "stepId": "frontend-html"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "task" in payload
    assert "step" in payload
