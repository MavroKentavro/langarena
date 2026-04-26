import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Basic Vite + React config. Kept minimal so future additions
// (routing, env handling, i18n, API clients) can slot in cleanly.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
