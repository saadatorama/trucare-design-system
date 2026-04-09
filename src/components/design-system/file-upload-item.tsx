import { FileText, Check, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface FileUploadItemProps {
  file: { name: string; size: number }
  progress?: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  onRemove?: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadItem({
  file,
  progress,
  status,
  error,
  onRemove,
}: FileUploadItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />

      <div className="flex flex-col min-w-0 flex-1 gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] truncate">{file.name}</span>
          <span className="text-[11px] text-muted-foreground shrink-0">
            {formatFileSize(file.size)}
          </span>
        </div>

        {status === "uploading" && progress !== undefined && (
          <Progress value={progress} className="h-1.5" />
        )}

        {status === "error" && error && (
          <span className="text-[11px] text-destructive">{error}</span>
        )}
      </div>

      <div className="flex items-center shrink-0">
        {status === "success" && (
          <Check className="h-4 w-4 text-success" />
        )}
        {status === "error" && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
      </div>

      {onRemove && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className={cn("shrink-0")}
          aria-label={`Remove ${file.name}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
