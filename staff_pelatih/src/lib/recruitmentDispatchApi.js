/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Recruiter Dispatch API
 * Purpose: Menyesuaikan frontend dengan backend dispatch recruiter yang menerima POST multipart/form-data ke endpoint dispatch internal.
 */

import { staffApiFetch } from "./staffApi";

const RECRUITMENT_DISPATCH_PATH = (
  import.meta.env.VITE_RECRUITMENT_DISPATCH_PATH || "/api/recruitment/dispatch"
).trim();

async function dataUrlToBlob(dataUrl, mimeType = "application/octet-stream") {
  const response = await fetch(String(dataUrl || ""));

  if (!response.ok) {
    throw new Error("Gagal membaca lampiran foto sebelum dikirim ke backend.");
  }

  const blob = await response.blob();
  return blob.type ? blob : new Blob([await blob.arrayBuffer()], { type: mimeType });
}

async function buildAttachmentFile(attachment) {
  if (attachment?.file instanceof File) {
    return attachment.file;
  }

  if (!attachment?.dataUrl) {
    throw new Error("Lampiran foto wajib diisi sebelum laporan dikirim ke resimen.");
  }

  const fileBlob = await dataUrlToBlob(attachment.dataUrl, attachment.mimeType);
  return new File([fileBlob], attachment.fileName || "attachment.jpg", {
    type: attachment.mimeType || fileBlob.type || "image/jpeg",
  });
}

async function buildAttachmentFiles(attachments = [], fallbackAttachment = null) {
  const normalizedAttachments =
    Array.isArray(attachments) && attachments.length > 0 ? attachments : [fallbackAttachment];
  const validAttachments = normalizedAttachments.filter(Boolean);

  if (validAttachments.length === 0) {
    throw new Error("Minimal satu lampiran foto wajib diisi sebelum laporan dikirim ke resimen.");
  }

  return Promise.all(validAttachments.map((attachment) => buildAttachmentFile(attachment)));
}

function buildDispatchFormData({
  session,
  reports,
  description,
  requestedBy,
  attachmentFiles,
}) {
  const formData = new FormData();

  formData.append(
    "payload",
    JSON.stringify({
      session,
      reports,
      description,
      requestedBy,
    }),
  );
  attachmentFiles.forEach((attachmentFile, index) => {
    formData.append("attachments", attachmentFile, attachmentFile.name);

    if (index === 0) {
      formData.append("attachment", attachmentFile, attachmentFile.name);
    }
  });

  return formData;
}

export async function dispatchRecruitmentSessionReport(payload) {
  const attachmentFiles = await buildAttachmentFiles(
    payload?.attachments,
    payload?.attachment,
  );
  const formData = buildDispatchFormData({
    session: payload?.session,
    reports: payload?.reports,
    description: payload?.description,
    requestedBy: payload?.requestedBy,
    attachmentFiles,
  });
  const response = await staffApiFetch(RECRUITMENT_DISPATCH_PATH, {
    method: "POST",
    body: formData,
    timeout: 120000,
  });

  if (!response || (response.success !== true && response.ok !== true)) {
    throw new Error(
      response?.message ||
        response?.error ||
        "Backend dispatch belum merespons sukses. Pastikan endpoint dispatch recruiter aktif.",
    );
  }

  return response?.data ?? response;
}
