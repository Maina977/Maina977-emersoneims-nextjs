/**
 * Find every in-page anchor link whose target id does not exist.
 *
 * This is the bug class that made the main navbar's "New Generators" item
 * scroll nowhere: an href="#foo" with no id="foo" anywhere on the page it
 * lands on. It is invisible to type-checking, invisible to the build, and
 * invisible to any test that only asserts HTTP 200 — the page loads fine, the
 * click just does nothing. Exactly the kind of thing that rots quietly.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const EXT = /\.tsx$/;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', '_archive'].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(e)) out.push(p);
  }
  return out;
}

const files = walk(join(ROOT, 'app')).concat(walk(join(ROOT, 'components')));

// Collect every id="..." defined anywhere (ids are global enough for this).
const definedIds = new Set();
const fileIds = new Map();
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const ids = [...src.matchAll(/\bid=["'`]([A-Za-z][\w-]*)["'`]/g)].map((m) => m[1]);
  fileIds.set(f, new Set(ids));
  ids.forEach((i) => definedIds.add(i));
}

// components/building/** and app/(building)/** are mirrors that no route
// imports. A dead anchor in there ships to nobody, so it must not block — but
// it is still reported, because reviving a mirror revives its broken links.
const isDeadMirror = (rel) => /(^|\/)building(\/|$)|^_archive\//.test(rel);

const live = [];
const dead = [];

for (const f of files) {
  const rel = relative(ROOT, f).replace(/\\/g, '/');
  const src = readFileSync(f, 'utf8');
  // same-page anchors: href="#foo"  and  href="/path#foo"
  for (const m of src.matchAll(/href=["'`](?:([^"'`#]*))?#([A-Za-z][\w-]*)["'`]/g)) {
    const [, path, id] = m;
    if (definedIds.has(id)) continue;
    (isDeadMirror(rel) ? dead : live).push({ rel, id, path: path || '(same page)' });
  }
}

const report = (rows) => {
  const byId = {};
  for (const p of rows) (byId[p.id] ||= []).push(p);
  for (const [id, list] of Object.entries(byId)) {
    console.log(`  #${id}  (${list.length} link${list.length > 1 ? 's' : ''})`);
    for (const r of list.slice(0, 4)) console.log(`      ${r.rel}  ->  ${r.path}#${id}`);
    if (list.length > 4) console.log(`      ... and ${list.length - 4} more`);
  }
};

if (dead.length) {
  console.log(`NOTE — ${dead.length} dead anchor(s) in unused mirrors. Not shipped, not blocking:`);
  report(dead);
  console.log('');
}

if (live.length) {
  console.log(`FAIL — ${live.length} anchor link(s) in LIVE code point at an id that does not exist.`);
  console.log('The page will load normally and the click will do nothing, which is why');
  console.log('this never shows up as an error anywhere else.\n');
  report(live);
  process.exit(1);
}

console.log('PASS — every anchor in live code resolves to an id that exists.');
