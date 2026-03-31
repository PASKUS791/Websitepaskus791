import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import gdaGif from './assets/introph.gif'
import foto1 from './assets/2.webp'
import foto2 from './assets/5.webp'
import foto3 from './assets/GATAM_2.webp'
import foto4 from './assets/GATAM_3.webp'
import foto5 from './assets/GATAM_4.webp'

/**
 * TACTICAL COMMAND INTERFACE - VERSI MANDIRI (SINGLE FILE)
 * Memperbaiki error "Could not resolve" dengan menyatukan seluruh logika.
 */

// --- Aset Gambar ---
const PHOTOS = [
  foto1,
  foto2,
  foto3,
  foto4,
  foto5
];

// --- Sub-Komponen ---

// Overlay Retakan Kaca (Muncul saat proses 'breaching')
const FractureOverlay = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 z-150 pointer-events-none"
  >
    <svg width="100%" height="100%" className="opacity-80">
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <path d="M50,50 L0,20 M50,50 L100,10 M50,50 L80,100 M50,50 L20,90 M50,50 L0,70 M50,50 L100,60" 
            className="stroke-emerald-400/50" strokeWidth="1" fill="none" transform="scale(100, 100)" />
      <path d="M500,400 L200,100 M500,400 L800,50 M500,400 L900,800 M500,400 L100,700" 
            className="stroke-white/30" strokeWidth="2" fill="none" filter="url(#glow)" />
    </svg>
    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
  </motion.div>
);

// Latar Belakang Glitch dengan Efek Parallax Mouse
const GlitchBackground = ({ currentIndex, mouseX, mouseY }) => {
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
            className="w-full h-full object-cover filter contrast-125 brightness-[0.5]" 
            alt="Background"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Scanline dan Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] opacity-20" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '150px 150px' }} />
      </div>
    </div>
  );
};

// --- Komponen Utama ---
export default function App() {
  const [phase, setPhase] = useState('intro'); 
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logs, setLogs] = useState([]);
    
  const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState(false);
const [isAuthing, setIsAuthing] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const rotateX = useTransform(springY, [-500, 500], [5, -5]);
  const rotateY = useTransform(springX, [-500, 500], [-5, 5]);

  const logMessages = useMemo(() => [
    "Memuat aset keamanan...",
    "Verifikasi kredensial perwira...",
    "Pemetaan grid taktis...",
    "Dekripsi aliran data perintah...",
    "Melewati protokol firewall...",
    "Otorisasi jabat tangan...",
    "Antarmuka stabil."
  ], []);

  useEffect(() => {
  const frames = [
    "/favicon1.svg",
    "/favicon2.svg",
    "/favicon3.svg",
    "/favicon4.svg",
    "/favicon5.svg",
    "/favicon6.svg",
    "/favicon7.svg",
    "/favicon.svg"
  ];

  let index = 0;

  const interval = setInterval(() => {
    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = frames[index];
      index = (index + 1) % frames.length;
    }
  }, 400);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    if (phase === 'intro') {
      const timeout = setTimeout(() => setPhase('loading'), 3500); 
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'loading') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) return prev + 1;
          clearInterval(timer);
          return 100;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'loading') {
      const logIdx = Math.floor((progress / 100) * logMessages.length);
      if (logMessages[logIdx] && !logs.includes(logMessages[logIdx])) {
        setLogs(prev => [...prev, logMessages[logIdx]].slice(-3));
      }
      if (progress === 100) {
        setTimeout(() => setPhase('content'), 1000);
      }
    }
  }, [progress, phase, logMessages, logs]);

  useEffect(() => {
    if (phase === 'content') {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % PHOTOS.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  const handleLoginClick = () => {
    setPhase('breaching');
    setTimeout(() => setPhase('loginForm'), 1200);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-[#020406] text-emerald-50 overflow-hidden font-mono selection:bg-emerald-500/30"
    >
      <GlitchBackground currentIndex={currentIndex} mouseX={mouseX} mouseY={mouseY} />

      <AnimatePresence>
        {phase === 'breaching' && (
          <>
            <FractureOverlay />
            <motion.div 
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [1, 1.5, 2], 
                filter: ["blur(0px)", "blur(20px)", "blur(0px)"] 
              }}
              className="fixed inset-0 z-160 bg-white pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Intro Phase - GIF LOGO */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="fixed inset-0 z-200 bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full group-hover:bg-emerald-500/40 transition-all" />
              {/* Tempatkan URL GIF GDA Anda di sini */}
              <img 
                src={gdaGif} 
                alt="GDA LOGO GIF" 
                className="w-48 h-48 object-contain relative z-10 mix-blend-screen brightness-150 translate-x-34"
              />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-0.5 bg-emerald-500 mt-8 shadow-[0_0_10px_#10b981]"
              />
              <div className="mt-4 text-center">
                <span className="text-[10px] tracking-[1em] text-emerald-500 font-black uppercase opacity-60">Progres Active Silere Impetum</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Loading Phase */}
        {phase === 'loading' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ x: -200, opacity: 0, scale: 0.8 }}
            className="relative z-50 flex items-center justify-center h-full w-full p-6"
          >
            <motion.div 
               style={{ rotateX, rotateY }}
               className="relative w-full max-w-xl p-8 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl"
            >
              <div className="text-center mb-10">
                <motion.h1 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-3xl font-black tracking-[0.25em] text-emerald-400 mb-2 uppercase"
                >
                  Decrypting_Data
                </motion.h1>
                <div className="text-[10px] opacity-40 uppercase tracking-[0.4em]">Neural Link Status: Active</div>
              </div>

              <div className="space-y-3 mb-8 h-20 overflow-hidden text-[11px]">
                {logs.map((log, i) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex justify-between border-b border-white/5 pb-1">
                    <span className="opacity-70 italic">{`# ${log}`}</span>
                    <span className="text-emerald-400 font-bold">OK</span>
                  </motion.div>
                ))}
              </div>

              <div className="relative h-8 w-full bg-black/40 border border-white/10 p-1 flex gap-1.5 rounded-sm overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-full flex-1 rounded-sm"
                    animate={{ 
                      backgroundColor: (progress / 100) * 24 > i ? "rgba(52, 211, 153, 0.8)" : "rgba(16, 185, 129, 0.05)"
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 flex justify-between items-end border-t border-white/5 pt-6">
                <div className="flex flex-col">
                  <span className="text-5xl font-black italic tracking-tighter text-emerald-400">{progress}%</span>
                  <span className="text-[9px] opacity-30 uppercase tracking-[0.3em]">Synchro_Buffer</span>
                </div>
                <div className="text-right flex flex-col items-end opacity-60">
                  <span className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase">Encryption: RSA-4096</span>
                  <span className="text-[10px] uppercase tracking-widest">Secure_Protocol: V.2</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Content Phase */}
        {phase === 'content' && (
          <motion.main
            key="main"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 w-full h-full flex items-center justify-center p-6"
          >
            <div className="relative w-full max-w-6xl flex flex-col items-center">
                <motion.div 
                    style={{ rotateX, rotateY }}
                    className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md shadow-2xl"
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
                            <img src={PHOTOS[currentIndex]} className="w-full h-full object-cover" alt="Cinema" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 p-12 flex flex-col justify-end items-start">
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                            <span className="text-emerald-400 text-xs font-bold tracking-[0.6em] bg-emerald-500/10 px-4 py-1 mb-4 inline-block">ARCHIVE_FILE_0{currentIndex + 1}</span>
                            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
                                Strategic <br/> <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-white">Intelligence</span>
                            </h2>
                            
                            <motion.button 
                                onClick={handleLoginClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-5 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                            >
                                LOGIN TO SYSTEM
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="mt-12 flex gap-4">
                    {PHOTOS.map((_, i) => (
                        <div 
                            key={i} 
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === currentIndex ? 'w-20 bg-emerald-500' : 'w-5 bg-white/10'}`} 
                        />
                    ))}
                </div>
            </div>
          </motion.main>
        )}

        {/* Login Form Phase */}
        {phase === 'loginForm' && (
  <motion.div 
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl font-sans"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >

    {/* ERROR GLITCH */}
    <AnimatePresence>
      {error && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.1, 0.4, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-red-500/10 mix-blend-screen"
          />
        </>
      )}
    </AnimatePresence>

    <motion.div animate={error ? { x: [-6, 6, -6, 6, 0] } : {}}>

      <div className="w-[1280px] h-[1080px] relative bg-neutral-900/40 backdrop-blur-2xl overflow-hidden">

        {/* GRID */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-[2304px] h-[1843px] absolute left-[-512px] top-[-409px] border-2 border-stone-400/20 rounded-xl"/>
          <div className="w-[2112px] h-[1689px] absolute left-[-416px] top-[-332px] border border-stone-400/10 rounded-xl"/>
          <div className="w-[1920px] h-[1536px] absolute left-[-320px] top-[-256px] border border-stone-400/5 rounded-xl"/>
        </div>

        {/* CONTENT */}
        <div className="w-[512px] absolute left-1/2 -translate-x-1/2 top-[160px] flex flex-col items-center gap-10">

          {/* HEADER */}
          <div className="relative text-center w-full">
            <img 
              src={gdaGif}
              className="w-24 h-24 absolute left-1/2 -translate-x-1/2 -top-16 opacity-90"
            />

            <h1 className="mt-12 text-2xl font-semibold tracking-[0.2em] text-stone-200 uppercase">
              Paskus 791
            </h1>

            <p className="text-[11px] tracking-[3px] uppercase text-[#84A98C] mt-2">
              Command Center - Paskus Recruiter
            </p>
          </div>

          {/* LOGIN BOX */}
          <div className="w-[560px] p-2 relative bg-stone-900/80 rounded shadow-2xl">

            {/* CORNER */}
            <div className="absolute w-8 h-8 border-l-2 border-t-2 border-[#E6C068]/40 top-0 left-0"/>
            <div className="absolute w-8 h-8 border-r-2 border-t-2 border-[#E6C068]/40 top-0 right-0"/>
            <div className="absolute w-8 h-8 border-l-2 border-b-2 border-[#E6C068]/40 bottom-0 left-0"/>
            <div className="absolute w-8 h-8 border-r-2 border-b-2 border-[#E6C068]/40 bottom-0 right-0"/>

            <div className="bg-zinc-800/70 rounded px-10 py-10">

              {/* TITLE */}
              <div className="text-center text-stone-200 text-[24px] font-semibold tracking-[0.3em] mb-10">
                STAFF ♤
              </div>

              {/* USERNAME */}
              <div className="mb-6">
                <div className="text-[9px] text-stone-300 tracking-[3px] uppercase mb-3">
                  USERNAME IDENTIFICATION
                </div>

                <div className="relative group">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ENTER DESIGNATION"
                    className="w-full px-4 py-3 text-sm bg-stone-950/90 rounded-md text-[#CAD2C5] outline-none
                    border border-transparent transition-all
                    focus:border-[#84A98C]
                    focus:shadow-[0_0_12px_rgba(132,169,140,0.25)]
                    group-hover:shadow-[0_0_8px_rgba(132,169,140,0.15)]"
                  />

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#84A98C]/10 blur-xl transition"/>
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-10">
                <div className="text-[9px] text-stone-300 tracking-[3px] uppercase mb-3">
                  SECURITY KEY
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 text-sm bg-stone-950/90 rounded-md text-[#CAD2C5] outline-none
                    border border-transparent transition-all
                    focus:border-[#84A98C]
                    focus:shadow-[0_0_12px_rgba(132,169,140,0.25)]
                    group-hover:shadow-[0_0_8px_rgba(132,169,140,0.15)]"
                  />

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#84A98C]/10 blur-xl transition"/>
                </div>
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsAuthing(true);

                  setTimeout(() => {
                    if (username !== "paskus" || password !== "paskus123") {
                      setError(true);
                      setIsAuthing(false);
                      setTimeout(() => setError(false), 1200);
                    } else {
                      setPhase('content');
                    }
                  }, 1000);
                }}
                className="w-full h-12 rounded-xl relative overflow-hidden group"
              >
                {/* BASE */}
                <div className="absolute inset-0 bg-linear-to-r from-[#84A98C] to-[#52796F]" />

                {/* GOLD SWEEP */}
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-[#E6C068]/50 to-transparent"
                />

                {/* GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#84A98C]/20 blur-2xl transition"/>

                <span className="relative z-10 text-[12px] font-semibold tracking-[0.3em] text-black">
                  {isAuthing ? "AUTHENTICATING..." : "AUTHENTICATE"}
                </span>
              </motion.button>

              {/* STATUS */}
              <div className="mt-5 flex items-center gap-2 text-[10px] tracking-widest">
                <div className={`w-2 h-2 rounded-full ${
                  error 
                    ? "bg-red-500 animate-ping" 
                    : isAuthing
                    ? "bg-[#E6C068] animate-pulse"
                    : "bg-[#84A98C] animate-pulse"
                }`} />

                <span className={
                  error 
                    ? "text-red-400" 
                    : isAuthing
                    ? "text-[#E6C068]"
                    : "text-[#84A98C]"
                }>
                  {error
                    ? "ACCESS DENIED"
                    : isAuthing
                    ? "VERIFYING..."
                    : "SYSTEM SECURE"}
                </span>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center text-[8px] text-stone-300/60 tracking-[3px] uppercase leading-relaxed max-w-[280px]">
            Unauthorised access to this terminal is<br/>
            strictly prohibited under command<br/>
            directive 51-A. All keystrokes are<br/>
            logged.
          </div>

        </div>
      </div>
    </motion.div>
  </motion.div>
)}
      </AnimatePresence>

      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="fixed left-0 right-0 h-px bg-emerald-500/10 z-100"
      />
    </div>
  );
}