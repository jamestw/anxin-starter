/// <reference types="vitest/config" />
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 共用 token 放在 repo 根目錄 tokens/，前端用 @tokens 引用
      '@tokens': path.resolve(__dirname, '../tokens'),
    },
  },
  server: {
    // 開發時 /api 轉給本機後端，前端程式一律打相對路徑 /api/v1/...
    proxy: { '/api': 'http://localhost:8000' },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
