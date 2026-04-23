import { useState, useEffect } from "react"
import { type ColumnDef } from "@tanstack/react-table"

// Lucide Icons
import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Info,
  Moon,
  Plus,
  Search,
  Settings,
  Shield,
  Sun,
  Trash2,
  X,
  Zap,
} from "lucide-react"

// UI Primitives
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsListUnderline, TabsTriggerUnderline } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Design System Components
import { StatusBadge, EligibilityBadge, type ClaimStatus, type EligibilityStatus } from "@/components/design-system/status-badge"
import { MetricCard } from "@/components/design-system/metric-card"
import { Copyable } from "@/components/design-system/copyable"
import { Avatar } from "@/components/design-system/avatar"
import { Pill } from "@/components/design-system/pill"
import { TruCareToastProvider } from "@/components/design-system/toast-provider"
import { toast } from "@/lib/toast"
import { InfoTooltip } from "@/components/design-system/info-tooltip"
import { Skeleton } from "@/components/design-system/skeleton"
import { MetricCardSkeleton, TableRowSkeleton, FormFieldSkeleton } from "@/components/design-system/skeleton-presets"
import { FieldError } from "@/components/design-system/field-error"
import { ErrorState } from "@/components/design-system/error-state"
import { FormInput } from "@/components/design-system/form-input"
import { FormSelect } from "@/components/design-system/form-select"
import { FormTextarea } from "@/components/design-system/form-textarea"
import { EmptyState } from "@/components/design-system/empty-state"
import { NoClaims, NoPatients, NoResults } from "@/components/design-system/empty-state-presets"
import { FileUpload } from "@/components/design-system/file-upload"
import { SidebarNav } from "@/components/design-system/sidebar-nav"
import { AppHeader } from "@/components/design-system/app-header"
import { AccountDropdown } from "@/components/design-system/account-dropdown"
import { DetailPanel } from "@/components/design-system/detail-panel"
import { DetailSection } from "@/components/design-system/detail-section"
import { DetailRow } from "@/components/design-system/detail-row"
import {
  DataTable,
  DataTableColumnHeader,
  IdCell,
  CurrencyCell,
  StatusCell,
  DateCell,
  ActionsCell,
} from "@/components/design-system/data-table"
import { FilterBar, type FilterDefinition } from "@/components/design-system/filter-bar"
import { IconBrowser } from "@/components/design-system/icon-browser"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Claim {
  id: string
  patient: string
  payer: string
  amount: number
  status: ClaimStatus
  filed: string
}

const claimsData: Claim[] = [
  { id: "CLM-4521", patient: "Sarah Johnson", payer: "United Healthcare", amount: 1250.0, status: "paid", filed: "2026-03-28" },
  { id: "CLM-4522", patient: "Michael Chen", payer: "Blue Cross", amount: 890.5, status: "submitted", filed: "2026-03-29" },
  { id: "CLM-4523", patient: "Emily Rodriguez", payer: "Aetna", amount: 2100.0, status: "denied", filed: "2026-03-25" },
  { id: "CLM-4524", patient: "James Wilson", payer: "Cigna", amount: 475.0, status: "in-review", filed: "2026-03-30" },
  { id: "CLM-4525", patient: "Maria Garcia", payer: "Humana", amount: 3200.0, status: "paid", filed: "2026-03-22" },
  { id: "CLM-4526", patient: "David Kim", payer: "United Healthcare", amount: 1680.0, status: "appealed", filed: "2026-03-20" },
  { id: "CLM-4527", patient: "Lisa Thompson", payer: "Blue Cross", amount: 950.0, status: "draft", filed: "2026-03-31" },
  { id: "CLM-4528", patient: "Robert Martinez", payer: "Aetna", amount: 2750.0, status: "pending", filed: "2026-03-27" },
  { id: "CLM-4529", patient: "Jennifer Lee", payer: "Cigna", amount: 1100.0, status: "submitted", filed: "2026-03-29" },
  { id: "CLM-4530", patient: "William Davis", payer: "Humana", amount: 560.0, status: "rejected", filed: "2026-03-26" },
  { id: "CLM-4531", patient: "Amanda White", payer: "United Healthcare", amount: 1890.0, status: "paid", filed: "2026-03-24" },
  { id: "CLM-4532", patient: "Christopher Brown", payer: "Blue Cross", amount: 720.0, status: "in-review", filed: "2026-03-30" },
  { id: "CLM-4533", patient: "Patricia Taylor", payer: "Aetna", amount: 3400.0, status: "denied", filed: "2026-03-18" },
  { id: "CLM-4534", patient: "Daniel Anderson", payer: "Cigna", amount: 1425.0, status: "pending", filed: "2026-03-28" },
  { id: "CLM-4535", patient: "Nancy Thomas", payer: "Humana", amount: 2050.0, status: "submitted", filed: "2026-03-31" },
  { id: "CLM-4536", patient: "Kevin Jackson", payer: "United Healthcare", amount: 680.0, status: "paid", filed: "2026-03-21" },
  { id: "CLM-4537", patient: "Sandra Harris", payer: "Blue Cross", amount: 1975.0, status: "appealed", filed: "2026-03-19" },
]

const claimColumns: ColumnDef<Claim, unknown>[] = [
  {
    id: "select",
    size: 40,
    minSize: 40,
    maxSize: 40,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "id",
    size: 120,
    minSize: 100,
    maxSize: 140,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Claim ID" />,
    cell: ({ row }) => <IdCell value={row.getValue("id")} />,
  },
  {
    accessorKey: "patient",
    size: 180,
    minSize: 140,
    maxSize: 260,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => <span className="font-medium truncate block">{row.getValue("patient")}</span>,
  },
  {
    accessorKey: "payer",
    size: 160,
    minSize: 120,
    maxSize: 220,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payer" />,
    cell: ({ row }) => <span className="truncate block">{row.getValue("payer")}</span>,
  },
  {
    accessorKey: "amount",
    size: 110,
    minSize: 90,
    maxSize: 130,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <CurrencyCell value={row.getValue("amount")} />,
  },
  {
    accessorKey: "status",
    size: 120,
    minSize: 100,
    maxSize: 140,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusCell status={row.getValue("status")} />,
  },
  {
    accessorKey: "filed",
    size: 110,
    minSize: 90,
    maxSize: 130,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filed Date" />,
    cell: ({ row }) => <DateCell value={row.getValue("filed")} />,
  },
  {
    id: "actions",
    size: 50,
    minSize: 50,
    maxSize: 50,
    header: "",
    cell: ({ row }) => (
      <ActionsCell
        actions={[
          { label: "View claim", icon: <Eye />, onClick: () => console.log("View", row.original.id) },
          { label: "Edit claim", icon: <Edit />, onClick: () => console.log("Edit", row.original.id) },
          { label: "Download", icon: <Download />, onClick: () => console.log("Download", row.original.id) },
          { label: "Delete", icon: <Trash2 />, onClick: () => console.log("Delete", row.original.id), variant: "destructive" },
        ]}
      />
    ),
    enableSorting: false,
  },
]

const claimFilters: FilterDefinition[] = [
  { label: "Status", value: "status", options: [
    { label: "Paid", value: "paid" }, { label: "Submitted", value: "submitted" },
    { label: "Denied", value: "denied" }, { label: "In Review", value: "in-review" },
    { label: "Pending", value: "pending" }, { label: "Appealed", value: "appealed" },
    { label: "Draft", value: "draft" }, { label: "Rejected", value: "rejected" },
  ] },
  { label: "Payer", value: "payer", options: [
    { label: "United Healthcare", value: "united-healthcare" },
    { label: "Blue Cross", value: "blue-cross" },
    { label: "Aetna", value: "aetna" },
    { label: "Cigna", value: "cigna" },
    { label: "Humana", value: "humana" },
  ] },
]

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

const navGroups = [
  {
    title: "Brand (v3.0)",
    items: [
      { label: "Logo Family", id: "logo-family" },
      { label: "Shadows", id: "shadows" },
      { label: "Marketing Type (ref)", id: "marketing-type" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { label: "Colors", id: "colors" },
      { label: "Gradients", id: "gradients" },
      { label: "Typography", id: "typography" },
      { label: "Spacing", id: "spacing" },
      { label: "Icons", id: "icons" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Buttons", id: "buttons" },
      { label: "Badge Comparison", id: "badge-comparison" },
      { label: "Status Badges", id: "status-badges" },
      { label: "Pills", id: "pills" },
      { label: "Avatars", id: "avatars" },
      { label: "Copyable", id: "copyable" },
      { label: "Form Inputs", id: "form-inputs" },
      { label: "Cards", id: "cards" },
      { label: "Data Table", id: "data-table" },
      { label: "Metric Cards", id: "metric-cards" },
      { label: "Tabs & Navigation", id: "tabs-nav" },
      { label: "Dialogs & Sheets", id: "dialogs-sheets" },
      { label: "Toasts", id: "toasts" },
      { label: "Skeletons", id: "skeletons" },
      { label: "Error States", id: "error-states" },
      { label: "Form Fields", id: "form-fields" },
      { label: "File Upload", id: "file-upload" },
      { label: "Empty States", id: "empty-states" },
      { label: "Sidebar Nav", id: "sidebar-nav-demo" },
      { label: "App Header", id: "app-header-demo" },
      { label: "Detail Panel", id: "detail-panel-demo" },
      { label: "Feedback", id: "feedback" },
    ],
  },
]

// ---------------------------------------------------------------------------
// Color Swatches Data
// ---------------------------------------------------------------------------

const colorGroups = [
  {
    title: "Primary — Violet",
    colors: [
      { name: "Violet Pale", hex: "#CFCAFD" },
      { name: "Violet Light", hex: "#8478FA" },
      { name: "Vivid Violet", hex: "#604FF8" },
      { name: "Royal Indigo", hex: "#3B30A1" },
      { name: "Nocturne Indigo", hex: "#16114A" },
    ],
  },
  {
    title: "Blue",
    colors: [
      { name: "Blue Pale", hex: "#8ABAFE" },
      { name: "Electric Azure", hex: "#095BCE" },
      { name: "Mariner Blue", hex: "#05377C" },
      { name: "Deep Nautical", hex: "#042452" },
    ],
  },
  {
    title: "Teal",
    colors: [
      { name: "Teal Pale", hex: "#A1F2EA" },
      { name: "Tropical Aqua", hex: "#22D3C1" },
      { name: "Deep Teal", hex: "#147F74" },
      { name: "Abyss Teal", hex: "#072A27" },
    ],
  },
  {
    title: "Coral — warn / urgent only",
    colors: [
      { name: "Coral Pale", hex: "#FFCEC6" },
      { name: "Coral", hex: "#FF5B42" },
      { name: "Coral Deep", hex: "#5E1D14" },
    ],
  },
  {
    title: "Neutrals",
    colors: [
      { name: "Obsidian Ink", hex: "#151A20" },
      { name: "Ink 2", hex: "#17191E" },
      { name: "Ink 3", hex: "#22232F" },
      { name: "Gunmetal Slate", hex: "#404D60" },
      { name: "Harbor Mist", hex: "#889AB3" },
      { name: "Stone", hex: "#C3CDD9" },
      { name: "Chalk", hex: "#D9D9D9" },
      { name: "Soft Cloud", hex: "#F3F4F7" },
      { name: "Fog", hex: "#F9F9FB" },
      { name: "White", hex: "#FFFFFF" },
    ],
  },
  {
    title: "Semantic",
    colors: [
      { name: "Success", hex: "#16a34a" },
      { name: "Warning", hex: "#d97706" },
      { name: "Destructive", hex: "#dc2626" },
      { name: "Info", hex: "#2563eb" },
    ],
  },
]

// ---------------------------------------------------------------------------
// Spacing Scale
// ---------------------------------------------------------------------------

const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40]

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

function App() {
  const [dark, setDark] = useState(false)
  const [activeSection, setActiveSection] = useState("logo-family")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  const scrollTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <TooltipProvider>
      <TruCareToastProvider />
      <div className="min-h-screen bg-background text-foreground">
        {/* ============================================================
            HEADER
            ============================================================ */}
        <header className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-tc-violet">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1L2 4v4c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V4L8 1z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M6 8.5l1.5 1.5L10.5 6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">TruCare Design System</span>
            <Badge variant="secondary" className="text-xs">v3.0</Badge>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={() => setDark(!dark)}>
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle {dark ? "light" : "dark"} mode</TooltipContent>
          </Tooltip>
        </header>

        {/* ============================================================
            SIDEBAR
            ============================================================ */}
        <aside className="fixed left-0 top-12 bottom-0 w-[200px] overflow-y-auto border-r bg-card p-3">
          <nav className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollTo(item.id)}
                        className={`flex w-full items-center rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                          activeSection === item.id
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* ============================================================
            MAIN CONTENT
            ============================================================ */}
        <main className="ml-[200px] pt-12">
          <div className="max-w-4xl px-6 py-5 space-y-8">

            {/* ========================================
                v3.0 — LOGO FAMILY
                ======================================== */}
            <section id="logo-family">
              <h2 className="text-xl font-medium">Logo family</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                TruCare master mark (sprouting-T) sourced from the Figma branding doc. Use the blue mark on light
                backgrounds, white on dark. Product marks ship per-product — TruIntake is the 4-petal bloom; TruCred /
                TruRev / TruIntel are placeholders pending vector handoff.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Card className="p-5">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Master mark — light surface</h3>
                  <div className="flex items-center gap-4 rounded-md border bg-card p-6">
                    <img src="/brand/trucare-mark-blue.png" alt="TruCare mark" className="h-12 w-12" />
                    <span style={{ fontSize: "28px", fontWeight: 500, letterSpacing: "-0.02em" }}>TruCare</span>
                  </div>
                </Card>
                <Card className="p-5" style={{ background: "#151A20" }}>
                  <h3 className="mb-3 text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>Master mark — dark surface</h3>
                  <div className="flex items-center gap-4 rounded-md p-6" style={{ background: "#151A20" }}>
                    <img src="/brand/trucare-mark-white.png" alt="TruCare mark" className="h-12 w-12" />
                    <span style={{ fontSize: "28px", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>TruCare</span>
                  </div>
                </Card>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Products</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Card className="p-4 flex flex-col items-center gap-2">
                    <img src="/brand/truintake-mark.png" alt="TruIntake" className="h-10 w-10" />
                    <span className="text-sm font-medium">TruIntake</span>
                    <span className="text-[11px] text-muted-foreground">Eligibility &amp; intake</span>
                  </Card>
                  <Card className="p-4 flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-violet)" }}>
                      <span className="text-white text-sm font-semibold">Tc</span>
                    </div>
                    <span className="text-sm font-medium">TruCred</span>
                    <span className="text-[11px] text-muted-foreground">Placeholder</span>
                  </Card>
                  <Card className="p-4 flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
                      <span className="text-white text-sm font-semibold">Tr</span>
                    </div>
                    <span className="text-sm font-medium">TruRev</span>
                    <span className="text-[11px] text-muted-foreground">Placeholder</span>
                  </Card>
                  <Card className="p-4 flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-teal)" }}>
                      <span className="text-white text-sm font-semibold">Ti</span>
                    </div>
                    <span className="text-sm font-medium">TruIntel</span>
                    <span className="text-[11px] text-muted-foreground">Placeholder</span>
                  </Card>
                </div>
              </div>
            </section>

            <Separator />

            {/* ========================================
                v3.0 — SHADOWS (flattened)
                ======================================== */}
            <section id="shadows">
              <h2 className="text-xl font-medium">Shadows</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Flattened in v3.0. Cards use hairline borders, not drop shadows. <code className="font-mono text-xs">shadow-md</code> / <code className="font-mono text-xs">shadow-lg</code> are reserved for overlays &amp; dialogs.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { name: "card", token: "--shadow-card", shadow: "0 0 0 1px rgba(4,36,82,0.06)", desc: "Hairline — default card" },
                  { name: "card-hover", token: "--shadow-card-hover", shadow: "0 0 0 1px rgba(4,36,82,0.08), 0 1px 2px -1px rgba(4,36,82,0.06)", desc: "Lift on hover" },
                  { name: "inset-hairline", token: "--shadow-inset-hairline", shadow: "inset 0 0 0 0.5px rgba(3,27,62,0.1)", desc: "Chips on gradients" },
                  { name: "md", token: "--shadow-md", shadow: "0 2px 8px -1px rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)", desc: "Dropdowns, popovers" },
                  { name: "lg", token: "--shadow-lg", shadow: "0 4px 16px -2px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.04)", desc: "Dialogs, sheets" },
                ].map((s) => (
                  <div key={s.name} className="flex flex-col gap-2">
                    <div
                      className="h-16 rounded-md bg-card"
                      style={{ boxShadow: s.shadow }}
                    />
                    <div>
                      <code className="font-mono text-xs">{s.token}</code>
                      <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* ========================================
                v3.0 — MARKETING TYPE (REFERENCE)
                ======================================== */}
            <section id="marketing-type">
              <h2 className="text-xl font-medium">Marketing type scale</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reference only. The admin product is capped at 24px; marketing tokens (<code className="font-mono text-xs">--text-h1..micro</code>) exist for parity with <span className="font-mono text-xs">trucarebilling.com</span> and must not be used by admin components.
              </p>
              <Card className="mt-4 p-5">
                <div className="space-y-3">
                  {[
                    { label: "H1", px: 68, w: 500, ls: "-0.03em", lh: 1.09, sample: "Practice Made Perfect." },
                    { label: "H2", px: 48, w: 500, ls: "-0.03em", lh: 1.09, sample: "Proven results where it matters most" },
                    { label: "H3", px: 40, w: 500, ls: "-0.03em", lh: 1.1, sample: "Unified intake, eligibility, and revenue visibility" },
                    { label: "H4", px: 33, w: 500, ls: "-0.02em", lh: 1.18, sample: "Your data is secure with TruCare" },
                    { label: "H5", px: 27, w: 500, ls: "-0.01em", lh: 1.2, sample: "Clean claims start at the front door" },
                    { label: "H6", px: 23, w: 500, ls: "normal", lh: 1.25, sample: "Billing in weeks, not months" },
                    { label: "Lead", px: 20, w: 400, ls: "normal", lh: 1.5, sample: "TruCred automates provider data end-to-end." },
                    { label: "Body", px: 16, w: 400, ls: "normal", lh: 1.6, sample: "Stop chasing patients for updated insurance cards." },
                    { label: "Pretitle", px: 13, w: 400, ls: "normal", lh: 1.4, sample: "FOR REVENUE TEAMS", transform: "uppercase" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-baseline justify-between gap-4 border-b pb-2 last:border-b-0 last:pb-0">
                      <span
                        className="truncate"
                        style={{
                          fontSize: `${t.px}px`,
                          fontWeight: t.w,
                          letterSpacing: t.ls,
                          lineHeight: t.lh,
                          textTransform: (t as { transform?: "uppercase" }).transform,
                        }}
                      >
                        {t.sample}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        {t.label} &middot; {t.px}px / {t.w}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <Separator />

            {/* ========================================
                COLORS
                ======================================== */}
            <section id="colors">
              <h2 className="text-xl font-medium">Colors</h2>
              <p className="mt-1 text-sm text-muted-foreground">The TruCare brand palette and semantic color tokens.</p>
              <div className="mt-4 space-y-5">
                {colorGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">{group.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      {group.colors.map((c) => (
                        <div key={c.hex} className="flex flex-col items-center gap-1.5">
                          <div
                            className="h-12 w-12 rounded-lg border"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-xs font-medium">{c.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">{c.hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* ========================================
                GRADIENTS
                ======================================== */}
            <section id="gradients">
              <h2 className="text-xl font-medium">Gradients</h2>
              <p className="mt-1 text-sm text-muted-foreground">Brand gradients derived from the core palette. Use for feature highlights, hero areas, and accent backgrounds.</p>
              <div className="mt-4 space-y-5">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Accent (135°) — chips, badges, ink</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: "Violet", css: "linear-gradient(135deg, #604FF8, #8478FA)" },
                      { name: "Blue", css: "linear-gradient(135deg, #095BCE, #05377C)" },
                      { name: "Teal", css: "linear-gradient(135deg, #22D3C1, #147F74)" },
                      { name: "Ink", css: "linear-gradient(135deg, #151A20, #404D60)" },
                      { name: "Brand", css: "linear-gradient(135deg, #604FF8, #095BCE)" },
                    ].map((g) => (
                      <div key={g.name} className="flex flex-col items-center gap-1.5">
                        <div
                          className="h-16 w-28 rounded-lg border"
                          style={{ background: g.css }}
                        />
                        <span className="text-xs font-medium">{g.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Marketing surfaces (180°) — reference only, not used in admin</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: "Hero Violet", css: "linear-gradient(180deg, #031B3E 0%, #05377C 25%, #604FF8 50%, #A095FB 75%, #F3F4F7 100%)" },
                      { name: "Hero Blue", css: "linear-gradient(180deg, #031B3E 0%, #05377C 25%, #095BCE 50%, #9DBDEB 75%, #F3F4F7 100%)" },
                      { name: "Card Surface", css: "linear-gradient(180deg, #FFFFFF 0%, #F9F9FB 100%)" },
                      { name: "Teal Chip", css: "linear-gradient(180deg, #147F74 0%, #22D3C1 100%)" },
                    ].map((g) => (
                      <div key={g.name} className="flex flex-col items-center gap-1.5">
                        <div
                          className="h-24 w-28 rounded-lg border"
                          style={{ background: g.css }}
                        />
                        <span className="text-xs font-medium">{g.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* ========================================
                TYPOGRAPHY
                ======================================== */}
            <section id="typography">
              <h2 className="text-xl font-medium">Typography</h2>
              <p className="mt-1 text-sm text-muted-foreground">The admin type scale based on Geist Sans and Geist Mono.</p>
              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b pb-2">
                      <span style={{ fontSize: "24px", fontWeight: 500 }}>Page Title</span>
                      <span className="text-xs text-muted-foreground font-mono">24px / 500</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-2">
                      <span style={{ fontSize: "20px", fontWeight: 500 }}>Section Title</span>
                      <span className="text-xs text-muted-foreground font-mono">20px / 500</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-2">
                      <span style={{ fontSize: "16px", fontWeight: 500 }}>Subtitle</span>
                      <span className="text-xs text-muted-foreground font-mono">16px / 500</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-2">
                      <span className="text-sm">Body</span>
                      <span className="text-xs text-muted-foreground font-mono">14px / 400</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-2">
                      <span style={{ fontSize: "13px" }}>Body Small</span>
                      <span className="text-xs text-muted-foreground font-mono">13px / 400</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b pb-2">
                      <span className="text-xs">Caption</span>
                      <span className="text-xs text-muted-foreground font-mono">12px / 400</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Micro Label</span>
                      <span className="text-xs text-muted-foreground font-mono">11px / 500 / uppercase</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Monospace (Geist Mono)</h3>
                  <div className="space-y-1">
                    <p className="font-mono text-sm">CLM-4521 &mdash; Claim Identifier</p>
                    <p className="font-mono text-sm">NPI: 1234567890 &mdash; Provider Identifier</p>
                    <p className="font-mono text-xs text-muted-foreground">ICD-10: Z23 &mdash; Diagnosis Code</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Tabular Nums (Geist Sans + tabular-nums)</h3>
                  <p className="mb-3 text-xs text-muted-foreground">Column-aligned numbers using Geist Sans. No monospace aesthetic. Use for all numeric values that are NOT identifiers.</p>
                  <div className="space-y-1">
                    <p className="tabular-nums text-sm">$1,250.00 &mdash; Currency</p>
                    <p className="tabular-nums text-sm">88.5% &mdash; Percentage</p>
                    <p className="tabular-nums text-sm">(555) 123-4567 &mdash; Phone Number</p>
                    <p className="tabular-nums text-sm">10,247 &mdash; Count</p>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                SPACING
                ======================================== */}
            <section id="spacing">
              <h2 className="text-xl font-medium">Spacing</h2>
              <p className="mt-1 text-sm text-muted-foreground">Consistent spacing scale used throughout the system.</p>
              <div className="mt-4 space-y-2">
                {spacingScale.map((px) => (
                  <div key={px} className="flex items-center gap-3">
                    <span className="w-8 text-right font-mono text-xs text-muted-foreground">{px}</span>
                    <div
                      className="h-3 rounded-sm bg-tc-violet/70"
                      style={{ width: `${px * 4}px` }}
                    />
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* ========================================
                ICONS
                ======================================== */}
            <section id="icons">
              <h2 className="text-xl font-medium">Icons</h2>
              <p className="mt-1 text-sm text-muted-foreground">~150 curated Lucide icons organized by category. Hover for name, search to filter.</p>
              <div className="mt-4">
                <Card className="p-4">
                  <IconBrowser />
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                BUTTONS
                ======================================== */}
            <section id="buttons">
              <h2 className="text-xl font-medium">Buttons</h2>
              <p className="mt-1 text-sm text-muted-foreground">All variants and sizes, including loading and disabled states.</p>

              <div className="mt-4 space-y-6">
                {/* Variant x Size Grid */}
                <Card className="p-4 overflow-x-auto">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Variants &times; Sizes</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-4 font-medium">Variant</th>
                        <th className="pb-2 pr-4 font-medium">XS</th>
                        <th className="pb-2 pr-4 font-medium">SM</th>
                        <th className="pb-2 pr-4 font-medium">MD</th>
                        <th className="pb-2 font-medium">LG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map((variant) => (
                        <tr key={variant} className="border-t">
                          <td className="py-2 pr-4 font-mono text-xs capitalize text-muted-foreground">{variant === "default" ? "primary" : variant}</td>
                          {(["xs", "sm", "md", "lg"] as const).map((size) => (
                            <td key={size} className="py-2 pr-4">
                              <Button variant={variant} size={size}>Label</Button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                {/* Icon Buttons */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Icon Buttons</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="default" size="icon-xs"><Plus className="h-3.5 w-3.5" /></Button>
                    <Button variant="default" size="icon-sm"><Plus className="h-4 w-4" /></Button>
                    <Button variant="default" size="icon-md"><Plus className="h-4 w-4" /></Button>
                    <Button variant="default" size="icon-lg"><Plus className="h-5 w-5" /></Button>
                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <Button variant="outline" size="icon-sm"><Search className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon-sm"><Filter className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon-sm"><Settings className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon-sm"><Bell className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon-sm"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </Card>

                {/* Loading & Disabled */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Loading & Disabled States</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button isLoading>Processing...</Button>
                    <Button variant="secondary" isLoading>Saving...</Button>
                    <Button variant="outline" isLoading>Loading</Button>
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <Button disabled>Disabled</Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                    <Button variant="outline" disabled>Disabled</Button>
                  </div>
                </Card>

                {/* Healthcare Context */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Healthcare Context</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm"><Shield className="h-3.5 w-3.5" /> Verify Eligibility</Button>
                    <Button size="sm" variant="secondary"><Zap className="h-3.5 w-3.5" /> Run 270 Check</Button>
                    <Button size="sm" variant="outline"><FileText className="h-3.5 w-3.5" /> Save Draft</Button>
                    <Button size="sm" variant="destructive"><X className="h-3.5 w-3.5" /> Void Claim</Button>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                STATUS BADGES
                ======================================== */}
            <section id="status-badges">
              <h2 className="text-xl font-medium">Status Badges</h2>
              <p className="mt-1 text-sm text-muted-foreground">Claim status indicators across all lifecycle states.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Medium (default) with dots</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["draft", "submitted", "accepted", "rejected", "in-review", "pending", "denied", "appealed", "corrected", "paid", "partially-paid", "written-off", "voided", "on-hold"] as ClaimStatus[]).map(
                      (s) => <StatusBadge key={s} status={s} dot />
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Small without dots</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["draft", "submitted", "accepted", "rejected", "in-review", "pending", "denied", "appealed", "corrected", "paid", "partially-paid", "written-off", "voided", "on-hold"] as ClaimStatus[]).map(
                      (s) => <StatusBadge key={s} status={s} size="sm" />
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">EligibilityBadge — Patient coverage status</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["eligible", "ineligible", "pending", "unknown"] as EligibilityStatus[]).map(
                      (s) => <EligibilityBadge key={s} status={s} dot />
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Small with dots</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["draft", "submitted", "accepted", "rejected", "in-review", "pending", "denied", "appealed", "corrected", "paid", "partially-paid", "written-off", "voided", "on-hold"] as ClaimStatus[]).map(
                      (s) => <StatusBadge key={s} status={s} size="sm" dot />
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">UI Badge variants</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                BADGE SHAPE COMPARISON
                ======================================== */}
            <section id="badge-comparison">
              <h2 className="text-xl font-medium">Badge Shape Comparison</h2>
              <p className="mt-1 text-sm text-muted-foreground">Three distinct label types with different shapes and purposes. Review for stakeholder approval.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Badge — <code className="text-xs">rounded-md (6px)</code> — Semantic labels, counts, version numbers</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">v1.0</Badge>
                    <Badge variant="secondary">12 claims</Badge>
                    <Badge variant="outline">RCM</Badge>
                    <Badge variant="destructive">Overdue</Badge>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">StatusBadge — <code className="text-xs">rounded-md + border + dot</code> — Claim/workflow statuses only</h3>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="draft" dot />
                    <StatusBadge status="pending" dot />
                    <StatusBadge status="denied" dot />
                    <StatusBadge status="submitted" dot />
                    <StatusBadge status="in-review" dot />
                    <StatusBadge status="paid" dot />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Pill — <code className="text-xs">rounded-full + bg only (no border)</code> — Soft tags, filters, user labels</h3>
                  <div className="flex flex-wrap gap-2">
                    <Pill color="violet">Cardiology</Pill>
                    <Pill color="blue">In-Network</Pill>
                    <Pill color="teal">Primary Care</Pill>
                    <Pill color="neutral">General</Pill>
                    <Pill color="success">Active</Pill>
                    <Pill color="warning">Expiring Soon</Pill>
                    <Pill color="destructive">Terminated</Pill>
                  </div>
                </Card>

                <Card className="p-4 border-primary/30">
                  <h3 className="mb-2 text-sm font-medium">Decision Summary</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><strong>Badge</strong> — 6px radius, for counts/versions/categories. Not interactive.</li>
                    <li><strong>StatusBadge</strong> — 6px radius with border + dot. Exclusively for claim lifecycle statuses.</li>
                    <li><strong>Pill</strong> — Full pill, bg tint only, no border. For user-applied tags, department labels, payer associations. Optionally removable.</li>
                  </ul>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                PILLS
                ======================================== */}
            <section id="pills">
              <h2 className="text-xl font-medium">Pills</h2>
              <p className="mt-1 text-sm text-muted-foreground">Soft tags for non-status labels. Distinct from StatusBadge (no border, no dot).</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Pill Shape (rounded-full) — All Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    <Pill color="gray">Gray</Pill>
                    <Pill color="neutral">Neutral</Pill>
                    <Pill color="violet">Cardiology</Pill>
                    <Pill color="blue">In-Network</Pill>
                    <Pill color="teal">Primary Care</Pill>
                    <Pill color="success">Active</Pill>
                    <Pill color="warning">Review Needed</Pill>
                    <Pill color="destructive">Terminated</Pill>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Rounded Shape (6px) — Squared Off</h3>
                  <div className="flex flex-wrap gap-2">
                    <Pill color="gray" shape="rounded">Gray</Pill>
                    <Pill color="violet" shape="rounded">Cardiology</Pill>
                    <Pill color="blue" shape="rounded">In-Network</Pill>
                    <Pill color="teal" shape="rounded">Primary Care</Pill>
                    <Pill color="success" shape="rounded">Active</Pill>
                    <Pill color="warning" shape="rounded">Review Needed</Pill>
                    <Pill color="destructive" shape="rounded">Terminated</Pill>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Small — Both Shapes</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Pill color="gray" size="sm">Tag</Pill>
                    <Pill color="violet" size="sm">Specialty</Pill>
                    <Pill color="blue" size="sm">PPO</Pill>
                    <Pill color="teal" size="sm">HMO</Pill>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill color="gray" size="sm" shape="rounded">Tag</Pill>
                    <Pill color="violet" size="sm" shape="rounded">Specialty</Pill>
                    <Pill color="blue" size="sm" shape="rounded">PPO</Pill>
                    <Pill color="teal" size="sm" shape="rounded">HMO</Pill>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Removable — Both Shapes</h3>
                  <div className="flex flex-wrap gap-2">
                    <Pill color="violet" removable onRemove={() => {}}>Cardiology</Pill>
                    <Pill color="blue" shape="rounded" removable onRemove={() => {}}>In-Network</Pill>
                    <Pill color="gray" removable onRemove={() => {}}>General</Pill>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                AVATARS
                ======================================== */}
            <section id="avatars">
              <h2 className="text-xl font-medium">Avatars</h2>
              <p className="mt-1 text-sm text-muted-foreground">First-letter avatars with deterministic colors derived from name hash.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">All Sizes</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <Avatar name="Sarah Johnson" size="xs" />
                      <span className="text-xs text-muted-foreground">xs (20px)</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Avatar name="Sarah Johnson" size="sm" />
                      <span className="text-xs text-muted-foreground">sm (24px)</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Avatar name="Sarah Johnson" size="md" />
                      <span className="text-xs text-muted-foreground">md (32px)</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Avatar name="Sarah Johnson" size="lg" />
                      <span className="text-xs text-muted-foreground">lg (40px)</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Color Distribution (deterministic)</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "James Wilson", "Maria Garcia", "David Kim", "Lisa Thompson", "Robert Martinez", "Jennifer Lee", "William Davis"].map((name) => (
                      <div key={name} className="flex items-center gap-2">
                        <Avatar name={name} size="sm" />
                        <span className="text-xs">{name}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Email Fallback</h3>
                  <div className="flex items-center gap-3">
                    <Avatar email="admin@trucarehealth.com" size="md" />
                    <span className="text-sm text-muted-foreground">Falls back to first letter of email prefix</span>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                COPYABLE
                ======================================== */}
            <section id="copyable">
              <h2 className="text-xl font-medium">Copyable</h2>
              <p className="mt-1 text-sm text-muted-foreground">One-click copy for IDs, emails, and other reference data. Click any value below to copy. IDs use <code className="text-xs">font-mono</code>, phone numbers use <code className="text-xs">tabular-nums</code>, emails use regular sans.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Claim IDs</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 group">
                      <span className="text-xs text-muted-foreground w-16">Claim ID</span>
                      <Copyable value="CLM-4521"><span className="font-mono text-sm">CLM-4521</span></Copyable>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <span className="text-xs text-muted-foreground w-16">NPI</span>
                      <Copyable value="1234567890"><span className="font-mono text-sm">1234567890</span></Copyable>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <span className="text-xs text-muted-foreground w-16">Email</span>
                      <Copyable value="sarah.johnson@email.com"><span className="text-sm">sarah.johnson@email.com</span></Copyable>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <span className="text-xs text-muted-foreground w-16">Phone</span>
                      <Copyable value="(555) 123-4567"><span className="tabular-nums text-sm">(555) 123-4567</span></Copyable>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Masked Value (copies full, displays masked)</h3>
                  <div className="flex items-center gap-3 group">
                    <span className="text-xs text-muted-foreground w-16">SSN</span>
                    <Copyable value="123-45-6789" sensitive ariaLabel="Copy SSN"><span className="font-mono text-sm">***-**-6789</span></Copyable>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                FORM INPUTS
                ======================================== */}
            <section id="form-inputs">
              <h2 className="text-xl font-medium">Form Inputs</h2>
              <p className="mt-1 text-sm text-muted-foreground">Text fields, selects, checkboxes, radios, switches, and validation states.</p>

              <div className="mt-4 space-y-4">
                {/* Standard Inputs */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Text Inputs with Labels</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="member-id">Member ID</Label>
                      <Input id="member-id" placeholder="e.g. XHN-928371645" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="group-number">Group Number</Label>
                      <Input id="group-number" placeholder="e.g. GRP-00142" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="payer-name">Payer</Label>
                      <Input id="payer-name" placeholder="e.g. United Healthcare" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subscriber-name">Subscriber Name</Label>
                      <Input id="subscriber-name" placeholder="e.g. Sarah Johnson" />
                    </div>
                  </div>
                </Card>

                {/* Textarea */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Textarea</h3>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Claim Notes</Label>
                    <Textarea id="notes" placeholder="Add notes about this claim..." rows={3} />
                  </div>
                </Card>

                {/* Select */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Select Dropdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Claim Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="institutional">Institutional</SelectItem>
                          <SelectItem value="dental">Dental</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Place of Service</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">Office (11)</SelectItem>
                          <SelectItem value="inpatient">Inpatient Hospital (21)</SelectItem>
                          <SelectItem value="outpatient">Outpatient Hospital (22)</SelectItem>
                          <SelectItem value="telehealth">Telehealth (02)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Checkbox, Radio, Switch */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Checkbox, Radio & Switch</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">Checkboxes</p>
                      <div className="flex items-center gap-2">
                        <Checkbox id="auth" defaultChecked />
                        <Label htmlFor="auth" className="text-sm font-normal">Prior authorization</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="referral" />
                        <Label htmlFor="referral" className="text-sm font-normal">Referral required</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="accident" />
                        <Label htmlFor="accident" className="text-sm font-normal">Accident related</Label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">Radio Group</p>
                      <RadioGroup defaultValue="primary">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="primary" id="primary" />
                          <Label htmlFor="primary" className="text-sm font-normal">Primary</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="secondary" id="secondary-ins" />
                          <Label htmlFor="secondary-ins" className="text-sm font-normal">Secondary</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="tertiary" id="tertiary" />
                          <Label htmlFor="tertiary" className="text-sm font-normal">Tertiary</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">Switches</p>
                      <div className="flex items-center gap-2">
                        <Switch id="auto-submit" defaultChecked />
                        <Label htmlFor="auto-submit" className="text-sm font-normal">Auto-submit claims</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="notifications" />
                        <Label htmlFor="notifications" className="text-sm font-normal">Email notifications</Label>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Validation States */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Validation States</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">Error</Label>
                      <Input className="border-destructive focus-visible:ring-destructive" defaultValue="Invalid NPI" />
                      <p className="text-xs text-destructive">NPI must be 10 digits</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Warning</Label>
                      <Input className="border-warning focus-visible:ring-warning" defaultValue="GRP-001" />
                      <p className="text-xs" style={{ color: "var(--warning)" }}>Group may be expired</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Success</Label>
                      <Input className="border-success focus-visible:ring-success" defaultValue="XHN-928371645" />
                      <p className="text-xs" style={{ color: "var(--success)" }}>Member ID verified</p>
                    </div>
                  </div>
                </Card>

                {/* Disabled / Read-only */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Disabled & Read-Only</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">Disabled Input</Label>
                      <Input disabled value="Cannot edit" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Read-Only Input</Label>
                      <Input readOnly value="CLM-4521" className="bg-muted" />
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                CARDS
                ======================================== */}
            <section id="cards">
              <h2 className="text-xl font-medium">Cards</h2>
              <p className="mt-1 text-sm text-muted-foreground">Content containers with headers, footers, and actions.</p>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Standard Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Patient Information</CardTitle>
                      <CardDescription>Insurance and demographic details</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">Sarah Johnson</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DOB</span>
                        <span>04/15/1985</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member ID</span>
                        <span className="font-mono">XHN-928371645</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card with Footer */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Claim Summary</CardTitle>
                      <CardDescription>CLM-4521 overview</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Billed</span>
                        <span className="tabular-nums font-medium">$1,250.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status="paid" size="sm" dot />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-3">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm">Submit Appeal</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </section>

            <Separator />

            {/* ========================================
                METRIC CARDS
                ======================================== */}
            <section id="metric-cards">
              <h2 className="text-xl font-medium">Metric Cards</h2>
              <p className="mt-1 text-sm text-muted-foreground">KPI cards for dashboards and summary views.</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <MetricCard
                  title="Claims Processed"
                  value="1,247"
                  change={{ value: 12.5, label: "vs last month" }}
                  icon={<ClipboardList />}
                />
                <MetricCard
                  title="Revenue"
                  value="$284,500"
                  change={{ value: 8.2, label: "vs last month" }}
                  icon={<CreditCard />}
                />
                <MetricCard
                  title="Denial Rate"
                  value="4.2%"
                  change={{ value: -1.8, label: "vs last month" }}
                  icon={<AlertCircle />}
                />
                <MetricCard
                  title="Avg Processing Time"
                  value="2.4 days"
                  change={{ value: -15, label: "vs last month" }}
                  icon={<Clock />}
                />
              </div>
            </section>

            <Separator />

            {/* ========================================
                DATA TABLE
                ======================================== */}
            <section id="data-table">
              <h2 className="text-xl font-medium">Data Table</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sortable, searchable, paginated table with row selection and typed cell renderers.</p>

              <div className="mt-4 space-y-2">
                <FilterBar
                  filters={claimFilters}
                  activeFilters={activeFilters}
                  onFilterChange={(key, val) =>
                    setActiveFilters((prev) => ({ ...prev, [key]: val }))
                  }
                  onClear={() => setActiveFilters({})}
                />
                <DataTable
                  columns={claimColumns}
                  data={claimsData}
                  searchKey="patient"
                  searchPlaceholder="Search patients..."
                  enableRowSelection
                  enablePagination
                  pageSize={10}
                  density="default"
                  emptyMessage="No claims found."
                />
              </div>
            </section>

            <Separator />

            {/* ========================================
                TABS & NAVIGATION
                ======================================== */}
            <section id="tabs-nav">
              <h2 className="text-xl font-medium">Tabs & Navigation</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tab groups, breadcrumbs, and step indicators.</p>

              <div className="mt-4 space-y-4">
                {/* Tabs */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Tab Group</h3>
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="claims">Claims</TabsTrigger>
                      <TabsTrigger value="payments">Payments</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-3 text-sm text-muted-foreground">
                      Overview tab content. Displays a summary of the patient account, including recent claims and outstanding balances.
                    </TabsContent>
                    <TabsContent value="claims" className="mt-3 text-sm text-muted-foreground">
                      Claims tab content. Lists all claims filed for this patient with their current statuses.
                    </TabsContent>
                    <TabsContent value="payments" className="mt-3 text-sm text-muted-foreground">
                      Payments tab content. Shows payment history and ERA details.
                    </TabsContent>
                    <TabsContent value="history" className="mt-3 text-sm text-muted-foreground">
                      History tab content. Full audit trail of actions taken on this account.
                    </TabsContent>
                  </Tabs>
                </Card>

                {/* Underline Tabs (V2 — scales to 4+ tabs) */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Underline Tabs (V2)</h3>
                  <Tabs defaultValue="demographics">
                    <TabsListUnderline>
                      <TabsTriggerUnderline value="demographics">Demographics</TabsTriggerUnderline>
                      <TabsTriggerUnderline value="insurance">Insurance</TabsTriggerUnderline>
                      <TabsTriggerUnderline value="consent">Consent</TabsTriggerUnderline>
                      <TabsTriggerUnderline value="documents">Documents</TabsTriggerUnderline>
                      <TabsTriggerUnderline value="billing">Billing</TabsTriggerUnderline>
                      <TabsTriggerUnderline value="activity">Activity</TabsTriggerUnderline>
                    </TabsListUnderline>
                    <TabsContent value="demographics" className="mt-3 text-sm text-muted-foreground">
                      Demographics content. Patient name, DOB, contact, address.
                    </TabsContent>
                    <TabsContent value="insurance" className="mt-3 text-sm text-muted-foreground">
                      Insurance content. Primary and secondary payer details.
                    </TabsContent>
                    <TabsContent value="consent" className="mt-3 text-sm text-muted-foreground">
                      Consent content. Signed forms and authorization status.
                    </TabsContent>
                    <TabsContent value="documents" className="mt-3 text-sm text-muted-foreground">
                      Documents content. Uploaded files, EOBs, and correspondence.
                    </TabsContent>
                    <TabsContent value="billing" className="mt-3 text-sm text-muted-foreground">
                      Billing content. Statement history and payment arrangements.
                    </TabsContent>
                    <TabsContent value="activity" className="mt-3 text-sm text-muted-foreground">
                      Activity content. Full audit trail of account actions.
                    </TabsContent>
                  </Tabs>
                </Card>

                {/* Breadcrumb */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Breadcrumb</h3>
                  <nav className="flex items-center gap-1.5 text-sm">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <button className="text-muted-foreground hover:text-foreground transition-colors">Claims</button>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">CLM-4521</span>
                  </nav>
                </Card>

                {/* Step Indicator */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Step Indicator</h3>
                  <div className="flex items-center gap-0">
                    {[
                      { label: "Patient Info", complete: true },
                      { label: "Insurance", complete: true },
                      { label: "Diagnosis", complete: false, active: true },
                      { label: "Procedures", complete: false },
                      { label: "Review", complete: false },
                    ].map((step, i, arr) => (
                      <div key={step.label} className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                              step.complete
                                ? "bg-primary text-primary-foreground"
                                : step.active
                                  ? "border-2 border-primary text-primary"
                                  : "border border-muted-foreground/30 text-muted-foreground"
                            }`}
                          >
                            {step.complete ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </div>
                          <span className={`text-xs ${step.complete || step.active ? "font-medium" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className={`mx-3 h-px w-8 ${step.complete ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                DIALOGS & SHEETS
                ======================================== */}
            <section id="dialogs-sheets">
              <h2 className="text-xl font-medium">Dialogs & Sheets</h2>
              <p className="mt-1 text-sm text-muted-foreground">Modal dialogs for confirmations and side panels for detail views.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Dialog</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm"><X className="h-3.5 w-3.5" /> Void Claim</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Void Claim CLM-4521</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. The claim will be permanently voided and removed from the billing queue.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div className="rounded-md bg-muted p-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Claim ID</span>
                              <p className="font-mono font-medium">CLM-4521</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Amount</span>
                              <p className="tabular-nums font-medium">$1,250.00</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Patient</span>
                              <p className="font-medium">Sarah Johnson</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Payer</span>
                              <p>United Healthcare</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="void-reason">Reason for voiding</Label>
                          <Textarea id="void-reason" placeholder="Enter reason..." rows={2} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" size="sm">Cancel</Button>
                        <Button variant="destructive" size="sm">Confirm Void</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Sheet (Side Panel)</h3>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5" /> View Claim Detail</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Claim CLM-4521</SheetTitle>
                        <SheetDescription>Filed March 28, 2026</SheetDescription>
                      </SheetHeader>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <StatusBadge status="paid" dot />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Patient</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name</span>
                              <span>Sarah Johnson</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">DOB</span>
                              <span>04/15/1985</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Member ID</span>
                              <span className="font-mono">XHN-928371645</span>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Billing</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payer</span>
                              <span>United Healthcare</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Billed</span>
                              <span className="tabular-nums">$1,250.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Allowed</span>
                              <span className="tabular-nums">$1,125.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Patient Resp.</span>
                              <span className="tabular-nums">$125.00</span>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1"><Edit className="h-3.5 w-3.5" /> Edit</Button>
                          <Button size="sm" variant="outline" className="flex-1"><Download className="h-3.5 w-3.5" /> Export</Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                TOASTS
                ======================================== */}
            <section id="toasts">
              <h2 className="text-xl font-medium">Toasts</h2>
              <p className="mt-1 text-sm text-muted-foreground">Notification toasts using sonner. Bottom-right, max 3 visible, auto-dismiss in 4s.</p>

              <div className="mt-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Toast Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Claim submitted successfully")}>Success</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.error("Submission failed", { description: "Payer timeout after 30s. Please retry." })}>Error</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.warning("Timely filing deadline in 7 days")}>Warning</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info("ERA file processing started")}>Info</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.default("Patient record updated")}>Default</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.promise(new Promise((r) => setTimeout(r, 2000)), { loading: "Verifying eligibility...", success: "Patient is eligible", error: "Verification failed" })}>Promise</Button>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                SKELETONS
                ======================================== */}
            <section id="skeletons">
              <h2 className="text-xl font-medium">Skeletons</h2>
              <p className="mt-1 text-sm text-muted-foreground">Loading placeholders for content that hasn't loaded yet.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Base Variants</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Rectangular (default)</p>
                      <Skeleton width="100%" height={36} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Text — 3 lines</p>
                      <Skeleton variant="text" lines={3} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Circular</p>
                      <div className="flex gap-3">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={40} height={40} />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Presets</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">MetricCardSkeleton</p>
                      <div className="max-w-[240px]"><MetricCardSkeleton /></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">TableRowSkeleton (5 columns)</p>
                      <TableRowSkeleton columns={5} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">FormFieldSkeleton</p>
                      <div className="max-w-[300px]"><FormFieldSkeleton /></div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                ERROR STATES
                ======================================== */}
            <section id="error-states">
              <h2 className="text-xl font-medium">Error States</h2>
              <p className="mt-1 text-sm text-muted-foreground">Inline field errors, section errors, and page-level error boundaries.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Field Error (inline)</h3>
                  <div className="space-y-2">
                    <FieldError message="NPI must be exactly 10 digits" />
                    <FieldError message="This field is required" />
                    <FieldError />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Error State (section-level)</h3>
                  <ErrorState
                    title="Failed to load claims"
                    description="The claims API returned an error. Please try again."
                    action={{ label: "Retry", onClick: () => toast.info("Retrying...") }}
                  />
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                FORM FIELDS
                ======================================== */}
            <section id="form-fields">
              <h2 className="text-xl font-medium">Form Fields</h2>
              <p className="mt-1 text-sm text-muted-foreground">Composed form components with labels, validation, info tooltips, and descriptions.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">FormInput</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-lg">
                    <FormInput label="NPI" required placeholder="10-digit NPI" info="National Provider Identifier assigned by CMS" />
                    <FormInput label="TIN" required placeholder="XX-XXXXXXX" error="TIN format is invalid" />
                    <FormInput label="Member ID" placeholder="e.g. XHN-928371645" description="Found on the insurance card" />
                    <FormInput label="Group Number" placeholder="e.g. GRP-00142" disabled />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">FormSelect</h3>
                  <div className="max-w-xs">
                    <FormSelect
                      label="Payer"
                      required
                      placeholder="Select a payer"
                      info="Primary insurance carrier"
                      options={[
                        { label: "United Healthcare", value: "uhc" },
                        { label: "Blue Cross Blue Shield", value: "bcbs" },
                        { label: "Aetna", value: "aetna" },
                        { label: "Cigna", value: "cigna" },
                        { label: "Humana", value: "humana" },
                      ]}
                    />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">FormTextarea</h3>
                  <div className="max-w-lg">
                    <FormTextarea
                      label="Clinical Notes"
                      description="Include any relevant clinical documentation for the claim."
                      placeholder="Enter clinical notes..."
                      rows={3}
                    />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Info Tooltips</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Hover for info:</span>
                    <InfoTooltip content="National Provider Identifier — a unique 10-digit number assigned by CMS to healthcare providers." />
                    <InfoTooltip content="Taxpayer Identification Number used for billing and tax reporting." side="right" />
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                FILE UPLOAD
                ======================================== */}
            <section id="file-upload">
              <h2 className="text-xl font-medium">File Upload</h2>
              <p className="mt-1 text-sm text-muted-foreground">Drag-and-drop file upload with validation and progress states.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Upload Zone</h3>
                  <FileUpload
                    accept=".pdf,.jpg,.png"
                    maxSizeMB={5}
                    onFilesSelected={(files) => toast.success(`${files.length} file(s) selected: ${files.map(f => f.name).join(", ")}`)}
                  />
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Disabled State</h3>
                  <FileUpload
                    accept=".pdf"
                    disabled
                    onFilesSelected={() => {}}
                  />
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                EMPTY STATES
                ======================================== */}
            <section id="empty-states">
              <h2 className="text-xl font-medium">Empty States</h2>
              <p className="mt-1 text-sm text-muted-foreground">Zero-data placeholders with healthcare-specific presets.</p>

              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Custom Empty State</h3>
                  <EmptyState
                    title="No appointments scheduled"
                    description="Schedule an appointment to see it appear here."
                    action={{ label: "Schedule", onClick: () => toast.info("Scheduling..."), icon: <Plus className="h-4 w-4" /> }}
                  />
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="mb-2 text-xs font-medium text-muted-foreground">NoClaims</h3>
                    <NoClaims onCreateClaim={() => toast.info("Creating claim...")} />
                  </Card>
                  <Card className="p-4">
                    <h3 className="mb-2 text-xs font-medium text-muted-foreground">NoPatients</h3>
                    <NoPatients />
                  </Card>
                  <Card className="p-4">
                    <h3 className="mb-2 text-xs font-medium text-muted-foreground">NoResults</h3>
                    <NoResults onClearFilters={() => toast.info("Clearing filters...")} />
                  </Card>
                </div>
              </div>
            </section>

            <Separator />

            {/* ========================================
                SIDEBAR NAV DEMO
                ======================================== */}
            <section id="sidebar-nav-demo">
              <h2 className="text-xl font-medium">Sidebar Navigation</h2>
              <p className="mt-1 text-sm text-muted-foreground">Collapsible sidebar with grouped nav items, active states, and badge counts.</p>

              <div className="mt-4">
                <Card className="p-0 overflow-hidden">
                  <div className="flex">
                    <SidebarNav
                      collapsed={sidebarCollapsed}
                      onCollapsedChange={setSidebarCollapsed}
                      groups={[
                        {
                          title: "Overview",
                          items: [
                            { label: "Dashboard", icon: <Zap className="h-4 w-4" />, active: true },
                            { label: "Notifications", icon: <Bell className="h-4 w-4" />, badge: 3 },
                          ],
                        },
                        {
                          title: "Claims",
                          items: [
                            { label: "All Claims", icon: <ClipboardList className="h-4 w-4" /> },
                            { label: "Denied", icon: <AlertCircle className="h-4 w-4" />, badge: 12 },
                            { label: "Appeals", icon: <FileText className="h-4 w-4" /> },
                          ],
                        },
                        {
                          title: "Settings",
                          items: [
                            { label: "Practice", icon: <Settings className="h-4 w-4" /> },
                            { label: "Billing", icon: <CreditCard className="h-4 w-4" />, disabled: true },
                          ],
                        },
                      ]}
                      className="h-[320px] border-r relative"
                    />
                    <div className="flex-1 p-6 flex items-center justify-center text-sm text-muted-foreground">
                      {sidebarCollapsed ? "Sidebar collapsed (48px)" : "Sidebar expanded (200px)"} — click the collapse toggle at the bottom
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                APP HEADER DEMO
                ======================================== */}
            <section id="app-header-demo">
              <h2 className="text-xl font-medium">App Header</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fixed header with logo, global action, theme toggle, and account dropdown.</p>

              <div className="mt-4">
                <Card className="p-0 overflow-hidden">
                  <AppHeader
                    logo={
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-tc-violet">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                    }
                    title="TruCare"
                    version="v3.0"
                    globalAction={{ label: "New Claim", icon: <Plus className="h-4 w-4" />, onClick: () => toast.info("New claim action") }}
                    user={{ name: "Dr. Sarah Johnson", email: "sarah@trucarehealth.com" }}
                    onThemeToggle={() => setDark(!dark)}
                    isDark={dark}
                    className="relative"
                  />
                </Card>

                <Card className="p-4 mt-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Account Dropdown (standalone)</h3>
                  <div className="flex items-center gap-3">
                    <AccountDropdown
                      user={{ name: "Dr. Sarah Johnson", email: "sarah@trucarehealth.com" }}
                      onSettings={() => toast.info("Settings clicked")}
                      onLogout={() => toast.info("Logout clicked")}
                      menuItems={[
                        { label: "My Profile", icon: <Eye className="h-4 w-4" />, onClick: () => toast.info("Profile") },
                      ]}
                    />
                    <span className="text-sm text-muted-foreground">Click the avatar to open the dropdown</span>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* ========================================
                DETAIL PANEL DEMO
                ======================================== */}
            <section id="detail-panel-demo">
              <h2 className="text-xl font-medium">Detail Panel</h2>
              <p className="mt-1 text-sm text-muted-foreground">Right-side drawer for record details with key-value rows and collapsible sections.</p>

              <div className="mt-4">
                <Card className="p-4">
                  <Button onClick={() => setDetailPanelOpen(true)}>Open Detail Panel</Button>
                </Card>

                <DetailPanel
                  open={detailPanelOpen}
                  onOpenChange={setDetailPanelOpen}
                  title="CLM-4521"
                  subtitle="Sarah Johnson — United Healthcare"
                  badge={<StatusBadge status="paid" dot />}
                  width="md"
                  footer={
                    <>
                      <Button variant="outline" size="sm" onClick={() => setDetailPanelOpen(false)}>Close</Button>
                      <Button size="sm" onClick={() => toast.success("Claim updated")}>Save Changes</Button>
                    </>
                  }
                >
                  <div className="space-y-6">
                    <DetailSection title="Patient Information">
                      <div className="space-y-0">
                        <DetailRow label="Patient" value="Sarah Johnson" />
                        <DetailRow label="DOB" value="01/15/1990" />
                        <DetailRow label="MRN" value="MRN-00482916" mono copyable />
                        <DetailRow label="Email" value="sarah.johnson@email.com" copyable />
                        <DetailRow label="Phone" value="(555) 123-4567" tabularNums copyable />
                      </div>
                    </DetailSection>

                    <DetailSection title="Claim Details">
                      <div className="space-y-0">
                        <DetailRow label="Claim ID" value="CLM-4521" mono copyable />
                        <DetailRow label="Amount" value="$1,250.00" tabularNums />
                        <DetailRow label="Payer" value="United Healthcare" />
                        <DetailRow label="Filed Date" value="March 28, 2026" />
                        <DetailRow label="NPI" value="1234567890" mono copyable />
                      </div>
                    </DetailSection>

                    <DetailSection title="Status History" collapsible defaultOpen={false}>
                      <div className="space-y-0">
                        <DetailRow label="Mar 28" value="Submitted" />
                        <DetailRow label="Mar 29" value="Accepted by payer" />
                        <DetailRow label="Mar 31" value="In Review" />
                        <DetailRow label="Apr 2" value="Paid — $1,250.00" />
                      </div>
                    </DetailSection>
                  </div>
                </DetailPanel>
              </div>
            </section>

            <Separator />

            {/* ========================================
                FEEDBACK & PROGRESS
                ======================================== */}
            <section id="feedback">
              <h2 className="text-xl font-medium">Feedback & Progress</h2>
              <p className="mt-1 text-sm text-muted-foreground">Progress bars, alerts, and informational messages.</p>

              <div className="mt-4 space-y-4">
                {/* Progress Bars */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Progress Bars</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Claims batch upload</span>
                        <span className="tabular-nums">25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">ERA processing</span>
                        <span className="tabular-nums">60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Monthly target</span>
                        <span className="tabular-nums">88%</span>
                      </div>
                      <Progress value={88} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Verification complete</span>
                        <span className="tabular-nums">100%</span>
                      </div>
                      <Progress value={100} />
                    </div>
                  </div>
                </Card>

                {/* Alerts */}
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Alert Messages</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 rounded-md border p-3" style={{ borderLeftWidth: "3px", borderLeftColor: "var(--success)" }}>
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                      <div>
                        <p className="text-sm font-medium">Eligibility verified</p>
                        <p className="text-xs text-muted-foreground">Patient Sarah Johnson is eligible for services under plan UHC-PPO.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 rounded-md border p-3" style={{ borderLeftWidth: "3px", borderLeftColor: "var(--info)" }}>
                      <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--info)" }} />
                      <div>
                        <p className="text-sm font-medium">Prior authorization required</p>
                        <p className="text-xs text-muted-foreground">CPT 99213 requires prior auth for this payer. Submit PA before filing claim.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 rounded-md border p-3" style={{ borderLeftWidth: "3px", borderLeftColor: "var(--warning)" }}>
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
                      <div>
                        <p className="text-sm font-medium">Timely filing deadline approaching</p>
                        <p className="text-xs text-muted-foreground">CLM-4523 must be submitted within 7 days to meet the 90-day filing limit.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 rounded-md border p-3" style={{ borderLeftWidth: "3px", borderLeftColor: "var(--destructive)" }}>
                      <X className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                      <div>
                        <p className="text-sm font-medium">Claim denied</p>
                        <p className="text-xs text-muted-foreground">CLM-4523 was denied. Reason: CO-4 (procedure code inconsistent with modifier).</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Bottom spacing */}
            <div className="h-16" />

          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

export default App
