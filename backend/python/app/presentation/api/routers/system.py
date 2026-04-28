from fastapi import APIRouter, Request


def build_system_router() -> APIRouter:
    router = APIRouter(tags=["system"])

    @router.get("/health")
    async def health():
        return {"ok": True}

    @router.post("/api/cookies/consent")
    async def cookies_consent(request: Request):
        payload = await request.json()
        return {"ok": True, "consent": payload.get("consent") or "required"}

    return router
