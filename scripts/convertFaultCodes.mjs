/**
 * Script to convert fault-codes-raw.csv to TypeScript
 * Run: node scripts/convertFaultCodes.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../lib/data/fault-codes-raw.csv');
const outputPath = path.join(__dirname, '../lib/data/wordpressFaultCodes.ts');

// Read CSV
const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n').filter(l => l.trim());

// Parse with a proper CSV parser (handles commas in fields)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Skip header
const codes = [];
for (let i = 1; i < lines.length; i++) {
  const fields = parseCSVLine(lines[i]);
  if (fields.length < 6) continue;
  
  const [brand, model, code, description, cause, solution1, solution2, solution3, solution4, solution5] = fields;
  
  if (!brand || !code) continue;
  
  // Combine all solutions
  const solutions = [solution1, solution2, solution3, solution4, solution5]
    .filter(s => s && s.trim().length > 5)
    .join(' | ');
  
  // Determine severity based on keywords
  let severity = 'warning';
  const descLower = (description + ' ' + cause).toLowerCase();
  if (descLower.includes('shutdown') || descLower.includes('critical') || descLower.includes('failure') || descLower.includes('overheat')) {
    severity = 'critical';
  } else if (descLower.includes('low') || descLower.includes('high') || descLower.includes('fault')) {
    severity = 'warning';
  } else if (descLower.includes('sensor') || descLower.includes('check')) {
    severity = 'info';
  }
  
  // Determine category based on keywords
  let category = 'General';
  if (descLower.includes('fuel') || descLower.includes('injector')) category = 'Fuel System';
  else if (descLower.includes('coolant') || descLower.includes('temperature') || descLower.includes('thermo')) category = 'Cooling System';
  else if (descLower.includes('oil') || descLower.includes('pressure')) category = 'Lubrication';
  else if (descLower.includes('voltage') || descLower.includes('current') || descLower.includes('phase')) category = 'Electrical';
  else if (descLower.includes('turbo') || descLower.includes('boost')) category = 'Turbo/Air Intake';
  else if (descLower.includes('sensor') || descLower.includes('ecm') || descLower.includes('ecu')) category = 'ECM/Sensors';
  else if (descLower.includes('air') || descLower.includes('filter')) category = 'Air Intake';
  else if (descLower.includes('exhaust') || descLower.includes('dpf') || descLower.includes('egr')) category = 'Exhaust/Emissions';
  else if (descLower.includes('engine') || descLower.includes('crank') || descLower.includes('cam')) category = 'Engine';
  else if (descLower.includes('generator') || descLower.includes('alternator')) category = 'Generator';
  
  codes.push({
    code: code.trim(),
    brand: brand.trim(),
    model: model.trim(),
    category,
    severity,
    title: description.trim().substring(0, 100),
    description: description.trim(),
    causes: cause.split(',').map(c => c.trim()).filter(c => c),
    solution: solutions || solution1 || 'Contact technician for diagnosis'
  });
}

// Generate TypeScript file
const tsContent = `/**
 * WORDPRESS PLUGIN FAULT CODES DATABASE
 * Extracted from EmersonEIMS Generator Intelligence Suite Pro
 * Total: ${codes.length} fault codes
 * Generated: ${new Date().toISOString()}
 */

export interface WordPressFaultCode {
  code: string;
  brand: string;
  model: string;
  category: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  causes: string[];
  solution: string;
}

export const WORDPRESS_FAULT_CODES: WordPressFaultCode[] = ${JSON.stringify(codes, null, 2)};

export const WP_FAULT_CODE_COUNT = ${codes.length};

// Get unique brands
export const WP_FAULT_BRANDS = [...new Set(WORDPRESS_FAULT_CODES.map(c => c.brand))];
`;

fs.writeFileSync(outputPath, tsContent);
console.log(`✅ Converted ${codes.length} fault codes to ${outputPath}`);

// Count by brand
const brandCounts = {};
codes.forEach(c => {
  brandCounts[c.brand] = (brandCounts[c.brand] || 0) + 1;
});
console.log('\nFault codes by brand:');
Object.entries(brandCounts).sort((a,b) => b[1] - a[1]).forEach(([brand, count]) => {
  console.log(`  ${brand}: ${count}`);
});
