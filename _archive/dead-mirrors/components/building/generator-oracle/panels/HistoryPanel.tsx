'use client';

/**
 * ULTRA-COMPREHENSIVE DIAGNOSIS HISTORY PANEL
 * Complete tracking with analytics, trends, insights, and professional reporting
 * Features: Search, Filter, Export, Analytics, Trends, Cost Analysis, Technician Performance
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ========================= TYPES & INTERFACES =========================

interface PartUsed {
  name: string;
  partNumber?: string;
  quantity: number;
  unitCost: number;
  supplier?: string;
}

interface DiagnosisEntry {
  id: string;
  timestamp: string;
  faultCode: string;
  faultTitle: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  controller: string;
  model: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'escalated' | 'deferred';
  resolution?: string;
  technician?: string;
  technicianId?: string;
  duration?: number; // minutes
  partsUsed?: PartUsed[];
  laborCost?: number;
  partsCost?: number;
  totalCost?: number;
  notes?: string;
  rootCause?: string;
  preventiveMeasures?: string;
  generatorId?: string;
  generatorName?: string;
  customerName?: string;
  location?: string;
  county?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  slaStatus?: 'within' | 'warning' | 'breached';
  attachments?: number;
  followUpDate?: string;
  relatedFaults?: string[];
  tags?: string[];
}

interface AnalyticsSummary {
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
  escalated: number;
  deferred: number;
  totalCost: number;
  avgDuration: number;
  avgCost: number;
  mttr: number; // Mean Time To Repair
  firstTimeFixRate: number;
  recurrenceRate: number;
  slaCompliance: number;
  bySeverity: Record<string, number>;
  byController: Record<string, number>;
  byTechnician: Record<string, { count: number; resolved: number; avgTime: number }>;
  byMonth: Record<string, number>;
  topFaults: Array<{ code: string; title: string; count: number }>;
  topParts: Array<{ name: string; count: number; totalCost: number }>;
}

// ========================= COMPREHENSIVE SAMPLE DATA =========================

const TECHNICIANS = [
  { id: 'T001', name: 'John Kamau', specialization: 'Electrical', rating: 4.8 },
  { id: 'T002', name: 'Peter Ochieng', specialization: 'Mechanical', rating: 4.6 },
  { id: 'T003', name: 'David Mwangi', specialization: 'Electronics', rating: 4.9 },
  { id: 'T004', name: 'Samuel Kiprop', specialization: 'Fuel Systems', rating: 4.5 },
  { id: 'T005', name: 'James Wanjiku', specialization: 'Cooling Systems', rating: 4.7 },
  { id: 'T006', name: 'Michael Otieno', specialization: 'Control Systems', rating: 4.8 },
  { id: 'T007', name: 'Joseph Kimani', specialization: 'General', rating: 4.4 },
  { id: 'T008', name: 'Daniel Njoroge', specialization: 'Alternators', rating: 4.6 },
];

const LOCATIONS = [
  { name: 'Nairobi CBD', county: 'Nairobi' },
  { name: 'Westlands', county: 'Nairobi' },
  { name: 'Industrial Area', county: 'Nairobi' },
  { name: 'Mombasa Road', county: 'Nairobi' },
  { name: 'Karen', county: 'Nairobi' },
  { name: 'Kilimani', county: 'Nairobi' },
  { name: 'Mombasa', county: 'Mombasa' },
  { name: 'Kisumu', county: 'Kisumu' },
  { name: 'Nakuru', county: 'Nakuru' },
  { name: 'Eldoret', county: 'Uasin Gishu' },
  { name: 'Thika', county: 'Kiambu' },
  { name: 'Nyeri', county: 'Nyeri' },
  { name: 'Machakos', county: 'Machakos' },
  { name: 'Malindi', county: 'Kilifi' },
  { name: 'Naivasha', county: 'Nakuru' },
];

const CUSTOMERS = [
  'Kenya Power & Lighting',
  'Safaricom PLC',
  'Equity Bank',
  'Nation Media Group',
  'Kenya Airways',
  'KCB Bank',
  'Co-operative Bank',
  'NCBA Bank',
  'Nairobi Hospital',
  'Karen Hospital',
  'MP Shah Hospital',
  'Aga Khan Hospital',
  'Two Rivers Mall',
  'Garden City Mall',
  'Sarit Centre',
  'Westgate Mall',
  'Village Market',
  'Hilton Hotel',
  'Serena Hotel',
  'Radisson Blu',
  'Crowne Plaza',
  'Kenyatta University',
  'University of Nairobi',
  'Strathmore University',
  'JKUAT',
  'Kenya Breweries',
  'East African Breweries',
  'Del Monte Kenya',
  'Bidco Africa',
  'Brookside Dairy',
];

// Generate comprehensive sample history data (100+ entries)
const generateSampleHistory = (): DiagnosisEntry[] => {
  const entries: DiagnosisEntry[] = [];

  const faults = [
    // Engine Faults
    { code: '1100', title: 'Low Oil Pressure', severity: 'shutdown' as const, controller: 'DSE', model: 'DSE 7320', rootCause: 'Oil level low or oil pump failure' },
    { code: '1101', title: 'Oil Pressure Sensor Fault', severity: 'warning' as const, controller: 'DSE', model: 'DSE 7320', rootCause: 'Sensor wiring or sensor failure' },
    { code: '1102', title: 'High Oil Temperature', severity: 'critical' as const, controller: 'DSE', model: 'DSE 8610', rootCause: 'Oil cooler blockage or thermostat failure' },
    { code: '1200', title: 'Engine Overspeed', severity: 'shutdown' as const, controller: 'DSE', model: 'DSE 7320', rootCause: 'Governor malfunction or actuator failure' },
    { code: '1201', title: 'Engine Underspeed', severity: 'warning' as const, controller: 'DSE', model: 'DSE 8610', rootCause: 'Fuel restriction or governor issue' },
    { code: '1300', title: 'Fail to Crank', severity: 'critical' as const, controller: 'DSE', model: 'DSE 7320', rootCause: 'Starter motor or battery failure' },
    { code: '1301', title: 'Fail to Start', severity: 'critical' as const, controller: 'DSE', model: 'DSE 7320', rootCause: 'Fuel system or compression issue' },

    // Cooling System Faults
    { code: '2200', title: 'Low Coolant Level', severity: 'warning' as const, controller: 'ComAp', model: 'InteliLite', rootCause: 'Coolant leak or sensor failure' },
    { code: '2201', title: 'High Coolant Temperature', severity: 'critical' as const, controller: 'ComAp', model: 'InteliLite', rootCause: 'Radiator blockage or thermostat failure' },
    { code: '2202', title: 'Coolant Pressure Low', severity: 'warning' as const, controller: 'ComAp', model: 'InteliGen', rootCause: 'Pressure cap or head gasket leak' },
    { code: '2210', title: 'Radiator Fan Failure', severity: 'warning' as const, controller: 'ComAp', model: 'InteliLite', rootCause: 'Fan motor or relay failure' },
    { code: '2220', title: 'Water Pump Failure', severity: 'critical' as const, controller: 'ComAp', model: 'InteliGen', rootCause: 'Bearing wear or impeller damage' },

    // Electrical Faults
    { code: '3300', title: 'Battery Low Voltage', severity: 'warning' as const, controller: 'Woodward', model: 'EasyGen 3500', rootCause: 'Battery aging or alternator failure' },
    { code: '3301', title: 'Battery Charger Fault', severity: 'warning' as const, controller: 'Woodward', model: 'EasyGen 3500', rootCause: 'Charger module failure' },
    { code: '3302', title: 'Battery Disconnected', severity: 'critical' as const, controller: 'Woodward', model: 'EasyGen 3500', rootCause: 'Loose terminals or cable break' },
    { code: '3400', title: 'Generator Over Voltage', severity: 'critical' as const, controller: 'Woodward', model: 'EasyGen 3500', rootCause: 'AVR failure or sensing circuit issue' },
    { code: '3401', title: 'Generator Under Voltage', severity: 'warning' as const, controller: 'Woodward', model: 'EasyGen 3500', rootCause: 'AVR adjustment or excitation failure' },
    { code: '3402', title: 'AVR Failure', severity: 'critical' as const, controller: 'Woodward', model: 'EasyGen 3000', rootCause: 'Internal AVR component failure' },

    // Fuel System Faults
    { code: '4100', title: 'Low Fuel Level', severity: 'warning' as const, controller: 'SmartGen', model: 'HGM6100', rootCause: 'Fuel consumption or leak' },
    { code: '4101', title: 'Fuel Level Sensor Fault', severity: 'info' as const, controller: 'SmartGen', model: 'HGM6100', rootCause: 'Sensor failure or wiring issue' },
    { code: '4102', title: 'Fuel Pressure Low', severity: 'critical' as const, controller: 'SmartGen', model: 'HGM6120', rootCause: 'Lift pump failure or filter clog' },
    { code: '4110', title: 'Fuel Filter Blocked', severity: 'warning' as const, controller: 'SmartGen', model: 'HGM6100', rootCause: 'Contaminated fuel or aged filter' },
    { code: '4120', title: 'Water in Fuel', severity: 'critical' as const, controller: 'SmartGen', model: 'HGM6120', rootCause: 'Condensation or contaminated supply' },

    // Governor/Speed Faults
    { code: '5050', title: 'Governor Actuator Fault', severity: 'critical' as const, controller: 'CAT PowerWizard', model: 'PowerWizard 2.0', rootCause: 'Actuator mechanical failure' },
    { code: '5051', title: 'Speed Sensor Failure', severity: 'critical' as const, controller: 'CAT PowerWizard', model: 'PowerWizard 2.0', rootCause: 'Magnetic pickup failure' },
    { code: '5052', title: 'Speed Control Loss', severity: 'shutdown' as const, controller: 'CAT PowerWizard', model: 'PowerWizard 2.0', rootCause: 'Control loop failure' },

    // Alternator Faults
    { code: '6001', title: 'Phase Imbalance', severity: 'warning' as const, controller: 'Datakom', model: 'DKG-509', rootCause: 'Unbalanced load or winding issue' },
    { code: '6002', title: 'Alternator Overload', severity: 'critical' as const, controller: 'Datakom', model: 'DKG-509', rootCause: 'Excessive load demand' },
    { code: '6003', title: 'Alternator Over Temperature', severity: 'critical' as const, controller: 'Datakom', model: 'DKG-509', rootCause: 'Cooling failure or overload' },
    { code: '6010', title: 'Frequency Out of Range', severity: 'warning' as const, controller: 'Datakom', model: 'DKG-509', rootCause: 'Speed control or load issue' },
    { code: '6020', title: 'Power Factor Low', severity: 'info' as const, controller: 'Datakom', model: 'DKG-509', rootCause: 'Inductive load characteristics' },

    // Control System Faults
    { code: '7100', title: 'Controller Communication Fault', severity: 'warning' as const, controller: 'Lovato', model: 'RGK800', rootCause: 'RS485 wiring or protocol issue' },
    { code: '7101', title: 'Remote Start Disabled', severity: 'info' as const, controller: 'Lovato', model: 'RGK800', rootCause: 'Configuration or safety interlock' },
    { code: '7102', title: 'ATS Communication Lost', severity: 'critical' as const, controller: 'Lovato', model: 'RGK800', rootCause: 'Network cable or module failure' },
    { code: '7200', title: 'Mains Failure Detected', severity: 'info' as const, controller: 'Lovato', model: 'RGK800', rootCause: 'Utility power interruption' },

    // Exhaust/Emissions Faults
    { code: '8200', title: 'Exhaust Temperature High', severity: 'critical' as const, controller: 'Siemens', model: 'SIPROTEC', rootCause: 'Injector issue or timing problem' },
    { code: '8201', title: 'Exhaust Back Pressure High', severity: 'warning' as const, controller: 'Siemens', model: 'SIPROTEC', rootCause: 'Exhaust restriction or DPF clog' },
    { code: '8300', title: 'Emissions Limit Exceeded', severity: 'warning' as const, controller: 'Siemens', model: 'SIPROTEC', rootCause: 'Combustion or injection issue' },

    // Safety System Faults
    { code: '9100', title: 'Emergency Stop Active', severity: 'shutdown' as const, controller: 'DEIF', model: 'AGC-4', rootCause: 'Manual E-stop activation' },
    { code: '9101', title: 'Fire System Activated', severity: 'shutdown' as const, controller: 'DEIF', model: 'AGC-4', rootCause: 'Fire detection system trigger' },
    { code: '9102', title: 'Gas Detection Alarm', severity: 'shutdown' as const, controller: 'DEIF', model: 'AGC-4', rootCause: 'Fuel vapor or exhaust leak' },
    { code: '9200', title: 'Enclosure Door Open', severity: 'info' as const, controller: 'DEIF', model: 'AGC-4', rootCause: 'Door interlock triggered' },
    { code: '9201', title: 'Vibration Excessive', severity: 'warning' as const, controller: 'DEIF', model: 'AGC-4', rootCause: 'Mounting or balance issue' },

    // Cummins Specific
    { code: 'SPN100', title: 'Engine Oil Pressure', severity: 'shutdown' as const, controller: 'Cummins PowerCommand', model: 'PCC 3300', rootCause: 'Oil system failure' },
    { code: 'SPN102', title: 'Manifold Air Pressure', severity: 'warning' as const, controller: 'Cummins PowerCommand', model: 'PCC 3300', rootCause: 'Turbo or intake restriction' },
    { code: 'SPN110', title: 'Engine Coolant Temp', severity: 'critical' as const, controller: 'Cummins PowerCommand', model: 'PCC 3300', rootCause: 'Cooling system issue' },

    // Perkins Specific
    { code: 'P0100', title: 'Air Flow Sensor', severity: 'warning' as const, controller: 'Perkins PowerCore', model: 'PowerHub', rootCause: 'MAF sensor failure' },
    { code: 'P0200', title: 'Injector Circuit', severity: 'critical' as const, controller: 'Perkins PowerCore', model: 'PowerHub', rootCause: 'Injector wiring or driver issue' },
    { code: 'P0300', title: 'Multiple Misfires', severity: 'critical' as const, controller: 'Perkins PowerCore', model: 'PowerHub', rootCause: 'Fuel or compression issue' },
  ];

  const resolutions = [
    'Replaced faulty sensor and verified readings within spec',
    'Cleaned and serviced component, tested and confirmed operation',
    'Replaced worn parts per OEM specifications',
    'Recalibrated system parameters and verified performance',
    'Repaired wiring and connections, insulation tested',
    'Replaced filter elements and tested flow rates',
    'Adjusted settings per manufacturer recommendations',
    'Performed full system overhaul and load test',
    'Replaced failed module and updated firmware',
    'Cleared fault codes after root cause correction',
  ];

  const preventiveMeasures = [
    'Scheduled 250-hour service check',
    'Implemented weekly visual inspection protocol',
    'Added parameter to remote monitoring system',
    'Updated maintenance schedule for early detection',
    'Installed additional protection sensor',
    'Trained operator on early warning signs',
    'Added spare parts to on-site inventory',
    'Implemented predictive maintenance algorithm',
  ];

  const tags = [
    ['warranty', 'first-install'],
    ['recurring', 'requires-monitoring'],
    ['parts-ordered', 'follow-up-required'],
    ['emergency', 'after-hours'],
    ['scheduled', 'preventive'],
    ['remote-diagnosed', 'ai-assisted'],
    ['customer-training', 'documentation-updated'],
  ];

  // Generate 100 entries over the past 90 days
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(hoursAgo, Math.floor(Math.random() * 60), 0);

    const fault = faults[Math.floor(Math.random() * faults.length)];
    const tech = TECHNICIANS[Math.floor(Math.random() * TECHNICIANS.length)];
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];

    const isResolved = Math.random() > 0.25;
    const duration = isResolved ? Math.floor(30 + Math.random() * 300) : undefined;
    const laborCost = duration ? Math.floor(duration * 50) : undefined;
    const partsCost = isResolved ? Math.floor(Math.random() * 150000) : undefined;

    const status: DiagnosisEntry['status'] = isResolved
      ? 'resolved'
      : Math.random() > 0.7
        ? 'escalated'
        : Math.random() > 0.5
          ? 'in-progress'
          : Math.random() > 0.5
            ? 'deferred'
            : 'pending';

    const partsUsed: PartUsed[] = isResolved && Math.random() > 0.3 ? [
      {
        name: `${fault.title.split(' ')[0]} Replacement Part`,
        partNumber: `PN-${Math.floor(Math.random() * 100000)}`,
        quantity: Math.floor(1 + Math.random() * 3),
        unitCost: Math.floor(1000 + Math.random() * 50000),
        supplier: ['Local Parts Supplier', 'Generator Spares EA', 'PowerGen Supplies', 'OEM Distributor', 'Regional Parts Center'][Math.floor(Math.random() * 5)]
      }
    ] : [];

    if (partsUsed.length > 0 && Math.random() > 0.5) {
      partsUsed.push({
        name: 'Consumables & Fluids',
        partNumber: `CON-${Math.floor(Math.random() * 10000)}`,
        quantity: 1,
        unitCost: Math.floor(500 + Math.random() * 5000),
        supplier: 'General Supplies'
      });
    }

    const slaHours = fault.severity === 'shutdown' ? 2 : fault.severity === 'critical' ? 4 : 24;
    const actualHours = duration ? duration / 60 : daysAgo * 24;
    const slaStatus: DiagnosisEntry['slaStatus'] = actualHours <= slaHours ? 'within' : actualHours <= slaHours * 1.5 ? 'warning' : 'breached';

    entries.push({
      id: `DIAG-${String(i + 1).padStart(5, '0')}`,
      timestamp: timestamp.toISOString(),
      faultCode: fault.code,
      faultTitle: fault.title,
      severity: fault.severity,
      controller: fault.controller,
      model: fault.model,
      status,
      resolution: isResolved ? resolutions[Math.floor(Math.random() * resolutions.length)] : undefined,
      technician: tech.name,
      technicianId: tech.id,
      duration,
      partsUsed: partsUsed.length > 0 ? partsUsed : undefined,
      laborCost,
      partsCost: partsUsed.reduce((acc, p) => acc + p.unitCost * p.quantity, 0) || undefined,
      totalCost: (laborCost || 0) + (partsUsed.reduce((acc, p) => acc + p.unitCost * p.quantity, 0) || 0) || undefined,
      notes: `Fault detected during ${Math.random() > 0.5 ? 'routine operation' : 'scheduled maintenance'}. ${fault.rootCause}.`,
      rootCause: fault.rootCause,
      preventiveMeasures: isResolved ? preventiveMeasures[Math.floor(Math.random() * preventiveMeasures.length)] : undefined,
      generatorId: `GEN-${String(Math.floor(Math.random() * 500) + 1).padStart(4, '0')}`,
      generatorName: `Generator Set ${[100, 150, 200, 250, 350, 500, 750, 1000][Math.floor(Math.random() * 8)]}kVA - Unit ${String(Math.floor(Math.random() * 500) + 1).padStart(3, '0')}`,
      customerName: customer,
      location: location.name,
      county: location.county,
      priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as DiagnosisEntry['priority'],
      slaStatus,
      attachments: Math.floor(Math.random() * 5),
      followUpDate: !isResolved && Math.random() > 0.5
        ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      relatedFaults: Math.random() > 0.7 ? [`${fault.code.slice(0, 2)}${Math.floor(Math.random() * 100)}`] : undefined,
      tags: tags[Math.floor(Math.random() * tags.length)],
    });
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const SAMPLE_HISTORY = generateSampleHistory();

// ========================= COMPONENT =========================

interface HistoryPanelProps {
  history?: DiagnosisEntry[];
}

export default function HistoryPanel({ history = SAMPLE_HISTORY }: HistoryPanelProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [controllerFilter, setControllerFilter] = useState<string>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');
  const [countyFilter, setCountyFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'cost' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEntry, setSelectedEntry] = useState<DiagnosisEntry | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'analytics' | 'trends' | 'technicians'>('list');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());

  // Get unique values for filters
  const controllers = useMemo(() => [...new Set(history.map(h => h.controller))].sort(), [history]);
  const technicians = useMemo(() => [...new Set(history.map(h => h.technician).filter(Boolean))].sort(), [history]);
  const counties = useMemo(() => [...new Set(history.map(h => h.county).filter(Boolean))].sort(), [history]);

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let filtered = history.filter(entry => {
      const matchesSearch = searchQuery === '' ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.faultCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.faultTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.resolution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.generatorName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || entry.severity === severityFilter;
      const matchesController = controllerFilter === 'all' || entry.controller === controllerFilter;
      const matchesTechnician = technicianFilter === 'all' || entry.technician === technicianFilter;
      const matchesCounty = countyFilter === 'all' || entry.county === countyFilter;

      let matchesDate = true;
      if (dateRange.start) {
        matchesDate = matchesDate && new Date(entry.timestamp) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        matchesDate = matchesDate && new Date(entry.timestamp) <= new Date(dateRange.end + 'T23:59:59');
      }

      return matchesSearch && matchesStatus && matchesSeverity && matchesController && matchesTechnician && matchesCounty && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          break;
        case 'severity':
          const severityOrder = { shutdown: 0, critical: 1, warning: 2, info: 3 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        case 'cost':
          comparison = (b.totalCost || 0) - (a.totalCost || 0);
          break;
        case 'duration':
          comparison = (b.duration || 0) - (a.duration || 0);
          break;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [history, searchQuery, statusFilter, severityFilter, controllerFilter, technicianFilter, countyFilter, dateRange, sortBy, sortOrder]);

  // Pagination
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  // Comprehensive Analytics
  const analytics: AnalyticsSummary = useMemo(() => {
    const resolved = history.filter(h => h.status === 'resolved');
    const pending = history.filter(h => h.status === 'pending');
    const inProgress = history.filter(h => h.status === 'in-progress');
    const escalated = history.filter(h => h.status === 'escalated');
    const deferred = history.filter(h => h.status === 'deferred');

    const totalCost = history.reduce((acc, h) => acc + (h.totalCost || 0), 0);
    const withDuration = history.filter(h => h.duration);
    const avgDuration = withDuration.length > 0
      ? withDuration.reduce((acc, h) => acc + (h.duration || 0), 0) / withDuration.length
      : 0;
    const avgCost = resolved.length > 0
      ? resolved.reduce((acc, h) => acc + (h.totalCost || 0), 0) / resolved.length
      : 0;

    // MTTR - Mean Time To Repair
    const mttr = resolved.length > 0
      ? resolved.reduce((acc, h) => acc + (h.duration || 0), 0) / resolved.length
      : 0;

    // First Time Fix Rate (no related faults or recurring tag)
    const firstTimeFixes = resolved.filter(h => !h.relatedFaults?.length && !h.tags?.includes('recurring'));
    const firstTimeFixRate = resolved.length > 0 ? (firstTimeFixes.length / resolved.length) * 100 : 0;

    // Recurrence Rate
    const recurring = history.filter(h => h.tags?.includes('recurring') || h.relatedFaults?.length);
    const recurrenceRate = history.length > 0 ? (recurring.length / history.length) * 100 : 0;

    // SLA Compliance
    const slaWithin = history.filter(h => h.slaStatus === 'within');
    const slaCompliance = history.length > 0 ? (slaWithin.length / history.length) * 100 : 0;

    // By Severity
    const bySeverity: Record<string, number> = {};
    history.forEach(h => {
      bySeverity[h.severity] = (bySeverity[h.severity] || 0) + 1;
    });

    // By Controller
    const byController: Record<string, number> = {};
    history.forEach(h => {
      byController[h.controller] = (byController[h.controller] || 0) + 1;
    });

    // By Technician
    const byTechnician: Record<string, { count: number; resolved: number; avgTime: number }> = {};
    history.forEach(h => {
      if (h.technician) {
        if (!byTechnician[h.technician]) {
          byTechnician[h.technician] = { count: 0, resolved: 0, avgTime: 0 };
        }
        byTechnician[h.technician].count++;
        if (h.status === 'resolved') {
          byTechnician[h.technician].resolved++;
        }
      }
    });
    Object.keys(byTechnician).forEach(tech => {
      const techJobs = history.filter(h => h.technician === tech && h.duration);
      byTechnician[tech].avgTime = techJobs.length > 0
        ? techJobs.reduce((acc, h) => acc + (h.duration || 0), 0) / techJobs.length
        : 0;
    });

    // By Month
    const byMonth: Record<string, number> = {};
    history.forEach(h => {
      const month = new Date(h.timestamp).toISOString().slice(0, 7);
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    // Top Faults
    const faultCounts: Record<string, { code: string; title: string; count: number }> = {};
    history.forEach(h => {
      if (!faultCounts[h.faultCode]) {
        faultCounts[h.faultCode] = { code: h.faultCode, title: h.faultTitle, count: 0 };
      }
      faultCounts[h.faultCode].count++;
    });
    const topFaults = Object.values(faultCounts).sort((a, b) => b.count - a.count).slice(0, 10);

    // Top Parts
    const partCounts: Record<string, { name: string; count: number; totalCost: number }> = {};
    history.forEach(h => {
      h.partsUsed?.forEach(p => {
        if (!partCounts[p.name]) {
          partCounts[p.name] = { name: p.name, count: 0, totalCost: 0 };
        }
        partCounts[p.name].count += p.quantity;
        partCounts[p.name].totalCost += p.unitCost * p.quantity;
      });
    });
    const topParts = Object.values(partCounts).sort((a, b) => b.count - a.count).slice(0, 10);

    return {
      total: history.length,
      resolved: resolved.length,
      pending: pending.length,
      inProgress: inProgress.length,
      escalated: escalated.length,
      deferred: deferred.length,
      totalCost,
      avgDuration,
      avgCost,
      mttr,
      firstTimeFixRate,
      recurrenceRate,
      slaCompliance,
      bySeverity,
      byController,
      byTechnician,
      byMonth,
      topFaults,
      topParts,
    };
  }, [history]);

  // Export functions
  const exportHistory = useCallback((format: 'csv' | 'json' | 'excel') => {
    const dataToExport = selectedEntries.size > 0
      ? filteredHistory.filter(h => selectedEntries.has(h.id))
      : filteredHistory;

    if (format === 'json') {
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnosis-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = [
        'ID', 'Date', 'Time', 'Fault Code', 'Title', 'Severity', 'Controller', 'Model',
        'Status', 'Customer', 'Generator', 'Location', 'County', 'Technician',
        'Duration (min)', 'Labor Cost', 'Parts Cost', 'Total Cost (KES)',
        'Resolution', 'Root Cause', 'Preventive Measures', 'Notes'
      ];
      const rows = dataToExport.map(h => [
        h.id,
        new Date(h.timestamp).toLocaleDateString(),
        new Date(h.timestamp).toLocaleTimeString(),
        h.faultCode,
        `"${h.faultTitle}"`,
        h.severity,
        h.controller,
        h.model,
        h.status,
        `"${h.customerName || ''}"`,
        `"${h.generatorName || ''}"`,
        `"${h.location || ''}"`,
        h.county || '',
        h.technician || '',
        h.duration || '',
        h.laborCost || '',
        h.partsCost || '',
        h.totalCost || '',
        `"${h.resolution || ''}"`,
        `"${h.rootCause || ''}"`,
        `"${h.preventiveMeasures || ''}"`,
        `"${h.notes || ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnosis-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [filteredHistory, selectedEntries]);

  const printReport = useCallback(() => {
    window.print();
  }, []);

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedEntries.size === paginatedHistory.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(paginatedHistory.map(h => h.id)));
    }
  }, [paginatedHistory, selectedEntries]);

  const toggleSelection = useCallback((id: string) => {
    const newSelection = new Set(selectedEntries);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedEntries(newSelection);
  }, [selectedEntries]);

  // Color schemes
  const severityColors = {
    info: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', solid: 'bg-blue-500' },
    warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', solid: 'bg-amber-500' },
    critical: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', solid: 'bg-orange-500' },
    shutdown: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', solid: 'bg-red-500' },
  };

  const statusColors = {
    pending: { bg: 'bg-slate-500/20', text: 'text-slate-400', solid: 'bg-slate-500' },
    'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', solid: 'bg-blue-500' },
    resolved: { bg: 'bg-green-500/20', text: 'text-green-400', solid: 'bg-green-500' },
    escalated: { bg: 'bg-purple-500/20', text: 'text-purple-400', solid: 'bg-purple-500' },
    deferred: { bg: 'bg-gray-500/20', text: 'text-gray-400', solid: 'bg-gray-500' },
  };

  const priorityColors = {
    low: 'text-slate-400',
    medium: 'text-blue-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-3xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Diagnosis History</h2>
            <p className="text-slate-400">Complete record of {history.length.toLocaleString()} diagnostic sessions</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportHistory('csv')}
            className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
          >
            <span>📊</span> Export CSV
          </button>
          <button
            onClick={() => exportHistory('json')}
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
          >
            <span>📄</span> Export JSON
          </button>
          <button
            onClick={printReport}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
          >
            <span>🖨️</span> Print
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-700/50">
        {[
          { id: 'list', label: 'History List', icon: '📋' },
          { id: 'analytics', label: 'Analytics', icon: '📊' },
          { id: 'trends', label: 'Trends', icon: '📈' },
          { id: 'technicians', label: 'Technicians', icon: '👷' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as typeof viewMode)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === tab.id
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="text-3xl font-bold text-cyan-400">{analytics.total}</div>
          <div className="text-sm text-slate-400">Total Cases</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-green-500/30">
          <div className="text-3xl font-bold text-green-400">{analytics.resolved}</div>
          <div className="text-sm text-slate-400">Resolved</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
          <div className="text-3xl font-bold text-blue-400">{analytics.inProgress}</div>
          <div className="text-sm text-slate-400">In Progress</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/30">
          <div className="text-3xl font-bold text-amber-400">KES {(analytics.totalCost / 1000).toFixed(0)}K</div>
          <div className="text-sm text-slate-400">Total Cost</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/30">
          <div className="text-3xl font-bold text-purple-400">{Math.round(analytics.mttr)} min</div>
          <div className="text-sm text-slate-400">Avg MTTR</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-pink-500/30">
          <div className="text-3xl font-bold text-pink-400">{analytics.slaCompliance.toFixed(0)}%</div>
          <div className="text-sm text-slate-400">SLA Compliance</div>
        </div>
      </div>

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
              <div className="text-sm text-green-400 mb-1">First Time Fix Rate</div>
              <div className="text-4xl font-bold text-white">{analytics.firstTimeFixRate.toFixed(1)}%</div>
              <div className="text-xs text-slate-400 mt-1">Jobs resolved without recurrence</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30">
              <div className="text-sm text-amber-400 mb-1">Recurrence Rate</div>
              <div className="text-4xl font-bold text-white">{analytics.recurrenceRate.toFixed(1)}%</div>
              <div className="text-xs text-slate-400 mt-1">Related or recurring faults</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30">
              <div className="text-sm text-blue-400 mb-1">Avg Cost per Job</div>
              <div className="text-4xl font-bold text-white">KES {analytics.avgCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-xs text-slate-400 mt-1">Labor + parts</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
              <div className="text-sm text-purple-400 mb-1">Resolution Rate</div>
              <div className="text-4xl font-bold text-white">{((analytics.resolved / analytics.total) * 100).toFixed(1)}%</div>
              <div className="text-xs text-slate-400 mt-1">Successfully closed cases</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Severity Distribution */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Fault Severity Distribution</h3>
              <div className="space-y-3">
                {Object.entries(analytics.bySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center gap-3">
                    <div className="w-20 text-sm capitalize text-slate-400">{severity}</div>
                    <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / analytics.total) * 100}%` }}
                        className={`h-full ${severityColors[severity as keyof typeof severityColors]?.solid || 'bg-slate-500'}`}
                      />
                    </div>
                    <div className="w-16 text-right text-white font-medium">{count}</div>
                    <div className="w-12 text-right text-slate-400 text-sm">
                      {((count / analytics.total) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controller Distribution */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Cases by Controller Brand</h3>
              <div className="space-y-3">
                {Object.entries(analytics.byController)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([controller, count], idx) => (
                    <div key={controller} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-slate-400 truncate">{controller}</div>
                      <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / analytics.total) * 100}%` }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ opacity: 1 - idx * 0.1 }}
                        />
                      </div>
                      <div className="w-12 text-right text-white font-medium">{count}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Top Faults & Top Parts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Faults */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">🔥 Top 10 Most Common Faults</h3>
              <div className="space-y-2">
                {analytics.topFaults.map((fault, idx) => (
                  <div key={fault.code} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="px-2 py-0.5 bg-slate-700 rounded font-mono text-sm text-slate-300">
                      {fault.code}
                    </div>
                    <div className="flex-1 text-white text-sm truncate">{fault.title}</div>
                    <div className="text-cyan-400 font-bold">{fault.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Parts */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">🔧 Most Used Parts</h3>
              <div className="space-y-2">
                {analytics.topParts.map((part, idx) => (
                  <div key={part.name} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-white text-sm truncate">{part.name}</div>
                    <div className="text-slate-400 text-sm">{part.count} units</div>
                    <div className="text-amber-400 font-bold">KES {part.totalCost.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trends View */}
      {viewMode === 'trends' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Monthly Trend */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4">📈 Monthly Case Volume</h3>
            <div className="flex items-end gap-2 h-48">
              {Object.entries(analytics.byMonth)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .slice(-12)
                .map(([month, count]) => {
                  const maxCount = Math.max(...Object.values(analytics.byMonth));
                  const height = (count / maxCount) * 100;
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg min-h-[4px]"
                      />
                      <div className="text-xs text-slate-400 -rotate-45 origin-top-left whitespace-nowrap">
                        {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Status Breakdown Over Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">🎯 Status Distribution</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Simple donut chart visualization */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {(() => {
                      const statuses = [
                        { key: 'resolved', value: analytics.resolved, color: '#22c55e' },
                        { key: 'in-progress', value: analytics.inProgress, color: '#3b82f6' },
                        { key: 'pending', value: analytics.pending, color: '#64748b' },
                        { key: 'escalated', value: analytics.escalated, color: '#a855f7' },
                        { key: 'deferred', value: analytics.deferred, color: '#6b7280' },
                      ];
                      let offset = 0;
                      const total = analytics.total || 1;
                      return statuses.map(status => {
                        const percentage = (status.value / total) * 100;
                        const dashArray = `${percentage * 2.51} ${251.2 - percentage * 2.51}`;
                        const element = (
                          <circle
                            key={status.key}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={status.color}
                            strokeWidth="12"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-offset * 2.51}
                          />
                        );
                        offset += percentage;
                        return element;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-3xl font-bold text-white">{analytics.total}</div>
                    <div className="text-xs text-slate-400">Total Cases</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { label: 'Resolved', value: analytics.resolved, color: 'bg-green-500' },
                  { label: 'In Progress', value: analytics.inProgress, color: 'bg-blue-500' },
                  { label: 'Pending', value: analytics.pending, color: 'bg-slate-500' },
                  { label: 'Escalated', value: analytics.escalated, color: 'bg-purple-500' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-400">{item.label}</span>
                    <span className="text-white font-medium ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">⏱️ Resolution Time Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400">Fast (&lt; 1 hour)</span>
                    <span className="text-white font-bold">
                      {history.filter(h => h.duration && h.duration < 60).length}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400">Standard (1-4 hours)</span>
                    <span className="text-white font-bold">
                      {history.filter(h => h.duration && h.duration >= 60 && h.duration < 240).length}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400">Extended (4-8 hours)</span>
                    <span className="text-white font-bold">
                      {history.filter(h => h.duration && h.duration >= 240 && h.duration < 480).length}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-red-400">Complex (&gt; 8 hours)</span>
                    <span className="text-white font-bold">
                      {history.filter(h => h.duration && h.duration >= 480).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Technicians View */}
      {viewMode === 'technicians' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics.byTechnician)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([tech, stats]) => {
                const techInfo = TECHNICIANS.find(t => t.name === tech);
                const resolutionRate = stats.count > 0 ? (stats.resolved / stats.count) * 100 : 0;
                return (
                  <div key={tech} className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {tech.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{tech}</h4>
                        <p className="text-sm text-slate-400">{techInfo?.specialization || 'General'}</p>
                        {techInfo && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-amber-400">★</span>
                            <span className="text-sm text-amber-400">{techInfo.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-cyan-400">{stats.count}</div>
                        <div className="text-xs text-slate-400">Total Jobs</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
                        <div className="text-xs text-slate-400">Resolved</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-400">{Math.round(stats.avgTime)}m</div>
                        <div className="text-xs text-slate-400">Avg Time</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-400">{resolutionRate.toFixed(0)}%</div>
                        <div className="text-xs text-slate-400">Success Rate</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Filters */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="Search ID, fault codes, customers, generators..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
                <option value="deferred">Deferred</option>
              </select>

              {/* Severity Filter */}
              <select
                value={severityFilter}
                onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Severity</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
                <option value="shutdown">Shutdown</option>
              </select>

              {/* Controller Filter */}
              <select
                value={controllerFilter}
                onChange={(e) => { setControllerFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Controllers</option>
                {controllers.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="severity">Sort by Severity</option>
                <option value="cost">Sort by Cost</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>

            {/* Second row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* Technician Filter */}
              <select
                value={technicianFilter}
                onChange={(e) => { setTechnicianFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Technicians</option>
                {technicians.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* County Filter */}
              <select
                value={countyFilter}
                onChange={(e) => { setCountyFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Counties</option>
                {counties.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Date Range */}
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => { setDateRange(prev => ({ ...prev, start: e.target.value })); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => { setDateRange(prev => ({ ...prev, end: e.target.value })); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                placeholder="End Date"
              />
            </div>

            {/* Active filters display */}
            {(searchQuery || statusFilter !== 'all' || severityFilter !== 'all' || controllerFilter !== 'all' || technicianFilter !== 'all' || countyFilter !== 'all' || dateRange.start || dateRange.end) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-700">
                <span className="text-sm text-slate-400">Active filters:</span>
                {searchQuery && (
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm">
                    Search: {searchQuery}
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm capitalize">
                    {statusFilter}
                  </span>
                )}
                {severityFilter !== 'all' && (
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-sm capitalize">
                    {severityFilter}
                  </span>
                )}
                {controllerFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                    {controllerFilter}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setSeverityFilter('all');
                    setControllerFilter('all');
                    setTechnicianFilter('all');
                    setCountyFilter('all');
                    setDateRange({ start: '', end: '' });
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600"
                >
                  Clear All
                </button>
                <span className="ml-auto text-sm text-slate-400">
                  {filteredHistory.length} of {history.length} results
                </span>
              </div>
            )}
          </div>

          {/* History List */}
          <div className="space-y-3">
            {/* Select All / Bulk Actions */}
            {paginatedHistory.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedEntries.size === paginatedHistory.length && paginatedHistory.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800"
                  />
                  <span className="text-sm text-slate-400">
                    {selectedEntries.size > 0 ? `${selectedEntries.size} selected` : 'Select all'}
                  </span>
                </div>
                {selectedEntries.size > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportHistory('csv')}
                      className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                    >
                      Export Selected
                    </button>
                  </div>
                )}
              </div>
            )}

            {filteredHistory.length === 0 ? (
              <div className="p-12 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                <div className="text-4xl mb-4">📭</div>
                <div className="text-xl text-slate-400">No matching records found</div>
                <div className="text-sm text-slate-500 mt-2">Try adjusting your search or filters</div>
              </div>
            ) : (
              paginatedHistory.map((entry) => (
                <motion.div
                  key={entry.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${severityColors[entry.severity].bg} ${severityColors[entry.severity].border} hover:scale-[1.005]`}
                  onClick={() => setSelectedEntry(entry)}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedEntries.has(entry.id)}
                      onChange={(e) => { e.stopPropagation(); toggleSelection(entry.id); }}
                      className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800"
                    />

                    {/* Fault Code Badge */}
                    <div className={`px-3 py-1 rounded-lg font-mono text-lg ${severityColors[entry.severity].bg} ${severityColors[entry.severity].text}`}>
                      {entry.faultCode}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-white font-semibold">{entry.faultTitle}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                            <span className="text-slate-400">{entry.controller} - {entry.model}</span>
                            <span className={`px-2 py-0.5 rounded text-xs uppercase ${statusColors[entry.status].bg} ${statusColors[entry.status].text}`}>
                              {entry.status}
                            </span>
                            {entry.priority && (
                              <span className={`text-xs ${priorityColors[entry.priority]}`}>
                                ● {entry.priority}
                              </span>
                            )}
                            {entry.slaStatus && (
                              <span className={`px-1.5 py-0.5 rounded text-xs ${
                                entry.slaStatus === 'within' ? 'bg-green-500/20 text-green-400' :
                                entry.slaStatus === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                SLA {entry.slaStatus}
                              </span>
                            )}
                          </div>
                          {entry.customerName && (
                            <div className="text-sm text-slate-500 mt-1">
                              🏢 {entry.customerName} • {entry.generatorName}
                            </div>
                          )}
                          {entry.location && (
                            <div className="text-sm text-slate-500">
                              📍 {entry.location}, {entry.county}
                            </div>
                          )}
                          {entry.resolution && (
                            <p className="text-sm text-slate-400 mt-2 line-clamp-1">✓ {entry.resolution}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-slate-500 font-mono">{entry.id}</div>
                          <div className="text-sm text-slate-400">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </div>
                          {entry.technician && (
                            <div className="text-sm text-cyan-400 mt-1">👷 {entry.technician}</div>
                          )}
                          {entry.totalCost && (
                            <div className="text-amber-400 font-medium mt-1">
                              KES {entry.totalCost.toLocaleString()}
                            </div>
                          )}
                          {entry.attachments && entry.attachments > 0 && (
                            <div className="text-xs text-slate-500 mt-1">📎 {entry.attachments}</div>
                          )}
                        </div>
                      </div>
                      {/* Tags */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-slate-400">per page</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ««
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  «
                </button>
                <span className="px-4 text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »»
                </button>
              </div>
              <div className="text-sm text-slate-400">
                {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length}
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 ${severityColors[selectedEntry.severity].bg} border-b ${severityColors[selectedEntry.severity].border}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg font-mono text-2xl ${severityColors[selectedEntry.severity].text} bg-slate-900/50`}>
                      {selectedEntry.faultCode}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">{selectedEntry.id}</div>
                      <h3 className="text-xl font-bold text-white">{selectedEntry.faultTitle}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-300">{selectedEntry.controller}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">{selectedEntry.model}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs uppercase ${statusColors[selectedEntry.status].bg} ${statusColors[selectedEntry.status].text}`}>
                          {selectedEntry.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Customer & Location Info */}
                {(selectedEntry.customerName || selectedEntry.location) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEntry.customerName && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-sm text-slate-400">Customer</div>
                        <div className="text-lg font-semibold text-white">{selectedEntry.customerName}</div>
                        {selectedEntry.generatorName && (
                          <div className="text-sm text-cyan-400 mt-1">{selectedEntry.generatorName}</div>
                        )}
                      </div>
                    )}
                    {selectedEntry.location && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-sm text-slate-400">Location</div>
                        <div className="text-lg font-semibold text-white">{selectedEntry.location}</div>
                        <div className="text-sm text-slate-400">{selectedEntry.county} County</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Status & Time */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400">Status</div>
                    <div className={`text-lg font-semibold capitalize ${statusColors[selectedEntry.status].text}`}>
                      {selectedEntry.status}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400">Date & Time</div>
                    <div className="text-lg font-semibold text-white">
                      {new Date(selectedEntry.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {selectedEntry.technician && (
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-sm text-slate-400">Technician</div>
                      <div className="text-lg font-semibold text-white">{selectedEntry.technician}</div>
                    </div>
                  )}
                  {selectedEntry.duration && (
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-sm text-slate-400">Duration</div>
                      <div className="text-lg font-semibold text-white">
                        {selectedEntry.duration >= 60
                          ? `${Math.floor(selectedEntry.duration / 60)}h ${selectedEntry.duration % 60}m`
                          : `${selectedEntry.duration} min`
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Root Cause */}
                {selectedEntry.rootCause && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <div className="text-sm text-orange-400 font-medium mb-2">🔍 Root Cause</div>
                    <div className="text-white">{selectedEntry.rootCause}</div>
                  </div>
                )}

                {/* Resolution */}
                {selectedEntry.resolution && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-sm text-green-400 font-medium mb-2">✓ Resolution</div>
                    <div className="text-white">{selectedEntry.resolution}</div>
                  </div>
                )}

                {/* Preventive Measures */}
                {selectedEntry.preventiveMeasures && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="text-sm text-blue-400 font-medium mb-2">🛡️ Preventive Measures</div>
                    <div className="text-white">{selectedEntry.preventiveMeasures}</div>
                  </div>
                )}

                {/* Parts Used */}
                {selectedEntry.partsUsed && selectedEntry.partsUsed.length > 0 && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-3">🔧 Parts Used</div>
                    <div className="space-y-2">
                      {selectedEntry.partsUsed.map((part, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                          <div>
                            <div className="text-white">{part.name}</div>
                            {part.partNumber && (
                              <div className="text-xs text-slate-500 font-mono">{part.partNumber}</div>
                            )}
                            {part.supplier && (
                              <div className="text-xs text-slate-400">Supplier: {part.supplier}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-slate-400">×{part.quantity}</div>
                            <div className="text-amber-400">KES {(part.unitCost * part.quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Costs */}
                {(selectedEntry.laborCost || selectedEntry.partsCost || selectedEntry.totalCost) && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="text-sm text-amber-400 font-medium mb-3">💰 Cost Breakdown</div>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedEntry.laborCost && (
                        <div>
                          <div className="text-sm text-slate-400">Labor</div>
                          <div className="text-xl font-bold text-white">KES {selectedEntry.laborCost.toLocaleString()}</div>
                        </div>
                      )}
                      {selectedEntry.partsCost && (
                        <div>
                          <div className="text-sm text-slate-400">Parts</div>
                          <div className="text-xl font-bold text-white">KES {selectedEntry.partsCost.toLocaleString()}</div>
                        </div>
                      )}
                      {selectedEntry.totalCost && (
                        <div>
                          <div className="text-sm text-slate-400">Total</div>
                          <div className="text-2xl font-bold text-amber-400">KES {selectedEntry.totalCost.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedEntry.notes && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">📝 Notes</div>
                    <div className="text-slate-300">{selectedEntry.notes}</div>
                  </div>
                )}

                {/* Tags */}
                {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Related Faults */}
                {selectedEntry.relatedFaults && selectedEntry.relatedFaults.length > 0 && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-sm text-purple-400 font-medium mb-2">🔗 Related Faults</div>
                    <div className="flex gap-2">
                      {selectedEntry.relatedFaults.map(code => (
                        <span key={code} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded font-mono">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Date */}
                {selectedEntry.followUpDate && (
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="text-sm text-cyan-400 font-medium mb-1">📅 Follow-up Scheduled</div>
                    <div className="text-white">{new Date(selectedEntry.followUpDate).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30">
                  Export PDF
                </button>
                <button className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30">
                  Create Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
