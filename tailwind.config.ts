import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // 🪐 COLORS: Depth layers + inclusive gold
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        brand: {
          gold: 'var(--brand-gold)',
          'gold-highlight': 'var(--brand-gold-highlight)',
          deep: 'var(--brand-deep)',
          surface: 'var(--brand-surface)',
        },
      },

      // 🌌 BOX-SHADOW: Cinematic depth system
      boxShadow: {
        // Depth layers (like Apple's UI)
        'depth-1': 'var(--shadow-depth)',
        'depth-2': '0 12px 32px rgba(0, 0, 0, 0.12)',
        'depth-3': '0 20px 40px rgba(0, 0, 0, 0.18)',

        // ✨ Aurora glow — warm, volumetric
        'aurora-glow': 'var(--brand-glow)',
        'aurora-glow-strong': '0 0 40px rgba(230, 184, 0, 0.6)',
      },

      // 🌀 ANIMATIONS: Purposeful, safe, delightful
      animation: {
        'aurora-pulse': 'auroraPulse 3s ease-in-out infinite',
        'depth-rise': 'depthRise 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'text-stagger': 'textStagger 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both',
      },
      keyframes: {
        auroraPulse: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(230, 184, 0, 0.25)' },
          '50%': { boxShadow: '0 0 32px rgba(230, 184, 0, 0.45)' },
        },
        depthRise: {
          '0%': { transform: 'translateY(4px)', opacity: 0.8 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        textStagger: {
          '0%': { transform: 'translateY(16px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },

      // 🔤 TYPOGRAPHY: Futuristic + fallback-safe
      fontFamily: {
        sans: ['"Geist", "SF Pro Display", "Segoe UI", sans-serif'],
        mono: ['"Geist Mono", "SF Mono", "Consolas", monospace'],
      },

      // 📐 SPACING: Rhythmic scale (4px base → 2px micro)
      spacing: {
        '0.5': '0.125rem', // 2px — for hairline borders, micro-gaps
        '1.5': '0.375rem', // 6px
      },

      // 🌀 TRANSFORM: 3D depth (for cards, modals)
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
    },
  },
  plugins: [],
};

export default config;




