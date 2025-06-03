import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3333,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@image": path.resolve(__dirname, "./src/assets/images"),
    },
  },
});
