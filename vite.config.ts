import path from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import solidPlugin from 'vite-plugin-solid'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    solidPlugin(),
    UnoCSS(),
    Pages(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
