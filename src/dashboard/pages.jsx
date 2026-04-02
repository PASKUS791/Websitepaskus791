import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { RESOURCE_KEYS, useSyncedResource } from "../lib/resources";

const EMPTY_DASHBOARD_DATA = [];

const SCHEDULE_DAY_LABELS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const CALENDAR_VIEW_OPTIONS = ["DAY", "WEEK", "MONTH"];
const MIN_SCHEDULE_YEAR = 2026;
const SCHEDULE_TONE_OPTIONS = [
  { value: "olive", label: "Stable / Golongan 1" },
  { value: "amber", label: "Priority / Golongan 2" },
  { value: "danger", label: "Gap / Critical" },
];
const INITIAL_SCHEDULE_DATE = getCurrentScheduleDate();

const ACTIVE_APPLICANTS_BASE = 486;

function getCurrentScheduleDate(referenceDate = new Date()) {
  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
  );
}

function createLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(firstDate, secondDate) {
  return formatDateKey(firstDate) === formatDateKey(secondDate);
}

function isSameMonth(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

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

function addMonths(baseDate, monthsToAdd) {
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + monthsToAdd, 1, 12);
}

function addYears(baseDate, yearsToAdd) {
  return new Date(baseDate.getFullYear() + yearsToAdd, baseDate.getMonth(), 1, 12);
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function isSupportedScheduleDate(dateString) {
  return Number(dateString.slice(0, 4)) >= MIN_SCHEDULE_YEAR;
}

function getStartOfWeek(date) {
  const mondayOffset = (date.getDay() + 6) % 7;
  return addDays(date, -mondayOffset);
}

function getMonthGrid(date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1, 12);
  const monthStartOffset = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -monthStartOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const currentDate = addDays(gridStart, index);

    return {
      date: currentDate,
      outside: !isSameMonth(currentDate, monthStart),
      weekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    };
  });
}

function getTimeSortValue(timeLabel) {
  const match = timeLabel.match(/^(\d{2}):(\d{2})/);

  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  return Number(match[1]) * 60 + Number(match[2]);
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

function getNearestScheduleIndicator(events, referenceDate) {
  if (events.length === 0) {
    return null;
  }

  const enrichedEvents = events
    .map((event) => ({
      event,
      startAt: getScheduleEventDateTime(event, "start"),
      endAt: getScheduleEventDateTime(event, "end"),
    }))
    .sort((firstEntry, secondEntry) => firstEntry.startAt - secondEntry.startAt);

  const ongoingEntry = enrichedEvents.find(
    (entry) =>
      referenceDate.getTime() >= entry.startAt.getTime() &&
      referenceDate.getTime() <= entry.endAt.getTime(),
  );

  if (ongoingEntry) {
    return {
      ...ongoingEntry,
      state: "ongoing",
      distanceMs: 0,
      label: "LIVE NOW",
    };
  }

  const nearestEntry = enrichedEvents
    .map((entry) => {
      const isUpcoming = entry.startAt.getTime() >= referenceDate.getTime();

      return {
        ...entry,
        state: isUpcoming ? "upcoming" : "recent",
        distanceMs: isUpcoming
          ? entry.startAt.getTime() - referenceDate.getTime()
          : referenceDate.getTime() - entry.endAt.getTime(),
      };
    })
    .sort((firstEntry, secondEntry) => {
      if (firstEntry.distanceMs !== secondEntry.distanceMs) {
        return firstEntry.distanceMs - secondEntry.distanceMs;
      }

      return firstEntry.startAt - secondEntry.startAt;
    })[0];

  return {
    ...nearestEntry,
    label:
      nearestEntry.state === "upcoming"
        ? `IN ${formatScheduleDistance(nearestEntry.distanceMs)}`
        : `${formatScheduleDistance(nearestEntry.distanceMs)} AGO`,
  };
}

function createScheduleId() {
  return `sch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeScheduleEvent(event, index = 0) {
  const toneValues = new Set(SCHEDULE_TONE_OPTIONS.map((option) => option.value));

  return {
    id: event.id ?? `sch-default-${index}`,
    date: typeof event.date === "string" ? event.date : formatDateKey(INITIAL_SCHEDULE_DATE),
    title: event.title?.trim() || "UNNAMED SLOT",
    subtitle: event.subtitle?.trim() || "GOLONGAN 1",
    time: event.time?.trim() || "08:00 - 10:00 HRS",
    tone: toneValues.has(event.tone) ? event.tone : "olive",
    capacity: Number.isFinite(Number(event.capacity)) ? Number(event.capacity) : 0,
    location: event.location?.trim() || "Ops Chamber",
    coordinator: event.coordinator?.trim() || "Unassigned",
    objective: event.objective?.trim() || "No operational note recorded.",
  };
}

function sortScheduleEvents(events) {
  return [...events].sort((firstEvent, secondEvent) => {
    const dateDifference =
      createLocalDate(firstEvent.date).getTime() - createLocalDate(secondEvent.date).getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    const timeDifference = getTimeSortValue(firstEvent.time) - getTimeSortValue(secondEvent.time);

    if (timeDifference !== 0) {
      return timeDifference;
    }

    return firstEvent.title.localeCompare(secondEvent.title);
  });
}

function getDefaultScheduleEvents() {
  return [];
}

function loadStoredScheduleEvents(value = EMPTY_DASHBOARD_DATA) {
  if (!Array.isArray(value)) {
    return getDefaultScheduleEvents();
  }

  return sortScheduleEvents(
    value
      .map((event, index) => normalizeScheduleEvent(event, index))
      .filter((event) => isSupportedScheduleDate(event.date)),
  );
}

function getScheduleEditorFormState(event, selectedDate) {
  return {
    date: event?.date ?? formatDateKey(selectedDate),
    title: event?.title ?? "",
    subtitle: event?.subtitle ?? "",
    time: event?.time ?? "08:00 - 16:00 HRS",
    tone: event?.tone ?? "olive",
    capacity: event?.capacity?.toString() ?? "8",
    location: event?.location ?? "",
    coordinator: event?.coordinator ?? "",
    objective: event?.objective ?? "",
  };
}

function normalizeArchiveSupplement(entry, index = 0) {
  return {
    id: entry.id ?? `archive-supplement-${index}`,
    question: entry.question?.trim() || "Belum ada fokus tambahan.",
    notes: entry.notes?.trim() || "Belum ada catatan tambahan.",
    updatedAt: entry.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeArchiveReport(report, index = 0) {
  return {
    id: report.id ?? `archive-report-${index}`,
    name: report.name?.trim() || "Unnamed Candidate",
    discord: report.discord?.trim() || "unknown_ops#0000",
    group: report.group?.trim() || "GOL A",
    status: report.status?.trim() || "LULUS",
    age: report.age?.trim() || "0 Tahun",
    gender: report.gender?.trim() || "Tidak Diketahui",
    question: report.question?.trim() || "Belum ada pertanyaan strategis.",
    notes: report.notes?.trim() || "Belum ada keterangan analis.",
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
    updatedAt: report.updatedAt ?? new Date().toISOString(),
  };
}

function loadStoredArchiveReports(value = EMPTY_DASHBOARD_DATA) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((report, index) => normalizeArchiveReport(report, index));
}

function getArchiveGroupClasses(group) {
  if (group === "GOL B") {
    return "border-amber-300 text-amber-300";
  }

  if (group === "GOL C") {
    return "border-red-300 text-red-300";
  }

  return "border-stone-400 text-stone-400";
}

function getArchiveStatusClasses(status) {
  if (status === "GAGAL") {
    return "bg-stone-800 text-amber-300 outline-amber-300/40";
  }

  return "bg-stone-400/20 text-stone-300 outline-stone-400/30";
}

function formatArchiveTimestamp(date) {
  return date
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

function formatRelativeMinutes(date, referenceDate = new Date()) {
  const differenceInMinutes = Math.max(
    1,
    Math.round((referenceDate.getTime() - date.getTime()) / 60000),
  );

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} Mins Ago`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `${differenceInHours} Hrs Ago`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  return `${differenceInDays} Days Ago`;
}

function buildCandidateWeeklyData(candidates) {
  const currentDate = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const targetWeekDate = addDays(currentDate, (index - 6) * 7);
    const weekStart = getStartOfWeek(targetWeekDate);
    const weekEnd = addDays(weekStart, 6);
    const total = candidates.filter((candidate) => {
      const candidateDate = new Date(candidate.createdAt || candidate.updatedAt || Date.now());

      return (
        !Number.isNaN(candidateDate.getTime()) &&
        candidateDate.getTime() >= weekStart.getTime() &&
        candidateDate.getTime() <= weekEnd.getTime()
      );
    }).length;

    return {
      week: `W${index + 1}`,
      total,
    };
  });
}

function normalizeReminderIdentity(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getLatestArchiveActivityTimestamp(report) {
  return report.additionalReports.reduce((latestTimestamp, entry) => {
    const entryTimestamp = new Date(entry.updatedAt).getTime();
    return entryTimestamp > latestTimestamp ? entryTimestamp : latestTimestamp;
  }, new Date(report.updatedAt).getTime());
}

function isArchivePendingDispatch(report) {
  if (!report.sentAt) {
    return true;
  }

  return getLatestArchiveActivityTimestamp(report) > new Date(report.sentAt).getTime();
}

function getArchiveDispatchContext(report, referenceDate = new Date()) {
  const latestActivityDate = new Date(getLatestArchiveActivityTimestamp(report));

  if (!report.sentAt) {
    return {
      state: "never-sent",
      label: "Belum Pernah Dikirim",
      age: formatRelativeMinutes(latestActivityDate, referenceDate),
      latestActivityDate,
    };
  }

  const sentDate = new Date(report.sentAt);

  if (latestActivityDate.getTime() > sentDate.getTime()) {
    return {
      state: "updated-after-dispatch",
      label: "Update Baru Belum Dikirim",
      age: formatRelativeMinutes(latestActivityDate, referenceDate),
      latestActivityDate,
      sentDate,
    };
  }

  return {
    state: "synced",
    label: "Sudah Terkirim",
    age: formatRelativeMinutes(sentDate, referenceDate),
    latestActivityDate,
    sentDate,
  };
}

function Card({ title, value, color, strip, children }) {
  return (
    <div
      className={`relative w-full rounded-sm border bg-white/5 p-4 backdrop-blur-md ${color}`}
    >
      <div className={`absolute left-0 top-0 h-[2px] w-full ${strip}`} />
      <p className="text-[10px] font-bold uppercase text-gray-400">{title}</p>
      <h2 className="mt-1 text-xl font-bold text-white">{value}</h2>
      {children}
    </div>
  );
}

function StatusPill({ status }) {
  const classes =
    status === "Approved"
      ? "bg-green-500 text-black"
      : status === "Rejected"
        ? "bg-red-500 text-black"
        : "bg-gray-500 text-white";

  return (
    <span className={`rounded-sm px-3 py-1 text-xs font-bold ${classes}`}>
      {status}
    </span>
  );
}

function CalendarEventCard({ event, compact = false, onClick, active = false }) {
  const toneClasses = {
    olive:
      "border-l-[#98b56e] bg-[#32382b] text-[#d5e6bc] shadow-[inset_0_0_0_1px_rgba(152,181,110,0.06)]",
    amber:
      "border-l-[#d6be4a] bg-[#383525] text-[#eadd8c] shadow-[inset_0_0_0_1px_rgba(214,190,74,0.06)]",
    danger:
      "border-l-[#d47a72] bg-[#382727] text-[#efb1ad] shadow-[inset_0_0_0_1px_rgba(212,122,114,0.06)]",
  };

  return (
    <button
      type="button"
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onClick?.();
      }}
      className={`w-full rounded-[2px] border-l-2 px-2.5 text-left transition hover:brightness-110 ${
        compact ? "py-1.5" : "py-2"
      } ${toneClasses[event.tone] ?? toneClasses.olive} ${
        active ? "ring-1 ring-[#d8c15f]/70" : ""
      }`}
    >
      <p
        className={`font-public font-bold uppercase tracking-[0.08em] ${
          compact ? "text-[7px] leading-3" : "text-[8px] leading-3"
        }`}
      >
        {event.title}
      </p>
      {event.subtitle && (
        <p
          className={`mt-1 font-public font-semibold uppercase tracking-[0.08em] opacity-90 ${
            compact ? "text-[7px] leading-3" : "text-[8px] leading-3"
          }`}
        >
          {event.subtitle}
        </p>
      )}
      <p
        className={`mt-1 font-public uppercase tracking-[0.08em] opacity-60 ${
          compact ? "text-[6px]" : "text-[7px]"
        }`}
      >
        {event.time}
      </p>
    </button>
  );
}

function ScheduleMetricCard({ item }) {
  const accents = {
    lime: "border-l-[#a8d07c] text-[#a8d07c]",
    amber: "border-l-[#d8c15f] text-[#d8c15f]",
    stone: "border-l-[#8d8d8d] text-[#f1b0a8]",
  };

  return (
    <div className="border border-white/6 bg-[#171717] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
      <div className={`border-l-2 pl-4 ${accents[item.accent]}`}>
        <p className="font-public text-[10px] uppercase tracking-[0.3em] text-stone-500">
          {item.label}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-4xl font-bold leading-none text-stone-100">
              {item.value}
            </p>
            <p className="mt-2 font-public text-[11px] font-semibold uppercase tracking-[0.08em] text-inherit">
              {item.detail}
            </p>
          </div>

          {item.progress ? (
            <div className="w-16 shrink-0">
              <div className="h-2 overflow-hidden rounded-full bg-[#3a3933]">
                <div
                  className="h-full rounded-full bg-[#d8c15f]"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ScheduleFeedItem({ event, dateLabel, active = false, onSelect, onEdit }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-[2px] border p-4 md:flex-row md:items-start md:justify-between ${
        active
          ? "border-[#d8c15f]/30 bg-[#262218]"
          : "border-white/6 bg-black/20"
      }`}
    >
      <div className="space-y-1">
        <p className="font-public text-[9px] uppercase tracking-[0.25em] text-stone-500">
          {dateLabel}
        </p>
        <button
          type="button"
          onClick={onSelect}
          className="text-left transition hover:opacity-90"
        >
          <h4 className="font-sans text-lg font-bold text-stone-100">
            {event.title}
          </h4>
        </button>
        <p className="font-public text-[11px] uppercase tracking-[0.12em] text-[#9dba74]">
          {event.subtitle}
        </p>
      </div>

      <div className="grid gap-3 text-left md:min-w-[250px]">
        <div>
          <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-500">
            Time Slot
          </p>
          <p className="mt-1 font-public text-[12px] text-stone-200">
            {event.time}
          </p>
        </div>
        <div>
          <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-500">
            Coordinator
          </p>
          <p className="mt-1 font-public text-[12px] text-stone-300">
            {event.coordinator}
          </p>
        </div>
        <div>
          <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-500">
            Location
          </p>
          <p className="mt-1 font-public text-[12px] text-stone-300">
            {event.location}
          </p>
        </div>
      </div>

      <div className="md:max-w-[280px]">
        <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-500">
          Tactical Note
        </p>
        <p className="mt-1 text-sm leading-6 text-stone-400">
          {event.objective}
        </p>
      </div>

      <div className="flex items-start md:self-center">
        <button
          type="button"
          onClick={onEdit}
          className="border border-white/8 bg-black/30 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
        >
          Edit Slot
        </button>
      </div>
    </div>
  );
}

function ScheduleEditorModal({
  mode,
  event,
  selectedDate,
  onClose,
  onSave,
  onDelete,
}) {
  const [formState, setFormState] = useState(() =>
    getScheduleEditorFormState(event, selectedDate),
  );
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleChange = (field) => (changeEvent) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: changeEvent.target.value,
    }));
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();

    if (!formState.title.trim() || !formState.date.trim()) {
      setValidationMessage("Tanggal dan nama jadwal wajib diisi.");
      return;
    }

    onSave(
      normalizeScheduleEvent({
        ...event,
        id: event?.id ?? createScheduleId(),
        date: formState.date,
        title: formState.title,
        subtitle: formState.subtitle,
        time: formState.time,
        tone: formState.tone,
        capacity: Number(formState.capacity || 0),
        location: formState.location,
        coordinator: formState.coordinator,
        objective: formState.objective,
      }),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl border border-white/8 bg-[#161616] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-4">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.25em] text-[#8da16b]">
              Realtime Schedule Editor
            </p>
            <h3 className="mt-2 font-sans text-2xl font-bold text-stone-100">
              {mode === "create" ? "Tambah Jadwal Baru" : "Edit Jadwal Aktif"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Tanggal
            </span>
            <input
              type="date"
              min={`${MIN_SCHEDULE_YEAR}-01-01`}
              value={formState.date}
              onChange={handleChange("date")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Time Slot
            </span>
            <input
              value={formState.time}
              onChange={handleChange("time")}
              placeholder="08:00 - 16:00 HRS"
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Nama Petugas
            </span>
            <input
              value={formState.title}
              onChange={handleChange("title")}
              placeholder="SGT. MILLER"
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Unit / Golongan
            </span>
            <input
              value={formState.subtitle}
              onChange={handleChange("subtitle")}
              placeholder="GOLONGAN 1"
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Tone
            </span>
            <select
              value={formState.tone}
              onChange={handleChange("tone")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            >
              {SCHEDULE_TONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Capacity
            </span>
            <input
              type="number"
              min="0"
              value={formState.capacity}
              onChange={handleChange("capacity")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Location
            </span>
            <input
              value={formState.location}
              onChange={handleChange("location")}
              placeholder="Ops Chamber 2"
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Coordinator
            </span>
            <input
              value={formState.coordinator}
              onChange={handleChange("coordinator")}
              placeholder="Price / Desk B"
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-[#8da16b]"
            />
          </label>
        </div>

        <label className="mt-4 grid gap-2">
          <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
            Tactical Note
          </span>
          <textarea
            value={formState.objective}
            onChange={handleChange("objective")}
            rows={4}
            placeholder="Tulis ringkasan tujuan sesi, catatan screening, atau kebutuhan khusus."
            className="resize-none border border-white/8 bg-black/20 px-3 py-3 text-sm leading-6 text-stone-100 outline-none transition focus:border-[#8da16b]"
          />
        </label>

        {validationMessage ? (
          <p className="mt-4 font-public text-[10px] uppercase tracking-[0.16em] text-rose-300">
            {validationMessage}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 border-t border-white/6 pt-4 md:flex-row md:items-center md:justify-between">
          <div>
            {mode === "edit" ? (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15"
              >
                Delete Slot
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/8 bg-black/20 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#b3cf83] px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-105"
            >
              {mode === "create" ? "Save New Slot" : "Update Slot"}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function ArchiveReportEditorModal({ report, onClose, onSave, onEliminate }) {
  const [formState, setFormState] = useState(() => ({
    name: report.name,
    discord: report.discord,
    group: report.group,
    status: report.status,
    age: report.age,
    gender: report.gender,
    question: report.question,
    notes: report.notes,
  }));

  useEffect(() => {
    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleChange = (field) => (changeEvent) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: changeEvent.target.value,
    }));
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    onSave({
      ...report,
      ...formState,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-3xl border border-white/8 bg-[#181818] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-4">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.24em] text-amber-300">
              Recruitment Archive
            </p>
            <h3 className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
              Edit Laporan
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Nama Kandidat
            </span>
            <input
              value={formState.name}
              onChange={handleChange("name")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Discord
            </span>
            <input
              value={formState.discord}
              onChange={handleChange("discord")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Golongan
            </span>
            <select
              value={formState.group}
              onChange={handleChange("group")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
            >
              <option value="GOL A">GOL A</option>
              <option value="GOL B">GOL B</option>
              <option value="GOL C">GOL C</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Status
            </span>
            <select
              value={formState.status}
              onChange={handleChange("status")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
            >
              <option value="LULUS">LULUS</option>
              <option value="GAGAL">GAGAL</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Usia
            </span>
            <input
              value={formState.age}
              onChange={handleChange("age")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Gender
            </span>
            <input
              value={formState.gender}
              onChange={handleChange("gender")}
              className="border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>
        </div>

        <label className="mt-4 grid gap-2">
          <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
            Pertanyaan Strategis
          </span>
          <textarea
            rows={3}
            value={formState.question}
            onChange={handleChange("question")}
            className="resize-none border border-white/8 bg-black/20 px-3 py-3 text-sm leading-6 text-stone-100 outline-none transition focus:border-amber-300"
          />
        </label>

        <label className="mt-4 grid gap-2">
          <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
            Keterangan Analis
          </span>
          <textarea
            rows={5}
            value={formState.notes}
            onChange={handleChange("notes")}
            className="resize-none border border-white/8 bg-black/20 px-3 py-3 text-sm leading-6 text-stone-100 outline-none transition focus:border-amber-300"
          />
        </label>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/6 pt-4 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={onEliminate}
            className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15"
          >
            Eliminasi Kandidat
          </button>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/8 bg-black/20 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105"
            >
              Simpan Laporan
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function ArchiveReportSupplementModal({
  mode,
  report,
  supplement,
  onClose,
  onSave,
  onDelete,
}) {
  const [question, setQuestion] = useState(
    supplement?.question ?? `Update lanjutan untuk kandidat ${report.name}?`,
  );
  const [notes, setNotes] = useState(supplement?.notes ?? "");

  useEffect(() => {
    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    onSave(report.id, {
      id: supplement?.id ?? `archive-supplement-${Date.now()}`,
      question,
      notes,
      updatedAt: new Date().toISOString(),
    });
  };

  const isEditMode = mode === "edit";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl border border-white/8 bg-[#181818] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-4">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.24em] text-amber-300">
              Recruitment Archive
            </p>
            <h3 className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
              {isEditMode ? "Edit Laporan Tambahan" : "Tambah Laporan Tambahan"}
            </h3>
            <p className="mt-2 font-public text-[11px] uppercase tracking-[0.12em] text-stone-400">
              {report.name} / {report.discord}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Close
          </button>
        </div>

        <label className="mt-5 grid gap-2">
          <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
            Pertanyaan Strategis
          </span>
          <textarea
            rows={3}
            value={question}
            onChange={(changeEvent) => setQuestion(changeEvent.target.value)}
            className="resize-none border border-white/8 bg-black/20 px-3 py-3 text-sm leading-6 text-stone-100 outline-none transition focus:border-amber-300"
          />
        </label>

        <label className="mt-4 grid gap-2">
          <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
            Keterangan Analis
          </span>
          <textarea
            rows={6}
            value={notes}
            onChange={(changeEvent) => setNotes(changeEvent.target.value)}
            className="resize-none border border-white/8 bg-black/20 px-3 py-3 text-sm leading-6 text-stone-100 outline-none transition focus:border-amber-300"
          />
        </label>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/6 pt-4 md:flex-row md:items-center md:justify-between">
          <div>
            {isEditMode ? (
              <button
                type="button"
                onClick={() => onDelete(report.id, supplement.id)}
                className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15"
              >
                Hapus Laporan
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/8 bg-black/20 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105"
            >
              {isEditMode ? "Simpan Perubahan" : "Simpan Tambahan"}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function ArchiveReportCard({
  report,
  onEdit,
  onAddSupplement,
  onEditSupplement,
  onEliminate,
}) {
  const groupClasses = getArchiveGroupClasses(report.group);
  const statusClasses = getArchiveStatusClasses(report.status);

  return (
    <article className="relative flex h-full flex-col justify-between overflow-hidden bg-[#272727] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
      <div>
        <div className="flex items-start justify-between gap-4 pb-6">
          <div>
            <h3 className="font-sans text-2xl font-bold text-stone-200">
              {report.name}
            </h3>
            <div className="mt-2 flex items-center gap-2 opacity-70">
              <span className="h-3 w-3 rounded-full bg-stone-200" />
              <span className="font-public text-xs font-medium text-stone-200">
                {report.discord}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className={`border-l-2 bg-stone-950 px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.08em] ${groupClasses}`}
            >
              {report.group}
            </div>
            <div
              className={`rounded-sm px-2 py-0.5 font-public text-[9px] font-bold uppercase outline outline-1 outline-offset-[-1px] ${statusClasses}`}
            >
              {report.status}
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/5 pb-4 md:grid-cols-2">
          <div className="bg-stone-950 p-3">
            <p className="font-public text-[9px] uppercase tracking-[0.08em] text-stone-200/40">
              Usia
            </p>
            <p className="mt-1 text-sm font-bold text-stone-200">{report.age}</p>
          </div>
          <div className="bg-stone-950 p-3">
            <p className="font-public text-[9px] uppercase tracking-[0.08em] text-stone-200/40">
              Gender
            </p>
            <p className="mt-1 text-sm font-bold uppercase text-stone-200">
              {report.gender}
            </p>
          </div>
        </div>

        <div className="border border-white/5 bg-stone-950 p-4">
          <div className="space-y-3">
            <div>
              <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
                Pertanyaan Strategis
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-200/80">
                &quot;{report.question}&quot;
              </p>
            </div>
            <div>
              <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
                Keterangan Analis
              </p>
              <p className="mt-1 whitespace-pre-line text-xs leading-5 text-stone-200/90">
                {report.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 border border-white/5 bg-[#1a1a1a] p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
              Laporan Tambahan
            </p>
            <span className="font-public text-[9px] font-bold uppercase tracking-[0.12em] text-stone-500">
              {report.additionalReports.length} Entry
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {report.additionalReports.length > 0 ? (
              report.additionalReports.map((entry, index) => (
                <div key={entry.id} className="border border-white/5 bg-stone-950 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
                        Laporan Tambahan {`${index + 1}`.padStart(2, "0")}
                      </p>
                      <p className="mt-2 font-public text-[8px] uppercase tracking-[0.14em] text-stone-500">
                        {formatArchiveTimestamp(new Date(entry.updatedAt))}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEditSupplement(entry)}
                      className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                    >
                      Edit Tambahan
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
                        Pertanyaan Strategis
                      </p>
                      <p className="mt-1 text-xs leading-5 text-stone-200/80">
                        &quot;{entry.question}&quot;
                      </p>
                    </div>
                    <div>
                      <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
                        Keterangan Analis
                      </p>
                      <p className="mt-1 whitespace-pre-line text-xs leading-5 text-stone-200/90">
                        {entry.notes}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-white/6 bg-black/20 px-3 py-5 text-center">
                <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                  Belum ada laporan tambahan untuk kandidat ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={onAddSupplement}
          className="flex w-full items-center justify-center gap-2 border border-white/8 bg-black/20 px-4 py-3 font-public text-xs font-bold uppercase tracking-[0.18em] text-stone-200 transition hover:bg-white/5 hover:text-stone-100"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
            <path d="M7 2h2v5h5v2H9v5H7V9H2V7h5V2z" />
          </svg>
          Tambah Laporan
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="flex w-full items-center justify-center gap-2 bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-3 font-public text-xs font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
            <path d="M11.9 1.6l2.5 2.5-7.8 7.8-3.4.9.9-3.4 7.8-7.8zm-8 8.9l1.2 1.2-.4 1.3 1.3-.4 6.9-6.9-1-1-7 5.8zm8.8-8 .9-.9 2.5 2.5-.9.9-2.5-2.5z" />
          </svg>
          Edit Laporan
        </button>

        <button
          type="button"
          onClick={onEliminate}
          className="flex w-full items-center justify-center gap-2 border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-public text-xs font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
            <path d="M3.5 4h9l-.7 9.2A1 1 0 0 1 10.8 14H5.2a1 1 0 0 1-1-.8L3.5 4zm2-2h5l.6 1H14v1H2V3h2.9l.6-1zM6 6h1v6H6V6zm3 0h1v6H9V6z" />
          </svg>
          Eliminasi Kandidat
        </button>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-[linear-gradient(225deg,rgba(168,162,158,0.08)_0%,rgba(168,162,158,0)_100%)]" />
    </article>
  );
}

function RecruitmentReportModal({ data, onClose, anchorRect }) {
  const [question, setQuestion] = useState(
    `Apa keputusan akhir untuk kandidat ${data.roblox} pada ${data.group}?`,
  );
  const [notes, setNotes] = useState(
    `${data.roblox} terhubung melalui ${data.discord} dengan status ${data.status}. Dokumentasikan hasil screening, observasi perilaku, dan tindak lanjut recruiter pada laporan ini.`,
  );
  const [feedback, setFeedback] = useState("");
  const [showEntryGlitch, setShowEntryGlitch] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowEntryGlitch(false), 360);
    return () => window.clearTimeout(timeout);
  }, []);

  const motionProfile = useMemo(() => {
    if (typeof window === "undefined" || !anchorRect) {
      return {
        originX: 0.88,
        originY: 0.52,
        offsetX: 128,
        offsetY: 28,
        skew: 10,
        rotate: 3.5,
      };
    }

    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const anchorCenterY = anchorRect.top + anchorRect.height / 2;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    return {
      originX: Math.min(1, Math.max(0, anchorCenterX / window.innerWidth)),
      originY: Math.min(1, Math.max(0, anchorCenterY / window.innerHeight)),
      offsetX: (anchorCenterX - viewportCenterX) * 0.42,
      offsetY: (anchorCenterY - viewportCenterY) * 0.32,
      skew: anchorCenterX >= viewportCenterX ? 10 : -10,
      rotate: anchorCenterX >= viewportCenterX ? 3.5 : -3.5,
    };
  }, [anchorRect]);

  const handleDraft = () => {
    setQuestion(`Apakah ${data.roblox} siap masuk tahap akhir rekrutmen?`);
    setNotes(
      `Kandidat ${data.roblox} (${data.gender}, ${data.age} tahun) berada di ${data.group} dengan status ${data.status}. Tambahkan catatan tentang disiplin, kesiapan misi, dan rekomendasi akhir sebelum keputusan resmi.`,
    );
    setFeedback("Draft laporan kandidat berhasil dimuat.");
  };

  const handleSubmit = () => {
    setFeedback(`Laporan untuk ${data.roblox} siap dikirim melalui secure channel.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[240] flex items-center justify-center bg-[#131313]/80 p-4 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <motion.div
        style={{
          originX: motionProfile.originX,
          originY: motionProfile.originY,
        }}
        initial={{
          opacity: 0,
          x: motionProfile.offsetX,
          y: motionProfile.offsetY,
          scaleX: 0.08,
          scaleY: 0.14,
          skewX: motionProfile.skew,
          rotateZ: motionProfile.rotate,
          clipPath: "inset(46% 0 46% 0 round 4px)",
          filter: "blur(14px)",
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          skewX: 0,
          rotateZ: 0,
          clipPath: "inset(0% 0% 0% 0% round 4px)",
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          x: motionProfile.offsetX * 0.92,
          y: motionProfile.offsetY * 0.92,
          scaleX: 0.08,
          scaleY: 0.14,
          skewX: motionProfile.skew,
          rotateZ: motionProfile.rotate,
          clipPath: "inset(48% 0 48% 0 round 4px)",
          filter: "blur(10px)",
        }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[640px]"
        onClick={(event) => event.stopPropagation()}
      >
        <motion.div
          initial={{
            opacity: 0.32,
            x: motionProfile.offsetX * 0.16,
            y: motionProfile.offsetY * 0.16,
            scaleX: 0.82,
            scaleY: 0.12,
          }}
          animate={{
            opacity: 0,
            x: 0,
            y: 0,
            scaleX: 1.04,
            scaleY: 1,
          }}
          exit={{
            opacity: 0.22,
            x: motionProfile.offsetX * 0.12,
            y: motionProfile.offsetY * 0.12,
            scaleX: 0.78,
            scaleY: 0.12,
          }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 rounded-[4px] bg-[linear-gradient(135deg,rgba(233,195,73,0.18)_0%,rgba(174,209,143,0.10)_35%,rgba(255,255,255,0.04)_100%)] blur-xl"
        />

        <motion.div
          initial={{
            opacity: 0.22,
            x: motionProfile.offsetX * 0.24,
            y: motionProfile.offsetY * 0.24,
            scaleX: 0.72,
            scaleY: 0.08,
          }}
          animate={{
            opacity: 0,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
          }}
          exit={{
            opacity: 0.18,
            x: motionProfile.offsetX * 0.18,
            y: motionProfile.offsetY * 0.18,
            scaleX: 0.7,
            scaleY: 0.08,
          }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#E9C349]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_45%)]"
        />

        <AnimatePresence>
          {showEntryGlitch && (
            <>
              <motion.div
                initial={{ opacity: 0, x: motionProfile.offsetX * 0.2, skewX: motionProfile.skew }}
                animate={{ opacity: [0, 0.55, 0.15, 0], x: [motionProfile.offsetX * 0.2, -18, 10, 0], skewX: [motionProfile.skew, -6, 3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34, times: [0, 0.22, 0.6, 1], ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 rounded-[4px] bg-[linear-gradient(90deg,rgba(255,0,85,0.14)_0%,rgba(255,255,255,0.08)_45%,rgba(0,255,255,0.16)_100%)] mix-blend-screen"
              />
              <motion.div
                initial={{ opacity: 0.7, scaleY: 0.06, y: motionProfile.offsetY * 0.35 }}
                animate={{ opacity: [0.7, 0.2, 0], scaleY: [0.06, 1, 1], y: [motionProfile.offsetY * 0.35, -6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-0 rounded-[4px] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.14)_0px,rgba(255,255,255,0.14)_2px,transparent_2px,transparent_8px)] mix-blend-screen"
              />
              <motion.div
                initial={{ opacity: 0, x: -22 }}
                animate={{ opacity: [0, 0.5, 0], x: [-22, 12, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="pointer-events-none absolute inset-y-8 left-0 w-24 bg-[linear-gradient(90deg,rgba(255,0,85,0.0)_0%,rgba(255,0,85,0.32)_100%)] blur-md"
              />
            </>
          )}
        </AnimatePresence>

        <div className="relative flex flex-col overflow-hidden rounded-[4px] border border-[#43483d]/20 bg-[#1c1b1bd9] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-[10px]">
          <div className="flex items-start justify-between px-5 py-4 md:px-8 md:pb-3 md:pt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#E9C349]" />
                <p className="font-public text-[10px] font-normal uppercase leading-[15px] tracking-[0.2em] text-stone-200/60">
                  Internal Communication #REK-772
                </p>
              </div>
              <h2 className="font-sans text-2xl font-bold uppercase leading-none text-[#E5E2E1] md:text-[32px]">
                LAPORAN REKRUTMEN
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-[2px] p-2 text-stone-200/50 transition hover:bg-white/5 hover:text-stone-100"
              aria-label="Close report modal"
            >
              <svg
                viewBox="0 0 14 14"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M3 3L11 11" />
                <path d="M11 3L3 11" />
              </svg>
            </button>
          </div>

          <div className="h-px w-full bg-[linear-gradient(90deg,rgba(67,72,61,0)_0%,rgba(67,72,61,0.30)_50%,rgba(67,72,61,0)_100%)]" />

          <div className="flex flex-col gap-5 px-5 py-5 md:px-8 md:py-6">
          <div className="grid gap-2 rounded-[2px] border border-white/5 bg-black/15 p-3 md:grid-cols-3">
            <div>
              <p className="font-public text-[9px] uppercase tracking-[0.25em] text-stone-500">
                Kandidat
              </p>
              <p className="mt-1.5 font-sans text-[13px] font-semibold text-stone-100">
                {data.roblox}
              </p>
            </div>
            <div>
              <p className="font-public text-[9px] uppercase tracking-[0.25em] text-stone-500">
                Discord
              </p>
              <p className="mt-1.5 font-public text-[13px] text-stone-300">
                {data.discord}
              </p>
            </div>
            <div>
              <p className="font-public text-[9px] uppercase tracking-[0.25em] text-stone-500">
                Status Operasi
              </p>
              <p className="mt-1.5 font-public text-[13px] text-[#AED18F]">
                {data.status} • {data.group}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-public text-xs font-bold uppercase tracking-[0.1em] text-[#AED18F]">
                Pertanyaan
              </p>
              <p className="font-public text-[9px] uppercase tracking-[0.08em] text-stone-200/40">
                Mandatory Input
              </p>
            </div>

            <div className="rounded-[2px] bg-[#0E0E0E] px-4 py-3.5">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Enter recruitment query parameters..."
                className="font-public w-full bg-transparent text-[13px] text-stone-200 placeholder:text-stone-200/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-public text-xs font-bold uppercase tracking-[0.1em] text-[#AED18F]">
                Keterangan
              </p>
              <p className="font-public text-[9px] uppercase tracking-[0.08em] text-stone-200/40">
                Operational Observations
              </p>
            </div>

            <div className="rounded-[2px] bg-[#0E0E0E] px-4 py-3.5">
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Document specific candidate traits or mission deviations..."
                rows={5}
                className="font-public min-h-28 w-full resize-none bg-transparent text-[13px] leading-5 text-stone-200 placeholder:text-stone-200/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 md:flex-row">
            <button
              type="button"
              onClick={handleDraft}
              className="flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-[#353534] px-4 py-3 font-public text-[13px] font-bold uppercase tracking-[0.1em] text-[#E5E2E1] transition hover:bg-[#454543]"
            >
              <svg viewBox="0 0 16 15" className="h-3.5 w-3.5 fill-current">
                <path d="M2 3.5h12v2H2zm0 3.5h12v2H2zm0 3.5h8v2H2z" />
              </svg>
              Tambahkan Laporan
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-[linear-gradient(177deg,#E9C349_0%,#BE9B23_100%)] px-4 py-3 font-public text-[13px] font-bold uppercase tracking-[0.1em] text-[#3C2F00] transition hover:brightness-105"
            >
              <svg viewBox="0 0 15 12" className="h-3 w-3 fill-current">
                <path d="M14.5 0L0 6.3l5.2 2 2 3.7L14.5 0zm-8 6.4l6-3.4-4.3 5.2-.8-1.8-.9 0z" />
              </svg>
              Kirim Laporan
            </button>
          </div>

          {feedback && (
            <p className="font-public text-[11px] uppercase tracking-[0.12em] text-[#AED18F]">
              {feedback}
            </p>
          )}
        </div>

          <div className="flex items-center justify-between bg-[#1C1B1B] px-5 py-2.5 md:px-8">
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#AED18F]/30" />
              <span className="h-1 w-1 rounded-full bg-[#AED18F]/30" />
              <span className="h-1 w-1 rounded-full bg-[#AED18F]/30" />
            </div>
            <p className="font-public text-[9px] uppercase tracking-[0.3em] text-stone-200/30">
              Secure Channel Encrypted
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({ data }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalAnchor, setModalAnchor] = useState(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (!isGlitching) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setIsGlitching(false), 280);
    return () => window.clearTimeout(timeout);
  }, [isGlitching]);

  useEffect(() => {
    if (!isOpening) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setOpenModal(true);
      setIsOpening(false);
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [isOpening]);

  const handleOpenModal = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setModalAnchor({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setIsGlitching(true);
    setIsOpening(true);
  };

  return (
    <>
      <div className="flex items-center rounded-sm bg-[#131313] p-4 transition hover:bg-[#1c1c1c] hover:drop-shadow-lg">
        <div className="w-1/4 text-white">{data.roblox}</div>
        <div className="w-1/4 text-gray-400">{data.discord}</div>
        <div className="w-1/12 text-center text-white">{data.age}</div>
        <div className="w-1/12 text-center text-white">{data.gender}</div>
        <div className="w-1/6 text-white">{data.group}</div>
        <div className="w-1/6">
          <StatusPill status={data.status} />
        </div>
        <div className="w-1/12 text-right">
          <motion.button
            type="button"
            animate={
              isGlitching
                ? {
                    x: [0, -3, 4, -2, 0],
                    y: [0, 1, -1, 0],
                    filter: [
                      "drop-shadow(0 0 0 rgba(96,165,250,0))",
                      "drop-shadow(0 0 10px rgba(96,165,250,0.45))",
                      "drop-shadow(0 0 14px rgba(248,113,113,0.35))",
                      "drop-shadow(0 0 0 rgba(96,165,250,0))",
                    ],
                  }
                : { x: 0, y: 0, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))" }
            }
            transition={{ duration: 0.24, ease: "easeInOut" }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden rounded-sm border border-blue-400 bg-blue-500/20 px-2 py-1 text-xs transition hover:bg-blue-500/30"
            onClick={handleOpenModal}
          >
            <span className="relative z-10">Open</span>

            <AnimatePresence>
              {isGlitching && (
                <>
                  <motion.span
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: [0, 0.55, 0], x: [0, 6, -2] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(248,113,113,0.28)_0%,rgba(255,255,255,0)_55%,rgba(34,211,238,0.28)_100%)] mix-blend-screen"
                  />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0.2, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0.18)_1px,transparent_1px,transparent_5px)] mix-blend-screen"
                  />
                  <motion.span
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: [0, 0.75, 0], x: [0, -5, 3] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-[11px] text-cyan-300"
                  >
                    Open
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: [0, 0.75, 0], x: [0, 5, -3] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-[11px] text-rose-400"
                  >
                    Open
                  </motion.span>
                </>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {openModal && (
          <RecruitmentReportModal
            data={data}
            anchorRect={modalAnchor}
            onClose={() => setOpenModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function DashboardHome() {
  const {
    data: candidates,
    loading: candidatesLoading,
    error: candidatesError,
  } = useSyncedResource(RESOURCE_KEYS.dashboardCandidates, {
    defaultValue: [],
    saveDelay: 500,
    normalize: (value) =>
      Array.isArray(value)
        ? value.map((candidate) => ({
            roblox: candidate.roblox?.trim() || "Unknown",
            discord: candidate.discord?.trim() || "unknown#0000",
            age: Number(candidate.age) || 0,
            gender: candidate.gender?.trim() || "Tidak Diketahui",
            group: candidate.group?.trim() || "Golongan 1",
            status: candidate.status?.trim() || "Review",
            createdAt: candidate.createdAt || new Date().toISOString(),
            updatedAt: candidate.updatedAt || candidate.createdAt || new Date().toISOString(),
          }))
        : [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const weeklyData = useMemo(() => buildCandidateWeeklyData(candidates), [candidates]);

  const filteredPlayers = useMemo(
    () =>
      candidates.filter((player) => {
        return (
          player.roblox.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterGroup === "" || player.group === filterGroup) &&
          (filterStatus === "" || player.status === filterStatus)
        );
      }),
    [candidates, filterGroup, filterStatus, searchTerm],
  );

  const total = candidates.length;
  const approved = candidates.filter((player) => player.status === "Approved").length;
  const rejected = candidates.filter((player) => player.status === "Rejected").length;
  const approvalRate = total ? Math.round((approved / total) * 100) : 0;
  const last = weeklyData[weeklyData.length - 1]?.total ?? 0;
  const previous = weeklyData[weeklyData.length - 2]?.total ?? 0;
  const growth = previous ? (((last - previous) / previous) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]">
            Phase: Screening
          </span>
          <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]" />
        </div>

        <h1 className="text-2xl font-bold">Dashboard Data</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Dashboard data untuk men-sortir dan mengelompokkan pendaftar ke dalam
          golongan dan tugas, sekaligus membantu recruiter mengambil tindakan
          berikutnya.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Pendaftar"
          value={total}
          color="border-blue-500/30"
          strip="bg-blue-400"
        >
          <div className="mt-2 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-[10px] font-bold text-blue-400">
            +{growth}% minggu ini
          </p>
        </Card>

        <Card
          title="Diterima"
          value={approved}
          color="border-green-500/30"
          strip="bg-green-400"
        >
          <div className="mt-2">
            <div className="h-2 w-full overflow-hidden bg-[#1C1B1B]">
              <div
                className="h-full bg-green-400"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] font-bold text-green-400">
              Approval Rate: {approvalRate}%
            </p>
          </div>
        </Card>

        <Card
          title="Ditolak"
          value={rejected}
          color="border-red-500/30"
          strip="bg-red-400"
        >
          <div className="absolute inset-0 bg-red-500/10 opacity-30 blur-xl" />
          <div className="relative mt-2 rounded-sm border border-red-500/30 bg-red-500/10 px-2 py-1">
            <p className="text-[10px] font-bold text-red-400">
              Perlu evaluasi kandidat
            </p>
          </div>
        </Card>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#1C1B1B]/90 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
              Candidate Table
            </p>
            <h2 className="mt-2 text-lg font-bold text-white">
              Daftar Pendaftar Aktif
            </h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full rounded-sm border border-gray-600 bg-[#111111] px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 sm:w-[220px]"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="w-full rounded-sm border border-gray-600 bg-[#111111] px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 sm:w-auto"
              value={filterGroup}
              onChange={(event) => setFilterGroup(event.target.value)}
            >
              <option value="">All Groups</option>
              <option value="Golongan 1">Golongan 1</option>
              <option value="Golongan 2">Golongan 2</option>
            </select>
            <select
              className="w-full rounded-sm border border-gray-600 bg-[#111111] px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 sm:w-auto"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Review">Review</option>
            </select>
          </div>
        </div>

        {candidatesLoading ? (
          <div className="mt-4 rounded-sm border border-dashed border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
            Memuat data kandidat dari database...
          </div>
        ) : null}

        {candidatesError ? (
          <div className="mt-4 rounded-sm border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {candidatesError}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="mb-2 flex text-xs text-gray-400">
              <div className="w-1/4">Roblox</div>
              <div className="w-1/4">Discord</div>
              <div className="w-1/12 text-center">Age</div>
              <div className="w-1/12 text-center">Gender</div>
              <div className="w-1/6">Golongan</div>
              <div className="w-1/6">Status</div>
              <div className="w-1/12">Action</div>
            </div>

            <div className="flex flex-col gap-2">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <Row key={`${player.roblox}-${player.discord}`} data={player} />
                ))
              ) : (
                <div className="rounded-sm border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-stone-400">
                  Tidak ada kandidat yang cocok dengan filter saat ini.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
          <div>Total Pendaftar: {filteredPlayers.length}</div>
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-sm bg-gray-700 px-2 py-1 transition hover:bg-gray-600"
            >
              &lt;
            </button>
            <button
              type="button"
              className="rounded-sm bg-gray-700 px-2 py-1 transition hover:bg-gray-600"
            >
              1
            </button>
            <button
              type="button"
              className="rounded-sm bg-gray-700 px-2 py-1 transition hover:bg-gray-600"
            >
              2
            </button>
            <button
              type="button"
              className="rounded-sm bg-gray-700 px-2 py-1 transition hover:bg-gray-600"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JadwalPage() {
  const {
    data: scheduleEvents,
    setData: setScheduleEvents,
    loading: schedulesLoading,
    error: schedulesError,
  } = useSyncedResource(RESOURCE_KEYS.dashboardSchedules, {
    defaultValue: [],
    saveDelay: 450,
    normalize: loadStoredScheduleEvents,
  });
  const [zuluNow, setZuluNow] = useState(new Date());
  const [viewMode, setViewMode] = useState("MONTH");
  const [focusedMonth, setFocusedMonth] = useState(
    new Date(
      INITIAL_SCHEDULE_DATE.getFullYear(),
      INITIAL_SCHEDULE_DATE.getMonth(),
      1,
      12,
    ),
  );
  const [selectedDate, setSelectedDate] = useState(INITIAL_SCHEDULE_DATE);
  const [activeEventId, setActiveEventId] = useState(null);
  const [editorState, setEditorState] = useState({
    open: false,
    mode: "create",
    event: null,
  });
  const [syncStatus, setSyncStatus] = useState({
    message: "Realtime database sync active.",
    at: new Date(),
  });

  useEffect(() => {
    let lastCalendarDateKey = formatDateKey(getCurrentScheduleDate());

    const interval = window.setInterval(() => {
      const now = new Date();
      const currentCalendarDate = getCurrentScheduleDate(now);
      const currentCalendarDateKey = formatDateKey(currentCalendarDate);

      setZuluNow(now);

      if (currentCalendarDateKey !== lastCalendarDateKey) {
        lastCalendarDateKey = currentCalendarDateKey;
        setFocusedMonth(
          new Date(
            currentCalendarDate.getFullYear(),
            currentCalendarDate.getMonth(),
            1,
            12,
          ),
        );
        setSelectedDate(currentCalendarDate);
        setActiveEventId(null);
        setSyncStatus({
          message: "Tanggal kalender otomatis berpindah ke hari ini.",
          at: now,
        });
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const eventsByDate = useMemo(() => {
    return scheduleEvents.reduce((accumulator, event) => {
      const key = event.date;
      const nextEvents = [...(accumulator[key] ?? []), event].sort(
        (firstEvent, secondEvent) =>
          getTimeSortValue(firstEvent.time) - getTimeSortValue(secondEvent.time),
      );

      return {
        ...accumulator,
        [key]: nextEvents,
      };
    }, {});
  }, [scheduleEvents]);

  const monthGrid = useMemo(() => getMonthGrid(focusedMonth), [focusedMonth]);

  const weekDays = useMemo(() => {
    const weekStart = getStartOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }, [selectedDate]);

  const selectedDateEvents = useMemo(
    () => eventsByDate[formatDateKey(selectedDate)] ?? [],
    [eventsByDate, selectedDate],
  );

  const weekEvents = useMemo(
    () =>
      weekDays.map((date) => ({
        date,
        events: eventsByDate[formatDateKey(date)] ?? [],
      })),
    [eventsByDate, weekDays],
  );

  const visibleMonthEvents = useMemo(
    () =>
      scheduleEvents.filter((event) =>
        isSameMonth(createLocalDate(event.date), focusedMonth),
      ),
    [focusedMonth, scheduleEvents],
  );

  const activeFeedEntries = useMemo(() => {
    if (viewMode === "WEEK") {
      return weekEvents.flatMap((entry) =>
        entry.events.map((event) => ({ date: entry.date, event })),
      );
    }

    return selectedDateEvents.map((event) => ({ date: selectedDate, event }));
  }, [selectedDate, selectedDateEvents, viewMode, weekEvents]);

  const resolvedActiveEventId = useMemo(() => {
    if (activeFeedEntries.some(({ event }) => event.id === activeEventId)) {
      return activeEventId;
    }

    return activeFeedEntries[0]?.event.id ?? null;
  }, [activeEventId, activeFeedEntries]);

  const activeEntry = useMemo(
    () =>
      activeFeedEntries.find(({ event }) => event.id === resolvedActiveEventId) ??
      activeFeedEntries[0] ??
      null,
    [activeFeedEntries, resolvedActiveEventId],
  );

  const activeEvent = activeEntry?.event ?? null;
  const activeEventDate = activeEntry?.date ?? selectedDate;

  const scheduleMetrics = useMemo(() => {
    const recruitShift = visibleMonthEvents.reduce(
      (total, event) => total + event.capacity,
      0,
    );
    const golongan1Load = visibleMonthEvents
      .filter((event) => event.subtitle.includes("GOLONGAN 1"))
      .reduce((total, event) => total + event.capacity, 0);
    const golongan1Capacity = Math.min(
      100,
      Math.round((golongan1Load / 61) * 100),
    );
    const activeApplicants = ACTIVE_APPLICANTS_BASE + visibleMonthEvents.length * 2;
    const unscheduledCount = Math.max(
      0,
      8 - Math.floor(visibleMonthEvents.length / 3),
    );

    return [
      {
        label: "PEREKRUT SHIFT",
        value: `${recruitShift}`,
        detail: `${visibleMonthEvents.length} slots scheduled`,
        accent: "lime",
      },
      {
        label: "KAPASITAS GOLONGAN 1",
        value: `${golongan1Capacity}%`,
        detail: "Screening lane stable",
        accent: "amber",
        progress: golongan1Capacity,
      },
      {
        label: "PENDAFTAR AKTIF",
        value: `${activeApplicants}`,
        detail: activeApplicants > 500 ? "Tactical Load High" : "Lane Stable",
        accent: "lime",
      },
      {
        label: "BELUM DI JADWALKAN",
        value: `${unscheduledCount}`.padStart(2, "0"),
        detail: unscheduledCount > 0 ? "Action Required" : "Clear",
        accent: unscheduledCount > 0 ? "stone" : "lime",
      },
    ];
  }, [visibleMonthEvents]);

  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const zuluDate = zuluNow.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const zuluTime = zuluNow.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  const monthHeading = focusedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const liveCalendarDate = useMemo(() => getCurrentScheduleDate(zuluNow), [zuluNow]);
  const todayDateKey = formatDateKey(liveCalendarDate);
  const scheduleReferenceDate = useMemo(
    () =>
      isSameDay(selectedDate, liveCalendarDate)
        ? zuluNow
        : new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0,
            0,
          ),
    [liveCalendarDate, selectedDate, zuluNow],
  );
  const nearestScheduleIndicator = useMemo(
    () => getNearestScheduleIndicator(scheduleEvents, scheduleReferenceDate),
    [scheduleEvents, scheduleReferenceDate],
  );
  const nearestScheduleDateLabel = nearestScheduleIndicator
    ? nearestScheduleIndicator.startAt.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;
  const nearestScheduleTimeLabel = nearestScheduleIndicator
    ? nearestScheduleIndicator.startAt.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const nearestScheduleTheme = useMemo(() => {
    if (!nearestScheduleIndicator) {
      return {
        card: "border-l-2 border-white/10 bg-[#171717]",
        icon: "border-white/10 text-stone-300",
        accent: "text-stone-300",
        badge: "bg-white/10 text-stone-300",
        footer: "text-stone-500",
      };
    }

    if (nearestScheduleIndicator.state === "recent") {
      return {
        card: "border-l-2 border-[#d47a72] bg-[#1b1313]",
        icon: "border-[#d47a72]/40 text-[#efb1ad]",
        accent: "text-[#efb1ad]",
        badge: "bg-[#d47a72] text-black",
        footer: "text-rose-200/80",
      };
    }

    if (
      nearestScheduleIndicator.state === "ongoing" ||
      nearestScheduleIndicator.distanceMs <= 7 * 24 * 60 * 60 * 1000
    ) {
      return {
        card: "border-l-2 border-[#d8c15f] bg-[#171717]",
        icon: "border-[#d8c15f]/40 text-[#d8c15f]",
        accent: "text-[#d8c15f]",
        badge: "bg-[#d8c15f] text-black",
        footer: "text-[#eadd8c]",
      };
    }

    return {
      card: "border-l-2 border-[#8da16b] bg-[#141814]",
      icon: "border-[#8da16b]/40 text-[#8da16b]",
      accent: "text-[#b7d48f]",
      badge: "bg-[#8da16b] text-black",
      footer: "text-[#cde5ae]",
    };
  }, [nearestScheduleIndicator]);
  const scheduleYearOptions = useMemo(() => {
    const knownYears = scheduleEvents.map((event) => createLocalDate(event.date).getFullYear());
    const endYear = Math.max(liveCalendarDate.getFullYear() + 3, ...knownYears);

    return Array.from(
      { length: endYear - MIN_SCHEDULE_YEAR + 1 },
      (_, index) => MIN_SCHEDULE_YEAR + index,
    );
  }, [liveCalendarDate, scheduleEvents]);

  const resolvedSyncStatus = schedulesLoading
    ? {
        message: "Memuat jadwal dari database...",
        at: syncStatus.at,
      }
    : schedulesError
      ? {
          message: schedulesError,
          at: syncStatus.at,
        }
      : syncStatus;

  const syncTimeLabel = resolvedSyncStatus.at.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleShiftMonth = (direction) => {
    const nextMonth = addMonths(focusedMonth, direction);
    setFocusedMonth(nextMonth);
    setSelectedDate(nextMonth);
  };

  const handleShiftYear = (direction) => {
    const nextMonth = addYears(focusedMonth, direction);
    const safeDay = Math.min(
      selectedDate.getDate(),
      getDaysInMonth(nextMonth.getFullYear(), nextMonth.getMonth()),
    );

    setFocusedMonth(nextMonth);
    setSelectedDate(
      new Date(nextMonth.getFullYear(), nextMonth.getMonth(), safeDay, 12),
    );
    setActiveEventId(null);
  };

  const handleJumpYear = (targetYearValue) => {
    const parsedYear = Number(targetYearValue);

    if (!Number.isFinite(parsedYear)) {
      return;
    }

    const targetYear = Math.max(MIN_SCHEDULE_YEAR, parsedYear);
    const safeDay = Math.min(
      selectedDate.getDate(),
      getDaysInMonth(targetYear, focusedMonth.getMonth()),
    );

    setFocusedMonth(new Date(targetYear, focusedMonth.getMonth(), 1, 12));
    setSelectedDate(new Date(targetYear, focusedMonth.getMonth(), safeDay, 12));
    setActiveEventId(null);
  };

  const handleResetSchedule = () => {
    const currentScheduleDate = getCurrentScheduleDate(zuluNow);

    setFocusedMonth(
      new Date(
        currentScheduleDate.getFullYear(),
        currentScheduleDate.getMonth(),
        1,
        12,
      ),
    );
    setSelectedDate(currentScheduleDate);
    setViewMode("MONTH");
    setActiveEventId(null);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setFocusedMonth(new Date(date.getFullYear(), date.getMonth(), 1, 12));
  };

  const handleSelectEvent = (date, eventId) => {
    handleSelectDate(date);
    setActiveEventId(eventId);
  };

  const handleJumpToNearestSchedule = () => {
    if (!nearestScheduleIndicator) {
      return;
    }

    handleSelectEvent(createLocalDate(nearestScheduleIndicator.event.date), nearestScheduleIndicator.event.id);
  };

  const openCreateEditor = (date = selectedDate) => {
    handleSelectDate(date);
    setEditorState({
      open: true,
      mode: "create",
      event: null,
    });
  };

  const openEditEditor = (event) => {
    if (!event) {
      return;
    }

    const eventDate = createLocalDate(event.date);
    handleSelectEvent(eventDate, event.id);
    setEditorState({
      open: true,
      mode: "edit",
      event,
    });
  };

  const closeEditor = () => {
    setEditorState({
      open: false,
      mode: "create",
      event: null,
    });
  };

  const handleSaveEvent = (nextEvent) => {
    const normalizedEvent = normalizeScheduleEvent(nextEvent);

    setScheduleEvents((currentEvents) => {
      const updatedEvents =
        editorState.mode === "edit"
          ? currentEvents.map((event) =>
              event.id === normalizedEvent.id ? normalizedEvent : event,
            )
          : [...currentEvents, normalizedEvent];

      return sortScheduleEvents(updatedEvents);
    });

    const eventDate = createLocalDate(normalizedEvent.date);
    setFocusedMonth(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1, 12));
    setSelectedDate(eventDate);
    setActiveEventId(normalizedEvent.id);
    setEditorState({
      open: false,
      mode: "create",
      event: null,
    });
    setSyncStatus({
      message:
        editorState.mode === "edit"
          ? "Jadwal diperbarui dan langsung aktif."
          : "Jadwal baru ditambahkan secara realtime.",
      at: new Date(),
    });
  };

  const handleDeleteEvent = (eventId) => {
    const targetEvent = scheduleEvents.find((event) => event.id === eventId);

    if (!targetEvent) {
      return;
    }

    if (!window.confirm(`Hapus jadwal ${targetEvent.title} pada ${targetEvent.date}?`)) {
      return;
    }

    setScheduleEvents((currentEvents) =>
      sortScheduleEvents(currentEvents.filter((event) => event.id !== eventId)),
    );

    const eventDate = createLocalDate(targetEvent.date);
    setFocusedMonth(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1, 12));
    setSelectedDate(eventDate);
    setActiveEventId((currentEventId) =>
      currentEventId === eventId ? null : currentEventId,
    );
    setEditorState({
      open: false,
      mode: "create",
      event: null,
    });
    setSyncStatus({
      message: "Jadwal dihapus dan kalender tersinkron ulang.",
      at: new Date(),
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="border-b border-white/8 pb-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-[760px] space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#d8c15f] px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.25em] text-black">
                  Status: Strategic
                </span>
                <span className="font-public text-[10px] uppercase tracking-[0.28em] text-stone-500">
                  Recruiter
                </span>
              </div>

              <div>
                <h1 className="font-sans text-4xl font-bold tracking-tight text-stone-100 md:text-6xl">
                  Tactical Operations Schedule
                </h1>
                <p className="mt-2 font-public text-[11px] uppercase tracking-[0.34em] text-[#8da16b]">
                  Koordinasi Penjadwalan Rekrutmen
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 xl:justify-end">
              <button
                type="button"
                onClick={handleJumpToNearestSchedule}
                disabled={!nearestScheduleIndicator}
                className={`w-full sm:max-w-[240px] xl:w-[240px] px-3 py-3 text-left transition ${
                  nearestScheduleTheme.card
                } ${
                  nearestScheduleIndicator
                    ? "cursor-pointer hover:brightness-110"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-public text-[9px] uppercase tracking-[0.25em] text-stone-500">
                    Current Zulu
                  </p>
                  <span className={`px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.18em] ${nearestScheduleTheme.badge}`}>
                    {nearestScheduleIndicator?.label ?? "NO SLOT"}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <div
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${nearestScheduleTheme.icon}`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="10" cy="10" r="7" />
                      <path d="M10 6V10L13 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans text-base font-semibold leading-5 text-stone-100">
                      {nearestScheduleIndicator?.event.title ?? "No Nearby Slot"}
                    </p>
                    <p
                      className={`mt-1 font-public text-[9px] uppercase tracking-[0.14em] ${nearestScheduleTheme.accent}`}
                    >
                      {nearestScheduleIndicator?.event.subtitle ??
                        "Belum ada event terdekat"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 border-t border-white/6 pt-3">
                  {nearestScheduleIndicator ? (
                    <div className="space-y-1.5">
                      <p className="font-public text-[9px] uppercase tracking-[0.12em] text-stone-300">
                        {nearestScheduleDateLabel} • {nearestScheduleIndicator.event.time}
                      </p>
                      <p className="text-xs leading-5 text-stone-400">
                        {nearestScheduleIndicator.event.location}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-stone-400">
                      Belum ada jadwal yang bisa dijadikan indikator untuk tanggal ini.
                    </p>
                  )}
                </div>

                <div
                  className={`mt-3 flex items-center justify-between border-t border-white/6 pt-2 font-public text-[8px] uppercase tracking-[0.14em] ${nearestScheduleTheme.footer}`}
                >
                  <span>
                    {zuluDate} / {zuluTime} Z
                  </span>
                  <span>{nearestScheduleTimeLabel ?? "--:--"}</span>
                </div>
              </button>

              <div className="w-full sm:max-w-[220px] xl:w-[220px] border border-[#8da16b]/20 bg-[#141814] px-4 py-3">
                <p className="font-public text-[9px] uppercase tracking-[0.22em] text-[#8da16b]">
                  Realtime Sync
                </p>
                <p className="mt-2 font-public text-[11px] uppercase tracking-[0.08em] text-stone-200">
                  {resolvedSyncStatus.message}
                </p>
                <p className="mt-2 font-public text-[10px] uppercase tracking-[0.14em] text-stone-300">
                  {liveCalendarDate.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-1 font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                  Last update {syncTimeLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-white/6 bg-[#171717] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="font-sans text-3xl font-bold uppercase text-stone-100">
                  {monthHeading}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-[#a9c77a]">
                  <button
                    type="button"
                    onClick={() => handleShiftMonth(-1)}
                    className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-black/20 transition hover:bg-white/5"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12.5 5L7.5 10L12.5 15" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftMonth(1)}
                    className="grid h-8 w-8 place-items-center rounded-sm border border-white/8 bg-black/20 transition hover:bg-white/5"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M7.5 5L12.5 10L7.5 15" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetSchedule}
                    className="ml-2 border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftYear(-1)}
                    className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
                  >
                    -1Y
                  </button>
                  <select
                    value={focusedMonth.getFullYear()}
                    onChange={(event) => handleJumpYear(event.target.value)}
                    className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300 outline-none transition focus:border-[#8da16b]"
                  >
                    {scheduleYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleShiftYear(1)}
                    className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
                  >
                    +1Y
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCreateEditor(selectedDate)}
                  className="bg-[#b3cf83] px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.2em] text-black transition hover:brightness-105"
                >
                  Add Schedule
                </button>
                <button
                  type="button"
                  onClick={() => openEditEditor(activeEvent)}
                  disabled={!activeEvent}
                  className="border border-white/8 bg-black/20 px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Edit Active
                </button>
                <button
                  type="button"
                  onClick={() => activeEvent && handleDeleteEvent(activeEvent.id)}
                  disabled={!activeEvent}
                  className="border border-rose-500/20 bg-rose-500/10 px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete Active
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 self-start">
              {CALENDAR_VIEW_OPTIONS.map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setViewMode(view)}
                  className={`px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                    view === viewMode
                      ? "bg-[#b3cf83] text-black"
                      : "border border-white/6 bg-black/20 text-stone-400 hover:bg-white/5"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[980px]">
              {viewMode === "MONTH" && (
                <>
                  <div className="grid grid-cols-7 border-b border-white/5">
                    {SCHEDULE_DAY_LABELS.map((label, index) => (
                      <div
                        key={label}
                        className={`px-3 py-3 font-public text-[10px] font-bold uppercase tracking-[0.22em] ${
                          index >= 5 ? "text-[#d8c15f]/85" : "text-stone-500"
                        }`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 border-l border-t border-white/5">
                    {monthGrid.map((day) => {
                      const dayEvents = eventsByDate[formatDateKey(day.date)] ?? [];
                      const isActiveDay = isSameDay(day.date, selectedDate);
                      const isToday = formatDateKey(day.date) === todayDateKey;

                      return (
                        <div
                          key={formatDateKey(day.date)}
                          onClick={() => handleSelectDate(day.date)}
                          className={`relative min-h-[150px] cursor-pointer border-b border-r border-white/[0.04] p-3 transition ${
                            isActiveDay
                              ? "bg-[#22211b] shadow-[inset_0_0_0_1px_rgba(216,193,95,0.22)]"
                              : isToday
                                ? "bg-[#1b2118] shadow-[inset_0_0_0_1px_rgba(141,161,107,0.28)] hover:bg-[#1f261c]"
                                : "bg-[#1a1a1a] hover:bg-[#1d1d1d]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`font-public text-[11px] font-bold ${
                                day.outside
                                  ? "text-stone-600"
                                  : day.weekend
                                    ? "text-[#d8c15f]"
                                    : "text-stone-300"
                              }`}
                            >
                              {`${day.date.getDate()}`.padStart(2, "0")}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(clickEvent) => {
                                  clickEvent.stopPropagation();
                                  openCreateEditor(day.date);
                                }}
                                className="border border-white/8 bg-black/20 px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.18em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
                              >
                                Add
                              </button>
                              {isToday ? (
                                <span className="bg-[#8da16b] px-2 py-0.5 font-public text-[8px] font-bold uppercase tracking-[0.18em] text-black">
                                  Today
                                </span>
                              ) : isActiveDay ? (
                                <span className="bg-[#d8c15f] px-2 py-0.5 font-public text-[8px] font-bold uppercase tracking-[0.18em] text-black">
                                  Active
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            {dayEvents.slice(0, 2).map((event) => (
                              <CalendarEventCard
                                key={event.id}
                                event={event}
                                compact
                                active={event.id === resolvedActiveEventId}
                                onClick={() => handleSelectEvent(day.date, event.id)}
                              />
                            ))}
                            {dayEvents.length > 2 ? (
                              <p className="font-public text-[8px] uppercase tracking-[0.12em] text-stone-500">
                                +{dayEvents.length - 2} more
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {viewMode === "WEEK" && (
                <>
                  <div className="grid grid-cols-7 border-b border-white/5">
                    {weekDays.map((date, index) => {
                      const isToday = formatDateKey(date) === todayDateKey;

                      return (
                        <button
                          key={formatDateKey(date)}
                          type="button"
                          onClick={() => handleSelectDate(date)}
                          className={`border-r border-white/5 px-3 py-3 text-left transition last:border-r-0 ${
                            isSameDay(date, selectedDate)
                              ? "bg-[#22211b]"
                              : isToday
                                ? "bg-[#1b2118]"
                                : "bg-transparent hover:bg-white/[0.03]"
                          }`}
                        >
                          <p
                            className={`font-public text-[10px] font-bold uppercase tracking-[0.22em] ${
                              index >= 5 ? "text-[#d8c15f]/85" : "text-stone-500"
                            }`}
                          >
                            {SCHEDULE_DAY_LABELS[index]}
                          </p>
                          <p className="mt-2 font-sans text-lg font-bold text-stone-100">
                            {`${date.getDate()}`.padStart(2, "0")}
                          </p>
                          {isToday ? (
                            <p className="mt-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] text-[#8da16b]">
                              Today
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-7 border-l border-t border-white/5">
                    {weekEvents.map((entry) => (
                      <div
                        key={formatDateKey(entry.date)}
                        onClick={() => handleSelectDate(entry.date)}
                        className={`min-h-[260px] border-b border-r border-white/[0.04] p-3 ${
                          isSameDay(entry.date, selectedDate)
                            ? "bg-[#22211b]"
                            : "bg-[#1a1a1a]"
                        }`}
                      >
                        <div className="mb-3 flex justify-end">
                          <button
                            type="button"
                            onClick={(clickEvent) => {
                              clickEvent.stopPropagation();
                              openCreateEditor(entry.date);
                            }}
                            className="border border-white/8 bg-black/20 px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
                          >
                            Add
                          </button>
                        </div>

                        <div className="space-y-2">
                          {entry.events.length > 0 ? (
                            entry.events.map((event) => (
                              <CalendarEventCard
                                key={event.id}
                                event={event}
                                active={event.id === resolvedActiveEventId}
                                onClick={() => handleSelectEvent(entry.date, event.id)}
                              />
                            ))
                          ) : (
                            <div className="rounded-[2px] border border-dashed border-white/6 px-3 py-6 text-center">
                              <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-600">
                                No Tactical Slot
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {viewMode === "DAY" && (
                <div className="border border-white/5 bg-[#1a1a1a] p-5">
                  <div className="flex flex-col gap-4 border-b border-white/5 pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-public text-[10px] uppercase tracking-[0.25em] text-[#8da16b]">
                        Day View
                      </p>
                      <h3 className="mt-2 font-sans text-3xl font-bold text-stone-100">
                        {selectedDateLabel}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openCreateEditor(selectedDate)}
                        className="bg-[#b3cf83] px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-105"
                      >
                        Add To Day
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("MONTH")}
                        className="border border-white/6 bg-black/20 px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
                      >
                        Back To Month
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {selectedDateEvents.length > 0 ? (
                      selectedDateEvents.map((event) => (
                        <ScheduleFeedItem
                          key={event.id}
                          event={event}
                          active={event.id === resolvedActiveEventId}
                          dateLabel={selectedDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          })}
                          onSelect={() => handleSelectEvent(selectedDate, event.id)}
                          onEdit={() => openEditEditor(event)}
                        />
                      ))
                    ) : (
                      <div className="rounded-[2px] border border-dashed border-white/6 bg-black/20 px-4 py-10 text-center">
                        <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-500">
                          No schedule assigned for this tactical window.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="border border-white/6 bg-[#141414] p-4">
              <p className="font-public text-[10px] uppercase tracking-[0.25em] text-[#8da16b]">
                Selected Window
              </p>
              <h3 className="mt-3 font-sans text-2xl font-bold text-stone-100">
                {selectedDate.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                })}
              </h3>
              <p className="mt-2 font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
                {viewMode} mode active
              </p>

              <div className="mt-5 space-y-4 border-t border-white/5 pt-4">
                <div>
                  <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                    Scheduled Units
                  </p>
                  <p className="mt-1 font-sans text-3xl font-bold text-stone-100">
                    {viewMode === "WEEK"
                      ? activeFeedEntries.length
                      : selectedDateEvents.length}
                  </p>
                </div>
                <div>
                  <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                    Recruit Window
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-400">
                    {viewMode === "WEEK"
                      ? "Weekly tactical board across seven operational days."
                      : "Focused briefing and deployment notes for selected date."}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[2px] border border-white/6 bg-black/20 p-4">
                {activeEvent ? (
                  <>
                    <p className="font-public text-[9px] uppercase tracking-[0.18em] text-[#8da16b]">
                      Active Slot
                    </p>
                    <h4 className="mt-2 font-sans text-xl font-bold text-stone-100">
                      {activeEvent.title}
                    </h4>
                    <p className="mt-1 font-public text-[10px] uppercase tracking-[0.14em] text-stone-400">
                      {activeEvent.subtitle}
                    </p>

                    <div className="mt-4 space-y-3 text-sm text-stone-300">
                      <div>
                        <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                          Time
                        </p>
                        <p className="mt-1">{activeEvent.time}</p>
                      </div>
                      <div>
                        <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                          Location
                        </p>
                        <p className="mt-1">{activeEvent.location}</p>
                      </div>
                      <div>
                        <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                          Coordinator
                        </p>
                        <p className="mt-1">{activeEvent.coordinator}</p>
                      </div>
                      <div>
                        <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                          Capacity
                        </p>
                        <p className="mt-1">{activeEvent.capacity} applicants</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => openEditEditor(activeEvent)}
                        className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                      >
                        Edit Active Slot
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(activeEvent.id)}
                        className="border border-rose-500/20 bg-rose-500/10 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/15"
                      >
                        Delete Active Slot
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                      Active Slot
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-400">
                      Belum ada jadwal aktif pada scope ini. Tambahkan slot baru untuk
                      membuat kalender langsung terisi.
                    </p>
                    <button
                      type="button"
                      onClick={() => openCreateEditor(activeEventDate)}
                      className="mt-4 bg-[#b3cf83] px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-105"
                    >
                      Create First Slot
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="border border-white/6 bg-[#141414] p-4">
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <p className="font-public text-[10px] uppercase tracking-[0.25em] text-[#8da16b]">
                    Operational Feed
                  </p>
                  <h3 className="mt-2 font-sans text-2xl font-bold text-stone-100">
                    {viewMode === "WEEK" ? "Weekly Schedule" : "Daily Schedule"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setViewMode((currentView) =>
                      currentView === "MONTH" ? "DAY" : "MONTH",
                    )
                  }
                  className="border border-white/6 bg-black/20 px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 transition hover:bg-white/5 hover:text-stone-100"
                >
                  {viewMode === "MONTH" ? "Day Focus" : "Month Board"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {activeFeedEntries.length > 0 ? (
                  activeFeedEntries.map(({ date, event }) => (
                    <ScheduleFeedItem
                      key={`${formatDateKey(date)}-${event.id}`}
                      event={event}
                      active={event.id === resolvedActiveEventId}
                      dateLabel={date.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                      onSelect={() => handleSelectEvent(date, event.id)}
                      onEdit={() => openEditEditor(event)}
                    />
                  ))
                ) : (
                  <div className="rounded-[2px] border border-dashed border-white/6 bg-black/20 px-4 py-10 text-center">
                    <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-500">
                      No tactical entries for the selected scope.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {scheduleMetrics.map((item) => (
            <ScheduleMetricCard key={item.label} item={item} />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/6 pt-5 font-public text-[10px] uppercase tracking-[0.28em] text-stone-500">
          <span>System: Paskus 791 / V1</span>
          <span>Silere Impetum</span>
          <span className="text-[#8da16b]">No Man Left Behind</span>
          <span>Protokol Jadwal 2026</span>
        </div>
      </div>

      <AnimatePresence>
        {editorState.open ? (
          <ScheduleEditorModal
            key={`${editorState.mode}-${editorState.event?.id ?? formatDateKey(selectedDate)}`}
            mode={editorState.mode}
            event={editorState.event}
            selectedDate={selectedDate}
            onClose={closeEditor}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function LaporanPage() {
  const {
    data: reports,
    setData: setReports,
    loading: reportsLoading,
    error: reportsError,
  } = useSyncedResource(RESOURCE_KEYS.dashboardReports, {
    defaultValue: [],
    saveDelay: 450,
    normalize: loadStoredArchiveReports,
  });
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

  const latestUpdatedAt = useMemo(() => {
    return reports.reduce((latestTimestamp, report) => {
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
  }, [reports]);
  const latestUpdatedDate = latestUpdatedAt ? new Date(latestUpdatedAt) : systemTime;
  const pendingDispatchCount = reports.filter((report) =>
    isArchivePendingDispatch(report),
  ).length;
  const lastReportLabel = formatRelativeMinutes(latestUpdatedDate, systemTime);
  const resolvedArchiveNotice = reportsLoading
    ? "Memuat arsip laporan dari database..."
    : reportsError || archiveNotice;

  const handleDispatchReports = () => {
    const dispatchTimestamp = new Date().toISOString();

    if (pendingDispatchCount === 0) {
      setArchiveNotice("Semua laporan arsip sudah terkirim ke resimen.");
      return;
    }

    setReports((currentReports) =>
      currentReports.map((report) =>
        isArchivePendingDispatch(report)
          ? normalizeArchiveReport({
              ...report,
              sentAt: dispatchTimestamp,
            })
          : report,
      ),
    );
    setArchiveNotice(
      `${pendingDispatchCount} laporan berhasil dikirim ke resimen pada ${formatArchiveTimestamp(
        new Date(dispatchTimestamp),
      )}.`,
    );
  };

  const handleSaveReport = (updatedReport) => {
    const normalizedReport = normalizeArchiveReport(updatedReport);

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === normalizedReport.id ? normalizedReport : report,
      ),
    );
    setEditorReport(null);
    setArchiveNotice(
      `Laporan ${normalizedReport.name} diperbarui pada ${formatArchiveTimestamp(
        new Date(normalizedReport.updatedAt),
      )}.`,
    );
  };

  const handleSaveSupplement = (reportId, supplement) => {
    const normalizedSupplement = normalizeArchiveSupplement(supplement);
    const isEditMode = supplementEditorState?.mode === "edit";
    let targetName = "kandidat";

    setReports((currentReports) =>
      currentReports.map((report) => {
        if (report.id !== reportId) {
          return report;
        }

        targetName = report.name;

        return normalizeArchiveReport({
          ...report,
          additionalReports: isEditMode
            ? report.additionalReports.map((entry) =>
                entry.id === normalizedSupplement.id ? normalizedSupplement : entry,
              )
            : [normalizedSupplement, ...report.additionalReports],
          updatedAt: normalizedSupplement.updatedAt,
        });
      }),
    );

    setSupplementEditorState(null);
    setArchiveNotice(
      `Laporan tambahan untuk ${targetName} ${isEditMode ? "diperbarui" : "ditambahkan"} pada ${formatArchiveTimestamp(
        new Date(normalizedSupplement.updatedAt),
      )}.`,
    );
  };

  const handleDeleteSupplement = (reportId, supplementId) => {
    const targetReport = reports.find((report) => report.id === reportId);
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

    setReports((currentReports) =>
      currentReports.map((report) => {
        if (report.id !== reportId) {
          return report;
        }

        return normalizeArchiveReport({
          ...report,
          additionalReports: report.additionalReports.filter(
            (entry) => entry.id !== supplementId,
          ),
          updatedAt: deletedAt,
        });
      }),
    );

    setSupplementEditorState(null);
    setArchiveNotice(
      `Laporan tambahan ${targetReport.name} dihapus pada ${formatArchiveTimestamp(
        new Date(deletedAt),
      )}.`,
    );
  };

  const handleEliminateCandidate = (reportId) => {
    const targetReport = reports.find((report) => report.id === reportId);

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

    setReports((currentReports) =>
      currentReports.filter((report) => report.id !== reportId),
    );
    setEditorReport((currentReport) =>
      currentReport?.id === reportId ? null : currentReport,
    );
    setSupplementEditorState((currentState) =>
      currentState?.report.id === reportId ? null : currentState,
    );
    setArchiveNotice(
      `Kandidat ${targetReport.name} dieliminasi dan seluruh arsipnya dihapus.`,
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden border border-white/6 bg-[#141414] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-8">
          <div className="absolute left-0 top-8 h-12 w-1 bg-amber-300" />

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
                Recruitment Archive
              </p>
              <h1 className="font-sans text-4xl font-bold uppercase leading-none text-stone-200 md:text-5xl">
                Hasil Laporan
              </h1>
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

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <button
              type="button"
              onClick={handleDispatchReports}
              className="inline-flex items-center gap-3 bg-stone-900 px-4 py-2 font-public text-[10px] uppercase tracking-[0.12em] text-stone-200 transition hover:bg-stone-800"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
                <path d="M14.5 1L1 7l4.8 1.9L7.7 14 14.5 1zm-8 6.2l5.2-3-3.7 4.6-.7-1.6-.8 0z" />
              </svg>
              kirim laporan ke resimen
            </button>

            <div className="border border-white/6 bg-stone-950 px-4 py-2">
              <p className="font-public text-[10px] uppercase tracking-[0.12em] text-stone-300">
                {resolvedArchiveNotice}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {reports.map((report) => (
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
          ))}
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
                  Status Perekrut
                </p>
                <p className="font-public text-[10px] font-bold uppercase tracking-[0.08em] text-stone-200">
                  Online
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
            <span>Documentation</span>
            <span>Protocol Support</span>
            <span>Tactical Command © 2026</span>
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

const TINDAKAN_PRIORITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

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

export function TindakanPage() {
  const [systemTime, setSystemTime] = useState(new Date());
  const { data: reports } = useSyncedResource(RESOURCE_KEYS.dashboardReports, {
    defaultValue: [],
    saveDelay: 450,
    normalize: loadStoredArchiveReports,
  });
  const { data: scheduleEvents } = useSyncedResource(
    RESOURCE_KEYS.dashboardSchedules,
    {
      defaultValue: [],
      saveDelay: 450,
      normalize: loadStoredScheduleEvents,
    },
  );
  const { data: candidates } = useSyncedResource(RESOURCE_KEYS.dashboardCandidates, {
    defaultValue: [],
    saveDelay: 500,
    normalize: (value) => (Array.isArray(value) ? value : []),
  });

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

    return candidates.filter((player) => {
      const robloxIdentity = normalizeReminderIdentity(player.roblox);
      const discordIdentity = normalizeReminderIdentity(player.discord);

      return (
        !archiveIdentities.has(robloxIdentity) &&
        !archiveIdentities.has(discordIdentity)
      );
    }).map((player) => {
      const severity =
        player.status === "Approved"
          ? "critical"
          : player.status === "Review"
            ? "high"
            : "medium";

      const description =
        player.status === "Approved"
          ? "Kandidat sudah lolos screening, tetapi arsip laporan resmi belum dibuat."
          : player.status === "Review"
            ? "Kandidat masih menunggu laporan analis untuk keputusan akhir recruiter."
            : "Status kandidat sudah ditutup, namun dokumentasi laporannya belum masuk arsip.";

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

const SOP_LIBRARY = [
  {
    id: "sop-perekrut",
    layout: "framework",
    accent: "lime",
    cardEyebrow: "Lorem Ipsum Alpha",
    cardSummary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    badge: "LOREM",
    documentTag: "LOREM-IPSUM-2024",
    serial: "DOLOR SIT AMET",
    title: "LOREM IPSUM ALPHA",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    referenceLabel: "LOREM ACTIVE",
    referenceValue: "REF. IPSUM V.204",
    overviewTitle: "Lorem Ipsum Overview",
    overviewDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    directives: [
      {
        label: "DIRECTIVE ALPHA",
        text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit."',
      },
      {
        label: "DIRECTIVE BETA",
        text: '"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
      },
    ],
    fieldSpecs: [
      { label: "Lorem Field One", value: "Lorem Ipsum 48H" },
      { label: "Lorem Field Two", value: "Dolor Sit Amet" },
      { label: "Lorem Field Three", value: "Consectetur Adipiscing" },
      { label: "Lorem Field Four", value: "Elit Sed Do" },
    ],
    phases: [
      {
        index: "01",
        title: "Phase 1: Lorem Ipsum",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        bullets: ["Lorem hash match", "Dolor sit history"],
      },
      {
        index: "02",
        title: "Phase 2: Dolor Sit",
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        bullets: ["Lorem response log", "Ipsum decision notes"],
      },
      {
        index: "03",
        title: "Phase 3: Amet Elit",
        description:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        bullets: ["Lorem compilation", "Ipsum normalization"],
      },
    ],
    emergency: {
      title: "Lorem Emergency Protocol",
      description:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      code: "LOREM-229-ALPHA",
    },
    footer: [
      "Lorem Revision Oct 2024 • 14:22 UTC",
      "Approved by Lorem Admin",
    ],
  },
  {
    id: "sop-vanguard",
    layout: "sectioned",
    accent: "amber",
    cardEyebrow: "Lorem Ipsum Beta",
    cardSummary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    badge: "IPSUM",
    documentTag: "DOCUMENT ID: LOREM-2024",
    serial: "LAST UPDATED: DOLOR SIT",
    title: "LOREM IPSUM BETA",
    description: "LOREM IPSUM DOLOR SIT AMET",
    pills: ["LOREM IPSUM ONLY", "DOLOR SIT 04-4"],
    sections: [
      {
        index: "01.",
        title: "LOREM IDENTITAS",
        intro:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        bullets: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        ],
      },
      {
        index: "02.",
        title: "METODE LOREM",
        intro: "",
        cards: [
          {
            title: "LOREM ONE",
            text:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
          {
            title: "LOREM TWO",
            text:
              "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          },
          {
            title: "LOREM THREE",
            text:
              "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          },
        ],
      },
      {
        index: "03.",
        title: "ETIKA LOREM",
        intro: "",
        protocols: [
          {
            tag: "LOREM 4.1",
            text:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          },
          {
            tag: "LOREM 4.2",
            text:
              "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
          {
            tag: "LOREM 4.3",
            text:
              "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
          },
        ],
      },
      {
        index: "04.",
        title: "KRITERIA LOREM",
        intro: "",
        mandatoryTitle: "LOREM REQUIREMENTS",
        mandatoryItems: [
          "Lorem ipsum dolor",
          "Sit amet elit",
          "Consectetur success",
        ],
        failureTitle: "LOREM FAILURES",
        failureItems: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        ],
      },
    ],
  },
  {
    id: "sop-dispatch",
    layout: "framework",
    accent: "rose",
    cardEyebrow: "Lorem Ipsum Gamma",
    cardSummary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    badge: "DOLOR",
    documentTag: "CHANNEL OPS: LOREM-229",
    serial: "SYNC REVISION: IPSUM.04",
    title: "LOREM IPSUM GAMMA",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    referenceLabel: "LOREM CHANNEL",
    referenceValue: "IPSUM SYNC V3",
    overviewTitle: "Lorem Escalation",
    overviewDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    directives: [
      {
        label: "LOREM RULE",
        text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit."',
      },
      {
        label: "IPSUM RULE",
        text: '"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
      },
    ],
    fieldSpecs: [
      { label: "Lorem Window", value: "Every 6 Lorem" },
      { label: "Ipsum Owner", value: "Senior Lorem" },
      { label: "Dolor Bundle", value: "Report + Lorem + ID" },
      { label: "Fallback Route", value: "Lorem-Link / Ipsum" },
    ],
    phases: [
      {
        index: "01",
        title: "Phase 1: Lorem Check",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        bullets: ["Primary lorem exists", "Ipsum log attached"],
      },
      {
        index: "02",
        title: "Phase 2: Ipsum Routing",
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        bullets: ["Lorem board sync", "Ipsum assignment"],
      },
      {
        index: "03",
        title: "Phase 3: Dolor Transfer",
        description:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        bullets: ["Lorem transfer", "Ipsum acknowledgement"],
      },
    ],
    emergency: {
      title: "Lorem Failure Protocol",
      description:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      code: "LOREM-404-LOCK",
    },
    footer: ["Lorem Queue Revision 2026", "Failure path monitored by Ipsum"],
  },
];

function getSopAccentClasses(accent) {
  if (accent === "rose") {
    return {
      text: "text-rose-300",
      border: "border-rose-400/30",
      bg: "bg-rose-500/10",
      bar: "bg-rose-400",
      chip: "border-rose-400/25 bg-rose-500/10 text-rose-200",
    };
  }

  if (accent === "amber") {
    return {
      text: "text-amber-300",
      border: "border-amber-300/30",
      bg: "bg-amber-400/10",
      bar: "bg-amber-300",
      chip: "border-amber-300/25 bg-amber-400/10 text-amber-100",
    };
  }

  return {
    text: "text-[#b8ce82]",
    border: "border-[#a5c76d]/30",
    bg: "bg-[#a5c76d]/10",
    bar: "bg-[#a5c76d]",
    chip: "border-[#a5c76d]/25 bg-[#a5c76d]/10 text-[#dce8bb]",
  };
}

function SopLibraryCard({ document, isActive, onOpen }) {
  const accent = getSopAccentClasses(document.accent);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative overflow-hidden border p-5 text-left transition ${
        isActive
          ? `${accent.border} bg-[#20201d] shadow-[0_18px_60px_rgba(0,0,0,0.28)]`
          : "border-white/6 bg-[#141414] hover:border-white/10 hover:bg-[#181818]"
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${accent.bar}`} />
      <div className="pl-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`font-public text-[9px] uppercase tracking-[0.28em] ${accent.text}`}>
              {document.cardEyebrow}
            </p>
            <h3 className="mt-3 font-sans text-2xl font-bold uppercase text-stone-100">
              {document.title}
            </h3>
          </div>

          <span className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] ${accent.chip}`}>
            {document.badge}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-400">{document.cardSummary}</p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/6 pt-4">
          <div>
            <p className="font-public text-[8px] uppercase tracking-[0.16em] text-stone-500">
              {document.documentTag}
            </p>
            <p className="mt-2 font-public text-[9px] uppercase tracking-[0.14em] text-stone-400">
              {document.serial}
            </p>
          </div>

          <span className={`font-public text-[9px] font-bold uppercase tracking-[0.2em] transition ${isActive ? accent.text : "text-stone-500 group-hover:text-stone-300"}`}>
            {isActive ? "Opened" : "Open SOP"}
          </span>
        </div>
      </div>
    </button>
  );
}

function SopFrameworkDetail({ document }) {
  const accent = getSopAccentClasses(document.accent);

  return (
    <div className="space-y-6">
      <section className="border border-white/6 bg-[#171717] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.18em] ${accent.chip}`}>
                {document.documentTag}
              </span>
              <span className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                {document.serial}
              </span>
            </div>

            <h2 className="mt-4 font-sans text-4xl font-bold uppercase leading-none text-stone-100 md:text-5xl">
              {document.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-400">
              {document.description}
            </p>
          </div>

          <div className="min-w-[180px] border border-white/6 bg-black/20 px-4 py-4 text-left lg:text-right">
            <p className={`font-public text-[10px] font-bold uppercase tracking-[0.22em] ${accent.text}`}>
              {document.referenceLabel}
            </p>
            <p className="mt-2 font-public text-[10px] uppercase tracking-[0.16em] text-stone-400">
              {document.referenceValue}
            </p>
          </div>
        </div>

        <div className={`mt-6 h-px ${accent.bg}`} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="border border-white/6 bg-[#1a1a1a] p-6">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center ${accent.bg}`}>
              <svg viewBox="0 0 20 20" className={`h-5 w-5 ${accent.text}`} fill="currentColor">
                <path d="M10 2l7 3.5V10c0 4.1-2.7 6.9-7 8-4.3-1.1-7-3.9-7-8V5.5L10 2zm0 2.2L5 6.6V10c0 2.9 1.7 5 5 6.1 3.3-1.1 5-3.2 5-6.1V6.6l-5-2.4z" />
              </svg>
            </span>
            <h3 className="font-sans text-3xl font-bold text-stone-100">
              {document.overviewTitle}
            </h3>
          </div>

          <p className="mt-5 text-sm leading-7 text-stone-400">
            {document.overviewDescription}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {document.directives.map((directive) => (
              <div key={directive.label} className="border border-white/6 bg-black/25 p-4">
                <p className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}>
                  {directive.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">{directive.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/6 bg-[#161616] p-6">
          <p className={`font-public text-[10px] font-bold uppercase tracking-[0.28em] ${accent.text}`}>
            Field Specifications
          </p>
          <div className="mt-6 space-y-5">
            {document.fieldSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col gap-2 border-b border-white/6 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
              >
                <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  {spec.label}
                </p>
                <p className="font-public text-[12px] font-semibold uppercase tracking-[0.06em] text-stone-200">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {document.phases.map((phase, index) => (
          <section
            key={phase.index}
            className={`border bg-[#1b1b1b] p-6 ${
              index === 0
                ? "border-[#a5c76d]/30"
                : index === 1
                  ? "border-amber-300/25"
                  : "border-white/6"
            }`}
          >
            <p className="font-sans text-4xl font-bold text-stone-600">{phase.index}</p>
            <h3 className="mt-5 font-sans text-2xl font-bold uppercase text-stone-100">
              {phase.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-400">{phase.description}</p>

            <div className="mt-6 space-y-3">
              {phase.bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${accent.bar}`} />
                  <p className="font-public text-[10px] font-bold uppercase tracking-[0.14em] text-stone-300">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="grid gap-4 border border-white/6 bg-[#181818] p-5 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex items-start gap-4">
          <div className={`grid h-16 w-16 place-items-center ${accent.accent ?? accent.bg}`}>
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
              <path d="M12 3l10 18H2L12 3zm0 4.2L5.4 19h13.2L12 7.2zm-1 4.3h2v4h-2v-4zm0 5.5h2v2h-2v-2z" />
            </svg>
          </div>
          <div>
            <p className={`font-public text-[10px] font-bold uppercase tracking-[0.22em] ${accent.text}`}>
              {document.emergency.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              {document.emergency.description}
            </p>
          </div>
        </div>

        <div className="border border-white/6 bg-black/30 px-5 py-4">
          <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
            Protocol Identifier
          </p>
          <p className={`mt-4 font-sans text-3xl font-bold uppercase ${accent.text}`}>
            {document.emergency.code}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-white/6 pt-5 font-public text-[10px] uppercase tracking-[0.2em] text-stone-500 md:flex-row md:items-center md:justify-between">
        {document.footer.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function SopSectionedDetail({ document }) {
  const accent = getSopAccentClasses(document.accent);

  return (
    <div className="space-y-6">
      <section className="border border-white/6 bg-[#171717] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className={`font-public text-[9px] font-bold uppercase tracking-[0.22em] ${accent.text}`}>
              {document.documentTag}
            </p>
            <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
              {document.serial}
            </p>
          </div>

          <h2 className={`font-sans text-4xl font-bold uppercase leading-none md:text-5xl ${accent.text}`}>
            {document.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {document.pills.map((pill) => (
              <span
                key={pill}
                className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] ${accent.chip}`}
              >
                {pill}
              </span>
            ))}
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
              {document.description}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        {document.sections.map((section) => (
          <section key={section.index} className="border border-white/6 bg-[#1c1c1c] p-6">
            <div className="flex items-center gap-4">
              <span className={`grid h-10 w-10 place-items-center ${accent.bg}`}>
                <svg viewBox="0 0 20 20" className={`h-4 w-4 ${accent.text}`} fill="currentColor">
                  <path d="M10 2l6 3.4v5.2c0 3.7-2.4 6.2-6 7.4-3.6-1.2-6-3.7-6-7.4V5.4L10 2zm0 2.3L6 6.6v4c0 2.5 1.4 4.4 4 5.4 2.6-1 4-2.9 4-5.4v-4l-4-2.3z" />
                </svg>
              </span>
              <div>
                <p className={`font-sans text-2xl font-bold uppercase ${accent.text}`}>
                  {section.index} {section.title}
                </p>
                {section.intro ? (
                  <p className="mt-3 text-sm leading-7 text-stone-400">{section.intro}</p>
                ) : null}
              </div>
            </div>

            {section.bullets ? (
              <div className="mt-6 space-y-4">
                {section.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <span className={`mt-2 h-1.5 w-1.5 rounded-full ${accent.bar}`} />
                    <p className="text-sm leading-7 text-stone-300">{bullet}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {section.cards ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {section.cards.map((card) => (
                  <div key={card.title} className="border border-white/6 bg-black/30 p-4">
                    <p className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}>
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-400">{card.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {section.protocols ? (
              <div className="mt-6 space-y-3">
                {section.protocols.map((protocol) => (
                  <div
                    key={protocol.tag}
                    className="flex flex-col gap-3 border border-white/6 bg-black/20 px-4 py-3 md:flex-row md:items-center"
                  >
                    <span className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.14em] ${accent.chip}`}>
                      {protocol.tag}
                    </span>
                    <p className="text-sm leading-6 text-stone-300">{protocol.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {section.mandatoryItems ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="border border-white/6 bg-black/20 p-4">
                  <p className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}>
                    {section.mandatoryTitle}
                  </p>
                  <div className="mt-4 space-y-3">
                    {section.mandatoryItems.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#a5c76d]" />
                        <p className="font-public text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-300">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/6 bg-black/20 p-4">
                  <p className="font-public text-[9px] font-bold uppercase tracking-[0.18em] text-rose-300">
                    {section.failureTitle}
                  </p>
                  <div className="mt-4 space-y-3">
                    {section.failureItems.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-rose-400" />
                        <p className="text-sm leading-6 text-stone-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}

function SopDocumentDetail({ document }) {
  if (document.layout === "sectioned") {
    return <SopSectionedDetail document={document} />;
  }

  return <SopFrameworkDetail document={document} />;
}

export function SopPage() {
  const [activeDocumentId, setActiveDocumentId] = useState(SOP_LIBRARY[0].id);

  const activeDocument = useMemo(
    () =>
      SOP_LIBRARY.find((document) => document.id === activeDocumentId) ??
      SOP_LIBRARY[0],
    [activeDocumentId],
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="relative overflow-hidden border border-white/6 bg-[#141414] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-8">
        <div className="absolute left-0 top-8 h-12 w-1 bg-amber-300" />

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
              Standard Operating Procedure
            </p>
            <h1 className="font-sans text-4xl font-bold uppercase leading-none text-stone-200 md:text-5xl">
              SOP Library
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          </div>

          <div className="border border-white/6 bg-black/20 px-4 py-4 text-left xl:text-right">
            <p className="font-public text-[10px] uppercase tracking-[0.2em] text-stone-500">
              Active Document
            </p>
            <p className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
              {activeDocument.title}
            </p>
            <p className="mt-2 font-public text-[9px] uppercase tracking-[0.16em] text-stone-400">
              {activeDocument.serial}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {SOP_LIBRARY.map((document) => (
          <SopLibraryCard
            key={document.id}
            document={document}
            isActive={document.id === activeDocument.id}
            onOpen={() => setActiveDocumentId(document.id)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeDocument.id}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-4">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-500">
                Opened SOP
              </p>
              <p className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
                {activeDocument.title}
              </p>
            </div>

            <span className={`border px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] ${getSopAccentClasses(activeDocument.accent).chip}`}>
              {activeDocument.badge}
            </span>
          </div>

          <SopDocumentDetail document={activeDocument} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
