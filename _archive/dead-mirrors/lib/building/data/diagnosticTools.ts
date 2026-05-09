/**
 * Centralized Diagnostic Tools Data
 * No duplications - single source of truth
 */

export interface DiagnosticTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
}

export const DIAGNOSTIC_TOOLS: DiagnosticTool[] = [
  {
    id: 'fault-lookup',
    title: 'Fault Code Lookup',
    description: 'Search and diagnose generator fault codes instantly',
    icon: '🔍',
    features: ['Real-time fault code database', 'Diagnostic recommendations', 'Solution suggestions'],
    image: '/images/solar%20changeover%20control.png',
  },
  {
    id: 'load-analysis',
    title: 'Load Analysis',
    description: 'Analyze generator load patterns and optimize performance',
    icon: '📊',
    features: ['Load profiling', 'Performance metrics', 'Optimization recommendations'],
    image: '/images/GEN%202-1920x1080.png',
  },
  {
    id: 'sensor-calibration',
    title: 'Sensor Calibration',
    description: 'Calibrate and monitor sensor readings for accurate diagnostics',
    icon: '⚙️',
    features: ['Sensor calibration tools', 'Real-time monitoring', 'Accuracy validation'],
    image: '/images/IMG_20221222_153914_840.jpg',
  },
  {
    id: 'technician-toolkit',
    title: 'Technician Toolkit',
    description: 'Comprehensive tools for field technicians',
    icon: '🛠️',
    features: ['Field diagnostics', 'Maintenance schedules', 'Repair guides'],
    image: '/images/solar%20changeover%20control.png',
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts Intelligence',
    description: 'Intelligent spare parts recommendations and inventory',
    icon: '🔧',
    features: ['Parts recommendations', 'Inventory tracking', 'Order management'],
    image: '/images/ENGINE%20PARTS.png',
  },
  {
    id: 'reputation-monitor',
    title: 'Reputation Monitor',
    description: 'Track and monitor system reputation and performance metrics',
    icon: '⭐',
    features: ['Performance tracking', 'Reputation scoring', 'Trend analysis'],
    image: '/images/GEN%202-1920x1080.png',
  },
  {
    id: 'whatsapp-dispatch',
    title: 'WhatsApp Dispatch',
    description: 'Dispatch technicians via WhatsApp integration',
    icon: '📱',
    features: ['WhatsApp integration', 'Automated dispatch', 'Status tracking'],
    image: '/images/PERKINS-ENGINE-PARTS.jpg',
  },
  {
    id: 'conversion-dashboard',
    title: 'Conversion Dashboard',
    description: 'Business conversion metrics and analytics',
    icon: '📈',
    features: ['Conversion tracking', 'Analytics dashboard', 'Performance insights'],
    image: '/images/GEN%202-1920x1080.png',
  },
] as const;








