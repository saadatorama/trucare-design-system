# Security / Compliance Review -- Sprints 2 & 3

**Artifact:** TruCare Design System -- Sprint 2 (Toast, Error Boundary, Error State, Form Components) and Sprint 3 (Copyable, IdCell, DateCell, EmailCell, AvatarNameCell, File Upload, Empty State Presets)
**Date:** 2026-04-03
**Reviewer:** Security/Compliance Gate (Agent OS)
**Review scope:** Implemented source code in `src/components/design-system/` and `src/lib/`

---

## Compliance Status: FAIL

Seven findings require remediation before these components can proceed to production use in the TruCare RCM product. Two are CRITICAL, three are HIGH, and two are MEDIUM.

---

## Findings

### Finding 1 -- CRITICAL: Copyable `aria-label` leaks full PHI value to assistive technology

- **Component:** `src/components/design-system/copyable.tsx`, line 56
- **Category:** PHI Exposure / Patient Display
- **Severity:** CRITICAL
- **Regulation reference:** 45 CFR 164.312(a)(1) -- Access Control; 45 CFR 164.502(b) -- Minimum Necessary
- **Detail:** The `aria-label` is set to `` `Copy ${value}` `` where `value` is the raw clipboard payload. When `Copyable` wraps masked data (e.g., SSN displayed as `***-**-1234` but `value` is `123-45-1234`), screen readers announce the full unmasked value. This also means the full PHI is present in the DOM attribute, queryable by browser extensions and DOM inspection. The spec states Copyable is used for "IDs, emails, NPIs, potentially SSN (masked)" -- the masked-display-but-unmasked-copy pattern guarantees PHI exposure through this path.
- **Required remediation:** The `aria-label` must use a sanitized or generic label. Replace `` `Copy ${value}` `` with a configurable `ariaLabel` prop that defaults to `"Copy to clipboard"`. Consuming components that display masked data MUST NOT pass the unmasked value into any DOM-visible attribute. The unmasked value should only exist in the click handler's runtime scope, never in markup.

---

### Finding 2 -- CRITICAL: Clipboard contains unmasked PHI with no expiration or clearing mechanism

- **Component:** `src/lib/copy-to-clipboard.ts`; `src/components/design-system/copyable.tsx`
- **Category:** PHI Exposure
- **Severity:** CRITICAL
- **Regulation reference:** 45 CFR 164.312(c)(1) -- Integrity Controls; 45 CFR 164.312(a)(2)(iv) -- Encryption and Decryption; 45 CFR 164.530(c) -- Safeguards
- **Detail:** When a user copies a masked SSN, DOB, MRN, or NPI, the full unmasked value is written to the system clipboard via `navigator.clipboard.writeText()`. The clipboard is a shared OS resource: any application on the workstation can read it, clipboard history managers retain it, and there is no TTL. In the legacy fallback path, a hidden `<textarea>` containing the raw PHI value is temporarily inserted into the DOM (lines 17-27 of `copy-to-clipboard.ts`). While it is removed after copy, the brief DOM presence is an attack surface for DOM-observing extensions.
- **Required remediation:**
  1. Implement an auto-clear mechanism that overwrites the clipboard after a configurable timeout (recommend 30 seconds). Add a `clearAfterMs` option to `copyToClipboard()` that calls `navigator.clipboard.writeText("")` after the timeout.
  2. Document in the component API that consumers MUST assess whether a given PHI element (SSN, full DOB) should be copyable at all. The design system should expose a `sensitive` prop on `Copyable` that triggers the auto-clear behavior and adds a visual indicator that the clipboard will be cleared.
  3. For the legacy textarea fallback: ensure the textarea `autocomplete` attribute is set to `"off"` and the textarea is not focusable by tab order during its brief DOM presence.

---

### Finding 3 -- HIGH: Toast notifications accept arbitrary string content with no PHI guardrail

- **Component:** `src/lib/toast.ts`; `src/components/design-system/toast-provider.tsx`
- **Category:** PHI Exposure
- **Severity:** HIGH
- **Regulation reference:** 45 CFR 164.502(b) -- Minimum Necessary; 45 CFR 164.312(a)(1) -- Access Control
- **Detail:** The `toast.error()` and `toast.success()` helpers accept any `string` as the `message` and `description` parameters and render them directly into the sonner Toaster. Toasts are visible to anyone viewing the screen, persist for 4 seconds (configurable higher by callers), and are positioned in a fixed corner visible across all page states. There is no runtime guard, content policy, or documentation preventing callers from passing messages like `"Patient John Doe (MRN: 12345) verified"` or pasting raw API error responses containing PHI.
- **Required remediation:**
  1. Add explicit JSDoc documentation on every toast helper stating: **"Toast messages MUST NOT contain patient identifiers (name, MRN, DOB, SSN, claim ID tied to a patient). Use generic confirmation messages (e.g., 'Patient verified', 'Claim submitted'). Never pass raw API error messages."**
  2. Add a development-only runtime check (behind `process.env.NODE_ENV === 'development'`) that warns in console if toast messages match common PHI patterns (e.g., regex for SSN `\d{3}-\d{2}-\d{4}`, MRN patterns, email addresses).
  3. Document this requirement in the design system component documentation as a binding compliance constraint, not a suggestion.

---

### Finding 4 -- HIGH: Error display components (`FieldError`) render caller-provided strings without sanitization guidance

- **Component:** `src/components/design-system/field-error.tsx`
- **Category:** PHI Exposure / XSS
- **Severity:** HIGH
- **Regulation reference:** 45 CFR 164.312(e)(1) -- Transmission Security; 45 CFR 164.502(b) -- Minimum Necessary
- **Detail:** `FieldError` renders the `message` prop directly as React children (line 24). While React's JSX escaping prevents raw HTML injection (no `dangerouslySetInnerHTML` detected -- good), the content risk is on the caller side: validation libraries and API error responses frequently include the submitted value in the error message (e.g., `"'123-45-6789' is not a valid NPI"`). If callers pass through raw backend validation errors, PHI from form inputs will be rendered in the UI error state and announced by screen readers via `role="alert"`.
- **Required remediation:**
  1. Add JSDoc on `FieldError` stating: **"The `message` prop must be a static validation label (e.g., 'Required', 'Invalid format'). Never pass raw API error responses or messages that echo back user input."**
  2. The design system documentation must include a "PHI-safe error messaging" section with approved patterns and anti-patterns.
  3. Consider adding an optional `sanitize` or `staticOnly` prop that, when enabled, rejects messages containing digit sequences matching PHI patterns (SSN, MRN) in development mode.

---

### Finding 5 -- HIGH: Error Boundary and Error State components are not yet implemented -- no compliance review possible, but production deployment is blocked without them

- **Component:** `ErrorBoundary`, `ErrorState` -- referenced in Sprint 2 scope but no source files found
- **Category:** PHI Exposure
- **Severity:** HIGH
- **Regulation reference:** 45 CFR 164.312(a)(1) -- Access Control; 45 CFR 164.502(b) -- Minimum Necessary
- **Detail:** No `ErrorBoundary` or `ErrorState` component exists in the codebase. React's default error behavior in production renders a blank screen (acceptable) but in development renders full stack traces that may contain PHI from component props, state, or API responses. Without a controlled ErrorBoundary, any unhandled exception in a PHI-displaying component risks surfacing patient data in the error overlay.
- **Required remediation:**
  1. Implement `ErrorBoundary` before these sprints ship. The fallback UI MUST:
     - Display a generic error message only (e.g., "Something went wrong. Please try again or contact support.")
     - NOT render `error.message`, `error.stack`, or any component state/props in the fallback UI
     - Log the full error to a structured logging service (not console in production) with appropriate PHI-aware log redaction
     - Include a session-correlating error ID that support can use to look up the full error server-side
  2. Implement `ErrorState` for inline section failures with the same constraint: generic user-facing message, no echoed data.
  3. This gate must re-review these components once implemented.

---

### Finding 6 -- MEDIUM: `DateCell` exposes full ISO timestamp in HTML `title` attribute

- **Component:** `src/components/design-system/data-table/cells/date-cell.tsx`, line 42
- **Category:** PHI Exposure
- **Severity:** MEDIUM
- **Regulation reference:** 45 CFR 164.514(b)(2) -- De-identification Safe Harbor (dates more specific than year are PHI identifiers); 45 CFR 164.502(b) -- Minimum Necessary
- **Detail:** The `title` attribute is set to `date.toISOString()`, which includes full date and time with timezone. While the visible text may show "Jan 5, 2024", hovering reveals the full precision timestamp. Under the HIPAA Safe Harbor method, dates more specific than year are considered identifiers. For patient-facing dates (DOB, admission dates, service dates), the full ISO timestamp in the title exceeds minimum necessary.
- **Required remediation:** Make the `title` attribute configurable. Add a `showFullTimestamp` prop that defaults to `false`. When false, the title should match the display text or be omitted. For admin-facing operational timestamps (e.g., claim submission time), full precision is acceptable -- but for patient demographic dates (DOB), it should be restricted.

---

### Finding 7 -- MEDIUM: `Avatar` component `aria-label` exposes patient name and email

- **Component:** `src/components/design-system/avatar.tsx`, line 63
- **Category:** PHI Exposure / Screen Reader Exposure
- **Severity:** MEDIUM
- **Regulation reference:** 45 CFR 164.502(b) -- Minimum Necessary; 45 CFR 164.312(a)(1) -- Access Control
- **Detail:** The `aria-label` is set to `name || email || "Avatar"`. For patient records, this means the full patient name or email address is announced by screen readers and present in the accessibility tree. While this is appropriate when the name is already visually displayed (the screen reader should match visual content), if the Avatar is used in a context where only initials are visually shown (compact views, minimized sidebars), the aria-label discloses more information than the visual UI.
- **Required remediation:** Add an `ariaLabel` override prop so consuming components can control exactly what is announced. Document that in contexts where the avatar is the sole visual representation (no adjacent name label), the `ariaLabel` should be set to a generic value or match only the visible initial. The default behavior (full name) is acceptable when used alongside a visible name label.

---

## Components with No Findings (Reviewed and Passed)

| Component | Notes |
|-----------|-------|
| `IdCell` | Renders value as plain text. No clipboard, no aria exposure beyond visible text. No `title` attribute. Acceptable. |
| `Pill` | Renders children as React nodes. No PHI-specific risk beyond what callers pass. No `dangerouslySetInnerHTML`. |
| `ActionsCell` | Dropdown menu with caller-defined actions. No PHI rendering. `sr-only` label is generic. |
| `StatusCell` | Not directly in scope but reviewed -- renders enum status values only. |
| `Skeleton Presets` | Render placeholder shapes only. No data. No risk. |

---

## Components Not Yet Implemented (Compliance Review Deferred)

The following Sprint 2/3 components were referenced in the review scope but do not exist in the codebase. They **cannot ship without a compliance review**:

| Component | Compliance Requirement for Implementation |
|-----------|------------------------------------------|
| **ErrorBoundary** | See Finding 5. MUST NOT render error details, stack traces, or component state. |
| **ErrorState** | See Finding 5. Generic messaging only. |
| **FormField / FormInput / FormSelect / FormTextarea** | Validation error messages must follow PHI-safe patterns (see Finding 4). Form inputs that accept PHI must not echo values in error states. Must support `autocomplete="off"` for sensitive fields. |
| **EmailCell** | If copyable, inherits Finding 1 and Finding 2. Email addresses are PHI under HIPAA when linked to a patient. Truncation must not expose full email in `title` or `aria-label`. |
| **AvatarNameCell** | Combines Avatar (Finding 7) with name + subtitle (MRN, DOB). The subtitle containing MRN or DOB is high-sensitivity PHI. Ensure subtitle does not appear in `aria-label` unless it matches visual display. |
| **File Upload** | Must validate MIME types server-side (not just client-side). Must enforce max file size. Must NOT auto-upload to any external service without explicit user action. Uploaded file names may contain PHI -- must not be logged or displayed in toasts. Must support only HTTPS upload endpoints. Files containing PHI must be encrypted in transit (TLS 1.2+). |
| **Empty State Presets** | Low risk if they display only static copy. Must not include patient counts or identifying information in empty state messages. |

---

## Checklist Summary

| Category | Items Reviewed | Passed | Failed | N/A |
|----------|---------------|--------|--------|-----|
| HIPAA Data Handling | 5 | 2 | 2 | 1 |
| PHI Exposure Review | 8 | 3 | 5 | 0 |
| Access Control | 4 | 2 | 0 | 2 |
| Audit Logging | 5 | 0 | 0 | 5 |
| Consent Flows | 4 | 0 | 0 | 4 |
| BAA Requirements | 3 | 3 | 0 | 0 |
| Encryption | 4 | 2 | 1 | 1 |
| Patient-Facing Display | 5 | 2 | 2 | 1 |
| XSS / Injection | 3 | 3 | 0 | 0 |
| **Totals** | **41** | **17** | **10** | **14** |

**Note on N/A items:** Audit logging, consent flows, and some access control items are application-layer concerns that fall outside the scope of a UI component library. These are not applicable at this layer but MUST be addressed in the consuming application's architecture review.

**Note on BAA:** The design system itself does not transmit data to third-party services. Sonner (toast library) is a client-side rendering library with no data exfiltration. No BAA concern at this layer.

---

## Overall Assessment

The TruCare Design System Sprint 2/3 components have a **mixed compliance posture**. The positive: no `dangerouslySetInnerHTML` usage was found (eliminating direct XSS), React's default escaping is in effect, and the component architecture is generally sound. The codebase does not transmit PHI to external services.

The primary risks concentrate in two areas:

1. **PHI leakage through accessibility attributes and DOM metadata.** The `Copyable` component's `aria-label` exposes the full unmasked value in the DOM and to screen readers. The `DateCell` `title` attribute exposes full-precision timestamps. The `Avatar` aria-label exposes names/emails beyond visual display in some contexts. These are not theoretical -- they are present in the current source code and will surface real PHI when these components are used with patient data.

2. **Clipboard as an uncontrolled PHI vector.** The copy-to-clipboard utility writes sensitive values to a shared OS resource with no expiration. In a healthcare setting where workstations may be shared, clipboard managers may be running, and screen-sharing is common, this is a concrete PHI exposure channel.

3. **Missing components.** ErrorBoundary, ErrorState, and several Sprint 3 components are not yet implemented. The ErrorBoundary is particularly urgent -- without it, unhandled exceptions in PHI-displaying components will surface patient data in React's development error overlay, and potentially in production error reporting.

---

## Remediation Requirements (Ordered by Priority)

1. **[CRITICAL] Fix `Copyable` aria-label** -- Replace `aria-label={`Copy ${value}`}` with a generic label or configurable prop. No PHI in DOM attributes.

2. **[CRITICAL] Add clipboard auto-clear** -- Implement `clearAfterMs` in `copyToClipboard()`. Add a `sensitive` prop to `Copyable` that enables auto-clear and documents the PHI handling expectation.

3. **[HIGH] Implement ErrorBoundary** with PHI-safe fallback UI. No error details, no stack traces, no component state in rendered output. Re-submit for compliance review.

4. **[HIGH] Add PHI-safe messaging documentation and dev-mode guards** to toast helpers and `FieldError`. Document as binding compliance constraints.

5. **[MEDIUM] Make `DateCell` title attribute configurable** with a default that does not expose full ISO timestamps.

6. **[MEDIUM] Add `ariaLabel` override prop to `Avatar`** for contexts where visual display is limited.

7. **[DEFERRED] Submit ErrorState, FormField/Input/Select/Textarea, EmailCell, AvatarNameCell, and FileUpload** for compliance review once implemented. These components MUST NOT ship to production without a passing review.

---

## Re-Review Requirement

This review returns a **FAIL** status. The artifact owner must remediate Findings 1-4 and re-submit. Findings 5-7 require implementation/changes before the affected components can be used in production with patient data.

No override is available for this gate. HIPAA compliance is not negotiable.

---

[WARNING: Compliance knowledge base files at `~/.claude/trucare-os/knowledge/compliance/hipaa-checklist.md` and `~/.claude/trucare-os/knowledge/compliance/phi-handling.md` were not found or not accessible. Review was conducted against baseline HIPAA requirements (45 CFR Parts 160 and 164). Organization-specific PHI handling policies could not be verified.]
