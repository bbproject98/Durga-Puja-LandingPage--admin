import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          crimson: "#9B111E",
          red: "#D92525",
          gold: "#D4AF37",
          amber: "#F59E0B",
          goldLight: "#FDE047",
          dark: "#0D0614",
          cardDark: "#170C24",
          cream: "#FFFDF8",
        },
      },
      fontFamily: {
        festive: ["'Rozha One'", "'Cinzel'", "serif"],
        royal: ["'Cinzel'", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      backgroundImage: {
        "alpana-pattern":
          "radial-gradient(rgba(212, 175, 55, 0.12) 1.5px, transparent 1.5px), radial-gradient(rgba(217, 37, 37, 0.08) 1.5px, transparent 1.5px)",
      },
    },
  },
  plugins: [],
};

export default config;

