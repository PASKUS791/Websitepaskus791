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

function getNodeModulePackageName(id) {
  const nodeModulesSegment = id.split("node_modules/")[1];

  if (!nodeModulesSegment) {
    return null;
  }

  const segments = nodeModulesSegment.split("/");
  const [scopeOrName, maybeName] = segments;

  if (scopeOrName?.startsWith("@")) {
    return `${scopeOrName}/${maybeName}`;
  }

  return scopeOrName;
}

export default defineConfig({
  root: resolve(projectRoot, "staff-site"),
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
    outDir: resolve(projectRoot, "../dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          const packageName = getNodeModulePackageName(id);

          if (
            packageName === "react" ||
            packageName === "react-dom" ||
            packageName === "react-router" ||
            packageName === "react-router-dom" ||
            packageName === "scheduler"
          ) {
            return "react-vendor";
          }

          if (
            packageName === "framer-motion" ||
            packageName === "motion-dom" ||
            packageName === "motion-utils"
          ) {
            return "motion-vendor";
          }

          if (packageName === "recharts") {
            return "charts-vendor";
          }

          if (packageName === "axios" || packageName === "ethers") {
            return "app-vendor";
          }
        },
      },
    },
  },
});
