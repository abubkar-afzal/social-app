// desktop/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../packages/ui/src/components/desktop/**/*.{js,jsx,ts,tsx}',
    '../packages/ui/src/components/Avatar.jsx',
    '../packages/ui/src/utils/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light-rgb) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark-rgb) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background-rgb) / <alpha-value>)',
        surface: 'rgb(var(--color-surface-rgb) / <alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--color-text-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary-rgb) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border-rgb) / <alpha-value>)',
        success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
        warning: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
        error: 'rgb(var(--color-error-rgb) / <alpha-value>)',
      },
      fontFamily: {
        base: 'var(--font-family-base)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
    },
  },
  plugins: [],
};