---
name: trucare-design
description: Use this skill to generate well-branded interfaces and assets for TruCare, either for production or throwaway prototypes/mocks/etc. TruCare is a healthcare operations platform (credentialing + intake + revenue cycle + analytics). Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key context:
- TruCare has two distinct surfaces: a **marketing site** (large display type, violet/blue gradient heroes, stacked soft shadows) and an **admin product** (dense, max 24px type, 6px radius, border-only cards, HIPAA-compliant primitives).
- Products: **TruCred** (credentialing), **TruIntake** (eligibility/intake), **TruRev** (revenue cycle), **TruIntel** (analytics). Parent brand is **TruCare**.
- Font: **Geist** (variable). Mono is Geist Mono, used only for identifiers.
- Primary color: `#604FF8` violet. Secondary: `#095BCE` blue. Tertiary: `#22D3C1` teal.
- Tagline: "Practice Made Perfect."
- Voice: operator-to-operator, direct, sentence-case, no emoji, no exclamation marks.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out of this skill folder and create static HTML files for the user to view. Always `@import "colors_and_type.css"` first and load the Geist fonts from `./fonts/`.

If working on production code, read the rules in `README.md` (Visual Foundations, Content Fundamentals, Iconography) and the component reference patterns in `ui_kits/admin/`. The canonical component library is `@trucare/ui` on npm.

If the user invokes this skill without any other guidance, ask them:
- Which surface — marketing page, admin screen, slide, email?
- Which product (TruCred / TruIntake / TruRev / TruIntel / parent TruCare)?
- What's the specific job? (hero section, data table screen, pricing page, etc.)

Then act as an expert designer who outputs HTML artifacts or production-ready React, depending on the need. Follow the content and visual rules strictly; do not invent new colors, new type scales, or new shadow patterns.
