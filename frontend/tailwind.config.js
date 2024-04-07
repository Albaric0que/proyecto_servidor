/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        books: {
          100: "#ede7f9",
          200: "#DCD6F7",
          400: "#a6b1e1",
          800: "#424874",
        },
        buttons: {
          delete: "#FF6464",
          update: "#FFE162",
          create: "#91C483",
        },
      },
    },
  },
  plugins: [],
};
