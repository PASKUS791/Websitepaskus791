import React from "react";
import { Link } from "react-router";
import { Shield, BookOpen, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ResimenBrm5Feature = () => {
  return (
    <>
      {/* Page background */}
      <div className="page-bg fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#030504] via-[#060a07] to-[#040705]">
        <div className="absolute inset-0 opacity-10 page-bg-grid" />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Hero Section */}
        <section className="rounded-3xl border border-[#8a9a5b]/20 bg-[#0e1410]/70 backdrop-blur-xl p-8 md:p-16 shadow-2xl mb-8">
          <p className="text-[#EFBF04] text-xs font-black tracking-widest uppercase mb-3 heading-font">
            Resimen BRM5 Indonesia
          </p>
          <h1 className="text-4xl md:text-7xl font-black heading-font text-white uppercase tracking-wider mb-6 leading-none">
            PASKUS Gi1 <span className="text-[#8a9a5b]">Resimen RP</span>
          </h1>
          <p className="max-w-3xl text-gray-300 text-xs md:text-sm leading-relaxed mb-8">
            PASKUS Gi1 adalah pusat informasi resmi So-791 untuk pemain BRM5 yang mencari resimen roleplay Indonesia dengan sistem pendaftaran, pengenalan unit, dinas non-tempur, struktural, dan koordinasi melalui Discord.
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
              Lihat Unit
            </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Shield size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Identitas Resimen
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              PASKUS Gi1 memakai struktur So-791 sebagai identitas komunitas taktis yang fokus pada roleplay BRM5 tertib, komunikatif, dan konsisten.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <Users size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Jalur Personel
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Calon anggota masuk melalui sinkronisasi Discord, pendaftaran awal, pemeriksaan data, dan arahan perekrut sebelum mengikuti tahap lanjutan.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#8a9a5b]/30 transition group">
            <div className="w-10 h-10 rounded-xl bg-[#8a9a5b]/10 border border-[#8a9a5b]/20 flex items-center justify-center text-[#8a9a5b] mb-4">
              <BookOpen size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider heading-font mb-2 group-hover:text-[#EFBF04] transition">
              Unit dan Dinas
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Resimen memiliki unit tempur, pasukan reguler, dan dinas non-tempur agar anggota punya ruang pengembangan peran sesuai kebutuhan roleplay.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ResimenBrm5Feature;
