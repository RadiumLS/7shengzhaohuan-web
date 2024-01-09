/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        boku: 'rgb(225,138,52)',
        bgboku: 'rgba(225,138,52, 0.66)',
        kimi: 'rgb(89,154,239)',
        bgkimi:'rgba(89,154,239, 0.66)',
      }
    },
  },
  plugins: [],
}