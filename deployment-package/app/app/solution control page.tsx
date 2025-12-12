"use client";

import { useState, useMemo } from "react";
import SectionLead from "../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Generator controls — DeepSea & PowerWizard solutions",
  description: "Error codes, quick fixes, configuration, I/O mapping, communications, and protections for DeepSea & PowerWizard.",
  keywords: ["DeepSea", "PowerWizard", "error codes", "generator control", "EmersonEIMS"],
};

const ERROR_CODES = [
  { code: "DS-100", system: "DeepSea", severity: "Alarm", description: "Low oil pressure", solution: "Check oil level, verify sender calibration, inspect pump." },
  { code: "DS-101", system: "DeepSea", severity: "Shutdown", description: "High coolant temperature", solution: "Inspect radiator, coolant flow, thermostat, fan operation." },
  { code: "DS-102", system: "DeepSea", severity: "Shutdown", description: "Overspeed shutdown", solution: "Governor PID tuning, sensor scaling, debounce settings." },
  { code: "DS-103", system: "DeepSea", severity: "Warning", description: "Battery voltage low", solution: "Check charger, battery condition, cabling, terminals." },
  { code: "PW-200", system: "PowerWizard", severity: "Shutdown", description: "Overspeed shutdown", solution: "Governor PID tuning, sensor scaling, debounce settings." },
  { code: "PW-201", system: "PowerWizard", severity: "Alarm", description: "AVR fault", solution: "Check field voltage, exciter diodes, regulator parameters." },
  { code: "PW-202", system: "PowerWizard", severity: "Warning", description: "Low fuel level", solution: "Check tank sensor, wiring, refuel, calibrate sender." },
  { code: "PW-203", system: "PowerWizard", severity: "Alarm", description: "Reverse power trip", solution: "Phase sequence, synch check logic, power factor correction." },
] as const;

function ErrorCodeDatabase() {
  const [query, setQuery] = useState("");
  const [systemFilter, setSystemFilter] = useState<"All"|"DeepSea"|"PowerWizard">("All");
  const [severityFilter, setSeverityFilter] = useState<"All"|"Warning"|"Alarm"|"Shutdown">("All");

  const filtered = useMemo(() => {
    return ERROR_CODES.filter((e) => {
      const matchesQuery = e.code.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase());
      const matchesSystem = systemFilter === "All" || e.system === systemFilter;
      const matchesSeverity = severityFilter === "All" || e.severity === severityFilter;
      return matchesQuery && matchesSystem && matchesSeverity;
    });
  }, [query, systemFilter, severityFilter]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-display text-brand-gold">Error code database</h2>
      <p className="mt-2 text-white/80">Search DeepSea & PowerWizard error codes. Filter by system and severity.</p>

      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by code or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded bg-black/50 border border-white/20 px-4 py-2 text-white"
          aria-label="Search error codes"
        />

        <select
          value={systemFilter}
          onChange={(e) => setSystemFilter(e.target.value as any)}
          className="rounded bg-black/50 border border-white/20 px-3 py-2 text-white min-w-[150px]"
          aria-label="Filter by system"
        >
          <option value="All">All Systems</option>
          <option value="DeepSea">DeepSea</option>
          <option value="PowerWizard">PowerWizard</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as any)}
          className="rounded bg-black/50 border border-white/20 px-3 py-2 text-white min-w-[150px]"
          aria-label="Filter by severity"
        >
          <option value="All">All Severities</option>
          <option value="Warning">Warning</option>
          <option value="Alarm">Alarm</option>
          <option value="Shutdown">Shutdown</option>
        </select>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {filtered.length === 0 && (
          <p className="text-white/70 col-span-2">No matching error codes found.</p>
        )}
        {filtered.map((e) => (
          <article
            key={`${e.code}-${e.system}`}
            className="p-6 rounded-lg border border-white/10 bg-black/60"
          >
            <h3 className="text-xl font-semibold text-brand-gold">
              {e.code} ({e.system})
            </h3>
            <p className="mt-2 text-white/80">{e.description}</p>
            <p className="mt-2 text-sm text-white/90">
              <span className="font-semibold text-brand-gold">Severity:</span> {e.severity}
            </p>
            <p className="mt-2 text-sm text-white/90">
              <span className="font-semibold text-brand-gold">Solution:</span> {e.solution}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ControlsSolutionsPage() {
  return (
    <main>
      <SectionLead
        title="Generator controls"
        subtitle="DeepSea & PowerWizard error codes, configuration, I/O, communication, and protective logic."
      />

      <ErrorCodeDatabase />

      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard
          title="DeepSea quick fixes"
          items={[
            { label: "Charge alternator fail", detail: "Check D+ sensing, wiring continuity, alternator output" },
            { label: "Low oil pressure", detail: "Verify sender, mechanical pressure, alarm delay settings" },
            { label: "High coolant temp", detail: "Sensor calibration, fan relay, coolant flow" },
            { label: "CAN comms lost", detail: "Bus termination, node IDs, shielding & grounding" },
          ]}
        />
        <InfoCard
          title="PowerWizard quick fixes"
          items={[
            { label: "Overspeed", detail: "Governor PID tuning, sensor scaling, debounce" },
            { label: "AVR fault", detail: "Field voltage check, exciter diodes, regulator parameters" },
            { label: "Reverse power", detail: "Phase sequence, synch check logic, power factor" },
            { label: "Sensor range", detail: "Analog scaling, calibration routine, wiring checks" },
          ]}
        />
        <InfoCard
          title="Best practices"
          items={[
            { label: "Event logs", detail: "Export & analyze trends for predictive service" },
            { label: "Firmware", detail: "Keep versions aligned with module & engine revisions" },
            { label: "I/O mapping", detail: "Document I/O, label harnesses, maintain test points" },
            { label: "Protections", detail: "Set realistic delays, thresholds, add redundancy on critical" },
          ]}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <CTAForm />
      </section>
    </main>
  );
}
