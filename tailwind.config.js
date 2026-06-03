/** @type {import('tailwindcss').Config} */

// Bridge a CSS custom property (RGB triplet) into a Tailwind colour that still
// supports the opacity modifier syntax (e.g. `bg-ocean-deep/40`).
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ocean-deep': withAlpha('--ocean-deep'),
        'ocean-grand': withAlpha('--ocean-grand'),
        sunset: withAlpha('--sunset'),
        gold: withAlpha('--gold'),
        'pirate-red': withAlpha('--pirate-red'),
        'sea-foam': withAlpha('--sea-foam'),
        cloud: withAlpha('--cloud'),
        haki: withAlpha('--haki'),
        // Legacy palette retained for the not-yet-rewritten components.
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
        },
      },
      fontFamily: {
        // Display / poster faces
        display: ['Cinzel', 'Georgia', 'serif'],
        decorative: ['"Cinzel Decorative"', 'Cinzel', 'serif'],
        adventure: ['Bungee', 'cursive'],
        pirate: ['Creepster', 'cursive'],
        // Body / UI (Tajawal first so Arabic renders well)
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        ui: ['Tajawal', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid display scale
        'fluid-xl': 'clamp(2.2rem, 6vw, 4rem)',
        'fluid-2xl': 'clamp(2.8rem, 9vw, 6rem)',
        'fluid-3xl': 'clamp(3.4rem, 12vw, 8rem)',
      },
      boxShadow: {
        treasure:
          '0 4px 18px rgb(0 0 0 / 0.55), 0 0 26px 6px rgb(255 150 40 / 0.38), 0 0 48px 16px rgb(255 90 30 / 0.22)',
        'gold-ring': '0 0 0 1px rgb(255 213 74 / 0.5), 0 8px 30px rgb(255 138 0 / 0.35)',
        poster: '0 30px 60px -20px rgb(0 0 0 / 0.7), 0 10px 24px -12px rgb(0 0 0 / 0.6)',
        haki: '0 0 30px 4px rgb(124 58 237 / 0.5), 0 0 60px 18px rgb(124 58 237 / 0.28)',
      },
      dropShadow: {
        glow: ['0 0 18px rgb(255 170 40 / 0.55)', '0 0 36px rgb(255 110 10 / 0.35)'],
        poster: '0 12px 26px rgb(0 0 0 / 0.6)',
      },
      backgroundImage: {
        'sunset-cta': 'linear-gradient(110deg,#ffb347 0%,#ff7a33 30%,#ff4733 58%,#ff1d66 88%)',
        parchment:
          'radial-gradient(120% 120% at 30% 10%, #f6e4bd 0%, #ecd29a 45%, #d8b871 100%)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
};
