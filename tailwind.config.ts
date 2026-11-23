import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: {
          light: "#f8fafc",
          dark: "#0b0f19",
        },
        card: {
          light: "#ffffff",
          dark: "#111827",
        },
        accent: {
          primary: "#10b981", // Emerald / Mint
          secondary: "#f59e0b", // Amber
          danger: "#ef4444", // Red
          info: "#06b6d4", // Cyan
          purple: "#8b5cf6", // Violet
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains)",
          "'JetBrains Mono'",
          "Consolas",
          "'Fira Code'",
          "monospace",
        ],
      },
      animation: {
        pulseFast: "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
