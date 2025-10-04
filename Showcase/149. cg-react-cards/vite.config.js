import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const publicUrl = process.env.PUBLIC_URL || '/'
const normalizedBase = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`

// https://vitejs.dev/config/
export default defineConfig({
  base: normalizedBase,
  plugins: [react()],
})
