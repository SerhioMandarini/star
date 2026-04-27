from abc import ABC, abstractmethod

from backend.python.app.domain.entities.user import User


class UserRepository(ABC):
    @abstractmethod
    def find_by_email(self, email: str) -> User | None:
        raise NotImplementedError

    @abstractmethod
    def find_by_id(self, user_id: int) -> User | None:
        raise NotImplementedError

    @abstractmethod
    def create_local_user(self, email: str, name: str, password_hash: str, created_at: str, created_date: str) -> User:
        raise NotImplementedError
