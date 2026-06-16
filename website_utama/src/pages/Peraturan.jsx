import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Shield, ChevronDown, Check, AlertTriangle, AlertCircle, Scale, Milestone, UserCheck } from "lucide-react";

const Peraturan = () => {
  const [openBlocks, setOpenBlocks] = useState({
    "pasal-1": true, // start with Pasal 1 open
  });

  const toggleBlock = (id) => {
    setOpenBlocks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToBlock = (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    // Expand if closed
    setOpenBlocks((prev) => ({
      ...prev,
      [id]: true,
    }));

    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>Regulasi Resmi PASKUS-791 | Peraturan Kesatuan So-791</title>
        <meta
          name="description"
          content="Regulasi resmi dan peraturan kesatuan PASKUS-791 So-791 — pedoman disiplin, etika, tata kehidupan, dan keamanan server."
        />
      </Helmet>

      {/* Page background */}
      <div className="page-bg fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#030504] via-[#060a07] to-[#040705]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Hero Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-[10px] tracking-widest font-bold uppercase mb-4 heading-font">
            Dokumen Resmi · So-791
          </div>
          <h1 className="text-3xl md:text-5xl font-black heading-font text-white uppercase tracking-wider mb-4 leading-tight">
            Regulasi Resmi <br />
            <span className="text-[#d4af37]">Kesatuan PASKUS-791</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
            Dengan rahmat Tuhan dan semangat jiwa korps, peraturan ini ditetapkan sebagai pedoman disiplin, etika, serta tata kehidupan seluruh prajurit di lingkungan komunitas Roleplay PASKUS-791.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              11 Pasal Utama
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Berlaku Aktif
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              DPDM So-791
            </span>
          </div>
        </header>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent my-10" />

        {/* Table of Contents */}
        <nav className="border border-[#d4af37]/20 rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl p-6 mb-12 shadow-xl" aria-label="Daftar pasal">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#d4af37] uppercase border-b border-[#d4af37]/25 pb-3 mb-4 heading-font">
            Daftar Pasal
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: "pasal-1", label: "Hubungan & Perilaku", num: "1" },
              { id: "pasal-2", label: "Aturan Roleplay", num: "2" },
              { id: "pasal-3", label: "Identitas & Konten", num: "3" },
              { id: "pasal-4", label: "Keamanan & Privasi", num: "4" },
              { id: "pasal-5", label: "Pelecehan & Batas", num: "5" },
              { id: "pasal-6", label: "Loyalitas Kesatuan", num: "6" },
              { id: "pasal-7", label: "Penyalahgunaan Jabatan", num: "7" },
              { id: "pasal-8", label: "Pencemaran Nama Baik", num: "8" },
              { id: "pasal-9", label: "Pemalsuan Identitas", num: "9" },
              { id: "pasal-10", label: "Klasifikasi & Sanksi", num: "10" },
              { id: "pasal-11", label: "Jiwa Korps", num: "11" },
              { id: "security", label: "Security Mabes", num: "🛡" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToBlock(item.id)}
                className="flex items-center gap-3 p-2 rounded-lg border border-transparent text-left hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 text-gray-300 hover:text-[#d4af37] transition text-xs font-semibold"
              >
                <span className="w-6 h-6 rounded bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#EFBF04] font-black heading-font text-[10px] flex items-center justify-center shrink-0">
                  {item.num}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Accordions */}
        <div className="space-y-6">
          {/* Pasal 1 */}
          <div id="pasal-1" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-1"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-1")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  1
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Hubungan &amp; Perilaku Antar Prajurit
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Rasa hormat · Komunikasi · Anti diskriminasi
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-1"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-1"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4">
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    <span className="w-1 h-3 bg-[#d4af37] rounded" />
                    Pasal 1.1 — Rasa Hormat &amp; Sikap
                  </h3>
                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Wajib menghormati seluruh prajurit, perwira, komandan, dan tamu.</li>
                    <li>Dilarang menghina, merendahkan, memancing konflik, atau mengganggu anggota lain.</li>
                    <li>Junjung tinggi etika, sopan santun, dan profesionalisme.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    <span className="w-1 h-3 bg-[#d4af37] rounded" />
                    Pasal 1.2 — Etika Komunikasi
                  </h3>
                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Gunakan bahasa sopan dan tidak provokatif.</li>
                    <li>Hindari spam, flood, OOC berlebihan, atau penggunaan huruf kapital terus-menerus.</li>
                    <li>Jaga nama baik komunitas di dalam maupun di luar server.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    <span className="w-1 h-3 bg-[#d4af37] rounded" />
                    Pasal 1.3 — Anti Diskriminasi
                  </h3>
                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Dilarang keras konten SARA, ujaran kebencian, rasisme, atau diskriminasi dalam bentuk apa pun.</li>
                    <li>Politik ekstrem dan provokasi sosial tidak diperbolehkan.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Pasal 2 */}
          <div id="pasal-2" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-2"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-2")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  2
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Aturan Roleplay Militer
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Lore · Powergaming · Koordinasi · Dinas ganda
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-2"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-2"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4">
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    <span className="w-1 h-3 bg-[#d4af37] rounded" />
                    Pasal 2.1 — Kepatuhan Lore &amp; Struktur
                  </h3>
                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Wajib mengikuti lore, struktur militer, dan alur cerita PASKUS-791 RP.</li>
                    <li>Hormati sistem pangkat dan rantai komando dalam konteks roleplay.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    <span className="w-1 h-3 bg-[#d4af37] rounded" />
                    Pasal 2.2 — Larangan Penyalahgunaan RP
                  </h3>
                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Dilarang <strong>Powergaming</strong> — memaksakan hasil yang menguntungkan diri sendiri secara tidak wajar.</li>
                    <li>Dilarang <strong>Metagaming</strong> — menggunakan informasi OOC dalam konteks IC.</li>
                    <li>Dilarang merusak alur cerita secara sengaja (<strong>Fail RP</strong>).</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    <span className="w-1 h-3 bg-[#d4af37] rounded" />
                    Pasal 2.3 — Koordinasi Skenario
                  </h3>
                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Event besar wajib melalui izin atau pengawasan Moderator / Komando Pengawas (Perwira).</li>
                    <li>Utamakan kerja sama dalam membangun cerita.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    <span className="w-1 h-3 bg-[#d4af37] rounded" />
                    Pasal 2.4 — Larangan Dinas Ganda
                  </h3>
                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Prajurit dilarang merangkap dua peran utama sekaligus dalam satu waktu aktif RP (tempur &amp; non-tempur).</li>
                    <li>Dinas tempur mencakup unit operasional lapangan (Gatam, Sierra, Sentinel, Komodo, dll).</li>
                    <li>Dinas non-tempur mencakup unit pendukung (DPDM, Staff, Pelatih, dll).</li>
                    <li>Setiap prajurit wajib memilih dan berfokus pada satu jalur dinas untuk menjaga keseimbangan roleplay.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Pasal 3 */}
          <div id="pasal-3" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-3"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-3")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  3
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Identitas &amp; Konten
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Karakter · Media · Promosi
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-3"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-3"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p><strong>Pasal 3.1</strong> — Gunakan identitas karakter secara konsisten. Dilarang mengganti identitas demi keuntungan tidak adil.</p>
                <p><strong>Pasal 3.2</strong> — Konten media harus sesuai tema militer/RP atau hiburan sehat. Pornografi dilarang keras.</p>
                <p><strong>Pasal 3.3</strong> — Dilarang promosi server lain atau iklan tanpa izin resmi.</p>
              </div>
            )}
          </div>

          {/* Pasal 4 */}
          <div id="pasal-4" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-4"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-4")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  4
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Keamanan &amp; Privasi
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Data pribadi · Wewenang pengawas
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-4"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-4"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p><strong>Pasal 4.1</strong> — Dilarang membagikan data pribadi anggota lain tanpa persetujuan. Jangan memaksa anggota membuka identitas pribadi.</p>
                <p><strong>Pasal 4.2</strong> — Moderator adalah Komandan Pengawas dengan wewenang menjaga ketertiban. Keputusan moderator bersifat mengikat.</p>
              </div>
            )}
          </div>

          {/* Pasal 5 */}
          <div id="pasal-5" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-5"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-5")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  5
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Pelecehan &amp; Batas Interaksi
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Pelecehan seksual · Batas personal · Pelaporan
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-5"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-5"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p><strong>Pasal 5.1</strong> — Dilarang segala bentuk pelecehan seksual, termasuk komentar, candaan, isyarat seksual, permintaan konten intim, serta pengiriman media berunsur seksual.</p>
                <p><strong>Pasal 5.2</strong> — Interaksi personal dalam RP wajib berdasarkan consent kedua pihak. Jika satu pihak tidak nyaman, interaksi harus segera dihentikan.</p>
                <p><strong>Pasal 5.3</strong> — Korban atau saksi dapat melapor ke DPDM. Identitas pelapor dirahasiakan.</p>
              </div>
            )}
          </div>

          {/* Pasal 6 */}
          <div id="pasal-6" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-6"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-6")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  6
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Loyalitas Kesatuan &amp; Dualisme
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Larangan dualisme · Konflik kepentingan · Pengecualian
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-6"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-6"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p><strong>Pasal 6.1</strong> — Anggota aktif dilarang bergabung di komunitas RP militer lain dengan tema serupa tanpa izin resmi.</p>
                <p><strong>Pasal 6.2</strong> — Dilarang membawa konflik, sistem, atau lore komunitas lain ke server ini.</p>
                <p><strong>Pasal 6.3</strong> — Keanggotaan ganda hanya bisa dengan persetujuan Komando Pengawas (Perwira).</p>
                <p><strong>Pasal 6.4</strong> — Drama lintas server atau rekrutmen anggota ke komunitas lain akan dikenakan sanksi berat.</p>
              </div>
            )}
          </div>

          {/* Pasal 7 */}
          <div id="pasal-7" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-7"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-7")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  7
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Penyalahgunaan Wewenang &amp; Jabatan
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Pangkat · Staff · Manipulasi sistem
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-7"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-7"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p><strong>Pasal 7.1</strong> — Dilarang menggunakan pangkat atau jabatan untuk menekan atau mengintimidasi di luar konteks RP yang wajar.</p>
                <p><strong>Pasal 7.2</strong> — Moderator dilarang bertindak sewenang-wenang atau pilih kasih dalam penegakan aturan.</p>
                <p><strong>Pasal 7.3</strong> — Dilarang memanipulasi celah aturan demi keuntungan pribadi.</p>
              </div>
            )}
          </div>

          {/* Pasal 8 */}
          <div id="pasal-8" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-8"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-8")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  8
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Pencemaran Nama Baik &amp; Provokasi
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Fitnah · Menjatuhkan komunitas · Adu domba
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-8"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-8"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p><strong>Pasal 8.1</strong> — Dilarang menyebarkan tuduhan palsu, gosip tanpa bukti, atau fitnah.</p>
                <p><strong>Pasal 8.2</strong> — Dilarang menjelekkan resimen PASKUS di dalam maupun di luar komunitas.</p>
                <p><strong>Pasal 8.3</strong> — Dilarang memecah belah anggota atau membawa drama luar ke dalam server.</p>
              </div>
            )}
          </div>

          {/* Pasal 9 */}
          <div id="pasal-9" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-9"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-9")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  9
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Pemalsuan Identitas
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Menyamar · Atribut resmi · Manipulasi RP
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-9"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-9"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p><strong>Pasal 9.1</strong> — Dilarang keras menyamar sebagai anggota atau staff lain.</p>
                <p><strong>Pasal 9.2</strong> — Penggunaan logo, pangkat, atau simbol resmi tanpa izin tertulis dilarang.</p>
                <p><strong>Pasal 9.3</strong> — Dilarang memakai identitas palsu untuk manipulasi roleplay.</p>
              </div>
            )}
          </div>

          {/* Pasal 10 */}
          <div id="pasal-10" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-10"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-10")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  10
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Klasifikasi Pelanggaran &amp; Sanksi Disiplin
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Ringan · Sedang · Berat · Akumulasi · Kewenangan
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-10"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-10"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    Pasal 10.1 — Pelanggaran Ringan
                  </h3>
                  <p className="mb-2">Spam, flood, huruf kapital berlebihan, minor Fail RP.</p>
                  <div className="pl-4 border-l border-yellow-500 text-[11px] text-yellow-500 mb-4 uppercase font-bold tracking-wider">
                    Sanksi: Teguran lisan / SP 1.
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    Pasal 10.2 — Pelanggaran Sedang
                  </h3>
                  <p className="mb-2">Menghina anggota lain, toxic di chat, Powergaming/Metagaming sedang, promosi tanpa izin.</p>
                  <div className="pl-4 border-l border-orange-500 text-[11px] text-orange-500 mb-4 uppercase font-bold tracking-wider">
                    Sanksi: SP 2 / Degradasi Pangkat / Skorsing Sementara.
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2 mb-2 heading-font">
                    Pasal 10.3 — Pelanggaran Berat
                  </h3>
                  <p className="mb-2">Pelecehan seksual, rasisme/SARA, dualisme kesatuan, pembocoran data pribadi (doxxing), fitnah serius.</p>
                  <div className="pl-4 border-l border-red-500 text-[11px] text-red-500 mb-4 uppercase font-bold tracking-wider">
                    Sanksi: Pemecatan dari kesatuan / Banned Permanen.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pasal 11 */}
          <div id="pasal-11" className={`border rounded-2xl bg-[#0c100d]/80 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${openBlocks["pasal-11"] ? "border-[#d4af37]/35" : "border-white/10"}`}>
            <button
              onClick={() => toggleBlock("pasal-11")}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-base">
                  11
                </span>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                    Jiwa Korps &amp; Kekeluargaan
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    Sportivitas · Kekompakan · Rasa hormat
                  </p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${openBlocks["pasal-11"] ? "rotate-180 text-[#d4af37]" : ""}`} />
            </button>
            {openBlocks["pasal-11"] && (
              <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs text-gray-300">
                <p>Kita adalah satu kesatuan yang saling mendukung. Junjung tinggi sportivitas, kekompakan, dan rasa hormat antar sesama prajurit. <strong>Tidak ada prajurit yang ditinggalkan.</strong></p>
              </div>
            )}
          </div>

          {/* Security Mabes */}
          <div id="security" className="border border-red-500/30 rounded-2xl bg-gradient-to-br from-red-950/10 to-[#0c100d]/95 backdrop-blur-xl shadow-lg overflow-hidden">
            <div className="flex items-center gap-4 p-5 border-b border-red-500/25 bg-red-950/15">
              <span className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 font-black heading-font text-lg">
                🛡
              </span>
              <div>
                <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider heading-font">
                  Peraturan Mabes
                </h2>
                <p className="text-[10px] text-red-400/80 font-bold uppercase tracking-wider mt-0.5">
                  Keamanan Chat, Media, Link &amp; File · PASKUS791
                </p>
              </div>
            </div>
            <div className="p-5 space-y-4 text-xs text-gray-300 leading-relaxed">
              <div className="p-3 rounded-lg bg-white/5 border-l-2 border-red-500 text-gray-300">
                Ruang Mabes dipantau oleh <strong>Security SO-791</strong>. Setiap pesan, media, link, dan file yang melanggar ketentuan akan dihapus secara otomatis demi menjaga kehormatan server.
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 heading-font">
                  ⛔ Dilarang di Mabes
                </h3>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Hate speech / ujaran kebencian, pelecehan, rasisme/SARA.</li>
                  <li>Link mencurigakan, phishing, giveaway palsu, scam crypto.</li>
                  <li>File berekstensi berbahaya (malware, script, virus).</li>
                  <li>Spam, flood, mention berlebihan.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Closing & Moto */}
        <div className="mt-16 border border-[#d4af37]/20 rounded-2xl bg-[#0c100d]/80 p-8 text-center relative overflow-hidden shadow-xl">
          <h3 className="heading-font text-xs text-gray-400 uppercase tracking-widest mb-4">
            Kata Penutup
          </h3>
          <p className="text-gray-300 text-xs leading-relaxed max-w-xl mx-auto mb-8">
            Regulasi ini dibuat demi menjaga kehormatan, kedisiplinan, dan keamanan seluruh prajurit dalam komunitas. Dengan menaati peraturan ini, kita membangun lingkungan roleplay militer yang solid, profesional, dan penuh jiwa korps.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="p-4 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20 w-44">
              <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Moto Komunitas</span>
              <span className="text-xs font-black text-[#EFBF04] uppercase tracking-wide heading-font">"Jangan Ada yang Tertinggal"</span>
            </div>
            <div className="p-4 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20 w-44">
              <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Moto Resimen</span>
              <span className="text-xs font-black text-[#EFBF04] uppercase tracking-wide heading-font">Silere Impetum</span>
              <span className="block text-[9px] text-gray-400 italic mt-0.5">Serang Senyap</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center py-6 border-t border-white/5 text-[10px] tracking-wider uppercase text-gray-400">
        <Link to="/" className="hover:text-white transition">PASKUS Gi1</Link> &nbsp;·&nbsp; So-791 &nbsp;·&nbsp; <Link to="/peraturan" className="hover:text-white transition">Regulasi Resmi</Link> &nbsp;·&nbsp; <a href={PASKUS_DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-white transition">Discord</a>
      </footer>
    </>
  );
};

export default Peraturan;
