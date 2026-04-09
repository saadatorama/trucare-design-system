import { Toaster } from "sonner"

/**
 * TruCare Toast Provider
 *
 * Wraps sonner's Toaster with TruCare design system theme.
 * Place this once at the root of the app (e.g., in App.tsx or main.tsx).
 *
 * Position: bottom-right
 * Max visible: 3
 * Duration: 4000ms
 * Close button on every toast
 */
export function TruCareToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      visibleToasts={3}
      duration={4000}
      closeButton
      toastOptions={{
        style: {
          fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
          fontSize: "13px",
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderStyle: "solid",
          boxShadow:
            "0 2px 8px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        },
        classNames: {
          success: "!border-[var(--success)]",
          error: "!border-[var(--destructive)]",
          warning: "!border-[var(--warning)]",
          info: "!border-[var(--info)]",
        },
      }}
    />
  )
}
