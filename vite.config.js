import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@iam': path.resolve(__dirname, './src/iam'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@visiting': path.resolve(__dirname, './src/visiting'),
      '@operation': path.resolve(__dirname, './src/operation'),
      '@analytics': path.resolve(__dirname, './src/analytics')
    }
  }
})