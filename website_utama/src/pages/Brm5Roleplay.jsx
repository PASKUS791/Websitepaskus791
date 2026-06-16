import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Shield, BookOpen, UserPlus, Users, ArrowRight } from "lucide-react";

const Brm5Roleplay = () => {
  return (
    <>
      <Helmet>
        <title>Resimen BRM5 Roleplay Indonesia | PASKUS Gi1</title>
        <meta
          name="description"
          content="PASKUS Gi1 adalah resimen BRM5 roleplay Indonesia untuk pemain Blackhawk Rescue Mission 5 yang mencari roleplay grup BRM5, fraksi, unit, dan pendaftaran resmi."
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
            // Blackhawk Rescue Mission 5 Roleplay
          </p>
          <h1 className="text-4xl md:text-7xl font-black heading-font text-white uppercase tracking-wider mb-6 leading-none">
            Resimen BRM5 <span className="text-[#8a9a5b]">Roleplay</span>
          </h1>
          <p className="max-w-3xl text-gray-300 text-xs md:text-sm leading-relaxed mb-8">
            PASKUS Gi1 adalah roleplay grup BRM5 Indonesia untuk pemain Blackhawk Rescue Mission 5 yang mencari komunitas taktis, fraksi roleplay, pendaftaran personel, unit tempur, dinas non-tempur, dan struktur resimen yang tertata melalui Discord resmi So-791.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#enlist"
              className="px-8 py-4 bg-[#EFBF04] text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#efbf04]/90 transition heading-font text-center shadow-lg shadow-[#efbf04]/20"
            >
              Daftar Personel
            </a>
            <Link
              to="/unit-brm5-paskus"
              className="px-8 py-4 border border-[#8a9a5b]/40 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition heading-font text-center"
            >
              Lihat Unit Tempur
            </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <BookOpen size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Roleplay Grup BRM5
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Website ini menjadi pusat informasi resmi PASKUS Gi1 untuk game BRM5 roleplay, mulai dari identitas resimen, jalur pendaftaran, pembagian golongan, sampai pengenalan unit dan dinas.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Shield size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Unit dan Fraksi
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              PASKUS Gi1 memiliki unit tempur, unit reguler, dan dinas non-tempur yang diarahkan untuk menjaga pengalaman roleplay Blackhawk Rescue Mission 5 tetap tertib, komunikatif, dan konsisten.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <UserPlus size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Pendaftaran Resmi
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Calon anggota melakukan sinkronisasi Discord, mengisi data pendaftaran, memilih golongan waktu aktif, lalu menunggu arahan perekrut atau pelatih sesuai prosedur resimen.
            </p>
          </div>
        </section>

        {/* SEO / FAQ Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
          <div>
            <h3 className="text-xs font-bold text-[#EFBF04] uppercase tracking-widest heading-font mb-2">
              Dicari Sebagai
            </h3>
            <ul className="text-gray-400 text-xs space-y-1.5 list-disc list-inside">
              <li>Resimen BRM5</li>
              <li>Game BRM5 roleplay</li>
              <li>Roleplay grup BRM5</li>
              <li>Blackhawk Rescue Mission 5 roleplay fraksi</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#EFBF04] uppercase tracking-widest heading-font mb-2">
              Nama Resmi
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Nama utama website ini adalah PASKUS Gi1. Sebutan lain yang sering digunakan adalah Paskus791, PASKUS Gi1, So-791, dan PASKUS So-791.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#EFBF04] uppercase tracking-widest heading-font mb-2">
              Arah Pengunjung
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Pengunjung baru dapat membuka home untuk melihat unit, membuka about untuk memahami identitas resimen, atau langsung menuju pendaftaran jika ingin bergabung.
            </p>
          </div>
        </section>

        {/* Footer Sub-Links */}
        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest text-center md:text-left">
            PASKUS Gi1 · Pusat Informasi BRM5 Indonesia
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-wider text-[#EFBF04] heading-font">
            <Link to="/resimen-brm5" className="hover:text-white transition">Resimen BRM5</Link>
            <span>·</span>
            <Link to="/roleplay-grup-brm5" className="hover:text-white transition">Grup RP</Link>
            <span>·</span>
            <Link to="/cara-gabung-brm5-roleplay" className="hover:text-white transition">Cara Gabung</Link>
            <span>·</span>
            <Link to="/unit-brm5-paskus" className="hover:text-white transition">Unit PASKUS</Link>
            <span>·</span>
            <Link to="/blackhawk-rescue-5-roleplay-fraksi" className="hover:text-white transition">Fraksi BRM5</Link>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Brm5Roleplay;
