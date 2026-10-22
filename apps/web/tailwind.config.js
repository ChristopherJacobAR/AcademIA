/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        sci: {
          dark: '#090d16',
          card: '#111827',
          border: '#1f293d',
          physics: '#38bdf8',
          math: '#a78bfa',
          chem: '#34d399',
          eng: '#fbbf24'
        }
      },
      screens: {
        'ipad-p': { 'raw': '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)' },
        'ipad-l': { 'raw': '(min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)' }
      }
    },
  },
  plugins: [],
};
