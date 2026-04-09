import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Copyable } from "./copyable"

export interface MaskedValueProps {
  /** The full unmasked value (e.g., "123-45-6789") */
  value: string
  /** The masked display value (e.g., "***-**-6789") */
  maskedValue: string
  /** Allow user to toggle reveal. Default true. */
  revealable?: boolean
  /** When true, marks as PHI for clipboard auto-clear and print redaction. */
  sensitive?: boolean
  /** When true, wraps in Copyable for one-click copy. */
  copyable?: boolean
  /** Use monospace font. Default false. */
  mono?: boolean
  /** Auto-hide revealed value after this many ms. Default 10000 (10s). 0 to disable. */
  autoHideMs?: number
  /** Audit callback fired when the value is revealed. Use for PHI access logging. */
  onReveal?: (value: string) => void
  /** Audit callback fired when the value is copied. */
  onCopy?: (value: string) => void
  className?: string
}

// ─── Presets ───────────────────────────────────────
/** Mask SSN to ***-**-{last4} */
export function maskSSN(ssn: string): string {
  const digits = ssn.replace(/\D/g, "")
  if (digits.length < 4) return "***-**-****"
  return `***-**-${digits.slice(-4)}`
}

/** Mask DOB to starred-out month/day with visible year */
export function maskDOB(dob: string): string {
  // Expects formats like "01/15/1990", "1990-01-15", etc.
  const match = dob.match(/(\d{4})/)
  return match ? `**/**/${match[1]}` : "**/**/****"
}

/** Mask MRN to MRN-****{last4} */
export function maskMRN(mrn: string): string {
  const clean = mrn.replace(/^MRN-?/i, "")
  if (clean.length < 4) return "MRN-****"
  return `MRN-****${clean.slice(-4)}`
}

/**
 * PHI-safe masked value display with optional reveal toggle.
 *
 * Shows masked by default. Eye icon toggles reveal.
 * Auto-re-masks after timeout. Supports copy and audit callbacks.
 *
 * Usage:
 *   <MaskedValue
 *     value="123-45-6789"
 *     maskedValue={maskSSN("123-45-6789")}
 *     sensitive
 *     copyable
 *     mono
 *     onReveal={(v) => auditLog("ssn_revealed", v)}
 *   />
 */
export function MaskedValue({
  value,
  maskedValue,
  revealable = true,
  sensitive = false,
  copyable = false,
  mono = false,
  autoHideMs = 10_000,
  onReveal,
  onCopy,
  className,
}: MaskedValueProps) {
  const [revealed, setRevealed] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleReveal = () => {
    if (revealed) {
      setRevealed(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    setRevealed(true)
    onReveal?.(value)

    if (autoHideMs > 0) {
      timerRef.current = setTimeout(() => setRevealed(false), autoHideMs)
    }
  }

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const displayValue = revealed ? value : maskedValue

  const valueEl = (
    <span
      className={cn(
        "text-[13px]",
        mono && "font-mono tabular-nums",
        className
      )}
      data-phi={sensitive ? "true" : undefined}
    >
      {displayValue}
    </span>
  )

  const content = copyable ? (
    <Copyable
      value={value}
      sensitive={sensitive}
      onCopy={onCopy}
    >
      {valueEl}
    </Copyable>
  ) : (
    valueEl
  )

  return (
    <span className="inline-flex items-center gap-1.5">
      {content}
      {revealable && (
        <button
          onClick={handleReveal}
          className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label={revealed ? "Hide value" : "Reveal value"}
        >
          {revealed ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </span>
  )
}
