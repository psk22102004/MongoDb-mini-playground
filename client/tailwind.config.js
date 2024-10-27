/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        'dblack' : '#000000',
        'sblack' : '#212529',
      }
    },
  },
  plugins: [],
}