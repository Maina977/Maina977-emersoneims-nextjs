import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Borehole Drilling: How to Avoid Dry Holes in Kenya',
  description: 'Borehole location selection, drilling success rates by county, aquifer mapping, yield prediction. Avoid costly dry holes.',
};

export default function BoreholeDrillingBlogPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">Borehole Drilling: How to Avoid Dry Holes in Kenya</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 9 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            You drill a borehole. Spend KES 300K-1M on the project. The drill bit hits bedrock at 80 meters with no water. Total loss. Dry hole.
          </p>

          <p>
            This happens to 1 in 5 boreholes in Kenya if location is guessed. But it doesn't have to. Proper geological survey prevents dry holes 95% of the time. Here's how.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Why Dry Holes Happen</h2>

          <p>
            Groundwater in Kenya sits in aquifer layers 20-200 meters underground. These layers are uneven. One location has water at 40 meters. 100 meters away, the aquifer is 150 meters deep. Or nonexistent.
          </p>

          <p className="mt-3">
            Drilling blind (guessing location) gives you 20% success rate. With proper geological survey, success jumps to 95%.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Success Rates by County</h2>

          <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-blue-400 mb-4">High Success Zones (85-95%)</p>
            <div className="space-y-2 text-sm">
              <p>• Nairobi, Kiambu, Murang'a: Good aquifer depth, consistent groundwater</p>
              <p>• Mombasa, Kilifi: Coastal aquifers, deep but reliable</p>
              <p>• Kisumu, Siaya: Lake Victoria influence, good water tables</p>
              <p>• Nakuru, Narok: Rift Valley aquifers, variable depths</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-blue-400 mb-4">Medium Risk Zones (60-80%)</p>
            <div className="space-y-2 text-sm">
              <p>• Kajiado, Makueni, Taita Taveta: Arid climate, deeper drilling needed</p>
              <p>• Turkana, Samburu, Wajir: Harsh climate, variable aquifers</p>
              <p>• Elgeyo-Marakwet, West Pokot: Mountainous, complex geology</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-blue-400 mb-4">High Risk Zones (40-60%)</p>
            <div className="space-y-2 text-sm">
              <p>• Isiolo, Garissa, Mandera: Semi-arid, sparse groundwater</p>
              <p>• High-altitude areas (Nyahururu, parts of Nandi): Bedrock close to surface</p>
              <p>• These areas need professional survey + deeper drilling budgets</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Professional Survey Process</h2>

          <h3 className="text-xl font-bold text-blue-400 mt-6 mb-3">Step 1: Desktop Geological Analysis</h3>
          <p>
            Analyze satellite imagery, existing borehole records, geological maps. Identify aquifer layers in your area. Cost: KES 50K-100K. Time: 3-5 days.
          </p>

          <h3 className="text-xl font-bold text-blue-400 mt-6 mb-3">Step 2: Site Hydrogeology Assessment</h3>
          <p>
            Physical site visit. Check topography, soil type, vegetation, existing wells. Preliminary drilling depth estimate. Cost: KES 50K-100K. Time: 1 day on-site.
          </p>

          <h3 className="text-xl font-bold text-blue-400 mt-6 mb-3">Step 3: Geophysical Survey (Optional but Recommended)</h3>
          <p>
            Electrical resistivity imaging (ERI) shows aquifer layers underground without drilling. Cost: KES 100K-300K. Accuracy: 90%+.
          </p>

          <h3 className="text-xl font-bold text-blue-400 mt-6 mb-3">Step 4: Drilling Depth Recommendation</h3>
          <p>
            Based on all data, recommend optimal drilling depth (e.g., "drill to 95 meters for confident yield"). Gives driller clear target.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Typical Borehole Drilling Costs</h2>

          <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-blue-400 mb-4">Full Project Example (Nairobi)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Geological survey:</span><span className="text-blue-400">KES 150K</span></div>
              <div className="flex justify-between"><span>Drilling (60 meters):</span><span className="text-blue-400">KES 300-400K</span></div>
              <div className="flex justify-between"><span>Casing & testing:</span><span className="text-blue-400">KES 100-150K</span></div>
              <div className="flex justify-between"><span>Pump installation:</span><span className="text-blue-400">KES 100-200K</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-bold">
                <span>Total:</span><span className="text-blue-400">KES 650K-900K</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">If You Get a Dry Hole (Emergency Protocol)</h2>

          <p>
            Despite best efforts, 5% of professional surveys still miss. Here's what happens:
          </p>

          <p className="mt-3">
            <strong>1. Assess the situation:</strong> Drill 20 meters deeper (aquifer may be just below). Cost: KES 50-100K. Success rate: 30-40%.
          </p>

          <p className="mt-3">
            <strong>2. Move location nearby:</strong> Drill 50-100m away from original hole. Cost: Full drilling repeat. Success: 70-80% (geology usually shifts gradually).
          </p>

          <p className="mt-3">
            <strong>3. Revert to existing borehole:</strong> If location has old borehole (neighbors, previous owner), rehabilitate it instead. Cost: KES 50-200K. No risk.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">What Affects Yield (Water Per Hour)</h2>

          <p>
            Even successful boreholes vary wildly in yield:
          </p>

          <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
            <li><strong>Aquifer type:</strong> Volcanic rock holds more water than granite</li>
            <li><strong>Depth:</strong> Deeper usually = better yield, but not always</li>
            <li><strong>Borehole diameter:</strong> Wider holes capture more water</li>
            <li><strong>Seasonal variation:</strong> Dry season yields 30-50% less than rainy season</li>
            <li><strong>Regional rainfall:</strong> Low-rain areas (Turkana) have lower yields</li>
          </ul>

          <p className="mt-3">
            Professional survey predicts yield within ±20%. After drilling, pump test confirms actual yield.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Red Flags to Watch</h2>

          <p>
            If a driller tells you any of these, proceed with caution:
          </p>

          <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
            <li>"We don't need a survey—I can tell by looking" (Red flag: guessing)</li>
            <li>"We guarantee we'll hit water" (Red flag: unrealistic promise)</li>
            <li>"Survey costs too much, let's just drill" (Red flag: cutting corners)</li>
            <li>"Other boreholes nearby worked, so this one will too" (Red flag: geology varies)</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Honest Approach</h2>

          <p>
            Professional borehole drilling:
          </p>

          <ol className="list-decimal list-inside space-y-3 mt-3 ml-2">
            <li>Start with geological survey (90% of dry hole prevention)</li>
            <li>Drill to recommended depth based on survey</li>
            <li>Test yield with pump (confirms it works)</li>
            <li>Install permanent pump system</li>
            <li>Maintain regularly to prevent breakdowns</li>
          </ol>

          <p className="mt-3">
            Total time: 2-3 weeks. Cost: KES 650K-1.5M depending on depth. Success rate: 95%.
          </p>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mt-8">
            <p className="text-blue-300 mb-4">
              <strong>Planning a borehole? Get professional geological survey first.</strong> It's 15% of drilling cost and prevents 95% of failures.
            </p>
            <Link href="/tools/aquascan-pro" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
              Get Borehole Analysis with AquaScan Pro
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
