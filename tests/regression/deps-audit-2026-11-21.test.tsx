// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { createRequire } from 'node:module';
import {
  HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate,
} from 'react-router-dom';

// Dependency audit 2026-11-21 (docs/security/dependency-audit-2026-11-21.md).
// 1. react-router-dom 6 -> 7.18.6: the Solar SPA (crc/src/App.tsx) uses
//    declarative mode only: HashRouter, Routes/Route, <Navigate replace>,
//    useNavigate, useLocation and <Link>. This exercises exactly that surface.
// 2. exceljs with uuid pinned to 11.1.1 by an override: exceljs calls uuid v4
//    only when writing conditional-formatting extensions (data bars).

const req = createRequire(import.meta.url);

afterEach(() => { cleanup(); window.location.hash = ''; });

function Where() {
  const loc = useLocation();
  return <p data-testid="where">{loc.pathname}</p>;
}

function Shell() {
  const navigate = useNavigate();
  return (
    <>
      <Where />
      <button onClick={() => navigate('/settings')}>Account</button>
      <Link to="/calculator">Calculator</Link>
      <Routes>
        <Route path="/dashboard" element={<h2>Dashboard page</h2>} />
        <Route path="/calculator" element={<h2>Calculator page</h2>} />
        <Route path="/settings" element={<h2>Settings page</h2>} />
        <Route path="/features" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<h2>Calculator page</h2>} />
      </Routes>
    </>
  );
}

describe('react-router-dom 7 in declarative mode (Solar SPA pattern)', () => {
  it('is the patched version (>= 7.18.0)', () => {
    const v: string = req('react-router-dom/package.json').version;
    const [maj, min] = v.split('.').map(Number);
    expect(maj > 7 || (maj === 7 && min >= 18)).toBe(true);
  });

  it('renders the index route, follows Link and useNavigate, and honours Navigate replace', async () => {
    render(<HashRouter><Shell /></HashRouter>);
    expect(screen.getByTestId('where').textContent).toBe('/');
    expect(screen.getByText('Calculator page')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(await screen.findByText('Settings page')).toBeTruthy();
    expect(window.location.hash).toBe('#/settings');

    fireEvent.click(screen.getByRole('link', { name: 'Calculator' }));
    expect(await screen.findByText('Calculator page')).toBeTruthy();
    expect(screen.getByTestId('where').textContent).toBe('/calculator');
  });

  it('redirects a retired route to /dashboard', async () => {
    window.location.hash = '#/features';
    render(<HashRouter><Shell /></HashRouter>);
    expect(await screen.findByText('Dashboard page')).toBeTruthy();
    expect(screen.getByTestId('where').textContent).toBe('/dashboard');
  });
});

describe('exceljs with the uuid 11 override', () => {
  it('resolves uuid 11.1.1 from exceljs', () => {
    const exceljsDir = req.resolve('exceljs/package.json').replace(/package\.json$/, '');
    const uuidPkg = req(req.resolve('uuid/package.json', { paths: [exceljsDir] }));
    expect(uuidPkg.version).toBe('11.1.1');
  });

  it('writes a workbook with a data-bar rule (the code path that calls uuid v4)', async () => {
    const ExcelJS = req('exceljs');
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Bars');
    [10, 20, 30].forEach((n, i) => { ws.getCell(`A${i + 1}`).value = n; });
    ws.addConditionalFormatting({
      ref: 'A1:A3',
      rules: [{ type: 'dataBar', priority: 1, cfvo: [{ type: 'min' }, { type: 'max' }] }],
    });
    const buf: Buffer = Buffer.from(await wb.xlsx.writeBuffer());
    expect(buf.subarray(0, 2).toString()).toBe('PK');

    const back = new ExcelJS.Workbook();
    await back.xlsx.load(buf);
    expect(back.getWorksheet('Bars').getCell('A3').value).toBe(30);
  }, 30_000); // a cold require of exceljs takes several seconds on this machine
});
