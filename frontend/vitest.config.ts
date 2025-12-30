import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [vue()],
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
