import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField } from "./form-field"

export interface FormSelectProps {
  label: string
  error?: string
  description?: string
  required?: boolean
  info?: string
  placeholder?: string
  options: { label: string; value: string }[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

/**
 * Composed form select: FormField + Select.
 *
 * Usage:
 *   <FormSelect
 *     label="Payer"
 *     required
 *     placeholder="Select payer"
 *     options={[{ label: "Aetna", value: "aetna" }, { label: "BCBS", value: "bcbs" }]}
 *     value={payer}
 *     onValueChange={setPayer}
 *     error={errors.payer}
 *   />
 */
export function FormSelect({
  label,
  error,
  description,
  required,
  info,
  placeholder,
  options,
  value,
  onValueChange,
  disabled,
  className,
}: FormSelectProps) {
  const fieldId = React.useId()

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
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={fieldId}
          aria-invalid={!!error}
          className={cn(
            error &&
              "border-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
