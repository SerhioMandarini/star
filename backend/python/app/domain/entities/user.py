from dataclasses import dataclass


@dataclass(frozen=True)
class User:
    id: int
    email: str
    name: str | None
    password_hash: str | None
    created_at: str
    created_date: str
    provider: str
    provider_id: str | None
    plus: str
    tokens: int

    def to_public_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "created_at": self.created_at,
            "created_date": self.created_date,
            "provider": self.provider,
            "provider_id": self.provider_id,
            "plus": self.plus,
            "tokens": self.tokens,
        }
