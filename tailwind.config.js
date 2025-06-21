import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import lineClamp from "@tailwindcss/line-clamp";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      blur: {
        xs: "2px",
        sm: "4px",
      },
      boxShadow: {
        subtle: "0 2px 4px rgba(0, 0, 0, 0.05)",
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [forms, typography, lineClamp],
};

export default config;
