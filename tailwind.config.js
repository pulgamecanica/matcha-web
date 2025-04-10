/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // example
      },
      colors: {
        primary: '#646cff',
        background: '#121212',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
