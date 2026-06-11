import { defineConfig } from 'vite'
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    proxy: {
      "/v1/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
