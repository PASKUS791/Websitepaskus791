import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import dashboardIcon from "../assets/2.webp";
import jadwalIcon from "../assets/5.webp";
import laporanIcon from "../assets/GATAM_2.webp";
import tindakanIcon from "../assets/GATAM_3.webp";
import sopIcon from "../assets/GATAM_4.webp";
import paskusLogo from "../assets/paskus.webp";
import { setAuthenticated } from "../lib/auth";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    short: "DB",
    to: "/dashboard",
    end: true,
    icon: dashboardIcon,
  },
  {
    label: "Jadwal",
    short: "JD",
    to: "/dashboard/jadwal",
    icon: jadwalIcon,
  },
  {
    label: "Hasil Laporan",
    short: "LP",
    to: "/dashboard/laporan",
    icon: laporanIcon,
  },
  {
    label: "Butuh Tindakan",
    short: "TN",
    to: "/dashboard/tindakan",
    icon: tindakanIcon,
  },
  {
    label: "SOP",
    short: "SOP",
    to: "/dashboard/sop",
    icon: sopIcon,
  },
];

const PAGE_TITLES = {
  "/dashboard": "SO-791 Data Center",
  "/dashboard/jadwal": "Jadwal Rekrutmen",
  "/dashboard/laporan": "Hasil Laporan",
  "/dashboard/tindakan": "Butuh Tindakan",
  "/dashboard/sop": "Standard Operating Procedure",
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const pageTitle = useMemo(
    () => PAGE_TITLES[location.pathname] ?? "SO-791 Data Center",
    [location.pathname],
  );

  const handleSignOut = () => {
    setAuthenticated(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#090b0c] font-sans text-stone-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-[#111315]/95 backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden">
                  <img
                    src={paskusLogo}
                    alt="Paskus 791 logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Paskus 791</h1>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                    Recruitment Division
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-sm border border-emerald-400/10 bg-emerald-400/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
                  Tactical Node
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Panel rekrutmen untuk sortir kandidat, tindak lanjut reviewer, dan akses SOP.
                </p>
              </div>

              <nav className="mt-8 flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-sm border px-4 py-3 text-sm transition",
                        isActive
                          ? "border-emerald-400/30 bg-emerald-400 text-black shadow-[0_0_30px_rgba(74,222,128,0.18)]"
                          : "border-white/5 bg-white/[0.02] text-stone-300 hover:border-white/10 hover:bg-white/[0.05]",
                      ].join(" ")
                    }
                  >
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden">
                      <img
                        src={item.icon}
                        alt={`${item.label} icon`}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-8 flex items-center justify-center rounded-sm border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-white/10 px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400/80">
                  Tactical Overview
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {pageTitle}
                </h2>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                  Local System Time
                </p>
                <p className="mt-1 font-mono text-lg">
                  {time.toLocaleTimeString("id-ID")}
                </p>
                <p className="text-xs text-stone-400">
                  Indonesia (WIB) • {time.toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </header>

          <section className="p-6 lg:p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}
