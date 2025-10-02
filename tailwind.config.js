/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'one-piece': {
          red: '#DC143C',
          green: '#228B22',
          orange: '#FF8C00',
          gold: '#FFD700',
          brown: '#DEB887',
          pink: '#FFB6C1',
          purple: '#9370DB',
          cyan: '#00CED1',
          gray: '#2F4F4F',
          blue: '#4682B4',
        }
      },
      fontFamily: {
        'pirate': ['Creepster', 'cursive'],
        'adventure': ['Bungee', 'cursive'],
      },
    },
  },
  plugins: [],
}
