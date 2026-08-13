import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const apiBasePath = '/registro_gatos'

export default defineConfig({
  base: `${apiBasePath}/`,
  plugins: [vue()],
  server: {
    port: 5125,
    strictPort: true,
    proxy: {
      [`${apiBasePath}/api`]: {
        target: 'http://127.0.0.1:8000',
        rewrite: (path) => path.replace(apiBasePath, ''),
      },
    },
  },
})