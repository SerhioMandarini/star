from fastapi import APIRouter

from backend.python.app.presentation.dependencies import Container
from backend.python.app.presentation.schemas.admin import AdminAiConfigUpdateRequest, GeneratePracticeTasksRequest


def build_admin_router(container: Container) -> APIRouter:
    router = APIRouter(prefix="/api/admin", tags=["admin"])

    @router.get("/ai-config")
    async def get_ai_config():
        return container.admin_service.get_config_public()

    @router.post("/ai-config")
    async def update_ai_config(payload: AdminAiConfigUpdateRequest):
        return container.admin_service.update_config(payload.model_dump())

    @router.post("/practice/generate")
    async def generate_practice_tasks(payload: GeneratePracticeTasksRequest):
        tasks = await container.ai_service.generate_skill_tasks(
            profession=(payload.profession or "").strip(),
            skill_label=(payload.skillLabel or "").strip(),
            language=(payload.language or "javascript").strip(),
            count=max(1, min(10, payload.count)),
        )
        return {"tasks": tasks}

    return router
