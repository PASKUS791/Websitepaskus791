/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: HCO API
 * Purpose: Konektor frontend HCO ke backend /api milik project ini.
 */

import { createJsonHttpClient, normalizeHttpError } from "./httpClient";

const HCO_SESSION_STORAGE_KEY = "pelatihdash.hco.session.v1";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const hcoHttpClient = createJsonHttpClient({
  baseURL: API_BASE_URL,
});

export function isHcoResourceKey(resourceKey) {
  return String(resourceKey || "").startsWith("hco.");
}

function getWindowStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readStoredJson(key) {
  const storage = getWindowStorage();

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredJson(key, value) {
  const storage = getWindowStorage();

  if (!storage) {
    return value;
  }

  storage.setItem(key, JSON.stringify(value));
  return value;
}

function clearStoredJson(key) {
  const storage = getWindowStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(key);
}

export function normalizeHcoSessionUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: String(user.id || user.username || "hco-user"),
    username: String(user.username || "").trim().toLowerCase(),
    nama: String(user.label || user.nama || user.username || "Strategic Admin"),
    label: String(user.label || user.nama || user.username || "Strategic Admin"),
    unit: String(user.unit || "HCO Strategic Command"),
    scope: "hco",
  };
}

async function hcoApiFetch(path, options = {}) {
  try {
    const response = await hcoHttpClient.request({
      url: path,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers,
    });

    return response?.data ?? null;
  } catch (error) {
    throw normalizeHttpError(error, "HCO API request failed.");
  }
}

export function readStoredHcoSession() {
  return readStoredJson(HCO_SESSION_STORAGE_KEY);
}

export function writeStoredHcoSession(session) {
  return writeStoredJson(HCO_SESSION_STORAGE_KEY, session);
}

export function clearStoredHcoSession() {
  clearStoredJson(HCO_SESSION_STORAGE_KEY);
}

export async function loginHco(username, password) {
  const payload = await hcoApiFetch("/api/auth/login", {
    method: "POST",
    body: {
      scope: "hco",
      username: String(username || "").trim().toLowerCase(),
      password,
    },
  });

  const session = {
    user: normalizeHcoSessionUser(payload?.user),
    updatedAt: new Date().toISOString(),
  };

  writeStoredHcoSession(session);
  return session;
}

export async function refreshHcoSession() {
  const payload = await hcoApiFetch("/api/auth/session");
  const serverUser = payload?.authenticated ? payload?.user : null;

  if (!serverUser || serverUser.scope !== "hco") {
    clearStoredHcoSession();
    return null;
  }

  const session = {
    user: normalizeHcoSessionUser(serverUser),
    updatedAt: new Date().toISOString(),
  };

  writeStoredHcoSession(session);
  return session;
}

export async function logoutHco() {
  try {
    await hcoApiFetch("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    clearStoredHcoSession();
  }
}

export async function fetchHcoResource(resourceKey) {
  const payload = await hcoApiFetch(
    `/api/resources/${encodeURIComponent(resourceKey)}`,
  );
  return payload?.value;
}

export async function saveHcoResource(resourceKey, value) {
  const payload = await hcoApiFetch(
    `/api/resources/${encodeURIComponent(resourceKey)}`,
    {
      method: "PUT",
      body: { value },
    },
  );
  return payload?.value;
}

export function subscribeHcoResource(resourceKey, onChange) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const eventSource = new EventSource(`${API_BASE_URL}/api/events`, {
    withCredentials: true,
  });

  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);

      if (payload?.resource === resourceKey) {
        onChange();
      }
    } catch {
      // Ignore malformed event payloads.
    }
  };

  eventSource.onerror = () => undefined;

  return () => {
    eventSource.close();
  };
}

export async function listHcoUsersApi() {
  const payload = await hcoApiFetch("/api/hco/users");
  return {
    users: Array.isArray(payload?.users) ? payload.users : [],
  };
}

export async function createHcoUserAccount(payload) {
  return hcoApiFetch("/api/hco/users", {
    method: "POST",
    body: payload,
  });
}

export async function deleteHcoUserAccount(username) {
  return hcoApiFetch(`/api/hco/users/${encodeURIComponent(username)}`, {
    method: "DELETE",
  });
}

export async function dispatchHcoStrategicSave(saveId) {
  return hcoApiFetch(
    `/api/hco/strategic-saves/${encodeURIComponent(saveId)}/dispatch`,
    {
      method: "POST",
    },
  );
}
