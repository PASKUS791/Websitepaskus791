import React, { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RankInsigniaLive from "./components/RankInsigniaLive";

const CATEGORY_ACCENT = {
  "PERWIRA TINGGI": { rgb: "239, 191, 4", hex: "#efbf04" },
  "PERWIRA MENENGAH": { rgb: "239, 191, 4", hex: "#efbf04" },
  "PERWIRA PERTAMA": { rgb: "157, 193, 131", hex: "#9dc183" },
  "BINTARA TINGGI": { rgb: "160, 168, 170", hex: "#a0a8aa" },
  "BINTARA MUDA": { rgb: "160, 168, 170", hex: "#a0a8aa" },
  "TAMTAMA SENIOR": { rgb: "220, 56, 56", hex: "#dc3838" },
  "TAMTAMA JUNIOR": { rgb: "220, 56, 56", hex: "#dc3838" },
  SIPIL: { rgb: "122, 122, 122", hex: "#7a7a7a" },
};

const RANK_META = {
  "MAYOR JENDRAL": { insignia: "stars", count: 2, accent: "#efbf04" },
  "BRIGADIR JENDRAL": { insignia: "stars", count: 1, accent: "#efbf04" },
  KOLONEL: { insignia: "melati", count: 3, accent: "#efbf04" },
  "LETNAN KOLONEL": { insignia: "melati", count: 2, accent: "#9dc183" },
  MAYOR: { insignia: "melati", count: 1, accent: "#efbf04" },
  KAPTEN: { insignia: "bars", count: 3, accent: "#9dc183" },
  "LETNAN SATU": { insignia: "bars", count: 2, accent: "#9dc183" },
  "LETNAN DUA": { insignia: "bars", count: 1, accent: "#9dc183" },
  "SERSAN MAYOR": { insignia: "chevrons", count: 4, accent: "#a0a8aa", lower: true },
  "SERSAN KEPALA": { insignia: "chevrons", count: 3, accent: "#a0a8aa", lower: true },
  "SERSAN SATU": { insignia: "chevrons", count: 2, accent: "#a0a8aa", lower: true },
  "SERSAN DUA": { insignia: "chevrons", count: 1, accent: "#a0a8aa", lower: true },
  "KOPRAL KEPALA": { insignia: "chevrons", count: 3, accent: "#dc3838", lower: true },
  "KOPRAL SATU": { insignia: "chevrons", count: 2, accent: "#dc3838", lower: true },
  "KOPRAL DUA": { insignia: "chevrons", count: 1, accent: "#dc3838", lower: true },
  "PRAJURIT KEPALA": { insignia: "bars", count: 3, accent: "#dc3838", lower: true },
  "PRAJURIT SATU": { insignia: "bars", count: 2, accent: "#dc3838", lower: true },
  "PRAJURIT DUA": { insignia: "bars", count: 1, accent: "#dc3838", lower: true },
  PRADA: { insignia: "bars", count: 1, accent: "#dc3838", lower: true, scroll: true },
  SIPIL: { insignia: "none", count: 0, accent: "#7a7a7a", lower: true },
};

function slugify(s) {
  return (s || "").toLowerCase().replace(/\s+/g, "-");
}

function memberColumns(count) {
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  return 3;
}

function rankTarget(cols) {
  if (cols <= 1) return 384;
  if (cols <= 2) return 620;
  return 856;
}

function hexToRgbStr(hex) {
  if (!hex || !hex.startsWith("#")) return null;
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

const StrukturalFeature = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = `/api/structure.php?t=${Date.now()}`;

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP");
        return res.text();
      })
      .then((text) => {
        const t = text.trim();
        if (!t.startsWith("{") && !t.startsWith("[")) throw new Error("Not JSON");
        return JSON.parse(t);
      })
      .then((payload) => {
        if (payload?.ok) setData(payload);
      })
      .catch(() => {
        fetch("/api/structure.json")
          .then((r) => {
            if (!r.ok) throw new Error("HTTP JSON");
            return r.text();
          })
          .then((text) => {
            const t = text.trim();
            if (!t.startsWith("{") && !t.startsWith("[")) throw new Error("Not JSON");
            return JSON.parse(t);
          })
          .then((payload) => {
            if (payload?.ok) setData(payload);
          })
          .catch(() => {});
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!data?.categories) return { cats: 0, ranks: 0, members: 0 };
    let ranks = 0, members = 0;
    for (const cat of data.categories) {
      for (const rank of cat.ranks) {
        ranks++;
        members += rank.member_count || (rank.members?.length ?? 0);
      }
    }
    return { cats: data.categories.length, ranks, members };
  }, [data]);

  return (
    <div className="paskus-structure-page" data-structure-language="id">
      <Navbar />

      <main data-structure-content="">
        {/* ═══ HERO ═══ */}
        <section className="structure-hero">
          <div className="structure-hero-inner">
            <div>
              <div className="structure-kicker">Struktural So-791 / Chain Of Command</div>
              <h1>Struktural <span>Komando Dan Pangkat</span></h1>
              <p className="structure-lead">
                {data?.overview || "Struktur komando, jenjang pangkat, dan daftar personel aktif SO-791."}
              </p>
              {!loading && data && (
                <div className="structure-stats" aria-label="Ringkasan struktural">
                  <div className="structure-stat"><strong>{stats.cats}</strong><span>Kategori</span></div>
                  <div className="structure-stat"><strong>{stats.ranks}</strong><span>Pangkat</span></div>
                  <div className="structure-stat"><strong>{stats.members.toLocaleString()}</strong><span>Personel</span></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {loading && (
          <section className="structure-section" style={{ textAlign: "center", padding: "80px 0", color: "#9dc183" }}>
            <div className="structure-kicker">Transmitting secure data...</div>
          </section>
        )}

        {/* ═══ TREE ═══ */}
        {data?.categories && (
          <section className="structure-section" id="structure-data">
            {/* Category Nav */}
            <div className="structure-category-nav">
              {data.categories.map((cat) => (
                <a key={cat.category} href={`#${slugify(cat.category)}`}>
                  {cat.category}
                </a>
              ))}
            </div>

            <div className="structure-tree" aria-label="Pohon struktural So-791">
              <div className="structure-tree-root">Command Root</div>

              {data.categories.map((cat) => {
                const catSlug = slugify(cat.category);
                const accent = CATEGORY_ACCENT[cat.category] || { rgb: "160,168,170", hex: "#a0a8aa" };
                const catRankCount = cat.ranks.length;
                const catMemberCount = cat.ranks.reduce(
                  (sum, r) => sum + (r.member_count || r.members?.length || 0),
                  0
                );

                return (
                  <section
                    key={cat.category}
                    className={`structure-category structure-category--${catSlug}`}
                    id={catSlug}
                    data-structure-category=""
                    style={{
                      "--structure-accent-rgb": accent.rgb,
                      "--structure-accent": accent.hex,
                    }}
                  >
                    <div className="structure-category-header">
                      <h2>{cat.category}</h2>
                      <span>{catRankCount} pangkat / {catMemberCount} personel</span>
                    </div>

                    <div className="structure-rank-grid">
                      {cat.ranks.map((rank) => {
                        const meta = RANK_META[rank.name] || RANK_META.SIPIL;
                        const members = rank.members || [];
                        const count = rank.member_count || members.length;
                        const cols = rank.count_only ? 1 : memberColumns(count);
                        const target = rankTarget(cols);
                        const isScroll = meta.scroll || count > 100;
                        const rankSlug = slugify(rank.name);
                        const rankAccent = rank.color || meta.accent || accent.hex;
                        const rankAccentRgb = hexToRgbStr(rankAccent) || accent.rgb;

                        const cardClasses = [
                          "structure-rank-card",
                          `structure-rank-card--${rankSlug}`,
                          `structure-rank-card--category-${catSlug}`,
                          meta.lower ? "structure-rank-card--lower" : "",
                          isScroll ? "structure-rank-card--member-scroll" : "",
                        ].filter(Boolean).join(" ");

                        return (
                          <article
                            key={rank.name}
                            className={cardClasses}
                            data-structure-card=""
                            style={{
                              "--rank-accent-rgb": rankAccentRgb,
                              "--rank-accent": rankAccent,
                              "--structure-member-columns": isScroll ? 4 : cols,
                              "--structure-rank-target": `${isScroll ? 760 : target}px`,
                            }}
                          >
                            <div className="structure-rank-head">
                              <div className="structure-insignia">
                                <RankInsigniaLive name={meta.insignia} count={meta.count} />
                              </div>
                              <div className="structure-rank-main">
                                <h3>{rank.name === "PRAJURIT DUA" ? "PRADA" : rank.name}</h3>
                                <div className="structure-rank-role">{rank.role}</div>
                              </div>
                            </div>

                            {rank.count_only ? (
                              <div className="structure-member-branch" aria-label={`${count} personel ${rank.name}`}>
                                <div className="structure-member-grid structure-member-grid--balanced">
                                  <article className="structure-member-card">
                                    {count} personel terdaftar
                                  </article>
                                </div>
                              </div>
                            ) : members.length > 0 && (
                              <div className="structure-member-branch" aria-label={`Personel ${rank.name}`}>
                                <div className={`structure-member-grid ${isScroll ? "structure-member-grid--scroll" : "structure-member-grid--balanced"}`}>
                                  {members.map((m, mi) => (
                                    <article key={mi} className="structure-member-card">{m}</article>
                                  ))}
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StrukturalFeature;
