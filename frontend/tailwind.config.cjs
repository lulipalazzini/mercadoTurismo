/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2464eb',
          dark: '#1a4bb8',
          light: '#4885f5',
        },
        'blue-light': '#dbeafe',
        green: {
          DEFAULT: '#069669',
          light: '#d5e9e2',
        },
        orange: '#ea580b',
        yellow: '#fef3c6',
        red: '#be103c',
        pink: '#fce7f3',
        sky: '#8dcaf6',
      },
      fontFamily: {
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'slide-left': 'slideLeft 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
