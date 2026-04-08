/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createRecruitmentDispatchService } from "./recruitmentDispatch.mjs";
import { createStorage } from "./storage.mjs";

process.loadEnvFile?.();

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function cloneValue(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
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
  recruitmentWebhookUrl: String(
    process.env.DISCORD_RECRUITMENT_WEBHOOK_URL || "",
  ).trim(),
  staffBackendBaseUrl: String(
    process.env.STAFF_BACKEND_BASE_URL || "https://api.paskus791.cloud",
  ).trim().replace(/\/$/, ""),
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
  mongodbUri: String(process.env.MONGODB_URI || process.env.APP_MONGODB_URI || "").trim(),
  mongodbDbName: String(
    process.env.MONGODB_DB_NAME || process.env.APP_MONGODB_DB_NAME || "pelatihdash",
  ).trim(),
};

if (!config.mongodbUri) {
  throw new Error("MONGODB_URI wajib diisi. Backend sekarang hanya mendukung MongoDB.");
}

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

const RESOURCE_SCOPES = {
  "dashboard.candidates": "pelatih",
  "dashboard.schedules": "pelatih",
  "dashboard.reports": "pelatih",
  "dashboard.trainingSessions": "pelatih",
};

const RESOURCE_DEFAULTS = {
  "dashboard.candidates": [],
  "dashboard.schedules": [],
  "dashboard.reports": [],
  "dashboard.trainingSessions": [],
};

const requestRateBuckets = new Map();
const loginAttemptBuckets = new Map();
const sseClients = new Set();
const distRoot = resolve(
  projectRoot,
  String(process.env.APP_FRONTEND_DIST_DIR || "dist-staff").trim(),
);
const hasBuiltFrontend = existsSync(resolve(distRoot, "index.html"));
const storage = await createStorage({
  resourceScopes: RESOURCE_SCOPES,
  resourceDefaults: RESOURCE_DEFAULTS,
  mongodbUri: config.mongodbUri,
  mongodbDbName: config.mongodbDbName,
});
const recruitmentDispatchService = createRecruitmentDispatchService({
  projectRoot,
  webhookUrl: config.recruitmentWebhookUrl,
});

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

async function maybeUpgradePasswordHash(user, password) {
  if (!user?.id || !isPasswordHashOutdated(user.passwordHash)) {
    return;
  }

  await storage.updateUserPassword(user.id, hashPassword(password), nowIso());
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

const DUMMY_PASSWORD_HASH = hashPassword("pelatihdash-dummy-password");

async function seedAdminUser(scope, envPrefix, fallbackLabel, fallbackUnit = null) {
  const username = normalizeUsername(process.env[`${envPrefix}_USERNAME`]);
  const password = process.env[`${envPrefix}_PASSWORD`];

  if (!username || !password) {
    return;
  }

  const timestamp = nowIso();
  await storage.seedUser({
    scope,
    username,
    label: process.env[`${envPrefix}_LABEL`] || fallbackLabel,
    unit: process.env[`${envPrefix}_UNIT`] || fallbackUnit,
    passwordHash: hashPassword(password),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

async function ensureResourceDefaults() {
  await storage.ensureResourceDefaults();
}

await seedAdminUser("pelatih", "PELATIH_ADMIN", "Paskus Admin");
await ensureResourceDefaults();

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
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
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

async function parseRawBody(request, maxBytes = 25 * 1024 * 1024) {
  let totalBytes = 0;
  const chunks = [];

  for await (const chunk of request) {
    totalBytes += chunk.length;

    if (totalBytes > maxBytes) {
      const error = new Error("Payload too large");
      error.statusCode = 413;
      throw error;
    }

    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
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

async function cleanupExpiredSessions() {
  await storage.cleanupExpiredSessions(nowIso());
}

async function createSession(user, request) {
  await cleanupExpiredSessions();
  const sessionId = randomBytes(32).toString("base64url");
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + config.sessionTtlMs).toISOString();

  await storage.createSession({
    sessionId,
    userId: user.id,
    scope: user.scope,
    ipAddress: getClientIp(request),
    userAgent: request.headers["user-agent"] || "",
    createdAt,
    expiresAt,
  });

  return {
    sessionId,
    expiresAt,
  };
}

async function destroySession(sessionId) {
  if (!sessionId) {
    return;
  }

  await storage.deleteSession(sessionId);
}

async function getAuthenticatedSession(request) {
  await cleanupExpiredSessions();
  const cookies = parseCookies(request);
  const sessionId = decodeSignedSessionId(cookies.pelatihdash_session);

  if (!sessionId) {
    return null;
  }

  const session = await storage.getSessionWithUser(sessionId);

  if (!session || !session.active) {
    await destroySession(sessionId);
    return null;
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await destroySession(sessionId);
    return null;
  }

  const currentUserAgent = String(request.headers["user-agent"] || "");

  if (session.userAgent && currentUserAgent && session.userAgent !== currentUserAgent) {
    await destroySession(sessionId);
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
  const scope = body?.scope === "pelatih" ? "pelatih" : null;
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

  return Array.isArray(value) ? value : RESOURCE_DEFAULTS[resourceName];
}

async function readResource(resourceName) {
  const existing = await storage.getResource(resourceName);

  if (!existing) {
    return {
      name: resourceName,
      scope: RESOURCE_SCOPES[resourceName],
      updatedAt: nowIso(),
      value: cloneResourceDefault(resourceName),
    };
  }

  return {
    name: existing.name,
    scope: existing.scope,
    updatedAt: existing.updatedAt,
    value:
      sanitizeResourceValue(existing.name, existing.value) ??
      cloneResourceDefault(existing.name),
  };
}

function cloneResourceDefault(resourceName) {
  return cloneValue(RESOURCE_DEFAULTS[resourceName]);
}

async function writeResource(resourceName, value) {
  const sanitizedValue = sanitizeResourceValue(resourceName, value);
  const updatedAt = nowIso();

  await storage.putResource(
    resourceName,
    RESOURCE_SCOPES[resourceName],
    sanitizedValue,
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

async function isAuthorizedForResource(session, resourceName, method = "GET") {
  void method;
  return session?.user?.scope === RESOURCE_SCOPES[resourceName];
}

function notAuthorized(response) {
  sendError(response, 401, "Unauthorized");
}

function getMimeType(filePath) {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }
  if (filePath.endsWith(".js")) {
    return "application/javascript; charset=utf-8";
  }
  if (filePath.endsWith(".css")) {
    return "text/css; charset=utf-8";
  }
  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
  }
  if (filePath.endsWith(".svg")) {
    return "image/svg+xml";
  }
  if (filePath.endsWith(".png")) {
    return "image/png";
  }
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (filePath.endsWith(".webp")) {
    return "image/webp";
  }
  if (filePath.endsWith(".gif")) {
    return "image/gif";
  }
  if (filePath.endsWith(".ico")) {
    return "image/x-icon";
  }
  if (filePath.endsWith(".woff2")) {
    return "font/woff2";
  }
  if (filePath.endsWith(".woff")) {
    return "font/woff";
  }
  if (filePath.endsWith(".ttf")) {
    return "font/ttf";
  }

  return "application/octet-stream";
}

function rewriteProxySetCookie(cookieValue) {
  return String(cookieValue || "").replace(/;\s*Domain=[^;]+/gi, "");
}

async function proxyStaffBackendRequest(request, response, requestUrl) {
  const upstreamUrl = `${config.staffBackendBaseUrl}${requestUrl.pathname.replace(/^\/staff-api/, "")}${requestUrl.search}`;
  const headers = new Headers();

  for (const [headerName, headerValue] of Object.entries(request.headers)) {
    if (!headerValue) {
      continue;
    }

    const lowerName = headerName.toLowerCase();

    if (["host", "content-length", "connection"].includes(lowerName)) {
      continue;
    }

    if (Array.isArray(headerValue)) {
      headerValue.forEach((value) => headers.append(headerName, value));
      continue;
    }

    headers.set(headerName, headerValue);
  }

  headers.set("origin", config.staffBackendBaseUrl);
  headers.set("referer", `${config.staffBackendBaseUrl}/`);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await parseRawBody(request) : undefined;
  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });
  const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());

  appendSecurityHeaders(response);
  response.statusCode = upstreamResponse.status;

  upstreamResponse.headers.forEach((headerValue, headerName) => {
    const lowerName = headerName.toLowerCase();

    if (["content-length", "transfer-encoding", "connection", "set-cookie"].includes(lowerName)) {
      return;
    }

    response.setHeader(headerName, headerValue);
  });

  const setCookies =
    typeof upstreamResponse.headers.getSetCookie === "function"
      ? upstreamResponse.headers.getSetCookie()
      : [];

  if (setCookies.length > 0) {
    response.setHeader("Set-Cookie", setCookies.map(rewriteProxySetCookie));
  }

  response.end(responseBuffer);
}

async function serveFrontend(request, response, requestUrl) {
  if (!hasBuiltFrontend) {
    sendError(response, 404, "Frontend build belum tersedia di server.");
    return;
  }

  const normalizedPath =
    requestUrl.pathname === "/" ? "/index.html" : decodeURIComponent(requestUrl.pathname);
  const requestedFile = resolve(distRoot, `.${normalizedPath}`);
  const safeDistPrefix = `${distRoot}/`;
  const isSafeFile = requestedFile === distRoot || requestedFile.startsWith(safeDistPrefix);

  if (!isSafeFile) {
    sendError(response, 403, "Akses file tidak diizinkan.");
    return;
  }

  const shouldServeAsset =
    normalizedPath.startsWith("/assets/") ||
    /\.(html|js|css|json|svg|png|jpe?g|webp|gif|ico|woff2?|ttf)$/i.test(normalizedPath);

  const fallbackFile = resolve(distRoot, "index.html");

  if (shouldServeAsset && !existsSync(requestedFile)) {
    sendError(response, 404, "Asset frontend tidak ditemukan.");
    return;
  }

  const targetFile = shouldServeAsset ? requestedFile : fallbackFile;

  try {
    const fileBuffer = await readFile(targetFile);
    appendSecurityHeaders(response);
    response.writeHead(200, {
      "Content-Type": getMimeType(targetFile),
      "Cache-Control":
        targetFile === fallbackFile ? "no-store" : "public, max-age=31536000, immutable",
    });
    response.end(fileBuffer);
  } catch {
    sendError(response, 404, "Frontend file tidak ditemukan.");
  }
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
  const session = await getAuthenticatedSession(request);

  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    if (!ensureTrustedOrigin(request, response)) {
      return;
    }
  }

  if (path === "/api/health" && request.method === "GET") {
    sendJson(response, 200, {
      ok: true,
      status: "online",
      database: storage.kind,
    });
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

      const user = await storage.getUserByScopeAndUsername(scope, username);
      const candidateHash = user?.passwordHash || DUMMY_PASSWORD_HASH;
      const isPasswordValid = verifyPassword(password, candidateHash);

      if (!user || !user.active || !isPasswordValid) {
        const failedState = registerFailedLogin(username, request);
        sendError(response, 401, "Kredensial tidak valid.", {
          remainingAttempts: Math.max(0, config.loginMaxAttempts - failedState.count),
        });
        return;
      }

      await maybeUpgradePasswordHash(user, password);
      clearFailedLogins(username, request);
      await storage.deleteSessionsByUser(user.id);
      const nextSession = await createSession({ ...user, scope }, request);

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
    await destroySession(session?.sessionId);
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

    const operators = (await storage.listUsersByScope("pelatih"))
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
      const existingUser = await storage.getUserByScopeAndUsername(
        "pelatih",
        operator.username,
      );

      if (existingUser) {
        sendError(response, 409, "Username petugas sudah digunakan.");
        return;
      }

      const timestamp = nowIso();
      await storage.createUser({
        scope: "pelatih",
        username: operator.username,
        label: operator.label,
        unit: operator.unit,
        passwordHash: hashPassword(operator.password),
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const operators = (await storage.listUsersByScope("pelatih")).map((user) => ({
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

    if (!(await isAuthorizedForResource(session, resourceName, request.method))) {
      notAuthorized(response);
      return;
    }

    if (request.method === "GET") {
      const resource = await readResource(resourceName);
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
        const result = await writeResource(resourceName, body.value);
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

  if (path === "/api/recruitment/dispatch" && request.method === "POST") {
    try {
      ensureJsonRequest(request);
      const body = await parseJsonBody(request, 16 * 1024 * 1024);
      const dispatchResult = await recruitmentDispatchService.dispatch(body);

      sendJson(response, 200, {
        ok: true,
        message: "Laporan recruiter berhasil dikirim ke Discord.",
        attachmentFileName: dispatchResult.attachmentFileName,
        mentionedOperatorCount: dispatchResult.mentionedOperatorCount,
        mentionedRegistrantCount: dispatchResult.mentionedRegistrantCount,
        messageId: dispatchResult.messageId,
      });
      return;
    } catch (error) {
      sendError(
        response,
        error.statusCode || 500,
        error.message || "Gagal mengirim recruiter dispatch.",
      );
      return;
    }
  }

  if (path.startsWith("/staff-api/")) {
    try {
      await proxyStaffBackendRequest(request, response, requestUrl);
      return;
    } catch (error) {
      sendError(
        response,
        502,
        error.message || "Gagal meneruskan request ke backend staff.",
      );
      return;
    }
  }

  if (!path.startsWith("/api/")) {
    await serveFrontend(request, response, requestUrl);
    return;
  }

  sendError(response, 404, "Route tidak ditemukan.");
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    sendError(response, 500, error.message || "Internal server error.");
  });
});

server.listen(config.port, () => {
  console.log(
    `[api] PelatihDash API running on http://localhost:${config.port} using mongodb:${storage.databaseName}`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    try {
      await storage.close?.();
    } finally {
      server.close(() => process.exit(0));
    }
  });
}
