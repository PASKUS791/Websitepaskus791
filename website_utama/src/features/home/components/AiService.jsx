import React from "react";
import { getImageUrl } from "@/utils/assets";

export default function AiService() {
  return (
    <aside className="paskus-cs-ai" aria-label="PASKUS AI SERVICE">
      <button className="paskus-cs-ai-toggle" type="button" aria-expanded="false">
        <img alt="PASKUS" src={getImageUrl("paskus.webp")} loading="lazy" decoding="async" />
        <span>
          <strong>PASKUS AI SERVICE</strong>
          <span>Pusat Informasi Resimen</span>
        </span>
      </button>
      <div className="paskus-cs-ai-panel" role="dialog" aria-label="PASKUS AI SERVICE">
        <div className="paskus-cs-ai-head">
          <div className="paskus-cs-ai-brand">
            <img alt="PASKUS" src={getImageUrl("paskus.webp")} loading="lazy" decoding="async" />
            <span>
              <strong>PASKUS AI SERVICE</strong>
              <span>QnA dan pendaftaran</span>
            </span>
          </div>
          <button className="paskus-cs-ai-close" type="button" aria-label="Tutup PASKUS AI SERVICE">×</button>
        </div>
        <div className="paskus-cs-ai-log" aria-live="polite">
          <div className="paskus-cs-ai-message paskus-cs-ai-message--bot">
            <p>Halo, saya PASKUS AI SERVICE. Saya menjawab berdasarkan informasi website PASKUS: pendaftaran, Discord sync, golongan latihan, unit tempur, dinas non-tempur, PMC/sipil, dan struktural.</p>
          </div>
        </div>
        <form className="paskus-cs-ai-form">
          <input type="text" maxLength={700} autoComplete="off" placeholder="Tanya soal pendaftaran, unit, golongan..." aria-label="Tanya soal pendaftaran, unit, golongan..." />
          <button type="submit">Kirim</button>
        </form>
        <div className="paskus-cs-ai-note">PASKUS AI SERVICE memprioritaskan konten website PASKUS sebagai sumber jawaban. Chat tersimpan sementara 10 menit berdasarkan sesi/IP agar tidak hilang saat reload; data anggota, bypass, dan pangkat tidak resmi tetap ditolak untuk keamanan resimen.</div>
      </div>
    </aside>
  );
}
