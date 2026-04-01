import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";
import {
  DashboardHome,
  JadwalPage,
  LaporanPage,
  SopPage,
  TindakanPage,
} from "./dashboard/pages";
import { isAuthenticated } from "./lib/auth";
import LoginPortal from "./pages/LoginPortal";

function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPortal />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="jadwal" element={<JadwalPage />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route path="tindakan" element={<TindakanPage />} />
          <Route path="sop" element={<SopPage />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated() ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}
