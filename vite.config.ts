import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const isDev = mode === 'development'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],
    base: '/',

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: isDev
      ? {
          proxy: {
            '/api': {
              target: env.VITE_API_BASE_URL,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
  }
})
