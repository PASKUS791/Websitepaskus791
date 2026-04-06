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

const RAW_STAFF_API_BASE_URL = import.meta.env.DEV
  ? "/staff-api"
  : import.meta.env.VITE_STAFF_API_BASE_URL || "https://api.paskus791.cloud";

export const STAFF_SESSION_STORAGE_KEY = "pelatihdash.staff.session.v1";
export const STAFF_DEFAULT_UNIT = "Recruitment Division";

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

  return session;
}

export async function logoutStaff() {
  try {
    await staffApiFetch("/auth/logout", { method: "POST" });
  } finally {
    clearStoredStaffSession();
  }
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

export async function upsertStaffEvaluation(sessionId, identitasSipil, evaluasi) {
  try {
    const payload = await staffApiFetch(
      `/perekrutan/${encodeURIComponent(sessionId)}/evaluasi`,
      {
        method: "PUT",
        body: {
          identitas_sipil: identitasSipil,
          evaluasi_update: evaluasi,
        },
      },
    );

    return payload?.data ?? null;
  } catch (error) {
    if (![400, 404].includes(error.status)) {
      throw error;
    }

    const payload = await staffApiFetch(
      `/perekrutan/${encodeURIComponent(sessionId)}/evaluasi`,
      {
        method: "POST",
        body: {
          identitas_sipil: identitasSipil,
          evaluasi_baru: evaluasi,
        },
      },
    );

    return payload?.data ?? null;
  }
}

export async function registerStaffOperatorAccount({ username, label, password }) {
  const payload = await staffApiFetch("/auth/registrasi", {
    method: "POST",
    body: {
      username: String(username || "").trim().toLowerCase(),
      password,
      nama: label,
    },
  });

  return payload?.user ?? null;
}
