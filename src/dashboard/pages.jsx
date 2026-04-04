/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Barrel Export
 * Purpose: Entry export tunggal untuk semua page dashboard staff.
 */

// Legacy barrel entry for dashboard routes.
// Semua page utama dashboard sekarang sudah dipecah ke file fitur masing-masing
// agar tim bisa lebih mudah mencari text, helper, dan komponen sesuai area kerja.

export { default as DashboardHome } from "./views/DashboardHomePage";
export { default as HasilLaporanPage } from "./views/HasilLaporanPage";
export { default as PelatihanPage } from "./views/PelatihanPage";
export { default as RecruitmentReportPage } from "./views/RecruitmentReportPage";
export { default as TambahPetugasPage } from "./views/TambahPetugasPage";
export { default as TindakanPage } from "./views/TindakanPage";
export { default as SopPage } from "./views/SopPage";
