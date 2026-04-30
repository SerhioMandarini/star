import fs from "fs";
import https from "https";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { DatabaseSync } from "node:sqlite";
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import OAuth2Strategy from "passport-oauth2";
import dotenv from "dotenv";

const bcryptHash = promisify(bcrypt.hash);
const bcryptCompare = promisify(bcrypt.compare);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "roadstar_token";
const COOKIE_SECURE = APP_URL.startsWith("https://");
const DB_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DB_DIR, "roadstar.db");
const ADMIN_CONFIG_PATH = path.join(DB_DIR, "admin-config.json");
const DEFAULT_AI_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const DEFAULT_AI_PROVIDER = "groq";
const DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password_hash TEXT,
    created_at TEXT NOT NULL,
    created_date TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'local',
    provider_id TEXT,
    plus TEXT NOT NULL DEFAULT 'off',
    tokens INTEGER NOT NULL DEFAULT 0
  );
`);

const findUserByEmailStmt = db.prepare("SELECT * FROM users WHERE email = ?");
const findUserByIdStmt = db.prepare("SELECT * FROM users WHERE id = ?");
const findUserByProviderStmt = db.prepare("SELECT * FROM users WHERE provider = ? AND provider_id = ?");
const insertUserStmt = db.prepare(`
  INSERT INTO users (email, name, password_hash, created_at, created_date, provider, provider_id, plus, tokens)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const updateOAuthUserStmt = db.prepare(`
  UPDATE users
  SET name = ?, provider = ?, provider_id = ?
  WHERE id = ?
`);

const defaultAdminConfig = {
  ai: {
    provider: DEFAULT_AI_PROVIDER,
    model: DEFAULT_AI_MODEL,
    apiKey: process.env.GROQ_API_KEY || "",
    endpoint: process.env.GROQ_API_URL || DEFAULT_GROQ_URL
  }
};

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "../../frontend")));

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || "missing-google-client-id",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-google-client-secret",
  callbackURL: `${APP_URL}/api/auth/google/callback`
}, (_, __, profile, done) => done(null, normalizeOAuthProfile(profile, "google"))));

passport.use("github", new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || "missing-github-client-id",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "missing-github-client-secret",
  callbackURL: `${APP_URL}/api/auth/github/callback`
}, (_, __, profile, done) => done(null, normalizeOAuthProfile(profile, "github"))));

passport.use("yandex", new OAuth2Strategy({
  authorizationURL: "https://oauth.yandex.ru/authorize",
  tokenURL: "https://oauth.yandex.ru/token",
  clientID: process.env.YANDEX_CLIENT_ID || "missing-yandex-client-id",
  clientSecret: process.env.YANDEX_CLIENT_SECRET || "missing-yandex-client-secret",
  callbackURL: `${APP_URL}/api/auth/yandex/callback`
}, (_, __, profile, done) => done(null, profile)));

passport._strategy("yandex").userProfile = function userProfile(accessToken, done) {
  const request = https.request("https://login.yandex.ru/info?format=json", {
    method: "GET",
    headers: {
      Authorization: `OAuth ${accessToken}`
    }
  }, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });
    response.on("end", () => {
      try {
        const profile = JSON.parse(data);
        done(null, {
          id: profile.id,
          displayName: profile.real_name || profile.login || profile.default_email || "Yandex user",
          emails: profile.default_email ? [{ value: profile.default_email }] : []
        });
      } catch (error) {
        done(error);
      }
    });
  });

  request.on("error", (error) => done(error));
  request.end();
};

app.post("/api/cookies/consent", (req, res) => {
  res.json({ ok: true, consent: req.body?.consent || "required" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, consent } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedName = String(name || "").trim();
    const rawPassword = String(password || "");

    if (!consent) {
      return res.status(400).json({ error: "Нужно согласие с условиями обработки данных." });
    }
    if (!normalizedName || normalizedName.length < 2) {
      return res.status(400).json({ error: "Введите имя длиной не менее 2 символов." });
    }
    if (!normalizedEmail || !rawPassword) {
      return res.status(400).json({ error: "Введите email и пароль." });
    }
    if (rawPassword.length < 8) {
      return res.status(400).json({ error: "Пароль должен быть не короче 8 символов." });
    }
    if (findUserByEmailStmt.get(normalizedEmail)) {
      return res.status(409).json({ error: "Пользователь с таким email уже существует." });
    }

    const now = new Date();
    const password_hash = await bcryptHash(rawPassword, 12);
    const result = insertUserStmt.run(
      normalizedEmail,
      normalizedName,
      password_hash,
      now.toISOString(),
      now.toISOString().slice(0, 10),
      "local",
      null,
      "off",
      0
    );

    const user = sanitizeUser(findUserByIdStmt.get(Number(result.lastInsertRowid)));
    setAuthCookie(res, user);
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось создать аккаунт." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();
    const rawPassword = String(req.body?.password || "");
    const user = findUserByEmailStmt.get(normalizedEmail);

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    const matches = await bcryptCompare(rawPassword, user.password_hash);
    if (!matches) {
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    const safeUser = sanitizeUser(user);
    setAuthCookie(res, safeUser);
    res.json({ user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось выполнить вход." });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE
  });
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Нет активной сессии." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserByIdStmt.get(Number(payload.userId));
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден." });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(401).json({ error: "Сессия недействительна." });
  }
});

app.get("/api/auth/providers", (req, res) => {
  res.json({
    providers: {
      google: hasOAuthConfig("google"),
      github: hasOAuthConfig("github"),
      yandex: hasOAuthConfig("yandex")
    }
  });
});

app.get("/api/admin/ai-config", (req, res) => {
  const config = getAdminConfig();
  res.json({
    ai: {
      provider: config.ai.provider,
      model: config.ai.model,
      endpoint: config.ai.endpoint,
      hasKey: Boolean(config.ai.apiKey)
    }
  });
});

app.post("/api/admin/ai-config", (req, res) => {
  const current = getAdminConfig();
  const next = {
    ...current,
    ai: {
      provider: String(req.body?.provider || current.ai.provider || DEFAULT_AI_PROVIDER).trim() || DEFAULT_AI_PROVIDER,
      model: String(req.body?.model || current.ai.model || DEFAULT_AI_MODEL).trim() || DEFAULT_AI_MODEL,
      endpoint: String(req.body?.endpoint || current.ai.endpoint || DEFAULT_GROQ_URL).trim() || DEFAULT_GROQ_URL,
      apiKey: typeof req.body?.apiKey === "string" && req.body.apiKey.trim()
        ? req.body.apiKey.trim()
        : current.ai.apiKey || process.env.GROQ_API_KEY || ""
    }
  };
  saveAdminConfig(next);
  res.json({
    ok: true,
    ai: {
      provider: next.ai.provider,
      model: next.ai.model,
      endpoint: next.ai.endpoint,
      hasKey: Boolean(next.ai.apiKey)
    }
  });
});

app.get("/api/practice/plan", (req, res) => {
  const profession = String(req.query?.item || req.query?.profession || "").trim();
  res.json({
    profession,
    plan: getPracticePlan(profession)
  });
});

app.post("/api/ai/practice/task", async (req, res) => {
  try {
    const profession = String(req.body?.profession || "").trim();
    const stepId = String(req.body?.stepId || "").trim();
    const plan = getPracticePlan(profession);
    const step = plan.find((item) => item.id === stepId) || plan[0];
    const response = await requestAiText([
      {
        role: "system",
        content: "Ты создаешь короткие, понятные практические задания для образовательной платформы. Пиши по-русски. Ответ без вводных фраз."
      },
      {
        role: "user",
        content: `Профессия: ${profession || "Обучение"}.\nТема: ${step.title}.\nСложность: ${step.level}.\nПлановый фокус: ${step.goal}.\nСгенерируй 1 практическую задачу, критерии проверки и краткую подсказку.`
      }
    ], {
      fallback: `${step.title}\n\nЗадача: ${step.prompt}\n\nКритерий: ${step.success}\n\nПодсказка: ${step.hint}`
    });
    res.json({
      task: response,
      step
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось сгенерировать задачу." });
  }
});

app.post("/api/ai/practice/check", async (req, res) => {
  try {
    const profession = String(req.body?.profession || "").trim();
    const answer = String(req.body?.answer || "").trim();
    const task = String(req.body?.task || "").trim();
    const stepId = String(req.body?.stepId || "").trim();
    const successOverride = String(req.body?.success || "").trim();
    const plan = getPracticePlan(profession);
    const step = plan.find((item) => item.id === stepId) || plan[0];
    const successCriteria = successOverride || step.success;
    const fallbackPassed = answer.length >= Math.max(24, Math.floor(successCriteria.length * 0.45));
    const response = await requestAiJson([
      {
        role: "system",
        content: "Ты проверяешь ответ пользователя на практическую задачу. Верни JSON вида {\"passed\": boolean, \"feedback\": string, \"next\": string}. Пиши по-русски."
      },
      {
        role: "user",
        content: `Профессия: ${profession || "Обучение"}.\nТема: ${step.title}.\nЗадача:\n${task}\n\nКритерий успеха:\n${successCriteria}\n\nОтвет пользователя:\n${answer || "(пусто)"}`
      }
    ], {
      passed: fallbackPassed,
      feedback: fallbackPassed ? "Ответ выглядит достаточно близко к ожидаемому результату." : "Ответ пока не дотягивает до критерия. Попробуй усилить решение и уточнить ход мысли.",
      next: fallbackPassed ? "Можно переходить к следующей задаче." : "Открой подсказку и попробуй ещё раз."
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось проверить ответ." });
  }
});

app.post("/api/admin/practice/generate", async (req, res) => {
  try {
    const profession = String(req.body?.profession || "").trim();
    const skillLabel = String(req.body?.skillLabel || "").trim();
    const language = String(req.body?.language || "javascript").trim();
    const count = Math.max(1, Math.min(10, Number(req.body?.count) || 5));
    const tasks = await generateSkillTasks(profession, skillLabel, language, count);
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось сгенерировать задачи." });
  }
});

app.post("/api/ai/mentor", async (req, res) => {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.plus !== "on") {
      return res.status(403).json({ error: "ИИ-репетитор доступен только для Plus." });
    }
    const profession = String(req.body?.profession || "").trim();
    const question = String(req.body?.question || "").trim();
    const context = String(req.body?.context || "").trim();
    const answer = await requestAiText([
      {
        role: "system",
        content: "Ты ИИ-репетитор платформы Roadstar. Отвечай кратко, по-русски, в контексте обучения и практики пользователя. Если вопрос о карьере или навыках — давай практический ответ."
      },
      {
        role: "user",
        content: `Профессия: ${profession || "Обучение"}.\nКонтекст прогресса: ${context || "нет данных"}.\nВопрос пользователя: ${question}`
      }
    ], {
      fallback: "Сейчас ИИ-репетитор работает в упрощённом режиме. Попробуй уточнить тему, навык и что именно вызывает сложность."
    });
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось получить ответ ИИ-репетитора." });
  }
});

app.post("/api/ai/roadmap-help", async (req, res) => {
  try {
    const profession = String(req.body?.profession || "").trim();
    const nodeLabel = String(req.body?.nodeLabel || "").trim();
    const nodeStatus = String(req.body?.nodeStatus || "").trim();
    const currentDescription = String(req.body?.currentDescription || "").trim();

    const fallback = {
      description: `${nodeLabel}: базовый шаг для профессии ${profession}. Раскрой тему через понятную теорию, затем закрепи её на практике и переходи к следующему узлу.`,
      freeLinks: "https://developer.mozilla.org MDN\nhttps://roadmap.sh roadmap.sh",
      articleLinks: `Статья: как применять ${nodeLabel} на практике`,
      plusLinks: `Plus: разбор темы ${nodeLabel} для ${profession}`,
      practiceText: `Дай пользователю 1 базовую и 1 усложнённую задачу по теме ${nodeLabel}.`
    };

    const suggestion = await requestAiJson([
      {
        role: "system",
        content: "Ты помогаешь составлять содержимое узла дорожной карты для карьерного обучения. Возвращай только JSON с полями description, freeLinks, articleLinks, plusLinks, practiceText. freeLinks/articleLinks/plusLinks — строки, где каждый ресурс с новой строки."
      },
      {
        role: "user",
        content: `Профессия: ${profession}\nУзел: ${nodeLabel}\nСтатус: ${nodeStatus}\nТекущее описание: ${currentDescription || "нет"}\nСделай короткое, практичное и понятное наполнение для этого узла.`
      }
    ], fallback);

    res.json({ suggestion: { ...fallback, ...suggestion } });
  } catch (error) {
    res.status(500).json({ error: error.message || "Не удалось получить подсказку для дорожной карты." });
  }
});

app.get("/api/auth/google", startOAuth("google", { scope: ["profile", "email"] }));
app.get("/api/auth/github", startOAuth("github", { scope: ["user:email"] }));
app.get("/api/auth/yandex", startOAuth("yandex"));

app.get("/api/auth/google/callback", finishOAuth("google"));
app.get("/api/auth/github/callback", finishOAuth("github"));
app.get("/api/auth/yandex/callback", finishOAuth("yandex"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Roadstar listening on ${APP_URL}`);
});

function startOAuth(strategy, options = {}) {
  return (req, res, next) => {
    if (!hasOAuthConfig(strategy)) {
      return res.redirect("/index.html?auth=register");
    }
    passport.authenticate(strategy, options)(req, res, next);
  };
}

function finishOAuth(strategy) {
  return (req, res, next) => {
    if (!hasOAuthConfig(strategy)) {
      return res.redirect("/index.html?auth=register");
    }

    passport.authenticate(strategy, { session: false }, (error, profile) => {
      if (error || !profile) {
        console.error(error);
        return res.redirect("/index.html?auth=login");
      }

      try {
        const user = upsertOAuthUser(profile, strategy);
        setAuthCookie(res, user);
        res.redirect("/index.html");
      } catch (innerError) {
        console.error(innerError);
        res.redirect("/index.html?auth=login");
      }
    })(req, res, next);
  };
}

function normalizeOAuthProfile(profile, provider) {
  return {
    id: profile.id,
    displayName: profile.displayName || profile.username || "User",
    emails: profile.emails || [],
    provider
  };
}

function upsertOAuthUser(profile, provider) {
  const providerId = String(profile.id || "");
  const email = String(profile.emails?.[0]?.value || `${providerId}@${provider}.oauth.local`).toLowerCase();
  const name = String(profile.displayName || email.split("@")[0] || "User");
  const now = new Date();

  let user = findUserByProviderStmt.get(provider, providerId);
  if (user) {
    updateOAuthUserStmt.run(name, provider, providerId, user.id);
    user = findUserByIdStmt.get(user.id);
    return sanitizeUser(user);
  }

  const existingByEmail = findUserByEmailStmt.get(email);
  if (existingByEmail) {
    updateOAuthUserStmt.run(name, provider, providerId, existingByEmail.id);
    return sanitizeUser(findUserByIdStmt.get(existingByEmail.id));
  }

  const result = insertUserStmt.run(
    email,
    name,
    null,
    now.toISOString(),
    now.toISOString().slice(0, 10),
    provider,
    providerId,
    "off",
    0
  );
  return sanitizeUser(findUserByIdStmt.get(Number(result.lastInsertRowid)));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    created_date: user.created_date,
    provider: user.provider,
    provider_id: user.provider_id,
    plus: user.plus,
    tokens: user.tokens
  };
}

function setAuthCookie(res, user) {
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
}

function hasOAuthConfig(strategy) {
  const configMap = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    yandex: Boolean(process.env.YANDEX_CLIENT_ID && process.env.YANDEX_CLIENT_SECRET)
  };
  return configMap[strategy];
}

function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function getAdminConfig() {
  const saved = readJsonFile(ADMIN_CONFIG_PATH, {});
  return {
    ...defaultAdminConfig,
    ...saved,
    ai: {
      ...defaultAdminConfig.ai,
      ...(saved.ai || {})
    }
  };
}

function saveAdminConfig(config) {
  writeJsonFile(ADMIN_CONFIG_PATH, config);
}

function getPracticePlan(profession) {
  const name = String(profession || "").toLowerCase();
  if (name.includes("frontend")) {
    return [
      {
        id: "frontend-html",
        title: "HTML и семантика",
        level: "easy",
        goal: "разобрать структуру страницы и семантические теги",
        prompt: "Сверстай карточку статьи с заголовком, описанием, списком тегов и кнопкой действия. Учитывай семантические теги.",
        success: "Есть корректная структура, читаемые теги section/article/header/footer и понятная иерархия.",
        hint: "Начни с article, header, p и button."
      },
      {
        id: "frontend-js",
        title: "JavaScript логика",
        level: "medium",
        goal: "отработать функции, массивы и события",
        prompt: "Сделай фильтрацию списка карточек по введённой строке поиска.",
        success: "Список фильтруется по тексту без перезагрузки страницы, логика вынесена в функцию.",
        hint: "Используй input event и Array.filter."
      },
      {
        id: "frontend-react",
        title: "React состояние",
        level: "hard",
        goal: "научиться работать с состоянием и композицией компонентов",
        prompt: "Собери интерфейс задач с фильтрами и статусами через React-компоненты.",
        success: "Есть отдельные компоненты, состояние поднимается в родителя, UI обновляется без багов.",
        hint: "Определи структуру TaskList, FilterBar и TaskCard."
      }
    ];
  }
  if (name.includes("backend") || name.includes("devops")) {
    return [
      {
        id: "backend-api",
        title: "REST API",
        level: "easy",
        goal: "спроектировать простой endpoint и валидацию",
        prompt: "Опиши и реализуй endpoint создания задачи с валидацией входных данных.",
        success: "Есть маршрут, проверка обязательных полей и корректный ответ сервера.",
        hint: "Продумай статусы 200/400 и JSON-ответ."
      },
      {
        id: "backend-db",
        title: "Работа с данными",
        level: "medium",
        goal: "сохранить данные и вернуть нужную структуру",
        prompt: "Сделай сохранение сущности и выдачу списка с фильтрацией.",
        success: "Данные сохраняются стабильно, выдача предсказуемая, есть фильтрация.",
        hint: "Сначала опиши модель данных и контракт API."
      },
      {
        id: "backend-arch",
        title: "Архитектура сервиса",
        level: "hard",
        goal: "разбить логику на слои и подумать о масштабировании",
        prompt: "Предложи структуру backend-сервиса для команды и опиши, как вынести бизнес-логику из маршрутов.",
        success: "Есть слои controller/service/repository и понятное разделение ответственности.",
        hint: "Не смешивай в одном месте HTTP, бизнес-логику и доступ к БД."
      }
    ];
  }
  return [
    {
      id: "general-base",
      title: "Базовая задача",
      level: "easy",
      goal: "проверить понимание ключевой темы профессии",
      prompt: `Опиши, как бы ты подошёл к типовой задаче по направлению "${profession || "Профессия"}".`,
      success: "Ответ структурирован, показывает понимание цели, шагов и результата.",
      hint: "Опиши цель, этапы, риски и критерий успеха."
    },
    {
      id: "general-decision",
      title: "Рабочий кейс",
      level: "medium",
      goal: "разобрать практический сценарий",
      prompt: "Разбери рабочий кейс: что нужно сделать сначала, как проверить результат и какие риски учесть.",
      success: "Есть порядок действий, критерии проверки и здравый план решения.",
      hint: "Начни с диагностики, затем предложи пошаговый план."
    }
  ];
}

async function requestAiText(messages, { fallback = "Скоро будет" } = {}) {
  const config = getAdminConfig();
  if (!config.ai.apiKey) return fallback;
  const response = await fetch(config.ai.endpoint || DEFAULT_GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.ai.apiKey}`
    },
    body: JSON.stringify({
      model: config.ai.model || DEFAULT_AI_MODEL,
      temperature: 0.5,
      messages
    })
  });
  if (!response.ok) {
    return fallback;
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || fallback;
}

async function generateSkillTasks(profession, skillLabel, language, count = 5) {
  const levels = ["easy", "easy", "medium", "hard", "hard"].slice(0, count);
  const typeHint = ["text", ""].includes(language) ? "text" : "code";
  const langHint = !["text", ""].includes(language) ? `язык: ${language}` : "текстовый ответ (без кода)";
  const result = await requestAiText([
    {
      role: "system",
      content: "Ты создаёшь практические задания для образовательной платформы. Ответ строго в JSON-массиве, без пояснений, без markdown."
    },
    {
      role: "user",
      content: `Профессия: ${profession}. Навык: ${skillLabel}. ${langHint}.\nСгенерируй ${count} задач от лёгкого к тяжёлому.\nКаждая задача — JSON-объект с полями:\n  id (строка snake_case), title (строка), level (easy/medium/hard),\n  type ("${typeHint}"), language ("${language}"),\n  prompt (текст задания), answer (образцовый ответ / решение).\nВерни массив: [{...}, ...]`
    }
  ], { fallback: "[]" });
  let tasks = [];
  try {
    const start = result.indexOf("[");
    const end = result.lastIndexOf("]");
    const chunk = start !== -1 && end !== -1 ? result.slice(start, end + 1) : "[]";
    const parsed = JSON.parse(chunk);
    tasks = Array.isArray(parsed) ? parsed : [];
  } catch {
    tasks = [];
  }
  tasks.forEach((t, i) => {
    if (typeof t !== "object" || !t) return;
    t.id = t.id || `task-${i}`;
    t.title = t.title || `Задача ${i + 1}`;
    t.level = t.level || (levels[i] || "medium");
    t.type = t.type || typeHint;
    t.language = t.language || language;
    t.prompt = t.prompt || "";
    t.answer = t.answer || "";
  });
  return tasks;
}

async function requestAiJson(messages, fallback) {
  const text = await requestAiText(messages, {
    fallback: JSON.stringify(fallback)
  });
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
  } catch {
    return fallback;
  }
}

function getUserFromRequest(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserByIdStmt.get(Number(payload.userId));
    return user ? sanitizeUser(user) : null;
  } catch {
    return null;
  }
}
