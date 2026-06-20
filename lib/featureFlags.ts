// ═══════════════════════════════════════════════════════════════════════════════
// Central feature flags.
//
// AI_TOOLS_FREE — when true, ALL AI tools (Generator Oracle, AquaScan Pro,
// Solar Genius Pro, Pro Building Suite, Diagnostic Suite, Solar & UPS Hub) are
// free: no subscription limits, no licence expiry, no payment paywall. The
// payment / subscription / licensing code is left fully intact so paid mode can
// be switched back on later WITHOUT a code change — just set the env var.
//
// Default: FREE. To re-enable paid mode later, set NEXT_PUBLIC_AI_TOOLS_PAID=true
// in the environment (Vercel) and redeploy.
// ═══════════════════════════════════════════════════════════════════════════════

export const AI_TOOLS_FREE = process.env.NEXT_PUBLIC_AI_TOOLS_PAID !== 'true';
