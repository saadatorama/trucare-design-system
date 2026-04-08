import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { FormField } from "./form-field"

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  description?: string
  required?: boolean
  info?: string
  /** When true, sets autocomplete="off" and data-lpignore="true" to prevent browsers/extensions from storing PHI. */
  sensitive?: boolean
}

/**
 * Composed form input: FormField + Input.
 * When error is truthy, the input border turns destructive.
 *
 * Usage:
 *   <FormInput label="NPI" required error={errors.npi} placeholder="10-digit NPI" />
 */
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, description, required, info, sensitive, className, id, ...inputProps }, ref) => {
    const fieldId = id ?? React.useId()

    return (
      <FormField
        label={label}
        error={error}
        description={description}
        required={required}
        info={info}
        htmlFor={fieldId}
        className={className}
      >
        <Input
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          autoComplete={sensitive ? "off" : inputProps.autoComplete}
          data-lpignore={sensitive ? "true" : undefined}
          data-phi={sensitive ? "true" : undefined}
          className={cn(
            error &&
              "border-destructive focus-visible:ring-destructive"
          )}
          {...inputProps}
        />
      </FormField>
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }
