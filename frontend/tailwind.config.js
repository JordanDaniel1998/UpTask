/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sanf-serif"],
      },
      screens: {
        "3xl": "1700px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
