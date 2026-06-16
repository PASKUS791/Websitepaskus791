import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router";
import { Play, ArrowLeft, RefreshCw, AlertCircle, Share2 } from "lucide-react";

const PASKUS_DISCORD_URL = "https://discord.gg/aaBR9ruFva";

const LOCAL_PROFILES = {
  gi1: {
    slug: "gi1",
    callSign: "Gi1",
    displayName: "Gi1 Gaming",
    role: "Streamer Resimen PASKUS791",
    handle: "@gi1_gaming",
    tagline: "Konten BRM5 roleplay, highlight operasi, dan dokumentasi PASKUS Gi1 dalam satu komando visual.",
    theme: "#d4af37",
    media: {
      avatar: "/assets/images/paskus.webp", // fallback
      pageBackground: "/assets/images/about-us-bg-v1.webp",
      profileBackground: "/assets/images/about-us-bg-v1.webp",
      highlightPoster: "/assets/images/paskus-streamer-highlight-poster-v1.jpg",
      highlightWebm: "/assets/videos/paskus-streamer-highlight-v1.webm",
      highlightMp4: "/assets/videos/paskus-streamer-highlight-v1.mp4",
      avatarPhoto: false,
    },
    links: [
      { type: "tiktok", label: "TikTok", handle: "@gi1_gaming", url: "https://www.tiktok.com/@gi1_gaming?_r=1&_t=ZS-96xVVdUmuIL" },
      { type: "youtube", label: "YouTube", handle: "Gi1 Gaming", url: "https://youtube.com/@gi1_gr?si=bBRRFye5kfc5KHRI" },
      { type: "discord", label: "Discord PASKUS", handle: "Community Hub", url: PASKUS_DISCORD_URL },
    ],
  },
  "4hn": {
    slug: "4hn",
    callSign: "4hn",
    displayName: "4hn",
    role: "Content Creator PASKUS791",
    handle: "@soldier_791",
    tagline: "Dokumentasi lapangan, momen event, dan karya komunitas PASKUS791 dari sudut pandang kreator.",
    theme: "#8fbf64",
    media: {
      avatar: "/assets/images/paskus.webp",
      pageBackground: "/assets/images/about-us-bg-v1.webp",
      profileBackground: "/assets/images/about-us-bg-v1.webp",
      highlightPoster: "/assets/images/paskus-streamer-highlight-poster-v1.jpg",
      highlightMp4: "/assets/videos/paskus-streamer-highlight-v1.mp4",
      avatarPhoto: false,
    },
    links: [
      { type: "tiktok", label: "TikTok", handle: "@soldier_791", url: "https://www.tiktok.com/@soldier_791" },
      { type: "youtube", label: "YouTube", handle: "4hn Creator", url: "https://www.youtube.com/@MrFarhanIsHere26" },
      { type: "discord", label: "Discord PASKUS", handle: "Community Hub", url: PASKUS_DISCORD_URL },
    ],
  },
  aang: {
    slug: "aang",
    callSign: "Aang",
    displayName: "Aang",
    role: "Special Ops / Combat Creator",
    handle: "@.namakuaang",
    tagline: "Special Ops PASKUS yang bergerak senyap, membaca ruang dengan dingin, dan mengubah momen operasi menjadi highlight yang bersih, tajam, dan berkelas.",
    theme: "#b9c7d6",
    media: {
      avatar: "/assets/images/paskus.webp",
      pageBackground: "/assets/images/about-us-bg-v1.webp",
      profileBackground: "/assets/images/about-us-bg-v1.webp",
      highlightPoster: "/assets/images/paskus-streamer-highlight-poster-v1.jpg",
      highlightMp4: "/assets/videos/paskus-streamer-highlight-v1.mp4",
      avatarPhoto: false,
    },
    links: [
      { type: "tiktok", label: "TikTok", handle: "@.namakuaang", url: "https://www.tiktok.com/@.namakuaang?_r=1&_t=ZS-970xG9tEyRs" },
      { type: "discord", label: "Discord PASKUS", handle: "Special Ops Channel", url: PASKUS_DISCORD_URL },
    ],
  },
};

const StreamerProfile = () => {
  const { creator } = useParams();
  const slug = (creator || "gi1").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Start with local config
    const local = LOCAL_PROFILES[slug] || LOCAL_PROFILES.gi1;
    setProfile(local);
    setLoading(true);

    // Fetch live updates
    fetch("/api/streamer-content.php")
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const profiles = Array.isArray(payload?.data?.profiles) ? payload.data.profiles : [];
        const remoteProfile = profiles.find((p) => p.slug?.toLowerCase().trim() === slug);
        if (remoteProfile) {
          const isInactive = remoteProfile.active === false;
          const links = Array.isArray(remoteProfile.links)
            ? remoteProfile.links.filter((l) => l?.active !== false)
            : [];
          const safeLinks = isInactive
            ? [
                { type: "discord", label: "Discord PASKUS", handle: "Community Hub", url: PASKUS_DISCORD_URL },
                { type: "community", label: "Streamer Hub", handle: "PASKUS karya dan event", url: "/streamers" },
              ]
            : links;

          const mergedMedia = {
            ...(local.media || {}),
            ...(remoteProfile.media || {}),
          };
          if (remoteProfile.avatar) mergedMedia.avatar = remoteProfile.avatar;
          if (remoteProfile.background) mergedMedia.pageBackground = remoteProfile.background;
          if (remoteProfile.profileBackground) mergedMedia.profileBackground = remoteProfile.profileBackground;
          if (remoteProfile.highlight?.poster) mergedMedia.highlightPoster = remoteProfile.highlight.poster;
          if (remoteProfile.highlight?.video) mergedMedia.highlightWebm = remoteProfile.highlight.video;
          if (remoteProfile.highlight?.fallback) mergedMedia.highlightMp4 = remoteProfile.highlight.fallback;

          setProfile({
            slug: remoteProfile.slug || slug,
            callSign: remoteProfile.callSign || local.callSign,
            displayName: remoteProfile.displayName || local.displayName,
            role: isInactive ? "Streamer Page Nonaktif" : remoteProfile.role || local.role,
            handle: remoteProfile.handle || local.handle,
            tagline: isInactive
              ? "Halaman kreator ini sedang dinonaktifkan sementara oleh admin PASKUS."
              : remoteProfile.tagline || local.tagline,
            theme: remoteProfile.theme || local.theme,
            media: mergedMedia,
            links: safeLinks,
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoPauseOrEnded = () => {
    setIsPlaying(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center">
          <AlertCircle size={40} className="text-[#d4af37] mx-auto mb-4" />
          <h2 className="heading-font text-lg mb-2">Creator Tidak Ditemukan</h2>
          <Link to="/streamers" className="text-[#d4af37] text-xs underline font-bold uppercase tracking-wider">
            Kembali ke Hub
          </Link>
        </div>
      </div>
    );
  }

  const media = profile.media || {};
  const accentColor = profile.theme || "#d4af37";

  return (
    <>
      <Helmet>
        <title>{`${profile.callSign} | Streamer PASKUS791`}</title>
        <meta
          name="description"
          content={`${profile.callSign} adalah content creator dan streamer resmi resimen PASKUS791 untuk game BRM5 roleplay.`}
        />
      </Helmet>

      {/* Styled background based on creator accent */}
      <div
        className="page-bg fixed inset-0 z-0 pointer-events-none transition-all duration-500"
        style={{
          backgroundColor: "#050806",
          backgroundImage: `radial-gradient(circle at 50% 0%, ${accentColor}30 0%, transparent 40%),
            linear-gradient(180deg, rgba(0,0,0,0.5), #050806 72%),
            url("${media.pageBackground || "/assets/images/about-us-bg-v1.webp"}")`,
          backgroundPosition: media.pageBackgroundPosition || "center top",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 max-w-md mx-auto px-4 pt-24 pb-16 min-h-screen flex flex-col justify-between">
        <div>
          {/* Top Navbar */}
          <nav className="flex items-center justify-between gap-4 p-2 pl-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-md mb-6 shadow-lg">
            <Link to="/streamers" className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider heading-font">
              <ArrowLeft size={14} />
              <span>PASKUS Hub</span>
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${profile.displayName} - PASKUS Streamer`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link profil berhasil disalin!");
                }
              }}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Bagikan"
            >
              <Share2 size={14} />
            </button>
          </nav>

          {/* Profile Card */}
          <section className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl overflow-hidden mb-6">
            {/* Header / Avatar */}
            <header className="flex flex-col items-center p-6 text-center border-b border-white/5 relative">
              {/* Background gradient overlay based on theme */}
              <div
                className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 10%, ${accentColor} 0%, transparent 80%)`,
                }}
              />

              <div
                className="relative z-10 w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-black heading-font text-2xl overflow-hidden mb-4 shadow-xl shadow-black/60 transition duration-300"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}30, rgba(0,0,0,0.8))`,
                  borderColor: accentColor,
                }}
              >
                {media.avatar ? (
                  <img src={media.avatar} alt={profile.callSign} className="w-full h-full object-cover" />
                ) : (
                  profile.callSign?.slice(0, 2)
                )}
              </div>

              <div
                className="text-[9px] tracking-widest font-black uppercase mb-1 heading-font"
                style={{ color: accentColor }}
              >
                {profile.role}
              </div>
              <h1 className="text-3xl font-black heading-font text-white uppercase tracking-wide leading-none mb-1">
                {profile.callSign}
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">
                {profile.displayName} {profile.handle && `· ${profile.handle}`}
              </p>
              <p className="text-gray-300 text-xs leading-relaxed max-w-xs">{profile.tagline}</p>
            </header>

            {/* Video Highlight Block */}
            {(media.highlightMp4 || media.highlightWebm) && (
              <section className="p-4" aria-label="Highlight Video">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 heading-font mb-2 px-1">
                  <span>Highlight Video</span>
                  <span style={{ color: accentColor }}>SO-791</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group border border-white/5 shadow-inner">
                  <video
                    ref={videoRef}
                    playsInline
                    preload="none"
                    controls={isPlaying}
                    onPause={handleVideoPauseOrEnded}
                    onEnded={handleVideoPauseOrEnded}
                    poster={media.highlightPoster}
                    className="w-full h-full object-cover"
                  >
                    {media.highlightWebm && <source src={media.highlightWebm} type="video/webm" />}
                    {media.highlightMp4 && <source src={media.highlightMp4} type="video/mp4" />}
                  </video>

                  {!isPlaying && (
                    <button
                      onClick={handlePlayVideo}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all duration-300"
                      aria-label="Putar Video Highlight"
                    >
                      <div className="w-14 h-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-2xl transition group-hover:scale-105 group-hover:border-white/30">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </button>
                  )}
                </div>
              </section>
            )}
          </section>

          {/* Social Links Stack */}
          <section className="space-y-3" aria-label="Sosial Media Linktree">
            {profile.links &&
              profile.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-white/10 rounded-2xl bg-black/60 hover:bg-white/[0.04] transition hover:border-white/20 shadow-lg group"
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
                    style={{ color: accentColor }}
                  >
                    {/* Render standard icons based on type */}
                    {link.type === "tiktok" ? (
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M14.7 3v11.15a4.35 4.35 0 1 1-3.38-4.24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.7 5.3c1.1 2.04 2.7 3.23 5.05 3.42" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : link.type === "youtube" ? (
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M21 8.4a3 3 0 0 0-2.1-2.15C17.05 5.75 12 5.75 12 5.75s-5.05 0-6.9.5A3 3 0 0 0 3 8.4a31.18 31.18 0 0 0 0 7.2 3 3 0 0 0 2.1 2.15c1.85.5 6.9.5 6.9.5s5.05 0 6.9-.5A3 3 0 0 0 21 15.6a31.18 31.18 0 0 0 0-7.2Z" stroke="currentColor" strokeWidth="2" />
                        <path d="m10.3 9.35 4.4 2.65-4.4 2.65v-5.3Z" fill="currentColor" />
                      </svg>
                    ) : link.type === "discord" ? (
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M7.3 18.2c-1.25-.36-2.5-.95-3.7-1.76.2-3.55 1.15-6.72 2.85-9.5 1.2-.58 2.35-.98 3.45-1.2l.45.9a12.3 12.3 0 0 1 3.3 0l.45-.9c1.1.22 2.25.62 3.45 1.2 1.7 2.78 2.65 5.95 2.85 9.5a12.85 12.85 0 0 1-3.7 1.76l-.82-1.06c.58-.2 1.13-.47 1.65-.8-3.34 1.55-7.72 1.55-11.06 0 .52.33 1.07.6 1.65.8l-.82 1.06Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                        <path d="M9.2 12.1h.02M14.8 12.1h.02" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M10.5 13.5 13.5 10.5M8.4 15.6l-1.1 1.1a3 3 0 0 1-4.24-4.24l3.18-3.18a3 3 0 0 1 4.24 0M15.6 8.4l1.1-1.1a3 3 0 0 1 4.24 4.24l-3.18 3.18a3 3 0 0 1-4.24 0" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-white heading-font uppercase tracking-wide group-hover:text-white transition">
                      {link.label || link.name || "Tautan Kreator"}
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{link.handle || ""}</p>
                  </div>
                  <span className="text-gray-500 text-lg group-hover:translate-x-1 transition-transform">›</span>
                </a>
              ))}
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-6 border-t border-white/5">
          <div className="flex justify-center gap-4 text-[9px] font-bold tracking-wider uppercase text-gray-400">
            <a href={PASKUS_DISCORD_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Discord PASKUS
            </a>
            <span>·</span>
            <Link to="/streamers" className="hover:text-white">
              Creator Hub
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:text-white">
              PASKUS Family
            </Link>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase mt-4 heading-font" style={{ color: accentColor }}>
            Silere Impetum
          </p>
          <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-wider mt-1.5">
            PASKUS791 / So-791 / BRM5 Roleplay Indonesia
          </p>
        </footer>
      </main>
    </>
  );
};

export default StreamerProfile;
