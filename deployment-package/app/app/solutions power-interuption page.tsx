import SectionLead from "../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Power interruptions & power quality — EmersonEIMS solutions",
  description: "Earthing, loading, phases, cabling, installations, and remediation practices.",
  keywords: ["earthing", "power quality", "cabling", "phases", "interruptions", "EmersonEIMS"],
};

export default function PowerInterruptionsPage() {
  return (
    <main>
      <SectionLead
        title="Power interruptions & power quality"
        subtitle="Earthing, over/underloading, single/three phase, cabling, installation standards and remediation."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Earthing fundamentals" items={[
          { label: "Resistance", detail: "Target low ground resistance; improve with rods & soil treatment" },
          { label: "Bonding", detail: "Equipotential bonding for safety & noise control" },
          { label: "SPD", detail: "Surge protective devices on AC/DC sides" },
          { label: "Testing", detail: "Earth tester, loop impedance, periodic verification" },
        ]}/>
        <InfoCard title="Loading & phases" items={[
          { label: "Balancing", detail: "Distribute loads across phases; avoid N conductor overload" },
          { label: "Underload/overload", detail: "Generator sizing, PF correction, demand management" },
          { label: "Single vs three-phase", detail: "Motor starts, harmonics, efficiency considerations" },
          { label: "PF correction", detail: "Cap banks for inductive loads; avoid leading PF issues" },
        ]}/>
        <InfoCard title="Cabling & installs" items={[
          { label: "Sizing", detail: "Cross‑section by current & run length; manage voltage drop" },
          { label: "Routing", detail: "EMI separation, mechanical protection, code compliance" },
          { label: "Terminations", detail: "Torque specs, ferrules, lugs, strain relief" },
          { label: "Inspection", detail: "Visuals, thermal imaging, insulation resistance" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
