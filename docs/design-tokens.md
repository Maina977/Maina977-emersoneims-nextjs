# Design Token Lock

> One token set. One source of truth. No module-by-module visual drift.

The visual language of every page in this app — landing page, simulator,
quote audit, diagnostics cockpit, product database, documentation /
knowledge base, and the homepage feature block — is governed by a single
locked design-token set.

## Sources of truth

| Layer | File | Used by |
|---|---|---|
| TypeScript tokens | [lib/design-tokens.ts](../lib/design-tokens.ts) | Tailwind config, component logic |
| Tailwind theme   | [tailwind.config.ts](../tailwind.config.ts) | every `className=` in `.tsx` |
| CSS custom props | [app/styles/tokens.css](../app/styles/tokens.css) | every plain `.css` file |

`tailwind.config.ts` imports `lib/design-tokens.ts` directly. The CSS file
is a hand-mirrored copy of the same values. **When you change a token,
update both files.**

## What is tokenised

- **Color** — `color.gray.*`, `color.brand.*`, `color.surface.*`, `color.text.*`, `color.border.*`
- **Status** — `status.success | info | warning | danger | neutral` (each has `fg / bg / border / solid`)
- **Spacing** — Tailwind 4px grid (`spacing.*`); CSS variables on 8px grid (`--space-*`)
- **Radius** — `radius.sm | md | lg | xl | 2xl | 3xl | full`
- **Shadow** — `shadow.xs … shadow.2xl`, plus `premium`, `glow`, `focus`, `inset`
- **Typography** — `fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`
- **Motion** — `easing.*`, `duration.*`
- **Z-index** — `zIndex.base … tooltip`

## Lock rules (enforced at review time)

1. **No raw hex / rgba / px / rem in components.** If you need a value,
   it must already exist in `lib/design-tokens.ts`. If it doesn't, add
   it there first.
2. **No module-private tokens.** Diagnostics, simulator, quote audit,
   product DB, docs, landing and homepage feature block all draw from
   the same names. Do not introduce `--diagnostics-warning` or
   `text-quote-audit-red`.
3. **Status colors are universal.** Diagnostics urgency, quote-audit
   findings, simulator alarms, product-DB stock badges and doc callouts
   all use the same `status.*` palette and the shared `.status-chip` /
   `.status-dot` utility classes.
4. **One radius set.** Cards, panels, buttons, modals — pick from
   `radius.*`. No `border-radius: 7px` one-offs.
5. **One shadow set.** Elevation comes from `shadow.*`. Custom
   `box-shadow` strings in module CSS are forbidden.
6. **One typography scale.** Headings choose from `fontSize.*` /
   `fontSize.display | headline | title`. No ad-hoc `font-size: 22px`.
7. **Brand color changes happen in one place.** Editing
   `color.brand.gold` (or any other token) must propagate to every
   surface automatically — that is the whole point of the lock.

## How to use the tokens

### In Tailwind classes (`.tsx`)
```tsx
<button className="bg-brand-gold text-ink-primary rounded-lg shadow-md px-4 py-2">
  Run diagnostics
</button>

<span className="text-success">Online</span>
<span className="text-danger">Fault detected</span>
```

### In plain CSS (module styles)
```css
.simulator-panel {
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  font-size: var(--text-base);
  transition: box-shadow var(--duration-base) var(--ease-apple);
}
```

### Status badges (any module)
```tsx
<span className="status-chip status-chip--warning">
  <span className="status-dot status-dot--warning" />
  Service due
</span>
```

## Adding a new token

1. Edit `lib/design-tokens.ts` — add the value under the correct group.
2. Mirror the value into `app/styles/tokens.css` (custom property).
3. Tailwind picks up the change automatically; no further config edits.
4. Reference it everywhere by **name only**.

## Removing visual drift

If you find a hard-coded hex/rgba/px/rem in a module, either:
- replace it with the matching token, or
- if no matching token exists, add one to the source of truth and then
  replace.

That keeps the design system locked.
