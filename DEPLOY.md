# Panduan Deploy Frontend Staff + MongoDB

Sir sir sekalian, file ini saya tulis biar pas deploy nanti tim tidak perlu nebak-nebak lagi. Buat setup sekarang, saya saranin kita pakai jalur yang paling enak:

- frontend build `React + Vite`
- backend `Node.js`
- database `MongoDB`
- website staff: `https://staff.paskus791.cloud`
- backend staff legacy ada di `https://api.paskus791.cloud`

Backend project ini sekarang sudah fokus ke `MongoDB`, jadi tidak ada lagi mode SQLite. Repo ini khusus frontend staff/pelatih, dan untuk data recruiter bisa memproxy backend legacy di `https://api.paskus791.cloud`.

## Gambaran Besar

Sir sir sekalian, untuk deploy ada 4 bagian:

1. build frontend
2. jalankan backend Node
3. sambungkan backend ke MongoDB
4. arahkan domain `staff.paskus791.cloud`

Kalau mau hasil yang enak dan stabil, saya saranin begini:

- backend Node + MongoDB jalan di `api.paskus791.cloud`
- frontend staff dideploy terpisah
- database pakai `MongoDB Atlas`

Catatan penting dari sisi Hostinger:

- Hostinger memang support `Node.js app`
- tapi `MongoDB` bukan database bawaan di hosting biasa mereka
- jadi jalur paling aman adalah `MongoDB Atlas` atau VPS yang memang Kita kelola sendiri

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

Contoh setup sekarang:

- staff frontend: `https://staff.paskus791.cloud`
- backend API: `https://api.paskus791.cloud`

## Environment Variable Yang Wajib

Sir sir sekalian, backend tidak akan jalan benar kalau env ini belum diisi:

```env
NODE_ENV=production
API_PORT=8787
APP_ALLOWED_ORIGINS=https://staff.paskus791.cloud
APP_SESSION_SECRET=isi-dengan-secret-random-panjang-dan-unik
APP_PASSWORD_PEPPER=isi-dengan-pepper-random-panjang-dan-unik
APP_TRUST_PROXY=true
VITE_STAFF_SITE_URL=https://staff.paskus791.cloud
VITE_STAFF_API_BASE_URL=/staff-api
STAFF_BACKEND_BASE_URL=https://api.paskus791.cloud
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pelatihdash?retryWrites=true&w=majority
MONGODB_DB_NAME=pelatihdash
DISCORD_RECRUITMENT_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
PELATIH_ADMIN_USERNAME=PaskusAdmin
PELATIH_ADMIN_PASSWORD=ganti-password-production
PELATIH_ADMIN_LABEL=Paskus Admin
PELATIH_ADMIN_UNIT=PASKUS 791
```

Catatan santai tapi penting:

- `APP_SESSION_SECRET` jangan pakai kata gampang
- `APP_PASSWORD_PEPPER` jangan disamain dengan session secret
- `MONGODB_URI` jangan pernah ditaruh di frontend
- `.env` jangan ikut di-push ke GitHub
- `APP_ALLOWED_ORIGINS` isi domain staff
- `VITE_STAFF_SITE_URL` isi domain staff
- `VITE_STAFF_API_BASE_URL` isi `/staff-api` agar browser tetap lewat domain staff
- `STAFF_BACKEND_BASE_URL` biarkan ke `https://api.paskus791.cloud` kalau backend tim lain tetap di sana
- `DISCORD_RECRUITMENT_WEBHOOK_URL` isi webhook recruiter untuk dispatch lampiran + PDF

Kalau tim backend mau ganti isi embed Discord, warna, timeout, nama webhook, atau asset logo/banner recruiter:

- cek [`server/recruitmentDispatch/config.mjs`](/Users/jerikho/Documents/New%20project/PelatihDash/server/recruitmentDispatch/config.mjs)

Kalau mau ubah format PDF atau payload Discord:

- cek folder [`server/recruitmentDispatch/`](/Users/jerikho/Documents/New%20project/PelatihDash/server/recruitmentDispatch)

## Langkah 1 - Build Frontend

Sir sir sekalian, dari root project jalankan:

```bash
npm install
npm run build
```

Hasilnya akan masuk ke folder:

```text
dist-staff/
```

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

## Langkah 3 - Deploy Backend di Hostinger / VPS

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
3. copy file env siap pakai
4. isi semua env yang tadi
5. install dependency
6. build frontend
7. jalankan backend

Command paling cepat:

```bash
cp deploy/staff.paskus791.cloud.env .env
```

Lalu edit paling tidak bagian:

- `MONGODB_URI`
- `PELATIH_ADMIN_PASSWORD`

Command dasar:

```bash
npm install
npm run build
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

## Langkah 4 - Arahkan Domain `staff.paskus791.cloud`

Sir sir sekalian, karena server ini sekarang bisa melayani frontend langsung, yang perlu dilakukan:

1. arahkan DNS `staff.paskus791.cloud` ke VPS / server Node ini
2. pasang reverse proxy `Nginx` ke port Node, misalnya `8787`
3. aktifkan HTTPS
4. biarkan request frontend, `/api`, dan `/staff-api` semua lewat domain itu

Karena project ini pakai `React Router`, route seperti:

- `/dashboard`

akan otomatis ditangani server Node ini ke `index.html`, jadi tidak perlu rewrite manual terpisah lagi.

Contoh config `Nginx` singkat:

```nginx
server {
    listen 80;
    server_name staff.paskus791.cloud;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Kalau pakai `certbot`, habis itu tinggal aktifkan HTTPS.

## Langkah 5 - Jalur API Yang Dipakai

Sir sir sekalian, jalur aplikasinya nanti begini:

- `https://staff.paskus791.cloud/` -> frontend
- `https://staff.paskus791.cloud/api/...` -> backend internal project ini
- `https://staff.paskus791.cloud/staff-api/...` -> diproxy server ini ke `https://api.paskus791.cloud`

Jadi browser user tidak perlu langsung ngobrol lintas domain ke backend staff luar. Ini lebih enak buat cookie, CORS, dan maintenance.

## Langkah 6 - Sambungkan Frontend ke Backend

Sir sir sekalian, bagian ini wajib cocok:

- `APP_ALLOWED_ORIGINS` isi dengan domain app utama
- `STAFF_BACKEND_BASE_URL` isi domain backend staff tim kamu

Contoh aman:

```env
APP_ALLOWED_ORIGINS=https://staff.paskus791.cloud
STAFF_BACKEND_BASE_URL=https://api.paskus791.cloud
```

## Langkah 7 - Cek Health Backend

Sir sir sekalian, habis backend nyala cek ini:

```bash
curl http://localhost:8787/api/health
```

Kalau normal, hasilnya kira-kira begini:

```json
{"ok":true,"status":"online","database":"mongodb"}
```

Kalau health sudah bagus, baru lanjut test login.

## Langkah 8 - Test Login

Sir sir sekalian, test minimal ini:

1. login Staff
2. buka dashboard pelatih
3. cek kandidat, pelatihan, hasil laporan, dan tambah petugas

Kalau ada data dashboard yang masih kosong dan kamu butuh data dummy untuk ngetes:

```bash
node scripts/reset-seed-dashboard.mjs
```

## Rekomendasi Setup Paling Aman

Sir sir sekalian, kalau saya yang set, saya akan pakai model ini:

- frontend build dan backend di VPS yang sama
- database di MongoDB Atlas
- backend dijaga pakai `pm2`
- domain utama aplikasi satu pintu di `staff.paskus791.cloud`
- backend staff luar tetap di `api.paskus791.cloud`

Contoh:

- `https://staff.paskus791.cloud` untuk aplikasi utama
- `https://api.paskus791.cloud` untuk backend staff tim lain

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
