/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-light": "hsl(210, 78%, 55%)",
        primary: "hsl(210, 79%, 46%)",
        "primary-dark": "hsl(210, 80%, 35%)",
        secondary: "#A3D7FF",
        bglight: "#EBF5FF",
      },
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  plugins: [],
};
