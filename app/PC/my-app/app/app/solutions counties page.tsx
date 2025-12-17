import { COUNTIES } from "@/data/counties";
import SectionLead from "@/componets/generators/SectionLead";

// Generate static metadata for better SEO
export const metadata = {
  title: "Kenya County Solar Insights — EmersonEIMS Solutions",
  description: "Verified irradiance, demand profiles, and sector opportunities for all 47 counties in Kenya.",
  keywords: ["Kenya solar", "county irradiance", "solar potential", "county demand", "EmersonEIMS"],
};

// Pre-computed for performance
const COUNTY_STATS = {
  total: COUNTIES.length,
  avgIrradiance: (COUNTIES.reduce((sum, c) => sum + c.irradiance, 0) / COUNTIES.length).toFixed(1),
  highestIrradiance: Math.max(...COUNTIES.map(c => c.irradiance)),
} as const;

// Component for individual county card (memoized)
function CountyCard({ county }: { county: typeof COUNTIES[number] }) {
  return (
    <article 
      className="p-6 rounded-lg border border-white/10 bg-black/60 hover:bg-black/70 transition-all duration-200 hover:scale-[1.02] hover:border-brand-gold/30 group"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-brand-gold group-hover:text-white transition-colors">
          {county.name}
        </h2>
        <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-sm rounded-full font-medium">
          {county.irradiance} kWh/m²
        </span>
      </div>
      
      <p className="mt-4 text-white/80 text-sm leading-relaxed">
        {county.demandProfile}
      </p>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm font-medium text-white/70 mb-2">Key Sectors:</p>
        <div className="flex flex-wrap gap-2">
          {county.sectors.map((sector: string) => (
            <span 
              key={sector}
              className="px-3 py-1 bg-white/5 text-white/80 text-xs rounded-full border border-white/10 hover:bg-brand-gold/20 hover:border-brand-gold/30 transition-colors"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function CountiesSolutionsPage() {
  return (
    <main>
      <SectionLead
        title="Kenya county solar insights"
        subtitle="Verified irradiance, demand profiles, and sector opportunities for all 47 counties."
      />
      
      {/* Quick Stats */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <p className="text-sm text-white/60">Total Counties</p>
            <p className="text-2xl font-bold text-brand-gold mt-1">{COUNTY_STATS.total}</p>
          </div>
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <p className="text-sm text-white/60">Avg. Irradiance</p>
            <p className="text-2xl font-bold text-brand-gold mt-1">{COUNTY_STATS.avgIrradiance} kWh/m²/day</p>
          </div>
          <div className="p-4 rounded-lg bg-black/40 border border-white/10">
            <p className="text-sm text-white/60">Highest Irradiance</p>
            <p className="text-2xl font-bold text-brand-gold mt-1">{COUNTY_STATS.highestIrradiance} kWh/m²/day</p>
          </div>
        </div>
      </div>

      {/* Counties Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTIES.map((county: typeof COUNTIES[number]) => (
            <CountyCard key={county.id} county={county} />
          ))}
        </div>
        
        {/* Note about remaining counties */}
        {COUNTIES.length < 47 && (
          <div className="mt-8 p-4 rounded-lg bg-brand-gold/5 border border-brand-gold/20">
            <p className="text-sm text-white/80 text-center">
              <span className="font-medium text-brand-gold">Note:</span> Showing {COUNTIES.length} of 47 counties. 
              Complete county data available upon request from our engineering team.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
