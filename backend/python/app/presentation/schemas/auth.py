from pydantic import BaseModel


class RegisterRequest(BaseModel):
    email: str | None = None
    password: str | None = None
    name: str | None = None
    consent: bool | None = None


class LoginRequest(BaseModel):
    email: str | None = None
    password: str | None = None
