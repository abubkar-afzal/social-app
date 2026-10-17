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
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        onPrimary: 'var(--color-on-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
        },
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
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