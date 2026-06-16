# PelatihWebPaskus

Dashboard operasional internal `PASKUS 791` yang sekarang difokuskan penuh ke portal `Staff / Pelatih` untuk seleksi kandidat, pembukaan sesi pelatihan, pelaporan hasil, tindakan lanjutan, manajemen petugas, dan SOP operasional.

Project ini memakai arsitektur `React + Vite` di frontend dan `Node.js` di backend untuk autentikasi server-side, penyimpanan resource, dan sinkronisasi data real-time. Backend sekarang memakai `MongoDB` sebagai storage utama untuk lokal maupun deploy.

Update beta fix:

- shared state portal pelatih sekarang memakai `MongoDB` lewat backend internal, bukan `localStorage` per browser
- daftar petugas, shadow state sesi, histori laporan, dan metadata eliminasi sekarang bisa terbaca lintas akun dan lintas device selama lewat server yang sama
- tersedia `Admin Console` baru untuk monitoring, konfigurasi, dan registry akun pelatih

Setup deploy yang direkomendasikan sekarang:

- frontend static: `https://staff.paskus791.cloud`
- backend API: `https://api.paskus791.cloud`

## Website Utama vs Portal Staff: Fitur & Hubungan Alur Kerja

Aplikasi ini mengintegrasikan dua sistem utama yang bekerja secara sinergis melalui satu database dan backend API terpusat:

### 1. Website Utama (Main Public Site)
Website publik PASKUS Gi1 (`paskus.so791.com`) berfungsi sebagai gerbang luar bagi komunitas dan calon personel:
- **Landing Page & Navigation**: Menggunakan navigasi *floating pill* terpadu (HOME, COMBAT, SUPPORT, STREAMER, BRM5, STRUKTURAL, ABOUT US) yang konsisten di semua halaman, lengkap dengan integrasi multi-bahasa dan pintasan masuk Discord.
- **Pendaftaran Personel (Enlist Form)**: Calon anggota melakukan sinkronisasi akun Discord mereka, mengisi formulir pendaftaran, dan memilih waktu aktif latihan. Data ini langsung dikirim ke backend API terpusat.
- **Informasi Unit & Cluster SEO**: Halaman-halaman statis pendukung SEO (seperti `/peraturan`, `/brm5-roleplay`, `/cara-gabung-brm5-roleplay`) dan halaman dinas/unit menyajikan informasi lengkap bagi calon anggota.

### 2. Portal Staff / Pelatih (Internal Dashboard)
Dashboard internal (`staff.paskus791.cloud`) digunakan oleh para instruktur dan pengurus resimen untuk memproses pendaftaran dan pelatihan secara taktis:
- **Manajemen Kandidat**: Menampilkan seluruh data pendaftar baru yang masuk dari Website Utama secara real-time.
- **Sesi Pelatihan**: Pelatih dapat memilih kandidat dari dashboard, menunjuk instruktur, membuka sesi pelatihan, memberikan penilaian, dan mencatat histori laporan kelulusan.
- **Integrasi Webhook Discord**: Setiap laporan sesi pelatihan yang diselesaikan oleh pelatih otomatis dikirim ke server Discord PASKUS lewat webhook sebagai arsip dan log laporan resmi.
- **Admin Console**: Konsol khusus administrator untuk memantau status server, registry akun pelatih, dan mengelola database.

### Alur Hubungan & Arsitektur Data

```mermaid
graph TD
    A[Calon Anggota] -->|Buka Website Utama| B(Website Utama: paskus.so791.com)
    B -->|Sinkron Discord & Isi Form| C[Backend API: api.paskus791.cloud]
    C -->|Simpan Data Pendaftaran| D[(Database: MongoDB)]
    E[Instruktur / Staff] -->|Buka Portal Staff| F(Dashboard Staff: staff.paskus791.cloud)
    F -->|Tarik Data Real-time| C
    F -->|Buka Sesi & Input Nilai| G{Proses Pelatihan}
    G -->|Sesi Selesai/Kirim Laporan| C
    C -->|Kirim Notifikasi Laporan| H[Discord Webhook: Log Laporan]
```

## Stack

- React 19
- Vite 8
- React Router 7
- Framer Motion
- Tailwind CSS 4
- Node.js HTTP server
- MongoDB (`mongodb`)

## Fitur Saat Ini

- Login server-side untuk portal `Pelatih`
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

### Struktur Project

```text
webutama/                  Landing page utama dan file-file SEO statis (index.html, dll)
staff_pelatih/             Frontend React SPA untuk portal staff & pelatih
  src/                     Source code React (components, pages, dashboard, dll)
  staff-site/              HTML template utama untuk portal staff
  vite.staff.config.js     Konfigurasi bundler Vite untuk staff portal
api/                       Backend Node.js server, database, scripts, dan deployment configs
  index.mjs                API server utama (auth, session, routing, dll)
  deploy/                  Konfigurasi deployment (Nginx, env, install scripts)
  scripts/                 Script utilitas (reset-seed-dashboard.mjs, dll)
  database/                Inisialisasi database
```

## Routing

Staff website:

- `/` : Login Staff / Pelatih
- `/admin/login` : Login Admin internal
- `/admin` : Admin console untuk monitoring, konfigurasi, dan registry akun
- `/dashboard` : Dashboard utama staff
- `/dashboard/jadwal` : Redirect ke `Hasil Laporan`
- `/dashboard/laporan` : Kalender histori hasil laporan
- `/dashboard/pelatihan/:sessionId` : Sesi pelatihan aktif
- `/dashboard/laporan-perekrutan/:sessionId` : Detail laporan per sesi
- `/dashboard/petugas` : Tambah petugas
- `/dashboard/tindakan` : Reminder perlu tindakan
- `/dashboard/sop` : SOP

## Menjalankan Project Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Buat file `.env`

Kalau mau paling cepat, copy file siap pakai ini:

```bash
cp api/deploy/staff.paskus791.cloud.env .env
```

Lalu sesuaikan `MONGODB_URI` dan password admin kalau diperlukan.

Kalau mau buat manual, pakai contoh minimal ini:

Contoh minimal:

```env
API_PORT=8787
APP_ALLOWED_ORIGINS=http://localhost:5173
APP_SESSION_SECRET=ganti-dengan-secret-random-yang-panjang-dan-unik
APP_PASSWORD_PEPPER=ganti-dengan-pepper-random-yang-berbeda
APP_SERVE_FRONTEND=false
VITE_STAFF_SITE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8787
VITE_STAFF_API_BASE_URL=/staff-api
VITE_RECRUITMENT_DISPATCH_PATH=/api/recruitment/dispatch
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=Paskus123
PELATIH_ADMIN_LABEL=Paskus Admin
PELATIH_ADMIN_UNIT=PASKUS 791
ADMIN_PANEL_USERNAME=SystemAdmin
ADMIN_PANEL_PASSWORD=GantiPasswordAdminYangKuat
ADMIN_PANEL_LABEL=System Admin
ADMIN_PANEL_UNIT=PASKUS 791 Control
ADMIN_PANEL_WALLET_ADDRESSES=0xAdminWalletYangDiizinkan
ADMIN_PANEL_WALLET_AUTH_REQUIRED=true
APP_WALLET_CHALLENGE_TTL_MINUTES=5
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pelatihdash?retryWrites=true&w=majority
MONGODB_DB_NAME=pelatihdash
DISCORD_RECRUITMENT_WEBHOOK_URL=
```

Catatan:

- backend sekarang wajib memakai `MongoDB`
- gunakan database terpisah untuk lokal, beta, dan production
- file `deploy/staff.paskus791.cloud.env` sudah disiapkan untuk deploy domain utama

### 3. Jalankan backend

```bash
npm run api
```

### 4. Jalankan frontend staff

Terminal baru:

```bash
npm run dev:staff
```

### 5. Buka aplikasi

```text
Staff: http://localhost:5173
API:   http://localhost:8787
```

Catatan:

- frontend staff lokal memakai `VITE_API_BASE_URL=http://localhost:8787`
- frontend staff lokal memakai proxy Vite untuk `/staff-api`
- saat production dua domain, frontend staff harus memanggil `https://api.paskus791.cloud`

## Reset dan Isi Data Test

Untuk reset database dashboard lokal dan mengisi data uji:

```bash
node api/scripts/reset-seed-dashboard.mjs
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
npm run dev       # Alias ke frontend staff
npm run dev:staff # Jalankan Vite website staff
npm run api       # Jalankan backend Node server
npm start         # Jalankan backend untuk mode deploy / hosting Node
npm run build     # Build production website staff
npm run build:staff
npm run preview   # Preview build staff
npm run lint      # Lint project
node api/scripts/reset-seed-dashboard.mjs   # Reset seed data dashboard lokal
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
| `APP_SERVE_FRONTEND` | Set `false` bila backend dideploy sebagai API-only |
| `VITE_STAFF_SITE_URL` | URL website staff |
| `VITE_API_BASE_URL` | Base URL backend internal, misalnya `https://api.paskus791.cloud` |
| `VITE_STAFF_API_BASE_URL` | Base URL backend staff/legacy yang dipanggil frontend |
| `VITE_RECRUITMENT_DISPATCH_PATH` | Path endpoint dispatch recruiter internal, default `/api/recruitment/dispatch` |
| `STAFF_BACKEND_BASE_URL` | Origin upstream backend staff bila mode proxy `/staff-api` dipakai |
| `MONGODB_URI` | URI MongoDB untuk deploy / production |
| `MONGODB_DB_NAME` | Nama database MongoDB |
| `DISCORD_RECRUITMENT_WEBHOOK_URL` | Webhook Discord untuk kirim embed recruiter + lampiran |
| `PELATIH_ADMIN_*` | Bootstrap akun admin pelatih |
| `ADMIN_PANEL_*` | Bootstrap akun admin untuk `Admin Console` |
| `ADMIN_PANEL_WALLET_ADDRESSES` | Daftar allowlist wallet admin untuk signature challenge |
| `ADMIN_PANEL_WALLET_AUTH_REQUIRED` | Pakai `true` untuk mewajibkan login admin via wallet |
| `APP_WALLET_CHALLENGE_TTL_MINUTES` | Masa berlaku challenge signature wallet |

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
- `staffPortal.shared`

Frontend memakai `useSyncedResource()` untuk load, save, dan update real-time lewat SSE.

`staffPortal.shared` sekarang menyimpan:

- registry operator bersama
- `sessionMetaMap`
- `reportMetaMap`
- `candidateMetaMap`

Tujuannya agar histori dan shadow state portal staff tidak lagi terpecah per-browser.

## Deploy MongoDB

Alur production yang direkomendasikan:

1. Build frontend dengan `npm run build`.
2. Deploy backend `api/index.mjs` ke hosting Node / VPS.
3. Sambungkan backend ke `MongoDB Atlas` atau MongoDB server lain lewat `MONGODB_URI`.
4. Deploy hasil build `dist-staff/` ke `staff.paskus791.cloud`.
5. Deploy `api/index.mjs` ke `api.paskus791.cloud`.
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
APP_SERVE_FRONTEND=false
VITE_API_BASE_URL=https://api.paskus791.cloud
VITE_STAFF_API_BASE_URL=https://api.paskus791.cloud
STAFF_BACKEND_BASE_URL=https://api.paskus791.cloud
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pelatihdash?retryWrites=true&w=majority
MONGODB_DB_NAME=pelatihdash
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=ganti-password-production
ADMIN_PANEL_USERNAME=SystemAdmin
ADMIN_PANEL_PASSWORD=ganti-password-admin-console
ADMIN_PANEL_WALLET_ADDRESSES=0xAdminWalletProduction
ADMIN_PANEL_WALLET_AUTH_REQUIRED=true
APP_WALLET_CHALLENGE_TTL_MINUTES=5
DISCORD_RECRUITMENT_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
```

Health check backend:

```bash
curl http://localhost:8787/api/health
```

Jika mode MongoDB aktif, response akan mengandung:

```json
{"ok":true,"status":"online","database":"mongodb"}
```

Mode yang direkomendasikan untuk deploy sekarang:

- `staff.paskus791.cloud` hanya melayani file static frontend
- `api.paskus791.cloud` hanya melayani backend API
- frontend memakai `VITE_API_BASE_URL=https://api.paskus791.cloud`
- frontend memakai `VITE_STAFF_API_BASE_URL=https://api.paskus791.cloud`
- backend internal memakai `STAFF_BACKEND_BASE_URL=https://api.paskus791.cloud` untuk sinkron ke jalur staff

Kalau kamu masih memakai proxy `/staff-api` di backend internal, pastikan `STAFF_BACKEND_BASE_URL` menunjuk ke upstream backend staff yang sebenarnya, bukan ke domain backend internal yang sama.

## Catatan Untuk Tim Backend

Area yang paling siap untuk dilanjutkan:

1. Tambahkan test integrasi untuk mode `MongoDB`.
2. Pisahkan HTTP server sederhana ini ke framework backend pilihan tim jika perlu.
3. Tambahkan manajemen akun admin selain bootstrap dari env.
4. Tambahkan audit log login dan perubahan data.
5. Tambahkan reset password, role management, dan 2FA jika project lanjut ke production penuh.
6. Pisahkan resource API menjadi endpoint domain-specific agar lebih mudah dipelihara.
7. Tambahkan migrasi resource jika struktur data dashboard berubah.
8. Tambahkan retry queue untuk recruiter dispatch jika webhook Discord sedang gagal.

## Catatan Untuk Tim Frontend

- Fokus UI utama ada di `src/dashboard`
- Shell staff ada di `src/dashboard/DashboardNavbar.jsx`
- View staff utama sudah dipisah ke `src/dashboard/views`
- Komponen modal dan laporan ada di `src/dashboard/components`
- Helper data dashboard ada di `src/dashboard/data/recruitmentData.js`
- Portal login ada di `src/pages/LoginPortal.jsx`

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

Lalu upload isi `dist-staff/` ke hosting static.

### Full stack

Kalau ingin auth, database, webhook, dan sync resource benar-benar jalan, project harus dideploy bersama backend `api/index.mjs` dan environment variable production.

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

### Batas Ketahanan

Proteksi aplikasi ini sudah cukup kuat untuk:

- brute force login
- probing origin / referer
- session hardening
- validasi input dasar
- blok payload injeksi yang umum

Tetapi aplikasi origin tetap belum menggantikan:

- CDN / WAF / edge firewall untuk volumetric DDoS
- reputasi IP global
- bot challenge / CAPTCHA edge
- cache shield dan absorption layer

### Catatan MongoDB

Backend project ini memakai `MongoDB`. Jadi ancaman injection yang relevan adalah `NoSQL injection`, bukan literal `MySQL injection`. Fokus mitigasi harus pada:

- whitelist field yang boleh dipakai query
- validasi tipe data sebelum masuk ke query Mongo
- jangan pernah meneruskan objek query mentah dari input user
- batasi operator seperti `$ne`, `$gt`, `$regex`, `$where`, dan pola operator serupa agar tidak berasal dari request user

### Trust Wallet Note

- recovery phrase / seed phrase tidak boleh ditanam ke frontend, backend, env deploy, atau dokumen tim
- integrasi wallet yang aman harus memakai `challenge + signature` resmi seperti `ERC-191` / `ERC-4361`
- untuk koneksi mobile Trust Wallet, gunakan jalur resmi `WalletConnect`, bukan frasa wallet

### Referensi Resmi

- [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CISA Secure by Design](https://www.cisa.gov/securebydesign)
- [CISA / FBI / NSA Advisory AA24-290A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a)
- [ERC-191](https://eips.ethereum.org/EIPS/eip-191)
- [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361)
- [Trust Wallet Developer Docs](https://developer.trustwallet.com/developer/develop-for-trust)
- [Trust Wallet Mobile / WalletConnect Docs](https://developer.trustwallet.com/developer/develop-for-trust/mobile)

Lihat juga:

- [SECURITY.md](SECURITY.md)
- [DEPLOY.md](DEPLOY.md)

## Checklist Sebelum Push / Deploy

1. Pastikan `.env` tidak ikut ke Git.
2. Jalankan `npm run lint`.
3. Jalankan `npm run build`.
4. Jika perlu data test baru, jalankan `node api/scripts/reset-seed-dashboard.mjs`.
5. Uji login staff.
6. Uji route penting di desktop dan mobile.
7. Pastikan `APP_SESSION_SECRET` sudah diisi.

## Status

Project ini sudah siap dipakai sebagai base aplikasi internal dan siap dilanjutkan oleh tim backend untuk:

- penguatan auth production
- penguatan operasional MongoDB production
- API domain-specific
- monitoring dan audit
- deployment full-stack
