import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    allowedHosts: true
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "app",
      filename: "sw.ts",
      registerType: "autoUpdate",
      manifest: {
        name: "MensaToday - Torino Piemonte",
        short_name: "MensaToday",
        description: "Daily menus for Mensas in Torino Piemonte region",
        theme_color: "#E83939",
        background_color: "#FBFCFD",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
    })
  ],
});
