/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Navbar Shell
 * Purpose: Bottom nav dinamis dengan auto-hide saat scroll untuk semua route staff recruiter.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import paskusLogo from "../assets/paskus.webp";
import { useAuth } from "../lib/auth";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    end: true,
    icon: "dashboard",
  },
  {
    label: "Laporan",
    to: "/dashboard/laporan",
    icon: "laporan",
  },
  {
    label: "Petugas",
    to: "/dashboard/petugas",
    icon: "petugas",
  },
  {
    label: "SOP",
    to: "/dashboard/sop",
    icon: "sop",
  },
];

function resolvePageTitle(pathname) {
  if (pathname === "/dashboard") return "SO-791 Data Center";
  if (pathname === "/dashboard/jadwal") return "Jadwal";
  if (pathname === "/dashboard/laporan") return "Hasil Laporan";
  if (pathname.startsWith("/dashboard/pelatihan/")) return "Dashboard Pelatih";
  if (pathname.startsWith("/dashboard/laporan-perekrutan/")) return "Laporan Perekrutan";
  if (pathname === "/dashboard/petugas") return "Tambah Petugas";
  if (pathname === "/dashboard/sop") return "Standard Operating Procedure";
  return "SO-791 Data Center";
}

function NavIcon({ name, active }) {
  const baseClass = "transition-all duration-300";
  const size = "h-[22px] w-[22px]";
  const stroke = active ? "stroke-[2]" : "stroke-[1.5]";
  const cls = `${size} ${baseClass} fill-none stroke-current ${stroke}`;

  if (name === "jadwal") {
    return (
      <svg viewBox="0 0 20 20" className={cls}>
        <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
        <path d="M3.5 8h13" />
        <path d="M7 3v3" strokeLinecap="round" />
        <path d="M13 3v3" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "laporan") {
    return (
      <svg viewBox="0 0 20 20" className={cls}>
        <path d="M5 3.5h7l3 3v10H5z" />
        <path d="M12 3.5V7h3" />
        <path d="M7.5 10h5" strokeLinecap="round" />
        <path d="M7.5 12.8h5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "sop") {
    return (
      <svg viewBox="0 0 20 20" className={cls}>
        <rect x="4.5" y="3.5" width="11" height="13" rx="1" />
        <path d="M7 7.5h6" strokeLinecap="round" />
        <path d="M7 10.5h6" strokeLinecap="round" />
        <path d="M7 13.5h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "petugas") {
    return (
      <svg viewBox="0 0 20 20" className={cls}>
        <circle cx="10" cy="7" r="2.5" />
        <path d="M4.5 16c.8-2.3 2.8-3.5 5.5-3.5s4.7 1.2 5.5 3.5" strokeLinecap="round" />
        <path d="M14.5 4.5v4" strokeLinecap="round" />
        <path d="M12.5 6.5h4" strokeLinecap="round" />
      </svg>
    );
  }
  // dashboard / home default
  return (
    <svg viewBox="0 0 20 20" className={cls}>
      <path d="M3.5 9.5 10 4l6.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 8.5v7h9v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 15.5v-4h3v4" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [navVisible, setNavVisible] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const lastScrollY = useRef(0);
  const scrollLock = useRef(false);
  const mainRef = useRef(null);

  // Clock
  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Auto-hide bottom nav on scroll
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const onScroll = () => {
      if (scrollLock.current) return;
      const currentY = el.scrollTop;
      const delta = currentY - lastScrollY.current;

      if (Math.abs(delta) < 6) return; // dead zone

      if (delta > 0 && currentY > 60) {
        // scrolling down → hide nav
        setNavVisible(false);
      } else {
        // scrolling up → show nav
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Always show nav when route changes
  useEffect(() => {
    setNavVisible(true);
    scrollLock.current = true;
    const t = setTimeout(() => { scrollLock.current = false; }, 400);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const pageTitle = useMemo(() => resolvePageTitle(location.pathname), [location.pathname]);
  const canGoBack = location.pathname !== "/dashboard";

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#090b0c] font-sans text-stone-100">
      {/* ─── Top Header Bar ─── */}
      <header
        style={{
          background: "linear-gradient(180deg,rgba(10,12,14,0.98) 0%,rgba(10,12,14,0.92) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
        className="shrink-0 z-40 px-4 py-3 sm:px-6"
      >
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            {canGoBack ? (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="shrink-0 flex items-center justify-center h-9 w-9 rounded-xl border border-white/8 bg-white/[0.04] text-stone-300 transition hover:bg-white/[0.08] hover:text-stone-100 active:scale-95"
                aria-label="Kembali"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                  <path d="M12.5 5.5 7.5 10l5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <div className="shrink-0 h-8 w-8 overflow-hidden">
                <img src={paskusLogo} alt="Paskus 791" className="h-full w-full object-contain" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.28em] text-emerald-400/70 leading-none mb-0.5">
                SO-791
              </p>
              <h1 className="text-sm font-bold truncate leading-tight">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right: time + user avatar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Clock chip */}
            <div className="hidden sm:block text-right">
              <p className="font-mono text-sm font-semibold leading-none text-stone-100">
                {time.toLocaleTimeString("id-ID")}
              </p>
              <p className="text-[9px] text-stone-500 mt-0.5 uppercase tracking-[0.18em]">
                WIB
              </p>
            </div>

            {/* User avatar button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.04] pl-2 pr-3 py-1.5 transition hover:bg-white/[0.08] active:scale-95"
              >
                <div
                  className="h-7 w-7 rounded-xl flex items-center justify-center text-xs font-black"
                  style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#000" }}
                >
                  {(user?.label || "P").charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none text-stone-100">
                    {user?.label || "Petugas"}
                  </p>
                  <p className="text-[9px] text-emerald-400/80 mt-0.5 leading-none">
                    {user?.unit || "PASKUS 791"}
                  </p>
                </div>
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2] text-stone-400">
                  <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div
                    className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                    style={{ background: "rgba(17,19,21,0.98)", backdropFilter: "blur(24px)" }}
                  >
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-xs font-bold text-stone-100">{user?.label || "Petugas"}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{user?.unit || "PASKUS 791"}</p>
                    </div>
                    {/* Clock inside dropdown on mobile */}
                    <div className="sm:hidden px-4 py-2.5 border-b border-white/8">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500">Waktu Lokal</p>
                      <p className="font-mono text-sm font-semibold text-stone-100 mt-0.5">
                        {time.toLocaleTimeString("id-ID")} <span className="text-[10px] text-stone-500">WIB</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition text-left"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
                        <path d="M12.5 10H4.5" strokeLinecap="round" />
                        <path d="M9 6.5 12.5 10 9 13.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 4.5H15.5V15.5H8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main scrollable content ─── */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: "88px" }} // space for bottom nav
      >
        <section className="min-w-0 p-4 sm:p-6 max-w-7xl mx-auto">
          <Outlet />
        </section>
      </main>

      {/* ─── Bottom Navigation ─── */}
      <nav
        aria-label="Bottom navigation"
        style={{
          transform: navVisible ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          background: "rgba(13,15,17,0.96)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.5), 0 -1px 0 rgba(255,255,255,0.04)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-2 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="group flex flex-col items-center gap-1 flex-1"
            >
              {({ isActive }) => (
                <>
                  {/* Icon pill */}
                  <span
                    className="relative flex items-center justify-center w-12 h-10 rounded-2xl transition-all duration-300"
                    style={
                      isActive
                        ? {
                            background: "linear-gradient(135deg, rgba(74,222,128,0.18), rgba(34,197,94,0.10))",
                            boxShadow: "0 0 20px rgba(74,222,128,0.2)",
                          }
                        : { background: "transparent" }
                    }
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <span
                        className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-full"
                        style={{ background: "linear-gradient(90deg,#4ade80,#22c55e)" }}
                      />
                    )}
                    <span
                      className="transition-all duration-300"
                      style={{ color: isActive ? "#4ade80" : "rgba(161,161,170,0.8)" }}
                    >
                      <NavIcon name={item.icon} active={isActive} />
                    </span>
                  </span>

                  {/* Label */}
                  <span
                    className="text-[10px] font-semibold tracking-wide transition-all duration-300 leading-none pb-0.5"
                    style={{
                      color: isActive ? "#4ade80" : "rgba(113,113,122,0.8)",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
