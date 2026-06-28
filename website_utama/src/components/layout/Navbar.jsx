import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentHash = location.hash;

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("paskus-language") || "id";
    } catch (_) {
      return "id";
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("paskus-language");
        if (stored && stored !== lang) {
          setLang(stored);
        }
      } catch (_) {}
    };

    window.addEventListener("storage", handleStorageChange);
    // Also poll slightly or set an interval to check for changes since the sync script updates localStorage directly
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
      // Dispatch event so the sync script knows about the change if listening
      const event = new Event("change", { bubbles: true });
      e.target.dispatchEvent(event);
    } catch (_) {}
  };

  const getActiveKey = () => {
    if (currentPath === "/") {
      if (currentHash === "#combat") return "combat";
      if (currentHash === "#support") return "support";
      return "home";
    }
    if (currentPath === "/about") return "about";
    if (currentPath === "/streamer" || currentPath.startsWith("/streamer/")) return "streamer";
    if (currentPath === "/struktural") return "structure";
    if (currentPath === "/peraturan") return "regulation";
    if (currentPath === "/brm5-roleplay" || currentPath.includes("brm5") || currentPath.includes("roleplay") || currentPath.includes("resimen")) return "brm5";
    return "";
  };

  const activeKey = getActiveKey();

  return (
    <nav className="body-nav paskus-main-nav paskus-floating-nav paskus-navbar-unified">
      <Link className="nav-logo" to="/">
        <img alt="PASKUS Logo" src="/recruitment-webhook-logo.png" loading="eager" decoding="async" fetchPriority="high" />
        <span>
          <strong>PASKUS Gi1</strong>
          <span>So-791</span>
        </span>
      </Link>
      
      <div className="nav-links">
        <Link to="/" data-paskus-nav-key="home" aria-current={activeKey === "home" ? "page" : undefined}>HOME</Link>
        <a href="/#combat" data-paskus-nav-key="combat" data-paskus-anchor="#combat" aria-current={activeKey === "combat" ? "page" : undefined}>COMBAT</a>
        <a href="/#support" data-paskus-nav-key="support" data-paskus-anchor="#support" aria-current={activeKey === "support" ? "page" : undefined}>SUPPORT</a>
        <Link to="/streamer" data-paskus-nav-key="streamer" aria-current={activeKey === "streamer" ? "page" : undefined}>STREAMER</Link>
        <Link to="/brm5-roleplay" data-paskus-nav-key="brm5" aria-current={activeKey === "brm5" ? "page" : undefined}>BRM5</Link>
        <Link to="/struktural" data-paskus-nav-key="structure" aria-current={activeKey === "structure" ? "page" : undefined}>STRUKTURAL</Link>
        <Link to="/about" data-paskus-nav-key="about" aria-current={activeKey === "about" ? "page" : undefined}>ABOUT US</Link>
        <Link to="/peraturan" data-paskus-nav-key="regulation" aria-current={activeKey === "regulation" ? "page" : undefined}>PERATURAN</Link>
      </div>

      <div className="nav-actions">
        <a href="https://discord.gg/aaBR9ruFva" data-paskus-nav-key="discord" className="btn-discord discord-link" target="_blank" rel="noreferrer">DISCORD</a>
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
      </div>
    </nav>
  );
};

export default Navbar;
