import {
  ClipboardList,
  Users,
  Search,
  FileText,
  Activity,
  Plus,
  Upload,
  CreditCard,
  CheckCircle2,
} from "lucide-react"
import { EmptyState } from "@/components/design-system/empty-state"

export function NoClaims({ onCreateClaim }: { onCreateClaim?: () => void }) {
  return (
    <EmptyState
      icon={<ClipboardList />}
      title="No claims yet"
      description="Claims you create or import will appear here."
      action={
        onCreateClaim
          ? { label: "Create Claim", onClick: onCreateClaim, icon: <Plus /> }
          : undefined
      }
    />
  )
}

export function NoPatients({ onAddPatient }: { onAddPatient?: () => void }) {
  return (
    <EmptyState
      icon={<Users />}
      title="No patients found"
      description="Add a patient to get started."
      action={
        onAddPatient
          ? { label: "Add Patient", onClick: onAddPatient, icon: <Plus /> }
          : undefined
      }
    />
  )
}

export function NoResults({
  onClearFilters,
}: {
  onClearFilters?: () => void
}) {
  return (
    <EmptyState
      icon={<Search />}
      title="No results match your filters"
      description="Try adjusting your search or filter criteria."
      action={
        onClearFilters
          ? { label: "Clear Filters", onClick: onClearFilters }
          : undefined
      }
    />
  )
}

export function NoDocuments({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={<FileText />}
      title="No documents uploaded"
      description="Upload documents to attach them to this record."
      action={
        onUpload
          ? { label: "Upload Document", onClick: onUpload, icon: <Upload /> }
          : undefined
      }
    />
  )
}

export function NoActivity() {
  return (
    <EmptyState
      icon={<Activity />}
      title="No recent activity"
      description="Activity for this record will appear here."
    />
  )
}

export function NoPayments() {
  return (
    <EmptyState
      icon={<CreditCard />}
      title="No payments posted"
      description="Payments from ERA processing or manual entry will appear here."
    />
  )
}

export function NoDenials() {
  return (
    <EmptyState
      icon={<CheckCircle2 />}
      title="No denials"
      description="All claims processed successfully. No denials to review."
    />
  )
}
