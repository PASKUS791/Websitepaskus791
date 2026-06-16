import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import RankInsignia from "../components/RankInsignia";
import { Users, ShieldAlert, RefreshCw, ChevronDown, Award } from "lucide-react";

const Struktural = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    fetch("/api/structure.php")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal memuat data struktural.");
        }
        return res.json();
      })
      .then((payload) => {
        if (payload && payload.ok) {
          setData(payload);
          // Auto-open first 3 categories
          const initialOpen = {};
          if (payload.categories) {
            payload.categories.slice(0, 3).forEach((cat) => {
              initialOpen[cat.category] = true;
            });
          }
          setOpenCategories(initialOpen);
        } else {
          throw new Error(payload.message || "Gagal memuat data struktural.");
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleCategory = (catName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  return (
    <>
      <Helmet>
        <title>Struktural Resmi PASKUS Gi1 | So-791 Komando</title>
        <meta
          name="description"
          content="Struktur komando resmi, jenjang pangkat, jajaran perwira, bintara, tamtama, dan seluruh personel aktif PASKUS Gi1 So-791."
        />
        <meta
          name="keywords"
          content="struktural PASKUS, pangkat militer PASKUS, perwira PASKUS, So-791, PASKUS Gi1"
        />
      </Helmet>

      <div className="page-bg fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#030504] via-[#060a07] to-[#040705]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(180deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] tracking-widest font-bold uppercase mb-4 heading-font">
            <Award size={12} className="text-[#EFBF04]" />
            Dokumen Resmi Komando
          </div>
          <h1 className="text-4xl md:text-6xl font-black heading-font text-white uppercase tracking-wider mb-4">
            Struktur <span className="text-[#EFBF04]">Organisasi</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-xs md:text-sm leading-relaxed">
            Daftar hierarki militer, pembagian jenjang pangkat, jajaran perwira tinggi, perwira menengah, perwira pertama, bintara, tamtama, serta dinas aktif di lingkungan resimen PASKUS Gi1 So-791.
          </p>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw size={40} className="animate-spin text-[#EFBF04] mb-4" />
            <p className="heading-font text-xs tracking-widest">TRANSMITTING SECURE DATA...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-950/20 border border-red-800/40 rounded-xl p-8 text-center max-w-lg mx-auto">
            <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="heading-font text-lg text-white mb-2 uppercase">Gagal Mengakses Database</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-red-900/40 border border-red-700/60 rounded-full text-xs font-bold text-white hover:bg-red-800 transition heading-font"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}

        {data && data.categories && (
          <div className="space-y-6">
            {data.categories.map((category) => {
              const isOpen = !!openCategories[category.category];
              return (
                <div
                  key={category.category}
                  className="border border-[#EFBF04]/20 rounded-2xl bg-[#080c0a]/80 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300 hover:border-[#EFBF04]/30"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EFBF04]/20 to-[#EFBF04]/5 border border-[#EFBF04]/30 flex items-center justify-center text-[#EFBF04] font-black heading-font text-sm">
                        {category.ranks.length}
                      </div>
                      <div>
                        <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider heading-font">
                          {category.category}
                        </h2>
                        {category.label && (
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                            {category.label}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#EFBF04]" : ""
                      }`}
                    />
                  </button>

                  {/* Category Content */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-[5000px] border-t border-[#EFBF04]/10" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.ranks.map((rank) => (
                        <div
                          key={rank.name}
                          className="border border-white/5 rounded-xl bg-white/[0.02] p-5 flex flex-col items-center text-center transition hover:bg-white/[0.04]"
                        >
                          {/* Insignia */}
                          <div className="h-16 flex items-center justify-center mb-4">
                            <RankInsignia rank={rank.name} />
                          </div>

                          <h3 className="heading-font text-xs md:text-sm font-bold text-white uppercase tracking-wide">
                            {rank.name}
                          </h3>
                          {rank.role && (
                            <p className="text-[9px] text-[#EFBF04] tracking-widest font-black uppercase mt-1">
                              {rank.role}
                            </p>
                          )}

                          {/* Member List */}
                          <div className="w-full mt-4 pt-4 border-t border-white/5">
                            {rank.count_only || !rank.members || rank.members.length === 0 ? (
                              <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] tracking-wider font-semibold">
                                <Users size={12} />
                                {rank.member_count} PERSONEL AKTIF
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {rank.members.map((member, mIdx) => (
                                  <div
                                    key={mIdx}
                                    className="text-xs font-mono text-gray-300 bg-white/[0.02] py-1 px-3 rounded border border-white/5 inline-block mx-1"
                                  >
                                    {member}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center text-gray-500 text-[10px] tracking-widest uppercase">
          PASKUS791 SECURITY DOCTRINE · DPDM SO-791
        </div>
      </div>
    </>
  );
};

export default Struktural;
