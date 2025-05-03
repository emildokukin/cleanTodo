import { defineConfig } from "vite";
// import istanbul from "vite-plugin-istanbul";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "",
  plugins: [react()],
  build: {
    // sourcemap: true, // enable production source maps
    cssCodeSplit: false,
    minify: false,
    rollupOptions: {
      treeshake: true,
      output: {
        // Устанавливаем шаблон имени для входного файла (например, main.js)
        entryFileNames: "assets/[name].js", // или 'custom-name.js' если один вход
        chunkFileNames: "assets/[name]-chunk.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
  css: {
    devSourcemap: true, // enable CSS source maps during development
    // modules: {
    //   localsConvention: "camelCase", // Для корректной работы CSS-модулей
    // },
    modules: {
      generateScopedName: (name, filename) => {
        const file = filename
          .split("/")
          .pop()
          ?.replace(/\.[^/.]+$/, "")
          ?.replace(".", "_"); // убираем путь и расширение

        return `${file}__${name}`;
      },
    },
  },
});

// vite.config.js
