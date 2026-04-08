import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/**
 * Semantic form section grouping using <fieldset>/<legend>.
 *
 * Use to visually and semantically group related fields in complex
 * healthcare forms (demographics, insurance primary, insurance secondary, etc.)
 *
 * Usage:
 *   <FormSection title="Primary Insurance">
 *     <FormInput label="Payer" ... />
 *     <FormInput label="Member ID" ... />
 *     <FormInput label="Group Number" ... />
 *   </FormSection>
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <fieldset className={cn("border-0 p-0 m-0", className)}>
      <legend className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground mb-3">
        {title}
      </legend>
      {description && (
        <p className="text-[13px] text-muted-foreground -mt-1.5 mb-3">
          {description}
        </p>
      )}
      <div className="flex flex-col gap-[var(--space-form-gap,16px)]">
        {children}
      </div>
    </fieldset>
  )
}
