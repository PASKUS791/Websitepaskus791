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
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArchiveReportCard,
  ArchiveReportEditorModal,
  ArchiveReportSupplementModal,
} from "../components/RecruitmentReportComponents";
import {
  formatArchiveTimestamp,
  formatOperationalDateLabel,
  formatRelativeMinutes,
  isArchivePendingDispatch,
  normalizeArchiveSupplement,
  normalizeRecruitmentReport,
} from "../data/recruitmentData";
import { useStaffPortalData } from "../hooks/useStaffPortalData";

export default function RecruitmentReportPage() {
  const { sessionId = "" } = useParams();
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
  const [archiveNotice, setArchiveNotice] = useState(
    "Channel siap untuk sinkronisasi laporan ke database.",
  );

  useEffect(() => {
    const interval = window.setInterval(() => setSystemTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const trainingSession = useMemo(
    () => trainingSessions.find((session) => session.id === sessionId) ?? null,
    [sessionId, trainingSessions],
  );
  const sessionReports = useMemo(
    () => reports.filter((report) => report.sessionId === sessionId),
    [reports, sessionId],
  );

  const latestUpdatedAt = useMemo(() => {
    return sessionReports.reduce((latestTimestamp, report) => {
      const reportTimestamp = new Date(report.updatedAt).getTime();
      const supplementTimestamp = report.additionalReports.reduce(
        (latestSupplement, entry) => {
          const entryTimestamp = new Date(entry.updatedAt).getTime();
          return entryTimestamp > latestSupplement ? entryTimestamp : latestSupplement;
        },
        0,
      );

      return Math.max(latestTimestamp, reportTimestamp, supplementTimestamp);
    }, 0);
  }, [sessionReports]);

  const latestUpdatedDate = latestUpdatedAt ? new Date(latestUpdatedAt) : systemTime;
  const pendingDispatchCount = sessionReports.filter((report) =>
    isArchivePendingDispatch(report),
  ).length;
  const lastReportLabel = sessionReports.length
    ? formatRelativeMinutes(latestUpdatedDate, systemTime)
    : "Belum Ada";
  const resolvedArchiveNotice = reportsLoading
    ? "Memuat arsip laporan dari database..."
    : reportsError || archiveNotice;

  const handleDispatchReports = async () => {
    const dispatchTimestamp = new Date().toISOString();

    if (pendingDispatchCount === 0) {
      setArchiveNotice("Semua laporan sesi ini sudah terkirim ke resimen.");
      return;
    }

    try {
      await dispatchTrainingSession(sessionId, sessionReports);
      setArchiveNotice(
        `${pendingDispatchCount} laporan berhasil dikirim ke resimen pada ${formatArchiveTimestamp(
          new Date(dispatchTimestamp),
        )}.`,
      );
    } catch (dispatchError) {
      setArchiveNotice(
        dispatchError?.message || "Gagal mengirim laporan sesi ke backend.",
      );
    }
  };

  const handleSaveReport = async (updatedReport) => {
    const normalizedReport = normalizeRecruitmentReport(updatedReport);

    try {
      await saveRecruitmentReport(normalizedReport);
      setEditorReport(null);
      setArchiveNotice(
        `Laporan ${normalizedReport.name} diperbarui pada ${formatArchiveTimestamp(
          new Date(normalizedReport.updatedAt),
        )}.`,
      );
    } catch (saveError) {
      setArchiveNotice(
        saveError?.message || "Gagal memperbarui laporan perekrutan.",
      );
    }
  };

  const handleSaveSupplement = async (reportId, supplement) => {
    const normalizedSupplement = normalizeArchiveSupplement(supplement);
    const isEditMode = supplementEditorState?.mode === "edit";
    const targetReport = sessionReports.find((report) => report.id === reportId);

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
      await saveRecruitmentReport(nextReport);
      setSupplementEditorState(null);
      setArchiveNotice(
        `Laporan tambahan untuk ${targetReport.name} ${isEditMode ? "diperbarui" : "ditambahkan"} pada ${formatArchiveTimestamp(
          new Date(normalizedSupplement.updatedAt),
        )}.`,
      );
    } catch (saveError) {
      setArchiveNotice(
        saveError?.message || "Gagal menyimpan laporan tambahan.",
      );
    }
  };

  const handleDeleteSupplement = async (reportId, supplementId) => {
    const targetReport = sessionReports.find((report) => report.id === reportId);
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
      await saveRecruitmentReport(nextReport);
      setSupplementEditorState(null);
      setArchiveNotice(
        `Laporan tambahan ${targetReport.name} dihapus pada ${formatArchiveTimestamp(
          new Date(deletedAt),
        )}.`,
      );
    } catch (deleteError) {
      setArchiveNotice(
        deleteError?.message || "Gagal menghapus laporan tambahan.",
      );
    }
  };

  const handleEliminateCandidate = async (reportId) => {
    const targetReport = sessionReports.find((report) => report.id === reportId);

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
      await eliminateCandidate(targetReport);
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
    }
  };

  if (!trainingSession) {
    return (
      <div className="rounded-2xl border border-white/8 bg-[#151515] p-6 text-center">
        <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
          Laporan Perekrutan
        </p>
        <h1 className="mt-4 font-sans text-[2rem] font-bold text-stone-100">
          Sesi Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-400">
          Detail laporan ini hanya tersedia jika dibuka dari halaman Hasil Laporan.
        </p>
        <Link
          to="/dashboard/laporan"
          className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
        >
          Kembali ke Hasil Laporan
        </Link>
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
                {trainingSession.title} • {formatOperationalDateLabel(trainingSession.scheduledDate)}
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
                className="inline-flex items-center gap-3 bg-stone-900 px-4 py-2 font-public text-[9px] uppercase tracking-[0.12em] text-stone-200 transition hover:bg-stone-800"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
                  <path d="M14.5 1L1 7l4.8 1.9L7.7 14 14.5 1zm-8 6.2l5.2-3-3.7 4.6-.7-1.6-.8 0z" />
                </svg>
                kirim laporan ke resimen
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
          {sessionReports.length > 0 ? (
            sessionReports.map((report) => (
              <ArchiveReportCard
                key={report.id}
                report={report}
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
            <div className="flex items-center gap-3 border-l-2 border-stone-400 bg-stone-900 px-4 py-2">
              <div className="relative h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-stone-400/20" />
                <span className="absolute inset-0 rounded-full bg-stone-400" />
              </div>
              <div>
                <p className="font-public text-[8px] font-bold uppercase tracking-[0.14em] text-stone-400">
                  Status Pelatihan
                </p>
                <p className="font-public text-[10px] font-bold uppercase tracking-[0.08em] text-stone-200">
                  Aktif
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
            <span>{trainingSession.operators.map((operator) => operator.label).join(", ")}</span>
            <span>{trainingSession.golongan}</span>
            <span>{trainingSession.candidates.length} Kandidat</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editorReport ? (
          <ArchiveReportEditorModal
            key={editorReport.id}
            report={editorReport}
            onClose={() => setEditorReport(null)}
            onSave={handleSaveReport}
            onEliminate={() => handleEliminateCandidate(editorReport.id)}
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
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
