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
export const TRAINING_SESSION_STATUS_OPTIONS = ["AKTIF", "TERKIRIM"];

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
export function createCandidateIdentity(source = {}, index = 0) {
  const explicitId = source.id ?? source.candidateId ?? source.identity;

  if (explicitId) {
    return String(explicitId).trim().toLowerCase();
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
    discord: candidate.discord?.trim() || "unknown#0000",
    age: Number(candidate.age) || 0,
    gender: candidate.gender?.trim() || "Tidak Diketahui",
    category,
    categoryLabel: formatCandidateCategory(category),
    createdAt: candidate.createdAt || new Date().toISOString(),
    updatedAt: candidate.updatedAt || candidate.createdAt || new Date().toISOString(),
  };
}

export function loadDashboardCandidates(value = EMPTY_DASHBOARD_DATA) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((candidate, index) => normalizeDashboardCandidate(candidate, index));
}

// Section: operator normalization.
export function normalizeDiscordUserId(value) {
  return String(value || "").replace(/\D/g, "");
}

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
    username: String(operator.username || "").trim().toLowerCase(),
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
  const normalizedStatus = TRAINING_SESSION_STATUS_OPTIONS.includes(session.status?.trim())
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
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
}

export function isCandidateAssignedToTraining(candidate, trainingSessions) {
  const identity = createCandidateIdentity(candidate);

  return trainingSessions.some((session) =>
    session.candidates.some(
      (sessionCandidate) => createCandidateIdentity(sessionCandidate) === identity,
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
  return {
    id: report.id ?? `archive-report-${index}`,
    sessionId: report.sessionId?.trim() || "",
    sessionDate:
      (typeof report.sessionDate === "string" && report.sessionDate) ||
      formatDateKey(new Date(report.updatedAt || report.createdAt || Date.now())),
    candidateIdentity: createCandidateIdentity(report, index),
    category: resolveCandidateCategory(report),
    name: report.name?.trim() || report.roblox?.trim() || "Unnamed Candidate",
    discord: report.discord?.trim() || "unknown_ops#0000",
    group: report.group?.trim() || "Golongan 1",
    status: RECRUITMENT_REPORT_STATUS_OPTIONS.includes(report.status?.trim())
      ? report.status.trim()
      : "PROSES",
    age: report.age?.trim() || `${Number(report.age) || 0} Tahun`,
    gender: report.gender?.trim() || "Tidak Diketahui",
    question:
      report.question?.trim() ||
      "Belum ada pertanyaan strategis untuk kandidat ini.",
    notes:
      report.notes?.trim() || "Belum ada keterangan analis untuk kandidat ini.",
    operators: Array.isArray(report.operators)
      ? report.operators.map((operator, operatorIndex) =>
          normalizeOperatorEntry(operator, operatorIndex),
        )
      : [],
    additionalReports: Array.isArray(report.additionalReports)
      ? report.additionalReports
          .map((entry, entryIndex) => normalizeArchiveSupplement(entry, entryIndex))
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

  return value.map((report, index) => normalizeRecruitmentReport(report, index));
}

export function createReportsForTrainingSession(session) {
  return session.candidates.map((candidate, index) =>
    normalizeRecruitmentReport({
      id: `${session.id}-report-${index + 1}`,
      sessionId: session.id,
      sessionDate: session.scheduledDate,
      candidateIdentity: candidate.identity,
      category: candidate.category,
      name: candidate.roblox,
      discord: candidate.discord,
      group: session.golongan,
      status: "PROSES",
      age: `${candidate.age} Tahun`,
      gender: candidate.gender,
      question: `Evaluasi awal untuk ${candidate.roblox} pada ${session.golongan}?`,
      notes:
        "Isi hasil observasi pelatih, progres rekrutmen, dan rekomendasi berikutnya di sini.",
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

  return getLatestArchiveActivityTimestamp(report) > new Date(report.sentAt).getTime();
}

export function isRecruitmentReportComplete(report) {
  return (
    Boolean(String(report.question || "").trim()) &&
    Boolean(String(report.notes || "").trim()) &&
    report.status !== "PROSES"
  );
}

export function isTrainingSessionDispatched(session, reports = []) {
  if (session?.dispatchedAt) {
    return true;
  }

  return reports.some(
    (report) => report.sessionId === session?.id && typeof report.sentAt === "string",
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
    ? trainingSessions.filter((session) => isTrainingSessionDispatched(session, reports))
    : trainingSessions;
  const includedSessionIds = new Set(sourceSessions.map((session) => session.id));

  sourceSessions.forEach((session) => {
    const entry = summaryMap.get(session.scheduledDate) ?? {
      date: session.scheduledDate,
      sessions: [],
      reportCount: 0,
      candidateCount: 0,
    };

    entry.sessions.push(session);
    entry.candidateCount += session.candidates.length;
    summaryMap.set(session.scheduledDate, entry);
  });

  reports.forEach((report) => {
    if (historicalOnly && !includedSessionIds.has(report.sessionId)) {
      return;
    }

    const key = report.sessionDate || formatDateKey(new Date(report.updatedAt));
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
