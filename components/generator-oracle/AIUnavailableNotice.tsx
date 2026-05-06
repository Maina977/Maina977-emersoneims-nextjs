'use client';

import { motion } from 'framer-motion';

interface AIUnavailableNoticeProps {
  feature: string;
  description?: string;
  className?: string;
}

/**
 * Shown in place of an AI panel's interactive UI when the server has no
 * ANTHROPIC_API_KEY configured. The point is to be unambiguous: this is a
 * "coming soon" signal, not a failed action. Other Generator Oracle tabs
 * (Fault Centre, Controllers, Wiring, Systems) remain fully usable.
 */
export default function AIUnavailableNotice({
  feature,
  description,
  className = '',
}: AIUnavailableNoticeProps) {
  return (
    <div className={`flex flex-col h-full items-center justify-center p-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-slate-900/60 border border-amber-500/40 rounded-2xl p-8 text-center"
        role="status"
      >
        <div className="text-5xl mb-4" aria-hidden="true">🛠️</div>
        <h3 className="text-xl font-bold text-amber-300 mb-2">
          {feature} — Coming Soon
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {description ??
            'This AI-powered feature is not yet enabled in production. We are still finishing the model integration.'}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          In the meantime, the rest of Generator Oracle is fully usable —
          browse <span className="text-amber-300">Fault Centre</span> for the
          fault-code database, <span className="text-amber-300">Controllers
          &amp; Simulators</span> for the 10 controller emulators,
          <span className="text-amber-300"> Systems</span> for parameter
          analysis, and <span className="text-amber-300">Wiring Diagrams</span>
          for schematics and manuals.
        </p>
      </motion.div>
    </div>
  );
}
