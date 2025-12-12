'use client';

export default function WaterSystems({ performanceTier = "high" }) {
  return (
    <section id="water" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
          Water Systems
        </h2>
        <p className="text-gray-300 text-lg">Water pumping and system solutions.</p>
      </div>
    </section>
  );
}
