// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: {
        DEFAULT: '#FF9000',
        deep: '#E38000',
      },
      back: {
        DEFAULT: '#FFFFFF',
        dark: '#000000',
      },
      text: {
        DEFAULT: '#FFFFFF',
        dark: '#000000',
      },
      link: {
        DEFAULT: '#00B6D6',
      },
      important: '#FF605C',
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
