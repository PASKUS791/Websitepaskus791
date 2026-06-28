import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import Lenis from "lenis";
import "@/styles/globals.css";
import { AppRouter } from "@/app/router";
import Loading from "@/features/loading/LoadingScreen";
import { initializeConsoleWarning } from "./utils/consoleWarning";
import { useMouseGlow } from "./hooks/useMouseGlow";
import { useScrollReveal } from "./hooks/useScrollReveal";

const App = () => {
  const location = useLocation();
  const glowRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  // Inisialisasi Lenis untuk smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis = lenis;

    // Perbarui progress bar langsung dari event scroll Lenis
    lenis.on("scroll", (e) => {
      setScrollPct(e.progress * 100);
    });

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Inisialisasi banner peringatan keamanan konsol developer
  useEffect(() => {
    initializeConsoleWarning();
  }, []);

  // Hubungkan hook performa khusus
  useMouseGlow(glowRef);
  useScrollReveal(location.pathname);

  useEffect(() => {
    // Gulir ke atas saat rute berubah
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Bersihkan tombol aksi navbar yang longgar dan picu perhitungan ulang ukuran
    const cleanupNavbar = () => {
      const nav = document.querySelector("nav.paskus-floating-nav");
      if (!nav) return;

      let actions = nav.querySelector(".nav-actions");
      if (!actions) {
        actions = document.createElement("div");
        actions.className = "nav-actions";
        nav.appendChild(actions);
      }

      const looseElements = nav.querySelectorAll(
        ":scope > .nav-back, :scope > .peraturan-nav-back, :scope > .paskus-language-switcher, :scope > .paskus-structural-header-cta, :scope > .btn-discord, :scope > .discord-link"
      );
      looseElements.forEach((el) => {
        actions.appendChild(el);
      });

      // Force recalculation by dispatching a resize event
      window.dispatchEvent(new Event("resize"));
    };

    cleanupNavbar();
    const cleanTimer1 = setTimeout(cleanupNavbar, 80);
    const cleanTimer2 = setTimeout(cleanupNavbar, 250);
    const cleanTimer3 = setTimeout(cleanupNavbar, 500);

    return () => {
      clearTimeout(cleanTimer1);
      clearTimeout(cleanTimer2);
      clearTimeout(cleanTimer3);
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen text-[#f7f8f2]">
      {/* Batang Progres Scroll Taktis */}
      <div className="paskus-scroll-progress" style={{ width: `${scrollPct}%` }} />
      {/* Urutan Boot Layar Muat Taktis */}
      <Loading />
      {/* Cahaya Ambient Kursor Interaktif */}
      <div className="cursor-glow" ref={glowRef} />
      {/* Efek Overlay Scanline Visual */}
      <div className="overlay-grid" />
      <AppRouter />
    </div>
  );
};

export default App;
