/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DashboardNavbar from "./dashboard/DashboardNavbar";
import AuthSessionLoader from "./components/AuthSessionLoader";
import { useAuth } from "./lib/auth";

const LoginPortal = lazy(() => import("./pages/LoginPortal"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const DashboardHome = lazy(() => import("./dashboard/views/DashboardHomePage"));
const HasilLaporanPage = lazy(() => import("./dashboard/views/HasilLaporanPage"));
const JadwalPage = lazy(() => import("./dashboard/views/JadwalPage"));
const RecruitmentReportPage = lazy(() => import("./dashboard/views/RecruitmentReportPage"));
const PelatihanPage = lazy(() => import("./dashboard/views/PelatihanPage"));
const TambahPetugasPage = lazy(() => import("./dashboard/views/TambahPetugasPage"));
const TindakanPage = lazy(() => import("./dashboard/views/TindakanPage"));
const PinSertijabPage = lazy(() => import("./dashboard/views/PinSertijabPage"));
const PengambilanPinPage = lazy(() => import("./dashboard/views/PengambilanPinPage"));
const SopPage = lazy(() => import("./dashboard/views/SopPage"));
const AdminConsolePage = lazy(() => import("./dashboard/views/AdminConsolePage"));

function RouteLoader() {
  return (
    <AuthSessionLoader
      eyebrow="Route Loader"
      title="Memuat halaman portal..."
      message="Komponen halaman sedang diambil sesuai route yang kamu buka."
    />
  );
}

function RouteSuspense({ children }) {
  return <Suspense fallback={<RouteLoader />}>{children}</Suspense>;
}

function ProtectedRoute({ requiredScope, redirectTo }) {
  const { loading, isScopeAuthenticated } = useAuth();

  if (loading) {
    return <AuthSessionLoader />;
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
    return <AuthSessionLoader />;
  }

  if (user?.scope === "pelatih") {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.scope === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RouteSuspense><LoginPortal /></RouteSuspense>} />
      <Route path="/admin/login" element={<RouteSuspense><AdminLoginPage /></RouteSuspense>} />

      <Route
        element={<ProtectedRoute requiredScope="pelatih" redirectTo="/" />}
      >
        <Route path="/dashboard" element={<DashboardNavbar />}>
          <Route index element={<RouteSuspense><DashboardHome /></RouteSuspense>} />
          <Route path="jadwal" element={<RouteSuspense><JadwalPage /></RouteSuspense>} />
          <Route path="laporan" element={<RouteSuspense><HasilLaporanPage /></RouteSuspense>} />
          <Route
            path="laporan-perekrutan/:sessionId"
            element={<RouteSuspense><RecruitmentReportPage /></RouteSuspense>}
          />
          <Route path="pelatihan/:sessionId" element={<RouteSuspense><PelatihanPage /></RouteSuspense>} />
          <Route path="petugas" element={<RouteSuspense><TambahPetugasPage /></RouteSuspense>} />
          <Route path="tindakan" element={<RouteSuspense><TindakanPage /></RouteSuspense>} />
          <Route path="pin-sertijab" element={<RouteSuspense><PinSertijabPage /></RouteSuspense>} />
          <Route path="pin" element={<RouteSuspense><PengambilanPinPage /></RouteSuspense>} />
          <Route path="sop" element={<RouteSuspense><SopPage /></RouteSuspense>} />
        </Route>
      </Route>

      <Route
        element={<ProtectedRoute requiredScope="admin" redirectTo="/admin/login" />}
      >
        <Route path="/admin" element={<RouteSuspense><AdminConsolePage /></RouteSuspense>} />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
