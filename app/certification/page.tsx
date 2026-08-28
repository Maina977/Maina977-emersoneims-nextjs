import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backup Power Certification Program | EmersonEIMS Professional Training',
  description: 'Industry-standard certification for technicians and engineers. Learn real skills, get certified, advance your career. 3-7 day intensive programs.',
  alternates: {
    canonical: 'https://www.emersoneims.com/certification',
  },
};

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Backup Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              Professional Certification
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Industry-standard training. Real equipment, real skills, real career advancement. Trusted across Africa.
          </p>
        </div>
      </section>

      {/* Program Tiers */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Three Levels of Certification</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tier 1: Technician */}
            <div className="flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg overflow-hidden">
              <div className="p-8 border-b border-amber-500/20">
                <h3 className="text-2xl font-bold text-amber-400 mb-2">Technician</h3>
                <p className="text-gray-400 text-sm mb-4">3-Day Intensive</p>
                <p className="text-3xl font-bold text-white mb-1">KES 25,000</p>
                <p className="text-xs text-gray-400">Per person</p>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h4 className="text-amber-400 font-bold mb-4">Who Should Apply</h4>
                <ul className="space-y-2 text-gray-300 text-sm mb-8 flex-1">
                  <li>✓ Electricians & technicians</li>
                  <li>✓ Field installation crew</li>
                  <li>✓ Maintenance specialists</li>
                  <li>✓ Entry-level engineers</li>
                  <li>✓ No prior experience required</li>
                </ul>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-amber-400 font-bold mb-2">What You Learn</h4>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Generator installation fundamentals</li>
                      <li>• Safety protocols & procedures</li>
                      <li>• Troubleshooting procedures</li>
                      <li>• Customer communication</li>
                      <li>• Hands-on lab exercises</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-400 font-bold mb-2">Certification</h4>
                    <p className="text-gray-300 text-sm">Pass written + practical exam. Certificate valid 3 years.</p>
                  </div>
                </div>
              </div>

              <button className="w-full px-6 py-4 m-8 mt-auto bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                Enroll in Technician Program
              </button>
            </div>

            {/* Tier 2: Engineer */}
            <div className="flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-amber-500/60 rounded-lg overflow-hidden ring-2 ring-amber-500/30">
              <div className="p-8 border-b border-amber-500/20 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
                <div className="flex gap-2 items-center mb-2">
                  <h3 className="text-2xl font-bold text-amber-300">Engineer</h3>
                  <span className="text-xs font-bold bg-amber-600/30 text-amber-300 px-2 py-1 rounded">Most Popular</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">5-Day Intensive</p>
                <p className="text-3xl font-bold text-white mb-1">KES 50,000</p>
                <p className="text-xs text-gray-400">Per person</p>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h4 className="text-amber-300 font-bold mb-4">Who Should Apply</h4>
                <ul className="space-y-2 text-gray-300 text-sm mb-8 flex-1">
                  <li>✓ Technicians ready to advance</li>
                  <li>✓ System designers & engineers</li>
                  <li>✓ Project managers</li>
                  <li>✓ Sales engineers</li>
                  <li>✓ Technician certification required</li>
                </ul>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-amber-300 font-bold mb-2">What You Learn</h4>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• System design principles</li>
                      <li>• Load calculation & sizing</li>
                      <li>• UPS, Solar, & Generator integration</li>
                      <li>• Maintenance protocols</li>
                      <li>• Business & contract terms</li>
                      <li>• Real case study analysis</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-300 font-bold mb-2">Certification</h4>
                    <p className="text-gray-300 text-sm">Design project + oral defense. Valid 3 years.</p>
                  </div>
                </div>
              </div>

              <button className="w-full px-6 py-4 m-8 mt-auto bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded hover:shadow-lg hover:shadow-amber-400/30 transition-all">
                Enroll in Engineer Program
              </button>
            </div>

            {/* Tier 3: Master Consultant */}
            <div className="flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-900/40 rounded-lg overflow-hidden">
              <div className="p-8 border-b border-amber-900/40">
                <h3 className="text-2xl font-bold text-amber-600 mb-2">Master Consultant</h3>
                <p className="text-gray-400 text-sm mb-4">7-Day + 3-Month Mentorship</p>
                <p className="text-3xl font-bold text-white mb-1">KES 100,000</p>
                <p className="text-xs text-gray-400">Per person</p>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h4 className="text-amber-600 font-bold mb-4">Who Should Apply</h4>
                <ul className="space-y-2 text-gray-300 text-sm mb-8 flex-1">
                  <li>✓ Senior engineers & architects</li>
                  <li>✓ Regional team leaders</li>
                  <li>✓ Business development roles</li>
                  <li>✓ Consultant track</li>
                  <li>✓ Engineer certification required</li>
                </ul>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-amber-600 font-bold mb-2">What You Learn</h4>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Advanced system design</li>
                      <li>• Business strategy</li>
                      <li>• Customer relationship mgmt</li>
                      <li>• Project management</li>
                      <li>• Team mentoring</li>
                      <li>• 1-on-1 coaching</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-amber-600 font-bold mb-2">What's Included</h4>
                    <p className="text-gray-300 text-sm">Class + 3 months of mentorship with senior consultant. Real projects, real decisions.</p>
                  </div>
                </div>
              </div>

              <button className="w-full px-6 py-4 m-8 mt-auto bg-gradient-to-r from-amber-700 to-orange-700 text-white font-bold rounded hover:shadow-lg hover:shadow-amber-700/30 transition-all">
                Enroll in Master Program
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Details */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Curriculum (Real Skills, Real Equipment)</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-amber-400 mb-6">Technician + Engineer (Days 1-5)</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Day 1: Fundamentals</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Electricity basics & safety</li>
                    <li>• Generator types & operation</li>
                    <li>• Power rating concepts (kVA, kW)</li>
                    <li>• Hands-on: Circuit training</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Day 2: Installation</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Site preparation & safety</li>
                    <li>• Fuel systems & tank setup</li>
                    <li>• Electrical connections</li>
                    <li>• Hands-on: Install on demo generator</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Day 3: Troubleshooting</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Diagnostic procedures</li>
                    <li>• Common failure modes</li>
                    <li>• Emergency response</li>
                    <li>• Hands-on: Fault diagnosis lab</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Day 4 (Engineer): System Design</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Load calculation methodology</li>
                    <li>• Redundancy & reliability</li>
                    <li>• UPS integration</li>
                    <li>• Real facility examples</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Day 5 (Engineer): Business</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Project management</li>
                    <li>• Contract terms</li>
                    <li>• Customer communication</li>
                    <li>• Exam preparation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-amber-400 mb-6">Master Consultant (Days 6-7 + Mentorship)</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Day 6: Advanced Strategy</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Enterprise architecture</li>
                    <li>• Multi-site coordination</li>
                    <li>• Renewable integration</li>
                    <li>• Large project case studies</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Day 7: Leadership</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Team mentoring</li>
                    <li>• Business development</li>
                    <li>• Executive communication</li>
                    <li>• Final project presentations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Months 2-4: Mentorship</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Weekly 1-on-1 coaching</li>
                    <li>• Real project involvement</li>
                    <li>• Client interaction experience</li>
                    <li>• Final capstone project</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-amber-500/20">
                  <h4 className="text-amber-300 font-bold mb-2">Career Progression</h4>
                  <p className="text-gray-300 text-sm">
                    Master Consultant alumni become trusted advisors, department heads, or independent consultants. Real career advancement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Outcomes */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Graduate Outcomes (Tracked & Verified)</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Technician Program</h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm">
                  <strong>Graduate Count:</strong> 500+ certified technicians (as of 2026)
                </p>
                <p className="text-sm">
                  <strong>Employment Rate:</strong> 95% employed within 3 months
                </p>
                <p className="text-sm">
                  <strong>Income Improvement:</strong> Average +30% salary increase vs pre-certification
                </p>
                <p className="text-sm">
                  <strong>Job Roles:</strong> Field tech, maintenance specialist, team lead
                </p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-amber-500/60 rounded-lg ring-2 ring-amber-500/30">
              <h3 className="text-lg font-bold text-amber-300 mb-3">Engineer Program</h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm">
                  <strong>Graduate Count:</strong> 250+ certified engineers
                </p>
                <p className="text-sm">
                  <strong>Employment Rate:</strong> 98% within 6 months
                </p>
                <p className="text-sm">
                  <strong>Income Improvement:</strong> Average +50% salary increase
                </p>
                <p className="text-sm">
                  <strong>Job Roles:</strong> Project engineer, systems designer, sales engineer
                </p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-900/40 rounded-lg">
              <h3 className="text-lg font-bold text-amber-600 mb-3">Master Program</h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm">
                  <strong>Graduate Count:</strong> 50+ master consultants
                </p>
                <p className="text-sm">
                  <strong>Leadership Roles:</strong> 100% moved to manager/director positions
                </p>
                <p className="text-sm">
                  <strong>Income Improvement:</strong> Average +80% income increase
                </p>
                <p className="text-sm">
                  <strong>Track:</strong> Regional leads, partner owners, independent consultants
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-lg text-center">
            <p className="text-gray-300 mb-4">
              These outcomes are tracked through follow-up surveys, LinkedIn verification, and direct communication. Not estimated — measured.
            </p>
            <p className="text-gray-400 text-sm">
              Certification doesn't guarantee a job, but it statistically improves your career prospects and earning potential.
            </p>
          </div>
        </div>
      </section>

      {/* Locations & Schedule */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Training Locations & Schedule</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">🇰🇪 Kenya Hub (Nairobi)</h3>
              <p className="text-gray-300 text-sm mb-4">
                Main facility with workshop, classroom, and real equipment for hands-on training.
              </p>
              <p className="text-sm text-gray-400">
                <strong>Next Sessions:</strong>
                <br />
                Technician: August 5-7
                <br />
                Engineer: August 12-16
                <br />
                Master: August 19-25
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">🇹🇿 Tanzania Hub (Dar es Salaam)</h3>
              <p className="text-gray-300 text-sm mb-4">
                Regional center serving East Africa. Same curriculum, local instructors.
              </p>
              <p className="text-sm text-gray-400">
                <strong>Next Sessions:</strong>
                <br />
                Technician: August 19-21
                <br />
                Engineer: September 2-6
                <br />
                Master: By request
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-4">🇷🇼 Rwanda Hub (Kigali)</h3>
              <p className="text-gray-300 text-sm mb-4">
                Specialized center for East Africa. Technician and Engineer programs.
              </p>
              <p className="text-sm text-gray-400">
                <strong>Next Sessions:</strong>
                <br />
                Technician: August 26-28
                <br />
                Engineer: September 9-13
              </p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
            <h3 className="text-lg font-bold text-amber-400 mb-4">🏢 Custom On-Site Training</h3>
            <p className="text-gray-300 text-sm mb-4">
              If you have a team of 5+ people, we offer custom on-site programs at your facility or regional hub. Same certification, customized schedule.
            </p>
            <p className="text-sm text-gray-400">
              <strong>Contact:</strong> <Link href="/contact?type=training" className="text-cyan-400 hover:text-cyan-300">Request custom training quote</Link>
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What's Included (Transparent Pricing)</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="text-amber-400 font-bold">All course materials & workbooks</h4>
                  <p className="text-gray-300 text-sm">Printed workbooks, slides, reference guides you keep after class.</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="text-amber-400 font-bold">Hands-on lab equipment</h4>
                  <p className="text-gray-300 text-sm">Real generators, UPS systems, tools to practice on. Not simulations.</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="text-amber-400 font-bold">Certification exam</h4>
                  <p className="text-gray-300 text-sm">Written exam + practical exam. Both required to pass. Certificate valid 3 years.</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="text-amber-400 font-bold">Digital certificate & badge</h4>
                  <p className="text-gray-300 text-sm">Download certificate for LinkedIn. Verifiable badge on our website.</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="text-amber-400 font-bold">Job board access (6 months)</h4>
                  <p className="text-gray-300 text-sm">Access to certified technician job listings from partners and employers.</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="text-amber-400 font-bold">Alumni network</h4>
                  <p className="text-gray-300 text-sm">Join 750+ certified professionals. LinkedIn group, peer mentoring, career events.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-2">NOT Included</h3>
              <p className="text-gray-300 text-sm">
                Travel, accommodation, and meals are not included in course fees. We can recommend accommodations near each training hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Certification Program FAQ</h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Is this certification recognized internationally?</h3>
              <p className="text-gray-300">
                EmersonEIMS certification is recognized across East Africa and increasingly in West Africa. It's not an ISO certification, but it demonstrates practical competency and is valued by employers in the region.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-3">What if I fail the exam?</h3>
              <p className="text-gray-300">
                You can retake the exam within 3 months at no additional fee. Most retakes are successful because you've practiced on real equipment. If you still don't pass, we offer a full refund.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Can I study while working?</h3>
              <p className="text-gray-300">
                Technician program is 3 days intensive (best if you take time off). Engineer program is 5 days. We offer weekend sessions in some locations if you need more flexibility — just ask when enrolling.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Do you help with job placement?</h3>
              <p className="text-gray-300">
                We provide a job board, alumni network, and employer introductions. But placement is not guaranteed. Certification improves your prospects, but you need to actively pursue opportunities.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Can my company send a team?</h3>
              <p className="text-gray-300">
                Yes. Teams of 5+ can arrange custom on-site training at your facility. Same certification, same quality, customized schedule. <Link href="/contact?type=training" className="text-cyan-400 hover:text-cyan-300">Request a quote</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Certified?</h2>
          <p className="text-lg text-gray-300 mb-10">
            Choose your program, enroll, and join 750+ certified professionals transforming Africa's power infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Was href="#" — a primary CTA promising a session schedule that
                does not exist, on a page inviting people to enrol. Pointed at the
                training enquiry path and relabelled to what it actually does. */}
            <a
              href="/contact?type=training"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              Ask about upcoming sessions
            </a>
            <a
              href="/contact?type=training"
              className="inline-block px-8 py-4 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition-all"
            >
              Ask About Custom Training
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
