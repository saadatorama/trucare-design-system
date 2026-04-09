/**
 * TruCare Design System — Master Barrel Export
 *
 * Import design system components from this single entry point:
 *   import { StatusBadge, DataTable, AppShell } from "@/components/design-system"
 */

// ---------------------------------------------------------------------------
// Sprint 1 — Core display components
// ---------------------------------------------------------------------------
export { Copyable } from "./copyable"
export type { CopyableProps } from "./copyable"

export { Avatar } from "./avatar"
export type { AvatarProps } from "./avatar"

export { Pill } from "./pill"
export type { PillProps } from "./pill"

export { StatusBadge, EligibilityBadge } from "./status-badge"
export type { StatusBadgeProps, EligibilityBadgeProps, ClaimStatus, EligibilityStatus } from "./status-badge"
export { claimStatusLabels, eligibilityStatusLabels, statusLabels } from "./status-badge"

export { MetricCard } from "./metric-card"
export type { MetricCardProps } from "./metric-card"

export { FilterBar } from "./filter-bar"
export type { FilterBarProps, FilterDefinition, FilterOption } from "./filter-bar"

// ---------------------------------------------------------------------------
// Sprint 2 — Feedback, form primitives, error handling
// ---------------------------------------------------------------------------
export { TruCareToastProvider } from "./toast-provider"

export { InfoTooltip } from "./info-tooltip"

export { Skeleton } from "./skeleton"
export type { SkeletonProps } from "./skeleton"

export { MetricCardSkeleton, TableRowSkeleton, FormFieldSkeleton } from "./skeleton-presets"

export { FieldError } from "./field-error"
export type { FieldErrorProps } from "./field-error"

export { ErrorBoundary } from "./error-boundary"

export { ErrorState } from "./error-state"
export type { ErrorStateProps } from "./error-state"

export { FormField } from "./form-field"
export type { FormFieldProps } from "./form-field"

export { FormInput } from "./form-input"
export type { FormInputProps } from "./form-input"

export { FormSelect } from "./form-select"
export type { FormSelectProps } from "./form-select"

export { FormTextarea } from "./form-textarea"
export type { FormTextareaProps } from "./form-textarea"

// ---------------------------------------------------------------------------
// Sprint 3 — File upload, empty states
// ---------------------------------------------------------------------------
export { FileUpload } from "./file-upload"
export type { FileUploadProps } from "./file-upload"

export { FileUploadItem } from "./file-upload-item"
export type { FileUploadItemProps } from "./file-upload-item"

export { EmptyState } from "./empty-state"
export type { EmptyStateProps } from "./empty-state"

export { NoClaims, NoPatients, NoResults, NoDocuments, NoActivity, NoPayments, NoDenials } from "./empty-state-presets"

// ---------------------------------------------------------------------------
// Sprint 4 — App shell, navigation, detail views
// ---------------------------------------------------------------------------
export { AppShell } from "./app-shell"
export type { AppShellProps } from "./app-shell"

export { SidebarNav } from "./sidebar-nav"
export type { SidebarNavProps, NavItem, NavGroup } from "./sidebar-nav"

export { AppHeader } from "./app-header"
export type { AppHeaderProps } from "./app-header"

export { AccountDropdown } from "./account-dropdown"
export type { AccountDropdownProps } from "./account-dropdown"

export { DetailPanel } from "./detail-panel"
export type { DetailPanelProps } from "./detail-panel"

export { DetailSection } from "./detail-section"
export type { DetailSectionProps } from "./detail-section"

export { DetailRow } from "./detail-row"
export type { DetailRowProps } from "./detail-row"

// ---------------------------------------------------------------------------
// Sprint 5 — Fixes, compliance, new P0 components
// ---------------------------------------------------------------------------
export { ConfirmDialog } from "./confirm-dialog"
export type { ConfirmDialogProps } from "./confirm-dialog"

export { Banner } from "./banner"
export type { BannerProps } from "./banner"

export { Breadcrumb } from "./breadcrumb"
export type { BreadcrumbProps, BreadcrumbItem } from "./breadcrumb"

export { MaskedValue, maskSSN, maskDOB, maskMRN } from "./masked-value"
export type { MaskedValueProps } from "./masked-value"

export { FormCheckboxGroup } from "./form-checkbox-group"
export type { FormCheckboxGroupProps } from "./form-checkbox-group"

export { FormRadioGroup } from "./form-radio-group"
export type { FormRadioGroupProps } from "./form-radio-group"

export { FormDatePicker } from "./form-date-picker"
export type { FormDatePickerProps } from "./form-date-picker"

export { Combobox, FormCombobox } from "./combobox"
export type { ComboboxProps, ComboboxOption, FormComboboxProps } from "./combobox"

// ---------------------------------------------------------------------------
// Sprint 6 — Workflow patterns, healthcare components
// ---------------------------------------------------------------------------
export { ActivityTimeline } from "./activity-timeline"
export type { ActivityTimelineProps, TimelineItem } from "./activity-timeline"

export { StepperLayout } from "./stepper-layout"
export type { StepperLayoutProps, StepDefinition } from "./stepper-layout"

export { SplitView } from "./split-view"
export type { SplitViewProps } from "./split-view"

export { DeadlineIndicator } from "./deadline-indicator"
export type { DeadlineIndicatorProps } from "./deadline-indicator"

export { FormSection } from "./form-section"
export type { FormSectionProps } from "./form-section"

export { ReasonCodeDisplay } from "./reason-code-display"
export type { ReasonCodeDisplayProps } from "./reason-code-display"

export { FinancialSummary } from "./financial-summary"
export type { FinancialSummaryProps, FinancialLineItem } from "./financial-summary"

// ---------------------------------------------------------------------------
// Data Table (re-export entire sub-module)
// ---------------------------------------------------------------------------
export * from "./data-table/index"
