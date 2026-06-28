import React, { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getImageUrl, getVideoUrl } from "@/utils/assets";

// SVG icons inlined to avoid extra deps
const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.65 5.32A16.2 16.2 0 0 0 15.72 4l-.48.94a14.13 14.13 0 0 0-4.48 0L10.28 4c-1.37.24-2.68.69-3.93 1.32C3.87 9.02 3.2 12.62 3.53 16.17A15.84 15.84 0 0 0 8.35 18.6l.98-1.34a10.41 10.41 0 0 1-1.55-.74c.13-.1.25-.2.37-.3a11.6 11.6 0 0 0 7.7 0l.37.3c-.5.29-1.02.54-1.56.74l.99 1.34a15.83 15.83 0 0 0 4.82-2.43c.39-4.11-.67-7.68-2.82-10.85ZM9.6 14.05c-.78 0-1.42-.72-1.42-1.6 0-.89.62-1.61 1.42-1.61.8 0 1.44.72 1.42 1.61 0 .88-.62 1.6-1.42 1.6Zm4.8 0c-.78 0-1.42-.72-1.42-1.6 0-.89.62-1.61 1.42-1.61.8 0 1.44.72 1.42 1.61 0 .88-.62 1.6-1.42 1.6Z" />
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16.6 2.4c.32 2.62 1.78 4.18 4.23 4.62v3.4c-1.43-.03-2.72-.38-3.9-1.05v6.1c0 3.58-2.33 6.13-5.85 6.13-3.18 0-5.56-2.13-5.56-5.17 0-3.21 2.6-5.36 6.08-5.06v3.56c-1.42-.24-2.44.33-2.44 1.46 0 .96.75 1.58 1.83 1.58 1.23 0 2-.78 2-2.3V2.4h3.61Z" />
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.55 7.2a3.08 3.08 0 0 0-2.17-2.18C17.46 4.5 12 4.5 12 4.5s-5.46 0-7.38.52A3.08 3.08 0 0 0 2.45 7.2 32.07 32.07 0 0 0 1.93 12c0 1.64.17 3.26.52 4.8a3.08 3.08 0 0 0 2.17 2.18c1.92.52 7.38.52 7.38.52s5.46 0 7.38-.52a3.08 3.08 0 0 0 2.17-2.18c.35-1.54.52-3.16.52-4.8s-.17-3.26-.52-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
  </svg>
);
const RobloxIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4.02 2.6 21.4 6.98 16.98 24 0 19.58 4.02 2.6Zm7.74 7.36-1.12 4.38 4.38 1.12 1.12-4.38-4.38-1.12Z" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.6 13.4a1.4 1.4 0 0 1 0-1.98l2.8-2.8a1.4 1.4 0 1 1 1.98 1.98l-2.8 2.8a1.4 1.4 0 0 1-1.98 0Z" />
    <path d="M8.45 17.55a4.4 4.4 0 0 1-6.22-6.22l3-3a4.4 4.4 0 0 1 6.06-.15 1.45 1.45 0 0 1-2 2.1 1.5 1.5 0 0 0-2 .1l-3 3a1.5 1.5 0 0 0 2.12 2.12l1.13-1.13a1.45 1.45 0 0 1 2.05 2.05l-1.14 1.13Zm6.32-1.88a4.4 4.4 0 0 1-6.06.15 1.45 1.45 0 0 1 2-2.1 1.5 1.5 0 0 0 2-.1l3-3a1.5 1.5 0 1 0-2.12-2.12l-1.13 1.13a1.45 1.45 0 0 1-2.05-2.05l1.14-1.13a4.4 4.4 0 1 1 6.22 6.22l-3 3Z" />
  </svg>
);

const socialIcon = (type) => {
  switch (type) {
    case "discord": return <DiscordIcon />;
    case "tiktok": return <TikTokIcon />;
    case "youtube": return <YouTubeIcon />;
    case "roblox": return <RobloxIcon />;
    default: return <LinkIcon />;
  }
};

const DISCORD_URL = "https://discord.gg/aaBR9ruFva";
const STREAMER_HUB_URL = "https://paskus.so791.com/streamer";
const HERO_BG = getImageUrl("about.webp");
const HERO_POSTER = getImageUrl("paskus-streamer-highlight-download3-poster-v1.jpg");
const HERO_VIDEO = getVideoUrl("paskus-streamer-highlight-download3-v1.mp4");
const CALENDAR_HEADS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SHOWCASE_STEP_X = 118;
const SHOWCASE_STEP_ROTATE = 1.35;
const SHOWCASE_STEP_SCALE = 0.094;
const SHOWCASE_BASE_Z = 72;
const SHOWCASE_STEP_Z = 54;
const SHOWCASE_MAX_DEPTH = 3;

function showcaseVars(depth, side) {
  const d = Math.min(depth, SHOWCASE_MAX_DEPTH);
  const x = d * SHOWCASE_STEP_X * side;
  const rotate = d * SHOWCASE_STEP_ROTATE * -side;
  const scale = Math.max(1 - d * SHOWCASE_STEP_SCALE, 0.7);
  const opacity = Math.max(1 - d * 0.28, 0.1);
  const blur = d * 0.38;
  const saturate = Math.max(1.1 - d * 0.12, 0.7);
  const z = SHOWCASE_BASE_Z - d * SHOWCASE_STEP_Z;
  const tf = `translateX(-50%) translateY(-50%) translateX(${x}px) rotate(${rotate}deg) scale(${scale.toFixed(3)})`;
  return {
    depth: d,
    vars: {
      "--cover-transform": tf,
      "--cover-x": `${x}px`,
      "--cover-z": `${z}px`,
      "--cover-rotate": `${rotate}deg`,
      "--cover-scale": scale.toFixed(3),
      "--cover-opacity": opacity.toFixed(2),
      "--cover-blur": `${blur.toFixed(2)}px`,
      "--cover-saturate": saturate.toFixed(2),
    },
    transform: tf,
    opacity: opacity.toFixed(2),
    filter: `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)})`,
    zIndex: 40 - d,
    pointerEvents: depth <= SHOWCASE_MAX_DEPTH ? "auto" : "none",
  };
}

const StreamersFeature = () => {
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const heroVideoRef = useRef(null);
  const autoTimerRef = useRef(null);
  const showcaseRailRef = useRef(null);

  useEffect(() => {
    const fetchUrl = import.meta.env.DEV
      ? "/api/streamer-content.json"
      : `/api/streamer-content.php?t=${Date.now()}`;

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.text();
      })
      .then((text) => {
        const t = text.trim();
        if (!t.startsWith("{") && !t.startsWith("[")) throw new Error("Not JSON");
        return JSON.parse(t);
      })
      .catch(() => {
        if (import.meta.env.DEV) return null;
        return fetch("/api/streamer-content.json")
          .then((r) => {
            if (!r.ok) throw new Error("HTTP JSON");
            return r.text();
          })
          .then((text) => {
            const t = text.trim();
            if (!t.startsWith("{") && !t.startsWith("[")) throw new Error("Not JSON");
            return JSON.parse(t);
          })
          .catch(() => null);
      })
      .then((payload) => {
        setHub(payload?.data?.hub || {});
      })
      .catch(() => setHub({}))
      .finally(() => setLoading(false));
  }, []);

  const contentCards = hub?.contentCards || [];
  const totalCards = contentCards.length;

  const advanceShowcase = useCallback(() => {
    if (totalCards > 1) setActiveShowcase((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  useEffect(() => {
    if (totalCards <= 1) return;
    autoTimerRef.current = setInterval(advanceShowcase, 4000);
    return () => clearInterval(autoTimerRef.current);
  }, [totalCards, advanceShowcase]);

  useEffect(() => {
    const rail = showcaseRailRef.current;
    if (!rail || totalCards === 0) return;
    const cards = rail.querySelectorAll(".streamer-showcase-card");
    cards.forEach((card) => {
      const idx = parseInt(card.getAttribute("data-showcase-index"), 10);
      let rawDist = idx - activeShowcase;
      if (rawDist > totalCards / 2) rawDist -= totalCards;
      if (rawDist < -totalCards / 2) rawDist += totalCards;
      const depth = Math.abs(rawDist);
      const side = rawDist >= 0 ? 1 : -1;
      const v = showcaseVars(depth, side);

      Object.entries(v.vars).forEach(([k, val]) => card.style.setProperty(k, val));
      card.style.setProperty("transform", v.transform, "important");
      card.style.setProperty("opacity", v.opacity, "important");
      card.style.setProperty("filter", v.filter, "important");
      card.style.zIndex = v.zIndex;
      card.style.pointerEvents = v.pointerEvents;
      card.setAttribute("data-showcase-depth", v.depth);
      card.setAttribute("aria-current", idx === activeShowcase ? "true" : "false");
      card.setAttribute("aria-hidden", depth > SHOWCASE_MAX_DEPTH ? "true" : "false");
      if (idx === activeShowcase) {
        card.classList.add("is-active");
      } else {
        card.classList.remove("is-active");
      }
    });
  }, [activeShowcase, totalCards]);

  const handleShowcaseClick = (idx) => {
    clearInterval(autoTimerRef.current);
    setActiveShowcase(idx);
    autoTimerRef.current = setInterval(advanceShowcase, 4000);
  };

  const handleHeroPlay = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {});
      setHeroPlaying(true);
    }
  };

  if (loading || !hub) {
    return (
      <div className="paskus-streamer-page" style={{ "--streamer-bg": `url('${HERO_BG}')` }}>
        <Navbar />
        <main>
          <section className="streamer-hero" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#d4af37" }}>
              <div className="streamer-kicker">Loading...</div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const creators = hub.creators || [];
  const events = hub.events || [];
  const calendarMap = new Map(events.map((e) => [String(parseInt(e.day, 10)), e]));

  const creatorLinks = (creator) => {
    const links = [
      { type: "discord", label: "Discord PASKUS", url: DISCORD_URL },
      { type: "community", label: "Streamer Hub", url: STREAMER_HUB_URL },
      ...(creator.links || []),
    ];
    return links.slice(0, 4);
  };

  const uploaderInitials = (name) =>
    (name || "")
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      className="paskus-streamer-page"
      data-streamer-language="id"
      style={{ "--streamer-bg": `url('${HERO_BG}')` }}
    >
      <Navbar />

      <main>
        {/* ═══ HERO ═══ */}
        <section className="streamer-hero streamer-hero-showcase">
          <div className="streamer-hero-stage">
            <div className="streamer-highlight-shell">
              <div className="streamer-highlight-top">
                <div className="streamer-highlight-title">
                  <span>{hub.heroKicker || "Highlight Play"}</span>
                  <strong>{hub.heroTitle || "PASKUS GI1"}</strong>
                  <span>{hub.heroSubtitle || "Streamer Hub / Karya So-791"}</span>
                </div>
                <span className="streamer-live-badge" style={{ position: "static" }}>
                  {hub.live?.badge || "Featured Play"}
                </span>
              </div>
              <div className="streamer-video-frame" data-streamer-featured-frame="">
                <video
                  ref={heroVideoRef}
                  loop
                  playsInline
                  preload="metadata"
                  poster={hub.live?.poster || HERO_POSTER}
                  aria-label="Official Highlight"
                  controls={heroPlaying}
                  controlsList="nodownload noplaybackrate nofullscreen"
                  disablePictureInPicture
                  onPause={() => setHeroPlaying(false)}
                  onEnded={() => setHeroPlaying(false)}
                >
                  <source src={hub.live?.video || HERO_VIDEO} type="video/mp4" />
                </video>
                {!heroPlaying && (
                  <button
                    className="streamer-center-play"
                    type="button"
                    onClick={handleHeroPlay}
                    aria-label="Play highlight video"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7L8 5Z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ OFFICIAL SOCIAL ═══ */}
        <section className="streamer-section" id="streamer-official">
          <div className="streamer-section-header">
            <div className="streamer-kicker">{hub.socialKicker || "Official Social Media"}</div>
            <h2>{hub.socialTitle || "Akun Resmi PASKUS Gi1"}</h2>
          </div>
          <div className="streamer-social-track">
            <a
              className="streamer-social-primary"
              href={hub.discordSocial?.href || DISCORD_URL}
              target="_blank"
              rel="noreferrer"
            >
              <img src="/recruitment-webhook-logo.png" alt="Logo PASKUS Gi1" loading="lazy" decoding="async" />
              <strong>{hub.discordSocial?.name || "Discord PASKUS"}</strong>
              <span>{hub.discordSocial?.handle || "PASKUS Gi1 / So-791"}</span>
              <small>{hub.discordSocial?.status || "Community Hub"}</small>
            </a>
            <div className="streamer-social-grid">
              {(hub.officialSocials || []).map((s, i) => (
                <a
                  key={i}
                  className={`streamer-social-card ${s.type}`}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="streamer-social-icon">{socialIcon(s.type)}</div>
                  <div className="streamer-social-copy">
                    <strong>{s.name}</strong>
                    <span>{s.handle}</span>
                    <small>{s.status}</small>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CALENDAR ═══ */}
        <section className="streamer-section" id="streamer-calendar">
          <div className="streamer-section-header">
            <div className="streamer-kicker">Event Calendar</div>
            <h2>Jadwal Produksi Dan Stream</h2>
          </div>
          <div className="streamer-calendar" aria-label="Jadwal Produksi Dan Stream">
            {CALENDAR_HEADS.map((d) => (
              <div key={d} className="streamer-calendar-head">{d}</div>
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const day = String(i + 1);
              const ev = calendarMap.get(day);
              return (
                <article key={day} className="streamer-calendar-day">
                  <strong>{day.padStart(2, "0")}</strong>
                  {ev && <span title={ev.body}>{ev.title}</span>}
                </article>
              );
            })}
          </div>
        </section>

        {/* ═══ ROSTER ═══ */}
        <section className="streamer-section">
          <div className="streamer-section-header center">
            <div className="streamer-kicker">Roster Streamer</div>
            <h2>Streamer Dan Content Creator</h2>
          </div>
          <div className={`streamer-grid ${creators.length <= 2 ? "two" : "two"}`}>
            {creators.map((c) => (
              <article
                key={c.slug}
                className="streamer-creator"
                style={{
                  "--streamer-cover": `url("${c.cover || c.background || ""}")`,
                  "--streamer-avatar": `url("${c.avatar || ""}")`,
                }}
              >
                <div className="streamer-creator-cover">
                  <div className="streamer-creator-cover-img" aria-hidden="true" />
                  <div className="streamer-avatar streamer-avatar-photo" aria-label={c.name}>
                    <span>{(c.name || "?")[0]}</span>
                  </div>
                  <span className="streamer-tag">{c.badge || c.role}</span>
                </div>
                <div className="streamer-creator-body">
                  <h3>{c.name}</h3>
                  <p className="streamer-creator-schedule">{c.nickname}</p>
                  <p>{c.bio}</p>
                  <p className="streamer-creator-schedule">{c.schedule}</p>
                  <div className="streamer-creator-links">
                    {creatorLinks(c).map((link, li) => (
                      <a
                        key={li}
                        className={`streamer-creator-social ${link.type}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${link.label} ${c.name}`}
                        title={link.label}
                      >
                        {socialIcon(link.type)}
                      </a>
                    ))}
                  </div>
                  <ul>
                    {(c.tags || []).map((tag) => (
                      <li key={tag} className="streamer-pill">{tag}</li>
                    ))}
                  </ul>
                  <a
                    className="streamer-mini-action"
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka Profile
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ═══ SHOWCASE GALLERY ═══ */}
        {contentCards.length > 0 && (
          <section className="streamer-section" id="streamer-documentation-showcase">
            <div className="streamer-section-header with-action">
              <div className="streamer-header-copy">
                <div className="streamer-kicker">{hub.galleryKicker || "Event Documentation"}</div>
                <h2>{hub.galleryTitle || "Featured Operations Gallery"}</h2>
                <p>{hub.galleryIntro || "Showcase horizontal untuk footage operasi, highlight event, POV unit, dan dokumentasi visual PASKUS Gi1."}</p>
              </div>
              <a className="streamer-see-more" href="/streamer/event-documentation">
                {hub.galleryMoreLabel || "See More"}
              </a>
            </div>
            <div
              ref={showcaseRailRef}
              className="streamer-showcase-rail"
              data-streamer-showcase=""
              data-showcase-bound="1"
              aria-label={hub.galleryTitle || "Featured Operations Gallery"}
            >
              {contentCards.map((card, idx) => (
                <article
                  key={idx}
                  className="streamer-showcase-card"
                  data-showcase-index={idx}
                  role="button"
                  tabIndex={0}
                  aria-label={card.title}
                  onClick={() => handleShowcaseClick(idx)}
                  onKeyDown={(e) => e.key === "Enter" && handleShowcaseClick(idx)}
                >
                  <div className="streamer-showcase-media">
                    {card.video ? (
                      <>
                        <img
                          className="streamer-showcase-poster"
                          src={card.poster}
                          alt={card.title}
                          loading="lazy"
                          decoding="async"
                        />
                        <video muted loop playsInline preload="metadata" poster={card.poster}>
                          {card.video && <source src={card.video} type="video/webm" />}
                          {card.fallback && <source src={card.fallback} type="video/mp4" />}
                        </video>
                      </>
                    ) : (
                      <img src={card.poster} alt={card.title} loading="lazy" decoding="async" />
                    )}
                  </div>
                  <div className="streamer-showcase-copy">
                    <span className="streamer-showcase-index">{String(idx + 1).padStart(2, "0")}</span>
                    <div className="streamer-showcase-meta">
                      <span>{card.type}</span>
                      <span>{card.status}</span>
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.uploader} / {card.unit} / {card.status}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ═══ ARCHIVE ═══ */}
        {contentCards.length > 0 && (
          <section className="streamer-section" id="streamer-archive">
            <div className="streamer-section-header">
              <div className="streamer-kicker">{hub.archiveKicker || "Event Documentation"}</div>
              <h2>{hub.archiveTitle || "Dokumentasi Event PASKUS"}</h2>
            </div>
            <div className="streamer-content-grid">
              {contentCards.map((card, idx) => (
                <article key={idx} className="streamer-content-card">
                  <div className="streamer-content-thumb">
                    {card.video ? (
                      <video muted loop playsInline preload="metadata" poster={card.poster}>
                        {card.video && <source src={card.video} type="video/webm" />}
                        {card.fallback && <source src={card.fallback} type="video/mp4" />}
                      </video>
                    ) : (
                      <img src={card.poster} alt={card.title} loading="lazy" decoding="async" />
                    )}
                    <span className="streamer-play-pill">{card.type}</span>
                  </div>
                  <div className="streamer-content-body">
                    <div className="streamer-uploader">
                      <div className="streamer-uploader-avatar">{uploaderInitials(card.uploader)}</div>
                      <p>{card.uploader}</p>
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.unit} / {card.status}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StreamersFeature;
