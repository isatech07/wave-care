/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      colors: {
        wave: {
          bg: "#F4EFEA",
          green: "#6A8F7A",
          text: "#3B3B3B"
        }
      }
    },
  },
  plugins: [],
}