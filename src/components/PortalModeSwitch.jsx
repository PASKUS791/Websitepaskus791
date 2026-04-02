/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { motion } from "framer-motion";

function StaffIcon({ active }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 fill-none stroke-[1.8] ${
        active ? "stroke-[#121212]" : "stroke-current"
      }`}
    >
      <path d="M12 12a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z" />
      <path d="M5.5 19.2c1.5-2.8 4-4.2 6.5-4.2s5 1.4 6.5 4.2" />
      <path d="M4 4.5h3" />
      <path d="M17 4.5h3" />
    </svg>
  );
}

function HcoIcon({ active }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 fill-none stroke-[1.8] ${
        active ? "stroke-[#121212]" : "stroke-current"
      }`}
    >
      <path d="M12 3.5v3" />
      <path d="M4.9 7.1 7 9.2" />
      <path d="M19.1 7.1 17 9.2" />
      <path d="M3.5 12h3" />
      <path d="M17.5 12h3" />
      <path d="M7.5 16.5a6.5 6.5 0 0 1 9 0" />
      <path d="M9.5 14.2a3.7 3.7 0 0 1 5 0" />
      <circle cx="12" cy="18.2" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const MODE_META = {
  staff: {
    label: "STAFF MODE",
    icon: StaffIcon,
  },
  hco: {
    label: "HCO MODE",
    icon: HcoIcon,
  },
};

export default function PortalModeSwitch({
  activeMode,
  onSelect,
  className = "",
}) {
  return (
    <div
      className={[
        "relative inline-flex rounded-full border border-white/12 bg-white/[0.045] p-1 shadow-[0_18px_50px_rgba(0,0,0,0.26)] backdrop-blur-2xl",
        className,
      ].join(" ")}
    >
      <motion.div
        animate={{ x: activeMode === "hco" ? "100%" : "0%" }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-lime-300 to-emerald-200 shadow-[0_0_34px_rgba(190,242,100,0.22)]"
      />

      {(["staff", "hco"]).map((mode) => {
        const isActive = activeMode === mode;
        const meta = MODE_META[mode];
        const Icon = meta.icon;

        return (
          <button
            key={mode}
            type="button"
            onClick={() => onSelect(mode)}
            className={[
              "relative z-10 flex min-w-[184px] items-center gap-3 rounded-full px-4 py-3 font-public text-[11px] font-bold uppercase tracking-[0.22em] transition",
              isActive ? "text-[#121212]" : "text-stone-200/76 hover:text-white",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-11 w-11 items-center justify-center rounded-full border transition",
                isActive
                  ? "border-black/8 bg-white/82 shadow-[0_8px_22px_rgba(255,255,255,0.38)]"
                  : "border-white/10 bg-black/18",
              ].join(" ")}
            >
              <Icon active={isActive} />
            </span>
            <span>{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
