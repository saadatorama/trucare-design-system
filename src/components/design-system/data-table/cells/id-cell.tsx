import { Copyable } from "@/components/design-system/copyable"

export interface IdCellProps {
  value: string
}

export function IdCell({ value }: IdCellProps) {
  return (
    <Copyable value={value}>
      <span className="text-[13px] font-medium tabular-nums tracking-tight">{value}</span>
    </Copyable>
  )
}
