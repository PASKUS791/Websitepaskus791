/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Hasil Laporan
 * Purpose: Kalender hasil laporan dengan UI bergaya panel jadwal dan detail berbasis modal.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildSessionDateSummaries,
  createLocalDate,
  formatOperationalDateLabel,
  isTrainingSessionDispatched,
} from "../data/recruitmentData";
import { useStaffPortalData } from "../hooks/useStaffPortalData";

// Section: calendar helpers.
const DAY_LABELS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

function addDays(baseDate, daysToAdd) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return new Date(
    nextDate.getFullYear(),
    nextDate.getMonth(),
    nextDate.getDate(),
    12,
  );
}

function getMonthGrid(date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1, 12);
  const monthStartOffset = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -monthStartOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const currentDate = addDays(gridStart, index);

    return {
      date: currentDate,
      outside:
        currentDate.getMonth() !== monthStart.getMonth() ||
        currentDate.getFullYear() !== monthStart.getFullYear(),
      weekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    };
  });
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthUpper(date) {
  return date
    .toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

// Section: UI pieces.
function ScheduleMetricCard({ item }) {
  const accents = {
    lime: "border-l-[#a8d07c] text-[#a8d07c]",
    amber: "border-l-[#d8c15f] text-[#d8c15f]",
    stone: "border-l-[#8d8d8d] text-[#e6e2dc]",
  };

  return (
    <div className="border border-white/6 bg-[#171717] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
      <div className={`border-l-2 pl-4 ${accents[item.accent] ?? accents.stone}`}>
        <p className="font-public text-[10px] uppercase tracking-[0.3em] text-stone-500">
          {item.label}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[2.35rem] font-bold leading-none text-stone-100">
              {item.value}
            </p>
            <p className="mt-2 font-public text-[10px] font-semibold uppercase tracking-[0.08em] text-inherit">
              {item.detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSessionToneClasses(session) {
  if (session.golongan === "Golongan 2") {
    return "border-l-[#d6be4a] bg-[#383525] text-[#eadd8c]";
  }

  return "border-l-[#98b56e] bg-[#32382b] text-[#d5e6bc]";
}

function CalendarResultCell({ day, summary, active, isToday, onOpen }) {
  return (
    <button
      type="button"
      onClick={summary ? onOpen : undefined}
      className={[
        "group relative min-h-[144px] overflow-hidden border p-3 text-left transition",
        day.outside
          ? "border-white/6 bg-[#111111]/40 text-stone-600"
          : "border-white/6 bg-[#141414] text-stone-100 hover:border-[#d8c15f]/20 hover:bg-[#181818]",
        active ? "ring-1 ring-[#d8c15f]/70" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
            {day.date.getDate()}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {isToday ? (
            <span className="rounded-[2px] border border-[#d8c15f]/20 bg-[#d8c15f]/10 px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] text-[#eadd8c]">
              Today
            </span>
          ) : null}

          {summary ? (
            <span className="rounded-[2px] border border-white/8 bg-black/20 px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] text-stone-300">
              {summary.sessions.length} sesi
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {summary ? (
          <>
            {summary.sessions.slice(0, 2).map((session) => (
              <div
                key={session.id}
                className={`rounded-[2px] border-l-2 px-2.5 py-2 ${getSessionToneClasses(session)}`}
              >
                <p className="font-public text-[8px] font-bold uppercase tracking-[0.08em]">
                  {session.operators[0]?.label || "PETUGAS"}
                </p>
                <p className="mt-1 font-public text-[8px] font-semibold uppercase tracking-[0.08em] opacity-90">
                  {session.golongan}
                </p>
                <p className="mt-1 font-public text-[7px] uppercase tracking-[0.08em] opacity-60">
                  {session.candidates.length} kandidat • {summary.reportCount} laporan
                </p>
              </div>
            ))}

            {summary.sessions.length > 2 ? (
              <p className="font-public text-[8px] uppercase tracking-[0.14em] text-stone-500">
                +{summary.sessions.length - 2} sesi lainnya
              </p>
            ) : null}

            <div className="pt-1">
              <span className="inline-flex border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition group-hover:bg-white/5">
                Show Detail
              </span>
            </div>
          </>
        ) : (
          <p className="font-public text-[8px] uppercase tracking-[0.14em] text-stone-600">
            No entry
          </p>
        )}
      </div>

      {day.weekend && !day.outside ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,rgba(214,190,74,0)_0%,rgba(214,190,74,0.35)_50%,rgba(214,190,74,0)_100%)]" />
      ) : null}
    </button>
  );
}

function DateDetailModal({ summary, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[240] flex items-start justify-center bg-black/72 p-3 pt-12 backdrop-blur-[6px] md:p-5 md:pt-14"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-[calc(100vh-1.75rem)] w-full max-w-[1040px] flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[#171717]/95 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 px-4 py-4 md:px-5">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
              Hasil Laporan
            </p>
            <h3 className="mt-1.5 font-sans text-xl font-bold uppercase text-stone-100 md:text-2xl">
              {formatOperationalDateLabel(summary.date)}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Tutup
          </button>
        </div>

        <div className="grid gap-3 border-b border-white/6 px-4 py-4 md:grid-cols-3 md:px-5">
          <div className="border border-white/6 bg-black/20 p-3.5">
            <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
              Total Sesi
            </p>
            <p className="mt-2.5 font-sans text-[2rem] font-bold text-stone-100">
              {summary.sessions.length}
            </p>
          </div>
          <div className="border border-white/6 bg-black/20 p-3.5">
            <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
              Total Kandidat
            </p>
            <p className="mt-2.5 font-sans text-[2rem] font-bold text-stone-100">
              {summary.candidateCount}
            </p>
          </div>
          <div className="border border-white/6 bg-black/20 p-3.5">
            <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
              Total Laporan
            </p>
            <p className="mt-2.5 font-sans text-[2rem] font-bold text-stone-100">
              {summary.reportCount}
            </p>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto px-4 py-4 md:px-5">
          <div className="space-y-4">
            {summary.sessions.map((session) => (
              <article
                key={session.id}
                className="border border-white/6 bg-black/20 p-3.5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="font-public text-[9px] uppercase tracking-[0.25em] text-stone-500">
                      Sesi Pelatihan
                    </p>
                    <h4 className="font-sans text-xl font-bold text-stone-100">
                      {session.title}
                    </h4>
                    <p className="font-public text-[10px] uppercase tracking-[0.14em] text-[#9dba74]">
                      {session.golongan}
                    </p>
                  </div>

                  <Link
                    to={`/dashboard/laporan-perekrutan/${session.id}`}
                    className="inline-flex items-center justify-center border border-white/8 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-100 transition hover:bg-white/10"
                  >
                    Buka Detail
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                      Nama Petugas
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-200">
                      {session.operators.map((operator) => operator.label).join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                      Dibuat Oleh
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      {session.createdBy}
                    </p>
                  </div>
                  <div>
                    <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                      Kandidat
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      {session.candidates.length} kandidat
                    </p>
                  </div>
                  <div>
                    <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                      Daftar Singkat
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      {session.candidates
                        .slice(0, 4)
                        .map((candidate) => candidate.roblox)
                        .join(", ")}
                      {session.candidates.length > 4 ? " dan lainnya." : "."}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Section: main page.
export default function HasilLaporanPage() {
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [systemTime, setSystemTime] = useState(new Date());
  const [activeSummary, setActiveSummary] = useState(null);
  const {
    trainingSessions,
    reports,
    loading: trainingSessionsLoading,
  } = useStaffPortalData();

  useEffect(() => {
    const interval = window.setInterval(() => setSystemTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const sessionDateSummaries = useMemo(
    () => buildSessionDateSummaries(trainingSessions, reports, { historicalOnly: true }),
    [reports, trainingSessions],
  );
  const historicalSessions = useMemo(
    () =>
      trainingSessions.filter((session) =>
        isTrainingSessionDispatched(session, reports),
      ),
    [reports, trainingSessions],
  );
  const historicalSessionIds = useMemo(
    () => new Set(historicalSessions.map((session) => session.id)),
    [historicalSessions],
  );
  const historicalReports = useMemo(
    () => reports.filter((report) => historicalSessionIds.has(report.sessionId)),
    [historicalSessionIds, reports],
  );
  const summaryMap = useMemo(
    () => new Map(sessionDateSummaries.map((summary) => [summary.date, summary])),
    [sessionDateSummaries],
  );
  const monthGrid = useMemo(() => getMonthGrid(calendarMonth), [calendarMonth]);
  const todayKey = formatDateKey(new Date());
  const latestHistoricalSession = historicalSessions[0] ?? null;
  const visibleSummaries = useMemo(
    () =>
      sessionDateSummaries.filter((summary) => {
        const date = createLocalDate(summary.date);
        return (
          date.getMonth() === calendarMonth.getMonth() &&
          date.getFullYear() === calendarMonth.getFullYear()
        );
      }),
    [calendarMonth, sessionDateSummaries],
  );
  const visibleSessionCount = useMemo(
    () => visibleSummaries.reduce((total, summary) => total + summary.sessions.length, 0),
    [visibleSummaries],
  );
  const visibleReportCount = useMemo(
    () => visibleSummaries.reduce((total, summary) => total + summary.reportCount, 0),
    [visibleSummaries],
  );
  const visibleCandidateCount = useMemo(
    () => visibleSummaries.reduce((total, summary) => total + summary.candidateCount, 0),
    [visibleSummaries],
  );

  const metrics = [
    {
      label: "Tanggal Arsip",
      value: `${sessionDateSummaries.length}`.padStart(2, "0"),
      detail: "Tanggal dengan histori hasil laporan yang sudah tersimpan.",
      accent: sessionDateSummaries.length > 0 ? "lime" : "stone",
    },
    {
      label: "Sesi Bulan Ini",
      value: `${visibleSessionCount}`.padStart(2, "0"),
      detail: "Total sesi hasil laporan pada bulan kalender yang sedang dibuka.",
      accent: trainingSessions.length > 0 ? "amber" : "stone",
    },
    {
      label: "Pendaftar Tercatat",
      value: `${visibleCandidateCount}`.padStart(2, "0"),
      detail: "Total sipil atau PMC yang masuk ke histori hasil laporan bulan ini.",
      accent: historicalReports.length > 0 ? "stone" : "stone",
    },
    {
      label: "Laporan Bulan Ini",
      value: `${visibleReportCount}`.padStart(2, "0"),
      detail: "Jumlah laporan yang sudah tercatat dan siap dibuka detailnya.",
      accent: visibleReportCount > 0 ? "lime" : "stone",
    },
  ];

  return (
    <>
      <div className="space-y-6 overflow-x-hidden">
        <div className="relative overflow-hidden border border-white/6 bg-[#141414] px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-[#8dd29d]">
                Tactical Overview
              </p>
              <p className="font-sans text-[28px] font-bold leading-none text-stone-100 md:text-[48px]">
                Hasil Laporan
              </p>
              <p className="font-public text-[10px] uppercase tracking-[0.34em] text-[#8da16b]">
                Histori Operasi Pelatihan Rekrutmen
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:min-w-[420px]">
              <div className="border-l border-[#d47a72] bg-[#1b1717] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-public text-[9px] uppercase tracking-[0.22em] text-stone-500">
                    Current Zulu
                  </p>
                  <span className="bg-[#d47a72] px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] text-black">
                    Histori Aktif
                  </span>
                </div>
                {latestHistoricalSession ? (
                  <>
                    <p className="mt-3 font-sans text-lg font-bold uppercase text-stone-100">
                      {latestHistoricalSession.operators[0]?.label || "Session Archive"}
                    </p>
                    <p className="mt-1 font-public text-[10px] uppercase tracking-[0.12em] text-[#d8c15f]">
                      {latestHistoricalSession.golongan}
                    </p>
                    <p className="mt-4 font-public text-[9px] uppercase tracking-[0.14em] text-stone-400">
                      {formatOperationalDateLabel(latestHistoricalSession.scheduledDate)}
                    </p>
                    <p className="mt-2 text-[13px] text-stone-300">
                      {latestHistoricalSession.candidates.length} kandidat •{" "}
                      {latestHistoricalSession.title}
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-[13px] leading-5 text-stone-400">
                    Belum ada histori hasil laporan yang tersimpan.
                  </p>
                )}
              </div>

              <div className="border border-[#3d4530] bg-[#191d18] px-4 py-4">
                <p className="font-public text-[9px] uppercase tracking-[0.22em] text-stone-500">
                  Realtime Sync
                </p>
                <p className="mt-4 font-public text-[11px] font-bold uppercase tracking-[0.18em] text-[#b8dd88]">
                  Realtime local sync active.
                </p>
                <p className="mt-3 font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                  {systemTime.toLocaleDateString("id-ID")}
                </p>
                <p className="mt-2 font-mono text-[13px] text-stone-300">
                  Last update {systemTime.toLocaleTimeString("sv-SE")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 h-px bg-[linear-gradient(90deg,rgba(87,83,78,0.30)_0%,rgba(87,83,78,0)_100%)]" />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <ScheduleMetricCard key={metric.label} item={metric} />
            ))}
          </div>
        </div>

        <section className="overflow-hidden border border-white/6 bg-[#151515] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-5">
          <div className="flex flex-col gap-5 border-b border-white/6 pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.25em] text-[#8da16b]">
                Tactical Overview
              </p>
              <h2 className="mt-2 font-sans text-[34px] font-bold uppercase leading-none text-stone-100 md:text-[38px]">
                {formatMonthUpper(calendarMonth)}
              </h2>
            </div>

            <div className="flex flex-col gap-4 xl:items-end">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() - 1,
                        1,
                        12,
                      ),
                    )
                  }
                  className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() + 1,
                        1,
                        12,
                      ),
                    )
                  }
                  className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMonth(new Date())}
                  className="border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear() - 1, calendarMonth.getMonth(), 1, 12),
                    )
                  }
                  className="border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                >
                  -1Y
                </button>
                <button
                  type="button"
                  className="border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300"
                >
                  {calendarMonth.getFullYear()}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear() + 1, calendarMonth.getMonth(), 1, 12),
                    )
                  }
                  className="border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                >
                  +1Y
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-500"
                >
                  Day
                </button>
                <button
                  type="button"
                  className="border border-white/8 bg-black/20 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-500"
                >
                  Week
                </button>
                <button
                  type="button"
                  className="border border-[#d8c15f]/30 bg-[#d8c15f] px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-black"
                >
                  Month
                </button>
              </div>
            </div>
          </div>

          {trainingSessionsLoading ? (
            <div className="mt-5 border border-dashed border-white/8 bg-black/20 px-4 py-6 text-sm text-stone-400">
              Memuat sesi hasil laporan dari database...
            </div>
          ) : null}

          <div className="mt-5 overflow-x-auto overflow-y-hidden pb-2">
            <div className="min-w-[920px]">
              <div className="mb-3 grid grid-cols-7 gap-3">
                {DAY_LABELS.map((label) => (
                  <div
                    key={label}
                    className="px-2 text-center font-public text-[9px] uppercase tracking-[0.18em] text-stone-500"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3">
                {monthGrid.map((day) => {
                  const key = formatDateKey(day.date);
                  const summary = summaryMap.get(key);

                  return (
                    <CalendarResultCell
                      key={key}
                      day={day}
                      summary={summary}
                      isToday={key === todayKey}
                      active={activeSummary?.date === key}
                      onOpen={() => {
                        if (!summary) {
                          return;
                        }

                        setActiveSummary(summary);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {visibleSummaries.length === 0 ? (
            <div className="mt-5 border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400">
              Belum ada histori hasil laporan pada bulan ini.
            </div>
          ) : null}
        </section>
      </div>

      <AnimatePresence>
        {activeSummary ? (
          <DateDetailModal
            summary={activeSummary}
            onClose={() => setActiveSummary(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
