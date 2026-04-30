def get_practice_language(profession: str) -> str:
    p = (profession or "").lower()
    if "python" in p or "django" in p or "flask" in p or "fastapi" in p:
        return "python"
    if "rust" in p:
        return "rust"
    if "kotlin" in p or "android" in p:
        return "kotlin"
    if "swift" in p or "ios" in p:
        return "swift"
    if "java" in p and "javascript" not in p and "typescript" not in p:
        return "java"
    if "c#" in p or "csharp" in p or ".net" in p:
        return "csharp"
    if "c++" in p or "cpp" in p:
        return "cpp"
    if "php" in p:
        return "php"
    if "ruby" in p:
        return "ruby"
    if "scala" in p:
        return "scala"
    if "typescript" in p:
        return "typescript"
    if "golang" in p or " go " in p:
        return "go"
    if "backend" in p or "бэкенд" in p:
        return "python"
    if "devops" in p:
        return "bash"
    if "data" in p or "аналит" in p or "ml" in p or "machine" in p or "scientist" in p:
        return "python"
    if "sql" in p or "dba" in p:
        return "sql"
    if "qa" in p or "тестир" in p or "manager" in p or "менеджер" in p or "designer" in p or "дизайн" in p:
        return "text"
    return "javascript"


def get_practice_plan(profession: str) -> list[dict]:
    name = (profession or "").lower()

    if "frontend" in name:
        return [
            {
                "id": "frontend-html",
                "title": "HTML и семантика",
                "level": "easy",
                "type": "code",
                "language": "html",
                "goal": "разобрать структуру страницы и семантические теги",
                "prompt": "Сверстай карточку статьи с заголовком, описанием, списком тегов и кнопкой действия. Используй семантические теги.",
                "answer": '<article class="post-card">\n  <header>\n    <h2>Заголовок статьи</h2>\n    <time datetime="2024-01-01">1 января 2024</time>\n  </header>\n  <p>Краткое описание статьи.</p>\n  <ul class="tags"><li>HTML</li><li>CSS</li></ul>\n  <a href="/post" class="btn">Читать</a>\n</article>',
                "success": "Есть корректная структура, читаемые теги section/article/header/footer и понятная иерархия.",
                "hint": "Начни с article, header, p и button.",
            },
            {
                "id": "frontend-css",
                "title": "CSS и Flexbox",
                "level": "easy",
                "type": "code",
                "language": "css",
                "goal": "разобрать Flexbox и адаптив",
                "prompt": "Напиши CSS для 3-колоночной сетки карточек. На мобилке — 1 колонка, планшет — 2, десктоп — 3.",
                "answer": ".grid { display: grid; grid-template-columns: 1fr; gap: 24px; }\n@media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }\n@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }",
                "success": "Есть grid-раскладка с адаптивом через media-запросы.",
                "hint": "Используй grid-template-columns и @media.",
            },
            {
                "id": "frontend-js",
                "title": "JavaScript логика",
                "level": "medium",
                "type": "code",
                "language": "javascript",
                "goal": "отработать функции, массивы и события",
                "prompt": "Реализуй живой поиск по массиву: при вводе в input — фильтруй список имён и рендери совпадения.",
                "answer": "const names = ['Иван', 'Мария', 'Алексей', 'Елена'];\nconst input = document.querySelector('#search');\nconst list = document.querySelector('#list');\ninput.addEventListener('input', e => {\n  const q = e.target.value.toLowerCase();\n  list.innerHTML = names\n    .filter(n => n.toLowerCase().includes(q))\n    .map(n => `<li>${n}</li>`).join('');\n});",
                "success": "Список фильтруется по тексту без перезагрузки страницы, логика вынесена в функцию.",
                "hint": "Используй input event и Array.filter.",
            },
            {
                "id": "frontend-react",
                "title": "React состояние",
                "level": "hard",
                "type": "code",
                "language": "javascript",
                "goal": "научиться работать с состоянием и композицией компонентов",
                "prompt": "Реализуй компонент TaskList с фильтрами «Все / Активные / Выполненные». Используй useState, список задач задай хардкодом.",
                "answer": "function TaskList() {\n  const [filter, setFilter] = React.useState('all');\n  const tasks = [\n    { id: 1, title: 'Верстка', done: true },\n    { id: 2, title: 'JS', done: false },\n  ];\n  const visible = filter === 'all' ? tasks\n    : filter === 'active' ? tasks.filter(t => !t.done)\n    : tasks.filter(t => t.done);\n  return (\n    <div>\n      {['all','active','done'].map(f => (\n        <button key={f} onClick={() => setFilter(f)}>{f}</button>\n      ))}\n      <ul>{visible.map(t => <li key={t.id}>{t.title}</li>)}</ul>\n    </div>\n  );\n}",
                "success": "Есть отдельные компоненты, состояние поднимается в родителя, UI обновляется без багов.",
                "hint": "Определи структуру TaskList, FilterBar и TaskCard.",
            },
        ]

    if "backend" in name:
        return [
            {
                "id": "backend-hello",
                "title": "Первый endpoint",
                "level": "easy",
                "type": "code",
                "language": "python",
                "goal": "написать минимальный FastAPI-эндпоинт",
                "prompt": 'Напиши FastAPI-эндпоинт GET /hello, возвращающий {"message": "Hello, World!"}. Добавь Pydantic-модель для ответа.',
                "answer": 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass HelloResponse(BaseModel):\n    message: str\n\n@app.get("/hello", response_model=HelloResponse)\ndef hello():\n    return HelloResponse(message="Hello, World!")',
                "success": "Есть FastAPI-приложение, эндпоинт возвращает JSON с message.",
                "hint": "Создай app = FastAPI(), затем @app.get().",
            },
            {
                "id": "backend-crud",
                "title": "CRUD-роуты",
                "level": "medium",
                "type": "code",
                "language": "python",
                "goal": "реализовать полный CRUD для ресурса",
                "prompt": "Напиши FastAPI CRUD для задач (Task): POST создать, GET список, GET по id, DELETE. Хранить в списке в памяти.",
                "answer": "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\ntasks = []\n\nclass Task(BaseModel):\n    id: int\n    title: str\n    done: bool = False\n\n@app.post('/tasks', status_code=201)\ndef create(task: Task):\n    tasks.append(task)\n    return task\n\n@app.get('/tasks')\ndef list_tasks(): return tasks\n\n@app.get('/tasks/{task_id}')\ndef get_task(task_id: int):\n    t = next((t for t in tasks if t.id == task_id), None)\n    if not t: raise HTTPException(404)\n    return t\n\n@app.delete('/tasks/{task_id}', status_code=204)\ndef delete(task_id: int):\n    global tasks\n    tasks = [t for t in tasks if t.id != task_id]",
                "success": "Есть маршрут, проверка обязательных полей и корректный ответ сервера.",
                "hint": "Используй Pydantic-модель и HTTPException(404) для отсутствующих записей.",
            },
            {
                "id": "backend-db",
                "title": "Работа с данными",
                "level": "hard",
                "type": "code",
                "language": "python",
                "goal": "подключить SQLAlchemy и написать запросы",
                "prompt": "Предложи структуру backend-сервиса на FastAPI+SQLAlchemy: модель User, сессия через зависимости, GET/POST /users.",
                "answer": "from fastapi import FastAPI, Depends\nfrom sqlalchemy import create_engine, Column, Integer, String\nfrom sqlalchemy.ext.declarative import declarative_base\nfrom sqlalchemy.orm import sessionmaker, Session\n\nDATABASE_URL = 'sqlite:///./app.db'\nengine = create_engine(DATABASE_URL)\nSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)\nBase = declarative_base()\n\nclass User(Base):\n    __tablename__ = 'users'\n    id = Column(Integer, primary_key=True)\n    name = Column(String)\n\nBase.metadata.create_all(engine)\napp = FastAPI()\n\ndef get_db():\n    db = SessionLocal()\n    try: yield db\n    finally: db.close()\n\n@app.get('/users')\ndef list_users(db: Session = Depends(get_db)):\n    return db.query(User).all()",
                "success": "Есть слои controller/service/repository и понятное разделение ответственности.",
                "hint": "Не смешивай в одном месте HTTP, бизнес-логику и доступ к БД.",
            },
        ]

    if "devops" in name:
        return [
            {
                "id": "devops-bash",
                "title": "Bash-скрипт",
                "level": "easy",
                "type": "code",
                "language": "bash",
                "goal": "написать bash-скрипт с аргументами",
                "prompt": "Напиши bash-скрипт, принимающий имя как аргумент и выводящий «Привет, [имя]! Сегодня [дата].»",
                "answer": "#!/bin/bash\nNAME=${1:-\"незнакомец\"}\nDATE=$(date +\"%d %B %Y\")\necho \"Привет, $NAME! Сегодня $DATE.\"",
                "success": "Скрипт корректно принимает аргумент и подставляет дату.",
                "hint": "Используй $1 для первого аргумента и $(date) для текущей даты.",
            },
            {
                "id": "devops-deploy",
                "title": "Деплой-скрипт",
                "level": "medium",
                "type": "code",
                "language": "bash",
                "goal": "автоматизировать деплой приложения",
                "prompt": "Напиши деплой-скрипт: git pull, npm install --production, pm2 restart app. Логировать каждый шаг, остановиться при ошибке.",
                "answer": "#!/bin/bash\nset -e\nlog() { echo \"[$(date +%H:%M:%S)] $1\"; }\nlog \"Обновляю код...\"\ngit pull origin main\nlog \"Зависимости...\"\nnpm install --production\nlog \"Перезапуск...\"\npm2 restart app\nlog \"Готово.\"",
                "success": "Скрипт логирует каждый шаг и останавливается при ошибке через set -e.",
                "hint": "Добавь set -e в начало скрипта для остановки при ошибке.",
            },
            {
                "id": "devops-docker",
                "title": "Dockerfile",
                "level": "hard",
                "type": "code",
                "language": "bash",
                "goal": "написать production-ready Dockerfile",
                "prompt": "Напиши Dockerfile для Python FastAPI-приложения: multi-stage build, non-root user, копирование только нужных файлов.",
                "answer": "FROM python:3.12-slim AS builder\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nFROM python:3.12-slim\nWORKDIR /app\nRUN adduser --disabled-password appuser\nCOPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12\nCOPY . .\nUSER appuser\nEXPOSE 8000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
                "success": "Dockerfile использует multi-stage build, non-root пользователя и копирует только нужное.",
                "hint": "Раздели на builder (зависимости) и финальный образ.",
            },
        ]

    if "qa" in name or "quality" in name:
        return [
            {
                "id": "qa-boundary",
                "title": "Граничные значения",
                "level": "easy",
                "type": "text",
                "language": "text",
                "goal": "применить метод граничных значений",
                "prompt": "Поле «Возраст» принимает значения 18–65. Перечисли минимум 6 тест-кейсов методом граничных значений. Укажи статус (valid/invalid) для каждого.",
                "answer": "17 → invalid (меньше минимума)\n18 → valid (минимум)\n19 → valid (чуть больше минимума)\n64 → valid (чуть меньше максимума)\n65 → valid (максимум)\n66 → invalid (больше максимума)\n0, -1, «abc», '' → invalid (нечисловые/пустые)",
                "success": "Перечислены значения на обеих границах: ниже, на границе, выше границы.",
                "hint": "На каждой границе нужно минимум 3 значения: до, на, после.",
            },
            {
                "id": "qa-bugreport",
                "title": "Баг-репорт",
                "level": "medium",
                "type": "text",
                "language": "text",
                "goal": "написать полный баг-репорт",
                "prompt": "Кнопка «Сохранить» в форме профиля не реагирует на клик в Firefox 120. Напиши полный баг-репорт: заголовок, шаги, ОР, ФР, окружение, приоритет, серьёзность.",
                "answer": "Заголовок: [Profile] Кнопка «Сохранить» не кликабельна в Firefox 120\nШаги: 1. Открыть Firefox 120. 2. Перейти /profile. 3. Изменить поле. 4. Кликнуть «Сохранить».\nОжидаемый результат: данные сохранены, уведомление об успехе.\nФактический результат: нет реакции, данные не сохраняются.\nОкружение: Firefox 120, Windows 11.\nПриоритет: High. Серьёзность: Critical.\nПримечание: в Chrome работает корректно.",
                "success": "Баг-репорт содержит все обязательные поля, шаги воспроизводимы, ОР и ФР чётко разграничены.",
                "hint": "Шаги должны быть точными и воспроизводимыми без дополнительных пояснений.",
            },
            {
                "id": "qa-testplan",
                "title": "Тест-план",
                "level": "hard",
                "type": "text",
                "language": "text",
                "goal": "составить тест-план для фичи",
                "prompt": "Составь тест-план для фичи «Корзина в интернет-магазине». Включи: цель, объём тестирования, подходы, среды, риски.",
                "answer": "Цель: проверить добавление, удаление, изменение количества товаров и оформление заказа.\nОбъём: корзина, пересчёт суммы, купоны, оформление заказа.\nПодходы: функциональное, граничные значения, негативные, UI.\nСреды: Chrome, Firefox, Safari, iOS, Android.\nЭтапы: smoke → regression → UAT.\nРиски: интеграция с платёжным шлюзом, промокоды, race conditions при параллельных запросах.",
                "success": "Тест-план покрывает все ключевые аспекты и включает оценку рисков.",
                "hint": "Начни с определения объёма, затем выбери стратегию и окружение.",
            },
        ]

    if "data analyst" in name or "аналитик" in name:
        return [
            {
                "id": "analyst-select",
                "title": "Фильтрация продаж",
                "level": "easy",
                "type": "code",
                "language": "sql",
                "goal": "писать SELECT с фильтрами и сортировкой",
                "prompt": "Таблица sales(id, product, amount, date, region). Выбери продажи из 'Москвы' за 2024 год с суммой > 1000, отсортируй по убыванию суммы.",
                "answer": "SELECT *\nFROM sales\nWHERE region = 'Москва'\n  AND YEAR(date) = 2024\n  AND amount > 1000\nORDER BY amount DESC;",
                "success": "Запрос корректно использует WHERE, AND, YEAR() и ORDER BY.",
                "hint": "Используй YEAR(date) для фильтрации по году.",
            },
            {
                "id": "analyst-group",
                "title": "Агрегация",
                "level": "medium",
                "type": "code",
                "language": "sql",
                "goal": "писать GROUP BY с HAVING",
                "prompt": "Та же таблица sales. Посчитай количество продаж, суммарную выручку и среднюю сумму для каждого региона. Оставь только регионы с выручкой > 50000.",
                "answer": "SELECT\n  region,\n  COUNT(*) AS deals,\n  SUM(amount) AS total,\n  AVG(amount) AS avg_deal\nFROM sales\nGROUP BY region\nHAVING SUM(amount) > 50000\nORDER BY total DESC;",
                "success": "Запрос использует GROUP BY, агрегатные функции и HAVING для фильтрации групп.",
                "hint": "HAVING применяется после GROUP BY, WHERE — до.",
            },
            {
                "id": "analyst-window",
                "title": "Оконные функции",
                "level": "hard",
                "type": "code",
                "language": "sql",
                "goal": "применить оконные функции",
                "prompt": "Таблица monthly_sales(month, region, revenue). Добавь: нарастающий итог по регионам и ранг месяца по выручке внутри региона.",
                "answer": "SELECT\n  month,\n  region,\n  revenue,\n  SUM(revenue) OVER (\n    PARTITION BY region ORDER BY month\n  ) AS running_total,\n  RANK() OVER (\n    PARTITION BY region ORDER BY revenue DESC\n  ) AS rank_in_region\nFROM monthly_sales;",
                "success": "Запрос корректно использует OVER(PARTITION BY ORDER BY) для нарастающего итога и ранга.",
                "hint": "SUM() OVER() для нарастающего итога, RANK() OVER() для ранга.",
            },
        ]

    if "data scientist" in name or "ml" in name or "machine" in name:
        return [
            {
                "id": "ds-numpy",
                "title": "NumPy основы",
                "level": "easy",
                "type": "code",
                "language": "python",
                "goal": "работать с NumPy-массивами",
                "prompt": "Создай NumPy-массив 5x5 случайных чисел [0,1]. Найди: min, max, mean, std. Выведи элементы > 0.7.",
                "answer": "import numpy as np\narr = np.random.rand(5, 5)\nprint('min:', arr.min())\nprint('max:', arr.max())\nprint('mean:', arr.mean())\nprint('std:', arr.std())\nprint('> 0.7:', arr[arr > 0.7])",
                "success": "Массив создан через np.random.rand, статистики вычислены встроенными методами.",
                "hint": "Используй arr.min(), arr.max(), arr.mean(), arr.std() и булеву маску.",
            },
            {
                "id": "ds-regression",
                "title": "Линейная регрессия",
                "level": "medium",
                "type": "code",
                "language": "python",
                "goal": "обучить и оценить LinearRegression",
                "prompt": "Обучи LinearRegression на синтетических данных (площадь → цена). Выведи коэффициенты, R² на тесте, предскажи цену для 120 м².",
                "answer": "from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import r2_score\nimport numpy as np\n\nX = np.random.uniform(50, 200, (200, 1))\ny = 1.5 * X.ravel() + 50 + np.random.normal(0, 20, 200)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y)\nmodel = LinearRegression().fit(X_tr, y_tr)\nprint('coef:', model.coef_[0])\nprint('R²:', r2_score(y_te, model.predict(X_te)))\nprint('120 м²:', model.predict([[120]])[0])",
                "success": "Модель обучена, выведены коэффициенты и R², выполнен предикт для нового значения.",
                "hint": "Используй train_test_split, затем model.fit() и model.predict().",
            },
            {
                "id": "ds-pipeline",
                "title": "ML Pipeline",
                "level": "hard",
                "type": "code",
                "language": "python",
                "goal": "создать sklearn Pipeline",
                "prompt": "Создай Pipeline: StandardScaler → PCA(3 компоненты) → RandomForest. Обучи на Iris, выведи accuracy.",
                "answer": "from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score\n\nX, y = load_iris(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y)\npipe = Pipeline([('sc', StandardScaler()), ('pca', PCA(3)), ('rf', RandomForestClassifier())])\npipe.fit(X_tr, y_tr)\nprint('Accuracy:', accuracy_score(y_te, pipe.predict(X_te)))",
                "success": "Pipeline правильно соединяет предобработку и модель, accuracy выводится.",
                "hint": "Pipeline([(name, step), ...]) — шаги выполняются последовательно.",
            },
        ]

    if "product" in name or "manager" in name or "менеджер" in name:
        return [
            {
                "id": "pm-userstory",
                "title": "User Story",
                "level": "easy",
                "type": "text",
                "language": "text",
                "goal": "написать грамотные User Story",
                "prompt": "Напиши 3 User Story для функции «Уведомления о новых сообщениях» в мессенджере. Формат: «Как [роль], я хочу [действие], чтобы [выгода].» Добавь критерии приёмки.",
                "answer": "1. Как пользователь, я хочу получать push-уведомление о новом сообщении, чтобы не пропустить ответ. КП: уведомление ≤ 5 сек после отправки, содержит имя отправителя.\n2. Как пользователь, я хочу отключать уведомления для чата, чтобы не отвлекаться. КП: настройка доступна в меню чата.\n3. Как пользователь, я хочу видеть счётчик непрочитанных, чтобы понимать срочность. КП: счётчик обновляется без перезагрузки.",
                "success": "User Story написаны по формату, критерии приёмки конкретны и проверяемы.",
                "hint": "Критерии приёмки должны быть измеримы и однозначны.",
            },
            {
                "id": "pm-metrics",
                "title": "Метрики продукта",
                "level": "medium",
                "type": "text",
                "language": "text",
                "goal": "определить KPI для фичи",
                "prompt": "Запускаешь «Персонализированные рекомендации» в e-commerce. Определи North Star Metric и 3–4 supporting-метрики. Объясни, как будешь измерять успех.",
                "answer": "North Star: Revenue per user.\nSupporting: CTR рекомендаций; конверсия из рекомендации в покупку; retention 30-дн.; avg order value.\nИзмерение: A/B тест 2 недели, 50k пользователей на группу. Успех = +5% revenue per user + конверсия > 3%.",
                "success": "North Star и supporting-метрики связаны, есть способ измерения и критерий успеха.",
                "hint": "North Star должна отражать ключевую ценность продукта.",
            },
            {
                "id": "pm-prd",
                "title": "PRD документ",
                "level": "hard",
                "type": "text",
                "language": "text",
                "goal": "написать Product Requirements Document",
                "prompt": "Напиши мини-PRD для «Реферальной программы» в SaaS. Включи: проблема, цель, аудитория, решение, метрики, out of scope.",
                "answer": "Проблема: высокий CAC, органика < 5% новых пользователей.\nЦель: довести реферальный трафик до 20% за 6 мес.\nАудитория: активные платные пользователи > 30 дн.\nРешение: реферальная ссылка в профиле; реферал — 1 мес. бесплатно, пригласивший — 20% скидка.\nМетрики: % рефералов; viral coefficient; churn рефералов.\nOut of scope: партнёрская программа, B2B.",
                "success": "PRD содержит все разделы, метрики измеримы, out of scope чётко указан.",
                "hint": "Out of scope важен не меньше, чем scope — фиксирует границы задачи.",
            },
        ]

    if "ui" in name or "ux" in name or "designer" in name or "дизайн" in name:
        return [
            {
                "id": "ux-persona",
                "title": "User Persona",
                "level": "easy",
                "type": "text",
                "language": "text",
                "goal": "создать детальный портрет пользователя",
                "prompt": "Создай User Persona для мобильного приложения доставки еды. Включи: имя, возраст, профессия, цели, боли, мотивации, технический уровень.",
                "answer": "Алина, 28 лет, маркетолог.\nЦели: быстро заказать обед в офис без лишних шагов.\nБоли: сложный поиск, непонятное время доставки, нет фильтра по диете.\nМотивации: экономия времени, разнообразие кухонь.\nТехнический уровень: активный пользователь смартфона, 5+ приложений в день.\nЦитата: «Мне нужно заказать и забыть — всё должно быть перед глазами.»",
                "success": "Персонаж реалистичен, цели/боли конкретны, уровень детализации достаточен для дизайн-решений.",
                "hint": "Цели и боли должны напрямую влиять на дизайн-решения продукта.",
            },
            {
                "id": "ux-userflow",
                "title": "User Flow",
                "level": "medium",
                "type": "text",
                "language": "text",
                "goal": "описать пользовательский сценарий шаг за шагом",
                "prompt": "Напиши User Flow для сценария «Первая покупка в интернет-магазине». Каждый шаг: действие → экран → возможные точки отказа.",
                "answer": "1. Главная → поиск. Отказ: товар не найден.\n2. Категория → фильтрация. Отказ: пустые результаты.\n3. Карточка → читает отзывы, добавляет в корзину. Отказ: нет в наличии.\n4. Корзина → проверка. Отказ: изменилась цена.\n5. Регистрация / вход. Отказ: забыл пароль.\n6. Оплата. Отказ: карта отклонена.\n7. Подтверждение. Успех: письмо о заказе.",
                "success": "User Flow покрывает все шаги от входа до успеха, точки отказа реалистичны.",
                "hint": "Всегда учитывай happy path и альтернативные пути.",
            },
            {
                "id": "ux-usability",
                "title": "Юзабилити-тест",
                "level": "hard",
                "type": "text",
                "language": "text",
                "goal": "составить план юзабилити-тестирования",
                "prompt": "Составь план юзабилити-тестирования для нового онбординга приложения. Включи: цель, методологию, сценарии, метрики, количество участников.",
                "answer": "Цель: выявить барьеры при прохождении онбординга (регистрация + первое действие).\nМетодология: модерируемые тесты 1-на-1, 5 участников (Nielsen).\nСценарии: 1. Зарегистрируйся. 2. Найди и добавь товар. 3. Оформи заказ.\nМетрики: completion rate, time-on-task, error rate, SUS-оценка.\nРекрутинг: ЦА 25–40 лет, редкие онлайн-покупки.",
                "success": "План включает все ключевые разделы, метрики измеримы, количество участников обосновано.",
                "hint": "5 участников по Nielsen достаточно для выявления 85% проблем юзабилити.",
            },
        ]

    if "fullstack" in name or "фуллстак" in name:
        return [
            {
                "id": "fs-dom",
                "title": "DOM-манипуляции",
                "level": "easy",
                "type": "code",
                "language": "javascript",
                "goal": "работать с DOM и событиями",
                "prompt": "Создай список из массива навыков через JS. Каждый <li> — с классом skill. При клике — toggle класса active.",
                "answer": "const skills = ['HTML', 'CSS', 'JavaScript', 'React'];\nconst ul = document.createElement('ul');\nskills.forEach(s => {\n  const li = document.createElement('li');\n  li.className = 'skill';\n  li.textContent = s;\n  li.addEventListener('click', () => li.classList.toggle('active'));\n  ul.appendChild(li);\n});\ndocument.body.appendChild(ul);",
                "success": "Список создан динамически, toggle работает корректно.",
                "hint": "Используй createElement, textContent и classList.toggle.",
            },
            {
                "id": "fs-fetch",
                "title": "Fetch API",
                "level": "medium",
                "type": "code",
                "language": "javascript",
                "goal": "работать с асинхронными запросами",
                "prompt": "Напиши async-функцию fetchUser(id), получающую данные с jsonplaceholder/users/{id}. Верни только {name, email, phone}. Обработай ошибки.",
                "answer": "async function fetchUser(id) {\n  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  const { name, email, phone } = await res.json();\n  return { name, email, phone };\n}\nfetchUser(1).then(console.log).catch(console.error);",
                "success": "Функция асинхронная, обрабатывает ошибки HTTP, возвращает только нужные поля.",
                "hint": "Проверяй res.ok после fetch, используй деструктуризацию для выборки полей.",
            },
            {
                "id": "fs-backend",
                "title": "Backend endpoint",
                "level": "hard",
                "type": "code",
                "language": "python",
                "goal": "написать FastAPI endpoint c валидацией",
                "prompt": "Напиши FastAPI POST /users с Pydantic-моделью (name, email, age 18+). Верни 201 при успехе, 422 при ошибке валидации.",
                "answer": "from fastapi import FastAPI\nfrom pydantic import BaseModel, EmailStr, field_validator\n\napp = FastAPI()\n\nclass UserCreate(BaseModel):\n    name: str\n    email: EmailStr\n    age: int\n\n    @field_validator('age')\n    @classmethod\n    def age_valid(cls, v):\n        if v < 18:\n            raise ValueError('Минимальный возраст — 18 лет')\n        return v\n\n@app.post('/users', status_code=201)\ndef create_user(user: UserCreate):\n    return user",
                "success": "Эндпоинт валидирует данные, возвращает 201 при успехе, Pydantic бросает 422 при ошибке.",
                "hint": "Используй field_validator для кастомной валидации полей.",
            },
        ]

    # Generic fallback
    return [
        {
            "id": "general-base",
            "title": "Базовая задача",
            "level": "easy",
            "type": "text",
            "language": "text",
            "goal": "проверить понимание ключевой темы профессии",
            "prompt": f'Опиши, как бы ты подошёл к типовой задаче по направлению "{profession or "Профессия"}". Структурируй ответ по шагам.',
            "answer": "Ответ должен включать: 1. Анализ задачи и требований. 2. Выбор подхода/инструментов. 3. Шаги реализации. 4. Критерии проверки результата.",
            "success": "Ответ структурирован, показывает понимание цели, шагов и результата.",
            "hint": "Опиши цель, этапы, риски и критерий успеха.",
        },
        {
            "id": "general-decision",
            "title": "Рабочий кейс",
            "level": "medium",
            "type": "text",
            "language": "text",
            "goal": "разобрать практический сценарий",
            "prompt": "Разбери рабочий кейс: что нужно сделать сначала, как проверить результат и какие риски учесть.",
            "answer": "Ответ должен включать: 1. Диагностику ситуации. 2. Пошаговый план действий. 3. Критерии проверки. 4. Возможные риски и способы их снижения.",
            "success": "Есть порядок действий, критерии проверки и здравый план решения.",
            "hint": "Начни с диагностики, затем предложи пошаговый план.",
        },
    ]
