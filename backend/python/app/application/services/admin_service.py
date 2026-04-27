import os
from typing import Any

from backend.python.app.infrastructure.repositories.admin_config_repository import AdminConfigRepository


class AdminService:
    def __init__(self, repository: AdminConfigRepository, default_ai_provider: str, default_ai_model: str, default_groq_url: str):
        self._repository = repository
        self._default_ai_provider = default_ai_provider
        self._default_ai_model = default_ai_model
        self._default_groq_url = default_groq_url

    def get_config_public(self) -> dict[str, Any]:
        config = self._repository.get(env_api_key=os.getenv("GROQ_API_KEY", ""))
        return {
            "ai": {
                "provider": config["ai"]["provider"],
                "model": config["ai"]["model"],
                "endpoint": config["ai"]["endpoint"],
                "hasKey": bool(config["ai"]["apiKey"]),
            }
        }

    def update_config(self, payload: dict[str, Any]) -> dict[str, Any]:
        current = self._repository.get(env_api_key=os.getenv("GROQ_API_KEY", ""))
        next_config = {
            **current,
            "ai": {
                "provider": str(payload.get("provider") or current["ai"].get("provider") or self._default_ai_provider).strip() or self._default_ai_provider,
                "model": str(payload.get("model") or current["ai"].get("model") or self._default_ai_model).strip() or self._default_ai_model,
                "endpoint": str(payload.get("endpoint") or current["ai"].get("endpoint") or self._default_groq_url).strip() or self._default_groq_url,
                "apiKey": (payload.get("apiKey") or "").strip() if isinstance(payload.get("apiKey"), str) and payload.get("apiKey").strip() else current["ai"].get("apiKey") or os.getenv("GROQ_API_KEY", ""),
            },
        }
        self._repository.save(next_config)
        return {
            "ok": True,
            "ai": {
                "provider": next_config["ai"]["provider"],
                "model": next_config["ai"]["model"],
                "endpoint": next_config["ai"]["endpoint"],
                "hasKey": bool(next_config["ai"]["apiKey"]),
            },
        }

    def get_internal_config(self) -> dict[str, Any]:
        return self._repository.get(env_api_key=os.getenv("GROQ_API_KEY", ""))
