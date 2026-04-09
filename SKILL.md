# TruCare Design System — Component Reference

All components are in `src/components/design-system/` with barrel export from `src/components/design-system/index.ts`.

## Stack
React 19 + TypeScript + Tailwind 4 + Radix UI/shadcn + TanStack Table v8 + Lucide React icons

## Design Tokens (src/styles/index.css)

### Typography — Geist Sans (admin scale, max 24px)
| Token | Size | Weight | Use |
|-------|------|--------|-----|
| --text-page-title | 24px | 500 | Page headings |
| --text-section-title | 20px | 500 | Section headings |
| --text-subtitle | 16px | 500 | Card titles, subtitles |
| --text-body | 14px | 400 | Default body text |
| --text-body-small | 13px | 400 | Table cells, descriptions |
| --text-caption | 12px | 400 | Labels, captions |
| --text-micro | 11px | 500 | Uppercase section headers, tracking 0.05em |

### Typography Rules
- **MONO (Geist Mono)**: ONLY for identifiers where O/0 distinction matters — Claim IDs, NPI, TIN, payer IDs, member IDs, MRN, SSN (masked), CPT/ICD codes
- **TABULAR-NUMS (Geist Sans + `tabular-nums`)**: For aligned numbers WITHOUT mono — Currency, percentages, counts, phone numbers. Keeps consistent table look.
- **REGULAR (Geist Sans)**: Everything else — names, dates, labels, descriptions, status text

### Layout Tokens
| Token | Value | Use |
|-------|-------|-----|
| --height-header | 48px | App header |
| --width-sidebar | 200px | Sidebar nav (48px collapsed) |
| --space-page-x | 24px | Page horizontal padding |
| --space-page-y | 20px | Page vertical padding |
| --space-card | 16px | Card internal padding |
| --radius (default) | 6px | All rounded corners |

### Z-Index Layers
| Token | Value | Use |
|-------|-------|-----|
| --z-sticky | 10 | Table headers, sticky elements |
| --z-header | 20 | App header |
| --z-dropdown | 30 | Select, dropdown-menu, popover |
| --z-overlay | 40 | Sheet/dialog backdrop |
| --z-modal | 50 | Sheet/dialog content |
| --z-toast | 60 | Toast notifications |

### Elevation
- **Cards, buttons**: No shadow. Border only.
- **Dropdowns, popovers, tooltips**: `shadow-md`
- **Dialogs, sheets**: `shadow-lg`

### Brand Colors
Violet: #604FF8 | Blue: #095BCE | Teal: #22D3C1 | Ink: #151A20

## Component Reference

### StatusBadge — Claim lifecycle statuses
```tsx
import { StatusBadge } from "@/components/design-system"
<StatusBadge status="submitted" dot />
```
14 statuses: draft, submitted, accepted, rejected, in-review, pending, denied, appealed, corrected, paid, partially-paid, written-off, voided, on-hold

### EligibilityBadge — Patient coverage status
```tsx
import { EligibilityBadge } from "@/components/design-system"
<EligibilityBadge status="eligible" dot />
```
4 statuses: eligible, ineligible, pending, unknown

### Badge — Semantic labels (counts, versions, categories)
```tsx
import { Badge } from "@/components/ui/badge"
<Badge variant="secondary">12 claims</Badge>
```

### Pill — Soft tags (non-status, user-applied)
```tsx
import { Pill } from "@/components/design-system"
<Pill color="violet" removable onRemove={handleRemove}>Cardiology</Pill>
<Pill color="gray" shape="rounded">Department</Pill>
```
Shapes: `"pill"` (rounded-full, default) | `"rounded"` (rounded-md, 6px). Colors: neutral, gray, violet, blue, teal, success, warning, destructive.

### MaskedValue — PHI-safe display with reveal toggle
```tsx
import { MaskedValue, maskSSN } from "@/components/design-system"
<MaskedValue value="123-45-6789" maskedValue={maskSSN("123-45-6789")} sensitive copyable onReveal={auditLog} />
```
Presets: `maskSSN()`, `maskDOB()`, `maskMRN()`. Auto-re-masks after 10s.

### Copyable — One-click copy with PHI protection
```tsx
import { Copyable } from "@/components/design-system"
<Copyable value="CLM-4521"><span className="font-medium tabular-nums">CLM-4521</span></Copyable>
<Copyable value="123-45-6789" sensitive onCopy={auditLog}>***-**-6789</Copyable>
```
`sensitive` auto-clears clipboard (default 15s). `onCopy` callback for audit logging.

### ConfirmDialog — Destructive action confirmation
```tsx
import { ConfirmDialog } from "@/components/design-system"
<ConfirmDialog open={show} onConfirm={handleVoid} onCancel={() => setShow(false)}
  title="Void Claim CLM-4821?" variant="destructive" />
```

### Banner — Persistent page-level notifications
```tsx
import { Banner } from "@/components/design-system"
<Banner variant="warning" title="Maintenance" dismissible onDismiss={dismiss}>
  Scheduled downtime tonight 2-4am EST.
</Banner>
```
Variants: info, warning, destructive, success.

### Breadcrumb — Navigation depth
```tsx
import { Breadcrumb } from "@/components/design-system"
<Breadcrumb items={[{ label: "Claims", onClick: nav }, { label: "CLM-4521" }]} />
```

### Form Components
```tsx
import { FormInput, FormSelect, FormTextarea, FormCheckboxGroup, FormRadioGroup, FormDatePicker, FormCombobox, FormSection } from "@/components/design-system"

<FormSection title="Primary Insurance">
  <FormInput label="NPI" required sensitive error={errors.npi} info="National Provider Identifier" />
  <FormCombobox label="Payer" options={payers} value={payer} onChange={setPayer} />
  <FormDatePicker label="Date of Birth" value={dob} onChange={setDob} sensitive />
  <FormRadioGroup label="Relationship" options={relationships} value={rel} onChange={setRel} />
  <FormCheckboxGroup label="Modifiers" options={modifiers} value={mods} onChange={setMods} />
</FormSection>
```
`sensitive` prop on FormInput sets `autocomplete="off"` + `data-phi` for HIPAA compliance.

### Data Table
```tsx
import { DataTable, IdCell, CurrencyCell, StatusCell, DateCell, DeadlineCell, getSelectionColumn, DataTableColumnVisibility, DataTableBulkActions } from "@/components/design-system"
```
Built on TanStack Table v8. Supports server-side pagination (`pageCount` + `onPaginationChange`), column visibility toggle, row selection with bulk actions.

### ActivityTimeline — Claim lifecycle history
```tsx
import { ActivityTimeline } from "@/components/design-system"
<ActivityTimeline items={[
  { status: "submitted", label: "Claim submitted to Aetna", timestamp: "Mar 28, 2026 9:15 AM", actor: "Jane Smith" },
  { status: "accepted", label: "Accepted by clearinghouse", timestamp: "Mar 28, 9:17 AM", isCurrent: true },
]} />
```

### StepperLayout — Multi-step wizard
```tsx
import { StepperLayout } from "@/components/design-system"
<StepperLayout steps={[{ label: "Demographics" }, { label: "Insurance" }, { label: "Consent" }]}
  currentStep={1} onNext={next} onBack={back}>
  <InsuranceForm />
</StepperLayout>
```

### SplitView — List + detail side-by-side
```tsx
import { SplitView } from "@/components/design-system"
<SplitView list={<ClaimsTable />} detail={<ClaimDetail />} detailOpen={!!selected} onClose={close} ratio="2:1" />
```

### DeadlineIndicator — Urgency-colored dates
```tsx
import { DeadlineIndicator } from "@/components/design-system"
<DeadlineIndicator date="2026-05-15" label="Filing deadline" />
```
Thresholds: >30d neutral, 7-30d warning, <7d destructive, past due expired.

### ReasonCodeDisplay — CARC/RARC codes
```tsx
import { ReasonCodeDisplay } from "@/components/design-system"
<ReasonCodeDisplay code="CO-45" description="Charge exceeds fee schedule" />
```

### FinancialSummary — Ledger display
```tsx
import { FinancialSummary } from "@/components/design-system"
<FinancialSummary items={[
  { label: "Billed", amount: 1250, type: "charge" },
  { label: "Adjustment", amount: -450, type: "adjustment" },
  { label: "Payment", amount: -640, type: "payment" },
]} showTotal totalLabel="Patient Responsibility" />
```
Accounting convention: negatives in parentheses, right-aligned tabular-nums.

### MetricCard — KPI display
```tsx
import { MetricCard } from "@/components/design-system"
<MetricCard title="Denial Rate" value="4.2%" change={{ value: -1.3, label: "vs last month" }} invertTrend />
```
`invertTrend` makes decrease green (for metrics like denial rate, days in AR).

### Empty States
```tsx
import { NoClaims, NoPatients, NoResults, NoDocuments, NoActivity, NoPayments, NoDenials } from "@/components/design-system"
```

### App Shell + Navigation
```tsx
import { AppShell, SidebarNav, AppHeader } from "@/components/design-system"
<AppShell header={<AppHeader ... />} sidebar={<SidebarNav ... />}>
  <MainContent />
</AppShell>
```
Includes skip-navigation link for keyboard accessibility.

## Do / Don't Rules

| Do | Don't |
|----|-------|
| StatusBadge for claim statuses | Badge or Pill for statuses |
| EligibilityBadge for coverage statuses | StatusBadge for eligible/ineligible |
| `font-medium tabular-nums` for IDs in tables | `font-mono` in table columns |
| `tabular-nums` for currency/counts | `font-mono` for dollar amounts |
| MaskedValue for SSN/DOB/MRN display | Show unmasked PHI in list views |
| `sensitive` prop on FormInput for PHI fields | Allow browser autocomplete on PHI |
| ConfirmDialog for destructive actions | Dialog for confirmations |
| Banner for persistent messages | Toast for persistent messages |
| EmptyState presets for zero-data | Blank white space when no data |
