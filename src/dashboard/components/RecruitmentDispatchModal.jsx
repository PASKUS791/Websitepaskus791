/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Recruitment Dispatch Modal
 * Purpose: Modal kirim lampiran recruiter ke resimen beserta preview operator, foto, dan deskripsi dispatch.
 */

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const MAX_ATTACHMENT_BYTES = 6 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Gagal membaca file lampiran."));
    reader.readAsDataURL(file);
  });
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

export default function RecruitmentDispatchModal({
  trainingSession,
  reports = [],
  pendingDispatchCount = 0,
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [description, setDescription] = useState(
    `Lampiran hasil perekrutan, pelatihan wingman, dan pengambilan latpur fisik serta mental untuk sesi ${trainingSession?.title || "pelatihan aktif"}.`,
  );
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => withModalEscape(onClose), [onClose]);

  const operators = useMemo(() => trainingSession?.operators || [], [trainingSession]);
  const mentionReadyOperators = useMemo(
    () => operators.filter((operator) => Boolean(operator.discordUserId)),
    [operators],
  );
  const missingDiscordOperators = useMemo(
    () => operators.filter((operator) => !operator.discordUserId),
    [operators],
  );

  const handleAttachmentChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAttachment(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Lampiran foto hanya menerima format JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setError("Ukuran lampiran maksimal 6MB agar aman dikirim ke server.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAttachment({
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        dataUrl,
      });
      setError("");
    } catch (readError) {
      setAttachment(null);
      setError(readError.message || "Gagal membaca lampiran foto.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!attachment?.dataUrl) {
      setError("Lampiran foto wajib diisi sebelum laporan dikirim ke resimen.");
      return;
    }

    await onSubmit({
      description: description.trim(),
      attachment,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[230] flex items-center justify-center bg-black/72 p-3 md:p-5 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-1.75rem)] w-full max-w-[980px] flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[#181818] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-3">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.24em] text-amber-300">
              Recruitment Dispatch
            </p>
            <h3 className="mt-1.5 font-sans text-xl font-bold uppercase text-stone-100 md:text-2xl">
              Kirim Laporan Ke Resimen
            </h3>
            <p className="mt-1.5 text-[13px] text-stone-400">
              Sistem akan generate PDF sesi, melampirkan foto, lalu kirim webhook Discord
              secara realtime untuk {trainingSession?.title || "sesi aktif"}.
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
          <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Ringkasan Dispatch
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-white/8 bg-black/20 p-3">
                    <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                      Sesi
                    </p>
                    <p className="mt-1 text-sm text-stone-200">{trainingSession?.title}</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-black/20 p-3">
                    <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                      Kandidat
                    </p>
                    <p className="mt-1 text-sm text-stone-200">{reports.length} laporan</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-black/20 p-3">
                    <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                      Pending Dispatch
                    </p>
                    <p className="mt-1 text-sm text-stone-200">
                      {pendingDispatchCount} laporan perlu sinkronisasi
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-black/20 p-3">
                    <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                      Golongan
                    </p>
                    <p className="mt-1 text-sm text-stone-200">{trainingSession?.golongan}</p>
                  </div>
                </div>
              </div>

              <label className="grid gap-2">
                <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Deskripsi
                </span>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="resize-none rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-[13px] leading-6 text-stone-100 outline-none transition focus:border-amber-300"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Lampiran Foto
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAttachmentChange}
                  className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-300 file:mr-3 file:rounded-xl file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:font-public file:text-[10px] file:font-bold file:uppercase file:tracking-[0.16em] file:text-[#3C2F00]"
                />
              </label>

              {attachment?.dataUrl ? (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-public text-[10px] uppercase tracking-[0.18em] text-amber-300">
                        Preview Lampiran
                      </p>
                      <p className="mt-1 text-sm text-stone-300">{attachment.fileName}</p>
                    </div>
                    <span className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                      {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-[#111111]">
                    <img
                      src={attachment.dataUrl}
                      alt="Lampiran recruiter"
                      className="h-[280px] w-full object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Instruktur Yang Akan Ditag
                </p>
                <div className="mt-3 space-y-3">
                  {operators.length > 0 ? (
                    operators.map((operator) => (
                      <div
                        key={`${operator.id}-${operator.username}`}
                        className="rounded-xl border border-white/8 bg-black/20 p-3"
                      >
                        <p className="font-sans text-sm font-bold text-stone-100">
                          {operator.label}
                        </p>
                        <p className="mt-1 text-[12px] text-stone-400">@{operator.username}</p>
                        <p className="mt-2 font-public text-[9px] uppercase tracking-[0.14em] text-amber-300">
                          {operator.discordUserId
                            ? `Tag Discord: <@${operator.discordUserId}>`
                            : "Discord ID belum diisi, akan tampil sebagai nama biasa."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400">
                      Tidak ada instruktur yang tertaut ke sesi ini.
                    </div>
                  )}
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                    <p className="font-public text-[9px] uppercase tracking-[0.16em] text-emerald-300">
                      Tag Siap Kirim
                    </p>
                    <p className="mt-1 text-sm text-stone-200">
                      {mentionReadyOperators.length} instruktur punya Discord User ID.
                    </p>
                  </div>

                  {missingDiscordOperators.length > 0 ? (
                    <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3">
                      <p className="font-public text-[9px] uppercase tracking-[0.16em] text-amber-200">
                        Perlu Dilengkapi
                      </p>
                      <p className="mt-1 text-sm text-stone-200">
                        {missingDiscordOperators.map((operator) => operator.label).join(", ")}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Output Otomatis
                </p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-stone-300">
                  <p>1. Generate PDF sesi pelatihan lengkap.</p>
                  <p>2. Kirim embed Discord dengan logo dan banner resmi.</p>
                  <p>3. Lampirkan foto dari modal ini.</p>
                  <p>4. Tag instruktur yang punya Discord User ID.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-4 font-public text-[9px] uppercase tracking-[0.16em] text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 border-t border-white/6 pt-3.5 md:flex-row md:items-center md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 bg-black/20 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Kirim Laporan Ke Resimen"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
