import sqlite3
from pathlib import Path


class SQLiteProvider:
    def __init__(self, db_path: Path):
        self._db_path = db_path

    def connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_schema(self) -> None:
        conn = self.connect()
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT UNIQUE NOT NULL,
              name TEXT,
              password_hash TEXT,
              created_at TEXT NOT NULL,
              created_date TEXT NOT NULL,
              provider TEXT NOT NULL DEFAULT 'local',
              provider_id TEXT,
              plus TEXT NOT NULL DEFAULT 'off',
              tokens INTEGER NOT NULL DEFAULT 0
            );
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS roadmaps (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              profession_id TEXT UNIQUE NOT NULL,
              title TEXT NOT NULL,
              data_json TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS user_roadmap_progress (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              profession_id TEXT NOT NULL,
              progress_json TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              UNIQUE(user_id, profession_id)
            );
            """
        )
        conn.commit()
        conn.close()
