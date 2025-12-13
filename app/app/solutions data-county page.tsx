export type CountyData = {
    id: string; // Added for React keys
    name: string;
    irradiance: number; // kWh/m²/day
    demandProfile: string;
    sectors: string[];
  };
  
  // Optimized with as const for better TypeScript inference
  export const COUNTIES: readonly CountyData[] = [
    {
      id: "nairobi",
      name: "Nairobi",
      irradiance: 5.2,
      demandProfile: "High commercial & industrial demand, hospitals, data centers, residential estates.",
      sectors: ["Hospitals", "Data Centers", "Residential", "Factories"] as const,
    },
    {
      id: "mombasa", 
      name: "Mombasa",
      irradiance: 5.5,
      demandProfile: "Tourism-driven demand, hotels, ports, logistics, residential.",
      sectors: ["Hotels", "Ports", "Residential", "Logistics"] as const,
    },
    {
      id: "kisumu",
      name: "Kisumu",
      irradiance: 5.0,
      demandProfile: "Mixed demand: hospitals, schools, agro-processing, residential estates.",
      sectors: ["Hospitals", "Schools", "Agro-processing", "Residential"] as const,
    },
    {
      id: "nakuru",
      name: "Nakuru",
      irradiance: 5.3,
      demandProfile: "Agriculture, factories, schools, growing residential estates.",
      sectors: ["Factories", "Schools", "Farms", "Residential"] as const,
    },
    // Add all 47 counties here with unique IDs
  ] as const;
  
  // Helper function for fast lookup
  export const getCountyById = (id: string) => 
    COUNTIES.find(county => county.id === id);