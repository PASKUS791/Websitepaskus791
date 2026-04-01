# PelatihDash

Dashboard rekrutmen berbasis React + Vite untuk kebutuhan operasional `PASKUS 791`.

Project ini berisi alur login, dashboard utama, kalender jadwal yang bisa diedit, arsip hasil laporan, board perlu tindakan, dan library SOP dengan tampilan taktis.

## Fitur Utama

- Login portal dengan demo account lokal.
- Dashboard utama untuk monitoring kandidat.
- Halaman `Jadwal` dengan mode day/week/month dan data yang bisa diedit.
- Halaman `Hasil Laporan` dengan arsip laporan kandidat, laporan tambahan, edit, hapus, eliminasi kandidat, dan status dispatch.
- Halaman `Perlu Tindakan` untuk reminder kandidat tanpa laporan, jadwal terlewat, dan data yang belum terkirim.
- Halaman `SOP` dengan beberapa card dokumen dan detail view interaktif.

## Tech Stack

- React 19
- Vite 8
- React Router
- Framer Motion
- Recharts
- Tailwind CSS

## Demo Login

Gunakan salah satu akun demo berikut:

- `paskus` / `paskus123`
- `recruiter` / `recruiter123`

## Menjalankan Project

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Lint project:

```bash
npm run lint
```

## Struktur Singkat

```text
src/
  dashboard/
    DashboardLayout.jsx
    pages.jsx
  lib/
    auth.js
  pages/
    LoginPortal.jsx
  App.jsx
  main.jsx
```

## Halaman

- `/` : login portal
- `/dashboard` : dashboard utama
- `/dashboard/jadwal` : kalender jadwal rekrutmen
- `/dashboard/laporan` : arsip hasil laporan
- `/dashboard/tindakan` : board perlu tindakan
- `/dashboard/sop` : dokumen SOP

## Catatan

- Sebagian data saat ini masih menggunakan local state dan `localStorage`.
- Konten halaman `SOP` saat ini sudah disiapkan dengan placeholder `Lorem ipsum` agar mudah diganti dengan data final.
- Asset `introph.gif` cukup besar sehingga build dapat menampilkan warning ukuran bundle.
