import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="paskus-seo-footer" aria-label="Footer resmi PASKUS Gi1">
      <div className="paskus-seo-footer__inner">
        <section className="paskus-seo-footer__brand">
          <Link className="paskus-seo-footer__brand-row" to="/" aria-label="PASKUS Gi1 home">
            <img alt="Logo PASKUS Gi1" src="/recruitment-webhook-logo.png" loading="lazy" decoding="async" />
            <span>
              <strong>PASKUS Gi1</strong>
              <span>So-791</span>
            </span>
          </Link>
          <p>
            Website utama PASKUS Gi1 untuk informasi resimen BRM5 roleplay Indonesia,
            komando taktis So-791, unit khusus, dinas pendukung, struktur personel,
            streamer hub, pendaftaran resmi, dan akses Discord PASKUS.
          </p>
        </section>

        <section>
          <h2 className="paskus-seo-footer__title">BRM5 Roleplay</h2>
          <nav className="paskus-seo-footer__links" aria-label="BRM5 Roleplay">
            <Link to="/resimen-brm5">Resimen BRM5 PASKUS Gi1</Link>
            <Link to="/brm5-roleplay" data-paskus-nav-key="brm5">BRM5</Link>
            <Link to="/roleplay-grup-brm5">Roleplay Grup BRM5</Link>
            <Link to="/cara-gabung-brm5-roleplay">Cara Gabung BRM5 Roleplay</Link>
            <Link to="/blackhawk-rescue-5-roleplay-fraksi">Blackhawk Rescue 5 Roleplay Fraksi</Link>
          </nav>
        </section>

        <section>
          <h2 className="paskus-seo-footer__title">Unit So-791</h2>
          <nav className="paskus-seo-footer__links" aria-label="Unit So-791">
            <Link to="/unit-brm5-paskus">Unit BRM5 PASKUS</Link>
            <Link to="/unit/gatam">GATAM</Link>
            <Link to="/unit/toruk-makto">TORUK MAKTO</Link>
            <Link to="/unit/pathfinder">PATHFINDER</Link>
            <Link to="/unit/sentinel">SENTINEL</Link>
            <Link to="/unit/komodo">KOMODO</Link>
          </nav>
        </section>

        <section>
          <h2 className="paskus-seo-footer__title">Informasi Resmi</h2>
          <nav className="paskus-seo-footer__links" aria-label="Informasi Resmi">
            <Link to="/" data-paskus-nav-key="home">HOME</Link>
            <Link to="/streamer" data-paskus-nav-key="streamer">STREAMER</Link>
            <Link to="/about" data-paskus-nav-key="about">ABOUT US</Link>
            <Link to="/struktural" data-paskus-nav-key="structure">STRUKTURAL</Link>
            <Link to="/#enlist">Pendaftaran Personel</Link>
            <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noreferrer" data-paskus-nav-key="discord">DISCORD</a>
            <a href="https://www.tiktok.com/@paskus791" target="_blank" rel="noreferrer">TikTok PASKUS Gi1</a>
          </nav>
        </section>
      </div>
      <div className="paskus-seo-footer__bottom">
        PASKUS Gi1 / So-791 / Blackhawk Rescue Mission 5 Roleplay Indonesia
      </div>
    </footer>
  );
};

export default Footer;
