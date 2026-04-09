import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export interface FieldErrorProps {
  /**
   * The validation error message to display.
   *
   * COMPLIANCE: Must be a static validation label only (e.g. "NPI must be 10 digits").
   * Never pass raw API error responses or echoed user input, which may contain PHI.
   */
  message?: string
  className?: string
}

/**
 * Inline field validation error.
 * Renders nothing when message is falsy.
 *
 * COMPLIANCE: The `message` prop must contain static validation labels only —
 * never raw API errors or echoed user input that could contain PHI.
 *
 * Usage:
 *   <FieldError message={errors.npi?.message} />
 */
export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null

  return (
    <p
      role="alert"
      className={cn("flex items-center gap-1 text-xs text-destructive", className)}
    >
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  )
}
