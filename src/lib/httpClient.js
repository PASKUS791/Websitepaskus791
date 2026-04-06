/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Shared HTTP Client
 * Purpose: Menyatukan konfigurasi axios dan normalisasi error untuk seluruh konektor API frontend.
 */

import axios from "axios";

export function createJsonHttpClient({
  baseURL = "",
  withCredentials = true,
  headers = {},
} = {}) {
  return axios.create({
    baseURL,
    withCredentials,
    headers: {
      Accept: "application/json",
      ...headers,
    },
  });
}

export function normalizeHttpError(error, fallbackMessage = "HTTP request failed.") {
  const payload = error?.response?.data;
  const isTimeoutError =
    error?.code === "ECONNABORTED" || /timeout/i.test(String(error?.message || ""));
  const responseText = typeof payload === "string" ? payload.trim() : "";
  const staticBackendHint = responseText.startsWith("<!DOCTYPE html") || responseText.startsWith("<html");
  const normalizedError = new Error(
    isTimeoutError
      ? "Koneksi ke backend recruiter timeout. Pastikan server Node aktif dan bisa menjangkau Discord webhook."
      : payload?.message ||
          payload?.error ||
          (staticBackendHint
            ? "Backend recruiter belum aktif. Fitur ini butuh server Node dengan route /api/recruitment/dispatch."
            : error?.message || fallbackMessage),
  );

  normalizedError.status = error?.response?.status || 500;
  normalizedError.payload = payload || null;

  return normalizedError;
}
