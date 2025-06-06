import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  // Cho phép thăng Vite sử dụng được process.env, mặc định thì không mà sẽ phải dùng import.meta.env
  define: {
    'process.env': process.env
  },
  plugins: [
    react(),
    svgr(),
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
