/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        popover: "hsl(var(--popover))",

        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",

        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },

      borderRadius: {
        xl: "1rem",
        lg: "0.75rem",
      },

      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.08)",
      },
    },
  },

  plugins: [],
};