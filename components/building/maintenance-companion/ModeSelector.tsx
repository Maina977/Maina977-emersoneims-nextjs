'use client';

import { motion } from 'framer-motion';

export type UserMode = 'technician' | 'owner';

interface ModeSelectorProps {
  mode: UserMode;
  onModeChange: (mode: UserMode) => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/50">
      <button
        onClick={() => onModeChange('owner')}
        className={`
          relative px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${mode === 'owner' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}
        `}
      >
        {mode === 'owner' && (
          <motion.div
            layoutId="modeIndicator"
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30"
          />
        )}
        <span className="relative flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Owner Mode
        </span>
      </button>

      <button
        onClick={() => onModeChange('technician')}
        className={`
          relative px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${mode === 'technician' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}
        `}
      >
        {mode === 'technician' && (
          <motion.div
            layoutId="modeIndicator"
            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30"
          />
        )}
        <span className="relative flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Technician Mode
        </span>
      </button>
    </div>
  );
}
