import React, { useEffect } from "react";
import { Link } from "react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getImageUrl } from "@/utils/assets";

const AboutFeature = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="paskus-about-page" data-about-version="20260521-id" data-about-language="id">
      <Navbar />

      <main>
        <section className="about-hero">
          <div className="about-hero-inner">
            <div>
              <div className="about-kicker">About PASKUS Gi1</div>
              <h1>PASKUS Gi1 <span>Identity, Culture, Command</span></h1>
              <p className="about-lead">
                Halaman ini menjadi ruang pengenalan identitas resimen: bagaimana komunitas menjaga disiplin, 
                komunikasi, dan budaya bermain yang rapi tanpa mengulang daftar unit, dinas, alur pendaftaran, 
                atau event yang sudah tersedia di halaman utama.
              </p>
              <div className="about-actions">
                <Link to="/">Kembali Ke Home</Link>
                <a href="/#enlist">Enlist Personnel</a>
                <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noreferrer">Join Discord</a>
              </div>
            </div>
            <aside className="about-command-panel">
              <h2>Fokus Halaman</h2>
              
              <div className="about-command-row">
                <span>Identitas</span>
                <p>Profil ringkas komunitas, gaya komunikasi, dan standar sikap anggota.</p>
              </div>
            
              <div className="about-command-row">
                <span>Budaya</span>
                <p>Cara kami menjaga disiplin tanpa membuat interaksi terasa kaku atau tidak manusiawi.</p>
              </div>
            
              <div className="about-command-row">
                <span>Akses Cepat</span>
                <p>Pengarah ke section home untuk unit, dinas, enlist, dan Discord tanpa mengulang kontennya.</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="about-section about-identity-section">
          <div className="about-split">
            <div className="about-image-frame">
              <img alt="Operasi So-791" src={getImageUrl("t2.webp")} loading="eager" decoding="async" fetchPriority="high" />
            </div>
            <div>
              <div className="about-section-header">
                <div className="about-kicker">Identitas Resimen</div>
                <h2>Rapi Dalam Komando, Nyaman Dalam Komunitas</h2>
                <p>
                  PASKUS Gi1 dibangun sebagai komunitas taktis yang mengutamakan pengalaman bermain yang tertib, 
                  komunikatif, dan berkarakter. Fokus utamanya bukan hanya menang dalam skenario, tetapi membentuk 
                  kebiasaan anggota agar mampu bekerja dalam komando, menghargai rekan, dan membawa suasana roleplay 
                  yang nyaman untuk jangka panjang.
                </p>
              </div>
              <div className="about-grid">
                <article className="about-card">
                  <h3>Komando Yang Terbaca</h3>
                  <p>Instruksi dibuat jelas, ringkas, dan mudah diikuti agar anggota baru maupun lama dapat memahami ritme kegiatan tanpa kebingungan.</p>
                </article>
              
                <article className="about-card">
                  <h3>Disiplin Yang Manusiawi</h3>
                  <p>Kedisiplinan dijaga sebagai kebiasaan bermain, bukan sekadar formalitas. Tegas saat bertugas, tetap sehat saat berinteraksi.</p>
                </article>
              
                <article className="about-card">
                  <h3>Komunikasi Satu Kanal</h3>
                  <p>Koordinasi dijaga agar informasi penting tidak tenggelam. Anggota dibiasakan memberi laporan yang singkat, relevan, dan dapat ditindaklanjuti.</p>
                </article>
              
                <article className="about-card">
                  <h3>Ruang Berkembang</h3>
                  <p>Setiap anggota diberi ruang menemukan kecocokan peran melalui observasi, latihan, dan kontribusi yang konsisten.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-header center">
            <div className="about-kicker">Pengalaman Anggota</div>
            <h2>Ritme Yang Membantu Anggota Baru Cepat Nyambung</h2>
            <p>
              Bagian ini menjelaskan suasana perjalanan anggota secara umum. Detail pendaftaran, unit, dinas, 
              dan event tetap ditempatkan di home agar informasi utama tidak tersebar dua kali.
            </p>
          </div>
          <div className="about-grid">
            <article className="about-step" data-step="01">
              <h3>Masuk Dan Mengenal Kultur</h3>
              <p>Anggota diarahkan memahami etika komunikasi, cara membaca instruksi, dan kebiasaan dasar di lingkungan PASKUS.</p>
            </article>
          
            <article className="about-step" data-step="02">
              <h3>Ikut Kegiatan Dengan Ritme</h3>
              <p>Kegiatan dijalani bertahap agar anggota terbiasa dengan briefing, koordinasi, dan sikap saat berada di dalam skenario.</p>
            </article>
          
            <article className="about-step" data-step="03">
              <h3>Tunjukkan Konsistensi</h3>
              <p>Keaktifan, sikap, dan kemampuan bekerja sama menjadi sinyal utama sebelum anggota diarahkan ke jalur lanjutan.</p>
            </article>
          
            <article className="about-step" data-step="04">
              <h3>Pilih Arah Kontribusi</h3>
              <p>Setelah memahami kultur, anggota dapat melihat pilihan unit, dinas, atau pendaftaran melalui halaman utama.</p>
            </article>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-header center">
            <div className="about-kicker">Lanjutkan Dari Home</div>
            <h2>Akses Cepat Tanpa Mengulang Informasi</h2>
            <p>Home tetap menjadi pusat informasi detail. About hanya memberi konteks budaya dan arah navigasi supaya halaman terasa ringan, fokus, dan tidak berulang.</p>
          </div>
          <div className="about-grid">
            <article className="about-card">
              <h3>Enlist Personnel</h3>
              <p>Gunakan bagian pendaftaran di home untuk mengirim data awal anggota secara resmi.</p>
              <a className="about-unit-link" href="/#enlist">Buka Enlist</a>
            </article>
          
            <article className="about-card">
              <h3>Unit Tempur</h3>
              <p>Detail card, spesialisasi, dan halaman unit tetap berada di section Unit Tempur home.</p>
              <a className="about-unit-link" href="/#combat">Lihat Unit</a>
            </article>
          
            <article className="about-card">
              <h3>Dinas Non-Tempur</h3>
              <p>Informasi dinas dan detail page non-tempur dapat dibuka dari section Dinas di home.</p>
              <a className="about-unit-link" href="/#support">Lihat Dinas</a>
            </article>
          
            <article className="about-card">
              <h3>Discord Hub</h3>
              <p>Masuk ke Discord untuk komunikasi, koordinasi kegiatan, dan sinkronisasi identitas.</p>
              <a className="about-unit-link" href="https://discord.gg/aaBR9ruFva">Join Discord</a>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutFeature;
