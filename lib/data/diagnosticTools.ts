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
    image: '/images/premium/control-panel-main.jpg',
  },
  {
    id: 'load-analysis',
    title: 'Load Analysis',
    description: 'Analyze generator load patterns and optimize performance',
    icon: '📊',
    features: ['Load profiling', 'Performance metrics', 'Optimization recommendations'],
    image: '/images/premium/generator-detail.jpg',
  },
  {
    id: 'sensor-calibration',
    title: 'Sensor Calibration',
    description: 'Calibrate and monitor sensor readings for accurate diagnostics',
    icon: '⚙️',
    features: ['Sensor calibration tools', 'Real-time monitoring', 'Accuracy validation'],
    image: '/images/premium/technicians-at-work.jpg',
  },
  {
    id: 'technician-toolkit',
    title: 'Technician Toolkit',
    description: 'Comprehensive tools for field technicians',
    icon: '🛠️',
    features: ['Field diagnostics', 'Maintenance schedules', 'Repair guides'],
    image: '/images/premium/control-panel-main.jpg',
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts Intelligence',
    description: 'Intelligent spare parts recommendations and inventory',
    icon: '🔧',
    features: ['Parts recommendations', 'Inventory tracking', 'Order management'],
    image: '/images/premium/control-panel-main.jpg',
  },
  {
    id: 'reputation-monitor',
    title: 'Reputation Monitor',
    description: 'Track and monitor system reputation and performance metrics',
    icon: '⭐',
    features: ['Performance tracking', 'Reputation scoring', 'Trend analysis'],
    image: '/images/premium/generator-detail.jpg',
  },
  {
    id: 'whatsapp-dispatch',
    title: 'WhatsApp Dispatch',
    description: 'Dispatch technicians via WhatsApp integration',
    icon: '📱',
    features: ['WhatsApp integration', 'Automated dispatch', 'Status tracking'],
    image: '/images/premium/workshop-maintenance.jpg',
  },
  {
    id: 'conversion-dashboard',
    title: 'Conversion Dashboard',
    description: 'Business conversion metrics and analytics',
    icon: '📈',
    features: ['Conversion tracking', 'Analytics dashboard', 'Performance insights'],
    image: '/images/premium/generator-detail.jpg',
  },
] as const;








