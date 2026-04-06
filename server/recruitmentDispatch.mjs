/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch
 * Purpose: Generate PDF sesi recruiter dan kirim embed Discord lengkap dengan lampiran.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const WEBHOOK_NAME = "PASKUS 791 Recruiter";
const PRIMARY_EMBED_COLOR = 0xb7922f;
const SECONDARY_EMBED_COLOR = 0x2a2a2a;
const DISCORD_WEBHOOK_TIMEOUT_MS = 20000;
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const PAGE_MARGIN_X = 50;
const PAGE_START_Y = 792;
const PAGE_LEADING = 14;
const MAX_LINE_LENGTH = 88;
const MAX_LINES_PER_PAGE = 48;

function createDispatchError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? fallback)
    .replace(/\r/g, "")
    .trim()
    .replace(/\s+/g, " ");

  return normalized || fallback;
}

function normalizeMultilineText(value, fallback = "") {
  const normalized = String(value ?? fallback)
    .replace(/\r/g, "")
    .trim();

  return normalized || fallback;
}

function normalizeDiscordUserId(value) {
  return String(value || "").replace(/\D/g, "");
}

function sanitizeFileName(fileName, fallbackBaseName) {
  const cleaned = String(fileName || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || fallbackBaseName;
}

function parseImageDataUrl(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i.exec(
    String(dataUrl || ""),
  );

  if (!match) {
    throw new Error("Lampiran foto tidak valid. Gunakan gambar JPG, PNG, atau WEBP.");
  }

  const mimeType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const fileBuffer = Buffer.from(match[2], "base64");

  if (!fileBuffer.length) {
    throw new Error("Lampiran foto kosong atau gagal dibaca.");
  }

  return {
    mimeType,
    fileBuffer,
  };
}

function mimeTypeToExtension(mimeType) {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function escapePdfText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\t/g, " ")
    .replace(/\r/g, "")
    .replace(/\n/g, " ");
}

function wrapText(value, maxChars = MAX_LINE_LENGTH) {
  const source = normalizeMultilineText(value);

  if (!source) {
    return [""];
  }

  return source.split("\n").flatMap((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      return [""];
    }

    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;

      if (nextLine.length > maxChars && currentLine) {
        lines.push(currentLine);
        currentLine = word;
        return;
      }

      currentLine = nextLine;
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  });
}

function pushWrappedLine(targetLines, prefix, value, maxChars = MAX_LINE_LENGTH) {
  const wrappedLines = wrapText(value, Math.max(20, maxChars - prefix.length));

  wrappedLines.forEach((line, index) => {
    targetLines.push(index === 0 ? `${prefix}${line}` : `${" ".repeat(prefix.length)}${line}`);
  });
}

function buildPdfContentStream(pageLines) {
  const streamLines = [
    "BT",
    "/F1 11 Tf",
    `${PAGE_LEADING} TL`,
    `${PAGE_MARGIN_X} ${PAGE_START_Y} Td`,
  ];

  pageLines.forEach((line, index) => {
    const escapedLine = escapePdfText(line);

    if (index === 0) {
      streamLines.push(`(${escapedLine}) Tj`);
      return;
    }

    streamLines.push("T*");
    streamLines.push(`(${escapedLine}) Tj`);
  });

  streamLines.push("ET");

  return streamLines.join("\n");
}

function buildSimplePdfBuffer(lines) {
  const pages = [];

  for (let index = 0; index < lines.length; index += MAX_LINES_PER_PAGE) {
    pages.push(lines.slice(index, index + MAX_LINES_PER_PAGE));
  }

  if (pages.length === 0) {
    pages.push(["PASKUS 791 Recruiter"]);
  }

  const objects = [];
  objects[0] = null;
  objects[1] = null;
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  const pageObjectIds = [];
  let nextObjectId = 4;

  pages.forEach((pageLines) => {
    const contentStream = buildPdfContentStream(pageLines);
    const contentObjectId = nextObjectId;
    nextObjectId += 1;
    objects[contentObjectId - 1] =
      `<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}\nendstream`;

    const pageObjectId = nextObjectId;
    nextObjectId += 1;
    objects[pageObjectId - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_WIDTH} ${A4_HEIGHT}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
    pageObjectIds.push(pageObjectId);
  });

  objects[1] = `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds
    .map((objectId) => `${objectId} 0 R`)
    .join(" ")}] >>`;
  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((objectBody, index) => {
    offsets[index + 1] = Buffer.byteLength(pdf, "utf8");
    pdf += `${index + 1} 0 obj\n${objectBody}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function buildPdfLines({
  session,
  reports,
  description,
  attachmentFileName,
  requestedBy,
  generatedAt,
}) {
  const lines = [];
  const operatorLabels = session.operators.map((operator) => operator.label).join(", ") || "Petugas tidak tersedia";
  const requesterLabel = normalizeText(
    requestedBy?.label || requestedBy?.nama || requestedBy?.username,
    "PASKUS 791 Recruiter",
  );

  lines.push("PASKUS 791 Recruiter - Laporan Resimen");
  lines.push(`Dibuat: ${formatDateTime(generatedAt)}`);
  lines.push("");
  pushWrappedLine(lines, "Sesi: ", session.title);
  pushWrappedLine(lines, "Golongan: ", session.golongan);
  pushWrappedLine(lines, "Tanggal Operasional: ", session.scheduledDate);
  pushWrappedLine(lines, "Instruktur: ", operatorLabels);
  pushWrappedLine(lines, "Jumlah Laporan: ", `${reports.length} kandidat`);
  pushWrappedLine(lines, "Lampiran Foto: ", attachmentFileName);
  pushWrappedLine(lines, "Operator Dispatch: ", requesterLabel);
  lines.push("");
  lines.push("DESKRIPSI DISPATCH");
  pushWrappedLine(lines, "", description);
  lines.push("");
  lines.push("RINCIAN LAPORAN SESI");
  lines.push("");

  reports.forEach((report, reportIndex) => {
    lines.push(`${reportIndex + 1}. ${report.name} / ${report.discord}`);
    pushWrappedLine(
      lines,
      "   Status: ",
      `${report.status} | Usia: ${report.age} | Gender: ${report.gender} | Golongan: ${report.group}`,
    );
    pushWrappedLine(lines, "   Pertanyaan: ", report.question);
    pushWrappedLine(lines, "   Keterangan: ", report.notes);

    if (Array.isArray(report.additionalReports) && report.additionalReports.length > 0) {
      lines.push("   Laporan Tambahan:");
      report.additionalReports.forEach((entry, supplementIndex) => {
        pushWrappedLine(
          lines,
          `     ${supplementIndex + 1}. Pertanyaan: `,
          entry.question,
          82,
        );
        pushWrappedLine(
          lines,
          "        Keterangan: ",
          entry.notes,
          82,
        );
      });
    }

    lines.push("");
  });

  return lines;
}

function buildAvatarDataUrl(buffer, mimeType) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

async function fetchWithTimeout(
  url,
  init,
  timeoutMs = DISCORD_WEBHOOK_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw createDispatchError(
        `Koneksi ke Discord webhook timeout setelah ${Math.round(timeoutMs / 1000)} detik.`,
        504,
      );
    }

    throw createDispatchError(
      `Gagal menjangkau Discord webhook: ${error?.message || "network error"}`,
      502,
    );
  } finally {
    clearTimeout(timeoutHandle);
  }
}

function uniqueMentionUserIds(operators = []) {
  return [...new Set(
    operators
      .map((operator) => normalizeDiscordUserId(operator.discordUserId))
      .filter(Boolean),
  )];
}

function buildMentionText(operators = []) {
  const mentionUserIds = uniqueMentionUserIds(operators);

  if (mentionUserIds.length > 0) {
    return {
      mentionText: mentionUserIds.map((userId) => `<@${userId}>`).join(" "),
      mentionUserIds,
    };
  }

  return {
    mentionText:
      operators.map((operator) => operator.label).join(", ") || "Instruktur tidak tersedia",
    mentionUserIds: [],
  };
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

function normalizeDispatchPayload(payload) {
  const session = payload?.session && typeof payload.session === "object" ? payload.session : null;
  const reports = Array.isArray(payload?.reports) ? payload.reports : [];
  const attachment = payload?.attachment && typeof payload.attachment === "object"
    ? payload.attachment
    : null;

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

async function patchWebhookBranding(webhookUrl, logoBuffer, logoMimeType) {
  try {
    await fetchWithTimeout(webhookUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: WEBHOOK_NAME,
        avatar: buildAvatarDataUrl(logoBuffer, logoMimeType),
      }),
    });
  } catch {
    // Branding webhook bersifat best-effort. Dispatch utama tetap lanjut.
  }
}

function buildWebhookUrlWithWait(webhookUrl) {
  return webhookUrl.includes("?") ? `${webhookUrl}&wait=true` : `${webhookUrl}?wait=true`;
}

export function createRecruitmentDispatchService({
  projectRoot,
  webhookUrl = "",
}) {
  const resolvedWebhookUrl = String(webhookUrl || "").trim();
  const logoPath = resolve(projectRoot, "public/recruitment-webhook-logo.png");
  const bannerPath = resolve(projectRoot, "public/recruitment-webhook-banner.jpeg");
  const logoBuffer = readFileSync(logoPath);
  const bannerBuffer = readFileSync(bannerPath);
  const logoMimeType = "image/png";
  const bannerMimeType = "image/jpeg";

  return {
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
      const pdfLines = buildPdfLines({
        ...normalizedPayload,
        attachmentFileName: normalizedPayload.attachment.fileName,
        generatedAt,
      });
      const pdfBuffer = buildSimplePdfBuffer(pdfLines);
      const { mentionText, mentionUserIds } = buildMentionText(
        normalizedPayload.session.operators,
      );
      const unitLabel = normalizeText(
        normalizedPayload.session.operators[0]?.unit || normalizedPayload.requestedBy.unit,
        "PASKUS 791",
      );

      await patchWebhookBranding(resolvedWebhookUrl, logoBuffer, logoMimeType);

      const formData = new FormData();
      const messagePayload = {
        username: WEBHOOK_NAME,
        content: mentionUserIds.length > 0 ? mentionText : undefined,
        allowed_mentions: {
          parse: [],
          users: mentionUserIds,
        },
        embeds: [
          {
            title: "Lampiran",
            description:
              "Perekrutan, Pelatihan Wingman dan Pengambilan Latpur (Fisik dan Mental)",
            color: PRIMARY_EMBED_COLOR,
            author: {
              name: WEBHOOK_NAME,
              icon_url: "attachment://recruitment-webhook-logo.png",
            },
            thumbnail: {
              url: "attachment://recruitment-webhook-logo.png",
            },
            image: {
              url: "attachment://recruitment-webhook-banner.jpeg",
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
              text: `System pengiriman pelaporan secara realtime yang secara khusus difiturkan dari unit ${unitLabel} untuk pelaporan recruiter.`,
            },
            timestamp: generatedAt,
          },
          {
            title: "Foto Lampiran Recruiter",
            description: `Lampiran visual sesi ${normalizedPayload.session.title}.`,
            color: SECONDARY_EMBED_COLOR,
            image: {
              url: `attachment://${normalizedPayload.attachment.fileName}`,
            },
          },
        ],
      };

      formData.append("payload_json", JSON.stringify(messagePayload));
      formData.append(
        "files[0]",
        new Blob([logoBuffer], { type: logoMimeType }),
        "recruitment-webhook-logo.png",
      );
      formData.append(
        "files[1]",
        new Blob([bannerBuffer], { type: bannerMimeType }),
        "recruitment-webhook-banner.jpeg",
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

      const response = await fetchWithTimeout(buildWebhookUrlWithWait(resolvedWebhookUrl), {
        method: "POST",
        body: formData,
      });

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
    },
  };
}
