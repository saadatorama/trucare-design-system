# Healthcare Domain Validation Report

**Artifact:** StatusBadge component (`status-badge.tsx`) + status color tokens (`index.css`)
**Mode:** Validation
**Date:** 2026-04-03
**Reviewer:** Healthcare Domain Gate (Agent OS)

[WARNING: Knowledge base files `payer-rules.md`, `denial-codes.md`, `cms-guidelines.md`, `eligibility-logic.md`, `claims-lifecycle.md` not found. Domain claims validated against parametric knowledge only. External validation recommended for: payer-specific status mappings, denial code categorization completeness, and CMS-specific adjudication status terminology.]

---

## 1. RCM Logic Assessment

**Status: FAIL** (3 hard blocks)

### Finding 1 -- Missing "Accepted" / "Acknowledged" status

- **Severity:** HARD BLOCK
- **Evidence:** After a claim is submitted electronically, the clearinghouse or payer returns a 277CA (Claim Acknowledgment) indicating the claim was accepted for adjudication. This is distinct from "submitted" (the practice sent it) and "in-review" (the payer is actively adjudicating). In real EDI workflows, a claim sits in an "accepted" state for days or weeks between submission and adjudication. Without this status, billing staff cannot distinguish between "we sent the claim and have no response yet" (submitted) and "the payer confirmed receipt and it is in their queue" (accepted). This distinction drives follow-up workflows: a claim stuck in "submitted" for 48+ hours needs a clearinghouse investigation, while a claim in "accepted" is working as expected.
- **Required correction:** Add `accepted` status. Recommended token color: same blue family as `submitted` but with distinguishable hue shift (e.g., blue-teal) to show forward progression from `submitted`.

### Finding 2 -- Missing "Partially Paid" status

- **Severity:** HARD BLOCK
- **Evidence:** Partial payment is one of the most common real-world claim outcomes and it is not a variant of "paid." When a payer remits less than the billed amount, the remaining balance triggers fundamentally different workflows depending on the reason: (a) contractual adjustment -- write off the difference, (b) patient responsibility -- transfer to patient balance and generate statement, (c) secondary insurance -- submit to next payer, (d) underpayment -- appeal or negotiate with payer. A claim showing as "paid" when $40 of a $150 charge was remitted is operationally misleading. Billing staff reviewing an A/R aging report need to see partial payments as a distinct category because they require action, while fully paid claims do not.
- **Required correction:** Add `partially-paid` status. Recommended token color: a blended or muted variant of the green "paid" family -- e.g., green with reduced chroma or shifted toward yellow-green -- to visually communicate "money received but not resolved."

### Finding 3 -- Missing "Voided" / "Cancelled" status

- **Severity:** HARD BLOCK
- **Evidence:** Claims get voided or cancelled for legitimate reasons: duplicate submission, wrong patient, wrong insurance on file discovered after submission, provider correction before adjudication. A voided claim is not "denied" (the payer did not reject it) and it is not any other existing status. Without a void/cancel status, these claims pollute reporting. They either show as perpetually "submitted" (inflating pending A/R) or must be force-fit into "denied" (inflating denial rates and triggering false appeal workflows). CMS-1500 and UB-04 both support claim frequency codes for void (7) and replacement (8). The system must represent these.
- **Required correction:** Add `voided` status. Recommended token color: neutral gray (desaturated, low chroma) to visually communicate "this claim is no longer active" without implying positive or negative outcome.

### Finding 4 -- "Paid" vs. "Remitted" terminology

- **Severity:** ADVISORY
- **Evidence:** In strict RCM terminology, the payer "remits" (sends an ERA/835 with payment information) rather than "pays." However, "paid" is universally understood by front-office and billing staff at practices of all sizes. Using "remitted" would be more technically precise but would add cognitive load for non-specialist users. The real-world convention in practice management systems (Athena, eClinicalWorks, Kareo, AdvancedMD) is to use "paid."
- **Recommendation:** Keep "paid." The terminology is operationally correct and matches user expectations. If TruCare later serves larger health systems with dedicated RCM teams, consider an optional "show technical labels" setting, but this is not required now.

### Finding 5 -- "Eligible" and "Ineligible" are pre-claim statuses mixed with claim lifecycle statuses

- **Severity:** ADVISORY
- **Evidence:** "Eligible" and "ineligible" are patient-coverage verification statuses (270/271 eligibility transaction). They describe the patient's insurance status, not a claim's position in the billing lifecycle. Mixing them into the same `ClaimStatus` type creates a domain model ambiguity: is a "claim" eligible, or is the "patient's coverage" eligible? In practice, eligibility is checked before a claim exists. A patient can be eligible but their claim still gets denied. The current model conflates two distinct RCM subdomains. This is not a hard block because the current 8-status set can function for an MVP/v1 where the same UI component renders both eligibility checks and claims. But it will become a structural problem when the system needs to show a patient's eligibility status alongside their claim status on the same screen (e.g., a patient detail view showing "Coverage: Eligible" and "Claim #1234: Denied").
- **Recommendation:** Plan for a future separation into two enums: `CoverageStatus` (eligible, ineligible, pending-verification, inactive, coordination-required) and `ClaimStatus` (the claim lifecycle statuses). For now, document in a code comment that these are intentionally colocated for v1 and will be split. This prevents a future developer from treating the current union as the permanent domain model.

### Finding 6 -- "Appealed" status lacks sub-state granularity

- **Severity:** ADVISORY
- **Evidence:** An appeal is a multi-step process with meaningfully different sub-states: appeal submitted, appeal under review, appeal upheld (denial stands), appeal overturned (claim reprocessed). Knowing which sub-state an appeal is in determines the billing team's next action: follow up with the payer, prepare a second-level appeal, or close the case. The current single "appealed" status covers only "appeal submitted." When the appeal is overturned and the claim is reprocessed, does it go back to "in-review"? When the appeal is upheld, does it go back to "denied"? The state transitions become ambiguous.
- **Recommendation:** For v1, "appealed" is sufficient. Document the expected state transitions: appealed -> denied (appeal upheld), appealed -> paid/partially-paid (appeal overturned and reprocessed). Plan for sub-statuses in v2 if TruCare builds a dedicated denial management module.

### Finding 7 -- Color token aliasing creates ambiguity

- **Severity:** ADVISORY
- **Evidence:** The current implementation maps `paid` to the same tokens as `eligible`, and `ineligible` to the same tokens as `denied`. While this reduces token count, it creates a visual ambiguity: a user scanning a claims table cannot distinguish "eligible" from "paid" or "ineligible" from "denied" by color alone. They must read the label. In a high-volume billing environment where a biller is scanning hundreds of rows, color is the primary signal -- label is secondary. "Eligible" (pre-claim) and "paid" (post-adjudication resolved) are fundamentally different workflow states that should be visually distinguishable.
- **Recommendation:** Give `paid` its own green variant (deeper or more saturated green to signal "resolved/complete") distinct from `eligible` (lighter green to signal "good to go, but work not done"). Similarly, `ineligible` should get a distinct color from `denied` -- consider a warm gray or muted orange to signal "cannot proceed" versus the red of "rejected."

---

## 2. Operational Realism Assessment

**Status: CONCERNS NOTED**

### Concern 1 -- Missing urgency/deadline visual indicator

- **Severity:** ADVISORY
- **Context:** In RCM, several statuses have time-sensitive deadlines attached. A "denied" claim has a payer-specific appeal deadline (typically 60-180 days from denial date, varies by payer -- e.g., Medicare is 120 days for a redetermination, many commercial payers are 90 days). A "submitted" claim that has not progressed has timely filing risk. The StatusBadge alone does not communicate urgency. A "denied" badge on day 1 and day 89 look identical, but the second one is about to become unappealable.
- **Recommendation:** The StatusBadge component should support an optional `urgent` or `warning` visual modifier (e.g., a subtle pulsing dot, border color shift to warning, or an icon overlay). This is a Design Lead decision on the UX treatment, but the domain requirement is: the component must be capable of expressing "this status requires time-sensitive action." The Pill component (soft tags) could also carry deadline-related tags like "Appeal Due: 15 days" or "Timely Filing: 30 days."

### Concern 2 -- Batch workflow readability at volume

- **Severity:** ADVISORY
- **Context:** Billing staff work in batch mode. They review claims tables with 50-200+ rows at a time, filtering by status. The current badge sizes (h-5 / h-6) and text sizes (11px / 12px) are appropriate for density, but with 8+ statuses (soon 11+ with recommended additions), the color palette must maintain distinguishability when viewed as a column of badges in a table. Adjacent rows with "submitted" (blue), "in-review" (purple), and the recommended "accepted" (blue-teal) must remain visually distinct at a glance. This is particularly important given TruCare's decision for "comfortable-compact" density.
- **Recommendation:** When implementing the recommended new statuses, test the full palette rendered as a column of 20+ badges in the TanStack Table context at comfortable-compact density. Validate that any two statuses can be distinguished without reading labels. This is a Design Lead testing task, but the domain constraint is: color differentiation must survive batch-mode scanning.

### Concern 3 -- Status transitions are not enforced in the component

- **Severity:** ADVISORY
- **Context:** The `ClaimStatus` type allows any status to be set regardless of prior state. In the RCM domain, certain transitions are invalid: a claim cannot go from "paid" to "submitted" (without a void/resubmit), a claim cannot go from "eligible" to "denied" (it must be submitted first). While the component itself is a display primitive and should not enforce transitions (that is a data layer concern), the type system provides no documentation of valid transitions. A developer consuming this component could inadvertently render impossible states.
- **Recommendation:** Add a comment block or companion type documenting the valid state machine transitions. This does not change the component implementation but prevents misuse by other developers. Example:
  ```
  // Valid transitions:
  // eligible -> submitted
  // submitted -> accepted -> in-review -> paid | partially-paid | denied
  // denied -> appealed -> paid | partially-paid | denied
  // any -> voided
  ```

---

## 3. Pill Tag Categories (Advisory -- Non-Status Soft Tags)

For the Pill component (non-status, informational tags), the following healthcare-specific categories are operationally relevant. Organized by where they appear in practice workflows:

### Category 1: Payer / Coverage

| Tag | Example Values | Why It Matters |
|-----|---------------|----------------|
| Payer name | "Aetna", "BCBS-TX", "Medicare Part B" | Primary filter for billing staff. Different payers = different rules. |
| Plan type | "HMO", "PPO", "EPO", "POS", "Medicare Advantage" | Determines referral requirements, network restrictions, prior auth behavior. |
| Network status | "In-Network", "Out-of-Network", "Non-Par" | Directly affects reimbursement rates and patient responsibility. |
| Coverage type | "Primary", "Secondary", "Tertiary", "Workers Comp", "Auto/PIP" | Drives coordination of benefits and submission order. |

### Category 2: Clinical / Service

| Tag | Example Values | Why It Matters |
|-----|---------------|----------------|
| Service type | "Office Visit", "Telehealth", "Lab", "Imaging", "Procedure" | Determines place of service codes, modifier requirements, prior auth needs. |
| Provider | "Dr. Smith", "NP Johnson" | Associates the encounter with the rendering/billing provider. |
| Location / facility | "Main Office", "Satellite Clinic", "ASC" | Affects place of service code, facility fee vs. professional fee. |
| Referring provider | "Ref: Dr. Williams" | Required for HMO referral tracking and claim submission. |

### Category 3: Administrative / Workflow

| Tag | Example Values | Why It Matters |
|-----|---------------|----------------|
| Prior auth status | "Auth Required", "Auth Obtained", "Auth Pending", "No Auth Needed" | Prior auth is the single largest cause of preventable denials. Surfacing this as a tag prevents billing claims without required authorization. |
| Filing method | "Electronic", "Paper", "Portal" | Some payers or claim types require specific submission methods. |
| Assigned to | "Billing: Maria", "Follow-up: James" | Workflow ownership for claims requiring manual action. |
| Flag / attention | "High Balance", "Timely Filing Risk", "COB Needed", "Missing Info" | Operational exception flags that drive daily work queues. |

### Category 4: Patient Financial

| Tag | Example Values | Why It Matters |
|-----|---------------|----------------|
| Patient responsibility | "Copay: $25", "Deductible: $500 remaining" | Collected at check-in. Surfacing as a tag enables front-desk collection workflows. |
| Financial class | "Commercial", "Medicare", "Medicaid", "Self-Pay", "Charity" | Drives different billing paths, write-off rules, and collection policies. |
| Payment plan | "Payment Plan Active", "Hardship" | Prevents sending patients with active arrangements to collections. |

### Recommended Pill color mapping strategy

Do not reuse status badge colors for Pill tags. Status badges use semantic color (green = good, red = bad, yellow = attention). Pill tags should use neutral or brand-accent colors that communicate "informational label" without implying positive or negative valence. Consider:

- Payer/coverage pills: cool neutral (slate/gray family)
- Clinical/service pills: brand teal or muted blue
- Administrative pills: muted purple or neutral
- Patient financial pills: warm neutral

This keeps Pills visually distinct from StatusBadges even when they appear on the same row in a table.

---

## 4. Summary

| Category | Count |
|----------|-------|
| RCM hard blocks | 3 |
| RCM advisories | 4 |
| Operational advisories | 3 |
| **Overall** | **FAIL** (hard blocks exist) |

### Required actions before this component can be considered RCM-complete:

1. **Add `accepted` status** with distinct blue-teal tokens (HARD BLOCK)
2. **Add `partially-paid` status** with muted green tokens (HARD BLOCK)
3. **Add `voided` status** with neutral gray tokens (HARD BLOCK)

### Recommended actions (advisory, not blocking):

4. Differentiate `paid` tokens from `eligible` tokens (currently aliased to same CSS variables)
5. Differentiate `ineligible` tokens from `denied` tokens (currently aliased to same CSS variables)
6. Document valid state transitions as a code comment or companion type
7. Plan for future `CoverageStatus` / `ClaimStatus` enum separation
8. Support an optional urgency modifier on StatusBadge for deadline-sensitive statuses
9. Test full 11-status palette at comfortable-compact density in TanStack Table context

### Recommended final status enum (11 statuses):

```typescript
export type ClaimStatus =
  | "eligible"       // Pre-claim: coverage verified active
  | "ineligible"     // Pre-claim: coverage not active or not found
  | "submitted"      // Claim sent to clearinghouse/payer
  | "accepted"       // NEW: Clearinghouse/payer acknowledged receipt (277CA)
  | "in-review"      // Payer is adjudicating
  | "paid"           // Fully adjudicated, full expected payment received
  | "partially-paid" // NEW: Payment received but balance remains
  | "denied"         // Payer rejected the claim
  | "appealed"       // Denial appealed, awaiting payer re-review
  | "voided"         // NEW: Claim cancelled/voided before or after adjudication
  | "pending"        // Generic pending (for states not yet categorized)
```

### Token allocation for new statuses:

| Status | Hue Family | Rationale |
|--------|-----------|-----------|
| `accepted` | Blue-teal (~220) | Progression from `submitted` (blue ~255), distinct but related |
| `partially-paid` | Yellow-green (~130) | Between `paid` (green ~160) and `pending` (amber ~80), signals "partial resolution" |
| `voided` | Neutral gray (~250, near-zero chroma) | Communicates "inactive/terminal" without positive or negative valence |

---

*This validation must be resolved (all hard blocks addressed) before the StatusBadge component is used in any RCM workflow screen. The advisory items should be tracked and addressed before the first billing-staff-facing release.*
