/**
 * GENERATOR ORACLE - SCREEN HEADER / BACK NAVIGATION
 * Back button plus a short "what this screen is and how to use it" card.
 *
 * 2026-10-18 audit: the descriptions used to promise AI diagnosis "with 100%
 * detail", "live data streaming from connected generators", "deep learning
 * failure prediction" and similar — none of which the tool does. Each screen
 * now says plainly whether it is a real lookup, guidance, or a simulator.
 * The Oracle opens on the Fault Center, so "back" returns there.
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToCommandProps {
  onBack: () => void;
  currentPanel: string;
  showPanelInfo?: boolean;
  /** Hide the back button on the home screen itself. */
  showBack?: boolean;
}

// One entry per Oracle screen. Keep each one true to what the screen does.
const PANEL_DESCRIPTIONS: Record<string, { title: string; purpose: string; howToUse: string; simulated?: boolean }> = {
  faults: {
    title: 'Fault Code Lookup',
    purpose: 'Controller alarms for 10 brands and J1939 engine codes, explained by our engineers',
    howToUse:
      'Type the code exactly as it shows on the display (for example SPN 100 FMI 1) or the alarm wording (for example "low oil pressure"). Each result gives the likely causes and what to check. Your controller or engine manual is the final word.',
  },
  ai: {
    title: 'Diagnostic Assistant',
    purpose: 'Rule-based guidance from our Repair Centre guides and alarm library. No generative AI.',
    howToUse:
      'Describe what the generator is doing, tick what you can see, or paste an alarm message. You get the matching diagnostic guides and controller alarms, and a one-tap route to an engineer.',
  },
  controllers: {
    title: 'Controllers & Simulators',
    purpose: 'Practise on simulated controller displays and read ECM programming guidance',
    howToUse:
      'Pick a controller brand to see a simulated display. Nothing on these screens connects to a real controller or ECM; programming and reprogramming must be done with the manufacturer\'s own service tool.',
    simulated: true,
  },
  systems: {
    title: 'System Diagnostics',
    purpose: 'How the engine, electrical and sensor systems work, with practice values',
    howToUse:
      'Explore each system and change the values to see how faults show up. The readings are simulated for training.',
    simulated: true,
  },
  wiring: {
    title: 'Wiring Diagrams',
    purpose: 'Terminal pinouts and connection diagrams for generator controllers',
    howToUse:
      'Select your controller model to view its wiring diagram and terminal assignments. Always confirm against the manufacturer\'s installation manual for your exact model and firmware before wiring.',
  },
  monitoring: {
    title: 'Monitoring & Data (Training)',
    purpose: 'See what live monitoring, CAN bus and data recording look like',
    howToUse:
      'These screens run on simulated data so you can learn to read them. They are not connected to your generator. To have your generator monitored remotely, talk to us.',
    simulated: true,
  },
  tools: {
    title: 'Tools & Reports',
    purpose: 'Write up a diagnosis, keep a history of your lookups, and find parts',
    howToUse:
      'Build a report after a diagnosis, review past lookups on this device, or search for a part and send the request to us on WhatsApp for price and availability.',
  },
};

export default function BackToCommand({ onBack, currentPanel, showPanelInfo = true, showBack = true }: BackToCommandProps) {
  const panelInfo = PANEL_DESCRIPTIONS[currentPanel];

  return (
    <div className="mb-6">
      {/* Back Button */}
      {showBack && (
        <motion.button
          onClick={onBack}
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-xl hover:border-cyan-400/60 transition-all group mb-4"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-cyan-400 font-medium">Back to Fault Lookup</span>
          </div>
        </motion.button>
      )}

      {/* Panel Info Card */}
      {showPanelInfo && panelInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border rounded-xl ${
            panelInfo.simulated ? 'border-amber-500/40' : 'border-slate-700/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1 flex flex-wrap items-center gap-2">
                {panelInfo.title}
                {panelInfo.simulated && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/50 bg-amber-500/10 text-amber-300">
                    Simulated · training
                  </span>
                )}
              </h2>
              <p className="text-sm text-cyan-400 mb-3">{panelInfo.purpose}</p>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 text-xs font-medium uppercase tracking-wider mt-0.5">How to use:</span>
                <p className="text-sm text-slate-300">{panelInfo.howToUse}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Compact version for inline use
export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <motion.button
      onClick={onBack}
      className="flex items-center gap-2 px-3 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Fault Lookup</span>
    </motion.button>
  );
}
