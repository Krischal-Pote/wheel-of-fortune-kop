import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      exclude: ["src/main.tsx", "src/App.tsx", "**/*.test.*", "**/*.spec.*"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "WheelOfFortune",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm" : "cjs"}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "papaparse"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          papaparse: "Papa",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
