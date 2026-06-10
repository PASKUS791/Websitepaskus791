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
import { useEffect, useMemo, useRef, useState } from "react";

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const MAX_ATTACHMENT_COUNT = 4;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function buildDefaultDispatchDescription(trainingSession) {
  return `Laporan hasil seleksi wawancara perekrutan PASKUS-791 untuk sesi ${trainingSession?.title || "pelatihan aktif"}. Peserta yang LULUS akan mendapatkan Sertijab dan pin Komodo.`;
}

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
  const [description, setDescription] = useState(() =>
    buildDefaultDispatchDescription(trainingSession),
  );
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState("");
  const [dispatchPhase, setDispatchPhase] = useState("idle");
  const closeTimerRef = useRef(null);

  useEffect(() => withModalEscape(onClose), [onClose]);
  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  const operators = useMemo(
    () => trainingSession?.operators || [],
    [trainingSession],
  );
  const mentionReadyOperators = useMemo(
    () => operators.filter((operator) => Boolean(operator.discordUserId)),
    [operators],
  );
  const missingDiscordOperators = useMemo(
    () => operators.filter((operator) => !operator.discordUserId),
    [operators],
  );
  const applicantPreview = useMemo(() => reports.slice(0, 6), [reports]);
  const modalLocked =
    submitting || dispatchPhase === "sending" || dispatchPhase === "complete";

  const totalAttachmentBytes = useMemo(
    () => attachments.reduce((total, attachment) => total + attachment.size, 0),
    [attachments],
  );

  const handleAttachmentChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    const existingKeys = new Set(
      attachments.map(
        (attachment) =>
          `${attachment.fileName}:${attachment.size}:${attachment.file?.lastModified || 0}`,
      ),
    );
    const incomingFiles = selectedFiles.filter((file) => {
      const key = `${file.name}:${file.size}:${file.lastModified || 0}`;
      return !existingKeys.has(key);
    });
    const nextFileCount = attachments.length + incomingFiles.length;

    if (nextFileCount > MAX_ATTACHMENT_COUNT) {
      setError(`Maksimal ${MAX_ATTACHMENT_COUNT} foto per dispatch.`);
      return;
    }

    const invalidFile = incomingFiles.find(
      (file) => !ACCEPTED_IMAGE_TYPES.includes(file.type),
    );

    if (invalidFile) {
      setError("Lampiran foto hanya menerima format JPG, PNG, atau WEBP.");
      return;
    }

    const oversizedFile = incomingFiles.find(
      (file) => file.size > MAX_ATTACHMENT_BYTES,
    );

    if (oversizedFile) {
      setError(
        "Setiap lampiran maksimal 5MB agar sesuai batas upload backend.",
      );
      return;
    }

    const nextTotalBytes =
      totalAttachmentBytes +
      incomingFiles.reduce((total, file) => total + file.size, 0);

    if (nextTotalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      setError("Total seluruh lampiran maksimal 20MB per dispatch.");
      return;
    }

    try {
      const nextAttachments = await Promise.all(
        incomingFiles.map(async (file) => ({
          file,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          dataUrl: await readFileAsDataUrl(file),
        })),
      );

      setAttachments((currentAttachments) => [
        ...currentAttachments,
        ...nextAttachments,
      ]);
      setError("");
    } catch (readError) {
      setError(readError.message || "Gagal membaca lampiran foto.");
    }
  };

  const handleRemoveAttachment = (attachmentIndex) => {
    setAttachments((currentAttachments) =>
      currentAttachments.filter((_, index) => index !== attachmentIndex),
    );
    setError("");
  };

  const handleResetAttachments = () => {
    setAttachments([]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (attachments.length === 0) {
      setError(
        "Minimal satu lampiran foto wajib diisi sebelum laporan dikirim ke resimen.",
      );
      return;
    }

    try {
      setError("");
      setDispatchPhase("sending");
      await onSubmit({
        description: description.trim(),
        attachments,
      });
      setDispatchPhase("complete");
      closeTimerRef.current = window.setTimeout(() => {
        onClose();
      }, 1600);
    } catch (submitError) {
      setDispatchPhase("error");
      setError(
        submitError?.message || "Gagal mengirim laporan sesi ke resimen.",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[230] flex items-center justify-center bg-black/72 p-3 md:p-5 backdrop-blur-[4px]"
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
              Sistem akan kirim satu embed Discord, melampirkan beberapa foto,
              lalu mencantumkan tag instruktur dan pendaftar untuk{" "}
              {trainingSession?.title || "sesi aktif"}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!modalLocked) onClose();
            }}
            disabled={modalLocked}
            className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <p className="mt-1 text-sm text-stone-200">
                      {trainingSession?.title}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-black/20 p-3">
                    <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
                      Kandidat
                    </p>
                    <p className="mt-1 text-sm text-stone-200">
                      {reports.length} laporan
                    </p>
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
                    <p className="mt-1 text-sm text-stone-200">
                      {trainingSession?.golongan}
                    </p>
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
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAttachmentChange}
                  className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-300 file:mr-3 file:rounded-xl file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:font-public file:text-[10px] file:font-bold file:uppercase file:tracking-[0.16em] file:text-[#3C2F00]"
                />
                <p className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                  Maksimal {MAX_ATTACHMENT_COUNT} foto, 5MB per foto, total
                  20MB.
                </p>
              </label>

              {attachments.length > 0 ? (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-public text-[10px] uppercase tracking-[0.18em] text-amber-300">
                        Preview Lampiran
                      </p>
                      <p className="mt-1 text-sm text-stone-300">
                        {attachments.length} foto siap dikirim ke Discord.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                        {(totalAttachmentBytes / (1024 * 1024)).toFixed(2)} MB
                        total
                      </span>
                      <button
                        type="button"
                        onClick={handleResetAttachments}
                        className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
                      >
                        Hapus Semua
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {attachments.map((attachment, index) => (
                      <div
                        key={`${attachment.fileName}-${attachment.size}-${index}`}
                        className="overflow-hidden rounded-2xl border border-white/8 bg-[#111111]"
                      >
                        <div className="flex items-start justify-between gap-3 border-b border-white/8 px-3 py-3">
                          <div className="min-w-0">
                            <p className="truncate font-public text-[10px] uppercase tracking-[0.18em] text-amber-300">
                              Foto {index + 1}
                            </p>
                            <p className="mt-1 truncate text-sm text-stone-300">
                              {attachment.fileName}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                              {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(index)}
                              className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-2.5 py-2 font-public text-[8px] font-bold uppercase tracking-[0.14em] text-rose-200 transition hover:bg-rose-500/15"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                        <img
                          src={attachment.dataUrl}
                          alt={
                            attachment.fileName ||
                            `Lampiran recruiter ${index + 1}`
                          }
                          className="h-[220px] w-full object-cover"
                        />
                      </div>
                    ))}
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
                        <p className="mt-1 text-[12px] text-stone-400">
                          @{operator.username}
                        </p>
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
                      {mentionReadyOperators.length} instruktur punya Discord
                      User ID.
                    </p>
                  </div>

                  {missingDiscordOperators.length > 0 ? (
                    <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3">
                      <p className="font-public text-[9px] uppercase tracking-[0.16em] text-amber-200">
                        Perlu Dilengkapi
                      </p>
                      <p className="mt-1 text-sm text-stone-200">
                        {missingDiscordOperators
                          .map((operator) => operator.label)
                          .join(", ")}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Pendaftar Di Embed
                </p>
                <div className="mt-3 space-y-3">
                  {applicantPreview.length > 0 ? (
                    applicantPreview.map((report) => (
                      <div
                        key={report.id}
                        className="rounded-xl border border-white/8 bg-black/20 p-3"
                      >
                        <p className="font-sans text-sm font-bold text-stone-100">
                          {report.name}
                        </p>
                        <p className="mt-1 text-[12px] text-stone-400">
                          {report.discord}
                        </p>
                        {report.discordUserId ? (
                          <p className="mt-1 text-[12px] text-emerald-300">
                            &lt;@{report.discordUserId}&gt; • Discord Synced
                          </p>
                        ) : null}
                        <p className="mt-2 font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                          {report.status} • {report.group}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400">
                      Belum ada pendaftar di sesi ini.
                    </div>
                  )}
                </div>

                {reports.length > applicantPreview.length ? (
                  <p className="mt-3 text-[12px] text-stone-500">
                    +{reports.length - applicantPreview.length} pendaftar lain
                    tetap ikut masuk ke embed.
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Output Dispatch
                </p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-stone-300">
                  <p>1. Kirim satu embed Discord resmi untuk sesi ini.</p>
                  <p>2. Lampirkan satu atau beberapa foto dari modal ini.</p>
                  <p>3. Tag instruktur yang punya Discord User ID.</p>
                  <p>4. Cantumkan data dan tag pendaftar di dalam embed.</p>
                  <p>5. Peserta LULUS akan mendapatkan <strong className="text-amber-200">Sertijab</strong> dari resimen.</p>
                  <p>6. Hanya <strong className="text-amber-200">pin Komodo</strong> yang diberikan — pin latpur tidak lagi diberikan.</p>
                  <p>7. Uji mutu pada Sertijab diambil dari hasil laporan wawancara yang sudah ditulis dan dicocokan dengan SOP yang tertera.</p>
                </div>
              </div>

              {dispatchPhase === "complete" ? (
                <div className="rounded-xl border border-emerald-400/24 bg-emerald-400/10 p-3">
                  <p className="font-public text-[9px] uppercase tracking-[0.16em] text-emerald-300">
                    Laporan Telah Terkirim
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-200">
                    Dispatch selesai. Peserta LULUS akan mendapat Sertijab dan pin Komodo dari resimen. Uji mutu pada Sertijab diambil dari hasil laporan wawancara.
                  </p>
                </div>
              ) : null}
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
            onClick={() => {
              if (!modalLocked) onClose();
            }}
            disabled={modalLocked}
            className="border border-white/8 bg-black/20 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={modalLocked}
            className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {dispatchPhase === "complete"
              ? "Selesai"
              : submitting || dispatchPhase === "sending"
                ? "Mengirim Laporan..."
                : "Kirim Laporan Ke Resimen"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
