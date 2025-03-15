import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/small-weather-app",
  server: {
    port: 3000,
    hmr: {
      overlay: true,
      hot: true,
    },
  },
});
