/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Staff API
 * Purpose: Konektor frontend staff ke backend perekrutan tim backend.
 */

import { createJsonHttpClient, normalizeHttpError } from "./httpClient";
import { apiFetch } from "./api";

const DEFAULT_PRODUCTION_STAFF_API_BASE_URL = "https://api.paskus791.cloud";
const RAW_STAFF_API_BASE_URL =
  import.meta.env.VITE_STAFF_API_BASE_URL ||
  (import.meta.env.DEV ? "/staff-api" : DEFAULT_PRODUCTION_STAFF_API_BASE_URL);

export const STAFF_SESSION_STORAGE_KEY = "pelatihdash.staff.session.v1";
export const STAFF_DEFAULT_UNIT = "Recruitment Division";
export const EMPTY_SHARED_PORTAL_STATE = {
  operators: [],
  sessionMetaMap: {},
  reportMetaMap: {},
  candidateMetaMap: {},
};

const STAFF_API_BASE_URL = RAW_STAFF_API_BASE_URL.replace(/\/$/, "");
const staffHttpClient = createJsonHttpClient({
  baseURL: STAFF_API_BASE_URL,
});

function getSafeWindowStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function getStoredStaffAccessToken() {
  return readStoredStaffSession()?.accessToken || "";
}

function mergeRequestHeaders(headers = {}, accessToken = "") {
  const mergedHeaders = { ...(headers || {}) };

  if (
    accessToken &&
    !("Authorization" in mergedHeaders) &&
    !("authorization" in mergedHeaders)
  ) {
    mergedHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return mergedHeaders;
}

export async function staffApiFetch(path, options = {}) {
  try {
    const accessToken = getStoredStaffAccessToken();
    const response = await staffHttpClient.request({
      url: path,
      method: options.method || "GET",
      data: options.body,
      headers: mergeRequestHeaders(options.headers, accessToken),
      timeout: options.timeout,
    });

    return response?.data ?? null;
  } catch (error) {
    throw normalizeHttpError(error, "Staff API request failed.");
  }
}

export function normalizeStaffUser(user) {
  if (!user) {
    return null;
  }

  const username = String(user.username || "").trim().toLowerCase();
  const label = String(user.nama || user.label || user.name || username || "Petugas")
    .trim()
    .replace(/\s+/g, " ");

  return {
    id: String(user.id || user._id || username),
    username,
    nama: label,
    label,
    unit: STAFF_DEFAULT_UNIT,
    scope: "pelatih",
  };
}

function decodeJwtPayload(token) {
  try {
    const base64Section = String(token || "").split(".")[1];

    if (!base64Section) {
      return null;
    }

    const normalized = base64Section.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function readStoredStaffSession() {
  const storage = getSafeWindowStorage();

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(STAFF_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeStoredStaffSession(session) {
  const storage = getSafeWindowStorage();

  if (!storage) {
    return null;
  }

  storage.setItem(STAFF_SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearStoredStaffSession() {
  const storage = getSafeWindowStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(STAFF_SESSION_STORAGE_KEY);
}

export async function loginStaff(username, password) {
  const payload = await staffApiFetch("/auth/login", {
    method: "POST",
    body: {
      username: String(username || "").trim().toLowerCase(),
      password,
    },
  });
  const user = normalizeStaffUser(payload?.user);
  const session = {
    user,
    accessToken: payload?.accessToken || null,
    updatedAt: new Date().toISOString(),
  };

  writeStoredStaffSession(session);
  await bootstrapInternalStaffSession(session.accessToken);

  return session;
}

export async function refreshStaffSession() {
  const payload = await staffApiFetch("/auth/me");
  const storedSession = readStoredStaffSession();
  const decoded = decodeJwtPayload(payload?.accessToken);
  const user =
    storedSession?.user ||
    normalizeStaffUser({
      id: decoded?.id,
      username: decoded?.username,
      nama: decoded?.nama,
    });

  if (!user) {
    return null;
  }

  const session = {
    user,
    accessToken: payload?.accessToken || null,
    updatedAt: new Date().toISOString(),
  };

  writeStoredStaffSession(session);
  await bootstrapInternalStaffSession(session.accessToken);

  return session;
}

export async function logoutStaff() {
  try {
    await staffApiFetch("/auth/logout", { method: "POST" });
  } finally {
    try {
      await logoutInternalSession();
    } catch {
      // Ignore internal logout failures so staff session can still be cleared locally.
    }
    clearStoredStaffSession();
  }
}

export async function bootstrapInternalStaffSession(accessToken) {
  if (!String(accessToken || "").trim()) {
    return null;
  }

  const payload = await apiFetch("/api/staff/bootstrap-session", {
    method: "POST",
    body: {
      accessToken,
    },
  });

  return payload?.user ?? null;
}

export async function refreshInternalSession() {
  const payload = await apiFetch("/api/auth/session");
  return payload?.authenticated ? payload.user ?? null : null;
}

export async function loginInternalAccount(scope, username, password) {
  const payload = await apiFetch("/api/auth/login", {
    method: "POST",
    body: {
      scope,
      username: String(username || "").trim().toLowerCase(),
      password,
    },
  });

  return payload?.user ?? null;
}

export async function fetchWalletAuthConfig(scope = "admin") {
  const payload = await apiFetch(
    `/api/auth/wallet/config?scope=${encodeURIComponent(scope)}`,
  );
  const allowedAddresses = Array.isArray(payload?.allowedAddresses)
    ? payload.allowedAddresses
    : [];
  const allowedAddressHints = Array.isArray(payload?.allowedAddressHints)
    ? payload.allowedAddressHints
    : [];

  return {
    enabled: Boolean(payload?.enabled),
    providerMode: payload?.providerMode || "injected",
    allowedAddresses,
    allowedAddressHints,
    allowedAddressCount: Number.isFinite(payload?.allowedAddressCount)
      ? payload.allowedAddressCount
      : allowedAddresses.length || allowedAddressHints.length,
    siweDomain: payload?.siweDomain || "",
    siweUri: payload?.siweUri || "",
  };
}

export async function requestWalletAuthChallenge({
  scope,
  username,
  address,
  chainId,
}) {
  const payload = await apiFetch("/api/auth/wallet/challenge", {
    method: "POST",
    body: {
      scope,
      username: String(username || "").trim().toLowerCase(),
      address,
      chainId,
    },
  });

  return payload?.challenge ?? null;
}

export async function verifyWalletAuthLogin({
  scope,
  username,
  password,
  address,
  nonce,
  signature,
}) {
  const payload = await apiFetch("/api/auth/wallet/verify", {
    method: "POST",
    body: {
      scope,
      username: String(username || "").trim().toLowerCase(),
      password,
      address,
      nonce,
      signature,
    },
  });

  return payload?.user ?? null;
}

export async function logoutInternalSession() {
  await apiFetch("/api/auth/logout", {
    method: "POST",
  });
}

export async function fetchStaffCandidates() {
  const payload = await staffApiFetch("/sipil/data");
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function createStaffRecruitmentSession(body) {
  const payload = await staffApiFetch("/perekrutan", {
    method: "POST",
    body,
  });
  return payload?.data ?? null;
}

export async function fetchStaffRecruitmentSummaries() {
  const payload = await staffApiFetch("/perekrutan");
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function fetchStaffRecruitmentDetail(sessionId) {
  const payload = await staffApiFetch(`/perekrutan/${encodeURIComponent(sessionId)}`);
  return payload?.data ?? null;
}

export async function finishStaffRecruitmentSession(sessionId) {
  const payload = await staffApiFetch(
    `/perekrutan/${encodeURIComponent(sessionId)}/finish`,
    {
      method: "POST",
    },
  );

  return payload?.data ?? null;
}

function normalizeSipilIdentity(value) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return normalized;
  }

  if (normalized.includes("::")) {
    const segments = normalized
      .split("::")
      .map((segment) => segment.trim())
      .filter(Boolean);
    const lastSegment = segments.at(-1) || "";

    if (segments.length > 1 && /^[a-f0-9]{24}$/i.test(lastSegment)) {
      return lastSegment;
    }
  }

  return normalized;
}

async function createStaffEvaluation(sessionId, identitasSipil, evaluasi) {
  const normalizedIdentitasSipil = normalizeSipilIdentity(identitasSipil);

  const payload = await staffApiFetch(
    `/perekrutan/${encodeURIComponent(sessionId)}/evaluasi`,
    {
      method: "POST",
      body: {
        identitas_sipil: normalizedIdentitasSipil,
        evaluasi_baru: evaluasi,
      },
    },
  );

  return payload?.data ?? null;
}

async function updateStaffEvaluation(sessionId, identitasSipil, evaluasi) {
  const normalizedIdentitasSipil = normalizeSipilIdentity(identitasSipil);

  const payload = await staffApiFetch(
    `/perekrutan/${encodeURIComponent(sessionId)}/evaluasi`,
    {
      method: "PUT",
      body: {
        identitas_sipil: normalizedIdentitasSipil,
        evaluasi_update: evaluasi,
      },
    },
  );

  return payload?.data ?? null;
}

export async function upsertStaffEvaluation(
  sessionId,
  identitasSipil,
  evaluasi,
  { mode = "update" } = {},
) {
  if (mode === "create") {
    return createStaffEvaluation(sessionId, identitasSipil, evaluasi);
  }

  if (mode === "update") {
    return updateStaffEvaluation(sessionId, identitasSipil, evaluasi);
  }

  try {
    return await updateStaffEvaluation(sessionId, identitasSipil, evaluasi);
  } catch (error) {
    if (![400, 404].includes(error.status)) {
      throw error;
    }

    return createStaffEvaluation(sessionId, identitasSipil, evaluasi);
  }
}

export async function registerStaffOperatorAccount({
  username,
  label,
  password,
  unit = STAFF_DEFAULT_UNIT,
  discordUserId = "",
}) {
  const payload = await apiFetch("/api/pelatih/operators", {
    method: "POST",
    body: {
      username: String(username || "").trim().toLowerCase(),
      label,
      unit,
      discordUserId,
      password,
    },
  });

  return payload?.operators ?? [];
}

export async function deleteStaffOperatorAccount(username) {
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!normalizedUsername) {
    throw new Error("Username petugas tidak valid.");
  }

  const payload = await apiFetch(
    `/api/pelatih/operators/${encodeURIComponent(normalizedUsername)}`,
    {
      method: "DELETE",
    },
  );

  return payload?.operators ?? [];
}

export async function fetchSharedStaffOperators() {
  const payload = await apiFetch("/api/pelatih/operators");
  return Array.isArray(payload?.operators) ? payload.operators : [];
}

export async function updateSharedStaffOperatorMetadata({
  username,
  discordUserId,
}) {
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!normalizedUsername) {
    throw new Error("Username petugas tidak valid.");
  }

  const payload = await apiFetch(
    `/api/pelatih/operators/${encodeURIComponent(normalizedUsername)}`,
    {
      method: "PATCH",
      body: {
        discordUserId,
      },
    },
  );

  return Array.isArray(payload?.operators) ? payload.operators : [];
}

export async function fetchSharedPortalState() {
  const payload = await apiFetch(
    `/api/resources/${encodeURIComponent("staffPortal.shared")}`,
  );
  return payload?.value ?? EMPTY_SHARED_PORTAL_STATE;
}

export async function saveSharedPortalState(value) {
  const payload = await apiFetch(
    `/api/resources/${encodeURIComponent("staffPortal.shared")}`,
    {
      method: "PUT",
      body: {
        value,
      },
    },
  );

  return payload?.value ?? EMPTY_SHARED_PORTAL_STATE;
}

export async function fetchAdminOverview() {
  const payload = await apiFetch("/api/admin/overview");
  return payload?.overview ?? null;
}
