/**
 * Extract design system CSS tokens for library distribution.
 *
 * Copies src/styles/index.css → dist/styles.css with the
 * `@import "tailwindcss"` line stripped (consumers bring their own).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcPath = resolve(__dirname, "../src/styles/index.css")
const distPath = resolve(__dirname, "../dist/styles.css")

mkdirSync(dirname(distPath), { recursive: true })

let css = readFileSync(srcPath, "utf-8")

// Strip the tailwindcss import — consumers provide their own
css = css.replace(/^@import\s+["']tailwindcss["'];?\s*\n?/m, "")

// Add header comment
const header = `/**
 * TruCare Design System — Token Stylesheet
 *
 * Usage in consuming app:
 *   @import "@trucare/ui/styles.css";
 *   @import "tailwindcss";
 *
 * This file contains:
 * - @font-face declarations (self-hosted Geist fonts)
 * - @theme {} tokens for Tailwind v4
 * - :root CSS variables (light mode)
 * - .dark CSS variables (dark mode)
 * - Base styles, keyframes, print styles, reduced-motion
 */
`

writeFileSync(distPath, header + css)
console.log("✓ dist/styles.css extracted")
