import { defineConfig } from 'vite'

const publicUrl = process.env.PUBLIC_URL || '/'
const normalizedBase = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`

export default defineConfig({
	base: normalizedBase,
})
