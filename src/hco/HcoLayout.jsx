/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate, useOutlet } from "react-router-dom";
import paskusLogo from "../assets/paskus.webp";
import { useAuth } from "../lib/auth";
import { RESOURCE_KEYS, useSyncedResource } from "../lib/resources";
import { useAnimatedFavicon } from "../lib/useAnimatedFavicon";
import {
  getHcoAccessForUser,
  isPrimaryHcoAdminUser,
  normalizeHcoAccessEntries,
} from "./hcoAccess";

const NAV_ITEMS = [
  {
    label: "Map Planner",
    hint: "Ronograd tactical board",
    to: "/hco/dashboard",
    end: true,
    icon: "map",
    permission: "mainPlanner",
  },
  {
    label: "Map Custom",
    hint: "Draw-only custom board",
    to: "/hco/dashboard/custom-maps",
    end: false,
    icon: "custom-map",
    permission: "customMaps",
  },
  {
    label: "Strategic Saves",
    hint: "Saved board snapshots",
    to: "/hco/dashboard/saves",
    end: false,
    icon: "save",
    permission: "saves",
  },
  {
    label: "Tambah User Map Planner",
    hint: "Grant HCO access control",
    to: "/hco/dashboard/users",
    end: false,
    icon: "users",
    adminOnly: true,
  },
];

function resolvePageTitle(pathname) {
  if (pathname === "/hco/dashboard") {
    return "HCO Map Planner";
  }

  if (pathname.startsWith("/hco/dashboard/custom-maps/")) {
    return "Custom Map Planner";
  }

  if (pathname === "/hco/dashboard/custom-maps") {
    return "Map Custom";
  }

  if (pathname === "/hco/dashboard/saves") {
    return "Strategic Saves";
  }

  if (pathname === "/hco/dashboard/users") {
    return "Tambah User Map Planner";
  }

  return "HCO Center";
}

function HcoNavIcon({ name }) {
  if (name === "custom-map") {
    return (
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 fill-none stroke-current stroke-[1.6]"
      >
        <rect x="3.5" y="4.5" width="13" height="11" rx="1.8" />
        <path d="m6.5 12 2.6-2.8 2.4 2.2 2-1.8 2 2.4" />
        <circle cx="7.2" cy="7.7" r="1.1" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 fill-none stroke-current stroke-[1.6]"
      >
        <path d="M7 8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M13.5 9a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 13.5 9Z" />
        <path d="M3.8 14.8c.7-1.9 2.2-2.9 4.2-2.9s3.5 1 4.2 2.9" />
        <path d="M11.8 14.6c.45-1.35 1.45-2.1 2.95-2.1 1.4 0 2.4.65 2.95 1.95" />
      </svg>
    );
  }

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
  const { data: accessEntries } = useSyncedResource(RESOURCE_KEYS.hcoMapPlannerUsers, {
    defaultValue: [],
    normalize: normalizeHcoAccessEntries,
  });
  useAnimatedFavicon();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const pageTitle = useMemo(() => resolvePageTitle(location.pathname), [location.pathname]);
  const isPrimaryAdmin = useMemo(() => isPrimaryHcoAdminUser(user), [user]);
  const accessState = useMemo(
    () => getHcoAccessForUser(user, accessEntries),
    [accessEntries, user],
  );
  const navItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) => {
        if (item.adminOnly && !isPrimaryAdmin) {
          return false;
        }

        if (item.permission && !accessState[item.permission]) {
          return false;
        }

        return true;
      }),
    [accessState, isPrimaryAdmin],
  );
  const firstAllowedPath = navItems[0]?.to || "/hco";
  const isRouteBlocked = useMemo(() => {
    const isPlannerRoute = location.pathname === "/hco/dashboard";
    const isCustomMapRoute = location.pathname.startsWith("/hco/dashboard/custom-maps");
    const isSaveRoute = location.pathname.startsWith("/hco/dashboard/saves");
    const isUsersRoute = location.pathname.startsWith("/hco/dashboard/users");

    return (
      (isPlannerRoute && !accessState.mainPlanner) ||
      (isCustomMapRoute && !accessState.customMaps) ||
      (isSaveRoute && !accessState.saves) ||
      (isUsersRoute && !isPrimaryAdmin)
    );
  }, [accessState, isPrimaryAdmin, location.pathname]);

  const handleSignOut = async () => {
    await logout();
    navigate("/hco", { replace: true });
  };

  useEffect(() => {
    if (isRouteBlocked && firstAllowedPath && location.pathname !== firstAllowedPath) {
      navigate(firstAllowedPath, { replace: true });
    }
  }, [firstAllowedPath, isRouteBlocked, location.pathname, navigate]);

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
                {navItems.map((item) => (
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
                {isRouteBlocked ? null : outlet}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
}
