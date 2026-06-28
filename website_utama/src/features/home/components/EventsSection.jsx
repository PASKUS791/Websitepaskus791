import React from "react";

const EventsSection = () => {
  return (
    <>
      {/* Special Events Type Section */}
      <section className="paskus-module-events">
        <div className="paskus-module-inner">
          <div className="paskus-module-heading">
            <div className="paskus-module-kicker">Jenis Event Khusus</div>
            <h2>Full RP, Non RP, Dan Scenario Training</h2>
            <p>
              Kegiatan So-791 dirancang untuk memperkuat strategi, roleplay, koordinasi, dan kesiapan anggota dalam operasi internal maupun eksternal.
            </p>
          </div>
          <div className="paskus-module-grid">
            <article className="paskus-module-card">
              <h3>PVE Vanilla Scenario</h3>
              <p>Misi berbasis Map Vanilla Ronograd untuk menguatkan pengalaman taktis, koordinasi, dan roleplay semi sampai hardcore.</p>
            </article>
            <article className="paskus-module-card">
              <h3>PVE Custom Scenario</h3>
              <p>
                Misi custom yang dibuat untuk memenuhi aspek strategi. Beberapa skenario dapat terinspirasi dari kejadian nyata agar pengalaman operasi terasa lebih hidup.
              </p>
            </article>
            <article className="paskus-module-card">
              <h3>Internal PVP</h3>
              <p>Kegiatan fun deathmatch atau competitive 5v5, 10v10, sampai 15v15 yang dijalankan di map custom oleh koordinator event.</p>
            </article>
            <article className="paskus-module-card">
              <h3>External PVP</h3>
              <p>Competitive match bersama resimen atau komunitas lain untuk menguji taktik, disiplin, dan kerja sama lintas satuan.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Golongan Training Schedule Section */}
      <section className="paskus-module-events paskus-module-golongan">
        <div className="paskus-module-inner">
          <div className="paskus-module-heading">
            <div className="paskus-module-kicker">Pembagian Golongan Latihan</div>
            <h2>Waktu Aktif Pagi Dan Malam</h2>
            <p>
              Golongan dipakai untuk membantu penjadwalan pelatihan agar kandidat masuk ke rentang waktu yang paling sesuai dengan aktivitasnya.
            </p>
          </div>
          <div className="paskus-module-grid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
            <article className="paskus-module-card">
              <h3>Golongan 1</h3>
              <p>Penjadwalan untuk pagi sampai siang menjelang sore. Pilihan ini cocok untuk anggota yang aktif di rentang awal hari.</p>
            </article>
            <article className="paskus-module-card">
              <h3>Golongan 2</h3>
              <p>Penjadwalan untuk sore sampai malam. Pilihan ini cocok untuk anggota yang lebih aktif setelah jam siang.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventsSection;
