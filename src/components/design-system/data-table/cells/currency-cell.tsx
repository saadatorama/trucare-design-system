export interface CurrencyCellProps {
  value: number
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function CurrencyCell({ value }: CurrencyCellProps) {
  return (
    <span className="text-right font-mono text-[13px] tabular-nums">
      {formatter.format(value)}
    </span>
  )
}
