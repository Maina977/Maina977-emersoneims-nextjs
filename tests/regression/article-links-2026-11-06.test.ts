/**
 * External audit (Nov 2026) §6.4: technical articles link to the matching
 * product and service pages.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SERVICE_PAGE, articleServiceLinks } from '@/lib/content/serviceLinks';
import { BLOG_ARTICLES } from '@/lib/data/blog-articles';
import { getAllServiceSlugs } from '@/lib/services/allServices';

const root = join(__dirname, '..', '..');
const exists = (href: string) => {
  const parts = href.split('/').filter(Boolean);
  if (existsSync(join(root, 'app', ...parts, 'page.tsx'))) return true;
  return href.startsWith('/services/') && getAllServiceSlugs().includes(parts[1]);
};

describe('article -> product/service links', () => {
  it('every target is a served page', () => {
    for (const [k, v] of Object.entries(SERVICE_PAGE)) expect(exists(v.href), `${k} -> ${v.href}`).toBe(true);
  });

  it('every data article gets at least one link', () => {
    for (const a of BLOG_ARTICLES) {
      expect(articleServiceLinks(a.relatedServices).length, a.slug).toBeGreaterThan(0);
    }
  });

  it('every hand-written article ends with the related products block', () => {
    const dirs = readdirSync(join(root, 'app/blog'), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('['))
      .map((d) => d.name)
      .filter((d) => existsSync(join(root, 'app/blog', d, 'page.tsx')));
    expect(dirs.length).toBeGreaterThanOrEqual(17);
    for (const d of dirs) {
      const src = readFileSync(join(root, 'app/blog', d, 'page.tsx'), 'utf8');
      expect(src, d).toMatch(/<ArticleServiceLinks keys=\{\[/);
    }
  });

  it('the article template no longer links related services to Nairobi location pages', () => {
    const tpl = readFileSync(join(root, 'app/blog/[slug]/page.tsx'), 'utf8');
    expect(tpl).not.toMatch(/\/kenya\/nairobi\/\$\{service\}/);
    expect(tpl).toMatch(/articleServiceLinks\(/);
  });
});
