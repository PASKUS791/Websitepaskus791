# PelatihWebPaskus

Dashboard operasional `PASKUS 791` dengan dua portal utama:

- `Staff / Pelatih` untuk monitoring kandidat, jadwal, laporan, tindakan, dan SOP.
- `HCO Center` untuk `Ronograd Map Planner`, intel layer, annotation board, dan strategic saves.

Project ini sudah tidak lagi murni frontend. Saat ini aplikasi memakai arsitektur `React + Vite` di frontend dan `Node.js + SQLite` di backend untuk autentikasi server-side, penyimpanan resource, dan sinkronisasi data.

## Stack

- React 19
- Vite 8
- React Router 7
- Framer Motion
- Tailwind CSS 4
- Node.js HTTP server
- SQLite (`node:sqlite`)

## Fitur Saat Ini

- Login server-side untuk portal `Pelatih` dan `HCO`
- Password di-hash dengan `scrypt`
- Session cookie `HttpOnly`
- Rate limiting, lockout brute force, validasi origin/referer, dan hardening header keamanan
- Dashboard kandidat dan halaman monitoring staff
- Kalender jadwal rekrutmen yang bisa diedit
- Hasil laporan kandidat dengan arsip, tambahan laporan, dan dispatch
- Halaman `Perlu Tindakan`
- Library SOP
- `HCO Map Planner` dengan marker intel, draw/text tool, fullscreen, strategic saves, dan dispatch Discord dari backend

## Struktur Project

```text
server/
  index.mjs                 API server, auth, session, resource storage
  data/                     SQLite database lokal

src/
  dashboard/                Halaman portal staff
  hco/                      HCO Center, map planner, strategic saves
  pages/                    Login portal staff dan HCO
  lib/                      Auth client, API client, synced resources
  components/               Shared UI components

public/
  .htaccess
  _redirects
  robots.txt
```

## Routing

- `/` : Login Staff / Pelatih
- `/dashboard` : Dashboard utama staff
- `/dashboard/jadwal` : Kalender jadwal
- `/dashboard/laporan` : Arsip hasil laporan
- `/dashboard/tindakan` : Reminder perlu tindakan
- `/dashboard/sop` : SOP
- `/hco` : Login HCO
- `/hco/dashboard` : HCO Map Planner
- `/hco/dashboard/saves` : Strategic Saves

## Menjalankan Project Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Buat file `.env`

Karena file `.env.example` sengaja tidak disimpan ke repo, buat file `.env` manual di root project.

Contoh minimal:

```env
API_PORT=8787
APP_ALLOWED_ORIGINS=http://localhost:5173
APP_SESSION_SECRET=ganti-dengan-secret-random-yang-panjang-dan-unik
APP_PASSWORD_PEPPER=ganti-dengan-pepper-random-yang-berbeda
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=Paskus123
PELATIH_ADMIN_LABEL=Paskus Admin
PELATIH_ADMIN_UNIT=PASKUS 791
HCO_ADMIN_USERNAME=CosmoHCO
HCO_ADMIN_PASSWORD=Paskus123
HCO_ADMIN_LABEL=Strategic Admin
HCO_ADMIN_UNIT=HCO Strategic Command
DISCORD_STRATEGIC_WEBHOOK_URL=
PUBLIC_APP_URL=http://localhost:5173
```

### 3. Jalankan backend

```bash
npm run api
```

### 4. Jalankan frontend

Terminal baru:

```bash
npm run dev
```

### 5. Buka aplikasi

```text
Frontend: http://localhost:5173
API:      http://localhost:8787
```

## Script

```bash
npm run dev       # Jalankan Vite client
npm run api       # Jalankan backend Node server
npm run build     # Build production frontend
npm run preview   # Preview build Vite
npm run lint      # Lint project
```

## Environment Variable Penting

| Variable | Fungsi |
|---|---|
| `API_PORT` | Port backend lokal |
| `APP_ALLOWED_ORIGINS` | Daftar origin frontend yang diizinkan |
| `APP_SESSION_SECRET` | Secret untuk sign session cookie |
| `APP_PASSWORD_PEPPER` | Pepper tambahan untuk hashing password |
| `APP_SESSION_TTL_HOURS` | Durasi session login |
| `APP_LOGIN_WINDOW_MINUTES` | Jendela hitung brute force |
| `APP_LOGIN_MAX_ATTEMPTS` | Maksimal percobaan login sebelum lock |
| `APP_LOGIN_LOCK_MINUTES` | Durasi lock login |
| `APP_API_RATE_LIMIT_PER_MINUTE` | Rate limit umum API |
| `APP_LOGIN_RATE_LIMIT_PER_WINDOW` | Rate limit khusus endpoint login |
| `APP_TRUST_PROXY` | Gunakan `true` jika aplikasi di belakang reverse proxy |
| `APP_DATABASE_PATH` | Path file SQLite |
| `DISCORD_STRATEGIC_WEBHOOK_URL` | Webhook dispatch strategic save |
| `PUBLIC_APP_URL` | URL aplikasi publik |
| `PELATIH_ADMIN_*` | Bootstrap akun admin pelatih |
| `HCO_ADMIN_*` | Bootstrap akun admin HCO |

## Arsitektur Data

Backend saat ini menyimpan data utama di tabel:

- `users`
- `sessions`
- `resources`

Resource yang aktif sekarang:

- `dashboard.candidates`
- `dashboard.schedules`
- `dashboard.reports`
- `hco.plannerState`
- `hco.strategicSaves`

Frontend memakai `useSyncedResource()` untuk load, save, dan update real-time lewat SSE.

## Catatan Untuk Tim Backend

Area yang paling siap untuk dilanjutkan:

1. Ganti SQLite ke database production seperti PostgreSQL atau MySQL.
2. Pisahkan HTTP server sederhana ini ke framework backend pilihan tim jika perlu.
3. Tambahkan manajemen akun admin selain bootstrap dari env.
4. Tambahkan audit log login, perubahan data, dan dispatch Discord.
5. Tambahkan reset password, role management, dan 2FA jika project lanjut ke production penuh.
6. Pisahkan resource API menjadi endpoint domain-specific agar lebih mudah dipelihara.
7. Tambahkan test untuk auth, rate-limit, dan resource mutation.

## Catatan Untuk Tim Frontend

- Fokus UI utama ada di `src/dashboard` dan `src/hco`
- `HCO Map Planner` memakai data map dan marker dari `src/hco/ronogradMapData.js`
- Strategic snapshot dan planner state ada di `src/hco/strategicSaves.js`
- Portal login ada di `src/pages/LoginPortal.jsx` dan `src/pages/HcoLoginPortal.jsx`

## Deploy

Saat ini ada dua mode deploy yang perlu dibedakan:

### Frontend static only

Bisa dibuild dengan:

```bash
npm run build
```

Lalu upload isi `dist/` ke hosting static.

### Full stack

Kalau ingin auth, database, webhook, dan sync resource benar-benar jalan, project harus dideploy bersama backend `server/index.mjs` dan environment variable production.

Static hosting biasa tidak cukup untuk fitur backend ini.

## Keamanan

Beberapa proteksi yang sudah ada:

- password hashing `scrypt`
- pepper dari env
- cookie `HttpOnly`
- `SameSite=Strict`
- rate limit request
- lockout brute force
- validasi `Origin` dan `Referer`
- CSP dan security headers dasar
- sanitasi resource input

Lihat juga:

- [SECURITY.md](/Users/jerikho/Documents/New%20project/PelatihDash/SECURITY.md)
- [DEPLOY.md](/Users/jerikho/Documents/New%20project/PelatihDash/DEPLOY.md)

## Checklist Sebelum Push / Deploy

1. Pastikan `.env` tidak ikut ke Git.
2. Jalankan `npm run lint`.
3. Jalankan `npm run build`.
4. Uji login staff dan HCO.
5. Uji route penting di desktop dan mobile.
6. Pastikan webhook production dan `APP_SESSION_SECRET` sudah diisi.

## Status

Project ini sudah siap dipakai sebagai base aplikasi internal dan siap dilanjutkan oleh tim backend untuk:

- penguatan auth production
- migrasi database
- API domain-specific
- monitoring dan audit
- deployment full-stack

