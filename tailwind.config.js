/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2",
        danger: "#FF6B6B",
        dark: "#222831",

        bouquet: {
          50:  "#f9f6f8",
          100: "#f5eef3",
          200: "#ecdee8",
          300: "#ddc4d5",
          400: "#c79fb9",
          500: "#af7a9b",
          600: "#9d6585",
          700: "#84526d",
          800: "#6f455b",
          900: "#5e3d4e",
          950: "#37202c",
        },
      },
    },
  },
  plugins: [],
};
