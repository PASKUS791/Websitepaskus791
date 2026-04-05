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
    directoryMap.set(currentOperator.username, currentOperator);
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

function getDefaultQuestion(candidate, golongan) {
  return `Evaluasi awal untuk ${candidate.roblox} pada ${golongan}?`;
}

function getDefaultNotes() {
  return "Isi hasil observasi pelatih, progres rekrutmen, dan rekomendasi berikutnya di sini.";
}

function buildReportMetaKey(sessionId, candidateIdentity) {
  return `${sessionId}::${candidateIdentity}`;
}

function buildSessionDetailPayload(
  rawSession,
  candidateMap,
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
          },
          index,
        );
      })
    : [];

  const candidates = Array.isArray(rawSession.peserta)
    ? rawSession.peserta
        .map((entry, index) => {
          const identity = String(
            entry?.identitas_sipil?._id ||
              entry?.identitas_sipil ||
              entry?.candidateId ||
              "",
          );
          const matchedCandidate = candidateMap.get(identity);

          if (!matchedCandidate) {
            return null;
          }

          return {
            ...matchedCandidate,
            evaluation: Array.isArray(entry?.evaluasi) ? entry.evaluasi : [],
            participantIndex: index,
          };
        })
        .filter(Boolean)
    : [];

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
      status: sessionMeta.dispatchedAt ? "TERKIRIM" : "AKTIF",
      dispatchedAt: sessionMeta.dispatchedAt || null,
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

    return normalizeRecruitmentReport({
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
    });
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
  const payload = await createStaffRecruitmentSession({
    golongan,
    pelatih: selectedOperators.map((operator) => operator.id),
    peserta: selectedCandidates.map((candidate) => candidate.identity),
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

export async function saveStaffRecruitmentReport(report, currentUser = null) {
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

  await upsertStaffEvaluation(report.sessionId, report.candidateIdentity, evaluations);

  const reportMetaMap = loadReportMetaMap();
  const metaKey = buildReportMetaKey(report.sessionId, report.candidateIdentity);
  const currentMeta = reportMetaMap[metaKey] || {};
  const nextUpdatedAt = report.updatedAt || new Date().toISOString();

  reportMetaMap[metaKey] = {
    ...currentMeta,
    status: report.status,
    sentAt: currentMeta.sentAt || null,
    updatedAt: nextUpdatedAt,
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
) {
  const dispatchedAt = new Date().toISOString();
  const sessionMetaMap = loadSessionMetaMap();
  const currentMeta = sessionMetaMap[sessionId] || {};

  sessionMetaMap[sessionId] = {
    ...currentMeta,
    dispatchedAt,
    updatedAt: dispatchedAt,
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

export function createEmptyStaffPortalSnapshot() {
  return getEmptyPortalSnapshot();
}
