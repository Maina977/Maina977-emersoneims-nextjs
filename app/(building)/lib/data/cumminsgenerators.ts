export type GeneratorSpec = {
  model: string;
  kva: number;
  phase: "Single" | "Three";
  engine: string;
  alternator: string;
  fuelType: "Diesel";
  warrantyYears: number;
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
  },
  {
    model: "Cummins C200D5",
    kva: 200,
    phase: "Three",
    engine: "Cummins 6CT8.3-G2",
    alternator: "Stamford UCI274",
    fuelType: "Diesel",
    warrantyYears: 2,
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
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/50-kva-single-phase-cummins-diesel-generator-500x500-1920x1080-1.webp",
    fuelConsumptionLitresPerHour: {
      at25pctLoad: 2.5,
      at50pctLoad: 4.2,
      at75pctLoad: 6.0,
      at100pctLoad: 7.8,
    },
  },
];
