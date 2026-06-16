/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch Shared Helpers
 * Purpose: Menyimpan helper umum untuk validasi, normalisasi, nama file, mention, dan HTTP timeout.
 */

export function createDispatchError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function normalizeText(value, fallback = "") {
  const normalized = String(value ?? fallback)
    .replace(/\r/g, "")
    .trim()
    .replace(/\s+/g, " ");

  return normalized || fallback;
}

export function normalizeMultilineText(value, fallback = "") {
  const normalized = String(value ?? fallback)
    .replace(/\r/g, "")
    .trim();

  return normalized || fallback;
}

export function normalizeDiscordUserId(value) {
  return String(value || "").replace(/\D/g, "");
}

export function sanitizeFileName(fileName, fallbackBaseName) {
  const cleaned = String(fileName || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || fallbackBaseName;
}

export function parseImageDataUrl(dataUrl) {
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

export function mimeTypeToExtension(mimeType) {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

export function buildAvatarDataUrl(buffer, mimeType) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export function extractDiscordMentionUserId(value) {
  const source = String(value || "").trim();
  const mentionMatch = source.match(/<@!?(\d{16,22})>/);

  if (mentionMatch) {
    return mentionMatch[1];
  }

  const digits = source.replace(/\D/g, "");
  return digits.length >= 16 && digits.length <= 22 ? digits : "";
}

export async function fetchWithTimeout(url, init, timeoutMs) {
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

export function uniqueMentionUserIds(operators = []) {
  return [
    ...new Set(
      operators
        .map((operator) => normalizeDiscordUserId(operator.discordUserId))
        .filter(Boolean),
    ),
  ];
}

export function buildMentionText(operators = []) {
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

export function buildRegistrantMentionText(reports = []) {
  const entries = reports.map((report, index) => {
    const fallbackLabel = normalizeText(report?.name, `Pendaftar ${index + 1}`);
    const identity = normalizeText(report?.discord, fallbackLabel);
    const mentionUserId = extractDiscordMentionUserId(identity);

    return {
      name: fallbackLabel,
      mentionUserId,
      identity,
      displayText: mentionUserId ? `<@${mentionUserId}>` : identity,
    };
  });

  const mentionUserIds = [
    ...new Set(entries.map((entry) => entry.mentionUserId).filter(Boolean)),
  ];

  return {
    entries,
    mentionUserIds,
    mentionText:
      entries.map((entry) => entry.displayText).join(", ") || "Pendaftar tidak tersedia",
  };
}

export function buildWebhookUrlWithWait(webhookUrl) {
  return webhookUrl.includes("?") ? `${webhookUrl}&wait=true` : `${webhookUrl}?wait=true`;
}
