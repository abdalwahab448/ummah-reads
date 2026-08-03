import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        emeraldDeep: {
          50: "#eef8f4",
          100: "#d3eee4",
          200: "#a8dbc9",
          300: "#72bca4",
          400: "#3f947d",
          500: "#1d6f5b",
          600: "#145748",
          700: "#0f4137",
          800: "#0b3129",
          900: "#071f1a"
        },
        gold: {
          50: "#fff9e7",
          100: "#fff2c6",
          200: "#f8e293",
          300: "#eccc5d",
          400: "#ddb83d",
          500: "#D4AF37",
          600: "#b38d29",
          700: "#8d6f22",
          800: "#68531d",
          900: "#453813"
        }
      },
      boxShadow: {
        glass: "0 18px 80px rgba(7, 31, 26, 0.18)",
        soft: "0 10px 30px rgba(7, 31, 26, 0.08)"
      },
      backgroundImage: {
        "hero-sheen": "radial-gradient(circle at top left, rgba(212,175,55,0.22), transparent 26%), radial-gradient(circle at bottom right, rgba(29,111,91,0.24), transparent 32%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;