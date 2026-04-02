# Panduan Deploy

Project ini sudah disiapkan untuk deploy sebagai aplikasi `React + Vite SPA`, dan juga sudah memiliki backend `Node.js` untuk kebutuhan autentikasi, session, resource sync, dan penyimpanan data.

## Mode Deploy

Ada dua model deploy yang perlu dibedakan:

### 1. Deploy frontend statis

Cocok jika yang ingin di-upload hanya hasil tampilan frontend.

Build lokal:

```bash
npm run build
```

Hasil build akan berada di folder `dist/`.

Catatan:

- Mode ini hanya cocok untuk frontend statis.
- Fitur backend seperti login server-side, session, database, webhook, dan resource sync tidak akan aktif penuh jika hanya deploy `dist/`.

### 2. Deploy full stack

Cocok untuk produksi penuh karena backend `server/index.mjs` ikut dijalankan.

Mode ini diperlukan jika kamu ingin fitur berikut benar-benar aktif:

- login server-side
- session cookie aman
- database SQLite
- resource sync
- strategic webhook dispatch
- proteksi brute force dan rate limit

## Opsi Deploy Frontend

### Opsi 1: Vercel

1. Import repository GitHub ke Vercel.
2. Jika repo memiliki folder lain di atas project, pilih root directory yang benar.
3. Build command:

```bash
npm run build
```

4. Output directory:

```bash
dist
```

File [vercel.json](/Users/jerikho/Documents/New%20project/PelatihDash/vercel.json) sudah menyiapkan rewrite agar route seperti `/dashboard`, `/hco`, dan `/hco/dashboard/saves` tetap berjalan saat refresh.

### Opsi 2: Netlify

1. Import repository GitHub ke Netlify.
2. Jika perlu, pilih base directory yang sesuai.
3. Build command:

```bash
npm run build
```

4. Publish directory:

```bash
dist
```

File [netlify.toml](/Users/jerikho/Documents/New%20project/PelatihDash/netlify.toml) dan [public/_redirects](/Users/jerikho/Documents/New%20project/PelatihDash/public/_redirects) sudah menyiapkan fallback untuk React Router.

## Opsi Deploy Manual ke Hosting

Jika upload manual ke hosting statis:

1. Jalankan:

```bash
npm run build
```

2. Upload seluruh isi folder `dist/` ke root web yang aktif.
3. Pastikan file rewrite seperti `.htaccess` atau `_redirects` ikut dipakai jika hosting mendukungnya.

## Menjalankan Backend

Untuk backend lokal atau server:

```bash
npm run api
```

Secara default backend berjalan di port:

```bash
8787
```

## Variabel Environment yang Wajib

Minimal isi file `.env` dengan nilai yang aman:

```env
API_PORT=8787
APP_ALLOWED_ORIGINS=http://localhost:5173
APP_SESSION_SECRET=ganti-dengan-secret-random-yang-panjang
APP_PASSWORD_PEPPER=ganti-dengan-pepper-random-yang-unik
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=Paskus123
HCO_ADMIN_USERNAME=CosmoHCO
HCO_ADMIN_PASSWORD=Paskus123
```

Untuk production:

- jangan upload file `.env` ke public web root
- gunakan secret yang panjang dan acak
- bedakan env lokal, beta, dan production

## Catatan Penting

- Karena app ini memakai `BrowserRouter`, file rewrite atau redirect wajib tersedia.
- Jika nanti ingin deploy ke GitHub Pages, konfigurasi `base` di Vite perlu disesuaikan lagi.
- Untuk production penuh, deploy static saja tidak cukup karena backend juga dibutuhkan.
- Pastikan domain production memakai HTTPS.

## Identitas Project

Hak kelola internal project ini berada pada:

- Team DUKUN PASKUS 791
- Jevier — Frontend
- Teddy — Backend
- Lee — Cyber Sector
- Osiris — Bot Manufactur
