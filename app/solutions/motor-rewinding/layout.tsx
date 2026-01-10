import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motor Rewinding Kenya | Electric Motor Repair, VFD Integration | EmersonEIMS",
  description: "Expert motor rewinding services in Kenya. Electric motor repair, diagnostics, VFD integration, preventive maintenance. All motor sizes from 0.5HP to 500HP. Nairobi workshop. Call +254 768 860 665.",
  keywords: "motor rewinding Kenya, electric motor repair Kenya, motor repair Nairobi, VFD motor Kenya, motor diagnostics, burnt motor repair, motor maintenance Kenya, industrial motor repair, motor winding Kenya, three phase motor repair",
  openGraph: {
    title: "Motor Rewinding Kenya | Expert Repair & Diagnostics | EmersonEIMS",
    description: "Professional motor rewinding, diagnostics, and VFD integration services in Kenya. All motor sizes.",
    url: "https://emersoneims.com/solutions/motor-rewinding",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/motor-rewinding" },
};

export default function MotorRewindingLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How do I know if my motor needs rewinding?", "acceptedAnswer": { "@type": "Answer", "text": "Signs motor needs rewinding: Insulation resistance below 1MΩ, burnt smell, visible winding damage, motor trips repeatedly, unbalanced phase currents (>5% difference), humming but not starting. A megger test confirms winding condition." } },
          { "@type": "Question", "name": "How much does motor rewinding cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Motor rewinding costs in Kenya: Small (0.5-2HP): KES 8,000-20,000. Medium (3-10HP): KES 25,000-60,000. Large (15-50HP): KES 80,000-200,000. Very large (75HP+): KES 250,000+. Price depends on motor size, damage extent, and urgency." } },
          { "@type": "Question", "name": "How long does motor rewinding take?", "acceptedAnswer": { "@type": "Answer", "text": "Motor rewinding timeline: Small motors: 2-3 days. Medium motors: 3-5 days. Large motors: 5-10 days. Emergency service available at premium. Time includes testing, stripping, winding, VPI/dipping, baking, and final testing." } },
          { "@type": "Question", "name": "Can any motor be used with a VFD?", "acceptedAnswer": { "@type": "Answer", "text": "Standard motors can run on VFDs but with considerations: Use inverter-duty motor for best results, install shaft grounding ring for bearing protection, keep cable length under 15m or use output filter, derate motor at low speeds for cooling." } },
          { "@type": "Question", "name": "What causes motor bearing failure?", "acceptedAnswer": { "@type": "Answer", "text": "Bearing failure causes: Over-greasing (most common), under-greasing, misalignment, overloading, bearing currents from VFDs, contamination, improper installation. Prevent with correct greasing schedule and proper alignment." } }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Test Motor Insulation",
        "step": [
          { "@type": "HowToStep", "name": "Safety First", "text": "Disconnect motor from power and controller, lock out/tag out" },
          { "@type": "HowToStep", "name": "Discharge Windings", "text": "Short all windings to ground to discharge any stored energy" },
          { "@type": "HowToStep", "name": "Connect Megger", "text": "Connect megger positive to motor winding, negative to motor frame/ground" },
          { "@type": "HowToStep", "name": "Apply Test Voltage", "text": "Apply 500V for motors up to 500V, 1000V for higher rated motors" },
          { "@type": "HowToStep", "name": "Read Result", "text": "After 1 minute, read insulation resistance. Should be >5MΩ for new, >1MΩ acceptable for old motors" }
        ]
      },
      { "@type": "Service", "serviceType": "Motor Rewinding and Repair", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
