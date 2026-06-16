import { useEffect } from "react";
import "./about.css";
import { perwira } from "../constant";
import { Helmet } from "react-helmet-async";

import gatam1 from "../assets/images/1.webp";
import gatam2 from "../assets/images/2.webp";
import gatam3 from "../assets/images/3.webp";
import gatam4 from "../assets/images/4.webp";
import gatam5 from "../assets/images/5.webp";
import gatam6 from "../assets/images/6.webp";
import gatam7 from "../assets/images/7.webp";
import gatam8 from "../assets/images/8.webp";
import gatam9 from "../assets/images/9.webp";
import gatam10 from "../assets/images/GATAM_2.webp";
import gatam11 from "../assets/images/GATAM_3.webp";
import gatam12 from "../assets/images/GATAM_4.webp";
import gatam13 from "../assets/images/GATAM_5.webp";
import gatam14 from "../assets/images/GATAM2.webp";
import toruk1 from "../assets/images/t1.webp";
import toruk2 from "../assets/images/t2.webp";


const About = () => {
  useEffect(() => {
    // Intro Screen Animation
    const overlay = document.getElementById("intro-overlay");
    const body = document.body;

    const timer = setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
      }
      body.style.overflow = "auto";
    }, 3000);

    // Scroll Animation Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("translate-y-10");
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      section.classList.add(
        "opacity-0",
        "translate-y-10",
        "transition-all",
        "duration-1000",
      );
      observer.observe(section);
    });

    return () => {
      clearTimeout(timer);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      <Helmet>
        {/* SEO Dasar */}
        <title>Tentang Kami PASKUS-791</title>
        <meta
          name="description"
          content="Mengenal PASKUS-791, komunitas Blackhawk Rescue Mission 5 (BRM5) yang mengedepankan integritas, loyalitas, dan persaudaraan. Berdiri sejak 2023."
        />
        <meta
          name="keywords"
          content="PASKUS 791, BRM5 Indonesia, Milsim Indonesia, Blackhawk Rescue Mission 5, Komunitas Roblox Milsim, Pasukan Khusus 791"
        />
        <meta name="author" content="PASKUS-791 Personnel & Culture Division" />

        {/* Open Graph / Facebook / Discord */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://paskus.s0791.com/about" />
        <meta
          property="og:title"
          content="PASKUS-791: Lebih Dari Sekadar Komunitas Milsim"
        />
        <meta
          property="og:description"
          content="Lahir dari visi disiplin militer dan nilai kemanusiaan. Temukan sejarah, hierarki, dan filosofi 'Satu Darah' kami."
        />
        <meta
          property="og:image"
          content="https://assets.zyrosite.com/SGk4m7ouaY1wMiRf/gemini_generated_image_nour15nour15nour-O5XfahYLNxZ5pvMY.png"
        />

        {/* Canonical Link (Menghindari Duplikat Konten) */}
        <link rel="canonical" href="https://paskus.so791.com/about" />
      </Helmet>
      <div id="intro-overlay">
        <div className="intro-content">
          <h1 className="heading-font text-white text-5xl md:text-7xl mb-4 tracking-[0.2em]">
            ABOUT US
          </h1>
          <p className="heading-font text-gold text-sm md:text-xl tracking-[0.8em] opacity-80">
            WE'RE FAMILY
          </p>
          <div className="w-32 h-px bg-sage-green/30 mx-auto mt-8 animate-pulse"></div>
        </div>
      </div>

      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-sage/20">
        <div className="heading-font text-white flex items-center">
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">PASKUS</span>
            <span className="text-[10px] text-sage tracking-widest uppercase">
              Personnel & Culture Division
            </span>
          </div>
        </div>
        <a
          href="/"
          className="heading-font text-[10px] text-gold border border-gold/50 px-4 py-2 hover:bg-gold hover:text-black transition"
        >
          KEMBALI KE HOME
        </a>
      </nav>

      <div id="main-content">
        <section className="hero-gradient h-[70vh] flex items-center justify-center relative overflow-hidden">
          <div className="scanline"></div>
          <div className="text-center z-10 px-6">
            <h1 className="text-5xl md:text-7xl heading-font text-white mb-4">
              MEREKA YANG <span className="text-gold">SETIA</span>
            </h1>
            <p className="text-sage heading-font tracking-[0.5em] text-sm uppercase">
              Lebih Dari Sekadar Komunitas Milsim
            </p>
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-font text-gold text-sm tracking-widest mb-4">
              // CHAIN OF COMMAND
            </h2>
            <h3 className="text-4xl heading-font text-white">
              STRUKTUR <span className="text-sage">HIRARKI</span> PASKUS 791
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-glass p-8 border-gold-left bg-gold/5">
              <h4 className="heading-font text-gold text-lg mb-4">
                PERWIRA TINGGI
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Kolonel</span>
                  <span className="text-xs text-sage italic">
                    Senior Officer
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Letnan Kolonel</span>
                  <span className="text-xs text-sage italic">
                    Field Commander
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Mayor</span>
                  <span className="text-xs text-sage italic">
                    Staff Officer
                  </span>
                </li>
              </ul>
            </div>

            <div className="card-glass p-8 border-gold-left">
              <h4 className="heading-font text-white text-lg mb-4">
                PERWIRA MUDA
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Kapten</span>
                  <span className="text-xs text-sage italic">
                    Company Leader
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Letnan Satu</span>
                  <span className="text-xs text-sage italic">
                    Platoon Leader
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Letnan Dua</span>
                  <span className="text-xs text-sage italic">
                    Section Leader
                  </span>
                </li>
              </ul>
            </div>

            <div className="card-glass p-8 border-gold-left">
              <h4 className="heading-font text-white text-lg mb-4">BINTARA</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Sersan Mayor</span>
                  <span className="text-xs text-sage italic">Master Sgt</span>
                </li>
                <li className="flex justify-between">
                  <span>Sersan Satu</span>
                  <span className="text-xs text-sage italic">First Sgt</span>
                </li>
                <li className="flex justify-between">
                  <span>Sersan Dua</span>
                  <span className="text-xs text-sage italic">Staff Sgt</span>
                </li>
              </ul>
            </div>

            <div className="card-glass p-8 border-gold-left">
              <h4 className="heading-font text-white text-lg mb-4">
                TAMTAMA SENIOR
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Kopral Kepala</span>
                  <span className="text-xs text-sage italic">
                    Chief Corporal
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Kopral Satu</span>
                  <span className="text-xs text-sage italic">
                    First Corporal
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Kopral Dua</span>
                  <span className="text-xs text-sage italic">Corporal</span>
                </li>
              </ul>
            </div>

            <div className="card-glass p-8 border-gold-left">
              <h4 className="heading-font text-white text-lg mb-4">
                TAMTAMA MUDA
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Prajurit Kepala</span>
                  <span className="text-xs text-sage italic">
                    Lance Corporal
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Prajurit Satu</span>
                  <span className="text-xs text-sage italic">
                    Private First className
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Prajurit Dua</span>
                  <span className="text-xs text-sage italic">Private</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-24 bg-sage/5 border-y border-sage/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="heading-font text-gold text-sm tracking-widest mb-4">
                // COMMISSIONED OFFICERS
              </h2>
              <h3 className="text-4xl heading-font text-white">
                JAJARAN <span className="text-gold">PERWIRA</span> AKTIF
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perwira.map((p, i) => (
                <div
                  className="card-glass p-6 border-b-2 border-b-gold"
                  key={i}
                >
                  <p className="text-[10px] text-gold heading-font mb-1">
                    {p.pangkat}
                  </p>
                  <h5 className="text-xl heading-font text-white">
                    {p.nama.map((x, w) => (
                      <p key={w}>{x}</p>
                    ))}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-font text-gold text-sm tracking-widest mb-4">
                // ASAL USUL KAMI
              </h2>
              <h3 className="text-4xl heading-font text-white mb-8">
                Latar Belakang <span className="text-sage">PASKUS-791</span>
              </h3>
              <div className="space-y-6 text-gray-400 leading-relaxed text-justify">
                <p>
                  Perbedaan Pengalaman Tempur menjadi pembeda yang cukup signifikan
                  yang dimana ini menjadi faktor penilaian dan tolak ukur kemampuan Prajurit
                  dalam komunikasi, struktur tugas, komando, dan lain sebagainya.
                  . Di Paskus 791 kami menilai setiap individu dengan parameter-parameter
                    yang sangat presisi untuk menilai apakah individu tersebut akan cocok
                    dalam unit yang dipilih dan apakah individu tersebut akan efektif dalam
                    struktur organisasi yang akan ia lanjutkan untuk berkarir sampai masa purna
                </p>
                <p>
                  Resimen tidak akan memaksa individu dalam kegiatan
                  berkarir dan berdinas paham inilah menjadi faktor yang
                  sangat ditekan karena kami percaya setiap individu
                  memiliki bakat dan potensi yang baik dalam pilihan tugas
                  yang akan diemban oleh Individu SO-791.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://assets.zyrosite.com/SGk4m7ouaY1wMiRf/gemini_generated_image_nour15nour15nour-O5XfahYLNxZ5pvMY.png"
                alt="Latar Belakang PASKUS"
                className="rounded shadow-2xl border border-sage/30"
              />
              <div className="absolute -bottom-6 -right-6 bg-gold text-black p-6 heading-font font-bold">
                EST. 2026
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#0a0a0a] border-y border-sage/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="heading-font text-gold text-sm tracking-widest mb-4">
                // CORE VALUES
              </h2>
              <h3 className="text-5xl heading-font text-white">
                LEBIH DARI <span className="text-sage">SENJATA</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-glass p-10">
                <div className="w-12 h-12 bg-sage/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-sage"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </div>
                <h4 className="heading-font text-xl text-white mb-4">
                  STRATEGI DAN PRIORITAS
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Setiap unit khusus dan Dinas non Tempur memiliki Strategi dan fokus yang
                  berbeda dengan satu sama lain, dan bukan hanya strategi dan prioritas saja
                  yang berbeda, setiap unit khusus memiliki ciri-ciri dan karakter yang
                  berbeda serta bagaimana karakter individu yang kuat dan adaptif akan lebih
                  condong dipakai untuk penerapan strategi dan kegiatan didalam unit, hal ini
                  sangat penting untuk diterapkan karena setiap unit khusus memiliki disiplin
                  yang berbeda-beda dan bagaimana penerapan setiap unit akan ditentukan
                  sebagaimana baiknya setiap individu saling kerja sama di unit tersebut.
                </p>
              </div>

              <div className="card-glass p-10 border-gold/40">
                <div className="w-12 h-12 bg-gold/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
                <h4 className="heading-font text-xl text-gold mb-4">
                  Keluarga Digital
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Game BRM5 hanyalah media, namun ikatan yang kita bangun adalah
                  nyata. Kami bercanda, bercerita, dan tumbuh bersama melampaui
                  batas layar monitor.
                </p>
              </div>

              <div className="card-glass p-10">
                <div className="w-12 h-12 bg-sage/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-sage"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                </div>
                <h4 className="heading-font text-xl text-white mb-4">
                  Disiplin Beretika
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tegas dalam bertugas, santun dalam bersosial. Kami menjaga
                  nama baik komunitas dengan perilaku profesional baik di dalam
                  maupun di luar game.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="heading-font text-gold text-sm tracking-widest mb-4">
              // VISUAL ARCHIVES
            </h2>
            <h3 className="text-4xl heading-font text-white">
              MOMEN <span className="text-sage">OPERASIONAL</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
              <img
                src={gatam1}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black opacity-60"></div>
              <p className="absolute bottom-4 left-4 heading-font text-xs text-gold">
                PATROLI RUTIN - SEKTOR ALPHA
              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
              <img
                src={gatam2}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative group overflow-hidden h-64">
              <img
                src={gatam3}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="md:col-span-2 relative group overflow-hidden h-64">
              <img
                src={gatam4}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <p className="absolute bottom-4 left-4 heading-font text-xs text-gold">
                BRIEFING OPERASI GABUNGAN
              </p>
            </div>
            <div className="md:col-span-2 relative group overflow-hidden h-64">
              <img
                src={gatam5}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <p className="absolute bottom-4 left-4 heading-font text-xs text-gold">
                
              </p>
            </div>
            <div className="md:col-span-2 relative group overflow-hidden h-64">
              <img
                src={gatam6}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <p className="absolute bottom-4 left-4 heading-font text-xs text-gold">
                
              </p>
            </div>
            <div className="md:col-span-2 relative group overflow-hidden h-64">
              <img
                src={gatam7}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <p className="absolute bottom-4 left-4 heading-font text-xs text-gold">
                
              </p>
            </div>
            <div className="md:col-span-2 relative group overflow-hidden h-64">
              <img
                src={gatam8}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <p className="absolute bottom-4 left-4 heading-font text-xs text-gold">
                
              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={gatam9}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">
                
              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={gatam10}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">

              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={gatam11}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">
                
              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={gatam12}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">
                
              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={gatam13}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">
               
              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={gatam14}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">
               
              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={toruk1}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">

              </p>
            </div>
            <div className="relative group overflow-hidden h-64">
               <img
                 src={toruk2}
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition duration-500"></div>
              <p className="absolute bottom-4 left-4 text-xs text-gold">
                Operasi udara
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-sage/5">
          <div className="max-w-4xl mx-auto px-6">
            <div className="border-gold-left pl-8 py-4">
              <h3 className="text-3xl heading-font text-white mb-6">
                Filosofi <span className="text-gold">Satu Darah</span>
              </h3>
              <p className="text-gray-300 text-justify mb-6 italic">
                "Di BRM5, peluru mungkin bisa menembus rompi kita, tapi mereka
                tidak akan pernah bisa memutus rantai persaudaraan yang kita
                bentuk."
              </p>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  Roleplay kami bukan hanya tentang menembak musuh AI atau
                  pemain lain. Fokus utama kami adalah
                  <span className="text-white">Interaksi Antar Personel</span>.
                  Kami menekankan komunikasi radio yang jernih, pergerakan
                  formasi yang sinkron, dan rasa saling percaya bahwa rekan di
                  sebelahmu akan melindungimu.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t border-sage/20 text-center">
          <p className="heading-font text-gray-600 text-[10px] tracking-[0.5em]">
            PASKUS - 791 // NO MAN LEFT BEHIND
          </p>
        </footer>
      </div>
    </>
  );
};

export default About;
