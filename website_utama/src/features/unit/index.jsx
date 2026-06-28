import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { ChevronDown, Zap, HeartPulse, Map, X, Users, Play, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { UNIT_DETAIL_MAP } from "@/data/unitDetail.js";
import { getImageUrl, getVideoUrl } from "@/utils/assets";
import "@/styles/Unit.css";

const WEBHOOK_CONFIG = {
  GENERAL: import.meta.env.VITE_WEBHOOK_GENERAL || "",
  UNITS: {
    "TORUK MAKTO": import.meta.env.VITE_WEBHOOK_TORUK_MAKTO || "",
    GATAM: import.meta.env.VITE_WEBHOOK_GATAM_SF || "",
    SIERRA: import.meta.env.VITE_WEBHOOK_SIERRA || "",
    BRINGAS: import.meta.env.VITE_WEBHOOK_BRINGAS || "",
    PATHFINDER: import.meta.env.VITE_WEBHOOK_PATHFINDER || "",
    SENTINEL: import.meta.env.VITE_WEBHOOK_SENTINEL || "",
  },
};

const UNIT_MEDIA = {
  gatam: {
    video: getVideoUrl("aang-highlight-v2.mp4"),
    poster: getImageUrl("aang-highlight-poster-v2.jpg"),
  },
  bringas: {
    video: getVideoUrl("4hn-highlight-v1.mp4"),
    poster: getImageUrl("4hn-highlight-poster-v1.jpg"),
  },
  sierra: {
    video: getVideoUrl("sierra-highlight-v1.mp4"),
    poster: getImageUrl("sierra-highlight-poster-v1.jpg"),
  },
  pathfinder: {
    video: getVideoUrl("gi1-highlight-v1.mp4"),
    poster: getImageUrl("gi1-highlight-poster-v1.jpg"),
  },
  sentinel: {
    video: getVideoUrl("sentinel-highlight-v1.mp4"),
    poster: getImageUrl("sentinel-highlight-poster-v1.jpg"),
  },
  "toruk-makto": {
    video: getVideoUrl("toruk-highlight-v1.mp4"),
    poster: getImageUrl("toruk-highlight-poster-v1.jpg"),
  },
  komodo: {
    video: getVideoUrl("gi1-highlight-v2.mp4"),
    poster: getImageUrl("gi1-highlight-poster-v2.jpg"),
  },
};

// Fallback array dikosongkan agar data tampil dari bot secara dinamis.
const UNIT_FALLBACK_MEMBERS = {};

const UnitFeature = () => {
  const { namaUnit } = useParams();
  const rawKey = (namaUnit || "").toLowerCase();
  const unitNameKey = rawKey === "toruk" ? "toruk-makto" : rawKey;
  const unit = UNIT_DETAIL_MAP[unitNameKey];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Kirim Transmisi Data");
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const [membersData, setMembersData] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const usernameRef = useRef(null);
  const discordRef = useRef(null);
  const unitRef = useRef(null);
  const reasonRef = useRef(null);

  useEffect(() => {
    if (!unit) return;
    setLoadingMembers(true);
    const fetchUrl = `/api/structure.php?t=${Date.now()}`;

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.text();
      })
      .then((text) => {
        const t = text.trim();
        if (!t.startsWith("{") && !t.startsWith("[")) throw new Error("Not JSON");
        return JSON.parse(t);
      })
      .catch(() => {
        return fetch("/api/structure.json")
          .then((r) => {
            if (!r.ok) throw new Error("HTTP JSON");
            return r.text();
          })
          .then((text) => {
            const t = text.trim();
            if (!t.startsWith("{") && !t.startsWith("[")) throw new Error("Not JSON");
            return JSON.parse(t);
          })
          .catch(() => null);
      })
      .then((payload) => {
        if (payload?.ok) {
          const apiSlug = unitNameKey === "toruk-makto" ? "toruk" : unitNameKey;
          const combatUnits = payload.combat_units || payload.units || {};
          const unitData = combatUnits[apiSlug];
          if (unitData && Array.isArray(unitData.members) && unitData.members.length > 0) {
            setMembersData(unitData.members);
          } else {
            setMembersData([]);
          }
        } else {
          setMembersData([]);
        }
      })
      .catch(() => {
        setMembersData([]);
      })
      .finally(() => {
        setLoadingMembers(false);
      });
  }, [unitNameKey, unit]);

  const toggleModal = (state) => {
    setIsModalOpen(state);
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

      const specificWebhook = WEBHOOK_CONFIG.UNITS[(unitValue || "").toUpperCase()];
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

        if (usernameRef.current) usernameRef.current.value = "";
        if (discordRef.current) discordRef.current.value = "";
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

  const { first, last, rest } = formatTitle(unit?.h1 || "");

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

  const getAutoSelectValue = () => {
    if (!unitNameKey) return "";
    const keyUpper = unitNameKey.replace(/-/g, " ").toUpperCase();
    return keyUpper;
  };

  if (!unit) {
    return (
      <div className="text-white text-center mt-20 font-header">Unit tidak ditemukan</div>
    );
  }

  const media = UNIT_MEDIA[unitNameKey];

  return (
    <>
      <Helmet>
        <title>PASKUS 791 - {unit.h1}</title>
        <meta
          name="description"
          content={`Halaman rekrutmen resmi untuk unit ${unit.h1} di PASKUS-791.`}
        />
      </Helmet>

      {/* Page background */}
      <div className="page-bg fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#030504] via-[#060a07] to-[#040705]">
        <div className="absolute inset-0 opacity-10 page-bg-grid" />
      </div>

      <Navbar />

      <div className="relative z-10 min-h-screen pt-24">
        <section className="min-h-[85vh] flex flex-col justify-center items-center relative overflow-hidden py-16">
          {/* Circular colored blur background */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: unit.color }}
          ></div>

          <div className="relative z-10 text-center px-6">
            <div
              className="inline-block px-4 py-1 border rounded-full mb-6 backdrop-blur-md"
              style={{
                backgroundColor: `${unit.color}0D`,
                borderColor: `${unit.color}4D`,
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
              className="font-header text-6xl md:text-8xl font-black mb-4 tracking-tighter"
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
                className="btn-pulse px-10 py-4 font-header text-[10px] tracking-[0.2em] font-bold rounded-sm hover:brightness-110 transition-all text-black cursor-pointer"
              >
                MULAI MISI
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("highlights-footage");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-10 py-4 font-header text-[10px] tracking-[0.2em] font-bold border border-white/20 hover:bg-white/5 transition-colors cursor-pointer text-white"
              >
                OUR GALERI
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="text-gray-600" />
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 px-8 max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center border-t border-white/5">
          <div className="relative scroll-reveal">
            <div
              className="absolute -left-4 top-0 w-1 h-20"
              style={{ backgroundColor: unit.color }}
            ></div>
            <h3
              className="font-header text-xs mb-4 tracking-widest"
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

        {/* Highlight Video Section */}
        {media && media.video && (
          <section id="highlights-footage" className="py-24 max-w-6xl mx-auto px-6 border-t border-white/5 scroll-reveal">
            <div className="mb-12 text-center">
              <h2 className="font-header text-3xl font-bold mb-2 uppercase tracking-wider">
                Operational <span style={{ color: unit.color }}>Highlights</span>
              </h2>
              <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-mono">
                // Live Operational Highlights & Tactical Footage
              </p>
            </div>

            <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-4xl mx-auto">
              <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-[#EFBF04] tracking-widest bg-black/50 px-2.5 py-1 border border-[#EFBF04]/20 rounded uppercase">
                REC • SIGNAL LIVE • 1080P
              </div>
              <div className="absolute top-4 right-4 z-10 font-mono text-[9px] text-white/60 tracking-widest bg-black/50 px-2.5 py-1 border border-white/10 rounded uppercase">
                STATUS: ENCRYPTED
              </div>
              <div className="absolute bottom-4 left-4 z-10 font-mono text-[9px] text-white/40 tracking-widest hidden sm:block">
                SYS_RECON_791A_LOC_SECURE
              </div>

              <video
                className="w-full h-auto aspect-video object-cover"
                controls
                preload="metadata"
                poster={media.poster}
                muted
                loop
                playsInline
                aria-label={`Highlight Video untuk ${unit.h1}`}
              >
                <source src={media.video} type="video/mp4" />
                Browser Anda tidak mendukung pemutar video HTML5.
              </video>
            </div>
          </section>
        )}

        {/* Specialization Details Grid */}
        <section className="py-24 bg-zinc-950/50 px-8 relative overflow-hidden border-t border-white/5">
          <div className="scanline"></div>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="font-header text-3xl font-bold">
                  SPESIALISASI{" "}
                  <span
                    className="text-xl block md:inline md:ml-2"
                    style={{ color: unit.color }}
                  >
                    {unit.special.judul}
                  </span>
                </h2>
              </div>
              <div
                style={{
                  borderColor: `${unit.color}0D`,
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
                <p className="text-xs text-gray-500 leading-relaxed text-justify">
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
                <p className="text-xs text-gray-500 leading-relaxed text-justify">
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
                <p className="text-xs text-gray-500 leading-relaxed text-justify">
                  {unit.special.card3Des}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Active Personnel Section */}
        <section className="py-24 border-t border-white/5 bg-zinc-950/20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="font-header text-3xl font-bold mb-2 uppercase tracking-wider">
                Jajaran <span style={{ color: unit.color }}>Personel Aktif</span>
              </h2>
              <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-mono">
                // Real-time Discord Synced Roster
              </p>
            </div>

            {loadingMembers ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${unit.color} transparent ${unit.color} ${unit.color}` }}></div>
                <div className="font-mono text-xs tracking-widest uppercase animate-pulse" style={{ color: unit.color }}>
                  Scanning Command Network...
                </div>
              </div>
            ) : membersData.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {membersData.map((member, idx) => {
                  const name = typeof member === "string" ? member : member.name || "";
                  const rank = typeof member === "string" ? "" : member.rank || "";
                  return (
                    <div 
                      key={idx} 
                      className="relative p-6 rounded-lg border bg-zinc-900/30 backdrop-blur-sm transition-all hover:border-(--c) group overflow-hidden"
                      style={{ 
                        borderColor: "rgba(255, 255, 255, 0.05)",
                        "--c": unit.color 
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-(--c) transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      
                      <div className="font-mono text-[9px] text-gray-500 uppercase tracking-wider mb-2">
                        {rank || "OPERATOR"}
                      </div>
                      <div className="font-header text-sm text-white font-semibold tracking-wide truncate group-hover:text-(--c) transition-colors">
                        {name}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-gray-600">
                        <span>PASKUS ACTIVE</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-zinc-900/10">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="font-header text-sm text-white font-semibold mb-2">
                  DATA PERSONEL RAHASIA / KOSONG
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Tidak ada data personel aktif yang tersinkronisasi untuk divisi ini saat ini. Hubungi Komando Pusat untuk otorisasi akses.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="py-32 text-center relative border-t border-white/5">
          <div className="morph-shape top-0 left-1/2 -translate-x-1/2 opacity-30"></div>
          <h2
            className="font-header text-3xl md:text-5xl mb-10 tracking-tighter text-white"
            id="footer-text"
          >
            {unit.footer || "SIAP BERGABUNG DENGAN OPERASI?"}
          </h2>

          <button
            onClick={() => toggleModal(true)}
            className="btn-pulse px-12 py-5 font-header text-xs tracking-widest font-bold rounded-sm shadow-2xl hover:brightness-110 transition-all text-black cursor-pointer"
            style={{ backgroundColor: unit.color }}
          >
            HUBUNGI KOMANDO
          </button>
        </div>

        {/* Modal Admission (Glassmorphism Form) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-3xl bg-[#0A0A0A]/90 border border-[#8A9A5B]/25 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden flex flex-col md:flex-row">
              <button
                onClick={() => toggleModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Modal Left Sidebar */}
              <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-[#8A9A5B]/10 to-transparent border-r border-[#8A9A5B]/15 p-10 w-1/3">
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
                    <span style={{ color: unit.color }}>Rekrutmen</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-4 leading-relaxed font-light font-sans">
                    Lengkapi parameter data operasional untuk proses integrasi ke dalam struktur komando PASKUS-791.
                  </p>
                </div>
              </div>

              {/* Modal Form Area */}
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
                        className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all shadow-inner font-sans"
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
                        className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all shadow-inner font-sans"
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
                      className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer font-sans"
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
                      rows={4}
                      placeholder="Deskripsikan kontribusi strategis Anda..."
                      required
                      className="w-full bg-white/5 border border-[#8A9A5B]/30 text-white p-4 text-sm rounded-md focus:border-[#D4AF37] focus:bg-white/10 outline-none transition-all resize-none shadow-inner font-sans"
                    ></textarea>
                  </div>

                  {statusMsg.text && (
                    <div
                      className={`p-4 rounded-md text-xs font-header border bg-black/50 ${
                        statusMsg.type === "success"
                          ? "border-green-500/50 text-green-400"
                          : "border-red-500/50 text-red-400"
                      }`}
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
      <Footer />
    </>
  );
};

export default UnitFeature;
