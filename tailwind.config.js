/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        red: { 
          100: '#fbe9e9',
          200: '#f4bdbd',
          300: '#ea7c7c',
          500: '#e35151',
          600: '#dc2626',
          700: '#b01e1e',
          800: '#841616',
          900: '#580f0f'
        },
        red_light: '#e35151',
        red_dark: '#b01e1e',
        blue: {
          100: '#e9e9fb',
          200: '#bdbdf4',
          500: '#5151e3',
          600: '#2626dc',
          700: '#1a1a9a',
          800: '#1e1eb0'
        },
        blue_light: '#6767e6',
        blue_dark: '#1a1a9a',
      }
    },
  },
  plugins: [],
}