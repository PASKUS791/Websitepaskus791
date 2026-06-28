import React from "react";
import { getImageUrl, getVideoUrl } from "@/utils/assets";

const HeroSection = () => {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="page-section active min-h-screen relative flex items-center justify-center paskus-video-home">
      {/* Video Background */}
      <div className="paskus-landing-video-bg is-ready" aria-hidden="true">
        <video className="paskus-video-media" autoPlay loop playsInline preload="metadata" poster={getImageUrl("paskus-landing-download3-poster-v1.jpg")} aria-label="PASKUS landing video background" muted>
          <source src={getVideoUrl("paskus-landing-download3-6-45-v1.webm")} type="video/webm" />
          <source src={getVideoUrl("paskus-landing-download3-6-45-v1.mp4")} type="video/mp4" />
        </video>
      </div>
      
      {/* Content */}
      <div className="z-10 text-center px-4 max-w-4xl">
        <h1 className="text-6xl md:text-9xl heading-font text-sage mb-2 leading-none">
          <span className="paskus-hero-name">PASKUS Gi1</span>
          <span className="paskus-hero-unit">| So - 791</span>
        </h1>
        <p className="text-[#EFBF04] heading-font tracking-[0.8em] text-sm md:text-xl mb-6 opacity-80">
          PASKUS Gi1 | So-791 adalah resimen BRM5 roleplay Indonesia yang membangun disiplin komando, komunikasi satu kanal, jalur unit khusus, dinas pendukung, streamer hub, dan pendaftaran personel resmi melalui Discord PASKUS.
        </p>
        <div className="max-w-2xl mx-auto mb-12 paskus-home-lead-panel">
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed tracking-wide backdrop-blur-sm bg-black/20 p-4 border-l border-gold/50 paskus-home-lead-text">
            Modul Pengenalan Unit dan Dinas So-791 menjadi dasar penjelasan kemampuan tempur, tugas unit, dinas khusus, serta jalur komitmen anggota. Setiap personel diarahkan melalui parameter komunikasi, struktur tugas, komando, karakter, dan efektivitas agar penempatan selaras dengan potensi individu.
          </p>
        </div>
        <div className="paskus-hero-motto">
          <strong>Silere Impetum</strong>
          <span>Komando taktis Blackhawk Rescue Mission 5 dengan budaya disiplin, koordinasi jelas, operasi terarah, dan ruang berkembang bagi setiap personel.</span>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button onClick={() => scrollToId("enlist")} className="btn-enlist px-12 py-5 heading-font text-xs font-bold w-full md:w-auto">
            ENLIST PERSONNEL
          </button>
          <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noreferrer" className="btn-outline-white px-12 py-5 heading-font text-xs w-full md:w-auto flex items-center justify-center gap-2">
            JOIN DISCORD HUB
          </a>
        </div>
        <button type="button" onClick={() => scrollToId("combat")} className="paskus-home-scroll" aria-label="Scroll untuk menjelajah">
          <span className="paskus-home-scroll__icon" aria-hidden="true"></span>
          <span>Scroll untuk menjelajah</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
