import type { ReactNode } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface StepDefinition {
  label: string
  description?: string
}

export interface StepperLayoutProps {
  steps: StepDefinition[]
  currentStep: number
  children: ReactNode
  onNext?: () => void
  onBack?: () => void
  isNextDisabled?: boolean
  isLoading?: boolean
  /** Custom label for the next button. On the last step, defaults to "Submit". */
  nextLabel?: string
  backLabel?: string
  className?: string
}

/**
 * Multi-step wizard layout with horizontal step indicator.
 *
 * Usage:
 *   <StepperLayout
 *     steps={[
 *       { label: "Demographics" },
 *       { label: "Insurance", description: "Primary & secondary" },
 *       { label: "Consent" },
 *     ]}
 *     currentStep={1}
 *     onNext={handleNext}
 *     onBack={handleBack}
 *   >
 *     <InsuranceForm />
 *   </StepperLayout>
 */
export function StepperLayout({
  steps,
  currentStep,
  children,
  onNext,
  onBack,
  isNextDisabled = false,
  isLoading = false,
  nextLabel,
  backLabel = "Back",
  className,
}: StepperLayoutProps) {
  const isLastStep = currentStep === steps.length - 1
  const resolvedNextLabel = nextLabel ?? (isLastStep ? "Submit" : "Continue")

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Step indicator */}
      <nav aria-label="Progress" className="mb-6">
        <ol className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isActive = index === currentStep
            const isFuture = index > currentStep
            const isLast = index === steps.length - 1

            return (
              <li
                key={index}
                className={cn("flex items-center", !isLast && "flex-1")}
              >
                {/* Step circle */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                      isCompleted && "bg-primary text-primary-foreground",
                      isActive && "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                      isFuture && "border-2 border-muted-foreground/30 text-muted-foreground"
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-center max-w-[80px]",
                      isActive ? "text-[13px] font-semibold text-foreground" : "text-[11px] text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 mt-[-16px]",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step content */}
      <div className="flex-1">{children}</div>

      {/* Footer with navigation buttons */}
      {(onBack || onNext) && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          {onBack && currentStep > 0 ? (
            <Button variant="outline" size="md" onClick={onBack} disabled={isLoading}>
              {backLabel}
            </Button>
          ) : (
            <div />
          )}
          {onNext && (
            <Button
              size="md"
              onClick={onNext}
              disabled={isNextDisabled}
              isLoading={isLoading}
            >
              {resolvedNextLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
