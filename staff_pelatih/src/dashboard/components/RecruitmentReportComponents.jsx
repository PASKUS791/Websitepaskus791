/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Recruitment Report Components
 * Purpose: Komponen kartu laporan, modal editor, dan modal laporan tambahan.
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  buildRecruitmentReportNotesTemplate,
  buildRecruitmentReportQuestionTemplate,
  getRecruitmentReportValidationMessage,
  MIN_RECRUITMENT_REPORT_TEXT_LENGTH,
  RECRUITMENT_REPORT_STATUS_OPTIONS,
} from "../data/recruitmentData";

// Section: style helpers.
function getArchiveGroupClasses(group) {
  if (group === "Golongan 2") {
    return "border-amber-300 text-amber-300";
  }

  return "border-stone-400 text-stone-400";
}

function getArchiveStatusClasses(status) {
  if (status === "GAGAL") {
    return "bg-rose-500/15 text-rose-200 outline-rose-400/40";
  }

  if (status === "LULUS") {
    return "bg-emerald-500/15 text-emerald-200 outline-emerald-400/40";
  }

  return "bg-stone-400/20 text-stone-300 outline-stone-400/30";
}

function withModalEscape(onClose) {
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
}

function getReportTextLength(value) {
  return String(value || "").trim().length;
}

// Section: report editor modal.
export function ArchiveReportEditorModal({
  report,
  onClose,
  onSave,
  onEliminate,
  submitting = false,
}) {
  const [formState, setFormState] = useState(() => ({
    name: report.name,
    discord: report.discord,
    group: report.group,
    status: report.status,
    age: report.age,
    gender: report.gender,
    question: report.question || buildRecruitmentReportQuestionTemplate(report),
    notes: report.notes || buildRecruitmentReportNotesTemplate(),
  }));
  const [submitError, setSubmitError] = useState("");
  const questionLength = getReportTextLength(formState.question);
  const notesLength = getReportTextLength(formState.notes);

  useEffect(() => withModalEscape(onClose), [onClose]);

  const handleChange = (field) => (event) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: event.target.value,
    }));
    setSubmitError("");
  };

  const handleApplySopTemplate = () => {
    setFormState((currentState) => ({
      ...currentState,
      question: buildRecruitmentReportQuestionTemplate({
        ...report,
        name: currentState.name,
        group: currentState.group,
      }),
      notes: buildRecruitmentReportNotesTemplate(),
    }));
    setSubmitError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationMessage = getRecruitmentReportValidationMessage({
      ...report,
      ...formState,
    });

    if (validationMessage) {
      setSubmitError(validationMessage);
      return;
    }

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
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 p-3 md:p-5 backdrop-blur-[4px]"
    >
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-1.75rem)] w-full max-w-[860px] flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[#181818] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-3">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.24em] text-amber-300">
              Laporan Perekrutan
            </p>
            <h3 className="mt-1.5 font-sans text-xl font-bold uppercase text-stone-100 md:text-2xl">
              Edit Laporan
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Tutup
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Nama Kandidat
              </span>
              <input
                value={formState.name}
                onChange={handleChange("name")}
                className="border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Discord
              </span>
              <input
                value={formState.discord}
                onChange={handleChange("discord")}
                className="border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Golongan
              </span>
              <select
                value={formState.group}
                onChange={handleChange("group")}
                className="border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] text-stone-100 outline-none transition focus:border-amber-300"
              >
                <option value="Golongan 1">Golongan 1</option>
                <option value="Golongan 2">Golongan 2</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Status
              </span>
              <select
                value={formState.status}
                onChange={handleChange("status")}
                className="border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] text-stone-100 outline-none transition focus:border-amber-300"
              >
                {RECRUITMENT_REPORT_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Usia
              </span>
              <input
                value={formState.age}
                onChange={handleChange("age")}
                className="border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Gender
              </span>
              <input
                value={formState.gender}
                onChange={handleChange("gender")}
                className="border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-3.5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-public text-[8px] uppercase tracking-[0.22em] text-amber-200">
                  Template Wawancara SOP Perekrutan
                </p>
                <p className="mt-1 text-[12px] leading-5 text-stone-300">
                  Template sudah berisi indikator wawancara sesuai SOP. Isi jawaban
                  kandidat di setiap baris setelah tanda titik dua.
                </p>
              </div>
              <button
                type="button"
                onClick={handleApplySopTemplate}
                disabled={submitting}
                className="self-start rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-amber-100 transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-60 md:self-center"
              >
                Reset ke Template SOP
              </button>
            </div>
          </div>

          <label className="mt-3 grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Fokus / Topik Wawancara
              </span>
              <span className="font-public text-[8px] uppercase tracking-[0.14em] text-stone-500">
                Min. {MIN_RECRUITMENT_REPORT_TEXT_LENGTH} • {questionLength} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={formState.question}
              onChange={handleChange("question")}
              placeholder="Topik wawancara dan cakupan pertanyaan yang dibawakan pada sesi ini..."
              className="resize-none border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] leading-5 text-stone-100 outline-none transition focus:border-amber-300 placeholder:text-stone-600"
            />
          </label>

          <label className="mt-3 grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Hasil Wawancara (Indikator SOP)
              </span>
              <span className="font-public text-[8px] uppercase tracking-[0.14em] text-stone-500">
                Min. {MIN_RECRUITMENT_REPORT_TEXT_LENGTH} • {notesLength} karakter
              </span>
            </div>
            <textarea
              rows={14}
              value={formState.notes}
              onChange={handleChange("notes")}
              className="resize-none border border-white/8 bg-black/20 px-3 py-2.5 font-mono text-[12px] leading-[1.65] text-stone-100 outline-none transition focus:border-amber-300"
            />
            <span className="text-[11px] leading-5 text-stone-500">
              Isi jawaban kandidat di setiap baris indikator setelah tanda titik dua. Template yang
              masih kosong tidak dihitung sebagai laporan final.
            </span>
          </label>
        </div>

        {submitError ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] leading-5 text-rose-100">
            {submitError}
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 border-t border-white/6 pt-3.5 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={onEliminate}
            disabled={submitting}
            className="border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15"
          >
            {submitting ? "Memproses..." : "Eliminasi Kandidat"}
          </button>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="border border-white/8 bg-black/20 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Menyimpan..." : "Simpan Laporan"}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

// Section: supplementary report modal.
export function ArchiveReportSupplementModal({
  mode,
  report,
  supplement,
  onClose,
  onSave,
  onDelete,
  submitting = false,
}) {
  const [question, setQuestion] = useState(
    supplement?.question ?? `Update lanjutan untuk kandidat ${report.name}?`,
  );
  const [notes, setNotes] = useState(supplement?.notes ?? "");
  const [submitError, setSubmitError] = useState("");
  const isEditMode = mode === "edit";
  const questionLength = getReportTextLength(question);
  const notesLength = getReportTextLength(notes);

  useEffect(() => withModalEscape(onClose), [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationMessage = getRecruitmentReportValidationMessage({
      status: "LULUS",
      question: buildRecruitmentReportQuestionTemplate(report),
      notes: "Laporan utama sudah valid.",
      additionalReports: [
        {
          question,
          notes,
        },
      ],
    });

    if (validationMessage) {
      setSubmitError(validationMessage);
      return;
    }

    onSave(report.id, {
      id: supplement?.id ?? `archive-supplement-${Date.now()}`,
      question,
      notes,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-3 md:p-5 backdrop-blur-[4px]"
    >
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-1.75rem)] w-full max-w-[680px] flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[#181818] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-3">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.24em] text-amber-300">
              Laporan Perekrutan
            </p>
            <h3 className="mt-1.5 font-sans text-xl font-bold uppercase text-stone-100 md:text-2xl">
              {isEditMode ? "Edit Laporan Tambahan" : "Tambah Laporan Tambahan"}
            </h3>
            <p className="mt-1.5 font-public text-[10px] uppercase tracking-[0.12em] text-stone-400">
              {report.name} / {report.discord}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Tutup
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Pertanyaan Strategis
              </span>
              <span className="font-public text-[8px] uppercase tracking-[0.14em] text-stone-500">
                Min. {MIN_RECRUITMENT_REPORT_TEXT_LENGTH} • {questionLength} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setSubmitError("");
              }}
              className="resize-none border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] leading-5 text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>

          <label className="mt-3 grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Keterangan Analis
              </span>
              <span className="font-public text-[8px] uppercase tracking-[0.14em] text-stone-500">
                Min. {MIN_RECRUITMENT_REPORT_TEXT_LENGTH} • {notesLength} karakter
              </span>
            </div>
            <textarea
              rows={5}
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setSubmitError("");
              }}
              className="resize-none border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] leading-5 text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>
        </div>

        {submitError ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] leading-5 text-rose-100">
            {submitError}
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 border-t border-white/6 pt-3.5 md:flex-row md:items-center md:justify-between">
          <div>
            {isEditMode ? (
              <button
                type="button"
                onClick={() => onDelete(report.id, supplement.id)}
                disabled={submitting}
                className="border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15"
              >
                {submitting ? "Memproses..." : "Hapus Laporan"}
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="border border-white/8 bg-black/20 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Perubahan"
                  : "Simpan Tambahan"}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

// Section: report archive card.
export function ArchiveReportCard({
  report,
  busy = false,
  highlighted = false,
  onEdit,
  onAddSupplement,
  onEditSupplement,
  onEliminate,
}) {
  const groupClasses = getArchiveGroupClasses(report.group);
  const statusClasses = getArchiveStatusClasses(report.status);

  return (
    <article
      className={[
        "relative flex h-full flex-col justify-between overflow-hidden bg-[#272727] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]",
        highlighted ? "ring-1 ring-amber-300/25" : "",
      ].join(" ")}
    >
      <div>
        <div className="flex items-start justify-between gap-4 pb-6">
          <div>
            <h3 className="font-sans text-2xl font-bold text-stone-200">
              {report.name}
            </h3>
            <div className="mt-2 flex items-center gap-2 opacity-70">
              <span className="h-3 w-3 rounded-full bg-stone-200" />
              <span className="font-public text-xs font-medium text-stone-200">
                {report.discordUserId
                  ? `${report.discord} • <@${report.discordUserId}> • Discord Synced`
                  : report.discord}
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
            <p className="mt-1 text-sm font-bold text-stone-200">
              {report.age}
            </p>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
              Laporan Tambahan
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {busy ? (
                <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 font-public text-[9px] font-bold uppercase tracking-[0.12em] text-amber-200">
                  Menyimpan...
                </span>
              ) : null}
              {highlighted && !busy ? (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-public text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-200">
                  Visual Update
                </span>
              ) : null}
              <span className="rounded-full border border-white/8 bg-black/20 px-2.5 py-1 font-public text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400">
                {report.additionalReports.length} Entry
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {report.additionalReports.length > 0 ? (
              report.additionalReports.map((entry, index) => (
                <div
                  key={entry.id}
                  className={[
                    "border bg-stone-950 p-4",
                    index === 0 ? "border-amber-300/20" : "border-white/5",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-public text-[8px] uppercase tracking-[0.3em] text-amber-300">
                        Laporan Tambahan {`${index + 1}`.padStart(2, "0")}
                      </p>
                      <p className="mt-2 font-public text-[8px] uppercase tracking-[0.14em] text-stone-500">
                        {new Date(entry.updatedAt).toLocaleString("id-ID")}
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
                  Belum ada laporan tambahan yang tersimpan untuk kandidat ini.
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
