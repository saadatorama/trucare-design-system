import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FormField } from "./form-field"

export interface FormCheckboxGroupProps {
  label: string
  options: { label: string; value: string }[]
  value: string[]
  onChange: (value: string[]) => void
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
 * Composed form checkbox group: FormField + multiple Checkboxes.
 *
 * Usage:
 *   <FormCheckboxGroup
 *     label="Modifiers"
 *     options={[
 *       { label: "25 - Significant E/M", value: "25" },
 *       { label: "59 - Distinct Procedure", value: "59" },
 *     ]}
 *     value={modifiers}
 *     onChange={setModifiers}
 *   />
 */
export function FormCheckboxGroup({
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
}: FormCheckboxGroupProps) {
  const groupId = React.useId()

  const handleToggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  return (
    <FormField
      label={label}
      error={error}
      description={description}
      required={required}
      info={info}
      className={className}
    >
      <div
        role="group"
        aria-label={label}
        className={cn(
          "flex gap-3",
          direction === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        {options.map((option) => {
          const itemId = `${groupId}-${option.value}`
          return (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={itemId}
                checked={value.includes(option.value)}
                onCheckedChange={(checked) =>
                  handleToggle(option.value, checked === true)
                }
                disabled={disabled}
                aria-invalid={!!error}
              />
              <Label
                htmlFor={itemId}
                className="text-[13px] font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          )
        })}
      </div>
    </FormField>
  )
}
