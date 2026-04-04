/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / SOP Library
 * Purpose: Konten dan detail SOP recruiter dalam file terpisah agar mudah diedit tim.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const SOP_LIBRARY = [
  {
    id: "sop-perekrut-brm5",
    layout: "framework",
    accent: "lime",
    cardEyebrow: "SOP In-Game BRM5",
    cardSummary:
      "Panduan perekrutan kandidat sipil atau PMC langsung di BRM5, mulai dari pembukaan interaksi, screening awal, sampai keputusan lanjut ke sesi pelatihan.",
    badge: "BRM5",
    documentTag: "SOP-REKRUT-BRM5-791",
    serial: "REV. APRIL 2026",
    title: "SOP PEREKRUTAN IN-GAME BRM5",
    description:
      "Dokumen ini mengatur tata cara perekrutan kandidat di area operasi BRM5 secara tertib, sopan, dan efisien. Fokus utama SOP ini adalah membuka komunikasi dengan benar, menilai kesiapan dasar kandidat, dan memastikan recruiter tidak melewati tahapan screening sebelum kandidat dibawa ke sesi pelatihan.",
    referenceLabel: "Channel Aktif",
    referenceValue: "IN-GAME SCREENING",
    overviewTitle: "Garis Besar Operasi",
    overviewDescription:
      "Perekrutan in-game harus dilakukan dengan alur yang jelas: identifikasi kandidat, pembukaan roleplay, cek kesiapan komunikasi, cek loyalitas dan attitude, lalu arahkan kandidat yang lolos menuju sesi pelatihan web. Hindari perekrutan terburu-buru, spam chat, atau keputusan tanpa catatan singkat.",
    directives: [
      {
        label: "PRINSIP 01",
        text: '"Recruiter wajib memulai percakapan dengan sopan, singkat, dan tidak menekan kandidat."',
      },
      {
        label: "PRINSIP 02",
        text: '"Keputusan lanjut atau tidak lanjut harus berdasarkan attitude, respons, dan kesiapan kandidat, bukan sekadar cepat membalas chat."',
      },
    ],
    fieldSpecs: [
      { label: "Area Operasi", value: "BRM5 Public / Private Server" },
      { label: "Target Kandidat", value: "Sipil dan PMC" },
      { label: "Hasil Awal", value: "Lanjut Pelatihan / Ditunda / Ditolak" },
      { label: "Catatan Minimum", value: "Nama, Discord, hasil screening" },
    ],
    phases: [
      {
        index: "01",
        title: "Phase 1: Kontak Awal",
        description:
          "Pastikan kandidat tidak sedang dalam kondisi tempur berat atau roleplay aktif lain. Buka percakapan dengan salam dan maksud yang jelas, lalu arahkan kandidat untuk fokus sebentar ke proses screening.",
        bullets: ["Perkenalkan diri singkat", "Pastikan kandidat siap diwawancara"],
      },
      {
        index: "02",
        title: "Phase 2: Screening Dasar",
        description:
          "Nilai respon kandidat saat ditanya tujuan bergabung, pengalaman bermain, dan kesiapan mengikuti aturan. Catat sikap, kerapian jawaban, dan cara kandidat merespon recruiter.",
        bullets: ["Nilai komunikasi", "Nilai kesiapan mengikuti arahan"],
      },
      {
        index: "03",
        title: "Phase 3: Keputusan Operasional",
        description:
          "Jika kandidat layak, arahkan ke sesi pelatihan web. Jika belum siap, tutup percakapan dengan sopan dan beri alasan singkat. Jangan menghilang tanpa penutup.",
        bullets: ["Arahkan ke pelatihan", "Berikan penutup yang sopan"],
      },
    ],
    emergency: {
      title: "Protokol Situasi Gangguan",
      description:
        "Jika kandidat toxic, memancing konflik, atau sengaja mengacaukan proses roleplay, hentikan screening. Jangan lanjutkan perekrutan. Simpan catatan singkat dan arahkan recruiter lain agar kandidat tidak diproses ulang tanpa review.",
      code: "REKRUT-LOCK-01",
    },
    footer: [
      "Revisi Operasional April 2026",
      "Divisi Rekrutmen Paskus 791",
    ],
  },
  {
    id: "sop-roleplay-bahasa",
    layout: "sectioned",
    accent: "amber",
    cardEyebrow: "Etika Roleplay",
    cardSummary:
      "Standar bahasa recruiter saat roleplay: penggunaan Sir dan Madam, tata krama, serta cara menjaga wibawa recruiter tanpa terdengar kasar atau berlebihan.",
    badge: "ROLEPLAY",
    documentTag: "SOP-RP-COMMS-791",
    serial: "UPDATE BAHASA APRIL 2026",
    title: "SOP BAHASA DAN SOPAN SANTUN ROLEPLAY",
    description: "Standar pemanggilan, nada bicara, dan etika recruiter.",
    pills: ["SIR UNTUK PRIA", "MADAM UNTUK WANITA", "TETAP SOPAN"],
    sections: [
      {
        index: "01.",
        title: "ATURAN PEMANGGILAN",
        intro:
          "Gunakan sapaan formal yang konsisten selama proses roleplay agar interaksi recruiter terlihat rapi dan berwibawa.",
        bullets: [
          "Gunakan Sir untuk kandidat laki-laki.",
          "Gunakan Madam untuk kandidat perempuan.",
          "Jika gender belum jelas, gunakan panggilan netral seperti Recruit atau Candidate sampai kandidat mengoreksi sendiri.",
        ],
      },
      {
        index: "02.",
        title: "CONTOH BAHASA YANG BENAR",
        intro: "",
        cards: [
          {
            title: "PEMBUKAAN",
            text:
              '"Good evening, Sir. Saya dari recruiter Paskus 791. Apakah Anda bersedia meluangkan waktu untuk screening singkat?"',
          },
          {
            title: "ARAHAN",
            text:
              '"Madam, mohon jawab dengan singkat dan jelas. Saya akan lanjutkan ke pertanyaan berikutnya setelah jawaban diterima."',
          },
          {
            title: "PENUTUP",
            text:
              '"Terima kasih atas waktunya, Sir. Hasil screening Anda akan kami lanjutkan ke tahap berikutnya."',
          },
        ],
      },
      {
        index: "03.",
        title: "ETIKA WAJIB",
        intro: "",
        protocols: [
          {
            tag: "ETIKA 3.1",
            text:
              "Hindari mengetik dengan nada merendahkan, mengejek, atau memerintah tanpa sopan santun.",
          },
          {
            tag: "ETIKA 3.2",
            text:
              "Gunakan kalimat singkat, jelas, dan profesional. Jangan spam chat berturut-turut tanpa jeda.",
          },
          {
            tag: "ETIKA 3.3",
            text:
              "Jika kandidat gagal, sampaikan dengan tenang dan tetap hormat tanpa memancing debat.",
          },
        ],
      },
      {
        index: "04.",
        title: "LARANGAN DAN STANDAR",
        intro: "",
        mandatoryTitle: "WAJIB DILAKUKAN",
        mandatoryItems: [
          "Sapa dengan formal",
          "Jaga nada tetap tenang",
          "Tutup percakapan dengan jelas",
        ],
        failureTitle: "TIDAK BOLEH",
        failureItems: [
          "Memanggil kandidat dengan kata kasar atau bercanda berlebihan.",
          "Menggunakan huruf kapital penuh untuk menekan kandidat.",
          "Meninggalkan percakapan tanpa keputusan atau penutup.",
        ],
      },
    ],
  },
  {
    id: "sop-penggunaan-web",
    layout: "framework",
    accent: "rose",
    cardEyebrow: "SOP Sistem Web",
    cardSummary:
      "Panduan penggunaan dashboard pelatih pada web: pilih kandidat, buka sesi, kirim laporan, cancel sesi, dan eliminasi kandidat sesuai fungsi sistem.",
    badge: "WEB",
    documentTag: "SOP-WEB-REKRUT-791",
    serial: "SYNC REVISION APRIL 2026",
    title: "SOP PENGGUNAAN WEB PEREKRUTAN",
    description:
      "Dokumen ini menjelaskan alur penggunaan dashboard pelatih mulai dari pemilihan kandidat sampai hasil laporan. SOP ini juga menetapkan perbedaan fungsi antara cancel sesi dan eliminasi kandidat agar data tetap rapi dan tidak salah diproses.",
    referenceLabel: "Mode Sistem",
    referenceValue: "DASHBOARD PELATIH",
    overviewTitle: "Alur Sistem Utama",
    overviewDescription:
      "Gunakan dashboard untuk memilih kandidat, lalu buka pelatihan dengan petugas terkait. Seluruh laporan dibuat per kandidat di page pelatihan. Setelah lengkap, sesi dikirim ke Hasil Laporan sebagai histori. Jika sesi gagal, gunakan cancel sesi agar kandidat kembali ke dashboard. Jika kandidat harus dihapus permanen, gunakan eliminasi.",
    directives: [
      {
        label: "FLOW 01",
        text: '"Pilih kandidat -> Buka Pelatihan -> Laporkan tiap kandidat -> Kirimkan Laporan -> Masuk ke Hasil Laporan."',
      },
      {
        label: "FLOW 02",
        text: '"Jika sesi gagal, Cancel Sesi akan menghapus sesi aktif dan mengembalikan kandidat ke dashboard."',
      },
    ],
    fieldSpecs: [
      { label: "Dashboard", value: "Seleksi kandidat siap pelatihan" },
      { label: "Pelatihan", value: "Page sesi aktif dan pelaporan" },
      { label: "Hasil Laporan", value: "Histori sesi terkirim" },
      { label: "Laporan Perekrutan", value: "Review dan edit detail kandidat" },
    ],
    phases: [
      {
        index: "01",
        title: "Phase 1: Membuka Sesi",
        description:
          "Di dashboard, pilih kandidat sipil atau PMC yang tersedia. Tekan Buka Pelatihan, pilih satu atau beberapa petugas, lalu tetapkan golongan aktif untuk sesi baru.",
        bullets: ["Cek kandidat terpilih", "Pilih petugas dan golongan"],
      },
      {
        index: "02",
        title: "Phase 2: Input Laporan",
        description:
          "Di page pelatihan, buat laporan untuk tiap kandidat. Status kandidat akan berubah sesuai progres. Jika semua sudah lengkap, kirim sesi ke histori hasil laporan.",
        bullets: ["Laporkan tiap kandidat", "Finalisasi sebelum kirim"],
      },
      {
        index: "03",
        title: "Phase 3: Cancel atau Eliminasi",
        description:
          "Cancel Sesi dipakai bila operasi gagal atau dibatalkan. Seluruh laporan sesi yang belum dikirim akan dihapus dan kandidat kembali tersedia di dashboard. Eliminasi Kandidat dipakai untuk menghapus kandidat secara permanen dari data.",
        bullets: ["Cancel = kembali ke dashboard", "Eliminasi = hapus permanen"],
      },
    ],
    emergency: {
      title: "Protokol Salah Input",
      description:
        "Jika terjadi kesalahan sesi, jangan kirim laporan setengah jadi ke histori. Gunakan cancel sesi untuk memulihkan daftar kandidat. Gunakan eliminasi hanya bila kandidat memang tidak boleh diproses lagi dan datanya harus dihapus dari sistem.",
      code: "WEB-FAILSAFE-02",
    },
    footer: ["Revisi Dashboard April 2026", "Divisi Rekrutmen Paskus 791"],
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
          <div className={`grid h-16 w-16 place-items-center ${accent.bg}`}>
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

export default function SopPage() {
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
