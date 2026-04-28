from fastapi.testclient import TestClient

from backend.python.app.main import app


client = TestClient(app)


def test_frontend_index_available():
    response = client.get("/")
    assert response.status_code == 200
    assert "<!doctype html>" in response.text.lower()


def test_frontend_static_page_available():
    response = client.get("/learning.html")
    assert response.status_code == 200
    assert "<html" in response.text.lower()
