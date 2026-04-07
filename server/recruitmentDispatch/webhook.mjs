/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch Webhook
 * Purpose: Menyusun payload embed Discord, memasang asset branding, lalu mengirim dispatch recruiter ke webhook.
 */

import {
  buildAvatarDataUrl,
  buildMentionText,
  buildWebhookUrlWithWait,
  createDispatchError,
  fetchWithTimeout,
  normalizeText,
} from "./shared.mjs";
import { RECRUITMENT_DISPATCH_CONFIG } from "./config.mjs";

async function patchWebhookBranding(webhookUrl, assets) {
  try {
    await fetchWithTimeout(
      webhookUrl,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: RECRUITMENT_DISPATCH_CONFIG.webhookName,
          avatar: buildAvatarDataUrl(assets.logoBuffer, assets.logoMimeType),
        }),
      },
      RECRUITMENT_DISPATCH_CONFIG.timeoutMs,
    );
  } catch {
    // Branding webhook bersifat best-effort. Dispatch utama tetap lanjut.
  }
}

function buildWebhookMessagePayload(normalizedPayload, generatedAt, assets) {
  const { mentionText, mentionUserIds } = buildMentionText(normalizedPayload.session.operators);
  const unitLabel = normalizeText(
    normalizedPayload.session.operators[0]?.unit || normalizedPayload.requestedBy.unit,
    "PASKUS 791",
  );

  return {
    messagePayload: {
      username: RECRUITMENT_DISPATCH_CONFIG.webhookName,
      content: mentionUserIds.length > 0 ? mentionText : undefined,
      allowed_mentions: {
        parse: [],
        users: mentionUserIds,
      },
      embeds: [
        {
          title: RECRUITMENT_DISPATCH_CONFIG.embed.title,
          description: RECRUITMENT_DISPATCH_CONFIG.embed.description,
          color: RECRUITMENT_DISPATCH_CONFIG.colors.primaryEmbed,
          author: {
            name: RECRUITMENT_DISPATCH_CONFIG.webhookName,
            icon_url: `attachment://${assets.logoFileName}`,
          },
          thumbnail: {
            url: `attachment://${assets.logoFileName}`,
          },
          image: {
            url: `attachment://${assets.bannerFileName}`,
          },
          fields: [
            {
              name: "Keterangan",
              value: mentionText,
            },
            {
              name: "Deskripsi",
              value: normalizedPayload.description,
            },
            {
              name: "Sesi",
              value: normalizedPayload.session.title,
              inline: true,
            },
            {
              name: "Golongan",
              value: normalizedPayload.session.golongan,
              inline: true,
            },
            {
              name: "Laporan",
              value: `${normalizedPayload.reports.length} kandidat`,
              inline: true,
            },
          ],
          footer: {
            text: RECRUITMENT_DISPATCH_CONFIG.embed.footer(unitLabel),
          },
          timestamp: generatedAt,
        },
        {
          title: RECRUITMENT_DISPATCH_CONFIG.embed.attachmentTitle,
          description:
            RECRUITMENT_DISPATCH_CONFIG.embed.attachmentDescription(
              normalizedPayload.session.title,
            ),
          color: RECRUITMENT_DISPATCH_CONFIG.colors.secondaryEmbed,
          image: {
            url: `attachment://${normalizedPayload.attachment.fileName}`,
          },
        },
      ],
    },
    mentionUserIds,
  };
}

function buildWebhookFormData({
  messagePayload,
  normalizedPayload,
  pdfBuffer,
  pdfFileName,
  assets,
}) {
  const formData = new FormData();

  formData.append("payload_json", JSON.stringify(messagePayload));
  formData.append(
    "files[0]",
    new Blob([assets.logoBuffer], { type: assets.logoMimeType }),
    assets.logoFileName,
  );
  formData.append(
    "files[1]",
    new Blob([assets.bannerBuffer], { type: assets.bannerMimeType }),
    assets.bannerFileName,
  );
  formData.append(
    "files[2]",
    new Blob([normalizedPayload.attachment.fileBuffer], {
      type: normalizedPayload.attachment.mimeType,
    }),
    normalizedPayload.attachment.fileName,
  );
  formData.append(
    "files[3]",
    new Blob([pdfBuffer], { type: "application/pdf" }),
    pdfFileName,
  );

  return formData;
}

export async function sendRecruitmentDispatch({
  webhookUrl,
  normalizedPayload,
  generatedAt,
  pdfBuffer,
  pdfFileName,
  assets,
}) {
  await patchWebhookBranding(webhookUrl, assets);

  const { messagePayload, mentionUserIds } = buildWebhookMessagePayload(
    normalizedPayload,
    generatedAt,
    assets,
  );
  const formData = buildWebhookFormData({
    messagePayload,
    normalizedPayload,
    pdfBuffer,
    pdfFileName,
    assets,
  });
  const response = await fetchWithTimeout(
    buildWebhookUrlWithWait(webhookUrl),
    {
      method: "POST",
      body: formData,
    },
    RECRUITMENT_DISPATCH_CONFIG.timeoutMs,
  );

  if (!response.ok) {
    const responseText = await response.text().catch(() => "");
    const compactResponseText = normalizeText(responseText, "").slice(0, 220);

    throw createDispatchError(
      compactResponseText
        ? `Discord webhook menolak dispatch recruiter (${response.status}): ${compactResponseText}`
        : `Discord webhook menolak dispatch recruiter (${response.status}).`,
      502,
    );
  }

  const message = await response.json().catch(() => null);

  return {
    ok: true,
    messageId: message?.id || null,
    pdfFileName,
    mentionedOperatorCount: mentionUserIds.length,
  };
}
