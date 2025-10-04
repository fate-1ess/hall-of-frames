import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    assetsInclude: ["**/*.glb", "**/*.jpeg", "**/*.jpg", "**/*.png", "**/*.svg", "**/*.gif"],
    copyPublicDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
