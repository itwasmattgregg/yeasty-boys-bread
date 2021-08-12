const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      red: "#C40101",
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      yellow: colors.amber,
    },
    fontFamily: {
      sans: ["Sora", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      zIndex: {
        "-10": "-10",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addBase, theme }) {
      addBase({
        a: { color: theme("colors.red"), textDecoration: "underline" },
      });
    }),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "0 1px 1px rgba(0,0,0,0.60)",
        },
      };

      addUtilities(newUtilities, ["responsive"]);
    }),
  ],
};
