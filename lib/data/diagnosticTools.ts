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
    image: 'https://images.unsplash.com/photo-1581092160565-68d2cbb3b732?w=800&h=600&fit=crop',
  },
  {
    id: 'load-analysis',
    title: 'Load Analysis',
    description: 'Analyze generator load patterns and optimize performance',
    icon: '📊',
    features: ['Load profiling', 'Performance metrics', 'Optimization recommendations'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  },
  {
    id: 'sensor-calibration',
    title: 'Sensor Calibration',
    description: 'Calibrate and monitor sensor readings for accurate diagnostics',
    icon: '⚙️',
    features: ['Sensor calibration tools', 'Real-time monitoring', 'Accuracy validation'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  },
  {
    id: 'technician-toolkit',
    title: 'Technician Toolkit',
    description: 'Comprehensive tools for field technicians',
    icon: '🛠️',
    features: ['Field diagnostics', 'Maintenance schedules', 'Repair guides'],
    image: 'https://images.unsplash.com/photo-1581092160565-68d2cbb3b732?w=800&h=600&fit=crop',
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts Intelligence',
    description: 'Intelligent spare parts recommendations and inventory',
    icon: '🔧',
    features: ['Parts recommendations', 'Inventory tracking', 'Order management'],
    image: 'https://images.unsplash.com/photo-1581092160565-68d2cbb3b732?w=800&h=600&fit=crop',
  },
  {
    id: 'reputation-monitor',
    title: 'Reputation Monitor',
    description: 'Track and monitor system reputation and performance metrics',
    icon: '⭐',
    features: ['Performance tracking', 'Reputation scoring', 'Trend analysis'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  },
  {
    id: 'whatsapp-dispatch',
    title: 'WhatsApp Dispatch',
    description: 'Dispatch technicians via WhatsApp integration',
    icon: '📱',
    features: ['WhatsApp integration', 'Automated dispatch', 'Status tracking'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
  },
  {
    id: 'conversion-dashboard',
    title: 'Conversion Dashboard',
    description: 'Business conversion metrics and analytics',
    icon: '📈',
    features: ['Conversion tracking', 'Analytics dashboard', 'Performance insights'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  },
] as const;






