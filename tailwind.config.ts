import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './__tests__/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        weather: {
          low: '#1D9BF0',
          medium: '#F59E0B',
          high: '#DC2626',
          safe: '#16A34A',
        },
      },
    },
  },
  plugins: [],
}

export default config