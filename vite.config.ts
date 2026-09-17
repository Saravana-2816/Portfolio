import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

/**
 * Preloads the Latin subsets of the display and body fonts. Their file names are
 * hashed at build time, so the links are added from the final bundle. Fetching them
 * alongside the script means the hero rarely has to wait for fonts before it reveals.
 */
function preloadFonts(patterns: RegExp[]): Plugin {
  return {
    name: "preload-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        return Object.keys(ctx.bundle ?? {})
          .filter((file) => patterns.some((pattern) => pattern.test(file)))
          .map((file) => ({
            tag: "link",
            attrs: { rel: "preload", href: `/${file}`, as: "font", type: "font/woff2", crossorigin: "" },
            injectTo: "head" as const,
          }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    preloadFonts([/space-grotesk-latin-wght-normal-.*\.woff2$/, /inter-latin-wght-normal-.*\.woff2$/]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
