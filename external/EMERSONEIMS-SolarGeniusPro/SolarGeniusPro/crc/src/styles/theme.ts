// ============================================
// MODERN SCI-FI THEME SYSTEM
// ============================================

export const theme = {
  // Primary Colors - Sci-Fi Neon
  colors: {
    // Main brand colors
    primary: '#00D9FF', // Cyan
    primaryDark: '#0099CC',
    secondary: '#FF006E', // Hot pink/magenta
    tertiary: '#FFBE0B', // Gold/yellow
    
    // Backgrounds
    darkBg: '#0A0E27', // Deep navy
    darkBgLight: '#1A1F3A', // Slightly lighter navy
    darkBgLighter: '#2A3050', // Even lighter
    cardBg: 'rgba(15, 30, 80, 0.7)',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)',
    gradientSecondary: 'linear-gradient(135deg, #FF006E 0%, #C41E3A 100%)',
    gradientNeon: 'linear-gradient(135deg, #00D9FF 0%, #FF006E 50%, #FFBE0B 100%)',
    
    // Text
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    
    // Status
    success: '#00FF88',
    warning: '#FFB000',
    danger: '#FF0055',
    info: '#00D9FF',
    
    // Glass/Transparency
    glassDark: 'rgba(10, 14, 39, 0.8)',
    glassLight: 'rgba(42, 48, 80, 0.6)',
  },
  
  // Animations
  animations: {
    glowPulse: `
      @keyframes glowPulse {
        0% { text-shadow: 0 0 10px rgba(0, 217, 255, 0.5); }
        50% { text-shadow: 0 0 20px rgba(0, 217, 255, 0.8); }
        100% { text-shadow: 0 0 10px rgba(0, 217, 255, 0.5); }
      }
    `,
    scan: `
      @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
    `,
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `,
    shimmer: `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
    `,
    slideIn: `
      @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `,
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  // Border Radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 217, 255, 0.1)',
    md: '0 4px 16px rgba(0, 217, 255, 0.2)',
    lg: '0 8px 32px rgba(0, 217, 255, 0.3)',
    glow: '0 0 20px rgba(0, 217, 255, 0.4)',
    glowPink: '0 0 20px rgba(255, 0, 110, 0.4)',
  },
  
  // Typography
  typography: {
    h1: `
      font-size: 3.5rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.1;
    `,
    h2: `
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      line-height: 1.2;
    `,
    h3: `
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.3;
    `,
    body: `
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.6;
    `,
    caption: `
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.4;
    `,
  },
};

export default theme;
