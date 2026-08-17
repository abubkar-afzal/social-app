/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,jsx,ts,tsx}',
  '../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  '../packages/ui/src/components/desktop/**/*.{js,jsx,ts,tsx}',
],
  theme: {
    extend: {
      colors: {
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
        base: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};