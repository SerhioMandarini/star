from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from backend.python.app.presentation.dependencies import Container


class ProgressResponse(BaseModel):
    percent: int
    total: int | None = None
    completed: int | None = None


def _current_user_id(request: Request, container: Container) -> int:
    user = container.auth_service.get_user_from_cookie(request.cookies.get(container.settings.cookie_name))
    return user.id if user else 0


def build_roadmap_router(container: Container) -> APIRouter:
    router = APIRouter(prefix="/api/roadmaps", tags=["roadmaps"])

    @router.get("")
    async def list_roadmaps():
        return {"roadmaps": container.roadmap_service.list_roadmaps()}

    @router.get("/{profession_id:path}/progress")
    async def get_progress(profession_id: str, request: Request):
        try:
            return container.roadmap_service.get_progress(_current_user_id(request, container), profession_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

    @router.put("/{profession_id:path}/progress")
    async def save_progress(profession_id: str, payload: dict[str, Any], request: Request):
        try:
            return container.roadmap_service.save_progress(_current_user_id(request, container), profession_id, payload)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

    @router.post("/{profession_id:path}/progress/calculate", response_model=ProgressResponse)
    async def calculate_profession_progress(profession_id: str, request: Request, payload: dict[str, Any] | None = None):
        try:
            progress = payload.get("progress") if isinstance(payload, dict) and isinstance(payload.get("progress"), dict) else payload
            return container.roadmap_service.calculate_progress(
                profession_id,
                progress=progress if isinstance(progress, dict) else None,
                user_id=_current_user_id(request, container),
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

    @router.post("/progress", response_model=ProgressResponse)
    async def calculate_legacy_progress(payload: dict[str, Any]):
        total = int(payload.get("total", 0) or 0)
        completed = int(payload.get("completed", 0) or 0)
        percent = round((completed / total) * 100) if total > 0 else 0
        return {"percent": percent, "total": total, "completed": completed}

    @router.get("/{profession_id:path}")
    async def get_roadmap(profession_id: str):
        try:
            return container.roadmap_service.get_roadmap(profession_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

    @router.put("/{profession_id:path}")
    async def save_roadmap(profession_id: str, payload: dict[str, Any]):
        # TODO: protect this endpoint with admin roles when roles exist in the project.
        try:
            return container.roadmap_service.save_roadmap(profession_id, payload)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

    return router
