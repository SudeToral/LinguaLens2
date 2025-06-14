
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFF1CA",
        secondary: "#FFB823",
        tertiary: "#708A58",
        support: "#2D4F2B",
        light: {
          100: "#A0AB71",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#221F3D",
          200: "#0F0D23",
        },
        accent: "#FFEB3B",
      }
    },
  },
  plugins: [],
};