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
export interface DimSpec { key: string; label: string; unit: 'm' | 'No'; min: number; max: number; integer?: boolean }
export interface CatalogueItem {
  /** Kind of take-off measurement the item uses. */
  takes: Quantity['kind'];
  unit: TradeLine['unit'];
  label: string;
  /** Multiplying dimensions, in order: quantity = measurement × d1 × d2 … */
  dims: DimSpec[];
  /** What the description should state (spec, size, thickness …). */
  specHint: string;
  /** When the dimensions do not simply multiply: quantity = measurement × combine(d1, d2, d3), with its formula text. */
  combine?: { fn: (d: number[]) => number; text: string };
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

/**
 * R-18 below-ground drainage (P1-D §4): pipe runs, trench excavation and
 * bedding from the measured run, chambers and gullies counted. Diameters,
 * gradients, invert levels and tank/soakaway sizes come from the drainage
 * design (and a percolation test); they are entered, never computed.
 */
export const DRAINAGE_WORKS: Record<string, CatalogueItem> = {
  pipe: { takes: 'linear', unit: 'm', label: 'Drain pipe (by diameter and depth band)', dims: [], specHint: 'from the drainage design, e.g. 110 mm uPVC, invert 0.75–1.5 m deep' },
  trench: { takes: 'linear', unit: 'm³', label: 'Trench excavation for drains (length × width × average depth)', dims: [D('width', 'trench width', 0.3, 3), D('depth', 'average trench depth', 0.3, 6)], specHint: 'e.g. in soft material, depth band 0.75–1.5 m' },
  bedding: { takes: 'linear', unit: 'm³', label: 'Pipe bed / surround (length × width × thickness)', dims: [D('width', 'bed width', 0.2, 3), D('thickness', 'bed thickness', 0.05, 1)], specHint: 'e.g. 150 mm granular bed and surround' },
  manhole: { takes: 'count', unit: 'No', label: 'Manholes / inspection chambers', dims: [], specHint: 'size and depth from the design, e.g. 600 × 450 mm chamber, 0.9 m deep' },
  gully: { takes: 'count', unit: 'No', label: 'Gullies', dims: [], specHint: 'e.g. 100 mm trapped gully with grating' },
  tank: { takes: 'count', unit: 'No', label: 'Septic tank / soakaway (as designed)', dims: [], specHint: 'capacity and dimensions from the approved design' },
};

/**
 * R-15 painting and decoration (P1-D §4): measured as the area painted (m²),
 * the number of coats stated in the description, not multiplied (SMM7 /
 * NRM2 general approach); trims in m; doors per leaf (No).
 */
export const PAINTING_WORKS: Record<string, CatalogueItem> = {
  wallArea: { takes: 'area', unit: 'm²', label: 'Walls (area measured net of openings)', dims: [], specHint: 'e.g. 1 mist + 2 full coats vinyl silk emulsion on plaster' },
  wallLength: { takes: 'linear', unit: 'm²', label: 'Walls (length × painted height; openings not deducted)', dims: [D('height', 'painted height', 0.1, 12)], specHint: 'e.g. 2 coats masonry paint on render; for net areas measure the wall as an area with its openings' },
  ceiling: { takes: 'area', unit: 'm²', label: 'Ceilings / soffits', dims: [], specHint: 'e.g. 2 coats matt emulsion on skim' },
  trim: { takes: 'linear', unit: 'm', label: 'Skirtings, trims, rails (girth ≤ 300 mm)', dims: [], specHint: 'e.g. 1 primer + 2 gloss on timber skirting' },
  door: { takes: 'count', unit: 'No', label: 'Doors (per leaf, both sides incl. frame)', dims: [], specHint: 'e.g. 1 primer + 2 gloss, 900 × 2100 mm flush door' },
  metal: { takes: 'area', unit: 'm²', label: 'Metalwork (area)', dims: [], specHint: 'e.g. 1 zinc phosphate primer + 2 enamel on steel grilles' },
};

/**
 * R-10 in-situ concrete (P1-D §4) for slabs, beams, columns and walls, from
 * measured slab areas, beam and wall lengths and column counts, and the
 * member sizes from the structural drawings. Beams are measured as the
 * downstand BELOW the slab (the slab is measured through), so no volume is
 * counted twice. Grade, wastage and reinforcement are not computed here.
 */
export const CONCRETE_WORKS: Record<string, CatalogueItem> = {
  slab: { takes: 'area', unit: 'm³', label: 'Slab (area × thickness)', dims: [D('thickness', 'slab thickness', 0.05, 1.5)], specHint: 'grade from the structural drawings, e.g. C25/30 suspended slab' },
  beam: { takes: 'linear', unit: 'm³', label: 'Beam downstand below the slab (length × width × downstand)', dims: [D('width', 'beam width', 0.1, 2), D('downstand', 'downstand below slab soffit', 0.05, 3)], specHint: 'e.g. C25/30 beam 230 wide, 450 overall − 150 slab = 300 downstand' },
  column: { takes: 'count', unit: 'm³', label: 'Columns (number × width × depth × height)', dims: [D('width', 'column width', 0.1, 3), D('depth', 'column depth', 0.1, 3), D('height', 'height to slab soffit', 0.3, 20)], specHint: 'e.g. C30/37 columns 300 × 300, floor to soffit' },
  wall: { takes: 'linear', unit: 'm³', label: 'RC walls (length × thickness × height)', dims: [D('thickness', 'wall thickness', 0.05, 2), D('height', 'wall height', 0.1, 20)], specHint: 'e.g. C30/37 retaining wall, 200 thick' },
  groundBeam: { takes: 'linear', unit: 'm³', label: 'Ground beams (length × width × depth)', dims: [D('width', 'beam width', 0.1, 3), D('depth', 'beam depth', 0.1, 3)], specHint: 'e.g. C25/30 ground beam 230 × 450' },
};

/**
 * R-12 formwork FROM MEASURED CONTACT AREAS ONLY (P1-D §4): the area of
 * concrete face in contact with the formwork (m²), from the same measured
 * slab areas, edges, beam and wall lengths and column counts as the
 * concrete, and the drawn member sizes. Edges are measured as an area
 * (edge length × edge height). A ground-bearing slab has no soffit
 * formwork: do not measure one.
 */
export const FORMWORK_WORKS: Record<string, CatalogueItem> = {
  soffit: { takes: 'area', unit: 'm²', label: 'Soffit of suspended slab (contact area = soffit area)', dims: [], specHint: 'e.g. plywood to soffit of 150 mm suspended slab, propping ≤ 3.5 m' },
  slabEdge: { takes: 'linear', unit: 'm²', label: 'Slab edges (edge length × edge height)', dims: [D('height', 'edge height', 0.05, 1.5)], specHint: 'e.g. edge of 150 mm slab' },
  beam: { takes: 'linear', unit: 'm²', label: 'Beam sides and soffit (length × (width + 2 × downstand))', dims: [D('width', 'beam width (soffit)', 0.1, 2), D('downstand', 'downstand below slab soffit', 0.05, 3)], specHint: 'e.g. 230 × 450 beam under 150 slab',
    combine: { fn: ([w, h]) => w + 2 * h, text: '(beam width + 2 × downstand)' } },
  column: { takes: 'count', unit: 'm²', label: 'Column sides (number × 2 × (width + depth) × height)', dims: [D('width', 'column width', 0.1, 3), D('depth', 'column depth', 0.1, 3), D('height', 'height to slab soffit', 0.3, 20)], specHint: 'e.g. 300 × 300 columns, floor to soffit',
    combine: { fn: ([b, d, h]) => 2 * (b + d) * h, text: '2 × (column width + column depth) × height' } },
  wall: { takes: 'linear', unit: 'm²', label: 'Wall faces (length × height × faces)', dims: [D('height', 'wall height', 0.1, 20), { key: 'faces', label: 'faces formed (1 or 2)', unit: 'No', min: 1, max: 2, integer: true }], specHint: 'e.g. both faces of 200 mm RC wall',
    combine: { fn: ([h, f]) => h * f, text: 'wall height × faces formed' } },
  groundBeamSides: { takes: 'linear', unit: 'm²', label: 'Ground beam sides (length × depth × 2)', dims: [D('depth', 'beam depth formed', 0.1, 3)], specHint: 'e.g. both sides of 230 × 450 ground beam',
    combine: { fn: ([d]) => 2 * d, text: '2 × beam depth formed' } },
};

/**
 * R-09 earthworks (P1-D §4): site strip, bulk excavation and filling to
 * levels, and disposal, from a measured plan area and the levels on the
 * drawings (mean existing ground level from the level survey; formation
 * level from the sections). Volumes are bank (in-situ) volumes; disposal
 * applies a bulking factor only when one is entered with its source.
 */
const LEVEL = (key: string, label: string): DimSpec => ({ key, label, unit: 'm', min: -500, max: 9000 });
const cutDepth = ([eg, fl]: number[]) => {
  if (!(eg > fl)) throw new TradeError(`mean existing ground level (${eg} m) must be above the formation level (${fl} m) for excavation: use "Filling to levels"`);
  return eg - fl;
};
const fillDepth = ([eg, fl]: number[]) => {
  if (!(fl > eg)) throw new TradeError(`the formation level (${fl} m) must be above the mean existing ground level (${eg} m) for filling: use "Bulk excavation to levels"`);
  return fl - eg;
};
export const EARTHWORKS: Record<string, CatalogueItem> = {
  topsoil: { takes: 'area', unit: 'm³', label: 'Site strip / remove topsoil (area × depth)', dims: [D('depth', 'strip depth', 0.02, 1)], specHint: 'e.g. remove 150 mm topsoil and stockpile for reuse' },
  bulkExcavation: { takes: 'area', unit: 'm³', label: 'Bulk excavation to levels (area × (mean existing ground level − formation level))', dims: [LEVEL('eg', 'mean existing ground level'), LEVEL('fl', 'formation level')], specHint: 'e.g. reduce level excavation in soft material',
    combine: { fn: cutDepth, text: '(mean existing ground level − formation level)' } },
  fill: { takes: 'area', unit: 'm³', label: 'Filling to levels (area × (formation level − mean existing ground level))', dims: [LEVEL('eg', 'mean existing ground level'), LEVEL('fl', 'formation level')], specHint: 'e.g. approved murram fill in 150 mm compacted layers',
    combine: { fn: fillDepth, text: '(formation level − mean existing ground level)' } },
  disposal: { takes: 'area', unit: 'm³', label: 'Disposal off site (area × depth × bulking factor)', dims: [D('depth', 'excavated depth', 0.02, 30), { key: 'bulking', label: 'bulking factor (1.00 = none)', unit: 'No', min: 1, max: 1.6 }], specHint: 'e.g. surplus excavated material to a licensed tip',
    combine: { fn: ([d, b]) => d * b, text: 'excavated depth × bulking factor' } },
  basementExcavation: { takes: 'volume', unit: 'm³', label: 'Excavation measured as a volume (area × depth in the take-off)', dims: [], specHint: 'e.g. basement excavation, depth band 1.5–3 m' },
};

export type WorksTrade = 'external' | 'hvac' | 'drainage' | 'painting' | 'concrete' | 'formwork' | 'earthworks';
export const WORKS_CATALOGUES: Record<WorksTrade, { trade: string; items: Record<string, CatalogueItem>; notMeasured: string[]; note?: string }> = {
  external: {
    trade: 'External works', items: EXTERNAL_WORKS,
    notMeasured: ['Site clearance and demolition', 'Below-ground drainage (its own trade)', 'Utility connections (water, power, sewer) by the utility', 'Retaining walls and structures (need a structural design)'],
  },
  hvac: {
    trade: 'HVAC', items: HVAC_WORKS,
    note: 'Quantities only. Cooling and heating loads, airflows, duct and pipe sizes and equipment selection require a design by a qualified mechanical engineer: enter the sizes from that design. This tool does not size HVAC.',
    notMeasured: ['Testing, balancing and commissioning', 'Controls and their wiring', 'Power supply to the units (electrical trade)', 'Builder’s work (holes, sleeves, supports, plinths)', 'Fittings (bends, tees, dampers) counted from the design'],
  },
  drainage: {
    trade: 'Below-ground drainage', items: DRAINAGE_WORKS,
    note: 'Pipe diameters, gradients, invert levels and septic tank / soakaway sizes come from the drainage design approved by the county (and a percolation test on site): enter them from that design. Trench depth is the average of the measured run.',
    notMeasured: ['Backfilling and disposal of surplus (use Earthworks)', 'Connections to the public sewer (utility works)', 'Testing (air / water test) and CCTV survey', 'Pumping stations'],
  },
  painting: {
    trade: 'Painting & decoration', items: PAINTING_WORKS,
    note: 'Measured as the area painted; the number of coats is stated in the description, not multiplied into the quantity. Measure walls as areas with their openings (the take-off deducts them) for net quantities.',
    notMeasured: ['Surface preparation beyond normal (stripping, filling cracks)', 'Signwriting and special finishes', 'Plaster itself (Plaster / render trade)'],
  },
  concrete: {
    trade: 'Concrete', items: CONCRETE_WORKS,
    note: 'Net volumes as designed: sizes and grades from the structural drawings. Beams are measured as the downstand below the slab, so the slab-beam overlap is not counted twice. Openings in slabs: measure the slab as an area with its openings. Strip footings: Strip foundation trade.',
    notMeasured: ['Reinforcement (needs the bar bending schedule; enter it as a scheduled quantity)', 'Wastage (state it in the rate build-up)', 'Formwork (Formwork trade)', 'Precast elements'],
  },
  formwork: {
    trade: 'Formwork', items: FORMWORK_WORKS,
    note: 'Measured from contact areas only: the area of concrete face the formwork touches, from the measured elements and the drawn sizes. Use the same measurements and sizes as the Concrete trade, but in a separate formwork take-off (one measurement feeds one item). No soffit formwork for a ground-bearing slab.',
    notMeasured: ['Propping and back-propping design (temporary works designer)', 'Formwork to openings and boxes ≤ the contract’s small-void rule (add as your own items)', 'Permanent formwork, profiled or special finishes'],
  },
  earthworks: {
    trade: 'Earthworks', items: EARTHWORKS,
    note: 'Levels come from the level survey (mean existing ground level of the measured area) and the sections (formation level). Volumes are bank volumes; disposal is bulked only by a factor you enter with its source (1.00 = none). Strip-foundation trenches: Strip foundation trade.',
    notMeasured: ['Working space and earthwork support (state per the contract rules)', 'Dewatering', 'Excavation in rock (needs the site investigation)', 'Compaction testing'],
  },
};

export interface WorksRow { item: string; spec: string; measurement: Quantity | undefined; /** In the catalogue's order (at most three). */ dims: Array<Param | undefined> }
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
    let v = q.net; const xs: number[] = [];
    const inputs = [`${q.kind === 'count' ? 'count' : q.kind === 'linear' ? 'length' : q.kind === 'volume' ? 'volume' : 'area'} ${r3(q.net)} ${q.unit} (take-off ${q.id})`];
    for (const [k, d] of c.dims.entries()) {
      const x = need(`${name} (${c.label}) ${d.label}`, row.dims[k], d.min, d.max, d.unit);
      if (d.integer && !Number.isInteger(x)) throw new TradeError(`${name} (${c.label}) ${d.label} must be a whole number`);
      xs.push(x);
      inputs.push(`${d.label} ${x} ${d.unit} (${row.dims[k]!.source.trim()})`);
    }
    try { v *= c.combine ? c.combine.fn(xs) : xs.reduce((a, b) => a * b, 1); }
    catch (e) { throw new TradeError(`${name} (${c.label}): ${(e as Error).message}`); }
    return {
      code: `${i.code}.${n + 1}`, trade: cat.trade, unit: c.unit, quantity: c.unit === 'No' ? q.net : r3(v),
      description: `${i.description}: ${c.label}, ${spec}`,
      formula: c.combine ? `measured ${q.kind} × ${c.combine.text}` : c.dims.length ? `measured ${q.kind} × ${c.dims.map((d) => d.label).join(' × ')}` : `measured ${q.kind === 'count' ? 'count' : q.kind}`,
      inputs,
    };
  });
}
