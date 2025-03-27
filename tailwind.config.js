/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008080", // Teal for primary color
        secondary: "#cae2e4", // Light teal for secondary color
        marker: "#f54860", // Red for markers
      },
    },
  },
  plugins: [],
};
