from backend.python.app.domain.entities.user import User
from backend.python.app.domain.repositories.user_repository import UserRepository
from backend.python.app.infrastructure.db.sqlite import SQLiteProvider


def _row_to_user(row) -> User:
    return User(
        id=row["id"],
        email=row["email"],
        name=row["name"],
        password_hash=row["password_hash"],
        created_at=row["created_at"],
        created_date=row["created_date"],
        provider=row["provider"],
        provider_id=row["provider_id"],
        plus=row["plus"],
        tokens=row["tokens"],
    )


class SQLiteUserRepository(UserRepository):
    def __init__(self, db: SQLiteProvider):
        self._db = db

    def find_by_email(self, email: str) -> User | None:
        conn = self._db.connect()
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()
        return _row_to_user(row) if row else None

    def find_by_id(self, user_id: int) -> User | None:
        conn = self._db.connect()
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        return _row_to_user(row) if row else None

    def create_local_user(self, email: str, name: str, password_hash: str, created_at: str, created_date: str) -> User:
        conn = self._db.connect()
        cursor = conn.execute(
            """
            INSERT INTO users (email, name, password_hash, created_at, created_date, provider, provider_id, plus, tokens)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (email, name, password_hash, created_at, created_date, "local", None, "off", 0),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)).fetchone()
        conn.close()
        return _row_to_user(row)
