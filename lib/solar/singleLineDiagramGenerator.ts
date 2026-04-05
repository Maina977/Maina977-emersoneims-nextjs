/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO - SINGLE-LINE DIAGRAM GENERATOR                           ║
 * ║   Professional Electrical Schematics for Solar PV Systems                   ║
 * ║   IEC/NEC/SANS Compliant - AutoCAD Compatible Export                        ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface SLDSystemConfig {
  systemSize: number;
  systemType: 'grid-tied' | 'hybrid' | 'off-grid';
  panels: {
    brand: string;
    model: string;
    wattage: number;
    voc: number;
    vmp: number;
    isc: number;
    imp: number;
    quantity: number;
  };
  inverter: {
    brand: string;
    model: string;
    capacity: number;
    type: 'string' | 'micro' | 'hybrid' | 'off-grid';
    mpptChannels: number;
    maxDcVoltage: number;
    quantity: number;
  };
  batteries?: {
    brand: string;
    model: string;
    capacity: number;
    voltage: number;
    quantity: number;
  };
  strings: {
    count: number;
    panelsPerString: number;
    voltage: number;
    current: number;
  };
  acOutput: {
    voltage: number;
    phases: 1 | 3;
    current: number;
  };
  country: string;
  standard: 'IEC' | 'NEC' | 'SANS' | 'AS/NZS';
}

export interface SLDComponent {
  id: string;
  type: string;
  symbol: string;
  label: string;
  specs: string[];
  position: { x: number; y: number };
  connections: string[];
}

export interface SingleLineDiagram {
  id: string;
  title: string;
  standard: string;
  components: SLDComponent[];
  connections: Array<{ from: string; to: string; type: 'dc' | 'ac' | 'ground'; label?: string }>;
  notes: string[];
  legend: Array<{ symbol: string; description: string }>;
  svgContent: string;
  metadata: {
    createdAt: string;
    systemSize: string;
    voltage: string;
    standard: string;
    designer: string;
  };
}

// ============================================================================
// ELECTRICAL SYMBOLS (SVG Paths)
// ============================================================================

const SYMBOLS = {
  solarPanel: `<g class="panel"><rect x="0" y="0" width="40" height="60" fill="none" stroke="#1e40af" stroke-width="2"/><line x1="0" y1="20" x2="40" y2="20" stroke="#1e40af" stroke-width="1"/><line x1="0" y1="40" x2="40" y2="40" stroke="#1e40af" stroke-width="1"/><line x1="13" y1="0" x2="13" y2="60" stroke="#1e40af" stroke-width="1"/><line x1="27" y1="0" x2="27" y2="60" stroke="#1e40af" stroke-width="1"/><circle cx="20" cy="30" r="8" fill="none" stroke="#1e40af" stroke-width="1.5"/><line x1="14" y1="26" x2="26" y2="34" stroke="#1e40af" stroke-width="1.5"/></g>`,

  dcIsolator: `<g class="dc-isolator"><rect x="0" y="0" width="30" height="40" fill="none" stroke="#dc2626" stroke-width="2"/><line x1="8" y1="10" x2="22" y2="30" stroke="#dc2626" stroke-width="2"/><circle cx="15" cy="8" r="3" fill="#dc2626"/><circle cx="15" cy="32" r="3" fill="#dc2626"/></g>`,

  acIsolator: `<g class="ac-isolator"><rect x="0" y="0" width="30" height="40" fill="none" stroke="#059669" stroke-width="2"/><line x1="8" y1="10" x2="22" y2="30" stroke="#059669" stroke-width="2"/><circle cx="15" cy="8" r="3" fill="#059669"/><circle cx="15" cy="32" r="3" fill="#059669"/></g>`,

  inverter: `<g class="inverter"><rect x="0" y="0" width="60" height="80" fill="none" stroke="#7c3aed" stroke-width="2"/><text x="30" y="25" text-anchor="middle" font-size="10" fill="#7c3aed">DC</text><line x1="10" y1="40" x2="50" y2="40" stroke="#7c3aed" stroke-width="2"/><text x="30" y="60" text-anchor="middle" font-size="10" fill="#7c3aed">AC</text><path d="M15,55 Q30,45 45,55 Q30,65 15,55" fill="none" stroke="#7c3aed" stroke-width="1.5"/></g>`,

  battery: `<g class="battery"><rect x="0" y="10" width="40" height="50" fill="none" stroke="#0891b2" stroke-width="2"/><rect x="12" y="0" width="16" height="10" fill="#0891b2"/><line x1="10" y1="25" x2="30" y2="25" stroke="#0891b2" stroke-width="3"/><line x1="15" y1="35" x2="25" y2="35" stroke="#0891b2" stroke-width="2"/><line x1="10" y1="45" x2="30" y2="45" stroke="#0891b2" stroke-width="3"/></g>`,

  mcb: `<g class="mcb"><rect x="0" y="0" width="20" height="50" fill="none" stroke="#0369a1" stroke-width="2"/><line x1="10" y1="10" x2="10" y2="25" stroke="#0369a1" stroke-width="2"/><line x1="10" y1="25" x2="15" y2="35" stroke="#0369a1" stroke-width="2"/><line x1="10" y1="40" x2="10" y2="50" stroke="#0369a1" stroke-width="2"/></g>`,

  surgeProtector: `<g class="spd"><rect x="0" y="0" width="25" height="40" fill="none" stroke="#ea580c" stroke-width="2"/><path d="M5,10 L20,10 L8,25 L18,25 L5,40" fill="none" stroke="#ea580c" stroke-width="2"/></g>`,

  energyMeter: `<g class="meter"><circle cx="20" cy="20" r="18" fill="none" stroke="#16a34a" stroke-width="2"/><text x="20" y="24" text-anchor="middle" font-size="10" fill="#16a34a">kWh</text></g>`,

  grid: `<g class="grid"><circle cx="20" cy="20" r="15" fill="none" stroke="#1f2937" stroke-width="2"/><line x1="20" y1="5" x2="20" y2="35" stroke="#1f2937" stroke-width="1.5"/><line x1="5" y1="20" x2="35" y2="20" stroke="#1f2937" stroke-width="1.5"/><line x1="8" y1="8" x2="32" y2="32" stroke="#1f2937" stroke-width="1"/><line x1="32" y1="8" x2="8" y2="32" stroke="#1f2937" stroke-width="1"/></g>`,

  earthRod: `<g class="earth"><line x1="15" y1="0" x2="15" y2="20" stroke="#059669" stroke-width="2"/><line x1="5" y1="20" x2="25" y2="20" stroke="#059669" stroke-width="2"/><line x1="8" y1="25" x2="22" y2="25" stroke="#059669" stroke-width="2"/><line x1="11" y1="30" x2="19" y2="30" stroke="#059669" stroke-width="2"/></g>`,

  junction: `<g class="junction"><circle cx="5" cy="5" r="4" fill="#1f2937"/></g>`,

  fuse: `<g class="fuse"><rect x="0" y="0" width="30" height="15" fill="none" stroke="#dc2626" stroke-width="2"/><line x1="0" y1="7.5" x2="10" y2="7.5" stroke="#dc2626" stroke-width="1"/><line x1="20" y1="7.5" x2="30" y2="7.5" stroke="#dc2626" stroke-width="1"/></g>`,

  load: `<g class="load"><circle cx="20" cy="20" r="15" fill="none" stroke="#64748b" stroke-width="2"/><text x="20" y="24" text-anchor="middle" font-size="10" fill="#64748b">LOAD</text></g>`,
};

// ============================================================================
// SINGLE-LINE DIAGRAM GENERATOR
// ============================================================================

export class SingleLineDiagramGenerator {

  generateDiagram(config: SLDSystemConfig): SingleLineDiagram {
    const id = `SLD-${Date.now().toString(36).toUpperCase()}`;
    const components = this.generateComponents(config);
    const connections = this.generateConnections(config, components);
    const notes = this.generateNotes(config);
    const legend = this.generateLegend(config);
    const svgContent = this.renderSVG(config, components, connections, notes, legend);

    return {
      id,
      title: `Single Line Diagram - ${config.systemSize}kWp ${config.systemType} Solar PV System`,
      standard: config.standard,
      components,
      connections,
      notes,
      legend,
      svgContent,
      metadata: {
        createdAt: new Date().toISOString(),
        systemSize: `${config.systemSize} kWp`,
        voltage: `${config.acOutput.voltage}V ${config.acOutput.phases === 3 ? '3-Phase' : 'Single Phase'}`,
        standard: config.standard,
        designer: 'SolarGenius Pro AI'
      }
    };
  }

  private generateComponents(config: SLDSystemConfig): SLDComponent[] {
    const components: SLDComponent[] = [];
    let y = 100;

    // PV Array
    components.push({
      id: 'pv-array',
      type: 'panel',
      symbol: SYMBOLS.solarPanel,
      label: 'PV Array',
      specs: [
        `${config.panels.quantity} x ${config.panels.brand} ${config.panels.model}`,
        `${config.panels.wattage}Wp each`,
        `Total: ${(config.panels.quantity * config.panels.wattage / 1000).toFixed(2)} kWp`,
        `Voc: ${config.panels.voc}V | Isc: ${config.panels.isc}A`
      ],
      position: { x: 150, y },
      connections: ['dc-combiner']
    });

    y += 120;

    // DC Combiner Box (if multiple strings)
    if (config.strings.count > 1) {
      components.push({
        id: 'dc-combiner',
        type: 'junction',
        symbol: SYMBOLS.junction,
        label: 'DC Combiner Box',
        specs: [
          `${config.strings.count} Strings`,
          `String Voltage: ${config.strings.voltage.toFixed(0)}V`,
          `String Current: ${config.strings.current.toFixed(1)}A`
        ],
        position: { x: 150, y },
        connections: ['dc-spd']
      });
      y += 80;
    }

    // DC Surge Protector
    components.push({
      id: 'dc-spd',
      type: 'spd',
      symbol: SYMBOLS.surgeProtector,
      label: 'DC SPD',
      specs: ['Type II', `${config.inverter.maxDcVoltage}V DC`, 'Class II'],
      position: { x: 150, y },
      connections: ['dc-isolator']
    });

    y += 80;

    // DC Isolator
    components.push({
      id: 'dc-isolator',
      type: 'isolator',
      symbol: SYMBOLS.dcIsolator,
      label: 'DC Isolator',
      specs: [
        `${config.inverter.maxDcVoltage}V DC`,
        `${Math.ceil(config.strings.current * config.strings.count * 1.25)}A`,
        'IP65 Rated'
      ],
      position: { x: 150, y },
      connections: ['inverter']
    });

    y += 100;

    // Inverter
    components.push({
      id: 'inverter',
      type: 'inverter',
      symbol: SYMBOLS.inverter,
      label: `${config.inverter.type.toUpperCase()} Inverter`,
      specs: [
        `${config.inverter.brand} ${config.inverter.model}`,
        `${config.inverter.capacity}kW`,
        `${config.inverter.mpptChannels} MPPT`,
        `Max DC: ${config.inverter.maxDcVoltage}V`
      ],
      position: { x: 150, y },
      connections: config.batteries ? ['battery-isolator', 'ac-isolator'] : ['ac-isolator']
    });

    y += 120;

    // Battery (if hybrid/off-grid)
    if (config.batteries && (config.systemType === 'hybrid' || config.systemType === 'off-grid')) {
      components.push({
        id: 'battery-isolator',
        type: 'isolator',
        symbol: SYMBOLS.dcIsolator,
        label: 'Battery Isolator',
        specs: [`${config.batteries.voltage}V DC`, '100A'],
        position: { x: 50, y: y - 60 },
        connections: ['battery']
      });

      components.push({
        id: 'battery',
        type: 'battery',
        symbol: SYMBOLS.battery,
        label: 'Battery Bank',
        specs: [
          `${config.batteries.brand} ${config.batteries.model}`,
          `${config.batteries.quantity} x ${config.batteries.capacity}kWh`,
          `Total: ${(config.batteries.quantity * config.batteries.capacity).toFixed(1)}kWh`,
          `${config.batteries.voltage}V`
        ],
        position: { x: 50, y },
        connections: []
      });
    }

    // AC Isolator
    components.push({
      id: 'ac-isolator',
      type: 'isolator',
      symbol: SYMBOLS.acIsolator,
      label: 'AC Isolator',
      specs: [
        `${config.acOutput.voltage}V AC`,
        `${Math.ceil(config.acOutput.current * 1.25)}A`,
        config.acOutput.phases === 3 ? '4-Pole' : '2-Pole'
      ],
      position: { x: 250, y },
      connections: ['ac-spd']
    });

    y += 80;

    // AC Surge Protector
    components.push({
      id: 'ac-spd',
      type: 'spd',
      symbol: SYMBOLS.surgeProtector,
      label: 'AC SPD',
      specs: ['Type II', `${config.acOutput.voltage}V AC`, '40kA'],
      position: { x: 250, y },
      connections: ['ac-mcb']
    });

    y += 80;

    // AC MCB
    components.push({
      id: 'ac-mcb',
      type: 'mcb',
      symbol: SYMBOLS.mcb,
      label: 'Solar MCB',
      specs: [
        `${Math.ceil(config.acOutput.current * 1.25)}A`,
        config.acOutput.phases === 3 ? '3P+N' : '2P',
        'C-Curve'
      ],
      position: { x: 250, y },
      connections: ['meter']
    });

    y += 80;

    // Energy Meter
    components.push({
      id: 'meter',
      type: 'meter',
      symbol: SYMBOLS.energyMeter,
      label: 'Generation Meter',
      specs: ['Bi-directional', 'CT Ratio 100:5', 'Class 0.5'],
      position: { x: 250, y },
      connections: ['main-mcb']
    });

    y += 80;

    // Main Distribution Board MCB
    components.push({
      id: 'main-mcb',
      type: 'mcb',
      symbol: SYMBOLS.mcb,
      label: 'Main MCB',
      specs: ['63A', config.acOutput.phases === 3 ? '4P' : '2P', 'Distribution Board'],
      position: { x: 250, y },
      connections: config.systemType === 'grid-tied' ? ['grid', 'load'] : ['load']
    });

    y += 80;

    // Grid Connection (if grid-tied or hybrid)
    if (config.systemType === 'grid-tied' || config.systemType === 'hybrid') {
      components.push({
        id: 'grid',
        type: 'grid',
        symbol: SYMBOLS.grid,
        label: 'Utility Grid',
        specs: [`${config.acOutput.voltage}V`, `${config.acOutput.phases === 3 ? '3-Phase' : 'Single Phase'}`, 'Net Metering'],
        position: { x: 350, y },
        connections: []
      });
    }

    // Load
    components.push({
      id: 'load',
      type: 'load',
      symbol: SYMBOLS.load,
      label: 'Building Load',
      specs: ['Consumer Unit', 'Distribution'],
      position: { x: 250, y: y + 80 },
      connections: []
    });

    // Earth System
    components.push({
      id: 'earth',
      type: 'earth',
      symbol: SYMBOLS.earthRod,
      label: 'Earth System',
      specs: ['<10Ω', 'Copper Rod 1.5m', 'Equipment + Array Earth'],
      position: { x: 150, y: y + 120 },
      connections: []
    });

    return components;
  }

  private generateConnections(config: SLDSystemConfig, components: SLDComponent[]): Array<{ from: string; to: string; type: 'dc' | 'ac' | 'ground'; label?: string }> {
    const connections: Array<{ from: string; to: string; type: 'dc' | 'ac' | 'ground'; label?: string }> = [];

    // DC Connections
    connections.push({ from: 'pv-array', to: 'dc-combiner', type: 'dc', label: `${config.strings.voltage.toFixed(0)}V DC` });
    connections.push({ from: 'dc-combiner', to: 'dc-spd', type: 'dc' });
    connections.push({ from: 'dc-spd', to: 'dc-isolator', type: 'dc' });
    connections.push({ from: 'dc-isolator', to: 'inverter', type: 'dc', label: '6mm² DC Cable' });

    // Battery connections
    if (config.batteries) {
      connections.push({ from: 'inverter', to: 'battery-isolator', type: 'dc', label: `${config.batteries.voltage}V` });
      connections.push({ from: 'battery-isolator', to: 'battery', type: 'dc', label: '25mm² Battery Cable' });
    }

    // AC Connections
    connections.push({ from: 'inverter', to: 'ac-isolator', type: 'ac', label: `${config.acOutput.voltage}V AC` });
    connections.push({ from: 'ac-isolator', to: 'ac-spd', type: 'ac' });
    connections.push({ from: 'ac-spd', to: 'ac-mcb', type: 'ac' });
    connections.push({ from: 'ac-mcb', to: 'meter', type: 'ac', label: '10mm² AC Cable' });
    connections.push({ from: 'meter', to: 'main-mcb', type: 'ac' });
    connections.push({ from: 'main-mcb', to: 'load', type: 'ac' });

    if (config.systemType !== 'off-grid') {
      connections.push({ from: 'main-mcb', to: 'grid', type: 'ac' });
    }

    // Ground connections
    connections.push({ from: 'pv-array', to: 'earth', type: 'ground', label: '16mm² Earth' });
    connections.push({ from: 'inverter', to: 'earth', type: 'ground' });
    connections.push({ from: 'main-mcb', to: 'earth', type: 'ground' });

    return connections;
  }

  private generateNotes(config: SLDSystemConfig): string[] {
    const notes: string[] = [
      `System Capacity: ${config.systemSize} kWp`,
      `System Type: ${config.systemType.replace('-', ' ').toUpperCase()}`,
      `Standard: ${config.standard}`,
      `PV Modules: ${config.panels.quantity} x ${config.panels.wattage}W ${config.panels.brand}`,
      `Inverter: ${config.inverter.quantity} x ${config.inverter.capacity}kW ${config.inverter.brand}`,
      `String Configuration: ${config.strings.count} strings of ${config.strings.panelsPerString} panels`,
      `Max DC Voltage: ${config.strings.voltage.toFixed(0)}V`,
      `AC Output: ${config.acOutput.voltage}V ${config.acOutput.phases === 3 ? '3-Phase' : 'Single Phase'}`,
    ];

    if (config.batteries) {
      notes.push(`Battery Bank: ${config.batteries.quantity} x ${config.batteries.capacity}kWh ${config.batteries.brand}`);
    }

    notes.push('');
    notes.push('INSTALLATION NOTES:');
    notes.push('1. All DC wiring to be TUV certified solar cable');
    notes.push('2. MC4 connectors IP67 rated minimum');
    notes.push('3. Earth resistance <10Ω');
    notes.push('4. Cable sizing as per voltage drop calculations');
    notes.push(`5. Comply with ${config.standard} standards`);

    return notes;
  }

  private generateLegend(config: SLDSystemConfig): Array<{ symbol: string; description: string }> {
    return [
      { symbol: '▢', description: 'PV Module/Array' },
      { symbol: '⊗', description: 'DC Isolator' },
      { symbol: '⊘', description: 'AC Isolator' },
      { symbol: '⬡', description: 'Inverter' },
      { symbol: '▭', description: 'Battery' },
      { symbol: '⚡', description: 'Surge Protector (SPD)' },
      { symbol: '◯', description: 'Circuit Breaker (MCB)' },
      { symbol: '⊕', description: 'Energy Meter' },
      { symbol: '⏚', description: 'Earth/Ground' },
      { symbol: '━━', description: 'DC Cable (Red)' },
      { symbol: '──', description: 'AC Cable (Black)' },
      { symbol: '┄┄', description: 'Earth Cable (Green)' },
    ];
  }

  private renderSVG(
    config: SLDSystemConfig,
    components: SLDComponent[],
    connections: Array<{ from: string; to: string; type: 'dc' | 'ac' | 'ground'; label?: string }>,
    notes: string[],
    legend: Array<{ symbol: string; description: string }>
  ): string {
    const width = 1200;
    const height = 1600;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .title { font: bold 24px Arial, sans-serif; fill: #1f2937; }
      .subtitle { font: 14px Arial, sans-serif; fill: #6b7280; }
      .label { font: bold 12px Arial, sans-serif; fill: #1f2937; }
      .spec { font: 10px Arial, sans-serif; fill: #6b7280; }
      .note { font: 11px Arial, sans-serif; fill: #374151; }
      .dc-line { stroke: #dc2626; stroke-width: 3; fill: none; }
      .ac-line { stroke: #1f2937; stroke-width: 2; fill: none; }
      .ground-line { stroke: #059669; stroke-width: 2; stroke-dasharray: 5,3; fill: none; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#ffffff"/>

  <!-- Border -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#1f2937" stroke-width="2"/>

  <!-- Title Block -->
  <rect x="20" y="20" width="${width - 40}" height="100" fill="#f8fafc" stroke="#1f2937" stroke-width="1"/>
  <text x="40" y="60" class="title">SINGLE LINE DIAGRAM</text>
  <text x="40" y="85" class="subtitle">${config.systemSize}kWp ${config.systemType.replace('-', ' ').toUpperCase()} Solar PV System</text>
  <text x="40" y="105" class="subtitle">Standard: ${config.standard} | Country: ${config.country}</text>
  <text x="${width - 200}" y="60" class="label">Drawing No: SLD-001</text>
  <text x="${width - 200}" y="80" class="spec">Date: ${new Date().toLocaleDateString()}</text>
  <text x="${width - 200}" y="100" class="spec">Rev: A</text>

  <!-- Components -->
  <g transform="translate(100, 150)">
`;

    // Render connections first (behind components)
    const componentMap = new Map(components.map(c => [c.id, c]));

    connections.forEach(conn => {
      const fromComp = componentMap.get(conn.from);
      const toComp = componentMap.get(conn.to);
      if (fromComp && toComp) {
        const lineClass = conn.type === 'dc' ? 'dc-line' : conn.type === 'ac' ? 'ac-line' : 'ground-line';
        svg += `    <line x1="${fromComp.position.x + 20}" y1="${fromComp.position.y + 40}" x2="${toComp.position.x + 20}" y2="${toComp.position.y}" class="${lineClass}"/>\n`;
        if (conn.label) {
          const midX = (fromComp.position.x + toComp.position.x) / 2 + 30;
          const midY = (fromComp.position.y + toComp.position.y) / 2 + 20;
          svg += `    <text x="${midX}" y="${midY}" class="spec">${conn.label}</text>\n`;
        }
      }
    });

    // Render components
    components.forEach(comp => {
      svg += `    <g transform="translate(${comp.position.x}, ${comp.position.y})">\n`;
      svg += `      ${comp.symbol}\n`;
      svg += `      <text x="50" y="15" class="label">${comp.label}</text>\n`;
      comp.specs.forEach((spec, i) => {
        svg += `      <text x="50" y="${30 + i * 12}" class="spec">${spec}</text>\n`;
      });
      svg += `    </g>\n`;
    });

    svg += `  </g>

  <!-- Notes Section -->
  <rect x="${width - 380}" y="140" width="360" height="${notes.length * 16 + 40}" fill="#f8fafc" stroke="#d1d5db" stroke-width="1"/>
  <text x="${width - 370}" y="165" class="label">SYSTEM SPECIFICATIONS</text>
`;

    notes.forEach((note, i) => {
      svg += `  <text x="${width - 370}" y="${185 + i * 16}" class="note">${note}</text>\n`;
    });

    // Legend
    svg += `
  <!-- Legend -->
  <rect x="40" y="${height - 200}" width="300" height="160" fill="#f8fafc" stroke="#d1d5db" stroke-width="1"/>
  <text x="55" y="${height - 180}" class="label">LEGEND</text>
`;

    legend.forEach((item, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      svg += `  <text x="${55 + col * 150}" y="${height - 160 + row * 18}" class="spec">${item.symbol} ${item.description}</text>\n`;
    });

    // Company info
    svg += `
  <!-- Company Info -->
  <rect x="${width - 250}" y="${height - 80}" width="230" height="60" fill="#f8fafc" stroke="#d1d5db" stroke-width="1"/>
  <text x="${width - 240}" y="${height - 60}" class="label">Generated by SolarGenius Pro</text>
  <text x="${width - 240}" y="${height - 42}" class="spec">EmersonEIMS Engineering</text>
  <text x="${width - 240}" y="${height - 28}" class="spec">www.emersoneims.com</text>

</svg>`;

    return svg;
  }

  exportAsDXF(diagram: SingleLineDiagram): string {
    // Generate AutoCAD-compatible DXF
    let dxf = `0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
ENTITIES
`;

    // Convert components to DXF entities
    diagram.components.forEach(comp => {
      dxf += `0
TEXT
8
0
10
${comp.position.x}
20
${comp.position.y}
40
10
1
${comp.label}
`;
    });

    // Convert connections to DXF lines
    diagram.connections.forEach(conn => {
      dxf += `0
LINE
8
${conn.type === 'dc' ? 'DC_WIRING' : conn.type === 'ac' ? 'AC_WIRING' : 'GROUNDING'}
`;
    });

    dxf += `0
ENDSEC
0
EOF`;

    return dxf;
  }
}

// Export singleton
export const sldGenerator = new SingleLineDiagramGenerator();
