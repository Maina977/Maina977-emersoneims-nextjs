/**
 * Searched-pin run gate (re-review of f89698e8, BLOCKING 1, 2026-11-25).
 *
 * The mechanism: the decision is made from the COORDINATES TO BE ANALYSED, at run time, never from
 * the history of edits. A pending (unconfirmed) searched pin is kept, whatever is typed, until it
 * is confirmed, replaced by another search or the device position, or a run happens elsewhere.
 * Every run entry point asks pinBlocksRun() with the coordinates it is about to analyse. Before,
 * editing the boxes dropped the pin as soon as an intermediate value differed (Backspace, clear),
 * and retyping the same numbers then ran an analysis at the unconfirmed place centre as
 * "Manual Entry".
 */
import { parseCoordPair } from './coordParse';

export interface SearchedPin { lat: string | number; lon: string | number; name: string; needsConfirm: boolean; confirmed: boolean }

/** Same point: within ~1 m (1e-5 degrees is 1.1 m of latitude). */
export const PIN_MATCH_DEG = 1e-5;

export function atPin(pin: SearchedPin | null | undefined, lat: number, lon: number): boolean {
  if (!pin || !Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  return Math.abs(Number(pin.lat) - lat) <= PIN_MATCH_DEG && Math.abs(Number(pin.lon) - lon) <= PIN_MATCH_DEG;
}

/** A run at these coordinates must be refused: they are an unconfirmed searched place centre. */
export function pinBlocksRun(pin: SearchedPin | null | undefined, lat: number, lon: number): boolean {
  return !!pin && pin.needsConfirm && !pin.confirmed && atPin(pin, lat, lon);
}

/** The searched-place name a run at these coordinates is labelled with (confirmed pins only). */
export function pinLabelFor(pin: SearchedPin | null | undefined, lat: number, lon: number): string | null {
  if (!pin || !atPin(pin, lat, lon)) return null;
  return !pin.needsConfirm || pin.confirmed ? pin.name : null;
}

/** The pin after a run at (lat, lon) started: a run elsewhere replaces an unconfirmed pin. */
export function pinAfterRun<T extends SearchedPin>(pin: T | null, lat: number, lon: number): T | null {
  if (!pin) return null;
  if (atPin(pin, lat, lon)) return pin;
  return pin.needsConfirm && !pin.confirmed ? null : pin;
}

/**
 * The point the two boxes hold, read by the SAME strict parser the run uses (coordParse.ts), so the
 * pin box is shown exactly when a run would be refused (a "lat, lon" pair in the latitude box counts).
 */
export function boxesToPoint(latBox: string, lonBox: string): { lat: number; lon: number } | null {
  const a = String(latBox ?? '').trim(), b = String(lonBox ?? '').trim();
  if (!a && !b) return null;
  const r = parseCoordPair(a, b);
  return 'error' in r ? null : { lat: r.lat, lon: r.lon };
}
