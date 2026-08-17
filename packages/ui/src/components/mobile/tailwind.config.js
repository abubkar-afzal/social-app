// tailwind.config.js (shared, but for native we use hex directly)
module.exports = {
  content: ['.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
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
        base: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
};