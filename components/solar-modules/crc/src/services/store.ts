import { create } from 'zustand';

const STORAGE_KEY = 'solargeniuspro_project_v1';
const LEGACY_SETTINGS_KEY = 'solargeniuspro_settings';

export interface ClientInfo {
  name: string; email: string; phone: string; address: string; referenceNo: string;
}
export interface SiteInfo {
  lat: number | null; lon: number | null; displayName: string;
  elevationM: number | null; irradianceKwhPerM2Day: number | null; temperatureC: number | null;
  monthlyConsumptionKwh: number | null; tariffKesPerKwh: number; gridReliabilityNotes: string;
  roofAreaM2: number | null; roofPerimeterM: number | null;
  roofAzimuthDeg: number | null; roofPitchDeg: number | null; roofProvenance: string;
}
export interface BrandInfo {
  companyName: string; tagline: string; contactEmail: string; contactPhone: string;
  primaryColor: string; accentColor: string;
}
export interface DesignInfo {
  systemKw: number; panelCount: number; panelW: number; panelMake: string; panelModel: string;
  inverterKw: number; inverterMake: string; inverterModel: string;
  batteryKwh: number; batteryMake: string; batteryModel: string;
  tiltDeg: number; azimuthDeg: number;
}
export interface FinancialInfo {
  capexKes: number; year1SavingsKes: number; paybackYears: number; irrPct: number; npvKes: number;
}
export interface SolarMetrics {
  systemSizeKw: number; panelCount: number; totalCost: number; monthlySaving: number;
  paybackPeriods: number; annualProduction: number; carbonOffsetKg: number; peakSunHours: number;
  // Legacy / optional aux fields (used by AnalyticsPage)
  dailyProduction?: number;
  location?: string;
  efficiency?: number;
  governmentSubsidy?: number;
  finalCost?: number;
}
export interface AppSettings {
  units: 'metric' | 'imperial'; currency: 'KES' | 'USD' | 'EUR';
  theme: 'dark' | 'light'; notifications: boolean; apiEndpoint: string;
  language: 'en' | 'sw' | 'fr';
}
export interface SolarStore {
  metrics: SolarMetrics; client: ClientInfo; site: SiteInfo;
  brand: BrandInfo; design: DesignInfo; financial: FinancialInfo;
  settings: AppSettings; errors: string[];
  updateMetrics: (m: Partial<SolarMetrics>) => void;
  updateClient: (c: Partial<ClientInfo>) => void;
  updateSite: (s: Partial<SiteInfo>) => void;
  updateBrand: (b: Partial<BrandInfo>) => void;
  updateDesign: (d: Partial<DesignInfo>) => void;
  updateFinancial: (f: Partial<FinancialInfo>) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  pushError: (e: string) => void;
  clearErrors: () => void;
  saveProject: () => void;
  loadProject: () => void;
  resetProject: () => void;
}

const DEFAULT_METRICS: SolarMetrics = {
  systemSizeKw: 0, panelCount: 0, totalCost: 0, monthlySaving: 0,
  paybackPeriods: 0, annualProduction: 0, carbonOffsetKg: 0, peakSunHours: 5.5
};
const DEFAULT_CLIENT: ClientInfo = {
  name: '', email: '', phone: '', address: '', referenceNo: ''
};
const DEFAULT_SITE: SiteInfo = {
  lat: null, lon: null, displayName: '',
  elevationM: null, irradianceKwhPerM2Day: null, temperatureC: null,
  monthlyConsumptionKwh: null, tariffKesPerKwh: 25.5, gridReliabilityNotes: '',
  roofAreaM2: null, roofPerimeterM: null,
  roofAzimuthDeg: null, roofPitchDeg: null, roofProvenance: ''
};
const DEFAULT_BRAND: BrandInfo = {
  companyName: 'EmersonEIMS', tagline: 'Engineering Better Energy',
  contactEmail: 'sally@emersoneims.com', contactPhone: '0768860665',
  primaryColor: '#00B894', accentColor: '#0984E3'
};
const DEFAULT_DESIGN: DesignInfo = {
  systemKw: 0, panelCount: 0, panelW: 580,
  panelMake: '', panelModel: '',
  inverterKw: 0, inverterMake: '', inverterModel: '',
  batteryKwh: 0, batteryMake: '', batteryModel: '',
  tiltDeg: 10, azimuthDeg: 0
};
const DEFAULT_FINANCIAL: FinancialInfo = {
  capexKes: 0, year1SavingsKes: 0, paybackYears: 0, irrPct: 0, npvKes: 0
};
const DEFAULT_SETTINGS: AppSettings = {
  units: 'metric', currency: 'KES', theme: 'dark',
  notifications: true, apiEndpoint: '/api', language: 'en'
};

export const useSolarStore = create<SolarStore>((set, get) => ({
  metrics: DEFAULT_METRICS,
  client: DEFAULT_CLIENT,
  site: DEFAULT_SITE,
  brand: DEFAULT_BRAND,
  design: DEFAULT_DESIGN,
  financial: DEFAULT_FINANCIAL,
  settings: DEFAULT_SETTINGS,
  errors: [],
  updateMetrics: (m) => set((s) => ({ metrics: { ...s.metrics, ...m } })),
  updateClient: (c) => set((s) => ({ client: { ...s.client, ...c } })),
  updateSite: (si) => set((s) => ({ site: { ...s.site, ...si } })),
  updateBrand: (b) => set((s) => ({ brand: { ...s.brand, ...b } })),
  updateDesign: (d) => set((s) => ({ design: { ...s.design, ...d } })),
  updateFinancial: (f) => set((s) => ({ financial: { ...s.financial, ...f } })),
  updateSettings: (st) => set((s) => ({ settings: { ...s.settings, ...st } })),
  pushError: (e) => set((s) => ({ errors: [...s.errors, e].slice(-20) })),
  clearErrors: () => set({ errors: [] }),
  saveProject: () => {
    try {
      const s = get();
      const payload = {
        v: 1, savedAt: new Date().toISOString(),
        metrics: s.metrics, client: s.client, site: s.site,
        brand: s.brand, design: s.design, financial: s.financial,
        settings: s.settings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) { console.warn('saveProject failed', err); }
  },
  loadProject: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        set({
          metrics: { ...DEFAULT_METRICS, ...(p.metrics || {}) },
          client: { ...DEFAULT_CLIENT, ...(p.client || {}) },
          site: { ...DEFAULT_SITE, ...(p.site || {}) },
          brand: { ...DEFAULT_BRAND, ...(p.brand || {}) },
          design: { ...DEFAULT_DESIGN, ...(p.design || {}) },
          financial: { ...DEFAULT_FINANCIAL, ...(p.financial || {}) },
          settings: { ...DEFAULT_SETTINGS, ...(p.settings || {}) }
        });
        return;
      }
      const legacy = localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (legacy) {
        const s = JSON.parse(legacy);
        set({ settings: { ...DEFAULT_SETTINGS, ...s } });
      }
    } catch (err) { console.warn('loadProject failed', err); }
  },
  resetProject: () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    set({
      metrics: DEFAULT_METRICS,
      client: DEFAULT_CLIENT,
      site: DEFAULT_SITE,
      brand: DEFAULT_BRAND,
      design: DEFAULT_DESIGN,
      financial: DEFAULT_FINANCIAL,
      errors: []
    });
  }
}));
