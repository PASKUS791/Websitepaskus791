/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch Service
 * Purpose: Menyatukan alur normalisasi payload, generate PDF, dan kirim webhook Discord untuk recruiter dispatch.
 */

import { RECRUITMENT_DISPATCH_CONFIG, loadRecruitmentDispatchAssets } from "./config.mjs";
import { normalizeDispatchPayload } from "./payload.mjs";
import { buildRecruitmentDispatchPdf } from "./pdf.mjs";
import { createDispatchError, sanitizeFileName } from "./shared.mjs";
import { sendRecruitmentDispatch } from "./webhook.mjs";

export function createRecruitmentDispatchService({
  projectRoot,
  webhookUrl = "",
}) {
  const resolvedWebhookUrl = String(webhookUrl || "").trim();
  const assets = loadRecruitmentDispatchAssets(projectRoot);

  return {
    config: RECRUITMENT_DISPATCH_CONFIG,
    async dispatch(payload) {
      if (!resolvedWebhookUrl) {
        throw createDispatchError(
          "DISCORD_RECRUITMENT_WEBHOOK_URL belum diisi di server.",
          503,
        );
      }

      const generatedAt = new Date().toISOString();
      const normalizedPayload = normalizeDispatchPayload(payload);
      const pdfFileName = sanitizeFileName(
        `laporan-${normalizedPayload.session.title}-${normalizedPayload.session.id}.pdf`,
        "laporan-recruiter.pdf",
      );
      const pdfBuffer = buildRecruitmentDispatchPdf(normalizedPayload, generatedAt);

      return sendRecruitmentDispatch({
        webhookUrl: resolvedWebhookUrl,
        normalizedPayload,
        generatedAt,
        pdfBuffer,
        pdfFileName,
        assets,
      });
    },
  };
}
