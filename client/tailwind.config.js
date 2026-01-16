/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark1: "#0D0D0D",
        dark2: "#1A1A1A",
        dark3: "#262626",
        light1: "#F2F2F2",
        light2: "#E6E6E6",
        light3: "#999999",
        accent1: "#83BD0F",
        accent2: "#0F49BD",
        danger: "#BD0F12",
      },
      fontFamily: {
        sans: ["Roboto_400Regular"], // default
        medium: ["Roboto_500Medium"],
        bold: ["Roboto_700Bold"],
      },
    },
  },
  plugins: [],
};
