import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { MessagesSquare, Users, UserCheck } from "lucide-react";

const RoleplayGrupBrm5 = () => {
  return (
    <>
      <Helmet>
        <title>Roleplay Grup BRM5 Indonesia | PASKUS Gi1</title>
        <meta
          name="description"
          content="PASKUS Gi1 adalah roleplay grup BRM5 Indonesia untuk Blackhawk Rescue Mission 5 dengan komunitas Discord, pendaftaran anggota, unit tempur, dan struktur So-791."
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
            Roleplay Grup BRM5
          </p>
          <h1 className="text-4xl md:text-7xl font-black heading-font text-white uppercase tracking-wider mb-6 leading-none">
            Komunitas Taktis <span className="text-[#8a9a5b]">PASKUS Gi1</span>
          </h1>
          <p className="max-w-3xl text-gray-300 text-xs md:text-sm leading-relaxed mb-8">
            Roleplay grup BRM5 PASKUS Gi1 menempatkan komunikasi, disiplin, dan karakter sebagai dasar bermain. Website ini membantu calon anggota memahami arah komunitas sebelum masuk ke Discord dan mengikuti pendaftaran.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#enlist"
              className="px-8 py-4 bg-[#EFBF04] text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#efbf04]/90 transition heading-font text-center shadow-lg shadow-[#efbf04]/20"
            >
              Mulai Pendaftaran
            </a>
            <Link
              to="/about"
              className="px-8 py-4 border border-[#8a9a5b]/40 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition heading-font text-center"
            >
              Kenali PASKUS
            </Link>
            <Link
              to="/struktural"
              className="px-8 py-4 border border-[#8a9a5b]/40 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/10 transition heading-font text-center"
            >
              Struktural
            </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <MessagesSquare size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Komunikasi
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Koordinasi dibuat jelas agar anggota baru dan lama dapat mengikuti ritme latihan, operasi, dan arahan komando.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <UserCheck size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Disiplin Roleplay
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Disiplin dijaga sebagai kebiasaan bermain, bukan sekadar formalitas, sehingga pengalaman BRM5 terasa lebih rapi.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Users size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Ruang Berkembang
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Anggota dapat mengenal unit tempur, pasukan reguler, dan dinas untuk menemukan peran yang sesuai.
            </p>
          </div>
        </section>

        {/* Footer Sub-Links */}
        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest text-center md:text-left">
            PASKUS Gi1 · Roleplay Grup BRM5 Indonesia
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-wider text-[#EFBF04] heading-font">
            <Link to="/cara-gabung-brm5-roleplay" className="hover:text-white transition">Cara Gabung</Link>
            <span>·</span>
            <Link to="/unit-brm5-paskus" className="hover:text-white transition">Unit BRM5</Link>
            <span>·</span>
            <Link to="/blackhawk-rescue-5-roleplay-fraksi" className="hover:text-white transition">Fraksi BRM5</Link>
          </div>
        </footer>
      </main>
    </>
  );
};

export default RoleplayGrupBrm5;
