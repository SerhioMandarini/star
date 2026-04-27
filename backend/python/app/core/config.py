import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    port: int
    app_url: str
    jwt_secret: str
    cookie_name: str
    cookie_secure: bool
    default_ai_model: str
    default_ai_provider: str
    default_groq_url: str
    legacy_node_url: str
    base_dir: Path
    data_dir: Path
    db_path: Path
    admin_config_path: Path
    frontend_dir: Path


def get_settings() -> Settings:
    port = int(os.getenv("PORT", "3000"))
    app_url = os.getenv("APP_URL", f"http://localhost:{port}")
    base_dir = Path(__file__).resolve().parents[2]
    data_dir = base_dir / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    return Settings(
        port=port,
        app_url=app_url,
        jwt_secret=os.getenv("JWT_SECRET", "change_this_secret"),
        cookie_name=os.getenv("COOKIE_NAME", "roadstar_token"),
        cookie_secure=app_url.startswith("https://"),
        default_ai_model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        default_ai_provider="groq",
        default_groq_url="https://api.groq.com/openai/v1/chat/completions",
        legacy_node_url=os.getenv("LEGACY_NODE_URL", "http://localhost:3001"),
        base_dir=base_dir,
        data_dir=data_dir,
        db_path=data_dir / "roadstar.db",
        admin_config_path=data_dir / "admin-config.json",
        frontend_dir=base_dir.parent.parent / "frontend",
    )
