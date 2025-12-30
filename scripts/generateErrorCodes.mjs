// Script to generate comprehensive PowerWizard and DeepSea error codes
import fs from 'fs';
import path from 'path';
import { generatePowerWizardErrorCodes, generateDeepSeaErrorCodes } from '../lib/errorCodeGenerator';

console.log('Generating PowerWizard error codes...');
const powerWizardCodes = generatePowerWizardErrorCodes();
console.log(`Generated ${powerWizardCodes.length} PowerWizard error codes`);

console.log('Generating DeepSea error codes...');
const deepSeaCodes = generateDeepSeaErrorCodes();
console.log(`Generated ${deepSeaCodes.length} DeepSea error codes`);

// Combine all codes
const allCodes = [
  ...powerWizardCodes,
  ...deepSeaCodes
];

console.log(`Total comprehensive error codes: ${allCodes.length}`);

// Save to files
const dataDir = path.join(process.cwd(), 'app', 'data', 'diagnostic');

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Save comprehensive error codes
fs.writeFileSync(
  path.join(dataDir, 'powerWizardErrorCodes.json'),
  JSON.stringify(powerWizardCodes, null, 2)
);
console.log(`Saved PowerWizard codes to: powerWizardErrorCodes.json`);

fs.writeFileSync(
  path.join(dataDir, 'deepSeaErrorCodes.json'),
  JSON.stringify(deepSeaCodes, null, 2)
);
console.log(`Saved DeepSea codes to: deepSeaErrorCodes.json`);

fs.writeFileSync(
  path.join(dataDir, 'allControllerErrorCodes.json'),
  JSON.stringify(allCodes, null, 2)
);
console.log(`Saved all codes to: allControllerErrorCodes.json`);

// Generate summary statistics
const stats = {
  total: allCodes.length,
  powerWizard: {
    total: powerWizardCodes.length,
    byModel: {},
    byCategory: {},
    bySeverity: {}
  },
  deepSea: {
    total: deepSeaCodes.length,
    byModel: {},
    byCategory: {},
    bySeverity: {}
  }
};

// PowerWizard stats
powerWizardCodes.forEach(code => {
  stats.powerWizard.byModel[code.model] = (stats.powerWizard.byModel[code.model] || 0) + 1;
  stats.powerWizard.byCategory[code.category] = (stats.powerWizard.byCategory[code.category] || 0) + 1;
  stats.powerWizard.bySeverity[code.severity] = (stats.powerWizard.bySeverity[code.severity] || 0) + 1;
});

// DeepSea stats
deepSeaCodes.forEach(code => {
  stats.deepSea.byModel[code.model] = (stats.deepSea.byModel[code.model] || 0) + 1;
  stats.deepSea.byCategory[code.category] = (stats.deepSea.byCategory[code.category] || 0) + 1;
  stats.deepSea.bySeverity[code.severity] = (stats.deepSea.bySeverity[code.severity] || 0) + 1;
});

fs.writeFileSync(
  path.join(dataDir, 'errorCodeStatistics.json'),
  JSON.stringify(stats, null, 2)
);

console.log('\n=== ERROR CODE DATABASE STATISTICS ===');
console.log(`Total Error Codes: ${stats.total}`);
console.log('\nPowerWizard:');
console.log(`  Total: ${stats.powerWizard.total}`);
console.log('  By Model:', stats.powerWizard.byModel);
console.log('  By Category:', stats.powerWizard.byCategory);
console.log('  By Severity:', stats.powerWizard.bySeverity);
console.log('\nDeepSea:');
console.log(`  Total: ${stats.deepSea.total}`);
console.log('  By Model:', stats.deepSea.byModel);
console.log('  By Category:', stats.deepSea.byCategory);
console.log('  By Severity:', stats.deepSea.bySeverity);

console.log('\n✅ All error code files generated successfully!');
console.log(`\nFiles created in: ${dataDir}`);
console.log('- powerWizardErrorCodes.json');
console.log('- deepSeaErrorCodes.json');
console.log('- allControllerErrorCodes.json');
console.log('- errorCodeStatistics.json');
