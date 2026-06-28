import React from "react";
import { Link } from "react-router";
import { getImageUrl } from "@/utils/assets";

const SupportSection = () => {
  return (
    <section id="support" className="page-section py-8 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-[#9DC183] heading-font text-sm tracking-widest mb-4">// DINAS DAN KARIR So-791</h2>
          <h3 className="text-3xl md:text-5xl font-bold heading-font text-white">
            DINAS <span className="text-[#EFBF04]">NON-TEMPUR</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
          {/* ZENI TEMPUR */}
          <div className="flip-card paskus-support-zeni-tempur" data-paskus-support="zeni-tempur" style={{ "--support-card-accent": "#a8b3a2" }}>
            <div className="flip-card-inner">
              <div className="flip-card-front border-dashed border-sage/50">
                <img alt="Zeni Logo" className="unit-logo" src={getImageUrl("default.png")} />
                <h4 className="heading-font text-lg text-white">ZENI TEMPUR</h4>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/zeni-tempur">Detail Dinas</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-[#EFBF04] mb-4 font-bold">ZENI TEMPUR</h4>
                <p className="text-xs">Dinas kreatif dan imajinatif yang membangun skenario serta map, dengan tanggung jawab penuh terhadap area tugas yang dibuat.</p>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/zeni-tempur">Detail Dinas</Link>
              </div>
            </div>
          </div>

          {/* PUSDIKLAT */}
          <div className="flip-card paskus-support-pusdiklat" data-paskus-support="pusdiklat" style={{ "--support-card-accent": "#9dc183" }}>
            <div className="flip-card-inner">
              <div className="flip-card-front border-dashed border-sage/50">
                <img alt="Zeni Logo" className="unit-logo" src={getImageUrl("default.png")} />
                <h4 className="heading-font text-lg text-white">PUSDIKLAT</h4>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/pusdiklat">Detail Dinas</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-[#EFBF04] mb-4 font-bold">PELATIH &amp; ASISTEN PELATIH</h4>
                <p className="text-xs">Dinas prajurit senior sampai bintara yang melatih individu, mempraktikkan keilmuan strategi, dan menjaga standar kedisiplinan tinggi.</p>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/pusdiklat">Detail Dinas</Link>
              </div>
            </div>
          </div>

          {/* DPDM */}
          <div className="flip-card paskus-support-dpdm" data-paskus-support="dpdm" style={{ "--support-card-accent": "#d2b45b" }}>
            <div className="flip-card-inner">
              <div className="flip-card-front border-dashed border-sage/50">
                <img alt="DPDM" className="unit-logo" src={getImageUrl("dpdm-logo-v2.webp")} loading="lazy" decoding="async" />
                <h4 className="heading-font text-lg text-white">DPDM</h4>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/dpdm">Detail Dinas</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-[#EFBF04] mb-4 font-bold">POLISI MILITER</h4>
                <p className="text-xs">Dinas penegak hukum resimen yang mengatur peraturan, ketaatan, penyelidikan, dan fungsi polisi militer dalam roleplay So-791.</p>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/dpdm">Detail Dinas</Link>
              </div>
            </div>
          </div>

          {/* PROPAGANDA */}
          <div className="flip-card paskus-support-propaganda" data-paskus-support="propaganda" style={{ "--support-card-accent": "#daad52" }}>
            <div className="flip-card-inner">
              <div className="flip-card-front border-dashed border-sage/50">
                <img alt="Zeni Logo" className="unit-logo" src={getImageUrl("default.png")} />
                <h4 className="heading-font text-lg text-white">PROPAGANDA</h4>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/propaganda">Detail Dinas</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-[#EFBF04] mb-4 font-bold">PROPAGANDA</h4>
                <p className="text-xs">Dinas kreatif yang membuat dokumentasi untuk disebarluaskan, mengolah momen operasi, dan membangun konten yang menarik bagi resimen.</p>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/propaganda">Detail Dinas</Link>
              </div>
            </div>
          </div>

          {/* SEKSI 1 */}
          <div className="flip-card paskus-support-staff-komando md:col-span-2 max-w-2xl mx-auto w-full" data-paskus-support="staff-komando" style={{ "--support-card-accent": "#efbf04" }}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <span className="paskus-support-roman-logo" aria-label="SEKSI 1 Logo">I</span>
                <h4 className="heading-font text-xs md:text-lg text-white">SEKSI 1</h4>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/staff-komando">Detail Dinas</Link>
              </div>
              <div className="flip-card-back">
                <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">INDUK NON-TEMPUR</h4>
                <p className="text-xs leading-relaxed font-normal">
                  SEKSI 1 adalah otak resimen dan pengurus besar PASKUS. Dinas ini menjadi pusat arahan, event, evaluasi, jadwal, validasi data, dan koordinasi seluruh non-tempur.
                </p>
                <Link className="paskus-support-detail-link" data-discover="true" to="/unit/staff-komando">Detail Dinas</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
