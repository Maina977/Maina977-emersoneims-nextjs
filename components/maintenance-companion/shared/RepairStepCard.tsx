'use client';

import { motion } from 'framer-motion';
import { RepairStep } from '@/lib/maintenance-companion/repairGuides';

interface RepairStepCardProps {
  step: RepairStep;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function RepairStepCard({ step, isActive, isCompleted, onComplete }: RepairStepCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${isActive
          ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
          : isCompleted
            ? 'bg-emerald-500/5 border-emerald-500/30'
            : 'bg-slate-800/50 border-slate-700/50'}
      `}
    >
      {/* Step Number & Status */}
      <div className="flex items-start gap-4">
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold
          ${isCompleted
            ? 'bg-emerald-500 text-white'
            : isActive
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-700 text-slate-400'}
        `}>
          {isCompleted ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            step.stepNumber
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Main Instruction */}
          <p className={`text-base leading-relaxed ${isActive ? 'text-white' : 'text-slate-300'}`}>
            {step.instruction}
          </p>

          {/* Torque Spec */}
          {step.torqueSpec && (
            <div className="mt-3 flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-sm">{step.torqueSpec}</span>
            </div>
          )}

          {/* Warning */}
          {step.warning && (
            <div className="mt-3 flex items-start gap-2 bg-red-500/10 text-red-400 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">{step.warning}</span>
            </div>
          )}

          {/* Tip */}
          {step.tip && (
            <div className="mt-3 flex items-start gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm">{step.tip}</span>
            </div>
          )}

          {/* Checkpoint */}
          {step.checkPoint && (
            <div className="mt-3 flex items-start gap-2 bg-amber-500/10 text-amber-400 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-sm font-medium">{step.checkPoint}</span>
            </div>
          )}

          {/* Complete Button */}
          {isActive && !isCompleted && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onComplete}
              className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark Step Complete
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
