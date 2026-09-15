import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function preloadLatinFont() {
  return {
    name: "preload-latin-font",
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      const fontFile = Object.keys(ctx.bundle).find(
        (key) => key.includes("roboto-latin-400-normal") && key.endsWith(".woff2"),
      );
      if (!fontFile) return html;
      return html.replace(
        "</title>",
        `</title>\n    <link rel="preload" href="/${fontFile}" as="font" type="font/woff2" crossorigin />`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadLatinFont()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@mui") || id.includes("node_modules/@emotion")) {
            return "mui";
          }
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "react";
          }
        },
      },
    },
  },
});
