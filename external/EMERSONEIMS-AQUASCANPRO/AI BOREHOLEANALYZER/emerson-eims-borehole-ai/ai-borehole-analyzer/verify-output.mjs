// Headless browser test using Playwright to capture rendered output
import { chromium } from 'playwright';

(async () => {
  console.log('Launching headless browser...');
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--use-angle=swiftshader',
      '--use-gl=angle',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
    ]
  });
  const page = await browser.newPage();

  // Collect ALL console output including errors
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    logs.push(`[PAGE ERROR] ${err.message}`);
  });

  console.log('Navigating to test page...');
  await page.goto('http://localhost:5178/test-output.html', { timeout: 120000 });

  console.log('Waiting for analysis + verification to complete (up to 8 min)...');
  try {
    await page.waitForFunction(
      () => {
        const el = document.getElementById('out');
        return el && (el.textContent.includes('VERIFICATION ENGINE REPORT') || el.textContent.includes('DEEP PROVENANCE AUDIT') || el.textContent.includes('IMPOSSIBLE VALUE CHECKS') || el.textContent.includes('ANALYSIS FAILED'));
      },
      { timeout: 480000 }
    );
    console.log('Completion marker found!');
    // Wait 5 more seconds for any remaining output
    await page.waitForTimeout(5000);
  } catch (e) {
    console.log('TIMEOUT waiting for completion after 8 minutes.');
    // Still capture whatever we have
  }

  // Get the full text content from DOM
  const content = await page.textContent('#out');
  console.log('\n' + '='.repeat(80));
  console.log('DOM CONTENT:');
  console.log(content);
  console.log('='.repeat(80));
  
  // Also dump console logs
  console.log('\nCONSOLE LOGS (' + logs.length + ' entries):');
  logs.forEach(l => console.log(l));
  console.log('='.repeat(80));

  await browser.close();
  console.log('\nDone.');
})();
