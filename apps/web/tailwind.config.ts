import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#e7efff",
          200: "#c9dbff",
          300: "#9cbaff",
          400: "#6b92ff",
          500: "#3d6bff",
          600: "#2c52db",
          700: "#2441ad",
          800: "#223987",
          900: "#1f2f6f"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.12)",
        glow: "0 12px 40px rgba(61, 107, 255, 0.25)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease",
        pulseSoft: "pulseSoft 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;

