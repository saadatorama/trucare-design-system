# Test Matrix: DS Sprint 1 — Token Hardening & Micro-Utilities

**Initiative Slug:** `ds-sprint-1`
**Author:** QA Lead
**Date:** 2026-04-03
**Status:** PRE-BUILD
**Upstream Artifacts Reviewed:** `product-brief.md` (SC-1 through SC-10)

---

## Overview

This test matrix covers 7 test areas with 47 individual acceptance criteria across Sprint 1 scope: token additions, shadow-to-border migration, 3 new components (Copyable, Avatar, Pill), and the badge shape prototype. Each criterion has at least one concrete test scenario with given/when/then structure and a test type classification.

**Test type key:**
- **Unit** — isolated component render or utility function test (Vitest / React Testing Library)
- **Integration** — cross-concern test involving tokens + component rendering, dark mode, or clipboard API
- **E2E / Visual** — full browser test or manual visual inspection in showcase/Storybook

**Pass threshold:** ALL criteria must pass for a SHIP recommendation. Any failure in Areas 1-6 is a HOLD. Failures in Area 7 (Build & Integration) are Critical by definition.

---

## Area 1: Token Rendering

Maps to: SC-1, SC-2, SC-3, SC-10

### AC-1.1: Gradient tokens render as CSS background gradients

**Criterion:** All 5 gradient tokens (`--gradient-violet`, `--gradient-blue`, `--gradient-teal`, `--gradient-ink`, `--gradient-brand`) resolve to valid CSS gradient values and render visibly in both light and dark mode.

| # | Scenario | Type |
|---|----------|------|
| 1.1.1 | **Given** the design system CSS is loaded, **when** inspecting computed styles on an element using `var(--gradient-violet)`, **then** the resolved value is a valid CSS `linear-gradient()` or `radial-gradient()` expression. Repeat for all 5 tokens. | Unit |
| 1.1.2 | **Given** the showcase page is loaded in light mode, **when** viewing gradient token swatches, **then** each of the 5 gradients is visually distinct, not transparent, and not clipped. | E2E / Visual |
| 1.1.3 | **Given** the showcase page is loaded in dark mode, **when** viewing gradient token swatches, **then** each of the 5 gradients is visually distinct and not invisible against the dark background. No gradient should appear as a solid dark rectangle. | E2E / Visual |

### AC-1.2: Pill color tokens display correct tints in light mode

**Criterion:** Pill bg + text token pairs for all variants (neutral, violet, blue, teal, green, amber, red) produce a visually distinct tinted appearance in light mode. Contrast ratio between pill text and pill bg meets WCAG AA (4.5:1 minimum).

| # | Scenario | Type |
|---|----------|------|
| 1.2.1 | **Given** CSS is loaded in light mode, **when** computing the resolved values of `--pill-{color}-bg` and `--pill-{color}-text` for each of the 7 color variants, **then** each pair resolves to valid CSS color values (not `undefined`, not identical to each other). | Unit |
| 1.2.2 | **Given** 7 pill swatches rendered in light mode, **when** measuring contrast ratio of each text-on-bg pair, **then** all 7 pairs have a contrast ratio >= 4.5:1. | Integration |

### AC-1.3: Pill color tokens display correct dark mode equivalents

**Criterion:** In dark mode, pill tokens switch to dark-appropriate tints. Same 7 variants, same contrast requirement.

| # | Scenario | Type |
|---|----------|------|
| 1.3.1 | **Given** CSS is loaded in dark mode, **when** computing resolved values of `--pill-{color}-bg` and `--pill-{color}-text`, **then** the dark mode values differ from light mode values for at least 5 of 7 variants (tokens are not hardcoded to a single mode). | Integration |
| 1.3.2 | **Given** 7 pill swatches rendered in dark mode, **when** measuring contrast ratio of each text-on-bg pair, **then** all 7 pairs have a contrast ratio >= 4.5:1. | Integration |

### AC-1.4: Typography tokens match exact px values

**Criterion:** 7 CSS custom properties exist and resolve to the correct px values: `--text-2xl` (24px), `--text-xl` (20px), `--text-base` (16px), `--text-sm` (14px), `--text-xs` (13px), `--text-2xs` (12px), `--text-3xs` (11px).

| # | Scenario | Type |
|---|----------|------|
| 1.4.1 | **Given** the design system CSS is loaded, **when** reading the computed value of each of the 7 `--text-*` custom properties, **then** the resolved values match exactly: 24px, 20px, 16px, 14px, 13px, 12px, 11px respectively. | Unit |
| 1.4.2 | **Given** a test element with `font-size: var(--text-sm)`, **when** rendering that element, **then** `getComputedStyle(el).fontSize` equals `"14px"`. Repeat for each of the 7 tokens. | Unit |

### AC-1.5: Monospace rules applied correctly

**Criterion:** IDs and NPI numbers render in Geist Mono. Patient names and dates render in Geist Sans. This is documented in a discoverable location.

| # | Scenario | Type |
|---|----------|------|
| 1.5.1 | **Given** a Copyable component displaying a patient ID (e.g., "PAT-12345"), **when** inspecting the computed `font-family`, **then** it includes `Geist Mono` (or the monospace stack). | Integration |
| 1.5.2 | **Given** a text element displaying an NPI number, **when** inspecting computed `font-family`, **then** it includes `Geist Mono`. | Integration |
| 1.5.3 | **Given** a text element displaying a patient name, **when** inspecting computed `font-family`, **then** it includes `Geist Sans` (or the default sans stack) and does NOT include `Geist Mono`. | Integration |
| 1.5.4 | **Given** the design system showcase or docs, **when** searching for monospace usage documentation, **then** a page or section exists with explicit rules: Geist Mono for IDs, NPI, currency; Geist Sans for names, dates, general text. | E2E / Visual |

---

## Area 2: Shadow-to-Border Migration

Maps to: SC-4, SC-5

### AC-2.1: Button default variant has no box-shadow, has border

| # | Scenario | Type |
|---|----------|------|
| 2.1.1 | **Given** a `<Button variant="default">` is rendered, **when** inspecting computed styles, **then** `box-shadow` is `none` AND `border` is present (not `0px`). | Unit |

### AC-2.2: Button destructive variant has no box-shadow, has border

| # | Scenario | Type |
|---|----------|------|
| 2.2.1 | **Given** a `<Button variant="destructive">` is rendered, **when** inspecting computed styles, **then** `box-shadow` is `none` AND `border` is present. | Unit |

### AC-2.3: Button outline variant has no box-shadow, existing border preserved

| # | Scenario | Type |
|---|----------|------|
| 2.3.1 | **Given** a `<Button variant="outline">` is rendered, **when** inspecting computed styles, **then** `box-shadow` is `none` AND `border` matches the pre-migration visible border styling. | Unit |

### AC-2.4: Button secondary variant has no box-shadow, has border

| # | Scenario | Type |
|---|----------|------|
| 2.4.1 | **Given** a `<Button variant="secondary">` is rendered, **when** inspecting computed styles, **then** `box-shadow` is `none` AND `border` is present. | Unit |

### AC-2.5: Button ghost variant unchanged

| # | Scenario | Type |
|---|----------|------|
| 2.5.1 | **Given** a `<Button variant="ghost">` is rendered, **when** inspecting computed styles, **then** `box-shadow` is `none` (same as before migration) AND `border` matches pre-migration value. | Unit |

### AC-2.6: Button link variant unchanged

| # | Scenario | Type |
|---|----------|------|
| 2.6.1 | **Given** a `<Button variant="link">` is rendered, **when** inspecting computed styles, **then** styling is identical to pre-migration (no shadow before, no shadow after, no border added). | Unit |

### AC-2.7: Badge default variant has no box-shadow

| # | Scenario | Type |
|---|----------|------|
| 2.7.1 | **Given** a `<Badge>` with default variant is rendered, **when** inspecting computed styles, **then** `box-shadow` is `none`. | Unit |

### AC-2.8: Dropdowns/popovers retain shadow-md

| # | Scenario | Type |
|---|----------|------|
| 2.8.1 | **Given** a dropdown or popover component is rendered and opened, **when** inspecting the floating panel's computed `box-shadow`, **then** the value is non-`none` and corresponds to `shadow-md` (a visible elevation shadow). | Integration |

### AC-2.9: Dialogs/sheets retain shadow-lg

| # | Scenario | Type |
|---|----------|------|
| 2.9.1 | **Given** a dialog or sheet component is rendered and opened, **when** inspecting the overlay panel's computed `box-shadow`, **then** the value is non-`none` and corresponds to `shadow-lg`. | Integration |

### AC-2.10: Zero shadow-sm references in button source code

| # | Scenario | Type |
|---|----------|------|
| 2.10.1 | **Given** the button component source file(s), **when** grepping for `shadow-sm`, **then** the result is 0 matches. | Unit |

### AC-2.11: Zero shadow references in badge default variant source code

| # | Scenario | Type |
|---|----------|------|
| 2.11.1 | **Given** the badge component source file(s), **when** grepping for `shadow` (excluding `shadow-md`, `shadow-lg`, and comments), **then** the result is 0 matches in the default variant's class string. | Unit |

---

## Area 3: Copyable Component

Maps to: SC-6

### AC-3.1: Click copies value to clipboard

| # | Scenario | Type |
|---|----------|------|
| 3.1.1 | **Given** a `<Copyable value="PAT-12345">` is rendered, **when** the user clicks the component, **then** the system clipboard contains the string `"PAT-12345"`. | Integration |

### AC-3.2: Visual feedback — icon swaps to checkmark for 1500ms

| # | Scenario | Type |
|---|----------|------|
| 3.2.1 | **Given** a Copyable component in idle state (showing copy icon), **when** the user clicks it, **then** the icon changes to a checkmark immediately after click, AND the checkmark reverts to the copy icon after approximately 1500ms (+/- 200ms). | Unit |

### AC-3.3: Tooltip shows "Click to copy" on hover (idle)

| # | Scenario | Type |
|---|----------|------|
| 3.3.1 | **Given** a Copyable component in idle state, **when** the user hovers over it, **then** a tooltip appears with the text "Click to copy". | Unit |

### AC-3.4: Tooltip shows "Copied!" after click

| # | Scenario | Type |
|---|----------|------|
| 3.4.1 | **Given** a Copyable component, **when** the user clicks it and then observes the tooltip, **then** the tooltip text changes to "Copied!" and remains until the checkmark reverts. | Unit |

### AC-3.5: cursor-pointer on hover

| # | Scenario | Type |
|---|----------|------|
| 3.5.1 | **Given** a Copyable component is rendered, **when** inspecting computed styles, **then** `cursor` is `pointer`. | Unit |

### AC-3.6: Works with masked values (copies full, displays masked)

| # | Scenario | Type |
|---|----------|------|
| 3.6.1 | **Given** `<Copyable value="123-45-6789" displayValue="***-**-6789">`, **when** the component renders, **then** the visible text shows `"***-**-6789"`. **When** the user clicks it, **then** the clipboard contains `"123-45-6789"` (the full unmasked value). | Integration |

### AC-3.7: Keyboard accessible — Enter/Space triggers copy

| # | Scenario | Type |
|---|----------|------|
| 3.7.1 | **Given** a Copyable component has keyboard focus, **when** the user presses Enter, **then** the clipboard is written and the checkmark feedback appears (identical behavior to click). | Unit |
| 3.7.2 | **Given** a Copyable component has keyboard focus, **when** the user presses Space, **then** the clipboard is written and the checkmark feedback appears. | Unit |
| 3.7.3 | **Given** a Copyable component is rendered, **when** inspecting the DOM, **then** the interactive element has `role="button"` or is a `<button>`, and has an accessible `aria-label` that includes the purpose (e.g., "Copy PAT-12345"). | Unit |

### AC-3.8: Clipboard fallback for older browsers

| # | Scenario | Type |
|---|----------|------|
| 3.8.1 | **Given** `navigator.clipboard` is unavailable (mocked as undefined), **when** the user clicks Copyable, **then** the `execCommand('copy')` fallback is invoked AND the copy still succeeds (returns true). | Unit |

---

## Area 4: Avatar Component

Maps to: SC-7

### AC-4.1: Four sizes render at correct pixel dimensions

| # | Scenario | Type |
|---|----------|------|
| 4.1.1 | **Given** `<Avatar name="Jane Doe" size="xs">` (20px), **when** measuring rendered dimensions, **then** width and height are both 20px. | Unit |
| 4.1.2 | **Given** `<Avatar name="Jane Doe" size="sm">` (24px), **when** measuring, **then** 24x24px. | Unit |
| 4.1.3 | **Given** `<Avatar name="Jane Doe" size="md">` (32px), **when** measuring, **then** 32x32px. | Unit |
| 4.1.4 | **Given** `<Avatar name="Jane Doe" size="lg">` (40px), **when** measuring, **then** 40x40px. | Unit |

### AC-4.2: Font sizes correct per size

| # | Scenario | Type |
|---|----------|------|
| 4.2.1 | **Given** each Avatar size variant is rendered, **when** inspecting computed `font-size`, **then** values are: xs=10px, sm=11px, md=13px, lg=16px. | Unit |

### AC-4.3: First letter extracted from name

| # | Scenario | Type |
|---|----------|------|
| 4.3.1 | **Given** `<Avatar name="Jane Doe">`, **when** rendered, **then** the visible text content is `"J"`. | Unit |
| 4.3.2 | **Given** `<Avatar name="jane doe">` (lowercase), **when** rendered, **then** the visible text content is `"J"` (uppercased). | Unit |

### AC-4.4: Falls back to email prefix first letter when no name

| # | Scenario | Type |
|---|----------|------|
| 4.4.1 | **Given** `<Avatar email="jane.doe@trucare.com">` (no name prop), **when** rendered, **then** the visible text content is `"J"` (first letter of email prefix). | Unit |

### AC-4.5: Deterministic color — same name always produces same color

| # | Scenario | Type |
|---|----------|------|
| 4.5.1 | **Given** `<Avatar name="Jane Doe">` rendered 3 separate times (unmount/remount between each), **when** inspecting the computed `background-color` each time, **then** all 3 values are identical. | Unit |

### AC-4.6: Color distribution — different names produce varied colors

| # | Scenario | Type |
|---|----------|------|
| 4.6.1 | **Given** 10 Avatars rendered with names: "Jane Doe", "John Smith", "Alice Brown", "Bob Wilson", "Carol White", "David Lee", "Eve Chen", "Frank Kim", "Grace Park", "Henry Wu", **when** inspecting background colors, **then** at least 4 distinct colors appear across the 10 avatars. | Unit |

### AC-4.7: White text readable on all background colors

| # | Scenario | Type |
|---|----------|------|
| 4.7.1 | **Given** Avatars rendered across all 8 possible background colors (by using names that hash to each), **when** measuring contrast ratio of white text (#FFFFFF) against each background color, **then** all 8 ratios are >= 3:1 (WCAG AA for large text / UI components). | Integration |

### AC-4.8: rounded-full shape

| # | Scenario | Type |
|---|----------|------|
| 4.8.1 | **Given** any Avatar is rendered, **when** inspecting computed `border-radius`, **then** the value is `9999px` or `50%` (fully circular). | Unit |

---

## Area 5: Pill Component

Maps to: SC-8

### AC-5.1: Seven color variants render with correct bg tints

| # | Scenario | Type |
|---|----------|------|
| 5.1.1 | **Given** 7 `<Pill>` components rendered, one per variant (neutral, violet, blue, teal, green, amber, red), **when** inspecting each pill's computed `background-color`, **then** all 7 have distinct, non-transparent background colors. | Unit |

### AC-5.2: No border on any variant

| # | Scenario | Type |
|---|----------|------|
| 5.2.1 | **Given** each of the 7 Pill color variants rendered, **when** inspecting computed `border`, **then** border is `none` or `0px` for all 7. This distinguishes Pill from StatusBadge (which has a border). | Unit |

### AC-5.3: Two sizes at correct dimensions

| # | Scenario | Type |
|---|----------|------|
| 5.3.1 | **Given** `<Pill size="sm">`, **when** measuring rendered height, **then** the height matches the sm specification (expected: consistent with the design system's small component scale). | Unit |
| 5.3.2 | **Given** `<Pill size="md">`, **when** measuring rendered height, **then** the height matches the md specification and is visually larger than sm. | Unit |

### AC-5.4: rounded-full shape

| # | Scenario | Type |
|---|----------|------|
| 5.4.1 | **Given** any Pill is rendered, **when** inspecting computed `border-radius`, **then** the value is `9999px` or `50%` (fully rounded / pill shape). | Unit |

### AC-5.5: Removable variant shows X button

| # | Scenario | Type |
|---|----------|------|
| 5.5.1 | **Given** `<Pill onRemove={handler}>Label</Pill>`, **when** rendered, **then** an X (dismiss) icon/button is visible inside the pill. | Unit |
| 5.5.2 | **Given** `<Pill>Label</Pill>` (no onRemove), **when** rendered, **then** no X icon is present. | Unit |

### AC-5.6: onRemove callback fires on X click

| # | Scenario | Type |
|---|----------|------|
| 5.6.1 | **Given** `<Pill onRemove={mockFn}>Label</Pill>`, **when** the user clicks the X button, **then** `mockFn` is called exactly once. | Unit |

### AC-5.7: Dark mode rendering

| # | Scenario | Type |
|---|----------|------|
| 5.7.1 | **Given** dark mode is active, **when** rendering all 7 Pill color variants, **then** all 7 have visible, non-transparent background colors that differ from their light mode values. Text remains readable (contrast >= 4.5:1). | Integration |

---

## Area 6: Badge Shape Prototype

Maps to: SC-8

### AC-6.1: Side-by-side comparison visible in showcase

| # | Scenario | Type |
|---|----------|------|
| 6.1.1 | **Given** the showcase/Storybook page is loaded, **when** navigating to the badge shape prototype section, **then** Badge, StatusBadge, and Pill are rendered side-by-side in the same viewport. | E2E / Visual |

### AC-6.2: Badge has rounded-md (6px corners)

| # | Scenario | Type |
|---|----------|------|
| 6.2.1 | **Given** a Badge is rendered in the prototype, **when** inspecting computed `border-radius`, **then** the value is `6px` (rounded-md per design system convention). | Unit |

### AC-6.3: StatusBadge has rounded-full with border and optional dot

| # | Scenario | Type |
|---|----------|------|
| 6.3.1 | **Given** a StatusBadge is rendered in the prototype, **when** inspecting computed styles, **then** `border-radius` is `9999px` or `50%` AND a visible `border` is present. | Unit |

### AC-6.4: Pill has rounded-full with bg-only (no border)

| # | Scenario | Type |
|---|----------|------|
| 6.4.1 | **Given** a Pill is rendered in the prototype, **when** inspecting computed styles, **then** `border-radius` is `9999px` or `50%` AND `border` is `none` or `0px` AND `background-color` is non-transparent. | Unit |

### AC-6.5: Visual distinction between all 3 is immediately apparent

| # | Scenario | Type |
|---|----------|------|
| 6.5.1 | **Given** the prototype section is visible, **when** a reviewer looks at the three components side-by-side, **then** the following distinctions are clear without reading labels: (a) Badge has squared corners, (b) StatusBadge is round with a visible border and optional dot indicator, (c) Pill is round with a tinted background and no border. This is a visual review pass/fail. | E2E / Visual |

---

## Area 7: Build & Integration

Maps to: SC-9

### AC-7.1: Build succeeds

| # | Scenario | Type |
|---|----------|------|
| 7.1.1 | **Given** all Sprint 1 changes are committed, **when** running `npm run build`, **then** the process exits with code 0 and zero errors. | Integration |

### AC-7.2: TypeScript passes

| # | Scenario | Type |
|---|----------|------|
| 7.2.1 | **Given** all Sprint 1 changes, **when** running `npx tsc --noEmit`, **then** zero TypeScript errors. | Integration |

### AC-7.3: Dev server loads with all new sections

| # | Scenario | Type |
|---|----------|------|
| 7.3.1 | **Given** `npm run dev` is running, **when** loading the showcase in a browser, **then** the page loads without console errors AND sections for gradient tokens, pill tokens, typography tokens, Copyable, Avatar, Pill, and badge shape prototype are all visible and navigable. | E2E / Visual |

### AC-7.4: Dark mode toggle works for all new additions

| # | Scenario | Type |
|---|----------|------|
| 7.4.1 | **Given** the showcase is loaded in light mode, **when** toggling to dark mode, **then** all new token swatches, Copyable, Avatar, Pill, and badge shape prototype re-render with dark mode styling. No component disappears, becomes invisible, or shows light-mode colors on dark background. | E2E / Visual |

### AC-7.5: No regressions in existing components

| # | Scenario | Type |
|---|----------|------|
| 7.5.1 | **Given** all Sprint 1 changes, **when** visually reviewing the existing showcase sections (buttons, cards, tables, badges, inputs, dialogs), **then** no visual regressions are observed. Buttons still have borders (not shadows). Cards, tables, dialogs render as before. | E2E / Visual |
| 7.5.2 | **Given** the shadow migration, **when** reviewing dropdown and popover components, **then** `shadow-md` elevation is preserved (no flattening). | E2E / Visual |

---

## Test Summary

| Area | Criteria | Scenarios | Unit | Integration | E2E / Visual |
|------|----------|-----------|------|-------------|--------------|
| 1. Token Rendering | 5 | 12 | 4 | 4 | 4 |
| 2. Shadow Migration | 11 | 11 | 9 | 2 | 0 |
| 3. Copyable | 8 | 10 | 8 | 2 | 0 |
| 4. Avatar | 8 | 10 | 8 | 1 | 0 (Note 1) |
| 5. Pill | 7 | 9 | 7 | 1 | 0 (Note 1) |
| 6. Badge Shape Proto | 5 | 5 | 3 | 0 | 2 |
| 7. Build & Integration | 5 | 7 | 0 | 2 | 5 |
| **Total** | **49** | **64** | **39** | **12** | **11** |

**Note 1:** Avatar and Pill visual appearance is validated indirectly through the badge shape prototype (Area 6) and the dark mode toggle test (AC-7.4). Dedicated visual regression tests for these components are optional but recommended.

---

## Edge Cases & Integration Risks

The following edge cases are explicitly called out for the Lead Engineer's attention. These are already embedded in the scenarios above but are listed here to make them hard to miss.

1. **Clipboard API unavailable** (AC-3.8): Older browsers or iframe-restricted environments may not support `navigator.clipboard`. The `copy-to-clipboard.ts` utility must include an `execCommand('copy')` fallback. Test with `navigator.clipboard` mocked as `undefined`.

2. **Dark mode gradient visibility** (AC-1.1.3): Gradients that look fine in light mode may become invisible or indistinguishable on dark backgrounds. Each gradient must be explicitly checked in dark mode.

3. **Contrast ratios in dark mode** (AC-1.3.2, AC-5.7): Pill color tints must maintain WCAG AA contrast in dark mode. Light-mode-passing tints may fail when placed on a dark background. Test each of the 7 pill colors in dark mode independently.

4. **Shadow removal revealing visual gaps** (AC-7.5): Removing `shadow-sm` from buttons may expose previously hidden border inconsistencies. The `border border-transparent` replacement must produce equivalent visual weight without shadow.

5. **Avatar hash distribution** (AC-4.6): A poor hash function could cluster most names onto 1-2 colors. The distribution test with 10 names requiring 4+ distinct colors catches this.

6. **Masked value copy** (AC-3.6): The Copyable component must separate display text from clipboard text. If the implementation naively copies `innerText`, masked values will copy the masked string instead of the real value.

---

## Notes for Lead Engineer

- **Test automation priority:** Unit tests (39 scenarios) should be automated in Vitest/RTL. Integration tests (12 scenarios) should be automated where possible (contrast ratio checks, dark mode token resolution). E2E/Visual tests (11 scenarios) may be manual for Sprint 1 but should be documented as repeatable steps.

- **Contrast ratio tooling:** For AC-1.2.2, AC-1.3.2, AC-4.7, and AC-5.7, use a programmatic contrast checker (e.g., `wcag-contrast` or a custom helper that computes relative luminance). Do not rely on eyeballing.

- **Snapshot tests are not sufficient.** Snapshot tests tell you something changed, not whether it is correct. Every criterion here has a concrete expected value. Test against the value, not against a snapshot.

- **Grep-based checks** (AC-2.10, AC-2.11) can be automated as CI assertions or as unit tests that read the source file and assert zero matches.

---

## Upstream Gaps

None. The product brief (SC-1 through SC-10) provided sufficient specificity to write concrete test scenarios. No criteria were sent back for clarification.

The product brief notes "No architectural complexity is expected" and the architecture brief has not yet been written. If the Architect's brief introduces constraints (e.g., token naming conventions that differ from what is assumed here, build pipeline changes), this test matrix should be reviewed for any affected criteria. The token names used in this matrix (`--gradient-*`, `--pill-*-bg`, `--pill-*-text`, `--text-*`) are assumed from the product brief and should be verified against the architecture brief when available.
