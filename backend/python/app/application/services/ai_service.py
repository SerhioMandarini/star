import json
from typing import Any

import httpx

from backend.python.app.application.services.admin_service import AdminService
from backend.python.app.application.services.practice_service import get_practice_plan


class AiService:
    def __init__(self, admin_service: AdminService, default_groq_url: str, default_ai_model: str):
        self._admin_service = admin_service
        self._default_groq_url = default_groq_url
        self._default_ai_model = default_ai_model

    async def request_ai_text(self, messages: list[dict[str, str]], fallback: str = "Скоро будет") -> str:
        config = self._admin_service.get_internal_config()
        api_key = config["ai"].get("apiKey") or ""
        if not api_key:
            return fallback
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                response = await client.post(
                    config["ai"].get("endpoint") or self._default_groq_url,
                    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
                    json={"model": config["ai"].get("model") or self._default_ai_model, "temperature": 0.5, "messages": messages},
                )
            if response.status_code >= 400:
                return fallback
            data = response.json()
            return ((data.get("choices") or [{}])[0].get("message") or {}).get("content", "").strip() or fallback
        except Exception:
            return fallback

    async def request_ai_json(self, messages: list[dict[str, str]], fallback: dict[str, Any]) -> dict[str, Any]:
        text = await self.request_ai_text(messages, fallback=json.dumps(fallback, ensure_ascii=False))
        try:
            start = text.find("{")
            end = text.rfind("}")
            chunk = text[start : end + 1] if start != -1 and end != -1 else text
            parsed = json.loads(chunk)
            return parsed if isinstance(parsed, dict) else fallback
        except Exception:
            return fallback

    async def generate_practice_task(self, profession: str, step_id: str) -> dict[str, Any]:
        plan = get_practice_plan(profession)
        step = next((item for item in plan if item["id"] == step_id), plan[0])
        response_text = await self.request_ai_text(
            [
                {"role": "system", "content": "Ты создаешь короткие, понятные практические задания для образовательной платформы. Пиши по-русски. Ответ без вводных фраз."},
                {"role": "user", "content": f"Профессия: {profession or 'Обучение'}.\nТема: {step['title']}.\nСложность: {step['level']}.\nПлановый фокус: {step['goal']}.\nСгенерируй 1 практическую задачу, критерии проверки и краткую подсказку."},
            ],
            fallback=f"{step['title']}\n\nЗадача: {step['prompt']}\n\nКритерий: {step['success']}\n\nПодсказка: {step['hint']}",
        )
        return {"task": response_text, "step": step}
