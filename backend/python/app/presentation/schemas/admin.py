from pydantic import BaseModel


class AdminAiConfigUpdateRequest(BaseModel):
    provider: str | None = None
    model: str | None = None
    endpoint: str | None = None
    apiKey: str | None = None


class GeneratePracticeTasksRequest(BaseModel):
    profession: str | None = None
    skillLabel: str | None = None
    language: str | None = None
    count: int = 5
