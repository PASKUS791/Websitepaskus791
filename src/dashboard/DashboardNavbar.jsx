/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Navbar Shell
 * Purpose: Sidebar shell untuk semua route staff recruiter.
 */

import { useEffect, useMemo, useState } from "react";
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
    label: "Hasil Laporan",
    to: "/dashboard/laporan",
    icon: "laporan",
  },
  {
    label: "Butuh Tindakan",
    to: "/dashboard/tindakan",
    icon: "tindakan",
  },
  {
    label: "Tambah Petugas",
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
  if (pathname === "/dashboard") {
    return "SO-791 Data Center";
  }

  if (pathname === "/dashboard/jadwal") {
    return "Jadwal";
  }

  if (pathname === "/dashboard/laporan") {
    return "Hasil Laporan";
  }

  if (pathname.startsWith("/dashboard/pelatihan/")) {
    return "Dashboard Pelatih";
  }

  if (pathname.startsWith("/dashboard/laporan-perekrutan/")) {
    return "Laporan Perekrutan";
  }

  if (pathname === "/dashboard/tindakan") {
    return "Butuh Tindakan";
  }

  if (pathname === "/dashboard/petugas") {
    return "Tambah Petugas";
  }

  if (pathname === "/dashboard/sop") {
    return "Standard Operating Procedure";
  }

  return "SO-791 Data Center";
}

function DashboardNavIcon({ name }) {
  const className = "h-5 w-5 fill-none stroke-current stroke-[1.7]";

  if (name === "jadwal") {
    return (
      <svg viewBox="0 0 20 20" className={className}>
        <path d="M4.5 5.5h11v10h-11z" />
        <path d="M4.5 8h11" />
        <path d="M7 4v3" />
        <path d="M13 4v3" />
      </svg>
    );
  }

  if (name === "laporan") {
    return (
      <svg viewBox="0 0 20 20" className={className}>
        <path d="M5 3.5h7l3 3v10H5z" />
        <path d="M12 3.5V7h3" />
        <path d="M7.5 10h5" />
        <path d="M7.5 12.8h5" />
      </svg>
    );
  }

  if (name === "tindakan") {
    return (
      <svg viewBox="0 0 20 20" className={className}>
        <path d="M10 3.5 16 6v4c0 3.5-2.2 5.8-6 7-3.8-1.2-6-3.5-6-7V6l6-2.5z" />
        <path d="m7.8 10.2 1.5 1.5 3-3.3" />
      </svg>
    );
  }

  if (name === "sop") {
    return (
      <svg viewBox="0 0 20 20" className={className}>
        <path d="M5 4.5h10v11H5z" />
        <path d="M7.5 8h5" />
        <path d="M7.5 11h5" />
        <path d="M7.5 14h3.5" />
      </svg>
    );
  }

  if (name === "petugas") {
    return (
      <svg viewBox="0 0 20 20" className={className}>
        <path d="M10 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        <path d="M4.5 15c.8-2.3 2.8-3.5 5.5-3.5s4.7 1.2 5.5 3.5" />
        <path d="M15.5 5.5v4" />
        <path d="M13.5 7.5h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className={className}>
      <path d="M4 11.5 10 5l6 6.5" />
      <path d="M5.5 10.3v5.2h9v-5.2" />
    </svg>
  );
}

export default function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const pageTitle = useMemo(() => resolvePageTitle(location.pathname), [location.pathname]);
  const canGoBack = location.pathname !== "/dashboard";

  const handleSignOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090b0c] font-sans text-stone-100">
      <div className="flex min-h-screen w-full overflow-x-hidden flex-col lg:flex-row">
        <aside className="w-full shrink-0 overflow-hidden border-b border-white/10 bg-[#111315]/95 backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-5 p-4 sm:p-5 lg:justify-between">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden">
                    <img
                      src={paskusLogo}
                      alt="Paskus 791 logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-bold sm:text-lg">
                      {user?.label || "Paskus 791"}
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 sm:text-xs">
                      {user?.unit || "Recruitment Division"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-red-500/20 bg-red-500/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300 transition hover:bg-red-500/10 lg:hidden"
                >
                  Keluar
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-3 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
                  Tactical Node
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Panel pelatih untuk seleksi kandidat, pelatihan, hasil laporan, dan SOP.
                </p>
              </div>

              <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "flex min-w-[172px] items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition lg:min-w-0",
                        isActive
                          ? "border-emerald-400/30 bg-emerald-400 text-black shadow-[0_0_30px_rgba(74,222,128,0.18)]"
                          : "border-white/5 bg-white/[0.02] text-stone-300 hover:border-white/10 hover:bg-white/[0.05]",
                      ].join(" ")
                    }
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-black/18">
                      <DashboardNavIcon name={item.icon} />
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 hidden items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 lg:flex"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden bg-[#090b0c]">
          <header className="overflow-hidden border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-emerald-400/80">
                  Tactical Overview
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {canGoBack ? (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/[0.06] hover:text-stone-100"
                    >
                      <span aria-hidden="true">←</span>
                      Back
                    </button>
                  ) : null}
                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    {pageTitle}
                  </h2>
                </div>
              </div>

              <div className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3 text-left lg:text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                  Local System Time
                </p>
                <p className="mt-1 font-mono text-base sm:text-lg">
                  {time.toLocaleTimeString("id-ID")}
                </p>
                <p className="text-xs text-stone-400">
                  Indonesia (WIB) • {time.toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </header>

          <section className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
