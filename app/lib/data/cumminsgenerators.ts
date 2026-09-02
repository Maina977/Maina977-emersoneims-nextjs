/*
 * ─────────────────────────────────────────────────────────────────────────────
 * SPEC PROVENANCE — READ BEFORE RENDERING engine OR alternator.
 *
 * Checked on 2026-08-26 by dividing rated kW by engine displacement. Diesel
 * generator sets realistically produce 15-25 kW per litre. What this table
 * claims:
 *
 *     20 kVA   X2.5        2.5 L    6.4 kW/L   plausible
 *     50 kVA   4BT3.9-G2   3.9 L   10.3 kW/L   plausible
 *    100 kVA   6BT5.9-G2   5.9 L   13.6 kW/L   plausible
 *    200 kVA   6CT8.3-G2   8.3 L   19.3 kW/L   plausible
 *    300 kVA   QSB6.7-G2   6.7 L   35.8 kW/L   IMPOSSIBLE
 *    500 kVA   QSL9-G2     8.9 L   44.9 kW/L   IMPOSSIBLE
 *    750 kVA   QSM11-G2   10.8 L   55.6 kW/L   IMPOSSIBLE
 *   1000 kVA   QSK19-G2     19 L   42.1 kW/L   IMPOSSIBLE
 *   1500 kVA   QSK23-G2     23 L   52.2 kW/L   IMPOSSIBLE
 *   2000 kVA   QSK50-G2     50 L   32.0 kW/L   IMPOSSIBLE
 *
 * The first four are the textbook Cummins pairings — a 4BT3.9-G2 really is the
 * ~50 kVA engine and a 6BT5.9-G2 really is the ~100 kVA engine. From 300 kVA
 * upward the engines are one to three size classes too small: a 10.8 L QSM11
 * producing 600 kW would be roughly double what any diesel achieves.
 *
 * The alternator column is a second, independent tell: Stamford UCI274 is
 * listed for EVERY rating from 100 kVA to 2000 kVA. UCI274 is a ~60-125 kVA
 * frame. One alternator cannot serve a 100 kVA set and a 2000 kVA set.
 *
 * Read together, the column was filled by walking the Cummins engine family
 * list upward against ascending kVA, without checking ratings, and copying one
 * alternator down the rest.
 *
 * NOTHING IS DELETED — these rows still carry model, kVA and phase, which are
 * fine, and the file stays intact for the owner to correct from supplier
 * datasheets. But engine and alternator are now rendered ONLY where
 * specsVerified is true. Publishing a specification we cannot stand behind on
 * a page selling a KES 2,000,000 machine is the one thing worse than saying
 * "confirmed on quotation".
 *
 * ALSO STALE: warrantyYears reads 2 here while CUMMINS_BRAND_INFO and the
 * public pages commit to 3 years plus 1 year free service. It is not rendered
 * anywhere, so it is left alone rather than guessed at — but do not start
 * rendering it without confirming which is current.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export type GeneratorSpec = {
  model: string;
  kva: number;
  phase: "Single" | "Three";
  engine: string;
  alternator: string;
  fuelType: "Diesel";
  warrantyYears: number;
  /**
   * Whether engine and alternator have been checked against a real Cummins
   * configuration for this rating. Only verified specs are rendered — see the
   * provenance note at the top of this file.
   */
  specsVerified?: boolean;
  image?: string;
};

export type CumminsGenerator = GeneratorSpec & {
  fuelConsumptionLitresPerHour?: {
    at25pctLoad: number;
    at50pctLoad: number;
    at75pctLoad: number;
    at100pctLoad: number;
  };
};

// ✅ CORRECT: named export (matches your import `{ cumminsGenerators }`)
export const cumminsGenerators: GeneratorSpec[] = [
  {
    model: "Cummins C20D5",
    kva: 20,
    phase: "Single",
    engine: "Cummins X2.5",
    alternator: "Stamford PI144",
    fuelType: "Diesel",
    warrantyYears: 2,
    specsVerified: true,
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/50-kva-single-phase-cummins-diesel-generator-500x500-1920x1080-1.webp",
  },
  {
    model: "Cummins C50D5",
    kva: 50,
    phase: "Single",
    engine: "Cummins 4BT3.9-G2",
    alternator: "Stamford UC224",
    fuelType: "Diesel",
    warrantyYears: 2,
    specsVerified: true,
    image: "/images/IMG-20250804-WA0006.jpg",
  },
  {
    model: "Cummins C100D5",
    kva: 100,
    phase: "Three",
    engine: "Cummins 6BT5.9-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
    specsVerified: true,
  },
  {
    model: "Cummins C200D5",
    kva: 200,
    phase: "Three",
    engine: "Cummins 6CT8.3-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
    specsVerified: true,
  },
  {
    model: "Cummins C300D5",
    kva: 300,
    phase: "Three",
    engine: "Cummins QSB6.7-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
  },
  {
    model: "Cummins C500D5",
    kva: 500,
    phase: "Three",
    engine: "Cummins QSL9-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
  },
  {
    model: "Cummins C750D5",
    kva: 750,
    phase: "Three",
    engine: "Cummins QSM11-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
  },
  {
    model: "Cummins C1000D5",
    kva: 1000,
    phase: "Three",
    engine: "Cummins QSK19-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
  },
  {
    model: "Cummins C1500D5",
    kva: 1500,
    phase: "Three",
    engine: "Cummins QSK23-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
  },
  {
    model: "Cummins C2000D5",
    kva: 2000,
    phase: "Three",
    engine: "Cummins QSK50-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
  },
];

export const cumminsFuelData: CumminsGenerator[] = [
  {
    model: "Cummins C20D5",
    kva: 20,
    phase: "Single",
    engine: "Cummins X2.5",
    alternator: "Stamford PI144",
    fuelType: "Diesel",
    warrantyYears: 2,
    specsVerified: true,
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/50-kva-single-phase-cummins-diesel-generator-500x500-1920x1080-1.webp",
    fuelConsumptionLitresPerHour: {
      at25pctLoad: 2.5,
      at50pctLoad: 4.2,
      at75pctLoad: 6.0,
      at100pctLoad: 7.8,
    },
  },
];
