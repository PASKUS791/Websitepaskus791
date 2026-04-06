/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import foto1 from "../assets/2.webp";
import foto2 from "../assets/5.webp";
import foto3 from "../assets/GATAM_2.webp";
import foto4 from "../assets/GATAM_3.webp";
import foto5 from "../assets/GATAM_4.webp";
import RotatingPaskusLogo from "../components/RotatingPaskusLogo";
import SecurityAttackOverlay from "../components/SecurityAttackOverlay";
import paskusLogo from "../assets/paskus.webp";
import { useAuth } from "../lib/auth";
import { useAnimatedFavicon } from "../lib/useAnimatedFavicon";

const PHOTOS = [foto1, foto2, foto3, foto4, foto5];
const FractureOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="pointer-events-none absolute inset-0 z-[150]"
  >
    <svg width="100%" height="100%" className="opacity-80">
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <path
        d="M50,50 L0,20 M50,50 L100,10 M50,50 L80,100 M50,50 L20,90 M50,50 L0,70 M50,50 L100,60"
        className="stroke-emerald-400/50"
        strokeWidth="1"
        fill="none"
        transform="scale(100, 100)"
      />
      <path
        d="M500,400 L200,100 M500,400 L800,50 M500,400 L900,800 M500,400 L100,700"
        className="stroke-white/30"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
      />
    </svg>
    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
  </motion.div>
);

function GlitchBackground({ currentIndex, mouseX, mouseY }) {
  const springX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 25 });

  const moveX = useTransform(springX, [-500, 500], [40, -40]);
  const moveY = useTransform(springY, [-500, 500], [40, -40]);
  const scale = useTransform(springY, [-500, 500], [1.1, 1.2]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
          animate={{ opacity: 0.6, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -50, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: moveX, y: moveY, scale }}
          className="absolute inset-0"
        >
          <img
            src={PHOTOS[currentIndex]}
            className="h-full w-full object-cover contrast-125 brightness-[0.5]"
            alt="Background"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] opacity-20" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
            backgroundSize: "150px 150px",
          }}
        />
      </div>
    </div>
  );
}

export default function LoginPortal() {
  const navigate = useNavigate();
  const { loading, login, user } = useAuth();
  useAnimatedFavicon();
  const [phase, setPhase] = useState("intro");
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [securityAlert, setSecurityAlert] = useState(null);
  const [isAuthing, setIsAuthing] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const rotateX = useTransform(springY, [-500, 500], [5, -5]);
  const rotateY = useTransform(springX, [-500, 500], [-5, 5]);

  const logMessages = useMemo(
    () => [
      "Memuat aset keamanan...",
      "Verifikasi kredensial perwira...",
      "Pemetaan grid taktis...",
      "Dekripsi aliran data perintah...",
      "Melewati protokol firewall...",
      "Otorisasi jabat tangan...",
      "Antarmuka stabil.",
    ],
    [],
  );

  const visibleLogs = useMemo(() => {
    const completed = Math.min(
      logMessages.length,
      Math.max(0, Math.ceil((progress / 100) * logMessages.length)),
    );

    return logMessages.slice(Math.max(0, completed - 3), completed);
  }, [logMessages, progress]);

  useEffect(() => {
    if (phase !== "intro") {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setProgress(0);
      setPhase("loading");
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          return 100;
        }

        return prev + 1;
      });
    }, 50);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading" || progress !== 100) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setPhase("content"), 1000);
    return () => window.clearTimeout(timeout);
  }, [phase, progress]);

  useEffect(() => {
    if (phase !== "content") {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [phase]);

  const handleMouseMove = (event) => {
    mouseX.set(event.clientX - window.innerWidth / 2);
    mouseY.set(event.clientY - window.innerHeight / 2);
  };

  const handleLoginClick = () => {
    setError("");
    setPhase("breaching");
    window.setTimeout(() => setPhase("loginForm"), 1200);
  };

  const handleAuthenticate = () => {
    if (isAuthing) {
      return;
    }

    setError("");
    setIsAuthing(true);

    window.setTimeout(async () => {
      try {
        await login("pelatih", username, password);
        navigate("/dashboard", { replace: true });
      } catch (authError) {
        const attackPayload = authError?.payload?.securityEvent;

        if (attackPayload) {
          setSecurityAlert({
            ...attackPayload,
            retryAfterSeconds: authError?.payload?.retryAfterSeconds,
          });
        }

        setError(attackPayload?.classification || authError.message || "ACCESS DENIED");
        setIsAuthing(false);
        window.setTimeout(() => setError(""), 1200);
      }
    }, 1000);
  };

  if (loading) {
    return null;
  }

  if (user?.scope === "pelatih") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden bg-[#020406] font-mono text-emerald-50 selection:bg-emerald-500/30"
    >
      <GlitchBackground
        currentIndex={currentIndex}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      <AnimatePresence>
        {phase === "breaching" && (
          <>
            <FractureOverlay />
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.5, 2],
                filter: ["blur(0px)", "blur(20px)", "blur(0px)"],
              }}
              className="pointer-events-none fixed inset-0 z-[160] bg-white"
            />
          </>
        )}
      </AnimatePresence>

      <SecurityAttackOverlay
        alert={securityAlert}
        onDismiss={() => setSecurityAlert(null)}
      />

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="relative group translate-x-2 md:translate-x-4"
            >
              <RotatingPaskusLogo
                sizeClassName="h-44 w-44 md:h-48 md:w-48"
                glowClassName="bg-emerald-400/24"
                imageClassName="mix-blend-screen brightness-110"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="mt-8 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"
              />
              <div className="mt-4 text-center">
                <span className="text-[10px] font-black uppercase tracking-[1em] text-emerald-500 opacity-60">
                  Progres Active Silere Impetum
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ x: -200, opacity: 0, scale: 0.8 }}
            className="relative z-50 flex h-full w-full items-center justify-center p-6"
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
            >
              <div className="mb-10 text-center">
                <motion.h1
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-2 text-3xl font-black uppercase tracking-[0.25em] text-emerald-400"
                >
                  Decrypting_Data
                </motion.h1>
                <div className="text-[10px] uppercase tracking-[0.4em] opacity-40">
                  Neural Link Status: Active
                </div>
              </div>

              <div className="mb-8 h-20 space-y-3 overflow-hidden text-[11px]">
                {visibleLogs.map((log) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log}
                    className="flex justify-between border-b border-white/5 pb-1"
                  >
                    <span className="italic opacity-70">{`# ${log}`}</span>
                    <span className="font-bold text-emerald-400">OK</span>
                  </motion.div>
                ))}
              </div>

              <div className="relative flex h-8 w-full gap-1.5 overflow-hidden rounded-sm border border-white/10 bg-black/40 p-1">
                {Array.from({ length: 24 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="h-full flex-1 rounded-sm"
                    animate={{
                      backgroundColor:
                        (progress / 100) * 24 > index
                          ? "rgba(52, 211, 153, 0.8)"
                          : "rgba(16, 185, 129, 0.05)",
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 flex items-end justify-between border-t border-white/5 pt-6">
                <div className="flex flex-col">
                  <span className="text-5xl font-black italic tracking-tighter text-emerald-400">
                    {progress}%
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.3em] opacity-30">
                    Synchro_Buffer
                  </span>
                </div>
                <div className="flex flex-col items-end text-right opacity-60">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                    Encryption: RSA-4096
                  </span>
                  <span className="text-[10px] uppercase tracking-widest">
                    Secure_Protocol: V.2
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "content" && (
          <motion.main
            key="main"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 flex h-full w-full items-center justify-center p-6"
          >
            <div className="relative flex w-full max-w-6xl flex-col items-center">
              <motion.div
                style={{ rotateX, rotateY }}
                className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur-md"
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.3, filter: "blur(20px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={PHOTOS[currentIndex]}
                      className="h-full w-full object-cover"
                      alt="Cinema"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-12">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="mb-4 inline-block bg-emerald-500/10 px-4 py-1 text-xs font-bold tracking-[0.6em] text-emerald-400">
                      RECRUITMENT_FILE_0{currentIndex + 1}
                    </span>
                    <h2 className="mb-8 text-5xl leading-none font-black italic uppercase tracking-tighter md:text-8xl">
                      Recruitment <br />
                      <span className="bg-linear-to-r from-emerald-400 to-white bg-clip-text text-transparent">
                        Command
                      </span>
                    </h2>

                    <motion.button
                      onClick={handleLoginClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-emerald-500 px-8 py-4 font-black uppercase tracking-[0.3em] text-black shadow-[0_0_50px_rgba(16,185,129,0.4)] md:px-12 md:py-5"
                    >
                      LOGIN TO SYSTEM
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>

              <div className="mt-12 flex gap-4">
                {PHOTOS.map((photo, index) => (
                  <div
                    key={photo}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${
                      index === currentIndex
                        ? "w-20 bg-emerald-500"
                        : "w-5 bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.main>
        )}

        {phase === "loginForm" && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 font-sans backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0.1, 0.4, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-red-500/10 mix-blend-screen"
                />
              )}
            </AnimatePresence>

            <motion.div
              animate={error ? { x: [-6, 6, -6, 6, 0] } : {}}
              className="relative mx-4 w-full max-w-5xl overflow-hidden border border-white/10 bg-neutral-900/40 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute left-[-30%] top-[-20%] h-[140%] w-[160%] rounded-xl border-2 border-stone-400/20" />
                <div className="absolute left-[-20%] top-[-12%] h-[124%] w-[140%] rounded-xl border border-stone-400/10" />
                <div className="absolute left-[-10%] top-[-6%] h-[112%] w-[120%] rounded-xl border border-stone-400/5" />
              </div>

              <div className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-10">
                <div className="flex justify-center">
                  <div className="flex w-full max-w-[620px] flex-col items-center">
                    <div className="mb-6 flex flex-col items-center text-center">
                      <p className="mb-6 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                        Staff Recruiter Portal
                      </p>

                      <img
                        src={paskusLogo}
                        alt="Paskus insignia"
                        className="h-20 w-20 shrink-0 rounded-full object-cover opacity-90"
                      />

                      <h1 className="mt-4 text-2xl font-semibold uppercase tracking-[0.2em] text-stone-200">
                        Paskus 791
                      </h1>

                      <p className="mt-2 text-[11px] uppercase tracking-[3px] text-[#84A98C]">
                        Command Center - Paskus Recruiter
                      </p>
                    </div>

                    <div className="relative w-full max-w-[560px] rounded bg-stone-900/80 p-2 shadow-2xl">
                      <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[#E6C068]/40" />
                      <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[#E6C068]/40" />
                      <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[#E6C068]/40" />
                      <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[#E6C068]/40" />

                      <div className="rounded bg-zinc-800/70 px-6 py-10 md:px-10">
                        <div className="mb-10 text-center text-[24px] font-semibold tracking-[0.3em] text-stone-200">
                          STAFF
                        </div>

                        <div className="mb-6">
                          <div className="mb-3 text-[9px] uppercase tracking-[3px] text-stone-300">
                            USERNAME IDENTIFICATION
                          </div>

                          <div className="group relative">
                            <input
                              type="text"
                              value={username}
                              onChange={(event) => setUsername(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  handleAuthenticate();
                                }
                              }}
                              autoComplete="username"
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              placeholder="ENTER DESIGNATION"
                              className="relative z-10 w-full rounded-md border border-transparent bg-stone-950/90 px-4 py-3 text-sm text-[#E6F0E8] caret-[#84A98C] outline-none transition-all placeholder:text-stone-500 focus:border-[#84A98C] focus:shadow-[0_0_12px_rgba(132,169,140,0.25)] group-hover:shadow-[0_0_8px_rgba(132,169,140,0.15)]"
                            />

                            <div className="pointer-events-none absolute inset-0 bg-[#84A98C]/10 opacity-0 blur-xl transition group-hover:opacity-100" />
                          </div>
                        </div>

                        <div className="mb-10">
                          <div className="mb-3 text-[9px] uppercase tracking-[3px] text-stone-300">
                            SECURITY KEY
                          </div>

                          <div className="group relative">
                            <input
                              type="password"
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  handleAuthenticate();
                                }
                              }}
                              autoComplete="current-password"
                              placeholder="••••••••••••"
                              className="relative z-10 w-full rounded-md border border-transparent bg-stone-950/90 px-4 py-3 text-sm text-[#E6F0E8] caret-[#84A98C] outline-none transition-all placeholder:text-stone-500 focus:border-[#84A98C] focus:shadow-[0_0_12px_rgba(132,169,140,0.25)] group-hover:shadow-[0_0_8px_rgba(132,169,140,0.15)]"
                            />

                            <div className="pointer-events-none absolute inset-0 bg-[#84A98C]/10 opacity-0 blur-xl transition group-hover:opacity-100" />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleAuthenticate}
                          className="group relative h-12 w-full overflow-hidden rounded-xl"
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-[#84A98C] to-[#52796F]" />

                          <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-linear-to-r from-transparent via-[#E6C068]/50 to-transparent"
                          />

                          <div className="absolute inset-0 bg-[#84A98C]/20 opacity-0 blur-2xl transition group-hover:opacity-100" />

                          <span className="relative z-10 text-[12px] font-semibold tracking-[0.3em] text-black">
                            {isAuthing ? "AUTHENTICATING..." : "AUTHENTICATE"}
                          </span>
                        </motion.button>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-[10px] tracking-widest">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                error
                                  ? "bg-red-500 animate-ping"
                                  : isAuthing
                                    ? "bg-[#E6C068] animate-pulse"
                                    : "bg-[#84A98C] animate-pulse"
                              }`}
                            />

                            <span
                              className={
                                error
                                  ? "text-red-400"
                                  : isAuthing
                                    ? "text-[#E6C068]"
                                    : "text-[#84A98C]"
                              }
                            >
                              {error ||
                                (isAuthing
                                  ? "VERIFYING..."
                                  : "SYSTEM SECURE - SERVER AUTH")}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setError("");
                              setIsAuthing(false);
                              setPhase("content");
                            }}
                            className="text-[10px] uppercase tracking-[0.3em] text-stone-400 transition hover:text-stone-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 w-full max-w-[560px] text-center text-[8px] uppercase leading-relaxed tracking-[3px] text-stone-300/60">
                      Unauthorised access to this terminal is
                      <br />
                      strictly prohibited under command
                      <br />
                      directive 51-A. All keystrokes are
                      <br />
                      logged.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ top: ["-10%", "110%"] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="fixed left-0 right-0 z-[100] h-px bg-emerald-500/10"
      />
    </div>
  );
}
