'use client';

export default function HighVoltage({ performanceTier = "high" }) {
  return (
    <section id="hv" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
          High Voltage Systems
        </h2>
        <p className="text-gray-300 text-lg">High voltage infrastructure solutions.</p>
      </div>
    </section>
  );
}

