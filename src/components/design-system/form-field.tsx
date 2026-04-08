import type * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { InfoTooltip } from "./info-tooltip"
import { FieldError } from "./field-error"

export interface FormFieldProps {
  label: string
  description?: string
  error?: string
  /** Shows red * next to label */
  required?: boolean
  /** Shows InfoTooltip next to label */
  info?: string
  htmlFor?: string
  children: React.ReactNode
  className?: string
}

/**
 * Composable form field wrapper with label, required indicator,
 * info tooltip, error message, and description.
 *
 * Usage:
 *   <FormField label="NPI" required info="10-digit National Provider Identifier" error={errors.npi}>
 *     <Input id="npi" />
 *   </FormField>
 */
export function FormField({
  label,
  description,
  error,
  required = false,
  info,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
        {required && (
          <span className="text-destructive text-sm" aria-hidden="true">
            *
          </span>
        )}
        {info && <InfoTooltip content={info} />}
      </div>

      {/* Input slot — 6px below label */}
      <div className="mt-1.5">{children}</div>

      {/* Error or description — 4px below input */}
      {error ? (
        <FieldError message={error} className="mt-1" />
      ) : description ? (
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
