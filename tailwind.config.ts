import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        nfl: {
          navy: "#013369",
          red: "#D50A0A"
        }
      },
      fontFamily: {
        display: ["system-ui", "ui-sans-serif", "sans-serif"]
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      },
      animation: {
        pop: "pop 0.25s ease-out both",
        slideUp: "slideUp 0.35s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
