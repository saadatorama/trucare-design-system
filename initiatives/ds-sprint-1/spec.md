# Design Spec: DS Sprint 1 — Token Hardening & Micro-Utilities

**Initiative Slug:** `ds-sprint-1`
**Author:** Design Lead
**Date:** 2026-04-03
**Status:** REVIEW
**Product Brief:** [`product-brief.md`](./product-brief.md)
**Architecture Brief:** Pending (no architectural complexity expected per HoP)
**RCM-Touching:** No
**Domain Logic Source:** N/A (design system infrastructure)

---

## 1. Overview

This spec defines the exact token values, component APIs, interaction behaviors, and visual rules for Sprint 1 of the TruCare Design System. Sprint 1 locks the token layer and ships three micro-utility components (Copyable, Avatar, Pill) that every subsequent sprint depends on.

Every value in this document is final. Engineers should not interpret or improvise. If a value is missing, it is a spec gap — escalate, do not guess.

---

## 2. Token Hardening

### 2.1 Gradient Tokens

Add to `@theme` block in `src/styles/index.css`. Gradients use existing brand hex values because CSS gradients do not interpolate oklch reliably across browsers.

**Token definitions:**

| Token name | Value |
|---|---|
| `--gradient-violet` | `linear-gradient(135deg, #604FF8, #8478FA)` |
| `--gradient-blue` | `linear-gradient(135deg, #095BCE, #05377C)` |
| `--gradient-teal` | `linear-gradient(135deg, #22D3C1, #147F74)` |
| `--gradient-ink` | `linear-gradient(135deg, #151A20, #404D60)` |
| `--gradient-brand` | `linear-gradient(135deg, #604FF8, #095BCE)` |

**Dark mode overrides** (`.dark` block):

| Token name | Value |
|---|---|
| `--gradient-violet` | `linear-gradient(135deg, #8478FA, #604FF8)` |
| `--gradient-blue` | `linear-gradient(135deg, #095BCE, #042452)` |
| `--gradient-teal` | `linear-gradient(135deg, #22D3C1, #072A27)` |
| `--gradient-ink` | `linear-gradient(135deg, #404D60, #151A20)` |
| `--gradient-brand` | `linear-gradient(135deg, #8478FA, #095BCE)` |

**Dark mode rationale:** In dark mode, gradients flip to start from the lighter brand value and end at the deeper value. This prevents gradients from disappearing against dark backgrounds. `gradient-ink` reverses direction (lighter to darker) so the slate end remains visible against `--background: oklch(0.16 ...)`.

**Usage:** Apply via `style={{ background: 'var(--gradient-violet)' }}` or define Tailwind utilities if the team prefers. Gradients are for decorative surfaces only (card headers, dashboard hero sections, showcase backgrounds). Never use gradients on interactive elements (buttons, badges, form controls).

---

### 2.2 Pill Color Tokens

Soft tint tokens for the Pill component. These are intentionally distinct from the status tokens used by StatusBadge: lower chroma, no border token, higher lightness in the background. The visual distinction is: status tokens are for workflow state (claims, eligibility), pill tokens are for categorical labels (department, tag, filter chip).

**Light mode** (`:root` block):

| Token | Value | Notes |
|---|---|---|
| `--pill-neutral-bg` | `oklch(0.95 0.005 250)` | Near-gray, hue-matched to muted |
| `--pill-neutral-text` | `oklch(0.40 0.02 250)` | |
| `--pill-violet-bg` | `oklch(0.95 0.04 280)` | |
| `--pill-violet-text` | `oklch(0.40 0.18 280)` | |
| `--pill-blue-bg` | `oklch(0.95 0.03 255)` | |
| `--pill-blue-text` | `oklch(0.38 0.14 255)` | |
| `--pill-teal-bg` | `oklch(0.95 0.04 180)` | |
| `--pill-teal-text` | `oklch(0.35 0.10 180)` | |

**Dark mode** (`.dark` block):

| Token | Value | Notes |
|---|---|---|
| `--pill-neutral-bg` | `oklch(0.22 0.005 250)` | |
| `--pill-neutral-text` | `oklch(0.72 0.02 250)` | |
| `--pill-violet-bg` | `oklch(0.22 0.04 280)` | |
| `--pill-violet-text` | `oklch(0.72 0.16 280)` | |
| `--pill-blue-bg` | `oklch(0.22 0.03 255)` | |
| `--pill-blue-text` | `oklch(0.72 0.12 255)` | |
| `--pill-teal-bg` | `oklch(0.22 0.04 180)` | |
| `--pill-teal-text` | `oklch(0.72 0.10 180)` | |

**Contrast requirement:** Every bg/text pair must achieve >= 4.5:1 contrast ratio (WCAG AA). QA validates with automated tooling in both modes.

**Why no pill tokens for success, warning, destructive?** The Pill component reuses the existing semantic tokens (`--success`, `--warning`, `--destructive`) for those three color variants. Only the four non-semantic colors (neutral, violet, blue, teal) need new tokens. See Section 5.3 for the full color mapping.

---

### 2.3 Typography Scale Tokens

Add as CSS custom properties in `:root`. These tokens codify the admin scale that is already in use across TruIntake2. They do not replace Tailwind's `text-*` utilities; they provide a canonical reference and enable consistent usage in inline styles and non-Tailwind contexts.

**Token definitions:**

| Token | Size | Weight | Line-height | Tailwind equivalent | Usage |
|---|---|---|---|---|---|
| `--text-page-title` | `24px` | `500` | `1.33` (32px) | `text-2xl` | Page titles. One per page. |
| `--text-section-title` | `20px` | `500` | `1.4` (28px) | `text-xl` | Section headings within a page. |
| `--text-subtitle` | `16px` | `500` | `1.5` (24px) | `text-base` | Card titles, dialog titles, subsection labels. |
| `--text-body` | `14px` | `400` | `1.57` (22px) | `text-sm` | Default body text. Most UI text. |
| `--text-body-small` | `13px` | `400` | `1.54` (20px) | `text-[13px]` | Secondary body text. Table cells, metadata. |
| `--text-caption` | `12px` | `400` | `1.5` (18px) | `text-xs` | Captions, help text, timestamps. |
| `--text-micro` | `11px` | `500` | `1.45` (16px) | `text-[11px]` | Overline labels. Always `uppercase`, `letter-spacing: 0.05em`. |

**Implementation in CSS:**

```css
:root {
  /* Typography Scale — Admin */
  --text-page-title: 500 24px/1.33 'Geist', system-ui, sans-serif;
  --text-section-title: 500 20px/1.4 'Geist', system-ui, sans-serif;
  --text-subtitle: 500 16px/1.5 'Geist', system-ui, sans-serif;
  --text-body: 400 14px/1.57 'Geist', system-ui, sans-serif;
  --text-body-small: 400 13px/1.54 'Geist', system-ui, sans-serif;
  --text-caption: 400 12px/1.5 'Geist', system-ui, sans-serif;
  --text-micro: 500 11px/1.45 'Geist', system-ui, sans-serif;
}
```

Usage: `font: var(--text-body);` — the shorthand sets size, weight, line-height, and family in one declaration. For `--text-micro`, the consumer must also add `text-transform: uppercase; letter-spacing: 0.05em;` — these cannot be encoded in the `font` shorthand.

**Max font size rule:** Nothing in TruCare's admin UI exceeds 24px. If a future component needs larger text, it requires Design Lead approval and a product-brief amendment. This constraint is intentional: admin tools are not marketing pages.

---

### 2.4 Monospace Rules

Add the following as a CSS comment block at the top of `index.css`, directly below the font-face declarations. This is the canonical reference for monospace usage.

```css
/* ============================================
   Monospace Usage Rules — Geist Mono
   ============================================
   USE Geist Mono (font-mono) for:
   - Patient IDs, claim IDs, encounter IDs (any system-generated identifier)
   - NPI numbers
   - Tax IDs / EIN
   - Currency amounts ($1,234.56)
   - Payer IDs
   - Code values (CPT, ICD-10, HCPCS, revenue codes)
   - Timestamps in logs and audit trails
   - Any value a user is likely to copy-paste into another system

   DO NOT use Geist Mono for:
   - Patient names, provider names, or any human-readable name
   - Dates displayed in UI (use Geist Sans; "Mar 15, 2026" is not a code)
   - Status labels, navigation items, headings, body text
   - Phone numbers, email addresses (these are human-readable)
   - Button labels, form labels, descriptions

   RATIONALE: Monospace signals "this is a machine value." It creates a
   visual rhythm that helps billers scan columns of IDs and codes.
   Overusing it dilutes the signal.
   ============================================ */
```

Additionally, create a documentation page at `src/pages/showcase/typography.tsx` (or equivalent Storybook story) that renders examples of each typography token and monospace vs. sans-serif side by side. This satisfies SC-10.

---

### 2.5 Shadow-to-Border Migration

**Principle:** TruCare uses a flat, border-driven visual language. Shadows are reserved for elements that float above the page (overlays, dropdowns, dialogs). Inline elements (buttons, badges) do not cast shadows.

**Changes to `button.tsx`:**

Remove `shadow-sm` from the following variants: `default`, `destructive`, `outline`, `secondary`.

Replace with: nothing. The `outline` variant already has `border border-input`. The `default`, `destructive`, and `secondary` variants gain `border border-transparent` to maintain consistent box sizing. This ensures hover states and focus rings align correctly.

| Variant | Before | After |
|---|---|---|
| `default` | `bg-primary text-primary-foreground shadow-sm hover:bg-primary/90` | `bg-primary text-primary-foreground border border-transparent hover:bg-primary/90` |
| `destructive` | `bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90` | `bg-destructive text-destructive-foreground border border-transparent hover:bg-destructive/90` |
| `outline` | `border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground` | `border border-input bg-background hover:bg-accent hover:text-accent-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80` | `bg-secondary text-secondary-foreground border border-transparent hover:bg-secondary/80` |
| `ghost` | No change | No change |
| `link` | No change | No change |

**Changes to `badge.tsx`:**

Remove `shadow` from the following variants: `default`, `destructive`.

| Variant | Before | After |
|---|---|---|
| `default` | `border-transparent bg-primary text-primary-foreground shadow` | `border-transparent bg-primary text-primary-foreground` |
| `destructive` | `border-transparent bg-destructive text-destructive-foreground shadow` | `border-transparent bg-destructive text-destructive-foreground` |
| `secondary` | No change | No change |
| `outline` | No change | No change |

**What is NOT touched:**

- `shadow-md` on `dropdown-menu.tsx` and `popover.tsx` — retained (floating elements)
- `shadow-lg` on `dialog.tsx` and `sheet.tsx` — retained (modal overlays)
- `shadow-xs` and `shadow-sm` token definitions — retained in `@theme` (other consumers may use them)
- `StatusBadge`, `MetricCard`, `FilterBar`, `DataTable` — no shadow changes

---

## 3. Copyable Component

### 3.1 Purpose

Front desk staff and billers copy patient IDs, NPI numbers, claim numbers, and payer IDs dozens of times per shift. Copyable provides a single, consistent interaction: click any value, it copies to clipboard, visual feedback confirms.

### 3.2 File Location

- Utility: `src/lib/copy-to-clipboard.ts`
- Component: `src/components/design-system/copyable.tsx`

### 3.3 `copy-to-clipboard.ts` API

```typescript
/**
 * Copies text to clipboard. Uses navigator.clipboard.writeText when available,
 * falls back to document.execCommand('copy') for older browsers and iframe
 * contexts (common in practice management systems).
 *
 * @returns true if copy succeeded, false otherwise. Never throws.
 */
export async function copyToClipboard(text: string): Promise<boolean>
```

Implementation notes:
- Try `navigator.clipboard.writeText(text)` first. Wrap in try/catch.
- Fallback: create a temporary `<textarea>`, set value, select, `document.execCommand('copy')`, remove element.
- Return `true` on success, `false` on failure. Never throw.
- Do not log errors to console in production; swallow silently. The component handles failure UX.

### 3.4 `Copyable` Component API

```typescript
export interface CopyableProps {
  /** The text value to copy to clipboard. May differ from displayed children
   *  (e.g., children show "***-**-1234" but value is the full SSN). */
  value: string

  /** Content to display. Usually a string, but can be any inline element. */
  children: React.ReactNode

  /** Optional className applied to the wrapper span. */
  className?: string

  /** Callback fired after successful copy. Optional. */
  onCopy?: () => void
}
```

### 3.5 Interaction Behavior

**Idle state:**
- Renders children inside a `<span>` with `cursor-pointer` and `inline-flex items-center gap-1`.
- On hover: wrap in existing Tooltip component. Tooltip text: "Click to copy".
- No visual icon in idle state. The cursor change and tooltip are the affordances. Adding an icon to every copyable value in a dense table would be visual noise.

**Click:**
1. Call `copyToClipboard(value)`.
2. If success:
   - Append a `<Check />` icon (Lucide, `h-3 w-3`, `text-success`) inline after the children. Use `animate-in fade-in-0` from existing animation utilities.
   - Change tooltip text to "Copied!".
   - Fire `onCopy()` callback if provided.
   - After 1500ms, revert: remove check icon, restore "Click to copy" tooltip.
3. If failure:
   - Append an `<X />` icon (Lucide, `h-3 w-3`, `text-destructive`) inline after the children.
   - Change tooltip text to "Failed to copy".
   - After 1500ms, revert to idle state.
   - Do NOT throw or display an error dialog. Clipboard failure is not a blocking error.

**Keyboard:**
- The wrapper `<span>` receives `role="button"` and `tabIndex={0}`.
- `Enter` and `Space` trigger the same copy behavior as click.
- `aria-label` defaults to `Copy ${value}` but is overridden if the value contains sensitive data (the consumer should pass a sanitized label).

**Rapid clicks:**
- If the user clicks again while the checkmark is showing, restart the 1500ms timer. Do not queue multiple timeouts. Use a ref to track the current timeout and clear it before setting a new one.

### 3.6 Visual Rendering

```
Idle:       [children]                     cursor: pointer
Hover:      [children]  <-- tooltip: "Click to copy"
Copied:     [children] [check-icon]        <-- tooltip: "Copied!"
Failed:     [children] [x-icon]            <-- tooltip: "Failed to copy"
```

No background change, no border, no underline. Copyable is as minimal as possible because it wraps values inside data tables where every pixel matters.

### 3.7 Edge Cases

| Scenario | Behavior |
|---|---|
| Empty `value` prop | Do not attempt copy. Show "Nothing to copy" tooltip on click. |
| Very long value (1000+ chars) | Copy normally. No truncation of the copied value. |
| Component unmounts during 1500ms feedback | Clear timeout in `useEffect` cleanup. No state update on unmounted component. |
| `value` differs from `children` | Intentional. Example: children render a masked SSN, value contains the full SSN. The tooltip always says "Click to copy", not "Click to copy ***-**-1234". |
| Clipboard blocked by browser permissions | Fallback fires. If fallback also fails, show failure state. |
| Used inside a clickable parent (table row) | Consumer must call `e.stopPropagation()` via the onClick handler or wrap in a stopping container. Copyable itself calls `e.stopPropagation()` on its click handler to prevent row-click conflicts. |

---

## 4. Avatar Component

### 4.1 Purpose

Renders a colored circle with a single letter, deterministically derived from a name string. Used in patient lists, audit logs, user mentions, and anywhere a person is referenced without a photo.

### 4.2 File Location

`src/components/design-system/avatar.tsx`

### 4.3 Component API

```typescript
export interface AvatarProps {
  /** Full name or email. Used for initial extraction and color hashing. */
  name: string

  /** Explicit override of the displayed initial. Optional. */
  initial?: string

  /** Size preset. Default: "md". */
  size?: "xs" | "sm" | "md" | "lg"

  /** Optional className applied to the outer element. */
  className?: string
}
```

### 4.4 Size Scale

| Size | Container | Font size | Font weight |
|---|---|---|---|
| `xs` | `h-5 w-5` (20px) | `text-[10px]` | `600` |
| `sm` | `h-6 w-6` (24px) | `text-[11px]` | `600` |
| `md` | `h-8 w-8` (32px) | `text-[13px]` | `600` |
| `lg` | `h-10 w-10` (40px) | `text-[16px]` | `600` |

All sizes use: `rounded-full`, `inline-flex items-center justify-center`, `text-white`, `select-none`, `shrink-0`.

### 4.5 Initial Extraction

1. If `initial` prop is provided, use it (single character, uppercased).
2. Otherwise, extract from `name`:
   - Trim whitespace.
   - If the string contains `@`, use the first character before `@` (email mode).
   - Otherwise, use the first character of the string.
   - Uppercase the result.
3. If `name` is empty string, render `?`.

### 4.6 Color Palette

8 background colors derived from brand tokens. These are hardcoded hex values (not CSS variables) because they need to be deterministic and are not theme-dependent — white text on all 8 colors meets 4.5:1 contrast in both light and dark mode.

| Index | Color name | Hex | Source |
|---|---|---|---|
| 0 | Violet | `#604FF8` | tc-violet |
| 1 | Blue | `#095BCE` | tc-blue |
| 2 | Teal dark | `#147F74` | tc-teal-mid |
| 3 | Ink | `#404D60` | tc-slate |
| 4 | Violet dark | `#3B30A1` | tc-violet-dark |
| 5 | Blue deep | `#042452` | tc-blue-deep |
| 6 | Teal deep | `#072A27` | tc-teal-deep |
| 7 | Rose | `#9F1239` | Accent (not in current token set; hardcoded) |

**Why 8 colors?** 8 gives reasonable visual distribution across a list of 10-50 names (common patient list length). Fewer than 8 creates noticeable repetition. More than 8 adds colors that are difficult to distinguish at 20-24px sizes.

**Why hardcoded hex?** Avatar colors must be identical in light and dark mode (white text on colored bg works in both). Using CSS variables would allow them to shift, breaking the deterministic guarantee.

### 4.7 Deterministic Hash

```typescript
function hashName(name: string): number {
  let hash = 0
  const normalized = name.trim().toLowerCase()
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % 8
}
```

**Properties:**
- Same name always produces the same color index, across renders, sessions, and environments.
- `"Jane Doe"` and `"jane doe"` produce the same index (case-insensitive normalization).
- `"Jane Doe"` and `" Jane Doe "` produce the same index (trim normalization).
- The hash is a simple djb2 variant. It is not cryptographically secure (irrelevant for color selection).

### 4.8 Rendering

```tsx
<span
  className={cn(
    "inline-flex items-center justify-center rounded-full text-white font-semibold select-none shrink-0",
    sizeClasses[size],
    className
  )}
  style={{ backgroundColor: palette[hashName(name)] }}
  aria-label={name}
  role="img"
>
  {extractedInitial}
</span>
```

### 4.9 Edge Cases

| Scenario | Behavior |
|---|---|
| `name=""` | Render `?` with index-0 color (Violet). |
| `name="  "` (whitespace only) | Same as empty: `?`, Violet. |
| `name` is an email (`jane@clinic.com`) | Extract `J`. Hash the full email for color. |
| `name` has Unicode (`"Elena"`) | Extract first character. Hash works on character codes. |
| `name` with emoji prefix | Extract the emoji as the initial. May render oversized in xs/sm. Acceptable edge case. |
| Two people with same first initial but different names | Different colors via hash. Same initial letter displayed. This is intentional. |

---

## 5. Pill Component

### 5.1 Purpose

A soft categorical tag. Used for department labels, filter chips, user-applied tags, and any non-status categorization. Visually distinct from Badge (semantic labels with borders and rounded-md) and StatusBadge (workflow statuses with borders, dots, and rounded-full).

### 5.2 File Location

`src/components/design-system/pill.tsx`

### 5.3 Component API

```typescript
export type PillColor =
  | "neutral"
  | "violet"
  | "blue"
  | "teal"
  | "success"
  | "warning"
  | "destructive"

export interface PillProps {
  /** The label text. */
  children: React.ReactNode

  /** Color variant. Default: "neutral". */
  color?: PillColor

  /** Size. Default: "md". */
  size?: "sm" | "md"

  /** If provided, renders a dismiss (X) button and fires this callback on click. */
  onRemove?: () => void

  /** Optional className. */
  className?: string
}
```

### 5.4 Size Scale

| Size | Height | Padding | Font size | Line-height |
|---|---|---|---|---|
| `sm` | `h-5` (20px) | `px-1.5` | `text-[11px]` | default |
| `md` | `h-6` (24px) | `px-2` | `text-xs` (12px) | default |

Both sizes: `rounded-full`, `inline-flex items-center gap-1`, `font-medium`.

### 5.5 Color Mapping

Each color maps to a background and text color. The four custom pill colors use the new pill tokens from Section 2.2. The three semantic colors reuse existing semantic tokens with reduced opacity for the background.

| Color | Light bg | Light text | Dark bg | Dark text |
|---|---|---|---|---|
| `neutral` | `var(--pill-neutral-bg)` | `var(--pill-neutral-text)` | `var(--pill-neutral-bg)` | `var(--pill-neutral-text)` |
| `violet` | `var(--pill-violet-bg)` | `var(--pill-violet-text)` | `var(--pill-violet-bg)` | `var(--pill-violet-text)` |
| `blue` | `var(--pill-blue-bg)` | `var(--pill-blue-text)` | `var(--pill-blue-bg)` | `var(--pill-blue-text)` |
| `teal` | `var(--pill-teal-bg)` | `var(--pill-teal-text)` | `var(--pill-teal-bg)` | `var(--pill-teal-text)` |
| `success` | `oklch(0.95 0.04 160)` | `var(--success)` | `oklch(0.22 0.04 160)` | `var(--success)` |
| `warning` | `oklch(0.95 0.04 80)` | `var(--warning-foreground)` | `oklch(0.22 0.04 80)` | `var(--warning)` |
| `destructive` | `oklch(0.95 0.03 25)` | `var(--destructive)` | `oklch(0.22 0.03 25)` | `var(--destructive)` |

**Implementation note for semantic colors:** The bg values for success/warning/destructive are the same lightness and chroma as the pill tokens. They should be applied via inline `style` to avoid creating additional CSS variables for what are effectively derived values. If this becomes unwieldy, extract them into pill-specific tokens in a follow-up.

**No border.** This is the key visual differentiator from StatusBadge. Pills are background-only. No `border`, no `border-color` token.

### 5.6 Removable Behavior

When `onRemove` is provided:

- Render a dismiss button after the label text.
- Icon: Lucide `<X />`, sized `h-3 w-3` for both pill sizes.
- Button wrapper: `inline-flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10`, sized `h-3.5 w-3.5` (sm) or `h-4 w-4` (md).
- `aria-label="Remove {children}"` on the button.
- Click fires `onRemove()` and calls `e.stopPropagation()`.
- Keyboard: button is focusable, `Enter`/`Space` fires onRemove.
- The dismiss button does not add extra height to the pill. It fits within the pill's existing height.

### 5.7 Rendering Structure

```tsx
<span
  className={cn(
    "inline-flex items-center gap-1 rounded-full font-medium",
    sizeClasses[size],
    className
  )}
  style={{
    backgroundColor: colorMap[color].bg,
    color: colorMap[color].text,
  }}
>
  {children}
  {onRemove && (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onRemove() }}
      className="..."
      aria-label={`Remove ${typeof children === 'string' ? children : ''}`}
    >
      <X className="h-3 w-3" />
    </button>
  )}
</span>
```

### 5.8 Edge Cases

| Scenario | Behavior |
|---|---|
| Very long label text | No truncation by default. Consumer is responsible for truncation. Pill grows horizontally. |
| `onRemove` on a pill inside a clickable row | `e.stopPropagation()` on the dismiss button prevents row click. The pill itself does not stop propagation. |
| Empty children | Renders an empty pill. Not useful but not an error. |
| Used in a flex-wrap container (filter bar) | Works correctly. Pills are `inline-flex` and wrap naturally. |

---

## 6. Badge Shape Comparison — Prototype Spec

### 6.1 Purpose

A side-by-side reference that resolves the design debt: what is a Badge vs. a StatusBadge vs. a Pill? This is a decision artifact for stakeholder review, not a shipped UI.

### 6.2 File Location

`src/pages/showcase/badge-shapes.tsx` (or Storybook story at `src/stories/badge-shapes.stories.tsx`)

### 6.3 Layout

Three columns, equal width, with a header row and multiple example rows.

**Header row:**

| Badge | StatusBadge | Pill |
|---|---|---|

**Annotation row** (rendered as `text-caption text-muted-foreground` below each header):

| `rounded-md (6px)` | `rounded-full + border + dot` | `rounded-full + bg only` |
| Semantic labels, counts, version numbers | Claim/workflow statuses only | Soft tags, user labels, filters |

**Example rows:**

Row 1 — Default/Primary:
- Badge: `variant="default"` (violet bg)
- StatusBadge: `status="eligible"` `dot`
- Pill: `color="violet"`

Row 2 — Destructive/Denied:
- Badge: `variant="destructive"` (red bg)
- StatusBadge: `status="denied"` `dot`
- Pill: `color="destructive"`

Row 3 — Secondary/Neutral:
- Badge: `variant="secondary"` (gray bg)
- StatusBadge: `status="pending"` `dot`
- Pill: `color="neutral"`

Row 4 — Outline/Submitted:
- Badge: `variant="outline"` (border only)
- StatusBadge: `status="submitted"` `dot`
- Pill: `color="blue"`

Row 5 — Success context:
- Badge: (no success variant, skip or show secondary)
- StatusBadge: `status="paid"` `dot`
- Pill: `color="success"`

Row 6 — Multiple on one line (density test):
- 3 Badges inline
- 3 StatusBadges inline
- 3 Pills inline

**Each component instance** should render with representative label text:
- Badges: "v2.1", "3 items", "New"
- StatusBadges: "Eligible", "Denied", "Pending", "Submitted", "Paid"
- Pills: "Cardiology", "Dr. Smith", "Priority"

### 6.4 Shape Rules Summary

Render this as a table or card at the top of the prototype page.

| Property | Badge | StatusBadge | Pill |
|---|---|---|---|
| Border radius | `rounded-md` (6px) | `rounded-full` (9999px) | `rounded-full` (9999px) |
| Border | Yes (per variant) | Yes (status-colored) | No |
| Dot indicator | No | Optional (`dot` prop) | No |
| Background | Solid (semantic) | Tinted (status tokens) | Tinted (pill tokens) |
| Use case | Counts, versions, semantic labels | Workflow/claim status ONLY | Tags, categories, filters |
| Shadow | None (after Sprint 1 migration) | None | None |
| Font weight | `font-semibold` | `font-medium` | `font-medium` |
| Removable | No | No | Optional (X button) |

---

## 7. Accessibility Requirements

| Requirement | Component | Implementation |
|---|---|---|
| WCAG AA contrast (4.5:1) on all pill bg/text pairs | Pill | QA validates with automated tooling in both light and dark mode |
| WCAG AA contrast on all avatar bg/white text pairs | Avatar | All 8 palette colors have been selected to meet 4.5:1 with white |
| Keyboard operable copy | Copyable | `role="button"`, `tabIndex={0}`, `Enter`/`Space` handlers |
| Keyboard operable dismiss | Pill (removable) | Dismiss button is a real `<button>`, focusable, `Enter`/`Space` fires onRemove |
| Screen reader label on Avatar | Avatar | `aria-label={name}`, `role="img"` |
| Screen reader feedback on copy | Copyable | Tooltip change to "Copied!" is announced via Radix tooltip's built-in live region behavior |
| No motion preference | Copyable | Check icon appearance uses `animate-in` which respects `prefers-reduced-motion`. If reduced motion, icon appears instantly without fade. |

---

## 8. File Inventory

All new and modified files in this sprint:

| File | Action | Description |
|---|---|---|
| `src/styles/index.css` | Modified | Add gradient tokens, pill tokens, typography tokens, monospace comment block |
| `src/lib/copy-to-clipboard.ts` | New | Clipboard utility function |
| `src/components/design-system/copyable.tsx` | New | Copyable wrapper component |
| `src/components/design-system/avatar.tsx` | New | Avatar component |
| `src/components/design-system/pill.tsx` | New | Pill component |
| `src/components/ui/button.tsx` | Modified | Remove `shadow-sm`, add `border border-transparent` |
| `src/components/ui/badge.tsx` | Modified | Remove `shadow` from default and destructive variants |
| `src/pages/showcase/badge-shapes.tsx` | New | Badge shape comparison prototype |
| `src/pages/showcase/typography.tsx` | New | Typography scale and monospace reference page |

---

## 9. What This Spec Does NOT Cover

- Toast/notification system (Sprint 2).
- Navigation/header (Sprint 4).
- Icon library curation (Sprint 5).
- Changes to the 23 existing shadcn primitives beyond shadow removal on Button and Badge.
- Semantic oklch color changes (the palette is stable).
- Changes to StatusBadge, MetricCard, FilterBar, or DataTable component internals.
- New variants of existing components.
- Gradient usage guidelines beyond the "decorative surfaces only" note. A more detailed usage guide is deferred until gradients are used in real product UI.

---

## 10. Success Criteria Traceability

| SC | How This Spec Addresses It |
|---|---|
| SC-1 (Gradients render in light + dark) | Section 2.1 defines exact values for both modes, including dark-mode flip rationale |
| SC-2 (Pill tokens, 4.5:1 contrast) | Section 2.2 defines oklch values; Section 7 mandates automated contrast validation |
| SC-3 (Typography tokens match admin scale) | Section 2.3 defines all 7 tokens with exact sizes, weights, and line-heights |
| SC-4 (Zero shadow-sm on buttons, zero shadow on badges) | Section 2.5 lists every variant change with before/after |
| SC-5 (shadow-md, shadow-lg retained) | Section 2.5 explicitly lists what is NOT touched |
| SC-6 (Copyable copies + checkmark feedback) | Section 3 defines full interaction flow including failure states |
| SC-7 (Avatar deterministic colors) | Section 4.7 provides hash algorithm; Section 4.5 provides normalization rules |
| SC-8 (Pill visually distinct from Badge and StatusBadge) | Section 6 defines the prototype with shape rules comparison table |
| SC-9 (Build passes) | Section 8 inventories all files; no architectural changes that could break the build |
| SC-10 (Monospace rules documented) | Section 2.4 provides the comment block and references the showcase page |

---

## 11. Open Questions

None. This spec is self-contained. All token values, component APIs, and interaction behaviors are fully defined.

If the architecture brief (when authored) introduces constraints on file naming, export patterns, or build pipeline changes, this spec may require minor amendments to Section 8 (file paths). The token values and component behaviors will not change.

---

## 12. Gate Reviews Required

Before HoP approval:

1. **Security/Compliance gate** — Review the Copyable component's clipboard access pattern. Confirm that `navigator.clipboard.writeText` and `execCommand('copy')` fallback do not introduce security concerns in the practice management system iframe context. Review whether the `value` prop (which may contain sensitive data like full SSNs) is stored in any intermediate state beyond the clipboard write.

2. **Healthcare Domain gate** — Not required. This initiative does not touch RCM logic, payer rules, billing workflows, or clinical data.

---

**Next step:** Submit to HoP for APPROVED / REJECTED / DESCOPED annotation.
