# Panduan Deploy Hostinger + MongoDB

Sir sir sekalian, file ini saya tulis biar pas deploy nanti tim tidak perlu nebak-nebak lagi. Kita pakai jalur yang paling aman dan paling gampang dipahami:

- frontend `React + Vite`
- backend `Node.js`
- database `MongoDB`

Backend project ini sekarang sudah fokus ke `MongoDB`, jadi tidak ada lagi mode SQLite.

## Gambaran Besar

Sir sir sekalian, untuk deploy ada 3 bagian:

1. build frontend
2. jalankan backend Node
3. sambungkan backend ke MongoDB

Kalau mau hasil yang enak dan stabil, saya saranin begini:

- frontend taruh di hosting web Hostinger
- backend taruh di Hostinger VPS atau Node hosting yang memang support process Node
- database pakai `MongoDB Atlas`

Catatan penting dari sisi Hostinger:

- Hostinger memang support `Node.js app`
- tapi `MongoDB` bukan database bawaan di hosting biasa mereka
- jadi jalur paling aman adalah `MongoDB Atlas` atau VPS yang memang kamu kelola sendiri

Kenapa saya saranin begitu:

- setup lebih rapi
- database tidak numpang di file lokal server
- backup dan scale lebih gampang
- pindah server nanti juga lebih santai

## Sebelum Mulai

Sir sir sekalian, pastikan ini dulu:

- repo project sudah up to date
- Node.js server pakai versi `20+`
- sudah punya `MongoDB Atlas URI`
- domain frontend dan domain backend sudah jelas

Contoh:

- frontend: `https://panel.paskus791.com`
- backend: `https://api.paskus791.com`

## Environment Variable Yang Wajib

Sir sir sekalian, backend tidak akan jalan benar kalau env ini belum diisi:

```env
NODE_ENV=production
API_PORT=8787
APP_ALLOWED_ORIGINS=https://domain-kamu.com
APP_SESSION_SECRET=isi-dengan-secret-random-panjang-dan-unik
APP_PASSWORD_PEPPER=isi-dengan-pepper-random-panjang-dan-unik
APP_TRUST_PROXY=true
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pelatihdash?retryWrites=true&w=majority
MONGODB_DB_NAME=pelatihdash
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=ganti-password-production
PELATIH_ADMIN_LABEL=Paskus Admin
PELATIH_ADMIN_UNIT=PASKUS 791
HCO_ADMIN_USERNAME=CosmoHCO
HCO_ADMIN_PASSWORD=ganti-password-production
HCO_ADMIN_LABEL=Strategic Admin
HCO_ADMIN_UNIT=HCO Strategic Command
DISCORD_STRATEGIC_WEBHOOK_URL=
PUBLIC_APP_URL=https://domain-kamu.com
```

Catatan santai tapi penting:

- `APP_SESSION_SECRET` jangan pakai kata gampang
- `APP_PASSWORD_PEPPER` jangan disamain dengan session secret
- `MONGODB_URI` jangan pernah ditaruh di frontend
- `.env` jangan ikut di-push ke GitHub

## Langkah 1 - Build Frontend

Sir sir sekalian, dari root project jalankan:

```bash
npm install
npm run build
```

Hasilnya akan masuk ke folder:

```text
dist/
```

Isi folder `dist/` inilah yang nanti di-upload ke hosting web frontend.

## Langkah 2 - Siapkan MongoDB Atlas

Sir sir sekalian, ini jalur yang paling gampang:

1. buat cluster di `MongoDB Atlas`
2. buat database user khusus aplikasi
3. buat database bernama `pelatihdash`
4. masukkan IP server Hostinger ke allowlist
5. copy connection string lalu taruh ke `MONGODB_URI`

Kalau belum punya data test, habis env siap bisa isi data dengan:

```bash
node scripts/reset-seed-dashboard.mjs
```

Script ini akan:

- reset data dashboard pelatih
- isi `50` pendaftar
- isi `10` akun pelatih
- simpan semuanya langsung ke MongoDB

## Langkah 3 - Deploy Backend di Hostinger

Sir sir sekalian, bagian ini paling cocok kalau backend jalan di:

- Hostinger VPS
- atau layanan Node hosting yang memang bisa jalanin process `npm start`

Kalau kamu pakai hosting biasa dan bukan VPS:

- frontend masih aman
- backend Node bisa tergantung paket yang kamu ambil
- tapi MongoDB internal jangan dipaksa di sana
- mending backend tetap connect ke `MongoDB Atlas`

Kalau server sudah siap:

1. clone repo ke server
2. masuk ke folder project
3. buat file `.env`
4. isi semua env yang tadi
5. install dependency
6. jalankan backend

Command dasar:

```bash
npm install
npm start
```

Kalau mau lebih proper, jalankan pakai process manager seperti `pm2`.

Contoh:

```bash
npm install -g pm2
pm2 start npm --name pelatihdash-api -- start
pm2 save
pm2 startup
```

## Langkah 4 - Upload Frontend ke Hostinger

Sir sir sekalian, kalau frontend mau ditaruh di hosting biasa Hostinger:

1. build dulu dengan `npm run build`
2. upload isi folder `dist/`
3. letakkan semua isi `dist/` ke folder web aktif
4. pastikan file rewrite tetap ada kalau dipakai

Karena project ini pakai `React Router`, route seperti:

- `/dashboard`
- `/hco`
- `/hco/dashboard`

harus tetap diarahkan ke `index.html`

Kalau tidak, nanti pas refresh halaman akan 404.

## Langkah 5 - Sambungkan Frontend ke Backend

Sir sir sekalian, bagian ini wajib cocok:

- domain frontend harus masuk ke `APP_ALLOWED_ORIGINS`
- backend harus bisa diakses frontend
- kalau backend pakai subdomain sendiri, pastikan HTTPS aktif

Contoh aman:

```env
APP_ALLOWED_ORIGINS=https://panel.paskus791.com
PUBLIC_APP_URL=https://panel.paskus791.com
```

Kalau frontend dan backend beda domain, pastikan origin frontend yang asli masuk ke env backend.

## Langkah 6 - Cek Health Backend

Sir sir sekalian, habis backend nyala cek ini:

```bash
curl http://localhost:8787/api/health
```

Kalau normal, hasilnya kira-kira begini:

```json
{"ok":true,"status":"online","database":"mongodb"}
```

Kalau health sudah bagus, baru lanjut test login.

## Langkah 7 - Test Login

Sir sir sekalian, test minimal ini:

1. login Staff
2. login HCO
3. buka dashboard pelatih
4. buka HCO Map Planner
5. cek save dan load data

Kalau ada data dashboard yang masih kosong dan kamu butuh data dummy untuk ngetes:

```bash
node scripts/reset-seed-dashboard.mjs
```

## Rekomendasi Setup Paling Aman

Sir sir sekalian, kalau saya yang set, saya akan pakai model ini:

- frontend di Hostinger web hosting
- backend di Hostinger VPS
- database di MongoDB Atlas
- backend dijaga pakai `pm2`
- domain frontend dan backend dua subdomain berbeda

Contoh:

- `https://panel.domainkamu.com` untuk frontend
- `https://api.domainkamu.com` untuk backend

## Kalau Mau Semua di Hostinger

Sir sir sekalian, ini catatan penting:

- kalau kamu cuma punya hosting web biasa, itu enak untuk frontend
- tapi backend Node + MongoDB lebih aman kalau pakai VPS
- kalau mau MongoDB jalan di lingkungan yang kamu kontrol penuh, VPS adalah jalur yang lebih masuk akal

Kalau tidak mau ribet urus database di server sendiri, pakai saja `MongoDB Atlas`.

## Checklist Sebelum Go Live

Sir sir sekalian, sebelum bilang deploy selesai, cek ini:

1. `.env` sudah benar
2. `MONGODB_URI` sudah benar
3. `APP_ALLOWED_ORIGINS` sudah sesuai domain
4. HTTPS sudah aktif
5. `npm run build` sukses
6. `npm start` sukses
7. `/api/health` normal
8. login Staff normal
9. login HCO normal
10. save planner dan save custom map normal

## Penutup

Sir sir sekalian, kalau mau singkatnya:

- frontend upload dari `dist/`
- backend jalan pakai `npm start`
- database wajib `MongoDB`
- env wajib rapi
- paling aman pakai Hostinger VPS + MongoDB Atlas

Kalau nanti mau, saya bisa lanjut bantu bikin:

- panduan `pm2 + Nginx`
- panduan subdomain frontend/backend
- checklist deploy versi super singkat buat tim

## Identitas Project

Hak kelola internal project ini berada pada:

- Team DUKUN PASKUS 791
- Jevier — Frontend
- Teddy — Backend
- Lee — Cyber Sector
- Osiris — Bot Manufactur
