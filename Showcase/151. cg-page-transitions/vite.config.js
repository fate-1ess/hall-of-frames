import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sanitizeBase = (value) => {
  if (!value) return './';

  const trimmed = value.trim();
  if (!trimmed || trimmed === '.' || trimmed === './') {
    return './';
  }

  if (trimmed === '/') {
    return '/';
  }

  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
};

const base = sanitizeBase(
  process.env.VITE_BASE_PATH || process.env.PUBLIC_URL || './'
);

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
});
