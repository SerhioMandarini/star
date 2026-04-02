const fs = require("fs");
const https = require("https");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const OAuth2Strategy = require("passport-oauth2");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "roadstar_token";
const COOKIE_SECURE = APP_URL.startsWith("https://");
const DB_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DB_DIR, "roadstar.db");

fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
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
  VALUES (@email, @name, @password_hash, @created_at, @created_date, @provider, @provider_id, @plus, @tokens)
`);
const updateOAuthUserStmt = db.prepare(`
  UPDATE users
  SET name = @name, provider = @provider, provider_id = @provider_id
  WHERE id = @id
`);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(__dirname));

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
    const password_hash = await bcrypt.hash(rawPassword, 12);
    const result = insertUserStmt.run({
      email: normalizedEmail,
      name: normalizedName,
      password_hash,
      created_at: now.toISOString(),
      created_date: now.toISOString().slice(0, 10),
      provider: "local",
      provider_id: null,
      plus: "off",
      tokens: 0
    });

    const user = sanitizeUser(findUserByIdStmt.get(result.lastInsertRowid));
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

    const matches = await bcrypt.compare(rawPassword, user.password_hash);
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
    const user = findUserByIdStmt.get(payload.userId);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден." });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(401).json({ error: "Сессия недействительна." });
  }
});

app.get("/api/auth/google", startOAuth("google", { scope: ["profile", "email"] }));
app.get("/api/auth/github", startOAuth("github", { scope: ["user:email"] }));
app.get("/api/auth/yandex", startOAuth("yandex"));

app.get("/api/auth/google/callback", finishOAuth("google"));
app.get("/api/auth/github/callback", finishOAuth("github"));
app.get("/api/auth/yandex/callback", finishOAuth("yandex"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
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
    updateOAuthUserStmt.run({
      id: user.id,
      name,
      provider,
      provider_id: providerId
    });
    user = findUserByIdStmt.get(user.id);
    return sanitizeUser(user);
  }

  const existingByEmail = findUserByEmailStmt.get(email);
  if (existingByEmail) {
    updateOAuthUserStmt.run({
      id: existingByEmail.id,
      name,
      provider,
      provider_id: providerId
    });
    return sanitizeUser(findUserByIdStmt.get(existingByEmail.id));
  }

  const result = insertUserStmt.run({
    email,
    name,
    password_hash: null,
    created_at: now.toISOString(),
    created_date: now.toISOString().slice(0, 10),
    provider,
    provider_id: providerId,
    plus: "off",
    tokens: 0
  });
  return sanitizeUser(findUserByIdStmt.get(result.lastInsertRowid));
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
