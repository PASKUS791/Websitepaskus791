import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, ChevronDown, Zap, HeartPulse, Map, X } from "lucide-react";
import { useParams } from "react-router";
import "./Unit.css";
import { unitDetail } from "../constant";
import { Helmet } from "react-helmet-async";

// Konfigurasi Webhook
const WEBHOOK_CONFIG = {
  GENERAL: import.meta.env.VITE_WEBHOOK_GENERAL || "", // Pastikan environment variable ini ada
  UNITS: {
    "TORUK MAKTO": import.meta.env.VITE_WEBHOOK_TORUK_MAKTO || "",
    GATAM: import.meta.env.VITE_WEBHOOK_GATAM_SF || "",
    SIERRA: import.meta.env.VITE_WEBHOOK_SIERRA || "",
    BRINGAS: import.meta.env.VITE_WEBHOOK_BRINGAS || "",
    PATHFINDER: import.meta.env.VITE_WEBHOOK_PATHFINDER || "",
    SENTINEL: import.meta.env.VITE_WEBHOOK_SENTINEL || "",
  },
};

const Unit = () => {
  const { namaUnit } = useParams();
  const unit = unitDetail[0][namaUnit];

  // State untuk Modal dan Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Kirim Transmisi Data");
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  // Referensi Input Form
  const usernameRef = useRef(null);
  const discordRef = useRef(null);
  const unitRef = useRef(null);
  const reasonRef = useRef(null);

  const toggleModal = (state) => {
    setIsModalOpen(state);
    // Reset status pesan ketika modal ditutup/dibuka
    if (!state) setStatusMsg({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameRef.current?.value?.trim() ?? "";
    const discord = discordRef.current?.value?.trim() ?? "";
    const unitValue = unitRef.current?.value ?? "";
    const reason = reasonRef.current?.value?.trim() ?? "";

    if (!unitValue) {
      setStatusMsg({
        text: "EROR: HARAP PILIH DIVISI OPERASIONAL.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    setSubmitLabel("MENSTRANSMISI DATA...");
    setStatusMsg({ text: "", type: "" });

    const payload = {
      username: "PASKUS COMMAND CENTER",
      embeds: [
        {
          title: `📡 APLIKASI REKRUTMEN: ${unitValue}`,
          color: 14068535,
          fields: [
            { name: "👤 Callsign", value: `\`${username}\``, inline: true },
            { name: "🆔 Discord", value: `\`${discord}\``, inline: true },
            { name: "⚔️ Assignment", value: `**${unitValue}**`, inline: false },
            { name: "📝 Motivasi", value: reason, inline: false },
          ],
          footer: { text: "PASKUS-791 Automated Admission" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      // Kirim ke webhook general
      const promises = [];
      if (WEBHOOK_CONFIG.GENERAL) {
        promises.push(
          fetch(WEBHOOK_CONFIG.GENERAL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
      }

      // Kirim ke webhook spesifik unit
      const specificWebhook =
        WEBHOOK_CONFIG.UNITS[(unitValue || "").toUpperCase()];
      if (specificWebhook) {
        promises.push(
          fetch(specificWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
      }

      if (promises.length === 0) {
        throw new Error("Webhook URLs tidak terkonfigurasi.");
      }

      const results = await Promise.all(promises);
      const isSuccess = results.every((res) => res.ok);

      if (isSuccess) {
        setStatusMsg({
          text: `SUKSES: TRANSMISI DITERIMA OLEH MARKAS ${unitValue.toUpperCase()}`,
          type: "success",
        });

        // Reset form fields
        if (usernameRef.current) usernameRef.current.value = "";
        if (discordRef.current) discordRef.current.value = "";
        // Kita biarkan select unit tetap pada posisinya saat ini
        if (reasonRef.current) reasonRef.current.value = "";
      } else {
        throw new Error("Gagal mengirim ke salah satu/semua webhook.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        text: "GAGAL: GANGGUAN SINYAL TRANSMISI.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setSubmitLabel("Kirim Transmisi Data");
    }
  };

  const formatTitle = (text) => {
    if (!text) return { first: "", last: "", rest: "" };

    const words = text.split(" ");
    const firstWord = words[0];

    const first = firstWord.slice(0, -1);
    const last = firstWord.slice(-1);
    const rest = words.slice(1).join(" ");

    return { first, last, rest };
  };

  const { first, last, rest } = formatTitle(unit?.h1);

  const renderPhilosophy = (text, color) => {
    if (!text) return null;
    const words = text.toUpperCase().split(" ");

    return words.map((word, index) => {
      const isSecond = (index + 1) % 2 === 0;
      return (
        <span
          key={index}
          style={isSecond ? { color, fontStyle: "italic" } : {}}
        >
          {word + " "}
        </span>
      );
    });
  };

  // Fungsi untuk mendapatkan value otomatis berdasarkan URL Parameter
  const getAutoSelectValue = () => {
    if (!namaUnit) return "";

    // Konversi param (contoh: "toruk-makto" menjadi "TORUK MAKTO")
    const formattedParam = namaUnit.replace(/-/g, " ").toUpperCase();
    const validUnits = [
      "GATAM",
      "SENTINEL",
      "PATHFINDER",
      "BRINGAS",
      "SIERRA",
      "TORUK MAKTO",
    ];

    // Jika cocok dengan param URL
    if (validUnits.includes(formattedParam)) {
      return formattedParam;
    }

    // Fallback: Jika cocok dengan unit.h1
    if (unit?.h1 && validUnits.includes(unit.h1.toUpperCase())) {
      return unit.h1.toUpperCase();
    }

    return "";
  };

  if (!unit)
    return (
      <div className="text-white text-center mt-20">Unit tidak ditemukan</div>
    );

  return (
    <>
      <Helmet>
        <title>PASKUS 791 - {unit.h1}</title>
        <meta
          name="description"
          content={`Halaman rekrutmen resmi untuk unit ${unit.h1} di PASKUS-791.`}
        />
        <meta property="og:title" content={`PASKUS 791 - ${unit.h1}`} />
        <meta
          property="og:description"
          content={`Bergabunglah dengan unit ${unit.h1} sekarang.`}
        />
        <meta property="og:image" content="URL_GAMBAR_PREVIEW_ANDA" />
      </Helmet>

      <div className="body-nav relative min-h-screen">
        <section className="hero-section">
          {/* Circle merah blur */}
          <div
            className={`absolute w-100 h-100 rounded-full blur-3xl opacity-40`}
            style={{ backgroundColor: unit.color }}
          ></div>

          <div className="relative z-10 text-center px-6 ">
            <div
              className={`inline-block px-4 py-1 border  rounded-full mb-6 backdrop-blur-md`}
              style={{
                backgroundColor: `${unit.color}0D`, // 5% opacity
                borderColor: `${unit.color}4D`, // ~30% opacity
              }}
            >
              <span
                style={{ color: unit.color }}
                className="text-[10px] font-header tracking-[0.4em] uppercase"
              >
                Status: Operational
              </span>
            </div>

            <h1
              className="font-header text-6xl md:text-8xl font-black mb-4 tracking-tighter "
              id="hero-title"
            >
              {first?.toUpperCase()}
              <span style={{ color: unit.color }}>{last?.toUpperCase()}</span>
              {rest && " " + rest.toUpperCase()}
            </h1>

            <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base mb-10 leading-relaxed">
              {unit.deskripsi}
            </p>

            <div
              className="flex flex-col md:flex-row gap-4 justify-center items-center"
              id="hero-btns"
            >
              <button
                onClick={() => toggleModal(true)}
                style={{ backgroundColor: unit.color }}
                className="btn-pulse  px-10 py-4 font-header text-[10px] tracking-[0.2em] font-bold rounded-sm hover:brightness-110 transition-all"
              >
                MULAI MISI
              </button>
              <button className="px-10 py-4 font-header text-[10px] tracking-[0.2em] font-bold border border-white/20 hover:bg-white/5 transition-colors">
                OUR GALERI
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="text-gray-600" />
          </div>
        </section>

        {/* Visi Misi */}
        <section className="py-32 px-8 max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative scroll-reveal">
            <div
              className="absolute -left-4 top-0 w-1 h-20 "
              style={{ backgroundColor: unit.color }}
            ></div>
            <h3
              className="font-header  text-xs mb-4 tracking-widest"
              style={{ color: unit.color }}
            >
              PHILOSOPHY
            </h3>
            <h2 className="font-header text-4xl font-bold mb-8 leading-tight">
              {renderPhilosophy(unit.philosopiHeader, unit.color)}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              {unit.philosopiDeskripsi}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 scroll-reveal">
            <div className="bg-zinc-900/50 p-6 rounded border border-white/5 mt-8">
              <h4
                className="font-header text-2xl mb-2"
                style={{ color: unit.color }}
              >
                99%
              </h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Success Rate
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded border border-white/5">
              <h4
                className="font-header text-2xl mb-2"
                style={{ color: unit.color }}
              >
                05M
              </h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Avg Response
              </p>
            </div>
          </div>
        </section>

        {/* Grid Unit */}
        <section className="py-24 bg-zinc-950/50 px-8 relative overflow-hidden">
          <div className="scanline"></div>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="font-header text-3xl font-bold">
                  SPESIALISASI{" "}
                  <span
                    className=" text-xl block md:inline md:ml-2"
                    style={{ color: unit.color }}
                  >
                    {unit.special.judul}
                  </span>
                </h2>
              </div>
              <div
                style={{
                  borderColor: `${unit.color}0D`, // ~30% opacity
                }}
                className="text-[10px] font-header text-gray-600 tracking-widest border-b pb-2"
              >
                CATEGORIZED BY ROLE 791-A
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                className="unit-card p-8 group relative overflow-hidden"
                style={{ "--c": unit.color }}
              >
                <div
                  className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl 
    bg-(--c) opacity-10 
    group-hover:opacity-20 group-hover:scale-110 
    transition-all duration-300"
                ></div>
                <Zap className="mb-6 w-8 h-8 text-(--c)" />
                <h4 className="font-header text-sm mb-4 tracking-tighter">
                  {unit.special.card1Judul}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {unit.special.card1Des}
                </p>
              </div>

              <div
                className="unit-card p-8 group relative overflow-hidden"
                style={{ "--c": unit.color }}
              >
                <div
                  className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl 
    bg-(--c) opacity-10 
    group-hover:opacity-20 group-hover:scale-110 
    transition-all duration-300"
                ></div>
                <HeartPulse className="mb-6 w-8 h-8 text-(--c)" />
                <h4 className="font-header text-sm mb-4 tracking-tighter">
                  {unit.special.card2Judul}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {unit.special.card2Des}
                </p>
              </div>

              <div
                className="unit-card p-8 group relative overflow-hidden"
                style={{ "--c": unit.color }}
              >
                <div
                  className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl 
    bg-(--c) opacity-10 
    group-hover:opacity-20 group-hover:scale-110 
    transition-all duration-300"
                ></div>
                <Map className="mb-6 w-8 h-8 text-(--c)" />
                <h4 className="font-header text-sm mb-4 tracking-tighter">
                  {unit.special.card3Judul}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {unit.special.card3Des}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-32 text-center relative">
          <div className="morph-shape top-0 left-1/2 -translate-x-1/2 opacity-30"></div>
          <h2
            className="font-header text-3xl md:text-5xl mb-10 tracking-tighter "
            id="footer-text"
          >
            {unit.footer}
          </h2>

          <button
            onClick={() => toggleModal(true)}
            className="btn-pulse px-12 py-5 font-header text-xs tracking-widest font-bold rounded-sm shadow-2xl shadow-red-900/20 hover:brightness-110 transition-all"
            style={{ backgroundColor: unit.color }}
          >
            HUBUNGI KOMANDO
          </button>

          <div className="mt-20 flex flex-col items-center gap-6">
            <p className="text-[9px] text-gray-700 font-header tracking-[0.5em]">
              PASKUS 791 • {unit.h1?.toUpperCase()} • 2024
            </p>
          </div>
        </footer>

        {/* Modal Registrasi (Glassmorphism UI) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-3xl bg-[#0A0A0A]/90 border border-[#8A9A5B]/25 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden flex flex-col md:flex-row">
              {/* Tombol Close */}
              <button
                onClick={() => toggleModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Sidebar Modal */}
              <div className="hidden md:flex flex-col justify-between bg-linear-to-b from-[#8A9A5B]/10 to-transparent border-r border-[#8A9A5B]/15 p-10 w-1/3">
                <div>
                  <div className="inline-flex items-center px-3 py-1.5 bg-[#8A9A5B]/15 text-[#8A9A5B] text-[10px] font-bold tracking-[0.15em] rounded border border-[#8A9A5B]/25 mb-8">
                    <div className="w-2 h-2 bg-[#4ade80] rounded-full mr-2 shadow-[0_0_8px_#4ade80] animate-pulse"></div>
                    COMMS: SECURE
                  </div>
                  <div
                    className="w-12 h-0.5 mb-6"
                    style={{
                      backgroundColor: unit.color,
                      boxShadow: `0 0 10px ${unit.color}`,
                    }}
                  ></div>
                  <h2 className="font-header text-2xl text-white uppercase leading-tight tracking-wider">
                    Protokol <br />
                    <span
                      style={{
                        color: unit.color,
                      }}
                    >
                      Rekrutmen
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-4 leading-relaxed font-light">
                    Lengkapi parameter data operasional untuk proses integrasi
                    ke dalam struktur komando PASKUS-791.
                  </p>
                </div>
              </div>

              {/* Area Form Modal */}
              <div className="flex-1 p-8 md:p-10 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9A5B] mb-2 font-header">
                        Callsign / Nama
                      </label>
                      <input
                        type="text"
                        ref={usernameRef}
                        placeholder="Callsign"
                        required
                        className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9A5B] mb-2 font-header">
                        Identitas Discord
                      </label>
                      <input
                        type="text"
                        ref={discordRef}
                        placeholder="user#0000"
                        required
                        className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9A5B] mb-2 font-header">
                      Divisi Operasional
                    </label>
                    <select
                      ref={unitRef}
                      required
                      defaultValue={getAutoSelectValue()}
                      className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <option value="" disabled className="bg-[#0A0A0A]">
                        Pilih Divisi Operasional...
                      </option>
                      <option value="GATAM" className="bg-[#0A0A0A]">
                        GATAM (Infiltrasi Khusus)
                      </option>
                      <option value="SENTINEL" className="bg-[#0A0A0A]">
                        SENTINEL (Pertahanan Berat)
                      </option>
                      <option value="PATHFINDER" className="bg-[#0A0A0A]">
                        PATHFINDER (Pengintai Taktis)
                      </option>
                      <option value="BRINGAS" className="bg-[#0A0A0A]">
                        BRINGAS (Penyerbu Jarak Dekat)
                      </option>
                      <option value="SIERRA" className="bg-[#0A0A0A]">
                        SIERRA (Gerak Cepat & Serangan Sigap)
                      </option>
                      <option value="TORUK MAKTO" className="bg-[#0A0A0A]">
                        TORUK MAKTO (Sayap Udara)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9A5B] mb-2 font-header">
                      Alasan & Motivasi Taktis
                    </label>
                    <textarea
                      ref={reasonRef}
                      rows="4"
                      placeholder="Deskripsikan kontribusi strategis Anda..."
                      required
                      className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all resize-none shadow-inner"
                    ></textarea>
                  </div>

                  {statusMsg.text && (
                    <div
                      className={`p-4 rounded-md text-xs font-header border bg-black/50 ${statusMsg.type === "success" ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"}`}
                    >
                      {statusMsg.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ "--c": unit.color }}
                    className="
    w-full 
    text-black 
    font-header font-bold uppercase tracking-[0.25em] 
    py-5 px-4 text-xs rounded-md mt-4 
    bg-(--c) 
    hover:bg-white 
    hover:shadow-[0_0_30px_var(--c)] 
    transition-all transform hover:-translate-y-1 
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:translate-y-0 
    disabled:hover:bg-(--c) 
    disabled:hover:shadow-none
  "
                  >
                    {submitLabel}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Unit;
