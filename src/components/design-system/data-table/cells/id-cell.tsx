export interface IdCellProps {
  value: string
}

export function IdCell({ value }: IdCellProps) {
  return <span className="font-mono text-[13px]">{value}</span>
}
