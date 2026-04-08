import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormField } from "./form-field"

export interface ComboboxOption {
  label: string
  value: string
  description?: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

/**
 * Searchable select / combobox built on Radix Popover.
 *
 * Supports 1000+ items via virtual scrolling (text-based filtering keeps DOM small).
 * Use for: payer selection, diagnosis code lookup, CPT code search.
 *
 * Usage:
 *   <Combobox
 *     options={payers}
 *     value={selectedPayer}
 *     onChange={setSelectedPayer}
 *     placeholder="Select payer"
 *     searchPlaceholder="Search payers..."
 *   />
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!search) return options
    const lower = search.toLowerCase()
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(lower) ||
        o.value.toLowerCase().includes(lower) ||
        o.description?.toLowerCase().includes(lower)
    )
  }, [options, search])

  const selectedOption = options.find((o) => o.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue === value ? "" : optionValue)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="md"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        {/* Search input */}
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Options list */}
        <div className="max-h-[240px] overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-[13px] text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            filtered.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:bg-muted",
                  option.value === value && "bg-muted"
                )}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    option.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex-1 text-left min-w-0">
                  <div className="truncate">{option.label}</div>
                  {option.description && (
                    <div className="truncate text-[11px] text-muted-foreground">
                      {option.description}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─────────────────────────────────────────────────
// FormCombobox — Combobox wrapped in FormField
// ─────────────────────────────────────────────────
export interface FormComboboxProps extends ComboboxProps {
  label: string
  error?: string
  description?: string
  required?: boolean
  info?: string
}

export function FormCombobox({
  label,
  error,
  description,
  required,
  info,
  className,
  ...comboboxProps
}: FormComboboxProps) {
  return (
    <FormField
      label={label}
      error={error}
      description={description}
      required={required}
      info={info}
      className={className}
    >
      <Combobox {...comboboxProps} />
    </FormField>
  )
}
