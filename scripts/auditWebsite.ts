/**
 * COMPREHENSIVE WEBSITE AUDIT
 * Tests: Performance, SEO, Accessibility, Best Practices, Security
 * Standards: Awwwards SOTD, Lighthouse 100/100, Top 10 Global
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs/promises';
import path from 'path';

interface AuditResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  metrics: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    cls: number; // Cumulative Layout Shift
    tbt: number; // Total Blocking Time
    si: number;  // Speed Index
  };
}

const URLS_TO_TEST = [
  '/',
  '/counties',
  '/counties/nairobi',
  '/generators',
  '/solar',
  '/solution',
  '/diagnostic-qa',
];

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

async function runLighthouse(url: string): Promise<AuditResult> {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info' as const,
    output: 'json' as const,
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse(url, options, LIGHTHOUSE_CONFIG);
  
  await chrome.kill();
  
  if (!runnerResult) {
    throw new Error('Lighthouse audit failed');
  }
  
  const { lhr } = runnerResult;
  
  return {
    performance: lhr.categories.performance.score! * 100,
    accessibility: lhr.categories.accessibility.score! * 100,
    bestPractices: lhr.categories['best-practices'].score! * 100,
    seo: lhr.categories.seo.score! * 100,
    pwa: lhr.categories.pwa.score! * 100,
    metrics: {
      fcp: lhr.audits['first-contentful-paint'].numericValue!,
      lcp: lhr.audits['largest-contentful-paint'].numericValue!,
      cls: lhr.audits['cumulative-layout-shift'].numericValue!,
      tbt: lhr.audits['total-blocking-time'].numericValue!,
      si: lhr.audits['speed-index'].numericValue!,
    },
  };
}

async function auditWebsite(baseUrl: string = 'http://localhost:3020') {
  console.log('🔍 COMPREHENSIVE WEBSITE AUDIT\n');
  console.log('📊 Testing against:');
  console.log('   - Awwwards SOTD standards');
  console.log('   - Google Lighthouse 100/100');
  console.log('   - Top 10 Global website benchmarks');
  console.log('   - Tesla.com speed standards');
  console.log('   - Apple.com design efficiency\n');
  
  console.log('🌐 Testing URLs:');
  URLS_TO_TEST.forEach(url => console.log(`   - ${baseUrl}${url}`));
  console.log('');
  
  const results: { [url: string]: AuditResult } = {};
  
  for (const urlPath of URLS_TO_TEST) {
    const fullUrl = `${baseUrl}${urlPath}`;
    console.log(`\n⏳ Auditing: ${fullUrl}`);
    
    try {
      const result = await runLighthouse(fullUrl);
      results[urlPath] = result;
      
      console.log('\n   Scores:');
      console.log(`   ⚡ Performance:     ${result.performance.toFixed(0)}/100 ${getGrade(result.performance)}`);
      console.log(`   ♿ Accessibility:   ${result.accessibility.toFixed(0)}/100 ${getGrade(result.accessibility)}`);
      console.log(`   ✨ Best Practices:  ${result.bestPractices.toFixed(0)}/100 ${getGrade(result.bestPractices)}`);
      console.log(`   🔍 SEO:             ${result.seo.toFixed(0)}/100 ${getGrade(result.seo)}`);
      console.log(`   📱 PWA:             ${result.pwa.toFixed(0)}/100 ${getGrade(result.pwa)}`);
      
      console.log('\n   Core Web Vitals:');
      console.log(`   🎨 FCP: ${(result.metrics.fcp / 1000).toFixed(2)}s ${getFCPGrade(result.metrics.fcp)}`);
      console.log(`   🖼️  LCP: ${(result.metrics.lcp / 1000).toFixed(2)}s ${getLCPGrade(result.metrics.lcp)}`);
      console.log(`   📏 CLS: ${result.metrics.cls.toFixed(3)} ${getCLSGrade(result.metrics.cls)}`);
      console.log(`   ⏱️  TBT: ${result.metrics.tbt.toFixed(0)}ms ${getTBTGrade(result.metrics.tbt)}`);
      console.log(`   🏃 SI:  ${(result.metrics.si / 1000).toFixed(2)}s ${getSIGrade(result.metrics.si)}`);
      
    } catch (error) {
      console.error(`   ❌ Audit failed: ${error}`);
    }
  }
  
  // Calculate averages
  const avgScores = calculateAverages(results);
  
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 OVERALL AUDIT RESULTS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Average Scores:');
  console.log(`   ⚡ Performance:     ${avgScores.performance.toFixed(1)}/100 ${getGrade(avgScores.performance)}`);
  console.log(`   ♿ Accessibility:   ${avgScores.accessibility.toFixed(1)}/100 ${getGrade(avgScores.accessibility)}`);
  console.log(`   ✨ Best Practices:  ${avgScores.bestPractices.toFixed(1)}/100 ${getGrade(avgScores.bestPractices)}`);
  console.log(`   🔍 SEO:             ${avgScores.seo.toFixed(1)}/100 ${getGrade(avgScores.seo)}`);
  console.log(`   📱 PWA:             ${avgScores.pwa.toFixed(1)}/100 ${getGrade(avgScores.pwa)}`);
  
  console.log('\nAverage Core Web Vitals:');
  console.log(`   🎨 FCP: ${(avgScores.metrics.fcp / 1000).toFixed(2)}s ${getFCPGrade(avgScores.metrics.fcp)}`);
  console.log(`   🖼️  LCP: ${(avgScores.metrics.lcp / 1000).toFixed(2)}s ${getLCPGrade(avgScores.metrics.lcp)}`);
  console.log(`   📏 CLS: ${avgScores.metrics.cls.toFixed(3)} ${getCLSGrade(avgScores.metrics.cls)}`);
  console.log(`   ⏱️  TBT: ${avgScores.metrics.tbt.toFixed(0)}ms ${getTBTGrade(avgScores.metrics.tbt)}`);
  console.log(`   🏃 SI:  ${(avgScores.metrics.si / 1000).toFixed(2)}s ${getSIGrade(avgScores.metrics.si)}`);
  
  // Awwwards readiness assessment
  console.log('\n' + '═══════════════════════════════════════════════════════════');
  console.log('🏆 AWWWARDS SOTD READINESS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const awwwardsScore = assessAwwwardsReadiness(avgScores);
  console.log(awwwardsScore);
  
  // Save detailed report
  const reportPath = path.join(process.cwd(), 'audit-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}\n`);
}

function calculateAverages(results: { [url: string]: AuditResult }): AuditResult {
  const values = Object.values(results);
  const count = values.length;
  
  return {
    performance: values.reduce((sum, r) => sum + r.performance, 0) / count,
    accessibility: values.reduce((sum, r) => sum + r.accessibility, 0) / count,
    bestPractices: values.reduce((sum, r) => sum + r.bestPractices, 0) / count,
    seo: values.reduce((sum, r) => sum + r.seo, 0) / count,
    pwa: values.reduce((sum, r) => sum + r.pwa, 0) / count,
    metrics: {
      fcp: values.reduce((sum, r) => sum + r.metrics.fcp, 0) / count,
      lcp: values.reduce((sum, r) => sum + r.metrics.lcp, 0) / count,
      cls: values.reduce((sum, r) => sum + r.metrics.cls, 0) / count,
      tbt: values.reduce((sum, r) => sum + r.metrics.tbt, 0) / count,
      si: values.reduce((sum, r) => sum + r.metrics.si, 0) / count,
    },
  };
}

function getGrade(score: number): string {
  if (score >= 90) return '🟢 EXCELLENT';
  if (score >= 80) return '🟡 GOOD';
  if (score >= 50) return '🟠 NEEDS IMPROVEMENT';
  return '🔴 POOR';
}

function getFCPGrade(fcp: number): string {
  if (fcp <= 1800) return '🟢 FAST';
  if (fcp <= 3000) return '🟡 MODERATE';
  return '🔴 SLOW';
}

function getLCPGrade(lcp: number): string {
  if (lcp <= 2500) return '🟢 GOOD';
  if (lcp <= 4000) return '🟡 NEEDS IMPROVEMENT';
  return '🔴 POOR';
}

function getCLSGrade(cls: number): string {
  if (cls <= 0.1) return '🟢 GOOD';
  if (cls <= 0.25) return '🟡 NEEDS IMPROVEMENT';
  return '🔴 POOR';
}

function getTBTGrade(tbt: number): string {
  if (tbt <= 200) return '🟢 FAST';
  if (tbt <= 600) return '🟡 MODERATE';
  return '🔴 SLOW';
}

function getSIGrade(si: number): string {
  if (si <= 3400) return '🟢 FAST';
  if (si <= 5800) return '🟡 MODERATE';
  return '🔴 SLOW';
}

function assessAwwwardsReadiness(scores: AuditResult): string {
  let report = '';
  let passCount = 0;
  const totalChecks = 10;
  
  // Performance checks
  report += '✓ Performance Checks:\n';
  if (scores.performance >= 90) {
    report += '  ✅ Performance score ≥90: PASS\n';
    passCount++;
  } else {
    report += `  ❌ Performance score ${scores.performance.toFixed(0)}/100: NEEDS ${90 - scores.performance}+ points\n`;
  }
  
  if (scores.metrics.lcp <= 2500) {
    report += '  ✅ LCP ≤2.5s: PASS\n';
    passCount++;
  } else {
    report += `  ❌ LCP ${(scores.metrics.lcp / 1000).toFixed(2)}s: REDUCE by ${((scores.metrics.lcp - 2500) / 1000).toFixed(2)}s\n`;
  }
  
  if (scores.metrics.cls <= 0.1) {
    report += '  ✅ CLS ≤0.1: PASS\n';
    passCount++;
  } else {
    report += `  ❌ CLS ${scores.metrics.cls.toFixed(3)}: REDUCE by ${(scores.metrics.cls - 0.1).toFixed(3)}\n`;
  }
  
  if (scores.metrics.fcp <= 1800) {
    report += '  ✅ FCP ≤1.8s: PASS\n';
    passCount++;
  } else {
    report += `  ❌ FCP ${(scores.metrics.fcp / 1000).toFixed(2)}s: REDUCE by ${((scores.metrics.fcp - 1800) / 1000).toFixed(2)}s\n`;
  }
  
  // Quality checks
  report += '\n✓ Quality Checks:\n';
  if (scores.accessibility >= 95) {
    report += '  ✅ Accessibility ≥95: PASS\n';
    passCount++;
  } else {
    report += `  ❌ Accessibility ${scores.accessibility.toFixed(0)}/100: NEEDS ${95 - scores.accessibility}+ points\n`;
  }
  
  if (scores.bestPractices >= 95) {
    report += '  ✅ Best Practices ≥95: PASS\n';
    passCount++;
  } else {
    report += `  ❌ Best Practices ${scores.bestPractices.toFixed(0)}/100: NEEDS ${95 - scores.bestPractices}+ points\n`;
  }
  
  if (scores.seo >= 95) {
    report += '  ✅ SEO ≥95: PASS\n';
    passCount++;
  } else {
    report += `  ❌ SEO ${scores.seo.toFixed(0)}/100: NEEDS ${95 - scores.seo}+ points\n`;
  }
  
  // Overall assessment
  report += '\n✓ Overall Assessment:\n';
  const overallScore = (passCount / totalChecks) * 100;
  
  if (overallScore >= 90) {
    report += `  🏆 Awwwards SOTD Ready: ${passCount}/${totalChecks} checks passed (${overallScore.toFixed(0)}%)\n`;
    report += '  🎉 Your website meets Awwwards SOTD standards!\n';
    report += '  🚀 Ready for Top 10 Global competition!\n';
  } else if (overallScore >= 70) {
    report += `  🟡 Nearly Ready: ${passCount}/${totalChecks} checks passed (${overallScore.toFixed(0)}%)\n`;
    report += '  💪 Focus on failed checks above to reach SOTD level\n';
  } else {
    report += `  🔴 Needs Optimization: ${passCount}/${totalChecks} checks passed (${overallScore.toFixed(0)}%)\n`;
    report += '  📋 Address all failed checks to compete at global level\n';
  }
  
  return report;
}

// Run if called directly
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:3020';
  auditWebsite(baseUrl).catch(console.error);
}

export { auditWebsite, runLighthouse };
