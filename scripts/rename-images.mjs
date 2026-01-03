/**
 * Image Rename Script
 * Run with: node scripts/rename-images.mjs
 * 
 * This script:
 * 1. Renames numbered image files to SEO-friendly names
 * 2. Updates all code references
 */

import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Image rename mapping
const imageRenameMap = {
  // UPS & Power Protection
  '901.png': 'ups-power-protection-system.png',
  '902.png': 'ups-battery-bank.png',
  '903.png': 'ups-rack-mount.png',
  '904.png': 'ups-control-panel.png',
  
  // HVAC & Air Conditioning
  '909.png': 'hvac-air-conditioning-unit.png',
  '910.png': 'hvac-commercial-system.png',
  '911.png': 'hvac-industrial-cooling.png',
  '912.png': 'hvac-vrf-system.png',
  
  // Motors & Rewinding
  '920.png': 'motor-rewinding-workshop.png',
  '921.png': 'electric-motor-repair.png',
  '922.png': 'motor-diagnostics-testing.png',
  
  // Borehole & Water Systems
  '913.png': 'borehole-pump-installation.png',
  '914.png': 'water-pump-system.png',
  '915.png': 'solar-water-pumping.png',
  '916.png': 'water-treatment-plant.png',
  
  // High Voltage Infrastructure
  '917.png': 'high-voltage-transformer.png',
  '918.png': 'switchgear-panel.png',
  '919.png': 'power-distribution-board.png',
  
  // Steel & Fabrication
  '923.png': 'steel-fabrication-workshop.png',
  '924.png': 'generator-canopy-fabrication.png',
  '65.png': 'custom-control-panel.png',
  '66.png': 'structural-steel-work.png',
  
  // Incinerators
  '72.png': 'medical-waste-incinerator.png',
  '73.png': 'industrial-incinerator.png',
  '74.png': 'incinerator-emission-control.png',
  '75.png': 'waste-management-system.png',
};

console.log('🖼️  Emerson Energy - Image SEO Rename Script');
console.log('='.repeat(50));

// Step 1: Rename physical files
const imagesDir = join(rootDir, 'public', 'images');
let filesRenamed = 0;

console.log('\n📁 Renaming image files...');
for (const [oldName, newName] of Object.entries(imageRenameMap)) {
  const oldPath = join(imagesDir, oldName);
  const newPath = join(imagesDir, newName);
  
  if (existsSync(oldPath)) {
    try {
      renameSync(oldPath, newPath);
      console.log(`  ✅ ${oldName} → ${newName}`);
      filesRenamed++;
    } catch (err) {
      console.log(`  ❌ Failed: ${oldName} - ${err.message}`);
    }
  } else {
    console.log(`  ⏭️  Skip: ${oldName} (not found)`);
  }
}

// Step 2: Update code references
console.log('\n📝 Updating code references...');

const filesToUpdate = [
  'app/services/page.tsx',
  'app/solutions/ups/page.tsx',
  'app/solutions/ac/page.tsx',
  'app/solutions/motor-rewinding/page.tsx',
  'app/solutions/borehole-pumps/page.tsx',
  'app/solutions/incinerators/page.tsx',
  'app/fabrication/page.tsx',
];

let filesUpdated = 0;

for (const filePath of filesToUpdate) {
  const fullPath = join(rootDir, filePath);
  
  if (existsSync(fullPath)) {
    let content = readFileSync(fullPath, 'utf-8');
    let modified = false;
    
    for (const [oldName, newName] of Object.entries(imageRenameMap)) {
      const oldRef = `/images/${oldName}`;
      const newRef = `/images/${newName}`;
      
      if (content.includes(oldRef)) {
        content = content.replaceAll(oldRef, newRef);
        modified = true;
      }
    }
    
    if (modified) {
      writeFileSync(fullPath, content, 'utf-8');
      console.log(`  ✅ Updated: ${filePath}`);
      filesUpdated++;
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log(`📊 Summary:`);
console.log(`   Files renamed: ${filesRenamed}`);
console.log(`   Code files updated: ${filesUpdated}`);
console.log('✨ Done!');
