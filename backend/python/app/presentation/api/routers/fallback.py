from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse

from backend.python.app.infrastructure.http.legacy_proxy import proxy_to_legacy


def build_fallback_router(legacy_node_url: str, frontend_dir):
    router = APIRouter(tags=["fallback"])

    @router.api_route("/api/auth/{provider}", methods=["GET"])
    @router.api_route("/api/auth/{provider}/callback", methods=["GET"])
    async def oauth_passthrough(provider: str, request: Request) -> Response:
        if provider not in {"google", "github", "yandex"}:
            raise HTTPException(status_code=404, detail="Not found")
        return await proxy_to_legacy(request, legacy_node_url)

    @router.api_route("/api/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
    async def api_fallback(full_path: str, request: Request) -> Response:
        return await proxy_to_legacy(request, legacy_node_url)

    _MIME = {".html": "text/html", ".js": "application/javascript", ".css": "text/css",
             ".json": "application/json", ".svg": "image/svg+xml", ".ico": "image/x-icon",
             ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2"}
    _NO_CACHE = {"Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache"}

    @router.get("/")
    @router.get("/{file_path:path}")
    async def frontend_fallback(file_path: str = "") -> Response:
        candidate = (frontend_dir / file_path).resolve()
        if file_path and str(candidate).startswith(str(frontend_dir)) and candidate.exists() and candidate.is_file():
            mime = _MIME.get(candidate.suffix, "application/octet-stream")
            return Response(content=candidate.read_bytes(), media_type=mime, headers=_NO_CACHE)
        index = frontend_dir / "index.html"
        if not index.exists():
            return JSONResponse({"error": "Frontend build not found."}, status_code=500)
        return Response(content=index.read_bytes(), media_type="text/html", headers=_NO_CACHE)

    return router
