import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { KeyRound, FileText, Clock } from "lucide-react";

const CaraGabungBrm5 = () => {
  return (
    <>
      <Helmet>
        <title>Cara Gabung BRM5 Roleplay PASKUS Gi1 | Pendaftaran Discord</title>
        <meta
          name="description"
          content="Panduan singkat cara gabung BRM5 roleplay PASKUS Gi1 melalui sinkronisasi Discord, pendaftaran personel, pemilihan golongan, dan arahan perekrut So-791."
        />
      </Helmet>

      {/* Page background */}
      <div className="page-bg fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#030504] via-[#060a07] to-[#040705]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(138,154,91,0.15) 0%, transparent 45%),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 30px 30px, 30px 30px",
          }}
        />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Hero Section */}
        <section className="rounded-3xl border border-[#8a9a5b]/20 bg-[#0e1410]/70 backdrop-blur-xl p-8 md:p-16 shadow-2xl mb-8">
          <p className="text-[#EFBF04] text-xs font-black tracking-widest uppercase mb-3 heading-font">
            Pendaftaran PASKUS Gi1
          </p>
          <h1 className="text-4xl md:text-7xl font-black heading-font text-white uppercase tracking-wider mb-6 leading-none">
            Cara Gabung <span className="text-[#8a9a5b]">PASKUS RP</span>
          </h1>
          <p className="max-w-3xl text-gray-300 text-xs md:text-sm leading-relaxed mb-8">
            Alur masuk PASKUS Gi1 dibuat melalui website utama agar data calon anggota lebih rapi. Sinkronisasi Discord dipakai untuk pendataan, lalu pendaftaran diteruskan ke proses perekrut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#enlist"
              className="px-8 py-4 bg-[#EFBF04] text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#efbf04]/90 transition heading-font text-center shadow-lg shadow-[#efbf04]/20"
            >
              Buka Form Pendaftaran
            </a>
            <a
              href="https://discord.gg/aaBR9ruFva"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border border-[#8a9a5b]/40 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition heading-font text-center"
            >
              Masuk Discord
            </a>
            <Link
              to="/brm5-roleplay"
              className="px-8 py-4 border border-white/20 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition heading-font text-center"
            >
              Info BRM5
            </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <KeyRound size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              1. Sinkron Discord
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Calon anggota melakukan sinkronisasi Discord agar identitas dapat dipakai untuk pendataan internal resimen dan automasi pendaftaran.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <FileText size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              2. Isi Data
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Data pendaftaran diisi melalui form personel, termasuk nama Roblox, status, perangkat, jalur masuk, dan golongan waktu aktif.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Clock size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              3. Tunggu Arahan
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Setelah data masuk, perekrut atau pelatih akan menindaklanjuti sesuai kebutuhan screening dan pelatihan awal So-791.
            </p>
          </div>
        </section>

        {/* Footer Sub-Links */}
        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest text-center md:text-left">
            PASKUS Gi1 · Cara Gabung BRM5 Roleplay PASKUS Gi1
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-wider text-[#EFBF04] heading-font">
            <Link to="/unit-brm5-paskus" className="hover:text-white transition">Unit PASKUS</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-white transition">About</Link>
            <span>·</span>
            <Link to="/struktural" className="hover:text-white transition">Struktural</Link>
          </div>
        </footer>
      </main>
    </>
  );
};

export default CaraGabungBrm5;
