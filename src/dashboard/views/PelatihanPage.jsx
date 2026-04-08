/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Pelatihan Page
 * Purpose: Area kerja aktif pelatih untuk melaporkan kandidat per sesi.
 */

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import TrainingSessionReportModal from "../components/TrainingSessionReportModal";
import {
  formatArchiveTimestamp,
  formatOperationalDateLabel,
  isRecruitmentReportComplete,
  isTrainingSessionDispatched,
  normalizeRecruitmentReport,
  normalizeTrainingSession,
} from "../data/recruitmentData";
import { useStaffPortalData } from "../hooks/useStaffPortalData";

function SessionMetricCard({ label, value, detail, accent = "stone" }) {
  const accentClassMap = {
    stone: "border-stone-500/20 text-stone-200",
    lime: "border-lime-400/20 text-lime-300",
    amber: "border-amber-300/20 text-amber-200",
    rose: "border-rose-400/20 text-rose-200",
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-[#171717] p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] md:p-4">
      <div
        className={`inline-flex rounded-full border px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accentClassMap[accent] ?? accentClassMap.stone}`}
      >
        {label}
      </div>
      <p className="mt-3 font-sans text-[2rem] font-bold text-stone-100">{value}</p>
      <p className="mt-1.5 text-[13px] leading-5 text-stone-400">{detail}</p>
    </div>
  );
}

function OperatorChip({ operator }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-3.5 py-3.5">
      <p className="font-sans text-base font-bold text-stone-100 md:text-lg">{operator.label}</p>
      <p className="mt-1.5 font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
        {operator.unit} • {operator.username}
      </p>
    </div>
  );
}

function PageStatePanel({
  eyebrow = "Channel Operasional",
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#151515] p-6 text-center">
      <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-sans text-[2rem] font-bold text-stone-100">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-400">
        {description}
      </p>
    </div>
  );
}

function getCandidateStatusLabel(report, dispatched) {
  if (dispatched && report?.sentAt) {
    return "Terkirim";
  }

  if (report && isRecruitmentReportComplete(report)) {
    return "Laporan Lengkap";
  }

  if (report) {
    return "Laporan Tersimpan";
  }

  return "Belum Dilaporkan";
}

function getReportTimestampValue(report) {
  return new Date(report.updatedAt || report.createdAt || 0).getTime();
}

function getLatestReportsByCandidate(reports = []) {
  const reportMap = new Map();

  reports.forEach((report) => {
    if (!report?.candidateIdentity) {
      return;
    }

    const currentReport = reportMap.get(report.candidateIdentity);
    if (!currentReport || getReportTimestampValue(report) >= getReportTimestampValue(currentReport)) {
      reportMap.set(report.candidateIdentity, report);
    }
  });

  return [...reportMap.values()];
}

function createSupplementSignature(entry) {
  return `${String(entry?.question || "").trim()}::${String(entry?.notes || "").trim()}`;
}

function isReportVisualizationSynced(sourceReport, overrideReport) {
  if (!sourceReport || !overrideReport) {
    return false;
  }

  const sourceSupplements = Array.isArray(sourceReport.additionalReports)
    ? sourceReport.additionalReports
    : [];
  const overrideSupplements = Array.isArray(overrideReport.additionalReports)
    ? overrideReport.additionalReports
    : [];

  if (
    sourceReport.status !== overrideReport.status ||
    sourceReport.question !== overrideReport.question ||
    sourceReport.notes !== overrideReport.notes ||
    sourceReport.age !== overrideReport.age ||
    sourceReport.gender !== overrideReport.gender ||
    sourceSupplements.length !== overrideSupplements.length
  ) {
    return false;
  }

  const sourceSignatureCounts = sourceSupplements.reduce((counts, entry) => {
    const signature = createSupplementSignature(entry);
    counts.set(signature, (counts.get(signature) || 0) + 1);
    return counts;
  }, new Map());

  return overrideSupplements.every((entry) => {
    const signature = createSupplementSignature(entry);
    const currentCount = sourceSignatureCounts.get(signature) || 0;

    if (currentCount <= 0) {
      return false;
    }

    sourceSignatureCounts.set(signature, currentCount - 1);
    return true;
  });
}

function buildDraftReportForCandidate(sessionId, trainingSession, candidate) {
  return normalizeRecruitmentReport({
    id: `${sessionId}::${candidate.identity}`,
    sessionId,
    sessionDate: trainingSession.scheduledDate,
    candidateIdentity: candidate.identity,
    category: candidate.category,
    name: candidate.roblox,
    discord: candidate.discord,
    group: trainingSession.golongan,
    status: "PROSES",
    age: `${candidate.age} Tahun`,
    gender: candidate.gender,
    question: `Evaluasi awal untuk ${candidate.roblox} pada ${trainingSession.golongan}?`,
    notes:
      "Isi hasil observasi pelatih, progres rekrutmen, dan rekomendasi berikutnya di sini.",
    operators: trainingSession.operators,
    additionalReports: [],
    sentAt: null,
    createdAt: trainingSession.createdAt,
    updatedAt: trainingSession.updatedAt,
  });
}

function CandidateReportRow({
  candidate,
  report,
  dispatched,
  busy = false,
  highlighted = false,
  onEliminateCandidate,
  onOpenReport,
}) {
  const ready = report ? isRecruitmentReportComplete(report) : false;
  const statusLabel = getCandidateStatusLabel(report, dispatched);
  const additionalCount = report?.additionalReports.length || 0;
  const displayAge = String(report?.age || `${candidate.age} Tahun`).trim();
  const displayGender = String(report?.gender || candidate.gender).trim();
  const latestReportTimestamp = report
    ? new Date(report.updatedAt || report.createdAt).toLocaleString("id-ID")
    : "";

  return (
    <article
      className={[
        "rounded-2xl border p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition",
        ready
          ? "border-emerald-400/20 bg-emerald-400/[0.05]"
          : "border-white/8 bg-[#171717]",
        highlighted ? "ring-1 ring-amber-300/25" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-sans text-xl font-bold text-stone-100 md:text-[1.6rem]">
            {candidate.roblox}
          </p>
          <p className="mt-1.5 text-[13px] text-stone-400">{candidate.discord}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "rounded-full border px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.16em]",
              ready
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                : "border-amber-300/20 bg-amber-300/10 text-amber-200",
            ].join(" ")}
          >
            {statusLabel}
          </span>
          <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300">
            {candidate.categoryLabel}
          </span>
          <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-sky-200">
            {additionalCount} tambahan
          </span>
          {busy ? (
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200">
              Memproses...
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Usia
          </p>
          <p className="mt-2 font-public text-sm font-bold text-stone-200">
            {displayAge}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Gender
          </p>
          <p className="mt-2 font-public text-sm font-bold uppercase text-stone-200">
            {displayGender}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Update Terakhir
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            {latestReportTimestamp || "-"}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3 md:col-span-2">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Ringkasan Laporan
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            {report
              ? `${report.status} • ${report.question}${additionalCount > 0 ? ` • ${additionalCount} laporan tambahan tersimpan.` : ""}`
              : "Belum ada laporan yang dibuat untuk kandidat ini."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 md:flex-row md:justify-end">
        {!dispatched ? (
          <>
            <button
              type="button"
              onClick={onEliminateCandidate}
              disabled={busy}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Memproses..." : "Eliminasi Kandidat"}
            </button>
            <button
              type="button"
              onClick={onOpenReport}
              disabled={busy}
              className={[
                "rounded-xl px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-60",
                ready
                  ? "border border-amber-300/20 bg-amber-300/10 text-amber-200 hover:bg-amber-300/15"
                  : "bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] text-[#3C2F00] hover:brightness-105",
              ].join(" ")}
            >
              {report ? "Edit Laporan" : "Tambah Laporan"}
            </button>
          </>
        ) : (
          <p className="text-[12px] leading-6 text-stone-400">
            Sesi ini sudah ditutup. Review dan perubahan lanjutan dipindahkan ke halaman hasil laporan.
          </p>
        )}
      </div>
    </article>
  );
}

export default function PelatihanPage() {
  const { sessionId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    trainingSessions,
    reports,
    loading: portalLoading,
    error: portalError,
    eliminateCandidate,
    saveRecruitmentReport,
    dispatchTrainingSession,
    cancelTrainingSession,
  } = useStaffPortalData();

  const [activeReportId, setActiveReportId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [reportSubmittingCandidateIdentity, setReportSubmittingCandidateIdentity] = useState("");
  const [reportVisualOverrides, setReportVisualOverrides] = useState({});
  const [sessionNotice, setSessionNotice] = useState(
    "Panel pelatihan aktif. Tambahkan laporan tiap kandidat satu per satu, lalu kirim sesi lewat satu pintu ke Review Laporan setelah semua kandidat memiliki laporan.",
  );
  const initialSession =
    location.state?.initialSession?.id === sessionId
      ? normalizeTrainingSession(location.state.initialSession)
      : null;
  const initialReports = useMemo(
    () =>
      Array.isArray(location.state?.initialReports)
        ? location.state.initialReports.map((report, index) =>
            normalizeRecruitmentReport(report, index),
          )
        : [],
    [location.state],
  );

  const trainingSession = useMemo(
    () => trainingSessions.find((session) => session.id === sessionId) ?? initialSession,
    [initialSession, sessionId, trainingSessions],
  );
  const sourceSessionReports = useMemo(
    () => {
      const persistedReports = reports.filter((report) => report.sessionId === sessionId);

      if (persistedReports.length > 0 || initialReports.length === 0) {
        return persistedReports;
      }

      return initialReports;
    },
    [initialReports, reports, sessionId],
  );
  const effectiveSourceSessionReports = useMemo(
    () => {
      const sourceReportIds = new Set(sourceSessionReports.map((report) => report.id));
      const optimisticOnlyReports = Object.values(reportVisualOverrides)
        .filter(
          (report) =>
            report?.sessionId === sessionId && !sourceReportIds.has(report.id),
        )
        .map((report, index) => normalizeRecruitmentReport(report, index));

      return [
        ...sourceSessionReports.map((report) =>
          normalizeRecruitmentReport(reportVisualOverrides[report.id] ?? report),
        ),
        ...optimisticOnlyReports,
      ];
    },
    [reportVisualOverrides, sessionId, sourceSessionReports],
  );
  const sessionReports = useMemo(
    () => getLatestReportsByCandidate(effectiveSourceSessionReports),
    [effectiveSourceSessionReports],
  );
  const reportMap = useMemo(
    () => new Map(sessionReports.map((report) => [report.candidateIdentity, report])),
    [sessionReports],
  );

  useEffect(() => {
    setReportVisualOverrides((currentOverrides) => {
      let hasChanges = false;
      const nextOverrides = { ...currentOverrides };
      const persistedIds = new Set(sourceSessionReports.map((report) => report.id));

      Object.keys(nextOverrides).forEach((reportId) => {
        if (!persistedIds.has(reportId)) {
          delete nextOverrides[reportId];
          hasChanges = true;
        }
      });

      sourceSessionReports.forEach((report) => {
        const normalizedReport = normalizeRecruitmentReport(report);
        const override = nextOverrides[normalizedReport.id];

        if (override && isReportVisualizationSynced(normalizedReport, override)) {
          delete nextOverrides[normalizedReport.id];
          hasChanges = true;
        }
      });

      return hasChanges ? nextOverrides : currentOverrides;
    });
  }, [sourceSessionReports]);

  const setOptimisticReport = (report) => {
    setReportVisualOverrides((currentOverrides) => ({
      ...currentOverrides,
      [report.id]: report,
    }));
  };

  const restoreReportVisualization = (report) => {
    if (!report) {
      return;
    }

    setReportVisualOverrides((currentOverrides) => ({
      ...currentOverrides,
      [report.id]: report,
    }));
  };

  const reconcileSavedReport = (savedReport, snapshot) => {
    const syncedReport = Array.isArray(snapshot?.reports)
      ? snapshot.reports.find((entry) => entry.id === savedReport.id)
      : null;

    setReportVisualOverrides((currentOverrides) => {
      if (!syncedReport) {
        return {
          ...currentOverrides,
          [savedReport.id]: savedReport,
        };
      }

      const normalizedSyncedReport = normalizeRecruitmentReport(syncedReport);

      if (!isReportVisualizationSynced(normalizedSyncedReport, savedReport)) {
        return {
          ...currentOverrides,
          [savedReport.id]: savedReport,
        };
      }

      if (!(savedReport.id in currentOverrides)) {
        return currentOverrides;
      }

      const nextOverrides = { ...currentOverrides };
      delete nextOverrides[savedReport.id];
      return nextOverrides;
    });
  };
  const activeReport = useMemo(() => {
    if (!activeReportId || !trainingSession) {
      return null;
    }

    const existingReport =
      sessionReports.find((report) => report.id === activeReportId) ?? null;

    if (existingReport) {
      return existingReport;
    }

    const candidate = trainingSession.candidates.find(
      (entry) => `${sessionId}::${entry.identity}` === activeReportId,
    );

    if (!candidate) {
      return null;
    }

    return buildDraftReportForCandidate(sessionId, trainingSession, candidate);
  }, [activeReportId, sessionId, sessionReports, trainingSession]);

  const dispatched = trainingSession
    ? isTrainingSessionDispatched(trainingSession, sessionReports)
    : false;
  const reportedCount = sessionReports.length;
  const completedCount = sessionReports.filter(isRecruitmentReportComplete).length;
  const supplementCount = sessionReports.reduce(
    (total, report) => total + report.additionalReports.length,
    0,
  );
  const pendingCount = Math.max(
    0,
    (trainingSession?.candidates.length || 0) - reportedCount,
  );
  const allCandidatesHaveReports =
    (trainingSession?.candidates.length || 0) > 0 && pendingCount === 0;
  const resolvedSessionNotice = portalLoading
    ? "Memuat data sesi pelatihan..."
    : portalError ||
      (dispatched
        ? "Sesi ini sudah ditutup dan dipindahkan ke Review Laporan. Lanjutan pemeriksaan dan pengiriman akhir dilakukan dari halaman review."
        : sessionNotice);

  const handleSaveReport = async (updatedReport) => {
    if (!trainingSession) {
      return;
    }

    const normalizedReport = normalizeRecruitmentReport(updatedReport);
    const previousReport =
      sessionReports.find((report) => report.id === normalizedReport.id) ?? null;
    const reportExists = sessionReports.some(
      (report) => report.candidateIdentity === normalizedReport.candidateIdentity,
    );
    const nextSessionReports = getLatestReportsByCandidate([
      ...sessionReports.filter(
        (report) => report.candidateIdentity !== normalizedReport.candidateIdentity,
      ),
      normalizedReport,
    ]);
    const allCandidatesCovered = trainingSession.candidates.every((candidate) =>
      nextSessionReports.some(
        (report) => report.candidateIdentity === candidate.identity,
      ),
    );
    const nextPendingCount = Math.max(
      0,
      trainingSession.candidates.length - nextSessionReports.length,
    );

    try {
      setReportSubmittingCandidateIdentity(normalizedReport.candidateIdentity);
      setSessionNotice(
        reportExists
          ? `Memperbarui laporan ${normalizedReport.name}...`
          : `Membuat laporan awal ${normalizedReport.name}...`,
      );
      setOptimisticReport(normalizedReport);
      const nextSnapshot = await saveRecruitmentReport(normalizedReport, {
        mode: reportExists ? "update" : "create",
      });
      reconcileSavedReport(normalizedReport, nextSnapshot);
      setSessionNotice(
        allCandidatesCovered
          ? `Laporan ${normalizedReport.name} disimpan pada ${formatArchiveTimestamp(
              normalizedReport.updatedAt,
            )}. Semua kandidat sudah memiliki laporan. Gunakan tombol Kirim Laporan untuk menutup sesi dan masuk ke Review Laporan.`
          : `Laporan ${normalizedReport.name} disimpan pada ${formatArchiveTimestamp(
              normalizedReport.updatedAt,
            )}. Tinggal ${nextPendingCount} kandidat lagi sebelum sesi bisa dikirim ke Review Laporan.`,
      );

      setActiveReportId(null);
    } catch (saveError) {
      restoreReportVisualization(previousReport);
      setSessionNotice(
        saveError?.message || "Gagal menyimpan laporan pelatihan ke backend.",
      );
      throw saveError;
    } finally {
      setReportSubmittingCandidateIdentity("");
    }
  };

  const handleDispatchSession = async () => {
    if (!trainingSession) {
      return;
    }

    if (dispatched) {
      navigate(`/dashboard/laporan-perekrutan/${trainingSession.id}`, { replace: true });
      return;
    }

    if (!allCandidatesHaveReports) {
      setSessionNotice(
        `Semua kandidat harus memiliki laporan terlebih dahulu. Saat ini masih ada ${pendingCount} kandidat yang belum dilaporkan.`,
      );
      return;
    }

    const dispatchTimestamp = new Date().toISOString();

    try {
      setDispatching(true);
      setSessionNotice(
        `Menutup sesi ${trainingSession.title} dan memindahkan seluruh laporan ke Review Laporan...`,
      );
      await dispatchTrainingSession(sessionId, sessionReports);
      navigate(`/dashboard/laporan-perekrutan/${trainingSession.id}`, {
        replace: true,
        state: {
          archiveNotice: `Sesi ${trainingSession.title} ditutup dan dipindahkan ke Review Laporan pada ${formatArchiveTimestamp(
            dispatchTimestamp,
          )}.`,
        },
      });
    } catch (dispatchError) {
      setSessionNotice(
        dispatchError?.message || "Gagal mengirim sesi ke hasil laporan.",
      );
    } finally {
      setDispatching(false);
    }
  };

  const handleEliminateCandidate = async (candidate) => {
    if (!trainingSession || dispatched) {
      return;
    }

    const targetReport =
      reportMap.get(candidate.identity) ??
      buildDraftReportForCandidate(sessionId, trainingSession, candidate);
    const shouldEliminate =
      typeof window === "undefined"
        ? true
        : window.confirm(
            `Eliminasi kandidat ${targetReport.name} akan menghapus kandidat ini dari sesi aktif. Lanjutkan?`,
          );

    if (!shouldEliminate) {
      return;
    }

    try {
      setReportSubmittingCandidateIdentity(targetReport.candidateIdentity);
      setSessionNotice(`Mengeliminasi kandidat ${targetReport.name}...`);
      setActiveReportId((currentReportId) =>
        currentReportId === targetReport.id ? null : currentReportId,
      );
      await eliminateCandidate(targetReport);
      setReportVisualOverrides((currentOverrides) => {
        if (!(targetReport.id in currentOverrides)) {
          return currentOverrides;
        }

        const nextOverrides = { ...currentOverrides };
        delete nextOverrides[targetReport.id];
        return nextOverrides;
      });
      setSessionNotice(
        `Kandidat ${targetReport.name} dieliminasi dari sesi aktif. Data kandidat tidak lagi muncul di pelatihan ini.`,
      );
    } catch (eliminateError) {
      setSessionNotice(
        eliminateError?.message || "Gagal mengeliminasi kandidat dari sesi aktif.",
      );
    } finally {
      setReportSubmittingCandidateIdentity("");
    }
  };

  const handleCancelSession = async () => {
    if (!trainingSession || dispatched || cancelling) {
      return;
    }

    const shouldCancel =
      typeof window === "undefined"
        ? true
        : window.confirm(
            `Batalkan sesi ${trainingSession.title}? Semua laporan sesi ini akan dihapus dan kandidat akan kembali ke dashboard.`,
          );

    if (!shouldCancel) {
      return;
    }

    try {
      setCancelling(true);
      await cancelTrainingSession(sessionId);
      navigate("/dashboard", { replace: true });
    } catch (cancelError) {
      setSessionNotice(
        cancelError?.message ||
          "Gagal membatalkan sesi. Coba ulang beberapa saat lagi.",
      );
    } finally {
      setCancelling(false);
    }
  };

  if (portalLoading && !trainingSession) {
    return (
      <PageStatePanel
        title="Memuat Sesi Pelatihan"
        description="Data kandidat, laporan, dan petugas sedang disinkronkan dari backend recruiter."
      />
    );
  }

  if (!trainingSession) {
    return (
      <div className="space-y-4">
        <PageStatePanel
          eyebrow="Dashboard Pelatih"
          title="Sesi Pelatihan Tidak Ditemukan"
          description="Sesi yang kamu buka belum tersedia di database atau sudah dihapus."
        />
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#151515] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-6">
          <div className="absolute left-0 top-8 h-12 w-1 bg-amber-300" />

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
                Dashboard Pelatih
              </p>
              <h1 className="mt-2.5 font-sans text-3xl font-bold uppercase text-stone-100 md:text-[2.75rem]">
                {trainingSession.title}
              </h1>
              <p className="mt-2.5 max-w-3xl text-[13px] leading-5 text-stone-400">
                Halaman ini dipakai untuk mengelola laporan pelatihan aktif.
                Tambahkan laporan tiap sipil atau PMC, lalu kirim sesi lewat satu pintu
                ke hasil review setelah semua kandidat memiliki laporan.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
              >
                Kembali
              </Link>
              {dispatched ? (
                <Link
                  to={`/dashboard/laporan-perekrutan/${trainingSession.id}`}
                  className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
                >
                  Buka Review
                </Link>
              ) : null}
              {!dispatched ? (
                <button
                  type="button"
                  onClick={handleCancelSession}
                  disabled={cancelling || dispatching || Boolean(reportSubmittingCandidateIdentity)}
                  className="inline-flex rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling ? "Membatalkan Sesi..." : "Cancel Sesi"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleDispatchSession}
                disabled={
                  dispatching ||
                  portalLoading ||
                  cancelling ||
                  Boolean(reportSubmittingCandidateIdentity) ||
                  (!dispatched && !allCandidatesHaveReports)
                }
                className="inline-flex rounded-xl bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {dispatched
                  ? "Buka Review Laporan"
                  : dispatching
                    ? "Menutup Sesi..."
                    : "Kirim Laporan"}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 px-3.5 py-3.5">
            <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Channel Operasional
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-200">{resolvedSessionNotice}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SessionMetricCard
            label="Tanggal Sesi"
            value={trainingSession.scheduledDate}
            detail={formatOperationalDateLabel(trainingSession.scheduledDate)}
            accent="stone"
          />
          <SessionMetricCard
            label="Petugas"
            value={trainingSession.operators.length}
            detail="Petugas aktif pada sesi pelatihan ini."
            accent="amber"
          />
          <SessionMetricCard
            label="Sudah Dilaporkan"
            value={reportedCount}
            detail="Kandidat yang sudah memiliki laporan utama."
            accent="stone"
          />
          <SessionMetricCard
            label="Status Final"
            value={completedCount}
            detail="Kandidat dengan status akhir LULUS atau GAGAL."
            accent="lime"
          />
          <SessionMetricCard
            label="Laporan Tambahan"
            value={supplementCount}
            detail="Total update lanjutan yang tersimpan pada sesi ini."
            accent="amber"
          />
          <SessionMetricCard
            label="Belum Dilaporkan"
            value={pendingCount}
            detail="Kandidat yang belum memiliki draft laporan sama sekali."
            accent="rose"
          />
        </div>

        <section className="rounded-2xl border border-white/8 bg-[#171717] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
                Petugas Aktif
              </p>
              <h2 className="mt-1.5 font-sans text-xl font-bold text-stone-100">
                Tim Pelatih Sesi Ini
              </h2>
            </div>

            <div className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
              {trainingSession.golongan} • {trainingSession.createdBy}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {trainingSession.operators.map((operator) => (
              <OperatorChip key={operator.id} operator={operator} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/8 bg-[#171717] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
                Sipil / PMC
              </p>
              <h2 className="mt-1.5 font-sans text-xl font-bold text-stone-100">
                Kandidat Aktif Pelatihan
              </h2>
            </div>

            <div className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
              {trainingSession.candidates.length} kandidat •{" "}
              {dispatched ? "sudah masuk histori" : "belum masuk histori"}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {portalLoading && trainingSession.candidates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400">
                Data kandidat sedang dimuat dari backend...
              </div>
            ) : (
              trainingSession.candidates.map((candidate) => (
                <CandidateReportRow
                  key={candidate.identity}
                  candidate={candidate}
                  report={reportMap.get(candidate.identity)}
                  dispatched={dispatched}
                  busy={
                    reportSubmittingCandidateIdentity === candidate.identity
                  }
                  highlighted={Boolean(reportVisualOverrides[reportMap.get(candidate.identity)?.id])}
                  onEliminateCandidate={() => handleEliminateCandidate(candidate)}
                  onOpenReport={() =>
                    setActiveReportId(
                      reportMap.get(candidate.identity)?.id ??
                        `${sessionId}::${candidate.identity}`,
                    )
                  }
                />
              ))
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {activeReport ? (
          <TrainingSessionReportModal
            key={activeReport.id}
            report={activeReport}
            onClose={() => setActiveReportId(null)}
            onEliminate={() => {
              const targetCandidate = trainingSession?.candidates.find(
                (candidate) => candidate.identity === activeReport.candidateIdentity,
              );

              if (!targetCandidate) {
                return Promise.resolve();
              }

              return handleEliminateCandidate(targetCandidate);
            }}
            onSave={handleSaveReport}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
