// ═══════════════════════════════════════════════════════════════════════════════
// SectorPowerContent — UNIQUE-per-sector, server-rendered content driven by the
// sector's category + its own name/powerNeeds/challenges, so each /sectors/[sector]
// page reads differently (category frame + the sector's specific data woven in).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  Callout,
} from '@/components/content/EngineeringDeepDive';

interface Sector { name: string; category: string; description?: string; powerNeeds?: string[]; challenges?: string[] }

const CAT: Record<string, { target: string; angle: string }> = {
  educational: { target: '99.9% during teaching and exams', angle: 'The priority is continuity during exams and protection for computer and science labs, with budget and fee-cycle realities in mind. Boarding facilities add overnight safety-critical loads (lighting, water, security). Solar suits the heavy daytime, large-roof profile and cuts running costs.' },
  healthcare: { target: '99.99% — millisecond transfer to the critical branch', angle: 'Theatres, ICU and life-support sit on a critical branch that must never see darkness — bridged by an online UPS to a generator with zero transfer time. Compliance documentation and clean power are part of the deliverable, alongside incineration and water where needed.' },
  financial: { target: '99.99%+ with N+1 / 2N redundancy', angle: 'Continuity and clean power decide everything: dual-corded equipment, redundant UPS, synchronised generators, surge protection and CBK-aligned reliability documentation, standardised across the branch network.' },
  commercial: { target: '99.9% with seamless changeover', angle: 'Customer experience and stock are at stake — point-of-sale, refrigeration and lighting must ride through outages with a fast, near-seamless changeover, and cold chain must restore automatically.' },
  institutional: { target: '99.9%, often off-grid-ready', angle: 'Government and NGO facilities add procurement compliance (AGPO, documentation) and frequently sit in remote or off-grid locations — favouring solar-plus-storage with generator backup and remote monitoring.' },
  industrial: { target: '99.9% with clean, motor-start-capable power', angle: 'The challenge is brute load and clean control together: heavy motor starts dictate generator and alternator sizing, while VFDs and rectifiers demand power-quality management (power-factor correction, harmonic mitigation) to protect drives and avoid KPLC penalties.' },
  residential: { target: '99.9% for common-area and unit loads', angle: 'Silent operation and seamless changeover matter most — lifts, water pressurisation, common lighting, security and fire systems are the loads residents depend on, with estate-wide distribution for multi-block developments.' },
  religious: { target: '99.9% during services and events', angle: 'Large, occasional gatherings mean the audio-visual, lighting and cooling for a full hall must work flawlessly for a few hours — sized for the peak event without an oversized set idling all week, and affordable, often with solar.' },
  tourism: { target: '99.9% — invisible to guests', angle: 'The power system must be invisible: silent, attenuated generators and seamless changeover so guests never notice an outage, with coastal corrosion protection where applicable and priority on kitchens, cold storage and lifts.' },
};

export default function SectorPowerContent({ sector }: { sector: Sector }) {
  const c = CAT[sector.category] ?? CAT.commercial;
  const needs = (sector.powerNeeds ?? []).join(', ');
  const challenges = (sector.challenges ?? []).join(', ');

  return (
    <DeepDiveSection
      id="sector-power"
      eyebrow={`${sector.category} sector · power engineering`}
      title={`Why ${sector.name} Need Engineered Power — Not Just a Generator`}
      accent="cyan"
      intro={`Reliable power for ${sector.name.toLowerCase()} is a specific engineering brief, not a one-size box. Here is what the ${sector.category} sector actually requires and how we meet it.`}
    >
      <DeepDiveBlock heading={`The reliability the ${sector.category} sector demands`} accent="cyan">
        <p>
          For {sector.name.toLowerCase()}, the realistic availability target is around <strong>{c.target}</strong>. {c.angle}
        </p>
        {needs && (
          <p>
            The loads that define {sector.name.toLowerCase()} — <strong>{needs}</strong> — set the sizing and the priority of what
            must stay live during an outage. We base the design on a measured load profile so the system carries the worst real
            case (the heaviest motor start while everything else runs), not a brochure average.
          </p>
        )}
        {challenges && (
          <p>
            The recurring challenges here — {challenges} — are exactly what the engineering has to defeat: correct sizing,
            clean power, a fast and reliable changeover, the right protection, and an SLA that keeps the system ready. We solve
            them as a system (generator, UPS, solar and switchgear designed to cooperate), document it, and maintain it across
            every site under one contract.
          </p>
        )}
      </DeepDiveBlock>

      <Callout title={`Power solutions for ${sector.name}`} accent="cyan">
        Generators, solar, UPS, motors, HVAC and electrical works engineered for {sector.name.toLowerCase()} across all 47
        counties. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong> for a
        written quotation.
      </Callout>
    </DeepDiveSection>
  );
}
