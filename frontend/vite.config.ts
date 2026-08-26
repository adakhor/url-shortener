import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    // Всё, что начинается с /api, отправляем на Express.
    // Для React запрос остаётся обычным fetch("/api/...").
    proxy: {
      "/api": "http://localhost:3000",
    },

    // Проект находится на Windows-диске и запускается из WSL.
    // Polling помогает Vite замечать изменения файлов.
    watch: {
      usePolling: true,
    },
  },
});