/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Pengambilan Pin Page
 * Purpose: Menu pengambilan Pin Wingman dan Pin Latpur dengan penilaian fase SOP & auto-sertijab.
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPinSessions,
  createPinSession,
  addPinReport,
  dispatchPinSession,
  getVoiceRoster,
} from "../../lib/staffApi";

const PIN_TYPE_LABELS = {
  wingman: "Pin Wingman",
  latpur: "Pin Latpur",
};

const WINGMAN_PHASES = [
  { phase: 1, name: "Baris & Formasi Heli sebelum Masuk", desc: "Baris sesuai tugas sebelum masuk helikopter & duduk sesuai formasi" },
  { phase: 2, name: "Pemahaman Sandi Lampu (Putih, Merah, Hijau)", desc: "Hafal arti lampu putih, merah, dan hijau dalam operasi penerjunan" },
  { phase: 3, name: "Ketepatan Ketinggian Drop (2500m – 3000m)", desc: "Minimal ketinggian keluar adalah 2500m, optimal hingga 3000m" },
  { phase: 4, name: "Buka Parasut 100m & Akurasi Terjun", desc: "Membuka parasut di ketinggian 100m dari tanah dengan akurasi terjun yang tepat" },
  { phase: 5, name: "Kedisiplinan Aba-Aba dari Ketinggian", desc: "Kepatuhan terhadap aba-aba instruktur selama penerjunan dari ketinggian" },
];

const LATPUR_PHASES = [
  { phase: 1, name: "Latihan Fisik (Obby)", desc: "Hafal C/X & penyelesaian rintangan obby" },
  { phase: 2, name: "Latihan Tembak (Recoil Control)", desc: "Kontrol recoil senjata di full auto" },
  { phase: 3, name: "Latihan Grenade", desc: "Akurasi lemparan granat (min. 3/4 masuk)" },
  { phase: 4, name: "Reaction Time Test", desc: "Pencatatan waktu reaksi & civilian penalty" },
  { phase: 5, name: "Doper Drill", desc: "Ketahanan mental tiarap & merangkak lurus" },
];

const SOP_PHASES_MAP = {
  wingman: WINGMAN_PHASES,
  latpur: LATPUR_PHASES,
};

export default function PengambilanPinPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [voiceData, setVoiceData] = useState(null);
  const [selectedVoiceMembers, setSelectedVoiceMembers] = useState([]);
  const [newPinType, setNewPinType] = useState("wingman");

  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "Saving...", "Saved", or error
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch session history
  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await getPinSessions();
      setSessions(data || []);
      // If there's an active session in local state, refresh it
      if (activeSession) {
        const fresh = (data || []).find((s) => s._id === activeSession._id);
        if (fresh) {
          setActiveSession(fresh);
        }
      }
    } catch (err) {
      setError(err.message || "Gagal memuat riwayat sesi pin.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch voice channel roster
  const loadVoiceRoster = async () => {
    setVoiceLoading(true);
    setError("");
    try {
      const data = await getVoiceRoster();
      setVoiceData(data);
      setSelectedVoiceMembers([]);
    } catch (err) {
      setError(err.message || "Gagal membaca anggota voice channel.");
    } finally {
      setVoiceLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    loadVoiceRoster();
  }, []);

  // Filter active sessions
  const activeSessions = useMemo(() => sessions.filter((s) => s.status === "open"), [sessions]);
  const pastSessions = useMemo(() => sessions.filter((s) => s.status !== "open"), [sessions]);

  // Handle select participant in active session detail
  useEffect(() => {
    if (activeSession && activeSession.memberReports?.length > 0) {
      if (!selectedMemberId || !activeSession.memberReports.find((m) => m.discordUserId === selectedMemberId)) {
        setSelectedMemberId(activeSession.memberReports[0].discordUserId);
      }
    } else {
      setSelectedMemberId(null);
    }
  }, [activeSession]);

  const selectedMemberReport = useMemo(() => {
    if (!activeSession || !selectedMemberId) return null;
    return activeSession.memberReports.find((m) => m.discordUserId === selectedMemberId) || null;
  }, [activeSession, selectedMemberId]);

  // Start new session
  const handleStartSession = async () => {
    if (selectedVoiceMembers.length === 0) {
      setError("Pilih minimal 1 anggota di voice channel.");
      return;
    }
    setActionLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const session = await createPinSession({
        pinType: newPinType,
        memberIds: selectedVoiceMembers,
      });
      if (session) {
        setSuccessMsg(`Sesi ${PIN_TYPE_LABELS[newPinType]} berhasil dibuka.`);
        setSelectedVoiceMembers([]);
        await loadSessions();
        setActiveSession(session);
      }
    } catch (err) {
      setError(err.message || "Gagal membuka sesi baru.");
    } finally {
      setActionLoading(false);
    }
  };

  // Update a single phase's evaluation for a participant
  const handleUpdatePhase = async (phaseNum, passed, catatan) => {
    if (!activeSession || !selectedMemberReport) return;
    setSaveStatus("Menyimpan...");

    const updatedPhases = selectedMemberReport.phases.map((p) => {
      if (p.phase === phaseNum) {
        return { ...p, passed, catatan: catatan ?? p.catatan };
      }
      return p;
    });

    try {
      // Calculate display name & username if possible
      let displayName = selectedMemberReport.displayName;
      let username = selectedMemberReport.username;
      if (voiceData?.members) {
        const vm = voiceData.members.find((m) => m.discordUserId === selectedMemberReport.discordUserId);
        if (vm) {
          displayName = vm.displayName || vm.username || displayName;
          username = vm.username || username;
        }
      }

      // Update API
      const updatedSession = await addPinReport(activeSession._id, {
        discordUserId: selectedMemberReport.discordUserId,
        phases: updatedPhases,
        nilaiAkhir: selectedMemberReport.nilaiAkhir,
        displayName,
        username,
      });

      if (updatedSession) {
        // Update local session state
        setSessions((prev) => prev.map((s) => (s._id === updatedSession._id ? updatedSession : s)));
        setActiveSession(updatedSession);
        setSaveStatus("Tersimpan");
      }
    } catch (err) {
      setSaveStatus("Gagal menyimpan!");
      setError(err.message || "Gagal memperbarui nilai fase.");
    }
  };

  // Update Nilai Akhir for a participant
  const handleUpdateNilaiAkhir = async (nilai) => {
    if (!activeSession || !selectedMemberReport) return;
    setSaveStatus("Menyimpan...");
    try {
      let displayName = selectedMemberReport.displayName;
      let username = selectedMemberReport.username;
      if (voiceData?.members) {
        const vm = voiceData.members.find((m) => m.discordUserId === selectedMemberReport.discordUserId);
        if (vm) {
          displayName = vm.displayName || vm.username || displayName;
          username = vm.username || username;
        }
      }

      const updatedSession = await addPinReport(activeSession._id, {
        discordUserId: selectedMemberReport.discordUserId,
        phases: selectedMemberReport.phases,
        nilaiAkhir: nilai,
        displayName,
        username,
      });

      if (updatedSession) {
        setSessions((prev) => prev.map((s) => (s._id === updatedSession._id ? updatedSession : s)));
        setActiveSession(updatedSession);
        setSaveStatus("Tersimpan");
      }
    } catch (err) {
      setSaveStatus("Gagal menyimpan!");
      setError(err.message || "Gagal memperbarui Nilai Akhir.");
    }
  };

  // Dispatch Sertijab & complete session
  const handleDispatchSession = async () => {
    if (!activeSession) return;
    const hasLulus = activeSession.memberReports.some((m) => m.nilaiAkhir === "LULUS");
    if (!hasLulus) {
      setError("Paling tidak 1 anggota harus bernilai LULUS sebelum mengirim sertijab.");
      return;
    }

    if (!confirm(`Kirim sertijab ${PIN_TYPE_LABELS[activeSession.pinType]} ke Discord dan berikan role otomatis?`)) {
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await dispatchPinSession(activeSession._id);
      if (res && res.success) {
        setSuccessMsg(res.message || "Sertijab berhasil dikirim!");
        setActiveSession(null);
        await loadSessions();
      } else {
        setError(res?.message || "Gagal mengirim sertijab.");
      }
    } catch (err) {
      setError(err.message || "Gagal mengirim sertijab.");
    } finally {
      setActionLoading(false);
    }
  };

  // Compile real-time preview of Uji Mutu
  const ujiMutuPreview = useMemo(() => {
    if (!activeSession) return "";
    const typeLabel = PIN_TYPE_LABELS[activeSession.pinType] || activeSession.pinType;
    const lines = [];
    lines.push(`LAPORAN UJI MUTU ${typeLabel.toUpperCase()}`);
    lines.push("Standar Acuan: SOP Silere Impetum PASKUS 791");
    lines.push("");

    for (const member of activeSession.memberReports) {
      let name = member.displayName || member.username || member.discordUserId;
      if (voiceData?.members) {
        const vm = voiceData.members.find((m) => m.discordUserId === member.discordUserId);
        if (vm) {
          name = vm.displayName || vm.username || name;
        }
      }
      lines.push(`Peserta: ${name}`);
      lines.push(`Hasil Akhir: ${member.nilaiAkhir}`);
      for (const p of member.phases) {
        const status = p.passed === true ? "LULUS" : p.passed === false ? "GAGAL" : "BELUM DINILAI";
        lines.push(`  Fase ${p.phase} - ${p.name}: ${status}`);
        if (p.catatan) lines.push(`    Catatan: ${p.catatan}`);
      }
      lines.push("");
    }
    return lines.join("\n");
  }, [activeSession, voiceData]);

  // Toggle voice member selection
  const toggleVoiceMember = (memberId) => {
    setSelectedVoiceMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Page Header ─── */}
      <section className="rounded-2xl border border-white/8 bg-[#151515] p-5">
        <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
          Resimen Paskus 791
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1 className="font-sans text-2xl font-bold uppercase text-stone-100 md:text-3xl">
              Pengambilan Pin Anggota
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">
              Evaluasi prajurit berdasarkan SOP Silere Impetum secara terstruktur.
              Buka sesi latihan, nilai setiap fase kelulusan, dan kirim laporan sertijab
              untuk memberikan role Wingman (5 fase) atau Pin Latpur (5 fase) secara otomatis di Discord.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-emerald-300">
              Sertijab & Role Otomatis
            </p>
            <p className="mt-1 text-xs leading-5 text-stone-300">
              Peserta yang diberi Nilai Akhir <strong className="text-emerald-400">LULUS</strong> akan secara otomatis mendapat role Discord saat sesi dikirim.
            </p>
          </div>
        </div>
      </section>

      {/* Global alert messages */}
      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-rose-300 hover:text-stone-100 text-xs">
            Tutup
          </button>
        </div>
      )}
      {successMsg && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-300 hover:text-stone-100 text-xs">
            Tutup
          </button>
        </div>
      )}

      {/* Detail Sesi Aktif */}
      <AnimatePresence mode="wait">
        {activeSession ? (
          <motion.div
            key="active-session-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid gap-6 lg:grid-cols-[280px_1fr]"
          >
            {/* Left Column: Participant list & session info */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-public text-[9px] uppercase tracking-[0.2em] text-amber-300">
                    Sesi Berjalan
                  </span>
                  <button
                    onClick={() => {
                      if (confirm("Keluar dari sesi ini? Progres tidak akan hilang.")) {
                        setActiveSession(null);
                      }
                    }}
                    className="text-[10px] text-stone-400 hover:text-stone-100"
                  >
                    Tutup
                  </button>
                </div>
                <h2 className="font-sans text-lg font-bold text-stone-100 leading-snug">
                  {PIN_TYPE_LABELS[activeSession.pinType] || activeSession.pinType}
                </h2>
                <p className="mt-1 text-[11px] text-stone-400">
                  Pelatih: {activeSession.operator?.nama}
                </p>
                {activeSession.voiceChannelName && (
                  <p className="mt-2 text-[10px] text-stone-500 italic">
                    VC: {activeSession.voiceChannelName}
                  </p>
                )}
              </div>

              {/* Members navigation list */}
              <div className="rounded-2xl border border-white/8 bg-[#151515] p-4">
                <span className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500 block mb-3">
                  Pilih Peserta ({activeSession.memberReports?.length})
                </span>
                <div className="space-y-2">
                  {activeSession.memberReports.map((member) => {
                    let name = member.displayName || member.username || member.discordUserId;
                    if (voiceData?.members) {
                      const vm = voiceData.members.find((m) => m.id === member.discordUserId);
                      if (vm) name = vm.displayName || vm.username || name;
                    }
                    const isSelected = selectedMemberId === member.discordUserId;
                    const statusColors =
                      member.nilaiAkhir === "LULUS"
                        ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                        : member.nilaiAkhir === "GAGAL"
                        ? "text-rose-400 border-rose-500/20 bg-rose-500/5"
                        : "text-amber-400 border-amber-500/20 bg-amber-500/5";

                    return (
                      <button
                        key={member.discordUserId}
                        onClick={() => setSelectedMemberId(member.discordUserId)}
                        className={[
                          "w-full text-left rounded-xl p-3 border transition-all text-xs flex flex-col gap-1.5",
                          isSelected
                            ? "bg-white/[0.06] border-white/20 text-stone-100"
                            : "bg-black/10 border-white/5 text-stone-400 hover:bg-white/[0.02] hover:text-stone-300",
                        ].join(" ")}
                      >
                        <span className="font-bold truncate">{name}</span>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] text-stone-500">ID: {member.discordUserId}</span>
                          <span className={["rounded-full border px-2 py-0.5 font-public text-[8px] uppercase tracking-wider", statusColors].join(" ")}>
                            {member.nilaiAkhir}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Participant scoring form */}
            <div className="space-y-6">
              {selectedMemberReport ? (
                <div className="rounded-2xl border border-white/8 bg-[#151515] p-5 space-y-6">
                  {/* Participant header */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4 border-b border-white/8">
                    <div>
                      <p className="font-public text-[9px] uppercase tracking-[0.2em] text-stone-400">
                        Detail Penilaian Peserta
                      </p>
                      <h3 className="font-sans text-xl font-black text-stone-100 mt-1">
                        {(() => {
                          let name = selectedMemberReport.displayName || selectedMemberReport.username || selectedMemberReport.discordUserId;
                          if (voiceData?.members) {
                            const vm = voiceData.members.find((m) => m.id === selectedMemberReport.discordUserId);
                            if (vm) name = vm.displayName || vm.username || name;
                          }
                          return name;
                        })()}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Discord ID: {selectedMemberReport.discordUserId}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {saveStatus && (
                        <span className={[
                          "text-xs font-medium px-2 py-1 rounded-lg",
                          saveStatus.includes("Gagal") ? "text-rose-400 bg-rose-500/10" : "text-stone-400"
                        ].join(" ")}>
                          {saveStatus}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 border border-white/8 bg-black/20 p-1 rounded-xl">
                        <button
                          onClick={() => handleUpdateNilaiAkhir("BELUM")}
                          className={[
                            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                            selectedMemberReport.nilaiAkhir === "BELUM"
                              ? "bg-amber-500 text-black shadow"
                              : "text-stone-400 hover:text-stone-200",
                          ].join(" ")}
                        >
                          Belum
                        </button>
                        <button
                          onClick={() => handleUpdateNilaiAkhir("LULUS")}
                          className={[
                            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                            selectedMemberReport.nilaiAkhir === "LULUS"
                              ? "bg-emerald-500 text-black shadow"
                              : "text-stone-400 hover:text-stone-200",
                          ].join(" ")}
                        >
                          Lulus
                        </button>
                        <button
                          onClick={() => handleUpdateNilaiAkhir("GAGAL")}
                          className={[
                            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                            selectedMemberReport.nilaiAkhir === "GAGAL"
                              ? "bg-rose-500 text-black shadow"
                              : "text-stone-400 hover:text-stone-200",
                          ].join(" ")}
                        >
                          Gagal
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SOP Phases list */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(SOP_PHASES_MAP[activeSession.pinType] || []).map((sopPhase) => {
                      const phaseReport = selectedMemberReport.phases.find((p) => p.phase === sopPhase.phase) || {
                        passed: null,
                        catatan: "",
                      };
                      return (
                        <div
                          key={sopPhase.phase}
                          className="rounded-xl border border-white/8 bg-black/10 p-3.5 flex flex-col justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <span className="font-public text-[9px] uppercase tracking-wider text-amber-300">
                                Fase {sopPhase.phase}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdatePhase(sopPhase.phase, true, phaseReport.catatan)}
                                  className={[
                                    "px-1.5 py-0.5 rounded text-[10px] font-bold transition",
                                    phaseReport.passed === true
                                      ? "bg-emerald-500 text-black"
                                      : "bg-white/5 text-stone-500 hover:bg-white/10 hover:text-stone-300",
                                  ].join(" ")}
                                >
                                  L
                                </button>
                                <button
                                  onClick={() => handleUpdatePhase(sopPhase.phase, false, phaseReport.catatan)}
                                  className={[
                                    "px-1.5 py-0.5 rounded text-[10px] font-bold transition",
                                    phaseReport.passed === false
                                      ? "bg-rose-500 text-black"
                                      : "bg-white/5 text-stone-500 hover:bg-white/10 hover:text-stone-300",
                                  ].join(" ")}
                                >
                                  G
                                </button>
                                <button
                                  onClick={() => handleUpdatePhase(sopPhase.phase, null, phaseReport.catatan)}
                                  className={[
                                    "px-1.5 py-0.5 rounded text-[10px] font-bold transition",
                                    phaseReport.passed === null
                                      ? "bg-stone-500 text-black"
                                      : "bg-white/5 text-stone-500 hover:bg-white/10 hover:text-stone-300",
                                  ].join(" ")}
                                >
                                  B
                                </button>
                              </div>
                            </div>
                            <h4 className="font-sans text-sm font-bold text-stone-100 mt-1 leading-tight">
                              {sopPhase.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 mt-0.5 leading-normal">
                              {sopPhase.desc}
                            </p>
                          </div>

                          <div className="mt-1">
                            <textarea
                              placeholder="Tambah catatan..."
                              defaultValue={phaseReport.catatan || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (phaseReport.catatan || "")) {
                                  handleUpdatePhase(sopPhase.phase, phaseReport.passed, e.target.value);
                                }
                              }}
                              className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-white/5 bg-[#121212] text-stone-300 placeholder-stone-600 focus:outline-none focus:border-white/10 resize-none h-[42px]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Real-time Uji Mutu Preview & Dispatch section */}
                  <div className="rounded-2xl border border-white/8 bg-[#181818] p-4 space-y-4">
                    <div>
                      <h4 className="font-sans text-sm font-bold text-stone-200">
                        Pratinjau Laporan Uji Mutu
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Laporan ini akan secara otomatis dikompilasi ke Discord.
                      </p>
                    </div>
                    <pre className="font-mono text-[10px] leading-5 text-stone-400 bg-black/40 p-4 rounded-xl max-h-[160px] overflow-y-auto border border-white/5 white-space-pre-wrap">
                      {ujiMutuPreview}
                    </pre>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-stone-500 max-w-lg">
                        Setelah menekan tombol kirim, laporan Uji Mutu akan dikirim ke channel resimen dan role discord peserta akan diubah secara otomatis.
                      </p>
                      <button
                        onClick={handleDispatchSession}
                        disabled={actionLoading}
                        className="bg-amber-400 hover:bg-amber-500 disabled:bg-amber-400/40 text-black px-5 py-2.5 rounded-xl font-bold font-public text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
                      >
                        {actionLoading ? "Mengirim..." : "Kirim Sertijab & Selesai"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/8 bg-[#151515] p-12 text-center text-stone-500 text-sm">
                  Pilih peserta di kolom sebelah kiri untuk memulai pengisian fase SOP.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Tampilan Menu Utama (Pilih Sesi & Buka Sesi Baru) */
          <motion.div
            key="start-session-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            {/* Left Box: Open New Session Form */}
            <div className="rounded-2xl border border-white/8 bg-black/20 p-5 space-y-6">
              <div>
                <p className="font-public text-[10px] uppercase tracking-[0.2em] text-amber-300">
                  New Session
                </p>
                <h2 className="font-sans text-xl font-bold uppercase text-stone-100 mt-1">
                  Buka Sesi Pengambilan Pin
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Pilih tipe pin yang ingin diujikan dan peserta yang sedang aktif di voice channel Discord.
                </p>
              </div>

              {/* Tipe Pin Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setNewPinType("wingman")}
                  className={[
                    "rounded-xl border p-4 text-left transition-all flex flex-col gap-2 relative overflow-hidden",
                    newPinType === "wingman"
                      ? "border-amber-400 bg-amber-400/[0.03] text-stone-100"
                      : "border-white/5 bg-black/10 text-stone-400 hover:bg-white/[0.02]",
                  ].join(" ")}
                >
                  <span className="font-public text-[9px] uppercase tracking-wider text-amber-300">
                    SOP WINGMAN
                  </span>
                  <span className="font-bold text-sm">Pin Wingman</span>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Latihan manuver taktis udara, penerjunan payung, & respon lampu callsign.
                  </p>
                  {newPinType === "wingman" && (
                    <div className="absolute right-3 top-3 h-4 w-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-black font-black">
                      ✓
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setNewPinType("latpur")}
                  className={[
                    "rounded-xl border p-4 text-left transition-all flex flex-col gap-2 relative overflow-hidden",
                    newPinType === "latpur"
                      ? "border-amber-400 bg-amber-400/[0.03] text-stone-100"
                      : "border-white/5 bg-black/10 text-stone-400 hover:bg-white/[0.02]",
                  ].join(" ")}
                >
                  <span className="font-public text-[9px] uppercase tracking-wider text-amber-300">
                    SOP LATPUR
                  </span>
                  <span className="font-bold text-sm">Pin Latpur</span>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Latihan taktis tempur darat, recoil control senjata, & doper drill merangkak.
                  </p>
                  {newPinType === "latpur" && (
                    <div className="absolute right-3 top-3 h-4 w-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-black font-black">
                      ✓
                    </div>
                  )}
                </button>
              </div>

              {/* Discord Voice Roster Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-public text-[10px] uppercase tracking-[0.16em] text-stone-400">
                    Pilih Peserta dari Voice Channel
                  </span>
                  <button
                    onClick={loadVoiceRoster}
                    disabled={voiceLoading}
                    className="text-[11px] text-amber-300 hover:text-stone-100 flex items-center gap-1"
                  >
                    {voiceLoading ? "Memindai..." : "Segarkan VC"}
                  </button>
                </div>

                {voiceLoading ? (
                  <div className="rounded-xl border border-white/5 bg-[#151515] p-8 text-center text-sm text-stone-500">
                    Memindai Discord Voice Channel...
                  </div>
                ) : voiceData && voiceData.members?.length > 0 ? (
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    <p className="text-[10px] text-stone-500 italic mb-1">
                      Menampilkan anggota di VC: <strong className="text-stone-300">{voiceData.channel?.name}</strong>
                    </p>
                    {voiceData.members.map((member) => {
                      const isSelected = selectedVoiceMembers.includes(member.discordUserId);
                      return (
                        <button
                          key={member.discordUserId}
                          onClick={() => toggleVoiceMember(member.discordUserId)}
                          className={[
                            "w-full text-left rounded-xl p-3 border transition-all text-xs flex items-center justify-between",
                            isSelected
                              ? "bg-amber-400/5 border-amber-400/30 text-stone-100"
                              : "bg-[#151515] border-white/5 text-stone-400 hover:bg-white/[0.02]",
                          ].join(" ")}
                        >
                          <div className="min-w-0">
                            <p className="font-bold truncate text-stone-200">
                              {member.displayName || member.username}
                            </p>
                            <p className="text-[10px] text-stone-500 truncate">
                              @{member.username} • ID: {member.discordUserId}
                            </p>
                          </div>
                          <div
                            className={[
                              "h-4.5 w-4.5 rounded border flex items-center justify-center text-[10px]",
                              isSelected
                                ? "bg-amber-400 border-amber-400 text-black font-black"
                                : "border-white/10",
                            ].join(" ")}
                          >
                            {isSelected && "✓"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/8 bg-[#151515] p-6 text-center text-xs text-stone-500">
                    Tidak ada anggota terbaca di voice channel Anda. Silakan masuk ke Voice Channel Discord bersama peserta terlebih dahulu.
                  </div>
                )}
              </div>

              {/* Start Session Action button */}
              <button
                onClick={handleStartSession}
                disabled={actionLoading || selectedVoiceMembers.length === 0}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-amber-400/20 disabled:text-stone-600 text-black py-3 rounded-xl font-bold font-public text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                {actionLoading ? "Membuka Sesi..." : "Buka Sesi Penilaian"}
              </button>
            </div>

            {/* Right Box: Sesi Berjalan & Riwayat Sesi */}
            <div className="space-y-6">
              {/* Sesi Berjalan Section */}
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5 space-y-4">
                <span className="font-public text-[10px] uppercase tracking-[0.2em] text-stone-400">
                  Sesi Aktif
                </span>
                {activeSessions.length > 0 ? (
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div
                        key={session._id}
                        className="rounded-xl border border-white/8 bg-[#151515] p-4 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span className="font-public text-[8px] uppercase tracking-wider text-amber-300">
                            AKTIF
                          </span>
                          <h4 className="font-sans text-sm font-bold text-stone-200 mt-1 leading-snug">
                            {PIN_TYPE_LABELS[session.pinType] || session.pinType}
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Perekrut: {session.operator?.nama} • {session.memberReports?.length} Peserta
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveSession(session)}
                          className="shrink-0 bg-white/5 border border-white/8 px-3.5 py-1.5 text-xs font-bold rounded-lg text-stone-200 hover:bg-white/10"
                        >
                          Buka
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/8 bg-[#151515] p-6 text-center text-sm text-stone-500">
                    Belum ada sesi penilaian aktif.
                  </div>
                )}
              </div>

              {/* Riwayat Sesi Section */}
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5 space-y-4">
                <span className="font-public text-[10px] uppercase tracking-[0.2em] text-stone-400">
                  Riwayat Sesi Terkirim
                </span>
                {loading ? (
                  <div className="text-center text-xs text-stone-500 py-4">
                    Memuat riwayat sesi...
                  </div>
                ) : pastSessions.length > 0 ? (
                  <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                    {pastSessions.map((session) => {
                      const isSubmitted = session.status === "submitted";
                      return (
                        <div
                          key={session._id}
                          className="rounded-xl border border-white/5 bg-[#151515] p-4 flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className={[
                              "font-public text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border",
                              isSubmitted
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border-rose-400/20 bg-rose-500/10 text-rose-300",
                            ].join(" ")}>
                              {isSubmitted ? "SUKSES" : "GAGAL"}
                            </span>
                            <span className="text-[10px] text-stone-600">
                              {new Date(session.updatedAt || session.createdAt).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-sans text-sm font-bold text-stone-300 leading-snug">
                              {PIN_TYPE_LABELS[session.pinType] || session.pinType}
                            </h4>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              Pelatih: {session.operator?.nama} • {session.memberReports?.length} Peserta
                            </p>
                            {session.sertijabRef && (
                              <p className="text-[10px] text-stone-600 mt-1 font-mono">
                                Ref: {session.sertijabRef}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/8 bg-[#151515] p-6 text-center text-sm text-stone-500">
                    Belum ada riwayat sesi penilaian.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
