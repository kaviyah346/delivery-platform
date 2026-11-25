/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ups: {
          brown: '#351C15',
          'brown-dark': '#23120E',
          'brown-light': '#4A281F',
          gold: '#FFB500',
          'gold-hover': '#E6A300',
          'gold-light': '#FFF8E7',
          'gold-dark': '#C78C00',
          'gray-bg': '#F4F4F6',
          'gray-card': '#FFFFFF',
          'gray-border': '#E2E4E8',
          'gray-hover': '#ECEEF2',
          'text-dark': '#1F2937',
          'text-muted': '#6B7280',
          'text-light': '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
