# QA Beta Test Staff Portal

Dokumen ini dipakai sebagai panduan beta test sebelum deploy production untuk portal staff `PelatihDash`.

Status hasil uji per item:

- `LULUS`
- `GAGAL`
- `CATATAN`

## Informasi Build

- Tanggal uji: `....................`
- Domain uji: `....................`
- Branch / commit: `....................`
- Penguji: `....................`
- Environment: `Local / Staging / Production`

## Tujuan Beta Test

- Memastikan portal staff bisa dipakai operasional harian tanpa gangguan fatal.
- Memastikan seluruh alur staff-only berjalan stabil setelah pembersihan fitur HCO.
- Memastikan fitur dispatch recruiter ke Discord bekerja end-to-end, termasuk upload foto dan generate PDF.
- Memastikan deploy backend, frontend, MongoDB, dan webhook Discord siap dipakai tim operasional.

## Ruang Lingkup

- Login dan session staff
- Dashboard staff
- Data petugas
- Halaman butuh tindakan
- Halaman laporan sesi pelatihan
- Dispatch laporan ke resimen via Discord webhook
- Generate PDF laporan sesi
- Integrasi MongoDB
- Reverse proxy domain staff

## Persiapan Sebelum Uji

- [ ] Server Node aktif
- [ ] MongoDB aktif dan bisa diakses server
- [ ] File `.env` production sudah diisi lengkap
- [ ] `DISCORD_RECRUITMENT_WEBHOOK_URL` sudah valid
- [ ] Domain staff sudah mengarah ke server
- [ ] HTTPS aktif
- [ ] Build frontend terbaru sudah terpasang
- [ ] Minimal satu akun admin staff tersedia
- [ ] Minimal satu sesi pelatihan tersedia untuk diuji
- [ ] Minimal satu petugas memiliki `Discord User ID`

## Bukti Yang Wajib Dikumpulkan

- [ ] Screenshot halaman login
- [ ] Screenshot dashboard berhasil terbuka
- [ ] Screenshot halaman butuh tindakan
- [ ] Screenshot halaman petugas dengan `Discord User ID`
- [ ] Screenshot modal kirim laporan ke resimen
- [ ] Screenshot pesan Discord yang berhasil terkirim
- [ ] File PDF hasil dispatch berhasil dibuka
- [ ] Capture hasil `GET /api/health`

## Checklist P0

Item di bagian ini wajib `LULUS 100%` sebelum deploy final.

| No | Item Uji | Hasil | Catatan |
| --- | --- | --- | --- |
| P0-01 | Domain staff terbuka via HTTPS tanpa warning sertifikat |  |  |
| P0-02 | `GET /api/health` mengembalikan `ok: true` |  |  |
| P0-03 | Backend Node hidup stabil tanpa restart berulang |  |  |
| P0-04 | Koneksi MongoDB berhasil dan data bisa dibaca |  |  |
| P0-05 | Login staff berhasil dengan akun valid |  |  |
| P0-06 | Login staff gagal dengan pesan jelas saat kredensial salah |  |  |
| P0-07 | Session tetap aktif setelah refresh halaman |  |  |
| P0-08 | Logout berhasil dan session benar-benar hilang |  |  |
| P0-09 | Tidak ada fitur, route, atau UI HCO yang masih muncul |  |  |
| P0-10 | Dashboard staff terbuka tanpa blank page atau crash |  |  |
| P0-11 | Halaman butuh tindakan terbuka tanpa error `map undefined` |  |  |
| P0-12 | Halaman petugas bisa menambah petugas baru |  |  |
| P0-13 | `Discord User ID` petugas bisa disimpan dan tetap ada setelah reload |  |  |
| P0-14 | Halaman laporan sesi pelatihan bisa dibuka tanpa error |  |  |
| P0-15 | Edit laporan kandidat berhasil tersimpan |  |  |
| P0-16 | Tambah laporan tambahan berhasil tersimpan |  |  |
| P0-17 | Tombol `Kirim laporan ke resimen` membuka modal dispatch |  |  |
| P0-18 | Modal dispatch menerima upload foto JPG/PNG/WEBP |  |  |
| P0-19 | Dispatch berhasil membuat PDF laporan sesi |  |  |
| P0-20 | Discord menerima embed dengan logo dan banner |  |  |
| P0-21 | Discord menerima foto lampiran dari modal |  |  |
| P0-22 | Discord menerima file PDF hasil generate |  |  |
| P0-23 | Tag petugas Discord bekerja jika `Discord User ID` diisi |  |  |
| P0-24 | Jika webhook gagal, aplikasi menampilkan error jelas dan tidak freeze |  |  |

## Checklist P1

Item di bagian ini harus lulus mayoritas besar. Jika ada gagal, dampaknya tidak boleh memblokir operasional utama.

| No | Item Uji | Hasil | Catatan |
| --- | --- | --- | --- |
| P1-01 | Data petugas tetap konsisten setelah browser ditutup dan dibuka lagi |  |  |
| P1-02 | Arsip laporan sesi tetap konsisten setelah reload |  |  |
| P1-03 | Dispatch ditolak jika belum ada laporan sesi |  |  |
| P1-04 | Dispatch ditolak jika foto belum diisi |  |  |
| P1-05 | Isi PDF sesuai data sesi, golongan, instruktur, dan kandidat |  |  |
| P1-06 | Foto lampiran yang tampil di Discord sesuai file yang diunggah |  |  |
| P1-07 | Timestamp dan keterangan embed sesuai waktu dispatch |  |  |
| P1-08 | UI tetap responsif saat data kandidat dan laporan cukup banyak |  |  |
| P1-09 | Refresh halaman dalam seperti `/dashboard` atau halaman laporan tidak menghasilkan 404 |  |  |
| P1-10 | Proxy `/staff-api` tetap berjalan normal dari domain staff |  |  |
| P1-11 | Pesan timeout backend tampil jelas jika Discord lambat atau tidak terjangkau |  |  |
| P1-12 | Layout masih rapi di mobile saat login, buka dashboard, dan kirim dispatch |  |  |

## Checklist P2

Item di bagian ini penting untuk kualitas operasional dan keamanan, namun tidak selalu memblokir beta test awal.

| No | Item Uji | Hasil | Catatan |
| --- | --- | --- | --- |
| P2-01 | Tidak ada secret sensitif muncul di UI atau console browser |  |  |
| P2-02 | `.env` tidak ikut tersaji dari web server |  |  |
| P2-03 | Origin yang tidak valid ditolak backend |  |  |
| P2-04 | Upload file besar tidak membuat server crash |  |  |
| P2-05 | PM2 atau process manager restart otomatis saat server mati |  |  |
| P2-06 | Log server cukup jelas untuk melacak error webhook, login, dan database |  |  |
| P2-07 | Nginx reverse proxy berjalan normal untuk `/`, `/api`, dan `/staff-api` |  |  |

## Skenario Uji End-to-End

### Skenario 1 - Login dan Akses Dasar

- [ ] Buka domain staff
- [ ] Login dengan akun valid
- [ ] Pastikan dashboard terbuka normal
- [ ] Refresh halaman
- [ ] Logout
- [ ] Login lagi

### Skenario 2 - Data Petugas

- [ ] Buka halaman petugas
- [ ] Tambah petugas baru
- [ ] Isi `Discord User ID`
- [ ] Simpan perubahan
- [ ] Reload halaman
- [ ] Pastikan data tetap tersimpan

### Skenario 3 - Butuh Tindakan

- [ ] Buka halaman butuh tindakan
- [ ] Pastikan tidak ada crash
- [ ] Pastikan data laporan tampil
- [ ] Pastikan navigasi balik tetap normal

### Skenario 4 - Laporan Sesi

- [ ] Buka satu sesi pelatihan
- [ ] Edit satu laporan kandidat
- [ ] Tambah satu laporan tambahan
- [ ] Simpan perubahan
- [ ] Reload halaman
- [ ] Pastikan data tetap ada

### Skenario 5 - Dispatch Ke Resimen

- [ ] Buka sesi pelatihan yang sudah punya laporan
- [ ] Klik `Kirim laporan ke resimen`
- [ ] Upload foto lampiran
- [ ] Isi deskripsi dispatch
- [ ] Klik kirim
- [ ] Pastikan proses selesai tanpa hang
- [ ] Verifikasi embed Discord masuk
- [ ] Verifikasi petugas ter-tag
- [ ] Verifikasi PDF terlampir
- [ ] Verifikasi isi PDF bisa dibuka dan terbaca

## Format Laporan Bug

Gunakan format ini untuk setiap bug yang ditemukan:

- ID Bug: `BETA-001`
- Judul: `....................`
- Severity: `Critical / Major / Minor`
- Prioritas: `P0 / P1 / P2`
- Langkah Reproduksi: `....................`
- Hasil Aktual: `....................`
- Hasil Yang Diharapkan: `....................`
- Browser / Device: `....................`
- Screenshot / Video: `....................`
- Status: `Open / Fixed / Retest / Closed`

## Severity Guide

- `Critical`: aplikasi tidak bisa dipakai, login gagal total, data hilang, atau dispatch ke Discord tidak bisa dipakai sama sekali
- `Major`: fitur utama masih jalan sebagian tapi mengganggu operasional
- `Minor`: bug visual, typo, atau ketidaknyamanan yang tidak memblokir kerja

## Kriteria Go / No-Go

### GO

- [ ] Semua item P0 lulus
- [ ] Tidak ada bug `Critical` yang masih terbuka
- [ ] Bug `Major` yang tersisa tidak menghambat operasional utama
- [ ] Tim backend sudah verifikasi env, MongoDB, webhook Discord, dan reverse proxy

### NO-GO

- [ ] Ada item P0 yang gagal
- [ ] Dispatch ke Discord belum stabil
- [ ] Login atau session masih bermasalah
- [ ] Data laporan tidak konsisten setelah refresh
- [ ] Server tidak stabil atau sering restart

## Sign-Off

- QA / Tester: `....................`
- Backend: `....................`
- Frontend: `....................`
- PIC Operasional: `....................`
- Status akhir: `GO / NO-GO`
- Tanggal keputusan: `....................`
