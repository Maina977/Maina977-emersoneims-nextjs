export interface County {
  id: string;
  name: string;
  irradiance: number;
  demandProfile: string;
  sectors: string[];
}

export const COUNTIES: County[] = [
  {
    id: "nairobi",
    name: "Nairobi",
    irradiance: 5.8,
    demandProfile: "High commercial and residential demand with peak loads during business hours.",
    sectors: ["Commercial", "Residential", "Industrial", "Healthcare"]
  },
  {
    id: "mombasa",
    name: "Mombasa",
    irradiance: 5.9,
    demandProfile: "Port city with significant industrial and tourism sectors driving energy needs.",
    sectors: ["Industrial", "Tourism", "Port Operations", "Commercial"]
  },
  {
    id: "kisumu",
    name: "Kisumu",
    irradiance: 5.7,
    demandProfile: "Growing urban center with expanding commercial and residential sectors.",
    sectors: ["Commercial", "Residential", "Agriculture", "Education"]
  },
  {
    id: "nakuru",
    name: "Nakuru",
    irradiance: 5.6,
    demandProfile: "Agricultural hub with processing industries and growing urban population.",
    sectors: ["Agriculture", "Processing", "Commercial", "Residential"]
  },
  {
    id: "eldoret",
    name: "Eldoret",
    irradiance: 5.5,
    demandProfile: "Agricultural processing center with moderate commercial activity.",
    sectors: ["Agriculture", "Processing", "Commercial"]
  },
  {
    id: "thika",
    name: "Thika",
    irradiance: 5.7,
    demandProfile: "Industrial town with manufacturing and processing facilities.",
    sectors: ["Industrial", "Manufacturing", "Commercial"]
  },
  {
    id: "machakos",
    name: "Machakos",
    irradiance: 5.8,
    demandProfile: "Growing satellite town with increasing commercial and residential development.",
    sectors: ["Commercial", "Residential", "Agriculture"]
  },
  {
    id: "kiambu",
    name: "Kiambu",
    irradiance: 5.7,
    demandProfile: "Suburban area with high residential demand and some commercial activity.",
    sectors: ["Residential", "Commercial", "Agriculture"]
  }
];




