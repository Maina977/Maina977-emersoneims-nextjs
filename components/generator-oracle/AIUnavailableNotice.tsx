'use client';

import { motion } from 'framer-motion';

interface AIUnavailableNoticeProps {
  feature: string;
  description?: string;
  reason?: string;
  className?: string;
}

/**
 * Shown in place of an AI panel's interactive UI when the local AI stack
 * (Ollama + Qwen2.5 / Qwen2.5-VL + PaddleOCR + retrieval) is not configured
 * or not reachable from this deployment. The point is to be unambiguous:
 * this is an HONEST UNAVAILABLE state, not a "coming soon" tease and not a
 * silent fallback. Every other Generator Oracle tab (Fault Centre,
 * Controllers & Simulators, Wiring Diagrams, Systems) remains fully usable.
 *
 * Wording deliberately avoids "coming soon" — the feature is implemented,
 * the inference infrastructure simply isn't pointed at by this deployment.
 */
export default function AIUnavailableNotice({
  feature,
  description,
  reason,
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
        <div className="text-5xl mb-4" aria-hidden="true">🔌</div>
        <h3 className="text-xl font-bold text-amber-300 mb-2">
          {feature} — AI Unavailable
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          {description ??
            'The local AI stack required for this feature is not configured or not reachable from this deployment. No paid AI is used in the diagnostic path; once the local stack endpoint is provided this surface activates automatically.'}
        </p>
        {reason && (
          <p className="text-xs font-mono text-slate-400 bg-slate-950/40 border border-slate-700/40 rounded px-3 py-2 mb-3 break-words">
            {reason}
          </p>
        )}
        <p className="text-xs text-slate-400 leading-relaxed">
          In the meantime, the rest of Generator Oracle is fully usable —
          browse <span className="text-amber-300">Fault Centre</span> for the
          fault-code database, <span className="text-amber-300">Controllers
          &amp; Simulators</span> for the controller emulators,
          <span className="text-amber-300"> Systems</span> for parameter
          analysis, and <span className="text-amber-300">Wiring Diagrams</span>
          for schematics and manuals.
        </p>
      </motion.div>
    </div>
  );
}
