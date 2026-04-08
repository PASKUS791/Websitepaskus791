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

const STATUS_HELP_COPY = {
  PROSES:
    "Masih tahap observasi. Status ini aman disimpan selama evaluasi kandidat masih berjalan.",
  LULUS:
    "Kandidat dinyatakan lolos. Gunakan status ini saat hasil akhir sudah final dan siap direview lebih lanjut.",
  GAGAL:
    "Kandidat dinyatakan gagal. Gunakan status ini saat keputusan akhir sudah final dan siap direview lebih lanjut.",
};

function getStatusAppearance(status) {
  if (status === "LULUS") {
    return {
      badgeClassName: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      optionBaseClassName:
        "border-emerald-400/15 bg-emerald-400/5 text-emerald-100 hover:bg-emerald-400/10",
      optionActiveClassName:
        "border-emerald-300/30 bg-emerald-400/16 text-emerald-100 shadow-[0_0_0_1px_rgba(110,231,183,0.08)]",
    };
  }

  if (status === "GAGAL") {
    return {
      badgeClassName: "border-rose-400/20 bg-rose-400/10 text-rose-200",
      optionBaseClassName:
        "border-rose-400/15 bg-rose-400/5 text-rose-100 hover:bg-rose-400/10",
      optionActiveClassName:
        "border-rose-300/30 bg-rose-400/16 text-rose-100 shadow-[0_0_0_1px_rgba(251,113,133,0.08)]",
    };
  }

  return {
    badgeClassName: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    optionBaseClassName:
      "border-amber-300/15 bg-amber-300/5 text-amber-100 hover:bg-amber-300/10",
    optionActiveClassName:
      "border-amber-300/30 bg-amber-300/16 text-amber-100 shadow-[0_0_0_1px_rgba(252,211,77,0.08)]",
  };
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

function buildFormState(report) {
  return {
    status: report.status,
    question: report.question,
    notes: report.notes,
    additionalReports: Array.isArray(report.additionalReports)
      ? report.additionalReports.map((entry, index) => ({
          id: entry.id || `training-supplement-${index + 1}`,
          question:
            entry.question || `Update lanjutan untuk kandidat ${report.name}?`,
          notes: entry.notes || "",
          updatedAt: entry.updatedAt || report.updatedAt || new Date().toISOString(),
        }))
      : [],
  };
}

function createSupplementDraft(report, index) {
  const timestamp = new Date().toISOString();

  return {
    id: `training-supplement-${Date.now()}-${index + 1}`,
    question: `Update lanjutan ${index + 1} untuk ${report.name}?`,
    notes: "",
    updatedAt: timestamp,
  };
}

export default function TrainingSessionReportModal({
  report,
  onClose,
  onEliminate,
  onSave,
}) {
  const [formState, setFormState] = useState(() => buildFormState(report));
  const [activeAction, setActiveAction] = useState("");
  const [hoveredStatus, setHoveredStatus] = useState("");
  const [submitError, setSubmitError] = useState("");
  const statusAppearance = getStatusAppearance(formState.status);

  useEffect(() => withModalEscape(onClose), [onClose]);
  useEffect(() => {
    setFormState(buildFormState(report));
    setSubmitError("");
    setActiveAction("");
    setHoveredStatus("");
  }, [report]);

  const handleChange = (field) => (event) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: event.target.value,
    }));
    setSubmitError("");
  };

  const handleStatusSelect = (nextStatus) => {
    setFormState((currentState) => ({
      ...currentState,
      status: nextStatus,
    }));
    setSubmitError("");
  };

  const handleSupplementChange = (supplementId, field) => (event) => {
    setFormState((currentState) => ({
      ...currentState,
      additionalReports: currentState.additionalReports.map((entry) =>
        entry.id === supplementId
          ? {
              ...entry,
              [field]: event.target.value,
              updatedAt: new Date().toISOString(),
            }
          : entry,
      ),
    }));
  };

  const handleAddSupplement = () => {
    setFormState((currentState) => ({
      ...currentState,
      additionalReports: [
        ...currentState.additionalReports,
        createSupplementDraft(report, currentState.additionalReports.length),
      ],
    }));
  };

  const handleRemoveSupplement = (supplementId) => {
    setFormState((currentState) => ({
      ...currentState,
      additionalReports: currentState.additionalReports.filter(
        (entry) => entry.id !== supplementId,
      ),
    }));
  };

  const handleSubmit = async () => {
    if (activeAction) {
      return;
    }

    setSubmitError("");
    setActiveAction("save");

    try {
      await onSave(
        {
          ...report,
          ...formState,
          updatedAt: new Date().toISOString(),
        },
      );
    } catch (error) {
      setSubmitError(
        error?.message || "Laporan gagal diproses. Periksa koneksi backend lalu coba lagi.",
      );
    } finally {
      setActiveAction("");
    }
  };

  const handleEliminate = async () => {
    if (activeAction || !onEliminate) {
      return;
    }

    setSubmitError("");
    setActiveAction("eliminate");

    try {
      await onEliminate(report);
    } catch (error) {
      setSubmitError(
        error?.message || "Eliminasi kandidat gagal diproses. Coba ulang beberapa saat lagi.",
      );
    } finally {
      setActiveAction("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/72 p-3 md:p-5 backdrop-blur-[6px]"
    >
      <motion.form
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => event.preventDefault()}
        className="flex max-h-[calc(100vh-1.75rem)] w-full max-w-[700px] flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[#181818]/95 p-4 shadow-[0_32px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-4">
          <div>
            <p className="font-public text-[8px] uppercase tracking-[0.28em] text-amber-300">
              Internal Communication #REK-772
            </p>
            <h3 className="mt-2 font-sans text-[1.75rem] font-bold uppercase tracking-tight text-stone-100 md:text-[2.1rem]">
              Laporan Rekrutmen
            </h3>
            <p className="mt-1.5 max-w-xl text-[11px] leading-6 text-stone-400">
              Lengkapi evaluasi kandidat dan simpan laporan per sipil. Pengiriman sesi ke halaman review dilakukan dari tombol utama di halaman pelatihan.
            </p>
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

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-3 md:grid-cols-[minmax(0,0.92fr)_minmax(0,0.92fr)_minmax(280px,1.05fr)]">
            <div className="self-start rounded-2xl border border-white/8 bg-[#1a1a1a] p-3.5">
              <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
                Kandidat
              </p>
              <p className="mt-1.5 font-sans text-lg font-bold text-stone-100">
                {report.name}
              </p>
            </div>
            <div className="self-start rounded-2xl border border-white/8 bg-[#1a1a1a] p-3.5">
              <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
                Discord
              </p>
              <p className="mt-1.5 font-sans text-lg font-bold text-stone-100">
                {report.discord}
              </p>
            </div>
            <div className="self-start rounded-2xl border border-white/8 bg-[#1a1a1a] p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
                    Status Operasi
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-stone-400">
                    Pilih status final dengan cepat. Arahkan kursor ke status untuk melihat arti tiap pilihan.
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.16em] ${statusAppearance.badgeClassName}`}
                >
                  {formState.status}
                </span>
              </div>

              <div
                className="relative mt-3"
                onMouseLeave={() => setHoveredStatus("")}
              >
                <div className="grid grid-cols-3 gap-2">
                  {RECRUITMENT_REPORT_STATUS_OPTIONS.map((option) => {
                    const optionAppearance = getStatusAppearance(option);
                    const isActive = formState.status === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleStatusSelect(option)}
                        onMouseEnter={() => setHoveredStatus(option)}
                        onFocus={() => setHoveredStatus(option)}
                        onBlur={() => setHoveredStatus("")}
                        className={[
                          "rounded-xl border px-3 py-2.5 font-public text-[10px] font-bold uppercase tracking-[0.18em] transition",
                          optionAppearance.optionBaseClassName,
                          isActive ? optionAppearance.optionActiveClassName : "",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {hoveredStatus ? (
                  <div className="pointer-events-none absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
                    <p className="font-public text-[8px] uppercase tracking-[0.18em] text-stone-500">
                      {hoveredStatus}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-5 text-stone-200">
                      {STATUS_HELP_COPY[hoveredStatus]}
                    </p>
                  </div>
                ) : null}
              </div>

              <p className="mt-3 font-public text-[8px] uppercase tracking-[0.18em] text-stone-500">
                Hover status untuk melihat penjelasan
              </p>
            </div>
          </div>

          <label className="mt-4 block">
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

          <label className="mt-4 block">
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

          <section className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-3.5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-public text-[8px] uppercase tracking-[0.22em] text-[#a8d07c]">
                  Laporan Tambahan
                </p>
                <p className="mt-1 text-[12px] leading-5 text-stone-400">
                  Tambahkan update lanjutan per kandidat agar histori observasi tetap lengkap.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200">
                  {formState.additionalReports.length} Entry
                </span>
                <button
                  type="button"
                  onClick={handleAddSupplement}
                  className="rounded-xl border border-white/8 bg-white/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/15"
                >
                  Tambah Laporan Tambahan
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {formState.additionalReports.length > 0 ? (
                formState.additionalReports.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-white/8 bg-[#141414] p-3"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-public text-[8px] uppercase tracking-[0.18em] text-amber-300">
                          Laporan Tambahan {`${index + 1}`.padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-[11px] text-stone-500">
                          {new Date(entry.updatedAt).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSupplement(entry.id)}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/15"
                      >
                        Hapus
                      </button>
                    </div>

                    <label className="mt-3 block">
                      <span className="font-public text-[8px] uppercase tracking-[0.16em] text-stone-500">
                        Fokus Tambahan
                      </span>
                      <textarea
                        rows={2}
                        value={entry.question}
                        onChange={handleSupplementChange(entry.id, "question")}
                        className="mt-2 w-full resize-none border border-white/8 bg-black/25 px-3 py-2.5 text-[13px] leading-5 text-stone-100 outline-none transition focus:border-amber-300"
                      />
                    </label>

                    <label className="mt-3 block">
                      <span className="font-public text-[8px] uppercase tracking-[0.16em] text-stone-500">
                        Catatan Tambahan
                      </span>
                      <textarea
                        rows={3}
                        value={entry.notes}
                        onChange={handleSupplementChange(entry.id, "notes")}
                        className="mt-2 w-full resize-none border border-white/8 bg-black/25 px-3 py-2.5 text-[13px] leading-5 text-stone-100 outline-none transition focus:border-amber-300"
                      />
                    </label>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/8 bg-black/20 px-4 py-6 text-center text-[12px] leading-6 text-stone-400">
                  Belum ada laporan tambahan. Gunakan tombol <strong>Tambah Laporan Tambahan</strong> untuk menambahkan update observasi kandidat.
                </div>
              )}
            </div>
          </section>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] leading-5 text-rose-100">
              {submitError}
            </div>
          ) : null}

          <div className="mt-4 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5 text-[12px] leading-6 text-stone-400">
            Tombol laporan di modal ini hanya menyimpan data kandidat. Setelah semua kandidat sudah memiliki laporan, gunakan tombol <strong>Kirim Laporan</strong> di halaman pelatihan untuk menutup sesi dan masuk ke halaman review.
          </div>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-white/6 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2.5 md:flex-row">
              {onEliminate ? (
                <button
                  type="button"
                  onClick={handleEliminate}
                  disabled={Boolean(activeAction)}
                  className="border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {activeAction === "eliminate" ? "Mengeliminasi..." : "Eliminasi Kandidat"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                disabled={Boolean(activeAction)}
                className="border border-white/8 bg-white/10 px-4 py-2.5 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Tutup
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={Boolean(activeAction)}
              className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeAction === "save" ? "Menyimpan..." : "Tambah Laporan"}
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
