/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { createJsonHttpClient, normalizeHttpError } from "./httpClient";

const DEFAULT_PRODUCTION_API_BASE_URL = "https://api.paskus791.cloud";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "" : DEFAULT_PRODUCTION_API_BASE_URL)
).replace(/\/$/, "");
const appHttpClient = createJsonHttpClient({
  baseURL: API_BASE_URL,
});

export async function apiFetch(path, options = {}) {
  try {
    const response = await appHttpClient.request({
      url: path,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers,
      timeout: options.timeout,
    });

    return response?.data ?? null;
  } catch (error) {
    throw normalizeHttpError(error, "API request failed.");
  }
}

export function createApiEventSource(path = "/api/events") {
  return new EventSource(`${API_BASE_URL}${path}`, { withCredentials: true });
}
