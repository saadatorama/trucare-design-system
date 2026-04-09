import * as React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FormField } from "./form-field"

export interface FormRadioGroupProps {
  label: string
  options: { label: string; value: string }[]
  value?: string
  onChange: (value: string) => void
  error?: string
  description?: string
  required?: boolean
  info?: string
  disabled?: boolean
  /** Layout direction. Default "vertical". */
  direction?: "vertical" | "horizontal"
  className?: string
}

/**
 * Composed form radio group: FormField + RadioGroup.
 *
 * Usage:
 *   <FormRadioGroup
 *     label="Relationship to Insured"
 *     options={[
 *       { label: "Self", value: "self" },
 *       { label: "Spouse", value: "spouse" },
 *       { label: "Child", value: "child" },
 *       { label: "Other", value: "other" },
 *     ]}
 *     value={relationship}
 *     onChange={setRelationship}
 *   />
 */
export function FormRadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  description,
  required,
  info,
  disabled,
  direction = "vertical",
  className,
}: FormRadioGroupProps) {
  const groupId = React.useId()

  return (
    <FormField
      label={label}
      error={error}
      description={description}
      required={required}
      info={info}
      className={className}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        aria-label={label}
        aria-invalid={!!error}
        className={cn(
          direction === "horizontal" && "flex flex-row flex-wrap gap-4"
        )}
      >
        {options.map((option) => {
          const itemId = `${groupId}-${option.value}`
          return (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={itemId} />
              <Label
                htmlFor={itemId}
                className="text-[13px] font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </FormField>
  )
}
