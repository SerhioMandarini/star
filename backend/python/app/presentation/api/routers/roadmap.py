import json

from fastapi import APIRouter, Request
from pydantic import BaseModel


class ProgressResponse(BaseModel):
    percent: int


def build_roadmap_router() -> APIRouter:
    router = APIRouter(prefix="/api/roadmaps", tags=["roadmaps"])

    @router.post("/progress", response_model=ProgressResponse)
    async def calculate_progress(request: Request):
        body = await request.body()
        data = json.loads(body.decode("utf-8") or "{}")

        total = int(data.get("total", 0))
        completed = int(data.get("completed", 0))

        if total <= 0:
            return {"percent": 0}

        percent = round((completed / total) * 100)
        return {"percent": percent}

    return router