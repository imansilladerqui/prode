import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: https://<user>.github.io/prode/
export default defineConfig({
  base: '/prode/',
  plugins: [react()],
})
