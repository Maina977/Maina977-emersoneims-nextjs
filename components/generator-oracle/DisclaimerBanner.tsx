'use client';

/**
 * Disclaimer Banner Component
 * Displays legal disclaimers to protect against copyright/trademark claims
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisclaimerBannerProps {
  type: 'main' | 'ecm' | 'controller' | 'faultCode' | 'procedure';
  compact?: boolean;
}

const DISCLAIMERS = {
  main: {
    title: 'Independent Diagnostic Tool',
    short: 'Generator Oracle is an independent reference tool. Brand names used for identification only.',
    full: `Generator Oracle is an INDEPENDENT diagnostic reference tool. All content is independently
           developed and may differ from official manufacturer documentation. Brand names, model numbers,
           and trademarks are property of their respective owners and used for IDENTIFICATION PURPOSES ONLY.

           This tool is NOT affiliated with, endorsed by, or licensed by any equipment manufacturer
           including Deep Sea Electronics, ComAp, Woodward, SmartGen, Caterpillar, Cummins, or others.

           Fault code NUMBERS are industry-standard identifiers. All DESCRIPTIONS are independently
           written interpretations - not copied from OEM manuals.`
  },
  ecm: {
    title: 'ECM Reference Notice',
    short: 'ECM names (Caterpillar, Cummins, Volvo Penta, etc.) used for identification only.',
    full: `ECM/ECU model names such as Caterpillar ADEM, Cummins CM, Volvo Penta EMS, Perkins, John Deere,
           and MTU are used for IDENTIFICATION PURPOSES ONLY.

           Generator Oracle is NOT affiliated with or endorsed by any ECM manufacturer. All procedures
           and guidance are INDEPENDENTLY DEVELOPED based on general industry knowledge and J1939/CAN
           protocol standards.

           Always verify critical procedures against official documentation for warranty-covered repairs.`
  },
  controller: {
    title: 'Controller Compatibility Notice',
    short: 'Controller names (DSE, ComAp, SmartGen, etc.) used for identification only.',
    full: `Controller references such as DeepSea DSE, ComAp InteliLite/InteliGen, Woodward EasyGen,
           SmartGen HGM, PowerWizard, Datakom, Lovato, Siemens, and ENKO are used for IDENTIFICATION
           PURPOSES ONLY.

           Generator Oracle is an INDEPENDENT diagnostic assistant. Fault codes are rephrased for
           clarity and may differ from official manufacturer documentation. We are NOT affiliated
           with or endorsed by any controller manufacturer.`
  },
  faultCode: {
    title: 'Fault Code Interpretation',
    short: 'Independent interpretation - rephrased for clarity, may differ from OEM text.',
    full: `Fault code NUMBERS are industry-standard identifiers that are safe to reference. All fault
           code DESCRIPTIONS are INDEPENDENTLY WRITTEN interpretations - NOT copied from manufacturer
           documentation.

           Example: Where an OEM manual might say "Fault 123: ECM offline due to CANbus error", our
           interpretation might be "Controller cannot communicate with ECM - check wiring and firmware."

           This rephrasing ensures original content while providing equivalent diagnostic value. Always
           cross-reference with official documentation for critical repairs.`
  },
  procedure: {
    title: 'Procedure Notice',
    short: 'Independent guidance based on industry practice. Verify for your specific equipment.',
    full: `All diagnostic and repair procedures are INDEPENDENTLY DEVELOPED based on general industry
           practices, standard protocols (J1939, CANbus, Modbus), and field technician experience.

           Procedures are NOT copied from any manufacturer's official documentation. Actual procedures
           may vary by equipment model, configuration, and condition.

           Always exercise appropriate caution and verify critical steps against official documentation
           for warranty-covered repairs.`
  }
};

export function DisclaimerBanner({ type, compact = false }: DisclaimerBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const disclaimer = DISCLAIMERS[type];

  if (compact) {
    return (
      <div className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-slate-400 flex items-center gap-2">
        <span className="text-amber-400">ℹ️</span>
        <span>{disclaimer.short}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div
        className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">⚠️</span>
            <span className="text-amber-400 font-medium text-sm">{disclaimer.title}</span>
          </div>
          <span className="text-amber-400 text-xs">{expanded ? '▼ Less' : '▶ More'}</span>
        </div>

        <p className="text-slate-400 text-xs mt-2">{disclaimer.short}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-slate-400 text-xs mt-3 leading-relaxed whitespace-pre-line">
                {disclaimer.full}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function InlineDisclaimer({ text }: { text: string }) {
  return (
    <span className="text-xs text-slate-500 italic ml-2">
      ({text})
    </span>
  );
}

export function FooterDisclaimer() {
  return (
    <div className="mt-8 p-4 bg-slate-900/80 border-t border-amber-500/20 text-center">
      {/* Global Legal Disclaimer */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-amber-400">🛡️</span>
        <span className="text-amber-400 font-semibold text-sm">INDEPENDENCE STATEMENT</span>
      </div>
      <p className="text-xs text-slate-400 max-w-5xl mx-auto leading-relaxed">
        Generator Oracle is an <strong className="text-amber-300">independent diagnostic and maintenance platform</strong>.
        Controller and ECM names are used solely for identification purposes. Generator Oracle is{' '}
        <strong className="text-white">NOT affiliated with, endorsed by, or sponsored by</strong>{' '}
        Cummins, Caterpillar, Volvo Penta, Perkins, Honda, Doosan, Deutz, John Deere, Lister Petter,
        SDMO, MTU, MAN, Iveco, Yanmar, Weichai, Deep Sea Electronics, ComAp, Woodward, SmartGen, or any other OEM.
      </p>
      <p className="text-xs text-slate-500 max-w-4xl mx-auto mt-2">
        All fault code descriptions, diagnostic procedures, and repair guidance are{' '}
        <strong className="text-slate-400">INDEPENDENTLY DEVELOPED</strong> using technician-friendly,
        field-report style language. No content is copied from OEM documentation.
      </p>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-600">
        <span>🔒 Data Ownership: Generator Oracle</span>
        <span>|</span>
        <span>📋 Audit Trail Enabled</span>
        <span>|</span>
        <span>🔐 Encrypted Storage</span>
      </div>
      <p className="text-xs text-cyan-400/70 mt-2 font-medium">
        © {new Date().getFullYear()} Generator Oracle - One Tool for All Brands™
      </p>
    </div>
  );
}

// Badge to indicate independent interpretation on fault code entries
export function InterpretationBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
        Independent Interpretation
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      <span className="text-blue-400 text-xs">ℹ️</span>
      <span className="text-xs text-blue-300">
        Independent interpretation - rephrased for clarity, not copied from OEM documentation
      </span>
    </div>
  );
}

// Compatibility notice for controller/ECM references
export function CompatibilityNotice({ brandNames }: { brandNames: string[] }) {
  return (
    <div className="text-xs text-slate-500 italic mt-2">
      {brandNames.join(', ')} {brandNames.length === 1 ? 'is' : 'are'} used for identification
      purposes only. Generator Oracle is not affiliated with {brandNames.length === 1 ? 'this' : 'these'}
      manufacturer{brandNames.length === 1 ? '' : 's'}.
    </div>
  );
}

// Acknowledgment that user has read disclaimer
export function DisclaimerAcknowledgment({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(() => {
    // Check localStorage on initial render
    if (typeof window !== 'undefined') {
      return localStorage.getItem('oracle_disclaimer_accepted') === 'true';
    }
    return false;
  });

  // Call onAccept if already accepted on mount
  useEffect(() => {
    if (accepted) {
      onAccept();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('oracle_disclaimer_accepted', 'true');
    } catch (e) {
      console.warn('Could not save to localStorage');
    }
    setAccepted(true);
    onAccept();
  };

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-3xl w-full max-h-[90vh] flex flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/10"
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <span className="text-3xl">🛡️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Security & Independence Framework</h2>
              <p className="text-amber-400 text-sm">Generator Oracle Legal Notice</p>
            </div>
          </div>

          {/* Main Disclaimer */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-4">
            <p className="text-amber-200 leading-relaxed">
              <strong>Generator Oracle</strong> is an <strong className="text-white">independent diagnostic and maintenance platform</strong>.
              Controller and ECM names are used solely for identification purposes. Generator Oracle is{' '}
              <strong className="text-white">NOT affiliated with, endorsed by, or sponsored by</strong>{' '}
              Cummins, Caterpillar, Volvo Penta, Perkins, Honda, Doosan, Deutz, John Deere, Lister Petter,
              SDMO, MTU, MAN, Iveco, Yanmar, Weichai, or any other OEM.
            </p>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <h3 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                <span>📝</span> Technician-Style Language
              </h3>
              <p className="text-slate-400 text-sm">
                All diagnostic guidance uses <strong className="text-slate-300">Oracle's own phrasing</strong> —
                field-report style, not OEM manual text.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                <span>🔒</span> Security Layer
              </h3>
              <p className="text-slate-400 text-sm">
                <strong className="text-slate-300">Data Ownership:</strong> Oracle's proprietary dataset.{' '}
                <strong className="text-slate-300">Audit Trail:</strong> Every session logged.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                <span>🎯</span> Market Positioning
              </h3>
              <p className="text-slate-400 text-sm">
                Oracle is <strong className="text-slate-300">NOT a clone of OEM tools</strong> — it's a universal diagnostic suite.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <h3 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                <span>⚖️</span> Legal Safety
              </h3>
              <p className="text-slate-400 text-sm">
                Fault code <strong className="text-slate-300">NUMBERS</strong> are standard. All <strong className="text-slate-300">DESCRIPTIONS</strong> are independent.
              </p>
            </div>
          </div>

          {/* Acknowledgment Checklist */}
          <div className="p-4 bg-slate-800 rounded-xl mb-4">
            <p className="font-medium text-white mb-3">By continuing, you acknowledge:</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Generator Oracle provides <strong className="text-slate-300">independent interpretations</strong>, not OEM documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Brand names are used for <strong className="text-slate-300">identification only</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>You will verify critical procedures against <strong className="text-slate-300">official documentation</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fixed Footer with Button - Always Visible */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-slate-700/50 bg-slate-900/80">
          <button
            onClick={handleAccept}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
          >
            🛡️ I Understand & Accept - Enter Generator Oracle
          </button>
          <p className="text-center text-xs text-slate-600 mt-3">
            © {new Date().getFullYear()} Generator Oracle - Proprietary Independent Diagnostic Platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default DisclaimerBanner;
