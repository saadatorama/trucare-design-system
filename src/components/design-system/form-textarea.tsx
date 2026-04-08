import * as React from "react"

import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "./form-field"

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  description?: string
  required?: boolean
  info?: string
}

/**
 * Composed form textarea: FormField + Textarea.
 * When error is truthy, the textarea border turns destructive.
 *
 * Usage:
 *   <FormTextarea label="Notes" error={errors.notes} rows={4} />
 */
const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, description, required, info, className, id, ...textareaProps }, ref) => {
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
        <Textarea
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(
            error &&
              "border-destructive focus-visible:ring-destructive"
          )}
          {...textareaProps}
        />
      </FormField>
    )
  }
)
FormTextarea.displayName = "FormTextarea"

export { FormTextarea }
