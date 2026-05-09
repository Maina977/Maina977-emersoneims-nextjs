'use client';

import { motion } from 'framer-motion';

export type ModuleId = 'analyzer' | 'efficiency' | 'repairs' | 'parts' | 'schematics' | 'financials';

interface Module {
  id: ModuleId;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const modules: Module[] = [
  {
    id: 'analyzer',
    name: 'Predictive AI Analyzer',
    shortName: 'AI Analyzer',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    description: 'Input symptoms, get AI-powered failure predictions',
    color: '#8B5CF6'
  },
  {
    id: 'efficiency',
    name: 'Efficiency Calculator',
    shortName: 'Efficiency',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'Real-time fuel efficiency and cost analysis',
    color: '#10B981'
  },
  {
    id: 'repairs',
    name: 'Repair Guide Library',
    shortName: 'Repairs',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    description: 'Step-by-step repair instructions',
    color: '#F59E0B'
  },
  {
    id: 'parts',
    name: 'Parts Catalog',
    shortName: 'Parts',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    description: 'Find parts with pricing and availability',
    color: '#06B6D4'
  },
  {
    id: 'schematics',
    name: 'Interactive Schematics',
    shortName: 'Schematics',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    description: 'Exploded diagrams with clickable parts',
    color: '#EC4899'
  },
  {
    id: 'financials',
    name: 'Financial Dashboard',
    shortName: 'Financials',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: 'Repair vs replace, ROI analysis',
    color: '#EF4444'
  }
];

interface ModuleSelectorProps {
  activeModule: ModuleId;
  onModuleChange: (module: ModuleId) => void;
}

export default function ModuleSelector({ activeModule, onModuleChange }: ModuleSelectorProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 p-1 min-w-max">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={`
              relative flex items-center gap-2 px-4 py-3 rounded-xl transition-all
              ${activeModule === module.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'}
            `}
          >
            {activeModule === module.id && (
              <motion.div
                layoutId="activeModuleIndicator"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${module.color}15 0%, ${module.color}05 100%)`,
                  border: `1px solid ${module.color}30`
                }}
              />
            )}
            <span
              className="relative"
              style={{ color: activeModule === module.id ? module.color : undefined }}
            >
              {module.icon}
            </span>
            <div className="relative text-left">
              <span className="block text-sm font-medium whitespace-nowrap">
                {module.shortName}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export { modules };
export type { Module };
