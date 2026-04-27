import json
import urllib.error
import urllib.parse
import urllib.request


BASE_URL = "http://localhost:3000"


def call(method: str, path: str, payload: dict | None = None, cookie: str | None = None):
    data = None
    headers = {"Content-Type": "application/json"}
    if cookie:
        headers["Cookie"] = cookie
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(f"{BASE_URL}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as response:
            body = response.read().decode("utf-8")
            set_cookie = response.headers.get("Set-Cookie")
            return response.status, json.loads(body), set_cookie
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8")
        return exc.code, json.loads(body), None


def main():
    checks: list[tuple[str, bool]] = []
    status, payload, _ = call("POST", "/api/cookies/consent", {"consent": "accepted"})
    checks.append(("cookies_consent", status == 200 and payload.get("ok") is True))

    status, payload, _ = call("GET", "/api/auth/providers")
    checks.append(("auth_providers", status == 200 and "providers" in payload))

    status, payload, _ = call("GET", "/api/practice/plan?profession=frontend")
    checks.append(("practice_plan", status == 200 and isinstance(payload.get("plan"), list)))

    status, payload, _ = call("POST", "/api/ai/practice/task", {"profession": "frontend", "stepId": "frontend-html"})
    checks.append(("ai_practice_task", status == 200 and "task" in payload))

    failed = [name for name, ok in checks if not ok]
    if failed:
        raise SystemExit(f"Smoke checks failed: {', '.join(failed)}")
    print("Smoke checks passed.")


if __name__ == "__main__":
    main()
