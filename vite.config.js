import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: 'src/main.js',
      name: 'Voyager Docs',
      formats: ['umd'],
      fileName: 'voyager-docs'
    },
    rollupOptions: {
      external: ['vue', 'marked'],
      output: {
        globals: {
          vue: 'Vue',
          marked: 'marked',
        }
      }
    }
  }
})
