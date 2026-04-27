from datetime import datetime, timezone

from jose import JWTError, jwt

from backend.python.app.core.security import create_auth_token, hash_password, verify_password
from backend.python.app.domain.entities.user import User
from backend.python.app.domain.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, user_repository: UserRepository, jwt_secret: str):
        self._users = user_repository
        self._jwt_secret = jwt_secret

    def register(self, email: str, name: str, password: str, consent: bool) -> User:
        normalized_email = (email or "").strip().lower()
        normalized_name = (name or "").strip()
        raw_password = password or ""
        if not consent:
            raise ValueError("Нужно согласие с условиями обработки данных.")
        if len(normalized_name) < 2:
            raise ValueError("Введите имя длиной не менее 2 символов.")
        if not normalized_email or not raw_password:
            raise ValueError("Введите email и пароль.")
        if len(raw_password) < 8:
            raise ValueError("Пароль должен быть не короче 8 символов.")
        if self._users.find_by_email(normalized_email):
            raise FileExistsError("Пользователь с таким email уже существует.")
        now = datetime.now(timezone.utc)
        return self._users.create_local_user(
            normalized_email,
            normalized_name,
            hash_password(raw_password),
            now.isoformat(),
            now.isoformat()[:10],
        )

    def login(self, email: str, password: str) -> User:
        normalized_email = (email or "").strip().lower()
        raw_password = password or ""
        user = self._users.find_by_email(normalized_email)
        if not user or not user.password_hash or not verify_password(raw_password, user.password_hash):
            raise PermissionError("Неверный email или пароль.")
        return user

    def get_user_from_cookie(self, token: str | None) -> User | None:
        if not token:
            return None
        try:
            payload = jwt.decode(token, self._jwt_secret, algorithms=["HS256"])
            user_id = int(payload["userId"])
        except (JWTError, ValueError, KeyError):
            return None
        return self._users.find_by_id(user_id)

    def make_token(self, user_id: int) -> str:
        return create_auth_token(user_id, self._jwt_secret)
