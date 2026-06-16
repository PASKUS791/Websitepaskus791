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
  buildRegistrantMentionText,
  buildWebhookUrlWithWait,
  createDispatchError,
  fetchWithTimeout,
  normalizeText,
} from "./shared.mjs";
import { RECRUITMENT_DISPATCH_CONFIG } from "./config.mjs";

const EMBED_FIELD_LIMIT = 1024;
const CONTENT_LIMIT = 2000;

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

function truncateText(value, maxLength, fallback = "-") {
  const normalizedValue = normalizeText(value, fallback);

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function buildCompactLineBlock(lines, maxLength, overflowLabel) {
  const safeLines = lines.filter(Boolean);

  if (safeLines.length === 0) {
    return "-";
  }

  const selectedLines = [];

  safeLines.forEach((line, index) => {
    const remaining = safeLines.length - (index + 1);
    const suffix = remaining > 0 ? `\n+${remaining} lainnya` : "";
    const candidateValue = [...selectedLines, line].join("\n");

    if (`${candidateValue}${suffix}`.length <= maxLength) {
      selectedLines.push(line);
    }
  });

  if (selectedLines.length === safeLines.length) {
    return safeLines.join("\n");
  }

  const remaining = safeLines.length - selectedLines.length;
  const compactSelectedLines = [...selectedLines];

  while (compactSelectedLines.length > 0) {
    const candidateValue = `${compactSelectedLines.join("\n")}\n+${remaining} lainnya`;

    if (candidateValue.length <= maxLength) {
      return candidateValue;
    }

    compactSelectedLines.pop();
  }

  return truncateText(`+${safeLines.length} ${overflowLabel}`, maxLength, `+${safeLines.length}`);
}

function buildWebhookMessagePayload(normalizedPayload, generatedAt, assets) {
  const operatorSummary = buildMentionText(normalizedPayload.session.operators);
  const registrantSummary = buildRegistrantMentionText(normalizedPayload.reports);
  const primaryAttachment = normalizedPayload.attachments[0] || null;
  const operatorMentionUserIds = operatorSummary.mentionUserIds;
  const registrantMentionUserIds = registrantSummary.mentionUserIds;
  const mentionUserIds = [...new Set([...operatorMentionUserIds, ...registrantMentionUserIds])];
  const unitLabel = normalizeText(
    normalizedPayload.session.operators[0]?.unit || normalizedPayload.requestedBy.unit,
    "PASKUS 791",
  );
  const registrantLines = normalizedPayload.reports.map((report, index) => {
    const registrantEntry = registrantSummary.entries[index];
    const registrantIdentity = registrantEntry?.displayText || report.discord || report.name;

    return `${index + 1}. ${report.name} - ${registrantIdentity}`;
  });
  const contentLines = [];

  if (operatorSummary.mentionUserIds.length > 0) {
    contentLines.push(`Instruktur: ${operatorSummary.mentionText}`);
  }

  if (registrantSummary.mentionUserIds.length > 0) {
    contentLines.push(
      `Pendaftar: ${registrantSummary.mentionUserIds
        .map((userId) => `<@${userId}>`)
        .join(" ")}`,
    );
  }

  const messageContent = contentLines.length
    ? truncateText(contentLines.join("\n"), CONTENT_LIMIT, "")
    : undefined;

  return {
    messagePayload: {
      username: RECRUITMENT_DISPATCH_CONFIG.webhookName,
      content: messageContent,
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
          fields: [
            {
              name: "Instruktur",
              value: truncateText(
                operatorSummary.mentionText,
                EMBED_FIELD_LIMIT,
                "Instruktur tidak tersedia",
              ),
            },
            {
              name: "Deskripsi",
              value: truncateText(normalizedPayload.description, EMBED_FIELD_LIMIT),
            },
            {
              name: "Tag Pendaftar",
              value: buildCompactLineBlock(
                registrantLines,
                EMBED_FIELD_LIMIT,
                "pendaftar",
              ),
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
            {
              name: "File Lampiran",
              value:
                normalizedPayload.attachments.length === 1
                  ? primaryAttachment?.fileName || "Lampiran tidak tersedia"
                  : `${normalizedPayload.attachments.length} foto dikirim`,
              inline: true,
            },
          ],
          footer: {
            text: RECRUITMENT_DISPATCH_CONFIG.embed.footer(unitLabel),
          },
          ...(primaryAttachment
            ? {
                image: {
                  url: `attachment://${primaryAttachment.fileName}`,
                },
              }
            : {}),
          timestamp: generatedAt,
        },
      ],
    },
    mentionUserIds,
    operatorMentionUserIds,
    registrantMentionUserIds,
  };
}

function buildWebhookFormData({
  messagePayload,
  normalizedPayload,
  assets,
}) {
  const formData = new FormData();

  formData.append("payload_json", JSON.stringify(messagePayload));
  formData.append(
    "files[0]",
    new Blob([assets.logoBuffer], { type: assets.logoMimeType }),
    assets.logoFileName,
  );
  normalizedPayload.attachments.forEach((attachment, index) => {
    formData.append(
      `files[${index + 1}]`,
      new Blob([attachment.fileBuffer], {
        type: attachment.mimeType,
      }),
      attachment.fileName,
    );
  });

  return formData;
}

export async function sendRecruitmentDispatch({
  webhookUrl,
  normalizedPayload,
  generatedAt,
  assets,
}) {
  await patchWebhookBranding(webhookUrl, assets);
  const primaryAttachment = normalizedPayload.attachments[0] || null;

  const {
    messagePayload,
    operatorMentionUserIds,
    registrantMentionUserIds,
  } = buildWebhookMessagePayload(
    normalizedPayload,
    generatedAt,
    assets,
  );
  const formData = buildWebhookFormData({
    messagePayload,
    normalizedPayload,
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
    attachmentCount: normalizedPayload.attachments.length,
    attachmentFileName: primaryAttachment?.fileName || "",
    attachmentFileNames: normalizedPayload.attachments.map((attachment) => attachment.fileName),
    mentionedOperatorCount: operatorMentionUserIds.length,
    mentionedRegistrantCount: registrantMentionUserIds.length,
  };
}
