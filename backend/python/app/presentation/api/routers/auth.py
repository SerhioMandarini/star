from fastapi import APIRouter, HTTPException, Request, Response

from backend.python.app.presentation.dependencies import Container
from backend.python.app.presentation.schemas.auth import LoginRequest, RegisterRequest


def build_auth_router(container: Container) -> APIRouter:
    router = APIRouter(prefix="/api/auth", tags=["auth"])

    @router.post("/register")
    async def register(payload: RegisterRequest, response: Response):
        try:
            user = container.auth_service.register(
                email=payload.email or "",
                name=payload.name or "",
                password=payload.password or "",
                consent=bool(payload.consent),
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except FileExistsError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc
        token = container.auth_service.make_token(user.id)
        response.set_cookie(
            container.settings.cookie_name,
            token,
            httponly=True,
            samesite="lax",
            secure=container.settings.cookie_secure,
            max_age=60 * 60 * 24 * 30,
        )
        return {"user": user.to_public_dict()}

    @router.post("/login")
    async def login(payload: LoginRequest, response: Response):
        try:
            user = container.auth_service.login(payload.email or "", payload.password or "")
        except PermissionError as exc:
            raise HTTPException(status_code=401, detail=str(exc)) from exc
        token = container.auth_service.make_token(user.id)
        response.set_cookie(
            container.settings.cookie_name,
            token,
            httponly=True,
            samesite="lax",
            secure=container.settings.cookie_secure,
            max_age=60 * 60 * 24 * 30,
        )
        return {"user": user.to_public_dict()}

    @router.post("/logout")
    async def logout(response: Response):
        response.delete_cookie(
            container.settings.cookie_name,
            httponly=True,
            samesite="lax",
            secure=container.settings.cookie_secure,
        )
        return {"ok": True}

    @router.get("/me")
    async def me(request: Request):
        user = container.auth_service.get_user_from_cookie(request.cookies.get(container.settings.cookie_name))
        if not user:
            raise HTTPException(status_code=401, detail="Нет активной сессии.")
        return {"user": user.to_public_dict()}

    @router.get("/providers")
    async def providers():
        import os

        return {
            "providers": {
                "google": bool(os.getenv("GOOGLE_CLIENT_ID") and os.getenv("GOOGLE_CLIENT_SECRET")),
                "github": bool(os.getenv("GITHUB_CLIENT_ID") and os.getenv("GITHUB_CLIENT_SECRET")),
                "yandex": bool(os.getenv("YANDEX_CLIENT_ID") and os.getenv("YANDEX_CLIENT_SECRET")),
            }
        }

    return router
