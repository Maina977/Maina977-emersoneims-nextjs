/**
 * GENERATOR ORACLE - BACK TO COMMAND CENTER
 * Universal navigation component for returning to main dashboard
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
}

// Panel descriptions for user context
const PANEL_DESCRIPTIONS: Record<string, { title: string; purpose: string; howToUse: string }> = {
  engine: {
    title: 'Engine Parameters',
    purpose: 'Monitor and analyze engine performance metrics in real-time',
    howToUse: 'Review RPM, oil pressure, coolant temp, and other engine vitals. Click any gauge for detailed analysis.',
  },
  electrical: {
    title: 'Electrical Systems',
    purpose: 'Monitor voltage, current, power factor, and frequency across all phases',
    howToUse: 'Check L1-L2-L3 voltages and currents. Identify imbalances that could indicate wiring or load issues.',
  },
  faults: {
    title: 'Fault Code Database',
    purpose: 'Search 400,000+ fault codes across 10 controller brands',
    howToUse: 'Enter the fault code from your controller display. Get instant diagnosis, causes, and step-by-step fixes.',
  },
  faultanalysis: {
    title: 'Detailed Fault Analysis',
    purpose: 'In-depth analysis with multi-paragraph explanations and repair procedures',
    howToUse: 'Select a fault code to see comprehensive diagnostics including root causes, testing procedures, and solutions.',
  },
  simulator: {
    title: 'Controller Simulator',
    purpose: 'Interactive display emulation for 10 controller brands',
    howToUse: 'Select a controller brand to see a live simulation. Practice reading displays and understanding fault indicators.',
  },
  wiring: {
    title: 'Wiring Diagrams',
    purpose: 'Terminal pinouts and connection diagrams for generator controllers',
    howToUse: 'Select your controller model to view wiring diagrams, terminal assignments, and wire color codes.',
  },
  allwiring: {
    title: 'Complete Wiring Reference',
    purpose: 'All 10 controller brands - complete terminal pinouts and diagrams',
    howToUse: 'Browse all controller wiring diagrams in one place. Use for cross-referencing and installation guidance.',
  },
  techinput: {
    title: 'Technician Input Diagnostics',
    purpose: 'Enter your meter readings for instant AI-powered analysis',
    howToUse: 'Input your multimeter readings (voltage, current, resistance). Get instant problem identification and solutions.',
  },
  aianalysis: {
    title: 'AI Diagnostic Engine',
    purpose: 'Advanced neural network analysis for complex fault diagnosis',
    howToUse: 'Describe symptoms or enter multiple fault codes. AI provides 100% detailed diagnosis with repair confidence scores.',
  },
  advanced: {
    title: 'Advanced AI Diagnostics',
    purpose: 'Deep learning algorithms for predictive failure analysis',
    howToUse: 'Upload diagnostic data or symptoms. AI correlates patterns to predict failures before they occur.',
  },
  assistant: {
    title: 'Technician Assistant',
    purpose: 'AI-powered chat assistant for troubleshooting guidance',
    howToUse: 'Ask questions in plain language. Get step-by-step troubleshooting guidance and expert recommendations.',
  },
  realtime: {
    title: 'Real-Time Monitoring',
    purpose: 'Live data streaming from connected generators',
    howToUse: 'Connect to a generator via Modbus/CANbus. Monitor all parameters in real-time with alerts.',
  },
  obd: {
    title: 'OBD-II / CAN Protocol',
    purpose: 'Direct communication with engine ECMs using J1939 and J1708 protocols',
    howToUse: 'Connect diagnostic adapter. Read ECM data, clear faults, and view live engine parameters.',
  },
  remote: {
    title: 'Remote Connectivity',
    purpose: 'Configure remote monitoring and cloud connectivity',
    howToUse: 'Set up GSM/WiFi connections for remote generator monitoring and alerts.',
  },
  predictive: {
    title: 'Predictive Maintenance',
    purpose: 'AI-powered failure prediction and maintenance scheduling',
    howToUse: 'View predicted component failures based on operating hours, conditions, and historical patterns.',
  },
  recording: {
    title: 'Data Recording & Graphing',
    purpose: 'Record and visualize generator performance over time',
    howToUse: 'Start a recording session to capture all parameters. Analyze trends and export data.',
  },
  manuals: {
    title: 'Controller Repair Manuals',
    purpose: 'Service manuals and repair procedures for all controller brands',
    howToUse: 'Select your controller brand and model. Access repair procedures, calibration guides, and specifications.',
  },
  sensors: {
    title: 'Sensor Diagnostics',
    purpose: 'Test and calibrate all generator sensors',
    howToUse: 'Select sensor type. View expected values, testing procedures, and replacement part numbers.',
  },
  ecm: {
    title: 'ECM Diagnostics',
    purpose: 'Engine Control Module fault diagnosis for Cummins, CAT, Volvo, and more',
    howToUse: 'Select ECM brand. Search fault codes or browse by system (fuel, intake, exhaust, etc.).',
  },
  unified: {
    title: 'Unified Diagnostics',
    purpose: 'Integrated ECM + Controller + AI diagnostics in one interface',
    howToUse: 'Enter any fault code. System automatically identifies source (ECM or controller) and provides unified diagnosis.',
  },
  ecmprog: {
    title: 'ECM Programming',
    purpose: 'ECM firmware updates and parameter calibration',
    howToUse: 'Connect to ECM. View current firmware, download updates, and modify operational parameters.',
  },
  canbus: {
    title: 'CANbus Monitor',
    purpose: 'J1939 protocol analysis and live message decoding',
    howToUse: 'Connect CANbus adapter. View live messages, filter by PGN, and decode parameter values.',
  },
  fleet: {
    title: 'Fleet Dashboard',
    purpose: 'Multi-generator monitoring and fleet analytics',
    howToUse: 'View all connected generators. Compare performance, track maintenance, and identify fleet-wide issues.',
  },
  completediag: {
    title: 'Complete Diagnostic Solutions',
    purpose: 'Full repair procedures from symptom to solution',
    howToUse: 'Select a symptom or fault category. Get complete diagnostic flow with testing, causes, and repairs.',
  },
  ecmguide: {
    title: 'ECM Reprogramming Guide',
    purpose: 'Step-by-step ECM/ECU programming procedures',
    howToUse: 'Select ECM type. Follow guided procedures for safe reprogramming with required tools and precautions.',
  },
  reports: {
    title: 'Professional Reports',
    purpose: 'Generate PDF diagnostic reports for customers',
    howToUse: 'Complete a diagnosis first. Then build a professional report with customer info, photos, and recommendations.',
  },
  camera: {
    title: 'Photo/Video Documentation',
    purpose: 'Capture visual evidence for diagnostic reports',
    howToUse: 'Take photos or videos of the fault condition, nameplate, or damaged components. Attach to reports.',
  },
  parts: {
    title: 'Parts Ordering',
    purpose: 'Find suppliers and order replacement parts',
    howToUse: 'Search for parts by name or number. View supplier locations, prices, and send RFQ via WhatsApp.',
  },
  location: {
    title: 'GPS Location Capture',
    purpose: 'Record generator site location for service records',
    howToUse: 'Capture GPS coordinates. Save location for future service visits. Get directions to site.',
  },
  notifications: {
    title: 'Alert Settings',
    purpose: 'Configure push notifications for faults and maintenance reminders',
    howToUse: 'Enable notifications. Choose alert types (faults, sync, maintenance). Set quiet hours.',
  },
  history: {
    title: 'Diagnosis History',
    purpose: 'View past diagnoses and service records',
    howToUse: 'Browse previous fault diagnoses. Track patterns and recurring issues across service visits.',
  },
  settings: {
    title: 'Settings',
    purpose: 'Configure Generator Oracle preferences',
    howToUse: 'Set language, offline mode, display preferences, and subscription management.',
  },
};

export default function BackToCommand({ onBack, currentPanel, showPanelInfo = true }: BackToCommandProps) {
  const panelInfo = PANEL_DESCRIPTIONS[currentPanel];

  return (
    <div className="mb-6">
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-xl hover:border-cyan-400/60 transition-all group mb-4"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
        </motion.div>
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-cyan-400 font-medium">Back to Command Center</span>
        </div>
      </motion.button>

      {/* Panel Info Card */}
      {showPanelInfo && panelInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/50 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">{panelInfo.title}</h2>
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
      <span className="text-sm font-medium">Command Center</span>
    </motion.button>
  );
}
