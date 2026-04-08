import {
  StatusBadge,
  EligibilityBadge,
  type ClaimStatus,
  type EligibilityStatus,
} from "@/components/design-system/status-badge"

export interface StatusCellProps {
  status: ClaimStatus
}

export function StatusCell({ status }: StatusCellProps) {
  return <StatusBadge status={status} size="sm" dot />
}

export interface EligibilityCellProps {
  status: EligibilityStatus
}

export function EligibilityCell({ status }: EligibilityCellProps) {
  return <EligibilityBadge status={status} size="sm" dot />
}
