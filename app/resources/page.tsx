import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Learning Resources & Guides | Generator, Solar & Power Education | EmersonEIMS',
  description: 'Complete resource library for generators, solar systems, and power solutions. Guides, calculators, FAQs, case studies, and educational content. Learn everything about power systems in Kenya.',
};

const RESOURCE_CATEGORIES = [
  {
    title: 'Emergency & Troubleshooting',
    icon: '🚨',
    color: 'red',
    resources: [
      { href: '/guides/emergency-response', title: 'Emergency Response Guide', desc: 'What to do when your generator fails', type: 'Guide' },
      { href: '/generator-oracle', title: 'Generator Oracle', desc: 'AI-powered fault code diagnosis', type: 'Tool' },
      { href: '/troubleshooting', title: 'Troubleshooting Wizard', desc: 'Interactive problem solver', type: 'Tool' },
      { href: '/fault-code-lookup', title: 'Fault Code Lookup', desc: 'Search 250,000+ error codes', type: 'Database' },
    ],
  },
  {
    title: 'Sizing & Calculators',
    icon: '📐',
    color: 'cyan',
    resources: [
      { href: '/calculators', title: 'All Calculators', desc: 'ROI, sizing, and load calculators', type: 'Tool' },
      { href: '/solutions/solar-sizing', title: 'Solar Sizing Guide', desc: 'Calculate your solar needs', type: 'Calculator' },
      { href: '/generators#sizing', title: 'Generator Sizing', desc: 'Find the right kVA for your load', type: 'Calculator' },
    ],
  },
  {
    title: 'Maintenance Guides',
    icon: '🛠️',
    color: 'amber',
    resources: [
      { href: '/maintenance-hub', title: 'Universal Maintenance Hub', desc: 'All equipment maintenance center', type: 'Hub' },
      { href: '/maintenance-hub/generators', title: 'Generator Maintenance', desc: 'Service schedules & procedures', type: 'Guide' },
      { href: '/maintenance-hub/solar', title: 'Solar Maintenance', desc: 'Panel cleaning & battery care', type: 'Guide' },
      { href: '/maintenance-hub/hvac', title: 'HVAC Maintenance', desc: 'AC servicing & repair', type: 'Guide' },
      { href: '/knowledge-base', title: 'Knowledge Base', desc: 'In-depth technical articles', type: 'Library' },
    ],
  },
  {
    title: 'Learn & Understand',
    icon: '📚',
    color: 'purple',
    resources: [
      { href: '/faq', title: 'FAQ', desc: '30+ common questions answered', type: 'FAQ' },
      { href: '/blog', title: 'Blog & Articles', desc: 'Tips, guides, and industry news', type: 'Blog' },
      { href: '/technical-bible', title: 'Technical Bible', desc: 'Deep technical documentation', type: 'Docs' },
    ],
  },
  {
    title: 'Case Studies & Proof',
    icon: '📊',
    color: 'green',
    resources: [
      { href: '/case-studies', title: 'Case Studies', desc: 'Real projects with ROI data', type: 'Studies' },
      { href: '/gallery', title: 'Project Gallery', desc: 'Photos of completed projects', type: 'Gallery' },
    ],
  },
  {
    title: 'Diagnostic Tools',
    icon: '🔬',
    color: 'blue',
    resources: [
      { href: '/diagnostic-cockpit', title: 'Diagnostic Cockpit', desc: 'Aerospace-style control interface', type: 'Tool' },
      { href: '/diagnostic-journey', title: 'Diagnostic Journey', desc: 'Step-by-step diagnosis flow', type: 'Tool' },
      { href: '/diagnostic-qa', title: 'Expert Q&A', desc: 'AI-powered technical answers', type: 'AI' },
      { href: '/diagnostic-suite', title: 'Full Diagnostic Suite', desc: 'Complete diagnostic platform', type: 'Suite' },
    ],
  },
];

const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
  red: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400' },
  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400' },
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6">
            📚 Learning Center
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Resources &
            <span className="block text-amber-400">Learning Hub</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to understand, maintain, and troubleshoot power systems.
            Guides, calculators, case studies, and expert tools - all in one place.
          </p>
        </div>

        {/* Quick Access */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <Link
            href="/guides/emergency-response"
            className="p-6 bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-500/50 rounded-2xl hover:scale-105 transition-transform group"
          >
            <span className="text-4xl mb-4 block">🚨</span>
            <h3 className="text-lg font-bold text-red-400 group-hover:text-red-300">Emergency Guide</h3>
            <p className="text-sm text-slate-400">Generator failed? Start here</p>
          </Link>
          <Link
            href="/generator-oracle"
            className="p-6 bg-gradient-to-br from-amber-900/50 to-orange-800/30 border border-amber-500/50 rounded-2xl hover:scale-105 transition-transform group"
          >
            <span className="text-4xl mb-4 block">🔮</span>
            <h3 className="text-lg font-bold text-amber-400 group-hover:text-amber-300">Generator Oracle</h3>
            <p className="text-sm text-slate-400">Decode any fault code</p>
          </Link>
          <Link
            href="/calculators"
            className="p-6 bg-gradient-to-br from-cyan-900/50 to-blue-800/30 border border-cyan-500/50 rounded-2xl hover:scale-105 transition-transform group"
          >
            <span className="text-4xl mb-4 block">📐</span>
            <h3 className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300">Calculators</h3>
            <p className="text-sm text-slate-400">Size your system</p>
          </Link>
          <Link
            href="/faq"
            className="p-6 bg-gradient-to-br from-purple-900/50 to-violet-800/30 border border-purple-500/50 rounded-2xl hover:scale-105 transition-transform group"
          >
            <span className="text-4xl mb-4 block">❓</span>
            <h3 className="text-lg font-bold text-purple-400 group-hover:text-purple-300">FAQ</h3>
            <p className="text-sm text-slate-400">Common questions</p>
          </Link>
        </div>

        {/* Resource Categories */}
        <div className="space-y-12">
          {RESOURCE_CATEGORIES.map((category) => {
            const colors = colorClasses[category.color];
            return (
              <section key={category.title}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.resources.map((resource) => (
                    <Link
                      key={resource.href}
                      href={resource.href}
                      className={`p-5 ${colors.bg} border ${colors.border} rounded-xl hover:scale-102 transition-transform group`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {resource.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded-full`}>
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{resource.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <section className="mt-20 text-center p-12 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You Need?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our technical team is available 24/7 to answer your questions and provide expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              📞 Call Expert: 0768 860 665
            </a>
            <a
              href="https://wa.me/254768860665"
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-500 transition-colors"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
