# 🔧 SOLARGENIUSPRO: QUICK INTEGRATION GUIDE

## Getting Started with the 16 AI Modules

This guide helps you quickly integrate and test all modules in your local development environment.

---

## 📦 SETUP (5 minutes)

### 1. Install Dependencies
```bash
cd SolarGeniusPro/crc
npm install

# Optional: Install development tools
npm install --save-dev @types/three @types/jest @testing-library/react
```

### 2. Configure Environment Variables
Create `.env.local` file:
```env
# APIs
REACT_APP_NASA_API_KEY=your_key_here
REACT_APP_OPENWEATHER_KEY=your_key_here
REACT_APP_GOOGLE_MAPS_KEY=your_key_here
REACT_APP_MAPBOX_TOKEN=your_token_here
REACT_APP_OPENAI_API_KEY=your_openai_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/solargenius
REDIS_URL=redis://localhost:6379

# Email (Maintenance alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@emerson.co.ke
SMTP_PASS=your_app_password

# Twilio (SMS alerts)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

### 3. Start Development Server
```bash
npm run dev        # Frontend (http://localhost:5173)
npm run server     # Backend (http://localhost:3001)
npm start          # Both (concurrent)
```

---

## 🚀 MODULE INTEGRATION QUICK START

### PHASE 1: INPUT & ANALYSIS

#### Module 1: Solar Overview AI
```typescript
import { SolarOverviewAI } from './services/api/nasaApi';

// Usage
const overview = new SolarOverviewAI();
const irradiance = await overview.fetchSolarData(latitude, longitude);
```

#### Module 2: Size My System AI
```typescript
import { SystemSizeCalculator } from './core/learning/loadBehaviorSimulation';

const calculator = new SystemSizeCalculator();
const systemSize = calculator.calculateFromBill(monthlyBillKSh, offsetPercentage);
// Returns: { kWp: 5.6, panels: 10, capacity: 5500 }
```

#### Module 3: Savings Calculator AI
```typescript
import { SavingsProjector } from './core/simulation/lifecycleSimulator';

const projector = new SavingsProjector();
const projection = projector.project25Years({
  systemSize: 5.6,
  tariffEscalation: 0.03,
  panelDegradation: 0.007
});
// Returns: { npv: 450000, roi: 6.5, paybackPeriod: 4.2 }
```

#### Module 4: Get AI Quote - NLP Parser ✨
```typescript
import { NLPQuoteParser } from './services/QuoteParserService';

const parser = new NLPQuoteParser();

// From PDF bill
const text = await parser.extractFromPDF(pdfFile);
const extracted = await parser.parseNaturalLanguage(text);
const quote = parser.generateQuote(extracted, systemSize);

// From Excel BOQ
const items = await parser.extractFromExcel(excelFile);

// Results in Quote object with auto-calculated total
```

**React Component:**
```tsx
import { QuoteParserUI } from './services/QuoteParserService';

function App() {
  return (
    <QuoteParserUI onQuoteGenerated={(quote) => {
      console.log('Quote generated:', quote);
      // Save to database
    }} />
  );
}
```

#### Module 5: AI Control Centre
```typescript
import { ExecutiveDashboard } from './commandCenter/executiveDashboard';

// Subscribes to all module outputs and displays unified dashboard
```

---

### PHASE 2: DESIGN & ENGINEERING

#### Module 6: 8-Step Project AI ✨
```tsx
import { ProjectStateAI } from './components/decision/ProjectStateAI';

function ProjectFlow() {
  return <ProjectStateAI projectId="SOLAR-2024-001" />;
}

// Features:
// - 8 guided stages
// - Form validation per stage
// - Progress tracking
// - Auto-save
```

#### Module 7: 3D Design Studio AI ✨
```tsx
import { DesignStudioAI } from './components/design/DesignStudioAI';

function DesignPage() {
  return (
    <DesignStudioAI 
      address="123 Nairobi Avenue"
      roofImage={imageFile} // Optional drone photo
    />
  );
}

// Features:
// - Drag-drop panel placement
// - Real-time shading calculation
// - Production estimates
// - Canvas-based design
```

#### Module 8: True 3D Viewer AI ✨
```tsx
import { True3DViewer } from './components/design/True3DViewer';

function Viewer() {
  const panels = [/* from design studio */];
  return (
    <True3DViewer 
      panels={panels}
      roofPitch={25}
      address="123 Nairobi Avenue"
    />
  );
}

// Features:
// - Full 3D rotation
// - Street View integration
// - Time-based sun positioning
// - Component visibility
```

#### Module 9: Voice Design AI ✨
```tsx
import { VoiceDesignAI } from './commandCenter/VoiceDesignAI';

function VoiceControl() {
  const handleCommand = (command) => {
    if (command.action === 'add_panels') {
      addPanels(command.parameters.count);
    }
  };

  return <VoiceDesignAI onCommand={handleCommand} />;
}

// Supports: "Add 4 panels", "Rotate left", "Add battery", etc.
```

#### Module 10: Equipment DB AI
```typescript
import { ComponentCatalog } from './services/marketplace/catalogService';

const catalog = new ComponentCatalog();

// Get all inverters
const inverters = await catalog.getInverters();

// Filter by specs
const deyeInverters = inverters.filter(inv => inv.brand === 'Deye');

// Get specifications
const specs = catalog.getSpecs('DEYE-5KW-HY');
```

---

### PHASE 3: SAFETY & EDUCATION

#### Module 11: Wiring Diagram AI ✨
```tsx
import { WiringDiagramAI } from './components/design/WiringDiagramAI';

function WiringPage() {
  return (
    <WiringDiagramAI
      systemSize={5.6}
      panels={[/* panel array */]}
      inverter={{ model: 'Deye-5KW', ratedPower: 5000 }}
      battery={{ model: 'BYD-10.24', capacity: 10.24, voltage: 48 }}
      isPaid={true} // Controls watermark
    />
  );
}

// Exports:
// - SVG diagram (canvas)
// - PDF with specifications
// - Printable format
```

#### Module 12: Repair Guides AI ✨
```typescript
import { RepairGuidesUI } from './services/RepairAndMaintenanceService';

function RepairPage() {
  return <RepairGuidesUI systemId="SOLAR-001" />;
}

// Features:
// - Step-by-step guides
// - Safety warnings
// - Tools/parts lists
// - PDF export
```

#### Module 13: Fault Codes AI ✨
```tsx
import { FaultCodesAI, FaultCodeSearchEngine } from './components/decision/FaultCodesAI';

// As React component
function FaultSearch() {
  return <FaultCodesAI />;
}

// Programmatic usage
import faultCodes from './data/fault-codes.json';
const engine = new FaultCodeSearchEngine(faultCodes);

// Search
const results = engine.search('overvoltage', 'Deye');
// Returns: [{ code: 'F01', title: 'DC Bus Overvoltage', ... }]

// Get related codes
const related = engine.getRelatedCodes('F01');
```

#### Module 14: Live Monitor AI
```typescript
import { RealtimeMonitor } from './core/learning/realTimeSync';

const monitor = new RealtimeMonitor();

// Subscribe to real-time data
monitor.subscribe('production', (data) => {
  console.log('Current output:', data.watts);
});

// Returns live metrics:
// - Current production (W)
// - Battery state (SOC %)
// - Grid import/export (kW)
// - Efficiency (%)
```

#### Module 15: Maintenance AI ✨
```typescript
import { MaintenanceScheduler } from './services/RepairAndMaintenanceService';

const scheduler = new MaintenanceScheduler({
  user: 'noreply@emerson.co.ke',
  pass: process.env.SMTP_PASS
});

// Create schedules
const schedules = scheduler.createDefaultSchedule('SOLAR-001');

// Send reminder
await scheduler.sendReminder(schedules[0], 'customer@example.com');

// Mark complete
scheduler.markTaskCompleted('maint-SOLAR-001-daily');
```

#### Module 16: Sales Dashboard AI
```typescript
import { ExecutiveDashboard } from './commandCenter/executiveDashboard';

// Provides:
// - KPI metrics
// - Quote conversion funnel
// - Revenue projections
// - Technician performance
```

---

## 🔄 FULL WORKFLOW EXAMPLE

```typescript
import { SolarOverviewAI } from './services/api/nasaApi';
import { SystemSizeCalculator } from './core/learning/loadBehaviorSimulation';
import { NLPQuoteParser } from './services/QuoteParserService';
import { MaintenanceScheduler } from './services/RepairAndMaintenanceService';

async function completeSolarDesignFlow() {
  const address = "123 Nairobi Avenue";
  const latitude = -1.286389;
  const longitude = 36.816667;
  const monthlyBill = 25000; // KSh

  // 1. Get location solar data
  const overview = new SolarOverviewAI();
  const irradiance = await overview.fetchSolarData(latitude, longitude);
  console.log(`Solar irradiance: ${irradiance.ghi} kWh/m²/day`);

  // 2. Calculate system size
  const calculator = new SystemSizeCalculator();
  const system = calculator.calculateFromBill(monthlyBill, 0.8); // 80% offset
  console.log(`Recommended system: ${system.kWp} kWp`);

  // 3. Parse uploaded BOQ
  const parser = new NLPQuoteParser();
  const items = await parser.extractFromExcel(boqFile);
  const quote = parser.generateQuote({
    items,
    clientName: 'John Doe',
    address,
    rawText: '',
    confidence: 0.9
  }, system.kWp);
  console.log(`Quote total: ${quote.total} KSh`);

  // 4. Create maintenance schedule
  const scheduler = new MaintenanceScheduler();
  const maintenanceSchedules = scheduler.createDefaultSchedule('SOLAR-001');
  console.log(`${maintenanceSchedules.length} maintenance tasks scheduled`);

  return { irradiance, system, quote, schedules: maintenanceSchedules };
}
```

---

## 🧪 TESTING EACH MODULE

### Module 7: Test Shading Calculation
```typescript
import { calculateShadingHeatmap } from './core/simulation/shadingEngine';

async function testShading() {
  const params = {
    panels: [{ id: 'p1', x: -1.286, y: 36.817, z: 0 }],
    latitude: -1.286389,
    longitude: 36.816667,
    roofPitch: 25,
    time: '12:00',
    date: new Date()
  };

  const results = await calculateShadingHeatmap(params);
  console.log('Shading map:', results); // { 'p1': 15.3 } (15.3% shaded)
}
```

### Module 13: Test Fault Code Search
```typescript
import { FaultCodeSearchEngine } from './components/decision/FaultCodesAI';
import faultCodes from './data/fault-codes.json';

const engine = new FaultCodeSearchEngine(faultCodes);

// Test 1: Exact code match
const results1 = engine.search('F01');
console.assert(results1[0].code === 'F01');

// Test 2: Fuzzy match
const results2 = engine.search('F0'); // Typo
console.assert(results2.length > 0);

// Test 3: Brand filtering
const results3 = engine.search('overvoltage', 'Deye');
console.assert(results3[0].brand === 'Deye');
```

### Module 4: Test Quote Parser
```typescript
async function testQuoteParser() {
  const parser = new NLPQuoteParser();

  // Mock PDF text
  const text = `
    Invoice
    Client: John Doe
    Address: 123 Nairobi
    
    Items:
    10 x JA Solar 550W @ 12500 = 125000
    1 x Deye 5kW Inverter @ 85000 = 85000
  `;

  const extracted = await parser.parseNaturalLanguage(text);
  console.log('Extracted items:', extracted.items.length); // 2
  console.log('Client:', extracted.clientName); // John Doe

  const quote = parser.generateQuote(extracted, 5.6);
  console.log('Quote total:', quote.total); // Includes VAT
}
```

---

## 📱 DEPLOYMENT QUICK CHECKLIST

- [ ] All .env variables configured
- [ ] Database migrations run: `npm run db:migrate`
- [ ] Test data seeded: `npm run db:seed`
- [ ] Frontend build successful: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Module tests passing: `npm test`
- [ ] All 16 modules functioning in staging

---

## 🆘 TROUBLESHOOTING

### 3D Viewer not rendering
```typescript
// Check WebGL support
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');
console.log('WebGL2 supported:', !!gl);

// Force software rendering if needed
// Set REACT_APP_FORCE_SOFTWARE_GL=true
```

### Voice recognition not working
```javascript
// Check browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  console.error('Speech Recognition not supported in this browser');
}
```

### PDF parsing failing
```typescript
// Enable debug logging
import pdfParse from 'pdf-parse';
pdfParse.default.disableFontFace = false; // For better text extraction
```

---

## 📚 ADDITIONAL RESOURCES

- **Architecture Docs:** [IMPLEMENTATION_AUDIT_FINAL.md](./IMPLEMENTATION_AUDIT_FINAL.md)
- **API Reference:** [docs/API.md](./docs/API.md)
- **Component Library:** `Storybook` (coming soon)
- **Data Schemas:** [Prisma Schema](./prisma/schema.prisma)

---

## ✅ VALIDATION CHECKLIST

After integration, verify:

- [ ] All 16 module imports resolve
- [ ] No circular dependencies
- [ ] API keys properly configured
- [ ] Database connection successful
- [ ] Frontend builds without errors
- [ ] Backend server starts on port 3001
- [ ] WebSocket (Socket.io) connecting
- [ ] Redis cache operational
- [ ] Email notifications sending
- [ ] All components rendering correctly

---

## 🚀 YOU'RE READY!

All 16 modules are now integrated and ready for:

1. **Local Testing** - Run full workflow
2. **Staging Deployment** - Test with realistic data
3. **Production Launch** - Deploy to live servers
4. **User Training** - Teach your team the platform

---

**Questions?** Contact engineering@emerson.co.ke

**Last Updated:** April 21, 2026  
**Status:** ✅ Complete & Production-Ready
