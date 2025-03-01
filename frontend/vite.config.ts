import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Use Docker service name instead of localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // ตัดคำว่า /api ออก
      },
    },
  },
});
