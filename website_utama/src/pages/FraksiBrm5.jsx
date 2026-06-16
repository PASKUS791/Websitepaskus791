import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Compass, Shield, Heart } from "lucide-react";

const FraksiBrm5 = () => {
  return (
    <>
      <Helmet>
        <title>Blackhawk Rescue 5 Roleplay Fraksi Indonesia | PASKUS Gi1</title>
        <meta
          name="description"
          content="PASKUS Gi1 adalah fraksi dan resimen roleplay Blackhawk Rescue Mission 5 Indonesia dengan Discord resmi, unit So-791, pendaftaran personel, dan struktur komunitas."
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
            Blackhawk Rescue Mission 5
          </p>
          <h1 className="text-4xl md:text-7xl font-black heading-font text-white uppercase tracking-wider mb-6 leading-none">
            Fraksi RP <span className="text-[#8a9a5b]">PASKUS Gi1</span>
          </h1>
          <p className="max-w-3xl text-gray-300 text-xs md:text-sm leading-relaxed mb-8">
            PASKUS Gi1 hadir sebagai fraksi roleplay Blackhawk Rescue Mission 5 Indonesia yang menekankan identitas resimen, koordinasi Discord, pengenalan unit, dan alur pendaftaran yang dapat dicek melalui website utama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/brm5-roleplay"
              className="px-8 py-4 bg-[#EFBF04] text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#efbf04]/90 transition heading-font text-center shadow-lg shadow-[#efbf04]/20"
            >
              Pusat BRM5
            </Link>
            <Link
              to="/unit-brm5-paskus"
              className="px-8 py-4 border border-[#8a9a5b]/40 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition heading-font text-center"
            >
              Unit PASKUS
            </Link>
            <a
              href="/#enlist"
              className="px-8 py-4 border border-white/20 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition heading-font text-center"
            >
              Daftar
            </a>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Compass size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Fraksi Tertata
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Identitas So-791 membantu anggota memahami struktur, jalur komunikasi, dan tugas roleplay yang dijalankan.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Shield size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Discord Resmi
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Discord digunakan sebagai pusat koordinasi dan pendataan agar perekrut, pelatih, dan anggota dapat mengikuti alur yang sama.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Heart size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Website Utama
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Website menjadi pintu utama untuk mengenal PASKUS, melihat unit, membaca about, dan melakukan pendaftaran personel.
            </p>
          </div>
        </section>

        {/* Footer Sub-Links */}
        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest text-center md:text-left">
            PASKUS Gi1 · Faksi BRM5 Roleplay Indonesia
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-wider text-[#EFBF04] heading-font">
            <Link to="/resimen-brm5" className="hover:text-white transition">Resimen BRM5</Link>
            <span>·</span>
            <Link to="/cara-gabung-brm5-roleplay" className="hover:text-white transition">Cara Gabung</Link>
            <span>·</span>
            <Link to="/roleplay-grup-brm5" className="hover:text-white transition">Roleplay Grup</Link>
          </div>
        </footer>
      </main>
    </>
  );
};

export default FraksiBrm5;
