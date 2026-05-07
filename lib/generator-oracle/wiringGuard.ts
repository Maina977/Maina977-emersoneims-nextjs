/**
 * Generator Oracle — controller-wiring guard.
 *
 * Previously WiringDiagramsPanel silently substituted DSE 7320 pin data
 * for any controller without an entry in CONTROLLER_PINS, including
 * PowerWizard, SmartGen, ComAp, Woodward, Datakom, Lovato, Siemens,
 * ENKO and Volvo Penta VODIA. That meant a technician exporting a
 * "PowerWizard 4.1" PDF would receive DSE 7320 wiring — a real safety
 * hazard.
 *
 * This module provides:
 *   - validateControllerWiringMatch — refuses to render mismatched data
 *   - WIRING_UNAVAILABLE_MESSAGE     — what the UI shows instead of fallback
 *   - WIRING_SAFETY_NOTICE           — universal pre-installation warning
 */

const norm = (s: string | undefined | null): string =>
  (s ?? '')
    .toLowerCase()
    .replace(/mkii?/g, '')
    .replace(/[\s_\-/().,]+/g, '');

export interface WiringMatchResult {
  ok: boolean;
  reason?: string;
}

/**
 * Returns ok=false when the selected controller's brand cannot
 * legitimately use the wiring's brand. Logs in dev for debuggability.
 * Conservative: same brand passes even if model differs (caller can
 * still surface a soft "verify against OEM manual" warning).
 */
export function validateControllerWiringMatch(
  selectedBrand: string,
  selectedModel: string,
  wiringBrand: string,
  wiringModel: string,
): WiringMatchResult {
  const sb = norm(selectedBrand);
  const wb = norm(wiringBrand);
  const sm = norm(selectedModel);
  const wm = norm(wiringModel);

  if (!sb || !wb) return { ok: true };

  const brandsMatch = sb === wb || sb.includes(wb) || wb.includes(sb);
  if (!brandsMatch) {
    const reason = `Blocked unsafe wiring mismatch: ${selectedBrand} cannot use ${wiringBrand} ${wiringModel} wiring.`;
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[wiringGuard]', reason, {
        selectedBrand,
        selectedModel,
        wiringBrand,
        wiringModel,
      });
    }
    return { ok: false, reason };
  }

  if (sm && wm && sm !== wm) {
    return {
      ok: true,
      reason: `Wiring shown is for ${wiringBrand} ${wiringModel}; selected model is ${selectedBrand} ${selectedModel}. Verify against OEM manual before installation.`,
    };
  }

  return { ok: true };
}

export const WIRING_UNAVAILABLE_MESSAGE =
  'Controller-specific wiring data is not yet available for this model. Do not use DSE 7320 wiring as a substitute.';

export const WIRING_SAFETY_NOTICE =
  'Final wiring must be confirmed against the OEM controller manual, alternator wiring diagram, engine harness, and site electrical design before installation.';
