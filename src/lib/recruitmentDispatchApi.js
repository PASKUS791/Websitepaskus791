/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Recruiter Dispatch API
 * Purpose: Mengirim sesi laporan recruiter ke backend internal untuk generate PDF dan dispatch webhook.
 */

import { apiFetch } from "./api";

export async function dispatchRecruitmentSessionReport(payload) {
  const response = await apiFetch("/api/recruitment/dispatch", {
    method: "POST",
    body: payload,
    timeout: 65000,
  });

  if (!response || response.ok !== true) {
    throw new Error(
      "Backend recruiter belum aktif. Fitur ini butuh server Node dengan route /api/recruitment/dispatch.",
    );
  }

  return response;
}
