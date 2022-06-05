const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        google: ["Googlesansregular"],
        googlebold: ["Googlesansbold"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      ...defaultTheme.screens,
      nw: "800px",
      ms: "550px",
    },
  },
  plugins: [],
};
