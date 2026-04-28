from fastapi import APIRouter

from backend.python.app.presentation.dependencies import Container
from backend.python.app.presentation.schemas.admin import AdminAiConfigUpdateRequest


def build_admin_router(container: Container) -> APIRouter:
    router = APIRouter(prefix="/api/admin", tags=["admin"])

    @router.get("/ai-config")
    async def get_ai_config():
        return container.admin_service.get_config_public()

    @router.post("/ai-config")
    async def update_ai_config(payload: AdminAiConfigUpdateRequest):
        return container.admin_service.update_config(payload.model_dump())

    return router
