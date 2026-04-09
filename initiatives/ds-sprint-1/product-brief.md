# Product Brief: Design System Sprint 1 — Token Hardening & Micro-Utilities

**Initiative Slug:** `ds-sprint-1`
**Author:** Head of Product
**Date:** 2026-04-03
**Status:** BUILD
**RCM-Touching:** No

---

## 1. Problem Statement

TruCare's design system is on its 4th and final iteration. We have 23 shadcn/Radix primitives and 4 custom components in place. What we do not have is a locked, complete token layer and the micro-utility components that every subsequent sprint depends on.

Specifically:

- **Missing gradient and pill-color tokens** force developers to hardcode color values in TruIntake2, creating inconsistency and blocking dark mode parity.
- **Shadow inconsistency.** The current token layer ships `shadow-sm` on buttons and badges — a material-era pattern that conflicts with TruCare's flat, border-driven visual language. Developers override shadows ad hoc, which means the design system is a suggestion, not a standard.
- **No clipboard utility.** Front desk staff copy patient IDs, NPI numbers, and claim numbers dozens of times per shift. There is no standard copy interaction. Some components use `navigator.clipboard` directly; others do nothing.
- **No avatar component.** Every patient list, user mention, and audit log entry that needs initials currently uses inline divs with inconsistent sizing and arbitrary colors.
- **No pill component.** Tags, labels, and category indicators are a mess of ad hoc badge variants that blur the distinction between status indicators and categorical labels.
- **Typography tokens exist in practice but not in code.** The 24/20/16/14/13/12/11px admin scale is used across TruIntake2 but lives in developers' heads, not in CSS custom properties. Monospace usage rules (Geist Mono for IDs, NPI, currency) are undocumented.

Until Sprint 1 ships, every subsequent sprint (toast, navigation, data-dense tables, icon library) builds on an incomplete foundation.

## 2. Opportunity

This is infrastructure, not a feature. The opportunity is compound:

- **Velocity.** Locking tokens and shipping micro-utilities means Sprint 2-5 engineers never context-switch to ask "what color is this?" or "how big should this avatar be?" Every hour saved in Sprint 2-5 traces back to Sprint 1 decisions.
- **Consistency.** TruIntake2 currently has visual drift between pages. Token hardening makes drift structurally impossible for the properties it covers.
- **Dark mode readiness.** Gradient and pill tokens in both light and dark mode mean dark mode is not a separate workstream — it is built into every component from Sprint 1 forward.
- **Badge taxonomy.** The side-by-side prototype resolves a design debt that has lingered for 3 iterations: what is a Badge vs. a StatusBadge vs. a Pill? This decision gates Sprint 2 component work.

## 3. Users & Stakeholders

| Role | Relevance |
|---|---|
| **Front desk staff** | Primary users of Copyable (patient IDs, NPI). Primary viewers of Avatar (patient lists). |
| **Billers** | Copy claim numbers, payer IDs. See pills as category tags on claim lists. |
| **Practice managers** | View dashboards with avatars, pills, and gradient backgrounds. |
| **TruCare engineers** | Direct consumers of tokens and micro-utilities. Sprint 1 is primarily an internal-tooling sprint. |

Stakeholder for badge shape approval: product (me) and design lead. The prototype must ship in Sprint 1 so the decision can be made before Sprint 2 begins.

## 4. Scope

### In Scope

**Token Hardening**
- 5 gradient tokens: violet, blue, teal, ink, brand — defined as CSS custom properties in `index.css`, light + dark mode
- Soft pill color tokens: neutral, violet, blue, teal — bg + text pairs, light + dark mode
- Typography size tokens as CSS custom properties: `--text-2xl` (24px), `--text-xl` (20px), `--text-base` (16px), `--text-sm` (14px), `--text-xs` (13px), `--text-2xs` (12px), `--text-3xs` (11px)
- Documented monospace application rules: Geist Mono for IDs, NPI numbers, currency amounts. NOT for patient names, dates, or general text.

**Shadow-to-Border Migration**
- Remove `shadow-sm` from all button variants, replace with `border border-transparent`
- Remove `shadow` from badge default variant
- Retain `shadow-md` (dropdowns, popovers) and `shadow-lg` (dialogs, modals)
- No other shadow tokens are removed or modified

**New Utility Components**
- `copy-to-clipboard.ts` — async clipboard write with `execCommand('copy')` fallback for older browsers. Returns boolean success.
- `Copyable` — React wrapper component. Wraps any child element. On click: copies specified text, shows inline checkmark for ~1.5s, then reverts. Accessible (aria-label, keyboard support).
- `Avatar` — First-letter avatar. 4 sizes: 20px, 24px, 32px, 40px. Deterministic background color derived from name string hash. Consistent color for the same name across renders and sessions.
- `Pill` — Soft tag component. `rounded-full`, tinted background, no border. 7 color variants. Optional `onRemove` callback renders a dismiss icon. Visually distinct from Badge (rounded-md, border) and StatusBadge (rounded-full, dot indicator, border).

**Badge Shape Prototype**
- Storybook or showcase page with side-by-side rendering: Badge, StatusBadge, Pill
- Each shown in multiple color variants
- Annotated with shape rules (radius, border, indicator style)
- This is a decision artifact, not a shipped component change

### Explicitly Out of Scope

- Toast / notification system (Sprint 2)
- Navigation / header components (Sprint 4)
- Icon library curation (Sprint 5)
- Changes to existing 23 shadcn primitives beyond shadow removal on Button and Badge
- Semantic color token changes (the oklch palette in `index.css` is stable)
- Changes to StatusBadge, MetricCard, FilterBar, or DataTable internals
- New variants of existing components

## 5. Success Criteria

| # | Criterion | Measurement |
|---|---|---|
| SC-1 | All gradient tokens render correctly in light and dark mode | Visual regression: each gradient visible, no clipping, no invisible-on-dark-bg failures |
| SC-2 | All pill color tokens render correctly in light and dark mode | Visual regression: bg + text contrast ratio >= 4.5:1 (WCAG AA) in both modes |
| SC-3 | Typography size tokens are defined as CSS custom properties and match the admin scale exactly | Automated check: 7 tokens exist, values match 24/20/16/14/13/12/11px |
| SC-4 | Shadow removal applied globally — zero `shadow-sm` on buttons, zero `shadow` on badges | Grep for `shadow-sm` in button variants and `shadow` in badge default variant returns 0 matches |
| SC-5 | `shadow-md` and `shadow-lg` remain intact on dropdowns and dialogs | Spot check: dropdown and dialog components still render elevation |
| SC-6 | Copyable component copies text to clipboard on single click with visual checkmark feedback | Manual test: click Copyable, paste elsewhere, confirm match. Checkmark appears and auto-dismisses. |
| SC-7 | Avatar renders deterministic colors from name strings | Automated: `Avatar name="Jane Doe"` produces the same color on 3 separate renders. Different names produce different colors (test 10+ names for distribution). |
| SC-8 | Pill is visually distinct from both Badge and StatusBadge | Badge shape prototype clearly shows 3 distinct treatments: rounded-md vs. rounded-full+dot vs. rounded-full+bg-only |
| SC-9 | `npm run build` passes with zero errors and zero warnings related to Sprint 1 changes | CI: build exits 0 |
| SC-10 | Monospace rules documented in a discoverable location within the design system | Documentation file or Storybook page exists with clear rules for when to use Geist Mono |

## 6. RCM Validation Status

**Not applicable.** This initiative is a design system infrastructure sprint. It does not touch revenue cycle management logic, payer rules, billing workflows, or clinical data. No Healthcare Domain gate review is required.

## 7. Dependencies & Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Badge shape decision delays Sprint 2 | Medium | Ship the prototype in Sprint 1 week 1. Schedule stakeholder review by end of Sprint 1. If no decision by Sprint 2 start, proceed with current Badge shape and defer Pill integration. |
| Clipboard API not available in all practice environments (older browsers, iframe restrictions) | Low | `copy-to-clipboard.ts` includes `execCommand` fallback. Test in Safari, Chrome, Edge. |
| Gradient tokens may not meet contrast requirements in dark mode | Low | Define gradient tokens with explicit dark mode overrides. QA checks contrast on every gradient. |
| Shadow removal may reveal visual inconsistencies in components that relied on shadow for perceived depth | Medium | Shadow removal is limited to `shadow-sm` (buttons) and `shadow` (badges). `border border-transparent` replacement maintains clickable area perception. Full visual review in Storybook. |

## 8. Build Decision

**BUILD.**

Reasoning:

1. **This is a blocking dependency.** Sprints 2-5 cannot start cleanly without locked tokens and micro-utilities. Every week of delay on Sprint 1 is a week of delay on the entire design system timeline.
2. **Scope is tight and well-defined.** Token additions, shadow removal, 3 small components, 1 utility function, 1 prototype. No ambiguity about what "done" looks like.
3. **Engineering cost is low.** This is CSS custom properties, a clipboard utility, and 3 leaf components with no complex state management. Estimated at 3-5 engineering days.
4. **Risk is minimal.** No RCM logic. No data model changes. No API changes. No user-facing workflow changes. The worst-case failure mode is a visual regression, which is caught in Storybook review.
5. **The badge shape prototype resolves a 3-iteration design debt.** Shipping it now forces a decision that unblocks component taxonomy for the rest of the system.

No-build conditions: None. This ships.

---

**Next step:** Hand off to Chief Architect for `architecture-brief.md`. No architectural complexity is expected (this is CSS tokens and leaf components), but the Architect should confirm the token naming convention, component file structure, and any build pipeline implications of adding CSS custom properties for typography.
