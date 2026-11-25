/**
 * Content-safety withdrawal (management rule, 2026-11-25).
 *
 * The independent content audit of 2026-11-25
 * (oracle-content-audit-2026-11-25/CONTENT-SAFETY-CLASSIFICATION.md) classed
 * generator guidance as A (identification), B (check against the OEM) or C
 * (withdraw): instructions to run, crank, reset-and-test or load-test a set in
 * a STOP-type condition, numeric operating/shutdown limits with no cited
 * model-specific manufacturer source, missing STOPs, and e-stop resets before
 * the cause is found. C content is withdrawn until it is corrected and
 * independently reviewed; where a visible block is removed, this notice shows
 * in its place (via components/safety/SafetyChecksWithdrawnNotice.tsx, or this
 * string directly inside markdown/data content).
 *
 * Server-safe (no React): data files and builders can import it.
 */

export const CONTENT_SAFETY_WITHDRAWN_MESSAGE =
  'These steps are temporarily withdrawn while safety checks are updated. Consult the OEM service manual for your model and a qualified technician.';

/** Replacement for an unsourced numeric limit. Never substitute a figure. */
export const PER_OEM_MANUAL = 'per the OEM manual for your model';
