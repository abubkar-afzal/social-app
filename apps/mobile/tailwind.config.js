// apps/mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    '../../packages/ui/src/components/mobile/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/components/Avatar.jsx',
    '../../packages/ui/src/utils/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Static fallback palette.
        // Dynamic theming on mobile uses useTheme() → style={{ color }} at runtime.
        primary: {
          DEFAULT: '#e6005c',
          light: '#ff6b9d',
          dark: '#a60042',
        },
        background: '#f8f9fa',
        surface: '#ffffff',
        text: {
          DEFAULT: '#1a1a1a',
          secondary: '#6b7280',
        },
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        base: ['System', 'sans-serif'],
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 16,
        full: 9999,
      },
    },
  },
  plugins: [],
};