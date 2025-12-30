import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.SNAPSHOT_BASE_URL || 'http://127.0.0.1:3010';
const outDir = path.resolve(process.cwd(), 'debug_pages');

const routes = [
  '/',
  '/about-us',
  '/services',
  '/service',
  '/solution',
  '/solar',
  '/generators',
  '/diagnostic-suite',
];

function routeToFilename(route) {
  const clean = route.replace(/^\/+/, '').replace(/[^a-zA-Z0-9]+/g, '_');
  return (clean || 'home') + '.html';
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  for (const route of routes) {
    const url = new URL(route, baseUrl).toString();
    const res = await fetch(url, { redirect: 'follow' });
    const html = await res.text();

    const outPath = path.join(outDir, routeToFilename(route));
    await fs.writeFile(outPath, html, 'utf8');

    process.stdout.write(
      `${route.padEnd(18)} -> ${path.relative(process.cwd(), outPath)} (HTTP ${res.status}, ${html.length} chars)\n`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
