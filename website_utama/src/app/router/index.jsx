import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router";
import Loading from "@/features/loading/LoadingScreen";

// Lazy-loaded page components for optimization
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Unit = lazy(() => import("@/pages/Unit"));
const Struktural = lazy(() => import("@/pages/Struktural"));
const Streamers = lazy(() => import("@/pages/Streamers"));
const StreamerProfile = lazy(() => import("@/pages/StreamerProfile"));
const Brm5Roleplay = lazy(() => import("@/pages/Brm5Roleplay"));
const ResimenBrm5 = lazy(() => import("@/pages/ResimenBrm5"));
const RoleplayGrupBrm5 = lazy(() => import("@/pages/RoleplayGrupBrm5"));
const UnitBrm5Paskus = lazy(() => import("@/pages/UnitBrm5Paskus"));
const FraksiBrm5 = lazy(() => import("@/pages/FraksiBrm5"));
const CaraGabungBrm5 = lazy(() => import("@/pages/CaraGabungBrm5"));
const Peraturan = lazy(() => import("@/pages/Peraturan"));

export const AppRouter = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<Loading isSuspenseFallback={true} />}>
      <div key={location.pathname} className="page-animate-in">
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/unit/:namaUnit" element={<Unit />} />

          {/* Streamers Pages */}
          <Route path="/struktural" element={<Struktural />} />
          <Route path="/streamer" element={<Streamers />} />
          <Route path="/streamers" element={<Streamers />} />
          <Route path="/streamer/:creator" element={<StreamerProfile />} />
          <Route path="/streamers/:creator" element={<StreamerProfile />} />

          {/* BRM5 Pages */}
          <Route path="/brm5-roleplay" element={<Brm5Roleplay />} />
          <Route path="/resimen-brm5" element={<ResimenBrm5 />} />
          <Route path="/roleplay-grup-brm5" element={<RoleplayGrupBrm5 />} />
          <Route path="/unit-brm5-paskus" element={<UnitBrm5Paskus />} />
          <Route path="/blackhawk-rescue-5-roleplay-fraksi" element={<FraksiBrm5 />} />
          <Route path="/cara-gabung-brm5-roleplay" element={<CaraGabungBrm5 />} />
          <Route path="/peraturan" element={<Peraturan />} />
        </Routes>
      </div>
    </Suspense>
  );
};
