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
import { useMemo, useState } from "react";
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

function getCandidateStatusLabel(report, dispatched) {
  if (dispatched && report?.sentAt) {
    return "Terkirim";
  }

  if (report && isRecruitmentReportComplete(report)) {
    return "Siap Dikirim";
  }

  return "Belum Dilaporkan";
}

function CandidateReportRow({
  candidate,
  report,
  dispatched,
  onOpenReport,
}) {
  const ready = report ? isRecruitmentReportComplete(report) : false;
  const statusLabel = getCandidateStatusLabel(report, dispatched);

  return (
    <article
      className={[
        "rounded-2xl border p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition",
        ready
          ? "border-emerald-400/20 bg-emerald-400/[0.05]"
          : "border-white/8 bg-[#171717]",
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
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Usia
          </p>
          <p className="mt-2 font-public text-sm font-bold text-stone-200">
            {candidate.age} Tahun
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Gender
          </p>
          <p className="mt-2 font-public text-sm font-bold uppercase text-stone-200">
            {candidate.gender}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3 md:col-span-2">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Ringkasan Laporan
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            {report
              ? `${report.status} • ${report.question}`
              : "Belum ada laporan yang dibuat untuk kandidat ini."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onOpenReport}
          className={[
            "rounded-xl px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] transition",
            ready
              ? "border border-amber-300/20 bg-amber-300/10 text-amber-200 hover:bg-amber-300/15"
              : "bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] text-[#3C2F00] hover:brightness-105",
          ].join(" ")}
        >
          {ready ? "Edit Laporan" : "Laporkan"}
        </button>
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
    saveRecruitmentReport,
    dispatchTrainingSession,
    cancelTrainingSession,
  } = useStaffPortalData();

  const [activeReportId, setActiveReportId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [sessionNotice, setSessionNotice] = useState(
    "Panel pelatihan aktif. Setiap kandidat bisa dilaporkan satu per satu sebelum dikirim ke hasil laporan.",
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
  const sessionReports = useMemo(
    () => {
      const persistedReports = reports.filter((report) => report.sessionId === sessionId);

      if (persistedReports.length > 0 || initialReports.length === 0) {
        return persistedReports;
      }

      return initialReports;
    },
    [initialReports, reports, sessionId],
  );
  const reportMap = useMemo(
    () => new Map(sessionReports.map((report) => [report.candidateIdentity, report])),
    [sessionReports],
  );
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

    return normalizeRecruitmentReport({
      id: `${sessionId}-${candidate.identity}`,
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
  }, [activeReportId, sessionId, sessionReports, trainingSession]);

  const dispatched = trainingSession
    ? isTrainingSessionDispatched(trainingSession, sessionReports)
    : false;
  const completedCount = sessionReports.filter(isRecruitmentReportComplete).length;
  const pendingCount = Math.max(
    0,
    (trainingSession?.candidates.length || 0) - completedCount,
  );

  const handleSaveReport = async (updatedReport, { dispatchRequested = false } = {}) => {
    if (!trainingSession) {
      return;
    }

    const normalizedReport = normalizeRecruitmentReport(updatedReport);
    const dispatchTimestamp = new Date().toISOString();
    const nextSessionReports = sessionReports.some(
      (report) => report.id === normalizedReport.id,
    )
      ? sessionReports.map((report) =>
          report.id === normalizedReport.id ? normalizedReport : report,
        )
      : [normalizedReport, ...sessionReports];
    const allCandidatesCovered = trainingSession.candidates.every((candidate) =>
      nextSessionReports.some(
        (report) => report.candidateIdentity === candidate.identity,
      ),
    );
    const allReportsReady =
      allCandidatesCovered && nextSessionReports.every(isRecruitmentReportComplete);
    const shouldDispatch =
      dispatchRequested || (!dispatched && allReportsReady);

    try {
      await saveRecruitmentReport(normalizedReport);

      if (shouldDispatch) {
        const nextDispatchReports = nextSessionReports.map((report) =>
          report.id === normalizedReport.id ? normalizedReport : report,
        );
        await dispatchTrainingSession(sessionId, nextDispatchReports);
        setSessionNotice(
          dispatchRequested
            ? `Laporan kandidat ${normalizedReport.name} tersimpan dan sesi dikirim ke Hasil Laporan pada ${formatArchiveTimestamp(
                dispatchTimestamp,
              )}.`
            : `Semua kandidat sudah selesai dilaporkan. Sesi otomatis masuk ke Hasil Laporan pada ${formatArchiveTimestamp(
                dispatchTimestamp,
              )}.`,
        );
      } else {
        setSessionNotice(
          `Laporan ${normalizedReport.name} disimpan pada ${formatArchiveTimestamp(
            normalizedReport.updatedAt,
          )}.`,
        );
      }

      setActiveReportId(null);
    } catch (saveError) {
      setSessionNotice(
        saveError?.message || "Gagal menyimpan laporan pelatihan ke backend.",
      );
    }
  };

  const handleDispatchSession = async () => {
    if (!trainingSession) {
      return;
    }

    if (dispatched) {
      setSessionNotice("Sesi ini sudah masuk ke Hasil Laporan dan siap direview ulang.");
      return;
    }

    const dispatchTimestamp = new Date().toISOString();

    try {
      await dispatchTrainingSession(sessionId, sessionReports);
      setSessionNotice(
        `Sesi ${trainingSession.title} dikirim ke Hasil Laporan pada ${formatArchiveTimestamp(
          dispatchTimestamp,
        )}.`,
      );
    } catch (dispatchError) {
      setSessionNotice(
        dispatchError?.message || "Gagal mengirim sesi ke hasil laporan.",
      );
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

  if (!trainingSession) {
    return (
      <div className="rounded-2xl border border-white/8 bg-[#151515] p-6 text-center">
        <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
          Dashboard Pelatih
        </p>
        <h1 className="mt-4 font-sans text-[2rem] font-bold text-stone-100">
          Sesi Pelatihan Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-400">
          Sesi yang kamu buka belum tersedia di database atau sudah dihapus.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
        >
          Kembali ke Dashboard
        </Link>
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
                Laporkan tiap sipil atau PMC, lalu kirim sesi ke histori hasil laporan.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
              >
                Kembali
              </Link>
              <Link
                to={`/dashboard/laporan-perekrutan/${trainingSession.id}`}
                className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
              >
                Review Lengkap
              </Link>
              {!dispatched ? (
                <button
                  type="button"
                  onClick={handleCancelSession}
                  disabled={cancelling}
                  className="inline-flex rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling ? "Membatalkan Sesi..." : "Cancel Sesi"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleDispatchSession}
                className="inline-flex rounded-xl bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-[#3C2F00] transition hover:brightness-105"
              >
                {dispatched ? "Sudah Terkirim" : "Kirimkan Laporan"}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 px-3.5 py-3.5">
            <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Channel Operasional
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-200">{sessionNotice}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            label="Selesai"
            value={completedCount}
            detail="Kandidat yang sudah memiliki laporan operasional lengkap."
            accent="lime"
          />
          <SessionMetricCard
            label="Belum Dilaporkan"
            value={pendingCount}
            detail="Kandidat yang masih menunggu laporan atau finalisasi."
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
            {trainingSession.candidates.map((candidate) => (
              <CandidateReportRow
                key={candidate.identity}
                candidate={candidate}
                report={reportMap.get(candidate.identity)}
                dispatched={dispatched}
                onOpenReport={() =>
                  setActiveReportId(
                    reportMap.get(candidate.identity)?.id ??
                      `${sessionId}::${candidate.identity}`,
                  )
                }
              />
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {activeReport ? (
          <TrainingSessionReportModal
            report={activeReport}
            onClose={() => setActiveReportId(null)}
            onSave={handleSaveReport}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
