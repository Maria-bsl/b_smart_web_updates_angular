/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#015aa8",
        accent: "#f26f21",
        secondary: "#BBC1E0",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#015aa8",
          secondary: "#F26F21",
          accent: "#00BCD4",
          neutral: "#ffffff",
          "base-100": "#F6F8FC",
          "base-200": "#e1f5fd",
        },
      },
    ],
    darkTheme: false,
    styled: true,
  },
};