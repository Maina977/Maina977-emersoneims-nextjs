import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  CONTROLLER_SOURCES,
  getControllerSource,
  isControllerVerified,
  type VerifiedControllerSource,
} from '@/lib/generator-oracle/controllerSources';

/**
 * Controller source-citation registry — invariants.
 *
 * These tests enforce the project data policy ("never fabricate, estimate, or
 * synthesise data without explicit labelling") at the registry level:
 *
 *   1. Every controller in the wiring catalog (21 ids in CONTROLLER_PINS /
 *      CONTROLLERS table) MUST have an entry here. No silent gaps.
 *   2. Every entry is either 'verified' (with at least one OEM source) or
 *      'unsupported' (with a reason + searched-sources list). No ambiguous
 *      states.
 *   3. Verified entries match exactly the four controllers that actually
 *      ship pinout arrays in CONTROLLER_PINS today (DSE 7320, ComAp
 *      InteliGen, SmartGen HGM9320, Woodward easYgen-3000).
 *   4. Verified citations include a publisher + document title; URLs (when
 *      present) point to OEM property domains, never forum/blog hosts.
 *   5. NEW 2026-07-29 — nothing may ship pin data without being 'verified'
 *      here, and a partial map must declare itself partial. See the block
 *      comment on that describe() for why.
 */

const ALL_CONTROLLER_IDS = [
  // DSE
  'dse-7320', 'dse-7310', 'dse-6020', 'dse-6120', 'dse-4520', 'dse-8610', 'dse-8660',
  // ComAp
  'comap-intelilite', 'comap-inteligen', 'comap-intelisys', 'comap-intelimains',
  // Woodward
  'woodward-easygen3000', 'woodward-easygen2000', 'woodward-dtsc200',
  // SmartGen
  'smartgen-hgm6120', 'smartgen-hgm7220', 'smartgen-hgm9320', 'smartgen-hgm9510',
  // PowerWizard
  'powerwizard-10', 'powerwizard-11', 'powerwizard-20',
  // Datakom
  'datakom-d500', 'datakom-d700', 'datakom-dkg309', 'datakom-dkg517',
  // Lovato
  'lovato-rgk800', 'lovato-rgk900', 'lovato-atl800',
  // Siemens
  'siemens-sicam', 'siemens-sentron', 'siemens-siprotec',
  // ENKO
  'enko-gcu300', 'enko-gcu500', 'enko-sync200',
  // VODIA
  'vodia-vodia5', 'vodia-vodia6', 'vodia-ecu',
];

const EXPECTED_VERIFIED_IDS = new Set([
  'dse-7320',
  'comap-inteligen',
  'smartgen-hgm9320',
  'woodward-easygen3000',
]);

const OEM_DOMAINS = [
  'deepseaelectronics.com',
  'comap-control.com',
  'smartgen.com.cn',
  'woodward.com',
];

describe('controllerSources registry', () => {
  it('every controller in the catalog has a registry entry', () => {
    for (const id of ALL_CONTROLLER_IDS) {
      expect(getControllerSource(id), `missing entry for ${id}`).toBeDefined();
    }
  });

  it('registry contains exactly the expected catalog ids and no orphans', () => {
    const catalogSet = new Set(ALL_CONTROLLER_IDS);
    for (const id of Object.keys(CONTROLLER_SOURCES)) {
      expect(catalogSet.has(id), `orphan registry entry: ${id}`).toBe(true);
    }
  });

  it('verified entries match the controllers that ship pinout data today', () => {
    const verified = Object.entries(CONTROLLER_SOURCES)
      .filter(([, e]) => e.status === 'verified')
      .map(([id]) => id);
    expect(new Set(verified)).toEqual(EXPECTED_VERIFIED_IDS);
  });

  it('verified entries carry at least one OEM source with publisher + title', () => {
    for (const id of EXPECTED_VERIFIED_IDS) {
      const e = getControllerSource(id) as VerifiedControllerSource;
      expect(e.status).toBe('verified');
      expect(e.sources.length).toBeGreaterThan(0);
      for (const s of e.sources) {
        expect(s.title.length, `${id} source title empty`).toBeGreaterThan(3);
        expect(s.publisher.length, `${id} publisher empty`).toBeGreaterThan(2);
        if (s.url) {
          const isOem = OEM_DOMAINS.some((d) => s.url!.includes(d));
          expect(isOem, `${id} url not on OEM domain: ${s.url}`).toBe(true);
        }
      }
    }
  });

  it('unsupported entries carry a non-empty reason and at least one searched-source', () => {
    for (const [id, entry] of Object.entries(CONTROLLER_SOURCES)) {
      if (entry.status !== 'unsupported') continue;
      expect(entry.reason.length, `${id} unsupported reason empty`).toBeGreaterThan(20);
      expect(entry.searchedSources.length, `${id} no searched sources`).toBeGreaterThan(0);
    }
  });

  it('isControllerVerified agrees with the registry status', () => {
    for (const id of ALL_CONTROLLER_IDS) {
      const expected = EXPECTED_VERIFIED_IDS.has(id);
      expect(isControllerVerified(id), `${id} verified mismatch`).toBe(expected);
    }
  });
});

/**
 * Added 2026-07-29, after an audit found four of the five shipped pin maps
 * were fabricated.
 *
 * The specific hole these close:
 *
 *   - CAT PowerWizard 2.0 shipped 21 invented pins in CONTROLLER_PINS while
 *     this registry recorded it as 'unsupported'. The registry already knew
 *     the data had no source; nothing checked. `pin data implies verified`
 *     below is the check that was missing.
 *
 *   - 'verified' was being read as 'complete'. The Woodward map covers only
 *     the power supply and relay outputs R1-R4, which is genuinely useful but
 *     must not read as the module's whole terminal list — a technician who
 *     cannot find a terminal would conclude it does not exist.
 */
describe('pin data may never outrun its provenance', () => {
  const PANEL = path.join(
    process.cwd(),
    'components/generator-oracle/panels/WiringDiagramsPanel.tsx',
  );

  /** Top-level controller ids that ship a pin array in the panel. */
  function shippedPinControllerIds(): string[] {
    const src = fs.readFileSync(PANEL, 'utf8');
    const start = src.indexOf('const CONTROLLER_PINS');
    expect(start, 'CONTROLLER_PINS declaration not found').toBeGreaterThan(-1);
    // The map ends at the first line that is exactly "};" at column 0.
    const end = src.indexOf('\n};', start);
    expect(end, 'CONTROLLER_PINS terminator not found').toBeGreaterThan(start);
    const body = src.slice(start, end);
    const ids: string[] = [];
    const re = /^ {2}'([a-z0-9-]+)':\s*\[/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body)) !== null) ids.push(m[1]);
    return ids;
  }

  it('the source scan actually finds the shipped maps (guards the scan itself)', () => {
    // If the regex ever stops matching, every assertion below would pass
    // vacuously. Fail loudly instead.
    const ids = shippedPinControllerIds();
    expect(ids.length, 'no CONTROLLER_PINS entries parsed — scan is broken').toBeGreaterThan(0);
    expect(ids).toContain('dse-7320');
  });

  it('every controller shipping pin data is verified in the registry', () => {
    for (const id of shippedPinControllerIds()) {
      const entry = getControllerSource(id);
      expect(entry, `${id} ships pin data but has no registry entry`).toBeDefined();
      expect(
        entry!.status,
        `${id} ships pin data while the registry marks it '${entry!.status}'. ` +
          `Either cite an OEM document for it, or remove the pin map.`,
      ).toBe('verified');
    }
  });

  it('no unsupported controller ships pin data', () => {
    const shipped = new Set(shippedPinControllerIds());
    for (const [id, entry] of Object.entries(CONTROLLER_SOURCES)) {
      if (entry.status !== 'unsupported') continue;
      expect(shipped.has(id), `${id} is unsupported but ships pin data`).toBe(false);
    }
  });

  it('every verified entry declares its completeness', () => {
    for (const id of EXPECTED_VERIFIED_IDS) {
      const e = getControllerSource(id) as VerifiedControllerSource;
      expect(['complete', 'partial'], `${id} completeness missing/invalid`).toContain(
        e.completeness,
      );
    }
  });

  it('partial entries explain what they do not cover', () => {
    for (const [id, entry] of Object.entries(CONTROLLER_SOURCES)) {
      if (entry.status !== 'verified' || entry.completeness !== 'partial') continue;
      expect(
        entry.coverageNote?.length ?? 0,
        `${id} is partial but has no coverageNote saying what is missing`,
      ).toBeGreaterThan(40);
    }
  });

  it('no verified pin map claims an OEM wire colour it cannot source', () => {
    // Every OEM consulted so far publishes cable SIZE but not conductor
    // colour. The fabricated maps invented Red/Black/Purple/Orange/Pink.
    // If a future map does carry real OEM colours, cite them in the registry
    // notes and relax this test deliberately — do not weaken it in passing.
    const src = fs.readFileSync(PANEL, 'utf8');
    const start = src.indexOf('const CONTROLLER_PINS');
    const end = src.indexOf('\n};', start);
    const body = src.slice(start, end);
    const colours = [...body.matchAll(/wireColor:\s*'([^']*)'/g)].map((m) => m[1]);
    expect(colours.length, 'no wireColor fields parsed').toBeGreaterThan(0);
    const invented = colours.filter((c) => c !== 'Not specified by OEM');
    expect(
      invented,
      `wire colours present with no OEM source: ${[...new Set(invented)].join(', ')}`,
    ).toEqual([]);
  });
});
