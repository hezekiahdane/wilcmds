/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    colors: {
        'yellow': '#FDCC01',
        white: "#fff",
        dimgray: "#656565",
        black: "#000",
        gray: "#8d8d8e",
        gold: "rgba(253, 204, 1, 0.15)",
        silver: "rgba(182, 182, 183, 0.3)",
      },
    },
  },
  plugins: [],
}

