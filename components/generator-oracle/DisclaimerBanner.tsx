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

      </div>
      <p className="text-xs text-cyan-400/70 mt-2 font-medium">
        © {new Date().getFullYear()} Generator Oracle — fault-code reference by EmersonEIMS
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
     
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('oracle_disclaimer_accepted', 'true');
    } catch {
      console.warn('Could not save to localStorage');
    }
    setAccepted(true);
    onAccept();
  };

  if (accepted) return null;

  /*
   * 2026-10-18 audit: this was a full-screen, scroll-to-accept legal wall with
   * claims the tool cannot back ("Every session logged", "proprietary
   * dataset", market-positioning copy). It is now a short notice saying the
   * three things a technician actually needs to know, sized for a phone.
   */
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="oracle-notice-title"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-lg w-full max-h-[85vh] overflow-y-auto bg-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl p-5"
      >
        <h2 id="oracle-notice-title" className="text-lg font-bold text-white mb-3">Before you start</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">1.</span>
            <span>
              The fault descriptions are written by EmersonEIMS engineers in our own words. They are guidance,
              not manufacturer documentation. Check critical procedures against your engine or controller manual.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">2.</span>
            <span>
              Brand names are used to identify equipment only. Generator Oracle is not affiliated with or endorsed
              by any manufacturer.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">3.</span>
            <span>
              Generators carry lethal voltages and start automatically. Isolate and lock off before working on one,
              or call us on <a href="tel:+254768860665" className="text-amber-300 underline">0768 860 665</a>.
            </span>
          </li>
        </ul>
        <button
          onClick={handleAccept}
          className="mt-5 w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
        >
          I understand, continue
        </button>
      </motion.div>
    </div>
  );
}

export default DisclaimerBanner;
