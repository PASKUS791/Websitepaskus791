import React from "react";
import { getImageUrl } from "@/utils/assets";

const MapSection = () => {
  return (
    <section className="paskus-indonesia-presence" id="indonesia-presence" data-presence-version="20260608-map6" data-bound="1">
      <div className="paskus-indonesia-presence__inner">
        <div className="paskus-indonesia-presence__copy">
          <div className="paskus-indonesia-presence__kicker">Jejak Personel Nasional</div>
          <h2 id="paskus-indonesia-title">Satu Komando, Tersebar di Indonesia</h2>
          <p className="paskus-indonesia-presence__lead">Lebih dari 2.000 anggota telah bergabung dan menjadi keluarga kami di seluruh Indonesia.</p>
          <div className="paskus-indonesia-presence__stat" aria-label="Lebih dari dua ribu anggota aktif dan komunitas">
            <strong>2.000+</strong>
            <span>personel, alumni, dan komunitas yang terhubung dalam ekosistem PASKUS Gi1.</span>
          </div>
          <form className="paskus-people-search" data-paskus-people-search="" role="search">
            <label htmlFor="paskus-people-search-input">Search People</label>
            <div className="paskus-people-search__row">
              <input id="paskus-people-search-input" type="search" placeholder="Cari nama personel struktural..." autoComplete="off" spellCheck="false" />
              <button type="submit">Cari</button>
            </div>
            <p className="paskus-people-search__result" aria-live="polite"></p>
          </form>
        </div>
        <figure className="paskus-indonesia-map-card" aria-labelledby="paskus-indonesia-title">
          <div className="paskus-indonesia-map-plot">
            <img src={getImageUrl("indonesia-member-map-crop-v2.webp")} alt="Peta Indonesia dengan marker persebaran anggota PASKUS Gi1" loading="lazy" decoding="async" />
            <button type="button" className="paskus-indonesia-map-action" data-structure-jump="" aria-label="Buka menu Struktural PASKUS"></button>
            <div className="paskus-indonesia-markers" aria-hidden="false">
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Aceh" style={{ "--pin-x": "7.6%", "--pin-y": "16.4%", "--pin-delay": "0ms", "--tip-left": "0%", "--tip-x": "0%" }} aria-label="Buka Struktural dari marker Aceh" title="Aceh">
                <span className="paskus-indonesia-marker__label">Aceh</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Sumatera Utara" style={{ "--pin-x": "14.1%", "--pin-y": "32.2%", "--pin-delay": "170ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Sumatera Utara" title="Sumatera Utara">
                <span className="paskus-indonesia-marker__label">Sumatera Utara</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Sumatera Barat" style={{ "--pin-x": "20.5%", "--pin-y": "52.4%", "--pin-delay": "340ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Sumatera Barat" title="Sumatera Barat">
                <span className="paskus-indonesia-marker__label">Sumatera Barat</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Sumatera Selatan" style={{ "--pin-x": "25.2%", "--pin-y": "62.2%", "--pin-delay": "510ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Sumatera Selatan" title="Sumatera Selatan">
                <span className="paskus-indonesia-marker__label">Sumatera Selatan</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Lampung" style={{ "--pin-x": "26.8%", "--pin-y": "67.8%", "--pin-delay": "680ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Lampung" title="Lampung">
                <span className="paskus-indonesia-marker__label">Lampung</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="DKI Jakarta" style={{ "--pin-x": "28.8%", "--pin-y": "74.8%", "--pin-delay": "850ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker DKI Jakarta" title="DKI Jakarta">
                <span className="paskus-indonesia-marker__label">DKI Jakarta</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Jawa Barat" style={{ "--pin-x": "34.3%", "--pin-y": "76.9%", "--pin-delay": "1020ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Jawa Barat" title="Jawa Barat">
                <span className="paskus-indonesia-marker__label">Jawa Barat</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Jawa Tengah" style={{ "--pin-x": "41.1%", "--pin-y": "75.5%", "--pin-delay": "0ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Jawa Tengah" title="Jawa Tengah">
                <span className="paskus-indonesia-marker__label">Jawa Tengah</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Jawa Timur" style={{ "--pin-x": "55.8%", "--pin-y": "83.2%", "--pin-delay": "170ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Jawa Timur" title="Jawa Timur">
                <span className="paskus-indonesia-marker__label">Jawa Timur</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Bali" style={{ "--pin-x": "61.9%", "--pin-y": "88.5%", "--pin-delay": "340ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Bali" title="Bali">
                <span className="paskus-indonesia-marker__label">Bali</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Kalimantan Barat" style={{ "--pin-x": "38.9%", "--pin-y": "41.6%", "--pin-delay": "510ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Kalimantan Barat" title="Kalimantan Barat">
                <span className="paskus-indonesia-marker__label">Kalimantan Barat</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Kalimantan Timur" style={{ "--pin-x": "47.6%", "--pin-y": "46.9%", "--pin-delay": "680ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Kalimantan Timur" title="Kalimantan Timur">
                <span className="paskus-indonesia-marker__label">Kalimantan Timur</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Kalimantan Selatan" style={{ "--pin-x": "43.8%", "--pin-y": "58%", "--pin-delay": "850ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Kalimantan Selatan" title="Kalimantan Selatan">
                <span className="paskus-indonesia-marker__label">Kalimantan Selatan</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Sulawesi Selatan" style={{ "--pin-x": "58.5%", "--pin-y": "65.7%", "--pin-delay": "1020ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Sulawesi Selatan" title="Sulawesi Selatan">
                <span className="paskus-indonesia-marker__label">Sulawesi Selatan</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Sulawesi Tengah" style={{ "--pin-x": "55.8%", "--pin-y": "51%", "--pin-delay": "0ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Sulawesi Tengah" title="Sulawesi Tengah">
                <span className="paskus-indonesia-marker__label">Sulawesi Tengah</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Sulawesi Utara" style={{ "--pin-x": "69%", "--pin-y": "38.1%", "--pin-delay": "170ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Sulawesi Utara" title="Sulawesi Utara">
                <span className="paskus-indonesia-marker__label">Sulawesi Utara</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Nusa Tenggara Barat" style={{ "--pin-x": "65.6%", "--pin-y": "79%", "--pin-delay": "340ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Nusa Tenggara Barat" title="Nusa Tenggara Barat">
                <span className="paskus-indonesia-marker__label">Nusa Tenggara Barat</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Nusa Tenggara Timur" style={{ "--pin-x": "75.2%", "--pin-y": "78.3%", "--pin-delay": "510ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Nusa Tenggara Timur" title="Nusa Tenggara Timur">
                <span className="paskus-indonesia-marker__label">Nusa Tenggara Timur</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Maluku" style={{ "--pin-x": "71.7%", "--pin-y": "56.6%", "--pin-delay": "680ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Maluku" title="Maluku">
                <span className="paskus-indonesia-marker__label">Maluku</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Papua Barat" style={{ "--pin-x": "81%", "--pin-y": "71.3%", "--pin-delay": "850ms", "--tip-left": "50%", "--tip-x": "-50%" }} aria-label="Buka Struktural dari marker Papua Barat" title="Papua Barat">
                <span className="paskus-indonesia-marker__label">Papua Barat</span>
              </button>
              <button type="button" className="paskus-indonesia-marker" data-structure-jump="" data-region="Papua" style={{ "--pin-x": "88.4%", "--pin-y": "62.2%", "--pin-delay": "1020ms", "--tip-left": "100%", "--tip-x": "-100%" }} aria-label="Buka Struktural dari marker Papua" title="Papua">
                <span className="paskus-indonesia-marker__label">Papua</span>
              </button>
            </div>
          </div>
          <figcaption className="paskus-indonesia-map-hint">
            <span>Klik peta atau marker untuk membuka Struktural</span>
            <span>Live Personnel</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default MapSection;
