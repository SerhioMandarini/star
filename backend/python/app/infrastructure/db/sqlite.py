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
        conn.commit()
        conn.close()
