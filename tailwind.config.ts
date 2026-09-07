import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C9232A",
          darkRed: "#9F171D",
          lightRed: "#FEE2E2",
          yellow: "#F2C94C",
          deepYellow: "#D9A726",
          cream: "#F7F1E5",
          warmWhite: "#FFFDF8",
          charcoal: "#171717",
          charcoalSoft: "#222222",
          muted: "#6F6B63",
          border: "#E6DED0",
          borderLight: "#F0EBE1",
          surface: "#FDFCFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-devanagari)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.035em",
        tighter: "-0.02em",
        wideUpper: "0.12em",
        widestUpper: "0.2em",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        card: "0 2px 8px rgba(23,23,23,0.04), 0 1px 2px rgba(23,23,23,0.02)",
        elevated: "0 10px 25px -5px rgba(23,23,23,0.08), 0 8px 10px -6px rgba(23,23,23,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;