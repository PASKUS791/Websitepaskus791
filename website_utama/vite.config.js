import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
    watch: {
      ignored: [
        "**/scratch/**",
        "**/cloudflare-streamer-worker/**",
        "**/public/**",
        "**/.git/**",
        "**/.DS_Store",
        "**/._*",
        "**/.gitkeep",
      ],
    },
  },
});
// ponytail: proxy added to forward php api calls to local php web server

