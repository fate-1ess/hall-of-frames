import { defineConfig } from "vite";

const publicUrl = process.env.PUBLIC_URL || "/";
const normalizedBase = publicUrl.endsWith("/") ? publicUrl : `${publicUrl}/`;

export default defineConfig({
  base: normalizedBase,
  build: {
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],

    copyPublicDir: true,

    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
