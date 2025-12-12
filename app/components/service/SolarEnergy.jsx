'use client';

export default function SolarEnergy({ performanceTier = "high" }) {
  return (
    <section id="solar" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Solar Energy
        </h2>
        <p className="text-gray-300 text-lg">Premium solar energy solutions and installations.</p>
      </div>
    </section>
  );
}
