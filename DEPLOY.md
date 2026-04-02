# Deploy Guide

Project ini sudah disiapkan untuk deploy sebagai React + Vite SPA.

## Opsi 1: Vercel

1. Import repository GitHub ke Vercel.
2. Root directory pilih `PelatihDash` jika repository kamu berisi folder lain di atasnya.
3. Build command: `npm run build`
4. Output directory: `dist`

File `vercel.json` sudah menyiapkan rewrite agar route seperti `/dashboard`, `/hco`, dan `/hco/dashboard/saves` tetap jalan.

## Opsi 2: Netlify

1. Import repository GitHub ke Netlify.
2. Base directory pilih `PelatihDash` jika diperlukan.
3. Build command: `npm run build`
4. Publish directory: `dist`

File `netlify.toml` dan `public/_redirects` sudah menyiapkan fallback untuk React Router.

## Catatan

- Karena app ini memakai `BrowserRouter`, file rewrite/redirect wajib ada.
- Jika nanti kamu ingin deploy ke GitHub Pages, konfigurasi `base` di Vite perlu disesuaikan lagi.
- Build lokal tetap bisa dicek dengan:

```bash
npm run build
```
