import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ToolPlaceholder, TOOL_SLOT, TOOL_PLACEHOLDER, toolPlaceholder } from '@/components/solar/toolReserve';
import SolarToolTabs from '@/components/solar/SolarToolTabs';
import SolarROICalculator from '@/components/solar/SolarROICalculator';
import SolarInstallationBooking from '@/components/solar/SolarInstallationBooking';

const src = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');
afterEach(() => { cleanup(); sessionStorage.clear(); });

function px(cls: string, prefix: string): number | null {
  const m = cls.split(/\s+/).find((c) => c.startsWith(prefix));
  const n = m?.match(/min-h-\[(\d+)px\]/);
  return n ? Number(n[1]) : null;
}

describe('/solar tools reserve their final height while they download (CLS 0.28 fix)', () => {
  it('the ROI placeholder is not the old 384 px box and is sized at every breakpoint', () => {
    render(<ToolPlaceholder tool="roi" name="the Savings Calculator" />);
    const el = screen.getByRole('status', { name: 'Loading the Savings Calculator' });
    expect(el).toHaveAttribute('data-tool-reserve');
    expect(el.className).not.toMatch(/\bh-96\b/);
    for (const bp of ['min-h-[', 'sm:min-h-[', 'lg:min-h-[', 'xl:min-h-[']) expect(el.className).toContain(bp);
  });

  it('panel reservation = placeholder + 160 px for the slow note, per breakpoint, and only while the placeholder is shown', () => {
    for (const tool of ['roi', 'sizing'] as const) {
      for (const [slot, ph] of [['has-', 'min-h-'], ['sm:has-', 'sm:min-h-'], ['lg:has-', 'lg:min-h-']]) {
        const a = px(TOOL_SLOT[tool], slot), b = px(TOOL_PLACEHOLDER[tool], ph);
        expect(a, `${tool} ${slot}`).not.toBeNull();
        expect(a! - b!).toBe(160);
      }
      expect(TOOL_SLOT[tool].split(/\s+/).every((c) => c.includes('has-[[data-tool-reserve]]:'))).toBe(true);
    }
    // ROI on a phone: ~2,230 px (calculated from the markup); must be well above one screen.
    expect(px(TOOL_SLOT.roi, 'has-')!).toBeGreaterThan(2000);
  });

  it('toolPlaceholder() works as a loading function', () => {
    const Loading = toolPlaceholder('screen', 'the shop');
    render(<>{Loading()}</>);
    expect(screen.getByRole('status', { name: 'Loading the shop' }).className).toContain('min-h-[calc(100svh-160px)]');
  });

  it('every lazily loaded /solar tool uses a reserved placeholder and its tab panel holds the space', () => {
    const page = src('app/solar/page.tsx');
    expect(page).not.toMatch(/h-96/);
    expect(page).toMatch(/SolarROICalculator = resilient\([^;]*loading: toolPlaceholder\('roi'/);
    expect(page).toMatch(/SolarBibleEngine = resilient\([^;]*loading: toolPlaceholder\('sizing'/);
    for (const c of ['SolarProductsShop', 'SolarInstallationBooking', 'SolarMaintenanceHub', 'Solar3DDesignStudio', 'True3DWebGLViewer']) {
      expect(page).toMatch(new RegExp(`const ${c} = [^;]*toolPlaceholder\\('screen'`));
    }
    expect(page).toMatch(/className=\{TOOL_SLOT\.roi\}\s*>\s*<SolarROICalculator \/>/);
    expect(page).toMatch(/className=\{TOOL_SLOT\.sizing\}\s*>\s*<SolarBibleEngine \/>/);
  });
});

describe('/solar accessibility findings', () => {
  const page = src('app/solar/page.tsx');

  it('select-name: the location select has a label', () => {
    expect(page).toMatch(/<label htmlFor="solar-location"/);
    expect(page).toMatch(/<select\s+id="solar-location"/);
  });

  it('link-name: the floating WhatsApp link has a name', () => {
    expect(page).toMatch(/aria-label="Chat with us on WhatsApp \(opens in a new tab\)"/);
  });

  it('scrollable-region-focusable: every horizontal scroller on /solar can take keyboard focus and is named', () => {
    const lines = page.split('\n').filter((l) => l.includes('overflow-x-auto'));
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) expect(l).toMatch(/tabIndex=\{0\} role="region" aria-label=/);
    const gallery = src('components/ui/CinematicImageGallery.tsx').split('\n').filter((l) => l.includes('overflow-x-auto'));
    for (const l of gallery) expect(l).toMatch(/tabIndex=\{0\}/);
  });

  it('color-contrast: no grey-500 text or orange-600-on-white left on the page', () => {
    expect(page).not.toMatch(/text-(gray|slate)-500\b/);
    expect(page).not.toMatch(/bg-white text-orange-600/);
    expect(src('components/solar/SolarROICalculator.tsx')).not.toMatch(/text-slate-500\b/);
  });

  it('tab bar: open tab and badges have AA contrast; every tab is at least 44 px tall', () => {
    const tabs = [{ id: 'a', label: 'Solar Overview', icon: '☀️', badge: 'START' }, { id: 'b', label: 'Savings Calculator', icon: '💰' }] as const;
    render(<SolarToolTabs tabs={tabs} active="a" onSelect={() => {}} />);
    const open = screen.getByRole('tab', { name: /Solar Overview/ });
    expect(open.className).toContain('bg-amber-500 text-slate-950');
    expect(open.className).not.toMatch(/text-white/);
    for (const t of screen.getAllByRole('tab')) expect(t.className).toContain('min-h-[44px]');
    expect(screen.getByText('START').className).toContain('bg-red-600');
  });
});

describe('/solar mobile usability (390 px)', () => {
  it('ROI controls: sliders and battery checkbox row are 44 px tap targets; every input has a label', () => {
    render(<SolarROICalculator />);
    for (const id of ['roi-size', 'roi-battery']) expect(document.getElementById(id)!.className).toContain('h-11');
    expect(screen.getByLabelText(/Include Battery Storage/).closest('label')!.className).toContain('min-h-[44px]');
    for (const el of Array.from(document.querySelectorAll('input'))) {
      const named = (el.id && document.querySelector(`label[for="${el.id}"]`)) || el.closest('label');
      expect(named, el.outerHTML).toBeTruthy();
    }
  });

  it('booking form: every field has a label and the step bar fits 390 px (4 x 40 + 3 x 32 = 256 px)', () => {
    render(<SolarInstallationBooking />);
    for (const el of Array.from(document.querySelectorAll('input, select, textarea'))) {
      expect(document.querySelector(`label[for="${el.id}"]`), el.outerHTML).toBeTruthy();
    }
    expect(src('components/solar/SolarInstallationBooking.tsx')).toMatch(/w-6 sm:w-16 md:w-24 h-1 mx-1 sm:mx-2/);
  });
});
