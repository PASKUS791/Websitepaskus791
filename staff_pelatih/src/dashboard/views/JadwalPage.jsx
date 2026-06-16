/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Jadwal
 * Purpose: Kalender dan feed sesi pelatihan yang aktif di dashboard pelatih.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createLocalDate,
  formatOperationalDateLabel,
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

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function formatMonthLabel(date) {
  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

function groupSessionsByDate(trainingSessions) {
  const grouped = new Map();

  trainingSessions.forEach((session) => {
    const entry = grouped.get(session.scheduledDate) ?? [];
    entry.push(session);
    grouped.set(session.scheduledDate, entry);
  });

  return grouped;
}

// Section: UI atoms.
function MetricCard({ label, value, detail, accent = "stone" }) {
  const accents = {
    lime: "border-l-[#a8d07c] text-[#a8d07c]",
    amber: "border-l-[#d8c15f] text-[#d8c15f]",
    stone: "border-l-[#8d8d8d] text-[#e6e2dc]",
  };

  return (
    <div className="border border-white/6 bg-[#171717] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
      <div className={`border-l-2 pl-4 ${accents[accent] ?? accents.stone}`}>
        <p className="font-public text-[10px] uppercase tracking-[0.3em] text-stone-500">
          {label}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-4xl font-bold leading-none text-stone-100">
              {value}
            </p>
            <p className="mt-2 font-public text-[11px] font-semibold uppercase tracking-[0.08em] text-inherit">
              {detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarScheduleCell({ day, sessions, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={sessions.length > 0 ? onSelect : undefined}
      className={[
        "group relative min-h-[132px] overflow-hidden border p-3 text-left transition",
        day.outside
          ? "border-white/6 bg-[#111111]/40 text-stone-600"
          : "border-white/6 bg-[#171717] text-stone-100 hover:border-[#d8c15f]/20 hover:bg-[#1c1a16]",
        active ? "ring-1 ring-[#d8c15f]/70" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-public text-[8px] uppercase tracking-[0.18em] text-stone-500">
            {day.date.toLocaleDateString("id-ID", { weekday: "short" })}
          </p>
          <p className="mt-2 font-sans text-2xl font-bold">{day.date.getDate()}</p>
        </div>

        {sessions.length > 0 ? (
          <span className="rounded-full border border-[#d8c15f]/20 bg-[#d8c15f]/10 px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] text-[#eadd8c]">
            {sessions.length} sesi
          </span>
        ) : null}
      </div>

      <div className="mt-5 space-y-2">
        {sessions.length > 0 ? (
          <>
            <p className="font-public text-[8px] uppercase tracking-[0.14em] text-[#9dba74]">
              {sessions[0].golongan}
            </p>
            <p className="line-clamp-2 text-xs leading-5 text-stone-300">
              {sessions[0].title}
            </p>
            <div className="pt-1">
              <span className="inline-flex border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition group-hover:bg-white/5">
                Lihat sesi
              </span>
            </div>
          </>
        ) : (
          <p className="font-public text-[8px] uppercase tracking-[0.14em] text-stone-600">
            Tidak ada sesi
          </p>
        )}
      </div>

      {day.weekend && !day.outside ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,rgba(214,190,74,0)_0%,rgba(214,190,74,0.35)_50%,rgba(214,190,74,0)_100%)]" />
      ) : null}
    </button>
  );
}

function SessionFeedItem({ session, onSelect }) {
  return (
    <div className="flex flex-col gap-3 rounded-[2px] border border-white/6 bg-black/20 p-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <p className="font-public text-[9px] uppercase tracking-[0.25em] text-stone-500">
          {formatOperationalDateLabel(session.scheduledDate)}
        </p>
        <button type="button" onClick={onSelect} className="text-left transition hover:opacity-90">
          <h4 className="font-sans text-lg font-bold text-stone-100">{session.title}</h4>
        </button>
        <p className="font-public text-[11px] uppercase tracking-[0.12em] text-[#9dba74]">
          {session.golongan}
        </p>
      </div>

      <div className="grid gap-3 text-left md:min-w-[250px]">
        <div>
          <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-500">
            Nama Petugas
          </p>
          <p className="mt-1 font-public text-[12px] text-stone-200">
            {session.operators.map((operator) => operator.label).join(", ")}
          </p>
        </div>
        <div>
          <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-500">
            Kandidat
          </p>
          <p className="mt-1 font-public text-[12px] text-stone-300">
            {session.candidates.length} kandidat
          </p>
        </div>
      </div>

      <div className="md:max-w-[280px]">
        <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-500">
          Ringkasan
        </p>
        <p className="mt-1 text-sm leading-6 text-stone-400">
          {session.candidates
            .slice(0, 3)
            .map((candidate) => candidate.roblox)
            .join(", ")}
          {session.candidates.length > 3 ? " dan kandidat lainnya." : "."}
        </p>
      </div>

      <div className="flex items-start md:self-center">
        <button
          type="button"
          onClick={onSelect}
          className="border border-white/8 bg-black/30 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
        >
          Lihat Sesi
        </button>
      </div>
    </div>
  );
}

// Section: main page.
export default function JadwalPage() {
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const {
    trainingSessions,
    loading,
    error,
  } = useStaffPortalData();

  const sessionsByDate = useMemo(() => groupSessionsByDate(trainingSessions), [trainingSessions]);
  const monthGrid = useMemo(() => getMonthGrid(calendarMonth), [calendarMonth]);
  const visibleSessions = useMemo(
    () =>
      trainingSessions.filter((session) => {
        const date = createLocalDate(session.scheduledDate);
        return (
          date.getMonth() === calendarMonth.getMonth() &&
          date.getFullYear() === calendarMonth.getFullYear()
        );
      }),
    [calendarMonth, trainingSessions],
  );
  const selectedSessions = selectedDateKey ? sessionsByDate.get(selectedDateKey) ?? [] : [];

  const metrics = [
    {
      label: "Total Sesi",
      value: trainingSessions.length,
      detail: "Sesi pelatihan yang aktif di registry pelatih.",
      accent: trainingSessions.length > 0 ? "lime" : "stone",
    },
    {
      label: "Bulan Aktif",
      value: visibleSessions.length,
      detail: "Sesi yang jatuh pada bulan kalender yang sedang dibuka.",
      accent: visibleSessions.length > 0 ? "amber" : "stone",
    },
    {
      label: "Tanggal Dipilih",
      value: selectedSessions.length,
      detail: "Jumlah sesi yang sedang dipilih dari kalender jadwal.",
      accent: selectedSessions.length > 0 ? "stone" : "stone",
    },
  ];

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="relative overflow-hidden border border-white/6 bg-[#141414] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-8">
        <div className="absolute left-0 top-8 h-12 w-1 bg-amber-300" />

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
              Training Schedule
            </p>
            <h1 className="font-sans text-4xl font-bold uppercase leading-none text-stone-200 md:text-5xl">
              Jadwal
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-400">
              Kalender jadwal menampilkan sesi pelatihan yang sudah dibuka dari dashboard pelatih.
              Halaman ini terpisah dari hasil laporan dan fokus pada daftar sesi aktif.
            </p>
          </div>
        </div>

        <div className="mt-6 h-px bg-[linear-gradient(90deg,rgba(87,83,78,0.30)_0%,rgba(87,83,78,0)_100%)]" />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="overflow-hidden border border-white/6 bg-[#151515] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.25em] text-[#8da16b]">
                Calendar Overview
              </p>
              <h2 className="mt-2 font-sans text-2xl font-bold text-stone-100">
                {formatMonthLabel(calendarMonth)}
              </h2>
            </div>

            <div className="flex gap-2">
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
                className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
              >
                Prev
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
                className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
              >
                Next
              </button>
            </div>
          </div>

          {loading ? (
            <div className="border border-dashed border-white/8 bg-black/20 px-4 py-6 text-sm text-stone-400">
              Memuat sesi jadwal dari database...
            </div>
          ) : null}

          {error ? (
            <div className="mb-5 border border-rose-400/25 bg-rose-500/10 px-4 py-6 text-sm text-rose-200">
              Gagal sinkron data jadwal dari backend: {error}
            </div>
          ) : null}

          <div className="overflow-x-auto overflow-y-hidden pb-2">
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
                  const sessions = sessionsByDate.get(key) ?? [];

                  return (
                    <CalendarScheduleCell
                      key={key}
                      day={day}
                      sessions={sessions}
                      active={selectedDateKey === key}
                      onSelect={() => setSelectedDateKey(key)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border border-white/6 bg-[#151515] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
          <div className="mb-5">
            <p className="font-public text-[10px] uppercase tracking-[0.25em] text-[#8da16b]">
              Operational Feed
            </p>
            <h2 className="mt-2 font-sans text-2xl font-bold text-stone-100">
              Sesi Jadwal
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              Tekan tanggal pada kalender atau buka sesi langsung dari feed di bawah.
            </p>
          </div>

          <div className="space-y-4">
            {(selectedSessions.length > 0 ? selectedSessions : visibleSessions).length > 0 ? (
              (selectedSessions.length > 0 ? selectedSessions : visibleSessions).map((session) => (
                <SessionFeedItem
                  key={session.id}
                  session={session}
                  onSelect={() => setSelectedDateKey(session.scheduledDate)}
                />
              ))
            ) : (
              <div className="border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400">
                Tidak ada sesi jadwal pada bulan ini.
              </div>
            )}
          </div>

          {selectedSessions.length > 0 ? (
            <div className="mt-5 border-t border-white/6 pt-5">
              <p className="font-public text-[10px] uppercase tracking-[0.2em] text-stone-500">
                Akses Cepat
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {selectedSessions.map((session) => (
                  <Link
                    key={`quick-${session.id}`}
                    to={`/dashboard/pelatihan/${session.id}`}
                    className="inline-flex border border-white/8 bg-black/20 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/5 hover:text-stone-100"
                  >
                    Buka {session.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
