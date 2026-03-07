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
    <div className="mt-8 p-4 bg-slate-900/50 border-t border-slate-700 text-center">
      <p className="text-xs text-slate-500 max-w-4xl mx-auto">
        <strong>DISCLAIMER:</strong> Generator Oracle is an independent diagnostic reference tool.
        All brand names, model numbers, and trademarks (including Deep Sea Electronics, ComAp,
        Woodward, SmartGen, Caterpillar, Cummins, Volvo Penta, and others) are property of their
        respective owners and used for IDENTIFICATION PURPOSES ONLY.
      </p>
      <p className="text-xs text-slate-500 max-w-4xl mx-auto mt-2">
        Fault code NUMBERS are industry-standard identifiers. All DESCRIPTIONS and procedures are
        independently developed and may differ from official manufacturer documentation. This tool
        is NOT affiliated with, endorsed by, or licensed by any equipment manufacturer.
      </p>
      <p className="text-xs text-slate-600 mt-2">
        © {new Date().getFullYear()} Generator Oracle - Independent Diagnostic Reference
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
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('oracle_disclaimer_accepted');
    if (stored === 'true') {
      setAccepted(true);
      onAccept();
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('oracle_disclaimer_accepted', 'true');
    setAccepted(true);
    onAccept();
  };

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full bg-slate-900 rounded-2xl border border-slate-700 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚠️</span> Important Notice
        </h2>

        <div className="space-y-4 text-sm text-slate-300">
          <p>
            <strong className="text-amber-400">Generator Oracle</strong> is an INDEPENDENT diagnostic
            reference tool created for educational and troubleshooting purposes.
          </p>

          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="font-medium text-white mb-2">Please understand that:</p>
            <ul className="space-y-2 text-slate-400">
              <li>• All brand names (DSE, ComAp, Caterpillar, Cummins, etc.) are property of their respective owners</li>
              <li>• Brand names are used for <strong className="text-slate-300">IDENTIFICATION PURPOSES ONLY</strong></li>
              <li>• This tool is NOT affiliated with, endorsed by, or licensed by any equipment manufacturer</li>
              <li>• Fault code NUMBERS are industry-standard - all DESCRIPTIONS are independently written</li>
              <li>• Our descriptions are rephrased interpretations, not copied from OEM manuals</li>
              <li>• Procedures may differ from official manufacturer documentation</li>
              <li>• For warranty service, always consult authorized service centers</li>
            </ul>
          </div>

          <p className="text-slate-400">
            By continuing, you acknowledge that Generator Oracle provides independent interpretations
            and you will verify critical procedures against official documentation when needed.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all"
        >
          I Understand - Continue to Generator Oracle
        </button>
      </motion.div>
    </div>
  );
}

export default DisclaimerBanner;
