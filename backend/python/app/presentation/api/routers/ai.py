from fastapi import APIRouter, HTTPException, Request

from backend.python.app.application.services.practice_service import get_practice_plan
from backend.python.app.presentation.dependencies import Container
from backend.python.app.presentation.schemas.ai import MentorRequest, PracticeCheckRequest, PracticeTaskRequest, RoadmapHelpRequest


def build_ai_router(container: Container) -> APIRouter:
    router = APIRouter(prefix="/api/ai", tags=["ai"])

    @router.post("/practice/task")
    async def practice_task(payload: PracticeTaskRequest):
        return await container.ai_service.generate_practice_task(
            profession=(payload.profession or "").strip(),
            step_id=(payload.stepId or "").strip(),
        )

    @router.post("/practice/check")
    async def practice_check(payload: PracticeCheckRequest):
        profession = (payload.profession or "").strip()
        answer = (payload.answer or "").strip()
        task = (payload.task or "").strip()
        step_id = (payload.stepId or "").strip()
        plan = get_practice_plan(profession)
        step = next((item for item in plan if item["id"] == step_id), plan[0])
        fallback_passed = len(answer) >= max(24, int(len(step["success"]) * 0.45))
        return await container.ai_service.request_ai_json(
            [
                {"role": "system", "content": 'Ты проверяешь ответ пользователя на практическую задачу. Верни JSON вида {"passed": boolean, "feedback": string, "next": string}. Пиши по-русски.'},
                {"role": "user", "content": f"Профессия: {profession or 'Обучение'}.\nТема: {step['title']}.\nЗадача:\n{task}\n\nКритерий успеха:\n{step['success']}\n\nОтвет пользователя:\n{answer or '(пусто)'}"},
            ],
            fallback={
                "passed": fallback_passed,
                "feedback": "Ответ выглядит достаточно близко к ожидаемому результату." if fallback_passed else "Ответ пока не дотягивает до критерия. Попробуй усилить решение и уточнить ход мысли.",
                "next": "Можно переходить к следующей задаче." if fallback_passed else "Открой подсказку и попробуй ещё раз.",
            },
        )

    @router.post("/mentor")
    async def mentor(payload: MentorRequest, request: Request):
        user = container.auth_service.get_user_from_cookie(request.cookies.get(container.settings.cookie_name))
        if not user or user.plus != "on":
            raise HTTPException(status_code=403, detail="ИИ-репетитор доступен только для Plus.")
        answer = await container.ai_service.request_ai_text(
            [
                {"role": "system", "content": "Ты ИИ-репетитор платформы Roadstar. Отвечай кратко, по-русски, в контексте обучения и практики пользователя. Если вопрос о карьере или навыках — давай практический ответ."},
                {"role": "user", "content": f"Профессия: {(payload.profession or '').strip() or 'Обучение'}.\nКонтекст прогресса: {(payload.context or '').strip() or 'нет данных'}.\nВопрос пользователя: {(payload.question or '').strip()}"},
            ],
            fallback="Сейчас ИИ-репетитор работает в упрощённом режиме. Попробуй уточнить тему, навык и что именно вызывает сложность.",
        )
        return {"answer": answer}

    @router.post("/roadmap-help")
    async def roadmap_help(payload: RoadmapHelpRequest):
        profession = (payload.profession or "").strip()
        node_label = (payload.nodeLabel or "").strip()
        node_status = (payload.nodeStatus or "").strip()
        current_description = (payload.currentDescription or "").strip()
        fallback = {
            "description": f"{node_label}: базовый шаг для профессии {profession}. Раскрой тему через понятную теорию, затем закрепи её на практике и переходи к следующему узлу.",
            "freeLinks": "https://developer.mozilla.org MDN\nhttps://roadmap.sh roadmap.sh",
            "articleLinks": f"Статья: как применять {node_label} на практике",
            "plusLinks": f"Plus: разбор темы {node_label} для {profession}",
            "practiceText": f"Дай пользователю 1 базовую и 1 усложнённую задачу по теме {node_label}.",
        }
        suggestion = await container.ai_service.request_ai_json(
            [
                {"role": "system", "content": "Ты помогаешь составлять содержимое узла дорожной карты для карьерного обучения. Возвращай только JSON с полями description, freeLinks, articleLinks, plusLinks, practiceText. freeLinks/articleLinks/plusLinks — строки, где каждый ресурс с новой строки."},
                {"role": "user", "content": f"Профессия: {profession}\nУзел: {node_label}\nСтатус: {node_status}\nТекущее описание: {current_description or 'нет'}\nСделай короткое, практичное и понятное наполнение для этого узла."},
            ],
            fallback,
        )
        return {"suggestion": {**fallback, **suggestion}}

    return router
