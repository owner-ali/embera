import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0908",
          50: "#F5F4F2",
          900: "#0A0908",
          950: "#050504",
        },
        char: {
          DEFAULT: "#161310",
          light: "#1F1B16",
        },
        ember: {
          50: "#FDF3EC",
          100: "#FAE3CE",
          200: "#F3C093",
          300: "#E89D5C",
          400: "#D97D34",
          500: "#C6541D",
          600: "#A83F16",
          700: "#822F12",
          800: "#5C2210",
          900: "#3A160A",
        },
        gold: {
          DEFAULT: "#D4A85A",
          light: "#E8CD97",
          dark: "#A9803B",
        },
        bone: {
          DEFAULT: "#EDE6D9",
          muted: "#C9C0AF",
        },
        smoke: {
          DEFAULT: "#8C8478",
          dark: "#5A544B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      backgroundImage: {
        "ember-glow":
          "radial-gradient(60% 60% at 50% 40%, rgba(198,84,29,0.35) 0%, rgba(198,84,29,0) 70%)",
        "grain": "url('/images/grain.png')",
      },
      boxShadow: {
        ember: "0 0 60px -12px rgba(198,84,29,0.45)",
        card: "0 20px 50px -20px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      letterSpacing: {
        widest2: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
