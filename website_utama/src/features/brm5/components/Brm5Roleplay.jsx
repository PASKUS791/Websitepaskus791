import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getImageUrl } from "@/utils/assets";

const Brm5RoleplayFeature = () => {
  return (
    <>
      {/* Background container */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[rgba(6,8,7,0.72)] to-[#060807] pointer-events-none"></div>
      <div
        className="fixed inset-0 z-[-2] bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('${getImageUrl("about.webp")}')` }}
      ></div>

      <Navbar />

      <main className="w-[min(1120px,calc(100%-32px))] mx-auto pt-24 pb-14 text-[#f7f8f2] font-sans">

        <section className="mt-7 p-[clamp(28px,6vw,70px)] rounded-[22px] md:rounded-[28px] border border-[#d5b849]/30 bg-[#0e1410]/80 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <p className="m-0 mb-3.5 text-[#f0c73f] font-black tracking-[0.12em] uppercase">
            Blackhawk Rescue Mission 5 Roleplay
          </p>
          <h1 className="max-w-[920px] m-0 text-[clamp(2.25rem,7vw,5.7rem)] leading-[0.96] font-bold">
            Resimen BRM5 Roleplay Indonesia PASKUS Gi1
          </h1>
          <p className="max-w-[760px] mt-6 text-[#b9c1b5] text-[clamp(1rem,2vw,1.25rem)] leading-[1.75]">
            PASKUS Gi1 adalah roleplay grup BRM5 Indonesia untuk pemain Blackhawk Rescue Mission 5
            yang mencari komunitas taktis, fraksi roleplay, pendaftaran personel, unit tempur,
            dinas non-tempur, dan struktur resimen yang tertata melalui Discord resmi So-791.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              className="inline-flex items-center justify-center min-h-[46px] px-[18px] rounded-full border border-[#d5b849]/30 bg-[rgba(240,199,63,0.12)] text-[#f7f8f2] font-bold hover:bg-[rgba(240,199,63,0.2)] transition-colors"
              href="/#enlist"
            >
              Daftar Personel
            </a>
            <a
              className="inline-flex items-center justify-center min-h-[46px] px-[18px] rounded-full border border-[#d5b849]/30 bg-[rgba(240,199,63,0.12)] text-[#f7f8f2] font-bold hover:bg-[rgba(240,199,63,0.2)] transition-colors"
              href="/#combat"
            >
              Lihat Unit Tempur
            </a>
            <a
              className="inline-flex items-center justify-center min-h-[46px] px-[18px] rounded-full border border-[#d5b849]/30 bg-[rgba(240,199,63,0.12)] text-[#f7f8f2] font-bold hover:bg-[rgba(240,199,63,0.2)] transition-colors"
              href="/about"
            >
              Tentang PASKUS
            </a>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4" aria-label="Informasi BRM5 roleplay PASKUS">
          <article className="min-h-[210px] p-6 rounded-[20px] border border-[#d5b849]/30 bg-[#0e1410]/80 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <h2 className="m-0 mb-3 text-[#f0c73f] text-[1.1rem] uppercase font-bold">
              Roleplay Grup BRM5
            </h2>
            <p className="text-[#b9c1b5] leading-[1.7]">
              Website ini menjadi pusat informasi resmi PASKUS Gi1 untuk game BRM5 roleplay,
              mulai dari identitas resimen, jalur pendaftaran, pembagian golongan, sampai
              pengenalan unit dan dinas.
            </p>
          </article>
          <article className="min-h-[210px] p-6 rounded-[20px] border border-[#d5b849]/30 bg-[#0e1410]/80 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <h2 className="m-0 mb-3 text-[#f0c73f] text-[1.1rem] uppercase font-bold">
              Unit dan Fraksi
            </h2>
            <p className="text-[#b9c1b5] leading-[1.7]">
              PASKUS Gi1 memiliki unit tempur, unit reguler, dan dinas non-tempur yang
              diarahkan untuk menjaga pengalaman roleplay Blackhawk Rescue Mission 5 tetap
              tertib, komunikatif, dan konsisten.
            </p>
          </article>
          <article className="min-h-[210px] p-6 rounded-[20px] border border-[#d5b849]/30 bg-[#0e1410]/80 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <h2 className="m-0 mb-3 text-[#f0c73f] text-[1.1rem] uppercase font-bold">
              Pendaftaran Resmi
            </h2>
            <p className="text-[#b9c1b5] leading-[1.7]">
              Calon anggota melakukan sinkronisasi Discord, mengisi data pendaftaran,
              memilih golongan waktu aktif, lalu menunggu arahan perekrut atau pelatih
              sesuai prosedur resimen.
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4" aria-label="Keyword pencarian terkait">
          <article className="min-h-[210px] p-6 rounded-[20px] border border-[#d5b849]/30 bg-[#0e1410]/80 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <h2 className="m-0 mb-3 text-[#f0c73f] text-[1.1rem] uppercase font-bold">
              Dicari Sebagai
            </h2>
            <ul className="text-[#b9c1b5] leading-[1.7] pl-[18px] list-disc">
              <li>resimen BRM5</li>
              <li>game BRM5 roleplay</li>
              <li>roleplay grup BRM5</li>
              <li>Blackhawk Rescue Mission 5 roleplay fraksi</li>
            </ul>
          </article>
          <article className="min-h-[210px] p-6 rounded-[20px] border border-[#d5b849]/30 bg-[#0e1410]/80 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <h2 className="m-0 mb-3 text-[#f0c73f] text-[1.1rem] uppercase font-bold">
              Nama Resmi
            </h2>
            <p className="text-[#b9c1b5] leading-[1.7]">
              Nama utama website ini adalah PASKUS Gi1. Sebutan lain yang sering digunakan
              adalah Paskus791, PASKUS Gi1, So-791, dan PASKUS So-791.
            </p>
          </article>
          <article className="min-h-[210px] p-6 rounded-[20px] border border-[#d5b849]/30 bg-[#0e1410]/80 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <h2 className="m-0 mb-3 text-[#f0c73f] text-[1.1rem] uppercase font-bold">
              Arah Pengunjung
            </h2>
            <p className="text-[#b9c1b5] leading-[1.7]">
              Pengunjung baru dapat membuka home untuk melihat unit, membuka about untuk
              memahami identitas resimen, atau langsung menuju pendaftaran jika ingin bergabung.
            </p>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Brm5RoleplayFeature;
