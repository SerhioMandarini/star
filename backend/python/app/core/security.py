from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(raw_password: str) -> str:
    return pwd_context.hash(raw_password)


def verify_password(raw_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(raw_password, hashed_password)


def create_auth_token(user_id: int, jwt_secret: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    payload = {"userId": user_id, "exp": expires}
    return jwt.encode(payload, jwt_secret, algorithm="HS256")
