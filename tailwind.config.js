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
        brand: {
          bg: "#FAFAF7",
          cobalt: "#2D4CC8",
          "cobalt-dark": "#1E3694",
          navy: "#0D1B6E",
          coral: "#E8603C",
          amber: "#D4940A",
          emerald: "#1A7A4A",
          surface: "#FFFFFF",
          "text-primary": "#1A1A2E",
          "text-secondary": "#6B6B8A",
          border: "#E8E8F0",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out forwards",
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(26,26,46,0.07), 0 4px 16px 0 rgba(26,26,46,0.05)",
        "card-md": "0 2px 8px 0 rgba(26,26,46,0.08), 0 8px 24px 0 rgba(26,26,46,0.06)",
        cobalt: "0 4px 14px 0 rgba(45,76,200,0.25)",
        coral: "0 4px 14px 0 rgba(232,96,60,0.25)",
      },
    },
  },
  plugins: [],
};
