/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

process.loadEnvFile?.();

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeOrigin(value) {
  try {
    return new URL(String(value || "")).origin;
  } catch {
    return "";
  }
}

function isLoopbackHostname(hostname) {
  return ["localhost", "127.0.0.1", "::1", "[::1]", "0.0.0.0"].includes(
    String(hostname || "").toLowerCase(),
  );
}

function expandAllowedOrigins(rawOrigins, production = false) {
  const origins = String(rawOrigins || "http://localhost:5173")
    .split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);
  const expandedOrigins = new Set();

  origins.forEach((origin) => {
    expandedOrigins.add(origin);

    if (production) {
      return;
    }

    try {
      const parsedOrigin = new URL(origin);

      if (!isLoopbackHostname(parsedOrigin.hostname)) {
        return;
      }

      const port = parsedOrigin.port ? `:${parsedOrigin.port}` : "";
      const protocol = parsedOrigin.protocol;

      [
        `${protocol}//localhost${port}`,
        `${protocol}//127.0.0.1${port}`,
        `${protocol}//[::1]${port}`,
      ]
        .map((candidate) => normalizeOrigin(candidate))
        .filter(Boolean)
        .forEach((candidate) => expandedOrigins.add(candidate));
    } catch {
      // Ignore malformed origin entries.
    }
  });

  return [...expandedOrigins];
}

function normalizeScryptCost(value, fallback) {
  const parsed = parsePositiveInt(value, fallback);
  return parsed > 1 && (parsed & (parsed - 1)) === 0 ? parsed : fallback;
}

function loadProjectEnvFile(projectPath) {
  try {
    const rawEnv = readFileSync(resolve(projectPath, ".env"), "utf8");

    rawEnv.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        return;
      }

      const key = trimmed.slice(0, separatorIndex).trim();

      if (!key || key in process.env) {
        return;
      }

      let value = trimmed.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    });
  } catch {
    // Ignore missing local env file. Production hosts may inject env vars directly.
  }
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(__dirname, "..");
loadProjectEnvFile(projectRoot);
const databasePath = resolve(
  projectRoot,
  process.env.APP_DATABASE_PATH || "./server/data/pelatihdash.sqlite",
);
const dataDirectory = resolve(databasePath, "..");

mkdirSync(dataDirectory, { recursive: true });

const config = {
  port: Number.parseInt(process.env.API_PORT || "8787", 10),
  sessionSecret:
    process.env.APP_SESSION_SECRET || "change-this-in-production-immediately",
  passwordPepper: process.env.APP_PASSWORD_PEPPER || "",
  sessionTtlMs:
    Number.parseInt(process.env.APP_SESSION_TTL_HOURS || "12", 10) *
    60 *
    60 *
    1000,
  trustProxy: process.env.APP_TRUST_PROXY === "true",
  allowedOrigins: expandAllowedOrigins(
    process.env.APP_ALLOWED_ORIGINS || "http://localhost:5173",
    process.env.NODE_ENV === "production",
  ),
  discordWebhookUrl: process.env.DISCORD_STRATEGIC_WEBHOOK_URL || "",
  publicAppUrl: process.env.PUBLIC_APP_URL || "",
  passwordHashN: normalizeScryptCost(process.env.APP_HASH_SCRYPT_N, 16384),
  passwordHashR: parsePositiveInt(process.env.APP_HASH_SCRYPT_R, 8),
  passwordHashP: parsePositiveInt(process.env.APP_HASH_SCRYPT_P, 1),
  loginWindowMs: parsePositiveInt(process.env.APP_LOGIN_WINDOW_MINUTES, 15) * 60 * 1000,
  loginMaxAttempts: parsePositiveInt(process.env.APP_LOGIN_MAX_ATTEMPTS, 5),
  lockoutMs: parsePositiveInt(process.env.APP_LOGIN_LOCK_MINUTES, 15) * 60 * 1000,
  apiRateLimitPerMinute: parsePositiveInt(process.env.APP_API_RATE_LIMIT_PER_MINUTE, 280),
  loginRateLimitPerWindow: parsePositiveInt(
    process.env.APP_LOGIN_RATE_LIMIT_PER_WINDOW,
    12,
  ),
  production: process.env.NODE_ENV === "production",
  primaryHcoAdminUsername: normalizeUsername(
    process.env.HCO_ADMIN_USERNAME || "CosmoHCO",
  ),
};

if (
  config.production &&
  (!process.env.APP_SESSION_SECRET ||
    config.sessionSecret === "change-this-in-production-immediately")
) {
  throw new Error("APP_SESSION_SECRET wajib diisi dengan secret produksi yang kuat.");
}

if (config.production && !config.passwordPepper) {
  throw new Error("APP_PASSWORD_PEPPER wajib diisi di production.");
}

const DEFAULT_HCO_CATEGORY_IDS = ["2", "3", "4", "5", "6", "7", "8", "enemy-intel"];
const LEGACY_HCO_ENEMY_CATEGORY_IDS = new Set([
  "enemy-rocketeer",
  "enemy-sniper",
  "enemy-unit",
  "enemy-vip-target",
  "enemy-camp-ambush",
  "enemy-mortar",
  "enemy-anti-air-launcher",
  "enemy-explosive-target",
  "enemy-heli-landing",
  "enemy-minefield",
  "enemy-machine-gunner",
]);

const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scope TEXT NOT NULL,
    username TEXT NOT NULL,
    label TEXT NOT NULL,
    unit TEXT,
    password_hash TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(scope, username)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    scope TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS resources (
    name TEXT PRIMARY KEY,
    scope TEXT NOT NULL,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const RESOURCE_SCOPES = {
  "dashboard.candidates": "pelatih",
  "dashboard.schedules": "pelatih",
  "dashboard.reports": "pelatih",
  "dashboard.trainingSessions": "pelatih",
  "hco.plannerState": "hco",
  "hco.strategicSaves": "hco",
  "hco.customMaps": "hco",
  "hco.mapPlannerUsers": "hco",
};

const RESOURCE_DEFAULTS = {
  "dashboard.candidates": [],
  "dashboard.schedules": [],
  "dashboard.reports": [],
  "dashboard.trainingSessions": [],
  "hco.plannerState": {
    actions: [],
    enabledCategoryIds: DEFAULT_HCO_CATEGORY_IDS,
    viewport: null,
  },
  "hco.strategicSaves": [],
  "hco.customMaps": [],
  "hco.mapPlannerUsers": [],
};

const requestRateBuckets = new Map();
const loginAttemptBuckets = new Map();
const sseClients = new Set();
const strategicLogoBuffer = readFileSync(resolve(projectRoot, "src/assets/paskus.webp"));

const resourceSelectStatement = db.prepare(
  "SELECT name, scope, value_json AS valueJson, updated_at AS updatedAt FROM resources WHERE name = ?",
);
const resourceUpsertStatement = db.prepare(`
  INSERT INTO resources (name, scope, value_json, updated_at)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(name) DO UPDATE SET
    scope = excluded.scope,
    value_json = excluded.value_json,
    updated_at = excluded.updated_at
`);
const deleteExpiredSessionsStatement = db.prepare(
  "DELETE FROM sessions WHERE expires_at <= ?",
);
const sessionInsertStatement = db.prepare(`
  INSERT INTO sessions (session_id, user_id, scope, ip_address, user_agent, created_at, expires_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const sessionSelectStatement = db.prepare(`
  SELECT
    sessions.session_id AS sessionId,
    sessions.scope,
    sessions.expires_at AS expiresAt,
    sessions.ip_address AS ipAddress,
    sessions.user_agent AS userAgent,
    users.id AS userId,
    users.username,
    users.label,
    users.unit,
    users.active
  FROM sessions
  JOIN users ON users.id = sessions.user_id
  WHERE sessions.session_id = ?
`);
const sessionDeleteStatement = db.prepare("DELETE FROM sessions WHERE session_id = ?");
const sessionDeleteByUserStatement = db.prepare("DELETE FROM sessions WHERE user_id = ?");
const updateUserPasswordStatement = db.prepare(
  "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
);
const userByScopeAndUsernameStatement = db.prepare(`
  SELECT id, scope, username, label, unit, password_hash AS passwordHash, active
  FROM users
  WHERE scope = ? AND username = ?
`);
const usersByScopeStatement = db.prepare(`
  SELECT id, scope, username, label, unit
  FROM users
  WHERE scope = ? AND active = 1
  ORDER BY label COLLATE NOCASE ASC, username COLLATE NOCASE ASC
`);
const deleteUserByScopeAndUsernameStatement = db.prepare(`
  DELETE FROM users
  WHERE scope = ? AND username = ?
`);
const createUserStatement = db.prepare(`
  INSERT INTO users (scope, username, label, unit, password_hash, active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, 1, ?, ?)
`);
const upsertUserStatement = db.prepare(`
  INSERT INTO users (scope, username, label, unit, password_hash, active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, 1, ?, ?)
  ON CONFLICT(scope, username) DO UPDATE SET
    label = excluded.label,
    unit = excluded.unit,
    password_hash = excluded.password_hash,
    active = excluded.active,
    updated_at = excluded.updated_at
`);

function nowIso() {
  return new Date().toISOString();
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getPasswordInput(password) {
  return `${String(password || "")}${config.passwordPepper}`;
}

function getScryptOptions(N = config.passwordHashN, r = config.passwordHashR, p = config.passwordHashP) {
  return {
    N,
    r,
    p,
    maxmem: Math.max(64 * 1024 * 1024, 128 * N * r * p),
  };
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const options = getScryptOptions();
  const derivedKey = scryptSync(getPasswordInput(password), salt, 64, options).toString(
    "base64url",
  );
  return `scrypt$${options.N}$${options.r}$${options.p}$${salt}$${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  const parts = String(storedHash || "").split("$");
  const [algorithm] = parts;

  if (algorithm !== "scrypt") {
    return false;
  }

  if (parts.length === 3) {
    const [, salt, derivedKey] = parts;

    if (!salt || !derivedKey) {
      return false;
    }

    const expected = Buffer.from(derivedKey, "base64url");
    const candidate = scryptSync(String(password || ""), salt, expected.length);
    return timingSafeEqual(candidate, expected);
  }

  if (parts.length !== 6) {
    return false;
  }

  const [, rawN, rawR, rawP, salt, derivedKey] = parts;
  const N = parsePositiveInt(rawN, 0);
  const r = parsePositiveInt(rawR, 0);
  const p = parsePositiveInt(rawP, 0);

  if (!N || !r || !p || !salt || !derivedKey) {
    return false;
  }

  const expected = Buffer.from(derivedKey, "base64url");
  const candidate = scryptSync(
    getPasswordInput(password),
    salt,
    expected.length,
    getScryptOptions(N, r, p),
  );

  return timingSafeEqual(candidate, expected);
}

function isPasswordHashOutdated(storedHash) {
  const parts = String(storedHash || "").split("$");

  if (parts.length !== 6 || parts[0] !== "scrypt") {
    return true;
  }

  return (
    parsePositiveInt(parts[1], 0) !== config.passwordHashN ||
    parsePositiveInt(parts[2], 0) !== config.passwordHashR ||
    parsePositiveInt(parts[3], 0) !== config.passwordHashP
  );
}

function maybeUpgradePasswordHash(user, password) {
  if (!user?.id || !isPasswordHashOutdated(user.passwordHash)) {
    return;
  }

  updateUserPasswordStatement.run(hashPassword(password), nowIso(), user.id);
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

const DUMMY_PASSWORD_HASH = hashPassword("pelatihdash-dummy-password");

function seedAdminUser(scope, envPrefix, fallbackLabel, fallbackUnit = null) {
  const username = normalizeUsername(process.env[`${envPrefix}_USERNAME`]);
  const password = process.env[`${envPrefix}_PASSWORD`];

  if (!username || !password) {
    return;
  }

  const timestamp = nowIso();
  upsertUserStatement.run(
    scope,
    username,
    process.env[`${envPrefix}_LABEL`] || fallbackLabel,
    process.env[`${envPrefix}_UNIT`] || fallbackUnit,
    hashPassword(password),
    timestamp,
    timestamp,
  );
}

function ensureResourceDefaults() {
  const timestamp = nowIso();

  Object.entries(RESOURCE_DEFAULTS).forEach(([resourceName, defaultValue]) => {
    const existing = resourceSelectStatement.get(resourceName);

    if (!existing) {
      resourceUpsertStatement.run(
        resourceName,
        RESOURCE_SCOPES[resourceName],
        JSON.stringify(defaultValue),
        timestamp,
      );
    }
  });
}

seedAdminUser("pelatih", "PELATIH_ADMIN", "Paskus Admin");
seedAdminUser("hco", "HCO_ADMIN", "Strategic Admin", "HCO Strategic Command");
ensureResourceDefaults();

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (config.trustProxy && typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.socket.remoteAddress || "unknown";
}

function appendSecurityHeaders(response) {
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader("Cross-Origin-Resource-Policy", "same-site");
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Origin-Agent-Cluster", "?1");
  response.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  response.setHeader("X-Download-Options", "noopen");
  response.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self';",
  );

  if (config.production) {
    response.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
}

function maybeApplyCors(request, response) {
  const origin = normalizeOrigin(request.headers.origin);

  if (!origin || !config.allowedOrigins.includes(origin)) {
    return;
  }

  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
}

function sendJson(response, statusCode, payload) {
  appendSecurityHeaders(response);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendEmpty(response, statusCode = 204, extraHeaders = {}) {
  appendSecurityHeaders(response);
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  response.end();
}

function sendError(response, statusCode, message, extra = {}) {
  sendJson(response, statusCode, {
    ok: false,
    error: message,
    ...extra,
  });
}

function sendSecurityBlock(response, statusCode, message, securityEvent = {}, extra = {}) {
  sendJson(response, statusCode, {
    ok: false,
    error: message,
    securityEvent: {
      action: "blocked",
      imageKey: "security-block",
      title: "Percobaan Serangan Terdeteksi",
      classification: "Aktivitas ini diklasifikasikan sebagai penyerangan website.",
      detail:
        "Permintaan diblokir oleh lapisan keamanan karena menyerupai flood, brute force, atau probing pentest.",
      ...securityEvent,
    },
    ...extra,
  });
}

async function parseJsonBody(request, maxBytes = 10 * 1024 * 1024) {
  let totalBytes = 0;
  let rawBody = "";

  for await (const chunk of request) {
    totalBytes += chunk.length;

    if (totalBytes > maxBytes) {
      const error = new Error("Payload too large");
      error.statusCode = 413;
      throw error;
    }

    rawBody += chunk.toString("utf8");
  }

  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    const error = new Error("Invalid JSON payload");
    error.statusCode = 400;
    throw error;
  }
}

function hasJsonContentType(request) {
  const contentType = String(request.headers["content-type"] || "");
  return contentType.toLowerCase().startsWith("application/json");
}

function ensureJsonRequest(request) {
  if (!hasJsonContentType(request)) {
    throw createHttpError(415, "Request harus menggunakan Content-Type application/json.");
  }
}

function parseCookies(request) {
  const rawCookieHeader = request.headers.cookie;

  if (!rawCookieHeader) {
    return {};
  }

  return rawCookieHeader.split(";").reduce((cookies, cookieEntry) => {
    const separatorIndex = cookieEntry.indexOf("=");

    if (separatorIndex === -1) {
      return cookies;
    }

    const key = cookieEntry.slice(0, separatorIndex).trim();
    const value = cookieEntry.slice(separatorIndex + 1).trim();
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function signSessionId(sessionId) {
  return createHmac("sha256", config.sessionSecret)
    .update(sessionId)
    .digest("base64url");
}

function encodeSignedSessionId(sessionId) {
  return `${sessionId}.${signSessionId(sessionId)}`;
}

function decodeSignedSessionId(rawValue) {
  const [sessionId, signature] = String(rawValue || "").split(".");

  if (!sessionId || !signature) {
    return null;
  }

  const expectedSignature = signSessionId(sessionId);

  if (
    expectedSignature.length !== signature.length ||
    !timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(signature, "utf8"),
    )
  ) {
    return null;
  }

  return sessionId;
}

function serializeSessionCookie(sessionId, maxAgeSeconds = config.sessionTtlMs / 1000) {
  const parts = [
    `pelatihdash_session=${encodeURIComponent(
      sessionId ? encodeSignedSessionId(sessionId) : "",
    )}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
  ];

  if (config.production) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function clearSessionCookie() {
  return serializeSessionCookie("", 0);
}

function cleanupExpiredSessions() {
  deleteExpiredSessionsStatement.run(nowIso());
}

function createSession(user, request) {
  cleanupExpiredSessions();
  const sessionId = randomBytes(32).toString("base64url");
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + config.sessionTtlMs).toISOString();

  sessionInsertStatement.run(
    sessionId,
    user.id,
    user.scope,
    getClientIp(request),
    request.headers["user-agent"] || "",
    createdAt,
    expiresAt,
  );

  return {
    sessionId,
    expiresAt,
  };
}

function destroySession(sessionId) {
  if (!sessionId) {
    return;
  }

  sessionDeleteStatement.run(sessionId);
}

function getAuthenticatedSession(request) {
  cleanupExpiredSessions();
  const cookies = parseCookies(request);
  const sessionId = decodeSignedSessionId(cookies.pelatihdash_session);

  if (!sessionId) {
    return null;
  }

  const session = sessionSelectStatement.get(sessionId);

  if (!session || !session.active) {
    destroySession(sessionId);
    return null;
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    destroySession(sessionId);
    return null;
  }

  const currentUserAgent = String(request.headers["user-agent"] || "");

  if (session.userAgent && currentUserAgent && session.userAgent !== currentUserAgent) {
    destroySession(sessionId);
    return null;
  }

  return {
    sessionId,
    user: {
      id: session.userId,
      scope: session.scope,
      username: session.username,
      label: session.label,
      unit: session.unit,
    },
  };
}

function getRequestBucketKey(request, scope = "general") {
  return `${scope}:${getClientIp(request)}`;
}

function pruneRequestBucket(entries, windowMs) {
  const threshold = Date.now() - windowMs;
  return entries.filter((entry) => entry > threshold);
}

function applyRequestRateLimit(request, response) {
  const path = new URL(request.url, "http://localhost").pathname;
  const rule =
    path === "/api/auth/login"
      ? {
          scope: "login",
          limit: config.loginRateLimitPerWindow,
          windowMs: config.loginWindowMs,
        }
      : path.startsWith("/api/")
        ? { scope: "api", limit: config.apiRateLimitPerMinute, windowMs: 60 * 1000 }
        : null;

  if (!rule) {
    return false;
  }

  const bucketKey = getRequestBucketKey(request, rule.scope);
  const currentEntries = pruneRequestBucket(
    requestRateBuckets.get(bucketKey) || [],
    rule.windowMs,
  );

  currentEntries.push(Date.now());
  requestRateBuckets.set(bucketKey, currentEntries);

  if (currentEntries.length <= rule.limit) {
    return false;
  }

  sendSecurityBlock(
    response,
    429,
    "Traffic diblokir karena melebihi ambang keamanan.",
    rule.scope === "login"
      ? {
          type: "brute-force",
          title: "Brute Force Diblokir",
          classification:
            "Lonjakan percobaan login terdeteksi dan digolongkan sebagai serangan akun.",
          detail:
            "Portal menahan akses sementara karena pola request menyerupai brute force terhadap autentikasi.",
        }
      : {
          type: "request-flood",
          title: "Flood Request Diblokir",
          classification:
            "Lonjakan request digolongkan sebagai percobaan flood atau DDoS ringan.",
          detail:
            "Sistem rate limit aktif untuk menahan lalu lintas yang melampaui batas aman aplikasi.",
        },
    { retryAfterSeconds: Math.ceil(rule.windowMs / 1000) },
  );
  return true;
}

function getLoginAttemptState(username, request) {
  const bucketKey = `${getClientIp(request)}:${normalizeUsername(username)}`;
  const currentState = loginAttemptBuckets.get(bucketKey);

  if (!currentState) {
    return { bucketKey, count: 0, lockUntil: 0 };
  }

  if (currentState.lockUntil && currentState.lockUntil > Date.now()) {
    return { bucketKey, ...currentState };
  }

  if (currentState.lastAttemptAt < Date.now() - config.loginWindowMs) {
    loginAttemptBuckets.delete(bucketKey);
    return { bucketKey, count: 0, lockUntil: 0 };
  }

  return { bucketKey, ...currentState };
}

function registerFailedLogin(username, request) {
  const { bucketKey, count } = getLoginAttemptState(username, request);
  const nextCount = count + 1;
  const nextState = {
    count: nextCount,
    lastAttemptAt: Date.now(),
    lockUntil: nextCount >= config.loginMaxAttempts ? Date.now() + config.lockoutMs : 0,
  };

  loginAttemptBuckets.set(bucketKey, nextState);
  return nextState;
}

function clearFailedLogins(username, request) {
  const bucketKey = `${getClientIp(request)}:${normalizeUsername(username)}`;
  loginAttemptBuckets.delete(bucketKey);
}

function ensureTrustedOrigin(request, response) {
  const origin = normalizeOrigin(request.headers.origin);

  if (origin) {
    if (!config.allowedOrigins.includes(origin)) {
      sendSecurityBlock(response, 403, "Origin request tidak diizinkan.", {
        type: "cross-origin-probe",
        title: "Cross-Origin Probe Diblokir",
        classification:
          "Permintaan lintas-origin yang menyerupai probing atau pentest diblokir.",
        detail:
          "Origin request tidak masuk daftar tepercaya, sehingga akses dihentikan sebelum menyentuh data aplikasi.",
      });
      return false;
    }

    return true;
  }

  const referer = String(request.headers.referer || "");

  if (referer) {
    const refererOrigin = normalizeOrigin(referer);

    if (!refererOrigin || !config.allowedOrigins.includes(refererOrigin)) {
      sendSecurityBlock(response, 403, "Referer request tidak diizinkan.", {
        type: "cross-origin-probe",
        title: "Referer Probe Diblokir",
        classification:
          "Referer request yang tidak tepercaya terdeteksi sebagai probing akses.",
        detail:
          "Sistem menolak request tulis yang datang dari referer yang tidak sesuai daftar origin resmi.",
      });
      return false;
    }
  }

  return true;
}

function validateLoginPayload(body) {
  const scope = body?.scope === "hco" ? "hco" : body?.scope === "pelatih" ? "pelatih" : null;
  const username = normalizeUsername(body?.username);
  const password = String(body?.password || "");

  if (!scope) {
    throw createHttpError(400, "Scope login tidak valid.");
  }

  if (
    !username ||
    username.length < 3 ||
    username.length > 64 ||
    !/^[a-z0-9._@-]+$/i.test(username)
  ) {
    throw createHttpError(400, "Format username tidak valid.");
  }

  if (password.length < 8 || password.length > 256) {
    throw createHttpError(400, "Format password tidak valid.");
  }

  return { scope, username, password };
}

function validateOperatorPayload(body) {
  const username = normalizeUsername(body?.username);
  const label = String(body?.label || "")
    .trim()
    .replace(/\s+/g, " ");
  const unit = String(body?.unit || "PASKUS 791")
    .trim()
    .replace(/\s+/g, " ");
  const password = String(body?.password || "");

  if (
    !username ||
    username.length < 3 ||
    username.length > 64 ||
    !/^[a-z0-9._@-]+$/i.test(username)
  ) {
    throw createHttpError(400, "Username petugas tidak valid.");
  }

  if (!label || label.length < 3 || label.length > 80) {
    throw createHttpError(400, "Nama petugas wajib diisi dengan benar.");
  }

  if (!unit || unit.length < 3 || unit.length > 80) {
    throw createHttpError(400, "Unit petugas wajib diisi.");
  }

  if (password.length < 8 || password.length > 256) {
    throw createHttpError(400, "Password petugas minimal 8 karakter.");
  }

  return {
    username,
    label,
    unit,
    password,
  };
}

function validateHcoUserPayload(body) {
  const username = normalizeUsername(body?.username);
  const label = String(body?.label || "")
    .trim()
    .replace(/\s+/g, " ");
  const unit = String(body?.unit || "HCO Strategic Command")
    .trim()
    .replace(/\s+/g, " ");
  const password = String(body?.password || "");

  if (
    !username ||
    username.length < 3 ||
    username.length > 64 ||
    !/^[a-z0-9._@-]+$/i.test(username)
  ) {
    throw createHttpError(400, "Username user map planner tidak valid.");
  }

  if (!label || label.length < 3 || label.length > 80) {
    throw createHttpError(400, "Nama user map planner wajib diisi dengan benar.");
  }

  if (!unit || unit.length < 3 || unit.length > 80) {
    throw createHttpError(400, "Unit user map planner wajib diisi.");
  }

  if (password.length < 8 || password.length > 256) {
    throw createHttpError(400, "Password user map planner minimal 8 karakter.");
  }

  return {
    username,
    label,
    unit,
    password,
  };
}

function normalizeHcoAccessRecord(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const username = normalizeUsername(entry.username);

  if (!username) {
    return null;
  }

  return {
    username,
    access: {
      mainPlanner: entry.access?.mainPlanner !== false,
      customMaps: entry.access?.customMaps !== false,
      saves: entry.access?.saves !== false,
    },
    updatedAt:
      typeof entry.updatedAt === "string" && entry.updatedAt
        ? entry.updatedAt
        : nowIso(),
  };
}

function detectThreatSignature(values) {
  const combined = values
    .map((value) => String(value || ""))
    .join(" ")
    .toLowerCase();

  const signatures = [
    {
      pattern:
        /(\bunion\b|\bselect\b|\bdrop\b|\binsert\b|\bdelete\b|\bupdate\b|\bbenchmark\s*\(|\bsleep\s*\(|\bor\b\s+['"]?\d+\s*=\s*\d+|--|\/\*|\*\/)/i,
      type: "pentest-probe",
      title: "Probe Pentest Diblokir",
      classification: "Payload menyerupai uji penetrasi atau SQL injection terdeteksi.",
      detail:
        "Input yang dikirim mengandung pola eksploitasi yang umum dipakai untuk probing sistem login.",
    },
    {
      pattern: /(<script|javascript:|onerror=|onload=|<img|<svg|%3cscript)/i,
      type: "script-injection",
      title: "Injeksi Skrip Diblokir",
      classification: "Payload menyerupai injeksi skrip atau XSS terdeteksi.",
      detail:
        "Sistem memblokir konten yang mengarah ke injeksi skrip berbahaya pada antarmuka login.",
    },
    {
      pattern: /(\.\.\/|\.\.\\|\/etc\/passwd|cmd\.exe|powershell|wget\s|curl\s)/i,
      type: "recon-probe",
      title: "Recon Probe Diblokir",
      classification: "Payload menyerupai probing direktori atau command injection terdeteksi.",
      detail:
        "Sistem menahan input yang mengarah ke pengintaian file sensitif atau eksekusi command.",
    },
  ];

  const matchedSignature = signatures.find((signature) => signature.pattern.test(combined));

  if (!matchedSignature) {
    return null;
  }

  const securityEvent = { ...matchedSignature };
  delete securityEvent.pattern;
  return securityEvent;
}

function sanitizeResourceValue(resourceName, value) {
  if (!(resourceName in RESOURCE_DEFAULTS)) {
    return null;
  }

  if (resourceName === "hco.plannerState") {
    const source = value && typeof value === "object" ? value : {};
    const enabledCategoryIds = Array.isArray(source.enabledCategoryIds)
      ? [...new Set(source.enabledCategoryIds)]
          .map((id) =>
            LEGACY_HCO_ENEMY_CATEGORY_IDS.has(id) ? "enemy-intel" : id,
          )
          .filter((id) =>
            RESOURCE_DEFAULTS["hco.plannerState"].enabledCategoryIds.includes(id),
          )
      : RESOURCE_DEFAULTS["hco.plannerState"].enabledCategoryIds;

    const viewport =
      source.viewport &&
      typeof source.viewport === "object" &&
      Number.isFinite(source.viewport.scale) &&
      Number.isFinite(source.viewport.offsetX) &&
      Number.isFinite(source.viewport.offsetY)
        ? {
            scale: Number(source.viewport.scale),
            offsetX: Number(source.viewport.offsetX),
            offsetY: Number(source.viewport.offsetY),
          }
        : null;

    return {
      actions: Array.isArray(source.actions) ? source.actions : [],
      enabledCategoryIds,
      viewport,
    };
  }

  if (resourceName === "hco.mapPlannerUsers") {
    return Array.isArray(value)
      ? value
          .map((entry) => normalizeHcoAccessRecord(entry))
          .filter(Boolean)
      : [];
  }

  return Array.isArray(value) ? value : RESOURCE_DEFAULTS[resourceName];
}

function readResource(resourceName) {
  const existing = resourceSelectStatement.get(resourceName);

  if (!existing) {
    return {
      name: resourceName,
      scope: RESOURCE_SCOPES[resourceName],
      updatedAt: nowIso(),
      value: RESOURCE_DEFAULTS[resourceName],
    };
  }

  try {
    return {
      name: existing.name,
      scope: existing.scope,
      updatedAt: existing.updatedAt,
      value:
        sanitizeResourceValue(existing.name, JSON.parse(existing.valueJson)) ??
        RESOURCE_DEFAULTS[existing.name],
    };
  } catch {
    return {
      name: existing.name,
      scope: existing.scope,
      updatedAt: existing.updatedAt,
      value: RESOURCE_DEFAULTS[existing.name],
    };
  }
}

function writeResource(resourceName, value) {
  const sanitizedValue = sanitizeResourceValue(resourceName, value);
  const updatedAt = nowIso();

  resourceUpsertStatement.run(
    resourceName,
    RESOURCE_SCOPES[resourceName],
    JSON.stringify(sanitizedValue),
    updatedAt,
  );

  broadcastResourceChange(resourceName);

  return {
    updatedAt,
    value: sanitizedValue,
  };
}

function broadcastResourceChange(resourceName) {
  const scope = RESOURCE_SCOPES[resourceName];
  const payload = `data: ${JSON.stringify({
    type: "resource-updated",
    resource: resourceName,
    scope,
    timestamp: nowIso(),
  })}\n\n`;

  for (const client of sseClients) {
    if (client.scope !== scope) {
      continue;
    }

    try {
      client.response.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function isPrimaryHcoAdmin(session) {
  return (
    session?.user?.scope === "hco" &&
    normalizeUsername(session?.user?.username) === config.primaryHcoAdminUsername
  );
}

function getHcoAccessStateForUser(username) {
  const normalizedUsername = normalizeUsername(username);

  if (!normalizedUsername) {
    return {
      mainPlanner: false,
      customMaps: false,
      saves: false,
    };
  }

  if (normalizedUsername === config.primaryHcoAdminUsername) {
    return {
      mainPlanner: true,
      customMaps: true,
      saves: true,
    };
  }

  const resource = readResource("hco.mapPlannerUsers");
  const accessEntry = resource.value.find(
    (entry) => normalizeUsername(entry.username) === normalizedUsername,
  );

  if (!accessEntry) {
    return {
      mainPlanner: true,
      customMaps: true,
      saves: true,
    };
  }

  return {
    mainPlanner: accessEntry.access?.mainPlanner !== false,
    customMaps: accessEntry.access?.customMaps !== false,
    saves: accessEntry.access?.saves !== false,
  };
}

function isAuthorizedForResource(session, resourceName, method = "GET") {
  if (session?.user?.scope !== RESOURCE_SCOPES[resourceName]) {
    return false;
  }

  if (resourceName === "hco.mapPlannerUsers") {
    return method === "GET" ? session?.user?.scope === "hco" : isPrimaryHcoAdmin(session);
  }

  if (session.user.scope !== "hco") {
    return true;
  }

  const accessState = getHcoAccessStateForUser(session.user.username);

  if (resourceName === "hco.plannerState") {
    return accessState.mainPlanner;
  }

  if (resourceName === "hco.customMaps") {
    if (method !== "GET" && !accessState.customMaps) {
      return false;
    }

    return accessState.customMaps;
  }

  if (resourceName === "hco.strategicSaves") {
    return accessState.saves;
  }

  return true;
}

function notAuthorized(response) {
  sendError(response, 401, "Unauthorized");
}

function dataUrlToBlob(dataUrl) {
  const match = /^data:(.+?);base64,(.+)$/.exec(String(dataUrl || ""));

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    blob: new Blob([Buffer.from(match[2], "base64")], { type: match[1] }),
  };
}

async function dispatchStrategicSaveToDiscord(save) {
  if (!config.discordWebhookUrl) {
    throw new Error("Discord webhook belum dikonfigurasi di server.");
  }

  const waitUrl = config.discordWebhookUrl.includes("?")
    ? `${config.discordWebhookUrl}&wait=true`
    : `${config.discordWebhookUrl}?wait=true`;
  const thumbnailPayload = dataUrlToBlob(save.thumbnailDataUrl);
  const snapshotFileName =
    `${String(save.title || "strategic-save").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "strategic-save"}.png`;
  const formData = new FormData();
  const embed = {
    title: save.title || "Strategic Save",
    description: save.note || "Snapshot strategi dikirim dari HCO Center.",
    color: 12646984,
    author: {
      name: "Strategic Admin",
      icon_url: "attachment://strategic-admin.webp",
    },
    footer: {
      text: "Strategic Channel • Ronograd Planning Dispatch",
    },
    timestamp: save.updatedAt || save.createdAt || nowIso(),
    fields: [
      {
        name: "Actions",
        value: String(save.actionCount || 0),
        inline: true,
      },
      {
        name: "Categories",
        value: String(save.categoryCount || 0),
        inline: true,
      },
      {
        name: "Zoom",
        value: `${Math.round((save.snapshot?.viewport?.scale || 0) * 100)}%`,
        inline: true,
      },
    ],
    thumbnail: {
      url: "attachment://strategic-admin.webp",
    },
  };

  if (thumbnailPayload) {
    embed.image = {
      url: `attachment://${snapshotFileName}`,
    };
  }

  formData.append(
    "payload_json",
    JSON.stringify({
      username: "Strategic Admin",
      embeds: [embed],
      content: `Strategic dispatch untuk ${save.title || "snapshot taktis"}.`,
      allowed_mentions: { parse: [] },
    }),
  );

  if (thumbnailPayload) {
    formData.append("files[0]", thumbnailPayload.blob, snapshotFileName);
    formData.append(
      "files[1]",
      new Blob([strategicLogoBuffer], { type: "image/webp" }),
      "strategic-admin.webp",
    );
  } else {
    formData.append(
      "files[0]",
      new Blob([strategicLogoBuffer], { type: "image/webp" }),
      "strategic-admin.webp",
    );
  }

  const response = await fetch(waitUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Discord webhook rejected request (${response.status})`);
  }

  return response.json().catch(() => null);
}

async function handleRequest(request, response) {
  maybeApplyCors(request, response);

  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  if (applyRequestRateLimit(request, response)) {
    return;
  }

  const requestUrl = new URL(request.url, "http://localhost");
  const path = requestUrl.pathname;
  const session = getAuthenticatedSession(request);

  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    if (!ensureTrustedOrigin(request, response)) {
      return;
    }
  }

  if (path === "/api/health" && request.method === "GET") {
    sendJson(response, 200, { ok: true, status: "online" });
    return;
  }

  if (path === "/api/auth/session" && request.method === "GET") {
    sendJson(response, 200, {
      ok: true,
      authenticated: Boolean(session),
      user: session?.user ?? null,
    });
    return;
  }

  if (path === "/api/auth/login" && request.method === "POST") {
    try {
      ensureJsonRequest(request);
      const body = await parseJsonBody(request);
      const detectedThreat = detectThreatSignature([body?.username, body?.password]);

      if (detectedThreat) {
        sendSecurityBlock(
          response,
          403,
          "Payload login diblokir oleh sistem keamanan.",
          detectedThreat,
        );
        return;
      }

      const { scope, username, password } = validateLoginPayload(body);
      const attemptState = getLoginAttemptState(username, request);

      if (attemptState.lockUntil && attemptState.lockUntil > Date.now()) {
        sendSecurityBlock(
          response,
          429,
          "Terlalu banyak percobaan login. Coba lagi nanti.",
          {
            type: "brute-force",
            title: "Brute Force Diblokir",
            classification:
              "Percobaan autentikasi berulang digolongkan sebagai serangan akun.",
            detail:
              "Akses ke login dibekukan sementara karena pola percobaan masuk melampaui ambang aman sistem.",
          },
          {
            retryAfterSeconds: Math.ceil((attemptState.lockUntil - Date.now()) / 1000),
          },
        );
        return;
      }

      const user = userByScopeAndUsernameStatement.get(scope, username);
      const candidateHash = user?.passwordHash || DUMMY_PASSWORD_HASH;
      const isPasswordValid = verifyPassword(password, candidateHash);

      if (!user || !user.active || !isPasswordValid) {
        const failedState = registerFailedLogin(username, request);
        sendError(response, 401, "Kredensial tidak valid.", {
          remainingAttempts: Math.max(0, config.loginMaxAttempts - failedState.count),
        });
        return;
      }

      maybeUpgradePasswordHash(user, password);
      clearFailedLogins(username, request);
      sessionDeleteByUserStatement.run(user.id);
      const nextSession = createSession({ ...user, scope }, request);

      appendSecurityHeaders(response);
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Set-Cookie": serializeSessionCookie(nextSession.sessionId),
      });
      response.end(
        JSON.stringify({
          ok: true,
          user: {
            id: user.id,
            scope,
            username: user.username,
            label: user.label,
            unit: user.unit,
          },
        }),
      );
      return;
    } catch (error) {
      sendError(response, error.statusCode || 500, error.message || "Login failed.");
      return;
    }
  }

  if (path === "/api/auth/logout" && request.method === "POST") {
    destroySession(session?.sessionId);
    sendEmpty(response, 204, {
      "Set-Cookie": clearSessionCookie(),
    });
    return;
  }

  if (path === "/api/pelatih/operators" && request.method === "GET") {
    if (!session || session.user.scope !== "pelatih") {
      notAuthorized(response);
      return;
    }

    const operators = usersByScopeStatement
      .all("pelatih")
      .map((user) => ({
        id: user.id,
        username: user.username,
        label: user.label,
        unit: user.unit,
      }));

    sendJson(response, 200, {
      ok: true,
      operators,
    });
    return;
  }

  if (path === "/api/pelatih/operators" && request.method === "POST") {
    if (!session || session.user.scope !== "pelatih") {
      notAuthorized(response);
      return;
    }

    try {
      ensureJsonRequest(request);
      const body = await parseJsonBody(request);
      const detectedThreat = detectThreatSignature([
        body?.username,
        body?.label,
        body?.unit,
        body?.password,
      ]);

      if (detectedThreat) {
        sendSecurityBlock(
          response,
          403,
          "Payload petugas diblokir oleh sistem keamanan.",
          detectedThreat,
        );
        return;
      }

      const operator = validateOperatorPayload(body);
      const existingUser = userByScopeAndUsernameStatement.get("pelatih", operator.username);

      if (existingUser) {
        sendError(response, 409, "Username petugas sudah digunakan.");
        return;
      }

      const timestamp = nowIso();
      createUserStatement.run(
        "pelatih",
        operator.username,
        operator.label,
        operator.unit,
        hashPassword(operator.password),
        timestamp,
        timestamp,
      );

      const operators = usersByScopeStatement.all("pelatih").map((user) => ({
        id: user.id,
        username: user.username,
        label: user.label,
        unit: user.unit,
      }));

      sendJson(response, 201, {
        ok: true,
        message: "Petugas baru berhasil ditambahkan.",
        operators,
      });
      return;
    } catch (error) {
      sendError(
        response,
        error.statusCode || 500,
        error.message || "Gagal menambahkan petugas.",
      );
      return;
    }
  }

  if (path === "/api/hco/users" && request.method === "GET") {
    if (!session || session.user.scope !== "hco" || !isPrimaryHcoAdmin(session)) {
      notAuthorized(response);
      return;
    }

    const accessEntries = readResource("hco.mapPlannerUsers").value;
    const accessByUsername = new Map(
      accessEntries.map((entry) => [normalizeUsername(entry.username), entry]),
    );
    const users = usersByScopeStatement.all("hco").map((user) => {
      const accessEntry = accessByUsername.get(normalizeUsername(user.username));

      return {
        id: user.id,
        username: user.username,
        label: user.label,
        unit: user.unit,
        access: accessEntry?.access ?? {
          mainPlanner: true,
          customMaps: true,
          saves: true,
        },
        isPrimaryAdmin:
          normalizeUsername(user.username) === config.primaryHcoAdminUsername,
      };
    });

    sendJson(response, 200, {
      ok: true,
      users,
    });
    return;
  }

  if (path === "/api/hco/users" && request.method === "POST") {
    if (!session || session.user.scope !== "hco" || !isPrimaryHcoAdmin(session)) {
      notAuthorized(response);
      return;
    }

    try {
      ensureJsonRequest(request);
      const body = await parseJsonBody(request);
      const detectedThreat = detectThreatSignature([
        body?.username,
        body?.label,
        body?.unit,
        body?.password,
      ]);

      if (detectedThreat) {
        sendSecurityBlock(
          response,
          403,
          "Payload user map planner diblokir oleh sistem keamanan.",
          detectedThreat,
        );
        return;
      }

      const nextUser = validateHcoUserPayload(body);
      const existingUser = userByScopeAndUsernameStatement.get("hco", nextUser.username);

      if (existingUser) {
        sendError(response, 409, "Username HCO sudah digunakan.");
        return;
      }

      const timestamp = nowIso();
      createUserStatement.run(
        "hco",
        nextUser.username,
        nextUser.label,
        nextUser.unit,
        hashPassword(nextUser.password),
        timestamp,
        timestamp,
      );

      const currentAccessEntries = readResource("hco.mapPlannerUsers").value;
      const nextAccessEntries = [
        ...currentAccessEntries.filter(
          (entry) => normalizeUsername(entry.username) !== nextUser.username,
        ),
        {
          username: nextUser.username,
          access: {
            mainPlanner: true,
            customMaps: true,
            saves: true,
          },
          updatedAt: timestamp,
        },
      ].sort((firstEntry, secondEntry) =>
        String(firstEntry.username).localeCompare(String(secondEntry.username)),
      );
      writeResource("hco.mapPlannerUsers", nextAccessEntries);

      sendJson(response, 201, {
        ok: true,
        message: "User map planner baru berhasil ditambahkan.",
      });
      return;
    } catch (error) {
      sendError(
        response,
        error.statusCode || 500,
        error.message || "Gagal menambahkan user map planner.",
      );
      return;
    }
  }

  if (path.startsWith("/api/hco/users/") && request.method === "DELETE") {
    if (!session || session.user.scope !== "hco" || !isPrimaryHcoAdmin(session)) {
      notAuthorized(response);
      return;
    }

    try {
      const username = normalizeUsername(
        decodeURIComponent(path.replace("/api/hco/users/", "")),
      );

      if (!username) {
        sendError(response, 400, "Username user map planner tidak valid.");
        return;
      }

      if (username === config.primaryHcoAdminUsername) {
        sendError(response, 400, "Akun HCO utama tidak bisa dihapus.");
        return;
      }

      const existingUser = userByScopeAndUsernameStatement.get("hco", username);

      if (!existingUser) {
        sendError(response, 404, "Anggota HCO tidak ditemukan.");
        return;
      }

      sessionDeleteByUserStatement.run(existingUser.id);
      deleteUserByScopeAndUsernameStatement.run("hco", username);

      const currentAccessEntries = readResource("hco.mapPlannerUsers").value;
      const nextAccessEntries = currentAccessEntries.filter(
        (entry) => normalizeUsername(entry.username) !== username,
      );
      writeResource("hco.mapPlannerUsers", nextAccessEntries);

      const currentStrategicSaves = readResource("hco.strategicSaves").value;
      const nextStrategicSaves = currentStrategicSaves.filter(
        (save) =>
          String(save.ownerId || "") !== String(existingUser.id) &&
          normalizeUsername(save.ownerUsername) !== username,
      );
      writeResource("hco.strategicSaves", nextStrategicSaves);

      sendJson(response, 200, {
        ok: true,
        message: `Anggota ${existingUser.label} berhasil dihapus.`,
      });
      return;
    } catch (error) {
      sendError(
        response,
        error.statusCode || 500,
        error.message || "Gagal menghapus anggota HCO.",
      );
      return;
    }
  }

  if (path === "/api/events" && request.method === "GET") {
    if (!session) {
      notAuthorized(response);
      return;
    }

    appendSecurityHeaders(response);
    response.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });
    response.write(
      `data: ${JSON.stringify({
        type: "ready",
        scope: session.user.scope,
        timestamp: nowIso(),
      })}\n\n`,
    );

    const client = {
      response,
      scope: session.user.scope,
    };

    sseClients.add(client);

    const heartbeat = setInterval(() => {
      try {
        response.write(": keep-alive\n\n");
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(client);
      }
    }, 25000);

    request.on("close", () => {
      clearInterval(heartbeat);
      sseClients.delete(client);
    });
    return;
  }

  if (path.startsWith("/api/resources/")) {
    if (!session) {
      notAuthorized(response);
      return;
    }

    const resourceName = decodeURIComponent(path.replace("/api/resources/", ""));

    if (!(resourceName in RESOURCE_DEFAULTS)) {
      sendError(response, 404, "Resource tidak ditemukan.");
      return;
    }

    if (!isAuthorizedForResource(session, resourceName, request.method)) {
      notAuthorized(response);
      return;
    }

    if (request.method === "GET") {
      const resource = readResource(resourceName);
      sendJson(response, 200, {
        ok: true,
        resource: resource.name,
        updatedAt: resource.updatedAt,
        value: resource.value,
      });
      return;
    }

    if (request.method === "PUT") {
      try {
        ensureJsonRequest(request);
        const body = await parseJsonBody(request);
        const result = writeResource(resourceName, body.value);
        sendJson(response, 200, {
          ok: true,
          resource: resourceName,
          updatedAt: result.updatedAt,
          value: result.value,
        });
        return;
      } catch (error) {
        sendError(
          response,
          error.statusCode || 500,
          error.message || "Gagal menyimpan resource.",
        );
        return;
      }
    }
  }

  if (
    path.startsWith("/api/hco/strategic-saves/") &&
    path.endsWith("/dispatch") &&
    request.method === "POST"
  ) {
    if (!session || session.user.scope !== "hco") {
      notAuthorized(response);
      return;
    }

    const saveId = decodeURIComponent(
      path.replace("/api/hco/strategic-saves/", "").replace("/dispatch", ""),
    );
    const strategicSavesResource = readResource("hco.strategicSaves");
    const strategicSave = strategicSavesResource.value.find(
      (save) =>
        save.id === saveId &&
        (String(save.ownerId || "") === String(session.user.id) ||
          normalizeUsername(save.ownerUsername) ===
            normalizeUsername(session.user.username)),
    );

    if (!strategicSave) {
      sendError(response, 404, "Strategic save tidak ditemukan.");
      return;
    }

    try {
      await dispatchStrategicSaveToDiscord(strategicSave);
      sendJson(response, 200, {
        ok: true,
        message: "Strategi berhasil dikirim ke Strategic Channel.",
      });
      return;
    } catch (error) {
      sendError(
        response,
        502,
        error.message || "Gagal mengirim strategi ke Discord.",
      );
      return;
    }
  }

  sendError(response, 404, "Route tidak ditemukan.");
}

createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    sendError(response, 500, error.message || "Internal server error.");
  });
}).listen(config.port, () => {
  console.log(
    `[api] PelatihDash API running on http://localhost:${config.port} using ${databasePath}`,
  );
});
