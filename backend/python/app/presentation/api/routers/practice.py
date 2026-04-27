from fastapi import APIRouter

from backend.python.app.application.services.practice_service import get_practice_plan


def build_practice_router() -> APIRouter:
    router = APIRouter(prefix="/api/practice", tags=["practice"])

    @router.get("/plan")
    async def practice_plan(item: str = "", profession: str = ""):
        resolved = (item or profession or "").strip()
        return {"profession": resolved, "plan": get_practice_plan(resolved)}

    return router
