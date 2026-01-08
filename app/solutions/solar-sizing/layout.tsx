import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Sizing Calculator Kenya | Panel, Battery, Inverter Sizing | EmersonEIMS",
  description: "Free solar sizing calculator for Kenya. Calculate panel size, battery capacity, inverter rating. Load analysis for homes, offices, farms. Kenya PSH data by region. Design examples included. Call 0768 860 655.",
  keywords: "solar sizing Kenya, solar calculator Kenya, solar panel size calculator, battery sizing calculator, solar system design Kenya, off-grid solar sizing, hybrid solar sizing Kenya, solar load calculation, solar for home Kenya, solar for office Kenya",
  openGraph: {
    title: "Solar Sizing Calculator Kenya | Free Design Tool | EmersonEIMS",
    description: "Calculate exact solar panel, battery, and inverter sizes for your Kenya location. Includes PSH data and design examples.",
    url: "https://emersoneims.com/solutions/solar-sizing",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/solar-sizing" },
};

export default function SolarSizingLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How many solar panels do I need for my home in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Calculate: Daily energy use (kWh) ÷ Peak Sun Hours (4.5-6 in Kenya) ÷ Panel wattage × 1.25 safety factor. Example: 10kWh/day ÷ 5 PSH ÷ 0.5kW panels × 1.25 = 5 panels of 500W each (2.5kW system)." } },
          { "@type": "Question", "name": "What battery size do I need for solar in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Battery Ah = Daily use (Wh) × Days of autonomy ÷ System voltage ÷ 0.5 (DoD for lead-acid) or ÷ 0.8 (DoD for lithium). For 10kWh daily, 1 day autonomy, 48V: 10000 × 1 ÷ 48 ÷ 0.8 = 260Ah lithium." } },
          { "@type": "Question", "name": "What is Peak Sun Hours (PSH) in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Peak Sun Hours in Kenya: Nairobi 5.0, Mombasa 5.5, Kisumu 5.2, Nakuru 5.3, Turkana 6.0+. PSH represents hours of 1000W/m² sunlight. Higher PSH means smaller solar array needed for same output." } },
          { "@type": "Question", "name": "How much does a solar system cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Solar system costs in Kenya 2024: 1kW off-grid: KES 150,000-200,000. 3kW hybrid: KES 400,000-600,000. 5kW hybrid: KES 600,000-900,000. 10kW commercial: KES 1.2-1.8M. Prices include installation." } },
          { "@type": "Question", "name": "What inverter size do I need for solar?", "acceptedAnswer": { "@type": "Answer", "text": "Inverter VA = Maximum simultaneous load × 1.25. Consider surge loads (fridges, pumps need 3× starting current). For 3kW continuous load with fridge: 3000 × 1.25 + fridge surge = 5kVA inverter recommended." } }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Size a Solar System in Kenya",
        "step": [
          { "@type": "HowToStep", "name": "List Appliances", "text": "List all appliances with wattage and daily hours of use" },
          { "@type": "HowToStep", "name": "Calculate Daily Energy", "text": "Multiply each appliance watts × hours, sum total for daily Wh" },
          { "@type": "HowToStep", "name": "Size Panels", "text": "Daily Wh ÷ PSH (5.0 for Nairobi) ÷ 0.8 efficiency = Panel watts needed" },
          { "@type": "HowToStep", "name": "Size Batteries", "text": "Daily Wh × Autonomy days ÷ Voltage ÷ DoD = Battery Ah" },
          { "@type": "HowToStep", "name": "Size Inverter", "text": "Peak load watts × 1.25 + surge allowance = Inverter VA" }
        ]
      },
      { "@type": "Service", "serviceType": "Solar System Design", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
