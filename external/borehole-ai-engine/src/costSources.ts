/**
 * Which project-cost lines rest on a sourced rate (2026-11-22, management
 * priority 6: cost estimates only from evidence, no unsourced price).
 *
 * computeCanonicalEconomics prices every line of a borehole. Some lines use a
 * rate with a source (the EmersonEIMS signed tender, Baringo, 16 Oct 2026; the
 * IRENA solar benchmark the PDF already cites). Others are planning allowances
 * with no published rate: the well screen ($35/m), the pump and motor, the
 * installation (60% of the pump), the water-treatment allowances and the
 * distance surcharge for mobilisation. Those are not shown as prices: they are
 * "by quotation", and the total shown is the total of the sourced lines only.
 */
import { EIMS_RATES_KES, KES_PER_USD } from './costModel';
import type { computeCanonicalEconomics } from './reportShared';

type Eco = ReturnType<typeof computeCanonicalEconomics>;

export interface CostLine { item: string; usd: number; source: string | null }

export interface CostSourcing {
  lines: CostLine[];
  /** Lines with a cost but no sourced rate: priced by the supplier's quotation. */
  quotationItems: string[];
  sourcedSubtotal: number;
  sourcedContingency: number;
  sourcedTotal: number;
}

export const QUOTATION_TEXT = 'by quotation';

export function costSourcing(eco: Eco): CostSourcing {
  const tender = EIMS_RATES_KES.source;
  const mobFloor = Math.round(EIMS_RATES_KES.mobilisation / KES_PER_USD);
  const lines: CostLine[] = [
    { item: 'Hydrogeological survey and WRA approvals (required)', usd: eco.surveyCost + eco.permitCost, source: `${tender}: survey KSh 85,000; ${eco.permitNote}` },
    { item: `Drilling (${eco.depthVal} m, ${eco.drillMethod})`, usd: eco.drillingCost, source: `${tender}: per-metre drilling rates` },
    ...(eco.mobilisationCost > 0 ? [{ item: 'Mobilisation', usd: eco.mobilisationCost, source: eco.mobilisationCost === mobFloor ? `${tender}: mobilisation KSh 240,000` : null }] : []),
    { item: 'Blind casing', usd: eco.casingCost, source: `${tender}: 6-inch steel casing KSh 4,200/m` },
    { item: 'Well screen', usd: eco.screenCost, source: null },
    { item: 'Completion: gravel pack, development, 24 h test pumping, lab test, cap', usd: eco.completionCost, source: `${tender}: ${eco.completionNote.replace(/\s*\([^)]*\)\s*$/, '')}` },
    { item: 'Pump and motor', usd: eco.pumpCost, source: null },
    { item: 'Installation and rising main', usd: eco.installCost, source: null },
    ...(eco.solarCost > 0 ? [{ item: `Solar pump power (${eco.solarKW} kW)`, usd: eco.solarCost, source: 'IRENA 2023 benchmark, about $1,500/kW installed' }] : []),
    ...(eco.wqTreatmentCost > 0 ? [{ item: eco.needsRO ? 'Desalination (reverse osmosis)' : 'Water treatment', usd: eco.wqTreatmentCost, source: null }] : []),
    ...(eco.defluoridationCost > 0 ? [{ item: 'Defluoridation (on measured fluoride)', usd: eco.defluoridationCost, source: null }] : []),
  ];
  const sourcedSubtotal = lines.filter((l) => l.source).reduce((s, l) => s + l.usd, 0);
  const sourcedContingency = Math.round(sourcedSubtotal * eco.contingencyRate);
  return {
    lines,
    quotationItems: lines.filter((l) => !l.source && l.usd > 0).map((l) => l.item),
    sourcedSubtotal,
    sourcedContingency,
    sourcedTotal: sourcedSubtotal + sourcedContingency,
  };
}
