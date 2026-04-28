from pydantic import BaseModel


class AdminAiConfigUpdateRequest(BaseModel):
    provider: str | None = None
    model: str | None = None
    endpoint: str | None = None
    apiKey: str | None = None
