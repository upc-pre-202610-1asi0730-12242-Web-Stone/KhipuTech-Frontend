import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@iam': path.resolve(__dirname, './src/iam'),
      '@visitor': path.resolve(__dirname, './src/visitor'),
      '@private': path.resolve(__dirname, './src/private'),
      '@public': path.resolve(__dirname, './src/public'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  }
})