import { defineConfig } from 'vite'

export default defineConfig({
  root: './app',  
  build: {
    outDir: '../dist',  
    rollupOptions: {
      input: {
        main: './app/public/views/index.html' 
      }
    }
  }
})