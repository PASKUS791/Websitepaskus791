/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch Payload
 * Purpose: Merapikan dan memvalidasi payload dispatch recruiter sebelum diubah jadi embed Discord.
 */

import {
  mimeTypeToExtension,
  normalizeDiscordUserId,
  normalizeMultilineText,
  normalizeText,
  parseImageDataUrl,
  sanitizeFileName,
} from "./shared.mjs";

function normalizeOperator(operator, index = 0) {
  return {
    id: String(operator?.id || `operator-${index}`),
    username: normalizeText(operator?.username, `operator-${index}`).toLowerCase(),
    label: normalizeText(operator?.label || operator?.nama, "Petugas"),
    unit: normalizeText(operator?.unit, "PASKUS 791"),
    discordUserId: normalizeDiscordUserId(operator?.discordUserId),
  };
}

function normalizeReport(report, index = 0) {
  const additionalReports = Array.isArray(report?.additionalReports)
    ? report.additionalReports.map((entry, supplementIndex) => ({
        id: String(entry?.id || `supplement-${index}-${supplementIndex}`),
        question: normalizeMultilineText(entry?.question, "Belum ada fokus tambahan."),
        notes: normalizeMultilineText(entry?.notes, "Belum ada catatan tambahan."),
      }))
    : [];

  return {
    id: String(report?.id || `report-${index}`),
    name: normalizeText(report?.name, `Kandidat ${index + 1}`),
    discord: normalizeText(report?.discord, "unknown#0000"),
    group: normalizeText(report?.group, "Golongan 1"),
    status: normalizeText(report?.status, "PROSES"),
    age: normalizeText(report?.age, "0 Tahun"),
    gender: normalizeText(report?.gender, "Tidak Diketahui"),
    question: normalizeMultilineText(
      report?.question,
      "Belum ada pertanyaan strategis untuk kandidat ini.",
    ),
    notes: normalizeMultilineText(
      report?.notes,
      "Belum ada keterangan analis untuk kandidat ini.",
    ),
    additionalReports,
  };
}

export function normalizeDispatchPayload(payload) {
  const session = payload?.session && typeof payload.session === "object" ? payload.session : null;
  const reports = Array.isArray(payload?.reports) ? payload.reports : [];
  const attachment =
    payload?.attachment && typeof payload.attachment === "object" ? payload.attachment : null;

  if (!session) {
    throw new Error("Session recruiter tidak valid.");
  }

  if (reports.length === 0) {
    throw new Error("Belum ada laporan yang bisa dikirim ke resimen.");
  }

  if (!attachment?.dataUrl) {
    throw new Error("Lampiran foto wajib diisi sebelum dispatch recruiter.");
  }

  const { fileBuffer, mimeType } = parseImageDataUrl(attachment.dataUrl);
  const normalizedOperators = Array.isArray(session.operators)
    ? session.operators.map((operator, index) => normalizeOperator(operator, index))
    : [];

  return {
    session: {
      id: String(session.id || "training-session"),
      title: normalizeText(session.title, "Pelatihan Recruiter"),
      golongan: normalizeText(session.golongan, "Golongan 1"),
      scheduledDate: normalizeText(session.scheduledDate, new Date().toISOString()),
      operators: normalizedOperators,
    },
    reports: reports.map((report, index) => normalizeReport(report, index)),
    description: normalizeMultilineText(
      payload?.description,
      "Lampiran hasil perekrutan dan pelatihan recruiter.",
    ).slice(0, 1800),
    requestedBy: {
      username: normalizeText(payload?.requestedBy?.username, "recruiter"),
      label: normalizeText(
        payload?.requestedBy?.label || payload?.requestedBy?.nama,
        "PASKUS 791 Recruiter",
      ),
      unit: normalizeText(payload?.requestedBy?.unit, "PASKUS 791"),
    },
    attachment: {
      fileName: sanitizeFileName(
        attachment.fileName,
        `lampiran-${Date.now()}.${mimeTypeToExtension(mimeType)}`,
      ),
      mimeType,
      fileBuffer,
    },
  };
}
