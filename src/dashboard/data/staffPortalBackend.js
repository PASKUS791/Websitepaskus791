/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Staff Portal Backend Adapter
 * Purpose: Menjembatani UI pelatih dengan kontrak backend baru berbasis sipil dan perekrutan.
 */

import {
  formatCandidateCategory,
  formatDateKey,
  normalizeArchiveSupplement,
  normalizeDashboardCandidate,
  normalizeOperatorEntry,
  normalizeRecruitmentReport,
  normalizeTrainingSession,
} from "./recruitmentData";
import {
  createStaffRecruitmentSession,
  deleteStaffOperatorAccount,
  fetchStaffCandidates,
  fetchStaffRecruitmentDetail,
  fetchStaffRecruitmentSummaries,
  registerStaffOperatorAccount,
  upsertStaffEvaluation,
} from "../../lib/staffApi";

const STAFF_OPERATOR_STORAGE_KEY = "pelatihdash.staff.operators.v1";
const STAFF_SESSION_META_STORAGE_KEY = "pelatihdash.staff.session-meta.v1";
const STAFF_REPORT_META_STORAGE_KEY = "pelatihdash.staff.report-meta.v1";
const STAFF_CANDIDATE_META_STORAGE_KEY = "pelatihdash.staff.candidate-meta.v1";
const MAX_STORED_DISPATCH_ATTACHMENT_PREVIEW_LENGTH = 220000;
const DISPATCHED_SESSION_STATUS_HINTS = [
  "selesai",
  "finish",
  "finished",
  "complete",
  "completed",
  "closed",
  "done",
  "terkirim",
  "sent",
  "dispatch",
  "archive",
  "arsip",
];

function readStorageObject(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeStorageObject(key, value) {
  if (typeof window === "undefined") {
    return value;
  }

  const serialized = JSON.stringify(value);
  window.localStorage.setItem(key, serialized);
  window.dispatchEvent(
    new CustomEvent("pelatihdash:staff-storage", {
      detail: { key, value },
    }),
  );
  return value;
}

function getEmptyPortalSnapshot() {
  return {
    candidates: [],
    trainingSessions: [],
    reports: [],
    operators: [],
  };
}

function normalizeOperatorFromUser(user) {
  if (!user) {
    return null;
  }

  return normalizeOperatorEntry({
    id: user.id || user.username,
    username: user.username,
    label: user.label || user.nama || user.username,
    unit: user.unit || "PASKUS 791",
    discordUserId: user.discordUserId || user.discord_user_id || user.discordId || "",
  });
}

function loadOperatorDirectory(currentUser = null) {
  const persisted = readStorageObject(STAFF_OPERATOR_STORAGE_KEY, []);
  const normalizedPersisted = Array.isArray(persisted)
    ? persisted
        .map((entry, index) => normalizeOperatorEntry(entry, index))
        .filter(Boolean)
    : [];
  const currentOperator = normalizeOperatorFromUser(currentUser);
  const directoryMap = new Map(
    normalizedPersisted.map((entry) => [entry.username, entry]),
  );

  if (currentOperator) {
    const currentPersistedEntry = directoryMap.get(currentOperator.username);
    directoryMap.set(
      currentOperator.username,
      normalizeOperatorEntry({
        ...currentPersistedEntry,
        ...currentOperator,
        discordUserId:
          currentOperator.discordUserId || currentPersistedEntry?.discordUserId || "",
      }),
    );
  }

  const directory = [...directoryMap.values()].sort((left, right) =>
    left.label.localeCompare(right.label, "id-ID"),
  );

  writeStorageObject(STAFF_OPERATOR_STORAGE_KEY, directory);

  return directory;
}

function loadSessionMetaMap() {
  return readStorageObject(STAFF_SESSION_META_STORAGE_KEY, {});
}

function writeSessionMetaMap(value) {
  return writeStorageObject(STAFF_SESSION_META_STORAGE_KEY, value);
}

function loadReportMetaMap() {
  return readStorageObject(STAFF_REPORT_META_STORAGE_KEY, {});
}

function writeReportMetaMap(value) {
  return writeStorageObject(STAFF_REPORT_META_STORAGE_KEY, value);
}

function loadCandidateMetaMap() {
  return readStorageObject(STAFF_CANDIDATE_META_STORAGE_KEY, {});
}

function writeCandidateMetaMap(value) {
  return writeStorageObject(STAFF_CANDIDATE_META_STORAGE_KEY, value);
}

function mapRemoteCandidate(candidate, index = 0) {
  return {
    ...normalizeDashboardCandidate(
      {
        id: candidate._id,
        identity: candidate._id,
        roblox: candidate.nama_roblox,
        discord: candidate.discord_name,
        age: candidate.age,
        gender: candidate.gender,
        category: candidate.status,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
      },
      index,
    ),
    joinedVia: String(candidate.joined_via || "").trim(),
    resimen: String(candidate.resimen || "").trim(),
    device: String(candidate.device || "").trim(),
    golongan: String(candidate.golongan || "").trim(),
    backendStatus: String(candidate.status || "").trim(),
  };
}

function normalizeDispatchAttachmentPreview(dataUrl) {
  const normalizedDataUrl = String(dataUrl || "").trim();

  if (
    !normalizedDataUrl.startsWith("data:image/") ||
    normalizedDataUrl.length > MAX_STORED_DISPATCH_ATTACHMENT_PREVIEW_LENGTH
  ) {
    return "";
  }

  return normalizedDataUrl;
}

function createSessionDispatchRecord({
  description = "",
  attachment = null,
  dispatchResult = null,
  reports = [],
  currentUser = null,
} = {}) {
  const sentAt = new Date().toISOString();
  const attachmentFileName = String(
    dispatchResult?.attachmentFileName || attachment?.fileName || "",
  ).trim();
  const normalizedDescription = String(description || "").trim();

  if (!normalizedDescription && !attachmentFileName && !dispatchResult) {
    return null;
  }

  return {
    sentAt,
    description: normalizedDescription,
    attachmentFileName,
    attachmentPreviewUrl: normalizeDispatchAttachmentPreview(attachment?.dataUrl),
    reportCount: Array.isArray(reports) ? reports.length : 0,
    mentionedOperatorCount: Number(dispatchResult?.mentionedOperatorCount) || 0,
    mentionedRegistrantCount: Number(dispatchResult?.mentionedRegistrantCount) || 0,
    requestedByLabel: currentUser?.label || currentUser?.nama || "",
  };
}

function normalizeBooleanFlag(value) {
  if (value === true || value === 1) {
    return true;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    return ["true", "1", "yes", "y", "selesai", "finished", "done"].includes(
      normalizedValue,
    );
  }

  return false;
}

function toIsoTimestamp(value) {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value.toISOString() : "";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const epochMs = value > 10_000_000_000 ? value : value * 1000;
    const parsedDate = new Date(epochMs);
    return Number.isFinite(parsedDate.getTime()) ? parsedDate.toISOString() : "";
  }

  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  const parsedDate = new Date(normalizedValue);

  if (!Number.isFinite(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString();
}

function findFirstTimestamp(values = []) {
  for (const value of values) {
    const timestamp = toIsoTimestamp(value);

    if (timestamp) {
      return timestamp;
    }
  }

  return "";
}

function resolveBackendDispatchState(rawSession = {}) {
  const statusText = String(
    rawSession?.status || rawSession?.state || rawSession?.kondisi || "",
  )
    .trim()
    .toLowerCase();
  const hasStatusHint = DISPATCHED_SESSION_STATUS_HINTS.some((hint) =>
    statusText.includes(hint),
  );
  const hasDoneFlag = [
    rawSession?.selesai,
    rawSession?.finished,
    rawSession?.isFinished,
    rawSession?.completed,
    rawSession?.closed,
    rawSession?.isClosed,
    rawSession?.archived,
    rawSession?.isArchived,
    rawSession?.terkirim,
    rawSession?.dispatched,
  ].some((value) => normalizeBooleanFlag(value));
  const dispatchedAt = findFirstTimestamp([
    rawSession?.dispatchedAt,
    rawSession?.sentAt,
    rawSession?.finishedAt,
    rawSession?.completedAt,
    rawSession?.closedAt,
    rawSession?.selesaiAt,
    rawSession?.selesai_pada,
    rawSession?.waktu_selesai,
    rawSession?.tanggal_selesai,
  ]);
  const isDispatched = hasStatusHint || hasDoneFlag || Boolean(dispatchedAt);

  return {
    isDispatched,
    dispatchedAt,
  };
}

function normalizeSessionParticipantIdentity(entry) {
  const rawIdentity = String(
    entry?.identitas_sipil?._id ||
      entry?.identitas_sipil?.id ||
      entry?.identitas_sipil ||
      entry?.candidateId ||
      "",
  ).trim();

  if (!rawIdentity) {
    return "";
  }

  return rawIdentity.toLowerCase();
}

function getDefaultQuestion(candidate, golongan) {
  return `Evaluasi awal untuk ${candidate.roblox} pada ${golongan}?`;
}

function getDefaultNotes() {
  return "Isi hasil observasi pelatih, progres rekrutmen, dan rekomendasi berikutnya di sini.";
}

function buildReportMetaKey(sessionId, candidateIdentity) {
  return `${sessionId}::${candidateIdentity}`;
}

function createReportDraftShadow(report) {
  const normalizedReport = normalizeRecruitmentReport(report);

  return {
    status: normalizedReport.status,
    sentAt: normalizedReport.sentAt || null,
    updatedAt: normalizedReport.updatedAt,
    age: normalizedReport.age,
    gender: normalizedReport.gender,
    question: normalizedReport.question,
    notes: normalizedReport.notes,
    additionalReports: normalizedReport.additionalReports.map((entry, index) =>
      normalizeArchiveSupplement(entry, index),
    ),
  };
}

function mergeReportWithShadow(baseReport, reportMeta = {}) {
  const shadowAdditionalReports = Array.isArray(reportMeta.additionalReports)
    ? reportMeta.additionalReports.map((entry, index) =>
        normalizeArchiveSupplement(entry, index),
      )
    : null;

  return normalizeRecruitmentReport({
    ...baseReport,
    status: reportMeta.status || baseReport.status,
    sentAt: reportMeta.sentAt || baseReport.sentAt || null,
    updatedAt: reportMeta.updatedAt || baseReport.updatedAt,
    age: reportMeta.age || baseReport.age,
    gender: reportMeta.gender || baseReport.gender,
    question: reportMeta.question || baseReport.question,
    notes: reportMeta.notes || baseReport.notes,
    additionalReports: shadowAdditionalReports ?? baseReport.additionalReports,
  });
}

function extractMongoObjectIds(value) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return [];
  }

  const matches = normalized.match(/[a-f0-9]{24}/gi);

  if (!Array.isArray(matches)) {
    return [];
  }

  return [...new Set(matches.map((entry) => entry.toLowerCase()))];
}

function buildRecruitmentSessionIds(entries = [], selectors = []) {
  return [...new Set(
    entries.flatMap((entry) =>
      selectors.flatMap((selector) => extractMongoObjectIds(selector(entry))),
    ),
  )];
}

function buildSessionDetailPayload(
  rawSession,
  candidateMap,
  candidateMetaMap,
  operatorDirectory,
  sessionMetaMap,
  currentUser,
) {
  if (!rawSession || typeof rawSession !== "object") {
    return null;
  }

  const sessionId = String(rawSession._id || rawSession.id || "");

  if (!sessionId) {
    return null;
  }

  const sessionMeta = sessionMetaMap[sessionId] || {};

  if (sessionMeta.canceledAt) {
    return null;
  }

  const backendDispatchState = resolveBackendDispatchState(rawSession);
  const resolvedDispatchedAt =
    sessionMeta.dispatchedAt ||
    backendDispatchState.dispatchedAt ||
    (backendDispatchState.isDispatched
      ? findFirstTimestamp([rawSession.updatedAt, rawSession.createdAt]) ||
        new Date().toISOString()
      : "");
  const sessionDispatched = Boolean(resolvedDispatchedAt || backendDispatchState.isDispatched);

  const operators = Array.isArray(rawSession.pelatih)
    ? rawSession.pelatih.map((operator, index) => {
        const username = String(operator?.username || "").trim().toLowerCase();
        const matchedOperator = operatorDirectory.find(
          (entry) => entry.username === username,
        );

        return normalizeOperatorEntry(
          {
            id: operator?._id || matchedOperator?.id || username || `operator-${index}`,
            username: username || matchedOperator?.username || `operator-${index}`,
            label: operator?.nama || matchedOperator?.label || username || "Petugas",
            unit: matchedOperator?.unit || "PASKUS 791",
            discordUserId:
              matchedOperator?.discordUserId ||
              operator?.discordUserId ||
              operator?.discord_user_id ||
              "",
          },
          index,
        );
      })
    : [];

  const candidates = Array.isArray(rawSession.peserta)
    ? rawSession.peserta
        .map((entry, index) => {
          const identity = normalizeSessionParticipantIdentity(entry);

          if (identity && candidateMetaMap[identity]?.eliminatedAt) {
            return null;
          }

          const matchedCandidate = candidateMap.get(identity);
          const participantSource =
            entry?.identitas_sipil && typeof entry.identitas_sipil === "object"
              ? entry.identitas_sipil
              : entry || {};

          const fallbackCandidate = normalizeDashboardCandidate(
            {
              id: identity || `session-candidate-${sessionId}-${index}`,
              identity: identity || `session-candidate-${sessionId}-${index}`,
              roblox:
                participantSource?.nama_roblox ||
                participantSource?.namaRoblox ||
                participantSource?.nama ||
                participantSource?.name ||
                "Unknown Candidate",
              discord:
                participantSource?.discord_name ||
                participantSource?.discord ||
                "unknown#0000",
              age: participantSource?.age || 0,
              gender: participantSource?.gender || "Tidak Diketahui",
              category:
                participantSource?.status ||
                participantSource?.kategori ||
                participantSource?.category ||
                "sipil",
              createdAt:
                participantSource?.createdAt ||
                rawSession.createdAt ||
                new Date().toISOString(),
              updatedAt:
                participantSource?.updatedAt ||
                rawSession.updatedAt ||
                rawSession.createdAt ||
                new Date().toISOString(),
            },
            index,
          );
          const resolvedCandidate = matchedCandidate || fallbackCandidate;

          return {
            ...resolvedCandidate,
            evaluation: Array.isArray(entry?.evaluasi) ? entry.evaluasi : [],
            participantIndex: index,
          };
        })
        .filter(Boolean)
    : [];

  if (candidates.length === 0) {
    return null;
  }

  return {
    rawSession,
    session: normalizeTrainingSession({
      id: sessionId,
      title: `Pelatihan ${rawSession.golongan || "Golongan 1"}`,
      golongan: rawSession.golongan || "Golongan 1",
      scheduledDate: formatDateKey(new Date(rawSession.createdAt || Date.now())),
      createdAt: rawSession.createdAt || new Date().toISOString(),
      updatedAt: sessionMeta.updatedAt || rawSession.updatedAt || rawSession.createdAt,
      createdBy:
        sessionMeta.createdBy ||
        currentUser?.label ||
        operators[0]?.label ||
        "Paskus Admin",
      status: sessionDispatched ? "TERKIRIM" : "AKTIF",
      dispatchedAt: resolvedDispatchedAt || null,
      dispatchRecord: sessionMeta.dispatchRecord || null,
      operators,
      candidates,
    }),
  };
}

function buildReportsFromSession(session, reportMetaMap) {
  return session.candidates.map((candidate) => {
    const reportMeta =
      reportMetaMap[buildReportMetaKey(session.id, candidate.identity)] || {};
    const evaluation = Array.isArray(candidate.evaluation) ? candidate.evaluation : [];
    const primaryEvaluation = evaluation[0];
    const supplementEvaluations = evaluation.slice(1);
    const updatedAt =
      reportMeta.updatedAt ||
      session.updatedAt ||
      session.createdAt ||
      new Date().toISOString();

    return mergeReportWithShadow({
      id: `${session.id}::${candidate.identity}`,
      sessionId: session.id,
      sessionDate: session.scheduledDate,
      candidateIdentity: candidate.identity,
      category: candidate.category,
      name: candidate.roblox,
      discord: candidate.discord,
      group: session.golongan,
      status: reportMeta.status || "PROSES",
      age: `${candidate.age} Tahun`,
      gender: candidate.gender,
      question: primaryEvaluation?.pertanyaan || getDefaultQuestion(candidate, session.golongan),
      notes: primaryEvaluation?.keterangan || getDefaultNotes(),
      operators: session.operators,
      additionalReports: supplementEvaluations.map((entry, supplementIndex) =>
        normalizeArchiveSupplement({
          id: `${session.id}-${candidate.identity}-supplement-${supplementIndex + 1}`,
          question: entry?.pertanyaan,
          notes: entry?.keterangan,
          updatedAt,
        }),
      ),
      sentAt: reportMeta.sentAt || session.dispatchedAt || null,
      createdAt: session.createdAt,
      updatedAt,
    }, reportMeta);
  });
}

export async function fetchStaffPortalSnapshot(currentUser = null) {
  const operatorDirectory = loadOperatorDirectory(currentUser);
  const candidateMetaMap = loadCandidateMetaMap();
  const sessionMetaMap = loadSessionMetaMap();
  const reportMetaMap = loadReportMetaMap();

  const remoteCandidates = await fetchStaffCandidates();
  const candidates = remoteCandidates
    .map((candidate, index) => mapRemoteCandidate(candidate, index))
    .filter((candidate) => !candidateMetaMap[candidate.identity]?.eliminatedAt);

  const candidateMap = new Map(candidates.map((candidate) => [candidate.identity, candidate]));
  const sessionSummaries = await fetchStaffRecruitmentSummaries();
  const rawSessionDetails = await Promise.all(
    sessionSummaries.map((session) =>
      fetchStaffRecruitmentDetail(session?._id || session?.id),
    ),
  );

  const trainingSessions = rawSessionDetails
    .map((detail) =>
      buildSessionDetailPayload(
        detail,
        candidateMap,
        candidateMetaMap,
        operatorDirectory,
        sessionMetaMap,
        currentUser,
      ),
    )
    .filter(Boolean)
    .map((entry) => entry.session)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );

  const reports = trainingSessions
    .flatMap((session) => buildReportsFromSession(session, reportMetaMap))
    .filter((report) => !candidateMetaMap[report.candidateIdentity]?.eliminatedAt)
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    );

  return {
    candidates,
    trainingSessions,
    reports,
    operators: operatorDirectory,
  };
}

export async function createStaffTrainingSession({
  selectedCandidates,
  selectedOperators,
  golongan,
  currentUser,
}) {
  const pelatih = buildRecruitmentSessionIds(selectedOperators, [
    (operator) => operator?.id,
    (operator) => operator?._id,
  ]);
  const peserta = buildRecruitmentSessionIds(selectedCandidates, [
    (candidate) => candidate?.identity,
    (candidate) => candidate?.id,
  ]);

  if (pelatih.length === 0) {
    throw new Error("ID pelatih tidak valid. Muat ulang halaman lalu pilih petugas lagi.");
  }

  if (peserta.length === 0) {
    throw new Error("ID kandidat tidak valid. Muat ulang halaman lalu pilih kandidat lagi.");
  }

  const payload = await createStaffRecruitmentSession({
    golongan: String(golongan || "").trim() || "Golongan 1",
    pelatih,
    peserta,
  });
  const sessionId = String(payload?._id || "");
  const sessionMetaMap = loadSessionMetaMap();
  const createdAt = new Date().toISOString();

  if (sessionId) {
    sessionMetaMap[sessionId] = {
      createdBy: currentUser?.label || currentUser?.nama || "Paskus Admin",
      createdAt,
      updatedAt: createdAt,
      dispatchedAt: null,
      canceledAt: null,
    };
    writeSessionMetaMap(sessionMetaMap);
  }

  const snapshot = await fetchStaffPortalSnapshot(currentUser);
  const session = snapshot.trainingSessions.find((entry) => entry.id === sessionId) || null;
  const reports = snapshot.reports.filter((report) => report.sessionId === sessionId);

  return {
    session,
    reports,
    snapshot,
  };
}

export async function saveStaffRecruitmentReport(
  report,
  currentUser = null,
  { mode = "update" } = {},
) {
  const evaluations = [
    {
      pertanyaan: report.question,
      keterangan: report.notes,
    },
    ...report.additionalReports.map((entry) => ({
      pertanyaan: entry.question,
      keterangan: entry.notes,
    })),
  ];

  await upsertStaffEvaluation(
    report.sessionId,
    report.candidateIdentity,
    evaluations,
    { mode },
  );

  const reportMetaMap = loadReportMetaMap();
  const metaKey = buildReportMetaKey(report.sessionId, report.candidateIdentity);
  const currentMeta = reportMetaMap[metaKey] || {};
  const nextUpdatedAt = report.updatedAt || new Date().toISOString();
  const reportDraftShadow = createReportDraftShadow({
    ...report,
    updatedAt: nextUpdatedAt,
  });

  reportMetaMap[metaKey] = {
    ...currentMeta,
    ...reportDraftShadow,
    sentAt: currentMeta.sentAt || reportDraftShadow.sentAt || null,
  };
  writeReportMetaMap(reportMetaMap);

  const sessionMetaMap = loadSessionMetaMap();
  if (sessionMetaMap[report.sessionId]) {
    sessionMetaMap[report.sessionId] = {
      ...sessionMetaMap[report.sessionId],
      updatedAt: nextUpdatedAt,
    };
    writeSessionMetaMap(sessionMetaMap);
  }

  return fetchStaffPortalSnapshot(currentUser);
}

export async function dispatchStaffTrainingSession(
  sessionId,
  reports = [],
  currentUser = null,
  options = {},
) {
  const dispatchedAt = new Date().toISOString();
  const sessionMetaMap = loadSessionMetaMap();
  const currentMeta = sessionMetaMap[sessionId] || {};
  const dispatchRecord =
    createSessionDispatchRecord({
      ...options,
      reports,
      currentUser,
    }) || currentMeta.dispatchRecord || null;

  sessionMetaMap[sessionId] = {
    ...currentMeta,
    dispatchedAt,
    updatedAt: dispatchedAt,
    dispatchRecord,
  };
  writeSessionMetaMap(sessionMetaMap);

  const reportMetaMap = loadReportMetaMap();
  reports.forEach((report) => {
    const metaKey = buildReportMetaKey(report.sessionId, report.candidateIdentity);
    reportMetaMap[metaKey] = {
      ...(reportMetaMap[metaKey] || {}),
      status: report.status,
      sentAt: dispatchedAt,
      updatedAt: report.updatedAt || dispatchedAt,
    };
  });
  writeReportMetaMap(reportMetaMap);

  return fetchStaffPortalSnapshot(currentUser);
}

export async function cancelStaffTrainingSession(sessionId, currentUser = null) {
  const canceledAt = new Date().toISOString();
  const sessionMetaMap = loadSessionMetaMap();
  const currentMeta = sessionMetaMap[sessionId] || {};

  sessionMetaMap[sessionId] = {
    ...currentMeta,
    canceledAt,
    updatedAt: canceledAt,
  };
  writeSessionMetaMap(sessionMetaMap);

  const reportMetaMap = loadReportMetaMap();
  Object.keys(reportMetaMap).forEach((metaKey) => {
    if (metaKey.startsWith(`${sessionId}::`)) {
      delete reportMetaMap[metaKey];
    }
  });
  writeReportMetaMap(reportMetaMap);

  return fetchStaffPortalSnapshot(currentUser);
}

export async function eliminateStaffCandidate(report, currentUser = null) {
  const candidateMetaMap = loadCandidateMetaMap();
  const eliminatedAt = new Date().toISOString();

  candidateMetaMap[report.candidateIdentity] = {
    ...(candidateMetaMap[report.candidateIdentity] || {}),
    eliminatedAt,
    updatedAt: eliminatedAt,
    category: formatCandidateCategory(report.category),
  };
  writeCandidateMetaMap(candidateMetaMap);

  const reportMetaMap = loadReportMetaMap();
  delete reportMetaMap[buildReportMetaKey(report.sessionId, report.candidateIdentity)];
  writeReportMetaMap(reportMetaMap);

  const nextSnapshot = await fetchStaffPortalSnapshot(currentUser);
  const remainingSession = nextSnapshot.trainingSessions.find(
    (session) => session.id === report.sessionId,
  );

  if (remainingSession?.candidates.length > 0) {
    return nextSnapshot;
  }

  const sessionMetaMap = loadSessionMetaMap();
  const currentMeta = sessionMetaMap[report.sessionId] || {};

  sessionMetaMap[report.sessionId] = {
    ...currentMeta,
    canceledAt: eliminatedAt,
    updatedAt: eliminatedAt,
  };
  writeSessionMetaMap(sessionMetaMap);

  Object.keys(reportMetaMap).forEach((metaKey) => {
    if (metaKey.startsWith(`${report.sessionId}::`)) {
      delete reportMetaMap[metaKey];
    }
  });
  writeReportMetaMap(reportMetaMap);

  return fetchStaffPortalSnapshot(currentUser);
}

export async function registerStaffOperator(formState, currentUser = null) {
  const user = await registerStaffOperatorAccount(formState);
  const operatorDirectory = loadOperatorDirectory(currentUser);
  const normalizedOperator = normalizeOperatorEntry({
    id: user?.id || user?._id || formState.username,
    username: formState.username,
    label: formState.label,
    unit: formState.unit || "PASKUS 791",
    discordUserId: formState.discordUserId || "",
  });
  const directoryMap = new Map(
    operatorDirectory.map((entry) => [entry.username, entry]),
  );

  directoryMap.set(normalizedOperator.username, normalizedOperator);
  const nextDirectory = [...directoryMap.values()].sort((left, right) =>
    left.label.localeCompare(right.label, "id-ID"),
  );
  writeStorageObject(STAFF_OPERATOR_STORAGE_KEY, nextDirectory);

  return {
    operator: normalizedOperator,
    operators: nextDirectory,
    message: "Petugas berhasil ditambahkan.",
  };
}

export async function updateStaffOperatorMetadata(
  { username, discordUserId },
  currentUser = null,
) {
  const operatorDirectory = loadOperatorDirectory(currentUser);
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!normalizedUsername) {
    throw new Error("Username petugas tidak valid.");
  }

  const targetOperator = operatorDirectory.find(
    (entry) => entry.username === normalizedUsername,
  );

  if (!targetOperator) {
    throw new Error("Petugas tidak ditemukan.");
  }

  const nextDirectory = operatorDirectory
    .map((entry) =>
      entry.username === normalizedUsername
        ? normalizeOperatorEntry({
            ...entry,
            discordUserId,
          })
        : entry,
    )
    .sort((left, right) => left.label.localeCompare(right.label, "id-ID"));

  writeStorageObject(STAFF_OPERATOR_STORAGE_KEY, nextDirectory);

  return {
    operator: nextDirectory.find((entry) => entry.username === normalizedUsername) || null,
    operators: nextDirectory,
    message: "Discord User ID petugas berhasil diperbarui.",
  };
}

export async function deleteStaffOperator(
  { username },
  currentUser = null,
) {
  const operatorDirectory = loadOperatorDirectory(currentUser);
  const normalizedUsername = String(username || "").trim().toLowerCase();
  const currentUsername = String(currentUser?.username || "")
    .trim()
    .toLowerCase();

  if (!normalizedUsername) {
    throw new Error("Username petugas tidak valid.");
  }

  if (normalizedUsername === currentUsername) {
    throw new Error("Akun yang sedang aktif tidak bisa dihapus.");
  }

  const targetOperator = operatorDirectory.find(
    (entry) => entry.username === normalizedUsername,
  );

  if (!targetOperator) {
    throw new Error("Petugas tidak ditemukan.");
  }

  try {
    await deleteStaffOperatorAccount(normalizedUsername);
  } catch (error) {
    if (error?.status !== 404) {
      throw error;
    }
  }

  const nextDirectory = operatorDirectory
    .filter((entry) => entry.username !== normalizedUsername)
    .sort((left, right) => left.label.localeCompare(right.label, "id-ID"));

  writeStorageObject(STAFF_OPERATOR_STORAGE_KEY, nextDirectory);

  return {
    operator: targetOperator,
    operators: nextDirectory,
    message: "Petugas berhasil dihapus.",
  };
}

export function createEmptyStaffPortalSnapshot() {
  return getEmptyPortalSnapshot();
}
