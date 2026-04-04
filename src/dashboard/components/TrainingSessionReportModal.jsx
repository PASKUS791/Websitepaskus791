/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Training Session Report Modal
 * Purpose: Modal laporkan kandidat dari page pelatihan aktif.
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RECRUITMENT_REPORT_STATUS_OPTIONS } from "../data/recruitmentData";

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

export default function TrainingSessionReportModal({
  report,
  onClose,
  onSave,
}) {
  const [formState, setFormState] = useState(() => ({
    status: report.status,
    question: report.question,
    notes: report.notes,
  }));

  useEffect(() => withModalEscape(onClose), [onClose]);

  const handleChange = (field) => (event) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event, mode) => {
    event.preventDefault();
    onSave(
      {
        ...report,
        ...formState,
        updatedAt: new Date().toISOString(),
      },
      { dispatchRequested: mode === "dispatch" },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/72 p-3 md:p-5 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100vh-1.75rem)] w-full max-w-[700px] flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[#181818]/95 p-4 shadow-[0_32px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-3">
          <div>
            <p className="font-public text-[8px] uppercase tracking-[0.28em] text-amber-300">
              Internal Communication #REK-772
            </p>
            <h3 className="mt-1.5 font-sans text-xl font-bold uppercase text-stone-100 md:text-[1.7rem]">
              Laporan Rekrutmen
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-stone-500 transition hover:text-stone-200"
            aria-label="Tutup modal"
          >
            ×
          </button>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-px border border-white/6 bg-white/6 md:grid-cols-3">
            <div className="bg-[#1a1a1a] p-3">
              <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
                Kandidat
              </p>
              <p className="mt-1.5 font-sans text-lg font-bold text-stone-100">
                {report.name}
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-3">
              <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
                Discord
              </p>
              <p className="mt-1.5 font-sans text-lg font-bold text-stone-100">
                {report.discord}
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-3">
              <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
                Status Operasi
              </p>
              <select
                value={formState.status}
                onChange={handleChange("status")}
                className="mt-1.5 w-full border border-white/8 bg-black/30 px-3 py-2 font-sans text-sm font-bold text-[#b8dd88] outline-none transition focus:border-amber-300"
              >
                {RECRUITMENT_REPORT_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} • {report.group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="mt-3 block">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="font-public text-[8px] uppercase tracking-[0.22em] text-[#a8d07c]">
                Pertanyaan
              </span>
              <span className="font-public text-[8px] uppercase tracking-[0.16em] text-stone-500">
                Mandatory Input
              </span>
            </div>
            <textarea
              rows={2}
              value={formState.question}
              onChange={handleChange("question")}
              className="w-full resize-none border border-white/8 bg-black/25 px-3 py-2.5 text-[13px] leading-5 text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>

          <label className="mt-3 block">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="font-public text-[8px] uppercase tracking-[0.22em] text-[#a8d07c]">
                Keterangan
              </span>
              <span className="font-public text-[8px] uppercase tracking-[0.16em] text-stone-500">
                Operational Observations
              </span>
            </div>
            <textarea
              rows={4}
              value={formState.notes}
              onChange={handleChange("notes")}
              className="w-full resize-none border border-white/8 bg-black/25 px-3 py-2.5 text-[13px] leading-5 text-stone-100 outline-none transition focus:border-amber-300"
            />
          </label>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-white/6 pt-3.5 md:flex-row">
            <button
              type="button"
              onClick={(event) => handleSubmit(event, "draft")}
              className="flex-1 border border-white/8 bg-white/10 px-4 py-2.5 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/15"
            >
              Tambahkan Laporan
            </button>
            <button
              type="button"
              onClick={(event) => handleSubmit(event, "dispatch")}
              className="flex-1 bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-[#3C2F00] transition hover:brightness-105"
            >
              Kirim Laporan
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-stone-500/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-stone-500/30" />
            </div>
            <p className="font-public text-[7px] uppercase tracking-[0.28em] text-stone-500">
              Secure Channel Encrypted
            </p>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}
