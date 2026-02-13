const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      ...defaultTheme.screens,
      xl2: "1240px",
    },
    extend: {
      colors: {
        brand: "#EF554A",
        heading: "#333333",
        light: "#F6F6F6",
        dark: "#272727",
        black: "#000000",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
        display: ['"Clash Display"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
