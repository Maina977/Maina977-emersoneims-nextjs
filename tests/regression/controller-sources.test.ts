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
