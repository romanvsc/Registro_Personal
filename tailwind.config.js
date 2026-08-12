/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF7', 100: '#FAF5EC', 200: '#F3EBDD',
          300: '#E8DCCB', 400: '#D5C3AC', 500: '#B9A187',
        },
        sand: {
          50: '#FBF8F3', 100: '#F2ECE3', 200: '#E5DBCF',
          300: '#D2C1B2', 400: '#B7A08D',
        },
        cocoa: {
          950: '#241D19', 900: '#302720', 800: '#463A31',
          700: '#5C4D42', 600: '#756357', 500: '#928075', 400: '#AF9E94',
        },
        dorito: {
          50: '#FFF6EB', 100: '#FFE8CE', 200: '#FFD09D', 300: '#F9B66C',
          400: '#EA963D', 500: '#D97822', 600: '#B95D17', 700: '#924414',
        },
        felicia: {
          50: '#F8F5EC', 100: '#EEE8D5', 200: '#DDD3AE', 300: '#C6B77F',
          400: '#A89A5F', 500: '#877D49', 600: '#6D653B', 700: '#56502F',
        },
        felipa: {
          50: '#F5F5F4', 100: '#E7E5E4', 200: '#D6D3D1', 300: '#A8A29E',
          400: '#78716C', 500: '#57534E', 600: '#44403C', 700: '#292524',
          800: '#1C1917', 900: '#12100F',
        },
        success: { 50: '#EFF8F0', 500: '#64966A', 600: '#517C57' },
        warning: { 50: '#FFF6E5', 500: '#EAA13A', 600: '#C98120' },
        danger: { 50: '#FDF0EC', 500: '#C96855', 600: '#A85041' },
        info: { 50: '#EEF5F5', 500: '#668D8D', 600: '#527373' },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        soft: '0 4px 18px rgba(76, 61, 47, 0.07)',
        card: '0 8px 30px rgba(76, 61, 47, 0.08)',
        float: '0 12px 40px rgba(76, 61, 47, 0.12)',
      },
    },
  },
  plugins: [],
}
