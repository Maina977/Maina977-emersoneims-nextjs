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
        gold: {
          400: '#FFD166',
          500: '#FFD166',
        },
        'brand-gold': '#FFD166',
        // Apple-inspired colors
        'apple': {
          white: '#ffffff',
          black: '#000000',
          gray: {
            50: '#fafafa',
            100: '#f5f5f7',
            200: '#e8e8ed',
            300: '#d2d2d7',
            400: '#86868b',
            500: '#6e6e73',
            600: '#424245',
            700: '#1d1d1f',
          },
          blue: '#0071e3',
        },
        'premium': {
          gold: '#c9a227',
          'gold-light': '#f5d77a',
          cyan: '#06b6d4',
        },
      },
      spacing: {
        // Apple-style generous spacing
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        'section': '8rem',
        'section-lg': '10rem',
      },
      fontSize: {
        // Apple-style display sizes
        'display': ['clamp(2.5rem, 8vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'headline': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  // Future-proof CSS features
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
export default config;
