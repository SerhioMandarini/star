from typing import Any

from backend.python.app.infrastructure.repositories.sqlite_roadmap_repository import SQLiteRoadmapRepository


DEFAULT_PROFESSIONS = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "DevOps Engineer",
    "QA Engineer",
    "Data Analyst",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
]


class RoadmapService:
    def __init__(self, repository: SQLiteRoadmapRepository):
        self._repository = repository

    def list_roadmaps(self) -> list[dict[str, Any]]:
        saved = {item["profession_id"]: item for item in self._repository.list_roadmaps()}
        result: list[dict[str, Any]] = []
        for title in DEFAULT_PROFESSIONS:
            result.append(saved.pop(title, {"profession_id": title, "title": title}))
        result.extend(saved.values())
        return result

    def get_roadmap(self, profession_id: str) -> dict[str, Any]:
        normalized = self._normalize_profession(profession_id)
        saved = self._repository.get_roadmap(normalized)
        if saved:
            return saved
        roadmap = self._default_roadmap(normalized)
        return self._repository.upsert_roadmap(normalized, normalized, roadmap)

    def save_roadmap(self, profession_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        normalized = self._normalize_profession(profession_id)
        data = payload.get("data") if isinstance(payload.get("data"), dict) else payload
        title = str(payload.get("title") or data.get("title") or normalized).strip() or normalized
        roadmap = self._normalize_roadmap(data)
        return self._repository.upsert_roadmap(normalized, title, roadmap)

    def get_progress(self, user_id: int, profession_id: str) -> dict[str, Any]:
        normalized = self._normalize_profession(profession_id)
        saved = self._repository.get_progress(user_id, normalized)
        if saved:
            progress = self._normalize_progress(saved["progress"])
            return {**saved, "user_id": user_id, "profession_id": normalized, "progress": progress}
        return {
            "user_id": user_id,
            "profession_id": normalized,
            "progress": {"completed": {}, "nodeStatus": {}},
            "created_at": None,
            "updated_at": None,
        }

    def save_progress(self, user_id: int, profession_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        normalized = self._normalize_profession(profession_id)
        progress = self._normalize_progress(payload.get("progress") if isinstance(payload.get("progress"), dict) else payload)
        saved = self._repository.upsert_progress(user_id, normalized, progress)
        return {**saved, "user_id": user_id, "profession_id": normalized}

    def calculate_progress(self, profession_id: str, progress: dict[str, Any] | None = None, user_id: int | None = None) -> dict[str, Any]:
        roadmap = self.get_roadmap(profession_id)["data"]
        if progress is None and user_id is not None:
            progress = self.get_progress(user_id, profession_id)["progress"]
        normalized_progress = self._normalize_progress(progress or {})
        nodes = roadmap.get("nodes") if isinstance(roadmap.get("nodes"), list) else []
        completed = normalized_progress.get("completed", {})
        node_status = normalized_progress.get("nodeStatus", {})
        completed_count = sum(
            1
            for node in nodes
            if completed.get(str(node.get("id"))) or node_status.get(str(node.get("id"))) == "done"
        )
        total = len(nodes)
        percent = round((completed_count / total) * 100) if total else 0
        return {"percent": percent, "total": total, "completed": completed_count}

    def _normalize_profession(self, profession_id: str) -> str:
        normalized = (profession_id or "").strip()
        if not normalized:
            raise ValueError("profession_id is required")
        return normalized

    def _normalize_roadmap(self, data: dict[str, Any]) -> dict[str, Any]:
        default = self._default_roadmap(str(data.get("title") or "Roadmap"))
        return {
            "settings": {**default["settings"], **(data.get("settings") if isinstance(data.get("settings"), dict) else {})},
            "nodes": data.get("nodes") if isinstance(data.get("nodes"), list) else default["nodes"],
            "edges": data.get("edges") if isinstance(data.get("edges"), list) else default["edges"],
        }

    def _normalize_progress(self, data: dict[str, Any] | None) -> dict[str, Any]:
        source = data if isinstance(data, dict) else {}
        completed = source.get("completed") if isinstance(source.get("completed"), dict) else {}
        node_status = source.get("nodeStatus") if isinstance(source.get("nodeStatus"), dict) else {}
        return {**source, "completed": completed, "nodeStatus": node_status}

    def _default_roadmap(self, title: str) -> dict[str, Any]:
        slug = title.lower().replace(" ", "-").replace("/", "-")
        return {
            "settings": {
                "isDevModeDefault": True,
                "panOnScroll": True,
                "selectionOnDrag": True,
                "fitView": True,
            },
            "nodes": [
                {
                    "id": f"{slug}-foundation",
                    "type": "skillNode",
                    "position": {"x": 80, "y": 80},
                    "data": {
                        "label": "База",
                        "description": f"Основные понятия и инструменты направления {title}.",
                        "color": "#2563eb",
                        "status": "Core",
                        "freeLinks": "",
                        "articleLinks": "",
                        "plusLinks": "",
                        "practiceEnabled": True,
                    },
                },
                {
                    "id": f"{slug}-practice",
                    "type": "skillNode",
                    "position": {"x": 380, "y": 200},
                    "data": {
                        "label": "Практика",
                        "description": "Закрепление знаний на небольших задачах и разбор типовых ошибок.",
                        "color": "#7c3aed",
                        "status": "Core",
                        "freeLinks": "",
                        "articleLinks": "",
                        "plusLinks": "",
                        "practiceEnabled": True,
                    },
                },
                {
                    "id": f"{slug}-project",
                    "type": "skillNode",
                    "position": {"x": 700, "y": 80},
                    "data": {
                        "label": "Проект",
                        "description": "Сборка портфолио-проекта с применением изученных тем.",
                        "color": "#0f766e",
                        "status": "Main",
                        "freeLinks": "",
                        "articleLinks": "",
                        "plusLinks": "",
                        "practiceEnabled": True,
                    },
                },
                {
                    "id": f"{slug}-career",
                    "type": "skillNode",
                    "position": {"x": 1020, "y": 200},
                    "data": {
                        "label": "Карьера",
                        "description": "Подготовка резюме, собеседований и следующего уровня роста.",
                        "color": "#d97706",
                        "status": "Main",
                        "freeLinks": "",
                        "articleLinks": "",
                        "plusLinks": "",
                        "practiceEnabled": False,
                    },
                },
            ],
            "edges": [
                {"id": f"{slug}-e1", "source": f"{slug}-foundation", "target": f"{slug}-practice", "sourceSide": "right", "targetSide": "left", "type": "smoothstep", "animated": False, "secondary": False},
                {"id": f"{slug}-e2", "source": f"{slug}-practice", "target": f"{slug}-project", "sourceSide": "right", "targetSide": "left", "type": "smoothstep", "animated": False, "secondary": False},
                {"id": f"{slug}-e3", "source": f"{slug}-project", "target": f"{slug}-career", "sourceSide": "right", "targetSide": "left", "type": "smoothstep", "animated": False, "secondary": False},
            ],
        }
