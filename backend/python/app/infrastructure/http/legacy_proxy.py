from fastapi import Request, Response
import httpx


async def proxy_to_legacy(request: Request, legacy_node_url: str) -> Response:
    target_url = f"{legacy_node_url}{request.url.path}"
    if request.url.query:
        target_url = f"{target_url}?{request.url.query}"
    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)
    async with httpx.AsyncClient(follow_redirects=False, timeout=30.0) as client:
        legacy_response = await client.request(request.method, target_url, content=body, headers=headers)
    response = Response(content=legacy_response.content, status_code=legacy_response.status_code)
    hop_by_hop = {"content-length", "connection", "keep-alive", "transfer-encoding", "upgrade"}
    for key, value in legacy_response.headers.items():
        if key.lower() not in hop_by_hop:
            response.headers[key] = value
    return response
