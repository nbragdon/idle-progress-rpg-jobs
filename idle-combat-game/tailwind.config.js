/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#264653',
          50: '#d4e4e8',
          100: '#b8d4db',
          200: '#8fb9c5',
          300: '#669eaf',
          400: '#3d8399',
          500: '#264653',
          600: '#1f3943',
          700: '#172b32',
          800: '#0f1c22',
          900: '#080e11',
        },
        teal: {
          DEFAULT: '#2a9d8f',
          50: '#d4f2ee',
          100: '#b8ebe5',
          200: '#8fe0d6',
          300: '#66d5c7',
          400: '#3dcab8',
          500: '#2a9d8f',
          600: '#217e73',
          700: '#195e56',
          800: '#113f39',
          900: '#081f1d',
        },
        gold: {
          DEFAULT: '#e9c46a',
          50: '#fdf9ed',
          100: '#faf3e1',
          200: '#f6e7c3',
          300: '#f1dca4',
          400: '#edd086',
          500: '#e9c46a',
          600: '#e0ad2e',
          700: '#b0851a',
          800: '#755912',
          900: '#3b2c09',
        },
        orange: {
          DEFAULT: '#f4a261',
          50: '#fef5ed',
          100: '#fdede0',
          200: '#fbdac0',
          300: '#f8c8a1',
          400: '#f6b681',
          500: '#f4a261',
          600: '#f07e22',
          700: '#c05e0d',
          800: '#803e09',
          900: '#401f04',
        },
        coral: {
          DEFAULT: '#e76f51',
          50: '#fef0ed',
          100: '#fae2dc',
          200: '#f5c5b9',
          300: '#f1a896',
          400: '#ec8b73',
          500: '#e76f51',
          600: '#db441e',
          700: '#a43316',
          800: '#6e220f',
          900: '#371107',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'glow': '0 0 25px rgba(42, 157, 143, 0.35)',
        'glow-warm': '0 0 25px rgba(244, 162, 97, 0.35)',
        'glow-coral': '0 0 25px rgba(231, 111, 81, 0.35)',
      }
    },
  },
  plugins: [],
}

