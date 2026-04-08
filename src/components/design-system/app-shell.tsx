import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface AppShellProps {
  children: ReactNode
  sidebar: ReactNode
  header: ReactNode
  className?: string
}

export function AppShell({ children, sidebar, header, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "grid min-h-screen",
        "grid-cols-[var(--width-sidebar,200px)_1fr]",
        "grid-rows-[var(--height-header,48px)_1fr]",
        className
      )}
    >
      {/* Skip navigation link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      {/* Header — spans full width, fixed top */}
      <div className="col-[1/-1] row-[1] sticky top-0 z-[var(--z-header,20)]">
        {header}
      </div>

      {/* Sidebar — fixed left below header, scrollable */}
      <aside className="row-[2] overflow-y-auto border-r bg-card">
        {sidebar}
      </aside>

      {/* Main content — scrolls independently */}
      <main id="main-content" className="row-[2] overflow-y-auto bg-background">
        <div className="px-[var(--space-page-x,24px)] py-[var(--space-page-y,20px)]">
          {children}
        </div>
      </main>
    </div>
  )
}
