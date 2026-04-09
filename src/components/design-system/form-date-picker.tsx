import * as React from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormField } from "./form-field"

export interface FormDatePickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
  error?: string
  description?: string
  required?: boolean
  info?: string
  /** Minimum selectable date (YYYY-MM-DD) */
  minDate?: string
  /** Maximum selectable date (YYYY-MM-DD) */
  maxDate?: string
  placeholder?: string
  disabled?: boolean
  /** When true, sets autocomplete="off" for PHI dates (DOB). */
  sensitive?: boolean
  className?: string
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

/**
 * Date picker with inline calendar popover. Wraps FormField for label/error/info consistency.
 *
 * Usage:
 *   <FormDatePicker
 *     label="Date of Birth"
 *     value={dob}
 *     onChange={setDob}
 *     sensitive
 *     error={errors.dob}
 *   />
 */
export function FormDatePicker({
  label,
  value,
  onChange,
  error,
  description,
  required,
  info,
  minDate,
  maxDate,
  placeholder = "YYYY-MM-DD",
  disabled,
  sensitive,
  className,
}: FormDatePickerProps) {
  const fieldId = React.useId()
  const [open, setOpen] = React.useState(false)

  // Calendar state
  const today = new Date()
  const selectedDate = value ? new Date(value + "T00:00:00") : null
  const [viewYear, setViewYear] = React.useState(selectedDate?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = React.useState(selectedDate?.getMonth() ?? today.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const minD = minDate ? new Date(minDate + "T00:00:00") : null
  const maxD = maxDate ? new Date(maxDate + "T00:00:00") : null

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    if (minD && d < minD) return true
    if (maxD && d > maxD) return true
    return false
  }

  const handleSelectDay = (day: number) => {
    const y = viewYear
    const m = String(viewMonth + 1).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    onChange(`${y}-${m}-${d}`)
    setOpen(false)
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    )
  }

  const isToday = (day: number) => {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    )
  }

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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id={fieldId}
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={!!error}
              autoComplete={sensitive ? "off" : undefined}
              data-lpignore={sensitive ? "true" : undefined}
              data-phi={sensitive ? "true" : undefined}
              className={cn(
                "pr-9",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={disabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open calendar"
              tabIndex={-1}
            >
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          {/* Month/Year header */}
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon-xs" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-[13px] font-medium">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <Button variant="ghost" size="icon-xs" onClick={nextMonth} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0">
            {DAYS.map((d) => (
              <div key={d} className="h-8 w-8 flex items-center justify-center text-[11px] font-medium text-muted-foreground">
                {d}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="h-8 w-8" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const disabled = isDisabled(day)
              const selected = isSelected(day)
              const todayMark = isToday(day)

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "h-8 w-8 rounded-md text-[13px] transition-colors",
                    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "bg-primary text-primary-foreground hover:bg-primary",
                    !selected && todayMark && "border border-primary text-primary",
                    disabled && "opacity-30 pointer-events-none"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  )
}
