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

const ACCEPTED_ATTACHMENT_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_DISPATCH_ATTACHMENT_COUNT = 4;
const MIN_RECRUITMENT_REPORT_TEXT_LENGTH = 6;
// Template indikator wawancara SOP perekrutan PASKUS 791 (harus sinkron dengan recruitmentData.js).
const RECRUITMENT_REPORT_NOTES_TEMPLATE = [
  "[IDENTITAS]",
  "Nama Roblox: ",
  "Nama Discord: ",
  "Usia kandidat: ",
  "Status asal (Sipil / PMC / Eks-Resimen): ",
  "Alasan bergabung ke PASKUS 791: ",
  "",
  "[KESEDIAAN MENGABDI]",
  "Kesiapan mengikuti aturan dan disiplin resimen: ",
  "Komitmen waktu aktif dan kehadiran sesi: ",
  "Kesediaan menjaga nama baik satuan: ",
  "",
  "[ETIKA DAN KOMUNIKASI]",
  "Sikap dan bahasa selama sesi wawancara: ",
  "Respons terhadap instruksi dan arahan perekrut: ",
  "Pemahaman IC/OOC dan aturan komunitas: ",
  "",
  "[KEPANGKATAN DAN UNIT]",
  "Pemahaman sistem kepangkatan PASKUS 791: ",
  "Unit yang diminati (GATAM/BRINGAS/SIERRA/SENTINEL/TORUK/PATHFINDER): ",
  "Pemahaman peran perwira dan penugasan unit: ",
  "",
  "[PERATURAN DAN SOP]",
  "Pemahaman aturan umum dan larangan komunitas: ",
  "Pemahaman aturan roleplay (IC/OOC, no powergaming, no metagaming): ",
  "",
  "[PELATIHAN DAN TINDAK LANJUT]",
  "Penjelasan alur pelatihan yang diterima kandidat: ",
  "Catatan risiko atau hal yang perlu dibina: ",
  "Rekomendasi pelatih (LULUS / GAGAL / PROBATION): ",
].join("\n");
const REPORT_TEXT_PLACEHOLDERS = [
  "Belum ada pertanyaan strategis untuk kandidat ini.",
  "Belum ada fokus tambahan.",
  "Belum ada keterangan analis untuk kandidat ini.",
  "Belum ada catatan tambahan.",
  "Isi hasil observasi pelatih, progres rekrutmen, dan rekomendasi berikutnya di sini.",
];

function normalizeComparableReportText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function assertReportText(value, label, reportName) {
  const normalizedValue = normalizeComparableReportText(value);
  const isPlaceholder = REPORT_TEXT_PLACEHOLDERS.some(
    (placeholder) => normalizeComparableReportText(placeholder) === normalizedValue,
  );

  if (
    String(value || "").trim().length < MIN_RECRUITMENT_REPORT_TEXT_LENGTH ||
    isPlaceholder
  ) {
    throw new Error(
      `${label} untuk ${reportName} wajib diisi minimal ${MIN_RECRUITMENT_REPORT_TEXT_LENGTH} karakter dan tidak boleh masih berupa template kosong.`,
    );
  }
}

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
  const reportName = normalizeText(report?.name, `Kandidat ${index + 1}`);
  const status = normalizeText(report?.status, "PROSES");
  const question = normalizeMultilineText(
    report?.question,
    "Belum ada pertanyaan strategis untuk kandidat ini.",
  );
  const notes = normalizeMultilineText(
    report?.notes,
    "Belum ada keterangan analis untuk kandidat ini.",
  );
  const additionalReports = Array.isArray(report?.additionalReports)
    ? report.additionalReports.map((entry, supplementIndex) => {
        const supplementQuestion = normalizeMultilineText(
          entry?.question,
          "Belum ada fokus tambahan.",
        );
        const supplementNotes = normalizeMultilineText(
          entry?.notes,
          "Belum ada catatan tambahan.",
        );

        assertReportText(
          supplementQuestion,
          `Pertanyaan laporan tambahan ${supplementIndex + 1}`,
          reportName,
        );
        assertReportText(
          supplementNotes,
          `Keterangan laporan tambahan ${supplementIndex + 1}`,
          reportName,
        );

        return {
          id: String(entry?.id || `supplement-${index}-${supplementIndex}`),
          question: supplementQuestion,
          notes: supplementNotes,
        };
      })
    : [];

  assertReportText(question, "Pertanyaan strategis", reportName);
  assertReportText(notes, "Keterangan analis", reportName);

  if (status === "PROSES") {
    throw new Error(`Status laporan ${reportName} masih PROSES. Pilih LULUS atau GAGAL sebelum dispatch.`);
  }

  return {
    id: String(report?.id || `report-${index}`),
    name: reportName,
    discord: normalizeText(report?.discord, "unknown#0000"),
    group: normalizeText(report?.group, "Golongan 1"),
    status,
    age: normalizeText(report?.age, "0 Tahun"),
    gender: normalizeText(report?.gender, "Tidak Diketahui"),
    question,
    notes,
    additionalReports,
  };
}

function normalizeAttachment(attachment, index = 0) {
  if (!attachment || typeof attachment !== "object") {
    throw new Error("Lampiran foto dispatch tidak valid.");
  }

  let mimeType = "";
  let fileBuffer = null;

  if (attachment.dataUrl) {
    const parsedAttachment = parseImageDataUrl(attachment.dataUrl);
    mimeType = parsedAttachment.mimeType;
    fileBuffer = parsedAttachment.fileBuffer;
  } else if (attachment.fileBuffer) {
    mimeType = String(attachment.mimeType || "")
      .trim()
      .toLowerCase();
    fileBuffer = Buffer.isBuffer(attachment.fileBuffer)
      ? attachment.fileBuffer
      : Buffer.from(attachment.fileBuffer);
  } else {
    throw new Error("Lampiran foto wajib diisi sebelum dispatch recruiter.");
  }

  if (!ACCEPTED_ATTACHMENT_MIME_TYPES.includes(mimeType)) {
    throw new Error("Lampiran foto tidak valid. Gunakan gambar JPG, PNG, atau WEBP.");
  }

  if (!fileBuffer?.length) {
    throw new Error("Lampiran foto kosong atau gagal dibaca.");
  }

  return {
    fileName: sanitizeFileName(
      attachment.fileName,
      `lampiran-${Date.now()}-${index + 1}.${mimeTypeToExtension(mimeType)}`,
    ),
    mimeType,
    fileBuffer,
  };
}

export function normalizeDispatchPayload(payload) {
  const session = payload?.session && typeof payload.session === "object" ? payload.session : null;
  const reports = Array.isArray(payload?.reports) ? payload.reports : [];
  const attachmentsSource =
    Array.isArray(payload?.attachments) && payload.attachments.length > 0
      ? payload.attachments
      : payload?.attachment && typeof payload.attachment === "object"
        ? [payload.attachment]
        : [];

  if (!session) {
    throw new Error("Session recruiter tidak valid.");
  }

  if (reports.length === 0) {
    throw new Error("Belum ada laporan yang bisa dikirim ke resimen.");
  }

  if (attachmentsSource.length === 0) {
    throw new Error("Lampiran foto wajib diisi sebelum dispatch recruiter.");
  }

  if (attachmentsSource.length > MAX_DISPATCH_ATTACHMENT_COUNT) {
    throw new Error(`Maksimal ${MAX_DISPATCH_ATTACHMENT_COUNT} foto per dispatch recruiter.`);
  }

  const attachments = attachmentsSource.map((attachment, index) =>
    normalizeAttachment(attachment, index),
  );
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
    attachments,
  };
}
