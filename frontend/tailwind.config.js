/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gallery: {
          ivory: '#F5F0E8',
          cream: '#EAE2D5',
          charcoal: '#252321',
          brown: '#47382F',
          gold: '#B49A65',
          'gold-light': '#D1BC8A',
          'gold-dark': '#8E7745',
          grey: '#858078',
          parchment: '#FAF7F2',
          surface: '#FDFBF7',
          border: '#E2D9CB',
          subtle: '#D8CEBF',
          dark: '#1C1A19',
          darker: '#141312',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gallery': '0 10px 30px -10px rgba(37, 35, 33, 0.12), 0 4px 6px -2px rgba(37, 35, 33, 0.04)',
        'gallery-lg': '0 20px 40px -15px rgba(37, 35, 33, 0.2), 0 8px 12px -3px rgba(37, 35, 33, 0.06)',
        'frame': '0 0 0 1px #B49A65, 0 15px 35px -5px rgba(37, 35, 33, 0.25)',
        'frame-walnut': '0 0 0 8px #47382F, 0 20px 30px -5px rgba(20, 19, 18, 0.4)',
        'frame-gold': '0 0 0 6px #B49A65, 0 0 0 8px #D1BC8A, 0 20px 35px -5px rgba(37, 35, 33, 0.3)',
      },
      letterSpacing: {
        'widest-gallery': '0.2em',
      },
    },
  },
  plugins: [],
};

