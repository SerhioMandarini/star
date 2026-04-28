import json
from pathlib import Path
from typing import Any


class AdminConfigRepository:
    def __init__(self, config_path: Path, default_provider: str, default_model: str, default_endpoint: str):
        self._config_path = config_path
        self._default_provider = default_provider
        self._default_model = default_model
        self._default_endpoint = default_endpoint

    def get(self, env_api_key: str = "") -> dict[str, Any]:
        default_admin_config = {
            "ai": {
                "provider": self._default_provider,
                "model": self._default_model,
                "apiKey": env_api_key,
                "endpoint": self._default_endpoint,
            }
        }
        try:
            if not self._config_path.exists():
                return default_admin_config
            saved = json.loads(self._config_path.read_text(encoding="utf-8"))
        except Exception:
            saved = {}
        ai = {**default_admin_config["ai"], **saved.get("ai", {})}
        return {**default_admin_config, **saved, "ai": ai}

    def save(self, config: dict[str, Any]) -> None:
        self._config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")
