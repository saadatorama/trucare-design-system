# Architecture Brief: DS Sprint 1 -- Tokens, Avatar, Pill, Copyable, Shadow Cleanup

**Initiative:** `ds-sprint-1`
**Author:** Chief Architect
**Date:** 2026-04-03
**Status:** Awaiting Security/Compliance Gate

---

## 1. Scope

Sprint 1 extends the TruCare Design System with three new components (Avatar, Pill, Copyable), new token groups (gradient, pill-color, avatar-color), a clipboard utility, and a shadow migration across two existing shadcn components (button, badge). All work is frontend-only. No backend services, no external integrations, no data persistence changes.

**Fast-track assessment:** This is a pure design-system sprint. No RCM logic, no EHR/PM integrations, no new data handling. Complexity is moderate due to token architecture decisions and the Copyable component's async clipboard API. The brief is proportional.

---

## 2. System Shape

All changes live within the existing monorepo at `src/`. No new services, no new build targets.

```
src/
  styles/
    index.css                  # Token additions (gradient, pill, avatar palettes)
  lib/
    utils.ts                   # Existing cn() -- no changes
    copy-to-clipboard.ts       # NEW: clipboard utility
  components/
    ui/
      button.tsx               # MODIFY: shadow removal
      badge.tsx                # MODIFY: shadow removal
      tooltip.tsx              # Existing -- consumed by Copyable
    design-system/
      avatar.tsx               # NEW
      pill.tsx                  # NEW
      copyable.tsx             # NEW
  App.tsx                       # MODIFY: showcase additions
```

**Boundaries:**
- `src/styles/index.css` is the single source of truth for all design tokens. No component may define its own color palette inline. All colors reference CSS custom properties.
- `src/lib/` holds pure utilities with zero React imports. `copy-to-clipboard.ts` lives here, not in a component directory.
- `src/components/ui/` holds shadcn-origin components. Modifications to these files must remain backward-compatible (no prop removals, no variant renames).
- `src/components/design-system/` holds TruCare-authored components. These follow the CVA contract defined below.

---

## 3. Token Architecture

### 3.1 Where Tokens Go

| Token Group | Location | Rationale |
|---|---|---|
| Avatar color palette (8 colors) | `:root` block as `--avatar-{n}-bg` / `--avatar-{n}-text` | Must participate in dark mode via `.dark` override. Same pattern as status tokens. |
| Pill color tokens | `:root` block as `--pill-{color}-bg` / `--pill-{color}-text` / `--pill-{color}-border` | Same 3-property pattern as status tokens. Ensures dark mode parity. |
| Gradient tokens | NOT tokenized. Inline Tailwind gradient classes in components. | Gradients are component-specific visual treatments, not semantic tokens. Tokenizing them couples the system to specific visual effects that will change frequently. |

### 3.2 Avatar Color Palette

Eight colors derived from brand tokens, avoiding red/destructive hues. Each must pass WCAG AA contrast (4.5:1 minimum) for white text on the background color.

**Light mode -- `:root` block:**

```css
/* Avatar Palette */
--avatar-0-bg: oklch(0.55 0.24 280);   /* violet -- maps to --color-tc-violet */
--avatar-0-text: oklch(1 0 0);
--avatar-1-bg: oklch(0.48 0.18 255);   /* blue -- maps to info hue */
--avatar-1-text: oklch(1 0 0);
--avatar-2-bg: oklch(0.55 0.16 180);   /* teal */
--avatar-2-text: oklch(1 0 0);
--avatar-3-bg: oklch(0.52 0.14 160);   /* green */
--avatar-3-text: oklch(1 0 0);
--avatar-4-bg: oklch(0.58 0.16 70);    /* amber */
--avatar-4-text: oklch(0.2 0.04 70);   /* dark text for lighter bg */
--avatar-5-bg: oklch(0.50 0.12 320);   /* plum */
--avatar-5-text: oklch(1 0 0);
--avatar-6-bg: oklch(0.48 0.10 250);   /* slate-blue */
--avatar-6-text: oklch(1 0 0);
--avatar-7-bg: oklch(0.50 0.14 200);   /* cyan */
--avatar-7-text: oklch(1 0 0);
```

**Dark mode -- `.dark` block:** Same hue angles, increase lightness by ~0.10, maintain contrast ratios.

**Hash algorithm:** `(sum of charCode values) % 8`. This is deterministic and stable -- the same name always produces the same color. The Lead Engineer owns the exact implementation but must use this algorithm.

**Constraint:** The Lead Engineer must verify WCAG AA contrast for all 8 pairings in both light and dark mode before marking the Avatar component complete. Use `oklch` lightness values to reason about contrast -- bg lightness < 0.55 with white text generally passes, but tool verification is required.

### 3.3 Pill Color Tokens

Pill uses the same `bg/text/border` triplet pattern as status tokens. Minimum set for Sprint 1:

```
gray, blue, green, amber, red, violet, teal, pink
```

Each gets three custom properties in `:root` and `.dark`:
```css
--pill-gray-bg: oklch(...);
--pill-gray-text: oklch(...);
--pill-gray-border: oklch(...);
```

The Lead Engineer defines the exact oklch values. Constraints:
- Must use oklch color space (consistency with existing tokens).
- Text must pass WCAG AA contrast against its bg in both light and dark modes.
- Border must be visible against card background (`--card`) in both modes.
- Gray is the default pill color.

---

## 4. Component API Contracts

### 4.1 CVA Contract (all new components)

Every new component in `src/components/design-system/` must follow this contract, established by `button.tsx`:

1. **Props interface** extends the base HTML element's attributes + `VariantProps<typeof componentVariants>` + `className?: string`.
2. **CVA definition** as a named export (`avatarVariants`, `pillVariants`, etc.) for external consumption.
3. **`cn()` merging** -- all className resolution goes through `cn()` from `@/lib/utils`.
4. **`React.forwardRef`** for DOM ref forwarding.
5. **`displayName`** set explicitly for React DevTools.

### 4.2 Avatar

```typescript
// src/components/design-system/avatar.tsx

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof avatarVariants> {
  name: string           // Required. Used for initials + color hash.
  src?: string           // Optional image URL. Falls back to initials.
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

// Size scale:
// xs: 24px (h-6 w-6, text-[10px])
// sm: 28px (h-7 w-7, text-[11px])
// md: 32px (h-8 w-8, text-xs)
// lg: 40px (h-10 w-10, text-sm)

// Behavior:
// - Renders as circular span (rounded-full)
// - If src provided: renders <img> inside span, with name as alt text
// - If src fails (onError): falls back to initials
// - If no src: renders initials (first letter of first + last name, uppercase)
// - Background color from avatar palette via hash
// - Text color from avatar palette (paired with bg)
// - Single-name input ("Admin") produces single initial ("A")
```

**Implementation constraints:**
- Image loading state must NOT cause layout shift. The span must reserve its dimensions regardless of image load state.
- The `onError` fallback must be synchronous (set a local `useState` flag, re-render with initials). No retry logic.
- Colors applied via `style` attribute referencing CSS custom properties (same pattern as StatusBadge), not via CVA variant strings. This is because the color is data-driven (hash of name), not a fixed variant.

### 4.3 Pill

```typescript
// src/components/design-system/pill.tsx

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof pillVariants> {
  color?: "gray" | "blue" | "green" | "amber" | "red" | "violet" | "teal" | "pink"
  size?: "sm" | "md"
  dot?: boolean          // Leading color dot, same pattern as StatusBadge
  removable?: boolean    // Trailing X icon
  onRemove?: () => void  // Called when X clicked. Required if removable=true.
  className?: string
}

// Size scale:
// sm: h-5 px-1.5 text-[11px]
// md: h-6 px-2 text-xs

// Default: color="gray", size="md", dot=false, removable=false
```

**Implementation constraints:**
- Colors applied via `style` attribute referencing `--pill-{color}-bg/text/border` custom properties. Same pattern as StatusBadge, not CVA variants. Rationale: CVA generates static class strings; we need dynamic property references based on the `color` prop.
- The remove button is a `<button>` element (not a span), for keyboard accessibility. It must have `aria-label="Remove {children text}"`.
- `onRemove` fires on click and on Enter/Space keydown on the remove button.
- Pill renders its `children` as content (text, not restricted).

### 4.4 Copyable

```typescript
// src/components/design-system/copyable.tsx

export interface CopyableProps {
  value: string              // The text to copy. NOT necessarily the displayed text.
  children: React.ReactNode  // The displayed content.
  feedbackDuration?: number  // ms to show "Copied" state. Default: 1500.
  tooltipSide?: "top" | "bottom" | "left" | "right"  // Default: "top"
  className?: string
}

// State machine: idle -> copying -> copied -> idle
// idle:    shows Copy icon in tooltip trigger area
// copying: async clipboard operation in flight (treat as instant for UI)
// copied:  shows Check icon, reverts after feedbackDuration
// idle:    back to Copy icon

// Renders:
// <Tooltip>
//   <TooltipTrigger asChild>
//     <span role="button" tabIndex={0} className={...} onClick={handleCopy} onKeyDown={handleKeyDown}>
//       {children}
//       <CopyIcon | CheckIcon />
//     </span>
//   </TooltipTrigger>
//   <TooltipContent side={tooltipSide}>
//     {state === "copied" ? "Copied!" : "Copy"}
//   </TooltipContent>
// </Tooltip>
```

**Implementation constraints:**
- Depends on `copy-to-clipboard.ts` utility (not inline clipboard logic).
- Depends on existing `Tooltip` from `src/components/ui/tooltip.tsx`. The Copyable component must be wrapped in a `TooltipProvider` by the consumer OR the component itself wraps with `TooltipProvider` internally. Decision: **wrap internally** with `delayDuration={0}` to avoid requiring consumers to manage providers. This is a self-contained interaction.
- The outer element is `<span role="button" tabIndex={0}>`, not a `<button>`. Rationale: Copyable wraps arbitrary inline content (text, code snippets, IDs). A button would break semantic nesting if the child already contains interactive elements. The `role="button"` + `tabIndex` ensures keyboard accessibility.
- `onKeyDown` must handle Enter and Space to trigger copy.
- Icon sizing: 14px (`h-3.5 w-3.5`), positioned inline after children with `gap-1.5`. Icons from lucide-react (`Copy`, `Check`).
- The icon swap uses `opacity` transition (`--duration-fast`) for smooth visual feedback, not a hard swap.

### 4.5 copy-to-clipboard.ts

```typescript
// src/lib/copy-to-clipboard.ts

export async function copyToClipboard(text: string): Promise<boolean> {
  // Primary: navigator.clipboard.writeText (async, requires HTTPS or localhost)
  // Fallback: document.execCommand('copy') via temporary textarea
  // Returns: true if copy succeeded, false otherwise
  // Throws: never. All errors caught internally.
}
```

**Constraints:**
- Zero dependencies. No React imports.
- Must handle the `navigator.clipboard` being undefined (HTTP context, older browsers).
- The fallback textarea must be created, focused, selected, execCommand'd, and removed synchronously within the same call.
- Must not throw. Return `false` on any failure path.

---

## 5. Shadow Migration

### 5.1 Scope

Remove `shadow-sm` from `button.tsx` variants and `shadow` from `badge.tsx` default variant. This is a visual refinement -- flat buttons and badges are the target aesthetic for admin-density UIs.

### 5.2 Exact Changes

**`button.tsx` -- `buttonVariants` CVA definition:**

| Variant | Current | After |
|---|---|---|
| `default` | `"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"` | `"bg-primary text-primary-foreground hover:bg-primary/90"` |
| `destructive` | `"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"` | `"bg-destructive text-destructive-foreground hover:bg-destructive/90"` |
| `outline` | `"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"` | `"border border-input bg-background hover:bg-accent hover:text-accent-foreground"` |
| `secondary` | `"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"` | `"bg-secondary text-secondary-foreground hover:bg-secondary/80"` |
| `ghost` | No change | No change |
| `link` | No change | No change |

**`badge.tsx` -- `badgeVariants` CVA definition:**

| Variant | Current | After |
|---|---|---|
| `default` | `"border-transparent bg-primary text-primary-foreground shadow"` | `"border-transparent bg-primary text-primary-foreground"` |
| `destructive` | `"border-transparent bg-destructive text-destructive-foreground shadow"` | `"border-transparent bg-destructive text-destructive-foreground"` |
| `secondary` | No change | No change |
| `outline` | No change | No change |

### 5.3 What NOT to Touch

- `shadow-md` and `shadow-lg` tokens remain in `index.css`. They are used by overlay components (dialog, sheet, popover, dropdown-menu).
- `card.tsx` is not modified -- it uses `border`, not shadow.
- No shadow tokens are removed from `@theme`. This is a usage change, not a token deprecation.

---

## 6. Build Sequence

Each step is independently testable. The Lead Engineer must not combine steps in a way that breaks this property.

| Step | Deliverable | Dependencies | Testable When |
|---|---|---|---|
| 1 | Token additions to `index.css`: avatar palette (8 colors x light/dark), pill color tokens (8 colors x light/dark) | None | Tokens exist in CSS, visible in browser DevTools when inspecting `:root`. Manual visual check in both light and dark mode. |
| 2 | `copy-to-clipboard.ts` utility | None | Unit-testable in isolation. `copyToClipboard("test")` returns `true` in HTTPS/localhost context. Fallback testable by mocking `navigator.clipboard` as undefined. |
| 3 | Avatar component | Step 1 (avatar tokens) | Renders with correct initials, correct color per name hash, correct size variants. Image src renders and falls back on error. Visual regression baseline. |
| 4 | Pill component | Step 1 (pill tokens) | Renders with correct color per prop, dot variant, removable variant fires onRemove. Visual regression baseline. |
| 5 | Copyable component | Step 2 (clipboard util) + existing Tooltip | Clicking copies value to clipboard. Icon swaps to Check, reverts after feedbackDuration. Keyboard activation works. Tooltip text changes. |
| 6 | Shadow migration in button.tsx and badge.tsx | None (fully independent) | Visual diff: buttons and badges no longer have shadows. Overlay components (dialog, popover, dropdown) still have shadows. No functional regressions. |
| 7 | Showcase updates in App.tsx | Steps 1-6 | All new components visible in the showcase. Interactive demos work. |

**Parallelization:** Steps 1 and 2 can run in parallel. Steps 3, 4, and 6 can run in parallel after Step 1 completes. Step 5 depends on Step 2. Step 7 is last.

```
     +--- Step 1 (tokens) ---+--- Step 3 (Avatar)  ---+
     |                        +--- Step 4 (Pill)     ---+--- Step 7 (Showcase)
Start+                        +--- Step 6 (Shadows)  ---+        |
     |                                                            |
     +--- Step 2 (clipboard) -------- Step 5 (Copyable) ---------+
```

---

## 7. Technical Risk Assessment

### 7.1 Clipboard API Browser Compatibility

**Risk:** `navigator.clipboard.writeText` requires a secure context (HTTPS or localhost). In some browsers, it also requires the page to be focused and may prompt for permission.

**Severity:** Low. The design system is used in admin UIs served over HTTPS. The `document.execCommand('copy')` fallback handles edge cases.

**Mitigation:** The `copy-to-clipboard.ts` utility is designed to never throw and always return a boolean. The Copyable component must handle `false` gracefully (no icon swap, or show an error tooltip). The Lead Engineer decides the exact UX for copy failure.

### 7.2 oklch Browser Support

**Risk:** oklch is not supported in Safari < 15.4, Chrome < 111, Firefox < 113.

**Severity:** Low. The design system already uses oklch throughout `index.css` for all semantic tokens. This is an existing decision, not a new risk. Sprint 1 tokens follow the same pattern.

**Mitigation:** None needed beyond existing posture. If oklch support ever becomes a blocker, the entire token system would need migration (not a Sprint 1 concern).

### 7.3 Avatar Color Contrast Compliance

**Risk:** The 8-color avatar palette must pass WCAG AA contrast in both light and dark mode (16 pairings total). Getting this wrong means accessibility violations.

**Severity:** Medium. Incorrect contrast is a compliance issue.

**Mitigation:** The Lead Engineer must verify all 16 pairings using a contrast checker tool before the Avatar component is marked complete. The oklch values in Section 3.2 are starting points, not final values -- the Lead Engineer has authority to adjust lightness/chroma to hit contrast targets while preserving the hue.

### 7.4 Shadow Removal Visual Regression

**Risk:** Removing shadows from buttons and badges could have unintended visual impact in compositions where shadow provided visual separation (e.g., a button on a white card background).

**Severity:** Low. The existing button already differentiates via background color, and the design system targets flat/admin density aesthetic.

**Mitigation:** Step 6 must include a visual review of all button variants on all background colors (background, card, muted) in both light and dark mode. The Lead Engineer should capture before/after screenshots for the showcase.

---

## 8. Constraints for the Lead Engineer

1. **Token location is non-negotiable.** Avatar and pill color tokens go in `:root`/`.dark` blocks as CSS custom properties. Not in Tailwind config. Not in JS constants. Not in CVA variants. This is the pattern established by status tokens and it must be consistent.

2. **CVA contract is non-negotiable.** All three new components must follow the contract in Section 4.1. The Lead Engineer has full authority on implementation details within that contract.

3. **No new dependencies.** Sprint 1 introduces zero new npm packages. Everything is built with existing stack: React 19, CVA, cn(), lucide-react, Radix Tooltip.

4. **No gradient tokens.** If a component needs a gradient, it uses inline Tailwind gradient classes. Gradients are not tokenized in this sprint.

5. **Clipboard utility is synchronous in API shape.** `copyToClipboard` returns `Promise<boolean>`. It does not expose the underlying error. The consumer gets success/failure, nothing else.

6. **StatusBadge is the reference implementation** for the pattern of "color determined by data, applied via style attribute referencing CSS custom properties." Avatar and Pill follow this pattern, not a CVA-variant-per-color pattern.

---

## 9. Security/Compliance Gate

**Status:** Not yet reviewed.

The Security/Compliance agent must review this brief before it is final. Given the scope (frontend-only, no data handling, no integrations, no auth changes), the expectation is a quick pass. The only areas of potential concern:

- **Clipboard access:** The `navigator.clipboard` API requires user gesture (click/keydown) and secure context. The architecture enforces both -- Copyable only fires on explicit user interaction. No clipboard reads occur; only writes.
- **No PII handling:** Avatar renders initials from names but does not persist, transmit, or log name data. The hash is computed at render time from a prop.

Findings will be incorporated into this section once the gate runs.

---

## 10. Handoff

This brief hands off to:
- **QA Lead** for test matrix creation (backend-only path since this is a component library, not a user-facing product flow -- but QA should define visual regression and accessibility test criteria).
- **Lead Engineer** for implementation, following the build sequence and constraints above.

No Design Lead handoff needed -- the component APIs and visual specs are defined here. If the Design Lead has a spec for exact pixel treatments, colors, or spacing that differs from this brief, their spec takes precedence on visual details. This brief takes precedence on architecture (token location, component contracts, build sequence).
