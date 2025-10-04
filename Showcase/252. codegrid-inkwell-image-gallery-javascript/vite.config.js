import { defineConfig } from "vite";

const resolveBase = () => {
  const raw = process.env.PUBLIC_URL;

  if (!raw) {
    return "./";
  }

  if (raw === "./") {
    return raw;
  }

  return raw.endsWith("/") ? raw : `${raw}/`;
};

export default defineConfig({
  base: resolveBase(),
});
