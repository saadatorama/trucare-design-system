# TruCare Design System v3.0 — Delta Spec

**Scope:** Merge Claude Design handoff bundle (`l9c2v3kLvK0uNR2psuNXgw`) into the DS SPA. Tokens + assets + preview cards only. No marketing React components.

## 1. Visual Acceptance — New Brand Sections

### 1.1 Logo Family
- Master mark on light: `--color-tc-blue` on `--color-tc-fog` surface card. 80px mark height, 32px internal padding, border-only card (no shadow).
- Master mark on dark: white mark on `--color-tc-ink` surface card. Same 80px/32px proportions. Paired side-by-side on desktop, stacked under 640px.
- Product marks row: 4 tiles (TruIntake real, TruCred / TruRev / TruIntel placeholders). 48px mark height, label in 14px Geist Sans below mark at 12px vertical gap. Placeholders rendered at 40% opacity with "Coming" pretitle label.
- Clear-space demo band under each master mark: dotted 1px `--color-tc-stone` rule showing 0.5x mark-height buffer on all sides.

### 1.2 Shadows
- 5-card grid (card / card-hover / inset-hairline / md / lg). Each card 200x120px, white surface, 16px padding, 14px label + 12px token name in `--color-tc-fog-dark`.
- `md` and `lg` cards carry a "Overlays only — do not use on cards" caption in `--color-tc-coral-deep` at 12px.

### 1.3 Marketing Type Reference
- Single reference card, full-width of content column, 32px padding, border-only.
- Stack order top to bottom: Pretitle (13px uppercase, 0.12em tracking) → H1 (68px, -0.02em tracking, line-height 1.05) → Subhead (24px) → Body (16px).
- Card header pill: "Reference only — marketing site" in coral-pale bg, coral-deep text, squared pill shape.
- Legibility: all samples rendered on `--color-tc-white` and repeated on `--color-tc-ink` surface below, to prove dark-mode viability.

## 2. Brand Voice / Copy Rules (Marketing Type card)

Sample copy must match bundle README verbatim:
- H1: "Practice Made Perfect."
- Subhead: "Unified intake, eligibility, and revenue visibility"
- Body: one sentence describing the operator value, sentence case.
- Pretitle: "TruCare Platform"

Rules: sentence case everywhere except H1 (which is title case by brand). No emoji. No exclamation marks except the H1's own period-as-statement. No em-dash substitution.

## 3. Guardrails Preserved (admin DS surface is untouched)

- Buttons: 36px default / 28px in tables. No change.
- Radius: 6px. No change. Marketing-scale larger radii live in reference card only.
- Cards: border-only treatment (`--color-tc-chalk` 1px) with `--shadow-card` hairline. No elevated/filled cards.
- Typography: Geist Sans with `font-variant-numeric: tabular-nums` for all numeric columns. No mono in tables — mono reserved for IDs only.
- Pill component: retains `shape` prop (`pill` / `rounded`).
- Admin type cap: 24px. Any usage of `--text-h1 / h2 / h3 / pretitle` outside the marketing reference card is a violation.
- No marketing React components ship in `src/components/`.

## 4. Logo Usage

- Blue mark (`trucare-mark-blue.png`) on light surfaces (fog / white / chalk).
- White mark (`trucare-mark-white.png`) on ink / ink-2 / ink-3 surfaces.
- Never place ink mark on coral, violet-pale, blue-pale, or teal-pale — use white.
- Minimum clear space: 0.5x mark height on all four sides.
- Minimum render size: 16px height (favicon territory). Below 16px, use `favicon.svg`.
- Never stretch, rotate, recolor, or add effects. No drop shadows on marks.

## 5. Shadow Policy

- `--shadow-card` (hairline): default for every card, every table row hover, every popover trigger surface.
- `--shadow-card-hover`: interactive cards only (clickable, draggable, selectable). Static cards do not get hover elevation.
- `--shadow-inset-hairline`: input groups, inset data wells, segmented controls.
- `--shadow-md` / `--shadow-lg`: reserved for Dialog, Sheet, Popover, DropdownMenu overlays. Using these on a card is a review-blocker.

## 6. Flag on Review

- Any component using a flat hex (`#FF5B42`, `#17191E`, etc.) instead of a token — log for cleanup, do not block.
- Any admin surface importing `--text-h1`, `--text-h2`, `--text-h3`, or `--text-pretitle` — block. Must be zero instances outside the Marketing Type reference card.
- Any card using `--shadow-md` or `--shadow-lg` — block.
- Any product mark rendered below 16px without fallback to `favicon.svg` — block.

## Rejected (scope)

- **ClaimDetailDrawer as a new component.** Compose from existing `Sheet` + `DetailSection` primitives. Adding a new component duplicates surface area.
- **MarketingNav React component.** Flat-file demo only.
- **Hero React component.** Flat-file demo only.
- **ProductGrid React component.** Flat-file demo only.
- **StatsBand React component.** Flat-file demo only.
- **MarketingFooter React component.** Flat-file demo only.

Marketing surface lives in `trucare-design-system-v3.0.html`. The admin React DS does not absorb it.
