# @trucare/ui

TruCare Design System — React component library for healthcare and revenue cycle management admin interfaces.

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
