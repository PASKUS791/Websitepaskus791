/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Shared / Auth Session Loader
 * Purpose: State loading penuh layar saat frontend memeriksa sesi auth ke server.
 */

import paskusLogo from "../assets/images/paskus.webp";

export default function AuthSessionLoader({
  eyebrow = "Secure Session",
  title = "Memeriksa sesi server...",
  message = "Mohon tunggu sebentar, koneksi autentikasi sedang disiapkan.",
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06090b] px-4 font-sans text-stone-100">
      <div className="w-full max-w-lg rounded-[28px] border border-white/8 bg-white/[0.04] px-8 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        <div className="mb-5 flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-lime-300/15 bg-black/30">
            <img
              src={paskusLogo}
              alt="Paskus 791"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-11 w-11 object-contain"
            />
          </div>
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.32em] text-lime-300/80">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-sans text-2xl font-bold text-stone-100">{title}</h1>
          </div>
        </div>
        <p className="mt-3 text-sm leading-7 text-stone-300">{message}</p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-[linear-gradient(90deg,#84A98C_0%,#E9C349_100%)]" />
        </div>
      </div>
    </div>
  );
}
