/**
 * Building Suite Pro: measured-item trades (register R-21 external works and
 * the trades that follow the same pattern, 2026-11-27).
 *
 * Same contract as lib/qs/trades and lib/qs/mep: every quantity comes from a
 * take-off measurement, multiplied only by dimensions entered with their
 * source; each line records its formula and inputs; nothing is assumed. A row
 * without a measurement, or a dimension without a source, is refused.
 *
 * Method of measurement (convention, no clause numbers claimed): items are
 * measured net as fixed, in the unit of the item: area work in m², lengths
 * in m, enumerated items in No, excavation and filling in m³ (RICS NRM2 /
 * SMM7 general approach; East African BOQ practice). Each catalogue entry
 * below says which measurement it takes and which dimensions multiply it.
 */
import type { Quantity } from './takeoff';
import { TradeError, type Param, type TradeLine } from './trades';

export const WORKS_ENGINE_VERSION = 'qs-works 1.0.0 (2026-11-27)';

const r3 = (x: number) => Math.round(x * 1000) / 1000;

/** A dimension that multiplies the measurement (name, unit and plausible range). */
export interface DimSpec { key: string; label: string; unit: 'm'; min: number; max: number }
export interface CatalogueItem {
  /** Kind of take-off measurement the item uses. */
  takes: Quantity['kind'];
  unit: TradeLine['unit'];
  label: string;
  /** Multiplying dimensions, in order: quantity = measurement × d1 × d2 … */
  dims: DimSpec[];
  /** What the description should state (spec, size, thickness …). */
  specHint: string;
}

const D = (key: string, label: string, min: number, max: number): DimSpec => ({ key, label, unit: 'm', min, max });

/** R-21 External works (P1-D §4). */
export const EXTERNAL_WORKS: Record<string, CatalogueItem> = {
  paving: { takes: 'area', unit: 'm²', label: 'Paving / hardstanding', dims: [], specHint: 'e.g. 80 mm concrete block paving on 150 mm hardcore' },
  roadBase: { takes: 'area', unit: 'm³', label: 'Sub-base / base course (volume)', dims: [D('thickness', 'thickness', 0.02, 1.5)], specHint: 'e.g. 200 mm murram sub-base, compacted' },
  kerb: { takes: 'linear', unit: 'm', label: 'Kerbs and edgings', dims: [], specHint: 'e.g. 125 × 250 mm precast concrete kerb on concrete bed' },
  channel: { takes: 'linear', unit: 'm', label: 'Surface water channels / open drains', dims: [], specHint: 'e.g. 300 mm precast U-channel' },
  fencing: { takes: 'linear', unit: 'm', label: 'Fencing / boundary walls (length)', dims: [], specHint: 'e.g. 2.1 m chain-link on concrete posts at 3 m centres' },
  gate: { takes: 'count', unit: 'No', label: 'Gates', dims: [], specHint: 'e.g. 4.0 × 2.1 m steel sliding gate' },
  grassing: { takes: 'area', unit: 'm²', label: 'Soft landscaping / grassing', dims: [], specHint: 'e.g. 150 mm topsoil and grass planting' },
  trees: { takes: 'count', unit: 'No', label: 'Trees and shrubs', dims: [], specHint: 'e.g. 1.5 m nursery-grown shade trees' },
  other: { takes: 'linear', unit: 'm', label: 'Other linear item', dims: [], specHint: 'describe fully' },
};

/**
 * R-20 HVAC (P1-D §4, RS20): QUANTITIES ONLY. Loads, airflows, duct and pipe
 * sizes and equipment selection are a design by a qualified mechanical
 * engineer; the sizes are entered from that design, never computed here.
 */
export const HVAC_WORKS: Record<string, CatalogueItem> = {
  duct: { takes: 'linear', unit: 'm', label: 'Ductwork (length, by size)', dims: [], specHint: 'size from the mechanical design, e.g. 400 × 250 mm galvanised rectangular duct' },
  ductInsulation: { takes: 'linear', unit: 'm²', label: 'Duct insulation (length × duct girth)', dims: [D('girth', 'duct girth (outside perimeter)', 0.1, 10)], specHint: 'e.g. 25 mm foil-faced mineral wool' },
  refrigerant: { takes: 'linear', unit: 'm', label: 'Refrigerant pipework (pair, length)', dims: [], specHint: 'sizes from the equipment data, e.g. 6.35 + 12.7 mm insulated copper pair' },
  condensate: { takes: 'linear', unit: 'm', label: 'Condensate drain pipe', dims: [], specHint: 'e.g. 20 mm uPVC to falls' },
  grille: { takes: 'count', unit: 'No', label: 'Diffusers / grilles', dims: [], specHint: 'type and size from the design, e.g. 600 × 600 mm 4-way ceiling diffuser' },
  indoorUnit: { takes: 'count', unit: 'No', label: 'Indoor units', dims: [], specHint: 'model and capacity from the design, e.g. wall split unit (capacity per schedule M-01)' },
  outdoorUnit: { takes: 'count', unit: 'No', label: 'Outdoor / condensing units', dims: [], specHint: 'model and capacity from the design' },
  fan: { takes: 'count', unit: 'No', label: 'Extract / supply fans', dims: [], specHint: 'duty from the design, e.g. in-line extract fan (duty per schedule M-02)' },
};

export type WorksTrade = 'external' | 'hvac';
export const WORKS_CATALOGUES: Record<WorksTrade, { trade: string; items: Record<string, CatalogueItem>; notMeasured: string[]; note?: string }> = {
  external: {
    trade: 'External works', items: EXTERNAL_WORKS,
    notMeasured: ['Site clearance and demolition', 'Below-ground drainage (manholes, pipes, soakaways)', 'Utility connections (water, power, sewer) by the utility', 'Retaining walls and structures (need a structural design)'],
  },
  hvac: {
    trade: 'HVAC', items: HVAC_WORKS,
    note: 'Quantities only. Cooling and heating loads, airflows, duct and pipe sizes and equipment selection require a design by a qualified mechanical engineer: enter the sizes from that design. This tool does not size HVAC.',
    notMeasured: ['Testing, balancing and commissioning', 'Controls and their wiring', 'Power supply to the units (electrical trade)', 'Builder’s work (holes, sleeves, supports, plinths)', 'Fittings (bends, tees, dampers) counted from the design'],
  },
};

export interface WorksRow { item: string; spec: string; measurement: Quantity | undefined; /** In the catalogue's order (at most two). */ dims: Array<Param | undefined> }
export interface WorksInput { code: string; description: string; trade: WorksTrade; rows: WorksRow[] }

function need(name: string, p: Param | undefined, min: number, max: number, unit: string): number {
  if (!p || !Number.isFinite(p.value)) throw new TradeError(`${name} is required (${unit})`);
  if (!p.source?.trim()) throw new TradeError(`${name}: give its source (drawing, section, schedule or specification)`);
  if (!(p.value >= min && p.value <= max)) throw new TradeError(`${name} = ${p.value} ${unit} is outside ${min}–${max} ${unit}; check the drawing`);
  return p.value;
}

export function measuredWorks(i: WorksInput): TradeLine[] {
  const cat = WORKS_CATALOGUES[i.trade];
  if (!cat) throw new TradeError('Choose the trade');
  if (!i.rows.length) throw new TradeError('Add at least one item');
  const used = new Map<string, string>();
  return i.rows.map((row, n) => {
    const name = `Item ${n + 1}`;
    const c = Object.prototype.hasOwnProperty.call(cat.items, row.item) ? cat.items[row.item] : undefined;
    if (!c) throw new TradeError(`${name}: choose the item type`);
    const spec = row.spec.trim();
    if (!spec) throw new TradeError(`${name} (${c.label}): describe it (${c.specHint})`);
    const q = row.measurement;
    if (!q) throw new TradeError(`${name} (${c.label}): no measurable basis — a ${c.takes} measurement from the take-off is required (it is not guessed)`);
    if (q.kind !== c.takes) throw new TradeError(`${name} (${c.label}): expected a ${c.takes} measurement, got ${q.kind} (${q.id})`);
    if (!(q.net > 0)) throw new TradeError(`${name}: measurement ${q.id} is zero`);
    const prev = used.get(q.id);
    if (prev) throw new TradeError(`${name}: measurement ${q.id} is already used by ${prev} (double counting)`);
    used.set(q.id, name);
    let v = q.net;
    const inputs = [`${q.kind === 'count' ? 'count' : q.kind === 'linear' ? 'length' : 'area'} ${r3(q.net)} ${q.unit} (take-off ${q.id})`];
    for (const [k, d] of c.dims.entries()) {
      const x = need(`${name} (${c.label}) ${d.label}`, row.dims[k], d.min, d.max, d.unit);
      v *= x;
      inputs.push(`${d.label} ${x} ${d.unit} (${row.dims[k]!.source.trim()})`);
    }
    return {
      code: `${i.code}.${n + 1}`, trade: cat.trade, unit: c.unit, quantity: c.unit === 'No' ? q.net : r3(v),
      description: `${i.description}: ${c.label}, ${spec}`,
      formula: c.dims.length ? `measured ${q.kind} × ${c.dims.map((d) => d.label).join(' × ')}` : `measured ${q.kind === 'count' ? 'count' : q.kind}`,
      inputs,
    };
  });
}
