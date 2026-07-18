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
        violet: {
          50: "#fff3ee",
          100: "#ffe2d7",
          200: "#ffc6b2",
          300: "#ffa07f",
          400: "#ff875f",
          500: "#ff6a3d",
          600: "#df5238",
          700: "#b83d2b",
          800: "#8e3025",
          900: "#5f241d",
          950: "#32130f",
        },
        fuchsia: {
          50: "#fff7f2",
          100: "#ffebe1",
          200: "#ffd4c2",
          300: "#ffb595",
          400: "#ff9169",
          500: "#f2764d",
          600: "#cf5738",
          700: "#a9402d",
          800: "#813329",
          900: "#632a24",
          950: "#351510",
        },
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