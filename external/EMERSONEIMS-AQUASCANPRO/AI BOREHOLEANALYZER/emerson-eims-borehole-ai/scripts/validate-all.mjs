/**
 * FULL PROJECT VALIDATION SCRIPT
 * 
 * Runs all checks across the entire project:
 *   1. TypeScript type checking (ai-borehole-analyzer)
 *   2. Vite production build (ai-borehole-analyzer)
 *   3. Python __init__.py audit (backend)
 *   4. Python syntax check (backend)
 *   5. File hygiene checks
 * 
 * Usage: node scripts/validate-all.mjs
 */

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, readFileSync } from 'fs';
import { join, relative, extname } from 'path';

const ROOT = process.cwd();
const BACKEND = join(ROOT, 'backend');
const APP = join(BACKEND, 'app');
const AI_ANALYZER = join(ROOT, 'ai-borehole-analyzer');

let errors = [];
let warnings = [];
let passed = 0;

function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (e) {
    errors.push({ name, message: e.message || String(e) });
    console.log(`  ❌ ${name}: ${e.message || e}`);
  }
}

function warn(name, message) {
  warnings.push({ name, message });
  console.log(`  ⚠️  ${name}: ${message}`);
}

// ─── Collect all directories under a path ───
function getAllDirs(dir, list = []) {
  if (!existsSync(dir)) return list;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '__pycache__' && entry.name !== '.venv') {
      const full = join(dir, entry.name);
      list.push(full);
      getAllDirs(full, list);
    }
  }
  return list;
}

// ─── Collect all files matching an extension ───
function getAllFiles(dir, ext, list = []) {
  if (!existsSync(dir)) return list;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '__pycache__') {
      getAllFiles(full, ext, list);
    } else if (entry.isFile() && extname(entry.name) === ext) {
      list.push(full);
    }
  }
  return list;
}

console.log('\n═══════════════════════════════════════════');
console.log('  EMERSON EIMS — Full Project Validation');
console.log('═══════════════════════════════════════════\n');

// ═══════════════════════════════════════
// 1. TYPESCRIPT TYPE CHECKING
// ═══════════════════════════════════════
console.log('▶ TypeScript Type Checking...');
check('tsc --noEmit (zero type errors)', () => {
  execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' });
});

// ═══════════════════════════════════════
// 2. VITE PRODUCTION BUILD
// ═══════════════════════════════════════
console.log('\n▶ Vite Production Build...');
check('vite build (ai-borehole-analyzer)', () => {
  execSync('npx vite build', { cwd: AI_ANALYZER, stdio: 'pipe' });
});

// ═══════════════════════════════════════
// 3. PYTHON __init__.py AUDIT
// ═══════════════════════════════════════
console.log('\n▶ Python Package Structure Audit...');

// Check for wrongly-named init.py files
const allDirs = getAllDirs(APP);
for (const dir of allDirs) {
  const badInit = join(dir, 'init.py');
  const goodInit = join(dir, '__init__.py');
  
  if (existsSync(badInit)) {
    const rel = relative(ROOT, badInit);
    errors.push({ name: 'init.py naming', message: `${rel} should be __init__.py` });
    console.log(`  ❌ ${rel} — should be __init__.py`);
  }
}

// Check all Python directories have __init__.py
const pyDirs = allDirs.filter(d => {
  const files = readdirSync(d);
  return files.some(f => f.endsWith('.py') && f !== '__init__.py');
});

for (const dir of pyDirs) {
  const initFile = join(dir, '__init__.py');
  if (!existsSync(initFile)) {
    const rel = relative(ROOT, dir);
    warn('Missing __init__.py', rel);
  }
}

check('No init.py naming errors', () => {
  const bad = allDirs.filter(d => existsSync(join(d, 'init.py')));
  if (bad.length > 0) throw new Error(`${bad.length} directories have init.py instead of __init__.py`);
});

// ═══════════════════════════════════════
// 4. PYTHON SYNTAX CHECK
// ═══════════════════════════════════════
console.log('\n▶ Python Syntax Check...');
const pyFiles = getAllFiles(APP, '.py');
let pySyntaxErrors = 0;
for (const f of pyFiles) {
  try {
    execSync(`python -c "import ast; ast.parse(open(r'${f}', encoding='utf-8').read())"`, { stdio: 'pipe' });
  } catch {
    const rel = relative(ROOT, f);
    errors.push({ name: 'Python syntax', message: `${rel} has syntax errors` });
    console.log(`  ❌ ${rel} — syntax error`);
    pySyntaxErrors++;
  }
}
if (pySyntaxErrors === 0) {
  passed++;
  console.log(`  ✅ All ${pyFiles.length} Python files — valid syntax`);
}

// ═══════════════════════════════════════
// 5. FILE HYGIENE
// ═══════════════════════════════════════
console.log('\n▶ File Hygiene Checks...');

// Check no .ts files in Python backend
check('No TypeScript in backend/', () => {
  const tsInBackend = getAllFiles(APP, '.ts');
  if (tsInBackend.length > 0) {
    throw new Error(`Found .ts files in backend: ${tsInBackend.map(f => relative(ROOT, f)).join(', ')}`);
  }
});

// Check no .py files in frontend
check('No Python in ai-borehole-analyzer/', () => {
  const pyInFrontend = getAllFiles(AI_ANALYZER, '.py');
  if (pyInFrontend.length > 0) {
    throw new Error(`Found .py files in frontend: ${pyInFrontend.map(f => relative(ROOT, f)).join(', ')}`);
  }
});

// Check for duplicate function exports in reportGenerator
check('No duplicate function exports in reportGenerator.ts', () => {
  const rgPath = join(AI_ANALYZER, 'src', 'reportGenerator.ts');
  if (!existsSync(rgPath)) return;
  const content = readFileSync(rgPath, 'utf-8');
  const exportFns = [...content.matchAll(/^export\s+(?:async\s+)?function\s+(\w+)/gm)];
  const names = exportFns.map(m => m[1]);
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupes.length > 0) {
    throw new Error(`Duplicate exported functions: ${[...new Set(dupes)].join(', ')}`);
  }
});

// Check that key imports exist
check('Frontend imports match exports', () => {
  const indexPath = join(AI_ANALYZER, 'src', 'index.tsx');
  const rgPath = join(AI_ANALYZER, 'src', 'reportGenerator.ts');
  if (!existsSync(indexPath) || !existsSync(rgPath)) return;
  
  const indexContent = readFileSync(indexPath, 'utf-8');
  const rgContent = readFileSync(rgPath, 'utf-8');
  
  // Extract named imports from reportGenerator in index.tsx
  const importMatch = indexContent.match(/import\s*\{([^}]+)\}\s*from\s*['"]\.\/reportGenerator['"]/);
  if (!importMatch) return;
  
  const imported = importMatch[1].split(',').map(s => s.trim().replace(/\s+as\s+\w+/, '')).filter(s => !s.startsWith('type '));
  const exported = [...rgContent.matchAll(/^export\s+(?:async\s+)?(?:function|class|const|let)\s+(\w+)/gm)].map(m => m[1]);
  
  const missing = imported.filter(i => !exported.includes(i));
  if (missing.length > 0) {
    throw new Error(`index.tsx imports [${missing.join(', ')}] but reportGenerator.ts does not export them`);
  }
});

// ═══════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log(`  RESULTS: ${passed} passed, ${errors.length} errors, ${warnings.length} warnings`);
console.log('═══════════════════════════════════════════');

if (errors.length > 0) {
  console.log('\n🔴 ERRORS:');
  for (const e of errors) {
    console.log(`   • ${e.name}: ${e.message}`);
  }
}

if (warnings.length > 0) {
  console.log('\n🟡 WARNINGS:');
  for (const w of warnings) {
    console.log(`   • ${w.name}: ${w.message}`);
  }
}

if (errors.length === 0) {
  console.log('\n✅ ALL CHECKS PASSED — Project is clean.\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${errors.length} ERROR(S) FOUND — Fix before committing.\n`);
  process.exit(1);
}
