import { defineConfig } from "vite";
import { resolve } from "path";

const sanitizeBase = (value) => {
  if (!value) return "/";
  if (value === "/") return "/";

  const trimmed = value.trim();
  const leading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return leading.endsWith("/") ? leading : `${leading}/`;
};

export default defineConfig(() => {
  const envBase =
    process.env.VITE_BASE_PATH ?? process.env.PUBLIC_URL ?? process.env.BASE ?? "/";
  const base = sanitizeBase(envBase);

  return {
    base,
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          work: resolve(__dirname, "work.html"),
          culture: resolve(__dirname, "culture.html"),
          directors: resolve(__dirname, "directors.html"),
          contact: resolve(__dirname, "contact.html"),
          film: resolve(__dirname, "film.html"),
        },
      },
      assetsInclude: [
        "**/*.jpeg",
        "**/*.jpg",
        "**/*.png",
        "**/*.svg",
        "**/*.gif",
      ],
      copyPublicDir: true,
    },
  };
});
