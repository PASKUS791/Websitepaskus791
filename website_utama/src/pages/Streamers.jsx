import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Play, ShieldAlert, RefreshCw, Radio } from "lucide-react";

const Streamers = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/streamer-content.php?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data streamer.");
        }
        return res.json();
      })
      .then((payload) => {
        const data = payload?.data || {};
        const profiles = Array.isArray(data.profiles)
          ? data.profiles.filter((p) => p?.active !== false)
          : [];
        const hubCreators = Array.isArray(data.hub?.creators)
          ? data.hub.creators.filter((c) => c?.active !== false)
          : [];

        // Match profiles with hub details
        const combined = profiles.map((p) => {
          const match = hubCreators.find(
            (c) =>
              c.name?.toLowerCase().trim() === p.callSign?.toLowerCase().trim() ||
              (p.subdomain && c.href?.includes(p.subdomain))
          ) || {};
          return {
            slug: p.slug || p.callSign?.toLowerCase(),
            callSign: p.callSign || match.name || "Streamer",
            displayName: p.displayName || match.name || p.callSign,
            avatar: p.media?.avatar || p.avatar || match.avatar || "",
            subdomain: p.subdomain || "",
            href: match.href || "",
            body: match.focus || p.tagline || "TikTok / YouTube / Highlight",
          };
        });

        if (combined.length > 0) {
          setCreators(combined);
        } else {
          // Fallback to hub creators directly if profiles are empty
          const fallback = hubCreators.map((c) => ({
            slug: c.slug || c.name?.toLowerCase(),
            callSign: c.name || "Streamer",
            displayName: c.name,
            avatar: c.avatar || "",
            subdomain: "",
            href: c.href || "",
            body: c.focus || "TikTok / YouTube / Highlight",
          }));
          setCreators(fallback);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getProfileUrl = (creator) => {
    if (creator.subdomain) {
      return `https://${creator.subdomain}.so791.com`;
    }
    return `/streamer/${creator.slug}`;
  };

  return (
    <>
      <Helmet>
        <title>PASKUS791 Streamers | Creator Hub Resmi</title>
        <meta
          name="description"
          content="Direktori resmi streamer dan content creator PASKUS791. Temukan highlight operasi militer, POV taktis, dan video game BRM5."
        />
      </Helmet>

      {/* Page background */}
      <div className="page-bg fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#030504] via-[#050806] to-[#020302]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212,175,55,0.2) 0%, transparent 40%),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 30px 30px, 30px 30px",
          }}
        />
      </div>

      <main className="relative z-10 max-w-lg mx-auto px-6 pt-28 pb-20 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-black/60 backdrop-blur-md text-[#d4af37] text-[10px] tracking-widest font-bold uppercase mb-4 heading-font">
              <Radio size={12} className="animate-pulse" />
              Official Creator Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black heading-font text-white uppercase tracking-wider mb-3 leading-none">
              PASKUS Streamers
            </h1>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
              Pilih Callsign content creator PASKUS791 untuk melihat linktree sosial media, highlight operasi, serta video taktis.
            </p>
          </header>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <RefreshCw size={36} className="animate-spin text-[#d4af37] mb-4" />
              <p className="heading-font text-[10px] tracking-widest uppercase">Loading Creators...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-950/20 border border-red-800/40 rounded-2xl p-6 text-center max-w-sm mx-auto">
              <ShieldAlert size={40} className="text-red-500 mx-auto mb-3" />
              <h3 className="heading-font text-sm text-white mb-1 uppercase">Gagal Memuat</h3>
              <p className="text-gray-400 text-[11px] mb-4 leading-relaxed">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-red-900/40 border border-red-700/60 rounded-full text-[10px] font-bold text-white hover:bg-red-800 transition heading-font"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Creator List */}
          {creators.length > 0 && (
            <div className="space-y-4">
              {creators.map((c) => {
                const isExternal = c.subdomain;
                const url = getProfileUrl(c);

                return isExternal ? (
                  <a
                    key={c.slug}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 border border-white/10 rounded-2xl bg-black/60 hover:bg-white/[0.04] transition hover:border-[#d4af37]/40 shadow-lg group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-black heading-font text-base overflow-hidden shrink-0">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.callSign} className="w-full h-full object-cover" />
                      ) : (
                        c.callSign?.slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-bold text-white heading-font uppercase tracking-wide group-hover:text-[#d4af37] transition">
                        {c.displayName}
                      </h2>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">{c.body}</p>
                    </div>
                    <Play size={16} className="text-[#d4af37] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                ) : (
                  <Link
                    key={c.slug}
                    to={url}
                    className="flex items-center gap-4 p-4 border border-white/10 rounded-2xl bg-black/60 hover:bg-white/[0.04] transition hover:border-[#d4af37]/40 shadow-lg group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-black heading-font text-base overflow-hidden shrink-0">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.callSign} className="w-full h-full object-cover" />
                      ) : (
                        c.callSign?.slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-bold text-white heading-font uppercase tracking-wide group-hover:text-[#d4af37] transition">
                        {c.displayName}
                      </h2>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">{c.body}</p>
                    </div>
                    <Play size={16} className="text-[#d4af37] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-6 border-t border-white/5">
          <div className="flex justify-center gap-4 text-[9px] font-bold tracking-wider uppercase text-gray-400">
            <a href="https://discord.gg/aaBR9ruFva" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37]">
              Discord PASKUS
            </a>
            <span>·</span>
            <Link to="/about" className="hover:text-[#d4af37]">
              PASKUS Family
            </Link>
          </div>
          <p className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase mt-4 heading-font">
            Silere Impetum
          </p>
        </footer>
      </main>
    </>
  );
};

export default Streamers;
