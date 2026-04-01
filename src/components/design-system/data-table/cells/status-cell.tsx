import {
  StatusBadge,
  type ClaimStatus,
} from "@/components/design-system/status-badge"

export interface StatusCellProps {
  status: ClaimStatus
}

export function StatusCell({ status }: StatusCellProps) {
  return <StatusBadge status={status} size="sm" dot />
}
