import json
from datetime import datetime, timezone
from typing import Any

from backend.python.app.infrastructure.db.sqlite import SQLiteProvider


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _decode_json(raw: str | None, fallback: dict[str, Any]) -> dict[str, Any]:
    try:
        data = json.loads(raw or "{}")
        return data if isinstance(data, dict) else fallback
    except json.JSONDecodeError:
        return fallback


class SQLiteRoadmapRepository:
    def __init__(self, db: SQLiteProvider):
        self._db = db

    def list_roadmaps(self) -> list[dict[str, Any]]:
        conn = self._db.connect()
        rows = conn.execute(
            """
            SELECT profession_id, title, created_at, updated_at
            FROM roadmaps
            ORDER BY title COLLATE NOCASE
            """
        ).fetchall()
        conn.close()
        return [dict(row) for row in rows]

    def get_roadmap(self, profession_id: str) -> dict[str, Any] | None:
        conn = self._db.connect()
        row = conn.execute("SELECT * FROM roadmaps WHERE profession_id = ?", (profession_id,)).fetchone()
        conn.close()
        if not row:
            return None
        return {
            "profession_id": row["profession_id"],
            "title": row["title"],
            "data": _decode_json(row["data_json"], {}),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }

    def upsert_roadmap(self, profession_id: str, title: str, data: dict[str, Any]) -> dict[str, Any]:
        now = _now()
        data_json = json.dumps(data, ensure_ascii=False)
        conn = self._db.connect()
        existing = conn.execute("SELECT id, created_at FROM roadmaps WHERE profession_id = ?", (profession_id,)).fetchone()
        if existing:
            conn.execute(
                """
                UPDATE roadmaps
                SET title = ?, data_json = ?, updated_at = ?
                WHERE profession_id = ?
                """,
                (title, data_json, now, profession_id),
            )
            created_at = existing["created_at"]
        else:
            conn.execute(
                """
                INSERT INTO roadmaps (profession_id, title, data_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (profession_id, title, data_json, now, now),
            )
            created_at = now
        conn.commit()
        conn.close()
        return {
            "profession_id": profession_id,
            "title": title,
            "data": data,
            "created_at": created_at,
            "updated_at": now,
        }

    def get_progress(self, user_id: int, profession_id: str) -> dict[str, Any] | None:
        conn = self._db.connect()
        row = conn.execute(
            """
            SELECT progress_json, created_at, updated_at
            FROM user_roadmap_progress
            WHERE user_id = ? AND profession_id = ?
            """,
            (user_id, profession_id),
        ).fetchone()
        conn.close()
        if not row:
            return None
        return {
            "progress": _decode_json(row["progress_json"], {"completed": {}, "nodeStatus": {}}),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }

    def upsert_progress(self, user_id: int, profession_id: str, progress: dict[str, Any]) -> dict[str, Any]:
        now = _now()
        progress_json = json.dumps(progress, ensure_ascii=False)
        conn = self._db.connect()
        existing = conn.execute(
            """
            SELECT id, created_at
            FROM user_roadmap_progress
            WHERE user_id = ? AND profession_id = ?
            """,
            (user_id, profession_id),
        ).fetchone()
        if existing:
            conn.execute(
                """
                UPDATE user_roadmap_progress
                SET progress_json = ?, updated_at = ?
                WHERE user_id = ? AND profession_id = ?
                """,
                (progress_json, now, user_id, profession_id),
            )
            created_at = existing["created_at"]
        else:
            conn.execute(
                """
                INSERT INTO user_roadmap_progress (user_id, profession_id, progress_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (user_id, profession_id, progress_json, now, now),
            )
            created_at = now
        conn.commit()
        conn.close()
        return {"progress": progress, "created_at": created_at, "updated_at": now}
