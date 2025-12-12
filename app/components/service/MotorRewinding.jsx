'use client';

export default function MotorRewinding({ performanceTier = "high" }) {
  return (
    <section id="motor" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Motor Rewinding
        </h2>
        <p className="text-gray-300 text-lg">Motor repair and rewinding services.</p>
      </div>
    </section>
  );
}
