// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: {
        DEFAULT: '#FF9000',
      },
      text: {
        DEFAULT: '#FFFFFF',
        dark: '#000000',
      },
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
})
