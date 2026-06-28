import React from "react";
import { Link } from "react-router";
import { getImageUrl } from "@/utils/assets";

const CombatSection = () => {
  return (
    <section id="combat" className="page-section py-8 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-[#EFBF04] heading-font text-sm tracking-widest mb-4">// UNIT KHUSUS So-791</h2>
          <h3 className="text-3xl md:text-5xl font-bold heading-font text-white">
            UNIT <span className="text-[#9DC183]">KHUSUS TEMPUR</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* GATAM */}
          <div className="flip-card paskus-unit-gatam" data-paskus-unit="gatam">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img alt="GATAM" className="unit-logo" src={getImageUrl("gatam-eagle-logo-transparent-v1.webp")} />
                <h4 className="heading-font text-xs md:text-lg text-white">GATAM</h4>
                <span className="paskus-unit-role">Prioritas Operasi Khusus</span>
                <Link className="unit-card-btn card-Gatam" to="/unit/gatam" data-discover="true">Detail Unit</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">Infiltration and Stealth Unit</h4>
                <span className="paskus-unit-role">Prioritas Operasi Khusus</span>
                <p className="text-xs leading-relaxed">
                  GATAM atau Garuda Hitam adalah unit pasukan khusus yang berspesialisasi dalam operasi rahasia, bekerja independen untuk mengamankan posisi strategis, melenyapkan target, or membebaskan kompleks.
                </p>
                <Link className="unit-card-btn card-Gatam" to="/unit/gatam" data-discover="true">Detail Unit</Link>
              </div>
            </div>
          </div>

          {/* BRINGAS */}
          <div className="flip-card paskus-unit-bringas" data-paskus-unit="bringas">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img alt="BRINGAS" className="unit-logo" src={getImageUrl("brigas.webp")} />
                <h4 className="heading-font text-xs md:text-lg text-white">BRINGAS</h4>
                <span className="paskus-unit-role">Darat / Infanteri Mekanis</span>
                <Link className="unit-card-btn card-beringas" to="/unit/bringas" data-discover="true">Detail Unit</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">Darat / Heavy Duty Unit</h4>
                <span className="paskus-unit-role">Darat / Infanteri Mekanis</span>
                <p className="text-xs leading-relaxed">
                  Pasukan tempur utama infanteri mekanis yang berspesialisasi dalam kavaleri ringan dengan klasifikasi APC, AV, dan IFV. BRINGAS membawa daya tembak berat, perlindungan infanteri, dan kemampuan mobilisasi cepat untuk kondisi darurat di medan operasi.
                </p>
                <Link className="unit-card-btn card-beringas" to="/unit/bringas" data-discover="true">Detail Unit</Link>
              </div>
            </div>
          </div>

          {/* TORUK MAKTO */}
          <div className="flip-card paskus-unit-toruk" data-paskus-unit="toruk">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img alt="TORUK MAKTO" className="unit-logo" src={getImageUrl("toruk.webp")} />
                <h4 className="heading-font text-xs md:text-lg text-white">TORUK MAKTO</h4>
                <span className="paskus-unit-role">Sky Lord / Unit Udara</span>
                <Link className="unit-card-btn card-toruk" to="/unit/toruk-makto" data-discover="true">Detail Unit</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">Sky Lord / Air Specialization Unit</h4>
                <span className="paskus-unit-role">Sky Lord / Unit Udara</span>
                <p className="text-xs leading-relaxed">
                  Lord of the Sky. TORUK MAKTO adalah unit udara yang berfokus pada penyisipan udara cepat, eksfiltrasi, CAS, CASEVAC, pasukan parasut, lintas udara, dan pilot terbaik yang dimiliki So-791.
                </p>
                <Link className="unit-card-btn card-toruk" to="/unit/toruk-makto" data-discover="true">Detail Unit</Link>
              </div>
            </div>
          </div>

          {/* SIERRA */}
          <div className="flip-card paskus-unit-sierra" data-paskus-unit="sierra">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img alt="SIERRA" className="unit-logo" src={getImageUrl("sierra-unit-logo-transparent-card-v1.webp")} />
                <h4 className="heading-font text-xs md:text-lg text-white">SIERRA</h4>
                <span className="paskus-unit-role">Gerak Cepat &amp; Serangan Sigap</span>
                <Link className="unit-card-btn card-sierra" to="/unit/sierra" data-discover="true">Detail Unit</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">Infiltration and Tactical Sabotage Unit</h4>
                <span className="paskus-unit-role">Gerak Cepat &amp; Serangan Sigap</span>
                <p className="text-xs leading-relaxed">
                  SIERRA adalah divisi infanteri khusus yang bergerak cepat, sigap, dan terukur untuk membuka celah operasi, mengacaukan struktur lawan, serta menyelesaikan sasaran bernilai tinggi tanpa kehilangan kendali komando.
                </p>
                <Link className="unit-card-btn card-sierra" to="/unit/sierra" data-discover="true">Detail Unit</Link>
              </div>
            </div>
          </div>

          {/* PATHFINDER */}
          <div className="flip-card paskus-unit-pathfinder" data-paskus-unit="pathfinder">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img alt="PATHFINDER" className="unit-logo" src={getImageUrl("pathfinder.webp")} />
                <h4 className="heading-font text-xs md:text-lg text-white">PATHFINDER</h4>
                <span className="paskus-unit-role">Recon &amp; Infiltrasi</span>
                <Link className="unit-card-btn card-Pathfinder" to="/unit/pathfinder" data-discover="true">Detail Unit</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">Ranger and Scout Unit</h4>
                <span className="paskus-unit-role">Recon &amp; Infiltrasi</span>
                <p className="text-xs leading-relaxed">
                  Infantri pengintai The Ranger &amp; Scout yang mengkhususkan diri dalam pengintaian, pengawasan, keahlian menembak, dan komunikasi tajam untuk meningkatkan efektivitas operasi So-791.
                </p>
                <Link className="unit-card-btn card-Pathfinder" to="/unit/pathfinder" data-discover="true">Detail Unit</Link>
              </div>
            </div>
          </div>

          {/* SENTINEL */}
          <div className="flip-card paskus-unit-sentinel" data-paskus-unit="sentinel">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img alt="SENTINEL" className="unit-logo" src={getImageUrl("sentinel-snake-logo-transparent-v1.webp")} />
                <h4 className="heading-font text-xs md:text-lg text-white">SENTINEL</h4>
                <span className="paskus-unit-role">Pertahanan &amp; Combat Medic</span>
                <Link className="unit-card-btn card-Sentinel" to="/unit/sentinel" data-discover="true">Detail Unit</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">Combat Medic Unit</h4>
                <span className="paskus-unit-role">Pertahanan &amp; Combat Medic</span>
                <p className="text-xs leading-relaxed">
                  Tenaga medis tempur yang berspesialisasi dalam pertolongan pertama di medan pertempuran aktif, mendukung resimen dengan perlengkapan medis, kebutuhan logistik, dan kendaraan lapis baja medis.
                </p>
                <Link className="unit-card-btn card-Sentinel" to="/unit/sentinel" data-discover="true">Detail Unit</Link>
              </div>
            </div>
          </div>

          {/* KOMODO */}
          <div className="flip-card paskus-unit-komodo" data-paskus-unit="komodo">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img alt="KOMODO" className="unit-logo" src={getImageUrl("komodo-unit-logo-card.webp")} loading="lazy" decoding="async" />
                <h4 className="heading-font text-xs md:text-lg text-white">KOMODO</h4>
                <span className="paskus-unit-role">Pasukan Reguler</span>
                <Link className="unit-card-btn card-komodo" to="/unit/komodo" data-discover="true">Detail Unit</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">Pasukan Reguler / Barak Awal</h4>
                <span className="paskus-unit-role">Pasukan Reguler</span>
                <p className="text-xs leading-relaxed">
                  KOMODO adalah pasukan reguler PASKUS sekaligus satuan awal bagi seluruh anggota yang baru bergabung. Unit ini menjadi barak pembentukan dasar dari pangkat Prada hingga Praka, tempat personel mengenal kultur komando, disiplin lapangan, etika barak, dan standar loyalitas sebelum dinilai layak bergerak ke penugasan atau spesialisasi lanjutan.
                </p>
                <Link className="unit-card-btn card-komodo" to="/unit/komodo" data-discover="true">Detail Unit</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CombatSection;
