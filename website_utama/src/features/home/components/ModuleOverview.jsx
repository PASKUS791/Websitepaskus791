import React from "react";

const ModuleOverview = () => {
  return (
    <section className="paskus-module-overview">
      <div className="paskus-module-inner">
        <div className="paskus-module-heading">
          <div className="paskus-module-kicker">Modul Pengenalan Unit dan Dinas So-791</div>
          <h2>Analisa Kemampuan, Karir, Dan Penempatan</h2>
          <p>
            Modul Pengenalan Unit dan Dinas So-791 menjadi dasar penjelasan kemampuan tempur, tugas unit, dinas khusus, serta jalur komitmen anggota. Setiap personel diarahkan melalui parameter komunikasi, struktur tugas, komando, karakter, dan efektivitas agar penempatan selaras dengan potensi individu.
          </p>
        </div>
        <div className="paskus-module-stats">
          <div className="paskus-module-stat">
            <strong>500+</strong>
            <span>Personel Reguler</span>
          </div>
          <div className="paskus-module-stat">
            <strong>150+</strong>
            <span>Personel Unit Khusus</span>
          </div>
          <div className="paskus-module-stat">
            <strong>2.5K+</strong>
            <span>Bergabung Discord</span>
          </div>
        </div>
        <div className="paskus-module-grid">
          <article className="paskus-module-card">
            <h3>Latar Belakang</h3>
            <p>
              Perbedaan pengalaman tempur menjadi tolak ukur penting dalam menilai kesiapan prajurit. Komunikasi, struktur tugas, komando, dan konsistensi menjadi dasar apakah individu cocok masuk ke unit atau dinas yang dipilih.
            </p>
          </article>
          <article className="paskus-module-card">
            <h3>Strategi dan Prioritas</h3>
            <p>
              Setiap unit khusus dan dinas memiliki fokus, disiplin, karakter, serta strategi yang berbeda. Penempatan terbaik lahir dari kerja sama, adaptasi, dan kecocokan individu terhadap budaya tugas di dalam satuan.
            </p>
          </article>
          <article className="paskus-module-card">
            <h3>Alur Pendaftaran</h3>
            <p>
              Individu yang siap berkomitmen akan melalui wawancara, uji kemampuan, uji karakter dan bakat, lalu masa pra-dinas. Alur ini menjaga agar pilihan tugas dijalankan secara berkelanjutan.
            </p>
          </article>
          <article className="paskus-module-card">
            <h3>Event dan Operasi</h3>
            <p>
              Kegiatan mencakup PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, dan External PVP. Skenario disusun untuk membangun strategi, pengalaman taktis, dan kualitas roleplay.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ModuleOverview;
