import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF3E6",
        paper: "#FFFBF4",
        ink: "#2B1B24",
        teal: {
          DEFAULT: "#114952",
          dark: "#0B363D",
        },
        magenta: {
          DEFAULT: "#C3185B",
          light: "#E85C93",
        },
        marigold: {
          DEFAULT: "#E2892B",
          light: "#F0BD4C",
        },
        olive: {
          DEFAULT: "#78873A",
          light: "#A3B45C",
        },
        plum: "#5B1F49",
        orchid: "#8E44AD",
        turquoise: "#2AA9A0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        keepsake: "36rem",
      },
      keyframes: {
        "petal-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "unlock-bloom": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "petal-in": "petal-in 0.6s ease-out both",
        "unlock-bloom": "unlock-bloom 0.7s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
