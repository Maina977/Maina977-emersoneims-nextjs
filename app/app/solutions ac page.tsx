import SectionLead from "../componets/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "AC systems — EmersonEIMS solutions",
  description: "Load calculations, compressor starts, power quality, and hybrid operation with generators and solar.",
  keywords: ["AC systems", "compressor", "harmonics", "hybrid", "EmersonEIMS"],
};

export default function ACSolutionsPage() {
  return (
    <main>
      <SectionLead
        title="AC systems"
        subtitle="Load calculations, compressor starts, power quality, and hybrid operation with generators and solar."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Design & sizing" items={[
          { label: "Load calc", detail: "Enclosure, heat gain, occupancy, equipment" },
          { label: "Starts", detail: "LRA/FLA coordination with inverter/generator surge" },
          { label: "Efficiency", detail: "SEER/EER ratings, variable speed compressors" },
          { label: "Hybrid", detail: "Stagger starts, peak shaving, demand control" },
        ]}/>
        <InfoCard title="Power quality" items={[
          { label: "Harmonics", detail: "Filter design, VFD considerations, THD limits" },
          { label: "Voltage stability", detail: "Buck/boost regulation, tap settings" },
          { label: "Phase", detail: "Sequence & balance, motor protection relays" },
          { label: "Controls", detail: "Thermostat strategy, integration with BMS/EMS" },
        ]}/>
        <InfoCard title="Maintenance" items={[
          { label: "Coils", detail: "Cleaning schedule for coils & filters" },
          { label: "Refrigerant", detail: "Leak checks, charge optimization" },
          { label: "Fans", detail: "Bearings, belts, vibration analysis" },
          { label: "Sensors", detail: "Calibrate temp/pressure sensors regularly" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}