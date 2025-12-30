import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const WORKSPACE_ROOT = process.cwd();
const REPORT_PATH = path.join(WORKSPACE_ROOT, 'EXTERNAL_MEDIA_USAGE.md');

function getOutPathForUrl(url) {
  const urlObj = new URL(url);
  const filename = path.posix.basename(urlObj.pathname);
  const ext = path.extname(filename).toLowerCase();
  const outDir = ext === '.mp4' ? path.join('public', 'videos', 'wp') : path.join('public', 'images', 'wp');
  return { filename, outPath: path.join(WORKSPACE_ROOT, outDir, filename) };
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function fileLooksLikeHtml(filePath) {
  try {
    const fh = await fs.open(filePath, 'r');
    try {
      const buf = Buffer.alloc(32);
      const { bytesRead } = await fh.read(buf, 0, buf.length, 0);
      const head = buf.subarray(0, bytesRead).toString('utf8');
      return head.includes('<!DOCTYPE html') || head.includes('<html') || head.includes('Vercel Security Checkpoint');
    } finally {
      await fh.close();
    }
  } catch {
    return false;
  }
}

async function downloadOne(context, url) {
  const { filename, outPath } = getOutPathForUrl(url);
  await ensureDir(outPath);

  // Skip if already a non-HTML file
  try {
    await fs.access(outPath);
    if (!(await fileLooksLikeHtml(outPath))) {
      return { url, filename, outPath, status: 'skipped_exists' };
    }
  } catch {
    // ignore
  }

  // Use browser context to pass any JS checkpoint, then fetch via API request with cookies.
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    // Give checkpoint JS a moment if it appears
    await page.waitForTimeout(5_000);

    const response = await context.request.get(url, {
      timeout: 60_000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.emersoneims.com/',
        Accept: '*/*',
      },
    });

    const contentType = response.headers()['content-type'] ?? '';
    const statusCode = response.status();
    const body = await response.body();

    // Guard against still getting the HTML checkpoint.
    const head = body.subarray(0, Math.min(256, body.length)).toString('utf8');
    const looksHtml = contentType.includes('text/html') || head.includes('<!DOCTYPE html') || head.includes('Vercel Security Checkpoint');
    if (looksHtml) {
      return { url, filename, outPath, status: 'blocked_html', statusCode, contentType };
    }

    await fs.writeFile(outPath, body);
    return { url, filename, outPath, status: 'downloaded', statusCode, contentType, bytes: body.length };
  } finally {
    await page.close().catch(() => undefined);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const argUrlIndex = args.indexOf('--url');
  const singleUrl = argUrlIndex !== -1 ? args[argUrlIndex + 1] : undefined;
  const argLimitIndex = args.indexOf('--limit');
  const limit = argLimitIndex !== -1 ? Number(args[argLimitIndex + 1]) : undefined;

  const raw = await fs.readFile(REPORT_PATH, 'utf8');
  const urls = [...raw.matchAll(/https?:\/\/[^\s\)\]]+/g)].map((m) => m[0]);

  let wpUrls = Array.from(
    new Set(
      urls
        .filter((u) => u.includes('/wp-content/uploads/'))
        .map((u) => u.replace(/^https:\/\/emersoneims\.com\//, 'https://www.emersoneims.com/'))
    )
  ).sort();

  if (singleUrl) {
    wpUrls = [singleUrl.replace(/^https:\/\/emersoneims\.com\//, 'https://www.emersoneims.com/')];
  }
  if (Number.isFinite(limit) && limit > 0) {
    wpUrls = wpUrls.slice(0, limit);
  }

  console.log(`Found wp URLs: ${wpUrls.length}${singleUrl ? ' (single)' : ''}${Number.isFinite(limit) ? ` (limit=${limit})` : ''}`);

  if (wpUrls.length === 0) {
    console.log('No wp-content URLs found in report.');
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  let downloaded = 0;
  let blocked = 0;
  let skipped = 0;

  try {
    for (const url of wpUrls) {
      const result = await downloadOne(context, url);
      if (result.status === 'downloaded') {
        downloaded += 1;
        console.log(`OK  ${result.filename} (${result.bytes} bytes)`);
      } else if (result.status === 'skipped_exists') {
        skipped += 1;
        console.log(`SKIP ${result.filename}`);
      } else {
        blocked += 1;
        console.log(`BLOCKED ${result.filename} (${result.statusCode ?? 'n/a'} ${result.contentType ?? ''})`);
      }
    }
  } finally {
    await context.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }

  console.log(`Done. downloaded=${downloaded} skipped=${skipped} blocked=${blocked}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
