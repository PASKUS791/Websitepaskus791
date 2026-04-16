# Deploy Guide

## Target

Project ini siap dideploy sebagai `two-domain deployment`:

- frontend static `staff.paskus791.cloud`
- backend API `api.paskus791.cloud`
- database `MongoDB`
- reverse proxy / CDN / WAF di depan origin

## Rekomendasi Topologi

1. `CDN / WAF / Reverse Proxy`
2. `Node server` yang menjalankan `server/index.mjs`
3. `MongoDB Atlas` atau server MongoDB privat
4. `Backend staff eksternal` upstream bila masih dipakai

## Environment Variable Minimal

```env
NODE_ENV=production
API_PORT=8787
APP_ALLOWED_ORIGINS=https://staff.paskus791.cloud
APP_SESSION_SECRET=ganti-dengan-secret-random-yang-panjang-dan-unik
APP_PASSWORD_PEPPER=ganti-dengan-pepper-random-yang-panjang-dan-unik
APP_TRUST_PROXY=true
APP_SERVE_FRONTEND=false
VITE_API_BASE_URL=https://api.paskus791.cloud
VITE_STAFF_API_BASE_URL=https://api.paskus791.cloud
STAFF_BACKEND_BASE_URL=https://api.paskus791.cloud
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pelatihdash?retryWrites=true&w=majority
MONGODB_DB_NAME=pelatihdash
DISCORD_RECRUITMENT_WEBHOOK_URL=
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=ganti-password-pelatih-admin
PELATIH_ADMIN_LABEL=Paskus Admin
PELATIH_ADMIN_UNIT=PASKUS 791
ADMIN_PANEL_USERNAME=SystemAdmin
ADMIN_PANEL_PASSWORD=ganti-password-admin-console
ADMIN_PANEL_LABEL=System Admin
ADMIN_PANEL_UNIT=PASKUS 791 Control
ADMIN_PANEL_WALLET_ADDRESSES=0xAdminWalletProduction
ADMIN_PANEL_WALLET_AUTH_REQUIRED=true
APP_WALLET_CHALLENGE_TTL_MINUTES=5
```

## Build

```bash
npm install
npm run lint
npm run build
```

## Run Backend

```bash
npm start
```

## Health Check

```bash
curl http://127.0.0.1:8787/api/health
```

Expected:

```json
{"ok":true,"status":"online","database":"mongodb"}
```

## Reverse Proxy / Edge Notes

Wajib disiapkan:

- TLS aktif
- `APP_TRUST_PROXY=true` bila di belakang reverse proxy
- frontend static tidak perlu diserve dari backend
- set `APP_SERVE_FRONTEND=false` agar `api.paskus791.cloud` berjalan sebagai `API-only`
- WAF / edge rate limit untuk burst tinggi
- bot filtering / reputation
- origin shielding

## Domain Split

Mode yang direkomendasikan untuk project ini:

- `staff.paskus791.cloud` hanya meng-host hasil build `dist-staff/`
- `api.paskus791.cloud` hanya menjalankan `server/index.mjs`
- frontend memanggil internal API lewat `VITE_API_BASE_URL=https://api.paskus791.cloud`
- frontend memanggil backend staff legacy lewat `VITE_STAFF_API_BASE_URL=https://api.paskus791.cloud`
- backend internal meneruskan sinkron staff ke `STAFF_BACKEND_BASE_URL=https://api.paskus791.cloud`

Kalau kamu masih perlu proxy internal `/staff-api`, arahkan:

- `VITE_STAFF_API_BASE_URL=https://api.paskus791.cloud/staff-api`
- `STAFF_BACKEND_BASE_URL` ke origin upstream staff backend yang sebenarnya

Jangan isi `STAFF_BACKEND_BASE_URL` dengan domain backend internal yang sama kalau kamu memakai mode proxy, karena itu akan membuat loop proxy.

## Checklist Production

1. Pastikan `.env` tidak masuk git
2. Pastikan `APP_SESSION_SECRET` dan `APP_PASSWORD_PEPPER` unik dan panjang
3. Pakai database terpisah untuk beta dan production
4. Pastikan `ADMIN_PANEL_*`, `PELATIH_ADMIN_*`, dan `ADMIN_PANEL_WALLET_ADDRESSES` sudah diisi
5. Uji login staff
6. Uji login admin
7. Uji pembuatan akun pelatih
8. Uji sinkron data lintas dua browser / dua akun
9. Uji kirim laporan Discord
10. Pasang CDN / WAF di depan origin

## Catatan Trust Wallet

Recovery phrase tidak boleh dipakai dalam deploy config.

Kalau nanti wallet-based verification diaktifkan:

- pakai signature challenge
- jangan simpan seed phrase
- allowlist wallet admin di server lewat `ADMIN_PANEL_WALLET_ADDRESSES`
- atur masa berlaku challenge dengan `APP_WALLET_CHALLENGE_TTL_MINUTES`
- gunakan WalletConnect / flow resmi Trust Wallet
