/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Perlu Tindakan
 * Purpose: Reminder board untuk kandidat, jadwal terlewat, dan dispatch laporan.
 */

import { useEffect, useMemo, useState } from "react";
import { useStaffPortalData } from "../hooks/useStaffPortalData";

const TINDAKAN_PRIORITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function createLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function parseScheduleTimeRange(timeLabel) {
  const match = timeLabel.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);

  if (!match) {
    return null;
  }

  return {
    startHour: Number(match[1]),
    startMinute: Number(match[2]),
    endHour: Number(match[3]),
    endMinute: Number(match[4]),
  };
}

function getScheduleEventDateTime(event, boundary = "start") {
  const baseDate = createLocalDate(event.date);
  const range = parseScheduleTimeRange(event.time);

  if (!range) {
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      boundary === "end" ? 13 : 12,
      0,
      0,
      0,
    );
  }

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    boundary === "end" ? range.endHour : range.startHour,
    boundary === "end" ? range.endMinute : range.startMinute,
    0,
    0,
  );
}

function formatScheduleDistance(distanceMs) {
  const totalMinutes = Math.max(0, Math.round(distanceMs / 60000));

  if (totalMinutes < 60) {
    return `${Math.max(1, totalMinutes)}m`;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (totalHours < 24) {
    return remainingMinutes > 0
      ? `${totalHours}h ${remainingMinutes}m`
      : `${totalHours}h`;
  }

  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  return remainingHours > 0 ? `${totalDays}d ${remainingHours}h` : `${totalDays}d`;
}

function normalizeReminderIdentity(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getLatestArchiveActivityTimestamp(report) {
  const supplementTimestamps = report.supplements.map((entry) =>
    new Date(entry.updatedAt || entry.createdAt).getTime(),
  );
  return Math.max(new Date(report.updatedAt || report.createdAt).getTime(), ...supplementTimestamps);
}

function isArchivePendingDispatch(report) {
  const latestActivity = getLatestArchiveActivityTimestamp(report);
  return !report.sentAt || latestActivity > new Date(report.sentAt).getTime();
}

function getArchiveDispatchContext(report, referenceDate = new Date()) {
  const latestActivityTimestamp = getLatestArchiveActivityTimestamp(report);
  const latestActivityDate = new Date(latestActivityTimestamp);

  if (!report.sentAt) {
    return {
      state: "never-sent",
      label: "Belum Pernah Dikirim",
      latestActivityDate,
      age: formatScheduleDistance(referenceDate.getTime() - latestActivityTimestamp),
    };
  }

  return {
    state: "needs-resend",
    label: "Perlu Kirim Ulang",
    latestActivityDate,
    age: formatScheduleDistance(referenceDate.getTime() - latestActivityTimestamp),
  };
}

function formatArchiveTimestamp(date) {
  return `${date.toLocaleDateString("id-ID")} • ${date.toLocaleTimeString("id-ID")}`;
}

function getTindakanSeverityClasses(severity) {
  if (severity === "critical") {
    return {
      panel: "border-rose-500/25 bg-rose-500/10",
      text: "text-rose-200",
      accent: "bg-rose-400",
      label: "Critical",
    };
  }

  if (severity === "high") {
    return {
      panel: "border-amber-400/25 bg-amber-400/10",
      text: "text-amber-200",
      accent: "bg-amber-300",
      label: "High",
    };
  }

  if (severity === "low") {
    return {
      panel: "border-sky-400/25 bg-sky-400/10",
      text: "text-sky-200",
      accent: "bg-sky-300",
      label: "Low",
    };
  }

  return {
    panel: "border-emerald-400/20 bg-emerald-400/10",
    text: "text-emerald-200",
    accent: "bg-emerald-300",
    label: "Medium",
  };
}

function TindakanMetricCard({ label, value, caption, accent }) {
  const accentMap = {
    rose: "border-l-rose-400 text-rose-200",
    amber: "border-l-amber-300 text-amber-200",
    emerald: "border-l-emerald-300 text-emerald-200",
    stone: "border-l-stone-400 text-stone-200",
  };

  return (
    <div className="border border-white/6 bg-[#171717] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      <div className={`border-l-2 pl-4 ${accentMap[accent] ?? accentMap.stone}`}>
        <p className="font-public text-[10px] uppercase tracking-[0.28em] text-stone-500">
          {label}
        </p>
        <p className="mt-4 font-sans text-4xl font-bold leading-none text-stone-100">
          {value}
        </p>
        <p className="mt-3 text-sm leading-6 text-stone-400">{caption}</p>
      </div>
    </div>
  );
}

function TindakanPanel({ eyebrow, title, description, children }) {
  return (
    <section className="border border-white/6 bg-[#141414] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-6">
      <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
        {eyebrow}
      </p>
      <div className="mt-3 flex flex-col gap-3 border-b border-white/6 pb-4">
        <h2 className="font-sans text-2xl font-bold uppercase text-stone-100">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-stone-400">{description}</p>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function TindakanAlertCard({
  severity,
  eyebrow,
  title,
  description,
  meta,
  footer,
}) {
  const styles = getTindakanSeverityClasses(severity);

  return (
    <article className={`border p-4 ${styles.panel}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${styles.accent}`} />
            <p className={`font-public text-[9px] font-bold uppercase tracking-[0.22em] ${styles.text}`}>
              {eyebrow}
            </p>
          </div>
          <h3 className="font-sans text-lg font-bold text-stone-100">{title}</h3>
        </div>

        <span className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] ${styles.panel} ${styles.text}`}>
          {styles.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-stone-300">{description}</p>
      <p className="mt-4 font-public text-[10px] uppercase tracking-[0.14em] text-stone-500">
        {meta}
      </p>
      {footer ? (
        <p className="mt-2 font-public text-[10px] uppercase tracking-[0.14em] text-stone-400">
          {footer}
        </p>
      ) : null}
    </article>
  );
}

function TindakanEmptyState({ message }) {
  return (
    <div className="border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center">
      <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-500">
        {message}
      </p>
    </div>
  );
}

export default function TindakanPage() {
  const [systemTime, setSystemTime] = useState(new Date());
  const { reports, candidates } = useStaffPortalData();
  const scheduleEvents = useMemo(() => [], []);

  useEffect(() => {
    const interval = window.setInterval(() => setSystemTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const candidatesWithoutReports = useMemo(() => {
    const archiveIdentities = new Set(
      reports.flatMap((report) => [
        normalizeReminderIdentity(report.name),
        normalizeReminderIdentity(report.discord),
      ]),
    );

    return candidates
      .filter((player) => {
        const robloxIdentity = normalizeReminderIdentity(player.roblox);
        const discordIdentity = normalizeReminderIdentity(player.discord);

        return (
          !archiveIdentities.has(robloxIdentity) &&
          !archiveIdentities.has(discordIdentity)
        );
      })
      .map((player) => {
        const severity =
          player.category === "pmc" ? "high" : "medium";

        const description =
          player.category === "pmc"
            ? "Kandidat PMC belum memiliki arsip laporan resmi di backend perekrutan."
            : "Kandidat sipil belum memiliki arsip laporan resmi di backend perekrutan.";

        return {
          ...player,
          severity,
          description,
        };
      });
  }, [candidates, reports]);

  const overdueSchedules = useMemo(() => {
    return scheduleEvents
      .filter((event) => getScheduleEventDateTime(event, "end").getTime() < systemTime.getTime())
      .map((event) => {
        const endAt = getScheduleEventDateTime(event, "end");
        const overdueMs = systemTime.getTime() - endAt.getTime();
        const severity =
          overdueMs > 24 * 60 * 60 * 1000
            ? "critical"
            : overdueMs > 6 * 60 * 60 * 1000
              ? "high"
              : "medium";

        return {
          ...event,
          endAt,
          overdueMs,
          severity,
        };
      })
      .sort((left, right) => right.endAt.getTime() - left.endAt.getTime());
  }, [scheduleEvents, systemTime]);

  const pendingDispatchReports = useMemo(() => {
    return reports
      .filter((report) => isArchivePendingDispatch(report))
      .map((report) => ({
        report,
        context: getArchiveDispatchContext(report, systemTime),
        severity: report.sentAt ? "medium" : "high",
      }))
      .sort(
        (left, right) =>
          getLatestArchiveActivityTimestamp(right.report) -
          getLatestArchiveActivityTimestamp(left.report),
      );
  }, [reports, systemTime]);

  const actionFeed = useMemo(() => {
    const candidateItems = candidatesWithoutReports.map((candidate) => ({
      id: `candidate-${candidate.discord}`,
      severity: candidate.severity,
      category: "Laporan Kandidat",
      title: candidate.roblox,
      detail: candidate.description,
      meta: `${candidate.discord} • ${candidate.group}`,
      stamp: systemTime.getTime(),
    }));

    const scheduleItems = overdueSchedules.map((event) => ({
      id: `schedule-${event.id}`,
      severity: event.severity,
      category: "Jadwal Terlewat",
      title: `${event.title} / ${event.subtitle}`,
      detail: `Window ${formatScheduleDistance(event.overdueMs)} terlewat dan perlu tindak lanjut recruiter.`,
      meta: `${event.date} • ${event.time} • ${event.coordinator}`,
      stamp: event.endAt.getTime(),
    }));

    const dispatchItems = pendingDispatchReports.map(({ report, context, severity }) => ({
      id: `dispatch-${report.id}`,
      severity,
      category: "Data Belum Terkirim",
      title: report.name,
      detail:
        context.state === "never-sent"
          ? "Laporan kandidat belum pernah dikirim ke resimen."
          : "Ada pembaruan laporan setelah pengiriman terakhir dan perlu dikirim ulang.",
      meta: `${report.discord} • ${context.label} • ${context.age}`,
      stamp: context.latestActivityDate.getTime(),
    }));

    return [...candidateItems, ...scheduleItems, ...dispatchItems].sort(
      (left, right) => {
        const priorityDifference =
          (TINDAKAN_PRIORITY_ORDER[left.severity] ?? 99) -
          (TINDAKAN_PRIORITY_ORDER[right.severity] ?? 99);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return right.stamp - left.stamp;
      },
    );
  }, [candidatesWithoutReports, overdueSchedules, pendingDispatchReports, systemTime]);

  const metrics = [
    {
      label: "Reminder Aktif",
      value: actionFeed.length,
      caption: "Total antrian tindakan yang masih perlu diselesaikan.",
      accent: actionFeed.length > 0 ? "amber" : "emerald",
    },
    {
      label: "Tanpa Laporan",
      value: candidatesWithoutReports.length,
      caption: "Kandidat dashboard yang belum punya arsip evaluasi.",
      accent: candidatesWithoutReports.length > 0 ? "rose" : "emerald",
    },
    {
      label: "Jadwal Terlewat",
      value: overdueSchedules.length,
      caption: "Slot rekrutmen yang sudah lewat dan perlu follow-up.",
      accent: overdueSchedules.length > 0 ? "amber" : "emerald",
    },
    {
      label: "Belum Terkirim",
      value: pendingDispatchReports.length,
      caption: "Arsip laporan yang belum pernah dikirim atau punya update baru.",
      accent: pendingDispatchReports.length > 0 ? "stone" : "emerald",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="relative overflow-hidden border border-white/6 bg-[#141414] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-8">
        <div className="absolute left-0 top-8 h-12 w-1 bg-amber-300" />

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
              Operational Reminder Board
            </p>
            <h1 className="font-sans text-4xl font-bold uppercase leading-none text-stone-200 md:text-5xl">
              Perlu Tindakan
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-400">
              Monitor kandidat tanpa laporan, jadwal rekrutmen yang terlewat, dan
              data arsip yang belum terkirim ke resimen dalam satu layar pengawasan.
            </p>
          </div>

          <div className="text-left xl:text-right">
            <p className="font-public text-[10px] uppercase tracking-[0.12em] text-stone-200/40">
              Live System Watch
            </p>
            <p className="mt-1 font-mono text-sm text-stone-400">
              {formatArchiveTimestamp(systemTime)}
            </p>
            <p className="mt-2 font-public text-[10px] uppercase tracking-[0.14em] text-[#8da16b]">
              Realtime monitor aktif
            </p>
          </div>
        </div>

        <div className="mt-6 h-px bg-[linear-gradient(90deg,rgba(87,83,78,0.30)_0%,rgba(87,83,78,0)_100%)]" />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <TindakanMetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <TindakanPanel
            eyebrow="Candidate Coverage"
            title="Kandidat Tanpa Laporan"
            description="Semua kandidat di bawah ini belum punya arsip laporan resmi di database recruiter saat ini."
          >
            <div className="space-y-4">
              {candidatesWithoutReports.length > 0 ? (
                candidatesWithoutReports.map((candidate) => (
                  <TindakanAlertCard
                    key={candidate.discord}
                    severity={candidate.severity}
                    eyebrow={candidate.status}
                    title={candidate.roblox}
                    description={candidate.description}
                    meta={`${candidate.discord} • ${candidate.group}`}
                    footer={`${candidate.age} Tahun • ${candidate.gender}`}
                  />
                ))
              ) : (
                <TindakanEmptyState message="Semua kandidat aktif sudah memiliki laporan arsip." />
              )}
            </div>
          </TindakanPanel>

          <TindakanPanel
            eyebrow="Unified Queue"
            title="Feed Tindakan"
            description="Urutan prioritas gabungan dari semua reminder aktif yang perlu dibereskan recruiter."
          >
            <div className="space-y-3">
              {actionFeed.length > 0 ? (
                actionFeed.map((item) => (
                  <TindakanAlertCard
                    key={item.id}
                    severity={item.severity}
                    eyebrow={item.category}
                    title={item.title}
                    description={item.detail}
                    meta={item.meta}
                  />
                ))
              ) : (
                <TindakanEmptyState message="Tidak ada reminder aktif. Semua jalur operasional dalam kondisi aman." />
              )}
            </div>
          </TindakanPanel>
        </div>

        <div className="space-y-6">
          <TindakanPanel
            eyebrow="Schedule Oversight"
            title="Jadwal Terlewat"
            description="Slot rekrutmen yang sudah lewat waktu dan masih perlu penanganan ulang atau penjadwalan pengganti."
          >
            <div className="space-y-4">
              {overdueSchedules.length > 0 ? (
                overdueSchedules.map((event) => (
                  <TindakanAlertCard
                    key={event.id}
                    severity={event.severity}
                    eyebrow={event.date}
                    title={`${event.title} / ${event.subtitle}`}
                    description={event.objective}
                    meta={`${event.time} • ${event.location}`}
                    footer={`Coordinator: ${event.coordinator} • Terlewat ${formatScheduleDistance(event.overdueMs)}`}
                  />
                ))
              ) : (
                <TindakanEmptyState message="Tidak ada jadwal yang terlewat pada window operasional saat ini." />
              )}
            </div>
          </TindakanPanel>

          <TindakanPanel
            eyebrow="Dispatch Queue"
            title="Data Belum Terkirim"
            description="Arsip laporan yang belum pernah dikirim atau memiliki pembaruan baru setelah dispatch terakhir."
          >
            <div className="space-y-4">
              {pendingDispatchReports.length > 0 ? (
                pendingDispatchReports.map(({ report, context, severity }) => (
                  <TindakanAlertCard
                    key={report.id}
                    severity={severity}
                    eyebrow={context.label}
                    title={report.name}
                    description={
                      context.state === "never-sent"
                        ? "Dokumen kandidat ini belum pernah masuk jalur pengiriman resimen."
                        : "Ada update laporan setelah pengiriman terakhir dan perlu sinkronisasi ulang."
                    }
                    meta={`${report.discord} • ${report.group} • ${report.status}`}
                    footer={`Aktivitas terakhir ${context.age}`}
                  />
                ))
              ) : (
                <TindakanEmptyState message="Semua arsip laporan sudah sinkron dengan resimen." />
              )}
            </div>
          </TindakanPanel>
        </div>
      </div>
    </div>
  );
}
