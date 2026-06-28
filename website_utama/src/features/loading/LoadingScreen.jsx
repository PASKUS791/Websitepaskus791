import React, { useEffect, useState } from "react";
import LogoAnimation from "./components/LogoAnimation";
import OrbitWeapons from "./components/OrbitWeapons";
import GlowEffect from "./components/GlowEffect";
import TextReveal from "./components/TextReveal";
import "@/styles/loading.css";

const LoadingScreen = ({ isSuspenseFallback = false }) => {
  const [isVisible, setIsVisible] = useState(!isSuspenseFallback);

  useEffect(() => {
    if (!isSuspenseFallback) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 7200);
      return () => clearTimeout(timer);
    }
  }, [isSuspenseFallback]);

  if (!isVisible) return null;

  return (
    <div className="military-loader-container fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-[#050505]" aria-hidden="true">
      {/* Tactical Background Grid Overlay */}
      <div className="loader-grid-overlay" />
      
      {/* Central Interactive HUD Layout */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Glow rings & particle effects (Phase 3) */}
        <GlowEffect />

        {/* Orbiting weapons behind the main logo (Phase 2) */}
        <OrbitWeapons />

        {/* Logo and Text Grouping Container (Phases 1, 4, 5) */}
        <div className="logo-text-group">
          {/* Logo Animation (Phase 1, 4) */}
          <LogoAnimation />

          {/* Text Reveal Animation (Phase 5) */}
          <TextReveal />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

