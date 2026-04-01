import { useState, useEffect } from "react"
import { type ColumnDef } from "@tanstack/react-table"

// Lucide Icons
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  Calendar,
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
  Heart,
  Info,
  Mail,
  Moon,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  User,
  Users,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { StatusBadge, type ClaimStatus } from "@/components/design-system/status-badge"
import { MetricCard } from "@/components/design-system/metric-card"
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
  { id: "CLM-4527", patient: "Lisa Thompson", payer: "Blue Cross", amount: 950.0, status: "eligible", filed: "2026-03-31" },
  { id: "CLM-4528", patient: "Robert Martinez", payer: "Aetna", amount: 2750.0, status: "pending", filed: "2026-03-27" },
  { id: "CLM-4529", patient: "Jennifer Lee", payer: "Cigna", amount: 1100.0, status: "submitted", filed: "2026-03-29" },
  { id: "CLM-4530", patient: "William Davis", payer: "Humana", amount: 560.0, status: "ineligible", filed: "2026-03-26" },
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Claim ID" />,
    cell: ({ row }) => <IdCell value={row.getValue("id")} />,
  },
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("patient")}</span>,
  },
  {
    accessorKey: "payer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payer" />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <CurrencyCell value={row.getValue("amount")} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusCell status={row.getValue("status")} />,
  },
  {
    accessorKey: "filed",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filed Date" />,
    cell: ({ row }) => <DateCell value={row.getValue("filed")} />,
  },
  {
    id: "actions",
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
  { label: "Status", value: "status", options: ["Paid", "Submitted", "Denied", "In Review", "Pending", "Appealed", "Eligible", "Ineligible"] },
  { label: "Payer", value: "payer", options: ["United Healthcare", "Blue Cross", "Aetna", "Cigna", "Humana"] },
]

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

const navGroups = [
  {
    title: "Foundations",
    items: [
      { label: "Colors", id: "colors" },
      { label: "Typography", id: "typography" },
      { label: "Spacing", id: "spacing" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Buttons", id: "buttons" },
      { label: "Status Badges", id: "status-badges" },
      { label: "Form Inputs", id: "form-inputs" },
      { label: "Cards", id: "cards" },
      { label: "Data Table", id: "data-table" },
      { label: "Metric Cards", id: "metric-cards" },
      { label: "Tabs & Navigation", id: "tabs-nav" },
      { label: "Dialogs & Sheets", id: "dialogs-sheets" },
      { label: "Feedback", id: "feedback" },
    ],
  },
]

// ---------------------------------------------------------------------------
// Color Swatches Data
// ---------------------------------------------------------------------------

const colorGroups = [
  {
    title: "Primary",
    colors: [
      { name: "Vivid Violet", hex: "#604FF8" },
      { name: "Violet Light", hex: "#8478FA" },
      { name: "Royal Indigo", hex: "#3B30A1" },
      { name: "Nocturne Indigo", hex: "#16114A" },
    ],
  },
  {
    title: "Blue",
    colors: [
      { name: "Electric Azure", hex: "#095BCE" },
      { name: "Mariner Blue", hex: "#05377C" },
      { name: "Deep Nautical", hex: "#042452" },
    ],
  },
  {
    title: "Teal",
    colors: [
      { name: "Tropical Aqua", hex: "#22D3C1" },
      { name: "Deep Teal", hex: "#147F74" },
      { name: "Abyss Teal", hex: "#072A27" },
    ],
  },
  {
    title: "Neutrals",
    colors: [
      { name: "Obsidian Ink", hex: "#151A20" },
      { name: "Gunmetal Slate", hex: "#404D60" },
      { name: "Harbor Mist", hex: "#889AB3" },
      { name: "Soft Cloud", hex: "#F3F4F7" },
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
  const [activeSection, setActiveSection] = useState("colors")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

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
            <Badge variant="secondary" className="text-xs">v1.0</Badge>
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
                            className="h-12 w-12 rounded-lg border shadow-sm"
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
                    <p className="font-mono text-sm">$1,250.00 &mdash; Currency Value</p>
                    <p className="font-mono text-xs text-muted-foreground">NPI: 1234567890 &mdash; Provider ID</p>
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
                    {(["eligible", "pending", "denied", "submitted", "in-review", "paid", "appealed", "ineligible"] as ClaimStatus[]).map(
                      (s) => <StatusBadge key={s} status={s} dot />
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Small without dots</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["eligible", "pending", "denied", "submitted", "in-review", "paid", "appealed", "ineligible"] as ClaimStatus[]).map(
                      (s) => <StatusBadge key={s} status={s} size="sm" />
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Medium without dots</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["eligible", "pending", "denied", "submitted", "in-review", "paid", "appealed", "ineligible"] as ClaimStatus[]).map(
                      (s) => <StatusBadge key={s} status={s} />
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Small with dots</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["eligible", "pending", "denied", "submitted", "in-review", "paid", "appealed", "ineligible"] as ClaimStatus[]).map(
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
                        <span className="font-mono font-medium">$1,250.00</span>
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
                              <p className="font-mono font-medium">$1,250.00</p>
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
                              <span className="font-mono">$1,250.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Allowed</span>
                              <span className="font-mono">$1,125.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Patient Resp.</span>
                              <span className="font-mono">$125.00</span>
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
                        <span className="font-mono">25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">ERA processing</span>
                        <span className="font-mono">60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Monthly target</span>
                        <span className="font-mono">88%</span>
                      </div>
                      <Progress value={88} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Verification complete</span>
                        <span className="font-mono">100%</span>
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
