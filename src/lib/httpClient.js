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

export const GLOBAL_FRONTEND_ERROR_EVENT = "pelatihdash:global-error";

function emitGlobalFrontendError(detail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(GLOBAL_FRONTEND_ERROR_EVENT, {
      detail,
    }),
  );
}

function shouldRaiseGlobalSystemError({
  status = 0,
  isTimeoutError = false,
  staticBackendHint = false,
  hasResponse = false,
}) {
  if (isTimeoutError || staticBackendHint) {
    return true;
  }

  if (!hasResponse) {
    return true;
  }

  return status >= 500;
}

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
  const status = error?.response?.status || 0;
  const isTimeoutError =
    error?.code === "ECONNABORTED" || /timeout/i.test(String(error?.message || ""));
  const responseText = typeof payload === "string" ? payload.trim() : "";
  const staticBackendHint =
    responseText.startsWith("<!DOCTYPE html") || responseText.startsWith("<html");
  const normalizedError = new Error(
    isTimeoutError
      ? "Koneksi ke backend recruiter timeout. Pastikan server Node aktif dan bisa menjangkau Discord webhook."
      : payload?.message ||
          payload?.error ||
          (staticBackendHint
            ? "Backend recruiter belum aktif. Pastikan server API aktif dan endpoint dispatch bisa diakses."
            : error?.message || fallbackMessage),
  );

  normalizedError.status = status || 500;
  normalizedError.payload = payload || null;
  normalizedError.isSystemError = shouldRaiseGlobalSystemError({
    status,
    isTimeoutError,
    staticBackendHint,
    hasResponse: Boolean(error?.response),
  });

  if (normalizedError.isSystemError) {
    emitGlobalFrontendError({
      title: "Sistem Eror",
      message: normalizedError.message,
      status: normalizedError.status,
      source: "http-client",
      technicalDetail:
        payload?.error ||
        payload?.message ||
        (typeof payload === "string" ? payload : error?.message || fallbackMessage),
    });
  }

  return normalizedError;
}
