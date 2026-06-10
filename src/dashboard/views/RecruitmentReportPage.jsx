/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Recruitment Report Page
 * Purpose: Halaman internal detail laporan perekrutan per sesi pelatihan.
 */

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArchiveReportCard,
  ArchiveReportEditorModal,
  ArchiveReportSupplementModal,
} from "../components/RecruitmentReportComponents";
import ArchiveReportDispatchModal from "../components/RecruitmentDispatchModal";
import {
  formatArchiveTimestamp,
  formatOperationalDateLabel,
  formatRelativeMinutes,
  getRecruitmentReportValidationMessage,
  isArchivePendingDispatch,
  normalizeArchiveSupplement,
  normalizeRecruitmentReport,
} from "../data/recruitmentData";
import { useStaffPortalData } from "../hooks/useStaffPortalData";
import { useAuth } from "../../lib/auth";
import { dispatchRecruitmentSessionReport } from "../../lib/recruitmentDispatchApi";

function PageStatePanel({
  eyebrow = "Recruitment Archive",
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

function DispatchArchivePanel({ dispatchRecord }) {
  if (!dispatchRecord) {
    return null;
  }

  const attachmentFileNames =
    dispatchRecord.attachmentFileNames?.length > 0
      ? dispatchRecord.attachmentFileNames
      : dispatchRecord.attachmentFileName
        ? [dispatchRecord.attachmentFileName]
        : [];
  const attachmentPreviewUrls =
    dispatchRecord.attachmentPreviewUrls?.length > 0
      ? dispatchRecord.attachmentPreviewUrls
      : dispatchRecord.attachmentPreviewUrl
        ? [dispatchRecord.attachmentPreviewUrl]
        : [];
  return (
    <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-public text-[10px] uppercase tracking-[0.24em] text-emerald-300">
            Dispatch Terakhir
          </p>
          <h2 className="mt-2 font-sans text-xl font-bold uppercase text-stone-100">
            Format Baru Terkirim Ke Resimen
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-300">
            {dispatchRecord.description ||
              "Tidak ada deskripsi dispatch yang tersimpan."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/24 bg-emerald-400/10 px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Sesi Telah Selesai
            </span>
            <span className="rounded-full border border-emerald-400/24 bg-emerald-400/10 px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Laporan Terkirim
            </span>
            <span className="rounded-full border border-amber-300/24 bg-amber-300/10 px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.14em] text-amber-100">
              Pin & Sertijab Manual
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:min-w-[360px]">
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
              Waktu Kirim
            </p>
            <p className="mt-2 text-sm text-stone-200">
              {formatArchiveTimestamp(dispatchRecord.sentAt)}
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
              Lampiran
            </p>
            <p className="mt-2 text-sm text-stone-200">
              {dispatchRecord.attachmentCount ||
                attachmentFileNames.length ||
                0}{" "}
              foto
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
              Tag Instruktur
            </p>
            <p className="mt-2 text-sm text-stone-200">
              {dispatchRecord.mentionedOperatorCount} petugas
            </p>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
              Tag Peserta
            </p>
            <p className="mt-2 text-sm text-stone-200">
              {dispatchRecord.mentionedRegistrantCount} akun
            </p>
          </div>
        </div>
      </div>

      {attachmentFileNames.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            File Terkirim
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-200">
            {attachmentFileNames.join(", ")}
          </p>
        </div>
      ) : null}

      {attachmentPreviewUrls.length > 0 ? (
        <div
          className={[
            "mt-4 grid gap-3",
            attachmentPreviewUrls.length > 1 ? "md:grid-cols-2" : "",
          ].join(" ")}
        >
          {attachmentPreviewUrls.map((previewUrl, index) => (
            <div
              key={`${previewUrl.slice(0, 48)}-${index}`}
              className="overflow-hidden rounded-2xl border border-white/8 bg-black/20"
            >
              <img
                src={previewUrl}
                alt={
                  attachmentFileNames[index] ||
                  dispatchRecord.attachmentFileName ||
                  `Lampiran dispatch ${index + 1}`
                }
                className="h-[280px] w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
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

export default function RecruitmentReportPage() {
  const { sessionId = "" } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const {
    reports,
    trainingSessions,
    loading: reportsLoading,
    error: reportsError,
    saveRecruitmentReport,
    dispatchTrainingSession,
    eliminateCandidate,
  } = useStaffPortalData();

  const [systemTime, setSystemTime] = useState(new Date());
  const [editorReport, setEditorReport] = useState(null);
  const [supplementEditorState, setSupplementEditorState] = useState(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchSubmitting, setDispatchSubmitting] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState("");
  const [reportSubmittingId, setReportSubmittingId] = useState("");
  const [reportVisualOverrides, setReportVisualOverrides] = useState({});
  const [archiveNotice, setArchiveNotice] = useState(
    location.state?.archiveNotice ||
      "Channel siap untuk sinkronisasi laporan ke database.",
  );
  const dispatchOpenedFromTindakanRef = useRef(false);
  const focusReportId = String(location.state?.focusReportId || "");

  useEffect(() => {
    const interval = window.setInterval(() => setSystemTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const trainingSession = useMemo(
    () => trainingSessions.find((session) => session.id === sessionId) ?? null,
    [sessionId, trainingSessions],
  );
  const dispatchRecord = trainingSession?.dispatchRecord || null;
  const persistedSessionReports = useMemo(
    () => reports.filter((report) => report.sessionId === sessionId),
    [reports, sessionId],
  );
  const sessionReports = useMemo(
    () =>
      persistedSessionReports
        .map((report) =>
          normalizeRecruitmentReport(
            reportVisualOverrides[report.id] ?? report,
          ),
        )
        .sort(
          (left, right) =>
            new Date(right.updatedAt).getTime() -
            new Date(left.updatedAt).getTime(),
        ),
    [persistedSessionReports, reportVisualOverrides],
  );

  useEffect(() => {
    setReportVisualOverrides((currentOverrides) => {
      let hasChanges = false;
      const nextOverrides = { ...currentOverrides };
      const persistedIds = new Set(
        persistedSessionReports.map((report) => report.id),
      );

      Object.keys(nextOverrides).forEach((reportId) => {
        if (!persistedIds.has(reportId)) {
          delete nextOverrides[reportId];
          hasChanges = true;
        }
      });

      persistedSessionReports.forEach((report) => {
        const normalizedReport = normalizeRecruitmentReport(report);
        const override = nextOverrides[normalizedReport.id];

        if (
          override &&
          isReportVisualizationSynced(normalizedReport, override)
        ) {
          delete nextOverrides[normalizedReport.id];
          hasChanges = true;
        }
      });

      return hasChanges ? nextOverrides : currentOverrides;
    });
  }, [persistedSessionReports]);

  useEffect(() => {
    if (
      dispatchOpenedFromTindakanRef.current ||
      !location.state?.openDispatch ||
      !trainingSession ||
      sessionReports.length === 0
    ) {
      return;
    }

    dispatchOpenedFromTindakanRef.current = true;
    setArchiveNotice(
      "Dibuka dari Perlu Tindakan. Selesaikan dispatch laporan lewat modal ini.",
    );
    setDispatchModalOpen(true);
  }, [location.state?.openDispatch, sessionReports.length, trainingSession]);

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

  const latestUpdatedAt = useMemo(() => {
    return sessionReports.reduce((latestTimestamp, report) => {
      const reportTimestamp = new Date(report.updatedAt).getTime();
      const supplementTimestamp = report.additionalReports.reduce(
        (latestSupplement, entry) => {
          const entryTimestamp = new Date(entry.updatedAt).getTime();
          return entryTimestamp > latestSupplement
            ? entryTimestamp
            : latestSupplement;
        },
        0,
      );

      return Math.max(latestTimestamp, reportTimestamp, supplementTimestamp);
    }, 0);
  }, [sessionReports]);

  const latestUpdatedDate = latestUpdatedAt
    ? new Date(latestUpdatedAt)
    : systemTime;
  const pendingDispatchCount = sessionReports.filter((report) =>
    isArchivePendingDispatch(report),
  ).length;
  const lastReportLabel = sessionReports.length
    ? formatRelativeMinutes(latestUpdatedDate, systemTime)
    : "Belum Ada";
  const resolvedArchiveNotice = reportSubmitting
    ? reportSubmitting
    : dispatchSubmitting
      ? "Mengirim laporan sesi ke resimen..."
      : reportsLoading
        ? "Memuat arsip laporan dari database..."
        : reportsError ||
          archiveNotice ||
          (dispatchRecord
            ? `Dispatch terakhir tercatat pada ${formatArchiveTimestamp(dispatchRecord.sentAt)}.`
            : "");

  const handleDispatchReports = async () => {
    if (dispatchSubmitting || reportSubmitting) {
      return;
    }

    if (sessionReports.length === 0) {
      setArchiveNotice("Belum ada laporan sesi yang bisa dikirim ke resimen.");
      return;
    }

    const invalidReport = sessionReports
      .map((report) => ({
        report,
        message: getRecruitmentReportValidationMessage(report, {
          requireFinalStatus: true,
        }),
      }))
      .find((entry) => entry.message);

    if (invalidReport) {
      setArchiveNotice(
        `Laporan ${invalidReport.report.name} belum siap dikirim: ${invalidReport.message}`,
      );
      return;
    }

    setDispatchModalOpen(true);
  };

  const handleSubmitDispatch = async ({ description, attachments }) => {
    const dispatchTimestamp = new Date().toISOString();
    const invalidReport = sessionReports
      .map((report) => ({
        report,
        message: getRecruitmentReportValidationMessage(report, {
          requireFinalStatus: true,
        }),
      }))
      .find((entry) => entry.message);

    if (invalidReport) {
      const message = `Laporan ${invalidReport.report.name} belum siap dikirim: ${invalidReport.message}`;
      setArchiveNotice(message);
      throw new Error(message);
    }

    try {
      setDispatchSubmitting(true);
      setArchiveNotice("Mengirim laporan sesi ke resimen...");
      const dispatchResult = await dispatchRecruitmentSessionReport({
        session: trainingSession,
        reports: sessionReports,
        description,
        attachments,
        requestedBy: user,
      });

      await dispatchTrainingSession(sessionId, sessionReports, {
        description,
        attachments,
        dispatchResult,
      });
      setArchiveNotice(
        `${sessionReports.length} laporan berhasil dikirim ke resimen pada ${formatArchiveTimestamp(
          new Date(dispatchTimestamp),
        )}. Pin dan Sertijab diproses manual lewat menu terpisah.`,
      );
      return dispatchResult;
    } catch (dispatchError) {
      setArchiveNotice(
        dispatchError?.message || "Gagal mengirim laporan sesi ke resimen.",
      );
      throw dispatchError;
    } finally {
      setDispatchSubmitting(false);
    }
  };

  const handleSaveReport = async (updatedReport) => {
    const normalizedReport = normalizeRecruitmentReport(updatedReport);
    const previousReport =
      sessionReports.find((report) => report.id === normalizedReport.id) ??
      null;

    try {
      setReportSubmittingId(normalizedReport.id);
      setReportSubmitting(`Memperbarui laporan ${normalizedReport.name}...`);
      setOptimisticReport(normalizedReport);
      const nextSnapshot = await saveRecruitmentReport(normalizedReport, {
        mode: "update",
      });
      reconcileSavedReport(normalizedReport, nextSnapshot);
      setEditorReport(null);
      setArchiveNotice(
        `Laporan ${normalizedReport.name} diperbarui pada ${formatArchiveTimestamp(
          new Date(normalizedReport.updatedAt),
        )}.`,
      );
    } catch (saveError) {
      restoreReportVisualization(previousReport);
      setArchiveNotice(
        saveError?.message || "Gagal memperbarui laporan perekrutan.",
      );
    } finally {
      setReportSubmitting("");
      setReportSubmittingId("");
    }
  };

  const handleSaveSupplement = async (reportId, supplement) => {
    const normalizedSupplement = normalizeArchiveSupplement(supplement);
    const isEditMode = supplementEditorState?.mode === "edit";
    const targetReport = sessionReports.find(
      (report) => report.id === reportId,
    );

    if (!targetReport) {
      return;
    }

    const nextReport = normalizeRecruitmentReport({
      ...targetReport,
      additionalReports: isEditMode
        ? targetReport.additionalReports.map((entry) =>
            entry.id === normalizedSupplement.id ? normalizedSupplement : entry,
          )
        : [normalizedSupplement, ...targetReport.additionalReports],
      updatedAt: normalizedSupplement.updatedAt,
    });

    try {
      setReportSubmittingId(targetReport.id);
      setReportSubmitting(
        isEditMode
          ? `Memperbarui laporan tambahan ${targetReport.name}...`
          : `Menambahkan laporan tambahan ${targetReport.name}...`,
      );
      setOptimisticReport(nextReport);
      const nextSnapshot = await saveRecruitmentReport(nextReport, {
        mode: "update",
      });
      reconcileSavedReport(nextReport, nextSnapshot);
      setSupplementEditorState(null);
      setArchiveNotice(
        `Laporan tambahan untuk ${targetReport.name} ${isEditMode ? "diperbarui" : "ditambahkan"} pada ${formatArchiveTimestamp(
          new Date(normalizedSupplement.updatedAt),
        )}.`,
      );
    } catch (saveError) {
      restoreReportVisualization(targetReport);
      setArchiveNotice(
        saveError?.message || "Gagal menyimpan laporan tambahan.",
      );
    } finally {
      setReportSubmitting("");
      setReportSubmittingId("");
    }
  };

  const handleDeleteSupplement = async (reportId, supplementId) => {
    const targetReport = sessionReports.find(
      (report) => report.id === reportId,
    );
    const targetSupplement = targetReport?.additionalReports.find(
      (entry) => entry.id === supplementId,
    );

    if (!targetReport || !targetSupplement) {
      return;
    }

    const shouldDelete =
      typeof window === "undefined"
        ? true
        : window.confirm(
            `Hapus laporan tambahan untuk ${targetReport.name}? Tindakan ini tidak bisa dibatalkan.`,
          );

    if (!shouldDelete) {
      return;
    }

    const deletedAt = new Date().toISOString();
    const nextReport = normalizeRecruitmentReport({
      ...targetReport,
      additionalReports: targetReport.additionalReports.filter(
        (entry) => entry.id !== supplementId,
      ),
      updatedAt: deletedAt,
    });

    try {
      setReportSubmittingId(targetReport.id);
      setReportSubmitting(`Menghapus laporan tambahan ${targetReport.name}...`);
      setOptimisticReport(nextReport);
      const nextSnapshot = await saveRecruitmentReport(nextReport, {
        mode: "update",
      });
      reconcileSavedReport(nextReport, nextSnapshot);
      setSupplementEditorState(null);
      setArchiveNotice(
        `Laporan tambahan ${targetReport.name} dihapus pada ${formatArchiveTimestamp(
          new Date(deletedAt),
        )}.`,
      );
    } catch (deleteError) {
      restoreReportVisualization(targetReport);
      setArchiveNotice(
        deleteError?.message || "Gagal menghapus laporan tambahan.",
      );
    } finally {
      setReportSubmitting("");
      setReportSubmittingId("");
    }
  };

  const handleEliminateCandidate = async (reportId) => {
    const targetReport = sessionReports.find(
      (report) => report.id === reportId,
    );

    if (!targetReport) {
      return;
    }

    const shouldEliminate =
      typeof window === "undefined"
        ? true
        : window.confirm(
            `Eliminasi kandidat ${targetReport.name} akan menghapus seluruh laporan kandidat ini. Lanjutkan?`,
          );

    if (!shouldEliminate) {
      return;
    }

    try {
      setReportSubmittingId(targetReport.id);
      setReportSubmitting(`Mengeliminasi kandidat ${targetReport.name}...`);
      await eliminateCandidate(targetReport);
      setReportVisualOverrides((currentOverrides) => {
        if (!(reportId in currentOverrides)) {
          return currentOverrides;
        }

        const nextOverrides = { ...currentOverrides };
        delete nextOverrides[reportId];
        return nextOverrides;
      });
      setEditorReport((currentReport) =>
        currentReport?.id === reportId ? null : currentReport,
      );
      setSupplementEditorState((currentState) =>
        currentState?.report.id === reportId ? null : currentState,
      );
      setArchiveNotice(
        `Kandidat ${targetReport.name} dieliminasi dan seluruh arsipnya dihapus.`,
      );
    } catch (eliminateError) {
      setArchiveNotice(
        eliminateError?.message || "Gagal mengeliminasi kandidat.",
      );
    } finally {
      setReportSubmitting("");
      setReportSubmittingId("");
    }
  };

  if (reportsLoading && !trainingSession) {
    return (
      <PageStatePanel
        title="Memuat Arsip Laporan"
        description="Data sesi, laporan, dan histori evaluasi sedang disinkronkan dari backend recruiter."
      />
    );
  }

  if (!trainingSession) {
    return (
      <div className="space-y-4">
        <PageStatePanel
          title="Sesi Tidak Ditemukan"
          description="Detail laporan ini hanya tersedia jika dibuka dari halaman Hasil Laporan."
        />
        <div className="text-center">
          <Link
            to="/dashboard/laporan"
            className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
          >
            Kembali ke Hasil Laporan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden border border-white/6 bg-[#141414] px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-6">
          <div className="absolute left-0 top-8 h-12 w-1 bg-amber-300" />

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
                Recruitment Archive
              </p>
              <h1 className="font-sans text-3xl font-bold uppercase leading-none text-stone-200 md:text-[2.8rem]">
                Laporan Perekrutan
              </h1>
              <p className="text-[13px] leading-5 text-stone-400">
                {trainingSession.title} •{" "}
                {formatOperationalDateLabel(trainingSession.scheduledDate)}
              </p>
            </div>

            <div className="text-left xl:text-right">
              <p className="font-public text-[10px] uppercase tracking-[0.12em] text-stone-200/40">
                System Timestamp
              </p>
              <p className="mt-1 font-mono text-sm text-stone-400">
                {formatArchiveTimestamp(systemTime)}
              </p>
            </div>
          </div>

          <div className="mt-6 h-px bg-[linear-gradient(90deg,rgba(87,83,78,0.30)_0%,rgba(87,83,78,0)_100%)]" />

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <button
                type="button"
                onClick={handleDispatchReports}
                disabled={dispatchSubmitting || Boolean(reportSubmitting)}
                className="inline-flex items-center gap-3 bg-stone-900 px-4 py-2 font-public text-[9px] uppercase tracking-[0.12em] text-stone-200 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
                  <path d="M14.5 1L1 7l4.8 1.9L7.7 14 14.5 1zm-8 6.2l5.2-3-3.7 4.6-.7-1.6-.8 0z" />
                </svg>
                {dispatchSubmitting
                  ? "mengirim..."
                  : "kirim laporan ke resimen"}
              </button>

              <Link
                to="/dashboard/laporan"
                className="inline-flex items-center gap-3 border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] uppercase tracking-[0.12em] text-stone-200 transition hover:bg-white/5"
              >
                Kembali ke hasil laporan
              </Link>
            </div>

            <div className="border border-white/6 bg-stone-950 px-4 py-2">
              <p className="font-public text-[10px] uppercase tracking-[0.12em] text-stone-300">
                {resolvedArchiveNotice}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {reportsLoading && sessionReports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/8 bg-[#151515] px-5 py-8 text-center text-sm text-stone-400 xl:col-span-2">
              Arsip laporan sedang dimuat dari backend...
            </div>
          ) : sessionReports.length > 0 ? (
            sessionReports.map((report) => (
              <ArchiveReportCard
                key={report.id}
                report={report}
                busy={
                  Boolean(reportSubmitting) && reportSubmittingId === report.id
                }
                highlighted={
                  Boolean(reportVisualOverrides[report.id]) ||
                  report.id === focusReportId
                }
                onAddSupplement={() =>
                  setSupplementEditorState({
                    mode: "create",
                    report,
                    supplement: null,
                  })
                }
                onEdit={() => setEditorReport(report)}
                onEditSupplement={(supplement) =>
                  setSupplementEditorState({
                    mode: "edit",
                    report,
                    supplement,
                  })
                }
                onEliminate={() => handleEliminateCandidate(report.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/8 bg-[#151515] px-5 py-8 text-center text-sm text-stone-400 xl:col-span-2">
              Belum ada laporan kandidat pada sesi ini.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/6 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div
              className={[
                "flex items-center gap-3 border-l-2 bg-stone-900 px-4 py-2",
                dispatchRecord ? "border-emerald-400" : "border-stone-400",
              ].join(" ")}
            >
              <div className="relative h-2 w-2">
                <span
                  className={`absolute inset-0 rounded-full ${dispatchRecord ? "bg-emerald-400/20" : "bg-stone-400/20"}`}
                />
                <span
                  className={`absolute inset-0 rounded-full ${dispatchRecord ? "bg-emerald-400" : "bg-stone-400"}`}
                />
              </div>
              <div>
                <p className="font-public text-[8px] font-bold uppercase tracking-[0.14em] text-stone-400">
                  Status Pelatihan
                </p>
                <p className="font-public text-[10px] font-bold uppercase tracking-[0.08em] text-stone-200">
                  {dispatchRecord ? "Selesai" : "Aktif"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l-2 border-yellow-600 bg-stone-900 px-4 py-2">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-amber-300">
                <path d="M8 1l1.8 3.8 4.2.6-3 2.9.7 4.1L8 10.5l-3.7 1.9.7-4.1-3-2.9 4.2-.6L8 1z" />
              </svg>
              <div>
                <p className="font-public text-[8px] font-bold uppercase tracking-[0.14em] text-yellow-600">
                  Laporan Terakhir
                </p>
                <p className="font-public text-[10px] font-bold uppercase tracking-[0.08em] text-stone-200">
                  {lastReportLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.18em] text-stone-200/50 md:flex-row md:items-center md:gap-8">
            <span>
              {trainingSession.operators
                .map((operator) => operator.label)
                .join(", ")}
            </span>
            <span>{trainingSession.golongan}</span>
            <span>{trainingSession.candidates.length} Kandidat</span>
          </div>
        </div>
      </div>

      <DispatchArchivePanel dispatchRecord={dispatchRecord} />

      <AnimatePresence>
        {dispatchModalOpen && trainingSession ? (
          <ArchiveReportDispatchModal
            trainingSession={trainingSession}
            reports={sessionReports}
            pendingDispatchCount={pendingDispatchCount}
            submitting={dispatchSubmitting}
            onClose={() =>
              dispatchSubmitting ? undefined : setDispatchModalOpen(false)
            }
            onSubmit={handleSubmitDispatch}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {editorReport ? (
          <ArchiveReportEditorModal
            key={editorReport.id}
            report={editorReport}
            onClose={() => setEditorReport(null)}
            onSave={handleSaveReport}
            onEliminate={() => handleEliminateCandidate(editorReport.id)}
            submitting={Boolean(reportSubmitting)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {supplementEditorState?.report ? (
          <ArchiveReportSupplementModal
            key={`${supplementEditorState.mode}-${supplementEditorState.supplement?.id ?? supplementEditorState.report.id}`}
            mode={supplementEditorState.mode}
            report={supplementEditorState.report}
            supplement={supplementEditorState.supplement}
            onClose={() => setSupplementEditorState(null)}
            onSave={handleSaveSupplement}
            onDelete={handleDeleteSupplement}
            submitting={Boolean(reportSubmitting)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
