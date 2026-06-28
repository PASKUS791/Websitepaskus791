import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { PASAL_DATA, SECURITY_DATA } from "@/data/regulations.jsx";
import PasalBlock from "./components/PasalBlock";
import { getImageUrl } from "@/utils/assets";
import "@/styles/peraturan.css";

const PeraturanFeature = () => {
  const [openBlocks, setOpenBlocks] = useState({
    "pasal-1": true, // start with Pasal 1 open
  });

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("paskus-language") || "id";
    } catch (_) {
      return "id";
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("paskus-language");
        if (stored && stored !== lang) {
          setLang(stored);
        }
      } catch (_) {}
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [lang]);

  const handleLangChange = (e) => {
    const value = e.target.value;
    setLang(value);
    try {
      localStorage.setItem("paskus-language", value);
      const event = new Event("change", { bubbles: true });
      e.target.dispatchEvent(event);
    } catch (_) {}
  };

  const toggleBlock = (id) => {
    setOpenBlocks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToBlock = (id) => {
    setOpenBlocks((prev) => ({
      ...prev,
      [id]: true,
    }));
    setTimeout(() => {
      const target = document.getElementById(id);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div className="peraturan-page-container">
      <div className="peraturan-page-bg" aria-hidden="true"></div>

      {/* NAV */}
      <nav className="peraturan-nav paskus-floating-nav paskus-navbar-unified" aria-label="Navigasi utama">
        <Link className="peraturan-nav-brand" to="/">
          <img src={getImageUrl("paskus.webp")} alt="PASKUS Logo" width="32" height="32" />
          <div>
            PASKUS<span>Gi1 · So-791</span>
          </div>
        </Link>
        <div className="peraturan-nav-links">
          <Link to="/" data-paskus-nav-key="home">HOME</Link>
          <a href="/#combat" data-paskus-nav-key="combat" data-paskus-anchor="#combat">COMBAT</a>
          <a href="/#support" data-paskus-nav-key="support" data-paskus-anchor="#support">SUPPORT</a>
          <Link to="/streamer" data-paskus-nav-key="streamer">STREAMER</Link>
          <Link to="/brm5-roleplay" data-paskus-nav-key="brm5" aria-label="Resimen BRM5 Roleplay PASKUS Gi1">BRM5</Link>
          <Link to="/struktural" data-paskus-nav-key="structure">STRUKTURAL</Link>
          <Link to="/about" data-paskus-nav-key="about">ABOUT US</Link>
          <Link className="active" to="/peraturan">Peraturan</Link>
        </div>
        <div className="nav-actions">
          <Link className="peraturan-nav-back" to="/" data-paskus-nav-key="home">HOME</Link>

          <div className="paskus-language-switcher" data-active-lang={lang}>
            <select 
              className="paskus-language-select" 
              data-language-select="" 
              aria-label="Pilih bahasa" 
              title={lang === "id" ? "Bahasa Indonesia" : lang === "en" ? "English" : "Language"} 
              value={lang} 
              onChange={handleLangChange}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="fil">Filipino</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी / India</option>
              <option value="su">Basa Sunda</option>
              <option value="jv">Basa Jawa</option>
            </select>
          </div>
          <Link className="paskus-structural-header-cta" to="/struktural" data-paskus-nav-key="structure">STRUKTURAL</Link>
        </div>
      </nav>

      {/* MAIN */}
      <main className="page-wrap">
        {/* HERO */}
        <section className="reg-hero fade-in visible" style={{ transitionDelay: "0ms" }}>
          <div className="reg-eyebrow">Dokumen Resmi · So-791</div>
          <h1>Regulasi Resmi<br /><span>Kesatuan PASKUS-791</span></h1>
          <p>
            Dengan rahmat Tuhan dan semangat jiwa korps, peraturan ini ditetapkan sebagai pedoman disiplin, etika, 
            serta tata kehidupan seluruh prajurit di lingkungan komunitas Roleplay PASKUS-791. Setiap anggota yang 
            bergabung dianggap telah membaca, memahami, dan menyetujui seluruh isi regulasi ini.
          </p>
          <div className="reg-meta">
            <span className="reg-meta-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <rect x="2" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"></rect>
                <path d="M4 4.5h4M4 6.5h4M4 8.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path>
              </svg>
              11 Pasal Utama
            </span>
            <span className="reg-meta-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"></circle>
                <path d="M6 3.5v2.8l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path>
              </svg>
              Berlaku Aktif
            </span>
            <span className="reg-meta-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1.5L7.5 5h3.5l-2.8 2 1.1 3.5L6 8.5 2.7 10.5l1.1-3.5L1 5h3.5L6 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"></path>
              </svg>
              DPDM So-791
            </span>
          </div>
          <Link className="paskus-structural-header-cta" to="/brm5-roleplay" data-paskus-nav-key="brm5" aria-label="Resimen BRM5 Roleplay PASKUS Gi1">BRM5</Link>
          <Link className="paskus-structural-header-cta" to="/streamer" data-paskus-nav-key="streamer">STREAMER</Link>
          <Link className="paskus-structural-header-cta" to="/struktural" data-paskus-nav-key="structure">STRUKTURAL</Link>
        </section>

        <div className="reg-divider fade-in visible" style={{ transitionDelay: "40ms" }}></div>

        {/* TABLE OF CONTENTS */}
        <nav className="toc fade-in visible" aria-label="Daftar pasal" style={{ transitionDelay: "80ms" }}>
          <div className="toc-head">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 3.5h10M2 7h7M2 10.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"></path>
            </svg>
            Daftar Pasal
          </div>
          <div className="toc-grid">
            {[...PASAL_DATA.map((p) => ({ id: p.id, label: p.tocLabel, num: p.num })),
              { id: "security", label: "🛡 Security Mabes", num: "🛡" }
            ].map((item) => (
              <a 
                key={item.id} 
                className="toc-item" 
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToBlock(item.id);
                }}
              >
                <span className="toc-num">{item.num}</span>
                {item.label}
              </a>
            ))}
          </div>
          <Link className="paskus-structural-header-cta" to="/brm5-roleplay" data-paskus-nav-key="brm5" aria-label="Resimen BRM5 Roleplay PASKUS Gi1">BRM5</Link>
          <Link className="paskus-structural-header-cta" to="/streamer" data-paskus-nav-key="streamer">STREAMER</Link>
          <Link className="paskus-structural-header-cta" to="/struktural" data-paskus-nav-key="structure">STRUKTURAL</Link>
        </nav>

        {/* 11 pasal blocks rendered via .map() */}
        {PASAL_DATA.map((pasal) => (
          <PasalBlock
            key={pasal.id}
            pasal={pasal}
            isOpen={!!openBlocks[pasal.id]}
            onToggle={() => toggleBlock(pasal.id)}
          />
        ))}

        <div className="reg-divider fade-in visible" style={{ transitionDelay: "200ms" }}></div>

        {/* SECURITY MABES */}
        <section id="security" className="security-block fade-in visible" aria-labelledby="security-title" style={{ transitionDelay: "200ms" }}>
          <div className="security-head">
            <div className="security-icon" aria-hidden="true">🛡️</div>
            <div className="security-head-text">
              <h2 id="security-title">Peraturan Mabes</h2>
              <p>Keamanan Chat, Media, Link &amp; File · PASKUS791</p>
            </div>
          </div>
          <div className="security-body">
            <div className="security-intro">
              Anggota PASKUS, perhatikan. Ruang Mabes dijaga oleh <strong>Security SO-791</strong>. Setiap pesan, link, foto, dan file yang masuk dapat dipindai otomatis untuk menjaga disiplin, keamanan, dan kehormatan server.
            </div>

            <div>
              <div className="security-section-title red">
                <span aria-hidden="true">⛔</span> Dilarang di Ruang Lingkup Bot
              </div>
              <div className="security-list">
                {SECURITY_DATA.prohibited.map((text, i) => (
                  <div className="security-list-item danger" key={i}><span className="security-badge">⚠️</span>{text}</div>
                ))}
              </div>
            </div>

            <div>
              <div className="security-section-title gold">
                <span aria-hidden="true">🛡️</span> Cara Kerja Security SO-791
              </div>
              <div className="security-list">
                <div className="security-list-item warning"><span className="security-badge">🤖</span>{SECURITY_DATA.howItWorks}</div>
              </div>
            </div>

            <div>
              <div className="security-section-title gold">
                <span aria-hidden="true">⚖️</span> Hukuman yang Dapat Diberikan
              </div>
              <div className="hukuman-grid">
                {SECURITY_DATA.punishments.map((p, i) => (
                  <div className="hukuman-item" key={i}><span className="hukuman-icon">{p.icon}</span>{p.text}</div>
                ))}
              </div>
            </div>

            <div className="security-list">
              <div className="security-list-item success"><span className="security-badge">✅</span>Gunakan bahasa yang tegas, sopan, dan tidak menyerang identitas siapa pun. Disiplin dimulai dari cara kita berbicara dan menjaga ruang bersama.</div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <div className="reg-closing fade-in visible" style={{ transitionDelay: "200ms" }}>
          <h3>Kata Penutup</h3>
          <p>Regulasi ini dibuat demi menjaga kehormatan, kedisiplinan, dan keamanan seluruh prajurit dalam komunitas. Setiap anggota adalah bagian dari kesatuan yang menjunjung tinggi rasa hormat, loyalitas, dan tanggung jawab. Dengan menaati peraturan ini, kita membangun lingkungan roleplay militer yang solid, profesional, dan penuh jiwa korps.</p>
          <div className="reg-closing-moto">
            <div className="moto-block">
              <span className="moto-label">Moto Komunitas</span>
              <span className="moto-text">"Jangan Ada yang Tertinggal"</span>
            </div>
            <div className="moto-block">
              <span className="moto-label">Moto Resimen</span>
              <span className="moto-text">Silere Impetum</span>
              <span className="moto-sub">— Serang Senyap</span>
            </div>
          </div>
          <div className="reg-footer-note">PASKUS791 Security Doctrine · DPDM So-791 · Berlaku untuk seluruh anggota aktif</div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <Link to="/">PASKUS Gi1</Link> &nbsp;·&nbsp; So-791 &nbsp;·&nbsp; <Link to="/peraturan">Regulasi Resmi</Link> &nbsp;·&nbsp; <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noreferrer">Discord</a>
      </footer>
    </div>
  );
};

export default PeraturanFeature;
