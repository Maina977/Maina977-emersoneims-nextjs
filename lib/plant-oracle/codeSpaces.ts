/**
 * PUBLISHED CODE SPACES — structural coverage for codes we hold no entry for.
 *
 * WHAT THIS IS FOR
 * A technician types a code off a machine. If we hold a curated record, they
 * get the answer. If we do not, the old behaviour was a flat "no verified
 * record" — true, but it threw away information we genuinely have: the SHAPE
 * of the code tells you which system reported it and, for the standardised
 * spaces, what kind of fault it is.
 *
 * P0217 is not in our Kubota table, but P0217 is an SAE J2012 powertrain code
 * in the 0200-0299 block, which is the fuel-and-air-metering group. That is a
 * real, published fact and it is worth saying.
 *
 * WHAT THIS IS EMPHATICALLY NOT
 * These spaces are NOT counted as fault codes we hold, and nothing here is
 * pre-generated into records. There is no expansion of P0000..P3FFF into its
 * 16,384 rows — that is the template expansion that produced the ~451,000
 * figure on the generator side, and it is the thing that had to be undone
 * before. A space is matched at lookup time and reported as classification,
 * clearly separated from a verified answer.
 *
 * SOURCES OF THE SPACES THEMSELVES
 *   SAE J2012 / OBD-II P-codes — the P0/P1/P2/P3 structure and the system
 *     groupings are the published standard; used by Kubota and JCB engines.
 *   SAE J1939 SPN/FMI — SPN is a 19-bit field, so 0..524287, and FMI is
 *     0..31 with 22 defined values. Used by John Deere, Bobcat engine faults
 *     and every other J1939 engine.
 *   Manufacturer prefixes — Komatsu CA/E, Volvo ER/MA/SE/SW/HE/RE, Hitachi
 *     five-digit controller codes, Bobcat letter-prefixed controller codes.
 *     These prefixes are consistently documented across sources; the
 *     SUBDIVISIONS inside them are not, so none are claimed.
 */

export interface CodeSpace {
  /** Which maker(s) use this space. */
  readonly brands: readonly string[];
  readonly label: string;
  /** Matches a code string that belongs to this space. */
  readonly test: RegExp;
  /** How many distinct code numbers the space contains, where it is bounded. */
  readonly size: number | null;
  /** What can be said about ANY code in this space, verified or not. */
  readonly meaning: string;
}

/** SAE J2012 first-digit groups — published, and stable across makers. */
const SAE_GROUPS: Record<string, string> = {
  '00': 'fuel and air metering, plus auxiliary emission controls',
  '01': 'fuel and air metering',
  '02': 'fuel and air metering, injector circuits',
  '03': 'ignition system or misfire',
  '04': 'auxiliary emission controls, including EGR and aftertreatment',
  '05': 'vehicle speed, idle control and auxiliary inputs',
  '06': 'computer output circuits and module communication',
  '07': 'transmission',
  '08': 'transmission',
  '09': 'transmission and control module',
};

export const CODE_SPACES: readonly CodeSpace[] = [
  {
    brands: ['Kubota', 'JCB'],
    label: 'SAE J2012 powertrain code',
    test: /^P[0-3][0-9A-F]{3}$/i,
    size: 4 * 4096,
    meaning:
      'A standardised powertrain diagnostic code. The first digit after P shows who defined it — 0 and 2 are SAE-defined, 1 and 3 are manufacturer-defined — and the next two digits identify the system group.',
  },
  {
    brands: ['John Deere', 'Bobcat', 'Yanmar'],
    label: 'J1939 SPN.FMI pair',
    test: /^0*\d{1,6}[.\-]\d{1,2}$/,
    size: 524288,
    meaning:
      'A J1939 fault: the first number is the SPN identifying which parameter is at fault, the second is the FMI identifying how it failed. Both halves mean the same thing on any J1939 engine, so this decodes even where we hold no manufacturer entry.',
  },
  {
    brands: ['Komatsu'],
    label: 'Komatsu engine (CA) code',
    test: /^CA\d{3}$/i,
    size: 900,
    meaning:
      'A Komatsu engine controller code. CA codes originate in the engine ECM rather than the machine monitor, so the fault is on the engine side.',
  },
  {
    brands: ['Komatsu'],
    label: 'Komatsu machine (E) code',
    test: /^E\d{2,3}$/i,
    size: 999,
    meaning:
      'A Komatsu machine controller code shown on the monitor. These cover hydraulics, solenoids and machine electrics rather than the engine.',
  },
  {
    brands: ['Volvo CE'],
    label: 'Volvo control-unit code',
    test: /^(ER|MA|SE|SW|HE|RE)[0-9A-F]{2,4}-\d{2}$/i,
    size: null,
    meaning:
      'A Volvo code with its FMI suffix after the dash. The letter prefix identifies the component class — ER for control units and sensors, MA for actuators and solenoids, SE for sensors, SW for switches, HE and RE for heating and relays.',
  },
  {
    brands: ['Hitachi'],
    label: 'Hitachi ZAXIS controller code',
    test: /^\d{5}-\d{1,2}$/,
    size: null,
    meaning:
      'A Hitachi controller code with its failure-mode suffix after the dash. The five-digit body identifies the monitored circuit.',
  },
  {
    brands: ['SANY'],
    label: 'SANY system-prefixed code',
    test: /^[PHE]\d{3}$/i,
    size: null,
    meaning:
      'A SANY code whose prefix names the system that raised it — P for the engine, H for hydraulics, E for electrical and controller faults. That alone narrows where to look before any lookup.',
  },
  {
    brands: ['Bobcat'],
    label: 'Bobcat controller code',
    test: /^[A-M]\d{2,4}[0-9A-F]?(-\d{1,2})?$/i,
    size: null,
    meaning:
      'A Bobcat controller code. The leading letter identifies the reporting module, and a suffix after the dash, where present, is the failure mode.',
  },
];

export interface SpaceMatch {
  label: string;
  brands: readonly string[];
  meaning: string;
  /** Extra detail derived from the code itself, where the space allows it. */
  detail?: string;
}

/**
 * Classify a code we hold no record for.
 *
 * Returns null when the code matches no published space — which is itself an
 * honest answer, and better than inventing a category for it.
 */
export function classifyCode(code: string): SpaceMatch | null {
  const c = code.trim();
  for (const s of CODE_SPACES) {
    if (!s.test.test(c)) continue;

    let detail: string | undefined;

    if (s.label.startsWith('SAE J2012')) {
      const group = c.slice(1, 3).toUpperCase();
      const named = SAE_GROUPS[group];
      const defined = /^[02]/.test(c.slice(1, 2)) ? 'SAE-defined' : 'manufacturer-defined';
      if (named) detail = `Group ${group} — ${named}. This code is ${defined}.`;
      else detail = `This code is ${defined}.`;
    }

    if (s.label.startsWith('SANY')) {
      const sys = c[0].toUpperCase();
      const named =
        sys === 'P' ? 'engine' : sys === 'H' ? 'hydraulics' : 'electrical or controller';
      detail = `Prefix ${sys} — the fault was raised by the ${named} system.`;
    }

    if (s.label.startsWith('J1939')) {
      const [spnRaw, fmiRaw] = c.split(/[.\-]/);
      const spn = Number(spnRaw);
      const fmi = Number(fmiRaw);
      if (Number.isFinite(spn) && Number.isFinite(fmi)) {
        detail = `SPN ${spn}, FMI ${fmi}. Try the J1939 decoder below for the failure mode.`;
      }
    }

    return { label: s.label, brands: s.brands, meaning: s.meaning, detail };
  }
  return null;
}

/**
 * Size of the published spaces we can structurally classify.
 *
 * Reported SEPARATELY from the curated count and never added to it. The
 * unbounded spaces (Volvo, Hitachi, Bobcat, SANY) contribute nothing to this
 * figure because their bounds are not published, and guessing at them to
 * inflate the number is exactly what this file exists to avoid.
 */
export function getSpaceCoverage() {
  const bounded = CODE_SPACES.filter((s) => s.size !== null);
  return {
    spaces: CODE_SPACES.length,
    boundedSpaces: bounded.length,
    unboundedSpaces: CODE_SPACES.length - bounded.length,
    numbersCovered: bounded.reduce((a, s) => a + (s.size ?? 0), 0),
  };
}
