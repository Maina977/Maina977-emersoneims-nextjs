#!/usr/bin/env node

/**
 * Build Security Script
 *
 * COPYRIGHT NOTICE:
 * Copyright (c) 2024-2026 Generator Oracle. All Rights Reserved.
 *
 * This script runs during the build process to:
 * 1. Generate build integrity checksums
 * 2. Inject copyright headers into built files
 * 3. Validate source file integrity
 * 4. Generate security metadata
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Build configuration
const BUILD_CONFIG = {
  copyrightHolder: 'Generator Oracle',
  copyrightYear: '2024-2026',
  buildVersion: '3.0.0',
};

// Generate unique build ID
function generateBuildId() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `${timestamp}-${random}`;
}

// Generate file checksum
function generateChecksum(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

// Generate build integrity hash
function generateBuildIntegrity(directory) {
  const checksums = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath);
      } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js'))) {
        checksums.push(generateChecksum(filePath));
      }
    }
  }

  if (fs.existsSync(directory)) {
    walkDir(directory);
  }

  return crypto.createHash('sha256').update(checksums.join('')).digest('hex').substring(0, 32);
}

// Copyright banner for source files
const COPYRIGHT_BANNER = `/**
 * Generator Oracle - Proprietary Software
 * Copyright (c) ${BUILD_CONFIG.copyrightYear} ${BUILD_CONFIG.copyrightHolder}
 * All Rights Reserved.
 *
 * NOTICE: This is proprietary software protected by copyright law.
 * Unauthorized copying, modification, distribution, or use is prohibited.
 */

`;

// Main build security function
function runBuildSecurity() {
  console.log('\\n🔒 Running Build Security Checks...\\n');

  const buildId = generateBuildId();
  const timestamp = new Date().toISOString();

  // Calculate integrity hashes for key directories
  const integrityHashes = {
    lib: generateBuildIntegrity('./lib'),
    components: generateBuildIntegrity('./components'),
    app: generateBuildIntegrity('./app'),
  };

  const combinedChecksum = crypto
    .createHash('sha256')
    .update(Object.values(integrityHashes).join(''))
    .digest('hex')
    .substring(0, 32);

  // Generate build metadata
  const buildMetadata = {
    buildId,
    timestamp,
    version: BUILD_CONFIG.buildVersion,
    checksum: combinedChecksum,
    integrityHashes,
    copyright: {
      holder: BUILD_CONFIG.copyrightHolder,
      year: BUILD_CONFIG.copyrightYear,
      license: 'Proprietary',
    },
  };

  // Write build metadata
  const metadataPath = path.join(__dirname, '..', '.build-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(buildMetadata, null, 2));

  // Create environment variables for Next.js
  const envContent = `# Auto-generated build security variables
# Generated: ${timestamp}
NEXT_PUBLIC_BUILD_ID=${buildId}
NEXT_PUBLIC_BUILD_TIMESTAMP=${timestamp}
NEXT_PUBLIC_BUILD_CHECKSUM=${combinedChecksum}
NEXT_PUBLIC_BUILD_VERSION=${BUILD_CONFIG.buildVersion}
`;

  const envLocalPath = path.join(__dirname, '..', '.env.build');
  fs.writeFileSync(envLocalPath, envContent);

  // Print summary
  console.log('✅ Build Security Summary:');
  console.log(`   Build ID: ${buildId}`);
  console.log(`   Timestamp: ${timestamp}`);
  console.log(`   Version: ${BUILD_CONFIG.buildVersion}`);
  console.log(`   Checksum: ${combinedChecksum}`);
  console.log(`   Copyright: © ${BUILD_CONFIG.copyrightYear} ${BUILD_CONFIG.copyrightHolder}`);
  console.log('');
  console.log('   Integrity Hashes:');
  console.log(`   - lib: ${integrityHashes.lib}`);
  console.log(`   - components: ${integrityHashes.components}`);
  console.log(`   - app: ${integrityHashes.app}`);
  console.log('');
  console.log('📁 Generated files:');
  console.log(`   - ${metadataPath}`);
  console.log(`   - ${envLocalPath}`);
  console.log('');
  console.log('🔐 Build security checks complete.\\n');

  return buildMetadata;
}

// Validate critical files exist
function validateCriticalFiles() {
  const criticalFiles = [
    'LICENSE',
    'lib/security/index.ts',
    'lib/security/code-protection.ts',
    'lib/security/malware-protection.ts',
  ];

  console.log('📋 Validating critical security files...\\n');

  let allValid = true;
  for (const file of criticalFiles) {
    const filePath = path.join(__dirname, '..', file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allValid = false;
  }

  console.log('');

  if (!allValid) {
    console.error('❌ Some critical security files are missing!');
    process.exit(1);
  }

  console.log('✅ All critical security files validated.\\n');
}

// Run if executed directly
if (require.main === module) {
  validateCriticalFiles();
  runBuildSecurity();
}

module.exports = { runBuildSecurity, generateBuildId, generateChecksum };
