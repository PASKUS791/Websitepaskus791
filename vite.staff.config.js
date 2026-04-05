/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(projectRoot, "staff-site"),
  publicDir: resolve(projectRoot, "public"),
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8787",
      "/staff-api": {
        target: "https://api.paskus791.cloud",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: resolve(projectRoot, "dist-staff"),
    emptyOutDir: true,
  },
});
