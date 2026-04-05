/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Frontend Site URLs
 * Purpose: Menyatukan alamat website staff dan HCO saat app dipisah jadi dua frontend.
 */

function normalizeSiteUrl(value, fallback) {
  return String(value || fallback || "").trim().replace(/\/$/, "");
}

export const STAFF_SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_STAFF_SITE_URL,
  import.meta.env.DEV ? "http://localhost:5173" : "https://staff.paskus791.cloud",
);

export const HCO_SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_HCO_SITE_URL,
  import.meta.env.DEV ? "http://localhost:5174" : "https://hco.paskus791.cloud",
);

export function buildSiteUrl(site, path = "/") {
  const baseUrl = site === "hco" ? HCO_SITE_URL : STAFF_SITE_URL;
  const normalizedPath = String(path || "/").startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function redirectToSite(site, path = "/") {
  if (typeof window === "undefined") {
    return;
  }

  window.location.assign(buildSiteUrl(site, path));
}
