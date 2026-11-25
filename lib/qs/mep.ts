/**
 * Building Suite Pro: electrical and plumbing (MEP) trades (2026-11-25).
 *
 * Same contract as lib/qs/trades: every quantity comes from a take-off
 * measurement or from a parameter entered with its source; the line records
 * its formula and inputs; nothing is assumed or defaulted. A row with no
 * measurable basis (no take-off measurement, or an enumerated item with no
 * count and source) is refused with the reason: it is flagged, never guessed.
 *
 * Method of measurement (convention reference only, no clause numbers are
 * claimed): points, accessories, fixtures, boards and fittings are enumerated
 * (No); cable, conduit and pipe runs are linear (m), measured along the run as
 * drawn on plan, with the vertical drops/rises and any allowance stated as
 * separate inputs. This follows the general approach of RICS NRM2 and SMM7
 * (services measured by length, components enumerated) and the "per point"
 * practice common in East African building BOQs. See
 * docs/engineering/building-mep-and-rate-buildups.md.
 *
 * Double counting: a "point" rate in East African practice is often deemed to
 * include the wiring back to the board. Pricing both such a point rate and the
 * cable/conduit runs counts the wiring twice. The QS decides which is priced.
 */
import type { Quantity } from './takeoff';
import { TradeError, type Param, type TradeLine } from './trades';

export const MEP_ENGINE_VERSION = 'qs-mep 1.0.0 (2026-11-25)';

const r3 = (x: number) => Math.round(x * 1000) / 1000;

function need(name: string, p: Param | undefined, min: number, max: number, unit: string): number {
  if (!p || !Number.isFinite(p.value)) throw new TradeError(`${name} is required (${unit})`);
  if (!p.source?.trim()) throw new TradeError(`${name}: give its source (drawing, section, schedule or specification)`);
  if (!(p.value >= min && p.value <= max)) throw new TradeError(`${name} = ${p.value} ${unit} is outside ${min}–${max} ${unit}; check the drawing`);
  return p.value;
}
function needInt(name: string, p: Param | undefined, min: number, max: number): number {
  const v = need(name, p, min, max, 'No');
  if (!Number.isInteger(v)) throw new TradeError(`${name} must be a whole number`);
  return v;
}
function measured(name: string, q: Quantity | undefined, kind: Quantity['kind']): number {
  if (!q) throw new TradeError(`${name}: no measurable basis — a ${kind} measurement from the take-off is required (it is not guessed)`);
  if (q.kind !== kind) throw new TradeError(`${name}: expected a ${kind} measurement, got ${q.kind} (${q.id})`);
  if (!(q.net > 0)) throw new TradeError(`${name}: measurement ${q.id} is zero`);
  return q.net;
}
const src = (label: string, p: Param, unit: string) => `${label} ${p.value} ${unit} (${p.source})`;
function label(name: string, s: string): string {
  const t = s.trim();
  if (!t) throw new TradeError(`${name} is required`);
  return t;
}
/** One take-off measurement may feed one row only: a second use would count it twice. */
function once(used: Map<string, string>, q: Quantity | undefined, row: string) {
  if (!q) return;
  const prev = used.get(q.id);
  if (prev) throw new TradeError(`${row}: measurement ${q.id} is already used by ${prev} (double counting)`);
  used.set(q.id, row);
}

/**
 * Run length rule (both trades):
 *   L = (measured plan run + drops × points served) × (1 + allowance / 100)
 * Drops/rises are the vertical lengths from the run to each point or fixture,
 * read off a section; the allowance (terminations, slack) is optional and,
 * when used, must carry its source. With no points measurement, no drops.
 */
interface RunInput { plan: Quantity | undefined; points?: Quantity; dropM?: Param; allowancePct?: Param }
function runLength(row: string, i: RunInput): { L: number; inputs: string[] } {
  const P = measured(`${row}: run length`, i.plan, 'linear');
  const inputs = [`plan run ${r3(P)} m (take-off ${i.plan!.id})`];
  let drops = 0;
  if (i.points) {
    const n = measured(`${row}: points served`, i.points, 'count');
    const d = need(`${row}: drop per point`, i.dropM, 0, 10, 'm');
    drops = n * d;
    inputs.push(`points served ${n} (take-off ${i.points.id})`, src('drop per point', i.dropM!, 'm'));
  } else if (i.dropM && Number.isFinite(i.dropM.value)) {
    throw new TradeError(`${row}: a drop per point needs the count measurement of the points it serves`);
  } else inputs.push('no drops entered');
  const a = i.allowancePct ? need(`${row}: allowance`, i.allowancePct, 0, 25, '%') : 0;
  inputs.push(i.allowancePct ? src('allowance', i.allowancePct, '%') : 'allowance 0 % (none entered)');
  return { L: r3((P + drops) * (1 + a / 100)), inputs };
}

// ---------------------------------------------------------------- electrical
export type PointKind = 'lighting' | 'socket' | 'switch' | 'other';
export const POINT_LABELS: Record<PointKind, string> = { lighting: 'Lighting point', socket: 'Socket outlet', switch: 'Switch', other: 'Point' };

export interface ElectricalInput {
  code: string; description: string;
  /** Points counted on the drawing (count take-off), one row per point type. */
  points: Array<{ kind: PointKind; label: string; count: Quantity | undefined }>;
  /** Circuit runs: plan length on the drawing, drops to the points, conductors per run from the circuit schedule. */
  runs: Array<{ label: string; plan: Quantity | undefined; points?: Quantity; dropM?: Param; allowancePct?: Param; conductors: Param; cableSpec: string; conduitSpec: string }>;
  /** Boards, circuits (MCBs/RCDs), isolators: counted from a schedule or drawing, with its source. */
  enumerated: Array<{ label: string; count: Param }>;
}

export function electrical(i: ElectricalInput): TradeLine[] {
  if (!i.points.length && !i.runs.length && !i.enumerated.length) throw new TradeError('Add at least one point, run or enumerated item');
  const out: TradeLine[] = [];
  const used = { counted: new Map<string, string>(), runs: new Map<string, string>(), served: new Map<string, string>() };
  let k = 1;
  const code = () => `${i.code}.${k++}`;
  i.points.forEach((p, n) => {
    const row = `Point row ${n + 1}`;
    const name = label(`${row}: description`, p.label);
    if (!Object.prototype.hasOwnProperty.call(POINT_LABELS, p.kind)) throw new TradeError(`${row}: choose the point type`);
    const c = measured(`${row} (${name})`, p.count, 'count');
    once(used.counted, p.count, row);
    out.push({ code: code(), trade: 'Electrical', unit: 'No', quantity: c, description: `${i.description}: ${POINT_LABELS[p.kind]}, ${name}`, formula: 'counted on the drawing', inputs: [`count ${c} (take-off ${p.count!.id})`] });
  });
  i.runs.forEach((r, n) => {
    const row = `Run ${n + 1}`;
    const name = label(`${row}: description`, r.label);
    const cable = label(`${row}: cable specification`, r.cableSpec);
    once(used.runs, r.plan, row);
    once(used.served, r.points, row);
    const { L, inputs } = runLength(`${row} (${name})`, r);
    const cond = needInt(`${row}: conductors per run`, r.conductors, 1, 12);
    const conduit = r.conduitSpec.trim();
    if (conduit) out.push({ code: code(), trade: 'Electrical', unit: 'm', quantity: L, description: `${i.description}: conduit ${conduit}, ${name}`, formula: '(plan run + drops × points) × (1 + allowance)', inputs });
    out.push({
      code: code(), trade: 'Electrical', unit: 'm', quantity: r3(L * cond), description: `${i.description}: cable ${cable}, ${name}`,
      formula: `run length × conductors = ${L} × ${cond}`, inputs: [...inputs, src('conductors', r.conductors, 'No')],
    });
  });
  i.enumerated.forEach((e, n) => {
    const row = `Enumerated item ${n + 1}`;
    const name = label(`${row}: description`, e.label);
    if (!e.count || !Number.isFinite(e.count.value) || !e.count.source.trim()) throw new TradeError(`${row} (${name}): no measurable basis — enter the count with its source (board or circuit schedule, drawing), or remove the row. It is not guessed.`);
    const c = needInt(`${row} (${name}) count`, e.count, 1, 1000);
    out.push({ code: code(), trade: 'Electrical', unit: 'No', quantity: c, description: `${i.description}: ${name}`, formula: 'count from schedule', inputs: [src('count', e.count, 'No')] });
  });
  return out;
}

// ---------------------------------------------------------------- plumbing
export type FixtureKind = 'wc' | 'basin' | 'sink' | 'shower' | 'other';
export const FIXTURE_LABELS: Record<FixtureKind, string> = { wc: 'WC suite', basin: 'Wash hand basin', sink: 'Sink', shower: 'Shower', other: 'Sanitary fitting' };
export type PipeService = 'supply' | 'drainage';
export const SERVICE_LABELS: Record<PipeService, string> = { supply: 'Supply pipe', drainage: 'Drainage pipe' };

export interface PlumbingInput {
  code: string; description: string;
  fixtures: Array<{ kind: FixtureKind; label: string; count: Quantity | undefined }>;
  /** Pipe runs by diameter. Fittings, when used, by a stated allowance per metre (an allowance, not a count). */
  pipes: Array<{ label: string; service: PipeService; material: string; diameterMm: Param; plan: Quantity | undefined; points?: Quantity; dropM?: Param; allowancePct?: Param; fittingsPerM?: Param }>;
}

export function plumbing(i: PlumbingInput): TradeLine[] {
  if (!i.fixtures.length && !i.pipes.length) throw new TradeError('Add at least one fixture or pipe run');
  const out: TradeLine[] = [];
  const used = { counted: new Map<string, string>(), runs: new Map<string, string>(), served: new Map<string, string>() };
  let k = 1;
  const code = () => `${i.code}.${k++}`;
  i.fixtures.forEach((f, n) => {
    const row = `Fixture row ${n + 1}`;
    const name = label(`${row}: description`, f.label);
    if (!Object.prototype.hasOwnProperty.call(FIXTURE_LABELS, f.kind)) throw new TradeError(`${row}: choose the fixture type`);
    const c = measured(`${row} (${name})`, f.count, 'count');
    once(used.counted, f.count, row);
    out.push({ code: code(), trade: 'Plumbing', unit: 'No', quantity: c, description: `${i.description}: ${FIXTURE_LABELS[f.kind]}, ${name}`, formula: 'counted on the drawing', inputs: [`count ${c} (take-off ${f.count!.id})`] });
  });
  i.pipes.forEach((p, n) => {
    const row = `Pipe run ${n + 1}`;
    const name = label(`${row}: description`, p.label);
    const material = label(`${row}: pipe material`, p.material);
    if (!Object.prototype.hasOwnProperty.call(SERVICE_LABELS, p.service)) throw new TradeError(`${row}: choose supply or drainage`);
    const dia = need(`${row}: nominal diameter`, p.diameterMm, 10, 300, 'mm');
    once(used.runs, p.plan, row);
    once(used.served, p.points, row);
    const { L, inputs } = runLength(`${row} (${name})`, p);
    const withDia = [...inputs, src('diameter', p.diameterMm, 'mm')];
    out.push({ code: code(), trade: 'Plumbing', unit: 'm', quantity: L, description: `${i.description}: ${SERVICE_LABELS[p.service]} ${material} DN${dia}, ${name}`, formula: '(plan run + rises × fixtures) × (1 + allowance); measured on plan, gradient not added', inputs: withDia });
    if (p.fittingsPerM) {
      const f = need(`${row}: fittings allowance`, p.fittingsPerM, 0.01, 5, 'No/m');
      out.push({
        code: code(), trade: 'Plumbing', unit: 'No', quantity: Math.ceil(r3(L * f)), description: `${i.description}: fittings to DN${dia} ${material} (allowance), ${name}`,
        formula: `ceil(run length × fittings per metre) = ceil(${L} × ${f}); a stated allowance, not counted fittings`, inputs: [...withDia, src('fittings allowance', p.fittingsPerM, 'No/m')],
      });
    }
  });
  return out;
}

/** What these trades do not measure: shown in the panel and the engineering note so it is flagged, not silently omitted. */
export const MEP_NOT_MEASURED = [
  'Earthing and bonding, lightning protection',
  'Testing, inspection and commissioning; certificates of the installation',
  'Builder’s work in connection (chases, holes, sleeves, making good)',
  'Main incoming supply, meter and service cable (utility works)',
  'Hot-water generation (cylinders, solar water heating), pumps and storage tanks',
  'Below-ground drainage (manholes, trenches, septic tanks, soakaways)',
  'Fittings counted individually from an isometric: here only by a stated allowance',
];
