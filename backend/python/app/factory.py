from fastapi import FastAPI

from backend.python.app.application.services.admin_service import AdminService
from backend.python.app.application.services.ai_service import AiService
from backend.python.app.application.services.auth_service import AuthService
from backend.python.app.core.config import get_settings
from backend.python.app.infrastructure.db.sqlite import SQLiteProvider
from backend.python.app.infrastructure.repositories.admin_config_repository import AdminConfigRepository
from backend.python.app.infrastructure.repositories.sqlite_user_repository import SQLiteUserRepository
from backend.python.app.presentation.api.routers.admin import build_admin_router
from backend.python.app.presentation.api.routers.ai import build_ai_router
from backend.python.app.presentation.api.routers.auth import build_auth_router
from backend.python.app.presentation.api.routers.fallback import build_fallback_router
from backend.python.app.presentation.api.routers.practice import build_practice_router
from backend.python.app.presentation.api.routers.system import build_system_router
from backend.python.app.presentation.dependencies import Container


def create_app() -> FastAPI:
    settings = get_settings()
    db_provider = SQLiteProvider(settings.db_path)
    db_provider.init_schema()

    user_repository = SQLiteUserRepository(db_provider)
    admin_repository = AdminConfigRepository(
        config_path=settings.admin_config_path,
        default_provider=settings.default_ai_provider,
        default_model=settings.default_ai_model,
        default_endpoint=settings.default_groq_url,
    )
    auth_service = AuthService(user_repository, settings.jwt_secret)
    admin_service = AdminService(
        repository=admin_repository,
        default_ai_provider=settings.default_ai_provider,
        default_ai_model=settings.default_ai_model,
        default_groq_url=settings.default_groq_url,
    )
    ai_service = AiService(
        admin_service=admin_service,
        default_groq_url=settings.default_groq_url,
        default_ai_model=settings.default_ai_model,
    )
    container = Container(settings=settings, auth_service=auth_service, admin_service=admin_service, ai_service=ai_service)

    app = FastAPI(title="roadstar-python-backend")
    app.include_router(build_system_router())
    app.include_router(build_auth_router(container))
    app.include_router(build_admin_router(container))
    app.include_router(build_practice_router())
    app.include_router(build_ai_router(container))
    app.include_router(build_fallback_router(settings.legacy_node_url, settings.frontend_dir))
    return app
