import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate, useOutlet } from "react-router-dom";
import paskusLogo from "../assets/paskus.webp";
import { useAuth } from "../lib/auth";
import { useAnimatedFavicon } from "../lib/useAnimatedFavicon";

const NAV_ITEMS = [
  {
    label: "Map Planner",
    hint: "Ronograd tactical board",
    to: "/hco/dashboard",
    end: true,
    icon: "map",
  },
  {
    label: "Strategic Saves",
    hint: "Saved board snapshots",
    to: "/hco/dashboard/saves",
    end: false,
    icon: "save",
  },
];

const PAGE_TITLES = {
  "/hco/dashboard": "HCO Map Planner",
  "/hco/dashboard/saves": "Strategic Saves",
};

function HcoNavIcon({ name }) {
  if (name === "save") {
    return (
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 fill-none stroke-current stroke-[1.6]"
      >
        <path d="M5 4.5h8l2.5 2.5v8.5H5z" />
        <path d="M7 4.5V9h6V4.5" />
        <path d="M7.5 14h5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5 fill-none stroke-current stroke-[1.6]"
    >
      <path d="M4 14 7 6h9" />
      <path d="M13 4h3v3" />
      <path d="M4 16h12" />
    </svg>
  );
}

export default function HcoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const { logout, user } = useAuth();
  useAnimatedFavicon();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const pageTitle = useMemo(
    () => PAGE_TITLES[location.pathname] ?? "HCO Center",
    [location.pathname],
  );

  const handleSignOut = async () => {
    await logout();
    navigate("/hco", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#090d0f] font-sans text-stone-100">
      <div className="flex min-h-screen flex-col xl:flex-row">
        <aside className="w-full border-b border-white/8 bg-white/[0.025] backdrop-blur-2xl xl:w-80 xl:border-b-0 xl:border-r">
          <div className="flex h-full flex-col justify-between p-6">
            <div>
              <div className="flex items-center gap-4 rounded-[26px] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-lime-300/16 hover:bg-white/[0.045]">
                <img
                  src={paskusLogo}
                  alt="HCO insignia"
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div>
                  <h1 className="font-sans text-xl font-bold uppercase text-stone-100">
                    {user?.label || "HCO Center"}
                  </h1>
                  <p className="font-public text-[10px] uppercase tracking-[0.28em] text-lime-300">
                    {user?.unit || "Ronograd Control"}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[26px] border border-lime-300/12 bg-lime-300/[0.05] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:border-lime-300/20 hover:bg-lime-300/[0.07]">
                <p className="font-public text-[10px] uppercase tracking-[0.35em] text-stone-400">
                  Mission Scope
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  Tactical planning node untuk annotasi map, intel marker, dan
                  penyimpanan snapshot strategi operasional Ronograd.
                </p>
              </div>

              <LayoutGroup id="hco-nav">
                <nav className="mt-8 flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className="group relative"
                  >
                    {({ isActive }) => (
                      <div
                        className={[
                          "relative flex items-center justify-between overflow-hidden rounded-[22px] border px-4 py-4 text-sm backdrop-blur-xl transition duration-300",
                          isActive
                            ? "border-lime-300/30 text-[#0b100e] shadow-[0_0_30px_rgba(190,242,100,0.12)]"
                            : "border-white/8 bg-white/[0.03] text-stone-300 hover:border-lime-300/16 hover:bg-white/[0.05]",
                        ].join(" ")}
                      >
                        {isActive ? (
                          <motion.div
                            layoutId="hco-active-nav"
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 bg-lime-300"
                          />
                        ) : null}

                        <div className="relative z-10">
                          <p className="font-sans text-base font-semibold uppercase">
                            {item.label}
                          </p>
                          <p className="mt-1 font-public text-[9px] uppercase tracking-[0.18em] opacity-75">
                            {item.hint}
                          </p>
                        </div>
                        <div className="relative z-10 transition group-hover:scale-105">
                          <HcoNavIcon name={item.icon} />
                        </div>
                      </div>
                    )}
                  </NavLink>
                ))}
                </nav>
              </LayoutGroup>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-6 flex w-full items-center justify-center rounded-[20px] border border-rose-500/18 bg-rose-500/10 px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200 backdrop-blur-xl transition hover:border-rose-400/26 hover:bg-rose-500/16"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-white/8 bg-white/[0.02] px-6 py-5 backdrop-blur-xl lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-public text-[10px] uppercase tracking-[0.32em] text-lime-300/80">
                  HCO Tactical Grid
                </p>
                <h2 className="mt-2 font-sans text-3xl font-bold uppercase tracking-tight text-stone-100">
                  {pageTitle}
                </h2>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-left backdrop-blur-xl lg:text-right">
                <p className="font-public text-[10px] uppercase tracking-[0.24em] text-stone-500">
                  Command Time
                </p>
                <p className="mt-1 font-mono text-xl text-stone-100">
                  {time.toLocaleTimeString("id-ID")}
                </p>
                <p className="text-xs text-stone-400">
                  Indonesia (WIB) • {time.toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </header>

          <section className="p-6 lg:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 22, filter: "blur(18px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(16px)" }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
}
