# @trucare/ui

TruCare Design System — React component library for healthcare and revenue cycle management admin interfaces.

## v3.0 — Claude Design handoff normalization

Merges the [Claude Design handoff bundle](./brand-bundle/bundle-README.md) (id `l9c2v3kLvK0uNR2psuNXgw`) into the design system as a token-and-assets pass. All v2.2 decisions preserved (36px buttons, 6px radius, border-only cards, Geist Sans + tabular-nums for table numerics, pill `shape` prop, 24px admin type cap). Net-new in v3.0:

- **Tokens** — violet/blue/teal **pales**, full **coral** family (`coral`, `coral-pale`, `coral-deep`), extended neutrals (`ink-2`, `ink-3`, `stone`, `fog`, `chalk`, `white`, `black`), marketing type scale (reference-only: `--text-h1..--text-pretitle`), `--space-0..--space-40` aliases, `--width-sidebar-collapsed`.
- **Gradients** — `--gradient-hero-violet`, `--gradient-hero-blue`, `--gradient-card`, `--gradient-teal-chip`.
- **Flattened shadow tokens** — `--shadow-card` (hairline), `--shadow-card-hover` (hairline + 1px drop), `--shadow-inset-hairline`. Existing `--shadow-md` / `--shadow-lg` unchanged (overlays/dialogs).
- **Brand assets** — TruCare master mark (blue / ink / white) and TruIntake bloom mark pulled from the Figma branding doc; live at `/public/brand/*`. Also a frozen reference snapshot of the bundle at `/brand-bundle/` for future diffs.
- **Demo (v3.0 flat file)** — new "Brand (v3.0)" nav group: Logo family, Shadows, Marketing type (reference). Colors + Gradients sections extended with pales, coral, and marketing (180°) hero gradients.
- **No marketing React components.** Hero / Nav / ProductGrid / StatsBand / Footer stay out of the admin library — `@trucare/ui` remains admin-pure. Marketing patterns live only as reference tokens + preview cards in the flat file.
- **MetricCard** — already exceeds the bundle's `KpiCard` spec (delta prop, trend arrows, tabular-nums, `invertTrend` for Denial Rate / Days-in-AR). No code changes.
- **ClaimDetailDrawer** — not added as a new component; compose from existing `Sheet` + `DetailSection` + `DetailRow`.

Ship: `trucare-design-system-v3.0.html` (replaces v2.2).

## Quick Start

```bash
# Install
npm install @trucare/ui

# Import styles in your app's root CSS
@import "@trucare/ui/styles.css";
@import "tailwindcss";
```

```tsx
import { StatusBadge, DataTable, AppShell } from "@trucare/ui"
```

## Stack

- React 18/19 + TypeScript
- Tailwind CSS 4 (oklch color tokens)
- Radix UI primitives
- TanStack Table v8
- Lucide React icons
- Geist font family (self-hosted)

## Components (60+)

### Core Display
Avatar, Copyable, Pill, StatusBadge (14 claim statuses), EligibilityBadge (4 statuses), MetricCard, MaskedValue (PHI-safe with reveal toggle)

### Forms
FormInput, FormSelect, FormTextarea, FormCheckboxGroup, FormRadioGroup, FormDatePicker, FormCombobox, FormSection, FormField

### Feedback
Toast, Banner, ConfirmDialog, InfoTooltip, Skeleton (+ presets), FieldError, ErrorBoundary, ErrorState

### Data
DataTable (TanStack v8), column visibility, row selection, bulk actions, server-side pagination, 8 cell types (Id, Currency, Status, Eligibility, Date, Deadline, Email, AvatarName, Actions)

### Layout
AppShell, SidebarNav, AppHeader, Breadcrumb, SplitView, DetailPanel, DetailSection, DetailRow

### Workflow
ActivityTimeline, StepperLayout, DeadlineIndicator

### Healthcare
ReasonCodeDisplay (CARC/RARC), FinancialSummary (accounting ledger), 7 empty state presets

### Utilities
cn() (clsx + tailwind-merge), copyToClipboard, toast, formatDate, maskSSN/maskDOB/maskMRN

## Design Tokens

All tokens in `src/styles/index.css`:
- Oklch color space for perceptual accuracy
- Admin typography scale (24px max)
- 6px default radius
- Light + dark mode
- 14 claim lifecycle statuses + 4 eligibility statuses
- Z-index layering system
- Print styles with PHI redaction
- prefers-reduced-motion support

## HIPAA Compliance Features

- `sensitive` prop on form inputs suppresses browser autocomplete
- MaskedValue component with auto-re-mask and reveal audit callbacks
- Copyable auto-clears clipboard for PHI (configurable duration)
- `data-phi` attribute for print-time redaction
- ErrorBoundary never exposes stack traces in UI
- Self-hosted fonts (no third-party CDN requests)

## Development

```bash
nvm use           # Node 24 (see .nvmrc)
npm install
npm run dev       # Vite dev server
npm run build:lib # Library build (tsup + CSS extraction)
npm run test      # Vitest
npm run typecheck # TypeScript
npm run lint      # ESLint
```

## Library Build Output

```
dist/
  index.js        # ESM bundle (136KB)
  index.d.ts      # TypeScript declarations
  lib/index.js    # Utility functions
  lib/index.d.ts  # Utility type declarations
  styles.css      # Design tokens + base styles (15KB)
```

## License

Private — TruCare Inc.
