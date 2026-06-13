# Recruitment Dispatch Backend

Folder ini dipisah biar tim backend lebih gampang cari bagian yang mau diubah tanpa bongkar satu file panjang.

## Peta File

- `config.mjs`
  - semua text utama
  - warna embed
  - timeout webhook
  - nama asset logo

- `payload.mjs`
  - validasi payload dispatch
  - normalisasi session, operator, laporan, dan lampiran

- `webhook.mjs`
  - susun embed Discord
  - kirim lampiran foto, logo, dan data tag ke Discord

- `service.mjs`
  - entry point alur dispatch
  - dipanggil dari backend utama

- `shared.mjs`
  - helper umum yang dipakai bareng

## Titik Config Yang Paling Sering Diubah

Kalau mau ubah isi embed, warna, nama webhook, timeout, atau asset logo:

- edit `config.mjs`

Kalau mau ubah struktur payload Discord:

- edit `webhook.mjs`
