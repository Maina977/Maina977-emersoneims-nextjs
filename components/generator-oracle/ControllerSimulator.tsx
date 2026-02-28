'use client';

/**
 * ADVANCED CONTROLLER SIMULATOR - Generator Oracle
 * Unique Visual Interfaces Compatible with 10 Controller Types
 *
 * DISCLAIMER: This is an independently developed diagnostic tool.
 * NOT affiliated with or endorsed by any controller manufacturer.
 * All visual designs are unique creations inspired by industrial standards.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== CONTROLLER CONFIGURATIONS ====================
export const CONTROLLER_TYPES = {
  DSE: {
    id: 'DSE',
    name: 'Marine-Industrial Controller Interface',
    shortName: 'Type A',
    color: '#1a1a1a',
    accentColor: '#3B82F6',
    displayColor: '#2d5a27',
    textColor: '#000000',
    buttonColor: '#333333',
    models: [
      { id: 'dse-7320', name: 'Model 7320 Series', display: 'Graphic LCD 320x240' },
      { id: 'dse-7310', name: 'Model 7310 Series', display: 'Graphic LCD 240x128' },
      { id: 'dse-6020', name: 'Model 6020 Series', display: 'Character LCD 4x20' },
      { id: 'dse-6120', name: 'Model 6120 Series', display: 'Graphic LCD 128x64' },
      { id: 'dse-4520', name: 'Model 4520 Series', display: 'Character LCD 2x16' },
      { id: 'dse-8610', name: 'Model 8610 Series', display: 'Color TFT 4.3"' },
      { id: 'dse-8660', name: 'Model 8660 Series', display: 'Color TFT 7"' },
    ],
    displayType: 'lcd-green',
    buttonLayout: 'dse-style',
  },
  COMAP: {
    id: 'COMAP',
    name: 'Intelligent Genset Controller Interface',
    shortName: 'Type B',
    color: '#1a1a1a',
    accentColor: '#EF4444',
    displayColor: '#1a2332',
    textColor: '#00ff88',
    buttonColor: '#2d2d2d',
    models: [
      { id: 'comap-intelilite', name: 'InteliLite Series', display: 'Graphic LCD 128x64' },
      { id: 'comap-inteligen', name: 'InteliGen Series', display: 'Graphic LCD 240x128' },
      { id: 'comap-intelisys', name: 'InteliSys Series', display: 'Color TFT 4.3"' },
      { id: 'comap-intelimains', name: 'InteliMains Series', display: 'Color TFT 5"' },
    ],
    displayType: 'lcd-blue',
    buttonLayout: 'comap-style',
  },
  WOODWARD: {
    id: 'WOODWARD',
    name: 'Industrial Engine Controller Interface',
    shortName: 'Type C',
    color: '#1a1a1a',
    accentColor: '#22C55E',
    displayColor: '#0f1a0f',
    textColor: '#ffcc00',
    buttonColor: '#2a2a2a',
    models: [
      { id: 'woodward-easygen3000', name: 'easYgen 3000 Series', display: 'Graphic LCD 240x128' },
      { id: 'woodward-easygen2000', name: 'easYgen 2000 Series', display: 'Character LCD 4x20' },
      { id: 'woodward-dtsc200', name: 'DTSC-200 Series', display: 'Graphic LCD 128x64' },
    ],
    displayType: 'lcd-amber',
    buttonLayout: 'woodward-style',
  },
  SMARTGEN: {
    id: 'SMARTGEN',
    name: 'Smart Generation Controller Interface',
    shortName: 'Type D',
    color: '#1a1a1a',
    accentColor: '#8B5CF6',
    displayColor: '#0a1628',
    textColor: '#00ffcc',
    buttonColor: '#2d2d2d',
    models: [
      { id: 'smartgen-hgm6120', name: 'HGM6120 Series', display: 'Character LCD 4x20' },
      { id: 'smartgen-hgm7220', name: 'HGM7220 Series', display: 'Graphic LCD 128x64' },
      { id: 'smartgen-hgm9320', name: 'HGM9320 Series', display: 'Graphic LCD 240x128' },
      { id: 'smartgen-hgm9510', name: 'HGM9510 Series', display: 'Color TFT 4.3"' },
    ],
    displayType: 'lcd-cyan',
    buttonLayout: 'smartgen-style',
  },
  POWERWIZARD: {
    id: 'POWERWIZARD',
    name: 'Heavy Equipment Controller Interface',
    shortName: 'Type E',
    color: '#1a1a1a',
    accentColor: '#F59E0B',
    displayColor: '#1a1a0a',
    textColor: '#ffaa00',
    buttonColor: '#333300',
    models: [
      { id: 'powerwizard-10', name: 'PowerWizard 1.0', display: 'Character LCD 2x16' },
      { id: 'powerwizard-11', name: 'PowerWizard 1.1', display: 'Character LCD 4x20' },
      { id: 'powerwizard-20', name: 'PowerWizard 2.0', display: 'Graphic LCD 240x128' },
    ],
    displayType: 'lcd-yellow',
    buttonLayout: 'powerwizard-style',
  },
  DATAKOM: {
    id: 'DATAKOM',
    name: 'Digital Automation Controller Interface',
    shortName: 'Type F',
    color: '#1a1a1a',
    accentColor: '#22D3EE',
    displayColor: '#0a1a2a',
    textColor: '#00ccff',
    buttonColor: '#2a2a3a',
    models: [
      { id: 'datakom-d500', name: 'D-500 Series', display: 'Graphic LCD 128x64' },
      { id: 'datakom-d700', name: 'D-700 Series', display: 'Graphic LCD 240x128' },
      { id: 'datakom-dkg309', name: 'DKG-309 Series', display: 'Character LCD 4x20' },
    ],
    displayType: 'lcd-blue',
    buttonLayout: 'datakom-style',
  },
  LOVATO: {
    id: 'LOVATO',
    name: 'European Industrial Controller Interface',
    shortName: 'Type G',
    color: '#1a1a1a',
    accentColor: '#FB923C',
    displayColor: '#1a1510',
    textColor: '#ff8800',
    buttonColor: '#2d2520',
    models: [
      { id: 'lovato-rgk600', name: 'RGK600 Series', display: 'Graphic LCD 128x64' },
      { id: 'lovato-rgk800', name: 'RGK800 Series', display: 'Graphic LCD 240x128' },
    ],
    displayType: 'lcd-orange',
    buttonLayout: 'lovato-style',
  },
  SIEMENS: {
    id: 'SIEMENS',
    name: 'Industrial Automation Controller Interface',
    shortName: 'Type H',
    color: '#1a1a1a',
    accentColor: '#2DD4BF',
    displayColor: '#0a1a1a',
    textColor: '#00ffaa',
    buttonColor: '#1a2a2a',
    models: [
      { id: 'siemens-sicam', name: 'SICAM Series', display: 'Color TFT 5.7"' },
      { id: 'siemens-pac', name: 'PAC Series', display: 'Graphic LCD 240x128' },
    ],
    displayType: 'lcd-teal',
    buttonLayout: 'siemens-style',
  },
  ENKO: {
    id: 'ENKO',
    name: 'Compact Generator Controller Interface',
    shortName: 'Type I',
    color: '#1a1a1a',
    accentColor: '#C084FC',
    displayColor: '#1a0a2a',
    textColor: '#cc88ff',
    buttonColor: '#2a1a3a',
    models: [
      { id: 'enko-gcu100', name: 'GCU-100 Series', display: 'Character LCD 2x16' },
      { id: 'enko-gcu300', name: 'GCU-300 Series', display: 'Graphic LCD 128x64' },
    ],
    displayType: 'lcd-purple',
    buttonLayout: 'enko-style',
  },
  VODIA: {
    id: 'VODIA',
    name: 'Marine Diagnostic Controller Interface',
    shortName: 'Type J',
    color: '#1a1a1a',
    accentColor: '#60A5FA',
    displayColor: '#0a1525',
    textColor: '#6699ff',
    buttonColor: '#1a2535',
    models: [
      { id: 'vodia-5', name: 'VODIA5 Interface', display: 'Software Display' },
      { id: 'vodia-6', name: 'VODIA6 Interface', display: 'Software Display' },
    ],
    displayType: 'lcd-blue',
    buttonLayout: 'vodia-style',
  },
};

// ==================== SENSOR PARAMETERS ====================
export const SENSOR_PARAMETERS = {
  engineOilPressure: { name: 'Oil Pressure', unit: 'bar', min: 0, max: 10, normalMin: 2.0, normalMax: 6.0, warningLow: 1.5, warningHigh: 7.0, criticalLow: 1.0, criticalHigh: 8.0 },
  coolantTemperature: { name: 'Coolant Temp', unit: '°C', min: 0, max: 120, normalMin: 75, normalMax: 95, warningLow: 60, warningHigh: 100, criticalLow: 40, criticalHigh: 108 },
  oilTemperature: { name: 'Oil Temp', unit: '°C', min: 0, max: 150, normalMin: 70, normalMax: 110, warningLow: 50, warningHigh: 120, criticalLow: 30, criticalHigh: 130 },
  batteryVoltage: { name: 'Battery', unit: 'V', min: 0, max: 32, normalMin: 12.4, normalMax: 14.5, warningLow: 11.5, warningHigh: 15.0, criticalLow: 10.5, criticalHigh: 16.0 },
  chargerVoltage: { name: 'Charger', unit: 'V', min: 0, max: 32, normalMin: 13.5, normalMax: 14.5, warningLow: 12.5, warningHigh: 15.5, criticalLow: 11.0, criticalHigh: 16.5 },
  engineRPM: { name: 'Engine Speed', unit: 'RPM', min: 0, max: 2000, normalMin: 1480, normalMax: 1520, warningLow: 1450, warningHigh: 1550, criticalLow: 1400, criticalHigh: 1600 },
  generatorFrequency: { name: 'Frequency', unit: 'Hz', min: 0, max: 65, normalMin: 49.5, normalMax: 50.5, warningLow: 49.0, warningHigh: 51.0, criticalLow: 48.0, criticalHigh: 52.0 },
  voltageL1N: { name: 'V L1-N', unit: 'V', min: 0, max: 300, normalMin: 220, normalMax: 240, warningLow: 207, warningHigh: 253, criticalLow: 195, criticalHigh: 265 },
  voltageL2N: { name: 'V L2-N', unit: 'V', min: 0, max: 300, normalMin: 220, normalMax: 240, warningLow: 207, warningHigh: 253, criticalLow: 195, criticalHigh: 265 },
  voltageL3N: { name: 'V L3-N', unit: 'V', min: 0, max: 300, normalMin: 220, normalMax: 240, warningLow: 207, warningHigh: 253, criticalLow: 195, criticalHigh: 265 },
  voltageL1L2: { name: 'V L1-L2', unit: 'V', min: 0, max: 500, normalMin: 380, normalMax: 420, warningLow: 360, warningHigh: 440, criticalLow: 340, criticalHigh: 460 },
  voltageL2L3: { name: 'V L2-L3', unit: 'V', min: 0, max: 500, normalMin: 380, normalMax: 420, warningLow: 360, warningHigh: 440, criticalLow: 340, criticalHigh: 460 },
  voltageL3L1: { name: 'V L3-L1', unit: 'V', min: 0, max: 500, normalMin: 380, normalMax: 420, warningLow: 360, warningHigh: 440, criticalLow: 340, criticalHigh: 460 },
  currentL1: { name: 'I L1', unit: 'A', min: 0, max: 2000, normalMin: 0, normalMax: 1600, warningLow: 0, warningHigh: 1800, criticalLow: 0, criticalHigh: 2000 },
  currentL2: { name: 'I L2', unit: 'A', min: 0, max: 2000, normalMin: 0, normalMax: 1600, warningLow: 0, warningHigh: 1800, criticalLow: 0, criticalHigh: 2000 },
  currentL3: { name: 'I L3', unit: 'A', min: 0, max: 2000, normalMin: 0, normalMax: 1600, warningLow: 0, warningHigh: 1800, criticalLow: 0, criticalHigh: 2000 },
  activePowerKW: { name: 'Active Power', unit: 'kW', min: 0, max: 1000, normalMin: 0, normalMax: 800, warningLow: 0, warningHigh: 900, criticalLow: 0, criticalHigh: 1000 },
  reactivePowerKVAR: { name: 'Reactive', unit: 'kVAR', min: -500, max: 500, normalMin: -100, normalMax: 100, warningLow: -200, warningHigh: 200, criticalLow: -300, criticalHigh: 300 },
  apparentPowerKVA: { name: 'Apparent', unit: 'kVA', min: 0, max: 1000, normalMin: 0, normalMax: 800, warningLow: 0, warningHigh: 900, criticalLow: 0, criticalHigh: 1000 },
  powerFactor: { name: 'Power Factor', unit: '', min: 0, max: 1, normalMin: 0.85, normalMax: 1.0, warningLow: 0.80, warningHigh: 1.0, criticalLow: 0.70, criticalHigh: 1.0 },
  loadPercent: { name: 'Load', unit: '%', min: 0, max: 120, normalMin: 0, normalMax: 80, warningLow: 0, warningHigh: 95, criticalLow: 0, criticalHigh: 105 },
  fuelLevel: { name: 'Fuel Level', unit: '%', min: 0, max: 100, normalMin: 25, normalMax: 100, warningLow: 15, warningHigh: 100, criticalLow: 10, criticalHigh: 100 },
  fuelPressure: { name: 'Fuel Pressure', unit: 'bar', min: 0, max: 10, normalMin: 2.5, normalMax: 4.5, warningLow: 2.0, warningHigh: 5.0, criticalLow: 1.5, criticalHigh: 5.5 },
  boostPressure: { name: 'Boost', unit: 'bar', min: 0, max: 4, normalMin: 0.8, normalMax: 2.5, warningLow: 0.5, warningHigh: 3.0, criticalLow: 0.3, criticalHigh: 3.5 },
  exhaustTemperature: { name: 'Exhaust Temp', unit: '°C', min: 0, max: 800, normalMin: 350, normalMax: 550, warningLow: 250, warningHigh: 620, criticalLow: 200, criticalHigh: 700 },
  intakeAirTemp: { name: 'Intake Air', unit: '°C', min: -20, max: 80, normalMin: 20, normalMax: 50, warningLow: 10, warningHigh: 60, criticalLow: 0, criticalHigh: 70 },
  engineHours: { name: 'Run Hours', unit: 'h', min: 0, max: 100000, normalMin: 0, normalMax: 100000, warningLow: 0, warningHigh: 100000, criticalLow: 0, criticalHigh: 100000 },
  mainsVoltage: { name: 'Mains V', unit: 'V', min: 0, max: 500, normalMin: 380, normalMax: 420, warningLow: 350, warningHigh: 450, criticalLow: 320, criticalHigh: 480 },
  mainsFrequency: { name: 'Mains Hz', unit: 'Hz', min: 0, max: 65, normalMin: 49.5, normalMax: 50.5, warningLow: 48.5, warningHigh: 51.5, criticalLow: 47.0, criticalHigh: 53.0 },
};

// ==================== COMPREHENSIVE DATASHEETS ====================
// ==================== COMPREHENSIVE WIRING DIAGRAMS ====================
interface WiringTerminal {
  terminal: string;
  label: string;
  function: string;
  wireColor: string;
  wireGauge: string;
  connectTo: string;
  notes: string;
}

interface WiringSection {
  section: string;
  description: string;
  terminals: WiringTerminal[];
}

interface WiringDiagram {
  modelId: string;
  modelName: string;
  overview: string;
  safetyWarnings: string[];
  powerRequirements: {
    voltage: string;
    current: string;
    fusing: string;
    grounding: string;
  };
  sections: WiringSection[];
  schematicNotes: string[];
  installationTips: string[];
}

const WIRING_DIAGRAMS: Record<string, WiringDiagram> = {
  'dse-7320': {
    modelId: 'dse-7320',
    modelName: 'Model 7320 Series Controller',
    overview: 'Complete terminal-by-terminal wiring reference for the Model 7320 automatic mains failure controller. This diagram covers power connections, engine interface, generator monitoring, mains sensing, communication ports, and auxiliary I/O. Follow all connections precisely to ensure proper operation and protection functionality.',
    safetyWarnings: [
      'DISCONNECT ALL POWER SOURCES before making any wiring connections',
      'Verify battery polarity before connection - reverse polarity will damage the unit',
      'Ensure all high-voltage connections are made by qualified electricians',
      'Use appropriate wire gauges as specified - undersized wiring causes overheating',
      'All CT secondary circuits must be properly shorted when CTs are energized',
      'Generator and mains voltage sensing requires isolation via fuses or MCBs'
    ],
    powerRequirements: {
      voltage: '8-35V DC continuous operation (12V or 24V battery systems)',
      current: 'Maximum 3A continuous, 8A peak during cranking relay operation',
      fusing: '10A blade fuse on positive supply recommended',
      grounding: 'Connect terminal GND to clean chassis ground with minimum 4mm² wire'
    },
    sections: [
      {
        section: 'DC Power Supply',
        description: 'Battery and charging system connections. The controller requires clean DC power from the generator starting battery.',
        terminals: [
          { terminal: 'B+', label: 'Battery Positive', function: 'Main DC power input from starting battery positive terminal', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery positive via 10A fuse', notes: 'Maximum cable length 3m without voltage drop compensation' },
          { terminal: 'B-', label: 'Battery Negative', function: 'DC power return and system ground reference', wireColor: 'BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery negative terminal', notes: 'Connect as close to battery as possible' },
          { terminal: 'GND', label: 'Chassis Ground', function: 'Shield and chassis grounding point', wireColor: 'GREEN/YELLOW', wireGauge: '4mm² / 12 AWG', connectTo: 'Generator frame/chassis', notes: 'Essential for EMI protection and safety' },
          { terminal: 'CHG', label: 'Charge Input', function: 'Auxiliary charger sense input for battery monitoring', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Battery charger output or alternator D+', notes: 'Used for charge fail detection alarm' }
        ]
      },
      {
        section: 'Engine Control',
        description: 'Connections for engine starting, stopping, and fuel control systems.',
        terminals: [
          { terminal: 'CRANK', label: 'Starter Motor', function: 'Output relay for starter motor engagement', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid trigger terminal', notes: 'Relay rated 16A - use auxiliary relay for high-current starters' },
          { terminal: 'FUEL', label: 'Fuel Solenoid', function: 'Output for fuel solenoid or electronic injection enable', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid coil positive', notes: 'Energized during run mode, de-energized to stop engine' },
          { terminal: 'PREHEAT', label: 'Glow Plugs', function: 'Output for glow plug relay or intake heater', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Glow plug relay coil', notes: 'Timed output - duration configurable 0-120 seconds' },
          { terminal: 'GOV+', label: 'Governor Up', function: 'Electronic governor speed increase signal', wireColor: 'PINK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Electronic governor increase input', notes: 'PWM output for proportional speed control' },
          { terminal: 'GOV-', label: 'Governor Down', function: 'Electronic governor speed decrease signal', wireColor: 'GREY', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Electronic governor decrease input', notes: 'Used with GOV+ for precise speed regulation' }
        ]
      },
      {
        section: 'Engine Sensors',
        description: 'Analog and digital sensor inputs for engine monitoring and protection.',
        terminals: [
          { terminal: 'W', label: 'Magnetic Pickup', function: 'Engine speed sensing from magnetic pickup sensor', wireColor: 'WHITE/BLUE', wireGauge: '1.0mm² / 18 AWG shielded', connectTo: 'Magnetic pickup signal (ring gear or flywheel)', notes: 'Use twisted pair shielded cable, shield to GND at controller only' },
          { terminal: 'MPU-', label: 'MPU Ground', function: 'Magnetic pickup signal return', wireColor: 'WHITE/BLACK', wireGauge: '1.0mm² / 18 AWG shielded', connectTo: 'Magnetic pickup ground wire', notes: 'Do not connect to chassis - use dedicated return' },
          { terminal: 'OIL P', label: 'Oil Pressure', function: 'Analog input for oil pressure sender', wireColor: 'BROWN/WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'VDO-type oil pressure sender signal', notes: 'Configure sender type in settings (0-10 bar range typical)' },
          { terminal: 'COOL T', label: 'Coolant Temp', function: 'Analog input for coolant temperature sender', wireColor: 'GREEN/WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'NTC thermistor temperature sender', notes: 'Typical range -40°C to +150°C, 40-4700Ω resistance' },
          { terminal: 'OIL T', label: 'Oil Temperature', function: 'Analog input for engine oil temperature', wireColor: 'BROWN/BLUE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil temperature sender (NTC type)', notes: 'Optional - for enhanced engine protection' },
          { terminal: 'FUEL L', label: 'Fuel Level', function: 'Analog input for fuel tank level sender', wireColor: 'YELLOW/BLACK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Resistive fuel level sender', notes: 'Configure 0-90Ω or 240-33Ω range to match sender' }
        ]
      },
      {
        section: 'Generator Voltage Sensing',
        description: 'Three-phase voltage measurement connections for generator output monitoring.',
        terminals: [
          { terminal: 'GEN L1', label: 'Generator Phase A', function: 'Generator phase A (L1) voltage sensing', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator output L1 via 2A fuse', notes: 'CAUTION: Live voltage - fuse protection mandatory' },
          { terminal: 'GEN L2', label: 'Generator Phase B', function: 'Generator phase B (L2) voltage sensing', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator output L2 via 2A fuse', notes: 'For single-phase: leave unconnected' },
          { terminal: 'GEN L3', label: 'Generator Phase C', function: 'Generator phase C (L3) voltage sensing', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator output L3 via 2A fuse', notes: 'For single-phase: leave unconnected' },
          { terminal: 'GEN N', label: 'Generator Neutral', function: 'Generator neutral reference point', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator star point neutral', notes: 'Essential for phase-to-neutral measurements' }
        ]
      },
      {
        section: 'Generator Current Transformers',
        description: 'Current transformer connections for power metering and protection.',
        terminals: [
          { terminal: 'CT1 S1', label: 'CT1 Input', function: 'Phase A current transformer secondary input', wireColor: 'RED/WHITE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 secondary S1 terminal', notes: 'CT ratio configurable: 50/5A to 5000/5A typical' },
          { terminal: 'CT1 S2', label: 'CT1 Return', function: 'Phase A current transformer secondary return', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 secondary S2 terminal', notes: 'Short-circuit CTs when disconnecting for safety' },
          { terminal: 'CT2 S1', label: 'CT2 Input', function: 'Phase B current transformer secondary input', wireColor: 'YELLOW/WHITE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 secondary S1 terminal', notes: 'Ensure correct phase sequence A-B-C' },
          { terminal: 'CT2 S2', label: 'CT2 Return', function: 'Phase B current transformer secondary return', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 secondary S2 terminal', notes: 'Use 5A secondary CTs for accuracy' },
          { terminal: 'CT3 S1', label: 'CT3 Input', function: 'Phase C current transformer secondary input', wireColor: 'BLUE/WHITE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 secondary S1 terminal', notes: 'Window CTs easier to install in tight spaces' },
          { terminal: 'CT3 S2', label: 'CT3 Return', function: 'Phase C current transformer secondary return', wireColor: 'BLUE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 secondary S2 terminal', notes: 'Class 1 accuracy CTs recommended for metering' }
        ]
      },
      {
        section: 'Mains Voltage Sensing',
        description: 'Utility/mains supply voltage monitoring for automatic transfer switching.',
        terminals: [
          { terminal: 'MAINS L1', label: 'Mains Phase A', function: 'Utility supply phase A voltage sensing', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains supply L1 via 2A fuse and MCB', notes: 'Install upstream of mains circuit breaker for fail detection' },
          { terminal: 'MAINS L2', label: 'Mains Phase B', function: 'Utility supply phase B voltage sensing', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains supply L2 via 2A fuse and MCB', notes: 'Three-phase mains: connect all three phases' },
          { terminal: 'MAINS L3', label: 'Mains Phase C', function: 'Utility supply phase C voltage sensing', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains supply L3 via 2A fuse and MCB', notes: 'Phase rotation monitoring enabled when all connected' },
          { terminal: 'MAINS N', label: 'Mains Neutral', function: 'Utility neutral reference', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains supply neutral', notes: 'Required for phase-neutral voltage measurement' }
        ]
      },
      {
        section: 'Transfer Switch Control',
        description: 'Automatic transfer switch (ATS) contactor control outputs.',
        terminals: [
          { terminal: 'MC MAINS', label: 'Mains Contactor', function: 'Output relay for mains/utility contactor coil', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Mains contactor coil (via interposing relay if needed)', notes: 'Interlocked with generator contactor - break-before-make operation' },
          { terminal: 'MC GEN', label: 'Generator Contactor', function: 'Output relay for generator contactor coil', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Generator contactor coil', notes: 'Transfer delay configurable 0-600 seconds' },
          { terminal: 'ATS FB', label: 'ATS Position Feedback', function: 'Digital input for ATS position confirmation', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'ATS auxiliary contact (mains position)', notes: 'Detects transfer failure condition' }
        ]
      },
      {
        section: 'Digital Inputs',
        description: 'Configurable digital inputs for external signals and protection.',
        terminals: [
          { terminal: 'DI1', label: 'Digital Input 1', function: 'Emergency stop input (default)', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Emergency stop button (normally closed)', notes: 'Configure as NC for fail-safe operation' },
          { terminal: 'DI2', label: 'Digital Input 2', function: 'Remote start command (default)', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Remote start switch or BMS signal', notes: 'Can be configured for other functions' },
          { terminal: 'DI3', label: 'Digital Input 3', function: 'High coolant temperature switch', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'High temp switch (normally open)', notes: 'Backup protection - opens on high temp' },
          { terminal: 'DI4', label: 'Digital Input 4', function: 'Low oil pressure switch', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Low oil pressure switch (normally closed)', notes: 'Opens when oil pressure is adequate' },
          { terminal: 'DI5', label: 'Digital Input 5', function: 'Low fuel level switch', wireColor: 'ORANGE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Fuel tank low level float switch', notes: 'Warning or shutdown - configurable' },
          { terminal: 'DI6', label: 'Digital Input 6', function: 'Auxiliary/spare input', wireColor: 'BLUE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User-configurable (door switch, etc.)', notes: 'Program function in controller settings' },
          { terminal: 'DI7', label: 'Digital Input 7', function: 'Air filter restriction switch', wireColor: 'PINK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Air filter differential pressure switch', notes: 'Service indicator function' },
          { terminal: 'DI8', label: 'Digital Input 8', function: 'Battery charger fail signal', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Battery charger fault relay', notes: 'Configurable alarm delay' }
        ]
      },
      {
        section: 'Relay Outputs',
        description: 'Configurable relay outputs for alarms, status indication, and control.',
        terminals: [
          { terminal: 'RO1 NO', label: 'Relay 1 NO', function: 'Common alarm output (normally open contact)', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'External alarm panel or BMS', notes: 'Rated 16A resistive / 8A inductive' },
          { terminal: 'RO1 NC', label: 'Relay 1 NC', function: 'Relay 1 normally closed contact', wireColor: 'RED/WHITE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fail-safe alarm circuits', notes: 'Opens on any controller alarm' },
          { terminal: 'RO1 COM', label: 'Relay 1 Common', function: 'Relay 1 common terminal', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm circuit common', notes: 'Changeover contact available' },
          { terminal: 'RO2 NO', label: 'Relay 2 NO', function: 'Running status output', wireColor: 'GREEN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Run status lamp or BMS', notes: 'Closed when engine running confirmed' },
          { terminal: 'RO3 NO', label: 'Relay 3 NO', function: 'Warning alarm output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Warning indicator lamp', notes: 'Non-critical alarms only' },
          { terminal: 'RO4 NO', label: 'Relay 4 NO', function: 'Shutdown alarm output', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Shutdown alarm indicator', notes: 'Engine shutdown required conditions' },
          { terminal: 'RO5 NO', label: 'Relay 5 NO', function: 'Load on generator output', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Load status indication', notes: 'Closed when load transferred to generator' },
          { terminal: 'RO6 NO', label: 'Relay 6 NO', function: 'Auxiliary output (spare)', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'User-configurable function', notes: 'Program in controller settings' }
        ]
      },
      {
        section: 'Communication Ports',
        description: 'Serial communication and network interface connections.',
        terminals: [
          { terminal: 'RS232 TX', label: 'RS232 Transmit', function: 'Serial data output to PC or modem', wireColor: 'WHITE', wireGauge: '0.5mm² / 22 AWG shielded', connectTo: 'PC COM port RX (pin 2 on DB9)', notes: 'Use shielded cable, max length 15m' },
          { terminal: 'RS232 RX', label: 'RS232 Receive', function: 'Serial data input from PC or modem', wireColor: 'GREEN', wireGauge: '0.5mm² / 22 AWG shielded', connectTo: 'PC COM port TX (pin 3 on DB9)', notes: 'Baud rate configurable 2400-115200' },
          { terminal: 'RS232 GND', label: 'RS232 Ground', function: 'Serial port signal ground', wireColor: 'BLACK', wireGauge: '0.5mm² / 22 AWG shielded', connectTo: 'PC COM port GND (pin 5 on DB9)', notes: 'Shield connects at controller end only' },
          { terminal: 'RS485 A', label: 'RS485 Data+', function: 'MODBUS RS485 non-inverting data line', wireColor: 'BLUE', wireGauge: '0.5mm² / 22 AWG twisted pair', connectTo: 'MODBUS master terminal A (+)', notes: 'Use 120Ω termination at both ends of bus' },
          { terminal: 'RS485 B', label: 'RS485 Data-', function: 'MODBUS RS485 inverting data line', wireColor: 'YELLOW', wireGauge: '0.5mm² / 22 AWG twisted pair', connectTo: 'MODBUS master terminal B (-)', notes: 'Maximum bus length 1200m at 9600 baud' },
          { terminal: 'RS485 GND', label: 'RS485 Ground', function: 'RS485 signal reference ground', wireColor: 'BLACK', wireGauge: '0.5mm² / 22 AWG', connectTo: 'MODBUS common ground', notes: 'Required for reliable communication' },
          { terminal: 'CAN H', label: 'CAN High', function: 'J1939 CAN bus high signal', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG twisted pair', connectTo: 'ECM CAN H terminal', notes: 'Use CAN-rated cable, 250kbps default' },
          { terminal: 'CAN L', label: 'CAN Low', function: 'J1939 CAN bus low signal', wireColor: 'GREEN', wireGauge: '0.75mm² / 20 AWG twisted pair', connectTo: 'ECM CAN L terminal', notes: '120Ω termination at each end of bus' }
        ]
      }
    ],
    schematicNotes: [
      'All wire colors follow IEC 60446 standard coding where applicable',
      'Use crimped ring terminals for all screw terminal connections',
      'Maintain minimum 50mm separation between signal and power cables',
      'Route communication cables away from high-current starter and fuel solenoid wiring',
      'Install transient suppression diodes across all inductive loads (contactors, solenoids)',
      'CT secondaries must never be open-circuited when primary current is flowing',
      'Voltage sensing circuits require fuse protection - 2A HRC fuses recommended',
      'Emergency stop circuit must be fail-safe (normally closed)',
      'Battery connections must be tight and corrosion-free - check annually'
    ],
    installationTips: [
      'Label all wires clearly at both ends with terminal designations',
      'Use ferrules on stranded wire ends to prevent fraying',
      'Dress cables neatly using cable ties to allow access for troubleshooting',
      'Install controller away from extreme heat, vibration, and moisture sources',
      'Provide adequate ventilation - controller may dissipate up to 30W as heat',
      'Document any variations from standard wiring in installation records',
      'Test all protection functions after installation before handover',
      'Commission CAN J1939 link before attempting ECM communication'
    ]
  },
  'comap-inteligen': {
    modelId: 'comap-inteligen',
    modelName: 'InteliGen Series Controller',
    overview: 'Advanced parallel generation controller wiring guide. The InteliGen series supports complex multi-generator installations with load sharing, synchronization, and intelligent power management. This wiring diagram covers all connections for standalone and parallel operation modes.',
    safetyWarnings: [
      'This controller manages high-power systems - work must be performed by qualified personnel',
      'Synchronization circuits carry lethal voltages - isolate completely before work',
      'Incorrect parallel wiring can cause catastrophic generator damage',
      'Load sharing communication failure can cause generator overload and fire',
      'Verify synchronization waveforms before first parallel operation',
      'Test all protection relay functions with simulated faults'
    ],
    powerRequirements: {
      voltage: '8-36V DC (nominal 12V or 24V systems)',
      current: '4A continuous maximum, 12A peak',
      fusing: '15A automotive blade fuse with inline holder',
      grounding: 'Dedicated ground bus with 6mm² minimum connection'
    },
    sections: [
      {
        section: 'Power Supply',
        description: 'DC power connections for controller operation.',
        terminals: [
          { terminal: 'X1:1', label: 'Power +ve', function: 'Positive DC supply input', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery positive post via fuse', notes: '15A fuse required - mount within 200mm of battery' },
          { terminal: 'X1:2', label: 'Power -ve', function: 'Negative DC supply / ground', wireColor: 'BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery negative post direct', notes: 'Do not share with other equipment grounds' },
          { terminal: 'X1:3', label: 'Shield', function: 'Cable shield termination point', wireColor: 'BARE', wireGauge: '4mm² / 12 AWG', connectTo: 'Central grounding point', notes: 'Terminate all cable shields here' }
        ]
      },
      {
        section: 'Engine Start/Stop',
        description: 'Engine cranking, fuel, and stop solenoid control connections.',
        terminals: [
          { terminal: 'X2:1', label: 'Start Signal', function: 'Starter motor solenoid drive', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid S terminal', notes: 'Use auxiliary relay for starters over 200A' },
          { terminal: 'X2:2', label: 'Fuel Run', function: 'Fuel injection enable / run solenoid', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid positive', notes: 'Energized = engine run, de-energized = shutdown' },
          { terminal: 'X2:3', label: 'Stop Coil', function: 'Stop solenoid drive (spring return type)', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Stop solenoid coil (if fitted)', notes: 'For engines with separate stop mechanism' },
          { terminal: 'X2:4', label: 'Preheat', function: 'Glow plug relay or grid heater', wireColor: 'PINK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Glow plug relay coil', notes: 'Timer-controlled preheat before cranking' },
          { terminal: 'X2:5', label: 'Start Feedback', function: 'Starter engaged confirmation', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Starter solenoid auxiliary contact', notes: 'For crank engage/disengage monitoring' }
        ]
      },
      {
        section: 'Speed Sensing',
        description: 'Engine speed measurement inputs for RPM and frequency calculation.',
        terminals: [
          { terminal: 'X3:1', label: 'MPU Signal', function: 'Magnetic pickup sensor signal input', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG shielded', connectTo: 'Flywheel magnetic pickup + terminal', notes: 'Shield to X3:3 only - not at sensor end' },
          { terminal: 'X3:2', label: 'MPU Return', function: 'Magnetic pickup return path', wireColor: 'BLACK', wireGauge: '1.0mm² / 18 AWG shielded', connectTo: 'Flywheel magnetic pickup - terminal', notes: 'Isolated return - not to engine block' },
          { terminal: 'X3:3', label: 'MPU Shield', function: 'Sensor cable shield termination', wireColor: 'BARE', wireGauge: 'N/A', connectTo: 'Cable shield only', notes: 'Single-point grounding at controller' },
          { terminal: 'X3:4', label: 'Aux Speed', function: 'Secondary speed input (redundancy)', wireColor: 'GREY', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Secondary speed sensor if fitted', notes: 'For critical applications - auto switchover' }
        ]
      },
      {
        section: 'Engine Sensors',
        description: 'Analog sensor connections for engine monitoring.',
        terminals: [
          { terminal: 'X4:1', label: 'Oil Pressure', function: 'Oil pressure sender input', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'VDO-compatible oil pressure sender', notes: 'Configure 0-5bar, 0-10bar, or 4-20mA' },
          { terminal: 'X4:2', label: 'Water Temp', function: 'Coolant temperature sensor', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'NTC thermistor coolant sensor', notes: 'Default curve 40Ω hot, 4700Ω cold' },
          { terminal: 'X4:3', label: 'Oil Temp', function: 'Engine oil temperature sensor', wireColor: 'BROWN/WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil temperature NTC sensor', notes: 'Optional enhanced monitoring' },
          { terminal: 'X4:4', label: 'Fuel Level', function: 'Tank fuel level indication', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Resistive float gauge sender', notes: 'Configurable 0-90Ω or 240-33Ω' },
          { terminal: 'X4:5', label: 'Sensor GND', function: 'Common sensor ground reference', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'All sensor ground terminals', notes: 'Do not use engine block as ground return' },
          { terminal: 'X4:6', label: 'Sensor +5V', function: 'Sensor excitation supply output', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Ratiometric sensors requiring 5V', notes: 'Protected output - 100mA maximum' }
        ]
      },
      {
        section: 'Generator Voltage Monitoring',
        description: 'Three-phase generator output voltage sensing connections.',
        terminals: [
          { terminal: 'X5:1', label: 'Gen L1', function: 'Generator phase A voltage', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator output L1 via 2A HRC fuse', notes: 'Voltage input range: 15-333V phase-neutral' },
          { terminal: 'X5:2', label: 'Gen L2', function: 'Generator phase B voltage', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator output L2 via 2A HRC fuse', notes: 'Phase sequence L1-L2-L3 critical' },
          { terminal: 'X5:3', label: 'Gen L3', function: 'Generator phase C voltage', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator output L3 via 2A HRC fuse', notes: 'Anti-clockwise rotation requires rewiring' },
          { terminal: 'X5:4', label: 'Gen N', function: 'Generator neutral reference', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator star-point neutral', notes: 'Essential for phase-neutral measurement' }
        ]
      },
      {
        section: 'Generator Current Measurement',
        description: 'CT secondary connections for kW, kVAr, and protection functions.',
        terminals: [
          { terminal: 'X6:1', label: 'CT1 S1', function: 'Phase A CT secondary positive', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 secondary S1 (polarity marked)', notes: 'Window CT or split-core acceptable' },
          { terminal: 'X6:2', label: 'CT1 S2', function: 'Phase A CT secondary negative', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 secondary S2 terminal', notes: 'Jumper to X6:3 for correct phase sequence' },
          { terminal: 'X6:3', label: 'CT2 S1', function: 'Phase B CT secondary positive', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 secondary S1 terminal', notes: 'Verify current direction with kW reading' },
          { terminal: 'X6:4', label: 'CT2 S2', function: 'Phase B CT secondary negative', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 secondary S2 terminal', notes: 'Negative kW = CT reversed - swap S1/S2' },
          { terminal: 'X6:5', label: 'CT3 S1', function: 'Phase C CT secondary positive', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 secondary S1 terminal', notes: '5A secondary CTs standard' },
          { terminal: 'X6:6', label: 'CT3 S2', function: 'Phase C CT secondary negative', wireColor: 'BLUE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 secondary S2 terminal / common', notes: 'Short-circuit when disconnecting live CT' }
        ]
      },
      {
        section: 'Mains/Utility Monitoring',
        description: 'Utility supply voltage sensing for AMF operation.',
        terminals: [
          { terminal: 'X7:1', label: 'Mains L1', function: 'Utility phase A voltage', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains incomer L1 via 2A fuse', notes: 'Sense upstream of mains breaker' },
          { terminal: 'X7:2', label: 'Mains L2', function: 'Utility phase B voltage', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains incomer L2 via 2A fuse', notes: 'Phase fail detection enabled' },
          { terminal: 'X7:3', label: 'Mains L3', function: 'Utility phase C voltage', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains incomer L3 via 2A fuse', notes: 'Phase sequence monitoring' },
          { terminal: 'X7:4', label: 'Mains N', function: 'Utility neutral reference', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains neutral bar', notes: 'Required for voltage measurement' }
        ]
      },
      {
        section: 'Parallel / Sync Bus',
        description: 'Load sharing and synchronization communication with other generators.',
        terminals: [
          { terminal: 'X8:1', label: 'Sync Check', function: 'Synchroscope relay output', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Generator circuit breaker close coil', notes: 'Closes when sync conditions satisfied' },
          { terminal: 'X8:2', label: 'Gov Speed+', function: 'Governor speed increase', wireColor: 'PINK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Electronic governor raise input', notes: 'PWM output for proportional control' },
          { terminal: 'X8:3', label: 'Gov Speed-', function: 'Governor speed decrease', wireColor: 'GREY', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Electronic governor lower input', notes: 'Used for frequency droop matching' },
          { terminal: 'X8:4', label: 'AVR Volt+', function: 'AVR voltage increase', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'AVR external voltage raise input', notes: 'For reactive load sharing' },
          { terminal: 'X8:5', label: 'AVR Volt-', function: 'AVR voltage decrease', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'AVR external voltage lower input', notes: 'Prevents circulating currents' },
          { terminal: 'X8:6', label: 'LS Bus A', function: 'Load share data bus line A', wireColor: 'BLUE', wireGauge: '0.75mm² / 20 AWG twisted', connectTo: 'Other InteliGen LS Bus A terminals', notes: 'Daisy-chain connection between units' },
          { terminal: 'X8:7', label: 'LS Bus B', function: 'Load share data bus line B', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG twisted', connectTo: 'Other InteliGen LS Bus B terminals', notes: '120Ω termination at both ends' },
          { terminal: 'X8:8', label: 'LS Bus GND', function: 'Load share bus ground', wireColor: 'BLACK', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Common ground between units', notes: 'Essential for reliable communication' }
        ]
      },
      {
        section: 'Binary Inputs',
        description: 'Digital input connections for external signals and protection.',
        terminals: [
          { terminal: 'X9:1', label: 'BI1 E-Stop', function: 'Emergency stop input', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'E-stop mushroom pushbutton NC', notes: 'Configure as normally closed for safety' },
          { terminal: 'X9:2', label: 'BI2 Remote', function: 'Remote start enable input', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Remote start switch or BMS', notes: 'Contact closure to common starts' },
          { terminal: 'X9:3', label: 'BI3', function: 'Configurable binary input 3', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'High water temp switch (NO)', notes: 'Backup thermal protection' },
          { terminal: 'X9:4', label: 'BI4', function: 'Configurable binary input 4', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Low oil pressure switch (NC)', notes: 'Mechanical protection backup' },
          { terminal: 'X9:5', label: 'BI5', function: 'Configurable binary input 5', wireColor: 'ORANGE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Breaker status auxiliary contact', notes: 'Monitors GCB open/closed state' },
          { terminal: 'X9:6', label: 'BI6', function: 'Configurable binary input 6', wireColor: 'BLUE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User-defined function', notes: 'Full programmability available' },
          { terminal: 'X9:7', label: 'BI7', function: 'Configurable binary input 7', wireColor: 'VIOLET', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User-defined function', notes: 'Software selectable polarity' },
          { terminal: 'X9:8', label: 'BI8', function: 'Configurable binary input 8', wireColor: 'GREY', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User-defined function', notes: 'Active level configurable' },
          { terminal: 'X9:9', label: 'BI Common', function: 'Binary input common terminal', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'All binary input switches common', notes: 'Connect to B- or B+ per config' }
        ]
      },
      {
        section: 'Binary Outputs',
        description: 'Relay output connections for alarms, control, and indication.',
        terminals: [
          { terminal: 'X10:1', label: 'BO1 NO', function: 'Output 1 normally open contact', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Mains contactor coil', notes: 'Default: Mains contactor drive' },
          { terminal: 'X10:2', label: 'BO1 COM', function: 'Output 1 common terminal', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Control supply positive', notes: 'Rated 8A 250VAC / 8A 30VDC' },
          { terminal: 'X10:3', label: 'BO2 NO', function: 'Output 2 normally open contact', wireColor: 'GREEN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Generator contactor coil', notes: 'Default: Gen contactor drive' },
          { terminal: 'X10:4', label: 'BO2 COM', function: 'Output 2 common terminal', wireColor: 'GREEN/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Control supply positive', notes: 'Mechanical interlock also required' },
          { terminal: 'X10:5', label: 'BO3 NO', function: 'Output 3 normally open contact', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Common alarm relay/horn', notes: 'Energized on any alarm condition' },
          { terminal: 'X10:6', label: 'BO3 COM', function: 'Output 3 common terminal', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm circuit supply', notes: 'Configurable alarm grouping' },
          { terminal: 'X10:7', label: 'BO4 NO', function: 'Output 4 normally open contact', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Running status indicator', notes: 'Engine running confirmed' },
          { terminal: 'X10:8', label: 'BO4 COM', function: 'Output 4 common terminal', wireColor: 'ORANGE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Indicator lamp supply', notes: 'Full configuration flexibility' }
        ]
      },
      {
        section: 'Communication Interfaces',
        description: 'Serial, network, and field bus communication connections.',
        terminals: [
          { terminal: 'X11:1', label: 'RS232 TxD', function: 'Serial transmit data', wireColor: 'WHITE', wireGauge: '0.5mm² / 22 AWG', connectTo: 'PC/Modem RxD (DB9 pin 2)', notes: 'Use shielded cable max 15m' },
          { terminal: 'X11:2', label: 'RS232 RxD', function: 'Serial receive data', wireColor: 'GREEN', wireGauge: '0.5mm² / 22 AWG', connectTo: 'PC/Modem TxD (DB9 pin 3)', notes: '9600-115200 baud supported' },
          { terminal: 'X11:3', label: 'RS232 GND', function: 'Serial signal ground', wireColor: 'BLACK', wireGauge: '0.5mm² / 22 AWG', connectTo: 'PC/Modem GND (DB9 pin 5)', notes: 'Shield to controller ground only' },
          { terminal: 'X11:4', label: 'RS485 A (+)', function: 'MODBUS data line A', wireColor: 'BLUE', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'MODBUS master A terminal', notes: 'Twisted pair essential' },
          { terminal: 'X11:5', label: 'RS485 B (-)', function: 'MODBUS data line B', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'MODBUS master B terminal', notes: '120Ω termination both ends' },
          { terminal: 'X11:6', label: 'CAN-H', function: 'J1939 CAN bus high', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'ECM CAN-H terminal', notes: 'Yellow/green twisted pair' },
          { terminal: 'X11:7', label: 'CAN-L', function: 'J1939 CAN bus low', wireColor: 'GREEN', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'ECM CAN-L terminal', notes: '120Ω termination required' },
          { terminal: 'X11:8', label: 'CAN GND', function: 'CAN bus signal ground', wireColor: 'BLACK', wireGauge: '0.75mm² / 20 AWG', connectTo: 'CAN bus ground reference', notes: 'Essential for bus stability' }
        ]
      }
    ],
    schematicNotes: [
      'X-series connector numbers match factory documentation',
      'All signals referenced to controller power supply negative',
      'CT polarity must match power flow direction for accurate metering',
      'Load share bus requires correct addressing for each unit',
      'Generator breaker close circuit must include sync check contact',
      'Separate screened cables for analog and digital signals'
    ],
    installationTips: [
      'Use cable markers at every terminal connection point',
      'Document CT ratios and meter constants in panel labeling',
      'Test load sharing on dummy load before mains parallel operation',
      'Verify synchronization window settings match generator parameters',
      'Program unique network address for each controller in multi-gen systems',
      'Keep RS485 and CAN cables separate from AC power cables'
    ]
  },
  'woodward-easygen3000': {
    modelId: 'woodward-easygen3000',
    modelName: 'easYgen 3000 Series Controller',
    overview: 'Professional wiring reference for the easYgen 3000 electronic engine governor and generator controller. This unit combines precise speed control with comprehensive generator protection and parallel operation capability. Follow these terminal connections exactly for reliable operation.',
    safetyWarnings: [
      'Governor malfunction can cause dangerous overspeed - test protection functions',
      'Ensure emergency stop circuits function independently of controller',
      'Speed control failure during parallel operation causes reverse power trip',
      'Actuator wiring errors can cause engine runaway - verify before first start',
      'High-frequency PWM outputs can interfere with nearby electronics'
    ],
    powerRequirements: {
      voltage: '9-32V DC nominal, 8V DC minimum for full functionality',
      current: '2.5A continuous, 6A peak during actuator drive',
      fusing: '10A slow-blow fuse recommended',
      grounding: 'Single-point ground at controller, star topology'
    },
    sections: [
      {
        section: 'Power Supply',
        description: 'Battery power connections for controller and actuator.',
        terminals: [
          { terminal: 'J1-1', label: 'Supply +', function: 'Positive DC power input', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery positive via fuse', notes: 'Use fused link within 150mm of battery' },
          { terminal: 'J1-2', label: 'Supply -', function: 'Negative DC power / GND', wireColor: 'BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery negative direct', notes: 'Main power return path' },
          { terminal: 'J1-3', label: 'Shield', function: 'Cable shield collection point', wireColor: 'BARE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Chassis ground via controller', notes: 'All shields terminate here' },
          { terminal: 'J1-4', label: 'Aux Pwr', function: 'Auxiliary/key switch input', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Key switch or enable relay', notes: 'Controller active when energized' }
        ]
      },
      {
        section: 'Actuator Drive',
        description: 'Electronic actuator connections for speed control.',
        terminals: [
          { terminal: 'J2-1', label: 'Act +', function: 'Actuator positive drive output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Actuator coil positive', notes: 'Proportional DC drive - PWM smoothed' },
          { terminal: 'J2-2', label: 'Act -', function: 'Actuator negative / return', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Actuator coil negative', notes: 'Use twisted pair for EMC' },
          { terminal: 'J2-3', label: 'Act FB', function: 'Actuator position feedback', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Actuator position potentiometer wiper', notes: 'For closed-loop position control' },
          { terminal: 'J2-4', label: 'Act FB+', function: 'Position feedback supply', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Potentiometer high end', notes: '5V reference supply' },
          { terminal: 'J2-5', label: 'Act FB-', function: 'Position feedback return', wireColor: 'BLACK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Potentiometer low end', notes: 'Ground reference for pot' }
        ]
      },
      {
        section: 'Speed Sensing',
        description: 'Engine speed measurement from magnetic pickup or alternator.',
        terminals: [
          { terminal: 'J3-1', label: 'MPU +', function: 'Magnetic pickup signal positive', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG STP', connectTo: 'MPU sensor positive lead', notes: 'Use shielded twisted pair cable' },
          { terminal: 'J3-2', label: 'MPU -', function: 'Magnetic pickup signal negative', wireColor: 'WHITE/BLACK', wireGauge: '1.0mm² / 18 AWG STP', connectTo: 'MPU sensor negative lead', notes: 'Keep away from ignition components' },
          { terminal: 'J3-3', label: 'Shld', function: 'MPU cable shield termination', wireColor: 'BARE', wireGauge: 'N/A', connectTo: 'Cable shield only', notes: 'Connect at controller end only' },
          { terminal: 'J3-4', label: 'Alt W', function: 'Alternator W terminal frequency', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Charging alternator W terminal', notes: 'Alternative speed source' }
        ]
      },
      {
        section: 'Engine Sensors',
        description: 'Analog inputs for engine temperature, pressure, and level.',
        terminals: [
          { terminal: 'J4-1', label: 'Oil Press', function: 'Oil pressure sender input', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil pressure sender signal', notes: 'VDO compatible 10-180 ohm' },
          { terminal: 'J4-2', label: 'H2O Temp', function: 'Coolant temperature input', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'NTC thermistor sensor', notes: '4700Ω at 20°C typical' },
          { terminal: 'J4-3', label: 'Fuel Lvl', function: 'Fuel level sender input', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Resistive fuel gauge sender', notes: 'Configure full/empty resistance' },
          { terminal: 'J4-4', label: 'Snsr Rtn', function: 'Sensor common return', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'All resistive sensor grounds', notes: 'Star-point connection' },
          { terminal: 'J4-5', label: 'Boost', function: 'Turbo boost pressure input', wireColor: 'BLUE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Boost pressure sender', notes: '4-20mA or 0-5V configurable' },
          { terminal: 'J4-6', label: 'EGT', function: 'Exhaust gas temperature', wireColor: 'ORANGE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'K-type thermocouple amplifier output', notes: 'Use cold junction compensation' }
        ]
      },
      {
        section: 'Generator Voltage',
        description: 'AC voltage sensing for generator output monitoring.',
        terminals: [
          { terminal: 'J5-1', label: 'Gen U', function: 'Generator phase A voltage', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator L1 via 2A fuse', notes: '45-65Hz, 20-300VAC range' },
          { terminal: 'J5-2', label: 'Gen V', function: 'Generator phase B voltage', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator L2 via 2A fuse', notes: 'Required for 3-phase systems' },
          { terminal: 'J5-3', label: 'Gen W', function: 'Generator phase C voltage', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator L3 via 2A fuse', notes: 'Phase rotation monitored' },
          { terminal: 'J5-4', label: 'Gen N', function: 'Generator neutral connection', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator neutral point', notes: 'Reference for phase-neutral' }
        ]
      },
      {
        section: 'Current Transformers',
        description: 'CT secondary connections for power measurement.',
        terminals: [
          { terminal: 'J6-1', label: 'CT-U k', function: 'Phase A CT secondary start', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 k terminal', notes: 'Observe polarity markings' },
          { terminal: 'J6-2', label: 'CT-U l', function: 'Phase A CT secondary end', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 l terminal', notes: 'Current flows k to l in primary' },
          { terminal: 'J6-3', label: 'CT-V k', function: 'Phase B CT secondary start', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 k terminal', notes: 'Match ratio to actual CTs' },
          { terminal: 'J6-4', label: 'CT-V l', function: 'Phase B CT secondary end', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 l terminal', notes: '1A or 5A secondary' },
          { terminal: 'J6-5', label: 'CT-W k', function: 'Phase C CT secondary start', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 k terminal', notes: 'Never open-circuit energized CT' },
          { terminal: 'J6-6', label: 'CT-W l', function: 'Phase C CT secondary end', wireColor: 'BLUE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 l terminal', notes: 'All l terminals may be commoned' }
        ]
      },
      {
        section: 'Discrete Inputs',
        description: 'Digital inputs for switch and status monitoring.',
        terminals: [
          { terminal: 'J7-1', label: 'DI-1 Stop', function: 'Emergency stop input', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Emergency stop NC contact', notes: 'Fail-safe normally closed' },
          { terminal: 'J7-2', label: 'DI-2 Run', function: 'Run request input', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Run enable switch/signal', notes: 'Start sequence when closed' },
          { terminal: 'J7-3', label: 'DI-3', function: 'Configurable discrete input', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User-defined switch', notes: 'Programmable function' },
          { terminal: 'J7-4', label: 'DI-4', function: 'Configurable discrete input', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User-defined switch', notes: 'Full software configuration' },
          { terminal: 'J7-5', label: 'DI-5', function: 'Configurable discrete input', wireColor: 'ORANGE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User-defined switch', notes: 'Active high or low' },
          { terminal: 'J7-6', label: 'DI Com', function: 'Discrete input common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Switch common connection', notes: 'Connect to + or - per mode' }
        ]
      },
      {
        section: 'Control Outputs',
        description: 'Relay outputs and driver signals for engine control.',
        terminals: [
          { terminal: 'J8-1', label: 'K1 Crank', function: 'Starter motor relay output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid trigger', notes: '5A relay contact rated' },
          { terminal: 'J8-2', label: 'K1 Com', function: 'Starter relay common', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Battery positive supply', notes: 'Fused supply for starter' },
          { terminal: 'J8-3', label: 'K2 Fuel', function: 'Fuel solenoid relay output', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid coil +', notes: 'Energized during run' },
          { terminal: 'J8-4', label: 'K2 Com', function: 'Fuel relay common', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Switched supply', notes: 'De-energize to stop engine' },
          { terminal: 'J8-5', label: 'K3 Alarm', function: 'Common alarm relay', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm horn/lamp', notes: 'Activated on any alarm' },
          { terminal: 'J8-6', label: 'K3 Com', function: 'Alarm relay common', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm circuit supply', notes: 'NO contact operation' },
          { terminal: 'J8-7', label: 'K4 Run', function: 'Engine running status relay', wireColor: 'GREEN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Running indicator', notes: 'Speed above threshold' },
          { terminal: 'J8-8', label: 'K4 Com', function: 'Running relay common', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Indication supply', notes: 'Confirms generator ready' }
        ]
      },
      {
        section: 'Serial Communications',
        description: 'Serial port connections for configuration and monitoring.',
        terminals: [
          { terminal: 'J9-1', label: 'TX', function: 'RS232 transmit data', wireColor: 'WHITE', wireGauge: '0.5mm² / 22 AWG', connectTo: 'PC COM port RX', notes: 'Use shielded cable' },
          { terminal: 'J9-2', label: 'RX', function: 'RS232 receive data', wireColor: 'GREEN', wireGauge: '0.5mm² / 22 AWG', connectTo: 'PC COM port TX', notes: 'Software download capable' },
          { terminal: 'J9-3', label: 'GND', function: 'Serial port ground', wireColor: 'BLACK', wireGauge: '0.5mm² / 22 AWG', connectTo: 'PC COM port GND', notes: 'Signal reference only' },
          { terminal: 'J9-4', label: 'CAN-H', function: 'CAN bus high line', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'CAN network H line', notes: 'J1939 protocol support' },
          { terminal: 'J9-5', label: 'CAN-L', function: 'CAN bus low line', wireColor: 'GREEN', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'CAN network L line', notes: '120Ω termination required' }
        ]
      }
    ],
    schematicNotes: [
      'J-series connectors are removable for field wiring convenience',
      'Actuator output is current-limited to prevent coil damage',
      'Speed sensing requires minimum 0.5V RMS signal at idle',
      'Isochronous or droop speed modes selectable in software',
      'All relay contacts are SPST-NO unless otherwise specified'
    ],
    installationTips: [
      'Keep actuator cable length under 5m to avoid signal degradation',
      'Install EMC filter on actuator output for sensitive environments',
      'Verify actuator travel range before applying power',
      'Set speed gain parameters conservatively on first start',
      'Monitor actuator temperature during extended operation',
      'Test emergency stop response before commissioning'
    ]
  },
  'smartgen-hgm9320': {
    modelId: 'smartgen-hgm9320',
    modelName: 'HGM9320 Series Controller',
    overview: 'Comprehensive wiring guide for the HGM9320 automatic generator controller. This professional-grade unit provides AMF control, engine monitoring, and protection functions in a compact design. The terminal layout is optimized for efficient installation in generator control panels.',
    safetyWarnings: [
      'Always disconnect battery before making terminal connections',
      'CT wiring must be completed before applying load to generator',
      'Verify all protection thresholds are correctly set before handover',
      'Emergency stop circuit must operate independently of controller',
      'Use correctly rated fuses on all voltage sensing circuits'
    ],
    powerRequirements: {
      voltage: '8-35V DC (12V or 24V battery systems)',
      current: '2A continuous, 5A peak during cranking output',
      fusing: '10A fuse on battery positive supply',
      grounding: 'Connect GND terminal to generator chassis ground'
    },
    sections: [
      {
        section: 'DC Power Input',
        description: 'Main power supply connections from starting battery.',
        terminals: [
          { terminal: '1', label: 'B+', function: 'Battery positive input', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery + terminal via 10A fuse', notes: 'Main power supply' },
          { terminal: '2', label: 'B-', function: 'Battery negative / ground', wireColor: 'BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery - terminal', notes: 'System ground reference' },
          { terminal: '3', label: 'GND', function: 'Chassis/earth ground', wireColor: 'GREEN/YELLOW', wireGauge: '4mm² / 12 AWG', connectTo: 'Generator frame ground', notes: 'EMC and safety ground' }
        ]
      },
      {
        section: 'Engine Control Outputs',
        description: 'Starter, fuel, and preheat control connections.',
        terminals: [
          { terminal: '4', label: 'CRANK', function: 'Starter motor solenoid output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid S terminal', notes: '10A maximum continuous' },
          { terminal: '5', label: 'FUEL', function: 'Fuel solenoid/injection enable', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid coil +', notes: 'Energized = engine run' },
          { terminal: '6', label: 'PREHEAT', function: 'Glow plug relay output', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Glow plug relay coil', notes: 'Pre-crank heating timer' },
          { terminal: '7', label: 'IDLE', function: 'Idle speed request output', wireColor: 'PINK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Idle solenoid or governor', notes: 'Low speed operation mode' }
        ]
      },
      {
        section: 'Speed Sensor',
        description: 'Engine RPM sensing from magnetic pickup.',
        terminals: [
          { terminal: '8', label: 'MPU+', function: 'Speed sensor signal input', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG STP', connectTo: 'Magnetic pickup + terminal', notes: 'Shielded twisted pair required' },
          { terminal: '9', label: 'MPU-', function: 'Speed sensor signal return', wireColor: 'WHITE/BLACK', wireGauge: '1.0mm² / 18 AWG STP', connectTo: 'Magnetic pickup - terminal', notes: 'Do not ground at sensor' }
        ]
      },
      {
        section: 'Analog Sensors',
        description: 'Engine monitoring sensor inputs.',
        terminals: [
          { terminal: '10', label: 'OIL P', function: 'Oil pressure sender', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil pressure sender signal', notes: 'VDO type 10-180Ω' },
          { terminal: '11', label: 'H2O T', function: 'Coolant temperature sender', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Water temp NTC sensor', notes: '40-4700Ω range' },
          { terminal: '12', label: 'FUEL L', function: 'Fuel tank level sender', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Fuel level float sender', notes: 'Resistive type 10-180Ω' },
          { terminal: '13', label: 'SEN GND', function: 'Sensor common ground', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'All sensor ground wires', notes: 'Star connection point' }
        ]
      },
      {
        section: 'Generator Voltage',
        description: 'AC output voltage monitoring.',
        terminals: [
          { terminal: '14', label: 'GEN L1', function: 'Generator phase A voltage', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen output L1 via 2A fuse', notes: 'Live voltage - use caution' },
          { terminal: '15', label: 'GEN L2', function: 'Generator phase B voltage', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen output L2 via 2A fuse', notes: 'Optional for single phase' },
          { terminal: '16', label: 'GEN L3', function: 'Generator phase C voltage', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen output L3 via 2A fuse', notes: 'Three-phase measurement' },
          { terminal: '17', label: 'GEN N', function: 'Generator neutral reference', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Generator star point', notes: 'Required for L-N voltage' }
        ]
      },
      {
        section: 'Current Transformers',
        description: 'Generator current measurement CTs.',
        terminals: [
          { terminal: '18', label: 'CT1 S1', function: 'CT phase A start', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 S1 terminal', notes: 'Standard 5A secondary CT' },
          { terminal: '19', label: 'CT1 S2', function: 'CT phase A finish', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 S2 terminal', notes: 'Observe CT polarity' },
          { terminal: '20', label: 'CT2 S1', function: 'CT phase B start', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 S1 terminal', notes: 'Match CT ratios' },
          { terminal: '21', label: 'CT2 S2', function: 'CT phase B finish', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 S2 terminal', notes: 'Never open-circuit CT' },
          { terminal: '22', label: 'CT3 S1', function: 'CT phase C start', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 S1 terminal', notes: 'Use adequate VA rating' },
          { terminal: '23', label: 'CT3 S2', function: 'CT phase C finish', wireColor: 'BLUE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 S2 terminal / common', notes: 'Short for safety' }
        ]
      },
      {
        section: 'Mains Voltage',
        description: 'Utility supply monitoring for AMF.',
        terminals: [
          { terminal: '24', label: 'MAINS L1', function: 'Mains phase A voltage', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains supply L1 via fuse', notes: 'Upstream of mains MCB' },
          { terminal: '25', label: 'MAINS L2', function: 'Mains phase B voltage', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains supply L2 via fuse', notes: 'Phase loss detection' },
          { terminal: '26', label: 'MAINS L3', function: 'Mains phase C voltage', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains supply L3 via fuse', notes: 'Phase rotation check' },
          { terminal: '27', label: 'MAINS N', function: 'Mains neutral reference', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains neutral bar', notes: 'System reference' }
        ]
      },
      {
        section: 'Transfer Switch',
        description: 'ATS contactor control outputs.',
        terminals: [
          { terminal: '28', label: 'MC-M', function: 'Mains contactor output', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Mains contactor coil', notes: 'Normally energized' },
          { terminal: '29', label: 'MC-G', function: 'Generator contactor output', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen contactor coil', notes: 'Energized on transfer' },
          { terminal: '30', label: 'ATS-FB', function: 'ATS position feedback', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'ATS auxiliary contact', notes: 'Transfer confirmation' }
        ]
      },
      {
        section: 'Digital Inputs',
        description: 'External switch and signal inputs.',
        terminals: [
          { terminal: '31', label: 'DI1', function: 'Emergency stop (NC)', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'E-stop button NC contact', notes: 'Fail-safe operation' },
          { terminal: '32', label: 'DI2', function: 'Remote start request', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Remote start switch', notes: 'Close to request start' },
          { terminal: '33', label: 'DI3', function: 'High temp switch', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Engine temp switch NO', notes: 'Backup protection' },
          { terminal: '34', label: 'DI4', function: 'Low oil pressure switch', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil press switch NC', notes: 'Opens with pressure' },
          { terminal: '35', label: 'DI5', function: 'Low coolant level', wireColor: 'ORANGE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Coolant level switch', notes: 'Warning function' },
          { terminal: '36', label: 'DI6', function: 'Spare input', wireColor: 'BLUE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User configurable', notes: 'Programmable' },
          { terminal: '37', label: 'DI COM', function: 'Input common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Switch common', notes: 'To B+ or B-' }
        ]
      },
      {
        section: 'Relay Outputs',
        description: 'Alarm and status indication outputs.',
        terminals: [
          { terminal: '38', label: 'RLY1 NO', function: 'Common alarm relay', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm horn/indicator', notes: '8A contact rating' },
          { terminal: '39', label: 'RLY1 COM', function: 'Relay 1 common', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm supply', notes: 'Energizes on alarm' },
          { terminal: '40', label: 'RLY2 NO', function: 'Running status relay', wireColor: 'GREEN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Running lamp', notes: 'Engine running' },
          { terminal: '41', label: 'RLY2 COM', function: 'Relay 2 common', wireColor: 'GREEN/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Lamp supply', notes: 'Status indication' },
          { terminal: '42', label: 'RLY3 NO', function: 'Shutdown alarm relay', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Shutdown indicator', notes: 'Critical alarms only' },
          { terminal: '43', label: 'RLY3 COM', function: 'Relay 3 common', wireColor: 'ORANGE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Indicator supply', notes: 'Engine stopped' }
        ]
      },
      {
        section: 'Communication',
        description: 'Serial and network communication ports.',
        terminals: [
          { terminal: '44', label: 'RS485 A', function: 'MODBUS data line A', wireColor: 'BLUE', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'MODBUS master A+', notes: 'Twisted pair cable' },
          { terminal: '45', label: 'RS485 B', function: 'MODBUS data line B', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'MODBUS master B-', notes: '120Ω termination' },
          { terminal: '46', label: 'RS485 G', function: 'MODBUS signal ground', wireColor: 'BLACK', wireGauge: '0.75mm² / 20 AWG', connectTo: 'MODBUS ground', notes: 'Reference potential' },
          { terminal: '47', label: 'CAN H', function: 'J1939 CAN high', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'ECM CAN-H', notes: 'Engine ECM link' },
          { terminal: '48', label: 'CAN L', function: 'J1939 CAN low', wireColor: 'GREEN', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'ECM CAN-L', notes: '120Ω each end' }
        ]
      }
    ],
    schematicNotes: [
      'Terminal numbers match controller silkscreen markings',
      'All wire colors follow HGM series standard documentation',
      'Digital inputs configurable as NO or NC in software',
      'CT direction affects power factor and kW calculation sign',
      'USB port available for PC software connection and firmware updates'
    ],
    installationTips: [
      'Use cable ferrules on all stranded wire terminations',
      'Maintain 10mm wire strip length for reliable contact',
      'Route sensor cables separately from power cables',
      'Install suppression diodes across relay-driven inductors',
      'Test all alarm functions using the built-in simulator',
      'Record all parameter settings before handover'
    ]
  },
  'powerwizard-20': {
    modelId: 'powerwizard-20',
    modelName: 'PowerWizard 2.0 Controller',
    overview: 'Heavy-duty generator controller wiring reference designed for demanding industrial and construction applications. The PowerWizard 2.0 provides robust engine management, generator protection, and intuitive operator interface in extreme environments.',
    safetyWarnings: [
      'This controller is designed for industrial machinery - installation by qualified personnel only',
      'Heavy-duty output relays can control high-current circuits - use appropriate protection',
      'Speed governor output requires compatible electronic actuator',
      'Verify all emergency stop functions before equipment commissioning',
      'High ambient temperature derating may be required'
    ],
    powerRequirements: {
      voltage: '9-32V DC (12V or 24V nominal systems)',
      current: '5A continuous, 15A peak',
      fusing: '20A main fuse with 10A auxiliary circuit fuse',
      grounding: 'Heavy-gauge bonding to equipment frame required'
    },
    sections: [
      {
        section: 'Main Power',
        description: 'Primary DC power connections.',
        terminals: [
          { terminal: 'P1', label: 'Power +', function: 'Main positive supply input', wireColor: 'RED', wireGauge: '6mm² / 10 AWG', connectTo: 'Battery + via 20A fuse', notes: 'Heavy gauge for peak loads' },
          { terminal: 'P2', label: 'Power -', function: 'Main negative/ground', wireColor: 'BLACK', wireGauge: '6mm² / 10 AWG', connectTo: 'Battery - terminal', notes: 'Direct connection' },
          { terminal: 'P3', label: 'Frame GND', function: 'Equipment frame ground', wireColor: 'GREEN', wireGauge: '6mm² / 10 AWG', connectTo: 'Equipment chassis', notes: 'Safety grounding' },
          { terminal: 'P4', label: 'Key Sw', function: 'Key switch enable input', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Key switch output', notes: 'Enables controller' }
        ]
      },
      {
        section: 'Engine Start/Stop',
        description: 'High-current engine control outputs.',
        terminals: [
          { terminal: 'E1', label: 'Crank Out', function: 'Starter motor control', wireColor: 'YELLOW', wireGauge: '4mm² / 12 AWG', connectTo: 'Starter solenoid', notes: '15A continuous rating' },
          { terminal: 'E2', label: 'Fuel Run', function: 'Fuel injection enable', wireColor: 'BLUE', wireGauge: '4mm² / 12 AWG', connectTo: 'Fuel solenoid/ECM', notes: 'Active = run' },
          { terminal: 'E3', label: 'Stop Sol', function: 'Stop solenoid output', wireColor: 'ORANGE', wireGauge: '4mm² / 12 AWG', connectTo: 'Stop solenoid coil', notes: 'Spring-return type' },
          { terminal: 'E4', label: 'Preheat', function: 'Cold start aid relay', wireColor: 'PINK', wireGauge: '4mm² / 12 AWG', connectTo: 'Grid heater relay', notes: 'Timer-controlled' },
          { terminal: 'E5', label: 'Gov +', function: 'Governor speed raise', wireColor: 'WHITE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'E-governor raise', notes: 'PWM output' },
          { terminal: 'E6', label: 'Gov -', function: 'Governor speed lower', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'E-governor lower', notes: 'Speed control' }
        ]
      },
      {
        section: 'Speed/Position',
        description: 'Engine speed and timing sensor inputs.',
        terminals: [
          { terminal: 'S1', label: 'MPU Sig', function: 'Engine speed sensor +', wireColor: 'WHITE', wireGauge: '1.5mm² / 16 AWG STP', connectTo: 'Flywheel MPU +', notes: 'Shielded twisted pair' },
          { terminal: 'S2', label: 'MPU Ret', function: 'Engine speed sensor -', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG STP', connectTo: 'Flywheel MPU -', notes: 'Isolated return' },
          { terminal: 'S3', label: 'Shld', function: 'MPU shield termination', wireColor: 'BARE', wireGauge: 'N/A', connectTo: 'Controller ground', notes: 'Single-end grounding' },
          { terminal: 'S4', label: 'Timing', function: 'Timing reference input', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Cam position sensor', notes: 'For injection timing' }
        ]
      },
      {
        section: 'Analog Inputs',
        description: 'Engine sensor analog inputs.',
        terminals: [
          { terminal: 'A1', label: 'Oil Press', function: 'Oil pressure sender', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Oil pressure sender', notes: '0-10 bar standard' },
          { terminal: 'A2', label: 'H2O Temp', function: 'Coolant temperature', wireColor: 'GREEN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Coolant temp sensor', notes: 'NTC thermistor' },
          { terminal: 'A3', label: 'Oil Temp', function: 'Oil temperature', wireColor: 'BROWN/WHITE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Oil temp sender', notes: 'Optional monitoring' },
          { terminal: 'A4', label: 'Fuel Lvl', function: 'Fuel tank level', wireColor: 'YELLOW', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Fuel level sender', notes: 'Resistive type' },
          { terminal: 'A5', label: 'Boost', function: 'Turbo boost pressure', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Boost sensor', notes: '4-20mA input' },
          { terminal: 'A6', label: 'EGT', function: 'Exhaust temperature', wireColor: 'ORANGE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'EGT probe amplifier', notes: 'Processed signal' },
          { terminal: 'A7', label: 'Bat Volts', function: 'Battery voltage sense', wireColor: 'RED', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Battery terminal', notes: 'Direct sensing' },
          { terminal: 'A8', label: 'An GND', function: 'Analog sensor ground', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'All sensor grounds', notes: 'Star point' }
        ]
      },
      {
        section: 'Generator AC',
        description: 'Generator voltage and current measurement.',
        terminals: [
          { terminal: 'G1', label: 'Gen L1', function: 'Generator phase A', wireColor: 'BROWN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen L1 via 3A fuse', notes: 'Fused voltage sense' },
          { terminal: 'G2', label: 'Gen L2', function: 'Generator phase B', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen L2 via 3A fuse', notes: '3-phase system' },
          { terminal: 'G3', label: 'Gen L3', function: 'Generator phase C', wireColor: 'GREY', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen L3 via 3A fuse', notes: 'Phase sequence' },
          { terminal: 'G4', label: 'Gen N', function: 'Generator neutral', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen star point', notes: 'L-N reference' },
          { terminal: 'G5', label: 'CT1+', function: 'CT phase A S1', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'CT1 S1', notes: 'Polarity marked' },
          { terminal: 'G6', label: 'CT1-', function: 'CT phase A S2', wireColor: 'RED/BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'CT1 S2', notes: 'Current direction' },
          { terminal: 'G7', label: 'CT2+', function: 'CT phase B S1', wireColor: 'YELLOW', wireGauge: '4mm² / 12 AWG', connectTo: 'CT2 S1', notes: 'Match ratios' },
          { terminal: 'G8', label: 'CT2-', function: 'CT phase B S2', wireColor: 'YELLOW/BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'CT2 S2', notes: '5A secondary' },
          { terminal: 'G9', label: 'CT3+', function: 'CT phase C S1', wireColor: 'BLUE', wireGauge: '4mm² / 12 AWG', connectTo: 'CT3 S1', notes: 'Protection class' },
          { terminal: 'G10', label: 'CT3-', function: 'CT phase C S2', wireColor: 'BLUE/BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'CT3 S2/COM', notes: 'Common point' }
        ]
      },
      {
        section: 'Digital Inputs',
        description: 'Binary switch and signal inputs.',
        terminals: [
          { terminal: 'D1', label: 'E-Stop', function: 'Emergency stop NC', wireColor: 'RED', wireGauge: '1.5mm² / 16 AWG', connectTo: 'E-stop pushbutton', notes: 'NC fail-safe' },
          { terminal: 'D2', label: 'Start Req', function: 'Start request input', wireColor: 'GREEN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Start switch/PLC', notes: 'Maintained contact' },
          { terminal: 'D3', label: 'Stop Req', function: 'Stop request input', wireColor: 'ORANGE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Stop switch', notes: 'Momentary ok' },
          { terminal: 'D4', label: 'Auto Sel', function: 'Auto mode select', wireColor: 'YELLOW', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Auto selector', notes: 'Auto/Manual' },
          { terminal: 'D5', label: 'Hi Temp', function: 'High temp switch', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Temp switch NO', notes: 'Backup protection' },
          { terminal: 'D6', label: 'Lo Oil', function: 'Low oil switch', wireColor: 'PINK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Oil switch NC', notes: 'Opens with press' },
          { terminal: 'D7', label: 'Spare 1', function: 'Configurable input 1', wireColor: 'VIOLET', wireGauge: '1.5mm² / 16 AWG', connectTo: 'User defined', notes: 'Programmable' },
          { terminal: 'D8', label: 'Spare 2', function: 'Configurable input 2', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'User defined', notes: 'Software config' },
          { terminal: 'D-', label: 'DI Common', function: 'Digital input common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'All switch returns', notes: 'Ground reference' }
        ]
      },
      {
        section: 'Relay Outputs',
        description: 'Heavy-duty relay output contacts.',
        terminals: [
          { terminal: 'R1-NO', label: 'Alarm', function: 'Common alarm NO', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Alarm horn/lamp', notes: '15A rating' },
          { terminal: 'R1-NC', label: 'Alarm NC', function: 'Common alarm NC', wireColor: 'RED/WHITE', wireGauge: '4mm² / 12 AWG', connectTo: 'Fail-safe circuit', notes: 'Opens on alarm' },
          { terminal: 'R1-C', label: 'Alarm Com', function: 'Alarm relay common', wireColor: 'RED/BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Supply voltage', notes: 'SPDT contact' },
          { terminal: 'R2-NO', label: 'Run', function: 'Running status NO', wireColor: 'GREEN', wireGauge: '4mm² / 12 AWG', connectTo: 'Run indicator', notes: '15A rating' },
          { terminal: 'R2-C', label: 'Run Com', function: 'Running relay common', wireColor: 'GREEN/BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Indicator supply', notes: 'Speed confirmed' },
          { terminal: 'R3-NO', label: 'Fault', function: 'Shutdown fault NO', wireColor: 'ORANGE', wireGauge: '4mm² / 12 AWG', connectTo: 'Fault beacon', notes: 'Critical alarms' },
          { terminal: 'R3-C', label: 'Fault Com', function: 'Fault relay common', wireColor: 'ORANGE/BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Beacon supply', notes: 'Engine stopped' },
          { terminal: 'R4-NO', label: 'Aux', function: 'Auxiliary output NO', wireColor: 'BLUE', wireGauge: '4mm² / 12 AWG', connectTo: 'User configurable', notes: '15A rating' },
          { terminal: 'R4-C', label: 'Aux Com', function: 'Auxiliary common', wireColor: 'BLUE/BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Aux supply', notes: 'Programmable' }
        ]
      },
      {
        section: 'Data Comm',
        description: 'Communication interface connections.',
        terminals: [
          { terminal: 'C1', label: 'CAN-H', function: 'J1939 CAN high', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG TP', connectTo: 'ECM CAN-H', notes: 'Engine datalink' },
          { terminal: 'C2', label: 'CAN-L', function: 'J1939 CAN low', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG TP', connectTo: 'ECM CAN-L', notes: '120Ω termination' },
          { terminal: 'C3', label: 'CAN GND', function: 'CAN signal ground', wireColor: 'BLACK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'CAN bus ground', notes: 'Shield drain' },
          { terminal: 'C4', label: 'RS485+', function: 'MODBUS A line', wireColor: 'BLUE', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'MODBUS master +', notes: 'SCADA interface' },
          { terminal: 'C5', label: 'RS485-', function: 'MODBUS B line', wireColor: 'YELLOW/BLACK', wireGauge: '0.75mm² / 20 AWG TP', connectTo: 'MODBUS master -', notes: '120Ω at ends' }
        ]
      }
    ],
    schematicNotes: [
      'Terminal designations match equipment service manual conventions',
      'All outputs rated for continuous industrial duty cycle',
      'Analog inputs accept 4-20mA or resistive sensors with software selection',
      'J1939 CAN interface supports automatic engine parameter acquisition',
      'EMC compliance requires proper cable segregation'
    ],
    installationTips: [
      'Use crimp terminals rated for vibration environments',
      'Apply thread-locking compound to terminal screws',
      'Protect controller from direct water spray and excessive dust',
      'Allow adequate ventilation around controller housing',
      'Ground all cable shields at single point only',
      'Document all wiring changes in equipment maintenance log'
    ]
  },
  'datakom-d700': {
    modelId: 'datakom-d700',
    modelName: 'D-700 Series Controller',
    overview: 'Digital automation controller wiring guide for AMF and manual start applications. The D-700 provides comprehensive monitoring, protection, and control with modern digital interface and communication capabilities.',
    safetyWarnings: [
      'All connections must be made with power disconnected',
      'AC voltage sensing requires appropriate fuse protection',
      'CT circuits must not be open-circuited under load',
      'Emergency stop must function independently of controller'
    ],
    powerRequirements: {
      voltage: '8-35V DC continuous',
      current: '2A normal, 5A peak during cranking',
      fusing: '10A DC fuse required',
      grounding: 'Connect chassis ground to generator frame'
    },
    sections: [
      {
        section: 'Power Supply',
        description: 'DC power input connections.',
        terminals: [
          { terminal: '1', label: 'DC+', function: 'Positive supply input', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery + via fuse', notes: '8-35V DC range' },
          { terminal: '2', label: 'DC-', function: 'Negative / Ground', wireColor: 'BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery negative', notes: 'System ground' }
        ]
      },
      {
        section: 'Engine Control',
        description: 'Start, stop, and fuel control outputs.',
        terminals: [
          { terminal: '3', label: 'START', function: 'Starter solenoid output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid', notes: '10A max' },
          { terminal: '4', label: 'FUEL', function: 'Fuel solenoid output', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid +', notes: 'Run enable' },
          { terminal: '5', label: 'STOP', function: 'Stop solenoid output', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Stop solenoid', notes: 'For separate stop' },
          { terminal: '6', label: 'PREHEAT', function: 'Glow plug output', wireColor: 'PINK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Glow plug relay', notes: 'Timed output' }
        ]
      },
      {
        section: 'Speed Sensor',
        description: 'Magnetic pickup connections.',
        terminals: [
          { terminal: '7', label: 'MPU+', function: 'Speed sensor positive', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU sensor +', notes: 'Shielded cable' },
          { terminal: '8', label: 'MPU-', function: 'Speed sensor negative', wireColor: 'WHITE/BLACK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU sensor -', notes: 'Isolated return' }
        ]
      },
      {
        section: 'Analog Sensors',
        description: 'Engine monitoring inputs.',
        terminals: [
          { terminal: '9', label: 'OIL P', function: 'Oil pressure sender', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil pressure sender', notes: '10-180Ω' },
          { terminal: '10', label: 'TEMP', function: 'Coolant temperature', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Temp NTC sensor', notes: '40-4700Ω' },
          { terminal: '11', label: 'FUEL', function: 'Fuel level sender', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Fuel level sender', notes: 'Resistive type' },
          { terminal: '12', label: 'SEN-', function: 'Sensor ground', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Sensor common', notes: 'Star point' }
        ]
      },
      {
        section: 'Generator Voltage',
        description: 'AC voltage measurement.',
        terminals: [
          { terminal: '13', label: 'GEN L1', function: 'Generator phase A', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L1 via fuse', notes: '2A fuse' },
          { terminal: '14', label: 'GEN L2', function: 'Generator phase B', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L2 via fuse', notes: 'Optional' },
          { terminal: '15', label: 'GEN L3', function: 'Generator phase C', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L3 via fuse', notes: '3-phase' },
          { terminal: '16', label: 'GEN N', function: 'Generator neutral', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen neutral', notes: 'Reference' }
        ]
      },
      {
        section: 'Current Transformers',
        description: 'CT connections for metering.',
        terminals: [
          { terminal: '17', label: 'CT1 S1', function: 'CT1 start', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 S1', notes: '5A secondary' },
          { terminal: '18', label: 'CT1 S2', function: 'CT1 finish', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 S2', notes: 'Polarity critical' },
          { terminal: '19', label: 'CT2 S1', function: 'CT2 start', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 S1', notes: 'Match ratios' },
          { terminal: '20', label: 'CT2 S2', function: 'CT2 finish', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 S2', notes: 'Never open CT' },
          { terminal: '21', label: 'CT3 S1', function: 'CT3 start', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 S1', notes: 'Class 1 CT' },
          { terminal: '22', label: 'CT3 S2', function: 'CT3 finish', wireColor: 'BLUE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 S2', notes: 'Common S2' }
        ]
      },
      {
        section: 'Mains Sensing',
        description: 'Utility voltage monitoring.',
        terminals: [
          { terminal: '23', label: 'MAINS L1', function: 'Mains phase A', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains L1 via fuse', notes: 'AMF sensing' },
          { terminal: '24', label: 'MAINS L2', function: 'Mains phase B', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains L2 via fuse', notes: 'Phase fail' },
          { terminal: '25', label: 'MAINS L3', function: 'Mains phase C', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains L3 via fuse', notes: 'Full monitoring' },
          { terminal: '26', label: 'MAINS N', function: 'Mains neutral', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains neutral', notes: 'Reference' }
        ]
      },
      {
        section: 'Digital Inputs',
        description: 'Switch inputs for control and protection.',
        terminals: [
          { terminal: '27', label: 'DI1', function: 'Emergency stop', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'E-stop NC', notes: 'Fail-safe' },
          { terminal: '28', label: 'DI2', function: 'Remote start', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Start request', notes: 'Contact input' },
          { terminal: '29', label: 'DI3', function: 'High temp switch', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Temp switch NO', notes: 'Backup prot' },
          { terminal: '30', label: 'DI4', function: 'Low oil switch', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil switch NC', notes: 'Opens w/press' },
          { terminal: '31', label: 'DI COM', function: 'Input common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Switch common', notes: 'Ground ref' }
        ]
      },
      {
        section: 'Relay Outputs',
        description: 'Alarm and control outputs.',
        terminals: [
          { terminal: '32', label: 'RO1 NO', function: 'Common alarm', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm horn', notes: '8A contact' },
          { terminal: '33', label: 'RO1 COM', function: 'Relay 1 common', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm supply', notes: 'Any alarm' },
          { terminal: '34', label: 'RO2 NO', function: 'Running status', wireColor: 'GREEN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Running lamp', notes: 'Engine on' },
          { terminal: '35', label: 'RO2 COM', function: 'Relay 2 common', wireColor: 'GREEN/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Lamp supply', notes: 'Indication' },
          { terminal: '36', label: 'MC-M', function: 'Mains contactor', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Mains coil', notes: 'ATS control' },
          { terminal: '37', label: 'MC-G', function: 'Gen contactor', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen coil', notes: 'Transfer' }
        ]
      },
      {
        section: 'Communication',
        description: 'Serial interface connections.',
        terminals: [
          { terminal: '38', label: 'RS485 A', function: 'MODBUS A line', wireColor: 'BLUE', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Master A+', notes: 'Twisted pair' },
          { terminal: '39', label: 'RS485 B', function: 'MODBUS B line', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Master B-', notes: '120Ω term' },
          { terminal: '40', label: 'RS485 G', function: 'Signal ground', wireColor: 'BLACK', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Bus ground', notes: 'Reference' }
        ]
      }
    ],
    schematicNotes: [
      'Terminal numbers match controller front panel markings',
      'All digital inputs software-configurable as NO or NC',
      'CT polarity affects power factor sign calculation',
      'USB port available for configuration software'
    ],
    installationTips: [
      'Use ferrules on all stranded conductors',
      'Maintain separation between AC and DC wiring',
      'Test all protection functions before handover',
      'Document CT ratios on panel diagram'
    ]
  },
  'lovato-rgk800': {
    modelId: 'lovato-rgk800',
    modelName: 'RGK800 Series Controller',
    overview: 'European industrial generator controller with comprehensive protection and monitoring. The RGK800 series provides professional-grade AMF control suitable for standby and prime power applications.',
    safetyWarnings: [
      'Installation must comply with local electrical codes',
      'High voltage circuits require qualified personnel',
      'All protection settings must be verified before commissioning',
      'Emergency circuits must operate independently'
    ],
    powerRequirements: {
      voltage: '8-35V DC supply range',
      current: '2.5A typical, 6A peak',
      fusing: '10A blade fuse recommended',
      grounding: 'Dedicated ground terminal to chassis'
    },
    sections: [
      {
        section: 'Power Supply',
        description: 'DC power input terminals.',
        terminals: [
          { terminal: 'X1.1', label: '+Vdc', function: 'Positive DC input', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery + via fuse', notes: 'Main power' },
          { terminal: 'X1.2', label: '-Vdc', function: 'Negative DC/Ground', wireColor: 'BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery negative', notes: 'Ground reference' },
          { terminal: 'X1.3', label: 'PE', function: 'Protective earth', wireColor: 'GREEN/YELLOW', wireGauge: '4mm² / 12 AWG', connectTo: 'Generator frame', notes: 'Safety ground' }
        ]
      },
      {
        section: 'Engine Outputs',
        description: 'Engine start and fuel control.',
        terminals: [
          { terminal: 'X2.1', label: 'CRANK', function: 'Starter output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid', notes: '8A max' },
          { terminal: 'X2.2', label: 'FUEL', function: 'Fuel solenoid', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid +', notes: 'Run control' },
          { terminal: 'X2.3', label: 'GLOW', function: 'Preheat output', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Glow plug relay', notes: 'Timed' },
          { terminal: 'X2.4', label: 'OUT-', function: 'Output common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Switched ground', notes: 'Return path' }
        ]
      },
      {
        section: 'Speed Input',
        description: 'Engine RPM measurement.',
        terminals: [
          { terminal: 'X3.1', label: 'W+', function: 'MPU signal +', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU sensor +', notes: 'Shielded' },
          { terminal: 'X3.2', label: 'W-', function: 'MPU signal -', wireColor: 'BLACK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU sensor -', notes: 'Twisted pair' }
        ]
      },
      {
        section: 'Analog Inputs',
        description: 'Engine sensor connections.',
        terminals: [
          { terminal: 'X4.1', label: 'POIL', function: 'Oil pressure', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil sender', notes: 'VDO type' },
          { terminal: 'X4.2', label: 'TEMP', function: 'Temperature', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'NTC sensor', notes: '40-4700Ω' },
          { terminal: 'X4.3', label: 'FUEL', function: 'Fuel level', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Level sender', notes: 'Resistive' },
          { terminal: 'X4.4', label: 'GND', function: 'Sensor ground', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Sensor common', notes: 'Star point' }
        ]
      },
      {
        section: 'Generator AC',
        description: 'Generator voltage/current measurement.',
        terminals: [
          { terminal: 'X5.1', label: 'L1', function: 'Gen phase A', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L1 fused', notes: '2A fuse' },
          { terminal: 'X5.2', label: 'L2', function: 'Gen phase B', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L2 fused', notes: '3-phase' },
          { terminal: 'X5.3', label: 'L3', function: 'Gen phase C', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L3 fused', notes: 'Full metering' },
          { terminal: 'X5.4', label: 'N', function: 'Gen neutral', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen neutral', notes: 'L-N ref' },
          { terminal: 'X5.5', label: 'I1', function: 'CT1 input', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 secondary', notes: '5A CT' },
          { terminal: 'X5.6', label: 'I2', function: 'CT2 input', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 secondary', notes: 'Match ratios' },
          { terminal: 'X5.7', label: 'I3', function: 'CT3 input', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 secondary', notes: 'Common S2' },
          { terminal: 'X5.8', label: 'COM', function: 'CT common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT S2 common', notes: 'Star point' }
        ]
      },
      {
        section: 'Mains AC',
        description: 'Utility supply monitoring.',
        terminals: [
          { terminal: 'X6.1', label: 'ML1', function: 'Mains L1', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains L1 fused', notes: 'Upstream' },
          { terminal: 'X6.2', label: 'ML2', function: 'Mains L2', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains L2 fused', notes: 'Phase fail' },
          { terminal: 'X6.3', label: 'ML3', function: 'Mains L3', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains L3 fused', notes: 'Rotation' },
          { terminal: 'X6.4', label: 'MN', function: 'Mains N', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains neutral', notes: 'Reference' }
        ]
      },
      {
        section: 'Digital Inputs',
        description: 'Protection and control inputs.',
        terminals: [
          { terminal: 'X7.1', label: 'I1', function: 'Emergency stop', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'E-stop NC', notes: 'Fail-safe' },
          { terminal: 'X7.2', label: 'I2', function: 'Remote start', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Start signal', notes: 'BMS/PLC' },
          { terminal: 'X7.3', label: 'I3', function: 'High temp', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Temp switch', notes: 'Backup' },
          { terminal: 'X7.4', label: 'I4', function: 'Low oil', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil switch', notes: 'Protection' },
          { terminal: 'X7.5', label: 'COM', function: 'Input common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Switch common', notes: 'Reference' }
        ]
      },
      {
        section: 'Relay Outputs',
        description: 'Control and alarm outputs.',
        terminals: [
          { terminal: 'X8.1', label: 'KM', function: 'Mains contactor', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Mains MC coil', notes: 'ATS' },
          { terminal: 'X8.2', label: 'KG', function: 'Gen contactor', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen MC coil', notes: 'Transfer' },
          { terminal: 'X8.3', label: 'ALM', function: 'Alarm output', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm device', notes: 'Common' },
          { terminal: 'X8.4', label: 'RUN', function: 'Running output', wireColor: 'GREEN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Run indicator', notes: 'Status' },
          { terminal: 'X8.5', label: 'COM', function: 'Relay common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Coil supply', notes: '+ve or -ve' }
        ]
      },
      {
        section: 'Communication',
        description: 'RS485 MODBUS interface.',
        terminals: [
          { terminal: 'X9.1', label: 'A', function: 'RS485 A+', wireColor: 'BLUE', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Bus A line', notes: 'Twisted pair' },
          { terminal: 'X9.2', label: 'B', function: 'RS485 B-', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Bus B line', notes: '120Ω term' },
          { terminal: 'X9.3', label: 'GND', function: 'Signal ground', wireColor: 'BLACK', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Bus ground', notes: 'Reference' }
        ]
      }
    ],
    schematicNotes: [
      'X-series connector numbers per European convention',
      'All outputs are NPN (switching to ground)',
      'Phase sequence L1-L2-L3 must match for protection',
      'Isolated RS485 port for SCADA connection'
    ],
    installationTips: [
      'Use DIN rail mounting for panel installation',
      'Observe maximum cable lengths for sensors',
      'Test transfer sequence before handover',
      'Configure network address for MODBUS'
    ]
  },
  'siemens-sicam': {
    modelId: 'siemens-sicam',
    modelName: 'SICAM Series Controller',
    overview: 'Industrial automation controller for generator and power management applications. SICAM series provides enterprise-grade monitoring, protection, and integration with building management systems.',
    safetyWarnings: [
      'Industrial control system - qualified personnel only',
      'Follow all local electrical codes and standards',
      'Test all protection functions before energizing',
      'Backup critical parameters before firmware updates'
    ],
    powerRequirements: {
      voltage: '24V DC nominal (19-32V range)',
      current: '3A continuous, 8A peak',
      fusing: '10A at supply',
      grounding: 'Functional earth required for EMC'
    },
    sections: [
      {
        section: 'Power Supply',
        description: 'DC power input terminals.',
        terminals: [
          { terminal: 'L+', label: 'DC Positive', function: '24V DC input', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Power supply +', notes: '24V nominal' },
          { terminal: 'M', label: 'DC Negative', function: 'DC common/ground', wireColor: 'BLUE', wireGauge: '4mm² / 12 AWG', connectTo: 'Power supply -', notes: 'System reference' },
          { terminal: 'PE', label: 'Earth', function: 'Protective earth', wireColor: 'GREEN/YELLOW', wireGauge: '4mm² / 12 AWG', connectTo: 'Earth busbar', notes: 'Safety ground' }
        ]
      },
      {
        section: 'Digital Outputs',
        description: 'Relay and transistor outputs.',
        terminals: [
          { terminal: 'Q0.0', label: 'START', function: 'Starter relay', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid', notes: '2A output' },
          { terminal: 'Q0.1', label: 'FUEL', function: 'Fuel control', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid', notes: 'Run enable' },
          { terminal: 'Q0.2', label: 'GLOW', function: 'Preheat output', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Glow relay', notes: 'Timer controlled' },
          { terminal: 'Q0.3', label: 'MC-M', function: 'Mains contactor', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'MC coil', notes: 'ATS mains' },
          { terminal: 'Q0.4', label: 'MC-G', function: 'Gen contactor', wireColor: 'GREY', wireGauge: '2.5mm² / 14 AWG', connectTo: 'GC coil', notes: 'ATS gen' },
          { terminal: 'Q0.5', label: 'ALARM', function: 'Common alarm', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm relay', notes: 'Fault output' },
          { terminal: 'Q0.6', label: 'RUN', function: 'Running status', wireColor: 'GREEN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Run indicator', notes: 'Engine on' },
          { terminal: 'Q0.7', label: 'AUX', function: 'Spare output', wireColor: 'BROWN', wireGauge: '2.5mm² / 14 AWG', connectTo: 'User defined', notes: 'Programmable' }
        ]
      },
      {
        section: 'Digital Inputs',
        description: 'Status and protection inputs.',
        terminals: [
          { terminal: 'I0.0', label: 'E-STOP', function: 'Emergency stop', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'E-stop NC contact', notes: 'Safety input' },
          { terminal: 'I0.1', label: 'START', function: 'Start request', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Start pushbutton', notes: 'Momentary' },
          { terminal: 'I0.2', label: 'STOP', function: 'Stop request', wireColor: 'ORANGE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Stop pushbutton', notes: 'Momentary' },
          { terminal: 'I0.3', label: 'AUTO', function: 'Auto mode select', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Mode selector', notes: 'Auto enable' },
          { terminal: 'I0.4', label: 'HI-TEMP', function: 'High temperature', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Temp switch NO', notes: 'Backup prot' },
          { terminal: 'I0.5', label: 'LO-OIL', function: 'Low oil pressure', wireColor: 'PINK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil switch NC', notes: 'Opens w/press' },
          { terminal: 'I0.6', label: 'ATS-FB', function: 'ATS feedback', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'ATS aux contact', notes: 'Position conf' },
          { terminal: 'I0.7', label: 'AUX', function: 'Spare input', wireColor: 'GREY', wireGauge: '1.0mm² / 18 AWG', connectTo: 'User defined', notes: 'Configurable' },
          { terminal: 'M-DI', label: 'DI Common', function: 'Input common', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'All switch returns', notes: 'Ground ref' }
        ]
      },
      {
        section: 'Analog Inputs',
        description: 'Sensor measurement inputs.',
        terminals: [
          { terminal: 'AI0', label: 'OIL-P', function: 'Oil pressure', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Pressure sender', notes: '4-20mA' },
          { terminal: 'AI1', label: 'TEMP', function: 'Temperature', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Temp sensor', notes: 'PT100/NTC' },
          { terminal: 'AI2', label: 'FUEL', function: 'Fuel level', wireColor: 'YELLOW', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Level sender', notes: '4-20mA' },
          { terminal: 'AI3', label: 'SPEED', function: 'Speed input', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU sensor', notes: 'Frequency' },
          { terminal: 'M-AI', label: 'AI Common', function: 'Analog ground', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Sensor ground', notes: 'Star point' }
        ]
      },
      {
        section: 'AC Measurement',
        description: 'Generator voltage and current.',
        terminals: [
          { terminal: 'U1', label: 'Gen L1', function: 'Phase A voltage', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L1 via fuse', notes: '2A HRC' },
          { terminal: 'U2', label: 'Gen L2', function: 'Phase B voltage', wireColor: 'BLACK', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L2 via fuse', notes: '3-phase' },
          { terminal: 'U3', label: 'Gen L3', function: 'Phase C voltage', wireColor: 'GREY', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L3 via fuse', notes: 'Sequence' },
          { terminal: 'N', label: 'Neutral', function: 'Neutral reference', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen neutral', notes: 'L-N meas' },
          { terminal: 'I1+', label: 'CT1 S1', function: 'CT phase A +', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 S1', notes: '5A sec' },
          { terminal: 'I1-', label: 'CT1 S2', function: 'CT phase A -', wireColor: 'RED/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT1 S2', notes: 'Polarity' },
          { terminal: 'I2+', label: 'CT2 S1', function: 'CT phase B +', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 S1', notes: 'Match ratio' },
          { terminal: 'I2-', label: 'CT2 S2', function: 'CT phase B -', wireColor: 'YELLOW/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT2 S2', notes: 'Direction' },
          { terminal: 'I3+', label: 'CT3 S1', function: 'CT phase C +', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 S1', notes: 'Class 0.5' },
          { terminal: 'I3-', label: 'CT3 S2', function: 'CT phase C -', wireColor: 'BLUE/BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'CT3 S2', notes: 'Common pt' }
        ]
      },
      {
        section: 'Communication',
        description: 'Network and serial ports.',
        terminals: [
          { terminal: 'ETH1', label: 'Ethernet', function: 'Network port', wireColor: 'CAT5/6', wireGauge: 'RJ45', connectTo: 'Network switch', notes: 'MODBUS TCP' },
          { terminal: 'RS485-A', label: 'Data A', function: 'RS485 A line', wireColor: 'BLUE', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Bus A terminal', notes: 'Twisted pair' },
          { terminal: 'RS485-B', label: 'Data B', function: 'RS485 B line', wireColor: 'YELLOW', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Bus B terminal', notes: '120Ω each end' },
          { terminal: 'RS485-G', label: 'GND', function: 'Signal ground', wireColor: 'BLACK', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Bus ground', notes: 'Reference' }
        ]
      }
    ],
    schematicNotes: [
      'Follows IEC 61131 I/O addressing convention',
      'All analog inputs factory-configurable for different sensor types',
      'Ethernet port supports MODBUS TCP and proprietary protocols',
      'Web server interface for remote configuration'
    ],
    installationTips: [
      'Mount on DIN rail in ventilated enclosure',
      'Use shielded cables for all analog signals',
      'Configure IP address before connecting to network',
      'Backup configuration after commissioning'
    ]
  },
  'enko-gcu300': {
    modelId: 'enko-gcu300',
    modelName: 'GCU-300 Series Controller',
    overview: 'Compact and economical generator controller for smaller standby applications. The GCU-300 provides essential AMF functionality with straightforward wiring and configuration.',
    safetyWarnings: [
      'Disconnect all power before wiring',
      'Observe maximum current ratings',
      'Test E-stop function before commissioning',
      'Verify all protection setpoints'
    ],
    powerRequirements: {
      voltage: '8-35V DC',
      current: '1.5A typical, 3A peak',
      fusing: '5A fuse recommended',
      grounding: 'Connect ground terminal to chassis'
    },
    sections: [
      {
        section: 'Power Input',
        description: 'DC supply connections.',
        terminals: [
          { terminal: '1', label: 'B+', function: 'Battery positive', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Battery + via fuse', notes: '8-35V DC' },
          { terminal: '2', label: 'B-', function: 'Battery negative', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Battery negative', notes: 'Ground' }
        ]
      },
      {
        section: 'Engine Control',
        description: 'Start and fuel outputs.',
        terminals: [
          { terminal: '3', label: 'CRANK', function: 'Starter output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid', notes: '5A max' },
          { terminal: '4', label: 'FUEL', function: 'Fuel solenoid', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid +', notes: 'Run enable' },
          { terminal: '5', label: 'GLOW', function: 'Preheat output', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Glow relay', notes: 'Optional' }
        ]
      },
      {
        section: 'Speed Sensor',
        description: 'Engine speed input.',
        terminals: [
          { terminal: '6', label: 'MPU+', function: 'Speed sensor +', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU positive', notes: 'Shielded' },
          { terminal: '7', label: 'MPU-', function: 'Speed sensor -', wireColor: 'BLACK', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU negative', notes: 'Return' }
        ]
      },
      {
        section: 'Sensors',
        description: 'Engine monitoring.',
        terminals: [
          { terminal: '8', label: 'OIL', function: 'Oil pressure', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil sender', notes: 'Resistive' },
          { terminal: '9', label: 'TEMP', function: 'Temperature', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Temp NTC', notes: '40-4700Ω' },
          { terminal: '10', label: 'SEN-', function: 'Sensor ground', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Sensor common', notes: 'Star' }
        ]
      },
      {
        section: 'AC Voltage',
        description: 'Generator monitoring.',
        terminals: [
          { terminal: '11', label: 'GEN L', function: 'Gen phase', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen L1 via fuse', notes: 'Single ph' },
          { terminal: '12', label: 'GEN N', function: 'Gen neutral', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen neutral', notes: 'Reference' },
          { terminal: '13', label: 'MAINS L', function: 'Mains phase', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains L via fuse', notes: 'AMF sense' },
          { terminal: '14', label: 'MAINS N', function: 'Mains neutral', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Mains neutral', notes: 'Reference' }
        ]
      },
      {
        section: 'Inputs',
        description: 'Digital inputs.',
        terminals: [
          { terminal: '15', label: 'E-STOP', function: 'Emergency stop', wireColor: 'RED', wireGauge: '1.0mm² / 18 AWG', connectTo: 'E-stop NC', notes: 'Fail-safe' },
          { terminal: '16', label: 'REMOTE', function: 'Remote start', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Start signal', notes: 'BMS input' },
          { terminal: '17', label: 'IN-COM', function: 'Input common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Switch common', notes: 'Ground' }
        ]
      },
      {
        section: 'Outputs',
        description: 'Relay outputs.',
        terminals: [
          { terminal: '18', label: 'MC-M', function: 'Mains contactor', wireColor: 'VIOLET', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Mains coil', notes: 'ATS' },
          { terminal: '19', label: 'MC-G', function: 'Gen contactor', wireColor: 'ORANGE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Gen coil', notes: 'Transfer' },
          { terminal: '20', label: 'ALARM', function: 'Common alarm', wireColor: 'RED', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Alarm device', notes: 'Any fault' },
          { terminal: '21', label: 'OUT-COM', function: 'Output common', wireColor: 'BLACK', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Coil supply', notes: 'Switched' }
        ]
      }
    ],
    schematicNotes: [
      'Compact terminal layout for small enclosures',
      'Single-phase monitoring only - use external protection for 3-phase',
      'Built-in timers for start delay and transfer delay',
      'LED indicators show operating status'
    ],
    installationTips: [
      'Suitable for generators up to 50kVA',
      'Keep wiring runs short where possible',
      'Use ring terminals for secure connections',
      'Test AMF sequence with simulated mains fail'
    ]
  },
  'vodia-5': {
    modelId: 'vodia-5',
    modelName: 'VODIA5 Diagnostic Interface',
    overview: 'Marine and industrial engine diagnostic interface for electronic engine communication. VODIA5 connects to engine ECMs for parameter monitoring, fault code reading, and diagnostic functions via laptop software.',
    safetyWarnings: [
      'For diagnostic use only - not a standalone controller',
      'Connect only to compatible engine ECMs',
      'Do not leave connected during engine operation unless monitoring',
      'Follow all engine manufacturer diagnostic procedures'
    ],
    powerRequirements: {
      voltage: '12V or 24V DC from engine electrical system',
      current: '0.5A maximum',
      fusing: 'Protected by engine fuse circuit',
      grounding: 'Via diagnostic connector ground pin'
    },
    sections: [
      {
        section: 'Diagnostic Connector',
        description: 'Engine ECM diagnostic port connections.',
        terminals: [
          { terminal: 'Pin 1', label: 'CAN-H', function: 'J1939 CAN High', wireColor: 'YELLOW', wireGauge: 'Diagnostic cable', connectTo: 'ECM CAN-H pin', notes: 'Standard J1939' },
          { terminal: 'Pin 2', label: 'CAN-L', function: 'J1939 CAN Low', wireColor: 'GREEN', wireGauge: 'Diagnostic cable', connectTo: 'ECM CAN-L pin', notes: '250kbps' },
          { terminal: 'Pin 3', label: 'GND', function: 'Signal ground', wireColor: 'BLACK', wireGauge: 'Diagnostic cable', connectTo: 'ECM ground pin', notes: 'Reference' },
          { terminal: 'Pin 4', label: '+12/24V', function: 'Power input', wireColor: 'RED', wireGauge: 'Diagnostic cable', connectTo: 'ECM power pin', notes: 'From engine' },
          { terminal: 'Pin 5', label: 'K-LINE', function: 'ISO 9141 data', wireColor: 'WHITE', wireGauge: 'Diagnostic cable', connectTo: 'ECM K-line', notes: 'Legacy protocol' },
          { terminal: 'Pin 6', label: 'L-LINE', function: 'ISO 9141 init', wireColor: 'GREY', wireGauge: 'Diagnostic cable', connectTo: 'ECM L-line', notes: 'Initialization' }
        ]
      },
      {
        section: 'USB Interface',
        description: 'Connection to diagnostic laptop.',
        terminals: [
          { terminal: 'USB', label: 'USB Port', function: 'PC connection', wireColor: 'USB cable', wireGauge: 'Type A/B', connectTo: 'Laptop USB port', notes: 'Driver required' }
        ]
      },
      {
        section: 'Auxiliary Port',
        description: 'Optional auxiliary connections.',
        terminals: [
          { terminal: 'AUX1', label: 'Aux CAN-H', function: 'Secondary CAN High', wireColor: 'YELLOW/WHITE', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Secondary ECM', notes: 'Multi-ECM' },
          { terminal: 'AUX2', label: 'Aux CAN-L', function: 'Secondary CAN Low', wireColor: 'GREEN/WHITE', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Secondary ECM', notes: 'Dual engine' },
          { terminal: 'AUX3', label: 'Aux GND', function: 'Auxiliary ground', wireColor: 'BLACK', wireGauge: '0.75mm² / 20 AWG', connectTo: 'Common ground', notes: 'Shield drain' }
        ]
      }
    ],
    schematicNotes: [
      'Software-based diagnostic interface - not hardwired controller',
      'J1939 protocol for most modern marine and industrial engines',
      'K-line support for older engine ECM types',
      'USB driver installation required before first use'
    ],
    installationTips: [
      'Use official diagnostic cable for reliable connection',
      'Install diagnostic software before connecting hardware',
      'Keep diagnostic cable away from high-current conductors',
      'Store interface in protective case when not in use'
    ]
  }
};

// Default wiring diagram for models without specific diagrams
const DEFAULT_WIRING_DIAGRAM: WiringDiagram = {
  modelId: 'default',
  modelName: 'Generic Controller',
  overview: 'Standard wiring reference for generator controller installation. This generic guide covers typical terminal connections found on most AMF controllers. Always refer to the specific controller manual for exact terminal designations.',
  safetyWarnings: [
    'Disconnect all power sources before making connections',
    'Use correct wire gauges for current ratings',
    'Test all protection functions before commissioning',
    'Emergency stop circuits must operate independently'
  ],
  powerRequirements: {
    voltage: '8-35V DC typical',
    current: '2-5A depending on model',
    fusing: '10A fuse recommended',
    grounding: 'Connect chassis ground to generator frame'
  },
  sections: [
    {
      section: 'DC Power Supply',
      description: 'Battery power connections.',
      terminals: [
        { terminal: 'B+', label: 'Battery +', function: 'Positive DC supply', wireColor: 'RED', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery + via fuse', notes: 'Main power' },
        { terminal: 'B-', label: 'Battery -', function: 'Negative / Ground', wireColor: 'BLACK', wireGauge: '4mm² / 12 AWG', connectTo: 'Battery negative', notes: 'Ground ref' }
      ]
    },
    {
      section: 'Engine Control',
      description: 'Basic engine outputs.',
      terminals: [
        { terminal: 'START', label: 'Starter', function: 'Crank motor output', wireColor: 'YELLOW', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Starter solenoid', notes: 'Cranking' },
        { terminal: 'FUEL', label: 'Fuel', function: 'Fuel solenoid', wireColor: 'BLUE', wireGauge: '2.5mm² / 14 AWG', connectTo: 'Fuel solenoid +', notes: 'Run enable' }
      ]
    },
    {
      section: 'Sensors',
      description: 'Engine monitoring inputs.',
      terminals: [
        { terminal: 'MPU', label: 'Speed', function: 'Speed sensor', wireColor: 'WHITE', wireGauge: '1.0mm² / 18 AWG', connectTo: 'MPU sensor', notes: 'Shielded' },
        { terminal: 'OIL', label: 'Oil Press', function: 'Oil pressure', wireColor: 'BROWN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Oil sender', notes: 'Resistive' },
        { terminal: 'TEMP', label: 'Coolant', function: 'Temperature', wireColor: 'GREEN', wireGauge: '1.0mm² / 18 AWG', connectTo: 'Temp NTC', notes: '40-4700Ω' }
      ]
    },
    {
      section: 'Generator AC',
      description: 'AC voltage monitoring.',
      terminals: [
        { terminal: 'GEN L', label: 'Gen Phase', function: 'Generator voltage', wireColor: 'BROWN', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen output via fuse', notes: '2A fuse' },
        { terminal: 'GEN N', label: 'Gen Neutral', function: 'Neutral reference', wireColor: 'BLUE', wireGauge: '1.5mm² / 16 AWG', connectTo: 'Gen neutral', notes: 'Reference' }
      ]
    }
  ],
  schematicNotes: [
    'Terminal labels may vary by manufacturer',
    'Always verify against specific controller manual',
    'Wire colors may differ by regional standards'
  ],
  installationTips: [
    'Label all wires at both ends',
    'Use ferrules on stranded conductors',
    'Test before energizing generator'
  ]
};

// Helper function to get wiring diagram
function getWiringDiagram(modelId: string): WiringDiagram {
  return WIRING_DIAGRAMS[modelId] || DEFAULT_WIRING_DIAGRAM;
}

const CONTROLLER_DATASHEETS: Record<string, {
  overview: string;
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  inputsOutputs: { inputs: string[]; outputs: string[] };
  communication: string[];
  protection: string[];
}> = {
  'dse-7320': {
    overview: 'The Model 7320 Series represents an advanced automatic mains failure (AMF) controller engineered for single generating set applications demanding comprehensive monitoring, protection, and control capabilities. This intelligent controller features a high-resolution backlit LCD display providing clear visualization of all critical engine and electrical parameters. The unit seamlessly integrates with modern building management systems through multiple industry-standard communication protocols.',
    features: [
      'High-resolution 320x240 pixel backlit LCD display with adjustable contrast',
      'Comprehensive event logging with 250+ timestamped entries',
      'Multi-language support including English, Spanish, French, German, Italian, Portuguese',
      'Fully configurable alarm setpoints and timer values',
      'Remote start/stop capability via digital inputs or communication interface',
      'Integrated battery charging with selectable boost and float voltages',
      'Automatic exercise scheduling with programmable day/time/duration',
      'True RMS measurement for all electrical parameters',
      'USB port for configuration backup and firmware updates',
      'Front panel editor for all parameters without PC software'
    ],
    specifications: {
      'Operating Voltage': '8 to 35 Volts DC (Continuous)',
      'Power Consumption': 'Less than 10 Watts typical',
      'Display Type': '320 x 240 pixel graphic LCD with LED backlight',
      'Operating Temperature': '-20°C to +70°C',
      'Storage Temperature': '-30°C to +80°C',
      'Humidity Range': '95% relative humidity (non-condensing)',
      'Protection Rating': 'IP65 (front panel when correctly installed)',
      'Panel Dimensions': '240mm x 181mm x 52mm (W x H x D)',
      'Panel Cutout': '220mm x 160mm',
      'Unit Weight': '850 grams approximately',
      'CT Ratio Range': '1A or 5A secondary (configurable)',
      'Voltage Sensing': '15 to 333V AC (phase to neutral)',
      'Frequency Range': '3.5Hz to 75Hz measurement capability'
    },
    applications: [
      'Standby power systems for commercial buildings',
      'Prime power installations in remote locations',
      'Construction site temporary power',
      'Telecommunications infrastructure backup',
      'Hospital and healthcare facility emergency power',
      'Data center uninterruptible power systems',
      'Agricultural and farming operations',
      'Water treatment and pumping stations'
    ],
    inputsOutputs: {
      inputs: [
        '8x Configurable digital inputs (voltage-free contact or positive active)',
        '5x Configurable analog inputs (4-20mA, 0-10V, or resistive)',
        '2x Magnetic pickup inputs for speed and frequency sensing',
        '1x Resistive fuel level sender input',
        'Current transformer inputs for 3-phase current measurement',
        'Voltage sensing inputs for generator and mains monitoring'
      ],
      outputs: [
        '8x Configurable relay outputs (rated 16A resistive at 30VDC)',
        '2x PWM outputs for electronic actuator control',
        '1x Configurable analog output (4-20mA)',
        '7x LED status indicators (configurable functions)',
        'Fuel solenoid output with diagnostic feedback',
        'Start motor output with cranking protection'
      ]
    },
    communication: [
      'RS232 serial port for direct PC connection',
      'RS485 MODBUS RTU for SCADA integration',
      'CAN J1939 interface for electronic engine communication',
      'Optional Ethernet module for MODBUS TCP/IP',
      'Optional GSM modem for SMS alarm notification',
      'USB type B device port for configuration'
    ],
    protection: [
      'Generator over-voltage and under-voltage',
      'Generator over-frequency and under-frequency',
      'Overcurrent and earth fault protection',
      'Reverse power and loss of excitation',
      'Loss of speed sensing signal',
      'High coolant temperature shutdown',
      'Low oil pressure shutdown',
      'Overspeed protection',
      'Fail to start protection',
      'Fail to stop protection',
      'Low fuel level warning and shutdown',
      'Battery under-voltage and over-voltage',
      'Charge alternator failure warning',
      'Emergency stop input'
    ]
  },
  'comap-inteligen': {
    overview: 'The InteliGen Series controller provides professional-grade parallel generation control with advanced load sharing and synchronization capabilities. Designed for complex multi-generator installations, this controller ensures optimal power distribution, load management, and system reliability for the most demanding applications including data centers, hospitals, and industrial facilities.',
    features: [
      'Automatic synchronization with voltage and phase matching',
      'Real and reactive power load sharing with configurable droop',
      'Import/export power management for utility parallel operation',
      'Priority-based automatic load shedding',
      'Multi-generator parallel operation up to 32 units',
      'Mains parallel capability with reverse power protection',
      'Integrated PLC functionality with ladder logic programming',
      'Comprehensive data trending and historical logging'
    ],
    specifications: {
      'Operating Voltage': '8 to 36 Volts DC',
      'Power Consumption': 'Less than 15 Watts',
      'Display Type': '240 x 128 pixel graphic LCD',
      'Operating Temperature': '-30°C to +70°C',
      'Dimensions': '245mm x 184mm x 58mm',
      'Protection Rating': 'IP65 front panel'
    },
    applications: [
      'Data center critical power systems',
      'Hospital emergency power networks',
      'Industrial manufacturing facilities',
      'Mining and extraction operations',
      'Marine vessel power management',
      'Utility peaking and grid support'
    ],
    inputsOutputs: {
      inputs: ['8x Binary inputs', '5x Analog inputs', 'CT inputs for current', 'Voltage sensing inputs'],
      outputs: ['8x Binary relay outputs', '2x Analog outputs', 'Synchronization relay', 'Load sharing outputs']
    },
    communication: ['Dual RS232 ports', 'RS485 MODBUS', 'CAN J1939', 'Ethernet TCP/IP'],
    protection: ['Full generator protection', 'Reverse power', 'Vector shift', 'ROCOF', 'Differential protection']
  },
  'woodward-easygen3000': {
    overview: 'The easYgen 3000 Series delivers versatile generator set control for applications requiring precise speed governing, load control, and comprehensive protection. This controller offers sophisticated governing algorithms combined with extensive I/O and communication capabilities for professional power generation systems worldwide.',
    features: [
      'Integrated isochronous and droop speed control',
      'Automatic synchronization and load sharing',
      'Process control functionality for auxiliary systems',
      'Comprehensive data logging with 100,000+ entries',
      'Remote configuration via Ethernet or serial',
      'Redundant operation support for critical systems',
      'Black start capability for power restoration',
      'Peak shaving and demand response functions'
    ],
    specifications: {
      'Operating Voltage': '8 to 35 Volts DC',
      'Power Consumption': 'Less than 20 Watts',
      'Display Type': '240 x 128 pixel graphic LCD',
      'Operating Temperature': '-40°C to +70°C',
      'Dimensions': '264mm x 192mm x 80mm'
    },
    applications: [
      'Critical facility power systems',
      'Offshore platform generation',
      'Military installation power',
      'Large industrial power plants',
      'Grid support applications'
    ],
    inputsOutputs: {
      inputs: ['16x Configurable inputs', '8x Analog inputs', 'RTD temperature inputs'],
      outputs: ['12x Relay outputs', '4x Analog outputs', 'Governor drive output']
    },
    communication: ['RS232/RS485', 'CAN J1939', 'MODBUS TCP/IP', 'IEC 61850 optional', 'DNP3 optional'],
    protection: ['Complete generator protection', 'Engine protection suite', 'Utility interconnection protection', 'IEEE/ANSI protection functions']
  },
  'smartgen-hgm9320': {
    overview: 'The HGM9320 Series provides comprehensive generator set control with advanced paralleling capabilities in a cost-effective package. Designed for reliability and ease of installation, this controller supports complex power management scenarios while maintaining straightforward configuration and maintenance.',
    features: [
      'Automatic mains failure with configurable timing',
      'Parallel operation with up to 16 generators',
      'Multiple unit synchronization and load sharing',
      'Electronic governor and AVR interface',
      'Comprehensive protection suite',
      'Event logging with trend analysis',
      'Remote monitoring capability',
      'Automatic exercise function'
    ],
    specifications: {
      'Operating Voltage': '8 to 35 Volts DC',
      'Power Consumption': 'Less than 15 Watts',
      'Display Type': '240 x 128 pixel graphic LCD',
      'Operating Temperature': '-25°C to +70°C',
      'Dimensions': '246mm x 186mm x 56mm'
    },
    applications: [
      'Commercial building standby',
      'Industrial facility backup',
      'Water treatment plants',
      'Agricultural operations',
      'Telecommunications sites'
    ],
    inputsOutputs: {
      inputs: ['12x Digital inputs', '4x Analog inputs', 'Speed sensor input'],
      outputs: ['10x Relay outputs', '2x Analog outputs']
    },
    communication: ['RS485 MODBUS RTU', 'CAN interface', 'Optional Ethernet', 'Optional GPRS'],
    protection: ['Generator voltage/frequency', 'Engine temperature/pressure', 'Mains monitoring', 'Load management']
  },
  'powerwizard-20': {
    overview: 'The PowerWizard 2.0 Series controller is engineered for heavy-duty power generation applications requiring robust control, comprehensive monitoring, and reliable operation in demanding environments. With its rugged construction and extensive feature set, this controller excels in industrial and commercial installations.',
    features: [
      'Heavy-duty industrial construction',
      'Electronic engine interface capability',
      'Comprehensive monitoring system',
      'Programmable protection setpoints',
      'Multiple operating modes',
      'Service tool connectivity',
      'Diagnostic troubleshooting',
      'Data trending and logging'
    ],
    specifications: {
      'Operating Voltage': '12 to 32 Volts DC',
      'Power Consumption': 'Less than 25 Watts',
      'Display Type': '240 x 128 pixel graphic LCD',
      'Operating Temperature': '-40°C to +70°C',
      'Dimensions': '305mm x 229mm x 89mm'
    },
    applications: [
      'Mining operations',
      'Oil and gas facilities',
      'Large construction sites',
      'Heavy industrial plants',
      'Rental fleet generators'
    ],
    inputsOutputs: {
      inputs: ['16x Digital inputs', '8x Analog inputs', 'J1939 engine data'],
      outputs: ['12x Relay outputs', '4x Analog outputs']
    },
    communication: ['J1939 CAN bus', 'MODBUS RTU', 'Service tool port', 'Optional Ethernet'],
    protection: ['Complete engine protection', 'Generator protection', 'System protection functions']
  },
  'datakom-d500': {
    overview: 'The D-500 Series controller offers advanced automatic mains failure functionality with user-friendly operation and flexible configuration options. This controller provides reliable power management for diverse generator applications with comprehensive monitoring and protection capabilities.',
    features: [
      'Intuitive menu navigation',
      'Comprehensive measurement display',
      'Flexible configuration options',
      'Multiple language support',
      'Event history logging',
      'Remote access capability',
      'Automatic exercise function',
      'Battery monitoring and charging'
    ],
    specifications: {
      'Operating Voltage': '8 to 35 Volts DC',
      'Power Consumption': 'Less than 10 Watts',
      'Display Type': '128 x 64 pixel graphic LCD',
      'Operating Temperature': '-30°C to +70°C',
      'Dimensions': '172mm x 135mm x 65mm'
    },
    applications: [
      'Commercial standby systems',
      'Telecommunications backup',
      'Small industrial applications',
      'Residential standby'
    ],
    inputsOutputs: {
      inputs: ['6x Digital inputs', '4x Analog inputs'],
      outputs: ['6x Relay outputs']
    },
    communication: ['RS232', 'RS485', 'USB', 'Optional GSM'],
    protection: ['Standard protection functions', 'Configurable alarm setpoints']
  }
};

// Default datasheet for models without specific data
const DEFAULT_DATASHEET = CONTROLLER_DATASHEETS['dse-7320'];

// ==================== AI DIAGNOSTIC ANALYZER ====================
interface DiagnosticResult {
  severity: 'normal' | 'warning' | 'critical';
  parameter: string;
  currentValue: number;
  unit: string;
  expectedRange: string;
  issue: string;
  possibleCauses: string[];
  recommendedActions: string[];
  urgency: string;
  estimatedRepairTime: string;
  partsRequired: string[];
}

function analyzeParameters(sensorValues: Record<string, number>): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];

  Object.entries(sensorValues).forEach(([key, value]) => {
    const param = SENSOR_PARAMETERS[key as keyof typeof SENSOR_PARAMETERS];
    if (!param) return;

    let severity: 'normal' | 'warning' | 'critical' = 'normal';
    let issue = '';
    let possibleCauses: string[] = [];
    let recommendedActions: string[] = [];
    let urgency = 'None';
    let estimatedRepairTime = 'N/A';
    let partsRequired: string[] = [];

    // Check critical conditions
    if (value <= param.criticalLow || value >= param.criticalHigh) {
      severity = 'critical';

      // Oil Pressure Critical Low
      if (key === 'engineOilPressure' && value <= param.criticalLow) {
        issue = 'CRITICAL: Engine oil pressure dangerously low - immediate shutdown required';
        possibleCauses = [
          'Oil pump failure or severe wear',
          'Critically low oil level in sump',
          'Blocked oil filter or pickup tube',
          'Failed oil pressure relief valve',
          'Severe main bearing wear',
          'Oil dilution from coolant or fuel leak',
          'Incorrect oil viscosity for operating temperature'
        ];
        recommendedActions = [
          'IMMEDIATELY SHUT DOWN ENGINE - DO NOT CONTINUE OPERATION',
          'Wait 5 minutes for oil to drain back to sump',
          'Check dipstick oil level - add oil if low',
          'Inspect oil filter for metal particles (indicates internal damage)',
          'Verify oil pressure with calibrated mechanical gauge',
          'If oil level normal, do not restart - internal failure likely',
          'Inspect oil pump drive gear and relief valve',
          'Check for coolant in oil (milky appearance) or fuel smell'
        ];
        urgency = 'IMMEDIATE - Engine damage will occur within seconds';
        estimatedRepairTime = '4-24 hours depending on root cause';
        partsRequired = ['Engine oil', 'Oil filter', 'Oil pump assembly (if failed)', 'Bearing set (if worn)', 'Gasket kit'];
      }
      // Coolant Temperature Critical High
      else if (key === 'coolantTemperature' && value >= param.criticalHigh) {
        issue = 'CRITICAL: Engine severely overheating - thermal damage imminent';
        possibleCauses = [
          'Major coolant leak causing system loss',
          'Water pump impeller failure',
          'Thermostat stuck in closed position',
          'Severely blocked radiator (internal scale or external debris)',
          'Cooling fan failure or broken drive belt',
          'Head gasket blown allowing combustion gas into cooling system',
          'Collapsed or kinked coolant hose'
        ];
        recommendedActions = [
          'REDUCE LOAD TO MINIMUM AND INITIATE CONTROLLED SHUTDOWN',
          'Allow engine to cool for at least 30 minutes before inspection',
          'DO NOT remove radiator cap while hot - risk of burns',
          'Once cool, check coolant level in expansion tank and radiator',
          'Inspect for visible coolant leaks at hoses, water pump, radiator',
          'Check fan belt tension and fan operation',
          'Test thermostat in hot water to verify opens at correct temperature',
          'Pressure test cooling system for leaks',
          'Check for exhaust gases in coolant (head gasket test)'
        ];
        urgency = 'IMMEDIATE - Head gasket and engine damage risk';
        estimatedRepairTime = '2-8 hours for cooling issues, 24+ hours if head gasket';
        partsRequired = ['Coolant/antifreeze', 'Thermostat', 'Radiator hoses', 'Water pump (if failed)', 'Head gasket (if blown)', 'Fan belt'];
      }
      // Battery Voltage Critical Low
      else if (key === 'batteryVoltage' && value <= param.criticalLow) {
        issue = 'CRITICAL: Battery voltage dangerously low - starting impossible';
        possibleCauses = [
          'Battery cell failure or end of battery life',
          'Alternator/charging system complete failure',
          'Severe parasitic drain when engine stopped',
          'Major wiring fault causing discharge',
          'Corroded or loose battery connections',
          'Battery charger malfunction',
          'Shorted battery cell'
        ];
        recommendedActions = [
          'Test battery with load tester - replace if weak',
          'Check alternator output: should be 13.8-14.5V with engine running',
          'Clean and tighten all battery connections',
          'Inspect main power cables for damage or corrosion',
          'Check battery charger operation and settings',
          'Test for parasitic drain with clamp meter (engine off)',
          'Verify ground strap connections to engine and frame'
        ];
        urgency = 'HIGH - Generator cannot start for emergency power';
        estimatedRepairTime = '1-4 hours';
        partsRequired = ['Starting battery', 'Battery cables', 'Alternator/charging alternator (if failed)', 'Battery charger'];
      }
      // Frequency Critical
      else if (key === 'generatorFrequency') {
        if (value <= param.criticalLow) {
          issue = 'CRITICAL: Generator frequency severely low - underfrequency protection active';
          possibleCauses = [
            'Severe overload beyond generator capacity',
            'Governor/actuator failure - cannot increase fuel',
            'Fuel starvation - empty tank or blocked supply',
            'Engine mechanical problem reducing power output',
            'Speed sensor signal loss or error',
            'Air filter severely restricted'
          ];
          recommendedActions = [
            'Shed non-critical loads immediately',
            'Check fuel level and supply line for blockages',
            'Inspect air filter - replace if dirty',
            'Verify governor actuator responds to commands',
            'Check engine RPM matches frequency (50Hz = 1500RPM for 4-pole)',
            'Inspect speed sensor and wiring'
          ];
        } else {
          issue = 'CRITICAL: Generator frequency dangerously high - overspeed condition';
          possibleCauses = [
            'Governor actuator stuck in high fuel position',
            'Speed sensor failure giving false low-speed signal',
            'Governor control unit malfunction',
            'Actuator linkage disconnected',
            'Controller calibration error'
          ];
          recommendedActions = [
            'EMERGENCY STOP if frequency exceeds 53Hz',
            'Check governor actuator position physically',
            'Verify speed sensor signal with oscilloscope',
            'Check actuator linkage for proper connection',
            'Recalibrate controller speed settings if needed'
          ];
        }
        urgency = 'IMMEDIATE - Equipment damage and power quality problems';
        estimatedRepairTime = '2-6 hours';
        partsRequired = ['Governor actuator', 'Speed sensor', 'Fuel solenoid', 'Air filter'];
      }
    }
    // Check warning conditions
    else if (value <= param.warningLow || value >= param.warningHigh) {
      severity = 'warning';

      if (key === 'engineOilPressure' && value <= param.warningLow) {
        issue = 'WARNING: Oil pressure below normal operating range';
        possibleCauses = [
          'Oil level slightly low - check and top up',
          'Oil filter approaching service interval',
          'Oil viscosity thinned due to dilution or high temperature',
          'Normal engine wear increasing bearing clearances',
          'Oil pressure sender calibration drift'
        ];
        recommendedActions = [
          'Check oil level immediately and top up if needed',
          'Schedule oil and filter change',
          'Compare reading with calibrated test gauge',
          'Send oil sample for analysis',
          'Monitor pressure trend over time'
        ];
        urgency = 'MODERATE - Schedule service within 24-48 hours';
        estimatedRepairTime = '1-2 hours for service';
        partsRequired = ['Engine oil', 'Oil filter'];
      }
      else if (key === 'coolantTemperature' && value >= param.warningHigh) {
        issue = 'WARNING: Coolant temperature elevated above normal';
        possibleCauses = [
          'Coolant level slightly low',
          'Radiator fins dirty restricting airflow',
          'Thermostat partially stuck or degraded',
          'Fan belt tension loose causing belt slip',
          'High ambient temperature operation',
          'Heavy load for extended period'
        ];
        recommendedActions = [
          'Check coolant level when safe - top up if needed',
          'Clean radiator fins with compressed air or water',
          'Verify fan belt tension meets specification',
          'Check thermostat operation',
          'Consider reducing load in hot conditions'
        ];
        urgency = 'MODERATE - Address before full load operation';
        estimatedRepairTime = '1-3 hours';
        partsRequired = ['Coolant', 'Thermostat', 'Fan belt'];
      }
      else if (key === 'fuelLevel' && value <= param.warningLow) {
        issue = 'WARNING: Fuel level low - refueling required soon';
        possibleCauses = [
          'Normal fuel consumption',
          'Higher than expected load operation',
          'Possible fuel leak in system'
        ];
        recommendedActions = [
          'Schedule refueling immediately',
          'Check fuel consumption rate is normal',
          'Inspect fuel lines and tank for leaks',
          'Verify fuel gauge accuracy'
        ];
        urgency = 'MODERATE - Refuel within 2-4 hours at current load';
        estimatedRepairTime = '30 minutes for refueling';
        partsRequired = ['Diesel fuel'];
      }
      else if (key === 'batteryVoltage' && value <= param.warningLow) {
        issue = 'WARNING: Battery voltage low - charging system issue';
        possibleCauses = [
          'Battery beginning to fail',
          'Alternator output declining',
          'Loose connections causing voltage drop',
          'Battery charger not maintaining float voltage'
        ];
        recommendedActions = [
          'Test battery specific gravity or voltage under load',
          'Check alternator belt and output',
          'Clean and tighten battery terminals',
          'Verify battery charger settings'
        ];
        urgency = 'MODERATE - Address within 24 hours';
        estimatedRepairTime = '1-2 hours';
        partsRequired = ['Battery', 'Alternator belt'];
      }
    }

    if (severity !== 'normal') {
      results.push({
        severity,
        parameter: param.name,
        currentValue: value,
        unit: param.unit,
        expectedRange: `${param.normalMin}-${param.normalMax} ${param.unit}`,
        issue: issue || `${param.name} outside normal operating range`,
        possibleCauses: possibleCauses.length > 0 ? possibleCauses : ['Parameter deviation detected'],
        recommendedActions: recommendedActions.length > 0 ? recommendedActions : ['Monitor and investigate cause'],
        urgency: urgency || 'LOW',
        estimatedRepairTime,
        partsRequired
      });
    }
  });

  return results;
}

// ==================== TYPES ====================
export interface ActiveAlarm {
  code: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface ControllerSimulatorProps {
  controllerType?: keyof typeof CONTROLLER_TYPES;
  onAnalyzeError?: (errorCode: string, sensorData: Record<string, number>) => void;
  onResetRequest?: (errorCode: string) => void;
  activeAlarms?: ActiveAlarm[];
  className?: string;
}

// ==================== MAIN COMPONENT ====================
export default function ControllerSimulator({
  controllerType = 'DSE',
  activeAlarms = [],
  className = '',
}: ControllerSimulatorProps) {
  const config = CONTROLLER_TYPES[controllerType];
  const [selectedModel, setSelectedModel] = useState(config.models[0]);
  const [showDatasheet, setShowDatasheet] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showWiringDiagram, setShowWiringDiagram] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showInputModal, setShowInputModal] = useState(false);

  // Sensor values - technician inputs these from actual controller readings
  const [sensorValues, setSensorValues] = useState<Record<string, number>>({
    engineOilPressure: 3.5,
    coolantTemperature: 82,
    oilTemperature: 88,
    batteryVoltage: 27.6,
    chargerVoltage: 28.2,
    engineRPM: 1500,
    generatorFrequency: 50.0,
    voltageL1N: 230,
    voltageL2N: 231,
    voltageL3N: 229,
    voltageL1L2: 400,
    voltageL2L3: 401,
    voltageL3L1: 399,
    currentL1: 520,
    currentL2: 515,
    currentL3: 525,
    activePowerKW: 350,
    reactivePowerKVAR: 85,
    apparentPowerKVA: 360,
    powerFactor: 0.97,
    loadPercent: 70,
    fuelLevel: 78,
    fuelPressure: 3.2,
    boostPressure: 1.8,
    exhaustTemperature: 485,
    intakeAirTemp: 38,
    engineHours: 12547,
    mainsVoltage: 398,
    mainsFrequency: 50.1,
  });

  // Controller state
  const [engineRunning, setEngineRunning] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [mainsAvailable, setMainsAvailable] = useState(true);
  const [transferPosition, setTransferPosition] = useState<'mains' | 'generator'>('mains');
  const [alarmMuted, setAlarmMuted] = useState(false);

  // LED states
  const leds = {
    systemAuto: autoMode,
    shutdownAlarm: activeAlarms.some(a => a.severity === 'shutdown' || a.severity === 'critical'),
    warningAlarm: activeAlarms.some(a => a.severity === 'warning'),
    engineRunning: engineRunning,
    mainsHealthy: mainsAvailable,
    generatorAvailable: engineRunning && sensorValues.generatorFrequency > 48,
  };

  // Parameter status helper
  const getParameterStatus = useCallback((paramKey: string, value: number): 'normal' | 'warning' | 'critical' => {
    const param = SENSOR_PARAMETERS[paramKey as keyof typeof SENSOR_PARAMETERS];
    if (!param) return 'normal';
    if (value <= param.criticalLow || value >= param.criticalHigh) return 'critical';
    if (value <= param.warningLow || value >= param.warningHigh) return 'warning';
    return 'normal';
  }, []);

  // AI Analysis
  const runAIDiagnosis = useCallback(() => {
    const results = analyzeParameters(sensorValues);
    setDiagnosticResults(results);
    setShowAnalysis(true);
  }, [sensorValues]);

  // Handle parameter input
  const handleParameterChange = (paramKey: string, value: number) => {
    setSensorValues(prev => ({ ...prev, [paramKey]: value }));
  };

  // Get datasheet
  const getDatasheet = () => {
    return CONTROLLER_DATASHEETS[selectedModel.id] || DEFAULT_DATASHEET;
  };

  // Display pages for navigation
  const displayPages = [
    { id: 'overview', name: 'Overview' },
    { id: 'engine', name: 'Engine' },
    { id: 'generator', name: 'Generator' },
    { id: 'mains', name: 'Mains' },
    { id: 'alarms', name: 'Alarms' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controller Selection */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={selectedModel.id}
          onChange={(e) => {
            const model = config.models.find(m => m.id === e.target.value);
            if (model) setSelectedModel(model);
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
        >
          {config.models.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>

        <button
          onClick={() => setShowDatasheet(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2"
        >
          <span>📋</span> Datasheet
        </button>

        <button
          onClick={() => setShowInputModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2"
        >
          <span>✏️</span> Input Readings
        </button>

        <button
          onClick={runAIDiagnosis}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium flex items-center gap-2"
        >
          <span>🤖</span> AI Diagnosis
        </button>

        <button
          onClick={() => setShowWiringDiagram(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg font-medium flex items-center gap-2"
        >
          <span>📐</span> Wiring Diagram
        </button>
      </div>

      {/* Controller Panel - Unique Interface per Type */}
      {controllerType === 'DSE' && (
        <DSELayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'COMAP' && (
        <ComApLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'WOODWARD' && (
        <WoodwardLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'SMARTGEN' && (
        <SmartGenLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'POWERWIZARD' && (
        <PowerWizardLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'DATAKOM' && (
        <DatakomLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'LOVATO' && (
        <LovatoLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'SIEMENS' && (
        <SiemensLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'ENKO' && (
        <EnkoLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}
      {controllerType === 'VODIA' && (
        <VodiaLayout
          config={config}
          selectedModel={selectedModel}
          currentPage={currentPage}
          displayPages={displayPages}
          sensorValues={sensorValues}
          engineRunning={engineRunning}
          autoMode={autoMode}
          mainsAvailable={mainsAvailable}
          transferPosition={transferPosition}
          alarmMuted={alarmMuted}
          leds={leds}
          activeAlarms={activeAlarms}
          getParameterStatus={getParameterStatus}
          setCurrentPage={setCurrentPage}
          setEngineRunning={setEngineRunning}
          setAutoMode={setAutoMode}
          setAlarmMuted={setAlarmMuted}
          setTransferPosition={setTransferPosition}
        />
      )}

      {/* Input Modal */}
      <AnimatePresence>
        {showInputModal && (
          <InputModal
            sensorValues={sensorValues}
            onValueChange={handleParameterChange}
            onClose={() => setShowInputModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Datasheet Modal */}
      <AnimatePresence>
        {showDatasheet && (
          <DatasheetModal
            model={selectedModel}
            datasheet={getDatasheet()}
            onClose={() => setShowDatasheet(false)}
          />
        )}
      </AnimatePresence>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {showAnalysis && (
          <AIAnalysisModal
            results={diagnosticResults}
            sensorValues={sensorValues}
            onClose={() => setShowAnalysis(false)}
          />
        )}
      </AnimatePresence>

      {/* Wiring Diagram Modal */}
      <AnimatePresence>
        {showWiringDiagram && (
          <WiringDiagramModal
            diagram={getWiringDiagram(selectedModel.id)}
            onClose={() => setShowWiringDiagram(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== NAVIGATION PAD ====================
function NavigationPad({
  onUp,
  onDown,
  onLeft,
  onRight,
  onEnter,
}: {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onEnter: () => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1">
      <div />
      <NavButton direction="up" onClick={onUp} />
      <div />
      <NavButton direction="left" onClick={onLeft} />
      <button
        onClick={onEnter}
        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white border border-gray-600"
      >
        ✓
      </button>
      <NavButton direction="right" onClick={onRight} />
      <div />
      <NavButton direction="down" onClick={onDown} />
      <div />
    </div>
  );
}

function NavButton({ direction, onClick }: { direction: 'up' | 'down' | 'left' | 'right'; onClick: () => void }) {
  const arrows = { up: '▲', down: '▼', left: '◀', right: '▶' };
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white border border-gray-700"
    >
      {arrows[direction]}
    </button>
  );
}

// ==================== STATUS LED ====================
function StatusLED({ active, color, label, blink }: { active: boolean; color: 'red' | 'green' | 'yellow'; label: string; blink?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-3 h-3 rounded-full ${
          active
            ? color === 'red' ? 'bg-red-500 shadow-red-500/50 shadow-lg'
              : color === 'green' ? 'bg-green-500 shadow-green-500/50 shadow-lg'
              : 'bg-yellow-500 shadow-yellow-500/50 shadow-lg'
            : 'bg-gray-800 border border-gray-700'
        }`}
        animate={blink && active ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    </div>
  );
}

// ==================== DISPLAY CONTENT ====================
function DisplayContent({
  page,
  sensorValues,
  textColor,
  engineRunning,
  mainsAvailable,
  transferPosition,
  activeAlarms,
  getParameterStatus,
}: {
  page: string;
  sensorValues: Record<string, number>;
  textColor: string;
  engineRunning: boolean;
  mainsAvailable: boolean;
  transferPosition: 'mains' | 'generator';
  activeAlarms: ActiveAlarm[];
  getParameterStatus: (key: string, value: number) => string;
}) {
  const statusColor = (status: string) => {
    if (status === 'critical') return '#ff4444';
    if (status === 'warning') return '#ffaa00';
    return textColor;
  };

  if (page === 'overview') {
    return (
      <div style={{ color: textColor }}>
        <div className="text-center border-b border-current/30 pb-1 mb-2 font-bold">
          {engineRunning ? 'RUNNING' : 'STOPPED'} - {transferPosition.toUpperCase()}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span>Speed:</span>
            <span style={{ color: statusColor(getParameterStatus('engineRPM', sensorValues.engineRPM)) }}>
              {sensorValues.engineRPM} RPM
            </span>
          </div>
          <div className="flex justify-between">
            <span>Freq:</span>
            <span style={{ color: statusColor(getParameterStatus('generatorFrequency', sensorValues.generatorFrequency)) }}>
              {sensorValues.generatorFrequency.toFixed(1)} Hz
            </span>
          </div>
          <div className="flex justify-between">
            <span>Load:</span>
            <span style={{ color: statusColor(getParameterStatus('loadPercent', sensorValues.loadPercent)) }}>
              {sensorValues.loadPercent}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>kW:</span>
            <span>{sensorValues.activePowerKW}</span>
          </div>
          <div className="flex justify-between">
            <span>V L-L:</span>
            <span style={{ color: statusColor(getParameterStatus('voltageL1L2', sensorValues.voltageL1L2)) }}>
              {sensorValues.voltageL1L2}V
            </span>
          </div>
          <div className="flex justify-between">
            <span>PF:</span>
            <span>{sensorValues.powerFactor.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Oil P:</span>
            <span style={{ color: statusColor(getParameterStatus('engineOilPressure', sensorValues.engineOilPressure)) }}>
              {sensorValues.engineOilPressure.toFixed(1)} bar
            </span>
          </div>
          <div className="flex justify-between">
            <span>Coolant:</span>
            <span style={{ color: statusColor(getParameterStatus('coolantTemperature', sensorValues.coolantTemperature)) }}>
              {sensorValues.coolantTemperature}°C
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fuel:</span>
            <span style={{ color: statusColor(getParameterStatus('fuelLevel', sensorValues.fuelLevel)) }}>
              {sensorValues.fuelLevel}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Hours:</span>
            <span>{sensorValues.engineHours}</span>
          </div>
        </div>
        {activeAlarms.length > 0 && (
          <motion.div
            className="mt-2 text-center text-xs bg-red-900/50 rounded py-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⚠ {activeAlarms.length} ALARM{activeAlarms.length > 1 ? 'S' : ''} ACTIVE
          </motion.div>
        )}
      </div>
    );
  }

  if (page === 'engine') {
    return (
      <div style={{ color: textColor }}>
        <div className="text-center border-b border-current/30 pb-1 mb-2 font-bold">ENGINE PARAMETERS</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span>Engine Speed</span><span>{sensorValues.engineRPM} RPM</span></div>
          <div className="flex justify-between"><span>Oil Pressure</span><span style={{ color: statusColor(getParameterStatus('engineOilPressure', sensorValues.engineOilPressure)) }}>{sensorValues.engineOilPressure.toFixed(1)} bar</span></div>
          <div className="flex justify-between"><span>Coolant Temp</span><span style={{ color: statusColor(getParameterStatus('coolantTemperature', sensorValues.coolantTemperature)) }}>{sensorValues.coolantTemperature}°C</span></div>
          <div className="flex justify-between"><span>Oil Temp</span><span>{sensorValues.oilTemperature}°C</span></div>
          <div className="flex justify-between"><span>Fuel Level</span><span style={{ color: statusColor(getParameterStatus('fuelLevel', sensorValues.fuelLevel)) }}>{sensorValues.fuelLevel}%</span></div>
          <div className="flex justify-between"><span>Fuel Pressure</span><span>{sensorValues.fuelPressure.toFixed(1)} bar</span></div>
          <div className="flex justify-between"><span>Boost Pressure</span><span>{sensorValues.boostPressure.toFixed(1)} bar</span></div>
          <div className="flex justify-between"><span>Exhaust Temp</span><span>{sensorValues.exhaustTemperature}°C</span></div>
          <div className="flex justify-between"><span>Battery</span><span style={{ color: statusColor(getParameterStatus('batteryVoltage', sensorValues.batteryVoltage)) }}>{sensorValues.batteryVoltage.toFixed(1)}V</span></div>
          <div className="flex justify-between"><span>Run Hours</span><span>{sensorValues.engineHours} h</span></div>
        </div>
      </div>
    );
  }

  if (page === 'generator') {
    return (
      <div style={{ color: textColor }}>
        <div className="text-center border-b border-current/30 pb-1 mb-2 font-bold">GENERATOR OUTPUT</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span>Frequency</span><span style={{ color: statusColor(getParameterStatus('generatorFrequency', sensorValues.generatorFrequency)) }}>{sensorValues.generatorFrequency.toFixed(2)} Hz</span></div>
          <div className="flex justify-between"><span>V L1-N</span><span>{sensorValues.voltageL1N}V</span></div>
          <div className="flex justify-between"><span>V L2-N</span><span>{sensorValues.voltageL2N}V</span></div>
          <div className="flex justify-between"><span>V L3-N</span><span>{sensorValues.voltageL3N}V</span></div>
          <div className="flex justify-between"><span>I L1</span><span>{sensorValues.currentL1}A</span></div>
          <div className="flex justify-between"><span>I L2</span><span>{sensorValues.currentL2}A</span></div>
          <div className="flex justify-between"><span>I L3</span><span>{sensorValues.currentL3}A</span></div>
          <div className="flex justify-between"><span>Active Power</span><span>{sensorValues.activePowerKW} kW</span></div>
          <div className="flex justify-between"><span>Power Factor</span><span>{sensorValues.powerFactor.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Load</span><span style={{ color: statusColor(getParameterStatus('loadPercent', sensorValues.loadPercent)) }}>{sensorValues.loadPercent}%</span></div>
        </div>
      </div>
    );
  }

  if (page === 'mains') {
    return (
      <div style={{ color: textColor }}>
        <div className="text-center border-b border-current/30 pb-1 mb-2 font-bold">MAINS STATUS</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span>Mains Status</span><span>{mainsAvailable ? 'AVAILABLE' : 'FAILED'}</span></div>
          <div className="flex justify-between"><span>Mains Voltage</span><span style={{ color: statusColor(getParameterStatus('mainsVoltage', sensorValues.mainsVoltage)) }}>{sensorValues.mainsVoltage}V</span></div>
          <div className="flex justify-between"><span>Mains Frequency</span><span style={{ color: statusColor(getParameterStatus('mainsFrequency', sensorValues.mainsFrequency)) }}>{sensorValues.mainsFrequency.toFixed(1)} Hz</span></div>
          <div className="flex justify-between"><span>Transfer Position</span><span>{transferPosition.toUpperCase()}</span></div>
          <div className="flex justify-between"><span>Load Source</span><span>{transferPosition === 'mains' ? 'UTILITY' : 'GENERATOR'}</span></div>
        </div>
      </div>
    );
  }

  if (page === 'alarms') {
    return (
      <div style={{ color: textColor }}>
        <div className="text-center border-b border-current/30 pb-1 mb-2 font-bold">ALARMS ({activeAlarms.length})</div>
        {activeAlarms.length === 0 ? (
          <div className="text-center py-4 opacity-60">No active alarms</div>
        ) : (
          <div className="space-y-1 text-xs max-h-[140px] overflow-y-auto">
            {activeAlarms.map((alarm, idx) => (
              <div key={idx} className={`p-1 rounded ${alarm.severity === 'critical' || alarm.severity === 'shutdown' ? 'bg-red-900/50' : 'bg-yellow-900/50'}`}>
                <div className="font-bold">{alarm.code}</div>
                <div className="opacity-80">{alarm.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ==================== MIMIC DIAGRAM ====================
function MimicDiagram({
  mainsAvailable,
  generatorAvailable,
  transferPosition,
  engineRunning,
}: {
  mainsAvailable: boolean;
  generatorAvailable: boolean;
  transferPosition: 'mains' | 'generator';
  engineRunning: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4">
      {/* Mains Symbol */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
          mainsAvailable ? 'border-green-500 text-green-500' : 'border-gray-600 text-gray-600'
        }`}>
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l6 3v9.64l-6 3-6-3V7.18l6-3z"/>
            <path d="M12 7v10M8 12h8"/>
          </svg>
        </div>
        <motion.div
          className={`w-2 h-2 rounded-full mt-1 ${mainsAvailable ? 'bg-green-500' : 'bg-gray-600'}`}
          animate={mainsAvailable ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Connection Line with Transfer Switch */}
      <div className="flex-1 flex items-center px-4">
        <div className={`flex-1 h-0.5 ${transferPosition === 'mains' && mainsAvailable ? 'bg-green-500' : 'bg-gray-600'}`} />
        <motion.div
          className="w-2 h-2 rounded-full bg-yellow-500 mx-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {/* Transfer Switch */}
        <div className="relative w-16 h-8 mx-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 64 32" className="w-full h-full">
              <line x1="0" y1="16" x2="20" y2="16" stroke={transferPosition === 'mains' ? '#22c55e' : '#4b5563'} strokeWidth="2"/>
              <line x1="44" y1="16" x2="64" y2="16" stroke="#4b5563" strokeWidth="2"/>
              <motion.line
                x1="24"
                y1="16"
                x2="40"
                y2={transferPosition === 'mains' ? '8' : '24'}
                stroke={transferPosition === 'mains' ? '#22c55e' : generatorAvailable ? '#22c55e' : '#4b5563'}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="24" cy="16" r="3" fill="#fbbf24"/>
            </svg>
          </div>
        </div>
        <motion.div
          className="w-2 h-2 rounded-full bg-yellow-500 mx-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <div className={`flex-1 h-0.5 ${transferPosition === 'generator' && generatorAvailable ? 'bg-green-500' : 'bg-gray-600'}`} />
      </div>

      {/* Generator Symbol */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
          generatorAvailable ? 'border-green-500 text-green-500' : 'border-gray-600 text-gray-600'
        }`}>
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">~</text>
          </svg>
        </div>
        <motion.div
          className={`w-2 h-2 rounded-full mt-1 ${engineRunning ? 'bg-green-500' : 'bg-gray-600'}`}
          animate={engineRunning ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

// ==================== CONTROL BUTTON ====================
function ControlButton({
  type,
  onClick,
  active,
}: {
  type: 'stop' | 'manual' | 'mute' | 'auto' | 'transfer' | 'start';
  onClick: () => void;
  active: boolean;
}) {
  const configs = {
    stop: { bg: 'bg-red-600', activeBg: 'bg-red-700', icon: 'O', ring: 'ring-red-400', dark: false },
    manual: { bg: 'bg-gray-200', activeBg: 'bg-gray-300', icon: '✋', ring: 'ring-gray-400', dark: true },
    mute: { bg: 'bg-gray-200', activeBg: 'bg-gray-300', icon: '🔇', ring: 'ring-gray-400', dark: true },
    auto: { bg: 'bg-gray-200', activeBg: 'bg-yellow-400', icon: 'AUTO', ring: 'ring-yellow-400', dark: true },
    transfer: { bg: 'bg-gray-200', activeBg: 'bg-gray-300', icon: '⟷', ring: 'ring-gray-400', dark: true },
    start: { bg: 'bg-green-600', activeBg: 'bg-green-700', icon: 'I', ring: 'ring-green-400', dark: false },
  };

  const config = configs[type];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`w-3 h-3 rounded-full mb-1 ${active ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-gray-800'}`}
        animate={active && type !== 'stop' ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`w-14 h-14 rounded-full font-bold text-sm flex items-center justify-center ring-2 ${config.ring} ${
          active ? config.activeBg : config.bg
        } ${config.dark ? 'text-gray-800' : 'text-white'}`}
      >
        {config.icon}
      </motion.button>
    </div>
  );
}

// ==================== LAYOUT INTERFACE ====================
interface LayoutProps {
  config: typeof CONTROLLER_TYPES[keyof typeof CONTROLLER_TYPES];
  selectedModel: { id: string; name: string; display: string };
  currentPage: number;
  displayPages: { id: string; name: string }[];
  sensorValues: Record<string, number>;
  engineRunning: boolean;
  autoMode: boolean;
  mainsAvailable: boolean;
  transferPosition: 'mains' | 'generator';
  alarmMuted: boolean;
  leds: { systemAuto: boolean; shutdownAlarm: boolean; warningAlarm: boolean; engineRunning: boolean; mainsHealthy: boolean; generatorAvailable: boolean };
  activeAlarms: ActiveAlarm[];
  getParameterStatus: (key: string, value: number) => 'normal' | 'warning' | 'critical';
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setEngineRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoMode: React.Dispatch<React.SetStateAction<boolean>>;
  setAlarmMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setTransferPosition: React.Dispatch<React.SetStateAction<'mains' | 'generator'>>;
}

// ==================== DSE LAYOUT - Marine Industrial Style ====================
function DSELayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-2 shadow-2xl border border-gray-700">
      {/* Top Header Bar - Blue Accent */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-t-xl px-4 py-2 flex justify-between items-center border-b border-blue-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">GO</div>
          <span className="text-blue-200 text-sm font-bold tracking-wider">GENERATOR ORACLE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          <span className="text-gray-300 text-sm">{selectedModel.name}</span>
        </div>
      </div>

      {/* Main Controller Body */}
      <div className="bg-gradient-to-b from-[#0d0d0d] to-[#151515] p-4 rounded-b-xl">
        {/* Upper Section: Navigation + Display + LEDs */}
        <div className="flex gap-4 mb-4">
          {/* Left: Navigation Pad with Blue Accent */}
          <div className="flex flex-col items-center gap-1 bg-[#0a0a0a] p-3 rounded-xl border border-gray-800">
            <NavigationPad
              onUp={() => setCurrentPage(p => Math.max(0, p - 1))}
              onDown={() => setCurrentPage(p => Math.min(displayPages.length - 1, p + 1))}
              onLeft={() => {}}
              onRight={() => {}}
              onEnter={() => {}}
            />
            <div className="mt-2 text-[8px] text-gray-500 tracking-wider">NAVIGATION</div>
          </div>

          {/* Center: LCD Display - Green Backlit */}
          <div
            className="flex-1 rounded-lg p-3 font-mono text-sm min-h-[200px] border-4 border-gray-700 shadow-inner"
            style={{
              backgroundColor: '#2d5a27',
              boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.7), 0 0 20px rgba(45,90,39,0.3)'
            }}
          >
            <DisplayContent
              page={displayPages[currentPage].id}
              sensorValues={sensorValues}
              textColor="#000000"
              engineRunning={engineRunning}
              mainsAvailable={mainsAvailable}
              transferPosition={transferPosition}
              activeAlarms={activeAlarms}
              getParameterStatus={getParameterStatus}
            />
          </div>

          {/* Right: LED Indicators Column */}
          <div className="flex flex-col gap-2 min-w-[130px] bg-[#0a0a0a] p-3 rounded-xl border border-gray-800">
            <div className="text-[8px] text-gray-500 mb-1 tracking-wider text-center">STATUS LEDS</div>
            <StatusLED active={leds.systemAuto} color="green" label="SYSTEM AUTO" />
            <StatusLED active={leds.shutdownAlarm} color="red" blink label="SHUTDOWN" />
            <StatusLED active={leds.warningAlarm} color="yellow" blink label="WARNING" />
            <StatusLED active={leds.engineRunning} color="green" label="ENGINE ON" />
          </div>
        </div>

        {/* Mimic Diagram Section */}
        <div className="bg-[#0a0a0a] rounded-lg p-4 mb-4 border border-gray-800">
          <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
        </div>

        {/* Control Buttons Row */}
        <div className="flex justify-between items-center gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
          <ControlButton type="stop" onClick={() => setEngineRunning(false)} active={!engineRunning} />
          <ControlButton type="manual" onClick={() => setAutoMode(false)} active={!autoMode} />
          <ControlButton type="mute" onClick={() => setAlarmMuted(!alarmMuted)} active={alarmMuted} />
          <ControlButton type="auto" onClick={() => setAutoMode(true)} active={autoMode} />
          <ControlButton type="transfer" onClick={() => setTransferPosition(p => p === 'mains' ? 'generator' : 'mains')} active={false} />
          <ControlButton type="start" onClick={() => setEngineRunning(true)} active={engineRunning} />
        </div>
      </div>
    </div>
  );
}

// ==================== COMAP LAYOUT - Red Intelligent Genset Style ====================
function ComApLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl p-1 shadow-2xl border-2 border-red-900">
      {/* Header with Red Accent Strip */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 h-2 rounded-t-lg"></div>
      <div className="bg-[#0d0d0d] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center text-white font-bold text-sm shadow-lg border border-red-500">GO</div>
          <div>
            <div className="text-red-400 text-xs font-semibold tracking-wider">INTELLIGENT GENSET</div>
            <div className="text-white text-sm font-bold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {[leds.systemAuto, leds.engineRunning, leds.warningAlarm, leds.shutdownAlarm].map((active, i) => (
            <motion.div key={i} className={`w-3 h-3 rounded-full ${active ? ['bg-green-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'][i] : 'bg-gray-800'}`}
              animate={active && i > 1 ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 0.5, repeat: Infinity }} />
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Display Area with Tabs */}
        <div className="bg-[#0a0a0a] rounded-lg border border-red-900/50 mb-4">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-800">
            {displayPages.map((page, i) => (
              <button key={page.id} onClick={() => setCurrentPage(i)}
                className={`px-4 py-2 text-xs font-semibold ${currentPage === i ? 'bg-red-900/30 text-red-400 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-300'}`}>
                {page.name.toUpperCase()}
              </button>
            ))}
          </div>
          {/* Display Content */}
          <div className="p-4 min-h-[180px] font-mono" style={{ backgroundColor: config.displayColor }}>
            <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
              engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
              activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
          </div>
        </div>

        {/* Control Section - Horizontal Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left: Mimic */}
          <div className="bg-[#0a0a0a] rounded-lg p-3 border border-gray-800">
            <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
          </div>
          {/* Right: Buttons Grid */}
          <div className="grid grid-cols-3 gap-2">
            {(['stop', 'manual', 'mute', 'auto', 'transfer', 'start'] as const).map(type => (
              <div key={type} className="flex flex-col items-center">
                <span className="text-[8px] text-gray-500 mb-1">{type.toUpperCase()}</span>
                <ControlButton type={type}
                  onClick={() => {
                    if (type === 'stop') setEngineRunning(false);
                    else if (type === 'manual') setAutoMode(false);
                    else if (type === 'mute') setAlarmMuted(!alarmMuted);
                    else if (type === 'auto') setAutoMode(true);
                    else if (type === 'transfer') setTransferPosition(p => p === 'mains' ? 'generator' : 'mains');
                    else if (type === 'start') setEngineRunning(true);
                  }}
                  active={type === 'stop' ? !engineRunning : type === 'manual' ? !autoMode : type === 'mute' ? alarmMuted : type === 'auto' ? autoMode : type === 'start' ? engineRunning : false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== WOODWARD LAYOUT - Green Industrial Engine Style ====================
function WoodwardLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-1 shadow-2xl border-4 border-green-900">
      {/* Industrial Green Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 bg-black rounded flex items-center justify-center border-2 border-green-500">
            <span className="text-green-500 font-bold text-sm">GO</span>
          </div>
          <div className="text-white">
            <div className="text-xs opacity-75">INDUSTRIAL ENGINE CONTROL</div>
            <div className="font-bold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <motion.div className={`w-4 h-4 rounded-sm ${engineRunning ? 'bg-green-400' : 'bg-gray-700'}`}
              animate={engineRunning ? { boxShadow: ['0 0 10px #4ade80', '0 0 5px #4ade80'] } : {}} transition={{ duration: 1, repeat: Infinity }} />
            <span className="text-[8px] text-green-200 mt-1">RUN</span>
          </div>
          <div className="flex flex-col items-center">
            <motion.div className={`w-4 h-4 rounded-sm ${leds.shutdownAlarm ? 'bg-red-500' : 'bg-gray-700'}`}
              animate={leds.shutdownAlarm ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 0.5, repeat: Infinity }} />
            <span className="text-[8px] text-green-200 mt-1">FAULT</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#0a0a0a]">
        {/* Main Display - Amber LCD */}
        <div className="border-4 border-green-900 rounded mb-4" style={{ backgroundColor: '#0f1a0f' }}>
          <div className="flex border-b border-green-900/50">
            {displayPages.map((page, i) => (
              <button key={page.id} onClick={() => setCurrentPage(i)}
                className={`flex-1 py-2 text-xs font-bold ${currentPage === i ? 'bg-green-900/50 text-amber-400' : 'text-gray-500'}`}>
                {page.name}
              </button>
            ))}
          </div>
          <div className="p-4 min-h-[180px] font-mono">
            <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor="#ffcc00"
              engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
              activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
          </div>
        </div>

        {/* Toggle Switches Style Buttons */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-[#111] rounded-lg p-3 border border-green-900/50">
            <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
          </div>
        </div>

        {/* Industrial Toggle Buttons */}
        <div className="flex justify-between bg-[#111] rounded-lg p-4 border border-green-900/50">
          {(['stop', 'manual', 'mute', 'auto', 'transfer', 'start'] as const).map(type => {
            const labels = { stop: 'STOP', manual: 'MANUAL', mute: 'MUTE', auto: 'AUTO', transfer: 'XFER', start: 'START' };
            return (
              <div key={type} className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-green-400 font-bold">{labels[type]}</span>
                <ControlButton type={type}
                  onClick={() => {
                    if (type === 'stop') setEngineRunning(false);
                    else if (type === 'manual') setAutoMode(false);
                    else if (type === 'mute') setAlarmMuted(!alarmMuted);
                    else if (type === 'auto') setAutoMode(true);
                    else if (type === 'transfer') setTransferPosition(p => p === 'mains' ? 'generator' : 'mains');
                    else if (type === 'start') setEngineRunning(true);
                  }}
                  active={type === 'stop' ? !engineRunning : type === 'manual' ? !autoMode : type === 'mute' ? alarmMuted : type === 'auto' ? autoMode : type === 'start' ? engineRunning : false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== SMARTGEN LAYOUT - Purple Compact Modern Style ====================
function SmartGenLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-1 shadow-2xl border border-purple-800">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-purple-900 to-violet-900 px-4 py-2 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">GO</div>
          <div>
            <div className="text-purple-300 text-[10px] tracking-widest">SMART GENERATION</div>
            <div className="text-white text-sm font-semibold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <StatusLED active={leds.systemAuto} color="green" label="" />
          <StatusLED active={leds.shutdownAlarm} color="red" blink label="" />
        </div>
      </div>

      <div className="p-3">
        {/* Compact Display */}
        <div className="rounded-lg overflow-hidden mb-3 border border-purple-800/50">
          <div className="flex">
            {displayPages.slice(0, 4).map((page, i) => (
              <button key={page.id} onClick={() => setCurrentPage(i)}
                className={`flex-1 py-1 text-[10px] ${currentPage === i ? 'bg-purple-800 text-cyan-400' : 'bg-purple-950 text-gray-500'}`}>
                {page.name}
              </button>
            ))}
          </div>
          <div className="p-3 min-h-[160px] font-mono text-xs" style={{ backgroundColor: config.displayColor }}>
            <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
              engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
              activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
          </div>
        </div>

        {/* Mimic + Buttons Side by Side */}
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3 bg-purple-950/50 rounded-lg p-2 border border-purple-800/30">
            <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-1">
            {(['stop', 'start', 'manual', 'auto', 'mute', 'transfer'] as const).map(type => (
              <button key={type}
                onClick={() => {
                  if (type === 'stop') setEngineRunning(false);
                  else if (type === 'manual') setAutoMode(false);
                  else if (type === 'mute') setAlarmMuted(!alarmMuted);
                  else if (type === 'auto') setAutoMode(true);
                  else if (type === 'transfer') setTransferPosition(p => p === 'mains' ? 'generator' : 'mains');
                  else if (type === 'start') setEngineRunning(true);
                }}
                className={`p-2 rounded text-[10px] font-bold transition-all ${
                  type === 'stop' ? 'bg-red-900 hover:bg-red-800 text-white' :
                  type === 'start' ? 'bg-green-900 hover:bg-green-800 text-white' :
                  'bg-purple-900 hover:bg-purple-800 text-purple-300'
                }`}>
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== POWERWIZARD LAYOUT - Caterpillar Yellow Industrial Style ====================
function PowerWizardLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-1 shadow-2xl border-4 border-yellow-600">
      {/* CAT-Style Yellow Header */}
      <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded flex items-center justify-center border-2 border-yellow-400">
            <span className="text-yellow-400 font-black text-lg">GO</span>
          </div>
          <div className="text-black">
            <div className="text-xs font-bold tracking-wider">HEAVY EQUIPMENT CONTROL</div>
            <div className="font-black text-lg">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${engineRunning ? 'bg-green-600' : 'bg-gray-800'}`}></div>
            <span className="text-xs font-bold text-black">RUN</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div className={`w-4 h-4 rounded ${leds.shutdownAlarm ? 'bg-red-600' : 'bg-gray-800'}`}
              animate={leds.shutdownAlarm ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 0.5, repeat: Infinity }} />
            <span className="text-xs font-bold text-black">FAULT</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-b from-[#1a1500] to-[#0a0a00]">
        {/* Display with Navigation */}
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} className="w-10 h-10 bg-yellow-600 hover:bg-yellow-500 rounded text-black font-bold">▲</button>
            <button onClick={() => setCurrentPage(p => Math.min(displayPages.length - 1, p + 1))} className="w-10 h-10 bg-yellow-600 hover:bg-yellow-500 rounded text-black font-bold">▼</button>
          </div>
          <div className="flex-1 border-4 border-yellow-700 rounded" style={{ backgroundColor: config.displayColor }}>
            <div className="bg-yellow-800/50 px-3 py-1 text-xs font-bold text-yellow-200 border-b border-yellow-700">
              {displayPages[currentPage].name.toUpperCase()}
            </div>
            <div className="p-4 min-h-[160px] font-mono">
              <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
                engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
                activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a00] rounded-lg p-3 border border-yellow-800/50 mb-4">
          <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
        </div>

        {/* Heavy Duty Buttons */}
        <div className="flex justify-between gap-2">
          {(['stop', 'manual', 'mute', 'auto', 'transfer', 'start'] as const).map(type => (
            <button key={type}
              onClick={() => {
                if (type === 'stop') setEngineRunning(false);
                else if (type === 'manual') setAutoMode(false);
                else if (type === 'mute') setAlarmMuted(!alarmMuted);
                else if (type === 'auto') setAutoMode(true);
                else if (type === 'transfer') setTransferPosition(p => p === 'mains' ? 'generator' : 'mains');
                else if (type === 'start') setEngineRunning(true);
              }}
              className={`flex-1 py-3 rounded-lg font-black text-sm border-2 transition-all ${
                type === 'stop' ? 'bg-red-700 border-red-500 text-white hover:bg-red-600' :
                type === 'start' ? 'bg-green-700 border-green-500 text-white hover:bg-green-600' :
                'bg-yellow-600 border-yellow-400 text-black hover:bg-yellow-500'
              }`}>
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== DATAKOM LAYOUT - Cyan Digital Automation Style ====================
function DatakomLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-[#0a1a2a] rounded-xl p-1 shadow-2xl border-2 border-cyan-700">
      {/* Digital Header */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30">GO</div>
          <div>
            <div className="text-cyan-400 text-[10px] tracking-widest">DIGITAL AUTOMATION</div>
            <div className="text-white font-semibold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className={`px-2 py-1 rounded text-[10px] font-bold ${autoMode ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-500'}`}>AUTO</div>
          <div className={`px-2 py-1 rounded text-[10px] font-bold ${engineRunning ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}>RUN</div>
        </div>
      </div>

      <div className="p-3">
        {/* Tab Navigation */}
        <div className="flex mb-2 bg-cyan-950 rounded-lg p-1">
          {displayPages.map((page, i) => (
            <button key={page.id} onClick={() => setCurrentPage(i)}
              className={`flex-1 py-2 text-xs rounded transition-all ${currentPage === i ? 'bg-cyan-700 text-white font-bold' : 'text-cyan-400'}`}>
              {page.name}
            </button>
          ))}
        </div>

        {/* Display */}
        <div className="rounded-lg mb-3 border border-cyan-800 overflow-hidden" style={{ backgroundColor: config.displayColor }}>
          <div className="p-4 min-h-[170px] font-mono">
            <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
              engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
              activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 bg-cyan-950/50 rounded-lg p-3 border border-cyan-800/30">
            <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
          </div>
          <div className="flex flex-col gap-2">
            {(['stop', 'start', 'auto', 'mute'] as const).map(type => (
              <button key={type}
                onClick={() => {
                  if (type === 'stop') setEngineRunning(false);
                  else if (type === 'mute') setAlarmMuted(!alarmMuted);
                  else if (type === 'auto') setAutoMode(true);
                  else if (type === 'start') setEngineRunning(true);
                }}
                className={`py-2 rounded font-semibold text-sm ${
                  type === 'stop' ? 'bg-red-700 text-white' :
                  type === 'start' ? 'bg-green-700 text-white' :
                  'bg-cyan-800 text-cyan-200'
                }`}>
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== LOVATO LAYOUT - Orange European Industrial Style ====================
function LovatoLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-[#1a1510] rounded-2xl p-1 shadow-2xl border-2 border-orange-700">
      {/* Italian Industrial Header */}
      <div className="bg-gradient-to-r from-orange-800 to-amber-800 px-4 py-3 flex justify-between items-center rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <span className="text-orange-600 font-black text-lg">GO</span>
          </div>
          <div className="text-white">
            <div className="text-[10px] tracking-widest opacity-80">EUROPEAN INDUSTRIAL</div>
            <div className="font-bold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <StatusLED active={leds.systemAuto} color="green" label="AUTO" />
          <StatusLED active={leds.engineRunning} color="green" label="RUN" />
          <StatusLED active={leds.shutdownAlarm} color="red" blink label="ALARM" />
        </div>
      </div>

      <div className="p-4 bg-gradient-to-b from-[#1a1510] to-[#0d0a05]">
        <div className="flex gap-4">
          {/* Left Navigation */}
          <div className="flex flex-col gap-2">
            {displayPages.map((page, i) => (
              <button key={page.id} onClick={() => setCurrentPage(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                  currentPage === i ? 'bg-orange-700 text-white' : 'bg-orange-950 text-orange-400 hover:bg-orange-900'
                }`}>
                {page.name}
              </button>
            ))}
          </div>

          {/* Main Display */}
          <div className="flex-1 border-2 border-orange-800 rounded-lg overflow-hidden" style={{ backgroundColor: config.displayColor }}>
            <div className="p-4 min-h-[200px] font-mono">
              <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
                engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
                activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
            </div>
          </div>
        </div>

        <div className="mt-4 bg-orange-950/50 rounded-lg p-3 border border-orange-800/30">
          <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <ControlButton type="stop" onClick={() => setEngineRunning(false)} active={!engineRunning} />
          <ControlButton type="manual" onClick={() => setAutoMode(false)} active={!autoMode} />
          <ControlButton type="auto" onClick={() => setAutoMode(true)} active={autoMode} />
          <ControlButton type="start" onClick={() => setEngineRunning(true)} active={engineRunning} />
        </div>
      </div>
    </div>
  );
}

// ==================== SIEMENS LAYOUT - Teal German Precision Style ====================
function SiemensLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-[#0a1a1a] rounded-lg p-1 shadow-2xl border border-teal-600">
      {/* Siemens-style Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded flex items-center justify-center text-white font-bold shadow-md">GO</div>
          <div>
            <div className="text-teal-300 text-[10px] tracking-widest">INDUSTRIAL AUTOMATION</div>
            <div className="text-white font-semibold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex gap-4">
          {[{ active: leds.systemAuto, label: 'AUTO', color: 'teal' }, { active: engineRunning, label: 'RUN', color: 'green' }, { active: leds.shutdownAlarm, label: 'FAULT', color: 'red' }].map((led, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div className={`w-3 h-3 rounded-full ${led.active ? `bg-${led.color}-400` : 'bg-gray-700'}`}
                animate={led.active && led.label === 'FAULT' ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ backgroundColor: led.active ? (led.color === 'teal' ? '#2dd4bf' : led.color === 'green' ? '#4ade80' : '#f87171') : '#374151' }} />
              <span className="text-[10px] text-teal-200">{led.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#0a1515]">
        {/* Precision Grid Layout */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {displayPages.map((page, i) => (
            <button key={page.id} onClick={() => setCurrentPage(i)}
              className={`py-2 rounded text-xs font-semibold border ${
                currentPage === i ? 'bg-teal-700 text-white border-teal-500' : 'bg-teal-950 text-teal-400 border-teal-800'
              }`}>
              {page.name}
            </button>
          ))}
        </div>

        <div className="border-2 border-teal-700 rounded-lg mb-4" style={{ backgroundColor: config.displayColor }}>
          <div className="p-4 min-h-[180px] font-mono">
            <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
              engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
              activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
          </div>
        </div>

        <div className="bg-teal-950/30 rounded-lg p-3 border border-teal-800/50 mb-4">
          <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
        </div>

        <div className="grid grid-cols-6 gap-2">
          {(['stop', 'manual', 'mute', 'auto', 'transfer', 'start'] as const).map(type => (
            <button key={type}
              onClick={() => {
                if (type === 'stop') setEngineRunning(false);
                else if (type === 'manual') setAutoMode(false);
                else if (type === 'mute') setAlarmMuted(!alarmMuted);
                else if (type === 'auto') setAutoMode(true);
                else if (type === 'transfer') setTransferPosition(p => p === 'mains' ? 'generator' : 'mains');
                else if (type === 'start') setEngineRunning(true);
              }}
              className={`py-3 rounded text-xs font-bold border ${
                type === 'stop' ? 'bg-red-800 border-red-600 text-white' :
                type === 'start' ? 'bg-green-800 border-green-600 text-white' :
                'bg-teal-900 border-teal-700 text-teal-300'
              }`}>
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== ENKO LAYOUT - Purple Compact Economical Style ====================
function EnkoLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-[#1a0a2a] rounded-xl p-1 shadow-2xl border border-purple-600">
      {/* Compact Purple Header */}
      <div className="bg-gradient-to-r from-purple-900 to-fuchsia-900 px-3 py-2 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">GO</div>
          <div>
            <div className="text-purple-300 text-[9px] tracking-wider">COMPACT CONTROLLER</div>
            <div className="text-white text-sm font-semibold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.div className={`w-3 h-3 rounded-full ${engineRunning ? 'bg-green-400' : 'bg-gray-700'}`} />
          <motion.div className={`w-3 h-3 rounded-full ${leds.shutdownAlarm ? 'bg-red-400' : 'bg-gray-700'}`}
            animate={leds.shutdownAlarm ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 0.5, repeat: Infinity }} />
        </div>
      </div>

      <div className="p-3">
        {/* Compact Display */}
        <div className="rounded-lg mb-3 border border-purple-800" style={{ backgroundColor: config.displayColor }}>
          <div className="flex border-b border-purple-800/50">
            {displayPages.slice(0, 3).map((page, i) => (
              <button key={page.id} onClick={() => setCurrentPage(i)}
                className={`flex-1 py-1 text-[10px] ${currentPage === i ? 'bg-purple-800 text-purple-200' : 'text-purple-500'}`}>
                {page.name}
              </button>
            ))}
          </div>
          <div className="p-3 min-h-[140px] font-mono text-xs">
            <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
              engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
              activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
          </div>
        </div>

        {/* Compact Mimic */}
        <div className="bg-purple-950/50 rounded p-2 mb-3 border border-purple-800/30">
          <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
        </div>

        {/* Simple Button Row */}
        <div className="flex gap-2">
          <button onClick={() => setEngineRunning(false)} className="flex-1 py-2 bg-red-800 rounded text-white font-bold text-sm">STOP</button>
          <button onClick={() => setAutoMode(true)} className={`flex-1 py-2 rounded text-sm font-bold ${autoMode ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-400'}`}>AUTO</button>
          <button onClick={() => setEngineRunning(true)} className="flex-1 py-2 bg-green-800 rounded text-white font-bold text-sm">START</button>
        </div>
      </div>
    </div>
  );
}

// ==================== VODIA LAYOUT - Blue Marine Diagnostic Software Style ====================
function VodiaLayout({
  config, selectedModel, currentPage, displayPages, sensorValues, engineRunning, autoMode, mainsAvailable,
  transferPosition, alarmMuted, leds, activeAlarms, getParameterStatus, setCurrentPage, setEngineRunning,
  setAutoMode, setAlarmMuted, setTransferPosition
}: LayoutProps) {
  return (
    <div className="bg-gradient-to-br from-[#0a1525] to-[#0d1a30] rounded-2xl p-1 shadow-2xl border border-blue-700">
      {/* Software-Style Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 px-4 py-2 flex justify-between items-center rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">GO</div>
          <div>
            <div className="text-blue-300 text-[10px] tracking-widest">MARINE DIAGNOSTIC</div>
            <div className="text-white font-semibold">{selectedModel.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${engineRunning ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
            {engineRunning ? 'CONNECTED' : 'OFFLINE'}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Software-style Tabs */}
        <div className="flex gap-1 mb-3 bg-blue-950/50 rounded-lg p-1">
          {displayPages.map((page, i) => (
            <button key={page.id} onClick={() => setCurrentPage(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                currentPage === i ? 'bg-blue-700 text-white shadow-lg' : 'text-blue-400 hover:bg-blue-900/50'
              }`}>
              {page.name}
            </button>
          ))}
        </div>

        {/* Large Display Area - Software Style */}
        <div className="rounded-xl mb-4 border border-blue-800 overflow-hidden shadow-inner" style={{ backgroundColor: config.displayColor }}>
          <div className="p-5 min-h-[200px] font-mono">
            <DisplayContent page={displayPages[currentPage].id} sensorValues={sensorValues} textColor={config.textColor}
              engineRunning={engineRunning} mainsAvailable={mainsAvailable} transferPosition={transferPosition}
              activeAlarms={activeAlarms} getParameterStatus={getParameterStatus} />
          </div>
        </div>

        {/* Diagnostic Mimic */}
        <div className="bg-blue-950/30 rounded-xl p-4 mb-4 border border-blue-800/50">
          <MimicDiagram mainsAvailable={mainsAvailable} generatorAvailable={leds.generatorAvailable} transferPosition={transferPosition} engineRunning={engineRunning} />
        </div>

        {/* Software Control Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <button onClick={() => setEngineRunning(false)} className="py-3 bg-red-700 hover:bg-red-600 rounded-lg text-white font-semibold">STOP</button>
          <button onClick={() => setAutoMode(false)} className={`py-3 rounded-lg font-semibold ${!autoMode ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-400'}`}>MANUAL</button>
          <button onClick={() => setAutoMode(true)} className={`py-3 rounded-lg font-semibold ${autoMode ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-400'}`}>AUTO</button>
          <button onClick={() => setEngineRunning(true)} className="py-3 bg-green-700 hover:bg-green-600 rounded-lg text-white font-semibold">START</button>
        </div>
      </div>
    </div>
  );
}

// ==================== INPUT MODAL ====================
function InputModal({
  sensorValues,
  onValueChange,
  onClose,
}: {
  sensorValues: Record<string, number>;
  onValueChange: (key: string, value: number) => void;
  onClose: () => void;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const paramGroups = [
    {
      name: 'Engine',
      params: ['engineRPM', 'engineOilPressure', 'coolantTemperature', 'oilTemperature', 'fuelLevel', 'fuelPressure', 'boostPressure', 'exhaustTemperature', 'intakeAirTemp', 'engineHours']
    },
    {
      name: 'Electrical',
      params: ['batteryVoltage', 'chargerVoltage', 'generatorFrequency', 'voltageL1N', 'voltageL2N', 'voltageL3N', 'currentL1', 'currentL2', 'currentL3']
    },
    {
      name: 'Power',
      params: ['activePowerKW', 'reactivePowerKVAR', 'apparentPowerKVA', 'powerFactor', 'loadPercent']
    },
    {
      name: 'Mains',
      params: ['mainsVoltage', 'mainsFrequency']
    }
  ];

  const handleSave = () => {
    if (editingKey && tempValue !== '') {
      onValueChange(editingKey, parseFloat(tempValue));
      setEditingKey(null);
      setTempValue('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">✏️</span>
              Enter Controller Readings
            </h2>
            <p className="text-emerald-200">Input the actual values shown on the controller display</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white">✕</button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {paramGroups.map((group) => (
            <div key={group.name} className="mb-6">
              <h3 className="text-lg font-bold text-brand-gold mb-3">{group.name} Parameters</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {group.params.map((key) => {
                  const param = SENSOR_PARAMETERS[key as keyof typeof SENSOR_PARAMETERS];
                  if (!param) return null;
                  return (
                    <div
                      key={key}
                      className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        setEditingKey(key);
                        setTempValue(sensorValues[key]?.toString() || '0');
                      }}
                    >
                      <div className="text-gray-400 text-xs">{param.name}</div>
                      <div className="text-white font-bold text-lg">
                        {sensorValues[key]?.toFixed(param.unit === '' || param.unit === '%' || param.unit === 'RPM' || param.unit === 'h' ? 0 : 1)}
                        <span className="text-sm text-gray-400 ml-1">{param.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Overlay */}
        {editingKey && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-xl w-80">
              <h3 className="text-white font-bold mb-4">
                {SENSOR_PARAMETERS[editingKey as keyof typeof SENSOR_PARAMETERS]?.name}
              </h3>
              <input
                type="number"
                step="any"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-2xl text-center"
                autoFocus
              />
              <div className="text-center text-gray-400 mt-2">
                {SENSOR_PARAMETERS[editingKey as keyof typeof SENSOR_PARAMETERS]?.unit}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditingKey(null); setTempValue(''); }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== DATASHEET MODAL ====================
function DatasheetModal({
  model,
  datasheet,
  onClose,
}: {
  model: { id: string; name: string; display: string };
  datasheet: typeof CONTROLLER_DATASHEETS[string];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-700 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{model.name}</h2>
            <p className="text-gray-400">Technical Reference - Generator Oracle Documentation</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">✕</button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-xl font-bold text-brand-gold mb-3">Overview</h3>
            <p className="text-gray-300 leading-relaxed">{datasheet.overview}</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-gold mb-3">Key Features</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {datasheet.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>{feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-gold mb-3">Technical Specifications</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(datasheet.specifications).map(([key, value], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}>
                      <td className="px-4 py-2 text-gray-400 font-medium">{key}</td>
                      <td className="px-4 py-2 text-white">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-gold mb-3">Inputs & Outputs</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-bold text-green-400 mb-2">Inputs</h4>
                <ul className="space-y-1">
                  {datasheet.inputsOutputs.inputs.map((input, idx) => (
                    <li key={idx} className="text-gray-300 text-sm">• {input}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-bold text-blue-400 mb-2">Outputs</h4>
                <ul className="space-y-1">
                  {datasheet.inputsOutputs.outputs.map((output, idx) => (
                    <li key={idx} className="text-gray-300 text-sm">• {output}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-gold mb-3">Communication</h3>
            <div className="flex flex-wrap gap-2">
              {datasheet.communication.map((comm, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">{comm}</span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-gold mb-3">Protection Functions</h3>
            <div className="flex flex-wrap gap-2">
              {datasheet.protection.map((prot, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">{prot}</span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-gold mb-3">Applications</h3>
            <div className="flex flex-wrap gap-2">
              {datasheet.applications.map((app, idx) => (
                <span key={idx} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">{app}</span>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700 flex justify-end gap-4">
          <a
            href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi! I need support for ${model.name} controller`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
          >
            Get Support
          </a>
          <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== AI ANALYSIS MODAL ====================
function AIAnalysisModal({
  results,
  sensorValues,
  onClose,
}: {
  results: DiagnosticResult[];
  sensorValues: Record<string, number>;
  onClose: () => void;
}) {
  const criticalCount = results.filter(r => r.severity === 'critical').length;
  const warningCount = results.filter(r => r.severity === 'warning').length;
  const normalCount = Object.keys(sensorValues).length - criticalCount - warningCount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-pink-900 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              AI Diagnostic Analysis
            </h2>
            <p className="text-purple-200">Intelligent fault detection based on your readings</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white">✕</button>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{normalCount}</div>
              <div className="text-green-300 text-sm">Normal</div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{warningCount}</div>
              <div className="text-yellow-300 text-sm">Warnings</div>
            </div>
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{criticalCount}</div>
              <div className="text-red-300 text-sm">Critical</div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-400">All Systems Operating Normally</h3>
              <p className="text-gray-400 mt-2">All parameters are within acceptable ranges. Continue regular monitoring.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-6 ${
                    result.severity === 'critical' ? 'bg-red-500/10 border-red-500' : 'bg-yellow-500/10 border-yellow-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-lg font-bold ${result.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {result.parameter}
                      </h3>
                      <p className="text-gray-300">{result.issue}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                      result.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                    }`}>
                      {result.severity}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-gray-400 text-sm">Current Value:</span>
                      <span className="ml-2 font-bold text-white">{result.currentValue} {result.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Expected Range:</span>
                      <span className="ml-2 font-bold text-green-400">{result.expectedRange}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-purple-400 mb-2">Possible Causes:</h4>
                      <ul className="space-y-1">
                        {result.possibleCauses.map((cause, cIdx) => (
                          <li key={cIdx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-purple-400">•</span>{cause}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-400 mb-2">Recommended Actions:</h4>
                      <ol className="space-y-1">
                        {result.recommendedActions.map((action, aIdx) => (
                          <li key={aIdx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-green-400 font-bold">{aIdx + 1}.</span>{action}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                      <div>
                        <span className="text-gray-400 text-sm">Urgency:</span>
                        <p className={`font-bold ${result.urgency.includes('IMMEDIATE') ? 'text-red-400' : 'text-yellow-400'}`}>
                          {result.urgency}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Est. Repair Time:</span>
                        <p className="font-bold text-white">{result.estimatedRepairTime}</p>
                      </div>
                    </div>

                    {result.partsRequired.length > 0 && (
                      <div>
                        <span className="text-gray-400 text-sm">Parts That May Be Required:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.partsRequired.map((part, pIdx) => (
                            <span key={pIdx} className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">{part}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700 flex justify-end gap-4">
          <a
            href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi! I need help with generator diagnostics.\n\nIssues found:\n${results.map(r => `- ${r.parameter}: ${r.issue}`).join('\n')}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
          >
            Contact Technician
          </a>
          <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== WIRING DIAGRAM MODAL ====================
function WiringDiagramModal({
  diagram,
  onClose,
}: {
  diagram: WiringDiagram;
  onClose: () => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter terminals based on search
  const filteredSections = diagram.sections.map(section => ({
    ...section,
    terminals: section.terminals.filter(
      t => t.terminal.toLowerCase().includes(searchTerm.toLowerCase()) ||
           t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
           t.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
           t.connectTo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(s => s.terminals.length > 0 || searchTerm === '');

  // Wire color to CSS class mapping
  const getWireColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'RED': 'bg-red-500',
      'BLACK': 'bg-gray-900 border border-gray-600',
      'BLUE': 'bg-blue-500',
      'YELLOW': 'bg-yellow-400',
      'GREEN': 'bg-green-500',
      'BROWN': 'bg-amber-700',
      'ORANGE': 'bg-orange-500',
      'WHITE': 'bg-white',
      'GREY': 'bg-gray-400',
      'PINK': 'bg-pink-400',
      'VIOLET': 'bg-violet-500',
      'GREEN/YELLOW': 'bg-gradient-to-r from-green-500 to-yellow-400',
      'RED/WHITE': 'bg-gradient-to-r from-red-500 to-white',
      'RED/BLACK': 'bg-gradient-to-r from-red-500 to-gray-900',
      'YELLOW/BLACK': 'bg-gradient-to-r from-yellow-400 to-gray-900',
      'BLUE/BLACK': 'bg-gradient-to-r from-blue-500 to-gray-900',
      'WHITE/BLACK': 'bg-gradient-to-r from-white to-gray-900',
      'WHITE/BLUE': 'bg-gradient-to-r from-white to-blue-500',
      'BROWN/WHITE': 'bg-gradient-to-r from-amber-700 to-white',
      'BROWN/BLUE': 'bg-gradient-to-r from-amber-700 to-blue-500',
      'GREEN/WHITE': 'bg-gradient-to-r from-green-500 to-white',
      'YELLOW/WHITE': 'bg-gradient-to-r from-yellow-400 to-white',
      'BLUE/WHITE': 'bg-gradient-to-r from-blue-500 to-white',
      'ORANGE/BLACK': 'bg-gradient-to-r from-orange-500 to-gray-900',
      'BARE': 'bg-amber-200',
    };
    return colorMap[color.toUpperCase()] || 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-900 to-red-900 p-6 border-b border-orange-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">📐</span>
                Complete Wiring Diagram
              </h2>
              <p className="text-orange-200 mt-1">{diagram.modelName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white">✕</button>
          </div>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search terminals, functions, connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-black/30 border border-orange-700 rounded-lg text-white placeholder-orange-300/50 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview */}
          <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-bold text-orange-400 mb-3">Overview</h3>
            <p className="text-gray-300 leading-relaxed">{diagram.overview}</p>
          </section>

          {/* Safety Warnings */}
          <section className="bg-red-900/30 rounded-xl p-5 border border-red-700">
            <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
              <span>⚠️</span> Safety Warnings
            </h3>
            <ul className="space-y-2">
              {diagram.safetyWarnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-red-200">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Power Requirements */}
          <section className="bg-blue-900/30 rounded-xl p-5 border border-blue-700">
            <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
              <span>⚡</span> Power Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Operating Voltage:</span>
                <p className="text-white font-medium">{diagram.powerRequirements.voltage}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Current Draw:</span>
                <p className="text-white font-medium">{diagram.powerRequirements.current}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Fusing:</span>
                <p className="text-white font-medium">{diagram.powerRequirements.fusing}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Grounding:</span>
                <p className="text-white font-medium">{diagram.powerRequirements.grounding}</p>
              </div>
            </div>
          </section>

          {/* Terminal Wiring Sections */}
          <section>
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span>🔌</span> Terminal Connections
            </h3>

            <div className="space-y-4">
              {filteredSections.map((section) => (
                <div key={section.section} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  {/* Section Header */}
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.section ? null : section.section)}
                    className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {section.terminals.length}
                      </span>
                      <div className="text-left">
                        <h4 className="text-white font-bold">{section.section}</h4>
                        <p className="text-gray-400 text-sm">{section.description}</p>
                      </div>
                    </div>
                    <span className={`transform transition-transform ${expandedSection === section.section ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Terminal Table */}
                  {expandedSection === section.section && (
                    <div className="border-t border-gray-700">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-900">
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Terminal</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Label</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Function</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Wire</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Gauge</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Connect To</th>
                              <th className="px-4 py-3 text-left text-gray-400 font-medium">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.terminals.map((terminal, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}>
                                <td className="px-4 py-3">
                                  <span className="px-2 py-1 bg-gray-700 rounded font-mono text-orange-400 font-bold">
                                    {terminal.terminal}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-white font-medium">{terminal.label}</td>
                                <td className="px-4 py-3 text-gray-300">{terminal.function}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-4 rounded ${getWireColorClass(terminal.wireColor)}`}></div>
                                    <span className="text-gray-300 text-xs">{terminal.wireColor}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{terminal.wireGauge}</td>
                                <td className="px-4 py-3 text-cyan-400">{terminal.connectTo}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs italic">{terminal.notes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Schematic Notes */}
          <section className="bg-yellow-900/20 rounded-xl p-5 border border-yellow-700/50">
            <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <span>📝</span> Schematic Notes
            </h3>
            <ul className="space-y-2">
              {diagram.schematicNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-yellow-100">
                  <span className="text-yellow-500 mt-1">{idx + 1}.</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Installation Tips */}
          <section className="bg-green-900/20 rounded-xl p-5 border border-green-700/50">
            <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
              <span>💡</span> Installation Tips
            </h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {diagram.installationTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-green-100">
                  <span className="text-green-500">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Wire Color Legend */}
          <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
              <span>🎨</span> Wire Color Reference (IEC Standard)
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {[
                { color: 'RED', name: 'Positive/Power' },
                { color: 'BLACK', name: 'Negative/Ground' },
                { color: 'BLUE', name: 'Neutral/Data' },
                { color: 'BROWN', name: 'Phase L1' },
                { color: 'YELLOW', name: 'Phase/Signal' },
                { color: 'GREEN', name: 'Signal/Data' },
                { color: 'GREEN/YELLOW', name: 'Earth' },
                { color: 'WHITE', name: 'Signal/Sensor' },
                { color: 'GREY', name: 'Phase L3' },
                { color: 'ORANGE', name: 'Control' },
                { color: 'PINK', name: 'Auxiliary' },
                { color: 'VIOLET', name: 'Contactor' },
              ].map(({ color, name }) => (
                <div key={color} className="flex items-center gap-2">
                  <div className={`w-5 h-3 rounded ${getWireColorClass(color)}`}></div>
                  <span className="text-gray-400 text-xs">{name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-4 border-t border-gray-700 flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Generator Oracle - Professional Wiring Reference
          </p>
          <div className="flex gap-4">
            <a
              href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi! I need wiring assistance for ${diagram.modelName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
            >
              Get Wiring Support
            </a>
            <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
