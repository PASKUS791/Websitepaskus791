# PelatihWebPaskus

Dashboard operasional internal `PASKUS 791` dengan dua portal utama:

- `Staff / Pelatih` untuk seleksi kandidat, pembukaan sesi pelatihan, pelaporan hasil, tindakan lanjutan, manajemen petugas, dan SOP operasional.
- `HCO Center` untuk `Ronograd Map Planner`, intel layer, annotation board, strategic saves, dan workflow tactical planning.

Project ini memakai arsitektur `React + Vite` di frontend dan `Node.js` di backend untuk autentikasi server-side, penyimpanan resource, dan sinkronisasi data real-time. Backend sekarang memakai `MongoDB` sebagai storage utama untuk lokal maupun deploy.

Setup deploy yang direkomendasikan sekarang:

- domain utama app: `https://staff.paskus791.cloud`
- backend internal project ini: `/api`
- proxy backend staff tim lain: `/staff-api` -> `https://api.paskus791.cloud`

## Stack

- React 19
- Vite 8
- React Router 7
- Framer Motion
- Tailwind CSS 4
- Node.js HTTP server
- MongoDB (`mongodb`)

## Fitur Saat Ini

- Login server-side untuk portal `Pelatih` dan `HCO`
- Password di-hash dengan `scrypt`
- Session cookie `HttpOnly`
- Rate limiting, lockout brute force, validasi origin/referer, dan hardening header keamanan
- Dashboard kandidat dengan multi-select dan pembukaan sesi pelatihan
- Page `Pelatihan` untuk petugas, kandidat aktif, pelaporan per kandidat, dan kontrol sesi
- `Cancel Sesi` yang mengembalikan kandidat ke dashboard jika sesi batal
- `Eliminasi Kandidat` yang menghapus kandidat dari data aktif
- `Hasil Laporan` berbasis kalender histori dengan detail per tanggal dan detail per sesi
- Halaman `Tambah Petugas`
- Halaman `Butuh Tindakan`
- Library SOP operasional BRM5, roleplay, dan penggunaan web perekrutan
- `HCO Map Planner` dengan marker intel, draw/text tool, fullscreen, strategic saves, dan dispatch Discord dari backend

## Struktur Project

```text
server/
  index.mjs                 API server, auth, session, resource storage

scripts/
  reset-seed-dashboard.mjs  Reset dan isi data test kandidat + pelatih

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
- `/dashboard/jadwal` : Redirect ke `Hasil Laporan`
- `/dashboard/laporan` : Kalender histori hasil laporan
- `/dashboard/pelatihan/:sessionId` : Sesi pelatihan aktif
- `/dashboard/laporan-perekrutan/:sessionId` : Detail laporan per sesi
- `/dashboard/petugas` : Tambah petugas
- `/dashboard/tindakan` : Reminder perlu tindakan
- `/dashboard/sop` : SOP
- `/hco` : Login HCO
- `/hco/dashboard` : HCO Map Planner
- `/hco/dashboard/custom-maps` : Gallery Map Custom
- `/hco/dashboard/custom-maps/:mapId` : Planner Map Custom
- `/hco/dashboard/users` : Manajemen user Map Planner HCO
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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pelatihdash?retryWrites=true&w=majority
MONGODB_DB_NAME=pelatihdash
```

Catatan:

- backend sekarang wajib memakai `MongoDB`
- gunakan database terpisah untuk lokal, beta, dan production

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

Jika `5173` sedang dipakai, Vite bisa pindah ke port lain seperti `5174`.

Catatan:

- frontend lokal memakai proxy Vite untuk `/staff-api`
- saat production, default `staffApi` sekarang juga bisa memakai `/staff-api` dari domain yang sama

## Reset dan Isi Data Test

Untuk reset database dashboard lokal dan mengisi data uji:

```bash
node scripts/reset-seed-dashboard.mjs
```

Catatan:

- script ini sekarang reset data dashboard langsung ke `MongoDB`
- bootstrap akun admin tetap dibuat otomatis dari env saat backend start

Isi default hasil seed:

- `50` pendaftar
- `10` akun pelatih aktif
- `0` sesi aktif
- `0` histori laporan

Password default semua akun pelatih hasil seed:

```text
Paskus123
```

Contoh akun:

- `PaskusAdmin`
- `cpt.nova`
- `cpt.price`
- `lt.ghost`
- `maj.payne`
- `sgt.miller`

## Script

```bash
npm run dev       # Jalankan Vite client
npm run api       # Jalankan backend Node server
npm start         # Jalankan backend untuk mode deploy / hosting Node
npm run build     # Build production frontend
npm run preview   # Preview build Vite
npm run lint      # Lint project
node scripts/reset-seed-dashboard.mjs   # Reset seed data dashboard lokal
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
| `STAFF_BACKEND_BASE_URL` | URL backend staff tim lain yang akan diproxy lewat `/staff-api` |
| `MONGODB_URI` | URI MongoDB untuk deploy / production |
| `MONGODB_DB_NAME` | Nama database MongoDB |
| `DISCORD_STRATEGIC_WEBHOOK_URL` | Webhook dispatch strategic save |
| `PUBLIC_APP_URL` | URL aplikasi publik |
| `PELATIH_ADMIN_*` | Bootstrap akun admin pelatih |
| `HCO_ADMIN_*` | Bootstrap akun admin HCO |

## Arsitektur Data

Backend memakai collection MongoDB utama:

- `users`
- `sessions`
- `resources`

Resource yang aktif sekarang:

- `dashboard.candidates`
- `dashboard.schedules`
- `dashboard.trainingSessions`
- `dashboard.reports`
- `hco.plannerState`
- `hco.strategicSaves`

Frontend memakai `useSyncedResource()` untuk load, save, dan update real-time lewat SSE.

## Deploy MongoDB

Alur production yang direkomendasikan:

1. Build frontend dengan `npm run build`.
2. Deploy backend `server/index.mjs` ke hosting Node / VPS.
3. Sambungkan backend ke `MongoDB Atlas` atau MongoDB server lain lewat `MONGODB_URI`.
4. Arahkan domain `staff.paskus791.cloud` ke server ini.
5. Biarkan server ini melayani frontend build sekaligus endpoint `/api` dan proxy `/staff-api`.
6. Jalankan backend dengan:

```bash
npm start
```

Minimal env production yang wajib:

```env
NODE_ENV=production
API_PORT=8787
APP_ALLOWED_ORIGINS=https://staff.paskus791.cloud
APP_SESSION_SECRET=secret-random-panjang-dan-unik
APP_PASSWORD_PEPPER=pepper-random-panjang-dan-unik
APP_TRUST_PROXY=true
STAFF_BACKEND_BASE_URL=https://api.paskus791.cloud
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pelatihdash?retryWrites=true&w=majority
MONGODB_DB_NAME=pelatihdash
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=ganti-password-production
HCO_ADMIN_USERNAME=CosmoHCO
HCO_ADMIN_PASSWORD=ganti-password-production
PUBLIC_APP_URL=https://staff.paskus791.cloud
```

Health check backend:

```bash
curl http://localhost:8787/api/health
```

Jika mode MongoDB aktif, response akan mengandung:

```json
{"ok":true,"status":"online","database":"mongodb"}
```

## Catatan Untuk Tim Backend

Area yang paling siap untuk dilanjutkan:

1. Tambahkan test integrasi untuk mode `MongoDB`.
2. Pisahkan HTTP server sederhana ini ke framework backend pilihan tim jika perlu.
3. Tambahkan manajemen akun admin selain bootstrap dari env.
4. Tambahkan audit log login, perubahan data, dan dispatch Discord.
5. Tambahkan reset password, role management, dan 2FA jika project lanjut ke production penuh.
6. Pisahkan resource API menjadi endpoint domain-specific agar lebih mudah dipelihara.
7. Tambahkan migrasi resource jika nanti struktur data planner berubah.

## Catatan Untuk Tim Frontend

- Fokus UI utama ada di `src/dashboard` dan `src/hco`
- Shell staff ada di `src/dashboard/DashboardNavbar.jsx`
- View staff utama sudah dipisah ke `src/dashboard/views`
- Komponen modal dan laporan ada di `src/dashboard/components`
- Helper data dashboard ada di `src/dashboard/data/recruitmentData.js`
- `HCO Map Planner` memakai data map dan marker dari `src/hco/ronogradMapData.js`
- Strategic snapshot dan planner state ada di `src/hco/strategicSaves.js`
- Portal login ada di `src/pages/LoginPortal.jsx` dan `src/pages/HcoLoginPortal.jsx`

## Alur Staff Saat Ini

1. Pilih kandidat `Sipil` atau `PMC` dari dashboard.
2. Klik `Buka Pelatihan`.
3. Pilih beberapa petugas dan tentukan golongan.
4. Sesi baru akan muncul di page `Pelatihan`.
5. Isi `Laporkan` untuk tiap kandidat.
6. Kirim laporan penuh agar sesi masuk ke histori `Hasil Laporan`.
7. Jika sesi gagal, gunakan `Cancel Sesi` agar kandidat kembali ke dashboard.
8. Jika kandidat dieliminasi, data kandidat dihapus dari daftar aktif.

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
4. Jika perlu data test baru, jalankan `node scripts/reset-seed-dashboard.mjs`.
5. Uji login staff dan HCO.
6. Uji route penting di desktop dan mobile.
7. Pastikan webhook production dan `APP_SESSION_SECRET` sudah diisi.

## Status

Project ini sudah siap dipakai sebagai base aplikasi internal dan siap dilanjutkan oleh tim backend untuk:

- penguatan auth production
- penguatan operasional MongoDB production
- API domain-specific
- monitoring dan audit
- deployment full-stack
