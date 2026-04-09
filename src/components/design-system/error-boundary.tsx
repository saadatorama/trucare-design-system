import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback UI. Receives the error and a reset function. */
  fallback?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode
  /** Custom error handler. When provided, replaces the default console.error to allow PHI sanitization. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React error boundary with TruCare-styled default fallback.
 *
 * SECURITY: Stack traces go to console.error ONLY. Never displayed in UI.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={({ error, resetErrorBoundary }) => <Custom />}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      // Custom handler — consuming app can sanitize PHI from error objects
      this.props.onError(error, errorInfo)
    } else {
      // SECURITY: stack traces logged to console only, never rendered in UI
      console.error("[ErrorBoundary]", error, errorInfo)
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        })
      }

      return (
        <div
          className={cn(
            "flex items-center justify-center p-8",
            this.props.className
          )}
        >
          <div className="flex max-w-md flex-col items-center gap-4 rounded-md border bg-card p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="space-y-1.5">
              <h3 className="text-base font-medium text-card-foreground">
                Something went wrong
              </h3>
              <p className="text-[13px] text-muted-foreground">
                An unexpected error occurred. Please try again or contact support.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={this.resetErrorBoundary}
            >
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
