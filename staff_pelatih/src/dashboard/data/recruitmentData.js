/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Recruitment Data
 * Purpose: Helper normalisasi kandidat, sesi pelatihan, dan laporan perekrutan.
 */

export const EMPTY_DASHBOARD_DATA = [];
export const TRAINING_GOLONGAN_OPTIONS = ["Golongan 1", "Golongan 2"];
export const RECRUITMENT_REPORT_STATUS_OPTIONS = ["PROSES", "LULUS", "GAGAL"];
export const MIN_RECRUITMENT_REPORT_TEXT_LENGTH = 6;
// Template indikator wawancara SOP perekrutan PASKUS 791.
// Setiap baris adalah pertanyaan/indikator; perekrut mengisi jawaban setelah tanda titik dua.
export const RECRUITMENT_REPORT_NOTES_TEMPLATE = [
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

const LEGACY_RECRUITMENT_REPORT_QUESTIONS = [
  "Belum ada pertanyaan strategis untuk kandidat ini.",
  "Belum ada fokus tambahan.",
];
const LEGACY_RECRUITMENT_REPORT_NOTES = [
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

export function buildRecruitmentReportQuestionTemplate(report = {}) {
  const candidateName = String(report.name || report.roblox || "kandidat").trim();
  const group = String(report.group || report.golongan || "Golongan 1").trim();

  return [
    `Sesi wawancara perekrutan ${candidateName} untuk ${group} — SOP PASKUS 791.`,
    `Pertanyaan wajib: identitas, kesediaan mengabdi, pemahaman etika komunikasi,`,
    `penjelasan kepangkatan dan unit, aturan komunitas, serta pelatihan dan pengambilan pin.`,
    `Isi kolom Keterangan Analis dengan hasil jawaban per indikator wawancara.`,
  ].join(" ");
}

export function buildRecruitmentReportNotesTemplate() {
  return RECRUITMENT_REPORT_NOTES_TEMPLATE;
}

export function hasMinimumRecruitmentReportText(value) {
  return (
    String(value || "").trim().length >= MIN_RECRUITMENT_REPORT_TEXT_LENGTH
  );
}

function isReportQuestionPlaceholder(value) {
  const normalizedValue = normalizeComparableReportText(value);

  return LEGACY_RECRUITMENT_REPORT_QUESTIONS.some(
    (placeholder) => normalizeComparableReportText(placeholder) === normalizedValue,
  );
}

function isReportNotesPlaceholder(value) {
  const normalizedValue = normalizeComparableReportText(value);

  return LEGACY_RECRUITMENT_REPORT_NOTES.some(
    (placeholder) => normalizeComparableReportText(placeholder) === normalizedValue,
  );
}

export function getRecruitmentReportValidationMessage(
  report = {},
  { requireFinalStatus = false } = {},
) {
  const question = String(report.question || "").trim();
  const notes = String(report.notes || "").trim();

  if (
    !hasMinimumRecruitmentReportText(question) ||
    isReportQuestionPlaceholder(question)
  ) {
    return `Pertanyaan strategis wajib diisi minimal ${MIN_RECRUITMENT_REPORT_TEXT_LENGTH} karakter.`;
  }

  if (!hasMinimumRecruitmentReportText(notes) || isReportNotesPlaceholder(notes)) {
    return `Keterangan analis wajib diisi minimal ${MIN_RECRUITMENT_REPORT_TEXT_LENGTH} karakter dan tidak boleh masih berupa template kosong.`;
  }

  if (requireFinalStatus && String(report.status || "").trim() === "PROSES") {
    return "Status laporan masih PROSES. Pilih LULUS atau GAGAL sebelum laporan dikirim.";
  }

  const additionalReports = Array.isArray(report.additionalReports)
    ? report.additionalReports
    : [];

  for (let index = 0; index < additionalReports.length; index += 1) {
    const entry = additionalReports[index];
    const supplementQuestion = String(entry?.question || "").trim();
    const supplementNotes = String(entry?.notes || "").trim();

    if (
      !hasMinimumRecruitmentReportText(supplementQuestion) ||
      isReportQuestionPlaceholder(supplementQuestion)
    ) {
      return `Laporan tambahan ${index + 1} wajib memiliki pertanyaan minimal ${MIN_RECRUITMENT_REPORT_TEXT_LENGTH} karakter.`;
    }

    if (
      !hasMinimumRecruitmentReportText(supplementNotes) ||
      isReportNotesPlaceholder(supplementNotes)
    ) {
      return `Laporan tambahan ${index + 1} wajib memiliki keterangan minimal ${MIN_RECRUITMENT_REPORT_TEXT_LENGTH} karakter.`;
    }
  }

  return "";
}
export const TRAINING_SESSION_STATUS_OPTIONS = ["AKTIF", "TERKIRIM"];

function normalizeTrainingDispatchRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const sentAt =
    typeof record.sentAt === "string" && record.sentAt.trim()
      ? record.sentAt
      : null;

  if (!sentAt) {
    return null;
  }

  const attachmentFileNames = [
    ...new Set(
      [
        ...(Array.isArray(record.attachmentFileNames)
          ? record.attachmentFileNames
          : []),
        record.attachmentFileName,
      ]
        .map((fileName) => String(fileName || "").trim())
        .filter(Boolean),
    ),
  ];
  const attachmentPreviewUrls = [
    ...new Set(
      [
        ...(Array.isArray(record.attachmentPreviewUrls)
          ? record.attachmentPreviewUrls
          : []),
        record.attachmentPreviewUrl,
      ]
        .map((previewUrl) => String(previewUrl || "").trim())
        .filter((previewUrl) => previewUrl.startsWith("data:image/")),
    ),
  ];
  const messageIds = [
    ...new Set(
      [
        ...(Array.isArray(record.messageIds) ? record.messageIds : []),
        record.messageId,
        ...(Array.isArray(record.extraMessageIds)
          ? record.extraMessageIds
          : []),
      ]
        .map((messageId) => String(messageId || "").trim())
        .filter(Boolean),
    ),
  ];
  const rawSertijab =
    record.sertijab && typeof record.sertijab === "object"
      ? record.sertijab
      : null;
  const sertijabMembers = Array.isArray(rawSertijab?.members)
    ? rawSertijab.members.map((member) => {
        const roleResults = Array.isArray(member.roleResults)
          ? member.roleResults
          : [];
        const failedRoleCount = roleResults.filter(
          (result) => result && result.ok === false,
        ).length;
        const grantedRoleCount = roleResults.filter(
          (result) => result && result.ok === true,
        ).length;
        const nicknameResult =
          member.nicknameResult && typeof member.nicknameResult === "object"
            ? member.nicknameResult
            : null;
        const nicknameFailed = nicknameResult?.ok === false;

        return {
          discordUserId: normalizeDiscordUserId(member.discordUserId),
          username: String(member.username || "").trim(),
          displayName: String(
            member.displayName || member.username || member.discordUserId || "",
          ).trim(),
          optionalRoleIds: Array.isArray(member.optionalRoleIds)
            ? member.optionalRoleIds.map(normalizeDiscordUserId).filter(Boolean)
            : [],
          roleResults,
          nicknameResult,
          grantedRoleCount,
          failedRoleCount,
          failedNicknameCount: nicknameFailed ? 1 : 0,
          status: failedRoleCount > 0 || nicknameFailed ? "PARTIAL" : "SENT",
        };
      })
    : [];
  const sertijabFailedRoleCount =
    Number(rawSertijab?.failedRoleCount) ||
    sertijabMembers.reduce(
      (total, member) => total + member.failedRoleCount,
      0,
    );
  const sertijabFailedNicknameCount =
    Number(rawSertijab?.failedNicknameCount) ||
    sertijabMembers.reduce(
      (total, member) => total + member.failedNicknameCount,
      0,
    );
  const sertijabGrantedRoleCount = sertijabMembers.reduce(
    (total, member) => total + member.grantedRoleCount,
    0,
  );
  const sertijabStatus = rawSertijab
    ? String(
        rawSertijab.status || (rawSertijab.success ? "SENT" : "PARTIAL"),
      ).trim()
    : "";

  return {
    sentAt,
    description: String(record.description || "").trim(),
    attachmentCount:
      Number(record.attachmentCount) ||
      attachmentFileNames.length ||
      attachmentPreviewUrls.length,
    attachmentFileName: attachmentFileNames[0] || "",
    attachmentFileNames,
    attachmentPreviewUrl: attachmentPreviewUrls[0] || "",
    attachmentPreviewUrls,
    reportCount: Number(record.reportCount) || 0,
    mentionedOperatorCount: Number(record.mentionedOperatorCount) || 0,
    mentionedRegistrantCount: Number(record.mentionedRegistrantCount) || 0,
    requestedByLabel: String(record.requestedByLabel || "").trim(),
    messageId: messageIds[0] || "",
    messageIds,
    extraMessageIds: messageIds.slice(1),
    embedCount: Number(record.embedCount) || 0,
    messageCount: Number(record.messageCount) || messageIds.length || 0,
    sertijab: rawSertijab
      ? {
          success:
            (rawSertijab.success === true || sertijabStatus === "SENT") &&
            sertijabFailedRoleCount === 0 &&
            sertijabFailedNicknameCount === 0,
          status: sertijabStatus,
          message: String(rawSertijab.message || "").trim(),
          reference: String(rawSertijab.reference || "").trim(),
          reportMessageId: String(rawSertijab.reportMessageId || "").trim(),
          reportChannelId: String(rawSertijab.reportChannelId || "").trim(),
          logId: String(rawSertijab.logId || "").trim(),
          failedRoleCount: sertijabFailedRoleCount,
          failedNicknameCount: sertijabFailedNicknameCount,
          grantedRoleCount: sertijabGrantedRoleCount,
          members: sertijabMembers,
        }
      : null,
  };
}

// Section: date and formatting helpers.
export function getCurrentOperationalDate(referenceDate = new Date()) {
  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
  );
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateKeyFromTimestamp(value) {
  const parsedDate = new Date(value);

  if (!Number.isFinite(parsedDate.getTime())) {
    return "";
  }

  return formatDateKey(parsedDate);
}

function resolveStableReportDateKey(report = {}) {
  if (typeof report.sessionDate === "string" && report.sessionDate.trim()) {
    return report.sessionDate.trim();
  }

  return (
    toDateKeyFromTimestamp(report.sentAt) ||
    toDateKeyFromTimestamp(report.createdAt) ||
    toDateKeyFromTimestamp(report.updatedAt) ||
    formatDateKey(new Date())
  );
}

function resolveHistoricalSessionDateKey(session = {}) {
  return (
    toDateKeyFromTimestamp(session.dispatchedAt) ||
    (typeof session.scheduledDate === "string"
      ? session.scheduledDate.trim()
      : "") ||
    toDateKeyFromTimestamp(session.createdAt) ||
    formatDateKey(new Date())
  );
}

function resolveHistoricalReportDateKey(report = {}) {
  return (
    toDateKeyFromTimestamp(report.sentAt) || resolveStableReportDateKey(report)
  );
}

export function createLocalDate(dateString) {
  const [year, month, day] = String(dateString || "")
    .split("-")
    .map(Number);
  return new Date(year, (month || 1) - 1, day || 1, 12);
}

export function formatArchiveTimestamp(date) {
  return new Date(date)
    .toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(" ", " // ");
}

export function formatOperationalDateLabel(dateString) {
  return createLocalDate(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatRelativeMinutes(date, referenceDate = new Date()) {
  const differenceInMinutes = Math.max(
    1,
    Math.round((referenceDate.getTime() - new Date(date).getTime()) / 60000),
  );

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} Menit Lalu`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `${differenceInHours} Jam Lalu`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  return `${differenceInDays} Hari Lalu`;
}

// Section: shared identity helpers.
function isMongoObjectId(value) {
  return /^[a-f0-9]{24}$/i.test(String(value || "").trim());
}

function normalizeExplicitCandidateIdentity(value) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return "";
  }

  if (normalized.includes("::")) {
    const segments = normalized
      .split("::")
      .map((segment) => segment.trim())
      .filter(Boolean);
    const lastSegment = segments.at(-1) || "";

    if (segments.length > 1 && isMongoObjectId(lastSegment)) {
      return lastSegment.toLowerCase();
    }
  }

  return normalized.toLowerCase();
}

export function createCandidateIdentity(source = {}, index = 0) {
  const explicitId =
    source.candidateIdentity ??
    source.identity ??
    source.candidateId ??
    source.id;

  if (explicitId) {
    return normalizeExplicitCandidateIdentity(explicitId);
  }

  const roblox = String(source.roblox || source.name || "")
    .trim()
    .toLowerCase();
  const discord = String(source.discord || "")
    .trim()
    .toLowerCase();

  if (roblox || discord) {
    return `${roblox || "unknown"}::${discord || "unknown"}`;
  }

  return `candidate-${index}`;
}

function resolveCandidateCategoryLabel(rawValue) {
  const normalized = String(rawValue || "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return "sipil";
  }

  if (["pmc", "contractor", "mercenary"].includes(normalized)) {
    return "pmc";
  }

  if (["sipil", "civilian", "civil"].includes(normalized)) {
    return "sipil";
  }

  if (normalized.includes("pmc")) {
    return "pmc";
  }

  if (normalized.includes("sipil") || normalized.includes("civil")) {
    return "sipil";
  }

  return "sipil";
}

export function resolveCandidateCategory(source = {}) {
  return resolveCandidateCategoryLabel(
    source.category ??
      source.type ??
      source.classification ??
      source.role ??
      source.origin ??
      source.originType ??
      source.segment,
  );
}

export function normalizeDiscordUserId(value) {
  return String(value || "").replace(/\D/g, "");
}

function resolveCandidateDiscordDisplay(source = {}) {
  return String(
    source.discord_name ??
      source.discordName ??
      source.discord ??
      source.discordTag ??
      source.discord_tag ??
      "",
  )
    .trim()
    .replace(/\s+/g, " ");
}

function resolveCandidateDiscordUserId(source = {}) {
  return normalizeDiscordUserId(
    source.discordUserId ??
      source.discord_user_id ??
      source.discordId ??
      source.discord_id ??
      source.discordMentionId,
  );
}

export function formatCandidateCategory(category) {
  return category === "pmc" ? "PMC" : "Sipil";
}

// Section: candidate normalization.
export function normalizeDashboardCandidate(candidate, index = 0) {
  const category = resolveCandidateCategory(candidate);

  return {
    id: candidate.id ?? `candidate-${index}`,
    identity: createCandidateIdentity(candidate, index),
    roblox: candidate.roblox?.trim() || candidate.name?.trim() || "Unknown",
    discord: resolveCandidateDiscordDisplay(candidate) || "unknown#0000",
    discordUserId: resolveCandidateDiscordUserId(candidate),
    age: Number(candidate.age) || 0,
    gender: candidate.gender?.trim() || "Tidak Diketahui",
    category,
    categoryLabel: formatCandidateCategory(category),
    createdAt: candidate.createdAt || new Date().toISOString(),
    updatedAt:
      candidate.updatedAt || candidate.createdAt || new Date().toISOString(),
  };
}

export function loadDashboardCandidates(value = EMPTY_DASHBOARD_DATA) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((candidate, index) =>
    normalizeDashboardCandidate(candidate, index),
  );
}

// Section: operator normalization.
export function normalizeOperatorEntry(operator, index = 0) {
  const discordUserId = normalizeDiscordUserId(
    operator.discordUserId ??
      operator.discord_user_id ??
      operator.discordId ??
      operator.discord_id ??
      operator.discordMentionId,
  );

  return {
    id: String(operator.id ?? `operator-${index}`),
    username: String(operator.username || "")
      .trim()
      .toLowerCase(),
    label: String(operator.label || operator.username || "Petugas")
      .trim()
      .replace(/\s+/g, " "),
    unit: String(operator.unit || "PASKUS 791")
      .trim()
      .replace(/\s+/g, " "),
    discordUserId,
  };
}

// Section: training session normalization.
export function createTrainingSessionId() {
  if (globalThis.crypto?.randomUUID) {
    return `training-${globalThis.crypto.randomUUID()}`;
  }

  return `training-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeTrainingSession(session, index = 0) {
  const createdAt = session.createdAt || new Date().toISOString();
  const scheduledDate =
    typeof session.scheduledDate === "string" && session.scheduledDate
      ? session.scheduledDate
      : formatDateKey(new Date(createdAt));

  const operators = Array.isArray(session.operators)
    ? session.operators.map((operator, operatorIndex) =>
        normalizeOperatorEntry(operator, operatorIndex),
      )
    : [];
  const candidates = Array.isArray(session.candidates)
    ? session.candidates.map((candidate, candidateIndex) =>
        normalizeDashboardCandidate(candidate, candidateIndex),
      )
    : [];
  const dispatchedAt =
    typeof session.dispatchedAt === "string" && session.dispatchedAt
      ? session.dispatchedAt
      : null;
  const normalizedStatus = TRAINING_SESSION_STATUS_OPTIONS.includes(
    session.status?.trim(),
  )
    ? session.status.trim()
    : dispatchedAt
      ? "TERKIRIM"
      : "AKTIF";

  return {
    id: session.id ?? `training-session-${index}`,
    title:
      session.title?.trim() ||
      `Pelatihan ${session.golongan?.trim() || "Golongan 1"}`,
    golongan: session.golongan?.trim() || "Golongan 1",
    scheduledDate,
    createdAt,
    updatedAt: session.updatedAt || createdAt,
    createdBy: session.createdBy?.trim() || "Paskus Admin",
    status: normalizedStatus,
    dispatchedAt,
    dispatchRecord: normalizeTrainingDispatchRecord(session.dispatchRecord),
    operators,
    candidates,
  };
}

export function loadTrainingSessions(value = EMPTY_DASHBOARD_DATA) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((session, index) => normalizeTrainingSession(session, index))
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    );
}

export function isCandidateAssignedToTraining(candidate, trainingSessions) {
  const identity = createCandidateIdentity(candidate);

  return trainingSessions.some((session) =>
    session.candidates.some(
      (sessionCandidate) =>
        createCandidateIdentity(sessionCandidate) === identity,
    ),
  );
}

export function buildTrainingSession({
  selectedCandidates,
  selectedOperators,
  golongan,
  createdBy,
}) {
  const timestamp = new Date().toISOString();
  const scheduledDate = formatDateKey(new Date(timestamp));

  return normalizeTrainingSession({
    id: createTrainingSessionId(),
    title: `Pelatihan ${golongan}`,
    golongan,
    scheduledDate,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    status: "AKTIF",
    dispatchedAt: null,
    operators: selectedOperators,
    candidates: selectedCandidates,
  });
}

// Section: recruitment report normalization.
export function normalizeArchiveSupplement(entry, index = 0) {
  return {
    id: entry.id ?? `archive-supplement-${index}`,
    question: entry.question?.trim() || "Belum ada fokus tambahan.",
    notes: entry.notes?.trim() || "Belum ada catatan tambahan.",
    updatedAt: entry.updatedAt ?? new Date().toISOString(),
  };
}

export function normalizeRecruitmentReport(report, index = 0) {
  const candidateIdentity = createCandidateIdentity(report, index);
  const sessionId = report.sessionId?.trim() || "";
  const name = report.name?.trim() || report.roblox?.trim() || "Unnamed Candidate";
  const group = report.group?.trim() || "Golongan 1";

  return {
    id:
      (typeof report.id === "string" && report.id.trim()) ||
      (sessionId && candidateIdentity
        ? `${sessionId}::${candidateIdentity}`
        : `archive-report-${index}`),
    sessionId,
    sessionDate: resolveStableReportDateKey(report),
    candidateIdentity,
    category: resolveCandidateCategory(report),
    name,
    discord: resolveCandidateDiscordDisplay(report) || "unknown_ops#0000",
    discordUserId: resolveCandidateDiscordUserId(report),
    group,
    status: RECRUITMENT_REPORT_STATUS_OPTIONS.includes(report.status?.trim())
      ? report.status.trim()
      : "PROSES",
    age: report.age?.trim() || `${Number(report.age) || 0} Tahun`,
    gender: report.gender?.trim() || "Tidak Diketahui",
    question: report.question?.trim() || buildRecruitmentReportQuestionTemplate({ name, group }),
    notes: report.notes?.trim() || buildRecruitmentReportNotesTemplate(),
    operators: Array.isArray(report.operators)
      ? report.operators.map((operator, operatorIndex) =>
          normalizeOperatorEntry(operator, operatorIndex),
        )
      : [],
    additionalReports: Array.isArray(report.additionalReports)
      ? report.additionalReports
          .map((entry, entryIndex) =>
            normalizeArchiveSupplement(entry, entryIndex),
          )
          .sort(
            (left, right) =>
              new Date(right.updatedAt).getTime() -
              new Date(left.updatedAt).getTime(),
          )
      : [],
    sentAt: typeof report.sentAt === "string" ? report.sentAt : null,
    createdAt: report.createdAt ?? new Date().toISOString(),
    updatedAt: report.updatedAt ?? report.createdAt ?? new Date().toISOString(),
  };
}

export function loadRecruitmentReports(value = EMPTY_DASHBOARD_DATA) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((report, index) =>
    normalizeRecruitmentReport(report, index),
  );
}

export function createReportsForTrainingSession(session) {
  return session.candidates.map((candidate) =>
    normalizeRecruitmentReport({
      id: `${session.id}::${candidate.identity}`,
      sessionId: session.id,
      sessionDate: session.scheduledDate,
      candidateIdentity: candidate.identity,
      category: candidate.category,
      name: candidate.roblox,
      discord: candidate.discord,
      discordUserId: candidate.discordUserId,
      group: session.golongan,
      status: "PROSES",
      age: `${candidate.age} Tahun`,
      gender: candidate.gender,
      question: buildRecruitmentReportQuestionTemplate({
        name: candidate.roblox,
        group: session.golongan,
      }),
      notes: buildRecruitmentReportNotesTemplate(),
      operators: session.operators,
      additionalReports: [],
      sentAt: null,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }),
  );
}

export function getLatestArchiveActivityTimestamp(report) {
  return report.additionalReports.reduce((latestTimestamp, entry) => {
    const entryTimestamp = new Date(entry.updatedAt).getTime();
    return entryTimestamp > latestTimestamp ? entryTimestamp : latestTimestamp;
  }, new Date(report.updatedAt).getTime());
}

export function isArchivePendingDispatch(report) {
  if (!report.sentAt) {
    return true;
  }

  return (
    getLatestArchiveActivityTimestamp(report) >
    new Date(report.sentAt).getTime()
  );
}

export function isRecruitmentReportComplete(report) {
  return !getRecruitmentReportValidationMessage(report, {
    requireFinalStatus: true,
  });
}

export function isTrainingSessionDispatched(session, reports = []) {
  if (session?.dispatchedAt) {
    return true;
  }

  return reports.some(
    (report) =>
      report.sessionId === session?.id && typeof report.sentAt === "string",
  );
}

// Section: grouped session helpers.
export function buildSessionDateSummaries(
  trainingSessions,
  reports,
  { historicalOnly = false } = {},
) {
  const summaryMap = new Map();
  const sourceSessions = historicalOnly
    ? trainingSessions.filter((session) =>
        isTrainingSessionDispatched(session, reports),
      )
    : trainingSessions;
  const includedSessionIds = new Set(
    sourceSessions.map((session) => session.id),
  );

  sourceSessions.forEach((session) => {
    const sessionDateKey = historicalOnly
      ? resolveHistoricalSessionDateKey(session)
      : session.scheduledDate;
    const entry = summaryMap.get(sessionDateKey) ?? {
      date: sessionDateKey,
      sessions: [],
      reportCount: 0,
      candidateCount: 0,
    };

    entry.sessions.push(session);
    entry.candidateCount += session.candidates.length;
    summaryMap.set(sessionDateKey, entry);
  });

  reports.forEach((report) => {
    if (historicalOnly && !includedSessionIds.has(report.sessionId)) {
      return;
    }

    const key = historicalOnly
      ? resolveHistoricalReportDateKey(report)
      : resolveStableReportDateKey(report);
    const entry = summaryMap.get(key) ?? {
      date: key,
      sessions: [],
      reportCount: 0,
      candidateCount: 0,
    };

    entry.reportCount += 1;
    summaryMap.set(key, entry);
  });

  return [...summaryMap.values()].sort(
    (left, right) => createLocalDate(right.date) - createLocalDate(left.date),
  );
}
