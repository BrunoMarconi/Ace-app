/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        acid: "#1F7A43",
        "acid-d": "#165C32",
        ink: "#141B2E",
        "txt-2": "#5A6478",
        "txt-3": "#9AA3B2",
        bg: "#F7F8FA",
        "card-2": "#F1F3F6",
      },
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
