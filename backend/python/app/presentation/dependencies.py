from dataclasses import dataclass

from backend.python.app.application.services.admin_service import AdminService
from backend.python.app.application.services.ai_service import AiService
from backend.python.app.application.services.auth_service import AuthService
from backend.python.app.application.services.roadmap_service import RoadmapService
from backend.python.app.core.config import Settings


@dataclass(frozen=True)
class Container:
    settings: Settings
    auth_service: AuthService
    admin_service: AdminService
    ai_service: AiService
    roadmap_service: RoadmapService
