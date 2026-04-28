# Roadstar Migration Baseline

## API Contract Baseline

- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `GET /api/auth/providers`
  - `GET /api/auth/{google|github|yandex}`
  - `GET /api/auth/{google|github|yandex}/callback`
- Admin:
  - `GET /api/admin/ai-config`
  - `POST /api/admin/ai-config`
- Practice/AI:
  - `GET /api/practice/plan`
  - `POST /api/ai/practice/task`
  - `POST /api/ai/practice/check`
  - `POST /api/ai/mentor`
  - `POST /api/ai/roadmap-help`
- Utility:
  - `POST /api/cookies/consent`

## Env Contract Baseline

- Core: `PORT`, `APP_URL`, `JWT_SECRET`, `COOKIE_NAME`
- OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `YANDEX_CLIENT_ID`, `YANDEX_CLIENT_SECRET`
- AI: `GROQ_MODEL`, `GROQ_API_KEY`, `GROQ_API_URL`
- Migration bridge: `LEGACY_NODE_URL`

## Runtime/Persistence Contract Baseline

- Persistent state folder: `backend/data` (mounted in docker volume).
- SQLite file: `backend/data/roadstar.db`
- Admin config file: `backend/data/admin-config.json`
- Frontend static files: `frontend/*`

## Smoke Checklist

1. `POST /api/cookies/consent` returns `ok=true`.
2. Register test user via `POST /api/auth/register`.
3. Login via `POST /api/auth/login`.
4. Session check via `GET /api/auth/me`.
5. Read providers via `GET /api/auth/providers`.
6. Read practice plan via `GET /api/practice/plan?profession=frontend`.
7. Get AI practice task via `POST /api/ai/practice/task` (fallback accepted without API key).
