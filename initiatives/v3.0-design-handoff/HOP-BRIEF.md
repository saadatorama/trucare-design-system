# HoP Brief — TruCare Design System v3.0

**Decision:** BUILD
**Date:** 2026-04-22
**Gates:** Healthcare Domain SKIPPED (no PHI, no clinical/RCM logic). Security/Compliance SKIPPED (no auth, no data flow, static tokens + assets only).

## Problem

Claude Design handoff bundle `l9c2v3kLvK0uNR2psuNXgw` synthesized the TruCare brand across marketing and admin surfaces. Our admin design system was missing canonical brand tokens (extended palettes, gradients, marketing type scale for cross-surface reference) and didn't carry product logo assets. The bundle's shadow treatment also flattens to hairlines — which aligns with our locked border-only card policy and lets us retire ad-hoc shadow usage.

## What ships in v3.0

- **Extended token layer** in `src/styles/index.css`: violet/blue/teal pales, coral family, extended neutrals (ink-2/ink-3/stone/fog/chalk), marketing type scale (reference-only `--text-h1..pretitle`), spacing aliases (`--space-0..--space-40`), gradient tokens, flattened shadow tokens.
- **Brand asset kit** at `public/brand/`: TruCare mark (svg/png + blue/ink/white variants), TruIntake mark, favicon.
- **Preview surfaces**: new "Brand (v3.0)" nav group in App.tsx (Logo Family, Shadows, Marketing Type) plus extended color and gradient sections.
- **Frozen reference** of the full handoff bundle at `brand-bundle/` for future audits.
- **Single-file vite build** replacing v2.2 as the published preview.

## What does NOT ship

- **Marketing React components from the bundle.** `@trucare/ui` stays admin-pure. Marketing surfaces live on trucarebilling.com and will consume these tokens when/if that site gets a React port. Shipping marketing components now would balloon the bundle and blur the library's contract.
- **Product marks for TruCred / TruRev / TruIntel.** Vector handoff pending. Deferred, not descoped.
- **Wiring the marketing type scale to components.** Tokens land as CSS variables only; no admin component consumes them. Admin type stays capped at 24px.

## Locked decisions preserved (no regression)

36px default button / 28px xs for tables · 6px default radius · border-only cards (reinforced by flattened shadow tokens) · Geist Sans + tabular-nums for table numerics · Pill `shape` prop · admin type cap at 24px · `@trucare/ui` admin-only.

## Ship criteria

1. `vite build` succeeds; single-file preview artifact replaces v2.2.
2. All preview routes render, including the new Brand (v3.0) group.
3. No visual or behavioral regressions on existing component demos (buttons, tables, pills, cards).
4. Brand assets load from `public/brand/` in the built preview.
5. README v3.0 release notes reflect shipped scope.

## Known debt to schedule next

- TruCred / TruRev / TruIntel product marks — wire once vector handoff lands.
- Marketing type scale is reference-only — bind to components when trucarebilling.com moves to React.
- Sweep existing admin surfaces for stray shadow usage and migrate to flattened `--shadow-card` / `--shadow-inset-hairline`.
