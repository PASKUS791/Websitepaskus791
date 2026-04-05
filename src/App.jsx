/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DashboardNavbar from "./dashboard/DashboardNavbar";
import {
  DashboardHome,
  HasilLaporanPage,
  PelatihanPage,
  RecruitmentReportPage,
  TambahPetugasPage,
  SopPage,
  TindakanPage,
} from "./dashboard/pages";
import { useAuth } from "./lib/auth";
import LoginPortal from "./pages/LoginPortal";

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06090b] font-sans text-stone-100">
      <div className="rounded-[28px] border border-white/8 bg-white/[0.04] px-8 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        <p className="font-public text-[10px] uppercase tracking-[0.32em] text-lime-300/80">
          Secure Session
        </p>
        <p className="mt-3 text-sm text-stone-300">Memeriksa sesi server...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ requiredScope, redirectTo }) {
  const { loading, isScopeAuthenticated } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return isScopeAuthenticated(requiredScope) ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
}

function RootRedirect() {
  const { loading, user } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (user?.scope === "pelatih") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPortal />} />

      <Route
        element={<ProtectedRoute requiredScope="pelatih" redirectTo="/" />}
      >
        <Route path="/dashboard" element={<DashboardNavbar />}>
          <Route index element={<DashboardHome />} />
          <Route path="jadwal" element={<Navigate to="/dashboard/laporan" replace />} />
          <Route path="laporan" element={<HasilLaporanPage />} />
          <Route
            path="laporan-perekrutan/:sessionId"
            element={<RecruitmentReportPage />}
          />
          <Route path="pelatihan/:sessionId" element={<PelatihanPage />} />
          <Route path="petugas" element={<TambahPetugasPage />} />
          <Route path="tindakan" element={<TindakanPage />} />
          <Route path="sop" element={<SopPage />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
