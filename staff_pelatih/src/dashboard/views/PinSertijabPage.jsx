/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Pin & Sertijab Page
 * Purpose: Menu manual untuk tindak lanjut pin, role, dan sertijab setelah laporan terkirim.
 */

import { Link } from "react-router-dom";
import { useMemo } from "react";
import { formatArchiveTimestamp } from "../data/recruitmentData";
import { useStaffPortalData } from "../hooks/useStaffPortalData";

const MANUAL_SOP_STEPS = [
  "Buka laporan perekrutan yang sudah terkirim ke resimen dan pastikan status peserta LULUS.",
  "Cek Discord ID peserta. Jika ID kosong, jangan proses pin/role sebelum data diperbaiki.",
  "Berikan pin, role, atau Sertijab melalui prosedur Discord/admin yang terpisah dari tombol Kirim Laporan.",
  "Catat hasil proses manual sebagai laporan tambahan bila ada kendala atau peserta perlu follow-up.",
];

function getReportDiscordUserId(report = {}) {
  return String(
    report.discordUserId ||
      report.discord_user_id ||
      report.discordId ||
      report.discord_id ||
      "",
  ).replace(/\D/g, "");
}

function isPassedReport(report = {}) {
  return String(report.status || "").trim().toUpperCase() === "LULUS";
}

export default function PinSertijabPage() {
  const {
    reports,
    trainingSessions,
    loading,
    error,
  } = useStaffPortalData();

  const dispatchedSessionMap = useMemo(
    () =>
      new Map(
        trainingSessions
          .filter((session) => session.dispatchRecord || session.dispatchedAt)
          .map((session) => [session.id, session]),
      ),
    [trainingSessions],
  );

  const eligibleReports = useMemo(
    () =>
      reports
        .filter((report) => isPassedReport(report) && dispatchedSessionMap.has(report.sessionId))
        .map((report) => ({
          ...report,
          discordUserId: getReportDiscordUserId(report),
          session: dispatchedSessionMap.get(report.sessionId),
        }))
        .sort(
          (left, right) =>
            new Date(right.sentAt || right.updatedAt).getTime() -
            new Date(left.sentAt || left.updatedAt).getTime(),
        ),
    [dispatchedSessionMap, reports],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/8 bg-[#151515] p-5">
        <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
          Manual Administration
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="font-sans text-2xl font-bold uppercase text-stone-100 md:text-3xl">
              Pin & Sertijab Manual
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-400">
              Menu ini memisahkan pemberian pin, role Discord, rename Prada, dan
              Sertijab dari tombol kirim laporan. Dispatch laporan kini hanya
              mengirim embed pelaporan perekrutan ke resimen agar proses lebih ringan.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-amber-200">
              Prinsip Baru
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-200">
              Tidak ada auto role, auto pin, atau auto Sertijab dari dispatch laporan.
              Semua administrasi dilakukan manual melalui SOP terpisah.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
          <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-400">
            SOP Manual
          </p>
          <div className="mt-4 space-y-3">
            {MANUAL_SOP_STEPS.map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-white/8 bg-[#151515] p-4"
              >
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-amber-300">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-400">
                Peserta Siap Ditindaklanjuti
              </p>
              <h2 className="mt-2 font-sans text-xl font-bold uppercase text-stone-100">
                {eligibleReports.length} Peserta Lulus
              </h2>
            </div>
            <span className="rounded-full border border-white/8 bg-[#151515] px-3 py-1 font-public text-[9px] uppercase tracking-[0.14em] text-stone-300">
              Manual Queue
            </span>
          </div>

          {loading ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/8 bg-[#151515] px-4 py-8 text-center text-sm text-stone-400">
              Memuat data laporan dari backend...
            </div>
          ) : error ? (
            <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-4 text-sm text-rose-100">
              {error}
            </div>
          ) : eligibleReports.length > 0 ? (
            <div className="mt-4 max-h-[620px] space-y-3 overflow-y-auto pr-1">
              {eligibleReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-white/8 bg-[#151515] p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-sans text-base font-bold text-stone-100">
                        {report.name}
                      </p>
                      <p className="mt-1 text-[12px] text-stone-400">
                        {report.discordUserId
                          ? `<@${report.discordUserId}>`
                          : report.discord || "Discord belum tersedia"}
                      </p>
                      <p className="mt-2 font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                        {report.group} • {formatArchiveTimestamp(report.sentAt || report.updatedAt)}
                      </p>
                    </div>
                    <Link
                      to={`/dashboard/laporan-perekrutan/${report.sessionId}`}
                      state={{ focusReportId: report.id }}
                      className="shrink-0 border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.14em] text-stone-200 transition hover:bg-white/5"
                    >
                      Buka Laporan
                    </Link>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-public text-[9px] uppercase tracking-[0.14em] text-emerald-200">
                      Lulus
                    </span>
                    <span
                      className={[
                        "rounded-full border px-3 py-1 font-public text-[9px] uppercase tracking-[0.14em]",
                        report.discordUserId
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                          : "border-amber-300/20 bg-amber-300/10 text-amber-100",
                      ].join(" ")}
                    >
                      {report.discordUserId ? "Discord Synced" : "Cek Discord ID"}
                    </span>
                    <span className="rounded-full border border-stone-500/30 bg-stone-500/10 px-3 py-1 font-public text-[9px] uppercase tracking-[0.14em] text-stone-300">
                      Proses Manual
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-white/8 bg-[#151515] px-4 py-8 text-center text-sm text-stone-400">
              Belum ada peserta lulus dari laporan yang sudah dikirim.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
