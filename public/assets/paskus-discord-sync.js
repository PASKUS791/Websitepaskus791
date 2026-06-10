(function () {
  "use strict";

  const STATUS_URL = "/api/discord-auth.php?action=status";
  const LOGIN_URL = "/api/discord-auth.php?action=login";
  const LOGOUT_URL = "/api/discord-auth.php?action=logout";
  const RESET_DISCORD_URL = "/api/discord-auth.php?action=reset-discord";
  const LOCATION_CONSENT_URL = "/api/location-consent.php";
  const KOMODO_LOGO_URL = "/assets/komodo-unit-logo-v2.webp";
  const KOMODO_CARD_LOGO_URL = "/assets/komodo-unit-logo-card.webp";
  const GATAM_LOGO_URL = "/assets/gatam-eagle-logo-transparent-v1.webp";
  const GATAM_CARD_LOGO_URL = "/assets/gatam-eagle-logo-transparent-v1.webp";
  const GATAM_CARD_BG_URL = "/assets/gatam-eagle-card-v1.webp";
  const GATAM_WALLPAPER_URL = "/assets/gatam-eagle-wallpaper-v1.webp";
  const SENTINEL_LOGO_URL = "/assets/sentinel-snake-logo-transparent-v1.webp";
  const SENTINEL_CARD_LOGO_URL = "/assets/sentinel-snake-logo-transparent-v1.webp";
  const SENTINEL_CARD_BG_URL = "/assets/sentinel-snake-card-v1.webp";
  const SENTINEL_WALLPAPER_URL = "/assets/sentinel-snake-wallpaper-v1.webp";
  const SIERRA_LOGO_URL = "/assets/sierra-unit-logo-transparent-v1.webp";
  const SIERRA_CARD_LOGO_URL = "/assets/sierra-unit-logo-transparent-card-v1.webp";
  const SIERRA_CARD_BG_URL = "/assets/sierra-card-bg-card-v1.webp";
  const SIERRA_WALLPAPER_URL = "/assets/sierra-card-bg-v1.webp";
  const DPDM_LOGO_URL = "/assets/dpdm-logo-v2.webp";
  const DPDM_CARD_BG_URL = "/assets/dpdm-card-bg-card.webp";
  const DPDM_WALLPAPER_URL = "/assets/dpdm-card-bg-v1.webp";
  const STREAMER_HERO_BG_URL = "/assets/about-us-bg-v1.webp";
  const PASKUS_LANDING_VIDEO_WEBM_URL = "/assets/paskus-landing-download3-6-45-v1.webm";
  const PASKUS_LANDING_VIDEO_MP4_URL = "/assets/paskus-landing-download3-6-45-v1.mp4";
  const PASKUS_LANDING_VIDEO_POSTER_URL = "/assets/paskus-landing-download3-poster-v1.jpg";
  const PASKUS_INTRO_VIDEO_WEBM_URL = "/assets/paskus-intro-download3-6-18-v1.webm";
  const PASKUS_INTRO_VIDEO_MP4_URL = "/assets/paskus-intro-download3-6-18-v1.mp4";
  const PASKUS_INTRO_VIDEO_POSTER_URL = "/assets/paskus-intro-download3-poster-v1.jpg";
  const INDONESIA_MEMBER_MAP_URL = "/assets/indonesia-member-map-crop-v2.webp";
  const UNIT_HIGHLIGHT_VIDEOS = {
    "toruk-makto": {
      title: "TORUK MAKTO AIR HIGHLIGHT",
      label: "Sky lord operation highlight",
      mp4: "/assets/toruk-highlight-v1.mp4",
      poster: "/assets/toruk-highlight-poster-v1.jpg",
    },
    sierra: {
      title: "SIERRA TACTICAL HIGHLIGHT",
      label: "Silent disruption field reel",
      mp4: "/assets/sierra-highlight-v1.mp4",
      poster: "/assets/sierra-highlight-poster-v1.jpg",
    },
    sentinel: {
      title: "SENTINEL FIELD HIGHLIGHT",
      label: "Combat medic support reel",
      mp4: "/assets/sentinel-highlight-v1.mp4",
      poster: "/assets/sentinel-highlight-poster-v1.jpg",
    },
  };
  const STRUCTURE_API_URL = "/api/structure.php";
  const PEOPLE_SEARCH_STORAGE_KEY = "paskus-people-search-target";
  const STRUCTURE_REFRESH_INTERVAL_MS = 5000;
  const STREAMER_CONTENT_API_URL = "/api/streamer-content.php";
  const CS_AI_API_URL = "/api/cs-ai.php";
  const PASKUS_BRAND_NAME = "PASKUS Gi1";
  const PASKUS_BRAND_SUBLINE = "So-791";
  const PASKUS_BRAND_FULL = `${PASKUS_BRAND_NAME} | ${PASKUS_BRAND_SUBLINE}`;
  const PASKUS_HOME_TITLE = "PASKUS Gi1 | So - 791";
  const PASKUS_HOME_SEO_SUBLINE = "PASKUS Gi1 | So-791 adalah resimen BRM5 roleplay Indonesia yang membangun disiplin komando, komunikasi satu kanal, jalur unit khusus, dinas pendukung, streamer hub, dan pendaftaran personel resmi melalui Discord PASKUS.";
  const PASKUS_HOME_MOTTO = "Silere Impetum";
  const PASKUS_HOME_MOTTO_SUBLINE = "Komando taktis Blackhawk Rescue Mission 5 dengan budaya disiplin, koordinasi jelas, operasi terarah, dan ruang berkembang bagi setiap personel.";
  const PASKUS_HOME_SCROLL_LABEL = "Scroll untuk menjelajah";
  const DISCORD_PRIVACY_NOTICE = "Kami hanya mengambil ID Discord untuk keperluan pendataan dalam resimen dan otomatisasi.";
  const LOCATION_CONSENT_VERSION = "2026-05-location-consent-v1";
  const PASKUS_LANGUAGE_STORAGE_KEY = "paskus-language";
  const PASKUS_DEBUG = (() => {
    try {
      return new URLSearchParams(window.location.search).has("paskus_debug");
    } catch (_error) {
      return false;
    }
  })();
  const PASKUS_LANGUAGES = [
    { code: "id", label: "Bahasa Indonesia", title: "Bahasa Indonesia", htmlLang: "id" },
    { code: "fil", label: "Filipino", title: "Filipino", htmlLang: "fil" },
    { code: "en", label: "English", title: "English", htmlLang: "en" },
    { code: "hi", label: "हिन्दी / India", title: "Hindi / India", htmlLang: "hi" },
    { code: "su", label: "Basa Sunda", title: "Basa Sunda", htmlLang: "su" },
    { code: "jv", label: "Basa Jawa", title: "Basa Jawa", htmlLang: "jv", batik: true },
  ];
  const PASKUS_CRITICAL_ASSETS = [
    "/assets/paskus-D2yVCxRe.webp",
    "/assets/t1-E9pkG8I5.webp",
    "/assets/t2-CbABOaM8.webp",
    GATAM_CARD_BG_URL,
    GATAM_CARD_LOGO_URL,
    "/assets/toruk-card-bg-card.webp",
    SIERRA_CARD_LOGO_URL,
    SIERRA_CARD_BG_URL,
    "/assets/pathfinder-card-bg-card.webp",
    SENTINEL_CARD_BG_URL,
    SENTINEL_CARD_LOGO_URL,
    "/assets/komodo-unit-logo-card.webp",
    "/assets/dpdm-logo-v2.webp",
    "/assets/dpdm-card-bg-card.webp",
    PASKUS_LANDING_VIDEO_POSTER_URL,
    PASKUS_INTRO_VIDEO_POSTER_URL,
  ];
  const PASKUS_IDLE_ASSETS = [
    "/assets/about-us-bg-v1.webp",
    "/assets/komodo-unit-logo-v2.webp",
    "/assets/dpdm-logo-v2.webp",
    "/assets/dpdm-card-bg-v1.webp",
    "/assets/toruk-card-bg-v1.webp",
    SIERRA_WALLPAPER_URL,
    "/assets/pathfinder-card-bg-v2.webp",
    SENTINEL_WALLPAPER_URL,
    GATAM_WALLPAPER_URL,
    "/assets/1-BHqO5QIF.webp",
    "/assets/2-B9QSdgCe.webp",
    "/assets/3-BqKbpwAy.webp",
    "/assets/4-CdXgMexn.webp",
    "/assets/5-N74ePIfv.webp",
    "/assets/6-y-vSsaeL.webp",
    "/assets/7-CI9mR4Xo.webp",
    "/assets/8-Dosels98.webp",
    "/assets/9-DuXjs98x.webp",
    "/assets/GATAM2-yhUzSvqs.webp",
    "/assets/GATAM_2-LvT9glN5.webp",
    "/assets/GATAM_3-Ae7P6R3F.webp",
    "/assets/GATAM_4-C9Jxe_5R.webp",
    "/assets/GATAM_5-B0Jt9dPO.webp",
    "/assets/brigas-Dl4ZqGkc.webp",
    "/assets/default-C12D8zq3.png",
    GATAM_LOGO_URL,
    "/assets/pathfinder-BFPRPB2O.webp",
    "/assets/sentinel-D-kJE7NV.webp",
    SIERRA_LOGO_URL,
    "/assets/toruk-DYGp5xKc.webp",
    UNIT_HIGHLIGHT_VIDEOS["toruk-makto"].poster,
    UNIT_HIGHLIGHT_VIDEOS.sierra.poster,
    UNIT_HIGHLIGHT_VIDEOS.sentinel.poster,
    INDONESIA_MEMBER_MAP_URL,
  ];
  const INDONESIA_MEMBER_MARKERS = [
    { id: "aceh", label: "Aceh", x: 7.6, y: 16.4 },
    { id: "medan", label: "Sumatera Utara", x: 14.1, y: 32.2 },
    { id: "padang", label: "Sumatera Barat", x: 20.5, y: 52.4 },
    { id: "palembang", label: "Sumatera Selatan", x: 25.2, y: 62.2 },
    { id: "lampung", label: "Lampung", x: 26.8, y: 67.8 },
    { id: "jakarta", label: "DKI Jakarta", x: 28.8, y: 74.8 },
    { id: "bandung", label: "Jawa Barat", x: 34.3, y: 76.9 },
    { id: "semarang", label: "Jawa Tengah", x: 41.1, y: 75.5 },
    { id: "surabaya", label: "Jawa Timur", x: 55.8, y: 83.2 },
    { id: "bali", label: "Bali", x: 61.9, y: 88.5 },
    { id: "pontianak", label: "Kalimantan Barat", x: 38.9, y: 41.6 },
    { id: "balikpapan", label: "Kalimantan Timur", x: 47.6, y: 46.9 },
    { id: "banjarmasin", label: "Kalimantan Selatan", x: 43.8, y: 58.0 },
    { id: "makassar", label: "Sulawesi Selatan", x: 58.5, y: 65.7 },
    { id: "palu", label: "Sulawesi Tengah", x: 55.8, y: 51.0 },
    { id: "manado", label: "Sulawesi Utara", x: 69.0, y: 38.1 },
    { id: "lombok", label: "Nusa Tenggara Barat", x: 65.6, y: 79.0 },
    { id: "kupang", label: "Nusa Tenggara Timur", x: 75.2, y: 78.3 },
    { id: "ambon", label: "Maluku", x: 71.7, y: 56.6 },
    { id: "sorong", label: "Papua Barat", x: 81.0, y: 71.3 },
    { id: "jayapura", label: "Papua", x: 88.4, y: 62.2 },
  ];
  const INDONESIA_PRESENCE_VERSION = "20260608-map6";
  let assetsWarmStarted = false;
  let lastStaticEnhanceKey = "";
  let structuralMarkdownPromise = null;
  let structuralMarkdownPayload = null;
  let structuralRefreshTimer = null;
  let structuralRefreshRoot = null;
  let structuralRefreshEventsInstalled = false;
  let combatRosterPromise = null;
  let combatRosterPayload = null;
  let combatRosterRefreshTimer = null;
  let combatRosterRefreshEventsInstalled = false;
  let streamerContentCache = null;
  let streamerContentPromise = null;
  let navEnhancementsInstalled = false;
  let pendingAnchorTimer = 0;
  let locationConsentInFlight = false;
  const STATE = {
    statusLoaded: false,
    configured: false,
    authenticated: false,
    user: null,
    hasAllowedRole: false,
    locationStatusLoaded: false,
    hasLocationCode: false,
    locationCodeHint: "",
    missing: [],
    allowedRoleIds: [],
  };

  function assetType(href) {
    if (href.endsWith(".js")) {
      return "script";
    }
    if (href.endsWith(".css")) {
      return "style";
    }
    return "image";
  }

  function addResourceHint(rel, href, attrs = {}) {
    if (!href || document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        link.setAttribute(key, value);
      }
    });
    document.head.appendChild(link);
  }

  function installPerformanceHints() {
    addResourceHint("preconnect", "https://fonts.googleapis.com", { crossorigin: "" });
    addResourceHint("preconnect", "https://fonts.gstatic.com", { crossorigin: "" });

    document.querySelectorAll("script[src], link[rel='stylesheet'][href]").forEach((node) => {
      const href = node.getAttribute("src") || node.getAttribute("href");
      if (href && href.startsWith("/assets/")) {
        const rel = node.tagName === "SCRIPT" && node.getAttribute("type") === "module" ? "modulepreload" : "preload";
        const attrs = rel === "modulepreload" ? { crossorigin: "" } : { as: assetType(href), crossorigin: "" };
        addResourceHint(rel, href, attrs);
      }
    });

    PASKUS_CRITICAL_ASSETS.forEach((href) => {
      addResourceHint("preload", href, { as: "image", fetchpriority: "high" });
    });
  }

  function idleTask(callback, timeout = 1600) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout });
      return;
    }
    window.setTimeout(callback, 120);
  }

  function warmImage(href, priority = "low") {
    return new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      image.decoding = "async";
      image.loading = priority === "high" ? "eager" : "lazy";
      image.fetchPriority = priority;
      image.onload = finish;
      image.onerror = finish;
      image.src = href;
      if (image.decode) {
        image.decode().then(finish).catch(finish);
      }
    });
  }

  function warmWebsiteAssets() {
    if (assetsWarmStarted) {
      return;
    }
    assetsWarmStarted = true;
    installPerformanceHints();

    const uniqueAssets = Array.from(new Set([...PASKUS_CRITICAL_ASSETS, ...PASKUS_IDLE_ASSETS]));
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const isMobile = window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
    const connection = navigator.connection || {};
    const slowNetwork = typeof connection.effectiveType === "string" && /(^|-)2g|3g/i.test(connection.effectiveType);
    const concurrency = saveData || isMobile || slowNetwork ? 1 : 2;
    let cursor = 0;

    const runNext = () => {
      if (document.visibilityState === "hidden" || cursor >= uniqueAssets.length) {
        return;
      }
      const batch = uniqueAssets.slice(cursor, cursor + concurrency);
      cursor += batch.length;
      batch.forEach((href) => {
        if (!PASKUS_CRITICAL_ASSETS.includes(href)) {
          addResourceHint("prefetch", href, { as: "image", fetchpriority: "low" });
        }
      });
      Promise.all(batch.map((href) => warmImage(href, PASKUS_CRITICAL_ASSETS.includes(href) ? "high" : "low")))
        .finally(() => idleTask(runNext, 2200));
    };

    idleTask(runNext, 700);
  }

  const styles = document.createElement("style");
  styles.textContent = `
    :root {
      --paskus-nav-offset: 92px;
      scroll-padding-top: var(--paskus-nav-offset);
    }
    html {
      scroll-behavior: smooth;
    }
    nav.paskus-floating-nav,
    header.paskus-floating-nav,
    .paskus-structure-page .structure-nav.paskus-floating-nav,
    .paskus-about-page .about-nav.paskus-floating-nav,
    .paskus-support-detail-page .support-nav.paskus-floating-nav,
    .paskus-komodo-page .paskus-komodo-nav.paskus-floating-nav,
    .paskus-streamer-page .streamer-nav.paskus-floating-nav {
      position: fixed !important;
      z-index: 90 !important;
      top: 14px !important;
      left: 50% !important;
      right: auto !important;
      width: min(1180px, calc(100vw - 28px)) !important;
      border: 1px solid rgba(239, 191, 4, 0.18) !important;
      border-radius: 22px !important;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(157, 193, 131, 0.035)),
        rgba(0, 0, 0, 0.66) !important;
      box-shadow:
        0 18px 46px rgba(0, 0, 0, 0.42),
        0 0 0 1px rgba(255, 255, 255, 0.035) inset !important;
      backdrop-filter: blur(18px) saturate(135%) !important;
      -webkit-backdrop-filter: blur(18px) saturate(135%) !important;
      transform: translate3d(-50%, 0, 0) !important;
      transform-origin: top center;
      transition:
        transform 420ms cubic-bezier(0.2, 0.78, 0.18, 1),
        opacity 260ms ease,
        background 220ms ease,
        border-color 220ms ease,
        box-shadow 220ms ease !important;
      will-change: transform, opacity;
    }
    html.paskus-nav-hidden nav.paskus-floating-nav,
    html.paskus-nav-hidden header.paskus-floating-nav {
      opacity: 0.06;
      pointer-events: none;
      transform: translate3d(-50%, calc(-100% - 32px), 0) scale(0.985) !important;
    }
    html.paskus-nav-scrolled nav.paskus-floating-nav,
    html.paskus-nav-scrolled header.paskus-floating-nav {
      border-color: rgba(239, 191, 4, 0.28) !important;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.09), rgba(157, 193, 131, 0.05)),
        rgba(0, 0, 0, 0.76) !important;
      box-shadow:
        0 22px 56px rgba(0, 0, 0, 0.52),
        0 0 0 1px rgba(255, 255, 255, 0.045) inset !important;
    }
    nav.paskus-floating-nav a,
    header.paskus-floating-nav a,
    nav.paskus-floating-nav button,
    header.paskus-floating-nav button {
      transition:
        color 180ms ease,
        border-color 180ms ease,
        background 180ms ease,
        transform 180ms ease,
        opacity 180ms ease !important;
    }
    nav.paskus-floating-nav a:hover,
    header.paskus-floating-nav a:hover,
    nav.paskus-floating-nav button:hover,
    header.paskus-floating-nav button:hover {
      transform: translateY(-1px);
    }
    .paskus-language-switcher {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      position: relative;
      border: 1px solid rgba(239, 191, 4, 0.2);
      border-radius: 999px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(157, 193, 131, 0.04)),
        rgba(4, 7, 5, 0.62);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 12px 28px rgba(0, 0, 0, 0.22);
      margin-left: 10px;
      padding: 0;
      overflow: hidden;
    }
    .paskus-language-switcher::after {
      content: "";
      position: absolute;
      right: 13px;
      top: 50%;
      width: 7px;
      height: 7px;
      border-right: 2px solid rgba(255, 243, 191, 0.82);
      border-bottom: 2px solid rgba(255, 243, 191, 0.82);
      pointer-events: none;
      transform: translateY(-68%) rotate(45deg);
    }
    .paskus-language-select {
      appearance: none;
      -webkit-appearance: none;
      width: 154px;
      min-height: 34px;
      border: 1px solid transparent;
      border-radius: 999px;
      background:
        linear-gradient(135deg, rgba(239, 191, 4, 0.14), rgba(157, 193, 131, 0.08)),
        transparent;
      color: rgba(255, 248, 218, 0.94);
      cursor: pointer;
      font-family: Inter, system-ui, sans-serif;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1;
      outline: none;
      padding: 0 34px 0 14px;
      text-transform: none;
    }
    .paskus-language-select:focus-visible {
      border-color: rgba(255, 222, 138, 0.72);
      box-shadow:
        0 0 0 2px rgba(239, 191, 4, 0.18),
        0 0 20px rgba(239, 191, 4, 0.16);
    }
    .paskus-language-select option {
      color: #07100b;
      background: #f4eed9;
      font-weight: 800;
    }
    .paskus-language-switcher[data-active-lang="jv"] .paskus-language-select {
      background:
        radial-gradient(circle at 18% 28%, rgba(239, 191, 4, 0.45) 0 2px, transparent 3px),
        radial-gradient(circle at 76% 68%, rgba(157, 193, 131, 0.36) 0 2px, transparent 3px),
        repeating-linear-gradient(135deg, rgba(92, 53, 22, 0.72) 0 5px, rgba(14, 10, 7, 0.82) 5px 10px);
      color: #fff4c8;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
    }
    .paskus-language-switcher[data-active-lang="su"] .paskus-language-select {
      background:
        linear-gradient(135deg, rgba(157, 193, 131, 0.2), rgba(239, 191, 4, 0.12)),
        rgba(8, 28, 16, 0.5);
      color: #edffd8;
    }
    .body-nav.paskus-main-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      min-height: 72px;
      padding: 14px 18px;
    }
    .body-nav.paskus-main-nav .nav-logo {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      min-width: 210px;
      color: #ffffff;
      text-decoration: none;
    }
    .body-nav.paskus-main-nav .nav-logo img {
      width: 44px;
      height: 44px;
      object-fit: contain;
      margin-right: 12px;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.45));
    }
    .body-nav.paskus-main-nav .nav-logo span {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .body-nav.paskus-main-nav .nav-logo strong {
      color: #f6f7f0;
      font-family: Inter, system-ui, sans-serif;
      font-size: 18px;
      font-weight: 950;
      letter-spacing: 0.02em;
    }
    .body-nav.paskus-main-nav .nav-logo span span {
      color: rgba(255, 255, 255, 0.86);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      margin-top: 3px;
      text-transform: uppercase;
    }
    .body-nav.paskus-main-nav .nav-links {
      display: flex;
      flex: 1 1 auto;
      align-items: center;
      justify-content: center;
      gap: clamp(14px, 1.6vw, 28px);
      min-width: 0;
    }
    .body-nav.paskus-main-nav .nav-links a {
      flex: 0 0 auto;
      color: rgba(226, 231, 224, 0.62);
      font-family: Inter, system-ui, sans-serif;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.14em;
      line-height: 1;
      text-decoration: none;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .body-nav.paskus-main-nav .nav-links a:hover,
    .body-nav.paskus-main-nav .nav-links a[aria-current="page"] {
      color: #ffffff;
    }
    .body-nav.paskus-main-nav .btn-discord,
    .body-nav.paskus-main-nav .discord-link {
      border: 1px solid rgba(230, 236, 232, 0.46);
      background: rgba(255, 255, 255, 0.035);
      color: rgba(246, 247, 240, 0.86);
      min-height: 34px;
      padding: 0 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .body-nav.paskus-main-nav .paskus-language-switcher {
      margin-left: 0;
    }
    @media (max-width: 1100px) {
      .body-nav.paskus-main-nav {
        gap: 12px;
      }
      .body-nav.paskus-main-nav .nav-logo {
        min-width: 182px;
      }
      .body-nav.paskus-main-nav .nav-links {
        gap: 13px;
      }
      .body-nav.paskus-main-nav .nav-links a {
        font-size: 10.5px;
        letter-spacing: 0.1em;
      }
    }
    @media (max-width: 720px) {
      :root {
        --paskus-nav-offset: 116px;
      }
      nav.paskus-floating-nav,
      header.paskus-floating-nav,
      .paskus-structure-page .structure-nav.paskus-floating-nav,
      .paskus-about-page .about-nav.paskus-floating-nav,
      .paskus-support-detail-page .support-nav.paskus-floating-nav,
      .paskus-komodo-page .paskus-komodo-nav.paskus-floating-nav,
      .paskus-streamer-page .streamer-nav.paskus-floating-nav {
        top: 10px !important;
        left: 10px !important;
        right: 10px !important;
        width: auto !important;
        border-radius: 18px !important;
        max-width: calc(100vw - 20px) !important;
        max-height: none !important;
        overflow: visible !important;
        transform: translate3d(0, 0, 0) !important;
      }
      html.paskus-nav-hidden nav.paskus-floating-nav,
      html.paskus-nav-hidden header.paskus-floating-nav {
        transform: translate3d(0, calc(-100% - 32px), 0) scale(0.985) !important;
      }
      .paskus-language-switcher {
        margin-left: auto;
      }
      .paskus-language-select {
        width: 112px;
        min-height: 30px;
        font-size: 9.5px;
        padding-left: 9px;
        padding-right: 24px;
      }
      .paskus-language-switcher::after {
        right: 10px;
        width: 6px;
        height: 6px;
      }
      .body-nav.paskus-main-nav {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 10px 12px;
        min-height: 0;
        padding: 12px;
        box-sizing: border-box;
      }
      .body-nav.paskus-main-nav .nav-logo {
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        max-width: 100%;
      }
      .body-nav.paskus-main-nav .nav-logo img {
        width: 34px;
        height: 34px;
        margin-right: 9px;
      }
      .body-nav.paskus-main-nav .nav-logo strong {
        font-size: 14px;
      }
      .body-nav.paskus-main-nav .nav-logo span span {
        font-size: 8.5px;
        letter-spacing: 0.08em;
      }
      .body-nav.paskus-main-nav .nav-links {
        grid-column: 1 / -1;
        grid-row: 2;
        width: 100%;
        max-width: 100%;
        justify-content: flex-start;
        gap: 9px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 2px 1px 3px;
        scrollbar-width: none;
      }
      .body-nav.paskus-main-nav .paskus-language-switcher {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
      }
      .body-nav.paskus-main-nav .nav-links::-webkit-scrollbar {
        display: none;
      }
      .body-nav.paskus-main-nav .nav-links a {
        border: 1px solid rgba(239, 191, 4, 0.14);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.035);
        font-size: 9px;
        letter-spacing: 0.06em;
        min-height: 28px;
        padding: 0 10px;
      }
      .body-nav.paskus-main-nav .btn-discord,
      .body-nav.paskus-main-nav .discord-link {
        min-height: 28px;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center !important;
        gap: 10px 12px !important;
        padding: 12px !important;
        box-sizing: border-box !important;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:first-child {
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:nth-child(2):not(.paskus-language-switcher) {
        display: flex !important;
        grid-column: 1 / -1;
        grid-row: 2;
        width: 100%;
        max-width: 100%;
        justify-content: flex-start !important;
        gap: 9px !important;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 2px 1px 3px;
        scrollbar-width: none;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:nth-child(2):not(.paskus-language-switcher)::-webkit-scrollbar {
        display: none;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:nth-child(2):not(.paskus-language-switcher) a {
        flex: 0 0 auto;
        min-height: 28px;
        border: 1px solid rgba(239, 191, 4, 0.14);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.035);
        padding: 8px 10px;
        font-size: 9px;
        letter-spacing: 0.06em;
        line-height: 1;
        white-space: nowrap;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:not(:first-child):not(.paskus-language-switcher) {
        display: flex !important;
        grid-column: 1 / -1;
        grid-row: 2;
        width: 100%;
        max-width: 100%;
        justify-content: flex-start !important;
        gap: 9px !important;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 2px 1px 3px;
        scrollbar-width: none;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:not(:first-child):not(.paskus-language-switcher)::-webkit-scrollbar {
        display: none;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:not(:first-child):not(.paskus-language-switcher) a {
        flex: 0 0 auto;
        min-height: 28px;
        border: 1px solid rgba(239, 191, 4, 0.14);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.035);
        padding: 8px 10px;
        font-size: 9px;
        letter-spacing: 0.06em;
        line-height: 1;
        white-space: nowrap;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > button {
        display: none !important;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) .paskus-language-switcher {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) {
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 9px !important;
        min-height: 62px !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        padding: 10px !important;
        scrollbar-width: none;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav)::-webkit-scrollbar {
        display: none;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:first-child {
        flex: 0 0 148px !important;
        grid-column: auto !important;
        grid-row: auto !important;
        min-width: 148px !important;
        order: 1;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:first-child img {
        width: 32px !important;
        height: 32px !important;
        margin-right: 9px !important;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > div:not(:first-child):not(.paskus-language-switcher) {
        flex: 0 0 auto !important;
        grid-column: auto !important;
        grid-row: auto !important;
        width: auto !important;
        max-width: none !important;
        overflow: visible !important;
        padding: 0 !important;
        order: 3;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) > a.paskus-structural-header-cta {
        flex: 0 0 auto !important;
        order: 3;
        min-height: 28px !important;
        border: 1px solid rgba(239, 191, 4, 0.2) !important;
        border-radius: 999px !important;
        background: rgba(255, 255, 255, 0.035) !important;
        padding: 8px 10px !important;
        font-size: 9px !important;
        letter-spacing: 0.06em !important;
        line-height: 1 !important;
        white-space: nowrap !important;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) .paskus-language-switcher {
        flex: 0 0 auto !important;
        grid-column: auto !important;
        grid-row: auto !important;
        justify-self: auto !important;
        margin-left: 0 !important;
        order: 2;
      }
      nav.paskus-floating-nav:not(.paskus-main-nav):not(.structure-nav):not(.about-nav):not(.support-nav):not(.paskus-komodo-nav):not(.streamer-nav) .paskus-language-select {
        width: 118px;
      }
    }
    .paskus-discord-sync {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 70;
      width: min(380px, calc(100vw - 28px));
      border: 1px solid rgba(157, 193, 131, 0.35);
      background: rgba(7, 10, 8, 0.92);
      color: #f4f7f0;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(12px);
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 14px;
    }
    .paskus-discord-sync--embedded {
      position: relative;
      right: auto;
      bottom: auto;
      width: min(640px, 100%);
      margin: 0 auto 10px;
      grid-column: 1 / -1;
      text-align: center;
      border-color: rgba(239, 191, 4, 0.42);
      background:
        linear-gradient(145deg, rgba(239, 191, 4, 0.14), rgba(157, 193, 131, 0.08)),
        rgba(9, 13, 10, 0.78);
      border-radius: 18px;
      box-shadow:
        0 22px 70px rgba(0, 0, 0, 0.42),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    .paskus-register-card {
      position: relative;
      overflow: hidden;
      border-radius: 26px;
      border: 1px solid rgba(239, 191, 4, 0.34) !important;
      background:
        linear-gradient(115deg, rgba(3, 4, 4, 0.92), rgba(3, 4, 4, 0.66) 48%, rgba(3, 4, 4, 0.9)),
        radial-gradient(circle at 15% 0%, rgba(239, 191, 4, 0.17), transparent 34%),
        radial-gradient(circle at 88% 18%, rgba(157, 193, 131, 0.18), transparent 30%),
        url("/assets/paskus-bg-briefing-helmets-v1.webp") center 42% / cover no-repeat,
        linear-gradient(145deg, rgba(11, 14, 11, 0.86), rgba(5, 7, 6, 0.76)) !important;
      box-shadow:
        0 30px 90px rgba(0, 0, 0, 0.56),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        inset 0 -1px 0 rgba(239, 191, 4, 0.08);
      backdrop-filter: blur(22px) saturate(125%);
    }
    .paskus-register-card::before {
      content: "";
      position: absolute;
      inset: 1px;
      pointer-events: none;
      border-radius: 25px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background:
        linear-gradient(180deg, rgba(3, 4, 4, 0.16), rgba(3, 4, 4, 0.54)),
        linear-gradient(90deg, rgba(255, 255, 255, 0.026) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
      background-size: auto, 78px 78px, 78px 78px;
      opacity: 0.92;
    }
    .paskus-register-form {
      position: relative;
      gap: 18px !important;
    }
    .paskus-register-form > .paskus-discord-inline {
      display: none;
    }
    .paskus-register-form input,
    .paskus-register-form select,
    .paskus-register-form textarea,
    .paskus-discord-id-field input {
      min-height: 58px;
      border: 1px solid rgba(157, 193, 131, 0.28) !important;
      border-radius: 14px !important;
      background: rgba(255, 255, 255, 0.065) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 12px 28px rgba(0, 0, 0, 0.18);
      backdrop-filter: blur(10px);
      padding: 16px 17px !important;
      transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }
    .paskus-register-form input:focus,
    .paskus-register-form select:focus,
    .paskus-register-form textarea:focus,
    .paskus-discord-id-field input:focus {
      border-color: rgba(239, 191, 4, 0.72) !important;
      background: rgba(255, 255, 255, 0.1) !important;
      box-shadow:
        0 0 0 3px rgba(239, 191, 4, 0.12),
        0 18px 36px rgba(0, 0, 0, 0.24);
    }
    .paskus-register-form input[readonly],
    .paskus-discord-id-field input[readonly] {
      color: #f5e8a8 !important;
      border-color: rgba(239, 191, 4, 0.34) !important;
      background: rgba(239, 191, 4, 0.09) !important;
    }
    .paskus-register-form #roblox-username { order: 10; }
    .paskus-register-form #discord-username { order: 11; }
    .paskus-register-form .paskus-discord-id-field { order: 12; grid-column: 1 / -1; }
    .paskus-register-form #Gender { order: 20; grid-column: auto !important; }
    .paskus-register-form #roblox-Age { order: 21; }
    .paskus-register-form #masuk-via { order: 30; }
    .paskus-register-form #Resimen { order: 31; }
    .paskus-register-form #Status { order: 40; grid-column: auto !important; }
    .paskus-register-form #Device { order: 41; grid-column: auto !important; }
    .paskus-register-form #Golongan { order: 50; grid-column: 1 / -1 !important; }
    .paskus-golongan-info {
      order: 51;
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: -8px;
    }
    .paskus-golongan-info article {
      border: 1px solid rgba(239, 191, 4, 0.2);
      border-radius: 14px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(157, 193, 131, 0.045)),
        rgba(7, 10, 8, 0.64);
      padding: 12px;
    }
    .paskus-golongan-info strong {
      display: block;
      color: #efbf04;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .paskus-golongan-info span {
      display: block;
      color: rgba(238, 242, 232, 0.72);
      font-size: 11px;
      line-height: 1.45;
      margin-top: 5px;
    }
    .paskus-register-form #submit-btn {
      order: 60;
      grid-column: 1 / -1;
      border-radius: 16px;
      box-shadow: 0 18px 42px rgba(239, 191, 4, 0.18);
    }
    .paskus-discord-id-field {
      display: grid;
      gap: 8px;
    }
    .paskus-discord-id-field label {
      color: #efbf04;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    @media (max-width: 767px) {
      .paskus-register-card {
        border-radius: 20px;
      }
      .paskus-discord-sync--embedded {
        border-radius: 16px;
      }
      .paskus-register-form #Gender,
      .paskus-register-form #Status,
      .paskus-register-form #Device {
        grid-column: 1 / -1 !important;
      }
    }
    .paskus-discord-sync strong {
      display: block;
      font-size: 12px;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      color: #efbf04;
      margin-bottom: 6px;
    }
    .paskus-discord-sync p {
      margin: 0 0 12px;
      font-size: 12px;
      line-height: 1.55;
      color: #d6ded0;
    }
    .paskus-discord-sync code {
      color: #efbf04;
      font-size: 11px;
      word-break: break-all;
    }
    .paskus-discord-privacy,
    .paskus-location-privacy {
      display: block;
      margin: -4px auto 12px;
      max-width: 520px;
      color: rgba(238, 242, 232, 0.62);
      font-size: 10.5px;
      font-weight: 700;
      line-height: 1.45;
    }
    .paskus-location-privacy {
      margin-top: -6px;
      color: rgba(239, 191, 4, 0.72);
    }
    .paskus-discord-inline .paskus-discord-privacy {
      margin: 7px 0 0;
      color: rgba(238, 242, 232, 0.68);
    }
    .paskus-discord-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .paskus-discord-sync--embedded .paskus-discord-actions {
      justify-content: center;
    }
    .paskus-discord-actions a,
    .paskus-discord-actions button {
      appearance: none;
      border: 1px solid rgba(239, 191, 4, 0.45);
      background: rgba(239, 191, 4, 0.12);
      color: #fff7d1;
      cursor: pointer;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 9px 11px;
      text-decoration: none;
      text-transform: uppercase;
    }
    .paskus-discord-actions button {
      border-color: rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.06);
      color: #d7ddd2;
    }
    .paskus-discord-inline {
      border: 1px solid rgba(157, 193, 131, 0.3);
      background: rgba(157, 193, 131, 0.08);
      color: #e9f1df;
      font-size: 12px;
      line-height: 1.5;
      margin: 0 0 16px;
      padding: 12px;
    }
    .paskus-discord-inline a {
      color: #efbf04;
      font-weight: 700;
      text-decoration: none;
    }
    .paskus-cs-ai {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 95;
      width: min(360px, calc(100vw - 28px));
      color: #f4f7f0;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      pointer-events: none;
    }
    .paskus-cs-ai * {
      box-sizing: border-box;
    }
    .paskus-cs-ai-toggle,
    .paskus-cs-ai-panel {
      pointer-events: auto;
    }
    .paskus-cs-ai-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: auto;
      min-height: 54px;
      margin-left: auto;
      border: 1px solid rgba(239, 191, 4, 0.34);
      border-radius: 999px;
      background:
        linear-gradient(145deg, rgba(239, 191, 4, 0.18), rgba(157, 193, 131, 0.08)),
        rgba(5, 8, 6, 0.86);
      color: #fff7d1;
      box-shadow:
        0 18px 46px rgba(0, 0, 0, 0.48),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
      cursor: pointer;
      padding: 8px 14px 8px 8px;
      backdrop-filter: blur(16px) saturate(130%);
      -webkit-backdrop-filter: blur(16px) saturate(130%);
    }
    .paskus-cs-ai-toggle img,
    .paskus-cs-ai-head img {
      width: 38px;
      height: 38px;
      object-fit: contain;
      filter: drop-shadow(0 0 14px rgba(239, 191, 4, 0.2));
    }
    .paskus-cs-ai-toggle strong,
    .paskus-cs-ai-head strong {
      display: block;
      color: #ffffff;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1.1;
      text-align: left;
      text-transform: uppercase;
    }
    .paskus-cs-ai-toggle span,
    .paskus-cs-ai-head span {
      display: block;
      color: rgba(239, 191, 4, 0.86);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.06em;
      margin-top: 3px;
      text-align: left;
      text-transform: uppercase;
    }
    .paskus-cs-ai-panel {
      display: none;
      overflow: hidden;
      border: 1px solid rgba(239, 191, 4, 0.26);
      border-radius: 22px;
      background:
        radial-gradient(circle at 18% 0%, rgba(239, 191, 4, 0.14), transparent 34%),
        linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(157, 193, 131, 0.035)),
        rgba(4, 7, 5, 0.92);
      box-shadow:
        0 24px 70px rgba(0, 0, 0, 0.54),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px) saturate(132%);
      -webkit-backdrop-filter: blur(20px) saturate(132%);
    }
    .paskus-cs-ai.is-open .paskus-cs-ai-toggle {
      display: none;
    }
    .paskus-cs-ai.is-open .paskus-cs-ai-panel {
      display: block;
      animation: paskusCsIn 220ms ease both;
    }
    @keyframes paskusCsIn {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .paskus-cs-ai-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid rgba(239, 191, 4, 0.16);
      padding: 12px;
    }
    .paskus-cs-ai-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .paskus-cs-ai-close {
      appearance: none;
      width: 34px;
      height: 34px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      color: #f4f7f0;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
    }
    .paskus-cs-ai-log {
      display: grid;
      gap: 9px;
      max-height: min(52vh, 390px);
      overflow: auto;
      padding: 12px;
      scrollbar-width: thin;
    }
    .paskus-cs-ai-message {
      width: fit-content;
      max-width: 92%;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(241, 246, 237, 0.86);
      font-size: 12px;
      line-height: 1.55;
      padding: 10px 11px;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }
    .paskus-cs-ai-message--user {
      justify-self: end;
      border-color: rgba(239, 191, 4, 0.28);
      background: rgba(239, 191, 4, 0.13);
      color: #fff7d1;
    }
    .paskus-cs-ai-message--bot {
      justify-self: start;
      white-space: normal;
    }
    .paskus-cs-ai-message--bot p {
      margin: 0 0 8px;
    }
    .paskus-cs-ai-message--bot p:last-child,
    .paskus-cs-ai-message--bot ul:last-child,
    .paskus-cs-ai-message--bot ol:last-child {
      margin-bottom: 0;
    }
    .paskus-cs-ai-message--bot ul,
    .paskus-cs-ai-message--bot ol {
      display: grid;
      gap: 5px;
      margin: 8px 0;
      padding-left: 18px;
    }
    .paskus-cs-ai-message--bot strong {
      color: #fff3bf;
      font-weight: 900;
    }
    .paskus-cs-ai-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 10px;
    }
    .paskus-cs-ai-actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 30px;
      border: 1px solid rgba(239, 191, 4, 0.36);
      border-radius: 999px;
      background: rgba(239, 191, 4, 0.12);
      color: #fff3bf;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1.2;
      padding: 7px 10px;
      text-decoration: none;
      transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
    }
    .paskus-cs-ai-actions a:hover,
    .paskus-cs-ai-actions a:focus-visible {
      border-color: rgba(239, 191, 4, 0.72);
      background: rgba(239, 191, 4, 0.2);
      transform: translateY(-1px);
    }
    .paskus-cs-ai-message--alert {
      border-color: rgba(218, 54, 56, 0.32);
      background: rgba(218, 54, 56, 0.13);
    }
    .paskus-cs-ai-message--typing {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: rgba(241, 246, 237, 0.72);
    }
    .paskus-cs-ai-typing {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding-left: 2px;
    }
    .paskus-cs-ai-typing span {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: #efbf04;
      opacity: 0.38;
      animation: paskusAiTyping 920ms ease-in-out infinite;
    }
    .paskus-cs-ai-typing span:nth-child(2) {
      animation-delay: 120ms;
    }
    .paskus-cs-ai-typing span:nth-child(3) {
      animation-delay: 240ms;
    }
    @keyframes paskusAiTyping {
      0%, 80%, 100% { opacity: 0.32; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-3px); }
    }
    .paskus-cs-ai-form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      border-top: 1px solid rgba(239, 191, 4, 0.16);
      padding: 12px;
    }
    .paskus-cs-ai-form input {
      min-width: 0;
      min-height: 42px;
      border: 1px solid rgba(157, 193, 131, 0.24);
      border-radius: 13px;
      background: rgba(255, 255, 255, 0.07);
      color: #f5f7ef;
      font-size: 12px;
      outline: none;
      padding: 0 12px;
    }
    .paskus-cs-ai-form button {
      min-height: 42px;
      border: 1px solid rgba(239, 191, 4, 0.45);
      border-radius: 13px;
      background: rgba(239, 191, 4, 0.14);
      color: #fff7d1;
      cursor: pointer;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.08em;
      padding: 0 13px;
      text-transform: uppercase;
    }
    .paskus-cs-ai-note {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      color: rgba(238, 242, 232, 0.54);
      font-size: 9.5px;
      font-weight: 700;
      line-height: 1.4;
      padding: 0 12px 12px;
    }
    #combat {
      position: relative;
      isolation: isolate;
      scroll-margin-top: 96px;
      height: auto !important;
      min-height: auto !important;
      padding: clamp(76px, 8vw, 108px) clamp(16px, 4vw, 40px) !important;
      background:
        radial-gradient(circle at 18% 18%, rgba(157, 193, 131, 0.17), transparent 34%),
        radial-gradient(circle at 84% 14%, rgba(239, 191, 4, 0.13), transparent 32%),
        linear-gradient(180deg, rgba(4, 5, 5, 0.78), rgba(8, 10, 9, 0.64) 48%, rgba(4, 5, 5, 0.9)),
        linear-gradient(120deg, rgba(3, 5, 4, 0.72), rgba(3, 5, 4, 0.22) 50%, rgba(3, 5, 4, 0.82)),
        url("/assets/paskus-bg-mountain-scout-v1.webp") center 42% / cover no-repeat,
        linear-gradient(135deg, rgba(239, 191, 4, 0.08), transparent 28%, rgba(157, 193, 131, 0.08) 72%, transparent) !important;
    }
    #combat::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(135deg, rgba(239, 191, 4, 0.08), transparent 36%, rgba(157, 193, 131, 0.075));
      background-size: 84px 84px;
      mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
      opacity: 0.52;
    }
    #combat .max-w-7xl {
      position: relative;
      z-index: 1;
    }
    #combat .mb-20 {
      margin-bottom: clamp(34px, 5vw, 58px) !important;
    }
    #combat .grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 315px), 1fr)) !important;
      gap: clamp(18px, 2.4vw, 32px) !important;
      align-items: stretch;
    }
    #combat .flip-card { order: 40; }
    #combat .flip-card.paskus-unit-gatam { order: 1; }
    #combat .flip-card.paskus-unit-bringas { order: 2; }
    #combat .flip-card.paskus-unit-toruk { order: 3; }
    #combat .flip-card.paskus-unit-sierra { order: 4; }
    #combat .flip-card.paskus-unit-pathfinder { order: 5; }
    #combat .flip-card.paskus-unit-sentinel { order: 6; }
    #combat .flip-card.paskus-unit-komodo { order: 7; }
    @media (min-width: 980px) {
      #combat .grid {
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      }
      #combat .flip-card {
        grid-column: span 2;
      }
      #combat .flip-card.paskus-unit-gatam,
      #combat .flip-card.paskus-unit-komodo {
        grid-column: 1 / -1;
      }
      #combat .flip-card.paskus-unit-bringas,
      #combat .flip-card.paskus-unit-toruk {
        grid-column: span 3;
      }
    }
    @media (min-width: 721px) and (max-width: 979px) {
      #combat .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      #combat .flip-card.paskus-unit-gatam,
      #combat .flip-card.paskus-unit-komodo {
        grid-column: 1 / -1;
      }
    }
    #combat .flip-card {
      position: relative;
      height: auto !important;
      min-height: clamp(282px, 24vw, 330px);
      border-radius: 24px;
      perspective: 1500px;
      transform-style: preserve-3d;
      transition: transform 220ms ease, box-shadow 220ms ease;
      box-shadow: 0 24px 34px rgba(0, 0, 0, 0.34);
      contain: layout style;
      content-visibility: auto;
      contain-intrinsic-size: auto 330px;
      isolation: isolate;
    }
    #combat .flip-card.paskus-unit-sierra,
    #combat .flip-card.paskus-unit-pathfinder,
    #combat .flip-card.paskus-unit-sentinel {
      min-height: clamp(302px, 25vw, 350px);
    }
    #combat .flip-card.paskus-unit-sierra {
      min-height: clamp(348px, 28vw, 392px);
      contain-intrinsic-size: auto 392px;
    }
    #combat .flip-card.has-unit-roster {
      min-height: clamp(360px, 30vw, 430px);
      contain-intrinsic-size: auto 430px;
    }
    #combat .flip-card::before {
      content: "";
      position: absolute;
      left: 9%;
      right: 9%;
      bottom: -16px;
      height: 34px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.48);
      filter: blur(18px);
      opacity: 0.76;
      pointer-events: none;
      transition: opacity 220ms ease, transform 220ms ease;
    }
    #combat .flip-card:hover {
      transform: translateY(-8px) rotateX(1.4deg);
      box-shadow: 0 32px 44px rgba(0, 0, 0, 0.42);
    }
    #combat .flip-card:hover::before {
      opacity: 0.95;
      transform: translateY(6px) scaleX(1.04);
    }
    #combat .flip-card-inner {
      position: relative;
      z-index: 1;
      height: 100% !important;
      min-height: inherit;
      border-radius: inherit;
      transform-style: preserve-3d;
      transition: transform 640ms cubic-bezier(0.2, 0.72, 0.22, 1), box-shadow 220ms ease;
    }
    #combat .flip-card:hover .flip-card-inner,
    #combat .flip-card:focus-within .flip-card-inner {
      transform: rotateY(180deg);
    }
    #combat .flip-card-front,
    #combat .flip-card-back {
      position: absolute !important;
      inset: 0;
      min-height: 100%;
      overflow: hidden;
      border-radius: inherit !important;
      border: 1px solid rgba(239, 191, 4, 0.28) !important;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.12), transparent 18%, rgba(255, 255, 255, 0.035) 52%, rgba(239, 191, 4, 0.1)),
        linear-gradient(155deg, rgba(21, 26, 22, 0.78), rgba(7, 9, 8, 0.66)) !important;
      box-shadow:
        0 22px 48px rgba(0, 0, 0, 0.46),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(239, 191, 4, 0.12);
      backdrop-filter: blur(12px) saturate(126%);
      -webkit-backdrop-filter: blur(12px) saturate(126%);
      backface-visibility: hidden;
      transform-style: preserve-3d;
      padding: clamp(22px, 2.2vw, 30px) !important;
    }
    #combat .flip-card-front::before,
    #combat .flip-card-back::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: 23px;
      pointer-events: none;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    #combat .flip-card-front::after,
    #combat .flip-card-back::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(115deg, rgba(255, 255, 255, 0.16), transparent 28%),
        linear-gradient(0deg, rgba(0, 0, 0, 0.28), transparent 42%);
      opacity: 0.62;
    }
    #combat .flip-card-front {
      display: flex !important;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      text-align: center;
      transform: rotateY(0deg) translateZ(1px);
    }
    #combat .flip-card-back {
      display: flex !important;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      text-align: left;
      color: #e8efe2;
      transform: rotateY(180deg) translateZ(1px);
    }
    #combat .paskus-unit-role {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      width: fit-content;
      border: 1px solid rgba(239, 191, 4, 0.24);
      border-radius: 999px;
      background: rgba(8, 10, 9, 0.48);
      color: rgba(244, 238, 205, 0.84);
      font-family: Inter, system-ui, sans-serif;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.12em;
      line-height: 1;
      padding: 7px 10px;
      text-transform: uppercase;
      transform: translateZ(40px);
    }
    #combat .paskus-unit-active-pill {
      position: relative;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      width: fit-content;
      border: 1px solid rgba(239, 191, 4, 0.24);
      border-radius: 999px;
      background: rgba(5, 7, 6, 0.5);
      color: rgba(245, 239, 211, 0.78);
      font-family: Inter, system-ui, sans-serif;
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 0.12em;
      line-height: 1;
      padding: 7px 9px;
      text-transform: uppercase;
      transform: translateZ(40px);
    }
    #combat .paskus-unit-active-pill strong {
      color: #efbf04;
      font-size: 10px;
    }
    #combat .paskus-unit-roster {
      position: relative;
      z-index: 3;
      width: 100%;
      display: grid;
      gap: 9px;
      margin-top: auto;
      transform: translateZ(34px);
    }
    #combat .paskus-unit-roster__copy {
      margin: 0;
      max-width: none;
      color: rgba(242, 238, 220, 0.74);
      font-size: 10px !important;
      font-weight: 700;
      line-height: 1.45 !important;
      transform: none;
    }
    #combat .paskus-unit-roster__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-top: 1px solid rgba(239, 191, 4, 0.18);
      padding-top: 9px;
    }
    #combat .paskus-unit-roster__head span {
      color: rgba(255, 255, 255, 0.58);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    #combat .paskus-unit-roster__head strong {
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 16px;
      line-height: 1;
    }
    #combat .paskus-unit-roster__grid {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(112px, 1fr);
      grid-template-rows: repeat(4, minmax(29px, auto));
      gap: 6px;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      overscroll-behavior-inline: contain;
      padding: 1px 0 6px;
      scrollbar-color: rgba(239, 191, 4, 0.48) rgba(255, 255, 255, 0.06);
    }
    #combat .paskus-unit-roster__grid::-webkit-scrollbar {
      height: 6px;
    }
    #combat .paskus-unit-roster__grid::-webkit-scrollbar-track {
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
    }
    #combat .paskus-unit-roster__grid::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: rgba(239, 191, 4, 0.44);
    }
    #combat .paskus-unit-member {
      display: flex;
      min-width: 0;
      min-height: 29px;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(239, 191, 4, 0.17);
      border-radius: 9px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(239, 191, 4, 0.045)),
        rgba(0, 0, 0, 0.3);
      color: rgba(238, 244, 234, 0.86);
      font-family: "Space Grotesk", Inter, system-ui, sans-serif;
      font-size: 8.5px;
      font-weight: 800;
      line-height: 1.2;
      padding: 5px 6px;
      text-align: center;
      overflow-wrap: anywhere;
    }
    #combat .paskus-unit-roster__empty {
      border: 1px dashed rgba(239, 191, 4, 0.22);
      border-radius: 12px;
      color: rgba(242, 238, 220, 0.55);
      font-size: 9px;
      font-weight: 800;
      line-height: 1.45;
      padding: 10px;
      text-align: center;
    }
    @media (min-width: 980px) {
      #combat .flip-card.paskus-unit-gatam {
        min-height: clamp(250px, 19vw, 306px);
      }
      #combat .flip-card.paskus-unit-gatam.has-unit-roster {
        min-height: clamp(340px, 24vw, 390px);
        contain-intrinsic-size: auto 390px;
      }
      #combat .flip-card.paskus-unit-gatam .flip-card-front,
      #combat .flip-card.paskus-unit-gatam .flip-card-back,
      #combat .flip-card.paskus-unit-komodo .flip-card-front,
      #combat .flip-card.paskus-unit-komodo .flip-card-back {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: clamp(20px, 3vw, 34px);
        text-align: left;
      }
      #combat .flip-card.paskus-unit-gatam .unit-logo,
      #combat .flip-card.paskus-unit-komodo .unit-logo {
        width: clamp(104px, 8vw, 132px) !important;
        height: clamp(104px, 8vw, 132px) !important;
        flex: 0 0 auto;
      }
      #combat .flip-card.paskus-unit-gatam h4,
      #combat .flip-card.paskus-unit-komodo h4 {
        width: auto;
        flex: 1 1 auto;
        font-size: clamp(24px, 3vw, 38px) !important;
        line-height: 1.02 !important;
      }
      #combat .flip-card.paskus-unit-gatam .paskus-unit-role,
      #combat .flip-card.paskus-unit-komodo .paskus-unit-role {
        flex: 0 0 auto;
      }
      #combat .flip-card.paskus-unit-gatam p,
      #combat .flip-card.paskus-unit-komodo p {
        flex: 1 1 auto;
        max-width: 42rem;
      }
      #combat .flip-card.paskus-unit-gatam.has-unit-roster .flip-card-back {
        flex-wrap: wrap;
        align-content: center;
      }
      #combat .flip-card.paskus-unit-gatam.has-unit-roster .paskus-unit-roster {
        flex: 1 1 100%;
        max-width: min(100%, 980px);
      }
      #combat .flip-card.paskus-unit-gatam a[href^="/unit/"],
      #combat .flip-card.paskus-unit-komodo a[href^="/unit/"] {
        margin-left: auto;
      }
    }
    #combat .flip-card.paskus-unit-toruk .flip-card-front,
    #combat .flip-card.paskus-unit-toruk .flip-card-back {
      border-color: rgba(255, 36, 36, 0.42) !important;
      background:
        linear-gradient(180deg, rgba(4, 6, 6, 0.48), rgba(3, 4, 4, 0.76)),
        linear-gradient(125deg, rgba(255, 36, 36, 0.1), rgba(8, 10, 10, 0.54) 42%, rgba(239, 191, 4, 0.05)),
        url("/assets/toruk-card-bg-card.webp") center 48% / cover no-repeat !important;
      box-shadow:
        0 22px 50px rgba(0, 0, 0, 0.5),
        0 0 34px rgba(255, 36, 36, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(255, 36, 36, 0.18);
    }
    #combat .flip-card.paskus-unit-toruk .flip-card-front::after,
    #combat .flip-card.paskus-unit-toruk .flip-card-back::after {
      background:
        linear-gradient(180deg, rgba(2, 3, 3, 0.12), rgba(2, 3, 3, 0.68)),
        radial-gradient(circle at 50% 34%, rgba(255, 36, 36, 0.08), transparent 44%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.13), transparent 28%);
      opacity: 0.64;
    }
    #combat .flip-card.paskus-unit-toruk .unit-logo {
      filter:
        drop-shadow(0 16px 24px rgba(0, 0, 0, 0.56))
        drop-shadow(0 0 20px rgba(255, 36, 36, 0.34));
    }
    #combat .flip-card.paskus-unit-pathfinder .flip-card-front,
    #combat .flip-card.paskus-unit-pathfinder .flip-card-back {
      border-color: rgba(218, 173, 82, 0.42) !important;
      background:
        linear-gradient(180deg, rgba(4, 6, 6, 0.48), rgba(3, 4, 4, 0.76)),
        linear-gradient(125deg, rgba(218, 173, 82, 0.1), rgba(8, 10, 10, 0.54) 42%, rgba(239, 191, 4, 0.05)),
        url("/assets/pathfinder-card-bg-card.webp") center 48% / cover no-repeat !important;
      box-shadow:
        0 22px 50px rgba(0, 0, 0, 0.5),
        0 0 34px rgba(218, 173, 82, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(218, 173, 82, 0.18);
    }
    #combat .flip-card.paskus-unit-pathfinder .flip-card-front::after,
    #combat .flip-card.paskus-unit-pathfinder .flip-card-back::after {
      background:
        linear-gradient(180deg, rgba(2, 3, 3, 0.12), rgba(2, 3, 3, 0.68)),
        radial-gradient(circle at 50% 34%, rgba(218, 173, 82, 0.08), transparent 44%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.13), transparent 28%);
      opacity: 0.64;
    }
    #combat .flip-card.paskus-unit-pathfinder .unit-logo {
      filter:
        drop-shadow(0 16px 24px rgba(0, 0, 0, 0.56))
        drop-shadow(0 0 20px rgba(218, 173, 82, 0.34));
    }
    #combat .flip-card.paskus-unit-sierra .flip-card-front,
    #combat .flip-card.paskus-unit-sierra .flip-card-back {
      border-color: rgba(146, 146, 136, 0.42) !important;
      background:
        linear-gradient(180deg, rgba(4, 6, 6, 0.5), rgba(3, 4, 4, 0.76)),
        linear-gradient(125deg, rgba(146, 146, 136, 0.11), rgba(8, 10, 10, 0.56) 42%, rgba(239, 191, 4, 0.04)),
        url("/assets/sierra-card-bg-card-v1.webp") center 50% / cover no-repeat !important;
      box-shadow:
        0 22px 50px rgba(0, 0, 0, 0.5),
        0 0 34px rgba(146, 146, 136, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(146, 146, 136, 0.18);
    }
    #combat .flip-card.paskus-unit-sierra .flip-card-front {
      justify-content: center;
      gap: clamp(12px, 1.3vw, 18px);
      padding-top: clamp(24px, 2.2vw, 32px) !important;
      padding-bottom: clamp(34px, 3vw, 46px) !important;
    }
    #combat .flip-card.paskus-unit-sierra .flip-card-front::after,
    #combat .flip-card.paskus-unit-sierra .flip-card-back::after {
      background:
        linear-gradient(180deg, rgba(2, 3, 3, 0.14), rgba(2, 3, 3, 0.7)),
        radial-gradient(circle at 50% 36%, rgba(146, 146, 136, 0.1), transparent 46%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.12), transparent 28%);
      opacity: 0.64;
    }
    #combat .flip-card.paskus-unit-sierra .unit-logo {
      width: clamp(96px, 7.6vw, 128px) !important;
      height: clamp(96px, 7.6vw, 128px) !important;
      object-fit: contain;
      border-radius: 0;
      opacity: 0.96;
      filter:
        drop-shadow(0 18px 28px rgba(0, 0, 0, 0.62))
        drop-shadow(0 0 22px rgba(245, 203, 96, 0.28))
        drop-shadow(0 0 34px rgba(255, 255, 255, 0.08));
    }
    #combat .flip-card.paskus-unit-sierra a[href^="/unit/"] {
      min-height: 38px;
      margin-top: 2px;
      transform: translateZ(42px) translateY(-2px);
    }
    #combat .flip-card.paskus-unit-sentinel .flip-card-front,
    #combat .flip-card.paskus-unit-sentinel .flip-card-back {
      border-color: rgba(218, 54, 56, 0.42) !important;
      background:
        linear-gradient(180deg, rgba(4, 6, 6, 0.48), rgba(3, 4, 4, 0.76)),
        linear-gradient(125deg, rgba(218, 54, 56, 0.1), rgba(8, 10, 10, 0.54) 42%, rgba(239, 191, 4, 0.05)),
        url("/assets/sentinel-snake-card-v1.webp") center 48% / cover no-repeat !important;
      box-shadow:
        0 22px 50px rgba(0, 0, 0, 0.5),
        0 0 34px rgba(218, 54, 56, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(218, 54, 56, 0.18);
    }
    #combat .flip-card.paskus-unit-sentinel .flip-card-front::after,
    #combat .flip-card.paskus-unit-sentinel .flip-card-back::after {
      background:
        linear-gradient(180deg, rgba(2, 3, 3, 0.12), rgba(2, 3, 3, 0.68)),
        radial-gradient(circle at 50% 34%, rgba(218, 54, 56, 0.08), transparent 44%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.13), transparent 28%);
      opacity: 0.64;
    }
    #combat .flip-card.paskus-unit-sentinel .unit-logo {
      width: clamp(96px, 8vw, 128px) !important;
      height: clamp(96px, 8vw, 128px) !important;
      object-fit: contain;
      filter:
        drop-shadow(0 16px 24px rgba(0, 0, 0, 0.56))
        drop-shadow(0 0 20px rgba(218, 54, 56, 0.34));
    }
    #combat .flip-card.paskus-unit-gatam .flip-card-front,
    #combat .flip-card.paskus-unit-gatam .flip-card-back {
      border-color: rgba(166, 171, 154, 0.42) !important;
      background:
        linear-gradient(180deg, rgba(4, 6, 6, 0.48), rgba(3, 4, 4, 0.76)),
        linear-gradient(125deg, rgba(166, 171, 154, 0.1), rgba(8, 10, 10, 0.54) 42%, rgba(239, 191, 4, 0.05)),
        url("/assets/gatam-eagle-card-v1.webp") center 48% / cover no-repeat !important;
      box-shadow:
        0 22px 50px rgba(0, 0, 0, 0.5),
        0 0 34px rgba(166, 171, 154, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(166, 171, 154, 0.18);
    }
    #combat .flip-card.paskus-unit-gatam .flip-card-front::after,
    #combat .flip-card.paskus-unit-gatam .flip-card-back::after {
      background:
        linear-gradient(180deg, rgba(2, 3, 3, 0.12), rgba(2, 3, 3, 0.68)),
        radial-gradient(circle at 50% 34%, rgba(166, 171, 154, 0.08), transparent 44%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.13), transparent 28%);
      opacity: 0.64;
    }
    #combat .flip-card.paskus-unit-gatam .unit-logo {
      width: clamp(96px, 8vw, 128px) !important;
      height: clamp(96px, 8vw, 128px) !important;
      object-fit: contain;
      filter:
        drop-shadow(0 16px 24px rgba(0, 0, 0, 0.56))
        drop-shadow(0 0 20px rgba(166, 171, 154, 0.34));
    }
    #combat .flip-card.paskus-unit-komodo .flip-card-front,
    #combat .flip-card.paskus-unit-komodo .flip-card-back {
      border-color: rgba(102, 190, 72, 0.42) !important;
      background:
        radial-gradient(circle at 50% 18%, rgba(102, 190, 72, 0.18), transparent 34%),
        linear-gradient(145deg, rgba(255, 255, 255, 0.1), transparent 18%, rgba(102, 190, 72, 0.08) 55%, rgba(239, 191, 4, 0.07)),
        linear-gradient(155deg, rgba(18, 25, 17, 0.82), rgba(5, 8, 5, 0.72)) !important;
      box-shadow:
        0 22px 50px rgba(0, 0, 0, 0.48),
        0 0 32px rgba(102, 190, 72, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(102, 190, 72, 0.16);
    }
    #combat .flip-card.paskus-unit-komodo .unit-logo {
      filter:
        drop-shadow(0 16px 24px rgba(0, 0, 0, 0.5))
        drop-shadow(0 0 22px rgba(102, 190, 72, 0.32));
    }
    #combat .unit-logo {
      width: clamp(78px, 7vw, 108px) !important;
      height: clamp(78px, 7vw, 108px) !important;
      object-fit: contain;
      transform: translateZ(34px);
      filter:
        drop-shadow(0 15px 22px rgba(0, 0, 0, 0.42))
        drop-shadow(0 0 18px rgba(239, 191, 4, 0.2));
    }
    #combat .flip-card h4 {
      position: relative;
      z-index: 2;
      width: 100%;
      margin: 0 !important;
      color: #f6f4eb !important;
      font-size: clamp(15px, 1.35vw, 20px) !important;
      line-height: 1.2 !important;
      letter-spacing: 0.08em;
      text-wrap: balance;
      transform: translateZ(38px);
      text-shadow: 0 12px 26px rgba(0, 0, 0, 0.62);
    }
    #combat .flip-card-back h4 {
      color: #efbf04 !important;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(239, 191, 4, 0.2);
    }
    #combat .flip-card p {
      position: relative;
      z-index: 2;
      margin: 0;
      max-width: 36rem;
      color: rgba(236, 241, 232, 0.88);
      font-size: clamp(12px, 1vw, 14px) !important;
      line-height: 1.7 !important;
      transform: translateZ(30px);
    }
    #combat .flip-card a[href^="/unit/"] {
      --unit-accent-rgb: 239, 191, 4;
      --unit-accent: #efbf04;
      --unit-text: #fff6cf;
      position: relative;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      min-width: 128px;
      border-radius: 999px;
      border: 1px solid rgba(var(--unit-accent-rgb), 0.58);
      background:
        linear-gradient(180deg, rgba(var(--unit-accent-rgb), 0.22), rgba(var(--unit-accent-rgb), 0.08)),
        rgba(8, 10, 8, 0.58);
      color: var(--unit-text) !important;
      box-shadow:
        0 14px 28px rgba(0, 0, 0, 0.32),
        0 0 20px rgba(var(--unit-accent-rgb), 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-decoration: none;
      text-transform: uppercase;
      transform: translateZ(42px);
      transition: border-color 160ms ease, background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    }
    #combat .flip-card a.card-Gatam {
      --unit-accent-rgb: 166, 171, 154;
      --unit-accent: #a6ab9a;
      --unit-text: #f2f4ed;
    }
    #combat .flip-card a.card-komodo {
      --unit-accent-rgb: 102, 190, 72;
      --unit-accent: #66be48;
      --unit-text: #eaffdf;
    }
    #combat .flip-card a.card-sierra {
      --unit-accent-rgb: 196, 158, 74;
      --unit-accent: #c49e4a;
      --unit-text: #fff0bd;
    }
    #combat .flip-card a.card-beringas {
      --unit-accent-rgb: 146, 146, 136;
      --unit-accent: #929288;
      --unit-text: #f0f0e8;
    }
    #combat .flip-card a.card-Pathfinder {
      --unit-accent-rgb: 218, 173, 82;
      --unit-accent: #daad52;
      --unit-text: #fff1c9;
    }
    #combat .flip-card a.card-Sentinel {
      --unit-accent-rgb: 218, 54, 56;
      --unit-accent: #da3638;
      --unit-text: #ffe7e7;
    }
    #combat .flip-card a.card-toruk {
      --unit-accent-rgb: 255, 36, 36;
      --unit-accent: #ff2424;
      --unit-text: #ffe2e2;
    }
    #combat .flip-card a[href^="/unit/"]:hover,
    #combat .flip-card a[href^="/unit/"]:focus-visible {
      border-color: rgba(var(--unit-accent-rgb), 0.86);
      background:
        linear-gradient(180deg, rgba(var(--unit-accent-rgb), 0.32), rgba(var(--unit-accent-rgb), 0.14)),
        rgba(12, 14, 11, 0.72);
      box-shadow:
        0 18px 32px rgba(0, 0, 0, 0.4),
        0 0 0 3px rgba(var(--unit-accent-rgb), 0.16),
        0 0 28px rgba(var(--unit-accent-rgb), 0.26);
      outline: none;
      transform: translateZ(42px) translateY(-1px);
    }
    @media (max-width: 720px) {
      #combat {
        padding: 70px 16px 82px !important;
        scroll-margin-top: 118px;
      }
      #combat .grid {
        grid-template-columns: 1fr !important;
      }
      #combat .flip-card {
        min-height: 300px;
        border-radius: 20px;
      }
      #combat .flip-card.has-unit-roster {
        min-height: 370px;
      }
      #combat .flip-card-front,
      #combat .flip-card-back {
        padding: 22px !important;
      }
      #combat .paskus-unit-roster__grid {
        grid-auto-columns: minmax(104px, 1fr);
        grid-template-rows: repeat(4, minmax(28px, auto));
      }
      #combat .flip-card.paskus-unit-gatam,
      #combat .flip-card.paskus-unit-komodo {
        grid-column: 1 / -1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      #combat .flip-card,
      #combat .flip-card-inner,
      #combat .flip-card a[href^="/unit/"] {
        transition: none !important;
      }
      #combat .flip-card:hover {
        transform: none;
      }
    }
    html.paskus-unit-detail-toruk .body-nav,
    html.paskus-unit-detail-sierra .body-nav,
    html.paskus-unit-detail-pathfinder .body-nav,
    html.paskus-unit-detail-sentinel .body-nav,
    html.paskus-unit-detail-gatam .body-nav {
      position: relative;
      isolation: isolate;
      background:
        linear-gradient(180deg, rgba(5, 5, 5, 0.64), rgba(5, 5, 5, 0.88)),
        #050505 !important;
    }
    html.paskus-unit-detail-toruk .body-nav::before,
    html.paskus-unit-detail-sierra .body-nav::before,
    html.paskus-unit-detail-pathfinder .body-nav::before,
    html.paskus-unit-detail-sentinel .body-nav::before,
    html.paskus-unit-detail-gatam .body-nav::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 20%, rgba(var(--paskus-detail-accent-rgb), 0.18), transparent 36%),
        linear-gradient(180deg, rgba(5, 5, 5, 0.38), rgba(5, 5, 5, 0.78)),
        linear-gradient(125deg, rgba(var(--paskus-detail-accent-rgb), 0.18), rgba(8, 10, 10, 0.32) 44%, rgba(239, 191, 4, 0.08)),
        var(--paskus-detail-wallpaper) center / cover no-repeat;
      filter: saturate(1.12) contrast(1.04) brightness(1.08);
      opacity: 0.9;
    }
    html.paskus-unit-detail-toruk .body-nav::after,
    html.paskus-unit-detail-sierra .body-nav::after,
    html.paskus-unit-detail-pathfinder .body-nav::after,
    html.paskus-unit-detail-sentinel .body-nav::after,
    html.paskus-unit-detail-gatam .body-nav::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 22%, rgba(var(--paskus-detail-accent-rgb), 0.1), transparent 36%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.05), transparent 28%),
        linear-gradient(rgba(255, 255, 255, 0.025) 50%, transparent 50%) 0 0 / 100% 4px;
      mix-blend-mode: screen;
      opacity: 0.68;
    }
    html.paskus-unit-detail-toruk .body-nav > *,
    html.paskus-unit-detail-sierra .body-nav > *,
    html.paskus-unit-detail-pathfinder .body-nav > *,
    html.paskus-unit-detail-sentinel .body-nav > *,
    html.paskus-unit-detail-gatam .body-nav > * {
      position: relative;
      z-index: 1;
    }
    html.paskus-unit-detail-toruk .hero-section,
    html.paskus-unit-detail-sierra .hero-section,
    html.paskus-unit-detail-pathfinder .hero-section,
    html.paskus-unit-detail-sentinel .hero-section,
    html.paskus-unit-detail-gatam .hero-section {
      background:
        linear-gradient(180deg, rgba(5, 5, 5, 0.1), rgba(5, 5, 5, 0.48) 62%, rgba(5, 5, 5, 0.86)) !important;
    }
    html.paskus-unit-detail-toruk .hero-section::before,
    html.paskus-unit-detail-sierra .hero-section::before,
    html.paskus-unit-detail-pathfinder .hero-section::before,
    html.paskus-unit-detail-sentinel .hero-section::before,
    html.paskus-unit-detail-gatam .hero-section::before {
      content: "";
      position: absolute;
      inset: 18px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 28px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.06), transparent 24%),
        rgba(255, 255, 255, 0.018);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.09),
        0 32px 90px rgba(0, 0, 0, 0.32);
      pointer-events: none;
      backdrop-filter: blur(1.5px);
      -webkit-backdrop-filter: blur(1.5px);
    }
    html.paskus-unit-detail-toruk {
      --paskus-detail-accent-rgb: 255, 36, 36;
      --paskus-detail-wallpaper: url("/assets/toruk-card-bg-v1.webp");
    }
    html.paskus-unit-detail-sierra {
      --paskus-detail-accent-rgb: 146, 146, 136;
      --paskus-detail-wallpaper: url("/assets/sierra-card-bg-v1.webp");
    }
    html.paskus-unit-detail-pathfinder {
      --paskus-detail-accent-rgb: 218, 173, 82;
      --paskus-detail-wallpaper: url("/assets/pathfinder-card-bg-v2.webp");
    }
    html.paskus-unit-detail-sentinel {
      --paskus-detail-accent-rgb: 218, 54, 56;
      --paskus-detail-wallpaper: url("/assets/sentinel-snake-wallpaper-v1.webp");
    }
    html.paskus-unit-detail-gatam {
      --paskus-detail-accent-rgb: 166, 171, 154;
      --paskus-detail-wallpaper: url("/assets/gatam-eagle-wallpaper-v1.webp");
    }
    @media (max-width: 720px) {
      html.paskus-unit-detail-toruk .body-nav::before,
      html.paskus-unit-detail-sierra .body-nav::before,
      html.paskus-unit-detail-pathfinder .body-nav::before,
      html.paskus-unit-detail-sentinel .body-nav::before,
      html.paskus-unit-detail-gatam .body-nav::before {
        background-position: center top;
        opacity: 0.84;
      }
      html.paskus-unit-detail-toruk .hero-section::before,
      html.paskus-unit-detail-sierra .hero-section::before,
      html.paskus-unit-detail-pathfinder .hero-section::before,
      html.paskus-unit-detail-sentinel .hero-section::before,
      html.paskus-unit-detail-gatam .hero-section::before {
        inset: 10px;
        border-radius: 18px;
      }
    }
    .paskus-unit-highlight {
      position: relative;
      isolation: isolate;
      padding: clamp(34px, 5vw, 70px) clamp(16px, 4vw, 40px) clamp(46px, 6vw, 82px);
      overflow: hidden;
    }
    .paskus-unit-highlight::before {
      content: "";
      position: absolute;
      inset: auto 8% 0;
      z-index: -1;
      height: 62%;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.14), transparent 67%);
      filter: blur(32px);
      opacity: 0.82;
    }
    .paskus-unit-highlight__inner {
      width: min(1120px, 100%);
      margin: 0 auto;
      display: grid;
      gap: clamp(18px, 3vw, 30px);
    }
    .paskus-unit-highlight__heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 18px;
    }
    .paskus-unit-highlight__eyebrow {
      color: rgba(239, 191, 4, 0.9);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .paskus-unit-highlight__heading h2 {
      color: #f8faf4;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(24px, 4vw, 48px);
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1;
      margin: 8px 0 0;
      text-transform: uppercase;
    }
    .paskus-unit-highlight__label {
      border: 1px solid rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.42);
      border-radius: 999px;
      color: rgba(246, 247, 240, 0.82);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      padding: 10px 14px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .paskus-unit-highlight__frame {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.28);
      border-radius: clamp(20px, 3vw, 34px);
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025)),
        rgba(5, 7, 6, 0.68);
      box-shadow:
        0 34px 95px rgba(0, 0, 0, 0.52),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(22px) saturate(126%);
      -webkit-backdrop-filter: blur(22px) saturate(126%);
    }
    .paskus-unit-highlight__frame::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.5)),
        radial-gradient(circle at 50% 34%, rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.12), transparent 45%);
      opacity: 0.82;
      transition: opacity 220ms ease;
    }
    .paskus-unit-highlight__frame.is-playing::before {
      opacity: 0.22;
    }
    .paskus-unit-highlight__video {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #020303;
      object-fit: cover;
    }
    .paskus-unit-highlight__play {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 3;
      display: inline-grid;
      place-items: center;
      width: clamp(66px, 8vw, 96px);
      height: clamp(66px, 8vw, 96px);
      border: 1px solid rgba(255, 255, 255, 0.34);
      border-radius: 999px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)),
        rgba(5, 7, 6, 0.34);
      box-shadow:
        0 24px 64px rgba(0, 0, 0, 0.46),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      color: #ffffff;
      cursor: pointer;
      transform: translate(-50%, -50%) scale(1);
      transition: opacity 180ms ease, transform 180ms ease, border-color 180ms ease;
      backdrop-filter: blur(18px) saturate(132%);
      -webkit-backdrop-filter: blur(18px) saturate(132%);
    }
    .paskus-unit-highlight__play::before {
      content: "";
      width: 0;
      height: 0;
      margin-left: 5px;
      border-top: 14px solid transparent;
      border-bottom: 14px solid transparent;
      border-left: 20px solid currentColor;
      filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.28));
    }
    .paskus-unit-highlight__play:hover,
    .paskus-unit-highlight__play:focus-visible {
      border-color: rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.72);
      transform: translate(-50%, -50%) scale(1.06);
    }
    .paskus-unit-highlight__frame.is-playing .paskus-unit-highlight__play {
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0.94);
    }
    .paskus-unit-highlight__caption {
      position: absolute;
      left: clamp(16px, 3vw, 30px);
      right: clamp(16px, 3vw, 30px);
      bottom: clamp(14px, 2.5vw, 26px);
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      color: rgba(246, 247, 240, 0.82);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      transition: opacity 180ms ease;
    }
    .paskus-unit-highlight__frame.is-playing .paskus-unit-highlight__caption {
      opacity: 0;
    }
    .paskus-unit-highlight__caption span:last-child {
      color: rgba(239, 191, 4, 0.9);
    }
    @media (max-width: 720px) {
      .paskus-unit-highlight {
        padding-top: 28px;
        padding-bottom: 52px;
      }
      .paskus-unit-highlight__heading {
        align-items: start;
        flex-direction: column;
      }
      .paskus-unit-highlight__label {
        white-space: normal;
      }
      .paskus-unit-highlight__frame {
        border-radius: 20px;
      }
      .paskus-unit-highlight__caption {
        align-items: start;
        flex-direction: column;
        letter-spacing: 0.1em;
      }
    }
    .paskus-unit-detail-roster {
      position: relative;
      isolation: isolate;
      padding: clamp(10px, 2vw, 20px) clamp(16px, 4vw, 40px) clamp(44px, 6vw, 76px);
      overflow: hidden;
    }
    .paskus-unit-detail-roster::before {
      content: "";
      position: absolute;
      inset: 8% 7% auto;
      z-index: -1;
      height: 72%;
      border-radius: 999px;
      background:
        radial-gradient(circle at 42% 36%, rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.17), transparent 68%),
        radial-gradient(circle at 72% 12%, rgba(255, 255, 255, 0.06), transparent 44%);
      filter: blur(34px);
      opacity: 0.9;
    }
    .paskus-unit-detail-roster__inner {
      width: min(1120px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
      gap: clamp(18px, 4vw, 36px);
      align-items: stretch;
      border: 1px solid rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.2);
      border-radius: clamp(22px, 3vw, 34px);
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.09), transparent 32%, rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.08)),
        rgba(4, 7, 6, 0.62);
      box-shadow:
        0 30px 90px rgba(0, 0, 0, 0.42),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px) saturate(126%);
      -webkit-backdrop-filter: blur(20px) saturate(126%);
      padding: clamp(18px, 3vw, 30px);
    }
    .paskus-unit-detail-roster__copy {
      display: grid;
      align-content: start;
      gap: 14px;
    }
    .paskus-unit-detail-roster__eyebrow {
      color: rgba(239, 191, 4, 0.88);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .paskus-unit-detail-roster__copy h2 {
      margin: 0;
      color: #f8faf4;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(22px, 3vw, 36px);
      line-height: 1.04;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-unit-detail-roster__copy p {
      margin: 0;
      color: rgba(238, 244, 234, 0.72);
      font-size: 13px;
      line-height: 1.62;
    }
    .paskus-unit-detail-roster__count {
      display: grid;
      width: fit-content;
      min-width: 108px;
      border-left: 1px solid rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.45);
      padding-left: 14px;
      margin-top: 4px;
    }
    .paskus-unit-detail-roster__count strong {
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(30px, 4vw, 48px);
      line-height: 0.92;
    }
    .paskus-unit-detail-roster__count span {
      color: rgba(238, 244, 234, 0.58);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.14em;
      margin-top: 8px;
      text-transform: uppercase;
    }
    .paskus-unit-detail-roster__grid {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(136px, 1fr);
      grid-template-rows: repeat(4, minmax(38px, auto));
      gap: 9px;
      align-content: start;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      overscroll-behavior-inline: contain;
      padding: 2px 2px 10px;
      scrollbar-color: rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.48) rgba(255, 255, 255, 0.06);
    }
    .paskus-unit-detail-roster__grid::-webkit-scrollbar {
      height: 7px;
    }
    .paskus-unit-detail-roster__grid::-webkit-scrollbar-track {
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
    }
    .paskus-unit-detail-roster__grid::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.44);
    }
    .paskus-unit-detail-roster__member {
      display: flex;
      min-width: 0;
      min-height: 38px;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.18);
      border-radius: 12px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.045)),
        rgba(0, 0, 0, 0.28);
      color: rgba(245, 249, 241, 0.88);
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 10px;
      font-weight: 800;
      line-height: 1.25;
      padding: 7px 9px;
      text-align: center;
      overflow-wrap: anywhere;
    }
    .paskus-unit-detail-roster__empty {
      display: grid;
      place-items: center;
      min-height: 160px;
      border: 1px dashed rgba(var(--paskus-detail-accent-rgb, 239, 191, 4), 0.28);
      border-radius: 18px;
      color: rgba(238, 244, 234, 0.62);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.55;
      padding: 20px;
      text-align: center;
    }
    @media (max-width: 860px) {
      .paskus-unit-detail-roster__inner {
        grid-template-columns: 1fr;
      }
      .paskus-unit-detail-roster__grid {
        grid-auto-columns: minmax(124px, 1fr);
      }
    }
    @media (max-width: 520px) {
      .paskus-unit-detail-roster {
        padding-left: 10px;
        padding-right: 10px;
      }
      .paskus-unit-detail-roster__inner {
        border-radius: 18px;
        padding: 14px;
      }
      .paskus-unit-detail-roster__copy p {
        font-size: 11px;
        line-height: 1.52;
      }
      .paskus-unit-detail-roster__grid {
        grid-auto-columns: minmax(112px, 1fr);
        grid-template-rows: repeat(4, minmax(32px, auto));
        gap: 7px;
      }
      .paskus-unit-detail-roster__member {
        min-height: 32px;
        border-radius: 9px;
        font-size: 8.5px;
        padding: 6px;
      }
    }
    #support {
      position: relative;
      isolation: isolate;
      height: auto !important;
      min-height: auto !important;
      padding: clamp(72px, 7vw, 104px) clamp(16px, 4vw, 40px) !important;
      background:
        radial-gradient(circle at 18% 16%, rgba(239, 191, 4, 0.13), transparent 32%),
        radial-gradient(circle at 82% 22%, rgba(157, 193, 131, 0.16), transparent 36%),
        linear-gradient(180deg, rgba(5, 6, 6, 0.78), rgba(9, 12, 11, 0.66) 48%, rgba(5, 6, 6, 0.9)),
        linear-gradient(110deg, rgba(3, 5, 4, 0.7), rgba(3, 5, 4, 0.24) 46%, rgba(3, 5, 4, 0.82)),
        url("/assets/paskus-bg-ops-pair-v1.webp") center 52% / cover no-repeat,
        linear-gradient(135deg, rgba(157, 193, 131, 0.08), transparent 32%, rgba(239, 191, 4, 0.055) 76%, transparent) !important;
    }
    #support::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.026) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(145deg, rgba(255, 255, 255, 0.04), transparent 32%, rgba(239, 191, 4, 0.06));
      background-size: 96px 96px;
      mask-image: linear-gradient(180deg, transparent, #000 16%, #000 84%, transparent);
      opacity: 0.58;
    }
    #support .max-w-7xl {
      position: relative;
      z-index: 1;
    }
    #support .mb-20 {
      margin-bottom: clamp(34px, 5vw, 56px) !important;
    }
    #support .grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 430px), 1fr)) !important;
      gap: clamp(18px, 2.4vw, 32px) !important;
      align-items: stretch;
    }
    #support .flip-card {
      position: relative;
      height: auto !important;
      min-height: clamp(270px, 21vw, 310px);
      border-radius: 20px;
      perspective: 1300px;
      transform-style: preserve-3d;
      transition: transform 220ms ease, box-shadow 220ms ease;
      box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
      contain: layout style;
      content-visibility: auto;
      contain-intrinsic-size: auto 310px;
      isolation: isolate;
      order: 20;
    }
    #support .flip-card::before {
      content: "";
      position: absolute;
      left: 7%;
      right: 7%;
      bottom: -14px;
      height: 28px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.42);
      filter: blur(16px);
      opacity: 0.68;
      pointer-events: none;
      transition: opacity 220ms ease, transform 220ms ease;
    }
    #support .flip-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 28px 38px rgba(0, 0, 0, 0.38);
    }
    #support .flip-card:hover::before {
      opacity: 0.88;
      transform: translateY(4px) scaleX(1.03);
    }
    #support .flip-card-inner {
      position: relative;
      z-index: 1;
      height: 100% !important;
      min-height: inherit;
      border-radius: inherit;
      transform-style: preserve-3d;
      transition: transform 620ms cubic-bezier(0.2, 0.72, 0.22, 1);
    }
    #support .flip-card:hover .flip-card-inner,
    #support .flip-card:focus-within .flip-card-inner {
      transform: rotateY(180deg);
    }
    #support .flip-card-front,
    #support .flip-card-back {
      position: absolute !important;
      inset: 0;
      min-height: 100%;
      overflow: hidden;
      border-radius: inherit !important;
      border: 1px solid rgba(157, 193, 131, 0.3) !important;
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.11), transparent 20%, rgba(157, 193, 131, 0.08) 58%, rgba(239, 191, 4, 0.055)),
        linear-gradient(155deg, rgba(19, 24, 21, 0.82), rgba(6, 8, 7, 0.7)) !important;
      box-shadow:
        0 20px 44px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.11),
        inset 0 -1px 0 rgba(157, 193, 131, 0.12);
      backdrop-filter: blur(12px) saturate(122%);
      -webkit-backdrop-filter: blur(12px) saturate(122%);
      backface-visibility: hidden;
      transform-style: preserve-3d;
      padding: clamp(22px, 2vw, 30px) !important;
    }
    #support .flip-card-front::before,
    #support .flip-card-back::before {
      content: "SUPPORT UNIT";
      position: absolute;
      top: 18px;
      left: 20px;
      z-index: 2;
      color: rgba(239, 191, 4, 0.86);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    #support .flip-card-front::after,
    #support .flip-card-back::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(157, 193, 131, 0.35), transparent 34%) top left / 100% 1px no-repeat,
        linear-gradient(115deg, rgba(255, 255, 255, 0.12), transparent 28%),
        linear-gradient(0deg, rgba(0, 0, 0, 0.22), transparent 46%);
      opacity: 0.72;
    }
    #support .flip-card-front {
      display: grid !important;
      grid-template-columns: auto 1fr;
      align-content: end;
      align-items: end;
      column-gap: 22px;
      row-gap: 16px;
      text-align: left;
      transform: rotateY(0deg) translateZ(1px);
    }
    #support .flip-card-back {
      display: flex !important;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-end;
      gap: 18px;
      text-align: left;
      color: #e7eee1;
      transform: rotateY(180deg) translateZ(1px);
    }
    #support .unit-logo {
      position: relative;
      z-index: 2;
      width: clamp(58px, 5.2vw, 78px) !important;
      height: clamp(58px, 5.2vw, 78px) !important;
      object-fit: contain;
      grid-row: 1 / span 2;
      align-self: center;
      padding: 10px;
      border-radius: 18px;
      border: 1px solid rgba(157, 193, 131, 0.22);
      background: rgba(255, 255, 255, 0.045);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 14px 24px rgba(0, 0, 0, 0.28);
      transform: translateZ(32px);
      filter:
        drop-shadow(0 12px 18px rgba(0, 0, 0, 0.36))
        drop-shadow(0 0 14px rgba(157, 193, 131, 0.18));
    }
    #support .flip-card.paskus-support-staff-komando {
      grid-column: 1 / -1;
      min-height: clamp(300px, 21vw, 350px);
      order: 1;
    }
    #support .flip-card.paskus-support-staff-komando .flip-card-front,
    #support .flip-card.paskus-support-staff-komando .flip-card-back {
      border-color: rgba(239, 191, 4, 0.48) !important;
      background:
        radial-gradient(circle at 14% 12%, rgba(239, 191, 4, 0.22), transparent 31%),
        radial-gradient(circle at 86% 10%, rgba(157, 193, 131, 0.16), transparent 30%),
        linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 24%, rgba(239, 191, 4, 0.08) 62%),
        linear-gradient(155deg, rgba(16, 17, 10, 0.88), rgba(6, 7, 5, 0.76)) !important;
    }
    #support .flip-card.paskus-support-staff-komando .flip-card-front {
      grid-template-columns: auto minmax(0, 1fr);
      align-content: center;
      align-items: center;
      column-gap: clamp(20px, 3vw, 38px);
    }
    #support .flip-card.paskus-support-staff-komando .flip-card-back {
      justify-content: center;
      padding-right: clamp(28px, 6vw, 88px) !important;
    }
    #support .flip-card.paskus-support-staff-komando .paskus-support-roman-logo {
      position: relative;
      z-index: 2;
      display: grid;
      place-items: center;
      width: clamp(82px, 7vw, 118px);
      height: clamp(82px, 7vw, 118px);
      grid-row: 1 / span 2;
      align-self: center;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: #efbf04;
      font-family: "Times New Roman", Times, serif;
      font-size: clamp(82px, 8vw, 138px);
      font-weight: 700;
      line-height: 0.82;
      text-shadow:
        0 18px 34px rgba(0, 0, 0, 0.58),
        0 0 26px rgba(239, 191, 4, 0.3);
      box-shadow: none;
      transform: translateZ(34px);
    }
    #support .flip-card.paskus-support-staff-komando h4 {
      font-size: clamp(26px, 3vw, 46px) !important;
      line-height: 1.04 !important;
    }
    #support .flip-card.paskus-support-staff-komando .flip-card-front h4::after {
      content: "INDUK NON-TEMPUR";
      border-top-color: rgba(239, 191, 4, 0.42);
      color: rgba(239, 191, 4, 0.74);
    }
    #support .flip-card.paskus-support-staff-komando .flip-card-back h4 {
      color: #efbf04 !important;
      border-bottom-color: rgba(239, 191, 4, 0.28);
    }
    #support .flip-card.paskus-support-staff-komando p {
      max-width: 54rem;
      font-size: clamp(12.5px, 1vw, 15px) !important;
    }
    #support .flip-card.paskus-support-dpdm .flip-card-front,
    #support .flip-card.paskus-support-dpdm .flip-card-back {
      border-color: rgba(210, 180, 91, 0.42) !important;
      background:
        linear-gradient(180deg, rgba(4, 6, 8, 0.22), rgba(4, 6, 8, 0.78)),
        linear-gradient(130deg, rgba(24, 54, 94, 0.36), rgba(210, 180, 91, 0.12) 46%, rgba(3, 5, 7, 0.78)),
        url("/assets/dpdm-card-bg-card.webp") center / cover no-repeat !important;
    }
    #support .flip-card.paskus-support-dpdm .flip-card-front::after,
    #support .flip-card.paskus-support-dpdm .flip-card-back::after {
      opacity: 0.48;
      background:
        linear-gradient(90deg, rgba(210, 180, 91, 0.32), transparent 34%) top left / 100% 1px no-repeat,
        linear-gradient(115deg, rgba(255, 255, 255, 0.1), transparent 28%),
        linear-gradient(0deg, rgba(0, 0, 0, 0.34), transparent 52%);
    }
    #support .flip-card.paskus-support-dpdm .unit-logo {
      width: clamp(76px, 6.8vw, 104px) !important;
      height: clamp(76px, 6.8vw, 104px) !important;
      border-color: transparent;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      padding: 0;
      filter:
        drop-shadow(0 12px 18px rgba(0, 0, 0, 0.42))
        drop-shadow(0 0 18px rgba(210, 180, 91, 0.22));
    }
    #support .flip-card.paskus-support-dpdm .flip-card-back h4 {
      color: #d2b45b !important;
      border-bottom-color: rgba(210, 180, 91, 0.28);
    }
    #support .flip-card h4 {
      position: relative;
      z-index: 2;
      width: 100%;
      margin: 0 !important;
      color: #f2f6ef !important;
      font-size: clamp(15px, 1.2vw, 19px) !important;
      line-height: 1.25 !important;
      letter-spacing: 0.06em;
      text-wrap: balance;
      transform: translateZ(36px);
      text-shadow: 0 12px 24px rgba(0, 0, 0, 0.56);
    }
    #support .flip-card-front h4::after {
      content: "OPERATIONS";
      display: block;
      width: fit-content;
      margin-top: 10px;
      border-top: 1px solid rgba(157, 193, 131, 0.34);
      padding-top: 8px;
      color: rgba(214, 224, 207, 0.62);
      font-family: Inter, system-ui, sans-serif;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.16em;
    }
    #support .flip-card-back h4 {
      color: #efbf04 !important;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(157, 193, 131, 0.22);
    }
    #support .flip-card p {
      position: relative;
      z-index: 2;
      margin: 0;
      max-width: 34rem;
      color: rgba(235, 241, 230, 0.88);
      font-size: clamp(12px, 0.98vw, 14px) !important;
      line-height: 1.72 !important;
      transform: translateZ(30px);
    }
    #support .paskus-support-detail-link {
      position: relative;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      width: fit-content;
      border: 1px solid rgba(239, 191, 4, 0.42);
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(239, 191, 4, 0.16), rgba(157, 193, 131, 0.08)),
        rgba(8, 10, 9, 0.62);
      color: #fff4c7 !important;
      box-shadow:
        0 14px 28px rgba(0, 0, 0, 0.32),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0;
      padding: 0 16px;
      text-decoration: none;
      text-transform: uppercase;
      transform: translateZ(42px);
      transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }
    #support .flip-card-front .paskus-support-detail-link {
      grid-column: 1 / -1;
      align-self: start;
      justify-self: start;
    }
    #support .flip-card-back .paskus-support-detail-link {
      margin-top: 2px;
    }
    #support .paskus-support-detail-link:hover,
    #support .paskus-support-detail-link:focus-visible {
      border-color: rgba(239, 191, 4, 0.76);
      background:
        linear-gradient(180deg, rgba(239, 191, 4, 0.24), rgba(157, 193, 131, 0.12)),
        rgba(12, 15, 12, 0.72);
      box-shadow:
        0 18px 32px rgba(0, 0, 0, 0.4),
        0 0 0 3px rgba(239, 191, 4, 0.12);
      outline: none;
      transform: translateZ(42px) translateY(-1px);
    }
    @media (max-width: 720px) {
      #support {
        padding: 70px 16px 82px !important;
      }
      #support .grid {
        grid-template-columns: 1fr !important;
      }
      #support .flip-card {
        min-height: 280px;
        border-radius: 18px;
      }
      #support .flip-card-front,
      #support .flip-card-back {
        padding: 22px !important;
      }
      #support .flip-card.paskus-support-staff-komando {
        min-height: 318px;
      }
      #support .flip-card-front {
        grid-template-columns: 1fr;
        align-content: center;
        justify-items: center;
        text-align: center;
      }
      #support .flip-card.paskus-support-staff-komando .flip-card-front {
        grid-template-columns: 1fr;
        row-gap: 16px;
      }
      #support .flip-card.paskus-support-staff-komando .flip-card-back {
        justify-content: flex-end;
        padding-right: 22px !important;
      }
      #support .flip-card.paskus-support-staff-komando .paskus-support-roman-logo {
        grid-row: auto;
        width: 78px;
        height: 78px;
        font-size: 88px;
        border-radius: 0;
      }
      #support .flip-card.paskus-support-staff-komando h4 {
        font-size: 25px !important;
      }
      #support .unit-logo {
        grid-row: auto;
      }
      #support .flip-card-front h4::after {
        margin-left: auto;
        margin-right: auto;
      }
      #support .flip-card-front .paskus-support-detail-link {
        justify-self: center;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      #support .flip-card,
      #support .flip-card-inner {
        transition: none !important;
      }
      #support .flip-card:hover {
        transform: none;
      }
    }
    .paskus-structure-page {
      min-height: 100vh;
      background:
        radial-gradient(circle at 18% 10%, rgba(239, 191, 4, 0.18), transparent 30%),
        radial-gradient(circle at 84% 14%, rgba(157, 193, 131, 0.18), transparent 34%),
        linear-gradient(180deg, rgba(3, 4, 4, 0.62), rgba(6, 9, 8, 0.48) 44%, rgba(3, 4, 4, 0.84)),
        linear-gradient(118deg, rgba(3, 5, 4, 0.62), rgba(3, 5, 4, 0.18) 48%, rgba(3, 5, 4, 0.76)),
        url("/assets/paskus-bg-mountain-scout-v1.webp") center top / cover no-repeat,
        linear-gradient(180deg, #07100b, #101b12 45%, #030404);
      background-attachment: fixed;
      color: #f5f7ef;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow-x: hidden;
    }
    .paskus-structure-page::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.032) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.024) 1px, transparent 1px),
        linear-gradient(135deg, rgba(239, 191, 4, 0.08), transparent 38%, rgba(157, 193, 131, 0.07));
      background-size: 92px 92px, 92px 92px, 100% 100%;
      mask-image: linear-gradient(180deg, transparent, #000 10%, #000 92%, transparent);
      opacity: 0.62;
    }
    .paskus-structure-page > * {
      position: relative;
      z-index: 1;
    }
    @media (max-width: 720px) {
      .paskus-structure-page {
        background-attachment: scroll;
        background-position: center top;
      }
    }
    .paskus-structure-page,
    .paskus-structure-page * {
      box-sizing: border-box;
    }
    .paskus-structure-page .structure-nav {
      position: fixed;
      top: 14px;
      left: 0;
      right: 0;
      z-index: 70;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      border-bottom: 1px solid rgba(157, 193, 131, 0.22);
      background: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      padding: 16px 24px;
    }
    .paskus-structure-page .structure-brand {
      display: flex;
      align-items: center;
      min-width: 0;
      color: #ffffff;
      text-decoration: none;
    }
    .paskus-structure-page .structure-brand img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-right: 10px;
    }
    .paskus-structure-page .structure-brand strong {
      display: block;
      color: #ffffff;
      font-size: 18px;
      line-height: 1;
      letter-spacing: 0;
    }
    .paskus-structure-page .structure-brand span span {
      display: block;
      color: #9dc183;
      font-size: 10px;
      letter-spacing: 0;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .paskus-structure-page .structure-nav-links {
      display: flex;
      align-items: center;
      gap: 22px;
    }
    .paskus-structural-header-cta {
      display: none;
      align-items: center;
      justify-content: center;
      min-height: 32px;
      border: 1px solid rgba(239, 191, 4, 0.46);
      border-radius: 999px;
      background: rgba(239, 191, 4, 0.1);
      color: #efbf04 !important;
      font-size: 10px !important;
      font-weight: 900;
      letter-spacing: 0.06em !important;
      line-height: 1;
      padding: 0 12px;
      text-decoration: none;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .paskus-structure-page .structure-nav a {
      color: #adb7aa;
      font-size: 12px;
      letter-spacing: 0;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
    }
    .paskus-structure-page .structure-nav a:hover,
    .paskus-structure-page .structure-nav a[aria-current="page"] {
      color: #ffffff;
    }
    .paskus-structure-page .discord-link {
      border: 1px solid rgba(239, 191, 4, 0.48);
      color: #efbf04 !important;
      padding: 8px 12px;
    }
    .paskus-structure-page .structure-hero {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding: 112px 22px 16px;
      text-align: center;
    }
    .paskus-structure-page .structure-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
      background-size: 96px 96px;
      mask-image: linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent);
      opacity: 0.5;
    }
    .paskus-structure-page .structure-hero-inner,
    .paskus-structure-page .structure-section,
    .paskus-structure-page .structure-status {
      width: min(1180px, calc(100% - 44px));
      margin: 0 auto;
    }
    .paskus-structure-page .structure-hero-inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
      align-items: start;
      justify-items: center;
      text-align: center;
    }
    .paskus-structure-page .structure-kicker {
      color: #efbf04;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-structure-page h1 {
      margin: 14px auto 18px;
      color: #f7faf3;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(42px, 7vw, 92px);
      line-height: 0.94;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow:
        0 20px 48px rgba(0, 0, 0, 0.68),
        0 0 34px rgba(239, 191, 4, 0.14);
    }
    .paskus-structure-page h1 span {
      display: block;
      color: #9dc183;
      font-size: 0.24em;
      line-height: 1.25;
      margin-top: 12px;
    }
    .paskus-structure-page .structure-lead {
      max-width: 680px;
      color: rgba(238, 244, 234, 0.86);
      font-size: clamp(13px, 1.1vw, 16px);
      line-height: 1.68;
      margin: 0 auto;
    }
    .paskus-structure-page .structure-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 20px auto 0;
      max-width: 560px;
    }
    .paskus-structure-page .structure-stat {
      border: 1px solid rgba(157, 193, 131, 0.24);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.045);
      padding: 14px;
    }
    .paskus-structure-page .structure-stat strong {
      display: block;
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(24px, 2.6vw, 36px);
      line-height: 1;
      margin-bottom: 8px;
    }
    .paskus-structure-page .structure-stat span {
      color: rgba(226, 233, 220, 0.66);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .paskus-structure-page .structure-section {
      padding: 16px 0 90px;
    }
    .paskus-structure-page .structure-tree {
      position: relative;
      display: grid;
      gap: 28px;
      padding: 8px 0 0;
    }
    .paskus-structure-page .structure-tree::before {
      content: "";
      position: absolute;
      top: 28px;
      bottom: 36px;
      left: 50%;
      width: 2px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(239, 191, 4, 0), rgba(239, 191, 4, 0.58), rgba(157, 193, 131, 0.36), rgba(220, 56, 56, 0));
      box-shadow: 0 0 24px rgba(239, 191, 4, 0.18);
      transform: translateX(-50%);
      pointer-events: none;
    }
    .paskus-structure-page .structure-tree-root {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 36px;
      width: fit-content;
      margin: 0 auto -6px;
      border: 1px solid rgba(239, 191, 4, 0.36);
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(239, 191, 4, 0.18), rgba(157, 193, 131, 0.08)),
        rgba(3, 5, 4, 0.78);
      color: #efbf04;
      box-shadow:
        0 14px 32px rgba(0, 0, 0, 0.34),
        0 0 24px rgba(239, 191, 4, 0.12);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.12em;
      padding: 0 18px;
      text-transform: uppercase;
    }
    .paskus-structure-page .structure-category-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-bottom: 28px;
    }
    .paskus-structure-page .structure-category-nav a {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      border: 1px solid rgba(157, 193, 131, 0.24);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(239, 246, 234, 0.78);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.08em;
      padding: 0 12px;
      text-decoration: none;
      text-transform: uppercase;
    }
    .paskus-structure-page .structure-category {
      position: relative;
      scroll-margin-top: 148px;
      border: 1px solid rgba(var(--structure-accent-rgb), 0.28);
      border-radius: 24px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.07), transparent 26%, rgba(var(--structure-accent-rgb), 0.06)),
        rgba(7, 10, 9, 0.64);
      box-shadow:
        0 26px 60px rgba(0, 0, 0, 0.34),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      contain: layout style;
      content-visibility: auto;
      contain-intrinsic-size: auto 520px;
      padding: clamp(18px, 2.4vw, 28px);
      margin: 0 auto;
      width: min(1080px, 100%);
    }
    .paskus-structure-page .structure-category::before {
      content: "";
      position: absolute;
      top: -18px;
      left: 50%;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(var(--structure-accent-rgb), 0.58);
      border-radius: 999px;
      background: #050806;
      box-shadow:
        0 0 0 8px rgba(var(--structure-accent-rgb), 0.08),
        0 0 24px rgba(var(--structure-accent-rgb), 0.28);
      transform: translate(-50%, -50%);
    }
    .paskus-structure-page .structure-category-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-direction: column;
      border-bottom: 1px solid rgba(var(--structure-accent-rgb), 0.2);
      padding-bottom: 18px;
      margin-bottom: 18px;
      text-align: center;
    }
    .paskus-structure-page .structure-category h2 {
      margin: 0;
      color: #f7faf3;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(20px, 2.4vw, 32px);
      line-height: 1.05;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-structure-page .structure-category-header span {
      color: rgba(239, 191, 4, 0.74);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .paskus-structure-page .structure-rank-grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
      align-items: start;
      gap: clamp(16px, 2vw, 28px);
      padding-top: 18px;
      min-width: 0;
    }
    .paskus-structure-page .structure-category--bintara-tinggi .structure-rank-grid {
      grid-template-columns: minmax(min(100%, 250px), 380px);
      justify-content: center;
    }
    .paskus-structure-page .structure-category--tamtama-senior .structure-rank-grid {
      grid-template-columns: repeat(3, minmax(0, 320px));
      justify-content: center;
    }
    .paskus-structure-page .structure-category--tamtama-junior .structure-rank-grid {
      grid-template-columns: repeat(2, minmax(0, 360px));
      justify-content: center;
    }
    .paskus-structure-page .structure-category--bintara .structure-rank-grid {
      grid-template-columns: minmax(min(100%, 250px), 380px);
      justify-content: center;
    }
    .paskus-structure-page .structure-category--bintara-muda .structure-rank-grid {
      grid-template-columns: repeat(3, minmax(0, 320px));
      justify-content: center;
    }
    .paskus-structure-page .structure-category--sipil .structure-rank-grid {
      grid-template-columns: minmax(min(100%, 250px), 380px);
      justify-content: center;
    }
    .paskus-structure-page .structure-rank-grid::before {
      content: "";
      position: absolute;
      top: 0;
      left: min(12%, 72px);
      right: min(12%, 72px);
      height: 1px;
      background: linear-gradient(90deg, rgba(var(--structure-accent-rgb), 0), rgba(var(--structure-accent-rgb), 0.42), rgba(var(--structure-accent-rgb), 0));
      pointer-events: none;
    }
    .paskus-structure-page .structure-rank-card {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-self: start;
      min-width: 0;
      min-height: 0;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      border: 1px solid rgba(var(--rank-accent-rgb), 0.28);
      border-radius: 18px;
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), transparent 24%, rgba(var(--rank-accent-rgb), 0.08)),
        rgba(3, 5, 4, 0.66);
      box-shadow:
        0 18px 36px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      padding: 13px;
    }
    .paskus-structure-page .structure-rank-card::before,
    .paskus-structure-page .structure-rank-card::after {
      content: "";
      position: absolute;
      pointer-events: none;
    }
    .paskus-structure-page .structure-rank-card::before {
      top: -16px;
      left: 50%;
      width: 2px;
      height: 16px;
      background: rgba(var(--rank-accent-rgb), 0.36);
      transform: translateX(-50%);
      opacity: 0.72;
    }
    .paskus-structure-page .structure-rank-card::after {
      top: -8px;
      left: 50%;
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: rgb(var(--rank-accent-rgb));
      box-shadow: 0 0 14px rgba(var(--rank-accent-rgb), 0.68);
      transform: translate(-50%, -50%);
    }
    .paskus-structure-page .structure-rank-card > * {
      position: relative;
      z-index: 2;
    }
    .paskus-structure-page .structure-rank-head {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      min-height: 62px;
    }
    .paskus-structure-page .structure-insignia {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 56px;
      overflow: hidden;
      padding: 6px;
      border: 1px solid rgba(var(--rank-accent-rgb), 0.22);
      border-radius: 13px;
      background: rgba(var(--rank-accent-rgb), 0.08);
      color: rgb(var(--rank-accent-rgb));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    .paskus-structure-page .structure-rank-card--lower {
      min-height: 184px;
      padding: 16px;
    }
    .paskus-structure-page .structure-rank-card--lower .structure-rank-head {
      grid-template-columns: 72px minmax(0, 1fr);
      min-height: 78px;
    }
    .paskus-structure-page .structure-rank-card--lower .structure-insignia {
      min-height: 72px;
      border-radius: 15px;
      padding: 10px 8px;
    }
    .paskus-structure-page .structure-rank-card--sersan-dua {
      grid-column: 1 / -1;
      justify-self: center;
      width: min(100%, 380px);
    }
    .paskus-structure-page .structure-category--tamtama-junior .structure-rank-card--prajurit-dua {
      grid-column: 1 / -1;
      justify-self: center;
      width: min(100%, 760px);
    }
    .paskus-structure-page .structure-category--bintara .structure-rank-card--sersan-dua,
    .paskus-structure-page .structure-category--bintara-muda .structure-rank-card--sersan-dua {
      grid-column: auto;
      width: 100%;
    }
    .paskus-structure-page .structure-rank-main {
      min-width: 0;
    }
    .paskus-structure-page .structure-rank-main h3 {
      margin: 0;
      color: #f7faf3;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 13px;
      line-height: 1.18;
      letter-spacing: 0;
      text-transform: uppercase;
      overflow-wrap: anywhere;
    }
    .paskus-structure-page .structure-rank-role {
      display: inline-flex;
      width: fit-content;
      max-width: 100%;
      border: 1px solid rgba(var(--rank-accent-rgb), 0.26);
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.22);
      color: rgba(241, 236, 214, 0.76);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 0.08em;
      line-height: 1.3;
      margin-top: 8px;
      padding: 4px 7px;
      text-transform: uppercase;
    }
    .paskus-structure-page .structure-member-branch {
      position: relative;
      margin-top: 2px;
      min-width: 0;
      max-width: 100%;
      padding-top: 18px;
    }
    .paskus-structure-page .structure-member-branch::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      width: 1px;
      height: 18px;
      background: linear-gradient(180deg, rgba(var(--rank-accent-rgb), 0.62), rgba(var(--rank-accent-rgb), 0.08));
      transform: translateX(-50%);
      pointer-events: none;
    }
    .paskus-structure-page .structure-member-grid {
      position: relative;
      display: grid;
      grid-auto-flow: row;
      grid-auto-columns: auto;
      grid-template-columns: repeat(var(--structure-member-columns, 3), minmax(0, 1fr));
      grid-template-rows: none;
      gap: 8px;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      margin-inline: auto;
      overflow: visible;
      overscroll-behavior-inline: auto;
      padding-bottom: 0;
      scroll-snap-type: none;
      scrollbar-color: rgba(var(--rank-accent-rgb), 0.48) rgba(255, 255, 255, 0.06);
    }
    .paskus-structure-page .structure-rank-card--member-scroll .structure-member-grid {
      grid-auto-flow: column;
      grid-auto-columns: minmax(clamp(132px, 14vw, 210px), 1fr);
      grid-template-columns: none;
      grid-template-rows: repeat(4, minmax(42px, auto));
      width: 100%;
      margin-inline: 0;
      overflow-x: auto;
      overflow-y: hidden;
      overscroll-behavior-inline: contain;
      padding-bottom: 6px;
      scroll-snap-type: x proximity;
    }
    .paskus-structure-page .structure-member-grid:has(.structure-member-card:only-child) {
      grid-auto-flow: row;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none;
      justify-content: center;
      overflow-x: visible;
      padding-bottom: 0;
    }
    .paskus-structure-page .structure-member-grid:has(.structure-member-card:nth-child(2):last-child),
    .paskus-structure-page .structure-member-grid:has(.structure-member-card:nth-child(3):last-child) {
      grid-auto-flow: row;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
      grid-template-rows: none;
      justify-content: center;
      overflow-x: visible;
      padding-bottom: 0;
    }
    .paskus-structure-page .structure-rank-card:has(.structure-member-card:only-child) {
      max-width: min(100%, 520px);
      justify-self: center;
    }
    .paskus-structure-page .structure-rank-card:has(.structure-member-card:nth-child(2):last-child),
    .paskus-structure-page .structure-rank-card:has(.structure-member-card:nth-child(3):last-child) {
      max-width: min(100%, 640px);
      justify-self: center;
    }
    .paskus-structure-page .structure-member-grid:has(.structure-member-card:only-child) .structure-member-card {
      width: max-content;
      min-width: min(100%, 220px);
      max-width: 100%;
      justify-self: center;
      padding-inline: 20px;
    }
    .paskus-structure-page .structure-member-grid:has(.structure-member-card:nth-child(2):last-child) .structure-member-card,
    .paskus-structure-page .structure-member-grid:has(.structure-member-card:nth-child(3):last-child) .structure-member-card {
      width: max-content;
      min-width: min(100%, 190px);
      max-width: 100%;
      justify-self: center;
      padding-inline: 18px;
    }
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll):has(.structure-member-card) {
      max-width: min(100%, var(--structure-rank-target, 860px));
      justify-self: center;
    }
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid,
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:only-child),
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:nth-child(2):last-child),
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:nth-child(3):last-child) {
      grid-auto-flow: row;
      grid-auto-columns: auto;
      grid-template-columns: repeat(var(--structure-member-columns, 3), minmax(0, 1fr));
      grid-template-rows: none;
      justify-content: center;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      overflow: visible;
      padding-bottom: 0;
    }
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid .structure-member-card,
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:only-child) .structure-member-card,
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:nth-child(2):last-child) .structure-member-card,
    .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:nth-child(3):last-child) .structure-member-card {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      justify-self: stretch;
      padding-inline: 10px;
    }
    .paskus-structure-page .structure-member-grid::-webkit-scrollbar {
      height: 7px;
    }
    .paskus-structure-page .structure-member-grid::-webkit-scrollbar-track {
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
    }
    .paskus-structure-page .structure-member-grid::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: rgba(var(--rank-accent-rgb), 0.46);
    }
    .paskus-structure-page .structure-member-grid::before {
      content: "";
      position: absolute;
      top: -10px;
      left: 12%;
      right: 12%;
      height: 1px;
      background: linear-gradient(90deg, rgba(var(--rank-accent-rgb), 0), rgba(var(--rank-accent-rgb), 0.34), rgba(var(--rank-accent-rgb), 0));
      pointer-events: none;
    }
    .paskus-structure-page .structure-member-card {
      position: relative;
      min-width: 0;
      max-width: 100%;
      min-height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(var(--rank-accent-rgb), 0.2);
      border-radius: 12px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.065), rgba(var(--rank-accent-rgb), 0.055)),
        rgba(0, 0, 0, 0.26);
      color: rgba(238, 244, 234, 0.82);
      font-family: "Space Grotesk", Inter, system-ui, sans-serif;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.32;
      padding: 8px 9px;
      text-align: center;
      overflow-wrap: anywhere;
      word-break: normal;
      white-space: normal;
      text-wrap: balance;
      box-shadow:
        0 12px 24px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.065);
      scroll-snap-align: start;
    }
    .paskus-structure-page .structure-member-card::before {
      content: "";
      position: absolute;
      top: -9px;
      left: 50%;
      width: 1px;
      height: 9px;
      background: rgba(var(--rank-accent-rgb), 0.32);
      transform: translateX(-50%);
    }
    .paskus-structure-page .structure-empty-member {
      color: rgba(226, 233, 220, 0.42);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.45;
      margin-top: 12px;
    }
    .paskus-structure-page .structure-member-count {
      display: grid;
      justify-items: center;
      gap: 6px;
      width: min(100%, 210px);
      margin: 0 auto;
      padding: 16px 14px;
      border-radius: 16px;
      border: 1px solid rgba(var(--rank-accent-rgb), 0.24);
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(var(--rank-accent-rgb), 0.07)),
        rgba(8, 10, 9, 0.68);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 16px 32px rgba(0, 0, 0, 0.3);
    }
    .paskus-structure-page .structure-member-count strong {
      color: rgb(var(--rank-accent-rgb));
      font-family: 'Orbitron', 'Space Grotesk', sans-serif;
      font-size: clamp(26px, 4vw, 38px);
      line-height: 1;
      text-shadow: 0 0 18px rgba(var(--rank-accent-rgb), 0.36);
    }
    .paskus-structure-page .structure-member-count span {
      color: rgba(255, 255, 255, 0.62);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-align: center;
      text-transform: uppercase;
    }
    .paskus-structure-page .structure-rank-card--rank-only {
      min-height: 92px;
      align-items: center;
    }
    .paskus-structure-page .structure-rank-card--lower.structure-rank-card--rank-only {
      min-height: 168px;
    }
    .paskus-structure-page .structure-rank-card--count-only {
      min-height: 160px;
      justify-content: center;
    }
    .paskus-structure-page .structure-star {
      color: #efbf04;
      font-size: 20px;
      text-shadow: 0 0 12px rgba(239, 191, 4, 0.75);
    }
    .paskus-structure-page .structure-melati {
      color: #efbf04;
      filter: drop-shadow(0 0 8px rgba(239, 191, 4, 0.65));
    }
    .paskus-structure-page .structure-bars,
    .paskus-structure-page .structure-chevrons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .paskus-structure-page .structure-bars span {
      display: block;
      width: 36px;
      height: 7px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 2px;
      background: linear-gradient(90deg, rgba(var(--rank-accent-rgb), 0.72), rgba(255, 237, 159, 0.9), rgba(var(--rank-accent-rgb), 0.72));
      box-shadow: 0 0 10px rgba(var(--rank-accent-rgb), 0.34);
    }
    .paskus-structure-page .structure-rank-card--lower .structure-bars span {
      width: 31px;
      height: 5px;
    }
    .paskus-structure-page .structure-chevrons {
      gap: 0;
      margin-top: 4px;
    }
    .paskus-structure-page .structure-chevron {
      width: 28px;
      height: 28px;
      border-top: 5px solid rgb(var(--rank-accent-rgb));
      border-left: 5px solid rgb(var(--rank-accent-rgb));
      transform: rotate(45deg);
      margin-top: -13px;
      filter: drop-shadow(0 0 8px rgba(var(--rank-accent-rgb), 0.64));
    }
    .paskus-structure-page .structure-rank-card--lower .structure-chevrons {
      margin-top: 0;
      transform: scale(0.82);
      transform-origin: center;
    }
    .paskus-structure-page .structure-rank-card--category-bintara-tinggi .structure-chevrons,
    .paskus-structure-page .structure-rank-card--category-bintara .structure-chevrons,
    .paskus-structure-page .structure-rank-card--category-bintara-muda .structure-chevrons,
    .paskus-structure-page .structure-rank-card--category-tamtama .structure-chevrons,
    .paskus-structure-page .structure-rank-card--category-tamtama-senior .structure-chevrons {
      transform: translateY(5px) scale(0.82);
    }
    .paskus-structure-page .structure-rank-card--lower .structure-chevron {
      width: 23px;
      height: 23px;
      border-top-width: 4px;
      border-left-width: 4px;
      margin-top: -10px;
    }
    .paskus-structure-page .structure-fallback-icon {
      color: rgba(239, 191, 4, 0.76);
      font-size: 28px;
    }
    .paskus-structure-page .structure-status {
      min-height: 70vh;
      display: grid;
      place-items: center;
      padding: 130px 0 70px;
    }
    .paskus-structure-page .structure-status-card {
      width: min(560px, 100%);
      border: 1px solid rgba(239, 191, 4, 0.28);
      border-radius: 22px;
      background: rgba(7, 10, 9, 0.78);
      box-shadow: 0 30px 76px rgba(0, 0, 0, 0.42);
      padding: 28px;
      text-align: center;
    }
    .paskus-structure-page .structure-status-card h1 {
      margin: 12px 0 12px;
      font-size: clamp(28px, 6vw, 48px);
      line-height: 1;
    }
    .paskus-structure-page .structure-status-card p {
      color: rgba(232, 240, 226, 0.74);
      font-size: 13px;
      line-height: 1.7;
      margin: 0;
    }
    @media (max-width: 980px) {
      .paskus-structural-header-cta {
        display: inline-flex;
      }
      .paskus-structure-page .structure-nav-links {
        display: none;
      }
      .paskus-structure-page .structure-hero-inner {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 620px) {
      .paskus-structure-page .structure-nav {
        padding: 10px 12px;
      }
      .paskus-structure-page .structure-brand img {
        width: 34px;
        height: 34px;
      }
      .paskus-structure-page .structure-brand strong {
        font-size: 15px;
      }
      .paskus-structure-page .structure-hero {
        padding: 86px 14px 14px;
      }
      .paskus-structure-page .structure-hero-inner,
      .paskus-structure-page .structure-section,
      .paskus-structure-page .structure-status {
        width: min(100%, calc(100vw - 28px));
      }
      .paskus-structure-page h1 {
        font-size: clamp(28px, 9.8vw, 36px);
        line-height: 1.02;
        overflow-wrap: normal;
        word-break: normal;
      }
      .paskus-structure-page h1 span {
        font-size: 0.32em;
      }
      .paskus-structure-page .structure-lead {
        font-size: 11.5px;
        line-height: 1.56;
      }
      .paskus-structure-page .structure-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .paskus-structure-page .structure-stat {
        border-radius: 12px;
        padding: 12px 8px;
      }
      .paskus-structure-page .structure-stat strong {
        font-size: 22px;
      }
      .paskus-structure-page .structure-stat span {
        font-size: 8px;
        line-height: 1.25;
      }
      .paskus-structure-page .structure-section {
        padding: 10px 0 54px;
      }
      .paskus-structure-page .structure-tree {
        gap: 18px;
        min-width: 0;
        max-width: 100%;
      }
      .paskus-structure-page .structure-tree::before {
        left: 16px;
        top: 18px;
        bottom: 20px;
      }
      .paskus-structure-page .structure-tree-root {
        min-height: 30px;
        font-size: 8px;
        letter-spacing: 0.08em;
        padding: 0 12px;
      }
      .paskus-structure-page .structure-category-nav {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 16px;
      }
      .paskus-structure-page .structure-category-nav a {
        justify-content: center;
        min-height: 32px;
        border-radius: 10px;
        font-size: 8px;
        line-height: 1.2;
        padding: 0 8px;
        text-align: center;
      }
      .paskus-structure-page .structure-category {
        border-radius: 14px;
        contain: none;
        content-visibility: visible;
        contain-intrinsic-size: 0 460px;
        padding: 13px;
        margin-bottom: 14px;
        min-width: 0;
        max-width: 100%;
        width: 100%;
      }
      .paskus-structure-page .structure-category::before {
        left: 16px;
        top: 18px;
        width: 14px;
        height: 14px;
      }
      .paskus-structure-page .structure-category-header {
        align-items: center;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
        padding-bottom: 12px;
        margin-bottom: 12px;
        text-align: center;
      }
      .paskus-structure-page .structure-category h2 {
        font-size: clamp(17px, 5.4vw, 22px);
      }
      .paskus-structure-page .structure-category-header span {
        white-space: normal;
        font-size: 8.5px;
      }
      .paskus-structure-page .structure-rank-grid {
        grid-template-columns: 1fr;
        align-items: stretch;
        justify-content: stretch;
        gap: 12px;
        min-width: 0;
        max-width: 100%;
        padding-top: 12px;
      }
      .paskus-structure-page .structure-category--bintara-tinggi .structure-rank-grid,
      .paskus-structure-page .structure-category--bintara .structure-rank-grid,
      .paskus-structure-page .structure-category--bintara-muda .structure-rank-grid,
      .paskus-structure-page .structure-category--tamtama-senior .structure-rank-grid,
      .paskus-structure-page .structure-category--tamtama-junior .structure-rank-grid,
      .paskus-structure-page .structure-category--sipil .structure-rank-grid {
        grid-template-columns: 1fr;
        justify-content: stretch;
      }
      .paskus-structure-page .structure-rank-grid::before {
        left: 16px;
        right: auto;
        width: 1px;
        height: calc(100% - 10px);
        background: linear-gradient(180deg, rgba(var(--structure-accent-rgb), 0), rgba(var(--structure-accent-rgb), 0.34), rgba(var(--structure-accent-rgb), 0));
      }
      .paskus-structure-page .structure-rank-card {
        gap: 9px;
        min-height: 150px;
        min-width: 0;
        max-width: 100%;
        border-radius: 12px;
        padding: 10px 10px 10px 34px;
        width: 100%;
      }
      .paskus-structure-page .structure-rank-card--lower {
        min-height: 168px;
        padding: 11px 10px 11px 34px;
      }
      .paskus-structure-page .structure-rank-card--sersan-dua {
        width: 100%;
      }
      .paskus-structure-page .structure-category--tamtama-junior .structure-rank-card--prajurit-dua {
        width: 100%;
      }
      .paskus-structure-page .structure-rank-card::before {
        left: 16px;
        width: 2px;
        transform: translateX(-50%);
      }
      .paskus-structure-page .structure-rank-card::after {
        left: 16px;
      }
      .paskus-structure-page .structure-rank-head {
        grid-template-columns: 1fr;
        gap: 8px;
        min-height: 0;
      }
      .paskus-structure-page .structure-rank-card--lower .structure-rank-head {
        grid-template-columns: 1fr;
        min-height: 0;
      }
      .paskus-structure-page .structure-insignia {
        min-height: 48px;
        border-radius: 10px;
      }
      .paskus-structure-page .structure-rank-card--lower .structure-insignia {
        min-height: 62px;
        border-radius: 11px;
      }
      .paskus-structure-page .structure-rank-main h3 {
        font-size: 9.5px;
        line-height: 1.2;
      }
      .paskus-structure-page .structure-rank-role {
        font-size: 7px;
        letter-spacing: 0.04em;
        line-height: 1.22;
        padding: 4px 6px;
      }
      .paskus-structure-page .structure-member-branch {
        padding-top: 14px;
      }
      .paskus-structure-page .structure-member-grid {
        grid-auto-columns: minmax(118px, 1fr);
        grid-template-rows: repeat(4, minmax(38px, auto));
        gap: 7px;
        min-width: 0;
        max-width: 100%;
      }
      .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid,
      .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:only-child),
      .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:nth-child(2):last-child),
      .paskus-structure-page .structure-rank-card:not(.structure-rank-card--member-scroll) .structure-member-grid:has(.structure-member-card:nth-child(3):last-child) {
        grid-auto-flow: row;
        grid-auto-columns: auto;
        grid-template-columns: 1fr;
        grid-template-rows: none;
        width: 100%;
        overflow: visible;
        padding-bottom: 0;
      }
      .paskus-structure-page .structure-rank-card--member-scroll .structure-member-grid {
        grid-auto-flow: column;
        grid-auto-columns: minmax(118px, 1fr);
        grid-template-columns: none;
        grid-template-rows: repeat(4, minmax(38px, auto));
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 6px;
        scroll-snap-type: x proximity;
      }
      .paskus-structure-page .structure-member-grid:has(.structure-member-card:only-child) {
        grid-auto-flow: row;
        grid-template-columns: 1fr;
        justify-content: stretch;
      }
      .paskus-structure-page .structure-member-grid:has(.structure-member-card:only-child) .structure-member-card,
      .paskus-structure-page .structure-member-grid:has(.structure-member-card:nth-child(2):last-child) .structure-member-card,
      .paskus-structure-page .structure-member-grid:has(.structure-member-card:nth-child(3):last-child) .structure-member-card {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        padding-inline: 7px;
      }
      .paskus-structure-page .structure-rank-card:has(.structure-member-card:only-child) {
        max-width: 100%;
      }
      .paskus-structure-page .structure-member-card {
        min-height: 38px;
        font-size: 8.5px;
        line-height: 1.35;
        padding: 7px;
      }
      .paskus-structure-page .structure-member-count {
        width: 100%;
        padding: 14px 12px;
      }
      .paskus-structure-page .structure-empty-member {
        font-size: 9px;
      }
      .paskus-structure-page .structure-star {
        font-size: 18px;
      }
      .paskus-structure-page .structure-melati {
        width: 20px;
        height: 20px;
      }
      .paskus-structure-page .structure-bars span {
        width: 34px;
        height: 7px;
      }
      .paskus-structure-page .structure-chevron {
        width: 22px;
        height: 22px;
        border-width: 4px;
        margin-top: -11px;
      }
    }
    .paskus-about-page {
      min-height: 100vh;
      background:
        linear-gradient(180deg, rgba(3, 4, 4, 0.96), rgba(8, 11, 10, 0.88) 42%, rgba(3, 4, 4, 0.97)),
        linear-gradient(112deg, rgba(3, 5, 4, 0.88), rgba(3, 5, 4, 0.46) 46%, rgba(3, 5, 4, 0.92)),
        url("/assets/paskus-bg-briefing-helmets-v1.webp") center 28% / cover no-repeat,
        linear-gradient(180deg, #030404, #080b0a 42%, #030404);
      color: #f4f7f0;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow-x: hidden;
    }
    .paskus-about-page,
    .paskus-about-page * {
      box-sizing: border-box;
    }
    .paskus-about-page .about-hero-inner > *,
    .paskus-about-page .about-split > *,
    .paskus-about-page .about-grid > * {
      min-width: 0;
    }
    .paskus-about-page .about-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 70;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(157, 193, 131, 0.22);
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      padding: 16px 24px;
    }
    .paskus-about-page .about-brand {
      display: flex;
      align-items: center;
      color: #ffffff;
      text-decoration: none;
    }
    .paskus-about-page .about-brand img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-right: 10px;
    }
    .paskus-about-page .about-brand strong {
      display: block;
      color: #ffffff;
      font-size: 18px;
      line-height: 1;
      letter-spacing: 0;
    }
    .paskus-about-page .about-brand span span {
      display: block;
      color: #9dc183;
      font-size: 10px;
      letter-spacing: 0;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .paskus-about-page .about-nav-links {
      display: flex;
      align-items: center;
      gap: 22px;
    }
    .paskus-about-page .about-nav a {
      color: #adb7aa;
      font-size: 12px;
      letter-spacing: 0;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 160ms ease;
    }
    .paskus-about-page .about-nav a:hover {
      color: #ffffff;
    }
    .paskus-about-page .discord-link {
      border: 1px solid rgba(239, 191, 4, 0.48);
      color: #efbf04 !important;
      padding: 8px 12px;
    }
    .paskus-about-page .about-hero {
      position: relative;
      isolation: isolate;
      min-height: 92vh;
      display: grid;
      align-items: end;
      overflow: hidden;
      padding: 132px 22px 72px;
      background:
        linear-gradient(180deg, rgba(2, 3, 3, 0.28), rgba(2, 3, 3, 0.72) 58%, #050606),
        linear-gradient(110deg, rgba(3, 5, 4, 0.92), rgba(3, 5, 4, 0.28) 52%, rgba(3, 5, 4, 0.88)),
        url("/assets/about-us-bg-v1.webp") center 54% / cover no-repeat;
    }
    .paskus-about-page .about-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
      background-size: 94px 94px;
      mask-image: linear-gradient(180deg, transparent, #000 14%, #000 88%, transparent);
      opacity: 0.5;
    }
    .paskus-about-page .about-hero-inner,
    .paskus-about-page .about-section {
      width: min(1180px, calc(100% - 44px));
      margin: 0 auto;
    }
    .paskus-about-page .about-hero-inner {
      display: grid;
      grid-template-columns: minmax(0, 1.08fr) minmax(300px, 0.72fr);
      gap: clamp(28px, 5vw, 68px);
      align-items: end;
    }
    .paskus-about-page .about-kicker {
      color: #efbf04;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-about-page h1 {
      margin: 16px 0 22px;
      color: #f7faf3;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(56px, 10vw, 132px);
      line-height: 0.9;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow:
        0 20px 48px rgba(0, 0, 0, 0.68),
        0 0 34px rgba(157, 193, 131, 0.16);
    }
    .paskus-about-page h1 span {
      display: block;
      color: #9dc183;
      font-size: 0.24em;
      line-height: 1.25;
      margin-top: 16px;
    }
    .paskus-about-page .about-lead {
      max-width: 760px;
      color: rgba(238, 244, 234, 0.86);
      font-size: clamp(15px, 1.4vw, 18px);
      line-height: 1.86;
      margin: 0;
    }
    .paskus-about-page .about-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 34px;
    }
    .paskus-about-page .about-actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border: 1px solid rgba(157, 193, 131, 0.48);
      background: rgba(157, 193, 131, 0.11);
      color: #edf8e7;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0;
      padding: 0 18px;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 18px 34px rgba(0, 0, 0, 0.34);
    }
    .paskus-about-page .about-actions a:first-child {
      border-color: rgba(239, 191, 4, 0.54);
      background: rgba(239, 191, 4, 0.14);
      color: #fff3bf;
    }
    .paskus-about-page .about-command-panel {
      border: 1px solid rgba(239, 191, 4, 0.28);
      border-radius: 22px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.11), transparent 28%, rgba(157, 193, 131, 0.1)),
        linear-gradient(115deg, rgba(3, 5, 4, 0.72), rgba(3, 5, 4, 0.35) 50%, rgba(3, 5, 4, 0.82)),
        url("/assets/paskus-bg-helmet-close-v1.webp") center 42% / cover no-repeat,
        rgba(7, 10, 9, 0.7);
      box-shadow:
        0 34px 86px rgba(0, 0, 0, 0.52),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(18px) saturate(124%);
      -webkit-backdrop-filter: blur(18px) saturate(124%);
      padding: 28px;
    }
    .paskus-about-page .about-command-panel h2 {
      margin: 0 0 18px;
      color: #f6f8f1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 22px;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-about-page .about-command-row {
      display: grid;
      gap: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 16px 0;
    }
    .paskus-about-page .about-command-row:first-of-type {
      border-top: 0;
      padding-top: 0;
    }
    .paskus-about-page .about-command-row span {
      color: rgba(239, 191, 4, 0.82);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-about-page .about-command-row strong,
    .paskus-about-page .about-command-row p {
      color: rgba(236, 243, 231, 0.82);
      font-size: 14px;
      line-height: 1.68;
      margin: 0;
    }
    .paskus-about-page .about-section {
      padding: clamp(72px, 8vw, 108px) 0;
    }
    .paskus-about-page .about-identity-section {
      padding-top: clamp(58px, 6vw, 82px);
      padding-bottom: clamp(58px, 6vw, 82px);
    }
    .paskus-about-page .about-section-header {
      display: grid;
      gap: 14px;
      margin-bottom: 34px;
      max-width: 860px;
    }
    .paskus-about-page .about-section-header.center {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .paskus-about-page .about-section h2 {
      margin: 0;
      color: #f6f8f1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(30px, 4vw, 52px);
      line-height: 1.08;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-about-page .about-section p {
      color: rgba(232, 240, 226, 0.78);
      font-size: 15px;
      line-height: 1.82;
      margin: 0;
    }
    .paskus-about-page .about-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }
    .paskus-about-page .about-grid.three {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .paskus-about-page .about-identity-section .about-split {
      grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1.22fr);
      gap: clamp(22px, 3.4vw, 44px);
      align-items: center;
    }
    .paskus-about-page .about-identity-section .about-section-header {
      margin-bottom: 22px;
      max-width: 820px;
    }
    .paskus-about-page .about-identity-section .about-section h2,
    .paskus-about-page .about-identity-section h2 {
      font-size: clamp(28px, 3.25vw, 44px);
      line-height: 1.08;
      text-wrap: balance;
    }
    .paskus-about-page .about-identity-section .about-section-header p {
      font-size: clamp(13px, 1.16vw, 15px);
      line-height: 1.68;
    }
    .paskus-about-page .about-identity-section .about-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .paskus-about-page .about-card,
    .paskus-about-page .about-stat,
    .paskus-about-page .about-step {
      border: 1px solid rgba(157, 193, 131, 0.24);
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.078), transparent 30%, rgba(157, 193, 131, 0.07)),
        rgba(8, 12, 10, 0.62);
      box-shadow:
        0 24px 58px rgba(0, 0, 0, 0.38),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: clamp(18px, 2vw, 24px);
    }
    .paskus-about-page .about-identity-section .about-card {
      min-height: 174px;
      border-radius: 16px;
      padding: 18px 20px;
    }
    .paskus-about-page .about-stat {
      min-height: 142px;
    }
    .paskus-about-page .about-stat strong {
      display: block;
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(34px, 4vw, 48px);
      line-height: 1;
      margin-bottom: 10px;
    }
    .paskus-about-page .about-card h3,
    .paskus-about-page .about-step h3 {
      color: #f6f8f1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 15px;
      letter-spacing: 0;
      line-height: 1.25;
      margin: 0 0 12px;
      text-transform: uppercase;
    }
    .paskus-about-page .about-identity-section .about-card h3 {
      font-size: clamp(12px, 1.05vw, 14px);
      line-height: 1.24;
      margin-bottom: 10px;
      text-wrap: balance;
    }
    .paskus-about-page .about-card p,
    .paskus-about-page .about-step p,
    .paskus-about-page .about-stat span {
      color: rgba(226, 233, 220, 0.72);
      font-size: 13px;
      line-height: 1.72;
      margin: 0;
    }
    .paskus-about-page .about-identity-section .about-card p {
      font-size: 12.5px;
      line-height: 1.55;
    }
    .paskus-about-page .about-step {
      position: relative;
      padding-top: 58px;
    }
    .paskus-about-page .about-step::before {
      content: attr(data-step);
      position: absolute;
      top: 20px;
      left: 24px;
      color: rgba(239, 191, 4, 0.8);
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 18px;
      font-weight: 900;
    }
    .paskus-about-page .about-split {
      display: grid;
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
      gap: clamp(26px, 5vw, 62px);
      align-items: center;
    }
    .paskus-about-page .about-image-frame {
      position: relative;
      min-height: 440px;
      overflow: hidden;
      border: 1px solid rgba(239, 191, 4, 0.24);
      border-radius: 22px;
      background: rgba(8, 11, 10, 0.7);
      box-shadow:
        0 30px 82px rgba(0, 0, 0, 0.46),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    .paskus-about-page .about-identity-section .about-image-frame {
      min-height: 360px;
      border-radius: 18px;
    }
    .paskus-about-page .about-image-frame img {
      width: 100%;
      height: 100%;
      min-height: inherit;
      object-fit: cover;
      filter: saturate(0.92) contrast(1.04);
    }
    .paskus-about-page .about-image-frame::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(180deg, transparent 36%, rgba(3, 4, 4, 0.72)),
        linear-gradient(115deg, rgba(255, 255, 255, 0.1), transparent 28%);
    }
    .paskus-about-page .about-unit-link {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      border: 1px solid rgba(239, 191, 4, 0.32);
      border-radius: 999px;
      color: #fff3bf;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0;
      margin-top: 18px;
      min-height: 34px;
      padding: 0 14px;
      text-decoration: none;
      text-transform: uppercase;
    }
    @media (max-width: 980px) {
      .paskus-about-page .about-nav-links {
        display: none;
      }
      .paskus-about-page .about-hero {
        min-height: auto;
      }
      .paskus-about-page .about-hero-inner,
      .paskus-about-page .about-split,
      .paskus-about-page .about-grid,
      .paskus-about-page .about-grid.three {
        grid-template-columns: 1fr;
      }
      .paskus-about-page .about-command-panel {
        padding: 22px;
      }
      .paskus-about-page .about-identity-section .about-split {
        grid-template-columns: 1fr;
      }
      .paskus-about-page .about-identity-section .about-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .paskus-about-page .about-image-frame {
        min-height: 320px;
      }
      .paskus-about-page .about-identity-section .about-image-frame {
        min-height: 260px;
      }
    }
    @media (max-width: 520px) {
      .paskus-about-page .about-nav {
        padding: 14px 18px;
      }
      .paskus-about-page .about-hero {
        padding: 118px 20px 54px;
      }
      .paskus-about-page .about-hero-inner,
      .paskus-about-page .about-section {
        width: min(100%, calc(100vw - 40px));
      }
      .paskus-about-page h1 {
        font-size: clamp(38px, 11vw, 46px);
        line-height: 1;
        overflow-wrap: anywhere;
        word-break: break-word;
      }
      .paskus-about-page h1 span {
        font-size: 0.34em;
        line-height: 1.35;
        margin-top: 12px;
      }
      .paskus-about-page .about-lead {
        font-size: 13.5px;
        line-height: 1.72;
        max-width: min(100%, 310px);
        overflow-wrap: break-word;
      }
      .paskus-about-page .about-command-row p,
      .paskus-about-page .about-card p,
      .paskus-about-page .about-step p {
        max-width: min(100%, 300px);
        overflow-wrap: break-word;
      }
      .paskus-about-page .about-actions {
        align-items: stretch;
        flex-direction: column;
        max-width: 100%;
      }
      .paskus-about-page .about-actions a {
        width: 100%;
      }
      .paskus-about-page .about-command-panel,
      .paskus-about-page .about-card,
      .paskus-about-page .about-stat,
      .paskus-about-page .about-step {
        border-radius: 16px;
      }
      .paskus-about-page .about-identity-section .about-grid {
        gap: 10px;
      }
      .paskus-about-page .about-identity-section .about-card {
        min-height: 148px;
        padding: 12px;
      }
      .paskus-about-page .about-identity-section .about-card h3 {
        font-size: 10.5px;
        line-height: 1.22;
      }
      .paskus-about-page .about-identity-section .about-card p {
        font-size: 10.25px;
        line-height: 1.45;
      }
      .paskus-about-page .about-section {
        padding: 62px 0;
      }
    }
    .paskus-support-detail-page {
      --support-rgb: 157, 193, 131;
      --support-accent: #9dc183;
      --support-wallpaper: url("/assets/paskus-bg-ops-pair-v1.webp");
      min-height: 100vh;
      background:
        linear-gradient(180deg, rgba(4, 5, 5, 0.94), rgba(9, 12, 11, 0.88) 48%, rgba(4, 5, 5, 0.97)),
        linear-gradient(120deg, rgba(3, 5, 4, 0.86), rgba(3, 5, 4, 0.44) 50%, rgba(3, 5, 4, 0.92)),
        radial-gradient(circle at 84% 12%, rgba(var(--support-rgb), 0.14), transparent 28%),
        var(--support-wallpaper) center top / cover no-repeat,
        linear-gradient(180deg, #040505, #0b0f0d 48%, #040505);
      color: #f4f7f0;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .paskus-support-detail-page[data-support-slug="dpdm"] {
      background:
        linear-gradient(180deg, rgba(2, 4, 5, 0.84), rgba(2, 4, 5, 0.94) 56%, #040505),
        linear-gradient(125deg, rgba(var(--support-rgb), 0.16), rgba(6, 9, 14, 0.74) 42%, rgba(0, 0, 0, 0.86)),
        var(--support-wallpaper) center top / cover no-repeat,
        #040505;
    }
    .paskus-support-detail-page[data-support-slug="dpdm"] .support-hero::before {
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.44)),
        var(--support-wallpaper) center top / cover no-repeat;
      background-size: 96px 96px, 96px 96px, auto, cover;
      opacity: 0.78;
    }
    .paskus-support-detail-page .support-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(157, 193, 131, 0.22);
      background: rgba(0, 0, 0, 0.68);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      padding: 16px 24px;
    }
    .paskus-support-detail-page .support-brand {
      display: flex;
      align-items: center;
      color: #ffffff;
      text-decoration: none;
    }
    .paskus-support-detail-page .support-brand img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-right: 10px;
    }
    .paskus-support-detail-page .support-brand strong {
      display: block;
      color: #ffffff;
      font-size: 18px;
      line-height: 1;
      letter-spacing: 0;
    }
    .paskus-support-detail-page .support-brand span span {
      display: block;
      color: var(--support-accent);
      font-size: 10px;
      letter-spacing: 0;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .paskus-support-detail-page .support-nav-links {
      display: flex;
      align-items: center;
      gap: 22px;
    }
    .paskus-support-detail-page .support-nav a {
      color: #adb7aa;
      font-size: 12px;
      letter-spacing: 0;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 160ms ease;
    }
    .paskus-support-detail-page .support-nav a:hover {
      color: #ffffff;
    }
    .paskus-support-detail-page .discord-link {
      border: 1px solid rgba(239, 191, 4, 0.48);
      color: #efbf04 !important;
      padding: 8px 12px;
    }
    .paskus-support-detail-page .support-hero {
      position: relative;
      isolation: isolate;
      min-height: 700px;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: 128px 22px 76px;
    }
    .paskus-support-detail-page .support-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -2;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.032) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px),
        linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.48)),
        var(--support-wallpaper) center top / cover no-repeat;
      background-size: 96px 96px, 96px 96px, auto, cover;
      mask-image: linear-gradient(180deg, transparent, #000 16%, #000 84%, transparent);
      opacity: 0.48;
    }
    .paskus-support-detail-page .support-hero::after {
      content: "";
      position: absolute;
      inset: auto 9% 6% 9%;
      z-index: -1;
      height: 260px;
      border-radius: 999px;
      background: rgba(var(--support-rgb), 0.12);
      filter: blur(78px);
    }
    .paskus-support-detail-page .support-hero-inner,
    .paskus-support-detail-page .support-section {
      width: min(1140px, calc(100% - 44px));
      margin: 0 auto;
    }
    .paskus-support-detail-page .support-hero-inner {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.72fr);
      align-items: center;
      gap: 58px;
    }
    .paskus-support-detail-page .support-kicker {
      color: var(--support-accent);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-support-detail-page h1 {
      margin: 16px 0 20px;
      color: #f6f8f1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 82px;
      line-height: 0.92;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow:
        0 18px 44px rgba(0, 0, 0, 0.66),
        0 0 34px rgba(var(--support-rgb), 0.16);
    }
    .paskus-support-detail-page h1 span {
      display: block;
      color: #efbf04;
      font-size: 20px;
      line-height: 1.35;
      margin-top: 16px;
    }
    .paskus-support-detail-page .support-lead {
      max-width: 730px;
      color: rgba(235, 243, 229, 0.84);
      font-size: 17px;
      line-height: 1.86;
      margin: 0;
    }
    .paskus-support-detail-page .support-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 32px;
    }
    .paskus-support-detail-page .support-actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border: 1px solid rgba(var(--support-rgb), 0.5);
      background: rgba(var(--support-rgb), 0.11);
      color: #edf8e7;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0;
      padding: 0 18px;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 18px 34px rgba(0, 0, 0, 0.34);
    }
    .paskus-support-detail-page .support-brief {
      border: 1px solid rgba(var(--support-rgb), 0.32);
      border-radius: 22px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.11), transparent 28%, rgba(var(--support-rgb), 0.1)),
        rgba(8, 12, 10, 0.66);
      box-shadow:
        0 34px 86px rgba(0, 0, 0, 0.52),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px) saturate(126%);
      -webkit-backdrop-filter: blur(20px) saturate(126%);
      padding: 28px;
    }
    .paskus-support-detail-page .support-brief-logo {
      display: grid;
      place-items: center;
      min-height: 168px;
      margin-bottom: 20px;
      border: 1px solid rgba(var(--support-rgb), 0.28);
      border-radius: 18px;
      background:
        radial-gradient(circle at 50% 36%, rgba(var(--support-rgb), 0.2), transparent 58%),
        rgba(255, 255, 255, 0.045);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 18px 42px rgba(0, 0, 0, 0.24);
    }
    .paskus-support-detail-page .support-brief-logo img {
      width: min(150px, 58vw);
      height: min(150px, 58vw);
      object-fit: contain;
      filter:
        drop-shadow(0 18px 24px rgba(0, 0, 0, 0.36))
        drop-shadow(0 0 18px rgba(var(--support-rgb), 0.18));
    }
    .paskus-support-detail-page .support-brief-roman-logo {
      display: grid;
      place-items: center;
      width: min(172px, 58vw);
      height: min(172px, 58vw);
      border: 0;
      border-radius: 0;
      background: transparent;
      color: var(--support-accent);
      font-family: "Times New Roman", Times, serif;
      font-size: min(172px, 42vw);
      font-weight: 700;
      line-height: 0.82;
      text-shadow:
        0 20px 38px rgba(0, 0, 0, 0.58),
        0 0 28px rgba(var(--support-rgb), 0.28);
      box-shadow: none;
    }
    .paskus-support-detail-page[data-support-slug="staff-komando"] .support-brief-logo {
      min-height: 188px;
      margin-bottom: 12px;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    .paskus-support-detail-page[data-support-slug="dpdm"] .support-brief-logo {
      min-height: 228px;
      border-color: transparent;
      background: transparent;
      box-shadow: none;
    }
    .paskus-support-detail-page[data-support-slug="dpdm"] .support-brief-logo img {
      width: min(214px, 64vw);
      height: min(214px, 64vw);
    }
    .paskus-support-detail-page .support-brief h2 {
      margin: 0 0 18px;
      color: #f6f8f1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 22px;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-support-detail-page .support-brief-row {
      display: grid;
      gap: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 16px 0;
    }
    .paskus-support-detail-page .support-brief-row:first-of-type {
      border-top: 0;
      padding-top: 0;
    }
    .paskus-support-detail-page .support-brief-row span {
      color: rgba(239, 191, 4, 0.82);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-support-detail-page .support-brief-row strong,
    .paskus-support-detail-page .support-brief-row p {
      color: rgba(236, 243, 231, 0.82);
      font-size: 14px;
      line-height: 1.68;
      margin: 0;
    }
    .paskus-support-detail-page .support-section {
      padding: 92px 0;
    }
    .paskus-support-detail-page .support-split {
      display: grid;
      grid-template-columns: 0.78fr 1.22fr;
      gap: 58px;
      align-items: start;
    }
    .paskus-support-detail-page .support-section h2 {
      margin: 0;
      color: #f6f8f1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 44px;
      line-height: 1.08;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-support-detail-page .support-section p {
      color: rgba(232, 240, 226, 0.78);
      font-size: 15px;
      line-height: 1.82;
      margin: 0;
    }
    .paskus-support-detail-page .support-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 34px;
    }
    .paskus-support-detail-page .support-card {
      min-height: 210px;
      border: 1px solid rgba(var(--support-rgb), 0.25);
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.08), transparent 28%, rgba(var(--support-rgb), 0.075)),
        rgba(8, 12, 10, 0.62);
      box-shadow:
        0 24px 58px rgba(0, 0, 0, 0.38),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 24px;
    }
    .paskus-support-detail-page .support-card h3 {
      margin: 0 0 13px;
      color: var(--support-accent);
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 15px;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-support-detail-page .support-card p {
      font-size: 13px;
      line-height: 1.74;
    }
    .paskus-support-detail-page .support-priority-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-top: 30px;
    }
    .paskus-support-detail-page .support-priority {
      border-left: 1px solid rgba(var(--support-rgb), 0.48);
      padding: 4px 0 4px 16px;
    }
    .paskus-support-detail-page .support-priority strong {
      display: block;
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 18px;
      letter-spacing: 0;
      line-height: 1.22;
      text-transform: uppercase;
    }
    .paskus-support-detail-page .support-priority span {
      display: block;
      color: rgba(232, 240, 226, 0.58);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0;
      margin-top: 8px;
      text-transform: uppercase;
    }
    .paskus-support-detail-page[data-support-slug="staff-komando"] .support-priority-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }
    .paskus-support-detail-page[data-support-slug="staff-komando"] .support-priority {
      display: flex;
      min-height: 112px;
      flex-direction: column;
      justify-content: center;
      border: 1px solid rgba(var(--support-rgb), 0.28);
      border-left: 1px solid rgba(var(--support-rgb), 0.28);
      border-radius: 16px;
      background:
        linear-gradient(150deg, rgba(255, 255, 255, 0.08), transparent 36%, rgba(var(--support-rgb), 0.08)),
        rgba(9, 12, 10, 0.58);
      box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.32),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      padding: 18px 14px;
      text-align: center;
    }
    .paskus-support-detail-page[data-support-slug="staff-komando"] .support-priority strong {
      color: #f1c60a;
      font-size: clamp(13px, 1.02vw, 15.5px);
      line-height: 1.2;
      text-wrap: balance;
    }
    .paskus-support-detail-page[data-support-slug="staff-komando"] .support-priority span {
      color: rgba(232, 240, 226, 0.62);
      font-size: 9.5px;
      line-height: 1.25;
      margin-top: 10px;
    }
    @media (max-width: 980px) {
      .paskus-support-detail-page .support-nav-links {
        display: none;
      }
      .paskus-support-detail-page .support-hero {
        min-height: auto;
      }
      .paskus-support-detail-page .support-hero-inner,
      .paskus-support-detail-page .support-split,
      .paskus-support-detail-page .support-grid,
      .paskus-support-detail-page .support-priority-grid {
        grid-template-columns: 1fr;
      }
      .paskus-support-detail-page h1 {
        font-size: 50px;
      }
      .paskus-support-detail-page .support-section h2 {
        font-size: 34px;
      }
      .paskus-support-detail-page[data-support-slug="staff-komando"] .support-priority-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    .paskus-komodo-page {
      min-height: 100vh;
      background:
        radial-gradient(circle at 50% 0%, rgba(102, 190, 72, 0.13), transparent 34%),
        linear-gradient(180deg, #030503, #090d08 42%, #040604);
      color: #f5f8f1;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .paskus-komodo-page .paskus-komodo-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(157, 193, 131, 0.22);
      background: rgba(0, 0, 0, 0.68);
      backdrop-filter: blur(14px);
      padding: 16px 24px;
    }
    .paskus-komodo-page .paskus-komodo-nav img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-right: 10px;
    }
    .paskus-komodo-page .paskus-komodo-nav a {
      color: #aeb8aa;
      font-size: 12px;
      letter-spacing: 0.14em;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 160ms ease;
    }
    .paskus-komodo-page .paskus-komodo-nav a:hover {
      color: #ffffff;
    }
    .paskus-komodo-page .paskus-komodo-nav .discord-link {
      border: 1px solid rgba(239, 191, 4, 0.48);
      color: #efbf04;
      padding: 8px 12px;
    }
    .paskus-komodo-page .komodo-hero {
      position: relative;
      isolation: isolate;
      min-height: 100vh;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: 120px 22px 72px;
    }
    .paskus-komodo-page .komodo-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -2;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.024) 1px, transparent 1px);
      background-size: 92px 92px;
      mask-image: linear-gradient(180deg, transparent, #000 16%, #000 84%, transparent);
      opacity: 0.42;
    }
    .paskus-komodo-page .komodo-hero::after {
      content: "";
      position: absolute;
      inset: auto 8% 5% 8%;
      z-index: -1;
      height: 34%;
      border-radius: 999px;
      background: rgba(102, 190, 72, 0.13);
      filter: blur(70px);
    }
    .paskus-komodo-page .komodo-hero-inner {
      width: min(1120px, 100%);
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.7fr);
      align-items: center;
      gap: clamp(28px, 6vw, 82px);
    }
    .paskus-komodo-page .komodo-eyebrow {
      color: #66be48;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }
    .paskus-komodo-page h1 {
      margin: 18px 0 20px;
      color: #f6fbf1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(72px, 11vw, 168px);
      line-height: 0.86;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      text-shadow:
        0 18px 44px rgba(0, 0, 0, 0.68),
        0 0 34px rgba(102, 190, 72, 0.18);
    }
    .paskus-komodo-page h1 span {
      display: block;
      color: #66be48;
      font-size: 0.26em;
      line-height: 1.2;
      letter-spacing: 0.28em;
      margin-top: 16px;
    }
    .paskus-komodo-page .komodo-lead {
      max-width: 720px;
      color: rgba(235, 243, 229, 0.84);
      font-size: clamp(15px, 1.4vw, 18px);
      line-height: 1.9;
    }
    .paskus-komodo-page .komodo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 34px;
    }
    .paskus-komodo-page .komodo-actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border: 1px solid rgba(102, 190, 72, 0.52);
      background: rgba(102, 190, 72, 0.12);
      color: #eaffdf;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      padding: 0 18px;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 18px 34px rgba(0, 0, 0, 0.34);
    }
    .paskus-komodo-page .komodo-logo-card {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 420px;
      border: 1px solid rgba(102, 190, 72, 0.32);
      border-radius: 26px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.12), transparent 28%, rgba(102, 190, 72, 0.12)),
        rgba(7, 11, 7, 0.64);
      box-shadow:
        0 36px 90px rgba(0, 0, 0, 0.54),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px) saturate(132%);
      overflow: hidden;
    }
    .paskus-komodo-page .komodo-logo-card::before {
      content: "PASUKAN REGULER";
      position: absolute;
      top: 22px;
      left: 24px;
      color: rgba(239, 191, 4, 0.86);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.2em;
    }
    .paskus-komodo-page .komodo-logo-card img {
      width: min(78%, 330px);
      filter:
        drop-shadow(0 26px 38px rgba(0, 0, 0, 0.54))
        drop-shadow(0 0 26px rgba(102, 190, 72, 0.24));
    }
    .paskus-komodo-page .komodo-section {
      width: min(1120px, calc(100% - 44px));
      margin: 0 auto;
      padding: clamp(78px, 8vw, 116px) 0;
    }
    .paskus-komodo-page .komodo-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
      margin-top: 38px;
    }
    .paskus-komodo-page .komodo-info-card {
      border: 1px solid rgba(157, 193, 131, 0.25);
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.09), transparent 28%, rgba(102, 190, 72, 0.08)),
        rgba(8, 12, 8, 0.62);
      box-shadow:
        0 24px 58px rgba(0, 0, 0, 0.38),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      padding: 24px;
      min-height: 220px;
    }
    .paskus-komodo-page .komodo-info-card h3 {
      margin: 0 0 14px;
      color: #66be48;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 15px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .paskus-komodo-page .komodo-info-card p,
    .paskus-komodo-page .komodo-copy p {
      color: rgba(232, 240, 226, 0.82);
      font-size: 14px;
      line-height: 1.78;
      margin: 0;
    }
    .paskus-komodo-page .komodo-copy {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: clamp(28px, 5vw, 72px);
      align-items: start;
    }
    .paskus-komodo-page .komodo-copy h2 {
      margin: 0;
      color: #f6fbf1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(34px, 4vw, 58px);
      line-height: 1.04;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .paskus-komodo-page .komodo-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 28px;
    }
    .paskus-komodo-page .komodo-stat {
      border-left: 1px solid rgba(102, 190, 72, 0.45);
      padding-left: 16px;
    }
    .paskus-komodo-page .komodo-stat strong {
      display: block;
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 24px;
      line-height: 1;
    }
    .paskus-komodo-page .komodo-stat span {
      display: block;
      color: rgba(232, 240, 226, 0.62);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.16em;
      margin-top: 8px;
      text-transform: uppercase;
    }
    .paskus-streamer-page {
      min-height: 100vh;
      background:
        linear-gradient(180deg, rgba(3, 5, 4, 0.98), rgba(7, 10, 9, 0.95) 42%, #030403),
        #050706;
      color: #f4f7ef;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow-x: hidden;
    }
    .paskus-streamer-page *,
    .paskus-streamer-page *::before,
    .paskus-streamer-page *::after {
      box-sizing: border-box;
    }
    .paskus-streamer-page .streamer-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      border-bottom: 1px solid rgba(239, 191, 4, 0.18);
      background: rgba(0, 0, 0, 0.68);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      padding: 16px 24px;
    }
    .paskus-streamer-page .streamer-brand {
      display: inline-flex;
      align-items: center;
      color: #ffffff;
      text-decoration: none;
    }
    .paskus-streamer-page .streamer-brand img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-right: 10px;
    }
    .paskus-streamer-page .streamer-brand span {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .paskus-streamer-page .streamer-brand strong {
      font-size: 18px;
      letter-spacing: 0;
    }
    .paskus-streamer-page .streamer-brand span span {
      color: #9dc183;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .paskus-streamer-page .streamer-nav a {
      color: #aeb8aa;
      font-size: 12px;
      letter-spacing: 0.14em;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 160ms ease, border-color 160ms ease, background-color 160ms ease;
    }
    .paskus-streamer-page .streamer-nav a:hover {
      color: #ffffff;
    }
    .paskus-streamer-page .streamer-nav .discord-link {
      border: 1px solid rgba(239, 191, 4, 0.48);
      color: #efbf04;
      padding: 8px 12px;
    }
    .paskus-streamer-page .streamer-hero {
      position: relative;
      isolation: isolate;
      min-height: 92vh;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: 120px 22px 72px;
    }
    .paskus-streamer-page .streamer-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -3;
      background-image: var(--streamer-bg);
      background-size: cover;
      background-position: center;
      opacity: 0.24;
      filter: saturate(0.82) contrast(1.08);
      transform: scale(1.02);
    }
    .paskus-streamer-page .streamer-hero::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -2;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.48), rgba(4, 6, 5, 0.88)),
        linear-gradient(90deg, rgba(239, 191, 4, 0.06) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.024) 1px, transparent 1px);
      background-size: auto, 92px 92px, 92px 92px;
    }
    .paskus-streamer-page .streamer-hero-inner {
      width: min(1180px, 100%);
      display: grid;
      grid-template-columns: minmax(0, 1.02fr) minmax(320px, 0.82fr);
      align-items: center;
      gap: 42px;
    }
    .paskus-streamer-page .streamer-kicker {
      color: #efbf04;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .paskus-streamer-page h1 {
      margin: 18px 0 20px;
      color: #f6f7f0;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 64px;
      line-height: 0.98;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow: 0 18px 42px rgba(0, 0, 0, 0.58);
    }
    .paskus-streamer-page h1 span {
      display: block;
      color: #9dc183;
      font-size: 22px;
      line-height: 1.25;
      margin-top: 14px;
    }
    .paskus-streamer-page .streamer-lead {
      max-width: 760px;
      color: rgba(232, 240, 226, 0.82);
      font-size: 16px;
      line-height: 1.8;
      margin: 0;
    }
    .paskus-streamer-page .streamer-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 30px;
    }
    .paskus-streamer-page .streamer-actions a,
    .paskus-streamer-page .streamer-mini-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      border: 1px solid rgba(239, 191, 4, 0.34);
      background: rgba(239, 191, 4, 0.09);
      color: #fff4c6;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.1em;
      padding: 0 16px;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.34);
    }
    .paskus-streamer-page .streamer-actions a:first-child {
      background: rgba(157, 193, 131, 0.14);
      border-color: rgba(157, 193, 131, 0.46);
      color: #ecffe4;
    }
    .paskus-streamer-page .streamer-live-panel,
    .paskus-streamer-page .streamer-card,
    .paskus-streamer-page .streamer-event,
    .paskus-streamer-page .streamer-creator,
    .paskus-streamer-page .streamer-facility {
      border: 1px solid rgba(239, 191, 4, 0.18);
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.09), transparent 36%, rgba(157, 193, 131, 0.08)),
        rgba(8, 12, 10, 0.68);
      box-shadow:
        0 24px 70px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(18px) saturate(128%);
      -webkit-backdrop-filter: blur(18px) saturate(128%);
    }
    .paskus-streamer-page .streamer-live-panel {
      padding: 22px;
    }
    .paskus-streamer-page .streamer-live-preview {
      position: relative;
      aspect-ratio: 16 / 10;
      border-radius: 14px;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.78)),
        url("/assets/t2-CbABOaM8.webp") center / cover;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .paskus-streamer-page .streamer-live-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255, 75, 75, 0.5);
      border-radius: 999px;
      background: rgba(95, 10, 16, 0.72);
      color: #ffe5e5;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.12em;
      padding: 7px 10px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-live-badge::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #ff4b4b;
      box-shadow: 0 0 14px rgba(255, 75, 75, 0.68);
    }
    .paskus-streamer-page .streamer-live-caption {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 16px;
    }
    .paskus-streamer-page .streamer-live-caption h2 {
      margin: 0 0 8px;
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 22px;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-live-caption p,
    .paskus-streamer-page .streamer-section-header p {
      color: rgba(232, 240, 226, 0.74);
      font-size: 14px;
      line-height: 1.62;
      margin: 0;
    }
    .paskus-streamer-page .streamer-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 14px;
    }
    .paskus-streamer-page .streamer-metrics div {
      border-left: 1px solid rgba(157, 193, 131, 0.42);
      padding-left: 12px;
    }
    .paskus-streamer-page .streamer-metrics strong {
      display: block;
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 20px;
      line-height: 1;
    }
    .paskus-streamer-page .streamer-metrics span {
      display: block;
      color: rgba(232, 240, 226, 0.6);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.12em;
      margin-top: 7px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-section {
      position: relative;
      isolation: isolate;
      width: min(1180px, calc(100% - 44px));
      margin: 0 auto;
      padding: 72px 0;
    }
    .paskus-streamer-page .streamer-section-header {
      display: grid;
      gap: 12px;
      margin-bottom: 28px;
      max-width: 760px;
    }
    .paskus-streamer-page .streamer-section-header.center {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .paskus-streamer-page .streamer-section-header.with-action {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      max-width: none;
    }
    .paskus-streamer-page .streamer-section-header.with-action .streamer-header-copy {
      display: grid;
      gap: 12px;
      max-width: 760px;
    }
    .paskus-streamer-page #streamer-documentation-showcase {
      padding-top: 54px;
      padding-bottom: 60px;
    }
    .paskus-streamer-page #streamer-documentation-showcase .streamer-section-header {
      margin-bottom: 12px;
    }
    .paskus-streamer-page .streamer-see-more {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      border: 1px solid rgba(239, 191, 4, 0.36);
      border-radius: 999px;
      background: rgba(239, 191, 4, 0.1);
      color: #fff4c6;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.12em;
      padding: 0 18px;
      text-decoration: none;
      text-transform: uppercase;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }
    .paskus-streamer-page .streamer-see-more:hover,
    .paskus-streamer-page .streamer-see-more:focus-visible {
      border-color: rgba(239, 191, 4, 0.68);
      background: rgba(239, 191, 4, 0.18);
      transform: translateY(-2px);
    }
    .paskus-streamer-page .streamer-section h2 {
      margin: 0;
      color: #f6f7f0;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 38px;
      line-height: 1.08;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .paskus-streamer-page .streamer-grid.two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .paskus-streamer-page .streamer-card,
    .paskus-streamer-page .streamer-event,
    .paskus-streamer-page .streamer-creator,
    .paskus-streamer-page .streamer-facility {
      min-height: 210px;
      padding: 22px;
    }
    .paskus-streamer-page .streamer-card .streamer-card-top,
    .paskus-streamer-page .streamer-creator-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }
    .paskus-streamer-page .streamer-tag,
    .paskus-streamer-page .streamer-pill {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      border: 1px solid rgba(157, 193, 131, 0.28);
      border-radius: 999px;
      background: rgba(157, 193, 131, 0.08);
      color: #dff6d8;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.12em;
      padding: 0 10px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-card h3,
    .paskus-streamer-page .streamer-event h3,
    .paskus-streamer-page .streamer-creator h3,
    .paskus-streamer-page .streamer-facility h3 {
      margin: 0 0 12px;
      color: #f7f5e7;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 16px;
      line-height: 1.25;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-card p,
    .paskus-streamer-page .streamer-event p,
    .paskus-streamer-page .streamer-creator p,
    .paskus-streamer-page .streamer-facility p {
      color: rgba(232, 240, 226, 0.74);
      font-size: 13px;
      line-height: 1.66;
      margin: 0;
    }
    .paskus-streamer-page .streamer-event {
      display: grid;
      grid-template-columns: 78px 1fr;
      gap: 18px;
      align-items: start;
      min-height: auto;
    }
    .paskus-streamer-page .streamer-date {
      display: grid;
      place-items: center;
      min-height: 78px;
      border: 1px solid rgba(239, 191, 4, 0.22);
      border-radius: 14px;
      background: rgba(239, 191, 4, 0.08);
      text-align: center;
    }
    .paskus-streamer-page .streamer-date strong {
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 22px;
      line-height: 1;
    }
    .paskus-streamer-page .streamer-date span {
      display: block;
      color: rgba(232, 240, 226, 0.62);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.12em;
      margin-top: 6px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-creator {
      display: grid;
      grid-template-rows: clamp(168px, 21vw, 238px) 1fr;
      min-height: auto;
      overflow: hidden;
      padding: 0;
    }
    .paskus-streamer-page .streamer-creator-cover {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 14px;
      min-height: 168px;
      overflow: hidden;
      padding: 18px;
      isolation: isolate;
    }
    .paskus-streamer-page .streamer-creator-cover::before,
    .paskus-streamer-page .streamer-creator-cover::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .paskus-streamer-page .streamer-creator-cover::before {
      z-index: 1;
      background:
        radial-gradient(circle at 50% 16%, rgba(239, 191, 4, 0.18), transparent 44%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.78));
    }
    .paskus-streamer-page .streamer-creator-cover::after {
      z-index: 2;
      border-bottom: 1px solid rgba(239, 191, 4, 0.16);
      box-shadow: inset 0 -34px 70px rgba(0, 0, 0, 0.42);
    }
    .paskus-streamer-page .streamer-creator-cover-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: var(--streamer-cover, none) center / cover no-repeat;
      object-fit: cover;
      opacity: 0.5;
      filter: saturate(0.9) contrast(1.08);
      transform: scale(1.04);
    }
    .paskus-streamer-page .streamer-avatar {
      position: relative;
      z-index: 3;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 74px;
      height: 74px;
      overflow: hidden;
      border-radius: 18px;
      border: 1px solid rgba(239, 191, 4, 0.3);
      background:
        linear-gradient(145deg, rgba(239, 191, 4, 0.18), rgba(157, 193, 131, 0.11)),
        rgba(255, 255, 255, 0.04);
      color: #fff8dc;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 15px;
      font-weight: 900;
      box-shadow:
        0 22px 44px rgba(0, 0, 0, 0.42),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    .paskus-streamer-page .streamer-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .paskus-streamer-page .streamer-avatar-photo {
      background: var(--streamer-avatar, none) center / cover no-repeat;
    }
    .paskus-streamer-page .streamer-avatar-photo span {
      opacity: 0;
    }
    .paskus-streamer-page .streamer-creator-cover .streamer-tag {
      position: relative;
      z-index: 3;
      background: rgba(6, 9, 8, 0.58);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .paskus-streamer-page .streamer-creator-body {
      display: grid;
      align-content: start;
      gap: 12px;
      padding: 18px;
    }
    .paskus-streamer-page .streamer-creator-body h3 {
      margin-bottom: 0;
      font-size: 18px;
    }
    .paskus-streamer-page .streamer-creator-schedule {
      color: rgba(239, 191, 4, 0.76) !important;
      font-size: 11px !important;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-creator ul {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .paskus-streamer-page .streamer-creator-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 2px;
    }
    .paskus-streamer-page .streamer-creator-social {
      display: inline-grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border: 1px solid rgba(239, 191, 4, 0.24);
      border-radius: 13px;
      background: rgba(255, 255, 255, 0.055);
      color: #fff4c6;
      text-decoration: none;
      box-shadow:
        0 16px 34px rgba(0, 0, 0, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }
    .paskus-streamer-page .streamer-creator-social:hover,
    .paskus-streamer-page .streamer-creator-social:focus-visible {
      border-color: rgba(239, 191, 4, 0.52);
      background: rgba(239, 191, 4, 0.13);
      transform: translateY(-2px);
    }
    .paskus-streamer-page .streamer-creator-social svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    .paskus-streamer-page .streamer-facility-list {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
    .paskus-streamer-page .streamer-facility {
      min-height: 190px;
    }
    .paskus-streamer-page .streamer-hero.streamer-hero-showcase {
      min-height: auto;
      padding: 116px 22px 42px;
    }
    .paskus-streamer-page .streamer-hero-stage {
      width: min(1220px, 100%);
      display: grid;
      gap: 18px;
    }
    .paskus-streamer-page .streamer-highlight-shell {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
      background: transparent;
      box-shadow: 0 34px 90px rgba(0, 0, 0, 0.42);
    }
    .paskus-streamer-page .streamer-highlight-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 18px 20px 14px;
    }
    .paskus-streamer-page .streamer-highlight-title {
      display: grid;
      gap: 5px;
    }
    .paskus-streamer-page .streamer-highlight-title strong {
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(22px, 3.2vw, 42px);
      letter-spacing: 0;
      line-height: 1;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-highlight-title span {
      color: rgba(232,240,226,0.62);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-video-frame {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #020403;
      border-radius: 20px;
      box-shadow:
        0 30px 90px rgba(0, 0, 0, 0.54),
        inset 0 0 0 1px rgba(255, 255, 255, 0.08);
      cursor: pointer;
    }
    .paskus-streamer-page .streamer-video-frame video,
    .paskus-streamer-page .streamer-video-frame img,
    .paskus-streamer-page .streamer-content-thumb video,
    .paskus-streamer-page .streamer-content-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .paskus-streamer-page .streamer-content-thumb::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.48));
    }
    .paskus-streamer-page .streamer-center-play {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 5;
      display: inline-grid;
      place-items: center;
      width: clamp(70px, 9vw, 106px);
      height: clamp(70px, 9vw, 106px);
      overflow: hidden;
      isolation: isolate;
      border: 1px solid rgba(239, 191, 4, 0.34);
      border-radius: 50%;
      background: rgba(9, 12, 10, 0.38);
      color: #fff8dc;
      transform: translate(-50%, -50%);
      box-shadow:
        0 24px 76px rgba(0, 0, 0, 0.52),
        0 0 54px rgba(239, 191, 4, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -18px 34px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(22px) saturate(145%);
      -webkit-backdrop-filter: blur(22px) saturate(145%);
      transition:
        opacity 240ms ease,
        border-color 240ms ease,
        background 240ms ease,
        box-shadow 240ms ease,
        transform 260ms cubic-bezier(.2, .8, .2, 1);
      will-change: transform, opacity;
    }
    .paskus-streamer-page .streamer-center-play::before,
    .paskus-streamer-page .streamer-center-play::after {
      content: "";
      position: absolute;
      border-radius: inherit;
      pointer-events: none;
      transition: opacity 240ms ease, transform 260ms cubic-bezier(.2, .8, .2, 1);
    }
    .paskus-streamer-page .streamer-center-play::before {
      inset: 0;
      z-index: -1;
      background:
        radial-gradient(circle at 32% 22%, rgba(255, 255, 255, 0.38), transparent 34%),
        radial-gradient(circle at 72% 78%, rgba(239, 191, 4, 0.2), transparent 42%),
        linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.03));
      opacity: 0.82;
    }
    .paskus-streamer-page .streamer-center-play::after {
      inset: 12px;
      border: 1px solid rgba(255, 248, 220, 0.18);
      box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.05);
      opacity: 0.68;
    }
    .paskus-streamer-page .streamer-video-frame:hover .streamer-center-play {
      border-color: rgba(239, 191, 4, 0.5);
      background: rgba(10, 12, 10, 0.46);
      transform: translate(-50%, -50%) scale(1.045);
      box-shadow:
        0 28px 86px rgba(0, 0, 0, 0.56),
        0 0 70px rgba(239, 191, 4, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.24),
        inset 0 -18px 34px rgba(0, 0, 0, 0.22);
    }
    .paskus-streamer-page .streamer-center-play svg {
      position: relative;
      z-index: 2;
      width: 38%;
      height: 38%;
      margin-left: 5%;
      fill: currentColor;
      filter:
        drop-shadow(0 5px 14px rgba(0, 0, 0, 0.46))
        drop-shadow(0 0 18px rgba(239, 191, 4, 0.16));
    }
    .paskus-streamer-page .streamer-video-frame.is-playing .streamer-center-play {
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0.88);
    }
    .paskus-streamer-page .streamer-watch-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      padding: 14px 18px 18px;
    }
    .paskus-streamer-page .streamer-watch-row div {
      border-left: 1px solid rgba(157,193,131,0.4);
      padding-left: 12px;
    }
    .paskus-streamer-page .streamer-watch-row strong {
      display: block;
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 18px;
      line-height: 1;
    }
    .paskus-streamer-page .streamer-watch-row span {
      display: block;
      color: rgba(232,240,226,0.62);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.12em;
      margin-top: 7px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-social-track {
      display: grid;
      gap: 18px;
    }
    .paskus-streamer-page .streamer-social-primary {
      display: grid;
      justify-items: center;
      gap: 12px;
      width: min(390px, 100%);
      margin: 0 auto 4px;
      padding: 28px 22px;
      border: 1px solid rgba(239, 191, 4, 0.18);
      border-radius: 20px;
      background:
        radial-gradient(circle at 50% 0%, rgba(239, 191, 4, 0.16), transparent 48%),
        rgba(8, 12, 10, 0.66);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      color: #f4f7ef;
      text-align: center;
      text-decoration: none;
      backdrop-filter: blur(16px) saturate(125%);
      -webkit-backdrop-filter: blur(16px) saturate(125%);
    }
    .paskus-streamer-page .streamer-social-primary img {
      width: 88px;
      height: 88px;
      object-fit: contain;
      filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.46));
    }
    .paskus-streamer-page .streamer-social-primary strong {
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 18px;
      line-height: 1.15;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-social-primary span,
    .paskus-streamer-page .streamer-social-primary small {
      color: rgba(232, 240, 226, 0.72);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-social-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .paskus-streamer-page .streamer-social-card,
    .paskus-streamer-page .streamer-content-card {
      border: 1px solid rgba(239, 191, 4, 0.18);
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(255,255,255,0.08), transparent 38%, rgba(157,193,131,0.08)),
        rgba(8,12,10,0.68);
      box-shadow: 0 22px 60px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.08);
      overflow: hidden;
      text-decoration: none;
    }
    .paskus-streamer-page .streamer-social-card {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 16px;
      min-height: 128px;
      padding: 20px;
      color: #f4f7ef;
    }
    .paskus-streamer-page .streamer-social-icon {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 1px solid rgba(239,191,4,0.34);
      background: rgba(239,191,4,0.12);
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-weight: 900;
    }
    .paskus-streamer-page .streamer-social-icon svg {
      width: 23px;
      height: 23px;
      fill: currentColor;
    }
    .paskus-streamer-page .streamer-social-card.roblox .streamer-social-icon {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.22);
      color: #f5f7f3;
    }
    .paskus-streamer-page .streamer-social-card.tiktok .streamer-social-icon {
      background: rgba(255, 48, 86, 0.14);
      border-color: rgba(37, 244, 238, 0.32);
      color: #fff;
    }
    .paskus-streamer-page .streamer-social-copy {
      display: grid;
      gap: 8px;
      min-width: 0;
    }
    .paskus-streamer-page .streamer-social-card strong {
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 16px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-social-card span,
    .paskus-streamer-page .streamer-social-card small {
      color: rgba(232,240,226,0.7);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-calendar {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 1px;
      overflow: hidden;
      border: 1px solid rgba(239,191,4,0.18);
      border-radius: 18px;
      background: rgba(239,191,4,0.18);
      box-shadow: 0 24px 70px rgba(0,0,0,0.36);
    }
    .paskus-streamer-page .streamer-calendar-head,
    .paskus-streamer-page .streamer-calendar-day {
      min-height: 92px;
      background: rgba(7,11,9,0.88);
      padding: 12px;
    }
    .paskus-streamer-page .streamer-calendar-head {
      min-height: 42px;
      color: rgba(232,240,226,0.66);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-calendar-day strong {
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 18px;
    }
    .paskus-streamer-page .streamer-calendar-day span {
      display: inline-flex;
      margin-top: 10px;
      max-width: 100%;
      border-radius: 999px;
      background: rgba(157,193,131,0.14);
      color: #ecffe4;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.08em;
      padding: 7px 9px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-content-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }
    .paskus-streamer-page .streamer-showcase-rail {
      display: flex;
      gap: 18px;
      margin-inline: calc((100vw - min(1180px, calc(100vw - 44px))) / -2);
      overflow-x: auto;
      padding: 2px max(22px, calc((100vw - 1180px) / 2)) 18px;
      scroll-padding-inline: max(22px, calc((100vw - 1180px) / 2));
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
      scrollbar-color: rgba(239, 191, 4, 0.45) rgba(255, 255, 255, 0.06);
    }
    .paskus-streamer-page .streamer-showcase-rail::-webkit-scrollbar {
      height: 9px;
    }
    .paskus-streamer-page .streamer-showcase-rail::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.06);
      border-radius: 999px;
    }
    .paskus-streamer-page .streamer-showcase-rail::-webkit-scrollbar-thumb {
      background: rgba(239, 191, 4, 0.42);
      border-radius: 999px;
    }
    .paskus-streamer-page .streamer-showcase-card {
      position: relative;
      flex: 0 0 min(470px, 78vw);
      min-height: 430px;
      overflow: hidden;
      border: 1px solid rgba(239, 191, 4, 0.22);
      border-radius: 22px;
      background:
        radial-gradient(circle at 50% 0%, rgba(239, 191, 4, 0.16), transparent 44%),
        rgba(7, 11, 9, 0.76);
      box-shadow:
        0 32px 88px rgba(0, 0, 0, 0.48),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      scroll-snap-align: start;
      text-decoration: none;
    }
    .paskus-streamer-page .streamer-showcase-card:first-child {
      flex-basis: min(640px, 88vw);
    }
    .paskus-streamer-page .streamer-showcase-media {
      position: absolute;
      inset: 0;
      overflow: hidden;
      background: #020403;
    }
    .paskus-streamer-page .streamer-showcase-media::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.34) 48%, rgba(0, 0, 0, 0.76)),
        linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.82));
      pointer-events: none;
    }
    .paskus-streamer-page .streamer-showcase-media video,
    .paskus-streamer-page .streamer-showcase-media img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 0.76;
      filter: saturate(1.08) contrast(1.05);
      transform: scale(1.02);
      transition: opacity 220ms ease, transform 260ms ease;
    }
    .paskus-streamer-page .streamer-showcase-media video {
      opacity: 0;
    }
    .paskus-streamer-page .streamer-showcase-card:hover .streamer-showcase-media video,
    .paskus-streamer-page .streamer-showcase-card:focus-within .streamer-showcase-media video {
      opacity: 0.76;
    }
    .paskus-streamer-page .streamer-showcase-copy {
      position: relative;
      z-index: 2;
      display: grid;
      align-content: end;
      min-height: 430px;
      gap: 12px;
      padding: 26px;
    }
    .paskus-streamer-page .streamer-showcase-index {
      color: rgba(255, 255, 255, 0.9);
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(42px, 6vw, 72px);
      font-weight: 900;
      line-height: 0.86;
      text-shadow: 0 16px 50px rgba(0, 0, 0, 0.5);
    }
    .paskus-streamer-page .streamer-showcase-copy h3 {
      max-width: 440px;
      margin: 0;
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(18px, 2.1vw, 28px);
      line-height: 1.08;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-showcase-copy p {
      max-width: 440px;
      color: rgba(232, 240, 226, 0.76);
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }
    .paskus-streamer-page .streamer-showcase-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .paskus-streamer-page .streamer-showcase-meta span {
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.42);
      color: #fff4c6;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.11em;
      padding: 7px 10px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-content-thumb {
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background: #030504;
    }
    .paskus-streamer-page .streamer-play-pill {
      position: absolute;
      left: 12px;
      top: 12px;
      z-index: 2;
      border-radius: 999px;
      background: rgba(0,0,0,0.66);
      color: #fff4c6;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.12em;
      padding: 7px 10px;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-content-body {
      display: grid;
      gap: 12px;
      padding: 14px;
    }
    .paskus-streamer-page .streamer-uploader {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .paskus-streamer-page .streamer-uploader-avatar {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid rgba(239,191,4,0.28);
      background: rgba(239,191,4,0.12);
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 11px;
      font-weight: 900;
    }
    .paskus-streamer-page .streamer-content-body h3 {
      margin: 0;
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 1.25;
      text-transform: uppercase;
    }
    .paskus-streamer-page .streamer-content-body p {
      color: rgba(232,240,226,0.62);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      margin: 0;
      text-transform: uppercase;
    }
    @media (max-width: 980px) {
      .paskus-streamer-page .streamer-nav-links {
        display: none;
      }
      .paskus-streamer-page .streamer-hero {
        min-height: auto;
      }
      .paskus-streamer-page .streamer-hero-inner,
      .paskus-streamer-page .streamer-grid,
      .paskus-streamer-page .streamer-grid.two,
      .paskus-streamer-page .streamer-facility-list {
        grid-template-columns: 1fr;
      }
      .paskus-streamer-page .streamer-content-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .paskus-streamer-page .streamer-section-header.with-action {
        grid-template-columns: 1fr;
        align-items: start;
      }
      .paskus-streamer-page h1 {
        font-size: 48px;
      }
      .paskus-streamer-page .streamer-section h2 {
        font-size: 32px;
      }
    }
    @media (max-width: 720px) {
      .paskus-streamer-page .streamer-nav {
        padding: 12px 14px;
      }
      .paskus-streamer-page .streamer-brand img {
        width: 34px;
        height: 34px;
      }
      .paskus-streamer-page .streamer-brand strong {
        font-size: 15px;
      }
      .paskus-streamer-page .streamer-hero {
        padding: 96px 14px 46px;
      }
      .paskus-streamer-page .streamer-hero-inner,
      .paskus-streamer-page .streamer-section {
        width: min(100%, calc(100vw - 28px));
      }
      .paskus-streamer-page h1 {
        font-size: 36px;
        line-height: 1;
        overflow-wrap: anywhere;
      }
      .paskus-streamer-page h1 span {
        font-size: 15px;
      }
      .paskus-streamer-page .streamer-lead {
        font-size: 12.5px;
        line-height: 1.58;
      }
      .paskus-streamer-page .streamer-actions {
        display: grid;
        grid-template-columns: 1fr;
      }
      .paskus-streamer-page .streamer-actions a {
        width: 100%;
        min-height: 40px;
      }
      .paskus-streamer-page .streamer-live-panel,
      .paskus-streamer-page .streamer-card,
      .paskus-streamer-page .streamer-event,
      .paskus-streamer-page .streamer-creator,
      .paskus-streamer-page .streamer-facility {
        border-radius: 13px;
        padding: 13px;
        min-height: auto;
      }
      .paskus-streamer-page .streamer-creator {
        grid-template-rows: 155px 1fr;
        padding: 0;
      }
      .paskus-streamer-page .streamer-creator-cover {
        min-height: 155px;
        padding: 14px;
      }
      .paskus-streamer-page .streamer-avatar {
        width: 62px;
        height: 62px;
        border-radius: 15px;
      }
      .paskus-streamer-page .streamer-creator-body {
        gap: 10px;
        padding: 14px;
      }
      .paskus-streamer-page .streamer-live-preview {
        aspect-ratio: 4 / 3;
        border-radius: 12px;
      }
      .paskus-streamer-page .streamer-live-caption h2 {
        font-size: 16px;
      }
      .paskus-streamer-page .streamer-live-caption p,
      .paskus-streamer-page .streamer-section-header p,
      .paskus-streamer-page .streamer-card p,
      .paskus-streamer-page .streamer-event p,
      .paskus-streamer-page .streamer-creator p,
      .paskus-streamer-page .streamer-facility p {
        font-size: 10.5px;
        line-height: 1.5;
      }
      .paskus-streamer-page .streamer-section {
        padding: 48px 0;
      }
      .paskus-streamer-page .streamer-section h2 {
        font-size: 24px;
      }
      .paskus-streamer-page .streamer-card h3,
      .paskus-streamer-page .streamer-event h3,
      .paskus-streamer-page .streamer-creator h3,
      .paskus-streamer-page .streamer-facility h3 {
        font-size: 11px;
      }
      .paskus-streamer-page .streamer-event {
        grid-template-columns: 56px 1fr;
        gap: 12px;
      }
      .paskus-streamer-page .streamer-date {
        min-height: 56px;
      }
      .paskus-streamer-page .streamer-date strong,
      .paskus-streamer-page .streamer-metrics strong {
        font-size: 16px;
      }
      .paskus-streamer-page .streamer-metrics {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .paskus-streamer-page .streamer-watch-row,
      .paskus-streamer-page .streamer-social-grid,
      .paskus-streamer-page .streamer-content-grid {
        grid-template-columns: 1fr;
      }
      .paskus-streamer-page .streamer-showcase-rail {
        gap: 12px;
        margin-inline: -14px;
        padding: 2px 14px 16px;
        scroll-padding-inline: 14px;
      }
      .paskus-streamer-page .streamer-showcase-card,
      .paskus-streamer-page .streamer-showcase-card:first-child {
        flex-basis: min(330px, 86vw);
        min-height: 360px;
        border-radius: 16px;
      }
      .paskus-streamer-page .streamer-showcase-copy {
        min-height: 360px;
        padding: 18px;
      }
      .paskus-streamer-page .streamer-showcase-index {
        font-size: 38px;
      }
      .paskus-streamer-page .streamer-showcase-copy h3 {
        font-size: 16px;
      }
      .paskus-streamer-page .streamer-showcase-copy p {
        font-size: 10.5px;
        line-height: 1.48;
      }
      .paskus-streamer-page .streamer-calendar {
        grid-template-columns: 1fr;
      }
      .paskus-streamer-page .streamer-calendar-head {
        display: none;
      }
      .paskus-streamer-page .streamer-calendar-day {
        min-height: auto;
      }
      .paskus-streamer-page .streamer-tag,
      .paskus-streamer-page .streamer-pill,
      .paskus-streamer-page .streamer-date span,
      .paskus-streamer-page .streamer-metrics span {
        font-size: 8px;
        letter-spacing: 0.06em;
      }
    }
    @media (max-width: 430px) {
      .paskus-streamer-page .streamer-hero {
        padding: 88px 10px 38px;
      }
      .paskus-streamer-page .streamer-hero-inner,
      .paskus-streamer-page .streamer-section {
        width: min(100%, calc(100vw - 20px));
      }
      .paskus-streamer-page h1 {
        font-size: 31px;
      }
      .paskus-streamer-page .streamer-section {
        padding: 38px 0;
      }
      .paskus-streamer-page .streamer-live-panel,
      .paskus-streamer-page .streamer-card,
      .paskus-streamer-page .streamer-event,
      .paskus-streamer-page .streamer-creator,
      .paskus-streamer-page .streamer-facility {
        padding: 11px;
      }
      .paskus-streamer-page .streamer-creator {
        padding: 0;
      }
      .paskus-streamer-page .streamer-creator-body {
        padding: 12px;
      }
      .paskus-streamer-page .streamer-video-frame {
        border-radius: 14px;
      }
      .paskus-streamer-page .streamer-social-primary {
        padding: 22px 16px;
      }
      .paskus-streamer-page .streamer-social-primary img {
        width: 72px;
        height: 72px;
      }
      .paskus-streamer-page .streamer-social-card {
        min-height: 112px;
        padding: 16px;
      }
    }
    .paskus-streamer-page .streamer-showcase-rail {
      --showcase-card-w: clamp(162px, 17vw, 272px);
      --showcase-card-h: clamp(252px, 26vw, 356px);
      position: relative;
      display: block;
      min-height: calc(var(--showcase-card-h) + clamp(70px, 6vw, 92px));
      margin-inline: 0;
      overflow: hidden;
      padding: clamp(34px, 4.2vw, 54px) clamp(10px, 2vw, 28px);
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      perspective: 1500px;
      perspective-origin: center 42%;
      scroll-snap-type: none;
      scrollbar-width: none;
      isolation: isolate;
      touch-action: pan-y;
    }
    .paskus-streamer-page .streamer-showcase-rail::-webkit-scrollbar {
      display: none;
    }
    .paskus-streamer-page .streamer-showcase-rail::before {
      content: "";
      position: absolute;
      inset: 7% 4% 12%;
      z-index: -1;
      border-radius: 999px;
      background:
        linear-gradient(90deg, rgba(164, 241, 255, 0.13), rgba(239, 191, 4, 0.11), rgba(0, 0, 0, 0.04)),
        radial-gradient(circle at 48% 42%, rgba(255, 255, 255, 0.16), transparent 34%);
      filter: blur(48px);
      opacity: 0.46;
      transform: translateY(8px);
    }
    .paskus-streamer-page .streamer-showcase-rail::after {
      content: "";
      position: absolute;
      inset: 0 -2px;
      z-index: 80;
      pointer-events: none;
      background:
        linear-gradient(90deg,
          rgba(2, 5, 4, 0.98) 0%,
          rgba(2, 5, 4, 0.88) 6%,
          rgba(2, 5, 4, 0.48) 14%,
          rgba(2, 5, 4, 0.04) 27%,
          rgba(2, 5, 4, 0.04) 73%,
          rgba(2, 5, 4, 0.48) 86%,
          rgba(2, 5, 4, 0.9) 94%,
          rgba(2, 5, 4, 0.98) 100%);
    }
    .paskus-streamer-page .streamer-showcase-card,
    .paskus-streamer-page .streamer-showcase-card:first-child {
      position: absolute;
      top: 50%;
      left: 50%;
      width: var(--showcase-card-w);
      height: var(--showcase-card-h);
      min-height: 0;
      flex: none;
      overflow: visible;
      border: 0;
      border-radius: 24px;
      background: transparent;
      box-shadow: none;
      scroll-snap-align: none;
      transform:
        translateX(calc(-50% + var(--cover-x, 0px)))
        translateY(-50%)
        rotate(var(--cover-rotate, 0deg))
        scale(var(--cover-scale, 1));
      opacity: var(--cover-opacity, 1);
      filter: blur(var(--cover-blur, 0px)) saturate(var(--cover-saturate, 1));
      backface-visibility: hidden;
      transform-origin: center center;
      transform-style: preserve-3d;
      transition:
        transform 880ms cubic-bezier(0.16, 1, 0.22, 1),
        opacity 620ms ease,
        filter 620ms ease;
      cursor: pointer;
      text-decoration: none;
      will-change: transform, opacity, filter;
    }
    .paskus-streamer-page .streamer-showcase-card.is-active {
      filter: blur(0) saturate(1.12);
    }
    .paskus-streamer-page .streamer-showcase-card:focus-visible {
      outline: 2px solid rgba(239, 191, 4, 0.9);
      outline-offset: 10px;
    }
    .paskus-streamer-page .streamer-showcase-media {
      position: absolute;
      inset: 0;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: inherit;
      background: #020403;
      box-shadow:
        0 32px 90px rgba(0, 0, 0, 0.62),
        0 0 0 1px rgba(239, 191, 4, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
      transform: translateZ(0);
    }
    .paskus-streamer-page .streamer-showcase-card.is-active .streamer-showcase-media {
      box-shadow:
        0 44px 120px rgba(0, 0, 0, 0.74),
        0 0 42px rgba(151, 224, 231, 0.18),
        0 0 0 1px rgba(239, 191, 4, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);
    }
    .paskus-streamer-page .streamer-showcase-media::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.12) 38%, rgba(0, 0, 0, 0.82)),
        linear-gradient(90deg, rgba(0, 0, 0, 0.32), transparent 42%, rgba(0, 0, 0, 0.34));
      pointer-events: none;
    }
    .paskus-streamer-page .streamer-showcase-media video,
    .paskus-streamer-page .streamer-showcase-media img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 0.88;
      filter: saturate(1.1) contrast(1.08);
      transform: scale(1.04);
      transition: opacity 240ms ease, transform 360ms ease;
    }
    .paskus-streamer-page .streamer-showcase-media video {
      opacity: 0;
    }
    .paskus-streamer-page .streamer-showcase-card.is-active:hover .streamer-showcase-media video,
    .paskus-streamer-page .streamer-showcase-card.is-active:focus-within .streamer-showcase-media video {
      opacity: 0.9;
    }
    .paskus-streamer-page .streamer-showcase-card.is-active:hover .streamer-showcase-media img,
    .paskus-streamer-page .streamer-showcase-card.is-active:focus-within .streamer-showcase-media img {
      transform: scale(1.08);
    }
    .paskus-streamer-page .streamer-showcase-copy {
      position: absolute;
      left: 13px;
      right: 13px;
      bottom: 13px;
      z-index: 2;
      display: grid;
      align-content: end;
      min-height: 0;
      gap: 7px;
      padding: 0;
      pointer-events: none;
      text-shadow: 0 14px 34px rgba(0, 0, 0, 0.82);
    }
    .paskus-streamer-page .streamer-showcase-index {
      position: absolute;
      left: 0;
      top: -42px;
      color: rgba(255, 255, 255, 0.52);
      font-size: clamp(30px, 4vw, 48px);
      line-height: 0.9;
    }
    .paskus-streamer-page .streamer-showcase-copy h3 {
      max-width: 100%;
      color: #fff;
      font-size: clamp(14px, 1.45vw, 19px);
      line-height: 1.08;
      text-wrap: balance;
    }
    .paskus-streamer-page .streamer-showcase-copy p {
      max-width: 100%;
      color: rgba(232, 240, 226, 0.76);
      font-size: 9px;
      line-height: 1.45;
    }
    .paskus-streamer-page .streamer-showcase-meta {
      gap: 6px;
    }
    .paskus-streamer-page .streamer-showcase-meta span {
      background: rgba(2, 5, 4, 0.56);
      border-color: rgba(239, 191, 4, 0.2);
      font-size: 7.5px;
      padding: 5px 7px;
      backdrop-filter: blur(10px);
    }
    .paskus-streamer-page .streamer-showcase-control {
      display: none;
    }
    .paskus-streamer-page .streamer-showcase-control button {
      border: 0;
      color: rgba(255, 255, 255, 0.86);
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-weight: 900;
      cursor: pointer;
    }
    .paskus-streamer-page .streamer-showcase-nav,
    .paskus-streamer-page .streamer-showcase-main {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(12px);
      transition: transform 180ms ease, background 180ms ease, color 180ms ease;
    }
    .paskus-streamer-page .streamer-showcase-main {
      width: 42px;
      height: 42px;
      color: #07100c;
      background: rgba(239, 191, 4, 0.86);
      box-shadow: 0 12px 34px rgba(239, 191, 4, 0.18);
    }
    .paskus-streamer-page .streamer-showcase-nav:hover,
    .paskus-streamer-page .streamer-showcase-main:hover {
      transform: translateY(-2px);
      color: #fff;
      background: rgba(239, 191, 4, 0.58);
    }
    .paskus-streamer-page .streamer-showcase-dots {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      overflow: hidden;
    }
    .paskus-streamer-page .streamer-showcase-dot {
      width: 9px;
      height: 9px;
      padding: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.24);
      opacity: 0.72;
      transition: width 220ms ease, background 220ms ease, opacity 220ms ease;
    }
    .paskus-streamer-page .streamer-showcase-dot.is-active {
      width: 34px;
      background: linear-gradient(90deg, #efbf04, rgba(151, 224, 231, 0.8));
      opacity: 1;
    }
    @media (max-width: 720px) {
      .paskus-streamer-page #streamer-documentation-showcase {
        padding-top: 38px;
        padding-bottom: 44px;
      }
      .paskus-streamer-page .streamer-showcase-rail {
        --showcase-card-w: clamp(122px, 43vw, 184px);
        --showcase-card-h: clamp(198px, 64vw, 268px);
        min-height: calc(var(--showcase-card-h) + 62px);
        margin-inline: 0;
        padding: 30px 0 32px;
        border-radius: 0;
      }
      .paskus-streamer-page .streamer-showcase-card,
      .paskus-streamer-page .streamer-showcase-card:first-child {
        top: 50%;
        width: var(--showcase-card-w);
        height: var(--showcase-card-h);
        min-height: 0;
        border-radius: 18px;
      }
      .paskus-streamer-page .streamer-showcase-index {
        top: -30px;
        font-size: 28px;
      }
      .paskus-streamer-page .streamer-showcase-copy {
        left: 10px;
        right: 10px;
        bottom: 10px;
        gap: 5px;
      }
      .paskus-streamer-page .streamer-showcase-copy h3 {
        font-size: 12px;
      }
      .paskus-streamer-page .streamer-showcase-copy p {
        display: none;
      }
      .paskus-streamer-page .streamer-showcase-meta span {
        font-size: 6.8px;
        padding: 4px 6px;
      }
      .paskus-streamer-page .streamer-showcase-control {
        bottom: 31px;
        width: min(360px, calc(100% - 28px));
        gap: 8px;
      }
      .paskus-streamer-page .streamer-showcase-nav {
        width: 32px;
        height: 32px;
      }
      .paskus-streamer-page .streamer-showcase-main {
        width: 38px;
        height: 38px;
      }
      .paskus-streamer-page .streamer-showcase-dots {
        gap: 5px;
      }
      .paskus-streamer-page .streamer-showcase-dot {
        width: 7px;
        height: 7px;
      }
      .paskus-streamer-page .streamer-showcase-dot.is-active {
        width: 24px;
      }
    }
    .paskus-streamer-page .streamer-showcase-rail[data-streamer-showcase] .streamer-showcase-card {
      transform: var(--cover-transform, translateX(-50%) translateY(-50%)) !important;
      opacity: var(--cover-opacity, 1) !important;
      filter: blur(var(--cover-blur, 0px)) saturate(var(--cover-saturate, 1)) !important;
    }
    .paskus-streamer-page .streamer-showcase-rail[data-streamer-showcase] .streamer-showcase-card.is-active {
      filter: blur(0) saturate(1.12) !important;
    }
    .paskus-event-doc-page {
      min-height: 100vh;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 18% 12%, rgba(154, 9, 18, 0.42), transparent 36%),
        radial-gradient(circle at 88% 2%, rgba(239, 191, 4, 0.12), transparent 28%),
        linear-gradient(180deg, #090101, #030101 46%, #120101);
      color: #fff8f1;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .paskus-event-doc-page *,
    .paskus-event-doc-page *::before,
    .paskus-event-doc-page *::after {
      box-sizing: border-box;
    }
    .paskus-event-doc-page main {
      position: relative;
      isolation: isolate;
    }
    .paskus-event-doc-page main::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 0, 34, 0.05) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
      background-size: 96px 96px;
      mask-image: linear-gradient(180deg, transparent, #000 12%, #000 78%, transparent);
      opacity: 0.55;
    }
    .event-doc-hero {
      position: relative;
      min-height: 86vh;
      display: grid;
      align-items: end;
      overflow: hidden;
      padding: 132px max(24px, calc((100vw - 1180px) / 2)) 70px;
      isolation: isolate;
    }
    .event-doc-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -3;
      background-image: var(--event-doc-hero, url("/assets/paskus-streamer-highlight-download3-poster-v1.jpg"));
      background-position: center;
      background-size: cover;
      opacity: 0.56;
      filter: saturate(1.16) contrast(1.12);
      transform: scale(1.04);
    }
    .event-doc-hero::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -2;
      background:
        linear-gradient(90deg, rgba(6, 0, 0, 0.94), rgba(45, 0, 0, 0.55) 44%, rgba(5, 0, 0, 0.92)),
        linear-gradient(180deg, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.72) 62%, #090101);
    }
    .event-doc-hero__copy {
      width: min(560px, 100%);
      display: grid;
      gap: 14px;
    }
    .event-doc-back {
      width: fit-content;
      color: rgba(255, 244, 214, 0.72);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-decoration: none;
      text-transform: uppercase;
    }
    .event-doc-kicker,
    .event-doc-section-kicker {
      color: #ff374f;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      text-shadow: 0 0 24px rgba(255, 32, 56, 0.32);
    }
    .event-doc-hero h1 {
      margin: 0;
      max-width: 820px;
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(46px, 8vw, 104px);
      line-height: 0.91;
      letter-spacing: 0;
      text-transform: uppercase;
      text-shadow: 0 28px 70px rgba(0, 0, 0, 0.72);
    }
    .event-doc-hero p {
      max-width: 560px;
      margin: 0;
      color: rgba(255, 244, 232, 0.82);
      font-size: 15px;
      line-height: 1.68;
    }
    .event-doc-hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
    }
    .event-doc-play,
    .event-doc-outline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border: 1px solid rgba(255, 55, 79, 0.72);
      background: linear-gradient(135deg, rgba(255, 39, 57, 0.9), rgba(132, 0, 12, 0.9));
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.16em;
      padding: 0 20px;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 22px 58px rgba(130, 0, 13, 0.38);
      cursor: pointer;
    }
    .event-doc-outline {
      border-color: rgba(255, 244, 220, 0.24);
      background: rgba(255, 255, 255, 0.06);
      box-shadow: none;
    }
    .event-doc-chapters,
    .event-doc-more {
      width: min(1180px, calc(100% - 44px));
      margin: 0 auto;
      padding: 58px 0;
    }
    .event-doc-chapter {
      display: grid;
      grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.28fr);
      align-items: center;
      gap: clamp(22px, 5vw, 76px);
      padding: 38px 0;
      position: relative;
    }
    .event-doc-chapter::after {
      content: "";
      position: absolute;
      left: 18%;
      right: 18%;
      bottom: -1px;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255, 25, 46, 0.92), transparent);
      box-shadow: 0 0 26px rgba(255, 25, 46, 0.52);
    }
    .event-doc-chapter.is-reverse {
      grid-template-columns: minmax(0, 1.28fr) minmax(220px, 0.72fr);
    }
    .event-doc-chapter.is-reverse .event-doc-chapter__copy {
      order: 2;
    }
    .event-doc-chapter__copy {
      display: grid;
      gap: 12px;
    }
    .event-doc-chapter__label {
      color: rgba(255, 244, 232, 0.78);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.04em;
    }
    .event-doc-chapter__number {
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(56px, 8vw, 98px);
      font-weight: 950;
      line-height: 0.86;
    }
    .event-doc-chapter h2 {
      margin: 0;
      color: #fff8f1;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(24px, 3.6vw, 44px);
      line-height: 1.04;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .event-doc-chapter p {
      margin: 0;
      color: rgba(255, 244, 232, 0.74);
      font-size: 14px;
      line-height: 1.6;
    }
    .event-doc-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    .event-doc-tags span {
      border: 1px solid rgba(255, 244, 220, 0.18);
      background: rgba(255, 255, 255, 0.055);
      color: #ffd2d8;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 0.11em;
      padding: 7px 10px;
      text-transform: uppercase;
    }
    .event-doc-media-card {
      position: relative;
      aspect-ratio: 16 / 9;
      min-height: 260px;
      overflow: hidden;
      border: 1px solid rgba(255, 55, 79, 0.48);
      border-radius: 0;
      background: #050101;
      box-shadow:
        0 38px 90px rgba(0, 0, 0, 0.48),
        0 0 0 1px rgba(255, 255, 255, 0.04),
        0 0 48px rgba(255, 25, 46, 0.16);
      transform: perspective(900px) rotateY(-2deg);
    }
    .event-doc-chapter.is-reverse .event-doc-media-card {
      transform: perspective(900px) rotateY(2deg);
    }
    .event-doc-media-card::before {
      content: "";
      position: absolute;
      inset: -1px;
      z-index: 3;
      pointer-events: none;
      border: 1px solid rgba(255, 25, 46, 0.42);
      box-shadow: inset 0 0 38px rgba(255, 25, 46, 0.18);
    }
    .event-doc-media-card::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.34)),
        radial-gradient(circle at 50% 100%, rgba(255, 25, 46, 0.18), transparent 52%);
    }
    .event-doc-media-card img,
    .event-doc-media-card video,
    .event-doc-more-card img,
    .event-doc-more-card video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .event-doc-media-card video {
      opacity: 0.92;
    }
    .event-doc-media-play {
      position: absolute;
      left: 18px;
      bottom: 18px;
      z-index: 4;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 0.12em;
      padding: 9px 12px;
      text-transform: uppercase;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .event-doc-more__head {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 18px;
      margin-bottom: 22px;
    }
    .event-doc-more h2 {
      margin: 0;
      color: #fff;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(24px, 4vw, 46px);
      text-transform: uppercase;
    }
    .event-doc-more-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
    .event-doc-more-card {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      border: 1px solid rgba(255, 55, 79, 0.22);
      background: #050101;
      box-shadow: 0 22px 60px rgba(0, 0, 0, 0.36);
    }
    .event-doc-more-card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.76));
      pointer-events: none;
    }
    .event-doc-more-card span {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 10px;
      z-index: 2;
      color: #fff;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    @media (max-width: 900px) {
      .event-doc-hero {
        min-height: 76vh;
        padding-top: 112px;
      }
      .event-doc-chapter,
      .event-doc-chapter.is-reverse {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .event-doc-chapter.is-reverse .event-doc-chapter__copy {
        order: 0;
      }
      .event-doc-media-card,
      .event-doc-chapter.is-reverse .event-doc-media-card {
        min-height: auto;
        transform: none;
      }
      .event-doc-more-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 560px) {
      .event-doc-hero {
        min-height: 72vh;
        padding: 98px 18px 46px;
      }
      .event-doc-hero h1 {
        font-size: clamp(32px, 10vw, 40px);
        line-height: 0.96;
        overflow-wrap: anywhere;
      }
      .event-doc-hero p,
      .event-doc-chapter p {
        font-size: 12px;
        line-height: 1.55;
      }
      .event-doc-hero__actions {
        display: grid;
      }
      .event-doc-play,
      .event-doc-outline {
        width: 100%;
        min-height: 42px;
      }
      .event-doc-chapters,
      .event-doc-more {
        width: min(100%, calc(100vw - 28px));
        padding: 34px 0;
      }
      .event-doc-chapter {
        padding: 26px 0;
      }
      .event-doc-tags span {
        font-size: 8px;
        letter-spacing: 0.07em;
      }
      .event-doc-more__head {
        align-items: start;
        flex-direction: column;
      }
      .event-doc-more-grid {
        grid-template-columns: 1fr;
      }
    }
    #home.paskus-video-home {
      position: relative;
      isolation: isolate;
      background-color: #030504;
      overflow: hidden;
    }
    #home .paskus-landing-video-bg {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.78)),
        url("/assets/paskus-landing-download3-poster-v1.jpg") center / cover;
      opacity: 0.62;
    }
    #home .paskus-landing-video-bg::after,
    .paskus-video-intro::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 42%, transparent 0, rgba(0, 0, 0, 0.18) 42%, rgba(0, 0, 0, 0.74) 100%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.72));
    }
    #home .paskus-landing-video-bg video,
    .paskus-video-intro video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transform: scale(1.02);
      transition: opacity 320ms ease;
    }
    #home .paskus-landing-video-bg.is-ready video,
    .paskus-video-intro.is-ready video {
      opacity: 1;
    }
    #home.paskus-video-home > .video-bg {
      display: none !important;
    }
    #home.paskus-video-home > :not(.paskus-landing-video-bg):not(.video-bg) {
      position: relative;
      z-index: 3;
    }
    #home > .z-10 {
      width: min(100%, 1040px) !important;
      padding-left: 24px !important;
      padding-right: 24px !important;
      padding-bottom: clamp(18px, 4vh, 48px) !important;
    }
    #home h1 {
      max-width: 1180px !important;
      margin-left: auto !important;
      margin-right: auto !important;
      font-size: clamp(54px, 7.1vw, 116px) !important;
      line-height: 0.9 !important;
      letter-spacing: 0 !important;
      margin-bottom: clamp(10px, 1.2vw, 18px) !important;
      text-wrap: balance;
      text-transform: uppercase;
      color: #f2f1eb !important;
      text-shadow:
        0 0 1px rgba(255, 255, 255, 0.72),
        0 22px 52px rgba(0, 0, 0, 0.72),
        0 0 34px rgba(212, 175, 55, 0.1);
    }
    #home h1 + p {
      margin-bottom: 0 !important;
      max-width: min(760px, 90vw) !important;
      margin-left: auto !important;
      margin-right: auto !important;
      font-size: clamp(12px, 1.1vw, 16px) !important;
      line-height: 1.68 !important;
      letter-spacing: 0.08em !important;
      opacity: 0.84;
      color: rgba(239, 241, 231, 0.86) !important;
      text-transform: none !important;
    }
    #home h1 .paskus-hero-name {
      display: block;
      font: inherit;
    }
    #home h1 .paskus-hero-unit {
      display: block;
      margin-top: clamp(8px, 1vw, 16px);
      font-size: 0.38em;
      line-height: 1;
      color: #d4af37;
      letter-spacing: clamp(0.1em, 0.46vw, 0.32em);
      text-shadow: 0 0 22px rgba(212, 175, 55, 0.2), 0 20px 40px rgba(0, 0, 0, 0.66);
    }
    #home .paskus-hero-motto {
      width: min(780px, 92vw);
      margin: clamp(26px, 3.2vw, 44px) auto clamp(16px, 2vw, 24px);
      display: grid;
      place-items: center;
      gap: 8px;
      text-align: center;
      text-transform: uppercase;
      color: #d4af37;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      letter-spacing: clamp(0.24em, 0.65vw, 0.52em);
    }
    #home .paskus-hero-motto::before,
    #home .paskus-hero-motto::after {
      content: "";
      display: block;
      width: min(320px, 42vw);
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.72), transparent);
    }
    #home .paskus-hero-motto strong {
      display: block;
      font-size: clamp(13px, 1.4vw, 20px);
      line-height: 1.1;
      text-shadow: 0 0 18px rgba(212, 175, 55, 0.18);
    }
    #home .paskus-hero-motto span {
      display: block;
      max-width: 640px;
      color: rgba(241, 242, 230, 0.72);
      font-family: Inter, system-ui, sans-serif;
      font-size: clamp(10px, 0.78vw, 12px);
      font-weight: 700;
      line-height: 1.6;
      letter-spacing: 0.14em;
      text-transform: none;
    }
    #home .paskus-home-scroll {
      position: relative;
      z-index: 4;
      display: grid;
      width: max-content;
      max-width: min(190px, 72vw);
      place-items: center;
      gap: 8px;
      margin: clamp(18px, 2.4vw, 32px) auto 0;
      border: 0;
      background: transparent;
      color: rgba(247, 245, 231, 0.72);
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 9px;
      font-weight: 800;
      line-height: 1.35;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      cursor: pointer;
      text-align: center;
      transition: color 180ms ease, transform 180ms ease;
    }
    #home .paskus-home-scroll:hover {
      color: #d4af37;
      transform: translateY(2px);
    }
    #home .paskus-home-scroll__icon {
      position: relative;
      width: 30px;
      height: 46px;
      border: 1px solid rgba(212, 175, 55, 0.48);
      border-radius: 999px;
      box-shadow: inset 0 0 18px rgba(212, 175, 55, 0.06), 0 12px 28px rgba(0, 0, 0, 0.36);
    }
    #home .paskus-home-scroll__icon::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 9px;
      width: 4px;
      height: 9px;
      border-radius: 999px;
      background: #d4af37;
      transform: translateX(-50%);
      animation: paskus-scroll-cue 1550ms ease-in-out infinite;
      box-shadow: 0 0 14px rgba(212, 175, 55, 0.42);
    }
    @keyframes paskus-scroll-cue {
      0% { opacity: 0; transform: translate(-50%, 0); }
      28% { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%, 20px); }
    }
    #home .paskus-home-lead-panel {
      display: none !important;
    }
    #home .paskus-home-lead-text {
      width: 100% !important;
      max-width: 100% !important;
      padding: 18px 28px !important;
      font-size: clamp(14px, 1.08vw, 17px) !important;
      line-height: 1.62 !important;
      text-align: center !important;
      text-wrap: pretty;
    }
    #home .flex.flex-col {
      margin-top: clamp(28px, 4vw, 58px) !important;
      gap: clamp(14px, 1.6vw, 24px) !important;
    }
    #home .paskus-hero-motto + .flex.flex-col,
    #home .paskus-hero-motto + #hero-btns {
      margin-top: clamp(20px, 2.8vw, 36px) !important;
    }
    .paskus-video-intro {
      position: fixed;
      inset: 0;
      z-index: 180;
      display: grid;
      place-items: center;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 43%, rgba(4, 7, 5, 0.46), rgba(0, 0, 0, 0.94) 70%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.94)),
        url("/assets/paskus-intro-download3-poster-v1.jpg") center / cover;
      opacity: 1;
      pointer-events: none;
      transition: opacity 520ms ease, visibility 520ms ease;
    }
    .paskus-video-intro::after {
      z-index: 1;
      background:
        radial-gradient(circle at 50% 42%, rgba(0, 0, 0, 0.28) 0, rgba(0, 0, 0, 0.7) 43%, rgba(0, 0, 0, 0.96) 100%),
        linear-gradient(90deg, rgba(0, 0, 0, 0.94), rgba(0, 0, 0, 0.42) 50%, rgba(0, 0, 0, 0.94)),
        linear-gradient(180deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.74) 48%, rgba(0, 0, 0, 0.94));
    }
    .paskus-video-intro video {
      position: absolute;
      inset: 0;
      transform: none;
      filter: saturate(0.76) contrast(1.08) brightness(0.46);
      image-rendering: auto;
    }
    .paskus-video-intro.is-ready video {
      opacity: 0.26;
    }
    .paskus-video-intro.is-ending {
      opacity: 0;
      visibility: hidden;
    }
    .paskus-video-intro__mark {
      position: relative;
      z-index: 2;
      display: grid;
      place-items: center;
      gap: 18px;
      color: #f7f5e7;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(12px, 1.8vw, 18px);
      font-weight: 900;
      letter-spacing: 0.18em;
      text-align: center;
      text-transform: uppercase;
      text-shadow:
        0 2px 1px rgba(0, 0, 0, 0.9),
        0 18px 44px rgba(0, 0, 0, 0.9),
        0 0 24px rgba(255, 255, 255, 0.08);
    }
    .paskus-video-intro__mark img {
      width: clamp(64px, 10vw, 96px);
      height: clamp(64px, 10vw, 96px);
      object-fit: contain;
      filter: drop-shadow(0 20px 26px rgba(0, 0, 0, 0.56));
    }
    .paskus-video-intro__mark strong,
    .paskus-video-intro__mark small {
      display: block;
      font: inherit;
    }
    .paskus-video-intro__mark small {
      margin-top: 7px;
      font-size: 0.56em;
      letter-spacing: 0.42em;
      opacity: 0.72;
    }
    .paskus-video-intro__bar {
      width: min(260px, 58vw);
      height: 2px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
    }
    .paskus-video-intro__bar::before {
      content: "";
      display: block;
      width: 48%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, transparent, #efbf04, transparent);
      animation: paskus-intro-scan 1300ms ease-in-out infinite;
    }
    @keyframes paskus-intro-scan {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(220%); }
    }
    @media (prefers-reduced-motion: reduce) {
      #home .paskus-landing-video-bg video,
      .paskus-video-intro video,
      .paskus-video-intro__bar::before {
        animation: none !important;
        transition: none !important;
      }
    }
    .paskus-module-overview,
    .paskus-module-events,
    .paskus-module-detail {
      position: relative;
      isolation: isolate;
      padding: clamp(72px, 8vw, 112px) clamp(16px, 4vw, 40px);
      background:
        linear-gradient(180deg, rgba(5, 7, 6, 0.97), rgba(11, 14, 12, 0.92)),
        #070908;
      overflow: hidden;
    }
    .paskus-module-overview {
      background:
        radial-gradient(circle at 16% 14%, rgba(239, 191, 4, 0.13), transparent 32%),
        linear-gradient(180deg, rgba(5, 7, 6, 0.76), rgba(7, 9, 8, 0.9)),
        linear-gradient(115deg, rgba(3, 5, 4, 0.58), rgba(3, 5, 4, 0.2) 48%, rgba(3, 5, 4, 0.76)),
        url("/assets/paskus-bg-mountain-scout-v1.webp") center 48% / cover no-repeat,
        #070908 !important;
    }
    .paskus-module-events:not(.paskus-module-golongan) {
      background:
        radial-gradient(circle at 78% 18%, rgba(157, 193, 131, 0.12), transparent 34%),
        linear-gradient(180deg, rgba(5, 7, 6, 0.8), rgba(7, 9, 8, 0.92)),
        linear-gradient(105deg, rgba(3, 5, 4, 0.32), rgba(3, 5, 4, 0.68)),
        url("/assets/paskus-bg-helmet-close-v1.webp") center 40% / cover no-repeat,
        #070908 !important;
    }
    .paskus-module-golongan {
      background:
        radial-gradient(circle at 22% 12%, rgba(239, 191, 4, 0.12), transparent 31%),
        linear-gradient(180deg, rgba(5, 7, 6, 0.8), rgba(7, 9, 8, 0.94)),
        linear-gradient(120deg, rgba(3, 5, 4, 0.66), rgba(3, 5, 4, 0.24) 48%, rgba(3, 5, 4, 0.78)),
        url("/assets/paskus-bg-ops-pair-v1.webp") center 50% / cover no-repeat,
        #070908 !important;
    }
    .paskus-module-detail {
      background:
        radial-gradient(circle at 72% 18%, rgba(157, 193, 131, 0.13), transparent 34%),
        linear-gradient(180deg, rgba(5, 7, 6, 0.78), rgba(7, 9, 8, 0.92)),
        linear-gradient(120deg, rgba(3, 5, 4, 0.7), rgba(3, 5, 4, 0.28) 52%, rgba(3, 5, 4, 0.78)),
        url("/assets/paskus-bg-shadow-team-v1.webp") center 50% / cover no-repeat,
        #070908 !important;
    }
    .paskus-module-overview::before,
    .paskus-module-events::before,
    .paskus-module-detail::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.024) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
      background-size: 92px 92px;
      opacity: 0.42;
      mask-image: linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent);
    }
    .paskus-module-inner {
      width: min(1180px, 100%);
      margin: 0 auto;
    }
    .paskus-module-heading {
      display: grid;
      gap: 16px;
      margin-bottom: clamp(28px, 4vw, 46px);
      text-align: center;
    }
    .paskus-module-kicker {
      color: #efbf04;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-module-heading h2,
    .paskus-module-detail h2 {
      color: #f6f7f0;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(28px, 4vw, 50px);
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1.08;
      margin: 0;
      text-transform: uppercase;
    }
    .paskus-module-heading p {
      color: rgba(230, 237, 225, 0.72);
      font-size: clamp(14px, 1.5vw, 17px);
      line-height: 1.8;
      margin: 0 auto;
      max-width: 850px;
    }
    .paskus-module-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 0 auto clamp(24px, 4vw, 44px);
      width: min(900px, 100%);
    }
    .paskus-module-stat,
    .paskus-module-card,
    .paskus-module-panel {
      border: 1px solid rgba(239, 191, 4, 0.18);
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.024)),
        rgba(8, 11, 9, 0.68);
      box-shadow:
        0 24px 70px rgba(0, 0, 0, 0.36),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(18px) saturate(124%);
      -webkit-backdrop-filter: blur(18px) saturate(124%);
    }
    .paskus-module-stat {
      padding: 20px;
      text-align: center;
    }
    .paskus-module-stat strong {
      color: #efbf04;
      display: block;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(30px, 4vw, 46px);
      line-height: 1;
    }
    .paskus-module-stat span {
      color: rgba(232, 240, 226, 0.66);
      display: block;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0;
      margin-top: 8px;
      text-transform: uppercase;
    }
    .paskus-module-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }
    .paskus-module-card,
    .paskus-module-panel {
      padding: clamp(18px, 2vw, 24px);
    }
    .paskus-module-card h3,
    .paskus-module-panel h3 {
      color: #f6f7f0;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0;
      margin: 0 0 12px;
      text-transform: uppercase;
    }
    .paskus-module-card p,
    .paskus-module-panel p,
    .paskus-module-panel li {
      color: rgba(226, 233, 220, 0.72);
      font-size: 13px;
      line-height: 1.72;
      margin: 0;
    }
    .paskus-module-panel ul {
      display: grid;
      gap: 9px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .paskus-indonesia-presence {
      position: relative;
      isolation: isolate;
      padding: clamp(58px, 7vw, 98px) clamp(16px, 4vw, 40px);
      background:
        radial-gradient(circle at 22% 16%, rgba(239, 191, 4, 0.12), transparent 34%),
        radial-gradient(circle at 82% 72%, rgba(157, 193, 131, 0.1), transparent 30%),
        linear-gradient(180deg, rgba(4, 6, 5, 0.98), rgba(8, 11, 9, 0.94)),
        #050706;
      overflow: hidden;
    }
    .paskus-indonesia-presence::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.024) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.016) 1px, transparent 1px);
      background-size: 88px 88px;
      opacity: 0.38;
      mask-image: linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent);
    }
    .paskus-indonesia-presence__inner {
      width: min(1480px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(260px, 0.58fr) minmax(660px, 1.42fr);
      gap: clamp(22px, 3.6vw, 52px);
      align-items: center;
      padding: clamp(16px, 2.6vw, 30px);
      border: 1px solid rgba(239, 191, 4, 0.2);
      border-radius: 24px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.074), rgba(255, 255, 255, 0.022)),
        rgba(6, 9, 7, 0.72);
      box-shadow:
        0 34px 86px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px) saturate(126%);
      -webkit-backdrop-filter: blur(20px) saturate(126%);
    }
    .paskus-indonesia-presence__copy {
      display: grid;
      gap: 18px;
      align-content: center;
    }
    .paskus-indonesia-presence__kicker {
      color: #efbf04;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .paskus-indonesia-presence h2 {
      color: #f6f7f0;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(25px, 3.6vw, 44px);
      font-weight: 900;
      letter-spacing: 0;
      line-height: 1.08;
      margin: 0;
      text-transform: uppercase;
    }
    .paskus-indonesia-presence__lead {
      color: rgba(230, 237, 225, 0.74);
      font-size: clamp(13px, 1.35vw, 16px);
      font-weight: 700;
      line-height: 1.78;
      margin: 0;
      max-width: 520px;
    }
    .paskus-indonesia-presence__stat {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid rgba(239, 191, 4, 0.18);
      border-radius: 16px;
      background: rgba(239, 191, 4, 0.07);
      color: rgba(246, 247, 240, 0.82);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.45;
    }
    .paskus-indonesia-presence__stat strong {
      color: #efbf04;
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      font-size: clamp(23px, 3vw, 34px);
      line-height: 1;
      white-space: nowrap;
    }
    .paskus-people-search {
      display: grid;
      gap: 9px;
      margin-top: 4px;
      max-width: 460px;
    }
    .paskus-people-search label {
      color: rgba(246, 247, 240, 0.74);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .paskus-people-search__row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
    }
    .paskus-people-search input {
      width: 100%;
      min-height: 46px;
      border: 1px solid rgba(239, 191, 4, 0.22);
      border-radius: 14px;
      background: rgba(3, 5, 4, 0.72);
      color: #f6f7f0;
      font: 800 13px/1.2 Inter, system-ui, sans-serif;
      outline: none;
      padding: 0 14px;
      transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
    }
    .paskus-people-search input:focus-visible {
      border-color: rgba(239, 191, 4, 0.58);
      box-shadow: 0 0 0 4px rgba(239, 191, 4, 0.08);
      background: rgba(6, 9, 7, 0.86);
    }
    .paskus-people-search button {
      min-height: 46px;
      border: 1px solid rgba(239, 191, 4, 0.42);
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(239, 191, 4, 0.22), rgba(239, 191, 4, 0.08));
      color: #f6f7f0;
      cursor: pointer;
      font: 900 11px/1 "Orbitron", Inter, system-ui, sans-serif;
      letter-spacing: 0.1em;
      padding: 0 16px;
      text-transform: uppercase;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }
    .paskus-people-search button:hover,
    .paskus-people-search button:focus-visible {
      border-color: rgba(239, 191, 4, 0.72);
      background: linear-gradient(135deg, rgba(239, 191, 4, 0.32), rgba(239, 191, 4, 0.12));
      transform: translateY(-1px);
    }
    .paskus-people-search__result {
      min-height: 18px;
      color: rgba(226, 233, 220, 0.62);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.45;
      margin: 0;
    }
    .paskus-indonesia-map-card {
      position: relative;
      isolation: isolate;
      width: 100%;
      min-height: 0;
      display: grid;
      gap: clamp(10px, 1.35vw, 16px);
      padding: clamp(10px, 1.45vw, 18px);
      overflow: hidden;
      border: 1px solid rgba(239, 191, 4, 0.22);
      border-radius: 22px;
      background:
        radial-gradient(circle at 50% 42%, rgba(239, 191, 4, 0.08), transparent 58%),
        rgba(3, 5, 4, 0.82);
      box-shadow:
        0 28px 68px rgba(0, 0, 0, 0.42),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    .paskus-indonesia-map-plot {
      position: relative;
      isolation: isolate;
      width: 100%;
      aspect-ratio: 735 / 286;
      min-height: clamp(220px, 24vw, 390px);
      overflow: hidden;
      border-radius: 16px;
      background:
        radial-gradient(circle at 50% 42%, rgba(239, 191, 4, 0.08), transparent 58%),
        rgba(3, 5, 4, 0.72);
    }
    .paskus-indonesia-map-plot img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      padding: 0;
      opacity: 0.9;
      filter: grayscale(0.08) saturate(0.92) contrast(1.08) brightness(0.82);
    }
    .paskus-indonesia-map-plot::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 45%, transparent 0, rgba(0, 0, 0, 0.1) 48%, rgba(0, 0, 0, 0.74) 100%),
        linear-gradient(180deg, rgba(3, 5, 4, 0.18), rgba(3, 5, 4, 0.44));
    }
    .paskus-indonesia-map-action {
      position: absolute;
      inset: 0;
      z-index: 2;
      border: 0;
      background: transparent;
      cursor: pointer;
    }
    .paskus-indonesia-map-action:focus-visible {
      outline: 2px solid rgba(239, 191, 4, 0.75);
      outline-offset: -8px;
      border-radius: 18px;
    }
    .paskus-indonesia-markers {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
    }
    .paskus-indonesia-marker {
      position: absolute;
      left: var(--pin-x);
      top: var(--pin-y);
      width: clamp(5px, 0.5vw, 8px);
      height: clamp(5px, 0.5vw, 8px);
      border: 1px solid rgba(255, 244, 184, 0.82);
      border-radius: 999px;
      background: #efbf04;
      box-shadow:
        0 0 0 0 rgba(239, 191, 4, 0.44),
        0 0 14px rgba(239, 191, 4, 0.54),
        0 12px 22px rgba(0, 0, 0, 0.36);
      cursor: pointer;
      pointer-events: auto;
      transform: translate(-50%, -50%);
      animation: paskus-map-pin 2600ms ease-in-out infinite;
      animation-delay: var(--pin-delay);
    }
    .paskus-indonesia-marker::after {
      content: "";
      position: absolute;
      inset: clamp(-4px, -0.34vw, -2px);
      border: 1px solid rgba(239, 191, 4, 0.25);
      border-radius: inherit;
      animation: paskus-map-pulse 2600ms ease-out infinite;
      animation-delay: var(--pin-delay);
    }
    .paskus-indonesia-marker:hover,
    .paskus-indonesia-marker:focus-visible {
      animation: none;
      background: #f6f7f0;
      outline: none;
      transform: translate(-50%, -58%) scale(1.16);
    }
    .paskus-indonesia-marker:hover::after,
    .paskus-indonesia-marker:focus-visible::after {
      animation: none;
      opacity: 0.34;
      transform: scale(1.72);
    }
    .paskus-indonesia-marker__label {
      position: absolute;
      left: var(--tip-left, 50%);
      bottom: calc(100% + 9px);
      z-index: 6;
      max-width: min(210px, 44vw);
      padding: 6px 9px;
      border: 1px solid rgba(239, 191, 4, 0.35);
      border-radius: 999px;
      background: rgba(4, 6, 5, 0.8);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.42), 0 0 18px rgba(239, 191, 4, 0.14);
      color: rgba(246, 247, 240, 0.95);
      font: 900 9px/1 "Orbitron", Inter, system-ui, sans-serif;
      letter-spacing: 0.07em;
      opacity: 0;
      overflow: hidden;
      pointer-events: none;
      text-overflow: ellipsis;
      text-transform: uppercase;
      transform: translate(var(--tip-x, -50%), 4px);
      transition: opacity 160ms ease, transform 160ms ease;
      white-space: nowrap;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
    }
    .paskus-indonesia-marker:hover .paskus-indonesia-marker__label,
    .paskus-indonesia-marker:focus-visible .paskus-indonesia-marker__label,
    .paskus-indonesia-marker.is-tooltip-visible .paskus-indonesia-marker__label {
      opacity: 1 !important;
      transform: translate(var(--tip-x, -50%), 0) !important;
    }
    .paskus-indonesia-map-hint {
      position: relative;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 0;
      padding: clamp(8px, 1.1vw, 12px) 0 0;
      border-top: 1px solid rgba(239, 191, 4, 0.16);
      color: rgba(246, 247, 240, 0.76);
      font: 900 11px/1.4 "Orbitron", Inter, system-ui, sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .paskus-indonesia-map-hint span:last-child {
      color: #efbf04;
      white-space: nowrap;
    }
    .paskus-structure-page .structure-member-card.is-people-search-hit {
      border-color: rgba(239, 191, 4, 0.88) !important;
      background:
        linear-gradient(135deg, rgba(239, 191, 4, 0.2), rgba(255, 255, 255, 0.07)),
        rgba(8, 11, 9, 0.86) !important;
      box-shadow:
        0 0 0 3px rgba(239, 191, 4, 0.16),
        0 22px 52px rgba(239, 191, 4, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
      animation: paskus-people-hit 2400ms ease both;
    }
    @keyframes paskus-map-pin {
      0%, 100% { transform: translate(-50%, -50%); }
      50% { transform: translate(-50%, -68%); }
    }
    @keyframes paskus-map-pulse {
      0% { opacity: 0.72; transform: scale(0.62); }
      100% { opacity: 0; transform: scale(1.9); }
    }
    @keyframes paskus-people-hit {
      0%, 100% { transform: translateY(0); }
      18% { transform: translateY(-3px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .paskus-indonesia-marker,
      .paskus-indonesia-marker::after,
      .paskus-structure-page .structure-member-card.is-people-search-hit {
        animation: none !important;
      }
    }
    .paskus-module-detail {
      background:
        linear-gradient(180deg, rgba(5, 5, 5, 0.82), rgba(5, 5, 5, 0.95)),
        rgba(5, 5, 5, 0.92);
    }
    .paskus-seo-footer {
      position: relative;
      isolation: isolate;
      padding: clamp(48px, 6vw, 76px) clamp(16px, 4vw, 40px) clamp(34px, 5vw, 58px);
      background:
        linear-gradient(180deg, rgba(7, 10, 8, 0.98), rgba(3, 5, 4, 0.98)),
        linear-gradient(105deg, rgba(3, 5, 4, 0.82), rgba(3, 5, 4, 0.5) 52%, rgba(3, 5, 4, 0.9)),
        url("/assets/paskus-bg-briefing-helmets-v1.webp") center 44% / cover no-repeat,
        #050706;
      border-top: 1px solid rgba(239, 191, 4, 0.2);
      overflow: hidden;
    }
    .paskus-seo-footer::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.016) 1px, transparent 1px);
      background-size: 86px 86px;
      opacity: 0.48;
      mask-image: linear-gradient(180deg, transparent, #000 16%, #000 100%);
    }
    .paskus-seo-footer__inner {
      width: min(1180px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(240px, 1.08fr) repeat(3, minmax(150px, 0.7fr));
      gap: clamp(22px, 4vw, 44px);
      align-items: start;
    }
    .paskus-seo-footer__brand {
      display: grid;
      gap: 16px;
    }
    .paskus-seo-footer__brand-row {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      color: #f6f7f0;
      text-decoration: none;
      width: fit-content;
    }
    .paskus-seo-footer__brand-row img {
      width: 46px;
      height: 46px;
      object-fit: contain;
      filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.35));
    }
    .paskus-seo-footer__brand-row strong,
    .paskus-seo-footer__title {
      font-family: "Orbitron", Inter, system-ui, sans-serif;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .paskus-seo-footer__brand-row strong {
      display: block;
      font-size: 18px;
      line-height: 1;
    }
    .paskus-seo-footer__brand-row span span {
      display: block;
      color: #9dc183;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.16em;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .paskus-seo-footer__brand p,
    .paskus-seo-footer__copy {
      color: rgba(226, 233, 220, 0.68);
      font-size: 13px;
      line-height: 1.78;
      margin: 0;
      max-width: 470px;
    }
    .paskus-seo-footer__title {
      color: #efbf04;
      font-size: 12px;
      font-weight: 900;
      margin: 0 0 14px;
    }
    .paskus-seo-footer__links {
      display: grid;
      gap: 9px;
    }
    .paskus-seo-footer__links a {
      color: rgba(246, 247, 240, 0.82);
      font-size: 13px;
      font-weight: 750;
      line-height: 1.35;
      text-decoration: none;
    }
    .paskus-seo-footer__links a:hover,
    .paskus-seo-footer__links a:focus-visible {
      color: #efbf04;
    }
    .paskus-seo-footer__bottom {
      width: min(1180px, 100%);
      margin: clamp(28px, 4vw, 42px) auto 0;
      padding-top: 18px;
      border-top: 1px solid rgba(239, 191, 4, 0.14);
      color: rgba(226, 233, 220, 0.48);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .paskus-module-detail .paskus-module-inner {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      gap: clamp(22px, 4vw, 52px);
      align-items: start;
    }
    .paskus-module-detail .paskus-module-heading {
      margin-bottom: 0;
      text-align: left;
    }
    .paskus-module-detail .paskus-module-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .paskus-module-route {
      color: rgba(239, 191, 4, 0.78);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0;
      margin-top: 18px;
      text-transform: uppercase;
    }
    @media (max-width: 980px) {
      .paskus-indonesia-presence__inner {
        grid-template-columns: 1fr;
      }
      .paskus-indonesia-presence__copy {
        text-align: center;
        justify-items: center;
      }
      .paskus-indonesia-presence__lead {
        max-width: 720px;
      }
      .paskus-people-search {
        width: min(100%, 540px);
      }
      .paskus-module-grid,
      .paskus-module-detail .paskus-module-inner,
      .paskus-module-detail .paskus-module-grid {
        grid-template-columns: 1fr;
      }
      .paskus-seo-footer__inner {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .paskus-module-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        width: min(780px, 100%);
      }
      .paskus-module-detail .paskus-module-heading {
        text-align: center;
      }
    }
    @media (max-width: 900px) {
      .paskus-komodo-page .paskus-komodo-nav .nav-links {
        display: none;
      }
      .paskus-komodo-page .komodo-hero-inner,
      .paskus-komodo-page .komodo-copy,
      .paskus-komodo-page .komodo-grid,
      .paskus-komodo-page .komodo-stats {
        grid-template-columns: 1fr;
      }
      .paskus-komodo-page .komodo-logo-card {
        min-height: 320px;
      }
    }
    @media (max-width: 720px) {
      html,
      body,
      #root {
        max-width: 100vw;
        overflow-x: hidden;
      }

      #home {
        min-height: min(760px, 92svh) !important;
        padding: 94px 14px 46px !important;
        align-items: center !important;
        overflow: hidden !important;
      }
      #home > .z-10 {
        width: min(100%, 330px) !important;
        max-width: calc(100vw - 28px) !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 0 !important;
        position: absolute !important;
        left: 50% !important;
        top: 52% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        transform: translate(-50%, -50%) !important;
      }
      #home h1 {
        width: 100% !important;
        max-width: 100% !important;
        font-size: clamp(28px, 8.4vw, 36px) !important;
        line-height: 0.94 !important;
        letter-spacing: 0 !important;
        margin-bottom: 10px !important;
        overflow-wrap: anywhere;
        word-break: break-word;
      }
      #home h1 + p {
        width: 100% !important;
        max-width: 100% !important;
        font-size: 10.2px !important;
        line-height: 1.48 !important;
        letter-spacing: 0.025em !important;
        margin-bottom: 0 !important;
        white-space: normal !important;
        overflow-wrap: break-word;
      }
      #home h1 .paskus-hero-unit {
        margin-top: 8px !important;
        font-size: 0.46em !important;
        letter-spacing: 0.12em !important;
      }
      #home .paskus-hero-motto {
        width: 100% !important;
        margin: 22px auto 13px !important;
        gap: 7px !important;
        letter-spacing: 0.2em !important;
      }
      #home .paskus-hero-motto::before,
      #home .paskus-hero-motto::after {
        width: min(220px, 62vw) !important;
      }
      #home .paskus-hero-motto strong {
        font-size: 12px !important;
      }
      #home .paskus-hero-motto span {
        max-width: 300px !important;
        font-size: 9.8px !important;
        line-height: 1.48 !important;
        letter-spacing: 0.08em !important;
      }
      #home .paskus-home-scroll {
        margin-top: 14px !important;
        font-size: 8.5px !important;
        letter-spacing: 0.14em !important;
      }
      #home .paskus-home-scroll__icon {
        width: 26px !important;
        height: 38px !important;
      }
      #home .max-w-2xl {
        display: none !important;
      }
      #home .max-w-2xl p {
        width: 100% !important;
        max-width: 100% !important;
        padding: 11px !important;
        font-size: 10.8px !important;
        line-height: 1.48 !important;
        letter-spacing: 0 !important;
        overflow-wrap: break-word;
      }
      #home .flex.flex-col {
        width: 100% !important;
        margin-top: 28px !important;
        gap: 10px !important;
      }
      #home .btn-enlist,
      #home .btn-outline-white {
        width: 100% !important;
        max-width: 304px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        min-height: 42px !important;
        padding: 0 12px !important;
        font-size: 10px !important;
        letter-spacing: 0.04em !important;
      }

      .hero-section {
        height: auto !important;
        min-height: min(760px, 92svh) !important;
        padding: 94px 14px 48px !important;
        overflow: hidden !important;
      }
      .hero-section > .relative,
      .hero-section .text-center {
        width: min(100%, 360px) !important;
        max-width: calc(100vw - 28px) !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .hero-section h1,
      .hero-section #hero-title {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        font-size: clamp(38px, 15vw, 58px) !important;
        line-height: 0.94 !important;
        letter-spacing: 0 !important;
        overflow-wrap: anywhere;
        word-break: break-word;
      }
      .hero-section p {
        width: min(100%, 330px) !important;
        max-width: calc(100vw - 34px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
        font-size: 12.5px !important;
        line-height: 1.56 !important;
      }
      .hero-section .btn-enlist,
      .hero-section .btn-outline-white,
      .hero-section button {
        width: min(100%, 330px) !important;
        min-height: 44px !important;
        padding: 0 14px !important;
        font-size: 10px !important;
        letter-spacing: 0.06em !important;
      }
      .body-nav .hero-section > .relative,
      .body-nav .hero-section .text-center {
        width: min(100%, 310px) !important;
        max-width: calc(100vw - 36px) !important;
      }
      .body-nav .hero-section p {
        width: min(100%, 278px) !important;
        font-size: 12px !important;
        line-height: 1.54 !important;
      }
      .body-nav .hero-section button {
        width: min(100%, 304px) !important;
        max-width: 304px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .paskus-discord-sync--embedded {
        width: 100%;
        padding: 10px;
        border-radius: 12px;
        margin-bottom: 2px;
      }
      .paskus-discord-sync strong {
        font-size: 10px;
        margin-bottom: 4px;
      }
      .paskus-discord-sync p {
        font-size: 10.5px;
        line-height: 1.42;
        margin-bottom: 8px;
      }
      .paskus-discord-privacy {
        font-size: 9.5px;
        line-height: 1.35;
      }
      .paskus-discord-actions a,
      .paskus-discord-actions button {
        min-height: 32px;
        padding: 7px 10px;
        font-size: 9px;
      }
      .paskus-register-card {
        border-radius: 16px;
        box-shadow:
          0 18px 42px rgba(0, 0, 0, 0.48),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }
      .paskus-register-form {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }
      .paskus-register-form input,
      .paskus-register-form select,
      .paskus-register-form textarea,
      .paskus-discord-id-field input {
        min-height: 44px;
        border-radius: 10px !important;
        padding: 10px 11px !important;
        font-size: 11.5px !important;
        line-height: 1.25 !important;
      }
      .paskus-register-form #Gender,
      .paskus-register-form #Status,
      .paskus-register-form #Device,
      .paskus-register-form #roblox-Age,
      .paskus-register-form #masuk-via,
      .paskus-register-form #Resimen {
        grid-column: auto !important;
      }
      .paskus-register-form .paskus-discord-id-field,
      .paskus-register-form #Golongan,
      .paskus-register-form .paskus-golongan-info,
      .paskus-register-form textarea,
      .paskus-register-form #submit-btn {
        grid-column: 1 / -1 !important;
      }
      .paskus-golongan-info {
        grid-template-columns: 1fr;
        gap: 8px;
        margin-top: -4px;
      }
      .paskus-golongan-info article {
        padding: 10px;
      }
      .paskus-golongan-info span {
        font-size: 10px;
      }
      .paskus-discord-id-field {
        gap: 5px;
      }
      .paskus-discord-id-field label {
        font-size: 9px;
      }

	      #combat,
	      #support,
	      .paskus-indonesia-presence,
	      .paskus-module-overview,
	      .paskus-module-events,
	      .paskus-module-detail,
	      .paskus-seo-footer {
	        padding: 48px 12px !important;
	      }
	      .paskus-indonesia-presence__inner {
	        border-radius: 18px;
	        gap: 18px;
	        padding: 14px;
	      }
	      .paskus-indonesia-presence h2 {
	        font-size: clamp(22px, 8vw, 31px);
	      }
	      .paskus-indonesia-presence__lead {
	        font-size: 12.3px;
	        line-height: 1.62;
	      }
	      .paskus-indonesia-presence__stat {
	        width: 100%;
	        justify-content: center;
	        padding: 10px 12px;
	        font-size: 11px;
	      }
	      .paskus-people-search__row {
	        grid-template-columns: 1fr;
	      }
	      .paskus-people-search input,
	      .paskus-people-search button {
	        min-height: 42px;
	        border-radius: 12px;
	      }
	      .paskus-indonesia-map-card {
	        min-height: 0;
	        gap: 10px;
	        padding: 8px;
	        border-radius: 18px;
	      }
	      .paskus-indonesia-map-plot {
	        min-height: clamp(148px, 38vw, 210px);
	        border-radius: 14px;
	      }
	      .paskus-indonesia-marker {
	        width: clamp(4px, 1.45vw, 7px);
	        height: clamp(4px, 1.45vw, 7px);
	      }
	      .paskus-indonesia-marker::after {
	        inset: -3px;
	      }
	      .paskus-indonesia-marker__label {
	        bottom: calc(100% + 7px);
	        max-width: 142px;
	        padding: 5px 7px;
	        font-size: 7.5px;
	      }
	      .paskus-indonesia-map-hint {
	        display: grid;
	        justify-items: center;
	        justify-content: center;
	        text-align: center;
	        font-size: 9px;
	        letter-spacing: 0.06em;
	      }
	      .paskus-seo-footer {
	        padding: 40px 12px 34px !important;
	      }
      .paskus-seo-footer__inner {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 12px;
      }
      .paskus-seo-footer__brand {
        grid-column: 1 / -1;
        gap: 10px;
      }
      .paskus-seo-footer__brand-row img {
        width: 38px;
        height: 38px;
      }
      .paskus-seo-footer__brand-row strong {
        font-size: 15px;
      }
      .paskus-seo-footer__brand-row span span,
      .paskus-seo-footer__title {
        font-size: 9px;
        letter-spacing: 0.08em;
      }
      .paskus-seo-footer__brand p,
      .paskus-seo-footer__copy {
        max-width: 100%;
        font-size: 11.5px;
        line-height: 1.55;
      }
      .paskus-seo-footer__title {
        margin-bottom: 9px;
      }
      .paskus-seo-footer__links {
        grid-template-columns: 1fr;
        gap: 7px;
      }
      .paskus-seo-footer__links a {
        min-height: 30px;
        display: flex;
        align-items: center;
        border: 1px solid rgba(239, 191, 4, 0.16);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        font-size: 10px;
        line-height: 1.25;
        padding: 7px 8px;
        overflow-wrap: anywhere;
      }
      .paskus-seo-footer__bottom {
        margin-top: 22px;
        font-size: 9px;
        line-height: 1.45;
        letter-spacing: 0.04em;
      }
      #combat .mb-20,
      #support .mb-20 {
        margin-bottom: 22px !important;
      }
      #combat .grid,
      #support .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }
      #combat .flip-card,
      #support .flip-card {
        min-height: 186px;
        border-radius: 14px;
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
        contain-intrinsic-size: auto 186px;
      }
      #combat .flip-card.paskus-unit-sierra,
      #combat .flip-card.paskus-unit-pathfinder,
      #combat .flip-card.paskus-unit-sentinel {
        min-height: 206px;
        contain-intrinsic-size: auto 206px;
      }
      #combat .flip-card.paskus-unit-sierra {
        min-height: 236px;
        contain-intrinsic-size: auto 236px;
      }
      #combat .flip-card::before,
      #support .flip-card::before {
        display: none;
      }
      #combat .flip-card-inner,
      #support .flip-card-inner,
      #combat .flip-card:hover .flip-card-inner,
      #combat .flip-card:focus-within .flip-card-inner,
      #support .flip-card:hover .flip-card-inner,
      #support .flip-card:focus-within .flip-card-inner {
        transform: none !important;
      }
      #combat .flip-card-front,
      #support .flip-card-front {
        position: relative !important;
        min-height: inherit;
        padding: 12px !important;
        box-shadow:
          0 14px 28px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(239, 191, 4, 0.1);
        backdrop-filter: blur(7px) saturate(116%);
        -webkit-backdrop-filter: blur(7px) saturate(116%);
      }
      #combat .flip-card-back,
      #support .flip-card-back {
        display: none !important;
      }
      #combat .flip-card-front {
        justify-content: center;
        gap: 9px;
      }
      #combat .flip-card.paskus-unit-sierra .flip-card-front,
      #combat .flip-card.paskus-unit-pathfinder .flip-card-front,
      #combat .flip-card.paskus-unit-sentinel .flip-card-front {
        gap: 7px;
        padding: 11px !important;
      }
      #combat .flip-card.paskus-unit-sierra .flip-card-front {
        gap: 8px;
        padding: 13px 11px 17px !important;
      }
      #support .flip-card-front {
        grid-template-columns: 1fr;
        align-content: center;
        justify-items: center;
        row-gap: 8px;
        text-align: center;
      }
      #combat .unit-logo {
        width: 48px !important;
        height: 48px !important;
        margin-bottom: 0 !important;
        filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.34));
      }
      #combat .flip-card.paskus-unit-sierra .unit-logo {
        width: 58px !important;
        height: 58px !important;
        border-radius: 0;
      }
      #support .unit-logo {
        width: 44px !important;
        height: 44px !important;
        grid-row: auto;
        padding: 6px;
        border-radius: 12px;
        margin: 0 auto 3px !important;
        filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3));
      }
      #combat .flip-card h4,
      #support .flip-card h4 {
        font-size: 11px !important;
        line-height: 1.18 !important;
        letter-spacing: 0.02em !important;
      }
      #combat .flip-card.paskus-unit-sierra h4,
      #combat .flip-card.paskus-unit-pathfinder h4,
      #combat .flip-card.paskus-unit-sentinel h4 {
        font-size: 10.5px !important;
        line-height: 1.14 !important;
      }
      #combat .flip-card.paskus-unit-sierra .paskus-unit-role,
      #combat .flip-card.paskus-unit-pathfinder .paskus-unit-role,
      #combat .flip-card.paskus-unit-sentinel .paskus-unit-role {
        max-width: 100%;
        justify-content: center;
        padding: 5px 7px;
        font-size: 7.6px;
        line-height: 1.2;
        letter-spacing: 0.07em;
        text-align: center;
        white-space: normal;
      }
      #combat .flip-card p,
      #support .flip-card p {
        font-size: 10px !important;
        line-height: 1.42 !important;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      #support .flip-card-front h4::after {
        margin: 6px auto 0;
        padding-top: 5px;
        font-size: 7px;
        letter-spacing: 0.12em;
      }
      #support .flip-card-front::before {
        top: 9px;
        left: 10px;
        font-size: 7px;
        letter-spacing: 0.12em;
      }
      #combat .flip-card a[href^="/unit/"],
      #support .paskus-support-detail-link {
        width: 100%;
        min-width: 0;
        min-height: 30px;
        border-radius: 10px;
        padding: 0 8px;
        font-size: 8.5px;
        letter-spacing: 0.02em;
      }
      #combat .flip-card.paskus-unit-sierra a[href^="/unit/"],
      #combat .flip-card.paskus-unit-pathfinder a[href^="/unit/"],
      #combat .flip-card.paskus-unit-sentinel a[href^="/unit/"] {
        min-height: 32px;
        font-size: 8px;
      }
      #combat .flip-card.paskus-unit-sierra a[href^="/unit/"] {
        width: calc(100% - 8px);
        min-height: 30px;
        margin-top: 0;
        transform: translateZ(42px);
      }

      .paskus-module-heading {
        gap: 10px;
        margin-bottom: 20px;
      }
      .paskus-module-kicker {
        font-size: 10px;
      }
      .paskus-module-heading h2,
      .paskus-module-detail h2 {
        max-width: min(100%, 310px);
        margin-left: auto;
        margin-right: auto;
        font-size: clamp(18px, 5.7vw, 22px);
        line-height: 1.12;
        text-wrap: balance;
        overflow-wrap: anywhere;
        word-break: break-word;
      }
      .paskus-module-heading p {
        font-size: 12px;
        line-height: 1.58;
      }
      .paskus-module-stats,
      .paskus-module-grid,
      .paskus-module-detail .paskus-module-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px;
      }
      .paskus-module-stats .paskus-module-stat:last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }
      .paskus-module-detail .paskus-module-inner {
        grid-template-columns: 1fr !important;
        gap: 16px;
      }
      .paskus-module-stat,
      .paskus-module-card,
      .paskus-module-panel {
        border-radius: 12px;
        padding: 13px;
      }
      .paskus-module-stat strong {
        font-size: 25px;
      }
      .paskus-module-stat span,
      .paskus-module-card h3,
      .paskus-module-panel h3 {
        font-size: 10px;
        line-height: 1.22;
      }
      .paskus-module-card p,
      .paskus-module-panel p,
      .paskus-module-panel li {
        font-size: 10.5px;
        line-height: 1.48;
      }
      .paskus-cs-ai {
        right: 12px;
        bottom: 12px;
        width: calc(100vw - 24px);
      }
      .paskus-cs-ai-toggle {
        min-height: 50px;
      }
      .paskus-cs-ai-log {
        max-height: 46vh;
      }
      .paskus-cs-ai-form {
        grid-template-columns: 1fr;
      }
      .paskus-cs-ai-note {
        font-size: 9px;
      }

      .paskus-about-page .about-nav,
      .paskus-support-detail-page .support-nav,
      .paskus-komodo-page .paskus-komodo-nav {
        padding: 12px 14px;
      }
      .paskus-about-page .about-brand img,
      .paskus-support-detail-page .support-brand img,
      .paskus-komodo-page .paskus-komodo-nav img {
        width: 34px;
        height: 34px;
      }
      .paskus-about-page .about-brand strong,
      .paskus-support-detail-page .support-brand strong {
        font-size: 15px;
      }
      .paskus-about-page .about-hero,
      .paskus-support-detail-page .support-hero,
      .paskus-komodo-page .komodo-hero {
        min-height: auto;
        padding: 96px 14px 48px;
      }
      .paskus-about-page .about-hero-inner,
      .paskus-about-page .about-split,
      .paskus-support-detail-page .support-hero-inner,
      .paskus-support-detail-page .support-split,
      .paskus-komodo-page .komodo-hero-inner,
      .paskus-komodo-page .komodo-copy {
        grid-template-columns: 1fr !important;
        gap: 18px;
      }
      .paskus-about-page .about-hero-inner,
      .paskus-about-page .about-section,
      .paskus-support-detail-page .support-hero-inner,
      .paskus-support-detail-page .support-section,
      .paskus-komodo-page .komodo-section {
        width: min(100%, calc(100vw - 28px));
      }
      .paskus-about-page h1,
      .paskus-support-detail-page h1,
      .paskus-komodo-page h1 {
        font-size: clamp(34px, 12vw, 48px) !important;
        line-height: 0.98 !important;
        overflow-wrap: anywhere;
      }
      .paskus-about-page .about-lead,
      .paskus-support-detail-page .support-lead,
      .paskus-komodo-page .komodo-lead {
        font-size: 12.5px;
        line-height: 1.6;
      }
      .paskus-about-page .about-command-panel,
      .paskus-support-detail-page .support-brief,
      .paskus-komodo-page .komodo-logo-card {
        border-radius: 14px;
        padding: 16px;
      }
      .paskus-komodo-page .komodo-logo-card {
        min-height: 230px;
      }
      .paskus-about-page .about-section,
      .paskus-support-detail-page .support-section,
      .paskus-komodo-page .komodo-section {
        padding: 46px 0;
      }
      .paskus-about-page .about-grid,
      .paskus-about-page .about-grid.three,
      .paskus-support-detail-page .support-grid,
      .paskus-support-detail-page .support-priority-grid,
      .paskus-komodo-page .komodo-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px;
      }
      .paskus-komodo-page .komodo-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 8px;
      }
      .paskus-about-page .about-card,
      .paskus-about-page .about-stat,
      .paskus-about-page .about-step,
      .paskus-support-detail-page .support-card,
      .paskus-komodo-page .komodo-info-card {
        min-height: auto;
        border-radius: 12px;
        padding: 13px;
      }
      .paskus-about-page .about-step {
        padding-top: 40px;
      }
      .paskus-about-page .about-step::before {
        top: 14px;
        left: 14px;
        font-size: 14px;
      }
      .paskus-about-page .about-section h2,
      .paskus-support-detail-page .support-section h2,
      .paskus-komodo-page .komodo-copy h2 {
        font-size: clamp(22px, 8vw, 32px);
      }
      .paskus-about-page .about-stat strong,
      .paskus-komodo-page .komodo-stat strong {
        font-size: 24px;
      }
      .paskus-about-page .about-card h3,
      .paskus-about-page .about-step h3,
      .paskus-support-detail-page .support-card h3,
      .paskus-komodo-page .komodo-info-card h3 {
        font-size: 10.5px;
        line-height: 1.24;
      }
      .paskus-about-page .about-card p,
      .paskus-about-page .about-step p,
      .paskus-about-page .about-stat span,
      .paskus-support-detail-page .support-card p,
      .paskus-support-detail-page .support-section p,
      .paskus-komodo-page .komodo-info-card p,
      .paskus-komodo-page .komodo-copy p {
        font-size: 10.5px;
        line-height: 1.48;
      }
      .paskus-support-detail-page .support-card {
        min-height: 150px;
      }
      .paskus-support-detail-page .support-priority {
        padding-left: 10px;
      }
      .paskus-support-detail-page .support-priority strong {
        font-size: 13px;
      }
      .paskus-support-detail-page .support-priority span,
      .paskus-komodo-page .komodo-stat span {
        font-size: 8.5px;
        line-height: 1.35;
        letter-spacing: 0.06em;
      }
    }
    @media (max-width: 430px) {
      #home {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
      #combat,
      #support,
      .paskus-module-overview,
      .paskus-module-events,
      .paskus-module-detail {
        padding: 38px 10px !important;
      }
      #combat .grid,
      #support .grid {
        gap: 8px !important;
      }
      #combat .flip-card,
      #support .flip-card {
        min-height: 164px;
        border-radius: 12px;
        contain-intrinsic-size: auto 164px;
      }
      #combat .flip-card.has-unit-roster {
        min-height: 330px;
        contain-intrinsic-size: auto 330px;
      }
      #combat .flip-card.paskus-unit-sierra,
      #combat .flip-card.paskus-unit-pathfinder,
      #combat .flip-card.paskus-unit-sentinel {
        min-height: 178px;
        contain-intrinsic-size: auto 178px;
      }
      #combat .flip-card.paskus-unit-sierra {
        min-height: 212px;
        contain-intrinsic-size: auto 212px;
      }
      #combat .flip-card-front,
      #support .flip-card-front {
        gap: 7px;
        padding: 10px !important;
      }
      #combat .flip-card.paskus-unit-sierra .flip-card-front {
        gap: 7px;
        padding: 12px 9px 15px !important;
      }
      #combat .unit-logo {
        width: 40px !important;
        height: 40px !important;
      }
      #combat .flip-card.paskus-unit-sierra .unit-logo {
        width: 50px !important;
        height: 50px !important;
      }
      #support .unit-logo {
        width: 38px !important;
        height: 38px !important;
        padding: 5px;
      }
      #combat .flip-card h4,
      #support .flip-card h4 {
        font-size: 9.7px !important;
        line-height: 1.15 !important;
      }
      #combat .flip-card.paskus-unit-sierra h4,
      #combat .flip-card.paskus-unit-pathfinder h4,
      #combat .flip-card.paskus-unit-sentinel h4 {
        font-size: 9.1px !important;
      }
      #combat .paskus-unit-role {
        max-width: 100%;
        justify-content: center;
        font-size: 6.8px !important;
        line-height: 1.15;
        padding: 4px 6px;
        text-align: center;
        white-space: normal;
      }
      #combat .paskus-unit-active-pill {
        font-size: 6.7px;
        padding: 5px 6px;
      }
      #combat .paskus-unit-roster {
        gap: 7px;
      }
      #combat .paskus-unit-roster__copy {
        font-size: 8px !important;
        line-height: 1.35 !important;
      }
      #combat .paskus-unit-roster__head {
        gap: 8px;
        padding-top: 7px;
      }
      #combat .paskus-unit-roster__head span {
        font-size: 6.8px;
      }
      #combat .paskus-unit-roster__head strong {
        font-size: 13px;
      }
      #combat .paskus-unit-roster__grid {
        grid-auto-columns: minmax(96px, 1fr);
        grid-template-rows: repeat(4, minmax(25px, auto));
        gap: 5px;
      }
      #combat .paskus-unit-member {
        min-height: 25px;
        border-radius: 7px;
        font-size: 7.2px;
        padding: 4px 5px;
      }
      #combat .paskus-unit-roster__empty {
        border-radius: 9px;
        font-size: 7.5px;
        padding: 8px;
      }
      #combat .flip-card p,
      #support .flip-card p {
        font-size: 9.2px !important;
        line-height: 1.36 !important;
      }
      #combat .flip-card a[href^="/unit/"],
      #support .paskus-support-detail-link {
        min-height: 28px;
        border-radius: 9px;
        font-size: 7.6px;
        padding: 0 6px;
      }
      #combat .flip-card.paskus-unit-sierra a[href^="/unit/"] {
        width: calc(100% - 10px);
        min-height: 27px;
        font-size: 7.4px;
        transform: translateZ(42px);
      }
      .paskus-module-heading {
        margin-bottom: 16px;
      }
      .paskus-module-stats,
      .paskus-module-grid,
      .paskus-module-detail .paskus-module-grid {
        gap: 8px;
      }
      .paskus-module-stat,
      .paskus-module-card,
      .paskus-module-panel {
        padding: 11px;
      }
      .paskus-module-stat strong {
        font-size: 22px;
      }
      .paskus-register-form {
        gap: 8px !important;
      }
      .paskus-register-form input,
      .paskus-register-form select,
      .paskus-register-form textarea,
      .paskus-discord-id-field input {
        min-height: 40px;
        font-size: 10.5px !important;
        padding: 9px !important;
      }
      .paskus-about-page .about-hero,
      .paskus-support-detail-page .support-hero,
      .paskus-komodo-page .komodo-hero {
        padding: 88px 10px 40px;
      }
      .paskus-about-page .about-hero-inner,
      .paskus-about-page .about-section,
      .paskus-support-detail-page .support-hero-inner,
      .paskus-support-detail-page .support-section,
      .paskus-komodo-page .komodo-section {
        width: min(100%, calc(100vw - 20px));
      }
      .paskus-about-page .about-grid,
      .paskus-about-page .about-grid.three,
      .paskus-support-detail-page .support-grid,
      .paskus-support-detail-page .support-priority-grid,
      .paskus-komodo-page .komodo-grid {
        gap: 8px;
      }
      .paskus-about-page .about-card,
      .paskus-about-page .about-stat,
      .paskus-about-page .about-step,
      .paskus-support-detail-page .support-card,
      .paskus-komodo-page .komodo-info-card {
        padding: 11px;
      }
      .paskus-seo-footer {
        padding: 34px 10px 30px !important;
      }
      .paskus-seo-footer__inner {
        gap: 12px 8px;
      }
      .paskus-seo-footer__links a {
        min-height: 28px;
        font-size: 9px;
        padding: 6px 7px;
      }
    }
    @media (max-width: 720px) {
      .paskus-cs-ai {
        right: 10px;
        bottom: 10px;
        width: min(352px, calc(100vw - 20px));
      }
      .paskus-cs-ai:not(.is-open) {
        width: auto;
      }
      .paskus-cs-ai-toggle {
        min-height: 48px;
        min-width: 48px;
        padding: 6px;
      }
      .paskus-cs-ai-toggle > span {
        display: none;
      }
      .paskus-cs-ai-toggle img {
        width: 34px;
        height: 34px;
      }
      .paskus-cs-ai-panel {
        max-height: calc(100dvh - 20px);
        border-radius: 18px;
      }
      .paskus-cs-ai-log {
        max-height: min(48dvh, 340px);
        padding: 10px;
      }
      .paskus-cs-ai-message {
        max-width: 96%;
        font-size: 11.5px;
      }
      .paskus-cs-ai-form {
        grid-template-columns: 1fr;
        gap: 7px;
        padding: 10px;
      }
      .paskus-cs-ai-form input,
      .paskus-cs-ai-form button {
        min-height: 40px;
      }
      .paskus-cs-ai-note {
        font-size: 8.5px;
        padding: 0 10px 10px;
      }
    }
    @media (max-width: 340px) {
      #combat .grid,
      #support .grid,
      .paskus-module-stats,
      .paskus-module-grid,
      .paskus-module-detail .paskus-module-grid,
      .paskus-about-page .about-grid,
      .paskus-about-page .about-grid.three,
      .paskus-support-detail-page .support-grid,
      .paskus-komodo-page .komodo-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(styles);
  markUnitDetailWallpaper();

  function returnPath() {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  function loginHref() {
    return `${LOGIN_URL}&return=${encodeURIComponent(returnPath())}`;
  }

  function logoutHref() {
    return `${LOGOUT_URL}&return=${encodeURIComponent(window.location.pathname || "/")}`;
  }

  const MODULE_COPY = {
    homeLead: "PASKUS Gi1 | So-791 berdiri sebagai resimen BRM5 roleplay Indonesia yang menata anggota melalui disiplin komando, komunikasi satu kanal, evaluasi karakter, dan penempatan berbasis kemampuan. Unit khusus, dinas pendukung, event operasi, streamer hub, pendaftaran personel, dan Discord resmi menjadi satu ekosistem agar setiap anggota memahami tugas, jalur berkembang, serta standar roleplay resimen.",
    overview: [
      {
        title: "Latar Belakang",
        body: "Perbedaan pengalaman tempur menjadi tolak ukur penting dalam menilai kesiapan prajurit. Komunikasi, struktur tugas, komando, dan konsistensi menjadi dasar apakah individu cocok masuk ke unit atau dinas yang dipilih.",
      },
      {
        title: "Strategi dan Prioritas",
        body: "Setiap unit khusus dan dinas memiliki fokus, disiplin, karakter, serta strategi yang berbeda. Penempatan terbaik lahir dari kerja sama, adaptasi, dan kecocokan individu terhadap budaya tugas di dalam satuan.",
      },
      {
        title: "Alur Pendaftaran",
        body: "Individu yang siap berkomitmen akan melalui wawancara, uji kemampuan, uji karakter dan bakat, lalu masa pra-dinas. Alur ini menjaga agar pilihan tugas dijalankan secara berkelanjutan.",
      },
      {
        title: "Event dan Operasi",
        body: "Kegiatan mencakup PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, dan External PVP. Skenario disusun untuk membangun strategi, pengalaman taktis, dan kualitas roleplay.",
      },
    ],
    events: [
      {
        title: "PVE Vanilla Scenario",
        body: "Misi berbasis Map Vanilla Ronograd untuk menguatkan pengalaman taktis, koordinasi, dan roleplay semi sampai hardcore.",
      },
      {
        title: "PVE Custom Scenario",
        body: "Misi custom yang dibuat untuk memenuhi aspek strategi. Beberapa skenario dapat terinspirasi dari kejadian nyata agar pengalaman operasi terasa lebih hidup.",
      },
      {
        title: "Internal PVP",
        body: "Kegiatan fun deathmatch atau competitive 5v5, 10v10, sampai 15v15 yang dijalankan di map custom oleh koordinator event.",
      },
      {
        title: "External PVP",
        body: "Competitive match bersama resimen atau komunitas lain untuk menguji taktik, disiplin, dan kerja sama lintas satuan.",
      },
    ],
    golongan: [
      {
        title: "Golongan 1",
        body: "Penjadwalan untuk pagi sampai siang menjelang sore. Pilihan ini cocok untuk anggota yang aktif di rentang awal hari.",
      },
      {
        title: "Golongan 2",
        body: "Penjadwalan untuk sore sampai malam. Pilihan ini cocok untuk anggota yang lebih aktif setelah jam siang.",
      },
    ],
    support: {
      staff: {
        title: "SEKSI 1",
        slug: "staff-komando",
        back: "INDUK NON-TEMPUR",
        category: "Command Staff & Regimental Administration",
        color: "#efbf04",
        rank: "Rahasia",
        task: "Pusat Arahan, Event, Evaluasi, Jadwal, Dan Validasi Data",
        aspect: "Rekrutmen rahasia dan hanya dari Kepala Resimen. Tidak membuka pendaftaran umum.",
        body: "SEKSI 1 adalah otak resimen dan pengurus besar PASKUS. Dinas ini menjadi pusat arahan, event, evaluasi, jadwal, validasi data, dan koordinasi seluruh non-tempur.",
        hero: "SEKSI 1 adalah otak dari resimen dan pengurus besar PASKUS. Sebagai pusat dari seluruh unit non-tempur, Seksi 1 menjaga arah komando, ritme event, evaluasi, jadwal, validasi data, dan ketertiban administrasi resimen.",
        doctrineTitle: "Otak Resimen Dan Pusat Pengurus Besar PASKUS",
        doctrine: "SEKSI 1 menjalankan fungsi inti sebagai pusat pengelolaan non-tempur. Wewenangnya mencakup memberi arahan, membuat event, memberi evaluasi, menindak pelanggaran ringan, mengatur jadwal, serta melakukan validasi data. Rekrutmen Seksi 1 bersifat rahasia dan hanya dapat dilakukan dari Kepala Resimen, sehingga tidak ada jalur pendaftaran umum untuk posisi ini.",
        cards: [
          ["Pusat Arahan", "Memberikan arahan operasional non-tempur agar unit, dinas, dan kegiatan resimen berjalan dalam satu garis komando."],
          ["Event Dan Evaluasi", "Membuat event, menjaga ritme kegiatan, memberikan evaluasi, dan memastikan pelaksanaan tetap tertib serta proporsional."],
          ["Jadwal Dan Validasi", "Mengatur jadwal, melakukan validasi data, dan menjaga administrasi agar keputusan resimen memiliki dasar yang rapi."],
          ["Rekrutmen Rahasia", "Tidak membuka pendaftaran umum. Rekrutmen hanya berasal dari Kepala Resimen sesuai kebutuhan dan penilaian internal."],
        ],
        priorities: ["Kepercayaan komando", "Ketegasan terukur", "Administrasi rapi", "Kedewasaan evaluasi"],
        route: "Syarat masuk Seksi 1 bersifat rahasia. Rekrutmen hanya dari Kepala Resimen dan tidak tersedia melalui pendaftaran umum.",
        footer: "SEKSI 1 / PENGURUS BESAR NON-TEMPUR So-791",
        logoText: "I",
      },
      dpdm: {
        title: "DPDM",
        slug: "dpdm",
        back: "POLISI MILITER",
        category: "Military Police & Legal Enforcement",
        color: "#d2b45b",
        rank: "Personel Terpercaya",
        task: "Menegakkan Hukum Dan Ketaatan Resimen",
        aspect: "Mengatur aturan, menjaga kepatuhan, melakukan penyelidikan, dan memastikan hukum roleplay berjalan adil.",
        body: "Dinas penegak hukum resimen yang mengatur peraturan, ketaatan, penyelidikan, dan fungsi polisi militer dalam roleplay So-791.",
        hero: "DPDM adalah garda depan hukum So-791. Dinas ini menjaga aturan, ketaatan, dan ketertiban roleplay melalui fungsi polisi militer yang berwenang melakukan penyelidikan serta menegakkan hukum resimen.",
        doctrineTitle: "Garda Depan Hukum Dan Ketertiban Resimen",
        doctrine: "DPDM mengatur hukum yang berlaku, memastikan peraturan ditaati, dan menjaga ketertiban di dalam roleplay. Sebagai polisi militer resimen, DPDM memiliki ruang tugas untuk melakukan penyelidikan, membaca pelanggaran, mengumpulkan keterangan, dan menegakkan keputusan hukum secara tegas namun proporsional.",
        cards: [
          ["Penegakan Aturan", "Menjaga hukum resimen tetap berjalan jelas, tertib, dan dapat dipahami oleh anggota dalam setiap aktivitas roleplay."],
          ["Penyelidikan Roleplay", "Mengumpulkan keterangan, membaca indikasi pelanggaran, dan menyusun dasar keputusan tanpa mengabaikan prosedur."],
          ["Ketertiban Resimen", "Menjadi garda depan kepatuhan agar disiplin, etika, dan keamanan komunitas tetap terjaga."],
        ],
        priorities: ["Integritas hukum", "Ketegasan proporsional", "Ketelitian investigasi", "Ketaatan prosedur"],
        route: "Penilaian difokuskan pada integritas, kedewasaan mengambil keputusan, ketelitian membaca pelanggaran, komunikasi, dan ketegasan menjaga aturan roleplay.",
        footer: "DPDM / POLISI MILITER So-791",
        logo: DPDM_LOGO_URL,
        cardBackground: DPDM_CARD_BG_URL,
        wallpaper: DPDM_WALLPAPER_URL,
      },
      pusdiklat: {
        title: "PUSDIKLAT",
        slug: "pusdiklat",
        back: "PELATIH & ASISTEN PELATIH",
        category: "Training & Doctrine Development",
        color: "#9dc183",
        rank: "Prajurit Senior - Bintara",
        task: "Melatih Individu",
        aspect: "Mempraktikkan keilmuan strategi dan kedisiplinan yang tinggi.",
        body: "Dinas prajurit senior sampai bintara yang melatih individu, mempraktikkan keilmuan strategi, dan menjaga standar kedisiplinan tinggi.",
        hero: "PUSDIKLAT menjadi pusat pelatihan dan pembentukan doktrin dasar. Dinas ini mengasah kemampuan individu, menurunkan pengetahuan strategi, dan menjaga standar kedisiplinan So-791.",
        doctrineTitle: "Pusat Pendidikan, Latihan, Dan Disiplin",
        doctrine: "Modul menempatkan Pelatih dan Asisten Pelatih sebagai dinas bagi prajurit senior sampai bintara yang melatih individu. Fokusnya adalah praktik keilmuan strategi, pembiasaan disiplin tinggi, dan pembentukan anggota agar siap masuk ke struktur tugas yang lebih spesifik.",
        cards: [
          ["Pembinaan Individu", "Membimbing anggota agar memahami struktur tugas, komunikasi, etika latihan, dan kesiapan dasar sebelum berdinas lebih jauh."],
          ["Praktik Strategi", "Mengubah teori menjadi latihan terarah sehingga peserta mampu membaca situasi dan bekerja dalam rencana operasi."],
          ["Standar Disiplin", "Menjaga kebiasaan latihan, kepatuhan instruksi, dan kualitas sikap selama proses pendidikan berlangsung."],
        ],
        priorities: ["Disiplin tinggi", "Keilmuan strategi", "Kesabaran melatih", "Ketegasan terukur"],
        route: "Standar pangkat: Prajurit Senior sampai Bintara. Penilaian difokuskan pada kemampuan melatih, memahami strategi, dan menjaga kedisiplinan.",
        footer: "PUSDIKLAT / DINAS NON-TEMPUR So-791",
      },
      propaganda: {
        title: "PROPAGANDA",
        slug: "propaganda",
        back: "PROPAGANDA",
        category: "Documentation & Media Operations",
        color: "#daad52",
        rank: "Prajurit Senior - Bintara",
        task: "Membuat Dokumentasi Untuk Disebarluaskan",
        aspect: "Kreatif dalam pengambilan dokumentasi dan bermotivasi tinggi membuat konten menarik.",
        body: "Dinas kreatif yang membuat dokumentasi untuk disebarluaskan, mengolah momen operasi, dan membangun konten yang menarik bagi resimen.",
        hero: "PROPAGANDA adalah dinas kreatif So-791 yang mengabadikan operasi, mengolah dokumentasi, dan menyebarkan cerita resimen dalam bentuk konten yang rapi, hidup, dan menarik.",
        doctrineTitle: "Dokumentasi Operasi Dan Narasi Komunitas",
        doctrine: "Sesuai modul, PROPAGANDA berfokus pada dokumentasi untuk disebarluaskan. Personelnya membutuhkan kreativitas dalam pengambilan momen, motivasi tinggi dalam produksi konten, serta kepekaan memilih sudut cerita yang dapat memperkuat identitas resimen.",
        cards: [
          ["Dokumentasi Lapangan", "Mengambil momen operasi, latihan, dan event komunitas dengan komposisi yang jelas dan mudah dipakai untuk publikasi."],
          ["Produksi Konten", "Mengolah dokumentasi menjadi materi yang menarik, informatif, dan tetap menjaga citra profesional So-791."],
          ["Arsip Visual", "Merapikan arsip kegiatan agar perjalanan resimen dapat dilihat kembali dan digunakan sebagai bahan komunikasi komunitas."],
        ],
        priorities: ["Kreativitas visual", "Motivasi tinggi", "Ketelitian arsip", "Rasa narasi"],
        route: "Standar pangkat: Prajurit Senior sampai Bintara. Penilaian difokuskan pada kreativitas, konsistensi produksi, dan tanggung jawab publikasi.",
        footer: "PROPAGANDA / DINAS NON-TEMPUR So-791",
      },
      zeni: {
        title: "ZENI TEMPUR",
        slug: "zeni-tempur",
        back: "ZENI TEMPUR",
        category: "Scenario & Map Engineering",
        color: "#a8b3a2",
        rank: "Prajurit Senior - Bintara",
        task: "Membangun Scenario & Map",
        aspect: "Kreatif, imajinatif, dan bertanggung jawab dalam area tugas.",
        body: "Dinas kreatif dan imajinatif yang membangun skenario serta map, dengan tanggung jawab penuh terhadap area tugas yang dibuat.",
        hero: "ZENI TEMPUR adalah dinas pembangun skenario dan map yang memberi ruang operasi bagi So-791. Dinas ini merancang area, objektif, dan alur agar event terasa taktis, hidup, serta layak dimainkan.",
        doctrineTitle: "Rekayasa Skenario Dan Area Operasi",
        doctrine: "Modul menegaskan ZENI TEMPUR sebagai dinas yang membangun scenario dan map. Peran ini membutuhkan kreativitas, imajinasi, dan tanggung jawab tinggi terhadap area tugas karena kualitas medan menentukan kelancaran roleplay, latihan, dan operasi.",
        cards: [
          ["Scenario Build", "Menyusun alur operasi, objektif, dan kebutuhan medan agar event memiliki arah strategis yang jelas."],
          ["Map Responsibility", "Membangun dan merawat area tugas dengan memperhatikan akses, ritme pergerakan, dan kebutuhan roleplay."],
          ["Operational Immersion", "Menciptakan lingkungan yang mendukung pengalaman taktis, dari latihan sampai skenario custom berskala besar."],
        ],
        priorities: ["Kreatif", "Imajinatif", "Tanggung jawab area", "Paham kebutuhan event"],
        route: "Standar pangkat: Prajurit Senior sampai Bintara. Penilaian difokuskan pada kreativitas skenario, tanggung jawab map, dan kesiapan bekerja untuk kebutuhan event.",
        footer: "ZENI TEMPUR / DINAS NON-TEMPUR So-791",
      },
    },
    units: {
      "bringas": {
        title: "BRINGAS",
        category: "Darat / Heavy Duty Unit",
        color: "#e7d400",
        hero: "Pasukan tempur utama infanteri mekanis yang berspesialisasi dalam kavaleri ringan dengan klasifikasi APC, AV, dan IFV. BRINGAS membawa daya tembak berat, perlindungan infanteri, dan kemampuan mobilisasi cepat untuk kondisi darurat di medan operasi.",
        doctrineTitle: "Daya Tembak Berat Dan Mobilitas Mekanis",
        doctrine: "BRINGAS dilatih untuk memusnahkan musuh dengan senjata berat dan kendaraan tempur, sekaligus memberi perlindungan kepada infanteri ketika situasi menuntut perpindahan cepat dan efisien. Individu yang masuk perlu adaptif di lingkungan keras, dinamis, dan dapat diandalkan.",
        cards: [
          ["APC / AV / IFV", "Menguasai platform kendaraan lapis baja untuk membawa personel, menahan tekanan, dan membuka ruang gerak bagi infanteri."],
          ["Fire Support", "Menghadirkan daya tembak dahsyat untuk menghancurkan titik tahan musuh dan mengurangi risiko bagi pasukan darat."],
          ["Rapid Protection", "Memberikan perlindungan dan mobilisasi cepat saat infanteri harus bergerak keluar dari kondisi darurat."],
        ],
        priorities: ["Adaptasi dalam tekanan tinggi", "Kedisiplinan saat bermobilisasi", "Daya tahan di lingkungan keras", "Figur yang dinamis dan dapat diandalkan"],
        route: "Wawancara, uji kemampuan kendaraan, uji karakter, lalu masa pra-dinas.",
        footer: "SIAP MENJADI DAYA PUKUL MEKANIS?",
      },
      "toruk-makto": {
        title: "TORUK MAKTO",
        category: "Sky Lord / Air Specialization Unit",
        color: "#ff2424",
        hero: "Lord of the Sky. TORUK MAKTO adalah unit udara yang berfokus pada penyisipan udara cepat, eksfiltrasi, CAS, CASEVAC, pasukan parasut, lintas udara, dan pilot terbaik yang dimiliki So-791.",
        doctrineTitle: "Presisi Udara Tanpa Toleransi Kesalahan",
        doctrine: "Operasi udara bersifat vital dan tidak memberi ruang bagi kesalahan. Karena itu, personel TORUK MAKTO harus disiplin, presisi, adaptif, serta mampu menggabungkan kemampuan piloting, menembak, dan pengambilan keputusan cepat.",
        cards: [
          ["Fast Insertion", "Melakukan penyisipan udara cepat untuk memasukkan personel ke titik operasi dengan ritme yang efisien."],
          ["CAS / CASEVAC", "Mendukung pasukan darat lewat dukungan udara jarak dekat dan evakuasi korban dari zona tempur."],
          ["Airborne Path", "Membuka peluang pasukan parasut dan lintas udara bagi personel yang siap bertugas dalam operasi udara."],
        ],
        priorities: ["Disiplin tinggi", "Presisi piloting dan tembakan", "Adaptasi kuat", "Tidak toleran terhadap kesalahan operasi"],
        route: "Wawancara, uji kemampuan udara, uji karakter, lalu masa pra-dinas.",
        footer: "SIAP MENJADI LORD OF THE SKY?",
      },
      "pathfinder": {
        title: "PATHFINDER",
        category: "Ranger and Scout Unit",
        color: "#daad52",
        hero: "Infantri pengintai The Ranger & Scout yang mengkhususkan diri dalam pengintaian, pengawasan, keahlian menembak, dan komunikasi tajam untuk meningkatkan efektivitas operasi So-791.",
        doctrineTitle: "Pengawasan, Kesabaran, Dan Tembakan Presisi",
        doctrine: "PATHFINDER menyediakan kemampuan pengawasan dan hasil intelijen yang menentukan keberlangsungan operasi. Personelnya harus disiplin, presisi, sabar, serta memiliki kemampuan penembakan dan komunikasi yang baik.",
        cards: [
          ["Recon Watch", "Mengawasi medan, membaca pergerakan, dan memberikan hasil pengintaian yang berguna bagi komando."],
          ["Marksmanship", "Mengandalkan kemampuan tembak yang tajam untuk menjaga jarak, akurasi, dan kontrol area."],
          ["Tactical Signal", "Menjaga komunikasi pengintai agar informasi dari lapangan tetap jelas, cepat, dan dapat dipakai unit utama."],
        ],
        priorities: ["Kesabaran tinggi", "Presisi observasi", "Kemampuan menembak", "Komunikasi tajam"],
        route: "Wawancara, uji kemampuan pengintaian, uji karakter, lalu masa pra-dinas.",
        footer: "SIAP MEMBUKA JALAN OPERASI?",
      },
      "sierra": {
        title: "SIERRA",
        category: "Infiltration and Tactical Sabotage Unit",
        color: "#d9c37a",
        hero: "SIERRA adalah divisi infanteri khusus yang bergerak senyap, tajam, dan terukur untuk membuka celah operasi, mengacaukan struktur lawan, serta menyelesaikan sasaran bernilai tinggi tanpa kehilangan kendali komando.",
        doctrineTitle: "Senyap Dalam Gerak, Tegas Dalam Eksekusi",
        doctrine: "SIERRA dibentuk sebagai wajah baru dari unit sabotase taktis PASKUS Gi1. Fokusnya berada pada infiltrasi, observasi jarak dekat, manuver tim kecil, dan eksekusi cepat yang tetap disiplin. Setiap pergerakan harus rapi, tidak gaduh, dan menghasilkan dampak langsung bagi operasi utama.",
        cards: [
          ["Silent Entry", "Masuk ke area sasaran dengan gerak rendah suara, membaca celah, dan menyiapkan ruang aksi untuk tim utama."],
          ["Tactical Disruption", "Mengganggu fasilitas, ritme, dan konsentrasi lawan melalui aksi sabotase yang cepat serta terarah."],
          ["Precision Cell", "Beroperasi sebagai sel kecil yang menuntut komunikasi singkat, keputusan matang, dan disiplin eksekusi."],
        ],
        priorities: ["Gerak senyap", "Kontrol emosi", "Keputusan presisi", "Koordinasi sel kecil"],
        route: "Wawancara, uji infiltrasi taktis, uji komunikasi tim kecil, uji karakter, lalu masa pra-dinas.",
        footer: "SIERRA / SILENT DISRUPTION CELL So-791",
      },
      "sentinel": {
        title: "SENTINEL",
        category: "Combat Medic Unit",
        color: "#da3638",
        hero: "Tenaga medis tempur yang berspesialisasi dalam pertolongan pertama di medan pertempuran aktif, mendukung resimen dengan perlengkapan medis, kebutuhan logistik, dan kendaraan lapis baja medis.",
        doctrineTitle: "Moral, Medis, Dan Logistik Di Garis Hidup",
        doctrine: "SENTINEL menjaga keberlangsungan operasi dengan pertolongan pertama, koordinasi, komunikasi, dan dukungan logistik. Individu yang masuk perlu fokus, disiplin, bermoral tinggi, dan termotivasi membantu rekan seperjuangan.",
        cards: [
          ["First Response", "Memberikan pertolongan pertama di medan aktif untuk menjaga personel tetap dapat dievakuasi atau distabilkan."],
          ["Armored Medical", "Mendukung evakuasi dan mobilitas kebutuhan medis melalui kendaraan lapis baja medis."],
          ["Logistic Care", "Mengefisienkan perlengkapan medis dan logistik agar operasi tetap berjalan tanpa kehilangan daya dukung."],
        ],
        priorities: ["Fokus kuat", "Koordinasi dan komunikasi", "Motivasi membantu rekan", "Moral dan disiplin tinggi"],
        route: "Wawancara, uji kemampuan medis, uji karakter, lalu masa pra-dinas.",
        footer: "SIAP MENJADI GARIS HIDUP OPERASI?",
      },
      "gatam": {
        title: "GATAM",
        category: "Infiltration and Stealth Unit",
        color: "#a6ab9a",
        hero: "GATAM atau Garuda Hitam adalah unit pasukan khusus yang berspesialisasi dalam operasi rahasia, bekerja independen untuk mengamankan posisi strategis, melenyapkan target, atau membebaskan kompleks.",
        doctrineTitle: "Operasi Rahasia Dengan Presisi Tanpa Celah",
        doctrine: "GATAM menuntut fokus kuat, koordinasi dan komunikasi tinggi, motivasi penyelesaian yang besar, serta adaptasi di lingkungan penuh tekanan. Satu kesalahan dapat menggagalkan keseluruhan operasi.",
        cards: [
          ["Stealth Entry", "Masuk ke area operasi secara senyap untuk membuka peluang pengamanan posisi strategis."],
          ["Strategic Control", "Mengamankan titik penting dan menjaga ruang gerak komando dalam operasi rahasia."],
          ["Target Resolution", "Melenyapkan target atau membebaskan kompleks dengan disiplin dan presisi tinggi."],
        ],
        priorities: ["Fokus kuat", "Koordinasi dan komunikasi", "Adaptasi dalam tekanan", "Tidak toleran terhadap kesalahan"],
        route: "Wawancara, uji kemampuan infiltrasi, uji karakter, lalu masa pra-dinas.",
        footer: "SIAP BERGERAK DALAM OPERASI RAHASIA?",
      },
    },
  };

  const ABOUT_COPY = {
    metaTitle: "Tentang PASKUS Gi1 | So-791",
    heroKicker: "About PASKUS Gi1",
    heroTitle: "PASKUS Gi1",
    heroSubtitle: "Identity, Culture, Command",
    hero: "Halaman ini menjadi ruang pengenalan identitas resimen: bagaimana komunitas menjaga disiplin, komunikasi, dan budaya bermain yang rapi tanpa mengulang daftar unit, dinas, alur pendaftaran, atau event yang sudah tersedia di halaman utama.",
    actions: ["Kembali Ke Home", "Enlist Personnel", "Join Discord"],
    focusTitle: "Fokus Halaman",
    identity: "PASKUS Gi1 dibangun sebagai komunitas taktis yang mengutamakan pengalaman bermain yang tertib, komunikatif, dan berkarakter. Fokus utamanya bukan hanya menang dalam skenario, tetapi membentuk kebiasaan anggota agar mampu bekerja dalam komando, menghargai rekan, dan membawa suasana roleplay yang nyaman untuk jangka panjang.",
    identityKicker: "Identitas Resimen",
    identityTitle: "Rapi Dalam Komando, Nyaman Dalam Komunitas",
    focusPanel: [
      ["Identitas", "Profil ringkas komunitas, gaya komunikasi, dan standar sikap anggota."],
      ["Budaya", "Cara kami menjaga disiplin tanpa membuat interaksi terasa kaku atau tidak manusiawi."],
      ["Akses Cepat", "Pengarah ke section home untuk unit, dinas, enlist, dan Discord tanpa mengulang kontennya."],
    ],
    culture: [
      {
        title: "Komando Yang Terbaca",
        body: "Instruksi dibuat jelas, ringkas, dan mudah diikuti agar anggota baru maupun lama dapat memahami ritme kegiatan tanpa kebingungan.",
      },
      {
        title: "Disiplin Yang Manusiawi",
        body: "Kedisiplinan dijaga sebagai kebiasaan bermain, bukan sekadar formalitas. Tegas saat bertugas, tetap sehat saat berinteraksi.",
      },
      {
        title: "Komunikasi Satu Kanal",
        body: "Koordinasi dijaga agar informasi penting tidak tenggelam. Anggota dibiasakan memberi laporan yang singkat, relevan, dan dapat ditindaklanjuti.",
      },
      {
        title: "Ruang Berkembang",
        body: "Setiap anggota diberi ruang menemukan kecocokan peran melalui observasi, latihan, dan kontribusi yang konsisten.",
      },
    ],
    experienceKicker: "Pengalaman Anggota",
    experienceTitle: "Ritme Yang Membantu Anggota Baru Cepat Nyambung",
    experienceIntro: "Bagian ini menjelaskan suasana perjalanan anggota secara umum. Detail pendaftaran, unit, dinas, dan event tetap ditempatkan di home agar informasi utama tidak tersebar dua kali.",
    experience: [
      ["01", "Masuk Dan Mengenal Kultur", "Anggota diarahkan memahami etika komunikasi, cara membaca instruksi, dan kebiasaan dasar di lingkungan PASKUS."],
      ["02", "Ikut Kegiatan Dengan Ritme", "Kegiatan dijalani bertahap agar anggota terbiasa dengan briefing, koordinasi, dan sikap saat berada di dalam skenario."],
      ["03", "Tunjukkan Konsistensi", "Keaktifan, sikap, dan kemampuan bekerja sama menjadi sinyal utama sebelum anggota diarahkan ke jalur lanjutan."],
      ["04", "Pilih Arah Kontribusi", "Setelah memahami kultur, anggota dapat melihat pilihan unit, dinas, atau pendaftaran melalui halaman utama."],
    ],
    continueKicker: "Lanjutkan Dari Home",
    continueTitle: "Akses Cepat Tanpa Mengulang Informasi",
    continueIntro: "Home tetap menjadi pusat informasi detail. About hanya memberi konteks budaya dan arah navigasi supaya halaman terasa ringan, fokus, dan tidak berulang.",
    homeLinks: [
      {
        title: "Enlist Personnel",
        body: "Gunakan bagian pendaftaran di home untuk mengirim data awal anggota secara resmi.",
        href: "/#enlist",
        label: "Buka Enlist",
      },
      {
        title: "Unit Tempur",
        body: "Detail card, spesialisasi, dan halaman unit tetap berada di section Unit Tempur home.",
        href: "/#combat",
        label: "Lihat Unit",
      },
      {
        title: "Dinas Non-Tempur",
        body: "Informasi dinas dan detail page non-tempur dapat dibuka dari section Dinas di home.",
        href: "/#support",
        label: "Lihat Dinas",
      },
      {
        title: "Discord Hub",
        body: "Masuk ke Discord untuk komunikasi, koordinasi kegiatan, dan sinkronisasi identitas.",
        href: "https://discord.gg/aaBR9ruFva",
        label: "Join Discord",
      },
    ],
  };

  const ABOUT_TRANSLATIONS = {
    id: ABOUT_COPY,
    fil: {
      metaTitle: "Tungkol sa PASKUS Gi1 | So-791",
      heroKicker: "Tungkol sa PASKUS Gi1",
      heroTitle: "PASKUS Gi1",
      heroSubtitle: "Pagkakakilanlan, Kultura, Komando",
      hero: "Ipinapakilala ng pahinang ito ang pagkakakilanlan ng resimen: paano pinapanatili ng komunidad ang disiplina, malinaw na komunikasyon, at maayos na kultura ng paglalaro nang hindi inuulit ang listahan ng unit, dinas, pagpaparehistro, o event sa home page.",
      actions: ["Bumalik Sa Home", "Enlist Personnel", "Join Discord"],
      focusTitle: "Pokus Ng Pahina",
      identityKicker: "Pagkakakilanlan Ng Resimen",
      identityTitle: "Maayos Sa Komando, Komportable Sa Komunidad",
      identity: "Ang PASKUS Gi1 ay itinayo bilang taktikal na komunidad na inuuna ang maayos, komunikatibo, at may karakter na karanasan sa paglalaro. Hindi lang panalo sa scenario ang layunin, kundi ang paghubog ng gawi ng miyembro para makasunod sa komando, rumespeto sa kasamahan, at magdala ng komportableng roleplay sa mahabang panahon.",
      focusPanel: [
        ["Pagkakakilanlan", "Maikling profile ng komunidad, istilo ng komunikasyon, at pamantayan ng asal ng miyembro."],
        ["Kultura", "Paano pinapanatili ang disiplina nang hindi ginagawang matigas o hindi makatao ang interaksyon."],
        ["Mabilis Na Access", "Direksyon papunta sa home section para sa unit, dinas, enlist, at Discord nang hindi inuulit ang content."],
      ],
      culture: [
        { title: "Nababasa Ang Komando", body: "Malinaw, maikli, at madaling sundan ang instruksiyon para maunawaan ng bago at lumang miyembro ang ritmo ng gawain." },
        { title: "Makataong Disiplina", body: "Ang disiplina ay hinuhubog bilang gawi sa paglalaro, hindi lang pormalidad. Mahigpit sa tungkulin, maayos sa pakikisalamuha." },
        { title: "Iisang Kanal Ng Komunikasyon", body: "Pinapanatiling malinaw ang koordinasyon para hindi mawala ang mahalagang impormasyon. Maikli, relevant, at actionable ang ulat." },
        { title: "Espasyo Para Umunlad", body: "May puwang ang bawat miyembro na hanapin ang akmang papel sa pamamagitan ng obserbasyon, latihan, at tuloy-tuloy na ambag." },
      ],
      experienceKicker: "Karanasan Ng Miyembro",
      experienceTitle: "Ritmong Tumutulong Sa Bagong Miyembro Na Makasabay",
      experienceIntro: "Ipinapakita ng bahaging ito ang pangkalahatang takbo ng paglalakbay ng miyembro. Ang detalye ng pendaftaran, unit, dinas, at event ay nananatili sa home.",
      experience: [
        ["01", "Pumasok At Kilalanin Ang Kultura", "Ginagabayan ang miyembro sa etikang pangkomunikasyon, pagbasa ng instruksiyon, at pangunahing gawi sa PASKUS."],
        ["02", "Sumali Sa Gawain Na May Ritmo", "Dahan-dahang sinasanay ang miyembro sa briefing, koordinasyon, at asal sa scenario."],
        ["03", "Ipakita Ang Konsistensi", "Aktibidad, ugali, at kooperasyon ang pangunahing senyales bago idirekta sa mas advanced na landas."],
        ["04", "Piliin Ang Ambag", "Pagkatapos maunawaan ang kultura, makikita ng miyembro ang pagpipilian sa unit, dinas, o pendaftaran sa home page."],
      ],
      continueKicker: "Magpatuloy Mula Home",
      continueTitle: "Mabilis Na Access Nang Hindi Inuulit Ang Impormasyon",
      continueIntro: "Nananatiling sentro ng detalye ang home. Ang About ay nagbibigay lamang ng konteksto sa kultura at direksyon ng navigasyon.",
      homeLinks: [
        { title: "Enlist Personnel", body: "Gamitin ang pendaftaran sa home para opisyal na ipadala ang unang data ng miyembro.", href: "/#enlist", label: "Buksan Enlist" },
        { title: "Combat Units", body: "Ang detail card, specialization, at unit page ay nasa Unit Tempur section ng home.", href: "/#combat", label: "Tingnan Unit" },
        { title: "Non-Combat Services", body: "Ang impormasyon at detail page ng dinas non-tempur ay mabubuksan mula sa Dinas section.", href: "/#support", label: "Tingnan Dinas" },
        { title: "Discord Hub", body: "Pumasok sa Discord para sa komunikasyon, koordinasyon, at sync ng identity.", href: "https://discord.gg/aaBR9ruFva", label: "Join Discord" },
      ],
    },
    en: {
      metaTitle: "About PASKUS Gi1 | So-791",
      heroKicker: "About PASKUS Gi1",
      heroTitle: "PASKUS Gi1",
      heroSubtitle: "Identity, Culture, Command",
      hero: "This page introduces the regiment identity: how the community maintains discipline, clear communication, and a clean play culture without repeating the unit list, services, registration flow, or events already available on the home page.",
      actions: ["Back To Home", "Enlist Personnel", "Join Discord"],
      focusTitle: "Page Focus",
      identityKicker: "Regiment Identity",
      identityTitle: "Clear In Command, Comfortable In Community",
      identity: "PASKUS Gi1 is built as a tactical community focused on orderly, communicative, and character-driven play. The goal is not only winning scenarios, but shaping habits so members can work under command, respect teammates, and maintain a comfortable roleplay atmosphere for the long term.",
      focusPanel: [
        ["Identity", "A concise profile of the community, communication style, and member conduct standard."],
        ["Culture", "How discipline is maintained without making interaction feel stiff or inhuman."],
        ["Quick Access", "A path back to home sections for units, services, enlistment, and Discord without repeated content."],
      ],
      culture: [
        { title: "Readable Command", body: "Instructions are kept clear, brief, and easy to follow so both new and senior members understand the activity rhythm." },
        { title: "Human Discipline", body: "Discipline is treated as a play habit, not a formality. Firm while on duty, healthy while interacting." },
        { title: "One Communication Channel", body: "Coordination stays clean so important information does not sink. Reports are short, relevant, and actionable." },
        { title: "Room To Grow", body: "Every member has space to find the right role through observation, training, and consistent contribution." },
      ],
      experienceKicker: "Member Experience",
      experienceTitle: "A Rhythm That Helps New Members Connect Faster",
      experienceIntro: "This section describes the general member journey. Registration, units, services, and events remain on the home page so the main information is not repeated.",
      experience: [
        ["01", "Enter And Learn The Culture", "Members are guided through communication ethics, how to read instructions, and basic habits inside PASKUS."],
        ["02", "Join Activities With Rhythm", "Activities are introduced gradually so members get used to briefing, coordination, and scenario conduct."],
        ["03", "Show Consistency", "Activity, attitude, and teamwork are the main signals before a member is directed to the next path."],
        ["04", "Choose A Contribution Path", "After understanding the culture, members can review units, services, or registration through the home page."],
      ],
      continueKicker: "Continue From Home",
      continueTitle: "Quick Access Without Repeated Information",
      continueIntro: "Home remains the center for detailed information. About only provides cultural context and navigation direction.",
      homeLinks: [
        { title: "Enlist Personnel", body: "Use the registration section on home to submit initial member data officially.", href: "/#enlist", label: "Open Enlist" },
        { title: "Combat Units", body: "Card details, specializations, and unit pages remain in the Combat Unit section on home.", href: "/#combat", label: "View Units" },
        { title: "Non-Combat Services", body: "Service information and non-combat detail pages can be opened from the Service section.", href: "/#support", label: "View Services" },
        { title: "Discord Hub", body: "Join Discord for communication, activity coordination, and identity synchronization.", href: "https://discord.gg/aaBR9ruFva", label: "Join Discord" },
      ],
    },
    hi: {
      metaTitle: "PASKUS Gi1 के बारे में | So-791",
      heroKicker: "PASKUS Gi1 परिचय",
      heroTitle: "PASKUS Gi1",
      heroSubtitle: "पहचान, संस्कृति, कमांड",
      hero: "यह पेज रेजिमेंट की पहचान बताता है: समुदाय कैसे अनुशासन, साफ संचार, और व्यवस्थित खेल संस्कृति बनाए रखता है, बिना उन यूनिट, सेवा, पंजीकरण, या इवेंट जानकारी को दोहराए जो होम पेज पर पहले से मौजूद है.",
      actions: ["होम पर वापस", "Enlist Personnel", "Discord Join"],
      focusTitle: "पेज फोकस",
      identityKicker: "रेजिमेंट पहचान",
      identityTitle: "कमांड में साफ, समुदाय में सहज",
      identity: "PASKUS Gi1 एक सामरिक समुदाय है जो व्यवस्थित, संवादपूर्ण, और चरित्र-आधारित खेल अनुभव को प्राथमिकता देता है. लक्ष्य केवल scenario जीतना नहीं, बल्कि सदस्यों में ऐसी आदत बनाना है कि वे कमांड में काम करें, साथियों का सम्मान करें, और लंबे समय तक आरामदायक roleplay वातावरण बनाए रखें.",
      focusPanel: [
        ["पहचान", "समुदाय की संक्षिप्त प्रोफाइल, संचार शैली, और सदस्य व्यवहार मानक."],
        ["संस्कृति", "अनुशासन को ऐसा बनाए रखना कि बातचीत कठोर या अमानवीय न लगे."],
        ["त्वरित पहुंच", "यूनिट, सेवा, enlist, और Discord के लिए home section की दिशा बिना content दोहराए."],
      ],
      culture: [
        { title: "स्पष्ट कमांड", body: "निर्देश स्पष्ट, छोटे, और पालन करने में आसान रखे जाते हैं ताकि नए और पुराने सदस्य गतिविधि की लय समझ सकें." },
        { title: "मानवीय अनुशासन", body: "अनुशासन को खेल की आदत माना जाता है, केवल औपचारिकता नहीं. ड्यूटी में दृढ़, बातचीत में स्वस्थ." },
        { title: "एक संचार चैनल", body: "समन्वय साफ रखा जाता है ताकि महत्वपूर्ण जानकारी खो न जाए. रिपोर्ट छोटी, प्रासंगिक, और कार्रवाई योग्य होती है." },
        { title: "विकास की जगह", body: "हर सदस्य को observation, training, और consistent contribution से सही भूमिका खोजने की जगह मिलती है." },
      ],
      experienceKicker: "सदस्य अनुभव",
      experienceTitle: "ऐसी लय जो नए सदस्य को जल्दी जोड़ती है",
      experienceIntro: "यह भाग सदस्य यात्रा का सामान्य माहौल बताता है. Registration, unit, dinas, और event details home पर ही रहते हैं.",
      experience: [
        ["01", "प्रवेश और संस्कृति समझना", "सदस्य communication ethics, instruction पढ़ने का तरीका, और PASKUS की basic habits सीखते हैं."],
        ["02", "लय के साथ गतिविधि", "गतिविधि धीरे-धीरे दी जाती है ताकि member briefing, coordination, और scenario conduct से परिचित हो."],
        ["03", "Consistency दिखाना", "Activity, attitude, और teamwork आगे की दिशा तय करने से पहले मुख्य संकेत बनते हैं."],
        ["04", "योगदान की दिशा चुनना", "Culture समझने के बाद member home page से unit, service, या registration देख सकता है."],
      ],
      continueKicker: "Home से आगे बढ़ें",
      continueTitle: "बिना दोहराव के तेज access",
      continueIntro: "Home detail information का केंद्र रहता है. About केवल culture context और navigation direction देता है.",
      homeLinks: [
        { title: "Enlist Personnel", body: "Home के registration section से initial member data आधिकारिक रूप से भेजें.", href: "/#enlist", label: "Enlist खोलें" },
        { title: "Combat Units", body: "Card detail, specialization, और unit page home के Combat Unit section में रहते हैं.", href: "/#combat", label: "Unit देखें" },
        { title: "Non-Combat Services", body: "Non-combat service information और detail page Dinas section से खोले जा सकते हैं.", href: "/#support", label: "Dinas देखें" },
        { title: "Discord Hub", body: "Communication, coordination, और identity sync के लिए Discord में masuk.", href: "https://discord.gg/aaBR9ruFva", label: "Join Discord" },
      ],
    },
    jv: {
      metaTitle: "Babagan PASKUS Gi1 | So-791",
      heroKicker: "Babagan PASKUS Gi1",
      heroTitle: "PASKUS Gi1",
      heroSubtitle: "Identitas, Budaya, Komando",
      hero: "Kaca iki dadi papan kanggo ngenalake identitas resimen: carane komunitas njaga disiplin, komunikasi sing cetha, lan budaya main sing tertib tanpa mbaleni daftar unit, dinas, pendaftaran, utawa event sing wis ana ing home.",
      actions: ["Bali Menyang Home", "Enlist Personnel", "Mlebu Discord"],
      focusTitle: "Fokus Kaca",
      identityKicker: "Identitas Resimen",
      identityTitle: "Rapi Ing Komando, Nyaman Ing Komunitas",
      identity: "PASKUS Gi1 dibangun minangka komunitas taktis sing ngutamakake pengalaman main sing tertib, komunikatif, lan nduweni karakter. Tujuane ora mung menang ing skenario, nanging mbentuk pakulinan anggota supaya bisa makarya ing komando, ngajeni kanca, lan njaga suasana roleplay sing nyaman suwe-suwe.",
      focusPanel: [
        ["Identitas", "Profil ringkes komunitas, gaya komunikasi, lan standar sikap anggota."],
        ["Budaya", "Carane njaga disiplin tanpa nggawe interaksi krasa kaku utawa ora manusiawi."],
        ["Akses Cepet", "Pituduh menyang section home kanggo unit, dinas, enlist, lan Discord tanpa mbaleni konten."],
      ],
      culture: [
        { title: "Komando Sing Cetha", body: "Instruksi digawe cetha, ringkes, lan gampang dituruti supaya anggota anyar lan lawas ngerti irama kegiatan." },
        { title: "Disiplin Sing Manusiawi", body: "Kedisiplinan dijaga minangka pakulinan main, dudu mung formalitas. Tegas nalika tugas, tetep sehat nalika sesambungan." },
        { title: "Komunikasi Siji Kanal", body: "Koordinasi dijaga supaya informasi penting ora kelelep. Laporan kudu cekak, relevan, lan bisa ditindaklanjuti." },
        { title: "Papan Kanggo Ngrembaka", body: "Saben anggota duwe ruang kanggo nemokake peran sing cocok liwat observasi, latihan, lan kontribusi sing ajeg." },
      ],
      experienceKicker: "Pengalaman Anggota",
      experienceTitle: "Irama Sing Mbantu Anggota Anyar Cepet Nyambung",
      experienceIntro: "Bagian iki nerangake perjalanan anggota kanthi umum. Rincian pendaftaran, unit, dinas, lan event tetep ana ing home.",
      experience: [
        ["01", "Mlebu Lan Ngerti Kultur", "Anggota diarahkan ngerti etika komunikasi, cara maca instruksi, lan kebiasaan dasar ing lingkungan PASKUS."],
        ["02", "Melu Kegiatan Kanthi Irama", "Kegiatan dilakoni bertahap supaya anggota kulina karo briefing, koordinasi, lan sikap nalika ana ing skenario."],
        ["03", "Nuduhake Konsistensi", "Keaktifan, sikap, lan kerja bareng dadi tandha utama sadurunge anggota diarahkan menyang jalur lanjut."],
        ["04", "Milih Arah Kontribusi", "Sawise ngerti kultur, anggota bisa ndeleng pilihan unit, dinas, utawa pendaftaran liwat home."],
      ],
      continueKicker: "Terus Saka Home",
      continueTitle: "Akses Cepet Tanpa Mbaleni Informasi",
      continueIntro: "Home tetep dadi pusat informasi rinci. About mung menehi konteks budaya lan arah navigasi supaya kaca tetep entheng lan fokus.",
      homeLinks: [
        { title: "Enlist Personnel", body: "Gunakake bagean pendaftaran ing home kanggo ngirim data awal anggota kanthi resmi.", href: "/#enlist", label: "Bukak Enlist" },
        { title: "Unit Tempur", body: "Detail card, spesialisasi, lan kaca unit tetep ana ing section Unit Tempur home.", href: "/#combat", label: "Deleng Unit" },
        { title: "Dinas Non-Tempur", body: "Informasi dinas lan detail page non-tempur bisa dibukak saka section Dinas ing home.", href: "/#support", label: "Deleng Dinas" },
        { title: "Discord Hub", body: "Mlebu Discord kanggo komunikasi, koordinasi kegiatan, lan sinkronisasi identitas.", href: "https://discord.gg/aaBR9ruFva", label: "Mlebu Discord" },
      ],
    },
  };

  const GLOBAL_COPY = {
    id: {
      nav: {
        home: "HOME",
        combat: "COMBAT",
        support: "SUPPORT",
        streamer: "STREAMER",
        brm5: "BRM5",
        structure: "STRUKTURAL",
        about: "ABOUT US",
        discord: "DISCORD",
        brandSub: "So-791",
      },
      module: {
        overviewKicker: "Modul Pengenalan Unit dan Dinas So-791",
        overviewTitle: "Analisa Kemampuan, Karir, Dan Penempatan",
        overviewBody: "Modul Pengenalan Unit dan Dinas So-791 menjadi dasar penjelasan kemampuan tempur, tugas unit, dinas khusus, serta jalur komitmen anggota. Setiap personel diarahkan melalui parameter komunikasi, struktur tugas, komando, karakter, dan efektivitas agar penempatan selaras dengan potensi individu.",
        regularStat: "Personel Reguler",
        specialStat: "Personel Unit Khusus",
        discordStat: "Bergabung Discord",
        eventsKicker: "Jenis Event Khusus",
        eventsTitle: "Full RP, Non RP, Dan Scenario Training",
        eventsBody: "Kegiatan So-791 dirancang untuk memperkuat strategi, roleplay, koordinasi, dan kesiapan anggota dalam operasi internal maupun eksternal.",
        golonganKicker: "Pembagian Golongan Latihan",
        golonganTitle: "Waktu Aktif Pagi Dan Malam",
        golonganBody: "Golongan dipakai untuk membantu penjadwalan pelatihan agar kandidat masuk ke rentang waktu yang paling sesuai dengan aktivitasnya.",
        combatKicker: "// UNIT KHUSUS So-791",
        combatTitle: 'UNIT <span class="text-[#9DC183]">KHUSUS TEMPUR</span>',
        supportKicker: "// DINAS DAN KARIR So-791",
        supportTitle: 'DINAS <span class="text-[#EFBF04]">NON-TEMPUR</span>',
      },
      unitDetail: {
        detailUnit: "Detail Unit",
        detailService: "Detail Dinas",
        operationalPriority: "Prioritas Operasional",
        doctrineUnit: "DOKTRIN UNIT",
        priorityTitle: "Prioritas Dan Karakter Personel",
        priorityPanel: "Prioritas ini menjadi bagian dari penilaian karakter, bakat, dan kesiapan individu sebelum berdinas secara berkelanjutan di {unit}.",
      },
      supportDetail: {
        nonCombat: "Dinas Non-Tempur",
        backToServices: "Kembali Ke Dinas",
        contactCommand: "Hubungi Komando",
        moduleStandard: "Standar Modul",
        rank: "Standar Pangkat",
        task: "Tugas Utama",
        aspect: "Aspek Prioritas",
        doctrine: "Doctrine",
        assessmentAspect: "Aspek penilaian",
        readinessFlow: "Alur Kesiapan",
        serviceSelection: "Seleksi Dinas Dan Kontribusi Resimen",
      },
      structure: {
        title: "Struktural PASKUS Gi1 | So-791",
        kicker: "Struktural So-791 / Chain Of Command",
        heading: "Struktural",
        headingSpan: "Komando Dan Pangkat",
        overviewFallback: "Struktur komando So-791 ditampilkan dalam format ringkas agar jenjang pangkat dan personel mudah dipantau.",
        overviewDocument: "Halaman ini memuat struktur komando, jenjang pangkat, insignia, role, dan daftar personel So-791 dalam tampilan yang rapi, cepat dibaca, dan mudah dipantau.",
        categories: "Kategori",
        ranks: "Pangkat",
        personnel: "Personel",
        registeredPersonnel: "Personel Terdaftar",
        commandRoot: "Command Root",
        countLine: "{ranks} pangkat / {members} personel",
        errorTitle: "Data Belum Terbaca",
        errorBody: "Data struktural belum bisa dimuat. Silakan coba refresh halaman.",
        loadingTitle: "Memuat Struktur",
        loadingBody: "Website sedang memuat struktur komando dan daftar personel terbaru.",
      },
      form: {
        privacy: "Kami hanya mengambil ID Discord untuk keperluan pendataan dalam resimen dan otomatisasi.",
        locationPrivacy: "Izin lokasi diperlukan untuk keperluan administrasi agar bisa melanjutkan sinkronisasi Discord dan tahap pendaftaran.",
        locationConfirm: "Website akan meminta izin lokasi dari browser untuk keperluan administrasi dan validasi pendaftaran. Jika lokasi tidak diizinkan, sinkronisasi Discord tidak dapat dilanjutkan.",
        requestingLocation: "Meminta izin lokasi...",
        savingLocation: "Memvalidasi administrasi...",
        locationSaved: "Validasi selesai. Membuka Discord...",
        locationOnlySaved: "Sinkron Discord selesai. Pendaftaran bisa dilanjutkan.",
        locationRequired: "Izin lokasi wajib diaktifkan untuk melanjutkan sinkronisasi Discord dan pendaftaran.",
        locationMissing: "Discord lama terdeteksi sebagai {display}, tetapi kode login lokasi belum ada. Klik Sinkron Discord untuk mengulang sync dengan validasi lokasi.",
        checking: "Mengecek status Discord sync. Tunggu sebentar sebelum mengirim pendaftaran.",
        notConfigured: "Discord sync wajib aktif sebelum pendaftaran. Admin perlu memastikan konfigurasi Discord OAuth tersedia.",
        unauthenticated: "Sinkronkan akun Discord untuk mengambil ID otomatis sebelum mengirim pendaftaran.",
        noRole: "Discord tersinkron sebagai {display}. Akun ini belum memiliki role yang diizinkan untuk pendaftaran unit tempur.",
        synced: "Discord tersinkron sebagai {display}. ID akan dikirim otomatis untuk tag di aplikasi pelatih.",
        syncTitle: "Discord Sync",
        resetSync: "Reset Sync",
        syncDiscord: "Sinkron Discord",
        resettingSync: "Mereset sinkron lama...",
        openingDiscord: "Membuka Discord...",
        discordIdPlaceholder: "Sinkron Discord untuk mengambil ID",
        autoTitle: "Diisi otomatis dari akun Discord yang tersinkron.",
        waitingInline: "Mengecek status Discord sync. Pendaftaran akan dibuka setelah status Discord terbaca.",
        configInline: "Discord sync wajib aktif sebelum pendaftaran. Hubungi admin jika tombol sinkron belum tersedia.",
        authInline: "Akun Discord wajib disinkronkan sebelum pendaftaran.",
        syncNow: "Sinkron sekarang",
        roleInline: "Akun Discord tersinkron, tetapi belum memiliki role akses untuk pendaftaran unit tempur.",
        syncedInline: "Discord tersinkron: <strong>{display}</strong>. ID akan dikirim otomatis.",
        alertChecking: "Sistem sedang mengecek status Discord. Coba lagi sebentar.",
        alertConfig: "Discord sync belum aktif di server. Data tidak dikirim ke aplikasi perekrut maupun Discord.",
        alertAuth: "Pendaftaran wajib sinkron Discord terlebih dahulu. Data tidak dikirim ke aplikasi perekrut maupun Discord sebelum sync.",
        alertLocation: "Kode login lokasi belum ada. Klik Sinkron Discord agar validasi lokasi dan sinkronisasi selesai dalam satu tombol.",
        alertRole: "Akun Discord kamu belum memiliki role akses untuk mendaftar unit tempur.",
        golonganOne: "Golongan 1",
        golonganOneBody: "Pagi sampai siang menjelang sore.",
        golonganTwo: "Golongan 2",
        golonganTwoBody: "Sore sampai malam.",
      },
      cs: {
        subtitle: "Pusat Informasi Resimen",
        panelSubtitle: "QnA dan pendaftaran",
        closeLabel: "Tutup PASKUS AI SERVICE",
        placeholder: "Tanya soal pendaftaran, unit, golongan...",
        send: "Kirim",
        wait: "Tunggu",
        typing: "PASKUS AI SERVICE sedang mengetik",
        unavailable: "Maaf, PASKUS AI SERVICE belum bisa menjawab saat ini. Coba lagi sebentar atau hubungi admin melalui Discord.",
        empty: "Informasi belum tersedia.",
        idle: "Chat tidak ada lanjutan lebih dari 10 menit. Chat akan di-refresh untuk kestabilan fitur.",
        note: "PASKUS AI SERVICE memprioritaskan konten website PASKUS sebagai sumber jawaban. Chat tersimpan sementara 10 menit berdasarkan sesi/IP agar tidak hilang saat reload; data anggota, bypass, dan pangkat tidak resmi tetap ditolak untuk keamanan resimen.",
        greeting: "Halo, saya PASKUS AI SERVICE. Saya menjawab berdasarkan informasi website PASKUS: pendaftaran, Discord sync, golongan latihan, unit tempur, dinas non-tempur, PMC/sipil, dan struktural.",
      },
      unitRoles: {
        gatam: "Prioritas Operasi Khusus",
        bringas: "Darat / Infanteri Mekanis",
        toruk: "Sky Lord / Unit Udara",
        sierra: "Infiltrasi & Sabotase Taktis",
        pathfinder: "Recon & Infiltrasi",
        sentinel: "Pertahanan & Combat Medic",
        komodo: "Pasukan Reguler",
      },
      komodo: {
        eyebrow: "Status: pasukan reguler / barak awal",
        subtitle: "Reguler Corps So-791",
        back: "Kembali Ke Unit Tempur",
        contact: "Hubungi Komando",
        doctrineEyebrow: "Doctrine",
        stats: [["PRD", "Entry rank"], ["PRK", "Reguler lanjut"], ["791", "Command standard"]],
        final: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        unit: {
          title: "KOMODO",
          category: "Pasukan Reguler / Barak Awal",
          color: "#80c342",
          hero: "KOMODO adalah pasukan reguler PASKUS sekaligus satuan awal bagi seluruh anggota yang baru bergabung. Unit ini menjadi barak pembentukan dasar dari pangkat Prada hingga Praka, tempat personel mengenal kultur komando, disiplin lapangan, etika barak, dan standar loyalitas sebelum dinilai layak bergerak ke penugasan atau spesialisasi lanjutan.",
          doctrineTitle: "Barak Disiplin Dan Filter Personel",
          doctrine: "Di dalam KOMODO, anggota tidak hanya dikenalkan pada sistem PASKUS, tetapi juga diuji konsistensi, kedisiplinan, komunikasi, dan kesiapan mengikuti rantai komando. Unit ini berperan sebagai garda terdepan pelatihan, ruang pembentukan mental, serta filter awal agar setiap personel yang naik tahap memiliki sikap, komitmen, dan pemahaman dasar yang selaras dengan standar komunitas.",
          cards: [
            ["Orientasi Anggota", "Pengenalan struktur PASKUS, kultur barak, cara komunikasi, dan dasar kedisiplinan agar personel baru memahami ritme satuan sejak hari pertama."],
            ["Disiplin Barak", "Melatih ketertiban, kepatuhan terhadap instruksi, kesiapan apel, dan kebiasaan operasional dasar sebelum anggota masuk ke lingkungan yang lebih spesifik."],
            ["Filter Kesiapan", "Menilai komitmen, attitude, keaktifan, dan kemampuan mengikuti standar komando sehingga anggota yang lolos benar-benar siap membawa nama PASKUS."],
            ["Garda Pelatihan", "Menjadi gerbang utama pembinaan dan pengenalan lapangan, dari pondasi pangkat Prada hingga Praka sebelum penempatan lanjutan ditentukan."],
          ],
          priorities: ["Disiplin dasar", "Kultur komando", "Kesiapan anggota", "Reguler yang konsisten"],
          route: "Prajurit awal diarahkan melalui pengenalan sistem, latihan disiplin, observasi sikap, dan evaluasi kesiapan sebelum penempatan berikutnya.",
          footer: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        },
      },
      unitSelectLabels: {
        GATAM: "GATAM (Operasi Rahasia)",
        SENTINEL: "SENTINEL (Combat Medic)",
        PATHFINDER: "PATHFINDER (Ranger & Scout)",
        BRINGAS: "BRINGAS (Darat / Infanteri Mekanis)",
        SIERRA: "SIERRA (Infiltrasi & Sabotase Taktis)",
        "TORUK MAKTO": "TORUK MAKTO (Sky Lord / Unit Udara)",
      },
    },
    en: {
      nav: { home: "HOME", combat: "COMBAT", support: "SUPPORT", streamer: "STREAMER", brm5: "BRM5", structure: "STRUCTURE", about: "ABOUT US", discord: "DISCORD", brandSub: "So-791" },
      module: {
        overviewKicker: "So-791 Unit And Service Introduction Module",
        overviewTitle: "Capability, Career, And Placement Analysis",
        overviewBody: "This module explains combat capability, unit duties, special services, and commitment paths inside So-791.",
        regularStat: "Regular Personnel",
        specialStat: "Special Unit Personnel",
        discordStat: "Joined Discord",
        eventsKicker: "Special Event Types",
        eventsTitle: "Full RP, Non RP, And Scenario Training",
        eventsBody: "So-791 activities strengthen strategy, roleplay, coordination, and readiness for internal and external operations.",
        golonganKicker: "Training Schedule Groups",
        golonganTitle: "Morning And Night Active Windows",
        golonganBody: "Groups help place candidates into the training time window that best fits their activity pattern.",
        combatKicker: "// So-791 SPECIAL UNITS",
        combatTitle: 'SPECIAL <span class="text-[#9DC183]">COMBAT UNITS</span>',
        supportKicker: "// So-791 SERVICES AND CAREER",
        supportTitle: 'NON-COMBAT <span class="text-[#EFBF04]">SERVICES</span>',
      },
      unitDetail: { detailUnit: "Unit Details", detailService: "Service Details", operationalPriority: "Operational Priority", doctrineUnit: "UNIT DOCTRINE", priorityTitle: "Personnel Priorities And Character", priorityPanel: "This priority is part of character, aptitude, and readiness assessment before serving sustainably in {unit}." },
      supportDetail: { nonCombat: "Non-Combat Service", backToServices: "Back To Services", contactCommand: "Contact Command", moduleStandard: "Module Standard", rank: "Rank Standard", task: "Main Duty", aspect: "Priority Aspect", doctrine: "Doctrine", assessmentAspect: "Assessment aspect", readinessFlow: "Readiness Flow", serviceSelection: "Service Selection And Regiment Contribution" },
      structure: { title: "PASKUS Gi1 Structure | So-791", kicker: "So-791 Structure / Chain Of Command", heading: "Structure", headingSpan: "Command And Rank", overviewFallback: "So-791 command structure is shown in a compact format so ranks and personnel can be monitored clearly.", overviewDocument: "This page shows command structure, rank layers, insignia, roles, and personnel in a clean and readable view.", categories: "Categories", ranks: "Ranks", personnel: "Personnel", registeredPersonnel: "Registered Personnel", commandRoot: "Command Root", countLine: "{ranks} ranks / {members} personnel", errorTitle: "Data Not Available", errorBody: "Structural data could not be loaded. Please refresh the page.", loadingTitle: "Loading Structure", loadingBody: "The website is loading the latest command structure and personnel list." },
      form: { privacy: "We only collect Discord ID for regiment records and automation.", locationPrivacy: "Location permission is required for administration so you can continue Discord sync and the registration stage.", locationConfirm: "The website will ask your browser for location permission for administration and registration validation. If location is not allowed, Discord sync cannot continue.", requestingLocation: "Requesting location permission...", savingLocation: "Validating administration...", locationSaved: "Validation complete. Opening Discord...", locationRequired: "Location permission is required to continue Discord sync and registration.", checking: "Checking Discord sync status. Please wait before submitting.", notConfigured: "Discord sync must be active before registration. Admin needs to confirm Discord OAuth configuration.", unauthenticated: "Sync your Discord account to collect the ID automatically before submitting.", noRole: "Discord synced as {display}. This account does not yet have an allowed role for combat unit registration.", synced: "Discord synced as {display}. The ID will be sent automatically for trainer tagging.", syncTitle: "Discord Sync", resetSync: "Reset Sync", syncDiscord: "Sync Discord", openingDiscord: "Opening Discord...", discordIdPlaceholder: "Sync Discord to collect ID", autoTitle: "Filled automatically from the synced Discord account.", waitingInline: "Checking Discord sync status. Registration opens after the status is read.", configInline: "Discord sync must be active before registration. Contact admin if the sync button is unavailable.", authInline: "A Discord account must be synced before registration.", syncNow: "Sync now", roleInline: "Discord is synced, but this account does not have combat unit access role.", syncedInline: "Discord synced: <strong>{display}</strong>. ID will be sent automatically.", alertChecking: "The system is checking Discord status. Try again shortly.", alertConfig: "Discord sync is not active on the server. Data is not sent to the recruiter app or Discord.", alertAuth: "Registration requires Discord sync first. Data is not sent to the recruiter app or Discord before sync.", alertRole: "Your Discord account does not have access role for combat unit registration.", golonganOne: "Group 1", golonganOneBody: "Morning to early afternoon.", golonganTwo: "Group 2", golonganTwoBody: "Afternoon to night." },
      cs: { subtitle: "Regiment Information Center", panelSubtitle: "QnA and registration", closeLabel: "Close PASKUS AI SERVICE", placeholder: "Ask about registration, units, groups...", send: "Send", wait: "Wait", typing: "PASKUS AI SERVICE is typing", unavailable: "Sorry, PASKUS AI SERVICE cannot answer right now. Try again shortly or contact admin through Discord.", empty: "Information is not available yet.", idle: "No follow-up chat for more than 10 minutes. Chat will refresh for feature stability.", note: "PASKUS AI SERVICE prioritizes PASKUS website content as the answer source. Chat is stored temporarily for 10 minutes by session/IP so it does not disappear on reload; member data, bypass requests, and unofficial promotion paths remain blocked for regiment safety.", greeting: "Hello, I am PASKUS AI SERVICE. I answer from PASKUS website information: registration, Discord sync, training groups, combat units, non-combat services, PMC/civilian context, and structure." },
      unitRoles: { gatam: "Special Operations Priority", bringas: "Ground / Mechanized Infantry", toruk: "Sky Lord / Air Unit", sierra: "Infiltration & Tactical Sabotage", pathfinder: "Recon & Infiltration", sentinel: "Defense & Combat Medic", komodo: "Regular Force" },
      komodo: {
        eyebrow: "Status: regular force / initial barracks",
        subtitle: "Regular Corps So-791",
        back: "Back To Combat Units",
        contact: "Contact Command",
        doctrineEyebrow: "Doctrine",
        stats: [["PRD", "Entry rank"], ["PRK", "Advanced regular"], ["791", "Command standard"]],
        final: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        unit: {
          title: "KOMODO",
          category: "Regular Force / Initial Barracks",
          color: "#80c342",
          hero: "KOMODO is the regular force of PASKUS and the first unit for every new member. It forms basic discipline from Prada to Praka, introduces command culture, barracks ethics, field discipline, and loyalty standards before members move to further assignments or specializations.",
          doctrineTitle: "Discipline Barracks And Personnel Filter",
          doctrine: "Inside KOMODO, members learn the PASKUS system while being tested on consistency, discipline, communication, and readiness to follow the chain of command. The unit acts as the front gate of training and the first filter before a member carries the regiment name further.",
          cards: [["Member Orientation", "Introduction to PASKUS structure, barracks culture, communication style, and basic discipline."], ["Barracks Discipline", "Builds order, instruction compliance, roll-call readiness, and basic operational habits."], ["Readiness Filter", "Assesses commitment, attitude, activity, and ability to follow command standards."], ["Training Front Gate", "The first development gate from Prada to Praka before advanced placement is decided."]],
          priorities: ["Basic discipline", "Command culture", "Member readiness", "Consistent regular force"],
          route: "New soldiers pass system orientation, discipline training, attitude observation, and readiness evaluation before the next placement.",
          footer: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        },
      },
      unitSelectLabels: { GATAM: "GATAM (Covert Operations)", SENTINEL: "SENTINEL (Combat Medic)", PATHFINDER: "PATHFINDER (Ranger & Scout)", BRINGAS: "BRINGAS (Ground / Mechanized Infantry)", SIERRA: "SIERRA (Infiltration & Tactical Sabotage)", "TORUK MAKTO": "TORUK MAKTO (Sky Lord / Air Unit)" },
    },
    fil: {
      nav: { home: "HOME", combat: "COMBAT", support: "SUPORTA", streamer: "STREAMER", brm5: "BRM5", structure: "ISTRUKTURA", about: "ABOUT US", discord: "DISCORD", brandSub: "So-791" },
      module: {
        overviewKicker: "Modyul Ng Unit At Dinas So-791",
        overviewTitle: "Pagsusuri Ng Kakayahan, Karera, At Placement",
        overviewBody: "Ipinapaliwanag ng modyul ang kakayahang panglaban, tungkulin ng unit, special services, at commitment path sa So-791.",
        regularStat: "Regular Personnel",
        specialStat: "Special Unit Personnel",
        discordStat: "Sumali Sa Discord",
        eventsKicker: "Uri Ng Special Event",
        eventsTitle: "Full RP, Non RP, At Scenario Training",
        eventsBody: "Ginagamit ang mga gawain ng So-791 para palakasin ang strategy, roleplay, coordination, at readiness.",
        golonganKicker: "Hati Ng Training Schedule",
        golonganTitle: "Active Time Sa Umaga At Gabi",
        golonganBody: "Tinutulungan ng grupo ang paglalagay ng kandidato sa oras ng training na pinakaakma sa activity niya.",
        combatKicker: "// SPECIAL UNITS So-791",
        combatTitle: 'SPECIAL <span class="text-[#9DC183]">COMBAT UNITS</span>',
        supportKicker: "// SERVICES AT CAREER So-791",
        supportTitle: 'NON-COMBAT <span class="text-[#EFBF04]">SERVICES</span>',
      },
      unitDetail: { detailUnit: "Detalye Ng Unit", detailService: "Detalye Ng Dinas", operationalPriority: "Operational Priority", doctrineUnit: "DOKTRINA NG UNIT", priorityTitle: "Priority At Character Ng Personnel", priorityPanel: "Kasama ang priority na ito sa assessment ng character, aptitude, at readiness bago tuloy-tuloy na maglingkod sa {unit}." },
      supportDetail: { nonCombat: "Non-Combat Service", backToServices: "Bumalik Sa Dinas", contactCommand: "Kontakin Ang Command", moduleStandard: "Module Standard", rank: "Rank Standard", task: "Main Duty", aspect: "Priority Aspect", doctrine: "Doctrine", assessmentAspect: "Assessment aspect", readinessFlow: "Readiness Flow", serviceSelection: "Service Selection At Ambag Sa Regiment" },
      structure: { title: "Istruktura PASKUS Gi1 | So-791", kicker: "Istruktura So-791 / Chain Of Command", heading: "Istruktura", headingSpan: "Command At Rank", overviewFallback: "Ipinapakita ang command structure ng So-791 sa compact format para madaling bantayan ang rank at personnel.", overviewDocument: "Ipinapakita ng page na ito ang command structure, ranks, insignia, roles, at personnel sa malinaw na layout.", categories: "Kategoriya", ranks: "Rank", personnel: "Personnel", registeredPersonnel: "Registered Personnel", commandRoot: "Command Root", countLine: "{ranks} rank / {members} personnel", errorTitle: "Hindi Mabasa Ang Data", errorBody: "Hindi ma-load ang structural data. Paki-refresh ang page.", loadingTitle: "Nilo-load Ang Structure", loadingBody: "Kinukuha ng website ang pinakabagong command structure at personnel list." },
      form: { privacy: "Discord ID lang ang kinukuha namin para sa regiment records at automation.", checking: "Tinitingnan ang Discord sync status. Maghintay bago magsubmit.", notConfigured: "Kailangan aktibo ang Discord sync bago registration.", unauthenticated: "I-sync muna ang Discord para awtomatikong makuha ang ID bago magsubmit.", noRole: "Naka-sync bilang {display}. Wala pang allowed role ang account na ito para sa combat unit registration.", synced: "Naka-sync bilang {display}. Awtomatikong ipapadala ang ID para sa trainer tag.", syncTitle: "Discord Sync", resetSync: "Reset Sync", syncDiscord: "Sync Discord", openingDiscord: "Binubuksan ang Discord...", discordIdPlaceholder: "Sync Discord para kunin ang ID", autoTitle: "Awtomatikong napunan mula sa synced Discord account.", waitingInline: "Tinitingnan ang Discord sync status. Magbubukas ang registration pagkatapos mabasa ang status.", configInline: "Kailangan aktibo ang Discord sync bago registration. Kontakin admin kung walang sync button.", authInline: "Kailangang naka-sync ang Discord bago registration.", syncNow: "Sync ngayon", roleInline: "Naka-sync ang Discord, pero wala pang combat unit access role.", syncedInline: "Discord synced: <strong>{display}</strong>. Awtomatikong ipapadala ang ID.", alertChecking: "Tinitingnan pa ng system ang Discord status. Subukan ulit mamaya.", alertConfig: "Hindi aktibo ang Discord sync sa server. Hindi ipapadala ang data sa recruiter app o Discord.", alertAuth: "Kailangan muna ang Discord sync bago registration.", alertRole: "Wala pang access role ang Discord account mo para mag-register sa combat unit.", golonganOne: "Group 1", golonganOneBody: "Umaga hanggang early afternoon.", golonganTwo: "Group 2", golonganTwoBody: "Hapon hanggang gabi." },
      cs: { subtitle: "Regiment Information Center", panelSubtitle: "QnA at registration", closeLabel: "Isara PASKUS AI SERVICE", placeholder: "Magtanong tungkol sa registration, unit, group...", send: "Send", wait: "Wait", typing: "Nagta-type ang PASKUS AI SERVICE", unavailable: "Paumanhin, hindi pa makasagot ang PASKUS AI SERVICE ngayon. Subukan ulit o kontakin admin sa Discord.", empty: "Wala pang available na impormasyon.", idle: "Walang follow-up chat nang mahigit 10 minuto. Ire-refresh ang chat para sa stability.", note: "PASKUS AI SERVICE ay inuuna ang content ng PASKUS website bilang source ng sagot. Temporary lang ang chat sa loob ng 10 minuto base sa session/IP; member data, bypass, at unofficial promotion path ay tinatanggihan para sa seguridad.", greeting: "Hello, ako ang PASKUS AI SERVICE. Sumasagot ako base sa impormasyon ng website: registration, Discord sync, training group, combat units, non-combat services, PMC/sibil, at structure." },
      unitRoles: { gatam: "Special Operations Priority", bringas: "Ground / Mechanized Infantry", toruk: "Sky Lord / Air Unit", sierra: "Infiltration & Tactical Sabotage", pathfinder: "Recon & Infiltration", sentinel: "Defense & Combat Medic", komodo: "Regular Force" },
      komodo: {
        eyebrow: "Status: regular force / initial barracks",
        subtitle: "Regular Corps So-791",
        back: "Bumalik Sa Combat Units",
        contact: "Kontakin Ang Command",
        doctrineEyebrow: "Doctrine",
        stats: [["PRD", "Entry rank"], ["PRK", "Advanced regular"], ["791", "Command standard"]],
        final: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        unit: {
          title: "KOMODO",
          category: "Regular Force / Initial Barracks",
          color: "#80c342",
          hero: "KOMODO ang regular force ng PASKUS at unang unit ng bagong miyembro. Dito binubuo ang basic discipline mula Prada hanggang Praka, kasama ang command culture, barracks ethics, field discipline, at loyalty standard bago lumipat sa mas advanced na placement.",
          doctrineTitle: "Discipline Barracks At Personnel Filter",
          doctrine: "Sa KOMODO, natututuhan ng miyembro ang sistema ng PASKUS habang sinusukat ang consistency, discipline, communication, at readiness sa chain of command. Ito ang unang gate ng training at unang filter bago dalhin ng miyembro ang pangalan ng regiment.",
          cards: [["Member Orientation", "Pagkilala sa structure, barracks culture, communication style, at basic discipline."], ["Barracks Discipline", "Pagbuo ng order, pagsunod sa instruction, readiness, at basic operational habits."], ["Readiness Filter", "Pagsusuri sa commitment, attitude, activity, at command compliance."], ["Training Front Gate", "Unang development gate mula Prada hanggang Praka bago advanced placement."]],
          priorities: ["Basic discipline", "Command culture", "Member readiness", "Consistent regular force"],
          route: "Dadaan ang bagong personnel sa orientation, discipline training, attitude observation, at readiness evaluation bago next placement.",
          footer: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        },
      },
      unitSelectLabels: { GATAM: "GATAM (Covert Operations)", SENTINEL: "SENTINEL (Combat Medic)", PATHFINDER: "PATHFINDER (Ranger & Scout)", BRINGAS: "BRINGAS (Ground / Mechanized Infantry)", SIERRA: "SIERRA (Infiltration & Tactical Sabotage)", "TORUK MAKTO": "TORUK MAKTO (Sky Lord / Air Unit)" },
    },
    hi: {
      nav: { home: "होम", combat: "कॉम्बैट", support: "सपोर्ट", streamer: "स्ट्रीमर", brm5: "BRM5", structure: "स्ट्रक्चर", about: "अबाउट", discord: "DISCORD", brandSub: "So-791" },
      module: {
        overviewKicker: "So-791 यूनिट और सेवा परिचय मॉड्यूल",
        overviewTitle: "क्षमता, करियर, और प्लेसमेंट विश्लेषण",
        overviewBody: "यह मॉड्यूल So-791 में combat capability, unit duty, special services, और commitment path समझाता है.",
        regularStat: "Regular Personnel",
        specialStat: "Special Unit Personnel",
        discordStat: "Discord Joined",
        eventsKicker: "Special Event Types",
        eventsTitle: "Full RP, Non RP, और Scenario Training",
        eventsBody: "So-791 activity strategy, roleplay, coordination, और readiness को मजबूत करती है.",
        golonganKicker: "Training Schedule Groups",
        golonganTitle: "सुबह और रात की active window",
        golonganBody: "Group system candidate को उसके activity time के अनुसार training window में रखने में मदद करता है.",
        combatKicker: "// So-791 SPECIAL UNITS",
        combatTitle: 'SPECIAL <span class="text-[#9DC183]">COMBAT UNITS</span>',
        supportKicker: "// So-791 SERVICES AND CAREER",
        supportTitle: 'NON-COMBAT <span class="text-[#EFBF04]">SERVICES</span>',
      },
      unitDetail: { detailUnit: "Unit Details", detailService: "Service Details", operationalPriority: "Operational Priority", doctrineUnit: "UNIT DOCTRINE", priorityTitle: "Personnel Priority और Character", priorityPanel: "यह priority {unit} में लगातार सेवा से पहले character, aptitude, और readiness assessment का हिस्सा है." },
      supportDetail: { nonCombat: "Non-Combat Service", backToServices: "Services पर वापस", contactCommand: "Command से संपर्क", moduleStandard: "Module Standard", rank: "Rank Standard", task: "Main Duty", aspect: "Priority Aspect", doctrine: "Doctrine", assessmentAspect: "Assessment aspect", readinessFlow: "Readiness Flow", serviceSelection: "Service Selection और Regiment Contribution" },
      structure: { title: "PASKUS Gi1 Structure | So-791", kicker: "So-791 Structure / Chain Of Command", heading: "Structure", headingSpan: "Command और Rank", overviewFallback: "So-791 command structure compact format में दिखाया गया है ताकि rank और personnel आसानी से monitor हों.", overviewDocument: "यह page command structure, rank layers, insignia, roles, और personnel को साफ layout में दिखाता है.", categories: "Categories", ranks: "Ranks", personnel: "Personnel", registeredPersonnel: "Registered Personnel", commandRoot: "Command Root", countLine: "{ranks} ranks / {members} personnel", errorTitle: "Data उपलब्ध नहीं", errorBody: "Structural data load नहीं हो सका. Page refresh करें.", loadingTitle: "Structure Loading", loadingBody: "Website latest command structure और personnel list load कर रही है." },
      form: { privacy: "हम regiment records और automation के लिए केवल Discord ID लेते हैं.", checking: "Discord sync status check हो रहा है. Submit करने से पहले प्रतीक्षा करें.", notConfigured: "Registration से पहले Discord sync active होना जरूरी है.", unauthenticated: "Submit से पहले ID लेने के लिए Discord account sync करें.", noRole: "{display} के रूप में Discord synced है. Combat unit registration के लिए allowed role अभी नहीं है.", synced: "{display} के रूप में Discord synced है. ID trainer tagging के लिए automatic भेजी जाएगी.", syncTitle: "Discord Sync", resetSync: "Reset Sync", syncDiscord: "Sync Discord", openingDiscord: "Discord खुल रहा है...", discordIdPlaceholder: "ID लेने के लिए Discord sync करें", autoTitle: "Synced Discord account से automatic भरा गया.", waitingInline: "Discord sync status check हो रहा है. Status पढ़ने के बाद registration खुलेगी.", configInline: "Registration से पहले Discord sync active होना चाहिए. Sync button न हो तो admin से संपर्क करें.", authInline: "Registration से पहले Discord account sync जरूरी है.", syncNow: "अब sync करें", roleInline: "Discord synced है, लेकिन combat unit access role नहीं है.", syncedInline: "Discord synced: <strong>{display}</strong>. ID automatic भेजी जाएगी.", alertChecking: "System Discord status check कर रहा है. थोड़ी देर बाद फिर कोशिश करें.", alertConfig: "Server पर Discord sync active नहीं है. Data recruiter app या Discord को नहीं भेजा जाएगा.", alertAuth: "Registration से पहले Discord sync जरूरी है.", alertRole: "आपके Discord account में combat unit registration access role नहीं है.", golonganOne: "Group 1", golonganOneBody: "सुबह से दोपहर/शाम से पहले.", golonganTwo: "Group 2", golonganTwoBody: "शाम से रात तक." },
      cs: { subtitle: "Regiment Information Center", panelSubtitle: "QnA और registration", closeLabel: "PASKUS AI SERVICE बंद करें", placeholder: "Registration, unit, group के बारे में पूछें...", send: "Send", wait: "Wait", typing: "PASKUS AI SERVICE typing कर रहा है", unavailable: "माफ करें, PASKUS AI SERVICE अभी जवाब नहीं दे सकता. थोड़ी देर बाद कोशिश करें या Discord admin से संपर्क करें.", empty: "Information अभी उपलब्ध नहीं है.", idle: "10 मिनट से follow-up chat नहीं है. Stability के लिए chat refresh होगी.", note: "PASKUS AI SERVICE जवाब के लिए PASKUS website content को प्राथमिकता देता है. Chat session/IP के आधार पर 10 मिनट temporarily stored रहती है; member data, bypass, और unofficial promotion requests सुरक्षा के लिए block रहती हैं.", greeting: "Hello, मैं PASKUS AI SERVICE हूँ. मैं website information से जवाब देता हूँ: registration, Discord sync, training groups, combat units, non-combat services, PMC/civilian context, और structure." },
      unitRoles: { gatam: "Special Operations Priority", bringas: "Ground / Mechanized Infantry", toruk: "Sky Lord / Air Unit", sierra: "Infiltration & Tactical Sabotage", pathfinder: "Recon & Infiltration", sentinel: "Defense & Combat Medic", komodo: "Regular Force" },
      komodo: {
        eyebrow: "Status: regular force / initial barracks",
        subtitle: "Regular Corps So-791",
        back: "Combat Units पर वापस",
        contact: "Command से संपर्क",
        doctrineEyebrow: "Doctrine",
        stats: [["PRD", "Entry rank"], ["PRK", "Advanced regular"], ["791", "Command standard"]],
        final: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        unit: {
          title: "KOMODO",
          category: "Regular Force / Initial Barracks",
          color: "#80c342",
          hero: "KOMODO PASKUS की regular force और हर नए member की पहली unit है. यहां Prada से Praka तक basic discipline, command culture, barracks ethics, field discipline, और loyalty standard बनाए जाते हैं.",
          doctrineTitle: "Discipline Barracks और Personnel Filter",
          doctrine: "KOMODO में members PASKUS system सीखते हैं और consistency, discipline, communication, तथा chain of command readiness पर परखे जाते हैं. यह training का पहला gate और regiment name आगे ले जाने से पहले पहला filter है.",
          cards: [["Member Orientation", "PASKUS structure, barracks culture, communication style, और basic discipline का परिचय."], ["Barracks Discipline", "Order, instruction compliance, roll-call readiness, और basic operational habits बनाना."], ["Readiness Filter", "Commitment, attitude, activity, और command standard compliance का assessment."], ["Training Front Gate", "Prada से Praka तक पहला development gate, advanced placement से पहले."]],
          priorities: ["Basic discipline", "Command culture", "Member readiness", "Consistent regular force"],
          route: "New personnel orientation, discipline training, attitude observation, और readiness evaluation के बाद next placement में जाते हैं.",
          footer: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        },
      },
      unitSelectLabels: { GATAM: "GATAM (Covert Operations)", SENTINEL: "SENTINEL (Combat Medic)", PATHFINDER: "PATHFINDER (Ranger & Scout)", BRINGAS: "BRINGAS (Ground / Mechanized Infantry)", SIERRA: "SIERRA (Infiltration & Tactical Sabotage)", "TORUK MAKTO": "TORUK MAKTO (Sky Lord / Air Unit)" },
    },
    jv: {
      nav: { home: "HOME", combat: "TEMPUR", support: "DINAS", streamer: "STREAMER", brm5: "BRM5", structure: "STRUKTURAL", about: "BABAGAN", discord: "DISCORD", brandSub: "So-791" },
      module: {
        overviewKicker: "Modul Pangenalan Unit Lan Dinas So-791",
        overviewTitle: "Analisa Kemampuan, Karir, Lan Penempatan",
        overviewBody: "Modul iki nerangake kemampuan tempur, tugas unit, dinas khusus, lan jalur komitmen anggota ing So-791.",
        regularStat: "Personel Reguler",
        specialStat: "Personel Unit Khusus",
        discordStat: "Gabung Discord",
        eventsKicker: "Jenis Event Khusus",
        eventsTitle: "Full RP, Non RP, Lan Scenario Training",
        eventsBody: "Kegiatan So-791 digawe kanggo nguwatake strategi, roleplay, koordinasi, lan kesiapan anggota.",
        golonganKicker: "Pembagian Golongan Latihan",
        golonganTitle: "Wektu Aktif Esuk Lan Bengi",
        golonganBody: "Golongan mbantu penjadwalan latihan supaya kandidat mlebu wektu sing paling cocok karo aktivitase.",
        combatKicker: "// UNIT KHUSUS So-791",
        combatTitle: 'UNIT <span class="text-[#9DC183]">KHUSUS TEMPUR</span>',
        supportKicker: "// DINAS LAN KARIR So-791",
        supportTitle: 'DINAS <span class="text-[#EFBF04]">NON-TEMPUR</span>',
      },
      unitDetail: { detailUnit: "Rincian Unit", detailService: "Rincian Dinas", operationalPriority: "Prioritas Operasional", doctrineUnit: "DOKTRIN UNIT", priorityTitle: "Prioritas Lan Watak Personel", priorityPanel: "Prioritas iki dadi bagean penilaian watak, bakat, lan kesiapan individu sadurunge berdinas ajeg ing {unit}." },
      supportDetail: { nonCombat: "Dinas Non-Tempur", backToServices: "Bali Menyang Dinas", contactCommand: "Hubungi Komando", moduleStandard: "Standar Modul", rank: "Standar Pangkat", task: "Tugas Utama", aspect: "Aspek Prioritas", doctrine: "Doctrine", assessmentAspect: "Aspek penilaian", readinessFlow: "Alur Kesiapan", serviceSelection: "Seleksi Dinas Lan Kontribusi Resimen" },
      structure: { title: "Struktural PASKUS Gi1 | So-791", kicker: "Struktural So-791 / Chain Of Command", heading: "Struktural", headingSpan: "Komando Lan Pangkat", overviewFallback: "Struktur komando So-791 ditampilake ringkes supaya pangkat lan personel gampang dipantau.", overviewDocument: "Kaca iki ngemot struktur komando, jenjang pangkat, insignia, role, lan daftar personel kanthi tampilan sing rapi.", categories: "Kategori", ranks: "Pangkat", personnel: "Personel", registeredPersonnel: "Personel Terdaftar", commandRoot: "Command Root", countLine: "{ranks} pangkat / {members} personel", errorTitle: "Data Durung Kebaca", errorBody: "Data struktural durung bisa dimuat. Coba refresh kaca.", loadingTitle: "Muat Struktur", loadingBody: "Website lagi ngemot struktur komando lan daftar personel paling anyar." },
      form: { privacy: "Aku mung njupuk ID Discord kanggo pendataan resimen lan otomatisasi.", checking: "Mriksa status Discord sync. Enteni sedhela sadurunge ngirim pendaftaran.", notConfigured: "Discord sync wajib aktif sadurunge pendaftaran.", unauthenticated: "Sinkronake akun Discord kanggo njupuk ID otomatis sadurunge ngirim.", noRole: "Discord tersinkron minangka {display}. Akun iki durung duwe role sing diijini kanggo pendaftaran unit tempur.", synced: "Discord tersinkron minangka {display}. ID bakal dikirim otomatis kanggo tag ing aplikasi pelatih.", syncTitle: "Discord Sync", resetSync: "Reset Sync", syncDiscord: "Sinkron Discord", openingDiscord: "Mbukak Discord...", discordIdPlaceholder: "Sinkron Discord kanggo njupuk ID", autoTitle: "Diisi otomatis saka akun Discord sing wis tersinkron.", waitingInline: "Mriksa status Discord sync. Pendaftaran dibukak sawise status kebaca.", configInline: "Discord sync wajib aktif sadurunge pendaftaran. Hubungi admin yen tombol sinkron ora ana.", authInline: "Akun Discord wajib disinkronake sadurunge pendaftaran.", syncNow: "Sinkron saiki", roleInline: "Discord wis tersinkron, nanging durung duwe role akses unit tempur.", syncedInline: "Discord tersinkron: <strong>{display}</strong>. ID bakal dikirim otomatis.", alertChecking: "Sistem lagi mriksa status Discord. Coba maneh sedhela.", alertConfig: "Discord sync durung aktif ing server. Data ora dikirim menyang aplikasi perekrut utawa Discord.", alertAuth: "Pendaftaran wajib sinkron Discord dhisik.", alertRole: "Akun Discord kowe durung duwe role akses kanggo ndaftar unit tempur.", golonganOne: "Golongan 1", golonganOneBody: "Esuk nganti awan menjelang sore.", golonganTwo: "Golongan 2", golonganTwoBody: "Sore nganti bengi." },
      cs: { subtitle: "Pusat Informasi Resimen", panelSubtitle: "QnA lan pendaftaran", closeLabel: "Tutup PASKUS AI SERVICE", placeholder: "Takon soal pendaftaran, unit, golongan...", send: "Kirim", wait: "Enteni", typing: "PASKUS AI SERVICE lagi ngetik", unavailable: "Nyuwun sewu, PASKUS AI SERVICE durung bisa njawab saiki. Coba maneh sedhela utawa hubungi admin liwat Discord.", empty: "Informasi durung kasedhiya.", idle: "Ora ana chat lanjutan luwih saka 10 menit. Chat bakal di-refresh kanggo kestabilan fitur.", note: "PASKUS AI SERVICE ngutamakake konten website PASKUS minangka sumber jawaban. Chat disimpen sementara 10 menit adhedhasar sesi/IP; data anggota, bypass, lan jalur pangkat ora resmi tetep ditolak kanggo keamanan resimen.", greeting: "Halo, aku PASKUS AI SERVICE. Aku njawab saka informasi website PASKUS: pendaftaran, Discord sync, golongan latihan, unit tempur, dinas non-tempur, PMC/sipil, lan struktural." },
      unitRoles: { gatam: "Prioritas Operasi Khusus", bringas: "Darat / Infanteri Mekanis", toruk: "Sky Lord / Unit Udara", sierra: "Infiltrasi & Sabotase Taktis", pathfinder: "Recon & Infiltrasi", sentinel: "Pertahanan & Combat Medic", komodo: "Pasukan Reguler" },
      komodo: {
        eyebrow: "Status: pasukan reguler / barak awal",
        subtitle: "Reguler Corps So-791",
        back: "Bali Menyang Unit Tempur",
        contact: "Hubungi Komando",
        doctrineEyebrow: "Doctrine",
        stats: [["PRD", "Entry rank"], ["PRK", "Reguler lanjut"], ["791", "Command standard"]],
        final: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        unit: {
          title: "KOMODO",
          category: "Pasukan Reguler / Barak Awal",
          color: "#80c342",
          hero: "KOMODO iku pasukan reguler PASKUS lan satuan awal kanggo anggota anyar. Ing kene dibangun disiplin dasar saka Prada nganti Praka, kalebu kultur komando, etika barak, disiplin lapangan, lan standar loyalitas.",
          doctrineTitle: "Barak Disiplin Lan Filter Personel",
          doctrine: "Ing KOMODO, anggota dikenalake sistem PASKUS lan diuji konsistensi, kedisiplinan, komunikasi, lan kesiapan manut rantai komando. Unit iki dadi gerbang pelatihan lan filter awal sadurunge anggota nggawa jeneng resimen luwih adoh.",
          cards: [["Orientasi Anggota", "Pangenalan struktur PASKUS, kultur barak, gaya komunikasi, lan disiplin dasar."], ["Disiplin Barak", "Nglatih ketertiban, manut instruksi, kesiapan apel, lan kebiasaan operasional dasar."], ["Filter Kesiapan", "Ndelok komitmen, attitude, keaktifan, lan kemampuan manut standar komando."], ["Garda Pelatihan", "Gerbang pembinaan saka Prada nganti Praka sadurunge penempatan lanjut."]],
          priorities: ["Disiplin dasar", "Kultur komando", "Kesiapan anggota", "Reguler sing konsisten"],
          route: "Prajurit anyar mlewati orientasi sistem, latihan disiplin, observasi sikap, lan evaluasi kesiapan sadurunge penempatan sabanjure.",
          footer: "PASKUS Gi1 / KOMODO CORPS / INITIAL TRAINING BARRACKS",
        },
      },
      unitSelectLabels: { GATAM: "GATAM (Operasi Rahasia)", SENTINEL: "SENTINEL (Combat Medic)", PATHFINDER: "PATHFINDER (Ranger & Scout)", BRINGAS: "BRINGAS (Darat / Infanteri Mekanis)", SIERRA: "SIERRA (Infiltrasi & Sabotase Taktis)", "TORUK MAKTO": "TORUK MAKTO (Sky Lord / Unit Udara)" },
    },
  };

  const MODULE_TRANSLATIONS = {
    en: {
      homeLead: "PASKUS Gi1 uses special units and services as development paths for combat skill, strategy, roleplay, and career direction. Every member is assessed through communication, task structure, command, character, and effectiveness so placement in So-791 matches individual potential.",
      overview: [
        { title: "Background", body: "Combat experience is an important measure of readiness. Communication, task structure, command, and consistency determine whether a person fits the selected unit or service." },
        { title: "Strategy And Priority", body: "Every special unit and service has its own focus, discipline, character, and strategy. The best placement comes from teamwork, adaptation, and fit with the task culture." },
        { title: "Registration Flow", body: "Committed candidates pass interview, capability test, character and talent review, then pre-service. This keeps the selected duty path sustainable." },
        { title: "Events And Operations", body: "Activities include PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, and External PVP to build tactics, roleplay quality, and operational experience." },
      ],
      events: [
        { title: "PVE Vanilla Scenario", body: "Ronograd vanilla map missions that strengthen tactical experience, coordination, and semi to hardcore roleplay." },
        { title: "PVE Custom Scenario", body: "Custom missions created for strategic needs, sometimes inspired by real situations to make operations feel alive." },
        { title: "Internal PVP", body: "Fun deathmatch or competitive 5v5, 10v10, up to 15v15 on custom maps by event coordinators." },
        { title: "External PVP", body: "Competitive matches with other regiments or communities to test tactics, discipline, and cooperation." },
      ],
      golongan: [
        { title: "Group 1", body: "Scheduling for morning until early afternoon. Suitable for members active in the first half of the day." },
        { title: "Group 2", body: "Scheduling for afternoon until night. Suitable for members who are more active after midday." },
      ],
    },
    fil: {
      homeLead: "Ginagamit ng PASKUS Gi1 ang special units at dinas bilang daan sa pag-unlad ng combat skill, strategy, roleplay, at career. Sinusuri ang bawat personnel sa communication, task structure, command, character, at effectiveness para tumugma ang placement sa potensyal niya.",
      overview: [
        { title: "Background", body: "Mahalagang sukatan ng readiness ang combat experience. Communication, task structure, command, at consistency ang batayan kung bagay ang isang tao sa unit o dinas." },
        { title: "Strategy At Priority", body: "Bawat unit at dinas ay may sariling focus, discipline, character, at strategy. Ang tamang placement ay mula sa teamwork, adaptation, at fit sa task culture." },
        { title: "Registration Flow", body: "Ang committed candidate ay dadaan sa interview, capability test, character at talent review, at pre-service para masigurong sustainable ang napiling duty path." },
        { title: "Events At Operations", body: "Kasama ang PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, at External PVP para palakasin ang tactics, roleplay, at operation experience." },
      ],
      events: [
        { title: "PVE Vanilla Scenario", body: "Mission sa Ronograd vanilla map para palakasin ang tactical experience, coordination, at semi hanggang hardcore roleplay." },
        { title: "PVE Custom Scenario", body: "Custom mission para sa strategic needs, minsan may inspirasyon sa real situation para mas buhay ang operation." },
        { title: "Internal PVP", body: "Fun deathmatch o competitive 5v5, 10v10, hanggang 15v15 sa custom map ng event coordinator." },
        { title: "External PVP", body: "Competitive match kasama ang ibang regiment o community para subukan ang tactics, discipline, at teamwork." },
      ],
      golongan: [
        { title: "Group 1", body: "Schedule para sa umaga hanggang early afternoon. Akma sa active sa unang bahagi ng araw." },
        { title: "Group 2", body: "Schedule para sa hapon hanggang gabi. Akma sa mas active pagkatapos ng tanghali." },
      ],
    },
    hi: {
      homeLead: "PASKUS Gi1 special units और services को combat skill, strategy, roleplay, और career development path की तरह रखता है. हर member को communication, task structure, command, character, और effectiveness से assess किया जाता है ताकि So-791 placement उसकी potential से मेल खाए.",
      overview: [
        { title: "Background", body: "Combat experience readiness का महत्वपूर्ण measure है. Communication, task structure, command, और consistency तय करते हैं कि member selected unit या service में fit है या नहीं." },
        { title: "Strategy और Priority", body: "हर unit और service का focus, discipline, character, और strategy अलग है. Best placement teamwork, adaptation, और task culture fit से बनता है." },
        { title: "Registration Flow", body: "Committed candidate interview, capability test, character और talent review, फिर pre-service से गुजरता है ताकि duty path sustainable रहे." },
        { title: "Events और Operations", body: "Activities में PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, और External PVP शामिल हैं ताकि tactics, roleplay quality, और experience बने." },
      ],
      events: [
        { title: "PVE Vanilla Scenario", body: "Ronograd vanilla map mission जो tactical experience, coordination, और semi से hardcore roleplay को मजबूत करता है." },
        { title: "PVE Custom Scenario", body: "Strategic needs के लिए custom mission, कभी real situation से inspired ताकि operation alive महसूस हो." },
        { title: "Internal PVP", body: "Custom map पर fun deathmatch या competitive 5v5, 10v10, से 15v15 तक." },
        { title: "External PVP", body: "दूसरे regiment या community के साथ competitive match, tactics, discipline, और teamwork test करने के लिए." },
      ],
      golongan: [
        { title: "Group 1", body: "सुबह से early afternoon तक scheduling. दिन के पहले हिस्से में active members के लिए." },
        { title: "Group 2", body: "Afternoon से night तक scheduling. दोपहर के बाद अधिक active members के लिए." },
      ],
    },
    jv: {
      homeLead: "PASKUS Gi1 nempatake unit khusus lan dinas minangka jalur pangembangan kemampuan tempur, strategi, roleplay, lan karir. Saben personel dinilai liwat komunikasi, struktur tugas, komando, karakter, lan efektivitas supaya penempatan ing So-791 cocog karo potensine.",
      overview: [
        { title: "Latar Belakang", body: "Pengalaman tempur dadi ukuran penting kanggo kesiapan prajurit. Komunikasi, struktur tugas, komando, lan konsistensi dadi dhasar apa individu cocok mlebu unit utawa dinas." },
        { title: "Strategi Lan Prioritas", body: "Saben unit khusus lan dinas duwe fokus, disiplin, karakter, lan strategi dhewe. Penempatan paling apik muncul saka kerja bareng, adaptasi, lan kecocokan budaya tugas." },
        { title: "Alur Pendaftaran", body: "Kandidat sing siap komitmen bakal liwat wawancara, uji kemampuan, uji karakter lan bakat, banjur masa pra-dinas." },
        { title: "Event Lan Operasi", body: "Kegiatan kalebu PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, lan External PVP kanggo mbangun strategi, pengalaman taktis, lan roleplay." },
      ],
      events: [
        { title: "PVE Vanilla Scenario", body: "Misi Ronograd vanilla kanggo nguwatake pengalaman taktis, koordinasi, lan roleplay semi nganti hardcore." },
        { title: "PVE Custom Scenario", body: "Misi custom kanggo kebutuhan strategi, kadhang terinspirasi saka kedadeyan nyata supaya operasi luwih urip." },
        { title: "Internal PVP", body: "Fun deathmatch utawa competitive 5v5, 10v10, nganti 15v15 ing map custom." },
        { title: "External PVP", body: "Competitive match karo resimen utawa komunitas liya kanggo nguji taktik, disiplin, lan kerja bareng." },
      ],
      golongan: [
        { title: "Golongan 1", body: "Jadwal esuk nganti awan menjelang sore. Cocog kanggo anggota sing aktif ing awal dina." },
        { title: "Golongan 2", body: "Jadwal sore nganti bengi. Cocog kanggo anggota sing luwih aktif sawise awan." },
      ],
    },
  };

  const UNIT_LOCALIZATION = {
    en: {
      bringas: { category: "Ground / Heavy Duty Unit", hero: "BRINGAS is the mechanized infantry strike unit specializing in light cavalry platforms such as APC, AV, and IFV. It brings heavy firepower, infantry protection, and rapid mobility in emergency combat conditions.", doctrineTitle: "Heavy Firepower And Mechanized Mobility", doctrine: "BRINGAS destroys hostile pressure points with heavy weapons and combat vehicles while protecting infantry during fast movement. Members must adapt to harsh, dynamic, and high-pressure environments.", cards: [["APC / AV / IFV", "Operate armored platforms to move personnel, absorb pressure, and open movement space."], ["Fire Support", "Deliver heavy firepower to break enemy resistance and reduce risk for ground forces."], ["Rapid Protection", "Provide protection and fast mobility when infantry needs to leave dangerous conditions."]], priorities: ["High-pressure adaptation", "Mobility discipline", "Endurance in harsh terrain", "Reliable dynamic character"], route: "Interview, vehicle capability test, character review, then pre-service period.", footer: "READY TO BECOME THE MECHANIZED STRIKE FORCE?" },
      "toruk-makto": { category: "Sky Lord / Air Specialization Unit", hero: "Lord of the Sky. TORUK MAKTO focuses on fast aerial insertion, extraction, CAS, CASEVAC, airborne path, and the best pilots So-791 can field.", doctrineTitle: "Air Precision With No Room For Error", doctrine: "Air operations are vital and unforgiving. TORUK MAKTO personnel must be disciplined, precise, adaptive, and able to combine piloting, marksmanship, and rapid decision-making.", cards: [["Fast Insertion", "Insert personnel quickly into operational points with efficient timing."], ["CAS / CASEVAC", "Support ground forces with close air support and casualty evacuation."], ["Airborne Path", "Open parachute and airborne opportunities for personnel ready for air operations."]], priorities: ["High discipline", "Piloting and firing precision", "Strong adaptation", "No tolerance for operational error"], route: "Interview, air capability test, character review, then pre-service period.", footer: "READY TO BECOME LORD OF THE SKY?" },
      pathfinder: { category: "Ranger And Scout Unit", hero: "PATHFINDER is the ranger and scout infantry element focused on reconnaissance, surveillance, marksmanship, and sharp communication to improve So-791 operational effectiveness.", doctrineTitle: "Surveillance, Patience, And Precision Fire", doctrine: "PATHFINDER provides surveillance and intelligence that determine the success of an operation. Members need discipline, precision, patience, shooting skill, and clear communication.", cards: [["Recon Watch", "Observe terrain, read movement, and provide useful reconnaissance to command."], ["Marksmanship", "Use accurate fire to control distance, accuracy, and operational area."], ["Tactical Signal", "Keep scout communication clear, fast, and usable for the main unit."]], priorities: ["High patience", "Observation precision", "Marksmanship", "Sharp communication"], route: "Interview, reconnaissance capability test, character review, then pre-service period.", footer: "READY TO OPEN THE WAY FOR OPERATIONS?" },
      sierra: { category: "Infiltration And Tactical Sabotage Unit", hero: "SIERRA is a silent infantry cell built for controlled infiltration, close observation, and precise disruption. It opens operational gaps, breaks hostile rhythm, and resolves high-value objectives without losing command discipline.", doctrineTitle: "Silent Movement With Decisive Execution", doctrine: "SIERRA represents the renewed sabotage identity inside PASKUS Gi1. Its personnel move through low-noise entry, small-cell coordination, sharp communication, and fast execution that supports the main operation without unnecessary exposure.", cards: [["Silent Entry", "Enter target areas quietly, read openings, and prepare action space for the main force."], ["Tactical Disruption", "Disrupt facilities, rhythm, and hostile concentration through direct and measured sabotage."], ["Precision Cell", "Move as a small cell with short communication, mature decisions, and disciplined execution."]], priorities: ["Silent movement", "Emotional control", "Precision decision-making", "Small-cell coordination"], route: "Interview, tactical infiltration test, small-team communication test, character review, then pre-service period.", footer: "SIERRA / SILENT DISRUPTION CELL So-791" },
      sentinel: { category: "Combat Medic Unit", hero: "SENTINEL is the combat medic element specializing in first response during active battle, supporting the regiment with medical equipment, logistics, and armored medical vehicles.", doctrineTitle: "Morale, Medicine, And Logistics On The Lifeline", doctrine: "SENTINEL keeps operations alive through first aid, coordination, communication, and logistics. Members need focus, discipline, high morale, and motivation to support teammates.", cards: [["First Response", "Provide first aid in active combat so personnel can be stabilized or evacuated."], ["Armored Medical", "Support evacuation and medical mobility through armored medical vehicles."], ["Logistic Care", "Keep medical and logistic supplies efficient so operations do not lose support."]], priorities: ["Strong focus", "Coordination and communication", "Motivation to help teammates", "Morale and discipline"], route: "Interview, medical capability test, character review, then pre-service period.", footer: "READY TO BECOME THE LIFELINE OF OPERATIONS?" },
      gatam: { category: "Infiltration And Stealth Unit", hero: "GATAM, Garuda Hitam, is a special operations unit focused on covert work. It operates independently to secure strategic positions, eliminate targets, or liberate compounds.", doctrineTitle: "Covert Operations With No Gaps In Precision", doctrine: "GATAM demands strong focus, coordination, communication, completion drive, and adaptation under pressure. One mistake can compromise the entire operation.", cards: [["Stealth Entry", "Enter operational areas quietly to create room for strategic control."], ["Strategic Control", "Secure key points and maintain command movement space during covert missions."], ["Target Resolution", "Eliminate targets or liberate compounds with discipline and high precision."]], priorities: ["Strong focus", "Coordination and communication", "Pressure adaptation", "No tolerance for error"], route: "Interview, infiltration capability test, character review, then pre-service period.", footer: "READY TO MOVE IN COVERT OPERATIONS?" },
    },
    fil: {},
    hi: {},
    jv: {},
  };

  UNIT_LOCALIZATION.fil = Object.fromEntries(Object.entries(UNIT_LOCALIZATION.en).map(([slug, unit]) => [slug, {
    ...unit,
    hero: unit.hero.replaceAll(" is ", " ay ").replaceAll(" focuses on ", " nakatuon sa "),
    doctrine: unit.doctrine.replaceAll("Members", "Personnel").replaceAll("must", "dapat"),
    route: unit.route.replace("Interview", "Interview").replace("then pre-service period", "pagkatapos ay pre-service period"),
  }]));
  UNIT_LOCALIZATION.hi = Object.fromEntries(Object.entries(UNIT_LOCALIZATION.en).map(([slug, unit]) => [slug, {
    ...unit,
    hero: `${unit.title || ""}${unit.title ? " " : ""}${unit.hero}`,
    doctrine: `${unit.doctrine} Assessment में discipline, communication, और readiness को प्राथमिकता दी जाती है.`,
    route: unit.route.replace("Interview", "Interview").replace("then pre-service period", "फिर pre-service period"),
  }]));
  UNIT_LOCALIZATION.jv = Object.fromEntries(Object.entries(UNIT_LOCALIZATION.en).map(([slug, unit]) => [slug, {
    ...unit,
    hero: unit.hero.replace("is", "iku").replace("focused", "fokus"),
    doctrine: `${unit.doctrine} Penilaian tetep ndelok disiplin, komunikasi, lan kesiapan.`,
    route: unit.route.replace("Interview", "Wawancara").replace("then pre-service period", "banjur masa pra-dinas"),
  }]));

  const SUPPORT_LOCALIZATION = {
    en: {
      staff: { back: "NON-COMBAT COMMAND CORE", category: "Command Staff & Regimental Administration", rank: "Confidential", task: "Direction, Events, Evaluation, Schedule, And Data Validation", aspect: "Confidential recruitment only from the Regiment Head. No public registration.", body: "SEKSI 1 is the brain of the regiment and the main PASKUS administration body, coordinating all non-combat services.", hero: "SEKSI 1 is the brain of the regiment and the central administration of PASKUS. It maintains command direction, event rhythm, evaluation, scheduling, data validation, and non-combat coordination.", doctrineTitle: "Regiment Brain And Central PASKUS Administration", doctrine: "SEKSI 1 manages the core non-combat function: giving direction, creating events, evaluating, handling light violations, arranging schedules, and validating data. Recruitment is confidential and only from the Regiment Head.", cards: [["Direction Center", "Keeps non-combat units, services, and regiment activity aligned under one command line."], ["Events And Evaluation", "Creates events, maintains activity rhythm, and gives proportionate evaluation."], ["Schedule And Validation", "Manages schedules and validates data so regiment decisions remain organized."], ["Confidential Recruitment", "No public registration. Recruitment only comes from the Regiment Head."]], priorities: ["Command trust", "Measured firmness", "Clean administration", "Mature evaluation"], route: "SEKSI 1 entry requirements are confidential. Recruitment only comes from the Regiment Head.", footer: "SEKSI 1 / So-791 NON-COMBAT ADMINISTRATION" },
      dpdm: { back: "MILITARY POLICE", category: "Military Police & Legal Enforcement", rank: "Trusted Personnel", task: "Enforce Regiment Law And Compliance", aspect: "Manages rules, compliance, investigation, and fair roleplay law enforcement.", body: "The regiment law enforcement service that manages rules, compliance, investigation, and military police functions in So-791 roleplay.", hero: "DPDM is So-791's frontline of law. It maintains rules, compliance, and roleplay order through military police authority to investigate and enforce regiment law.", doctrineTitle: "Frontline Of Regiment Law And Order", doctrine: "DPDM manages applicable law, ensures rules are followed, and maintains order. As military police, it investigates indications, collects information, and enforces decisions firmly and proportionately.", cards: [["Rule Enforcement", "Keeps regiment law clear, orderly, and understandable in every roleplay activity."], ["Roleplay Investigation", "Collects information, reads violation indicators, and builds decision basis through procedure."], ["Regiment Order", "Protects discipline, ethics, and community safety as the legal frontline."]], priorities: ["Legal integrity", "Proportionate firmness", "Investigation accuracy", "Procedure compliance"], route: "Assessment focuses on integrity, mature decisions, violation reading, communication, and firmness in roleplay law.", footer: "DPDM / So-791 MILITARY POLICE" },
      pusdiklat: { back: "TRAINER & ASSISTANT TRAINER", category: "Training & Doctrine Development", rank: "Senior Soldier - NCO", task: "Train Individuals", aspect: "Practices strategy knowledge and high discipline.", body: "A service for senior soldiers to NCOs that trains individuals, applies strategy knowledge, and maintains discipline standards.", hero: "PUSDIKLAT is the center of training and basic doctrine formation. It develops individual ability, transfers strategy knowledge, and maintains So-791 discipline standards.", doctrineTitle: "Education, Training, And Discipline Center", doctrine: "PUSDIKLAT trains individuals through strategy practice, high discipline, and preparation so members can enter more specific duty structures.", cards: [["Individual Development", "Guides members through task structure, communication, training ethics, and basic readiness."], ["Strategy Practice", "Turns theory into directed practice so participants can read situations and operate within plans."], ["Discipline Standard", "Maintains training habits, instruction compliance, and attitude quality."]], priorities: ["High discipline", "Strategy knowledge", "Training patience", "Measured firmness"], route: "Rank standard: senior soldier to NCO. Assessment focuses on training ability, strategy understanding, and discipline.", footer: "PUSDIKLAT / So-791 NON-COMBAT SERVICE" },
      propaganda: { back: "PROPAGANDA", category: "Documentation & Media Operations", rank: "Senior Soldier - NCO", task: "Create Documentation For Publication", aspect: "Creative in documentation and motivated to create attractive content.", body: "A creative service that documents operations, processes moments, and builds compelling regiment content.", hero: "PROPAGANDA captures operations, processes documentation, and tells regiment stories through clean, lively, and attractive content.", doctrineTitle: "Operational Documentation And Community Narrative", doctrine: "PROPAGANDA focuses on documentation for publication. Personnel need visual creativity, production motivation, and story sensitivity to strengthen regiment identity.", cards: [["Field Documentation", "Captures operation, training, and event moments with clear composition."], ["Content Production", "Turns documentation into attractive, informative material while keeping So-791's professional image."], ["Visual Archive", "Organizes activity archives so the regiment journey can be reused for communication."]], priorities: ["Visual creativity", "High motivation", "Archive accuracy", "Narrative sense"], route: "Rank standard: senior soldier to NCO. Assessment focuses on creativity, production consistency, and publication responsibility.", footer: "PROPAGANDA / So-791 NON-COMBAT SERVICE" },
      zeni: { back: "COMBAT ENGINEERING", category: "Scenario & Map Engineering", rank: "Senior Soldier - NCO", task: "Build Scenarios & Maps", aspect: "Creative, imaginative, and responsible for the duty area.", body: "A creative and imaginative service that builds scenarios and maps while owning responsibility for the created duty area.", hero: "ZENI TEMPUR builds scenario and map spaces for So-791 operations, designing areas, objectives, and flow so events feel tactical and playable.", doctrineTitle: "Scenario Engineering And Operation Area", doctrine: "ZENI TEMPUR builds scenarios and maps. The role requires creativity, imagination, and high responsibility because terrain quality shapes roleplay, training, and operations.", cards: [["Scenario Build", "Creates operation flow, objectives, and terrain needs with clear strategic direction."], ["Map Responsibility", "Builds and maintains duty areas with movement rhythm and roleplay needs in mind."], ["Operational Immersion", "Creates environments that support tactical experience from training to large scenarios."]], priorities: ["Creative", "Imaginative", "Area responsibility", "Understands event needs"], route: "Rank standard: senior soldier to NCO. Assessment focuses on scenario creativity, map responsibility, and event readiness.", footer: "ZENI TEMPUR / So-791 NON-COMBAT SERVICE" },
    },
    fil: {},
    hi: {},
    jv: {},
  };

  SUPPORT_LOCALIZATION.fil = Object.fromEntries(Object.entries(SUPPORT_LOCALIZATION.en).map(([slug, unit]) => [slug, { ...unit, route: unit.route.replace("Assessment focuses on", "Assessment ay nakatuon sa").replace("Rank standard", "Rank standard") }]));
  SUPPORT_LOCALIZATION.hi = Object.fromEntries(Object.entries(SUPPORT_LOCALIZATION.en).map(([slug, unit]) => [slug, { ...unit, doctrine: `${unit.doctrine} Discipline, communication, और responsibility मुख्य assessment points हैं.` }]));
  SUPPORT_LOCALIZATION.jv = Object.fromEntries(Object.entries(SUPPORT_LOCALIZATION.en).map(([slug, unit]) => [slug, { ...unit, doctrine: `${unit.doctrine} Penilaian tetep ndelok disiplin, komunikasi, lan tanggung jawab.` }]));

  ABOUT_TRANSLATIONS.su = {
    metaTitle: "Ngeunaan PASKUS Gi1 | So-791",
    heroKicker: "Ngeunaan PASKUS Gi1",
    heroTitle: "PASKUS Gi1",
    heroSubtitle: "Identitas, Budaya, Komando",
    hero: "Kaca ieu ngenalkeun identitas resimen: kumaha komunitas ngajaga disiplin, komunikasi anu écés, jeung budaya maén anu rapih tanpa ngulang deui daptar unit, dinas, pendaftaran, atawa event anu geus aya di home.",
    actions: ["Balik Ka Beranda", "Daptar Personel", "Asup Discord"],
    focusTitle: "Fokus Kaca",
    identityKicker: "Identitas Resimen",
    identityTitle: "Rapih Dina Komando, Nyaman Dina Komunitas",
    identity: "PASKUS Gi1 diwangun minangka komunitas taktis anu ngutamakeun pangalaman maén anu tertib, komunikatif, jeung boga karakter. Tujuanana lain ngan meunang dina scenario, tapi ngawangun kabiasaan anggota supaya bisa jalan dina komando, ngahargaan rekan, jeung ngajaga suasana roleplay anu nyaman pikeun jangka panjang.",
    focusPanel: [
      ["Identitas", "Profil ringkes komunitas, gaya komunikasi, jeung standar sikap anggota."],
      ["Budaya", "Kumaha disiplin dijaga sangkan interaksi tetep tegas tapi teu karasa kaku."],
      ["Akses Gancang", "Arah ka bagian home pikeun unit, dinas, pendaftaran, jeung Discord tanpa ngulang eusi."],
    ],
    culture: [
      { title: "Komando Anu Kabaca", body: "Instruksi dijieun écés, ringkes, jeung gampang diturutan supaya anggota anyar jeung senior ngartos irama kegiatan." },
      { title: "Disiplin Manusiawi", body: "Disiplin dijaga minangka kabiasaan maén, lain ngan formalitas. Tegas nalika tugas, tetep sehat dina interaksi." },
      { title: "Komunikasi Hiji Jalur", body: "Koordinasi dijaga sangkan informasi penting teu leungit. Laporan kudu pondok, relevan, jeung bisa ditindaklanjuti." },
      { title: "Ruang Pikeun Mekar", body: "Saban anggota boga tempat pikeun manggihan peran anu cocok liwat observasi, latihan, jeung kontribusi konsisten." },
    ],
    experienceKicker: "Pangalaman Anggota",
    experienceTitle: "Irama Anu Ngabantu Anggota Anyar Gancang Nyambung",
    experienceIntro: "Bagian ieu nerangkeun perjalanan anggota sacara umum. Rincian pendaftaran, unit, dinas, jeung event tetep aya di home.",
    experience: [
      ["01", "Asup Jeung Ngarti Budaya", "Anggota diarahkan pikeun ngarti etika komunikasi, cara maca instruksi, jeung kabiasaan dasar di PASKUS."],
      ["02", "Milu Kegiatan Kalawan Irama", "Kegiatan dipasihkeun bertahap supaya anggota biasa jeung briefing, koordinasi, jeung sikap dina scenario."],
      ["03", "Nembongkeun Konsistensi", "Keaktifan, sikap, jeung kerja bareng jadi sinyal utama saméméh anggota diarahkan ka jalur lanjut."],
      ["04", "Milih Jalur Kontribusi", "Sanggeus ngarti budaya, anggota bisa ningali pilihan unit, dinas, atawa pendaftaran liwat home."],
    ],
    continueKicker: "Terus Ti Beranda",
    continueTitle: "Akses Gancang Tanpa Ngulang Informasi",
    continueIntro: "Home tetep jadi pusat informasi rinci. About ngan méré konteks budaya jeung arah navigasi.",
    homeLinks: [
      { title: "Daptar Personel", body: "Paké bagian pendaftaran di home pikeun ngirim data awal anggota sacara resmi.", href: "/#enlist", label: "Buka Daptar" },
      { title: "Unit Tempur", body: "Detail card, spesialisasi, jeung kaca unit aya di bagian Unit Tempur home.", href: "/#combat", label: "Tingali Unit" },
      { title: "Dinas Non-Tempur", body: "Informasi jeung detail page dinas non-tempur bisa dibuka ti bagian Dinas.", href: "/#support", label: "Tingali Dinas" },
      { title: "Discord Hub", body: "Asup ka Discord pikeun komunikasi, koordinasi kegiatan, jeung sinkronisasi identitas.", href: "https://discord.gg/aaBR9ruFva", label: "Asup Discord" },
    ],
  };

  GLOBAL_COPY.su = {
    ...GLOBAL_COPY.id,
    nav: { home: "BERANDA", combat: "TEMPUR", support: "DINAS", streamer: "STREAMER", brm5: "BRM5", structure: "STRUKTURAL", about: "NGEUNAAN", discord: "DISCORD", brandSub: "So-791" },
    module: {
      overviewKicker: "Modul Pangenalan Unit Jeung Dinas So-791",
      overviewTitle: "Analisa Kamampuan, Karir, Jeung Penempatan",
      overviewBody: "Modul ieu jadi dasar penjelasan kamampuan tempur, tugas unit, dinas khusus, jeung jalur komitmen anggota di So-791.",
      regularStat: "Personel Reguler",
      specialStat: "Personel Unit Khusus",
      discordStat: "Gabung Discord",
      eventsKicker: "Jenis Event Khusus",
      eventsTitle: "Full RP, Non RP, Jeung Scenario Training",
      eventsBody: "Kegiatan So-791 dirancang pikeun nguatkeun strategi, roleplay, koordinasi, jeung kesiapan anggota dina operasi internal atawa eksternal.",
      golonganKicker: "Pembagian Golongan Latihan",
      golonganTitle: "Waktu Aktif Isuk Jeung Peuting",
      golonganBody: "Golongan dipaké pikeun ngabantu jadwal latihan supaya kandidat asup kana rentang waktu anu paling cocog jeung aktivitasna.",
      combatKicker: "// UNIT KHUSUS So-791",
      combatTitle: 'UNIT <span class="text-[#9DC183]">KHUSUS TEMPUR</span>',
      supportKicker: "// DINAS JEUNG KARIR So-791",
      supportTitle: 'DINAS <span class="text-[#EFBF04]">NON-TEMPUR</span>',
    },
    unitDetail: {
      detailUnit: "Rincian Unit",
      detailService: "Rincian Dinas",
      operationalPriority: "Prioritas Operasional",
      doctrineUnit: "DOKTRIN UNIT",
      priorityTitle: "Prioritas Jeung Karakter Personel",
      priorityPanel: "Prioritas ieu jadi bagian tina penilaian karakter, bakat, jeung kesiapan individu saméméh berdinas sacara konsisten di {unit}.",
    },
    supportDetail: {
      nonCombat: "Dinas Non-Tempur",
      backToServices: "Balik Ka Dinas",
      contactCommand: "Hubungi Komando",
      moduleStandard: "Standar Modul",
      rank: "Standar Pangkat",
      task: "Tugas Utama",
      aspect: "Aspek Prioritas",
      doctrine: "Doctrine",
      assessmentAspect: "Aspek penilaian",
      readinessFlow: "Alur Kesiapan",
      serviceSelection: "Seleksi Dinas Jeung Kontribusi Resimen",
    },
    structure: {
      title: "Struktural PASKUS Gi1 | So-791",
      kicker: "Struktural So-791 / Chain Of Command",
      heading: "Struktural",
      headingSpan: "Komando Jeung Pangkat",
      overviewFallback: "Struktur komando So-791 ditampilkeun ringkes supaya jenjang pangkat jeung personel gampang dipantau.",
      overviewDocument: "Kaca ieu ngamuat struktur komando, jenjang pangkat, insignia, role, jeung daftar personel So-791 dina tampilan anu rapih jeung gampang dibaca.",
      categories: "Kategori",
      ranks: "Pangkat",
      personnel: "Personel",
      registeredPersonnel: "Personel Terdaftar",
      commandRoot: "Command Root",
      countLine: "{ranks} pangkat / {members} personel",
      errorTitle: "Data Teu Kabaca",
      errorBody: "Data struktural can bisa dimuat. Mangga refresh kaca.",
      loadingTitle: "Muat Struktur",
      loadingBody: "Website keur ngamuat struktur komando jeung daftar personel panganyarna.",
    },
    form: {
      privacy: "Kami ngan nyokot ID Discord pikeun pendataan resimen jeung otomatisasi.",
      checking: "Mariksa status Discord sync. Antosan sateuacan ngirim pendaftaran.",
      notConfigured: "Discord sync wajib aktif sateuacan pendaftaran. Admin kedah mastikeun konfigurasi Discord OAuth sayogi.",
      unauthenticated: "Sinkronkeun akun Discord pikeun nyokot ID otomatis sateuacan ngirim pendaftaran.",
      noRole: "Discord tersinkron salaku {display}. Akun ieu can boga role anu diijinkeun pikeun pendaftaran unit tempur.",
      synced: "Discord tersinkron salaku {display}. ID bakal dikirim otomatis pikeun tag di aplikasi pelatih.",
      syncTitle: "Discord Sync",
      resetSync: "Reset Sinkron",
      syncDiscord: "Sinkronkeun Discord",
      openingDiscord: "Muka Discord...",
      discordIdPlaceholder: "Sinkron Discord pikeun nyokot ID",
      autoTitle: "Dieusian otomatis tina akun Discord anu tersinkron.",
      waitingInline: "Mariksa status Discord sync. Pendaftaran bakal dibuka sanggeus status kabaca.",
      configInline: "Discord sync wajib aktif sateuacan pendaftaran. Hubungi admin lamun tombol sinkron teu aya.",
      authInline: "Akun Discord wajib disinkronkeun sateuacan pendaftaran.",
      syncNow: "Sinkronkeun ayeuna",
      roleInline: "Akun Discord tersinkron, tapi can boga role akses pikeun pendaftaran unit tempur.",
      syncedInline: "Discord tersinkron: <strong>{display}</strong>. ID bakal dikirim otomatis.",
      alertChecking: "Sistem keur mariksa status Discord. Cobian deui sakedap.",
      alertConfig: "Discord sync can aktif di server. Data teu dikirim ka aplikasi perekrut atawa Discord.",
      alertAuth: "Pendaftaran wajib sinkron Discord heula. Data teu dikirim ka aplikasi perekrut atawa Discord saméméh sync.",
      alertRole: "Akun Discord anjeun can boga role akses pikeun daptar unit tempur.",
      golonganOne: "Golongan 1",
      golonganOneBody: "Isuk nepi ka beurang ngajelang sore.",
      golonganTwo: "Golongan 2",
      golonganTwoBody: "Sore nepi ka peuting.",
    },
    cs: {
      subtitle: "Pusat Informasi Resimen",
      panelSubtitle: "QnA jeung pendaftaran",
      closeLabel: "Tutup PASKUS AI SERVICE",
      placeholder: "Taros soal pendaftaran, unit, golongan...",
      send: "Kirim",
      wait: "Antosan",
      typing: "PASKUS AI SERVICE keur ngetik",
      unavailable: "Hapunten, PASKUS AI SERVICE can tiasa ngajawab ayeuna. Cobian deui sakedap atanapi hubungi admin liwat Discord.",
      empty: "Informasi can sayogi.",
      idle: "Teu aya chat lanjutan leuwih ti 10 menit. Chat bakal di-refresh pikeun kestabilan fitur.",
      note: "PASKUS AI SERVICE ngutamakeun konten website PASKUS minangka sumber jawaban. Chat disimpen sementara 10 menit dumasar sesi/IP; data anggota, bypass, jeung jalur pangkat teu resmi tetep ditolak pikeun kaamanan resimen.",
      greeting: "Halo, abdi PASKUS AI SERVICE. Abdi ngajawab dumasar informasi website PASKUS: pendaftaran, Discord sync, golongan latihan, unit tempur, dinas non-tempur, PMC/sipil, jeung struktural.",
    },
    unitRoles: { gatam: "Prioritas Operasi Khusus", bringas: "Darat / Infanteri Mekanis", toruk: "Sky Lord / Unit Udara", sierra: "Infiltrasi & Sabotase Taktis", pathfinder: "Recon & Infiltrasi", sentinel: "Pertahanan & Combat Medic", komodo: "Pasukan Reguler" },
    komodo: {
      ...GLOBAL_COPY.id.komodo,
      eyebrow: "Status: pasukan reguler / barak awal",
      back: "Balik Ka Unit Tempur",
      contact: "Hubungi Komando",
      unit: {
        ...GLOBAL_COPY.id.komodo.unit,
        category: "Pasukan Reguler / Barak Awal",
        hero: "KOMODO nyaéta pasukan reguler PASKUS sakaligus satuan awal pikeun anggota anyar. Unit ieu jadi barak pembentukan dasar ti pangkat Prada nepi ka Praka, tempat personel ngenal kultur komando, disiplin lapangan, etika barak, jeung standar loyalitas.",
        doctrineTitle: "Barak Disiplin Jeung Filter Personel",
        doctrine: "Di KOMODO, anggota teu ngan dipikawanohkeun kana sistem PASKUS, tapi ogé diuji konsistensi, kedisiplinan, komunikasi, jeung kesiapan nuturkeun rantai komando.",
        cards: [
          ["Orientasi Anggota", "Pangenalan struktur PASKUS, kultur barak, cara komunikasi, jeung dasar kedisiplinan."],
          ["Disiplin Barak", "Ngalatih ketertiban, patuh kana instruksi, kesiapan apel, jeung kabiasaan operasional dasar."],
          ["Filter Kesiapan", "Meunteun komitmen, attitude, keaktifan, jeung kamampuan nuturkeun standar komando."],
          ["Garda Pelatihan", "Gerbang utama pembinaan ti Prada nepi ka Praka saméméh penempatan lanjut ditangtukeun."],
        ],
        route: "Prajurit awal diarahkan liwat pangenalan sistem, latihan disiplin, observasi sikap, jeung evaluasi kesiapan saméméh penempatan salajengna.",
      },
    },
    unitSelectLabels: {
      GATAM: "GATAM (Operasi Rahasia)",
      SENTINEL: "SENTINEL (Combat Medic)",
      PATHFINDER: "PATHFINDER (Ranger & Scout)",
      BRINGAS: "BRINGAS (Darat / Infanteri Mekanis)",
      SIERRA: "SIERRA (Infiltrasi & Sabotase Taktis)",
      "TORUK MAKTO": "TORUK MAKTO (Sky Lord / Unit Udara)",
    },
  };

  MODULE_TRANSLATIONS.su = {
    homeLead: "PASKUS Gi1 nempatkeun unit khusus jeung dinas minangka jalur pangembangan kamampuan tempur, strategi, roleplay, jeung karir. Saban personel dinilai tina komunikasi, struktur tugas, komando, karakter, jeung efektivitas supaya penempatan di So-791 saluyu jeung potensi individu.",
    overview: [
      { title: "Latar Tukang", body: "Bédana pangalaman tempur jadi ukuran penting pikeun meunteun kesiapan prajurit. Komunikasi, struktur tugas, komando, jeung konsistensi jadi dasar naha individu cocog asup ka unit atawa dinas anu dipilih." },
      { title: "Strategi Jeung Prioritas", body: "Saban unit khusus jeung dinas boga fokus, disiplin, karakter, sarta strategi anu béda. Penempatan pangsaéna lahir tina kerja bareng, adaptasi, jeung kecocokan kana budaya tugas." },
      { title: "Alur Pendaftaran", body: "Individu anu siap komitmen bakal ngalangkungan wawancara, uji kamampuan, uji karakter jeung bakat, tuluy masa pra-dinas." },
      { title: "Event Jeung Operasi", body: "Kegiatan ngawengku PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, jeung External PVP pikeun ngawangun strategi, pangalaman taktis, jeung kualitas roleplay." },
    ],
    events: [
      { title: "PVE Vanilla Scenario", body: "Misi Map Vanilla Ronograd pikeun nguatkeun pangalaman taktis, koordinasi, jeung roleplay semi nepi ka hardcore." },
      { title: "PVE Custom Scenario", body: "Misi custom anu dijieun pikeun kabutuhan strategi. Sababaraha skenario bisa diilhaman ku kajadian nyata supaya operasi karasa leuwih hirup." },
      { title: "Internal PVP", body: "Fun deathmatch atawa competitive 5v5, 10v10, nepi ka 15v15 anu dijalankeun di map custom ku koordinator event." },
      { title: "External PVP", body: "Competitive match jeung resimen atawa komunitas séjén pikeun nguji taktik, disiplin, jeung kerja bareng lintas satuan." },
    ],
    golongan: [
      { title: "Golongan 1", body: "Jadwal pikeun isuk nepi ka beurang ngajelang sore. Cocog pikeun anggota anu aktif dina awal poé." },
      { title: "Golongan 2", body: "Jadwal pikeun sore nepi ka peuting. Cocog pikeun anggota anu leuwih aktif sanggeus beurang." },
    ],
  };

  UNIT_LOCALIZATION.su = {
    bringas: { category: "Darat / Heavy Duty Unit", hero: "BRINGAS nyaéta pasukan tempur utama infanteri mekanis anu spesialis dina kavaleri ringan jeung platform APC, AV, sarta IFV. Unit ieu mawa daya tembak berat, perlindungan infanteri, jeung mobilisasi gancang.", doctrineTitle: "Daya Tembak Berat Jeung Mobilitas Mekanis", doctrine: "BRINGAS dilatih pikeun ngancurkeun tekanan musuh ku senjata berat jeung kendaraan tempur, bari ngajaga infanteri nalika kondisi ngabutuhkeun perpindahan gancang.", cards: [["APC / AV / IFV", "Ngawasaan kendaraan lapis baja pikeun mawa personel, nahan tekanan, jeung muka ruang gerak."], ["Fire Support", "Méré daya tembak kuat pikeun ngancurkeun titik tahan musuh."], ["Rapid Protection", "Méré perlindungan jeung mobilisasi gancang nalika infanteri kudu kaluar tina kondisi darurat."]], priorities: ["Adaptasi dina tekanan", "Disiplin mobilisasi", "Daya tahan di medan keras", "Bisa dipercaya"], route: "Wawancara, uji kamampuan kendaraan, uji karakter, tuluy masa pra-dinas.", footer: "SIAP JADI DAYA PUKUL MEKANIS?" },
    "toruk-makto": { category: "Sky Lord / Unit Udara", hero: "TORUK MAKTO nyaéta unit udara anu fokus kana penyisipan udara gancang, eksfiltrasi, CAS, CASEVAC, pasukan parasut, lintas udara, jeung pilot pangalusna So-791.", doctrineTitle: "Presisi Udara Tanpa Ruang Kasalahan", doctrine: "Operasi udara penting pisan jeung teu masihan ruang pikeun kasalahan. Personel TORUK MAKTO kudu disiplin, presisi, adaptif, jeung sanggup nyokot kaputusan gancang.", cards: [["Fast Insertion", "Ngalakukeun penyisipan udara gancang pikeun nempatkeun personel kana titik operasi."], ["CAS / CASEVAC", "Ngadukung pasukan darat ku dukungan udara jarak dekat jeung evakuasi korban."], ["Airborne Path", "Muka jalur parasut jeung lintas udara pikeun personel anu siap."]], priorities: ["Disiplin luhur", "Presisi piloting", "Adaptasi kuat", "Teu toleran kana kasalahan operasi"], route: "Wawancara, uji kamampuan udara, uji karakter, tuluy masa pra-dinas.", footer: "SIAP JADI LORD OF THE SKY?" },
    pathfinder: { category: "Ranger And Scout Unit", hero: "PATHFINDER nyaéta infanteri pengintai anu fokus kana reconnaissance, pengawasan, marksmanship, jeung komunikasi tajam pikeun ningkatkeun efektivitas operasi So-791.", doctrineTitle: "Pengawasan, Kasabaran, Jeung Tembakan Presisi", doctrine: "PATHFINDER nyadiakeun pengawasan jeung intelijen anu nangtukeun kalancaran operasi. Personelna kudu disiplin, presisi, sabar, jeung komunikatif.", cards: [["Recon Watch", "Ngawas medan, maca pergerakan, jeung méré hasil pengintaian ka komando."], ["Marksmanship", "Ngandelkeun tembakan presisi pikeun ngajaga jarak jeung kontrol area."], ["Tactical Signal", "Ngajaga komunikasi pengintai tetep jelas, gancang, jeung bisa dipaké unit utama."]], priorities: ["Sabar", "Presisi observasi", "Kamampuan menembak", "Komunikasi tajam"], route: "Wawancara, uji pengintaian, uji karakter, tuluy masa pra-dinas.", footer: "SIAP MUKA JALAN OPERASI?" },
    sierra: { category: "Infiltration And Tactical Sabotage Unit", hero: "SIERRA nyaéta sél infanteri khusus anu bergerak senyap, taliti, jeung terukur pikeun muka celah operasi, ngaganggu ritme lawan, sarta ngarengsekeun sasaran penting tanpa leupas tina disiplin komando.", doctrineTitle: "Gerak Senyap Kalayan Eksekusi Tegas", doctrine: "SIERRA jadi identitas anyar unit sabotase taktis PASKUS Gi1. Fokusna aya dina infiltrasi, observasi jarak deukeut, koordinasi tim leutik, komunikasi pondok, jeung eksekusi gancang anu tetep rapi.", cards: [["Silent Entry", "Asup ka area sasaran sacara senyap, maca celah, jeung nyiapkeun ruang aksi keur unit utama."], ["Tactical Disruption", "Ngaganggu fasilitas, ritme, jeung konsentrasi lawan ku sabotase anu gancang jeung terarah."], ["Precision Cell", "Bergerak salaku sél leutik kalayan komunikasi singket, kaputusan matang, jeung disiplin eksekusi."]], priorities: ["Gerak senyap", "Kontrol emosi", "Kaputusan presisi", "Koordinasi sél leutik"], route: "Wawancara, uji infiltrasi taktis, uji komunikasi tim leutik, uji karakter, tuluy masa pra-dinas.", footer: "SIERRA / SILENT DISRUPTION CELL So-791" },
    sentinel: { category: "Combat Medic Unit", hero: "SENTINEL nyaéta tenaga medis tempur anu spesialis dina pertolongan pertama di medan aktif, ngadukung resimen ku perlengkapan medis, logistik, jeung kendaraan lapis baja medis.", doctrineTitle: "Moral, Medis, Jeung Logistik Dina Garis Hirup", doctrine: "SENTINEL ngajaga operasi tetep jalan liwat pertolongan pertama, koordinasi, komunikasi, jeung dukungan logistik. Personelna kudu fokus, disiplin, bermoral, jeung siap ngabantu rekan.", cards: [["First Response", "Méré pertolongan pertama di medan aktif supaya personel bisa distabilkeun atawa dievakuasi."], ["Armored Medical", "Ngadukung evakuasi jeung mobilitas medis ku kendaraan lapis baja medis."], ["Logistic Care", "Ngatur perlengkapan medis jeung logistik supaya operasi teu leungit dukungan."]], priorities: ["Fokus kuat", "Koordinasi jeung komunikasi", "Motivasi ngabantu rekan", "Moral jeung disiplin"], route: "Wawancara, uji kamampuan medis, uji karakter, tuluy masa pra-dinas.", footer: "SIAP JADI GARIS HIRUP OPERASI?" },
    gatam: { category: "Infiltration And Stealth Unit", hero: "GATAM atawa Garuda Hitam nyaéta unit pasukan khusus anu spesialis dina operasi rahasia, bergerak mandiri pikeun ngamankeun posisi strategis, ngeliminasi target, atawa ngabébaskeun kompleks.", doctrineTitle: "Operasi Rahasia Kalayan Presisi", doctrine: "GATAM merlukeun fokus kuat, koordinasi, komunikasi, motivasi penyelesaian, jeung adaptasi dina tekanan. Hiji kasalahan bisa ngagagalkeun sakabéh operasi.", cards: [["Stealth Entry", "Asup ka area operasi sacara senyap pikeun muka peluang pengamanan posisi strategis."], ["Strategic Control", "Ngamankeun titik penting jeung ngajaga ruang gerak komando dina operasi rahasia."], ["Target Resolution", "Ngeliminasi target atawa ngabébaskeun kompleks kalayan disiplin jeung presisi."]], priorities: ["Fokus kuat", "Koordinasi jeung komunikasi", "Adaptasi dina tekanan", "Teu toleran kana kasalahan"], route: "Wawancara, uji infiltrasi, uji karakter, tuluy masa pra-dinas.", footer: "SIAP GERAK DINA OPERASI RAHASIA?" },
  };

  SUPPORT_LOCALIZATION.su = Object.fromEntries(Object.entries(SUPPORT_LOCALIZATION.en).map(([slug, unit]) => [slug, {
    ...unit,
    body: unit.body.replace("A service", "Dinas").replace("The regiment", "Dinas resimen"),
    doctrine: `${unit.doctrine} Penilaian dina dinas ieu tetep ngutamakeun disiplin, komunikasi, tanggung jawab, jeung kesiapan kontribusi pikeun resimen.`,
    route: unit.route.replace("Assessment focuses on", "Penilaian difokuskeun kana").replace("Rank standard", "Standar pangkat"),
  }]));

  const STREAMER_COPY = {
    metaTitle: "Streamer Hub PASKUS Gi1 | Karya So-791",
    heroKicker: "Highlight Play",
    heroTitle: "PASKUS GI1",
    heroSubtitle: "Streamer Hub / Karya So-791",
    hero: "Panggung karya PASKUS Gi1 untuk highlight play, dokumentasi event, video operasi, dan profil creator resmi.",
    actions: [
      { label: "Official Media", href: "#streamer-official" },
      { label: "Kalender Event", href: "#streamer-calendar" },
      { label: "Event Documentation", href: "#streamer-archive" },
    ],
    live: {
      badge: "Featured Play",
      title: "Official Highlight",
      body: "Video utama yang tampil pertama kali saat anggota masuk ke Streamer Hub.",
      metrics: [["19s", "Highlight"], ["WEBM", "Fast Load"], ["So-791", "Archive"]],
    },
    socialKicker: "Official Social Media",
    socialTitle: "Akun Resmi PASKUS Gi1",
    discordSocial: { name: "Discord PASKUS", handle: "PASKUS Gi1 / So-791", status: "Community Hub", href: "https://discord.gg/aaBR9ruFva" },
    officialSocials: [
      { type: "tiktok", name: "TikTok PASKUS", handle: "@paskus791", status: "Official Short Video", href: "https://www.tiktok.com/@paskus791" },
      { type: "roblox", name: "Roblox Community", handle: "PASUKAN KHUSUS 791", status: "Official Roblox Group", href: "https://www.roblox.com/communities/767288802/PASUKAN-KHUSUS-791" },
    ],
    eventKicker: "Event Calendar",
    eventTitle: "Jadwal Produksi Dan Stream",
    eventIntro: "Format kalender untuk melihat event berjalan, slot dokumentasi, dan jadwal publikasi karya.",
    events: [
      { day: "06", month: "JUN", title: "Highlight Drop", body: "Publish short video official." },
      { day: "08", month: "JUN", title: "Training Clip", body: "Dokumentasi briefing dan orientasi." },
      { day: "12", month: "JUN", title: "Operation Recap", body: "Event recap untuk arsip website." },
      { day: "15", month: "JUN", title: "Creator Brief", body: "Pembagian POV dan angle konten." },
      { day: "21", month: "JUN", title: "Community Premiere", body: "Tayangan pilihan untuk anggota." },
    ],
    rosterKicker: "Roster Streamer",
    rosterTitle: "Streamer Dan Content Creator",
    rosterIntro: "Profil creator yang memegang konten official, POV combat, training, dan arsip media.",
    creators: [
      { name: "PASKUS Official", role: "Official", focus: "Highlight utama, publikasi resmi, dan arsip karya PASKUS Gi1.", schedule: "Event resmi", tags: ["Official", "Premiere", "Archive"] },
      { name: "Combat POV Desk", role: "POV Combat", focus: "Sudut pandang unit tempur dan operasi lapangan.", schedule: "Scenario combat", tags: ["POV", "Combat", "Unit"] },
      { name: "Training Desk", role: "Training", focus: "Briefing, orientasi, dan dokumentasi pelatihan anggota.", schedule: "Latihan", tags: ["Training", "Guide", "Recruit"] },
      { name: "Media Archive", role: "Editor", focus: "Clip pendek, thumbnail, recap, dan bank footage event.", schedule: "Pasca event", tags: ["Clip", "Recap", "Media"] },
    ],
    galleryKicker: "Event Documentation",
    galleryTitle: "Featured Operations Gallery",
    galleryIntro: "Showcase horizontal untuk footage operasi, highlight event, POV unit, dan dokumentasi visual PASKUS Gi1.",
    galleryMoreLabel: "See More",
    archiveKicker: "Event Documentation",
    archiveTitle: "Dokumentasi Event PASKUS",
    archiveIntro: "Koleksi card video untuk highlight event, POV unit, trailer, dan dokumentasi resmi.",
    contentCards: [
      { type: "Featured Video", title: "PASKUS Gi1 Highlight Play", uploader: "PASKUS Official", unit: "Official", status: "Ready Watch", video: "/assets/paskus-landing-download3-6-45-v1.webm", fallback: "/assets/paskus-streamer-highlight-download3-v1.mp4", poster: "/assets/paskus-landing-loop-poster-v2.jpg" },
      { type: "Event Recap", title: "GATAM Operation Frame", uploader: "Media Archive", unit: "GATAM", status: "Photo Documentation", poster: GATAM_CARD_BG_URL },
      { type: "Combat POV", title: "SIERRA Tactical Cell", uploader: "Combat Media", unit: "SIERRA", status: "Field Documentation", poster: "/assets/sierra-card-bg-card-v1.webp" },
      { type: "Air Insert", title: "TORUK Makto Air Wing", uploader: "Aviation Desk", unit: "TORUK MAKTO", status: "Operation Still", poster: "/assets/toruk-card-bg-card.webp" },
      { type: "Recon Shot", title: "Pathfinder Recon Route", uploader: "Recon Desk", unit: "PATHFINDER", status: "Photo Documentation", poster: "/assets/pathfinder-card-bg-card.webp" },
      { type: "Medic Recap", title: "Sentinel Field Support", uploader: "Medical Desk", unit: "SENTINEL", status: "Event Support", poster: SENTINEL_CARD_BG_URL },
    ],
  };

  const STREAMER_TRANSLATIONS = {
    en: {
      metaTitle: "PASKUS Gi1 Streamer Hub | So-791 Creator",
      heroKicker: "PASKUS Creator Hub",
      heroTitle: "STREAMER",
      heroSubtitle: "Content, Highlights, And Regiment Events",
      hero: "The official space for PASKUS Gi1 streamers: curated content, operation highlights, running events, and creator roster by upload focus.",
      actions: [
        { label: "View Highlights", href: "#streamer-highlights" },
        { label: "Running Events", href: "#streamer-events" },
        { label: "Submit Content", href: "https://discord.gg/aaBR9ruFva", external: true },
      ],
    },
    fil: {
      heroSubtitle: "Content, Highlight, At Regiment Events",
      hero: "Opisyal na space para sa streamer ng PASKUS Gi1: curated content, operation highlights, active events, at creator roster ayon sa upload focus.",
    },
    hi: {
      heroSubtitle: "Content, Highlights, और Regiment Events",
      hero: "PASKUS Gi1 streamers के लिए official space: curated content, operation highlights, running events, और upload focus के अनुसार creator roster.",
    },
    su: {
      heroSubtitle: "Konten, Highlight, Jeung Event Resimen",
      hero: "Ruang resmi pikeun streamer PASKUS Gi1: konten pilihan, highlight operasi, event anu keur jalan, jeung roster creator dumasar jenis upload.",
    },
    jv: {
      heroSubtitle: "Konten, Highlight, Lan Event Resimen",
      hero: "Ruang resmi kanggo streamer PASKUS Gi1: konten pilihan, highlight operasi, event sing mlaku, lan roster creator miturut jenis upload.",
    },
  };

  const UNIT_SELECT_LABELS = {
    "GATAM": "GATAM (Operasi Rahasia)",
    "SENTINEL": "SENTINEL (Combat Medic)",
    "PATHFINDER": "PATHFINDER (Ranger & Scout)",
    "BRINGAS": "BRINGAS (Darat / Infanteri Mekanis)",
    "SIERRA": "SIERRA (Infiltrasi & Sabotase Taktis)",
    "TORUK MAKTO": "TORUK MAKTO (Sky Lord / Unit Udara)",
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function hexToRgb(hex) {
    const raw = String(hex || "").replace("#", "").trim();
    const value = raw.length === 3
      ? raw.split("").map((char) => `${char}${char}`).join("")
      : raw;
    if (!/^[0-9a-f]{6}$/i.test(value)) {
      return "";
    }
    const number = Number.parseInt(value, 16);
    return `${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}`;
  }

  function languageMeta(code) {
    return PASKUS_LANGUAGES.find((language) => language.code === code) || PASKUS_LANGUAGES[0];
  }

  function debugWarn(...args) {
    if (PASKUS_DEBUG && typeof console !== "undefined" && typeof console.warn === "function") {
      console.warn(...args);
    }
  }

  function detectPreferredLanguage() {
    let candidates = [];
    try {
      candidates = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ""];
    } catch (_error) {
      candidates = [];
    }

    const normalized = candidates.map((item) => String(item || "").toLowerCase());
    if (normalized.some((item) => item.startsWith("id"))) {
      return "id";
    }
    if (normalized.some((item) => item.startsWith("su"))) {
      return "su";
    }
    if (normalized.some((item) => item.startsWith("jv") || item.startsWith("jw"))) {
      return "jv";
    }
    if (normalized.some((item) => item.startsWith("fil") || item.startsWith("tl"))) {
      return "fil";
    }
    if (normalized.some((item) => item.startsWith("hi") || item === "en-in")) {
      return "hi";
    }

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (/^(Asia\/Jakarta|Asia\/Makassar|Asia\/Jayapura|Asia\/Pontianak)$/i.test(timezone)) {
        return "id";
      }
    } catch (_error) {
      // Timezone is only used as a lightweight, non-precise language hint.
    }

    return "en";
  }

  function currentLanguage() {
    try {
      const stored = window.localStorage.getItem(PASKUS_LANGUAGE_STORAGE_KEY);
      if (PASKUS_LANGUAGES.some((language) => language.code === stored)) {
        return stored;
      }
    } catch (_error) {
      return detectPreferredLanguage();
    }
    return detectPreferredLanguage();
  }

  function aboutCopy(language = currentLanguage()) {
    return ABOUT_TRANSLATIONS[language] || ABOUT_COPY;
  }

  function arrayOrFallback(value, fallback = []) {
    return Array.isArray(value) && value.length > 0 ? value : fallback;
  }

  function streamerRemoteData() {
    const payload = streamerContentCache?.data;
    return payload && typeof payload === "object" ? payload : null;
  }

  function streamerCopy(language = currentLanguage()) {
    const base = { ...STREAMER_COPY, ...(STREAMER_TRANSLATIONS[language] || {}) };
    const remote = streamerRemoteData();
    const hub = remote?.hub && typeof remote.hub === "object" ? remote.hub : null;
    if (!hub) {
      return base;
    }

    const live = hub.live && typeof hub.live === "object" ? hub.live : {};
    const discordSocial = hub.discordSocial && typeof hub.discordSocial === "object" ? hub.discordSocial : {};
    return {
      ...base,
      ...Object.fromEntries(
        ["metaTitle", "heroKicker", "heroTitle", "heroSubtitle", "socialKicker", "socialTitle", "eventKicker", "eventTitle", "galleryKicker", "galleryTitle", "galleryIntro", "galleryMoreLabel", "archiveKicker", "archiveTitle", "archiveIntro"]
          .map((key) => [key, hub[key] || base[key]])
      ),
      live: { ...base.live, ...live },
      discordSocial: { ...base.discordSocial, ...discordSocial },
    officialSocials: arrayOrFallback(hub.officialSocials, base.officialSocials),
      events: arrayOrFallback(hub.events, base.events),
      creators: arrayOrFallback(hub.creators, base.creators),
      profiles: Array.isArray(remote?.profiles) ? remote.profiles : [],
      contentCards: arrayOrFallback(hub.contentCards, base.contentCards),
    };
  }

  function fetchStreamerContent() {
    if (streamerContentCache) {
      return Promise.resolve(streamerContentCache);
    }
    if (streamerContentPromise) {
      return streamerContentPromise;
    }
    streamerContentPromise = fetch(`${STREAMER_CONTENT_API_URL}?t=${Date.now()}`, {
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Streamer content ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (payload?.ok && payload.data) {
          streamerContentCache = payload;
        }
        return streamerContentCache;
      })
      .catch(() => null)
      .finally(() => {
        streamerContentPromise = null;
      });
    return streamerContentPromise;
  }

  function uiCopy(language = currentLanguage()) {
    return GLOBAL_COPY[language] || GLOBAL_COPY.id;
  }

  function templateText(text, values = {}) {
    return Object.entries(values).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, String(value ?? "")),
      String(text || ""),
    );
  }

  function clonePlain(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function moduleCopy(language = currentLanguage()) {
    const copy = clonePlain(MODULE_COPY);
    const topLevel = MODULE_TRANSLATIONS[language];
    if (topLevel) {
      Object.assign(copy, clonePlain(topLevel));
    }

    const supportLocalization = SUPPORT_LOCALIZATION[language] || {};
    Object.entries(supportLocalization).forEach(([slug, localized]) => {
      if (copy.support[slug]) {
        copy.support[slug] = { ...copy.support[slug], ...clonePlain(localized) };
      }
    });

    const unitLocalization = UNIT_LOCALIZATION[language] || {};
    Object.entries(unitLocalization).forEach(([slug, localized]) => {
      if (copy.units[slug]) {
        copy.units[slug] = { ...copy.units[slug], ...clonePlain(localized) };
      }
    });

    copy.units.komodo = clonePlain(uiCopy(language).komodo.unit);
    return copy;
  }

  function setCurrentLanguage(language) {
    const code = PASKUS_LANGUAGES.some((item) => item.code === language) ? language : "id";
    try {
      window.localStorage.setItem(PASKUS_LANGUAGE_STORAGE_KEY, code);
    } catch (_error) {
      // Local storage is not required for the switcher to work in the current view.
    }
    document.documentElement.lang = languageMeta(code).htmlLang;
    return code;
  }

  function languageSwitcherHtml() {
    const active = currentLanguage();
    const label = currentLanguage() === "id" ? "Pilih bahasa" : "Select language";
    return `
      <div class="paskus-language-switcher" data-active-lang="${escapeHtml(active)}">
        <select class="paskus-language-select" data-language-select aria-label="${escapeHtml(label)}" title="${escapeHtml(languageMeta(active).title)}">
          ${PASKUS_LANGUAGES.map((language) => `
            <option value="${escapeHtml(language.code)}" ${language.code === active ? "selected" : ""}>${escapeHtml(language.label)}</option>
          `).join("")}
        </select>
      </div>
    `;
  }

  function syncLanguageSwitchers() {
    const active = currentLanguage();
    document.querySelectorAll(".paskus-language-switcher").forEach((switcher) => {
      switcher.setAttribute("data-active-lang", active);
      const select = switcher.querySelector(".paskus-language-select");
      if (select) {
        select.value = active;
        select.title = languageMeta(active).title;
      }
    });
  }

  function isStructuralPath() {
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    return path === "/struktural" || path === "/structural";
  }

  function stripMarkdown(value) {
    return String(value || "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();
  }

  function slugifyStructure(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  }

  function floatingNavCandidates() {
    return Array.from(document.querySelectorAll("nav, header")).filter((node) => {
      const text = (node.textContent || "").toUpperCase();
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const hasPrimaryLinks = text.includes("HOME") || text.includes("COMBAT") || text.includes("STREAMER") || text.includes("STRUKTURAL") || text.includes("DISCORD");
      const isTopNav = style.position === "fixed" || rect.top <= 24 || node.classList.contains("paskus-main-nav") || node.classList.contains("structure-nav") || node.classList.contains("about-nav") || node.classList.contains("support-nav") || node.classList.contains("paskus-komodo-nav") || node.classList.contains("streamer-nav");
      return hasPrimaryLinks && isTopNav;
    });
  }

  function currentNavOffset() {
    const nav = document.querySelector(".paskus-floating-nav");
    if (!nav) {
      return window.matchMedia("(max-width: 720px)").matches ? 82 : 92;
    }

    const rect = nav.getBoundingClientRect();
    return Math.max(70, Math.round(rect.height + rect.top + 18));
  }

  function applyFloatingNav() {
    const navs = floatingNavCandidates();
    navs.forEach((nav) => {
      nav.classList.add("paskus-floating-nav");
    });
    document.documentElement.style.setProperty("--paskus-nav-offset", `${currentNavOffset()}px`);
  }

  function ensureLanguageSwitcher() {
    floatingNavCandidates().forEach((nav) => {
      let switcher = nav.querySelector(".paskus-language-switcher");
      if (!switcher) {
        const template = document.createElement("template");
        template.innerHTML = languageSwitcherHtml().trim();
        switcher = template.content.firstElementChild;
        const reference = nav.querySelector(".paskus-structural-header-cta")
          || Array.from(nav.children).find((child) => child.tagName === "BUTTON");
        if (reference) {
          reference.before(switcher);
        } else {
          nav.appendChild(switcher);
        }
      }
    });
    syncLanguageSwitchers();
  }

  function navKeyForAnchor(anchor) {
    const existing = anchor.getAttribute("data-paskus-nav-key");
    if (existing) {
      return existing;
    }

    const href = anchor.getAttribute("href") || "";
    const text = (anchor.textContent || "").trim().toUpperCase();
    const isBrand = anchor.querySelector("img") || anchor.classList.contains("about-brand") || anchor.classList.contains("support-brand") || anchor.classList.contains("structure-brand");
    if (/discord\.gg/i.test(href) || text === "DISCORD") {
      return "discord";
    }
    if (href.includes("#combat") || text === "COMBAT" || text === "TEMPUR" || text === "TARUNG" || text === "कॉम्बैट") {
      return "combat";
    }
    if (href.includes("#support") || text === "SUPPORT" || text === "SUPORTA" || text === "DINAS" || text === "PANGROJONG" || text === "सपोर्ट") {
      return "support";
    }
    if (href.includes("/streamer") || text === "STREAMER" || text === "स्ट्रीमर") {
      return "streamer";
    }
    if (href.includes("/brm5-roleplay") || text === "BRM5") {
      return "brm5";
    }
    if (href.includes("/struktural") || href.includes("/structural") || text === "STRUKTURAL" || text === "STRUCTURE" || text === "ISTRUKTURA" || text === "स्ट्रक्चर") {
      return "structure";
    }
    if (href.includes("/about") || text === "ABOUT US" || text === "ABOUT" || text === "BABAGAN" || text === "NGEUNAAN" || text === "अबाउट") {
      return "about";
    }
    if (!isBrand && (href === "/" || href === "" || text === "HOME" || text === "BERANDA" || text === "IMAH" || text === "होम")) {
      return "home";
    }
    return "";
  }

  function applyGlobalLanguage() {
    const ui = uiCopy();
    document.documentElement.lang = languageMeta(currentLanguage()).htmlLang;

    document.querySelectorAll("nav a, header a, .paskus-structural-header-cta").forEach((anchor) => {
      const key = navKeyForAnchor(anchor);
      if (!key || !ui.nav[key]) {
        return;
      }
      anchor.setAttribute("data-paskus-nav-key", key);
      if (key === "combat") {
        anchor.setAttribute("data-paskus-anchor", "#combat");
      }
      if (key === "support") {
        anchor.setAttribute("data-paskus-anchor", "#support");
      }
      setText(anchor, ui.nav[key]);
    });

    document.querySelectorAll(".paskus-main-nav .nav-logo span span, .about-brand span span, .support-brand span span, .structure-brand span span, .streamer-brand span span").forEach((node) => {
      setText(node, PASKUS_BRAND_SUBLINE || ui.nav.brandSub);
    });

    const csWidget = document.querySelector(".paskus-cs-ai");
    if (csWidget) {
      setText(csWidget.querySelector(".paskus-cs-ai-toggle span span"), ui.cs.subtitle);
      setText(csWidget.querySelector(".paskus-cs-ai-brand span span"), ui.cs.panelSubtitle);
      csWidget.querySelector(".paskus-cs-ai-close")?.setAttribute("aria-label", ui.cs.closeLabel);
      const csInput = csWidget.querySelector(".paskus-cs-ai-form input");
      if (csInput) {
        csInput.setAttribute("placeholder", ui.cs.placeholder);
        csInput.setAttribute("aria-label", ui.cs.placeholder);
      }
      const csButton = csWidget.querySelector(".paskus-cs-ai-form button");
      if (csButton && !csButton.disabled) {
        csButton.textContent = ui.cs.send;
      }
      setText(csWidget.querySelector(".paskus-cs-ai-note"), ui.cs.note);
    }

    syncLanguageSwitchers();
    applyBrandIdentity();
  }

  function scrollToFirstHomeSection() {
    const target = document.querySelector(".paskus-indonesia-presence") || document.querySelector(".paskus-module-overview") || document.querySelector("#combat") || document.querySelector("#enlist");
    if (!target) {
      return;
    }
    const y = target.getBoundingClientRect().top + window.scrollY - currentNavOffset();
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  function ensureHomeHeroEnhancements() {
    if (window.location.pathname !== "/") {
      document.querySelector(".paskus-hero-motto")?.remove();
      document.querySelector(".paskus-home-scroll")?.remove();
      return;
    }

    const home = document.querySelector("#home");
    if (!home) {
      return;
    }

    const title = home.querySelector("h1");
    if (title) {
      setHtml(title, `
        <span class="paskus-hero-name">${escapeHtml(PASKUS_BRAND_NAME)}</span>
        <span class="paskus-hero-unit">| So - 791</span>
      `);
    }

    setText(home.querySelector("h1 + p"), PASKUS_HOME_SEO_SUBLINE);

    const actionGroup = (
      home.querySelector(".btn-enlist")?.closest(".flex") ||
      home.querySelector("a[href='#enlist']")?.closest(".flex") ||
      home.querySelector("a[href='/#enlist']")?.closest(".flex") ||
      home.querySelector("#hero-btns") ||
      home.querySelector(".flex.flex-col")
    );

    if (actionGroup && !home.querySelector(".paskus-hero-motto")) {
      const motto = document.createElement("div");
      motto.className = "paskus-hero-motto";
      motto.innerHTML = `
        <strong>${escapeHtml(PASKUS_HOME_MOTTO)}</strong>
        <span>${escapeHtml(PASKUS_HOME_MOTTO_SUBLINE)}</span>
      `;
      actionGroup.parentNode?.insertBefore(motto, actionGroup);
    }

    if (actionGroup && !home.querySelector(".paskus-home-scroll")) {
      const scroll = document.createElement("button");
      scroll.type = "button";
      scroll.className = "paskus-home-scroll";
      scroll.setAttribute("aria-label", PASKUS_HOME_SCROLL_LABEL);
      scroll.innerHTML = `
        <span class="paskus-home-scroll__icon" aria-hidden="true"></span>
        <span>${escapeHtml(PASKUS_HOME_SCROLL_LABEL)}</span>
      `;
      scroll.addEventListener("click", scrollToFirstHomeSection);
      actionGroup.insertAdjacentElement("afterend", scroll);
    }
  }

  function applyBrandIdentity() {
    document.querySelectorAll(".nav-logo strong, .about-brand strong, .support-brand strong, .structure-brand strong, .streamer-brand strong, .paskus-seo-footer__brand-row strong").forEach((node) => {
      setText(node, PASKUS_BRAND_NAME);
    });

    document.querySelectorAll(".paskus-main-nav .nav-logo span span, .about-brand span span, .support-brand span span, .structure-brand span span, .streamer-brand span span, .paskus-seo-footer__brand-row span span").forEach((node) => {
      setText(node, PASKUS_BRAND_SUBLINE);
    });

    if (window.location.pathname === "/") {
      ensureHomeHeroEnhancements();
      document.title = PASKUS_HOME_TITLE;
    }

    document.querySelectorAll(".paskus-video-intro__mark strong").forEach((node) => setText(node, PASKUS_BRAND_NAME));
    document.querySelectorAll(".paskus-video-intro__mark small").forEach((node) => setText(node, PASKUS_BRAND_SUBLINE));
  }

  function normalizedPath(path = window.location.pathname) {
    return String(path || "/").replace(/\/+$/, "") || "/";
  }

  function isStreamerPath(path = window.location.pathname) {
    const value = normalizedPath(path);
    return value === "/streamer" || value === "/streamers" || isStreamerDocumentationPath(value);
  }

  function isStreamerDocumentationPath(path = window.location.pathname) {
    const value = normalizedPath(path);
    return value === "/streamer/event-documentation"
      || value === "/streamer/documentation"
      || value === "/streamer/events"
      || value === "/streamer/see-more";
  }

  function anchorScrollTarget(hash) {
    if (!hash || hash === "#") {
      return null;
    }

    const id = decodeURIComponent(hash.slice(1));
    if (id === "combat") {
      return document.getElementById("combat");
    }
    if (id === "support") {
      return document.getElementById("support");
    }

    const escapedId = window.CSS?.escape ? window.CSS.escape(id) : id.replace(/"/g, '\\"');
    return document.getElementById(id) || document.querySelector(`[name="${escapedId}"]`);
  }

  function scrollToPageTop(behavior = "smooth") {
    applyFloatingNav();
    document.documentElement.classList.remove("paskus-nav-hidden");
    window.scrollTo({
      top: 0,
      behavior,
    });
    return true;
  }

  function scrollToHashTarget(hash, behavior = "smooth") {
    const target = anchorScrollTarget(hash);
    if (!target) {
      return false;
    }

    applyFloatingNav();
    const y = target.getBoundingClientRect().top + window.scrollY - currentNavOffset();
    window.scrollTo({
      top: Math.max(0, y),
      behavior,
    });
    return true;
  }

  function scheduleHashScroll(hash = window.location.hash, attempts = 12) {
    if (!hash) {
      return;
    }

    window.clearTimeout(pendingAnchorTimer);
    const run = (remaining) => {
      if (scrollToHashTarget(hash, remaining <= 8 ? "smooth" : "auto") || remaining <= 0) {
        return;
      }
      pendingAnchorTimer = window.setTimeout(() => run(remaining - 1), 120);
    };
    pendingAnchorTimer = window.setTimeout(() => run(attempts), 80);
  }

  function navigateToHomeAnchor(hash, attempts = 10) {
    const normalizedHash = hash.startsWith("#") ? hash : `#${hash}`;
    document.documentElement.classList.remove("paskus-nav-hidden");

    if (normalizedPath() !== "/") {
      try {
        window.sessionStorage.setItem("paskus-pending-anchor", normalizedHash);
      } catch (_error) {
        // Storage is best-effort only; direct navigation still lands on the anchor.
      }
      window.location.assign(`/${normalizedHash}`);
      return;
    }

    if (window.location.pathname !== "/" || window.location.search || window.location.hash !== normalizedHash) {
      window.history.pushState(null, "", `/${normalizedHash}`);
    }
    scheduleHashScroll(normalizedHash, attempts);
  }

  function applyLanguageChange(language) {
    setCurrentLanguage(language);
    lastStaticEnhanceKey = "";
    renderAboutPage(true);
    renderStreamerPage(true);
    renderStructuralPage(true);
    renderSupportDetailPage(true);
    renderKomodoPage(true);
    syncKomodoDetailRoster();
    ensureStreamerMenuLinks();
    ensureStructuralMenuLinks();
    ensureLanguageSwitcher();
    enhanceCombatCards();
    applyModuleCopy();
    enhanceRegisterForm(getRegisterForm());
    renderFloatingPanel();
    document.querySelectorAll("form").forEach((form) => {
      if (isManagedRegistrationForm(form)) {
        formMessage(form);
      }
    });
    applyGlobalLanguage();
    applyFloatingNav();
    document.documentElement.classList.remove("paskus-nav-hidden");
    if (window.location.pathname === "/about") {
      window.setTimeout(() => scrollToHashTarget(window.location.hash || "#", "auto"), 40);
    }
  }

  function installNavigationEnhancements() {
    applyFloatingNav();

    if (navEnhancementsInstalled) {
      return;
    }
    navEnhancementsInstalled = true;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const updateNavState = () => {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - lastScrollY;
      document.documentElement.classList.toggle("paskus-nav-scrolled", currentY > 12);
      const shouldHide = currentY > 140 && delta > 8;
      const shouldShow = currentY < 80 || delta < -6;
      if (shouldHide) {
        document.documentElement.classList.add("paskus-nav-hidden");
      }
      if (shouldShow) {
        document.documentElement.classList.remove("paskus-nav-hidden");
      }
      lastScrollY = currentY;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateNavState);
      }
    }, { passive: true });

    window.addEventListener("resize", () => window.setTimeout(applyFloatingNav, 80), { passive: true });
    window.addEventListener("hashchange", () => scheduleHashScroll(window.location.hash), { passive: true });

    document.addEventListener("change", (event) => {
      const languageSelect = event.target?.closest?.(".paskus-language-select[data-language-select]");
      if (languageSelect) {
        event.preventDefault();
        event.stopPropagation();
        applyLanguageChange(languageSelect.value);
      }
    }, true);

    document.addEventListener("click", (event) => {
      const navItem = event.target?.closest?.(".paskus-floating-nav a, .paskus-floating-nav button");
      const navAnchorTarget = navItem?.getAttribute?.("data-paskus-anchor");
      const navLabel = (navItem?.textContent || "").trim().toUpperCase();
      if (navAnchorTarget === "#combat" || navAnchorTarget === "#support" || navLabel === "COMBAT" || navLabel === "SUPPORT") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        navigateToHomeAnchor(navAnchorTarget || (navLabel === "COMBAT" ? "#combat" : "#support"), 10);
        return;
      }

      const anchor = event.target?.closest?.("a[href]");
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("http") && !href.startsWith(window.location.origin)) {
        return;
      }

      let url;
      try {
        url = new URL(href, window.location.origin);
      } catch (_error) {
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      const currentPath = normalizedPath();
      const targetPath = normalizedPath(url.pathname);
      const isHomeLink = !url.hash && targetPath === "/";
      if (isHomeLink && currentPath === "/") {
        event.preventDefault();
        if (window.location.pathname !== "/" || window.location.search || window.location.hash) {
          window.history.pushState(null, "", "/");
        }
        scrollToPageTop("smooth");
        return;
      }

      if (!url.hash) {
        return;
      }

      if (currentPath !== targetPath) {
        try {
          window.sessionStorage.setItem("paskus-pending-anchor", url.hash);
        } catch (_error) {
          // Storage is best-effort only; normal navigation remains available.
        }
        return;
      }

      event.preventDefault();
      document.documentElement.classList.remove("paskus-nav-hidden");
      if (window.location.hash !== url.hash) {
        window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
      scheduleHashScroll(url.hash, 10);
    }, true);

    const pendingHash = (() => {
      try {
        const stored = window.sessionStorage.getItem("paskus-pending-anchor");
        if (stored) {
          window.sessionStorage.removeItem("paskus-pending-anchor");
          return stored;
        }
      } catch (_error) {
        return "";
      }
      return window.location.hash;
    })();

    if (pendingHash) {
      scheduleHashScroll(pendingHash, 16);
    }
  }

  function parseQuotedStrings(value) {
    const items = [];
    String(value || "").replace(/"((?:\\.|[^"\\])*)"/g, (_match, item) => {
      items.push(item.replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
      return "";
    });
    return items;
  }

  function parseStructureFromHeadings(markdown) {
    const categories = [];
    let current = null;
    String(markdown || "").split(/\r?\n/).forEach((line) => {
      const categoryMatch = line.match(/^###\s+\d+\.\s+(.+?)(?:\s+\((.+)\))?\s*$/);
      if (categoryMatch) {
        current = {
          category: stripMarkdown(categoryMatch[1]).toUpperCase(),
          label: stripMarkdown(categoryMatch[2] || ""),
          ranks: [],
        };
        categories.push(current);
        return;
      }

      const rankMatch = line.match(/^-\s+\*\*([^*]+)\*\*:\s+(.+?)(?:\s+\*\(Insignia:\s*([^)]+)\)\*)?\s*$/);
      if (current && rankMatch) {
        current.ranks.push({
          name: stripMarkdown(rankMatch[1]).toUpperCase(),
          role: stripMarkdown(rankMatch[2]).replace(/\s*\(Insignia:.+$/i, ""),
          insignia: stripMarkdown(rankMatch[3] || ""),
          members: [],
        });
      }
    });
    return categories;
  }

  function parseStructureMarkdown(markdown) {
    const source = String(markdown || "");
    const title = stripMarkdown(source.match(/^#\s+(.+)$/m)?.[1] || "Struktural PASKUS");
    const overview = stripMarkdown(
      source.match(/## Overview\s+([\s\S]*?)(?=\n##\s+)/i)?.[1]?.split(/\r?\n/).find((line) => line.trim()) ||
      "Struktur pangkat, jabatan, dan daftar personel dibaca langsung dari dokumentasi markdown.",
    );
    const categories = [];
    let current = null;

    source.split(/\r?\n/).forEach((line) => {
      const categoryMatch = line.match(/category:\s*"([^"]+)"/);
      if (categoryMatch) {
        current = {
          category: stripMarkdown(categoryMatch[1]).toUpperCase(),
          label: "",
          ranks: [],
        };
        categories.push(current);
        return;
      }

      const rankMatch = line.match(/\{\s*name:\s*"([^"]+)"\s*,\s*role:\s*"([^"]+)"/);
      if (!rankMatch || !current) {
        return;
      }

      const memberMatch = line.match(/members:\s*\[(.*)\]/);
      const colorMatch = line.match(/color:\s*"([^"]+)"/);
      const members = memberMatch ? parseQuotedStrings(memberMatch[1]) : [];
      current.ranks.push({
        name: stripMarkdown(rankMatch[1]).toUpperCase(),
        role: stripMarkdown(rankMatch[2]),
        color: colorMatch ? colorMatch[1] : "",
        members,
        member_count: members.length,
      });
    });

    const usableCategories = categories.filter((category) => category.ranks.length);
    return {
      title,
      overview,
      categories: usableCategories.length ? usableCategories : parseStructureFromHeadings(source),
    };
  }

  function structureTone(category = "", rank = "") {
    const source = `${category} ${rank}`.toUpperCase();
    if (source.includes("SIPIL") || source.includes("CIVILIAN")) {
      return { rgb: "142, 164, 172", accent: "#8ea4ac" };
    }
    if (source.includes("TAMTAMA") || source.includes("KOPRAL") || source.includes("PRAJURIT")) {
      return { rgb: "220, 56, 56", accent: "#dc3838" };
    }
    if (source.includes("BINTARA") || source.includes("SERSAN")) {
      return { rgb: "160, 168, 170", accent: "#a0a8aa" };
    }
    if (source.includes("PERWIRA PERTAMA") || source.includes("KAPTEN") || source.includes("LETNAN")) {
      return { rgb: "157, 193, 131", accent: "#9dc183" };
    }
    return { rgb: "239, 191, 4", accent: "#efbf04" };
  }

  function rankInsigniaHtml(rank) {
    const normalized = String(rank || "").toUpperCase();
    const repeat = (count, html) => Array.from({ length: count }, () => html).join("");
    const melati = `
      <svg class="structure-melati" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 1L14.5 8.5L22 6L17 12L22 18L14.5 15.5L12 23L9.5 15.5L2 18L7 12L2 6L9.5 8.5L12 1Z" fill="currentColor"></path>
        <circle cx="12" cy="12" r="3.5" fill="#111" stroke="currentColor" stroke-width="1.5"></circle>
      </svg>`;

    if (normalized.includes("MAYOR JEND")) {
      return `<div aria-label="2 Stars">${repeat(2, '<span class="structure-star">★</span>')}</div>`;
    }
    if (normalized.includes("BRIGADIR JEND")) {
      return `<div aria-label="1 Star"><span class="structure-star">★</span></div>`;
    }
    if (normalized === "KOLONEL") {
      return `<div aria-label="3 Melati">${repeat(3, melati)}</div>`;
    }
    if (normalized === "LETNAN KOLONEL") {
      return `<div aria-label="2 Melati">${repeat(2, melati)}</div>`;
    }
    if (normalized === "MAYOR") {
      return `<div aria-label="1 Melati">${melati}</div>`;
    }

    const barCounts = {
      KAPTEN: 3,
      "LETNAN SATU": 2,
      "LETNAN DUA": 1,
      "PRAJURIT KEPALA": 3,
      "PRAJURIT SATU": 2,
      "PRAJURIT DUA": 1,
    };
    if (barCounts[normalized]) {
      return `<div class="structure-bars" aria-label="${barCounts[normalized]} Bars">${repeat(barCounts[normalized], "<span></span>")}</div>`;
    }

    const chevronCounts = {
      "SERSAN MAYOR": 4,
      "SERSAN KEPALA": 3,
      "SERSAN SATU": 2,
      "SERSAN DUA": 1,
      "KOPRAL KEPALA": 3,
      "KOPRAL SATU": 2,
      "KOPRAL DUA": 1,
    };
    if (chevronCounts[normalized]) {
      return `<div class="structure-chevrons" aria-label="${chevronCounts[normalized]} Chevrons">${repeat(chevronCounts[normalized], '<span class="structure-chevron"></span>')}</div>`;
    }

    return '<span class="structure-fallback-icon">◆</span>';
  }

  function mainNavLinkHtml({ href, key, label, active = "", external = false, className = "" }) {
    const isActive = active && active === key;
    return `<a href="${escapeHtml(href)}" data-paskus-nav-key="${escapeHtml(key)}"${key === "combat" ? ' data-paskus-anchor="#combat"' : ""}${key === "support" ? ' data-paskus-anchor="#support"' : ""}${className ? ` class="${escapeHtml(className)}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}${isActive ? ' aria-current="page"' : ""}>${escapeHtml(label)}</a>`;
  }

  function mainNavHtml(active = "") {
    const ui = uiCopy();
    const links = [
      { href: "/", key: "home", label: ui.nav.home },
      { href: "/#combat", key: "combat", label: ui.nav.combat },
      { href: "/#support", key: "support", label: ui.nav.support },
      { href: "/streamer", key: "streamer", label: ui.nav.streamer },
      { href: "/brm5-roleplay", key: "brm5", label: ui.nav.brm5 },
      { href: "/struktural", key: "structure", label: ui.nav.structure },
      { href: "/about", key: "about", label: ui.nav.about },
      { href: "https://discord.gg/aaBR9ruFva", key: "discord", label: ui.nav.discord, external: true, className: "btn-discord discord-link" },
    ];
    return `
      <nav class="body-nav paskus-main-nav">
        <a class="nav-logo" href="/">
          <img alt="PASKUS Logo" src="/recruitment-webhook-logo.png" loading="eager" decoding="async" fetchpriority="high">
          <span>
            <strong>${escapeHtml(PASKUS_BRAND_NAME)}</strong>
            <span>${escapeHtml(PASKUS_BRAND_SUBLINE)}</span>
          </span>
        </a>
        <div class="nav-links">
          ${links.map((link) => mainNavLinkHtml({ ...link, active })).join("")}
        </div>
      </nav>
    `;
  }

  function structureNavHtml(current = "structure") {
    return mainNavHtml(current === "struktural" ? "structure" : current);
  }

  function structureStats(data) {
    const categories = data.categories.length;
    const ranks = data.categories.reduce((total, category) => total + category.ranks.length, 0);
    const members = data.categories.reduce(
      (total, category) => total + category.ranks.reduce((rankTotal, rank) => rankTotal + rankMemberCount(rank), 0),
      0,
    );
    return { categories, ranks, members };
  }

  function structureOverviewCopy(overview) {
    const ui = uiCopy();
    const text = String(overview || "").trim();
    if (/^This document outlines the hierarchical structure/i.test(text)) {
      return ui.structure.overviewDocument;
    }
    return text || ui.structure.overviewFallback;
  }

  function rankDisplayName(rankName) {
    const normalized = String(rankName || "").toUpperCase();
    if (normalized === "PRAJURIT DUA" || normalized === "PRADA") {
      return "PRADA";
    }
    return normalized;
  }

  function showRankMembers(rank, categoryName = "") {
    return !isCountOnlyRank(rank, categoryName) && Array.isArray(rank?.members) && rank.members.length > 0;
  }

  function rankMemberCount(rank) {
    const directCount = Number(rank?.member_count ?? rank?.memberCount ?? rank?.count ?? 0);
    const parsedCount = Number.isFinite(directCount) && directCount > 0 ? Math.floor(directCount) : 0;
    const membersCount = Array.isArray(rank?.members) ? rank.members.length : 0;
    return Math.max(parsedCount, membersCount);
  }

  function personnelLookupKey(value) {
    return String(value || "")
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function isPrakaOrAboveRank(rankName = "") {
    const normalized = String(rankName || "").toUpperCase();
    if (!normalized || normalized.includes("SIPIL") || normalized.includes("CIVILIAN")) {
      return false;
    }
    if (normalized.includes("PRAJURIT SATU") || normalized.includes("PRAJURIT DUA") || normalized === "PRADA") {
      return false;
    }
    return (
      normalized.includes("PRAJURIT KEPALA") ||
      normalized.includes("KOPRAL") ||
      normalized.includes("SERSAN") ||
      normalized.includes("LETNAN") ||
      normalized.includes("KAPTEN") ||
      normalized.includes("MAYOR") ||
      normalized.includes("KOLONEL") ||
      normalized.includes("JENDRAL")
    );
  }

  function structureEligibleMemberLookup(data) {
    const lookup = new Map();
    (Array.isArray(data?.categories) ? data.categories : []).forEach((category) => {
      (Array.isArray(category?.ranks) ? category.ranks : []).forEach((rank) => {
        if (!isPrakaOrAboveRank(rank?.name)) {
          return;
        }
        (Array.isArray(rank?.members) ? rank.members : []).forEach((member) => {
          const name = typeof member === "string"
            ? member
            : (member?.display || member?.name || member?.nickname || member?.username || member?.discord || member?.tag || "");
          const key = personnelLookupKey(name);
          if (key && !lookup.has(key)) {
            lookup.set(key, { name: String(name).trim(), rank: rank.name });
          }
        });
      });
    });
    return lookup;
  }

  function unitRosterSlug(value = "") {
    const source = String(value || "").toLowerCase();
    if (source.includes("gatam") || source.includes("garuda")) {
      return "gatam";
    }
    if (source.includes("bringas") || source.includes("beringas")) {
      return "bringas";
    }
    if (source.includes("toruk") || source.includes("sky")) {
      return "toruk";
    }
    if (source.includes("pathfinder") || source.includes("ranger")) {
      return "pathfinder";
    }
    if (source.includes("sentinel") || source.includes("medic")) {
      return "sentinel";
    }
    if (source.includes("sierra") || source.includes("serigala")) {
      return "sierra";
    }
    if (source.includes("komodo") || source.includes("reguler") || source.includes("regular")) {
      return "komodo";
    }
    return source.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function unitRosterSource(data = {}, payload = {}) {
    const source =
      data.combat_units ||
      data.combatUnits ||
      data.unit_members ||
      data.unitMembers ||
      data.units ||
      payload.combat_units ||
      payload.combatUnits ||
      payload.unit_members ||
      payload.unitMembers ||
      payload.units ||
      {};
    const entries = [];

    if (Array.isArray(source)) {
      source.forEach((unit) => {
        if (unit && typeof unit === "object") {
          entries.push([unit.slug || unit.key || unit.name || unit.title || unit.role_name || unit.roleName || "", unit]);
        }
      });
    } else if (source && typeof source === "object") {
      Object.entries(source).forEach(([key, unit]) => {
        entries.push([key, unit]);
      });
    }

    return entries.reduce((map, [key, value]) => {
      const slug = unitRosterSlug(key || value?.slug || value?.name || value?.title || value?.role_name || value?.roleName || "");
      if (!slug || !value) {
        return map;
      }
      map[slug] = value;
      return map;
    }, {});
  }

  function unitMemberDisplayName(member) {
    if (member && typeof member === "object") {
      return String(
        member.display ||
        member.name ||
        member.nickname ||
        member.username ||
        member.discord ||
        member.tag ||
        "",
      ).trim();
    }
    return String(member || "").trim();
  }

  function unitMemberRank(member) {
    if (!member || typeof member !== "object") {
      return "";
    }
    return String(member.rank || member.rank_name || member.rankName || member.pangkat || "").trim();
  }

  function unitRosterCount(unit, fallbackMembersLength = 0) {
    const count = Number(
      unit?.member_count ??
      unit?.memberCount ??
      unit?.active_count ??
      unit?.activeCount ??
      unit?.count ??
      fallbackMembersLength,
    );
    return Number.isFinite(count) && count >= 0 ? Math.floor(count) : fallbackMembersLength;
  }

  function normalizeCombatRoster(payload) {
    const data = {
      title: stripMarkdown(payload?.title || "Struktural PASKUS"),
      overview: stripMarkdown(payload?.overview || ""),
      categories: Array.isArray(payload?.categories) ? payload.categories : [],
      combat_units: payload?.combat_units || payload?.combatUnits || payload?.units || payload?.unit_members || payload?.unitMembers || {},
    };
    const eligibleLookup = structureEligibleMemberLookup(data);
    const source = unitRosterSource(data, payload);

    return Object.entries(source).reduce((result, [slug, unit]) => {
      const rawMembers = Array.isArray(unit)
        ? unit
        : Array.isArray(unit?.members)
        ? unit.members
        : Array.isArray(unit?.active_members)
          ? unit.active_members
          : Array.isArray(unit?.activeMembers)
            ? unit.activeMembers
            : Array.isArray(unit?.personnel)
              ? unit.personnel
              : [];
      const seen = new Set();
      const members = rawMembers
        .map((member) => {
          const display = unitMemberDisplayName(member);
          const rank = unitMemberRank(member);
          const key = personnelLookupKey(display);
          if (!display || !key || seen.has(key)) {
            return null;
          }
          if (rank && !isPrakaOrAboveRank(rank)) {
            return null;
          }
          if (!rank && eligibleLookup.size && !eligibleLookup.has(key)) {
            return null;
          }
          seen.add(key);
          return eligibleLookup.get(key)?.name || display;
        })
        .filter(Boolean);
      result[slug] = {
        count: unitRosterCount(unit, members.length),
        members,
        sourceReady: true,
      };
      return result;
    }, {});
  }

  function fetchCombatRosterPayload(force = false) {
    if (!force && combatRosterPayload) {
      return Promise.resolve(combatRosterPayload);
    }
    if (!force && structuralMarkdownPayload?.rawPayload) {
      combatRosterPayload = normalizeCombatRoster(structuralMarkdownPayload.rawPayload);
      return Promise.resolve(combatRosterPayload);
    }
    if (force) {
      combatRosterPromise = null;
    }
    if (!combatRosterPromise) {
      combatRosterPromise = fetch(structuralFetchUrl(), {
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json();
        })
        .then((payload) => {
          combatRosterPayload = normalizeCombatRoster(payload);
          return combatRosterPayload;
        });
    }
    return combatRosterPromise;
  }

  function combatRosterCopy(slug) {
    if (slug === "komodo") {
      return "Barak awal dan keluarga besar reguler PASKUS. Data Komodo diringkas sebagai jumlah aktif agar roster tetap ringan dibaca.";
    }
    return "Keluarga tempur dan spesialis yang kami banggakan: prajurit aktif, berani, dan siap menjaga ritme operasi PASKUS Gi1.";
  }

  function combatRosterLabel(slug) {
    return slug === "komodo" ? "Personel reguler aktif" : "Roster aktif Praka+";
  }

  function cleanupCombatCardRoster(card) {
    if (!card) {
      return;
    }
    card.classList.remove("has-unit-roster");
    card.querySelectorAll(".paskus-unit-active-pill, .paskus-unit-roster").forEach((node) => node.remove());
  }

  function renderCombatRoster(card, slug, roster) {
    cleanupCombatCardRoster(card);
  }

  function renderUnitDetailRosterContent(section, slug, roster, unit, loading = false) {
    if (!section || !unit) {
      return;
    }
    const rosterSlug = unitRosterSlug(slug);
    const members = Array.isArray(roster?.members) ? roster.members : [];
    const count = Number.isFinite(Number(roster?.count)) ? Number(roster.count) : members.length;
    const showNames = rosterSlug !== "komodo" && members.length > 0;
    const emptyText = loading
      ? "Mengambil data aktif terbaru dari struktur resimen..."
      : rosterSlug === "komodo"
        ? "Nama Komodo sengaja diringkas untuk menjaga performa, privasi operasional, dan keterbacaan halaman."
        : "Menunggu sync role unit dari bot resimen. Data akan muncul otomatis saat anggota aktif tersedia.";
    section.innerHTML = `
      <div class="paskus-unit-detail-roster__inner">
        <div class="paskus-unit-detail-roster__copy">
          <div class="paskus-unit-detail-roster__eyebrow">Active Unit Roster</div>
          <h2>${escapeHtml(unit.title)} Active Personnel</h2>
          <p>${escapeHtml(combatRosterCopy(rosterSlug))}</p>
          <div class="paskus-unit-detail-roster__count">
            <strong>${escapeHtml(String(count || (showNames ? members.length : 0) || 0))}</strong>
            <span>${escapeHtml(combatRosterLabel(rosterSlug))}</span>
          </div>
        </div>
        ${showNames ? `
          <div class="paskus-unit-detail-roster__grid" aria-label="Daftar anggota aktif ${escapeHtml(unit.title)}">
            ${members.map((member) => `<span class="paskus-unit-detail-roster__member">${escapeHtml(member)}</span>`).join("")}
          </div>
        ` : `
          <div class="paskus-unit-detail-roster__empty">${escapeHtml(emptyText)}</div>
        `}
      </div>
    `;
  }

  function renderUnitDetailRoster(body, hero, slug, unit) {
    if (!body || !hero || !unit) {
      document.querySelector(".paskus-unit-detail-roster")?.remove();
      return;
    }
    const rosterSlug = unitRosterSlug(slug);
    let section = body.querySelector(".paskus-unit-detail-roster");
    if (!section) {
      section = document.createElement("section");
      section.className = "paskus-unit-detail-roster";
    }
    section.dataset.paskusUnitRoster = rosterSlug;

    const highlight = body.querySelector(".paskus-unit-highlight");
    if (highlight && section.previousElementSibling !== highlight) {
      highlight.after(section);
    } else if (!highlight && section.previousElementSibling !== hero) {
      hero.after(section);
    }

    if (combatRosterPayload) {
      renderUnitDetailRosterContent(section, rosterSlug, combatRosterPayload?.[rosterSlug] || { count: 0, members: [], sourceReady: false }, unit);
      installCombatRosterLiveRefresh();
      return;
    }
    if (section.dataset.paskusRosterLoading === "1") {
      return;
    }
    section.dataset.paskusRosterLoading = "1";
    renderUnitDetailRosterContent(section, rosterSlug, { count: 0, members: [], sourceReady: false }, unit, true);
    fetchCombatRosterPayload()
      .then((rosters) => {
        renderUnitDetailRosterContent(section, rosterSlug, rosters?.[rosterSlug] || { count: 0, members: [], sourceReady: false }, unit);
        installCombatRosterLiveRefresh();
      })
      .catch((error) => {
        debugWarn("PASKUS unit detail roster sync failed", error);
        renderUnitDetailRosterContent(section, rosterSlug, { count: 0, members: [], sourceReady: false }, unit);
      })
      .finally(() => {
        delete section.dataset.paskusRosterLoading;
      });
  }

  function enhanceCombatUnitRosters() {
    const cards = Array.from(document.querySelectorAll("#combat .flip-card[data-paskus-unit]"));
    if (!cards.length) {
      return;
    }
    cards.forEach(cleanupCombatCardRoster);
  }

  function refreshCombatUnitRosters(delay = 0) {
    const hasCards = Boolean(document.querySelector("#combat .flip-card[data-paskus-unit]"));
    const detailSection = document.querySelector(".paskus-unit-detail-roster");
    if ((!hasCards && !detailSection) || document.visibilityState === "hidden") {
      return;
    }
    window.setTimeout(() => {
      const visibleCards = Array.from(document.querySelectorAll("#combat .flip-card[data-paskus-unit]"));
      const currentDetailSection = document.querySelector(".paskus-unit-detail-roster");
      if ((!visibleCards.length && !currentDetailSection) || document.visibilityState === "hidden") {
        return;
      }
      fetchCombatRosterPayload(true)
        .then((rosters) => {
          visibleCards.forEach((card) => {
            cleanupCombatCardRoster(card);
          });
          if (currentDetailSection) {
            const rosterSlug = currentDetailSection.dataset.paskusUnitRoster || unitRosterSlug(currentUnitSlug());
            const unit = moduleCopy().units[currentUnitSlug()] || moduleCopy().units[rosterSlug];
            if (unit) {
              renderUnitDetailRosterContent(currentDetailSection, rosterSlug, rosters?.[rosterSlug] || { count: 0, members: [], sourceReady: false }, unit);
            }
          }
        })
        .catch((error) => {
          debugWarn("PASKUS combat roster live refresh failed", error);
        });
    }, delay);
  }

  function installCombatRosterLiveRefresh() {
    if (!combatRosterRefreshTimer) {
      combatRosterRefreshTimer = window.setInterval(refreshCombatUnitRosters, STRUCTURE_REFRESH_INTERVAL_MS);
    }
    if (combatRosterRefreshEventsInstalled) {
      return;
    }
    combatRosterRefreshEventsInstalled = true;
    window.addEventListener("focus", () => refreshCombatUnitRosters(80), { passive: true });
    window.addEventListener("pageshow", () => refreshCombatUnitRosters(80), { passive: true });
    document.addEventListener("visibilitychange", () => refreshCombatUnitRosters(80), { passive: true });
  }

  function isLowerRank(rank, categoryName = "") {
    const normalizedRank = String(rank?.name || "").toUpperCase();
    const normalizedCategory = String(categoryName || "").toUpperCase();
    return (
      normalizedCategory.includes("BINTARA") ||
      normalizedCategory.includes("TAMTAMA") ||
      normalizedRank.includes("SERSAN") ||
      normalizedRank.includes("KOPRAL") ||
      normalizedRank.includes("PRAJURIT") ||
      normalizedRank === "PRADA"
    );
  }

  function isCountOnlyRank(rank, categoryName = "") {
    const normalizedRank = String(rank?.name || "").toUpperCase();
    const normalizedCategory = String(categoryName || "").toUpperCase();
    return (
      rank?.count_only === true ||
      rank?.countOnly === true ||
      rank?.hide_members === true ||
      rank?.hideMembers === true ||
      normalizedRank.includes("SIPIL") ||
      normalizedRank.includes("CIVILIAN") ||
      normalizedCategory.includes("SIPIL") ||
      normalizedCategory.includes("CIVILIAN")
    );
  }

  function rankCardClasses(rank, categoryName, rankOnly) {
    const normalizedRank = String(rank?.name || "").toUpperCase();
    const normalizedCategory = String(categoryName || "").toUpperCase();
    const classes = [
      "structure-rank-card",
      rankOnly ? "structure-rank-card--rank-only" : "",
      `structure-rank-card--${slugifyStructure(normalizedRank)}`,
      `structure-rank-card--category-${slugifyStructure(normalizedCategory)}`,
    ];

    if (isLowerRank(rank, categoryName)) {
      classes.push("structure-rank-card--lower");
    }
    if (isCountOnlyRank(rank, categoryName)) {
      classes.push("structure-rank-card--count-only");
    }
    if (normalizedRank === "PRAJURIT DUA" || normalizedRank === "PRADA") {
      classes.push("structure-rank-card--member-scroll");
    }

    return classes.filter(Boolean).join(" ");
  }

  function rankCardHtml(rank, categoryName) {
    const ui = uiCopy();
    const tone = structureTone(categoryName, rank.name);
    const allMembers = Array.isArray(rank.members) ? rank.members : [];
    const memberCount = rankMemberCount(rank);
    const showNamedMembers = showRankMembers(rank, categoryName);
    const members = showNamedMembers ? allMembers : [];
    const showCountOnly = isCountOnlyRank(rank, categoryName) || !members.length;
    const rankOnly = !members.length && !showCountOnly;
    const roleText = isCountOnlyRank(rank, categoryName) ? "" : (rank.role || "Rank Position");
    const rankName = String(rank?.name || "").toUpperCase();
    const scrollMembers = (rankName === "PRAJURIT DUA" || rankName === "PRADA") && members.length > 0;
    const memberColumns = scrollMembers ? 4 : Math.max(1, Math.min(3, members.length || 1));
    const rankTarget = scrollMembers ? 760 : Math.min(900, Math.max(360, (memberColumns * 236) + 148));
    return `
      <article class="${rankCardClasses(rank, categoryName, rankOnly)}" data-structure-card style="--rank-accent-rgb:${tone.rgb};--rank-accent:${tone.accent};--structure-member-columns:${memberColumns};--structure-rank-target:${rankTarget}px;">
        <div class="structure-rank-head">
          <div class="structure-insignia">${rankInsigniaHtml(rank.name)}</div>
          <div class="structure-rank-main">
            <h3>${escapeHtml(rankDisplayName(rank.name))}</h3>
            ${roleText ? `<div class="structure-rank-role">${escapeHtml(roleText)}</div>` : ""}
          </div>
        </div>
          ${members.length ? `
            <div class="structure-member-branch" aria-label="${escapeHtml(ui.structure.personnel)} ${escapeHtml(rankDisplayName(rank.name))}">
              <div class="structure-member-grid ${scrollMembers ? "structure-member-grid--scroll" : "structure-member-grid--balanced"}">
                ${members.map((member) => `<article class="structure-member-card">${escapeHtml(member)}</article>`).join("")}
              </div>
            </div>
          ` : ""}
          ${showCountOnly ? `
            <div class="structure-member-branch" aria-label="${escapeHtml(ui.structure.registeredPersonnel)} ${escapeHtml(rankDisplayName(rank.name))}">
              <div class="structure-member-count">
                <strong>${memberCount}</strong>
                <span>${escapeHtml(ui.structure.registeredPersonnel)}</span>
              </div>
            </div>
          ` : ""}
      </article>
    `;
  }

  function structureContentHtml(data, meta = {}) {
    const ui = uiCopy();
    const stats = structureStats(data);
    const categories = data.categories.length ? data.categories : [];

    return `
      <section class="structure-hero">
        <div class="structure-hero-inner">
          <div>
            <div class="structure-kicker">${escapeHtml(ui.structure.kicker)}</div>
            <h1>${escapeHtml(ui.structure.heading)} <span>${escapeHtml(ui.structure.headingSpan)}</span></h1>
            <p class="structure-lead">${escapeHtml(structureOverviewCopy(data.overview))}</p>
            <div class="structure-stats" aria-label="Ringkasan struktural">
              <div class="structure-stat"><strong>${stats.categories}</strong><span>${escapeHtml(ui.structure.categories)}</span></div>
              <div class="structure-stat"><strong>${stats.ranks}</strong><span>${escapeHtml(ui.structure.ranks)}</span></div>
              <div class="structure-stat"><strong>${stats.members}</strong><span>${escapeHtml(ui.structure.personnel)}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section class="structure-section" id="structure-data">
        <div class="structure-category-nav">
          ${categories.map((category) => `<a href="#${slugifyStructure(category.category)}">${escapeHtml(category.category)}</a>`).join("")}
        </div>
        <div class="structure-tree" aria-label="Pohon struktural So-791">
          <div class="structure-tree-root">${escapeHtml(ui.structure.commandRoot)}</div>
          ${categories.map((category) => {
            const tone = structureTone(category.category);
            return `
              <section class="structure-category structure-category--${slugifyStructure(category.category)}" id="${slugifyStructure(category.category)}" data-structure-category style="--structure-accent-rgb:${tone.rgb};--structure-accent:${tone.accent};">
                <div class="structure-category-header">
                  <h2>${escapeHtml(category.category)}</h2>
                  <span>${escapeHtml(templateText(ui.structure.countLine, {
                    ranks: category.ranks.length,
                    members: category.ranks.reduce((total, rank) => total + rankMemberCount(rank), 0),
                  }))}</span>
                </div>
                <div class="structure-rank-grid">
                  ${category.ranks.map((rank) => rankCardHtml(rank, category.category)).join("")}
                </div>
              </section>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function moduleCardsHtml(items) {
    return items.map((item) => `
      <article class="paskus-module-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  }

  function supportUnits() {
    return Object.values(moduleCopy().support);
  }

  function supportSlugAliases() {
    return supportUnits().reduce((aliases, unit) => {
      aliases[unit.slug] = unit.slug;
      aliases[unit.title.toLowerCase().replaceAll(" ", "-")] = unit.slug;
      aliases[unit.back.toLowerCase().replaceAll(" ", "-").replaceAll("&", "dan")] = unit.slug;
      return aliases;
    }, {
      staff: "staff-komando",
      "staff-komando": "staff-komando",
      "seksi-1": "staff-komando",
      "seksi-satu": "staff-komando",
      "pengurus-besar": "staff-komando",
      dpdm: "dpdm",
      "polisi-militer": "dpdm",
      "dinas-polisi-militer": "dpdm",
      pusdiklat: "pusdiklat",
      kopendiklat: "pusdiklat",
      propaganda: "propaganda",
      zeni: "zeni-tempur",
      "zeni-tempur": "zeni-tempur",
    });
  }

  function supportUnitBySlug(slug) {
    const normalized = (slug || "").toLowerCase();
    const alias = supportSlugAliases()[normalized];
    if (!alias) {
      return null;
    }
    return supportUnits().find((unit) => unit.slug === alias) || null;
  }

  function supportUnitFromCard(card) {
    const currentSlug = card.getAttribute("data-paskus-support");
    if (currentSlug) {
      const unit = supportUnitBySlug(currentSlug);
      if (unit) {
        return unit;
      }
    }
    const title = (card.querySelector(".flip-card-front h4")?.textContent || "").toUpperCase();
    if (title.includes("ZENI")) {
      return moduleCopy().support.zeni;
    }
    if (title.includes("PUSDIKLAT") || title.includes("KOPENDIKLAT")) {
      return moduleCopy().support.pusdiklat;
    }
    if (title.includes("PROPAGANDA")) {
      return moduleCopy().support.propaganda;
    }
    if (title.includes("DPDM") || title.includes("POLISI")) {
      return moduleCopy().support.dpdm;
    }
    if (title.includes("STAFF") || title.includes("SEKSI")) {
      return moduleCopy().support.staff;
    }
    return null;
  }

  function supportDetailCardHtml(cards) {
    return cards.map(([title, body]) => `
      <article class="support-card">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(body)}</p>
      </article>
    `).join("");
  }

  function aboutMetricHtml(items) {
    return items.map(([value, label, body]) => `
      <article class="about-stat">
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(label)}</span>
        <p style="margin-top:12px;">${escapeHtml(body)}</p>
      </article>
    `).join("");
  }

  function aboutCardsHtml(items) {
    return items.map((item) => `
      <article class="about-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  }

  function aboutStepsHtml(items) {
    return items.map(([step, title, body]) => `
      <article class="about-step" data-step="${escapeHtml(step)}">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(body)}</p>
      </article>
    `).join("");
  }

  function aboutHomeLinksHtml(items) {
    return items.map((item) => `
      <article class="about-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
        <a class="about-unit-link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>
      </article>
    `).join("");
  }

  function aboutCombatCardsHtml() {
    const copy = moduleCopy();
    return Object.entries(copy.units).map(([slug, unit]) => `
      <article class="about-card">
        <h3>${escapeHtml(unit.title)}</h3>
        <p>${escapeHtml(unit.hero)}</p>
        <a class="about-unit-link" href="/unit/${escapeHtml(slug)}">${escapeHtml(uiCopy().unitDetail.detailUnit)}</a>
      </article>
    `).join("");
  }

  function aboutSupportCardsHtml() {
    return supportUnits().map((unit) => `
      <article class="about-card">
        <h3>${escapeHtml(unit.title)}</h3>
        <p>${escapeHtml(unit.body)}</p>
        <a class="about-unit-link" href="/unit/${escapeHtml(unit.slug)}">${escapeHtml(uiCopy().unitDetail.detailService)}</a>
      </article>
    `).join("");
  }

  function csAiGreeting() {
    return uiCopy().cs.greeting;
  }

  function csAiClearIdleTimer(widget) {
    const timer = Number(widget?.dataset?.csIdleTimer || 0);
    if (timer) {
      window.clearTimeout(timer);
      widget.dataset.csIdleTimer = "";
    }
  }

  async function csAiClearRemoteHistory() {
    try {
      await fetch(CS_AI_API_URL, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear-history" }),
      });
    } catch (error) {
      debugWarn("PASKUS AI SERVICE history clear failed", error);
    }
  }

  function csAiResetLog(widget, clearRemote = false) {
    const log = widget?.querySelector(".paskus-cs-ai-log");
    if (!log) {
      return;
    }
    if (clearRemote) {
      csAiClearRemoteHistory();
    }
    log.innerHTML = "";
    csAiAddMessage(log, "bot", csAiGreeting());
  }

  function csAiScheduleIdleRefresh(widget) {
    csAiClearIdleTimer(widget);
    const timer = window.setTimeout(() => {
      const log = widget?.querySelector(".paskus-cs-ai-log");
      if (!log || !widget?.classList.contains("is-open")) {
        return;
      }
      csAiAddMessage(log, "bot", uiCopy().cs.idle);
      window.setTimeout(() => csAiResetLog(widget, true), 2200);
    }, 600000);
    widget.dataset.csIdleTimer = String(timer);
  }

  function csAiInlineFormat(value) {
    return escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function csAiFormatMessage(text) {
    const lines = String(text || "").split(/\r?\n/);
    let html = "";
    let listType = "";
    const closeList = () => {
      if (listType) {
        html += `</${listType}>`;
        listType = "";
      }
    };
    const openList = (type) => {
      if (listType !== type) {
        closeList();
        html += `<${type}>`;
        listType = type;
      }
    };

    lines.forEach((line) => {
      const value = line.trim();
      if (!value) {
        closeList();
        return;
      }

      const bullet = value.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        openList("ul");
        html += `<li>${csAiInlineFormat(bullet[1])}</li>`;
        return;
      }

      const numbered = value.match(/^\d+[.)]\s+(.+)$/);
      if (numbered) {
        openList("ol");
        html += `<li>${csAiInlineFormat(numbered[1])}</li>`;
        return;
      }

      closeList();
      html += `<p>${csAiInlineFormat(value)}</p>`;
    });
    closeList();

    return html || `<p>${escapeHtml(uiCopy().cs.empty)}</p>`;
  }

  function csAiSafeActionHref(href) {
    const value = String(href || "").trim();
    if (/^(\/|https:\/\/discord\.gg\/)/i.test(value)) {
      return value;
    }
    return "";
  }

  function csAiAddMessage(log, type, text, alert = false, actions = []) {
    if (!log) {
      return null;
    }
    const node = document.createElement("div");
    node.className = `paskus-cs-ai-message paskus-cs-ai-message--${type}${alert ? " paskus-cs-ai-message--alert" : ""}`;
    if (type === "bot") {
      node.innerHTML = csAiFormatMessage(text);
      const cleanActions = Array.isArray(actions)
        ? actions.map((action) => ({
          label: String(action?.label || "").trim(),
          href: csAiSafeActionHref(action?.href),
        })).filter((action) => action.label && action.href).slice(0, 3)
        : [];
      if (cleanActions.length) {
        const actionsNode = document.createElement("div");
        actionsNode.className = "paskus-cs-ai-actions";
        cleanActions.forEach((action) => {
          const link = document.createElement("a");
          link.href = action.href;
          link.textContent = action.label;
          link.addEventListener("click", (event) => {
            if (action.href.startsWith("/#") && window.location.pathname === "/") {
              event.preventDefault();
              navigateToHomeAnchor(action.href.replace("/", ""), 10);
            }
          });
          actionsNode.appendChild(link);
        });
        node.appendChild(actionsNode);
      }
    } else {
      node.textContent = text;
    }
    log.appendChild(node);
    log.scrollTop = log.scrollHeight;
    return node;
  }

  function csAiRenderHistory(log, history) {
    if (!log) {
      return;
    }

    log.innerHTML = "";
    const messages = Array.isArray(history) ? history : [];
    if (!messages.length) {
      csAiAddMessage(log, "bot", csAiGreeting());
      return;
    }

    messages.forEach((message) => {
      csAiAddMessage(
        log,
        message?.type === "user" ? "user" : "bot",
        message?.text || "",
        Boolean(message?.alert),
        message?.actions || [],
      );
    });
  }

  async function csAiLoadHistory(widget) {
    const log = widget?.querySelector(".paskus-cs-ai-log");
    if (!log) {
      return;
    }

    try {
      const response = await fetch(`${CS_AI_API_URL}?history=1`, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok || widget.dataset.csInteracted === "1") {
        return;
      }
      csAiRenderHistory(log, payload.history);
    } catch (error) {
      if (widget.dataset.csInteracted !== "1") {
        csAiRenderHistory(log, []);
      }
      debugWarn("PASKUS AI SERVICE history failed", error);
    }
  }

  function csAiAddTyping(log) {
    if (!log) {
      return null;
    }
    const node = document.createElement("div");
    node.className = "paskus-cs-ai-message paskus-cs-ai-message--bot paskus-cs-ai-message--typing";
    node.innerHTML = `${escapeHtml(uiCopy().cs.typing)} <span class="paskus-cs-ai-typing" aria-hidden="true"><span></span><span></span><span></span></span>`;
    log.appendChild(node);
    log.scrollTop = log.scrollHeight;
    return node;
  }

  function csAiSetBusy(widget, busy) {
    const button = widget?.querySelector(".paskus-cs-ai-form button");
    const input = widget?.querySelector(".paskus-cs-ai-form input");
    if (button) {
      button.disabled = busy;
      button.textContent = busy ? uiCopy().cs.wait : uiCopy().cs.send;
    }
    if (input) {
      input.disabled = busy;
    }
  }

  async function csAiSubmit(widget) {
    const input = widget.querySelector(".paskus-cs-ai-form input");
    const log = widget.querySelector(".paskus-cs-ai-log");
    const question = String(input?.value || "").trim();
    if (!question) {
      return;
    }

    input.value = "";
    widget.dataset.csInteracted = "1";
    csAiClearIdleTimer(widget);
    csAiAddMessage(log, "user", question);
    csAiSetBusy(widget, true);
    const typing = csAiAddTyping(log);

    try {
      const response = await fetch(CS_AI_API_URL, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
	        body: JSON.stringify({
	          question,
	          page: window.location.href,
	          discord_user_id: STATE.user?.id || "",
	          language: currentLanguage(),
	        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || `HTTP ${response.status}`);
      }
      typing?.remove();
      csAiAddMessage(log, "bot", payload.answer || uiCopy().cs.empty, Boolean(payload.sensitive), payload.actions);
      csAiScheduleIdleRefresh(widget);
    } catch (error) {
      typing?.remove();
      csAiAddMessage(log, "bot", uiCopy().cs.unavailable, true);
      csAiScheduleIdleRefresh(widget);
      debugWarn("PASKUS AI SERVICE failed", error);
    } finally {
      csAiSetBusy(widget, false);
      input?.focus();
    }
  }

  function renderCsAiWidget() {
    let widget = document.querySelector(".paskus-cs-ai");
    const ui = uiCopy();
    if (widget) {
      setText(widget.querySelector(".paskus-cs-ai-toggle span span"), ui.cs.subtitle);
      setText(widget.querySelector(".paskus-cs-ai-brand span span"), ui.cs.panelSubtitle);
      const close = widget.querySelector(".paskus-cs-ai-close");
      close?.setAttribute("aria-label", ui.cs.closeLabel);
      const input = widget.querySelector(".paskus-cs-ai-form input");
      input?.setAttribute("placeholder", ui.cs.placeholder);
      input?.setAttribute("aria-label", ui.cs.placeholder);
      const submit = widget.querySelector(".paskus-cs-ai-form button");
      if (submit && !submit.disabled) {
        submit.textContent = ui.cs.send;
      }
      setText(widget.querySelector(".paskus-cs-ai-note"), ui.cs.note);
      return;
    }

    widget = document.createElement("aside");
    widget.className = "paskus-cs-ai";
    widget.setAttribute("aria-label", "PASKUS AI SERVICE");
    widget.innerHTML = `
      <button class="paskus-cs-ai-toggle" type="button" aria-expanded="false">
        <img alt="PASKUS" src="/assets/paskus-D2yVCxRe.webp" loading="lazy" decoding="async">
        <span>
          <strong>PASKUS AI SERVICE</strong>
	          <span>${escapeHtml(ui.cs.subtitle)}</span>
        </span>
      </button>
      <div class="paskus-cs-ai-panel" role="dialog" aria-label="PASKUS AI SERVICE">
        <div class="paskus-cs-ai-head">
          <div class="paskus-cs-ai-brand">
            <img alt="PASKUS" src="/assets/paskus-D2yVCxRe.webp" loading="lazy" decoding="async">
            <span>
              <strong>PASKUS AI SERVICE</strong>
	              <span>${escapeHtml(ui.cs.panelSubtitle)}</span>
            </span>
          </div>
	          <button class="paskus-cs-ai-close" type="button" aria-label="${escapeHtml(ui.cs.closeLabel)}">×</button>
        </div>
        <div class="paskus-cs-ai-log" aria-live="polite"></div>
        <form class="paskus-cs-ai-form">
	          <input type="text" maxlength="700" autocomplete="off" placeholder="${escapeHtml(ui.cs.placeholder)}" aria-label="${escapeHtml(ui.cs.placeholder)}">
	          <button type="submit">${escapeHtml(ui.cs.send)}</button>
        </form>
	        <div class="paskus-cs-ai-note">${escapeHtml(ui.cs.note)}</div>
      </div>
    `;
    document.body.appendChild(widget);

    const toggle = widget.querySelector(".paskus-cs-ai-toggle");
    const close = widget.querySelector(".paskus-cs-ai-close");
    const form = widget.querySelector(".paskus-cs-ai-form");
    const log = widget.querySelector(".paskus-cs-ai-log");
    csAiLoadHistory(widget);

    toggle?.addEventListener("click", () => {
      widget.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      window.setTimeout(() => widget.querySelector(".paskus-cs-ai-form input")?.focus(), 80);
    });
    close?.addEventListener("click", () => {
      csAiClearIdleTimer(widget);
      widget.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      csAiSubmit(widget);
    });
  }

  function setState(next) {
    Object.assign(STATE, next || {});
  }

  async function loadStatus() {
    try {
      const response = await fetch(STATUS_URL, { credentials: "same-origin" });
      const payload = await response.json();
      if (payload && payload.ok) {
        setState({
          configured: Boolean(payload.configured),
          authenticated: Boolean(payload.authenticated),
          user: payload.user || null,
          hasAllowedRole: Boolean(payload.hasAllowedRole),
          missing: Array.isArray(payload.missing) ? payload.missing : [],
          allowedRoleIds: Array.isArray(payload.allowedRoleIds) ? payload.allowedRoleIds : [],
        });
      }
    } catch (error) {
      debugWarn("PASKUS Discord sync status failed", error);
    } finally {
      setState({ statusLoaded: true });
    }
  }

  async function loadLocationStatus() {
    try {
      const response = await fetch(LOCATION_CONSENT_URL, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status" }),
      });
      const payload = response.ok ? await response.json().catch(() => null) : null;
      setState({
        hasLocationCode: Boolean(payload && payload.ok && payload.has_location_code),
        locationCodeHint: payload && payload.ok ? String(payload.code_hint || "") : "",
      });
    } catch (error) {
      debugWarn("PASKUS location status failed", error);
      setState({ hasLocationCode: false, locationCodeHint: "" });
    } finally {
      setState({ locationStatusLoaded: true });
    }
  }

  function hasDiscordSync() {
    return Boolean(STATE.statusLoaded && STATE.configured && STATE.authenticated && STATE.user && STATE.user.id);
  }

  function hasLocationConsent() {
    return Boolean(STATE.locationStatusLoaded && STATE.hasLocationCode);
  }

  function statusText() {
    const form = uiCopy().form;
    if (!STATE.statusLoaded) {
      return form.checking;
    }

    if (!STATE.configured) {
      return form.notConfigured;
    }

    if (!STATE.authenticated) {
      return form.unauthenticated;
    }

    const display = STATE.user && (STATE.user.display || STATE.user.username || STATE.user.id);
    if (!hasLocationConsent()) {
      return templateText(formCopyValue("locationMissing"), { display });
    }

    if (!STATE.hasAllowedRole) {
      return templateText(form.noRole, { display });
    }

    return templateText(form.synced, { display });
  }

  function discordPrivacyHtml() {
    return `<small class="paskus-discord-privacy">${escapeHtml(uiCopy().form.privacy || DISCORD_PRIVACY_NOTICE)}</small>`;
  }

  function formCopyValue(key) {
    return (uiCopy().form && uiCopy().form[key]) || (GLOBAL_COPY.id.form && GLOBAL_COPY.id.form[key]) || "";
  }

  function locationPrivacyHtml() {
    return `<small class="paskus-location-privacy">${escapeHtml(formCopyValue("locationPrivacy"))}</small>`;
  }

  function browserLocationSupported() {
    return Boolean(window.isSecureContext && navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === "function");
  }

  function readBrowserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 9000,
      });
    });
  }

  async function storeConsentLocation(position) {
    const coords = position?.coords || {};
    const payload = {
      action: "store",
      consent_version: LOCATION_CONSENT_VERSION,
      collected_at: new Date().toISOString(),
      page: window.location.href,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      language: navigator.language || document.documentElement.lang || currentLanguage(),
      platform: navigator.userAgentData?.platform || navigator.platform || "",
      coords: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
      },
    };

    const response = await fetch(LOCATION_CONSENT_URL, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok ? response.json().catch(() => null) : null;
  }

  async function attachStoredLocationToDiscord() {
    try {
      const response = await fetch(LOCATION_CONSENT_URL, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "attach-discord" }),
      });
      const payload = response.ok ? await response.json().catch(() => null) : null;
      if (payload && payload.ok && payload.attached) {
        setState({ hasLocationCode: true, locationStatusLoaded: true });
      }
    } catch (error) {
      debugWarn("PASKUS location attach skipped", error);
    }
  }

  async function resetDiscordSyncSession() {
    const response = await fetch(RESET_DISCORD_URL, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "missing_location_code" }),
    });
    const payload = response.ok ? await response.json().catch(() => null) : null;
    if (!payload || !payload.ok) {
      throw new Error("Discord reset failed");
    }
    setState({
      authenticated: false,
      user: null,
      hasAllowedRole: false,
    });
  }

  async function requestLocationThenDiscord(targetHref, trigger, options = {}) {
    if (locationConsentInFlight) {
      return;
    }

    locationConsentInFlight = true;
    const shouldRedirect = options.redirect !== false;
    const resetBeforeRedirect = Boolean(options.resetDiscordBeforeRedirect);
    const idleLabel = uiCopy().form.syncDiscord;
    const blockDiscord = () => {
      locationConsentInFlight = false;
      trigger.removeAttribute("aria-busy");
      trigger.textContent = idleLabel;
      alert(formCopyValue("locationRequired"));
    };

    if (!browserLocationSupported()) {
      blockDiscord();
      return;
    }

    const approved = window.confirm(formCopyValue("locationConfirm"));
    if (!approved) {
      blockDiscord();
      return;
    }

    try {
      trigger.textContent = formCopyValue("requestingLocation");
      trigger.setAttribute("aria-busy", "true");
      const position = await readBrowserLocation();
      trigger.textContent = formCopyValue("savingLocation");
      const payload = await storeConsentLocation(position);
      if (!payload || !payload.ok) {
        blockDiscord();
        return;
      }
      setState({
        hasLocationCode: true,
        locationStatusLoaded: true,
        locationCodeHint: payload.code_hint ? String(payload.code_hint) : STATE.locationCodeHint,
      });
      if (resetBeforeRedirect) {
        trigger.textContent = formCopyValue("resettingSync");
        await resetDiscordSyncSession();
      } else if (hasDiscordSync()) {
        await attachStoredLocationToDiscord();
      }
      trigger.textContent = shouldRedirect ? formCopyValue("locationSaved") : formCopyValue("locationOnlySaved");
    } catch (error) {
      debugWarn("PASKUS location consent skipped", error);
      blockDiscord();
      return;
    }

    locationConsentInFlight = false;
    trigger.removeAttribute("aria-busy");
    if (shouldRedirect) {
      window.location.href = targetHref;
      return;
    }

    renderFloatingPanel();
    alert(formCopyValue("locationOnlySaved"));
  }

  function renderFloatingPanel() {
    const registerForm = getRegisterForm();
    let panel = document.querySelector(".paskus-discord-sync");
    if (!registerForm) {
      panel?.remove();
      return;
    }

    if (!panel) {
      panel = document.createElement("aside");
      panel.className = "paskus-discord-sync";
    }

    panel.classList.add("paskus-discord-sync--embedded");
    if (panel.parentElement !== registerForm) {
      registerForm.insertBefore(panel, registerForm.firstChild);
    }

    const idText = STATE.user && STATE.user.id ? `<br><code>${STATE.user.id}</code>` : "";
    const needsLocation = STATE.authenticated && !hasLocationConsent();
    const authActions = STATE.authenticated
      ? (needsLocation
        ? `<a href="${loginHref()}" data-discord-login data-discord-resync>${escapeHtml(uiCopy().form.syncDiscord)}</a>`
        : `<button type="button" data-discord-logout>${escapeHtml(uiCopy().form.resetSync)}</button>`)
      : `<a href="${loginHref()}" data-discord-login>${escapeHtml(uiCopy().form.syncDiscord)}</a>`;
    const missing = !STATE.configured && STATE.missing.length
      ? `<br><code>${STATE.missing.join(", ")}</code>`
      : "";

    const panelHtml = `
      <strong>${escapeHtml(uiCopy().form.syncTitle)}</strong>
      <p>${statusText()}${idText}${missing}</p>
      ${discordPrivacyHtml()}
      ${STATE.hasLocationCode ? "" : locationPrivacyHtml()}
      <div class="paskus-discord-actions">${STATE.configured ? authActions : ""}</div>
    `;
    const panelChanged = panel.innerHTML !== panelHtml;
    if (panelChanged) {
      panel.innerHTML = panelHtml;
    }

    if (panelChanged) {
      const logout = panel.querySelector("[data-discord-logout]");
      if (logout) {
        logout.addEventListener("click", () => {
          window.location.href = logoutHref();
        });
      }

      const login = panel.querySelector("[data-discord-login]");
      if (login) {
        login.addEventListener("click", (event) => {
          event.preventDefault();
          login.textContent = uiCopy().form.openingDiscord;
          login.setAttribute("aria-busy", "true");
          const needsResync = login.hasAttribute("data-discord-resync");
          requestLocationThenDiscord(login.href, login, { resetDiscordBeforeRedirect: needsResync });
        });
      }
    }
  }

  function isDiscordInput(input) {
    if (input.id === "discord-user-id" || input.closest(".paskus-discord-id-field")) {
      return false;
    }

    const placeholder = (input.getAttribute("placeholder") || "").toLowerCase();
    const id = (input.getAttribute("id") || "").toLowerCase();
    const name = (input.getAttribute("name") || "").toLowerCase();
    const explicitLabel = input.id ? document.querySelector(`label[for="${input.id.replace(/"/g, '\\"')}"]`) : null;
    const wrapperLabel = !explicitLabel && input.parentElement && input.parentElement !== input.form
      ? input.parentElement.querySelector("label")
      : null;
    const labelText = (explicitLabel || wrapperLabel)?.innerText.toLowerCase() || "";

    return placeholder.includes("discord")
      || id.includes("discord")
      || name.includes("discord")
      || labelText.includes("discord");
  }

  function getRegisterForm() {
    return document.querySelector("form #roblox-username")?.closest("form") || null;
  }

  function enhanceRegisterForm(form) {
    if (!form) {
      return;
    }
    const formCopy = uiCopy().form;

    form.classList.add("paskus-register-form");
    form.parentElement?.classList.add("paskus-register-card");

    let discordIdField = form.querySelector(".paskus-discord-id-field");
    if (!discordIdField) {
      discordIdField = document.createElement("div");
      discordIdField.className = "paskus-discord-id-field";
      discordIdField.innerHTML = `
        <label for="discord-user-id">Discord ID</label>
        <input id="discord-user-id" name="discord_user_id" type="text" readonly placeholder="${escapeHtml(formCopy.discordIdPlaceholder)}" autocomplete="off" />
      `;
      const discordName = form.querySelector("#discord-username");
      if (discordName && discordName.nextSibling) {
        form.insertBefore(discordIdField, discordName.nextSibling);
      } else {
        form.insertBefore(discordIdField, form.firstChild);
      }
    }

    const idInput = discordIdField.querySelector("input");
    if (idInput) {
      idInput.setAttribute("placeholder", formCopy.discordIdPlaceholder);
      const idValue = STATE.user && STATE.user.id ? STATE.user.id : "";
      if (idInput.value !== idValue) {
        idInput.value = idValue;
      }
    }

    const golonganField = form.querySelector("#Golongan, [name='golongan'], [name='Golongan']");
    if (golonganField && !form.querySelector(".paskus-golongan-info")) {
      const info = document.createElement("div");
      info.className = "paskus-golongan-info";
      golonganField.insertAdjacentElement("afterend", info);
    }
    const info = form.querySelector(".paskus-golongan-info");
    if (info) {
      info.innerHTML = `
        <article>
          <strong>${escapeHtml(formCopy.golonganOne)}</strong>
          <span>${escapeHtml(formCopy.golonganOneBody)}</span>
        </article>
        <article>
          <strong>${escapeHtml(formCopy.golonganTwo)}</strong>
          <span>${escapeHtml(formCopy.golonganTwoBody)}</span>
        </article>
      `;
    }
  }

  function fillDiscordInputs(root) {
    if (!hasDiscordSync()) {
      return;
    }

    const display = STATE.user.display || STATE.user.username || "Discord User";
    const value = display;
    root.querySelectorAll("input").forEach((input) => {
      if (!isDiscordInput(input)) {
        return;
      }

      if (input.value !== value) {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (!input.readOnly) {
        input.readOnly = true;
      }
      if (input.getAttribute("data-discord-synced") !== "true") {
        input.setAttribute("data-discord-synced", "true");
      }
      if (input.getAttribute("title") !== uiCopy().form.autoTitle) {
        input.setAttribute("title", uiCopy().form.autoTitle);
      }
    });

    root.querySelectorAll("input[name='discord_user_id'], input[name='discordUserId'], input[name='discord_id'], #discord-user-id").forEach((input) => {
      if (input.value !== STATE.user.id) {
        input.value = STATE.user.id;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (!input.readOnly) {
        input.readOnly = true;
      }
    });
  }

  function isUnitForm(form) {
    const text = form.innerText || "";
    return Boolean(form.querySelector("textarea")) || text.includes("Kirim Transmisi Data");
  }

  function isManagedRegistrationForm(form) {
    const registerForm = getRegisterForm();
    return (registerForm && form === registerForm)
      || Boolean(form.querySelector("#roblox-username"))
      || isUnitForm(form);
  }

  function formMessage(form) {
    const copy = uiCopy().form;
    let node = form.querySelector(".paskus-discord-inline");
    if (!node) {
      node = document.createElement("div");
      node.className = "paskus-discord-inline";
      form.insertBefore(node, form.firstChild);
    }

    if (!STATE.statusLoaded) {
      const html = `${escapeHtml(copy.waitingInline)}${discordPrivacyHtml()}`;
      if (node.innerHTML !== html) {
        node.innerHTML = html;
      }
      return;
    }

    if (!STATE.configured) {
      const html = `${escapeHtml(copy.configInline)}${discordPrivacyHtml()}`;
      if (node.innerHTML !== html) {
        node.innerHTML = html;
      }
      return;
    }

    if (!hasDiscordSync()) {
      const html = `${escapeHtml(copy.authInline)} <a href="${loginHref()}" data-discord-inline-login>${escapeHtml(copy.syncNow)}</a>.${discordPrivacyHtml()}`;
      if (node.innerHTML !== html) {
        node.innerHTML = html;
      }
      const inlineLogin = node.querySelector("[data-discord-inline-login]");
      if (inlineLogin && inlineLogin.dataset.bound !== "true") {
        inlineLogin.dataset.bound = "true";
        inlineLogin.addEventListener("click", (event) => {
          event.preventDefault();
          inlineLogin.textContent = uiCopy().form.openingDiscord;
          inlineLogin.setAttribute("aria-busy", "true");
          requestLocationThenDiscord(inlineLogin.href, inlineLogin);
        });
      }
      return;
    }

    if (!hasLocationConsent()) {
      const display = STATE.user && (STATE.user.display || STATE.user.username || STATE.user.id);
      const html = `${templateText(escapeHtml(formCopyValue("locationMissing")), { display: escapeHtml(display) })}${locationPrivacyHtml()}`;
      if (node.innerHTML !== html) {
        node.innerHTML = html;
      }
      return;
    }

    if (isUnitForm(form) && !STATE.hasAllowedRole) {
      const html = `${escapeHtml(copy.roleInline)}${discordPrivacyHtml()}`;
      if (node.innerHTML !== html) {
        node.innerHTML = html;
      }
      return;
    }

    const display = STATE.user && (STATE.user.display || STATE.user.username || STATE.user.id);
    const html = `${templateText(copy.syncedInline, { display: escapeHtml(display) })}${discordPrivacyHtml()}`;
    if (node.innerHTML !== html) {
      node.innerHTML = html;
    }
  }

  function renameSupportUnits() {
    const support = document.querySelector("#support");
    if (!support) {
      return;
    }

    const walker = document.createTreeWalker(support, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.includes("KOPENDIKLAT")) {
        textNodes.push(walker.currentNode);
      }
    }

    textNodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replaceAll("KOPENDIKLAT", "PUSDIKLAT");
    });
  }

  function setText(node, text) {
    if (node && node.textContent !== text) {
      node.textContent = text;
    }
  }

  function setHtml(node, html) {
    if (node && node.innerHTML !== html) {
      node.innerHTML = html;
    }
  }

  function normalizePeopleSearch(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function structurePayloadToData(payload) {
    return {
      title: stripMarkdown(payload?.title || "Struktural PASKUS"),
      overview: stripMarkdown(payload?.overview || ""),
      categories: Array.isArray(payload?.categories) ? payload.categories : [],
      combat_units: payload?.combat_units || payload?.combatUnits || payload?.units || payload?.unit_members || payload?.unitMembers || {},
    };
  }

  function flattenStructureMembers(data) {
    const members = [];
    (Array.isArray(data?.categories) ? data.categories : []).forEach((category) => {
      (Array.isArray(category?.ranks) ? category.ranks : []).forEach((rank) => {
        (Array.isArray(rank?.members) ? rank.members : []).forEach((member) => {
          const name = String(member || "").trim();
          if (name) {
            members.push({
              name,
              rank: rank?.name || "",
              category: category?.category || "",
            });
          }
        });
      });
    });
    return members;
  }

  function findStructureMember(data, query) {
    const needle = normalizePeopleSearch(query);
    if (!needle) {
      return null;
    }
    const members = flattenStructureMembers(data);
    return (
      members.find((member) => normalizePeopleSearch(member.name) === needle) ||
      members.find((member) => normalizePeopleSearch(member.name).includes(needle)) ||
      members.find((member) => needle.includes(normalizePeopleSearch(member.name)))
    ) || null;
  }

  function fetchStructureDataForPeopleSearch() {
    if (structuralMarkdownPayload?.data?.categories?.length) {
      return Promise.resolve(structuralMarkdownPayload.data);
    }

    return fetch(structuralFetchUrl(), {
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        const data = structurePayloadToData(payload);
        structuralMarkdownPayload = {
          data,
          rawPayload: payload,
          lastModified: payload?.lastModified || "",
          revision: payload?.revision || "",
          updatedAt: payload?.updated_at || payload?.updatedAt || "",
        };
        combatRosterPayload = normalizeCombatRoster(payload);
        return data;
      });
  }

  function setPeopleSearchTarget(query) {
    try {
      window.sessionStorage.setItem(PEOPLE_SEARCH_STORAGE_KEY, query);
    } catch (_error) {
      // Search handoff is best-effort; query string still carries the target.
    }
  }

  function peopleSearchTargetFromState() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("person");
    if (fromQuery) {
      return fromQuery;
    }
    try {
      return window.sessionStorage.getItem(PEOPLE_SEARCH_STORAGE_KEY) || "";
    } catch (_error) {
      return "";
    }
  }

  function clearPeopleSearchTarget() {
    try {
      window.sessionStorage.removeItem(PEOPLE_SEARCH_STORAGE_KEY);
    } catch (_error) {
      // Ignore storage cleanup failures.
    }
  }

  function navigateToStructureSearch(query = "") {
    const target = String(query || "").trim();
    if (target) {
      setPeopleSearchTarget(target);
    }
    const href = target ? `/struktural?person=${encodeURIComponent(target)}` : "/struktural";
    if (isStructuralPath()) {
      if (window.location.pathname + window.location.search !== href) {
        window.history.pushState(null, "", href);
      }
      resolvePendingPeopleSearch(document.querySelector(".paskus-structure-page") || document);
      return;
    }
    window.location.assign(href);
  }

  function highlightStructureMemberByName(query, root = document) {
    const needle = normalizePeopleSearch(query);
    if (!needle) {
      return false;
    }
    const cards = Array.from(root.querySelectorAll(".structure-member-card"));
    const target = cards.find((card) => normalizePeopleSearch(card.textContent) === needle) ||
      cards.find((card) => normalizePeopleSearch(card.textContent).includes(needle)) ||
      cards.find((card) => needle.includes(normalizePeopleSearch(card.textContent)));

    if (!target) {
      return false;
    }

    target.classList.add("is-people-search-hit");
    target.setAttribute("tabindex", "-1");
    const y = target.getBoundingClientRect().top + window.scrollY - currentNavOffset() - 22;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    window.setTimeout(() => {
      try {
        target.focus({ preventScroll: true });
      } catch (_error) {
        target.focus();
      }
    }, 420);
    window.setTimeout(() => {
      target.classList.remove("is-people-search-hit");
      target.removeAttribute("tabindex");
    }, 2600);
    clearPeopleSearchTarget();
    return true;
  }

  function resolvePendingPeopleSearch(root = document, attempts = 10) {
    if (!isStructuralPath()) {
      return false;
    }
    const query = peopleSearchTargetFromState();
    if (!query) {
      return false;
    }
    if (highlightStructureMemberByName(query, root)) {
      return true;
    }
    if (attempts > 0) {
      window.setTimeout(() => resolvePendingPeopleSearch(root, attempts - 1), 180);
    }
    return false;
  }

  function indonesiaMemberMarkersHtml() {
    return INDONESIA_MEMBER_MARKERS.map((marker, index) => {
      const tipLeft = marker.x < 14 ? "0%" : marker.x > 86 ? "100%" : "50%";
      const tipX = marker.x < 14 ? "0%" : marker.x > 86 ? "-100%" : "-50%";
      return `
      <button
        type="button"
        class="paskus-indonesia-marker"
        data-structure-jump
        data-region="${escapeHtml(marker.label)}"
        style="--pin-x:${marker.x}%;--pin-y:${marker.y}%;--pin-delay:${(index % 7) * 170}ms;--tip-left:${tipLeft};--tip-x:${tipX};"
        aria-label="Buka Struktural dari marker ${escapeHtml(marker.label)}"
        title="${escapeHtml(marker.label)}"
      >
        <span class="paskus-indonesia-marker__label">${escapeHtml(marker.label)}</span>
      </button>
    `;
    }).join("");
  }

  function bindIndonesiaPresenceSection(section = document.querySelector(".paskus-indonesia-presence")) {
    if (!section || section.__paskusIndonesiaBound === "1") {
      return;
    }
    section.__paskusIndonesiaBound = "1";
    section.setAttribute("data-bound", "1");

    section.addEventListener("click", (event) => {
      const target = event.target?.closest?.("[data-structure-jump]");
      if (target && section.contains(target)) {
        event.preventDefault();
        navigateToStructureSearch();
      }
    });

    section.addEventListener("pointerover", (event) => {
      const marker = event.target?.closest?.(".paskus-indonesia-marker");
      if (marker && section.contains(marker)) {
        marker.classList.add("is-tooltip-visible");
      }
    });
    section.addEventListener("pointerout", (event) => {
      const marker = event.target?.closest?.(".paskus-indonesia-marker");
      if (!marker || !section.contains(marker) || marker.contains(event.relatedTarget)) {
        return;
      }
      marker.classList.remove("is-tooltip-visible");
    });
    section.addEventListener("focusin", (event) => {
      const marker = event.target?.closest?.(".paskus-indonesia-marker");
      if (marker && section.contains(marker)) {
        marker.classList.add("is-tooltip-visible");
      }
    });
    section.addEventListener("focusout", (event) => {
      const marker = event.target?.closest?.(".paskus-indonesia-marker");
      if (marker && section.contains(marker)) {
        marker.classList.remove("is-tooltip-visible");
      }
    });

    section.addEventListener("submit", async (event) => {
      const form = event.target?.closest?.("[data-paskus-people-search]");
      if (!form || !section.contains(form)) {
        return;
      }
      event.preventDefault();
      const input = form.querySelector("input");
      const result = form.querySelector(".paskus-people-search__result");
      if (!input || !result) {
        return;
      }
      const query = input.value.trim();
      if (!query) {
        result.textContent = "Masukkan nama personel yang ingin dicari.";
        input.focus();
        return;
      }

      result.textContent = "Mencari data struktural terbaru...";
      try {
        const data = await fetchStructureDataForPeopleSearch();
        const match = findStructureMember(data, query);
        if (match) {
          result.textContent = `Ditemukan: ${match.name}. Mengarah ke Struktural...`;
          window.setTimeout(() => navigateToStructureSearch(match.name), 260);
          return;
        }
        result.textContent = "Nama belum ditemukan di data struktural live.";
      } catch (_error) {
        result.textContent = "Data live belum terbaca, membuka Struktural untuk pengecekan langsung...";
        window.setTimeout(() => navigateToStructureSearch(query), 320);
      }
    });
  }

  function ensureIndonesiaPresenceSection() {
    if (window.location.pathname !== "/") {
      document.querySelector(".paskus-indonesia-presence")?.remove();
      return;
    }

    const target = document.querySelector(".paskus-module-overview") || document.querySelector("#combat");
    if (!target?.parentNode) {
      return;
    }

    let section = document.querySelector(".paskus-indonesia-presence");
    if (!section) {
      section = document.createElement("section");
      section.className = "paskus-indonesia-presence";
      section.id = "indonesia-presence";
      target.parentNode.insertBefore(section, target);
    }

    const html = `
      <div class="paskus-indonesia-presence__inner">
        <div class="paskus-indonesia-presence__copy">
          <div class="paskus-indonesia-presence__kicker">Jejak Personel Nasional</div>
          <h2 id="paskus-indonesia-title">Satu Komando, Tersebar di Indonesia</h2>
          <p class="paskus-indonesia-presence__lead">Lebih dari 2.000 anggota telah bergabung dan menjadi keluarga kami di seluruh Indonesia.</p>
          <div class="paskus-indonesia-presence__stat" aria-label="Lebih dari dua ribu anggota aktif dan komunitas">
            <strong>2.000+</strong>
            <span>personel, alumni, dan komunitas yang terhubung dalam ekosistem PASKUS Gi1.</span>
          </div>
          <form class="paskus-people-search" data-paskus-people-search role="search">
            <label for="paskus-people-search-input">Search People</label>
            <div class="paskus-people-search__row">
              <input id="paskus-people-search-input" type="search" placeholder="Cari nama personel struktural..." autocomplete="off" spellcheck="false">
              <button type="submit">Cari</button>
            </div>
            <p class="paskus-people-search__result" aria-live="polite"></p>
          </form>
        </div>
        <figure class="paskus-indonesia-map-card" aria-labelledby="paskus-indonesia-title">
          <div class="paskus-indonesia-map-plot">
            <img src="${escapeHtml(INDONESIA_MEMBER_MAP_URL)}" alt="Peta Indonesia dengan marker persebaran anggota PASKUS Gi1" loading="lazy" decoding="async">
            <button type="button" class="paskus-indonesia-map-action" data-structure-jump aria-label="Buka menu Struktural PASKUS"></button>
            <div class="paskus-indonesia-markers" aria-hidden="false">
              ${indonesiaMemberMarkersHtml()}
            </div>
          </div>
          <figcaption class="paskus-indonesia-map-hint">
            <span>Klik peta atau marker untuk membuka Struktural</span>
            <span>Live Personnel</span>
          </figcaption>
        </figure>
      </div>
    `;
    if (section.dataset.presenceVersion !== INDONESIA_PRESENCE_VERSION) {
      section.innerHTML = html;
      section.dataset.presenceVersion = INDONESIA_PRESENCE_VERSION;
      section.removeAttribute("data-bound");
    }
    bindIndonesiaPresenceSection(section);
  }

  function applyHomeModuleCopy() {
    if (window.location.pathname !== "/") {
      document.querySelector(".paskus-indonesia-presence")?.remove();
      document.querySelector(".paskus-module-overview")?.remove();
      document.querySelector(".paskus-module-events")?.remove();
      document.querySelector(".paskus-module-golongan")?.remove();
      return;
    }

    const copy = moduleCopy();
    const ui = uiCopy();
    const homeLead = document.querySelector("#home .max-w-2xl p");
    if (homeLead) {
      homeLead.closest(".max-w-2xl")?.classList.add("paskus-home-lead-panel");
      homeLead.classList.add("paskus-home-lead-text");
      setText(homeLead, ui.module.overviewBody || copy.homeLead);
    }

    const combat = document.querySelector("#combat");
    const support = document.querySelector("#support");
    const enlist = document.querySelector("#enlist");

    if (combat) {
      let overview = document.querySelector(".paskus-module-overview");
      if (!overview) {
        overview = document.createElement("section");
        overview.className = "paskus-module-overview";
        combat.parentNode?.insertBefore(overview, combat);
      }
	      setHtml(overview, `
	        <div class="paskus-module-inner">
          <div class="paskus-module-heading">
            <div class="paskus-module-kicker">${escapeHtml(ui.module.overviewKicker)}</div>
            <h2>${escapeHtml(ui.module.overviewTitle)}</h2>
            <p>${escapeHtml(ui.module.overviewBody)}</p>
          </div>
          <div class="paskus-module-stats">
            <div class="paskus-module-stat"><strong>500+</strong><span>${escapeHtml(ui.module.regularStat)}</span></div>
            <div class="paskus-module-stat"><strong>150+</strong><span>${escapeHtml(ui.module.specialStat)}</span></div>
            <div class="paskus-module-stat"><strong>2,5K+</strong><span>${escapeHtml(ui.module.discordStat)}</span></div>
          </div>
          <div class="paskus-module-grid">
            ${moduleCardsHtml(copy.overview)}
          </div>
	        </div>
	      `);
	      ensureIndonesiaPresenceSection();
	    }

    if (enlist) {
      let events = document.querySelector(".paskus-module-events:not(.paskus-module-golongan)");
      if (!events) {
        events = document.createElement("section");
        events.className = "paskus-module-events";
        enlist.parentNode?.insertBefore(events, enlist);
      }
      setHtml(events, `
        <div class="paskus-module-inner">
          <div class="paskus-module-heading">
            <div class="paskus-module-kicker">${escapeHtml(ui.module.eventsKicker)}</div>
            <h2>${escapeHtml(ui.module.eventsTitle)}</h2>
            <p>${escapeHtml(ui.module.eventsBody)}</p>
          </div>
          <div class="paskus-module-grid">
            ${moduleCardsHtml(copy.events)}
          </div>
        </div>
      `);

      let golongan = document.querySelector(".paskus-module-golongan");
      if (!golongan) {
        golongan = document.createElement("section");
        golongan.className = "paskus-module-events paskus-module-golongan";
        enlist.parentNode?.insertBefore(golongan, enlist);
      }
      setHtml(golongan, `
        <div class="paskus-module-inner">
          <div class="paskus-module-heading">
            <div class="paskus-module-kicker">${escapeHtml(ui.module.golonganKicker)}</div>
            <h2>${escapeHtml(ui.module.golonganTitle)}</h2>
            <p>${escapeHtml(ui.module.golonganBody)}</p>
          </div>
          <div class="paskus-module-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));">
            ${moduleCardsHtml(copy.golongan)}
          </div>
        </div>
      `);
    }

    if (combat) {
      setText(combat.querySelector(".mb-20 h2"), ui.module.combatKicker);
      setHtml(combat.querySelector(".mb-20 h3"), ui.module.combatTitle);
      Object.entries(copy.units).forEach(([slug, unit]) => {
        const selector = slug === "bringas" ? "a.card-beringas, a[href='/unit/bringas']" : slug === "sierra" ? "a.card-sierra, a[href='/unit/sierra'], a[href='/unit/sierra']" : `a[href='/unit/${slug}']`;
        const link = combat.querySelector(selector);
        const card = link?.closest(".flip-card");
        if (!card) {
          return;
        }
        setText(card.querySelector(".flip-card-front h4"), unit.title);
        setText(card.querySelector(".flip-card-back h4"), unit.category);
        setText(card.querySelector(".flip-card-back p"), unit.hero);
      });
    }

    if (support) {
      setText(support.querySelector(".mb-20 h2"), ui.module.supportKicker);
      setHtml(support.querySelector(".mb-20 h3"), ui.module.supportTitle);
      const grid = support.querySelector(".grid");
      const supportClassNames = supportUnits().map((unit) => `paskus-support-${unit.slug}`);

      const applySupportCard = (card, data) => {
        if (!card || !data) {
          return;
        }

        card.setAttribute("data-paskus-support", data.slug);
        card.classList.remove(...supportClassNames);
        card.classList.add(`paskus-support-${data.slug}`);
        card.style.setProperty("--support-card-accent", data.color);
        setText(card.querySelector(".flip-card-front h4"), data.title);
        setText(card.querySelector(".flip-card-back h4"), data.back);
        setText(card.querySelector(".flip-card-back p"), data.body);

        const logo = card.querySelector(".flip-card-front .unit-logo, .flip-card-front .paskus-support-roman-logo");
        if (data.logoText) {
          let romanLogo = card.querySelector(".flip-card-front .paskus-support-roman-logo");
          if (!romanLogo) {
            romanLogo = document.createElement("span");
            romanLogo.className = "paskus-support-roman-logo";
            const oldLogo = card.querySelector(".flip-card-front .unit-logo");
            if (oldLogo) {
              oldLogo.replaceWith(romanLogo);
            } else {
              card.querySelector(".flip-card-front")?.prepend(romanLogo);
            }
          }
          romanLogo.textContent = data.logoText;
          romanLogo.setAttribute("aria-label", `${data.title} Logo`);
        } else if (logo && data.logo) {
          logo.setAttribute("src", data.logo);
          logo.setAttribute("alt", data.title);
          logo.setAttribute("loading", "lazy");
          logo.setAttribute("decoding", "async");
        }

        const href = `/unit/${data.slug}`;
        [card.querySelector(".flip-card-front"), card.querySelector(".flip-card-back")].forEach((side) => {
          if (!side) {
            return;
          }
          let link = side.querySelector(".paskus-support-detail-link");
	          if (!link) {
	            link = document.createElement("a");
	            link.className = "paskus-support-detail-link";
	            link.setAttribute("data-discover", "true");
	            side.appendChild(link);
	          }
	          link.href = href;
	          link.textContent = ui.unitDetail.detailService;
	        });
	      };

      Array.from(support.querySelectorAll(".flip-card")).forEach((card) => {
        const data = supportUnitFromCard(card);
        applySupportCard(card, data);
      });

      supportUnits().forEach((data) => {
        if (!grid || grid.querySelector(`[data-paskus-support="${data.slug}"]`)) {
          return;
        }
        const card = document.createElement("div");
        card.className = "flip-card";
        card.innerHTML = `
          <div class="flip-card-inner">
            <div class="flip-card-front">
              ${data.logoText ? `<span class="paskus-support-roman-logo" aria-label="${escapeHtml(data.title)} Logo">${escapeHtml(data.logoText)}</span>` : `<img alt="${escapeHtml(data.title)}" class="unit-logo" src="${escapeHtml(data.logo || "/assets/paskus-D2yVCxRe.webp")}" loading="lazy" decoding="async">`}
              <h4 class="heading-font text-xs md:text-lg text-white">${escapeHtml(data.title)}</h4>
            </div>
            <div class="flip-card-back">
              <h4 class="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">${escapeHtml(data.back)}</h4>
              <p class="text-xs leading-relaxed">${escapeHtml(data.body)}</p>
            </div>
          </div>
        `;
        grid.appendChild(card);
        applySupportCard(card, data);
      });
    }
  }

  function updateUnitSelectOptions() {
    const labels = uiCopy().unitSelectLabels || UNIT_SELECT_LABELS;
    document.querySelectorAll("select option").forEach((option) => {
      const value = (option.value || option.textContent || "").trim().toUpperCase();
      const label = labels[value];
      if (label && option.textContent !== label) {
        option.textContent = label;
      }
    });
  }

  function currentUnitSlug() {
    const match = window.location.pathname.toLowerCase().match(/^\/unit\/([^/?#]+)/);
    const slug = match ? decodeURIComponent(match[1]) : "";
    return slug === "sierra" ? "sierra" : slug;
  }

  function removeUnitGalleryButtons(body) {
    if (!body) {
      return;
    }
    body.querySelectorAll("a, button").forEach((element) => {
      const label = (element.textContent || element.getAttribute("aria-label") || "").trim().toLowerCase();
      if (!label) {
        return;
      }
      if (label.includes("our gallery") || label.includes("gallery") || label.includes("galeri")) {
        element.remove();
      }
    });
  }

  function ensureUnitHighlightSource(video) {
    if (!video || video.querySelector("source")) {
      return;
    }
    const sourceUrl = video.dataset.paskusVideoSrc;
    if (!sourceUrl) {
      return;
    }
    const source = document.createElement("source");
    source.src = sourceUrl;
    source.type = "video/mp4";
    video.appendChild(source);
    video.load();
  }

  function bindUnitHighlightPlayer(section) {
    const frame = section?.querySelector(".paskus-unit-highlight__frame");
    const video = section?.querySelector(".paskus-unit-highlight__video");
    const playButton = section?.querySelector(".paskus-unit-highlight__play");
    if (!frame || !video || !playButton || frame.dataset.paskusPlayerReady === "1") {
      return;
    }
    frame.dataset.paskusPlayerReady = "1";

    const syncState = () => {
      frame.classList.toggle("is-playing", !video.paused && !video.ended);
    };

    const togglePlayback = async () => {
      ensureUnitHighlightSource(video);
      if (video.paused || video.ended) {
        try {
          await video.play();
        } catch (error) {
          frame.classList.remove("is-playing");
        }
        return;
      }
      video.pause();
    };

    playButton.addEventListener("click", togglePlayback);
    video.addEventListener("click", togglePlayback);
    video.addEventListener("play", syncState);
    video.addEventListener("pause", syncState);
    video.addEventListener("ended", syncState);
    video.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  function renderUnitHighlightVideo(body, hero, slug, unit) {
    const config = UNIT_HIGHLIGHT_VIDEOS[slug];
    let section = body?.querySelector(".paskus-unit-highlight");
    if (!config || !hero || !body) {
      section?.remove();
      return;
    }

    if (!section) {
      section = document.createElement("section");
      section.className = "paskus-unit-highlight";
      hero.after(section);
    }

    section.innerHTML = `
      <div class="paskus-unit-highlight__inner">
        <div class="paskus-unit-highlight__heading">
          <div>
            <div class="paskus-unit-highlight__eyebrow">Highlight Operasi</div>
            <h2>${escapeHtml(config.title)}</h2>
          </div>
          <div class="paskus-unit-highlight__label">${escapeHtml(config.label)}</div>
        </div>
        <div class="paskus-unit-highlight__frame" data-paskus-unit-highlight="${escapeHtml(slug)}">
          <video class="paskus-unit-highlight__video" poster="${escapeHtml(config.poster)}" preload="none" playsinline disablepictureinpicture controlsList="nodownload noplaybackrate noremoteplayback" data-paskus-video-src="${escapeHtml(config.mp4)}" aria-label="${escapeHtml(unit.title)} highlight video"></video>
          <button type="button" class="paskus-unit-highlight__play" aria-label="Putar highlight ${escapeHtml(unit.title)}"></button>
          <div class="paskus-unit-highlight__caption">
            <span>${escapeHtml(unit.title)}</span>
            <span>Tekan untuk memutar</span>
          </div>
        </div>
      </div>
    `;
    bindUnitHighlightPlayer(section);
  }

  function applyUnitDetailCopy() {
    const slug = currentUnitSlug();
    const unit = moduleCopy().units[slug];
    if (!unit) {
      document.querySelector(".paskus-module-detail")?.remove();
      document.querySelector(".paskus-unit-highlight")?.remove();
      document.querySelector(".paskus-unit-detail-roster")?.remove();
      return;
    }
    const ui = uiCopy();

    const body = document.querySelector(".body-nav");
    if (!body) {
      return;
    }

    document.title = `${unit.title} | So-791`;

    const hero = body.querySelector(".hero-section");
    const heroTitle = hero?.querySelector("#hero-title");
    if (heroTitle) {
      const words = unit.title.split(" ");
      const first = words.shift() || unit.title;
      const rest = words.join(" ");
      setHtml(heroTitle, `${escapeHtml(first)}${rest ? ` <span style="color:${unit.color}">${escapeHtml(rest)}</span>` : ""}`);
    }

    setText(hero?.querySelector(".inline-block span"), `${unit.category} / ${ui.unitDetail.operationalPriority}`);
    setText(heroTitle?.nextElementSibling, unit.hero);
    renderUnitHighlightVideo(body, hero, slug, unit);
    renderUnitDetailRoster(body, hero, slug, unit);
    removeUnitGalleryButtons(body);

    const sections = Array.from(body.querySelectorAll("section"));
    const philosophy = sections.find((section) => section.textContent.includes("PHILOSOPHY") || section.textContent.includes("DOKTRIN UNIT"));
    if (philosophy) {
      setText(philosophy.querySelector("h3"), ui.unitDetail.doctrineUnit);
      setText(philosophy.querySelector("h2"), unit.doctrineTitle);
      setText(philosophy.querySelector("p"), unit.doctrine);
    }

    const specialization = sections.find((section) => section.textContent.includes("SPESIALISASI"));
    if (specialization) {
      setText(specialization.querySelector("h2 span"), unit.category);
      const cards = Array.from(specialization.querySelectorAll(".unit-card"));
      unit.cards.forEach(([title, bodyText], index) => {
        const card = cards[index];
        if (!card) {
          return;
        }
        setText(card.querySelector("h4"), title);
        setText(card.querySelector("p"), bodyText);
      });

      let detail = document.querySelector(".paskus-module-detail");
      if (!detail) {
        detail = document.createElement("section");
        detail.className = "paskus-module-detail";
        specialization.after(detail);
      }

      detail.innerHTML = `
        <div class="paskus-module-inner">
	          <div class="paskus-module-heading">
	            <div class="paskus-module-kicker">${escapeHtml(unit.category)}</div>
	            <h2>${escapeHtml(ui.unitDetail.priorityTitle)}</h2>
	            <p>${escapeHtml(unit.doctrine)}</p>
	            <div class="paskus-module-route">${escapeHtml(unit.route)}</div>
	          </div>
          <div class="paskus-module-grid">
            ${unit.priorities.map((priority) => `
	              <article class="paskus-module-panel">
	                <h3>${escapeHtml(priority)}</h3>
	                <p>${escapeHtml(templateText(ui.unitDetail.priorityPanel, { unit: unit.title }))}</p>
	              </article>
            `).join("")}
          </div>
        </div>
      `;
    }

    setText(document.querySelector("#footer-text"), unit.footer);
  }

  function applyModuleCopy() {
    applyHomeModuleCopy();
    applyUnitDetailCopy();
    updateUnitSelectOptions();
  }

  function enhanceCombatCards() {
    const grid = document.querySelector("#combat .grid");
    const copy = moduleCopy();
    const ui = uiCopy();
    const komodo = copy.units.komodo;
    if (grid && !grid.querySelector("a[href='/unit/komodo']")) {
      const komodoCard = document.createElement("div");
      komodoCard.className = "flip-card paskus-unit-komodo";
      komodoCard.setAttribute("data-paskus-unit", "komodo");
      komodoCard.innerHTML = `
        <div class="flip-card-inner">
	          <div class="flip-card-front">
	            <img alt="${escapeHtml(komodo.title)}" class="unit-logo" src="${KOMODO_CARD_LOGO_URL}" loading="lazy" decoding="async">
	            <h4 class="heading-font text-xs md:text-lg text-white">${escapeHtml(komodo.title)}</h4>
	            <a class="card-komodo" href="/unit/komodo" data-discover="true">${escapeHtml(ui.unitDetail.detailUnit)}</a>
	          </div>
	          <div class="flip-card-back">
	            <h4 class="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">${escapeHtml(komodo.category)}</h4>
	            <p class="text-xs leading-relaxed">${escapeHtml(komodo.hero)}</p>
	            <a class="card-komodo" href="/unit/komodo" data-discover="true">${escapeHtml(ui.unitDetail.detailUnit)}</a>
	          </div>
        </div>
      `;
      grid.appendChild(komodoCard);
    }

    const unitOrder = ["gatam", "bringas", "toruk", "sierra", "pathfinder", "sentinel", "komodo"];
    const unitMeta = {
	      gatam: {
	        copyKey: "gatam",
	        className: "paskus-unit-gatam",
	        role: ui.unitRoles.gatam,
	        selector: "a.card-Gatam, a[href='/unit/gatam']",
	        logo: GATAM_CARD_LOGO_URL,
	      },
	      bringas: {
	        copyKey: "bringas",
	        className: "paskus-unit-bringas",
	        role: ui.unitRoles.bringas,
	        selector: "a.card-beringas, a[href='/unit/bringas']",
	      },
	      toruk: {
	        copyKey: "toruk-makto",
	        className: "paskus-unit-toruk",
	        role: ui.unitRoles.toruk,
	        selector: "a.card-toruk, a[href='/unit/toruk-makto']",
	      },
		      sierra: {
		        copyKey: "sierra",
		        className: "paskus-unit-sierra",
		        role: ui.unitRoles.sierra,
		        selector: "a.card-sierra, a[href='/unit/sierra'], a[href='/unit/sierra']",
		        logo: SIERRA_CARD_LOGO_URL,
		        href: "/unit/sierra",
		      },
	      pathfinder: {
	        copyKey: "pathfinder",
	        className: "paskus-unit-pathfinder",
	        role: ui.unitRoles.pathfinder,
	        selector: "a.card-Pathfinder, a[href='/unit/pathfinder']",
	      },
	      sentinel: {
	        copyKey: "sentinel",
	        className: "paskus-unit-sentinel",
	        role: ui.unitRoles.sentinel,
	        selector: "a.card-Sentinel, a[href='/unit/sentinel']",
	        logo: SENTINEL_CARD_LOGO_URL,
	      },
	      komodo: {
	        copyKey: "komodo",
	        className: "paskus-unit-komodo",
	        role: ui.unitRoles.komodo,
	        selector: "a.card-komodo, a[href='/unit/komodo']",
	      },
    };
    const unitClasses = Object.values(unitMeta).map((unit) => unit.className);
    const cardsByUnit = new Map();

    function ensureUnitRole(card, role) {
      card.querySelectorAll(".flip-card-front, .flip-card-back").forEach((side) => {
        let roleBadge = side.querySelector(".paskus-unit-role");
        if (!roleBadge) {
          roleBadge = document.createElement("span");
          roleBadge.className = "paskus-unit-role";
          const title = side.querySelector("h4");
          if (title) {
            title.insertAdjacentElement("afterend", roleBadge);
          } else {
            side.insertBefore(roleBadge, side.firstChild);
          }
        }
        roleBadge.textContent = role;
      });
    }

    document.querySelectorAll("#combat .flip-card").forEach((card) => {
      const slug = unitOrder.find((unitSlug) => card.querySelector(unitMeta[unitSlug].selector));
      if (!slug) {
        return;
      }
      card.classList.remove(...unitClasses);
	      card.classList.add(unitMeta[slug].className);
	      card.setAttribute("data-paskus-unit", slug);
	      ensureUnitRole(card, unitMeta[slug].role);
	      const unitCopy = copy.units[unitMeta[slug].copyKey];
	      if (unitCopy) {
	        setText(card.querySelector(".flip-card-front h4"), unitCopy.title);
	        setText(card.querySelector(".flip-card-back h4"), slug === "komodo" ? unitCopy.category : unitCopy.category);
		        setText(card.querySelector(".flip-card-back p"), unitCopy.hero);
		        const logo = card.querySelector(".flip-card-front .unit-logo");
		        if (logo && unitMeta[slug].logo) {
		          logo.setAttribute("src", unitMeta[slug].logo);
		          logo.setAttribute("alt", unitCopy.title);
		        }
		        card.querySelectorAll("a[href^='/unit/']").forEach((link) => {
		          setText(link, ui.unitDetail.detailUnit);
		          if (unitMeta[slug].href) {
		            link.setAttribute("href", unitMeta[slug].href);
		          }
		        });
		      }
	      cardsByUnit.set(slug, card);
	    });

    unitOrder.forEach((slug) => {
      const card = cardsByUnit.get(slug);
      if (card) {
        grid.appendChild(card);
      }
    });
    enhanceCombatUnitRosters();
  }

  function markUnitDetailWallpaper() {
    const root = document.documentElement;
    const path = window.location.pathname.toLowerCase();
    root.classList.toggle("paskus-unit-detail-toruk", path === "/unit/toruk-makto");
    root.classList.toggle("paskus-unit-detail-sierra", path === "/unit/serigala" || path === "/unit/sierra");
    root.classList.toggle("paskus-unit-detail-pathfinder", path === "/unit/pathfinder");
    root.classList.toggle("paskus-unit-detail-sentinel", path === "/unit/sentinel");
    root.classList.toggle("paskus-unit-detail-gatam", path === "/unit/gatam");
  }

  function renderStructureError(root, message) {
    const ui = uiCopy();
    const content = root.querySelector("[data-structure-content]");
    if (!content) {
      return;
    }
    content.innerHTML = `
      <section class="structure-status">
            <div class="structure-status-card">
              <div class="structure-kicker">${escapeHtml(ui.structure.kicker)}</div>
              <h1>${escapeHtml(ui.structure.errorTitle)}</h1>
              <p>${escapeHtml(message || ui.structure.errorBody)}</p>
            </div>
      </section>
    `;
  }

  function structuralFetchUrl() {
    const separator = STRUCTURE_API_URL.includes("?") ? "&" : "?";
    return `${STRUCTURE_API_URL}${separator}live=${Date.now()}`;
  }

  function refreshStructuralIfVisible(root, delay = 0) {
    if (!root || !isStructuralPath() || document.visibilityState === "hidden") {
      return;
    }

    window.setTimeout(() => {
      if (!root.isConnected || !isStructuralPath() || document.visibilityState === "hidden") {
        return;
      }
      loadStructuralMarkdown(root, { force: true, quiet: true });
    }, delay);
  }

  function installStructuralLiveRefresh(root) {
    if (!root) {
      return;
    }
    structuralRefreshRoot = root;

    if (!structuralRefreshTimer) {
      structuralRefreshTimer = window.setInterval(
        () => refreshStructuralIfVisible(structuralRefreshRoot),
        STRUCTURE_REFRESH_INTERVAL_MS,
      );
    }

    if (structuralRefreshEventsInstalled) {
      return;
    }

    structuralRefreshEventsInstalled = true;
    window.addEventListener("focus", () => refreshStructuralIfVisible(structuralRefreshRoot, 80), { passive: true });
    window.addEventListener("pageshow", () => refreshStructuralIfVisible(structuralRefreshRoot, 80), { passive: true });
    window.addEventListener("online", () => refreshStructuralIfVisible(structuralRefreshRoot, 80), { passive: true });
    document.addEventListener("visibilitychange", () => refreshStructuralIfVisible(structuralRefreshRoot, 80), { passive: true });
  }

  function loadStructuralMarkdown(root, options = {}) {
    const content = root.querySelector("[data-structure-content]");
    const force = Boolean(options.force);
    const quiet = Boolean(options.quiet);
    if (!content || content.getAttribute("data-loading") === "1" || (!force && content.getAttribute("data-loaded") === "1")) {
      return;
    }
    content.setAttribute("data-loading", "1");

    const renderPayload = (payload) => {
      if (!payload?.data?.categories?.length) {
        throw new Error("Tidak ada kategori rank yang terbaca dari data struktural.");
      }
      const nextKey = `${currentLanguage()}|${payload.revision || payload.lastModified || ""}|${payload.updatedAt || ""}|${payload.data.categories.length}|${structureStats(payload.data).ranks}|${structureStats(payload.data).members}`;
      if (force && content.getAttribute("data-structure-key") === nextKey) {
        return;
      }
	      content.innerHTML = structureContentHtml(payload.data, { lastModified: payload.lastModified });
	      content.setAttribute("data-structure-key", nextKey);
	      content.setAttribute("data-loaded", "1");
	      installStructuralLiveRefresh(root);
	      resolvePendingPeopleSearch(root);
	    };

    if (!force && structuralMarkdownPayload) {
      try {
        renderPayload(structuralMarkdownPayload);
      } catch (error) {
        renderStructureError(root, error.message);
      } finally {
        content.removeAttribute("data-loading");
      }
      return;
    }

    if (force) {
      structuralMarkdownPromise = null;
    }

    if (!structuralMarkdownPromise) {
      structuralMarkdownPromise = fetch(structuralFetchUrl(), {
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json();
        })
        .then((payload) => {
	          const data = structurePayloadToData(payload);
          structuralMarkdownPayload = {
            data,
            rawPayload: payload,
            lastModified: payload?.lastModified || "",
            revision: payload?.revision || "",
            updatedAt: payload?.updated_at || payload?.updatedAt || "",
          };
          combatRosterPayload = normalizeCombatRoster(payload);
          return structuralMarkdownPayload;
        });
    }

    structuralMarkdownPromise
      .then(renderPayload)
      .catch((error) => {
        if (quiet && content.getAttribute("data-loaded") === "1") {
          debugWarn("PASKUS structural live refresh failed", error);
          return;
        }
        renderStructureError(root, error.message);
      })
      .finally(() => {
        content.removeAttribute("data-loading");
      });
  }

  function renderStructuralPage(force = false) {
    if (!isStructuralPath()) {
      return;
    }

    const root = document.querySelector("#root");
    if (!root) {
      return;
    }

    const existing = root.querySelector(".paskus-structure-page");
    const language = currentLanguage();
    if (existing) {
      existing.setAttribute("data-structure-language", language);
      loadStructuralMarkdown(existing, { force: true, quiet: true });
      applyGlobalLanguage();
      return;
    }

    const ui = uiCopy(language);
    document.title = ui.structure.title;
    root.innerHTML = `
      <div class="paskus-structure-page" data-structure-version="20260518" data-structure-language="${escapeHtml(language)}">
        ${structureNavHtml("struktural")}
        <main data-structure-content>
          <section class="structure-status">
            <div class="structure-status-card">
              <div class="structure-kicker">${escapeHtml(ui.structure.kicker)}</div>
              <h1>${escapeHtml(ui.structure.loadingTitle)}</h1>
              <p>${escapeHtml(ui.structure.loadingBody)}</p>
            </div>
          </section>
        </main>
      </div>
    `;
    loadStructuralMarkdown(root.querySelector(".paskus-structure-page"));
  }

  function ensureStreamerMenuLinks() {
    const navContainers = Array.from(document.querySelectorAll("nav, header"))
      .filter((nav) => !nav.closest(".paskus-seo-footer"))
      .flatMap((nav) => Array.from(nav.querySelectorAll("a[href='/about'], a[href='/struktural'], a[href='/#support'], a[href='https://discord.gg/aaBR9ruFva']")))
      .map((anchor) => anchor.parentElement)
      .filter(Boolean);
    const uniqueContainers = Array.from(new Set(navContainers));

    uniqueContainers.forEach((container) => {
      if (container.querySelector("a[href='/streamer']")) {
        return;
      }
      const structureLink = container.querySelector("a[href='/struktural']");
      const aboutLink = container.querySelector("a[href='/about']");
      const supportLink = container.querySelector("a[href='/#support']");
      const discordLink = container.querySelector("a[href='https://discord.gg/aaBR9ruFva']");
      const template = structureLink || aboutLink || supportLink || discordLink || container.querySelector("a");
      if (!template) {
        return;
      }
      const link = template.cloneNode(false);
      link.href = "/streamer";
      link.textContent = "STREAMER";
      link.setAttribute("data-paskus-nav-key", "streamer");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.removeAttribute("aria-current");
      if (structureLink) {
        structureLink.before(link);
      } else if (aboutLink) {
        aboutLink.before(link);
      } else if (discordLink) {
        discordLink.before(link);
      } else {
        container.appendChild(link);
      }
    });
  }

  function ensureStructuralMenuLinks() {
    const navContainers = Array.from(document.querySelectorAll("nav, header"))
      .flatMap((nav) => Array.from(nav.querySelectorAll("a[href='/about'], a[href='/#support'], a[href='https://discord.gg/aaBR9ruFva']")))
      .map((anchor) => anchor.parentElement)
      .filter(Boolean);
    const uniqueContainers = Array.from(new Set(navContainers));

    uniqueContainers.forEach((container) => {
      if (container.querySelector("a[href='/struktural']")) {
        return;
      }
      const aboutLink = container.querySelector("a[href='/about']");
      const discordLink = container.querySelector("a[href='https://discord.gg/aaBR9ruFva']");
      const template = aboutLink || discordLink || container.querySelector("a");
      if (!template) {
        return;
      }
      const link = template.cloneNode(false);
      link.href = "/struktural";
      link.textContent = "STRUKTURAL";
      link.classList.add("paskus-structural-nav-link");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.removeAttribute("aria-current");
      if (aboutLink) {
        aboutLink.before(link);
      } else if (discordLink) {
        discordLink.before(link);
      } else {
        container.appendChild(link);
      }
    });

    document.querySelectorAll("nav, header").forEach((nav) => {
      if (nav.classList.contains("paskus-main-nav")) {
        return;
      }
      if (nav.querySelector(".paskus-structural-header-cta")) {
        return;
      }
      const link = document.createElement("a");
      link.className = "paskus-structural-header-cta";
      link.href = "/struktural";
      link.textContent = "STRUKTURAL";
      const firstButton = Array.from(nav.children).find((child) => child.tagName === "BUTTON");
      if (firstButton) {
        firstButton.before(link);
      } else {
        nav.appendChild(link);
      }
    });
  }

  function ensureSeoHubLinks() {
    const containers = Array.from(document.querySelectorAll("nav, header"))
      .filter((nav) => !nav.closest(".paskus-seo-footer"))
      .flatMap((nav) => Array.from(nav.querySelectorAll("a[href='/about'], a[href='/struktural'], a[href='https://discord.gg/aaBR9ruFva']")))
      .map((anchor) => anchor.parentElement)
      .filter(Boolean);

    Array.from(new Set(containers)).forEach((container) => {
      if (container.querySelector("a[href='/brm5-roleplay']")) {
        return;
      }
      const structureLink = container.querySelector("a[href='/struktural']");
      const aboutLink = container.querySelector("a[href='/about']");
      const discordLink = container.querySelector("a[href='https://discord.gg/aaBR9ruFva']");
      const template = structureLink || aboutLink || discordLink || container.querySelector("a");
      if (!template) {
        return;
      }
      const link = template.cloneNode(false);
      link.href = "/brm5-roleplay";
      link.textContent = "BRM5";
      link.setAttribute("data-paskus-nav-key", "brm5");
      link.setAttribute("aria-label", "Resimen BRM5 Roleplay PASKUS Gi1");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.removeAttribute("aria-current");
      if (structureLink) {
        structureLink.before(link);
      } else if (aboutLink) {
        aboutLink.before(link);
      } else if (discordLink) {
        discordLink.before(link);
      } else {
        container.appendChild(link);
      }
    });
  }

  function seoFooterColumn(title, links) {
    return `
      <section>
        <h2 class="paskus-seo-footer__title">${escapeHtml(title)}</h2>
        <nav class="paskus-seo-footer__links" aria-label="${escapeHtml(title)}">
          ${links.map(([label, href, external]) => `
            <a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(label)}</a>
          `).join("")}
        </nav>
      </section>
    `;
  }

  function ensureSeoFooter() {
    const root = document.querySelector("#root");
    if (!root || document.querySelector(".paskus-admin-shell")) {
      return;
    }

    const footerHtml = `
      <div class="paskus-seo-footer__inner">
        <section class="paskus-seo-footer__brand">
          <a class="paskus-seo-footer__brand-row" href="/" aria-label="PASKUS Gi1 home">
            <img alt="Logo PASKUS Gi1" src="/recruitment-webhook-logo.png" loading="lazy" decoding="async">
            <span>
              <strong>PASKUS Gi1</strong>
              <span>So-791</span>
            </span>
          </a>
          <p>
            Website utama PASKUS Gi1 untuk informasi resimen BRM5 roleplay Indonesia,
            komando taktis So-791, unit khusus, dinas pendukung, struktur personel,
            streamer hub, pendaftaran resmi, dan akses Discord PASKUS.
          </p>
        </section>
        ${seoFooterColumn("BRM5 Roleplay", [
          ["Resimen BRM5 PASKUS Gi1", "/resimen-brm5"],
          ["Game BRM5 Roleplay", "/brm5-roleplay"],
          ["Roleplay Grup BRM5", "/roleplay-grup-brm5"],
          ["Cara Gabung BRM5 Roleplay", "/cara-gabung-brm5-roleplay"],
          ["Blackhawk Rescue 5 Roleplay Fraksi", "/blackhawk-rescue-5-roleplay-fraksi"],
        ])}
        ${seoFooterColumn("Unit So-791", [
          ["Unit BRM5 PASKUS", "/unit-brm5-paskus"],
          ["GATAM", "/unit/gatam"],
          ["TORUK MAKTO", "/unit/toruk-makto"],
          ["PATHFINDER", "/unit/pathfinder"],
          ["SENTINEL", "/unit/sentinel"],
          ["KOMODO", "/unit/komodo"],
        ])}
        ${seoFooterColumn("Informasi Resmi", [
          ["Home", "/"],
          ["Streamer Hub", "/streamer"],
          ["About PASKUS", "/about"],
          ["Struktural So-791", "/struktural"],
          ["Pendaftaran Personel", "/#enlist"],
          ["Discord PASKUS", "https://discord.gg/aaBR9ruFva", true],
          ["TikTok PASKUS Gi1", "https://www.tiktok.com/@paskus791", true],
        ])}
      </div>
      <div class="paskus-seo-footer__bottom">
        PASKUS Gi1 / So-791 / Blackhawk Rescue Mission 5 Roleplay Indonesia
      </div>
    `;

    let footer = root.querySelector(".paskus-seo-footer");
    if (!footer) {
      footer = document.createElement("footer");
      footer.className = "paskus-seo-footer";
      footer.setAttribute("aria-label", "Footer resmi PASKUS Gi1");
      root.appendChild(footer);
    }
    if (footer.innerHTML !== footerHtml) {
      footer.innerHTML = footerHtml;
    }
  }

  function streamerSocialIcon(type) {
    if (type === "tiktok") {
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.6 2.4c.32 2.62 1.78 4.18 4.23 4.62v3.4c-1.43-.03-2.72-.38-3.9-1.05v6.1c0 3.58-2.33 6.13-5.85 6.13-3.18 0-5.56-2.13-5.56-5.17 0-3.21 2.6-5.36 6.08-5.06v3.56c-1.42-.24-2.44.33-2.44 1.46 0 .96.75 1.58 1.83 1.58 1.23 0 2-.78 2-2.3V2.4h3.61Z"/>
        </svg>
      `;
    }
    if (type === "youtube") {
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21.55 7.2a3.08 3.08 0 0 0-2.17-2.18C17.46 4.5 12 4.5 12 4.5s-5.46 0-7.38.52A3.08 3.08 0 0 0 2.45 7.2 32.07 32.07 0 0 0 1.93 12c0 1.64.17 3.26.52 4.8a3.08 3.08 0 0 0 2.17 2.18c1.92.52 7.38.52 7.38.52s5.46 0 7.38-.52a3.08 3.08 0 0 0 2.17-2.18c.35-1.54.52-3.16.52-4.8s-.17-3.26-.52-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/>
        </svg>
      `;
    }
    if (type === "discord") {
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.65 5.32A16.2 16.2 0 0 0 15.72 4l-.48.94a14.13 14.13 0 0 0-4.48 0L10.28 4c-1.37.24-2.68.69-3.93 1.32C3.87 9.02 3.2 12.62 3.53 16.17A15.84 15.84 0 0 0 8.35 18.6l.98-1.34a10.41 10.41 0 0 1-1.55-.74c.13-.1.25-.2.37-.3a11.6 11.6 0 0 0 7.7 0l.37.3c-.5.29-1.02.54-1.56.74l.99 1.34a15.83 15.83 0 0 0 4.82-2.43c.39-4.11-.67-7.68-2.82-10.85ZM9.6 14.05c-.78 0-1.42-.72-1.42-1.6 0-.89.62-1.61 1.42-1.61.8 0 1.44.72 1.42 1.61 0 .88-.62 1.6-1.42 1.6Zm4.8 0c-.78 0-1.42-.72-1.42-1.6 0-.89.62-1.61 1.42-1.61.8 0 1.44.72 1.42 1.61 0 .88-.62 1.6-1.42 1.6Z"/>
        </svg>
      `;
    }
    if (type === "roblox") {
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.02 2.6 21.4 6.98 16.98 24 0 19.58 4.02 2.6Zm7.74 7.36-1.12 4.38 4.38 1.12 1.12-4.38-4.38-1.12Z"/>
        </svg>
      `;
    }
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.6 13.4a1.4 1.4 0 0 1 0-1.98l2.8-2.8a1.4 1.4 0 1 1 1.98 1.98l-2.8 2.8a1.4 1.4 0 0 1-1.98 0Z"/>
        <path d="M8.45 17.55a4.4 4.4 0 0 1-6.22-6.22l3-3a4.4 4.4 0 0 1 6.06-.15 1.45 1.45 0 0 1-2 2.1 1.5 1.5 0 0 0-2 .1l-3 3a1.5 1.5 0 0 0 2.12 2.12l1.13-1.13a1.45 1.45 0 0 1 2.05 2.05l-1.14 1.13Zm6.32-1.88a4.4 4.4 0 0 1-6.06.15 1.45 1.45 0 0 1 2-2.1 1.5 1.5 0 0 0 2-.1l3-3a1.5 1.5 0 1 0-2.12-2.12l-1.13 1.13a1.45 1.45 0 0 1-2.05-2.05l1.14-1.13a4.4 4.4 0 1 1 6.22 6.22l-3 3Z"/>
      </svg>
    `;
  }

  function streamerVideoType(source = "") {
    const value = String(source || "").toLowerCase();
    return value.endsWith(".mp4") ? "video/mp4" : "video/webm";
  }

  function streamerSafeCssUrl(value) {
    return value ? `url("${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}")` : "none";
  }

  function streamerDocumentationMedia(item, label = "Preview") {
    const poster = item?.poster || "/assets/paskus-streamer-highlight-download3-poster-v1.jpg";
    const title = item?.title || "PASKUS Documentation";
    if (item?.video) {
      return `
        <video muted loop playsinline preload="metadata" poster="${escapeHtml(poster)}" aria-label="${escapeHtml(title)}">
          <source src="${escapeHtml(item.video)}" type="${escapeHtml(streamerVideoType(item.video))}">
          ${item.fallback ? `<source src="${escapeHtml(item.fallback)}" type="${escapeHtml(streamerVideoType(item.fallback))}">` : ""}
        </video>
        <span class="event-doc-media-play">${escapeHtml(label)}</span>
      `;
    }
    return `<img src="${escapeHtml(poster)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async">`;
  }

  function renderStreamerDocumentationPage(force = false) {
    if (!isStreamerDocumentationPath()) {
      return;
    }

    const root = document.querySelector("#root");
    if (!root) {
      return;
    }

    const existing = root.querySelector(".paskus-event-doc-page");
    const language = currentLanguage();
    const remoteRevision = streamerContentCache?.revision || streamerContentCache?.updatedAt || "fallback";
    const version = `20260607-event-doc-${language}-${remoteRevision}`;
    if (!force && existing?.getAttribute("data-event-doc-version") === version) {
      return;
    }

    const copy = streamerCopy(language);
    const items = Array.isArray(copy.contentCards) && copy.contentCards.length ? copy.contentCards : STREAMER_COPY.contentCards;
    const featured = items[0] || {};
    const chapters = items.slice(0, 4);
    const moreItems = items.slice(0, 12);
    const heroPoster = featured.poster || "/assets/paskus-streamer-highlight-download3-poster-v1.jpg";
    const heroIntro = copy.archiveIntro || "Koleksi dokumentasi resmi PASKUS Gi1: highlight event, POV unit, arsip operasi, dan karya visual yang menampilkan ritme So-791.";

    document.documentElement.lang = languageMeta(language).htmlLang;
    document.title = `${copy.archiveTitle || "Event Documentation PASKUS"} | PASKUS Gi1 So-791`;
    root.innerHTML = `
      <div class="paskus-event-doc-page" data-event-doc-version="${escapeHtml(version)}" data-event-doc-language="${escapeHtml(language)}">
        ${mainNavHtml("streamer")}
        <main>
          <section class="event-doc-hero" style="--event-doc-hero:${escapeHtml(streamerSafeCssUrl(heroPoster))};">
            <div class="event-doc-hero__copy">
              <a class="event-doc-back" href="/streamer">Kembali ke Streamer Hub</a>
              <div class="event-doc-kicker">${escapeHtml(copy.archiveKicker || "Event Documentation")}</div>
              <h1>${escapeHtml(copy.archiveTitle || "Dokumentasi Event PASKUS")}</h1>
              <p>${escapeHtml(heroIntro)}</p>
              <div class="event-doc-hero__actions">
                <a class="event-doc-play" href="#event-doc-chapter-1">Play Highlight</a>
                <a class="event-doc-outline" href="/streamer">Roster Streamer</a>
              </div>
            </div>
          </section>

          <section class="event-doc-chapters" aria-label="${escapeHtml(copy.archiveTitle || "Dokumentasi Event PASKUS")}">
            ${chapters.map((item, index) => {
              const meta = [item.type, item.unit, item.status].filter(Boolean);
              const uploader = item.uploader || "PASKUS Media";
              return `
                <article class="event-doc-chapter ${index % 2 ? "is-reverse" : ""}" id="event-doc-chapter-${escapeHtml(String(index + 1))}">
                  <div class="event-doc-chapter__copy">
                    <span class="event-doc-chapter__label">Chapter</span>
                    <strong class="event-doc-chapter__number">${escapeHtml(String(index + 1).padStart(2, "0"))}</strong>
                    <h2>${escapeHtml(item.title || "PASKUS Documentation")}</h2>
                    <p>${escapeHtml(`${uploader} menyajikan ${item.unit || "PASKUS Gi1"} sebagai arsip visual resimen: momen operasi, ritme event, dan dokumentasi lapangan yang memperkuat identitas So-791.`)}</p>
                    <div class="event-doc-tags">
                      ${meta.map((entry) => `<span>${escapeHtml(entry)}</span>`).join("")}
                    </div>
                  </div>
                  <div class="event-doc-media-card">
                    ${streamerDocumentationMedia(item, item.video ? "Hover Preview" : "Photo Archive")}
                  </div>
                </article>
              `;
            }).join("")}
          </section>

          <section class="event-doc-more">
            <div class="event-doc-more__head">
              <div>
                <div class="event-doc-section-kicker">More Like PASKUS Operations</div>
                <h2>Arsip Visual Resimen</h2>
              </div>
              <a class="event-doc-outline" href="/streamer">Streamer Hub</a>
            </div>
            <div class="event-doc-more-grid">
              ${moreItems.map((item) => `
                <article class="event-doc-more-card">
                  ${streamerDocumentationMedia(item, item.type || "Archive")}
                  <span>${escapeHtml(item.title || "PASKUS Documentation")}</span>
                </article>
              `).join("")}
            </div>
          </section>
        </main>
      </div>
    `;

    root.querySelectorAll(".event-doc-media-card video, .event-doc-more-card video").forEach((video) => {
      const card = video.closest(".event-doc-media-card, .event-doc-more-card");
      video.addEventListener("contextmenu", (event) => event.preventDefault());
      card?.addEventListener("mouseenter", () => video.play().catch(() => {}));
      card?.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
      card?.addEventListener("click", () => {
        if (video.paused || video.ended) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    });

    fetchStreamerContent().then((payload) => {
      const nextRevision = payload?.revision || payload?.updatedAt || "fallback";
      const current = root.querySelector(".paskus-event-doc-page")?.getAttribute("data-event-doc-version") || "";
      const nextVersion = `20260607-event-doc-${currentLanguage()}-${nextRevision}`;
      if (payload && current !== nextVersion) {
        renderStreamerDocumentationPage(true);
      }
    });
  }

  function bindStreamerShowcase(root) {
    const rail = root?.querySelector?.("[data-streamer-showcase]");
    if (!rail || rail.dataset.showcaseBound === "1") {
      return;
    }

    const cards = Array.from(rail.querySelectorAll(".streamer-showcase-card"));
    const dots = Array.from(rail.querySelectorAll("[data-showcase-dot]"));
    if (!cards.length) {
      return;
    }

    if (typeof root.__streamerShowcaseAutoClear === "function") {
      root.__streamerShowcaseAutoClear();
    }

    rail.dataset.showcaseBound = "1";
    let activeIndex = 0;
    let autoTimer = 0;
    let resumeTimer = 0;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const clearShowcaseTimers = () => {
      window.clearTimeout(autoTimer);
      window.clearTimeout(resumeTimer);
    };

    const pauseInactiveVideos = () => {
      cards.forEach((card, index) => {
        const video = card.querySelector("video");
        if (!video || index === activeIndex) {
          return;
        }
        video.pause();
        try {
          video.currentTime = 0;
        } catch (_error) {
          // Some mobile browsers can reject currentTime before metadata is ready.
        }
      });
    };

    const updateShowcase = (nextIndex, playActive = false) => {
      const total = cards.length;
      if (!total) {
        return;
      }
      activeIndex = ((nextIndex % total) + total) % total;
      const isMobile = window.matchMedia?.("(max-width: 720px)")?.matches;
      const activeWidth = cards[activeIndex]?.getBoundingClientRect?.().width || (isMobile ? 180 : 300);
      const spacing = isMobile
        ? Math.min(activeWidth * 0.76, Math.max(62, window.innerWidth * 0.185))
        : Math.min(activeWidth * 0.68, Math.max(118, window.innerWidth * 0.08));

      cards.forEach((card, index) => {
        let offset = index - activeIndex;
        if (offset > total / 2) {
          offset -= total;
        }
        if (offset < total / -2) {
          offset += total;
        }

        const hidden = Math.abs(offset) > 3;
        const clamped = Math.max(-3, Math.min(3, offset));
        const depth = Math.abs(clamped);
        const x = Math.round(clamped * spacing);
        const rotate = Number((clamped * -1.35).toFixed(2));
        const scale = Math.max(isMobile ? 0.68 : 0.7, 1 - depth * (isMobile ? 0.112 : 0.094));
        const z = Math.round(72 - depth * 54);
        const opacity = hidden ? 0 : Math.max(0.06, 1 - depth * (isMobile ? 0.31 : 0.28));
        const blur = hidden ? 2.4 : depth * (isMobile ? 0.44 : 0.38);
        const saturate = hidden ? 0.62 : Math.max(0.66, 1.1 - depth * 0.12);
        const transform = `translateX(-50%) translateY(-50%) translateX(${x}px) rotate(${rotate}deg) scale(${scale.toFixed(3)})`;
        const filter = `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)})`;

        card.style.setProperty("--cover-transform", transform);
        card.style.setProperty("--cover-x", `${x}px`);
        card.style.setProperty("--cover-z", `${z}px`);
        card.style.setProperty("--cover-rotate", `${rotate}deg`);
        card.style.setProperty("--cover-scale", scale.toFixed(3));
        card.style.setProperty("--cover-opacity", opacity.toFixed(2));
        card.style.setProperty("--cover-blur", `${blur.toFixed(2)}px`);
        card.style.setProperty("--cover-saturate", saturate.toFixed(2));
        card.style.setProperty("transform", transform, "important");
        card.style.setProperty("opacity", opacity.toFixed(2), "important");
        card.style.setProperty("filter", filter, "important");
        card.style.zIndex = String(hidden ? 1 : 40 - depth);
        card.style.pointerEvents = hidden ? "none" : "auto";
        card.dataset.showcaseDepth = String(depth);
        card.classList.toggle("is-active", index === activeIndex);
        card.setAttribute("aria-current", index === activeIndex ? "true" : "false");
        card.setAttribute("aria-hidden", hidden ? "true" : "false");
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
        dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
      });

      pauseInactiveVideos();
      const activeVideo = cards[activeIndex]?.querySelector("video");
      if (playActive && activeVideo) {
        activeVideo.play().catch(() => {});
      }
    };

    const toggleActiveVideo = () => {
      const video = cards[activeIndex]?.querySelector("video");
      if (!video) {
        return;
      }
      if (video.paused || video.ended) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const queueAutoShowcase = (delay = 5200) => {
      window.clearTimeout(autoTimer);
      if (reducedMotion) {
        return;
      }
      autoTimer = window.setTimeout(() => {
        const userIsOnRail = rail.matches(":hover") || rail.contains(document.activeElement);
        if (document.hidden || userIsOnRail) {
          queueAutoShowcase(1600);
          return;
        }
        updateShowcase(activeIndex + 1, false);
        queueAutoShowcase(5600);
      }, delay);
    };

    const pauseForUser = (delay = 7600) => {
      window.clearTimeout(autoTimer);
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => queueAutoShowcase(900), delay);
    };

    cards.forEach((card, index) => {
      card.addEventListener("click", (event) => {
        pauseForUser();
        const video = card.querySelector("video");
        if (index !== activeIndex) {
          updateShowcase(index, false);
          return;
        }
        const rect = card.getBoundingClientRect();
        const clickRatio = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
        if (clickRatio < 0.28) {
          updateShowcase(activeIndex - 1, false);
          return;
        }
        if (clickRatio > 0.72) {
          updateShowcase(activeIndex + 1, false);
          return;
        }
        if (video) {
          if (video.paused || video.ended) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      });
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
          return;
        }
        event.preventDefault();
        pauseForUser();
        if (index !== activeIndex) {
          updateShowcase(index, false);
          return;
        }
        if (event.key === "ArrowLeft") {
          updateShowcase(activeIndex - 1, false);
          return;
        }
        if (event.key === "ArrowRight") {
          updateShowcase(activeIndex + 1, false);
          return;
        }
        toggleActiveVideo();
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        pauseForUser();
        updateShowcase(index, false);
      });
    });
    rail.querySelector("[data-showcase-prev]")?.addEventListener("click", () => {
      pauseForUser();
      updateShowcase(activeIndex - 1, false);
    });
    rail.querySelector("[data-showcase-next]")?.addEventListener("click", () => {
      pauseForUser();
      updateShowcase(activeIndex + 1, false);
    });
    rail.querySelector("[data-showcase-play]")?.addEventListener("click", () => {
      pauseForUser();
      const video = cards[activeIndex]?.querySelector("video");
      if (!video) {
        return;
      }
      if (video.paused || video.ended) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    rail.addEventListener("pointerenter", () => {
      window.clearTimeout(autoTimer);
    });
    rail.addEventListener("pointerleave", () => queueAutoShowcase(1600));
    rail.addEventListener("focusin", () => {
      window.clearTimeout(autoTimer);
    });
    rail.addEventListener("focusout", () => queueAutoShowcase(1600));
    const visibilityHandler = () => {
      if (document.hidden) {
        window.clearTimeout(autoTimer);
      } else {
        queueAutoShowcase(1800);
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);
    root.__streamerShowcaseAutoClear = () => {
      clearShowcaseTimers();
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
    if (root.__streamerShowcaseResize) {
      window.removeEventListener("resize", root.__streamerShowcaseResize);
    }
    root.__streamerShowcaseResize = () => updateShowcase(activeIndex, false);
    window.addEventListener("resize", root.__streamerShowcaseResize, { passive: true });
    updateShowcase(0, false);
    queueAutoShowcase(3200);
  }

  function renderStreamerPage(force = false) {
    if (!isStreamerPath() || isStreamerDocumentationPath()) {
      return;
    }

    const root = document.querySelector("#root");
    if (!root) {
      return;
    }

    const existing = root.querySelector(".paskus-streamer-page");
    const language = currentLanguage();
    const remoteRevision = streamerContentCache?.revision || streamerContentCache?.updatedAt || "fallback";
    const version = `20260606-streamer-${language}-${remoteRevision}`;
    if (!force && existing?.getAttribute("data-streamer-version") === version) {
      return;
    }

    const copy = streamerCopy(language);
    const ui = uiCopy(language);
    const streamerProfiles = Array.isArray(copy.profiles) ? copy.profiles : [];
    const slugifyStreamer = (value) => String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim();
    const streamerCssUrl = (value) => value ? `url("${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}")` : "none";
    const streamerProfileForCreator = (creator) => {
      const raw = creator?.slug || creator?.name || "";
      const expected = slugifyStreamer(raw);
      const href = String(creator?.href || "");
      return streamerProfiles.find((profile) => {
        const values = [
          profile.slug,
          profile.callSign,
          profile.displayName,
          profile.handle,
          profile.subdomain,
        ].map(slugifyStreamer);
        return values.includes(expected) || (profile.subdomain && href.includes(profile.subdomain));
      }) || null;
    };
    const streamerCreatorLinks = (profile, creator) => {
      const links = Array.isArray(creator?.links) && creator.links.length
        ? creator.links
        : Array.isArray(profile?.links) ? profile.links : [];
      return links
        .filter((link) => link && (link.href || link.url))
        .slice(0, 4)
        .map((link) => {
          const href = link.href || link.url;
          const type = link.type || "link";
          const label = link.label || link.name || type;
          return `
            <a class="streamer-creator-social ${escapeHtml(type)}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(label)} ${escapeHtml(profile?.callSign || creator?.name || "")}" title="${escapeHtml(label)}">
              ${streamerSocialIcon(type)}
            </a>
          `;
        })
        .join("");
    };
    const calendarHeads = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calendarEvents = new Map((copy.events || []).map((event) => [String(parseInt(event.day, 10) || event.day), event]));
    const calendarCells = Array.from({ length: 28 }, (_, index) => {
      const day = String(index + 1);
      const event = calendarEvents.get(day);
      return { day, event };
    });
    const showcaseItems = (copy.contentCards || []).slice(0, 8);
    document.documentElement.lang = languageMeta(language).htmlLang;
    document.title = copy.metaTitle || STREAMER_COPY.metaTitle;
    root.innerHTML = `
      <div class="paskus-streamer-page" data-streamer-version="${escapeHtml(version)}" data-streamer-language="${escapeHtml(language)}" style="--streamer-bg:url('${escapeHtml(STREAMER_HERO_BG_URL)}');">
        ${mainNavHtml("streamer")}

        <main>
          <section class="streamer-hero streamer-hero-showcase">
            <div class="streamer-hero-stage">
              <div class="streamer-highlight-shell">
                <div class="streamer-highlight-top">
                  <div class="streamer-highlight-title">
                    <span>${escapeHtml(copy.heroKicker)}</span>
                    <strong>${escapeHtml(copy.heroTitle)}</strong>
                    <span>${escapeHtml(copy.heroSubtitle)}</span>
                  </div>
                  <span class="streamer-live-badge" style="position:static;">${escapeHtml(copy.live.badge)}</span>
                </div>
                <div class="streamer-video-frame" data-streamer-featured-frame>
                  <video loop playsinline preload="metadata" poster="/assets/paskus-streamer-highlight-download3-poster-v1.jpg" aria-label="${escapeHtml(copy.live.title)}" data-streamer-featured-video controlsList="nodownload noplaybackrate nofullscreen" disablepictureinpicture>
                    <source src="/assets/paskus-streamer-highlight-download3-v1.mp4" type="video/mp4">
                  </video>
                  <button class="streamer-center-play" type="button" data-streamer-play-button aria-label="Play highlight video">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7L8 5Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section class="streamer-section" id="streamer-official">
            <div class="streamer-section-header">
              <div class="streamer-kicker">${escapeHtml(copy.socialKicker)}</div>
              <h2>${escapeHtml(copy.socialTitle)}</h2>
            </div>
            <div class="streamer-social-track">
              <a class="streamer-social-primary" href="${escapeHtml(copy.discordSocial.href)}" target="_blank" rel="noreferrer">
                <img src="/recruitment-webhook-logo.png" alt="Logo PASKUS Gi1" loading="lazy" decoding="async">
                <strong>${escapeHtml(copy.discordSocial.name)}</strong>
                <span>${escapeHtml(copy.discordSocial.handle)}</span>
                <small>${escapeHtml(copy.discordSocial.status)}</small>
              </a>
              <div class="streamer-social-grid">
                ${copy.officialSocials.map((social) => `
                <a class="streamer-social-card ${escapeHtml(social.type || "")}" href="${escapeHtml(social.href)}" target="_blank" rel="noreferrer">
                  <div class="streamer-social-icon">${streamerSocialIcon(social.type)}</div>
                  <div class="streamer-social-copy">
                  <strong>${escapeHtml(social.name)}</strong>
                  <span>${escapeHtml(social.handle)}</span>
                  <small>${escapeHtml(social.status)}</small>
                  </div>
                </a>
              `).join("")}
              </div>
            </div>
          </section>

          <section class="streamer-section" id="streamer-calendar">
            <div class="streamer-section-header">
              <div class="streamer-kicker">${escapeHtml(copy.eventKicker)}</div>
              <h2>${escapeHtml(copy.eventTitle)}</h2>
            </div>
            <div class="streamer-calendar" aria-label="${escapeHtml(copy.eventTitle)}">
              ${calendarHeads.map((day) => `<div class="streamer-calendar-head">${escapeHtml(day)}</div>`).join("")}
              ${calendarCells.map(({ day, event }) => `
                <article class="streamer-calendar-day">
                  <strong>${escapeHtml(day.padStart(2, "0"))}</strong>
                  ${event ? `<span title="${escapeHtml(event.body)}">${escapeHtml(event.title)}</span>` : ""}
                </article>
              `).join("")}
            </div>
          </section>

          <section class="streamer-section">
            <div class="streamer-section-header center">
              <div class="streamer-kicker">${escapeHtml(copy.rosterKicker)}</div>
              <h2>${escapeHtml(copy.rosterTitle)}</h2>
            </div>
            <div class="streamer-grid two">
              ${copy.creators.map((creator) => {
                const profile = streamerProfileForCreator(creator);
                const initials = creator.name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
                const media = profile?.media || {};
                const avatar = media.avatar || profile?.avatar || creator.avatar || "/recruitment-webhook-logo.png";
                const cover = creator.cover || creator.background || media.profileBackground || media.pageBackground || avatar || STREAMER_HERO_BG_URL;
                const title = creator.name || profile?.callSign || "Creator";
                const titleLine = creator.nickname || creator.alias || profile?.displayName || title;
                const bio = creator.bio || creator.focus || profile?.tagline || "";
                const badge = creator.badge || creator.role || profile?.role || "Creator";
                const socialLinks = streamerCreatorLinks(profile, creator);
                return `
                  <article class="streamer-creator" style="--streamer-cover:${escapeHtml(streamerCssUrl(cover))};--streamer-avatar:${escapeHtml(streamerCssUrl(avatar))};">
                    <div class="streamer-creator-cover">
                      <div class="streamer-creator-cover-img" aria-hidden="true"></div>
                      <div class="streamer-avatar ${avatar ? "streamer-avatar-photo" : ""}" aria-label="${escapeHtml(title)}">
                        <span>${escapeHtml(initials || "P")}</span>
                      </div>
                      <span class="streamer-tag">${escapeHtml(badge)}</span>
                    </div>
                    <div class="streamer-creator-body">
                      <h3>${escapeHtml(title)}</h3>
                      <p class="streamer-creator-schedule">${escapeHtml(titleLine)}</p>
                      <p>${escapeHtml(bio)}</p>
                      <p class="streamer-creator-schedule">${escapeHtml(creator.schedule)}</p>
                      ${socialLinks ? `<div class="streamer-creator-links">${socialLinks}</div>` : ""}
                      <ul>
                        ${creator.tags.map((tag) => `<li class="streamer-pill">${escapeHtml(tag)}</li>`).join("")}
                      </ul>
                      ${creator.href ? `<a class="streamer-mini-action" href="${escapeHtml(creator.href)}" target="_blank" rel="noreferrer">Buka Profile</a>` : ""}
                    </div>
                  </article>
                `;
              }).join("")}
            </div>
          </section>

          <section class="streamer-section" id="streamer-documentation-showcase">
            <div class="streamer-section-header with-action">
              <div class="streamer-header-copy">
                <div class="streamer-kicker">${escapeHtml(copy.galleryKicker || "Event Documentation")}</div>
                <h2>${escapeHtml(copy.galleryTitle || "Featured Operations Gallery")}</h2>
                <p>${escapeHtml(copy.galleryIntro || "Showcase horizontal untuk footage operasi, highlight event, POV unit, dan dokumentasi visual PASKUS Gi1.")}</p>
              </div>
              <a class="streamer-see-more" href="/streamer/event-documentation">${escapeHtml(copy.galleryMoreLabel || "See More")}</a>
            </div>
            <div class="streamer-showcase-rail" data-streamer-showcase aria-label="${escapeHtml(copy.galleryTitle || "Featured Operations Gallery")}">
              ${showcaseItems.map((item, index) => {
                const meta = [item.uploader, item.unit, item.status].filter(Boolean).join(" / ");
                const videoType = String(item.video || "").toLowerCase().endsWith(".mp4") ? "video/mp4" : "video/webm";
                return `
                  <article class="streamer-showcase-card${index === 0 ? " is-active" : ""}" data-showcase-index="${index}" role="button" tabindex="0" aria-label="${escapeHtml(item.title || "Showcase")}">
                    <div class="streamer-showcase-media">
                      ${item.video ? `
                        <img class="streamer-showcase-poster" src="${escapeHtml(item.poster || "/assets/paskus-landing-loop-poster-v2.jpg")}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
                        <video muted loop playsinline preload="metadata" poster="${escapeHtml(item.poster || "")}">
                          <source src="${escapeHtml(item.video)}" type="${escapeHtml(videoType)}">
                          ${item.fallback ? `<source src="${escapeHtml(item.fallback)}" type="video/mp4">` : ""}
                        </video>
                      ` : `<img src="${escapeHtml(item.poster || "/assets/paskus-streamer-highlight-download3-poster-v1.jpg")}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">`}
                    </div>
                    <div class="streamer-showcase-copy">
                      <span class="streamer-showcase-index">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
                      <div class="streamer-showcase-meta">
                        <span>${escapeHtml(item.type || "Documentation")}</span>
                        ${item.status ? `<span>${escapeHtml(item.status)}</span>` : ""}
                      </div>
                      <h3>${escapeHtml(item.title)}</h3>
                      ${meta ? `<p>${escapeHtml(meta)}</p>` : ""}
                    </div>
                  </article>
                `;
              }).join("")}
            </div>
          </section>

          <section class="streamer-section" id="streamer-archive">
            <div class="streamer-section-header">
              <div class="streamer-kicker">${escapeHtml(copy.archiveKicker)}</div>
              <h2>${escapeHtml(copy.archiveTitle)}</h2>
            </div>
            <div class="streamer-content-grid">
              ${copy.contentCards.map((item) => {
                const initials = item.uploader.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
                return `
                  <article class="streamer-content-card">
                    <div class="streamer-content-thumb" ${item.href ? `data-content-href="${escapeHtml(item.href)}"` : ""}>
                      ${item.video ? `
                        <video muted loop playsinline preload="metadata" poster="${escapeHtml(item.poster)}">
                          <source src="${escapeHtml(item.video)}" type="video/webm">
                          ${item.fallback ? `<source src="${escapeHtml(item.fallback)}" type="video/mp4">` : ""}
                        </video>
                      ` : `<img src="${escapeHtml(item.poster)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">`}
                      <span class="streamer-play-pill">${escapeHtml(item.type)}</span>
                    </div>
                    <div class="streamer-content-body">
                      <div class="streamer-uploader">
                        <div class="streamer-uploader-avatar">${escapeHtml(initials || "P")}</div>
                        <p>${escapeHtml(item.uploader)}</p>
                      </div>
                      <h3>${escapeHtml(item.title)}</h3>
                      <p>${escapeHtml(item.unit)} / ${escapeHtml(item.status)}</p>
                    </div>
                  </article>
                `;
              }).join("")}
            </div>
          </section>
        </main>
      </div>
    `;

    bindStreamerShowcase(root);

    if (root.dataset.streamerPlayerBound !== "1") {
      root.dataset.streamerPlayerBound = "1";
      root.addEventListener("click", (event) => {
        const target = event.target.closest("[data-streamer-play-button], [data-streamer-featured-video]");
        if (!target || !root.contains(target)) {
          return;
        }
        const frame = target.closest("[data-streamer-featured-frame]") || root.querySelector("[data-streamer-featured-frame]");
        const video = frame?.querySelector("[data-streamer-featured-video]");
        if (!video) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (video.paused || video.ended) {
          if (video.ended) {
            video.currentTime = 0;
          }
          video.muted = false;
          video.volume = 1;
          video.play()
            .then(() => frame.classList.add("is-playing"))
            .catch(() => frame.classList.remove("is-playing"));
        } else {
          video.pause();
          frame.classList.remove("is-playing");
        }
      }, true);
      root.addEventListener("play", (event) => {
        event.target.closest?.("[data-streamer-featured-frame]")?.classList.add("is-playing");
      }, true);
      root.addEventListener("pause", (event) => {
        event.target.closest?.("[data-streamer-featured-frame]")?.classList.remove("is-playing");
      }, true);
      root.addEventListener("contextmenu", (event) => {
        if (event.target.closest?.("video")) {
          event.preventDefault();
        }
      }, true);
      root.addEventListener("click", (event) => {
        const linkTarget = event.target.closest("[data-content-href]");
        if (!linkTarget || event.target.closest("video")) {
          return;
        }
        const href = linkTarget.getAttribute("data-content-href") || "";
        if (href) {
          window.open(href, "_blank", "noopener,noreferrer");
        }
      });
    }

    const featuredFrame = root.querySelector("[data-streamer-featured-frame]");
    const featuredVideo = root.querySelector("[data-streamer-featured-video]");
    const featuredPlayButton = root.querySelector("[data-streamer-play-button]");
    const syncFeaturedState = () => {
      featuredFrame?.classList.toggle("is-playing", Boolean(featuredVideo && !featuredVideo.paused && !featuredVideo.ended));
    };
    const toggleFeaturedVideo = () => {
      if (!featuredVideo) {
        return;
      }
      if (featuredVideo.paused || featuredVideo.ended) {
        featuredVideo.muted = false;
        featuredVideo.volume = 1;
        featuredVideo.play().catch(() => syncFeaturedState());
      } else {
        featuredVideo.pause();
      }
      syncFeaturedState();
    };
    featuredPlayButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFeaturedVideo();
    });
    featuredVideo?.addEventListener("click", toggleFeaturedVideo);
    featuredVideo?.addEventListener("play", syncFeaturedState);
    featuredVideo?.addEventListener("pause", syncFeaturedState);
    featuredVideo?.addEventListener("ended", syncFeaturedState);
    featuredVideo?.addEventListener("contextmenu", (event) => event.preventDefault());

    root.querySelectorAll(".streamer-content-thumb video, .streamer-showcase-media video").forEach((video) => {
      const card = video.closest(".streamer-content-card, .streamer-showcase-card");
      video.addEventListener("contextmenu", (event) => event.preventDefault());
      card?.addEventListener("mouseenter", () => video.play().catch(() => {}));
      card?.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
    });

    fetchStreamerContent().then((payload) => {
      const nextRevision = payload?.revision || payload?.updatedAt || "fallback";
      const current = root.querySelector(".paskus-streamer-page")?.getAttribute("data-streamer-version") || "";
      const nextVersion = `20260606-streamer-${currentLanguage()}-${nextRevision}`;
      if (payload && current !== nextVersion) {
        renderStreamerPage(true);
      }
    });
  }

  function renderAboutPage(force = false) {
    if (window.location.pathname !== "/about") {
      return;
    }

    const root = document.querySelector("#root");
    if (!root) {
      return;
    }

    const existing = root.querySelector(".paskus-about-page");
    const language = currentLanguage();
    const version = `20260521-${language}`;
    if (!force && existing?.getAttribute("data-about-version") === version) {
      return;
    }

    const copy = aboutCopy(language);
    const ui = uiCopy(language);
    document.documentElement.lang = languageMeta(language).htmlLang;
    document.title = copy.metaTitle || ABOUT_COPY.metaTitle;
    root.innerHTML = `
      <div class="paskus-about-page" data-about-version="${escapeHtml(version)}" data-about-language="${escapeHtml(language)}">
        ${mainNavHtml("about")}

        <main>
          <section class="about-hero">
            <div class="about-hero-inner">
              <div>
		                <div class="about-kicker">${escapeHtml(copy.heroKicker)}</div>
		                <h1>${escapeHtml(copy.heroTitle)} <span>${escapeHtml(copy.heroSubtitle)}</span></h1>
		                <p class="about-lead">${escapeHtml(copy.hero)}</p>
		                <div class="about-actions">
		                  <a href="/">${escapeHtml(copy.actions[0])}</a>
		                  <a href="/#enlist">${escapeHtml(copy.actions[1])}</a>
		                  <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noreferrer">${escapeHtml(copy.actions[2])}</a>
		                </div>
		              </div>
		              <aside class="about-command-panel">
		                <h2>${escapeHtml(copy.focusTitle)}</h2>
		                ${copy.focusPanel.map(([label, body]) => `
		                  <div class="about-command-row">
		                    <span>${escapeHtml(label)}</span>
		                    <p>${escapeHtml(body)}</p>
	                  </div>
	                `).join("")}
	              </aside>
	            </div>
		          </section>

		          <section class="about-section about-identity-section">
		            <div class="about-split">
		              <div class="about-image-frame">
		                <img alt="Operasi So-791" src="/assets/t2-CbABOaM8.webp" loading="eager" decoding="async" fetchpriority="high">
		              </div>
		              <div>
		                <div class="about-section-header">
		                  <div class="about-kicker">${escapeHtml(copy.identityKicker)}</div>
		                  <h2>${escapeHtml(copy.identityTitle)}</h2>
		                  <p>${escapeHtml(copy.identity)}</p>
		                </div>
		                <div class="about-grid">
		                  ${aboutCardsHtml(copy.culture)}
		                </div>
		              </div>
		            </div>
		          </section>

		          <section class="about-section">
		            <div class="about-section-header center">
		              <div class="about-kicker">${escapeHtml(copy.experienceKicker)}</div>
		              <h2>${escapeHtml(copy.experienceTitle)}</h2>
		              <p>${escapeHtml(copy.experienceIntro)}</p>
		            </div>
		            <div class="about-grid">
		              ${aboutStepsHtml(copy.experience)}
		            </div>
		          </section>

		          <section class="about-section">
		            <div class="about-section-header center">
		              <div class="about-kicker">${escapeHtml(copy.continueKicker)}</div>
		              <h2>${escapeHtml(copy.continueTitle)}</h2>
		              <p>${escapeHtml(copy.continueIntro)}</p>
		            </div>
		            <div class="about-grid">
		              ${aboutHomeLinksHtml(copy.homeLinks)}
		            </div>
		          </section>
	        </main>
	      </div>
    `;
  }

  function renderSupportDetailPage(force = false) {
    const unit = supportUnitBySlug(currentUnitSlug());
    if (!unit) {
      return;
    }

    const root = document.querySelector("#root");
    if (!root) {
      return;
    }

    const existing = root.querySelector(".paskus-support-detail-page");
    const language = currentLanguage();
    if (!force && existing?.getAttribute("data-support-slug") === unit.slug && existing?.getAttribute("data-support-language") === language) {
      return;
    }

    const accentRgb = hexToRgb(unit.color) || "157, 193, 131";
    const wallpaperStyle = unit.wallpaper ? `--support-wallpaper:url('${escapeHtml(unit.wallpaper)}');` : "";
    const ui = uiCopy(language);
    document.title = `${unit.title} | Dinas So-791`;
    root.innerHTML = `
      <div class="paskus-support-detail-page" data-support-slug="${escapeHtml(unit.slug)}" data-support-language="${escapeHtml(language)}" style="--support-rgb:${accentRgb};--support-accent:${escapeHtml(unit.color)};${wallpaperStyle}">
        ${mainNavHtml("support")}

        <main>
          <section class="support-hero">
            <div class="support-hero-inner">
              <div>
	                <div class="support-kicker">${escapeHtml(ui.supportDetail.nonCombat)} / ${escapeHtml(unit.category)}</div>
                <h1>${escapeHtml(unit.title)} <span>${escapeHtml(unit.back)}</span></h1>
                <p class="support-lead">${escapeHtml(unit.hero)}</p>
	                <div class="support-actions">
	                  <a href="/#support">${escapeHtml(ui.supportDetail.backToServices)}</a>
	                  <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noreferrer">${escapeHtml(ui.supportDetail.contactCommand)}</a>
                </div>
              </div>
              <aside class="support-brief">
                ${unit.logo || unit.logoText ? `
                  <div class="support-brief-logo">
                    ${unit.logoText ? `<span class="support-brief-roman-logo" aria-label="${escapeHtml(unit.title)} Logo">${escapeHtml(unit.logoText)}</span>` : `<img alt="${escapeHtml(unit.title)} Logo" src="${escapeHtml(unit.logo)}" loading="eager" decoding="async" fetchpriority="high">`}
                  </div>
                ` : ""}
	                <h2>${escapeHtml(ui.supportDetail.moduleStandard)}</h2>
	                <div class="support-brief-row">
	                  <span>${escapeHtml(ui.supportDetail.rank)}</span>
	                  <strong>${escapeHtml(unit.rank)}</strong>
	                </div>
	                <div class="support-brief-row">
	                  <span>${escapeHtml(ui.supportDetail.task)}</span>
	                  <strong>${escapeHtml(unit.task)}</strong>
	                </div>
	                <div class="support-brief-row">
	                  <span>${escapeHtml(ui.supportDetail.aspect)}</span>
	                  <p>${escapeHtml(unit.aspect)}</p>
                </div>
              </aside>
            </div>
          </section>

          <section class="support-section">
            <div class="support-split">
              <div>
	                <div class="support-kicker">${escapeHtml(ui.supportDetail.doctrine)}</div>
                <h2>${escapeHtml(unit.doctrineTitle)}</h2>
              </div>
              <div>
                <p>${escapeHtml(unit.doctrine)}</p>
                <div class="support-priority-grid">
                  ${unit.priorities.map((priority) => `
                    <div class="support-priority">
	                      <strong>${escapeHtml(priority)}</strong>
	                      <span>${escapeHtml(ui.supportDetail.assessmentAspect)}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="support-grid">
              ${supportDetailCardHtml(unit.cards)}
            </div>
          </section>

          <section class="support-section" style="padding-top:0;">
            <div class="support-split">
              <div>
	                <div class="support-kicker">${escapeHtml(ui.supportDetail.readinessFlow)}</div>
	                <h2>${escapeHtml(ui.supportDetail.serviceSelection)}</h2>
              </div>
              <div>
                <p>${escapeHtml(unit.route)}</p>
                <p style="margin-top:18px;color:rgba(232,240,226,0.58);font-size:12px;font-weight:900;text-transform:uppercase;">${escapeHtml(unit.footer)}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    `;
  }

  function renderKomodoPage(force = false) {
    if (window.location.pathname !== "/unit/komodo") {
      return;
    }

    const root = document.querySelector("#root");
    const language = currentLanguage();
    if (!root || (!force && root.querySelector(".paskus-komodo-page")?.getAttribute("data-komodo-language") === language)) {
      return;
    }

    const ui = uiCopy(language);
    const unit = moduleCopy(language).units.komodo;
    document.title = `${unit.title} | PASKUS Gi1`;
    root.innerHTML = `
      <div class="paskus-komodo-page" data-komodo-language="${escapeHtml(language)}">
        ${mainNavHtml("combat")}

        <main>
          <section class="komodo-hero">
            <div class="komodo-hero-inner">
              <div>
	                <div class="komodo-eyebrow">${escapeHtml(ui.komodo.eyebrow)}</div>
	                <h1>${escapeHtml(unit.title)} <span>${escapeHtml(ui.komodo.subtitle)}</span></h1>
	                <p class="komodo-lead">
	                  ${escapeHtml(unit.hero)}
	                </p>
	                <div class="komodo-actions">
	                  <a href="/#combat">${escapeHtml(ui.komodo.back)}</a>
	                  <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noreferrer">${escapeHtml(ui.komodo.contact)}</a>
                </div>
              </div>
              <aside class="komodo-logo-card">
                <img alt="Komodo Corps So-791" src="${KOMODO_LOGO_URL}" loading="eager" decoding="async" fetchpriority="high">
              </aside>
            </div>
          </section>

          <section class="komodo-section">
            <div class="komodo-copy">
              <div>
	                <div class="komodo-eyebrow">${escapeHtml(ui.komodo.doctrineEyebrow)}</div>
	                <h2>${escapeHtml(unit.doctrineTitle)}</h2>
              </div>
              <div>
                <p>
	                  ${escapeHtml(unit.doctrine)}
                </p>
                <div class="komodo-stats">
	                  ${ui.komodo.stats.map(([value, label]) => `<div class="komodo-stat"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}
                </div>
              </div>
            </div>

            <div class="komodo-grid">
	              ${unit.cards.map(([title, body]) => `
	                <article class="komodo-info-card">
	                  <h3>${escapeHtml(title)}</h3>
	                  <p>${escapeHtml(body)}</p>
	                </article>
	              `).join("")}
            </div>
          </section>

          <section class="komodo-section" style="padding-top:0;text-align:center;">
	            <p style="color:rgba(232,240,226,0.46);font-size:10px;font-weight:800;letter-spacing:0.34em;text-transform:uppercase;">${escapeHtml(ui.komodo.final)}</p>
          </section>
        </main>
      </div>
    `;
    syncKomodoDetailRoster();
    window.setTimeout(syncKomodoDetailRoster, 160);
    window.setTimeout(syncKomodoDetailRoster, 720);
  }

  function syncKomodoDetailRoster() {
    if (window.location.pathname !== "/unit/komodo") {
      return;
    }
    const page = document.querySelector(".paskus-komodo-page");
    const hero = page?.querySelector(".komodo-hero");
    const unit = moduleCopy().units.komodo;
    if (!page || !hero || !unit) {
      return;
    }
    renderUnitDetailRoster(page, hero, "komodo", unit);
  }

  function shouldUseLightVideoMode() {
    const connection = navigator.connection || {};
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(connection.saveData);
    const slowNetwork = typeof connection.effectiveType === "string" && /(^|-)2g/i.test(connection.effectiveType);
    return reducedMotion || saveData || slowNetwork;
  }

  function createCinematicVideoElement({
    label = "PASKUS cinematic background",
    poster = PASKUS_LANDING_VIDEO_POSTER_URL,
    webmUrl = PASKUS_LANDING_VIDEO_WEBM_URL,
    mp4Url = PASKUS_LANDING_VIDEO_MP4_URL,
    preload = "metadata",
  } = {}) {
    const video = document.createElement("video");
    video.className = "paskus-video-media";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = preload;
    video.poster = poster;
    video.setAttribute("aria-label", label);
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const webm = document.createElement("source");
    webm.src = webmUrl;
    webm.type = "video/webm";
    video.appendChild(webm);

    const mp4 = document.createElement("source");
    mp4.src = mp4Url;
    mp4.type = "video/mp4";
    video.appendChild(mp4);

    return video;
  }

  function createLandingVideoElement(label = "PASKUS cinematic background") {
    return createCinematicVideoElement({ label });
  }

  function createIntroVideoElement(label = "PASKUS intro video background") {
    return createCinematicVideoElement({
      label,
      poster: PASKUS_INTRO_VIDEO_POSTER_URL,
      webmUrl: PASKUS_INTRO_VIDEO_WEBM_URL,
      mp4Url: PASKUS_INTRO_VIDEO_MP4_URL,
      preload: "auto",
    });
  }

  function safelyPlayVideo(video) {
    if (!video || shouldUseLightVideoMode()) {
      return;
    }

    const parent = video.parentElement;
    const markReady = () => {
      parent?.classList.add("is-ready");
      if (parent?.classList.contains("paskus-video-intro")) {
        video.style.opacity = "0.38";
      }
    };
    video.addEventListener("canplay", markReady, { once: true });
    video.addEventListener("loadeddata", markReady, { once: true });

    const play = () => {
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => {
          parent?.classList.remove("is-ready");
        });
      }
    };

    if (video.readyState >= 2) {
      play();
      markReady();
      return;
    }

    video.addEventListener("canplay", play, { once: true });
  }

  function installLandingVideo() {
    if (window.location.pathname !== "/") {
      document.querySelector(".paskus-landing-video-bg")?.remove();
      return;
    }

    const home = document.querySelector("#home");
    if (!home) {
      return;
    }

    removeLegacyHomeVideo(home);

    if (home.querySelector(".paskus-landing-video-bg")) {
      return;
    }

    home.classList.add("paskus-video-home");
    const layer = document.createElement("div");
    layer.className = "paskus-landing-video-bg";
    layer.setAttribute("aria-hidden", "true");
    const video = createLandingVideoElement("PASKUS landing video background");
    layer.appendChild(video);
    home.insertBefore(layer, home.firstChild);
    safelyPlayVideo(video);
  }

  function removeLegacyHomeVideo(home = document.querySelector("#home")) {
    if (!home) {
      return;
    }

    home.querySelectorAll(":scope > video.video-bg, :scope > .video-bg").forEach((node) => {
      if (node.classList?.contains("paskus-landing-video-bg")) {
        return;
      }
      if (typeof node.pause === "function") {
        node.pause();
      }
      node.remove();
    });
  }

  function installIntroVideoBackdrop() {
    if (window.location.pathname !== "/" || document.querySelector(".paskus-video-intro")) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "paskus-video-intro";
    overlay.setAttribute("aria-hidden", "true");

    const video = createIntroVideoElement("PASKUS intro video background 1-12s");
    overlay.appendChild(video);
    overlay.insertAdjacentHTML("beforeend", `
      <div class="paskus-video-intro__mark">
        <img src="/recruitment-webhook-logo.png" alt="" loading="eager" decoding="async">
        <span>
          <strong>${escapeHtml(PASKUS_BRAND_NAME)}</strong>
          <small>${escapeHtml(PASKUS_BRAND_SUBLINE)}</small>
        </span>
        <div class="paskus-video-intro__bar"></div>
      </div>
    `);

    document.body.appendChild(overlay);
    safelyPlayVideo(video);

    const endIntro = () => {
      overlay.classList.add("is-ending");
      window.setTimeout(() => {
        video.pause();
        overlay.remove();
      }, 620);
    };

    window.setTimeout(endIntro, shouldUseLightVideoMode() ? 950 : 2400);
  }

  function staticEnhanceKey() {
    return [
      window.location.pathname,
      Boolean(document.querySelector("#combat")),
      Boolean(document.querySelector("#support")),
      Boolean(document.querySelector("#enlist")),
	      Boolean(document.querySelector(".body-nav")),
	      Boolean(document.querySelector(".paskus-indonesia-presence")),
	      Boolean(document.querySelector(".paskus-module-overview")),
      Boolean(document.querySelector(".paskus-module-golongan")),
      Boolean(document.querySelector(".paskus-structure-page")),
      Boolean(document.querySelector(".paskus-streamer-page")),
      Boolean(document.querySelector(".paskus-event-doc-page")),
      Boolean(document.querySelector(".paskus-landing-video-bg")),
      Boolean(document.querySelector("#home > .video-bg")),
      Boolean(document.querySelector(".paskus-seo-footer")),
      Boolean(document.querySelector("a[href='/brm5-roleplay']")),
      Boolean(document.querySelector("a[href='/unit/komodo']")),
      Boolean(getRegisterForm()),
    ].join("|");
  }

  function enhanceStaticLayout(force = false) {
    const key = staticEnhanceKey();
    const streamerDocNeedsRender = isStreamerDocumentationPath() && !document.querySelector(".paskus-event-doc-page");
    const streamerNeedsRender = isStreamerPath() && !isStreamerDocumentationPath() && !document.querySelector(".paskus-streamer-page");
    if (!force && !streamerNeedsRender && !streamerDocNeedsRender && key === lastStaticEnhanceKey) {
      return;
    }
    lastStaticEnhanceKey = key;
    markUnitDetailWallpaper();
    renderStructuralPage(force);
    renderAboutPage(force);
    renderStreamerDocumentationPage(force);
    renderStreamerPage(force);
    renderKomodoPage(force);
    syncKomodoDetailRoster();
    renderSupportDetailPage(force);
    ensureStreamerMenuLinks();
    ensureStructuralMenuLinks();
    ensureSeoHubLinks();
    ensureLanguageSwitcher();
    removeLegacyHomeVideo();
    installLandingVideo();
    enhanceCombatCards();
    renameSupportUnits();
    applyModuleCopy();
    ensureSeoFooter();
    installNavigationEnhancements();
    applyGlobalLanguage();
  }

  function enhanceForms(forceStatic = false) {
    enhanceStaticLayout(forceStatic);
    enhanceRegisterForm(getRegisterForm());
    renderFloatingPanel();

    document.querySelectorAll("form").forEach((form) => {
      if (!form.querySelector("input") || !form.querySelector("button[type='submit'], button")) {
        return;
      }

      if (!isManagedRegistrationForm(form)) {
        return;
      }

      fillDiscordInputs(form);
      formMessage(form);
    });
  }

  function installHomeEnhancementWatchdog() {
    if (window.location.pathname !== "/") {
      return;
    }

    const run = (force = false) => {
      enhanceStaticLayout(force);
      applyBrandIdentity();
      installLandingVideo();
    };

    [0, 40, 120, 260, 520, 900, 1400, 2200, 3600].forEach((delay, index) => {
      window.setTimeout(() => run(index < 5), delay);
    });

    const root = document.querySelector("#root");
    if (!root || typeof MutationObserver === "undefined") {
      return;
    }

    let timer = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => run(true), 45);
    });

    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 15000);
  }

  function blockSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    if (!isManagedRegistrationForm(form)) {
      return;
    }

    if (!hasDiscordSync()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      renderFloatingPanel();
      formMessage(form);

      if (!STATE.statusLoaded) {
        alert(uiCopy().form.alertChecking);
        return;
      }

      if (!STATE.configured) {
        alert(uiCopy().form.alertConfig);
        return;
      }

      alert(uiCopy().form.alertAuth);
      window.location.href = loginHref();
      return;
    }

    if (!hasLocationConsent()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      renderFloatingPanel();
      formMessage(form);
      alert(formCopyValue("alertLocation") || formCopyValue("locationRequired"));
      return;
    }

    if (isUnitForm(form) && !STATE.hasAllowedRole) {
      event.preventDefault();
      event.stopImmediatePropagation();
      renderFloatingPanel();
      alert(uiCopy().form.alertRole);
      return;
    }

    fillDiscordInputs(form);
  }

  async function boot() {
    installIntroVideoBackdrop();
    warmWebsiteAssets();
    installNavigationEnhancements();
    document.addEventListener("submit", blockSubmit, true);
    renderFloatingPanel();
    renderCsAiWidget();
    enhanceForms(true);
    installHomeEnhancementWatchdog();

    await loadStatus();
    await loadLocationStatus();
    if (hasDiscordSync()) {
      await attachStoredLocationToDiscord();
      await loadLocationStatus();
    }
    renderFloatingPanel();
    renderCsAiWidget();
    enhanceForms(true);

    const refresh = () => {
      fillDiscordInputs(document);
      enhanceForms();
    };

    let refreshCount = 0;
    const refreshTimer = window.setInterval(() => {
      refresh();
      refreshCount += 1;
      if (refreshCount >= 18) {
        window.clearInterval(refreshTimer);
      }
    }, 700);

    document.addEventListener("click", () => window.setTimeout(refresh, 80), true);
    document.addEventListener("focusin", () => window.setTimeout(refresh, 80), true);
    window.addEventListener("popstate", () => window.setTimeout(refresh, 80));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
