/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: "#0a0d1a",
          surface: "rgba(255,255,255,0.05)",
          "surface-hover": "rgba(255,255,255,0.08)",
          "surface-active": "rgba(255,255,255,0.12)",
          border: "rgba(255,255,255,0.08)",
          "border-bright": "rgba(255,255,255,0.15)",
        },
        accent: {
          purple: "#7B2FFF",
          cyan: "#00D4FF",
          coral: "#FF4D8D",
          magenta: "#FF4D8D",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#a0aec0",
          muted: "#5a6578",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-pop": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,77,141,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(255,77,141,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out forwards",
        "scale-pop": "scale-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "pulse-glow": "pulse-glow 1.4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0,0,0,0.3)",
        "glow-purple": "0 4px 20px rgba(123,47,255,0.25)",
        "glow-cyan": "0 4px 20px rgba(0,212,255,0.25)",
        "glow-coral": "0 4px 20px rgba(255,77,141,0.25)",
        "glow-purple-lg": "0 8px 40px rgba(123,47,255,0.3)",
        "glow-cyan-lg": "0 8px 40px rgba(0,212,255,0.3)",
        "glow-coral-lg": "0 8px 40px rgba(255,77,141,0.3)",
      },
    },
  },
  plugins: [],
};
