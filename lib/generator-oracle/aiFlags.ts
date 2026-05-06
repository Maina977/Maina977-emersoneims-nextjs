/**
 * Generator Oracle — AI rollout flags.
 *
 * The product ships first as a *non-AI* tool: Fault Centre, Controllers &
 * Simulators, Wiring Diagrams, Systems and Command remain fully usable, but
 * the three AI surfaces (Expert AI Chat, AI Visual Diagnostic, AI Parameter
 * Analysis) are gated behind an explicit kill-switch so that a stray
 * `ANTHROPIC_API_KEY` in a deployment cannot make a half-finished AI feature
 * appear "live" to end users.
 *
 * Two env vars are honoured:
 *
 *   - NEXT_PUBLIC_GENERATOR_ORACLE_AI_DISABLED  (client + server)
 *       Set to "true"/"1" to force-disable every AI surface in the UI. This
 *       is bundled into the client, so the AI panels render their
 *       "coming soon" notice synchronously without any flash of active UI.
 *
 *   - GENERATOR_ORACLE_AI_DISABLED             (server only, optional)
 *       Same effect, but only applies to API routes. Useful if the public
 *       flag must stay off for a partial rollout but the server should still
 *       refuse AI calls.
 *
 * Either flag, when set, makes:
 *   - the AI panels render <AIUnavailableNotice />
 *   - GET  /api/generator-oracle/expert-chat,    ai-visual-diagnose,
 *           ai-diagnose  report aiConfigured/aiEnabled = false
 *   - POST on the same routes return HTTP 503 with code AI_NOT_CONFIGURED
 *
 * Default behaviour (neither flag set) preserves the prior key-presence
 * detection — i.e. AI is available iff `ANTHROPIC_API_KEY` is set.
 */

function truthy(value: string | undefined | null): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes' || v === 'on';
}

/**
 * Public (client + server). Bundled into the browser build via the
 * `NEXT_PUBLIC_` prefix.
 */
export function isAIDisabledPublic(): boolean {
  return truthy(process.env.NEXT_PUBLIC_GENERATOR_ORACLE_AI_DISABLED);
}

/**
 * Server-side. Treats either the public or the server-only flag as a
 * disable signal.
 */
export function isAIDisabledServer(): boolean {
  return (
    truthy(process.env.NEXT_PUBLIC_GENERATOR_ORACLE_AI_DISABLED) ||
    truthy(process.env.GENERATOR_ORACLE_AI_DISABLED)
  );
}
