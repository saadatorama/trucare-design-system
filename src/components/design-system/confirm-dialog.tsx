import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  isLoading?: boolean
}

/**
 * Pre-composed confirmation dialog for destructive or important actions.
 *
 * Usage:
 *   <ConfirmDialog
 *     open={showVoid}
 *     onConfirm={handleVoid}
 *     onCancel={() => setShowVoid(false)}
 *     title="Void Claim CLM-4821?"
 *     description="This action cannot be undone. The claim will be permanently voided."
 *     variant="destructive"
 *   />
 */
export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const [debouncing, setDebouncing] = React.useState(false)

  const handleConfirm = () => {
    if (debouncing || isLoading) return
    setDebouncing(true)
    onConfirm()
    // Reset debounce after 500ms to prevent double-click
    setTimeout(() => setDebouncing(false), 500)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel() }}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            size="sm"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={debouncing}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
