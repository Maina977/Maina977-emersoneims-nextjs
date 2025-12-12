'use client';

export default function HVACSystems({ performanceTier = "high" }) {
  return (
    <section id="hvac" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
          HVAC Systems
      </h2>
        <p className="text-gray-300 text-lg">Heating, ventilation, and air conditioning solutions.</p>
      </div>
    </section>
  );
}
