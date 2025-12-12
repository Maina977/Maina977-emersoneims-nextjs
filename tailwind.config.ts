import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Includes components folder
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-gold": "var(--brand-gold)",
        "brand-gold-dark": "var(--brand-gold-dark)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        display: ["var(--font-display)"],
        hero: ["var(--font-hero)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        "depth-1": "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
        "depth-2": "0 8px 24px -4px rgba(0, 0, 0, 0.12)",
        "depth-3": "0 16px 40px -6px rgba(0, 0, 0, 0.16)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        cinematic: "opacity, transform, filter",
      },
    },
  },
  plugins: [],
  // Note: Tailwind v4 handles safelist differently - classes are auto-detected
  // If needed, add classes to content globs instead
};

export default config;
