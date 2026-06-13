/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import paskusLogo from "../assets/paskus.webp";

export default function RotatingPaskusLogo({
  sizeClassName = "h-28 w-28",
  glowClassName = "bg-emerald-400/18",
  className = "",
  imageClassName = "",
  visualOffsetClassName = "",
}) {
  return (
    <div
      className={[
        "relative flex items-center justify-center",
        visualOffsetClassName,
        className,
      ].join(" ")}
    >
      <div
        className={`absolute h-28 w-28 rounded-full blur-[72px] ${glowClassName} animate-[pulse_6s_ease-in-out_infinite] motion-reduce:animate-none`}
      />
      <div className="absolute h-[120%] w-[120%] transform-gpu rounded-full border border-emerald-300/18 border-t-emerald-300/85 border-r-transparent border-b-emerald-300/20 border-l-transparent animate-[spin_11s_linear_infinite] will-change-transform motion-reduce:animate-none" />
      <div className="absolute h-[138%] w-[138%] transform-gpu rounded-full border border-white/6 border-t-white/40 border-r-transparent border-b-transparent border-l-white/10 animate-[spin_18s_linear_infinite_reverse] will-change-transform motion-reduce:animate-none" />
      <img
        src={paskusLogo}
        alt="Paskus insignia"
        decoding="async"
        className={`relative z-10 transform-gpu rounded-full object-contain animate-[spin_24s_linear_infinite] will-change-transform motion-reduce:animate-none ${sizeClassName} ${imageClassName}`}
      />
    </div>
  );
}
