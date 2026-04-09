import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FileUploadProps {
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  className?: string
}

function parseAcceptedTypes(accept?: string): string[] {
  if (!accept) return []
  return accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
}

function getReadableTypes(accept?: string): string {
  if (!accept) return "All file types accepted"
  const types = parseAcceptedTypes(accept)
  return types.map((t) => t.replace(".", "").toUpperCase()).join(", ")
}

function validateFile(
  file: File,
  acceptedTypes: string[],
  maxSizeMB: number
): string | null {
  // Size check
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File exceeds ${maxSizeMB}MB limit`
  }

  // Extension check
  if (acceptedTypes.length > 0) {
    const fileName = file.name.toLowerCase()
    const hasValidExt = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileName.endsWith(type)
      }
      // MIME type match (e.g., "image/*")
      if (type.includes("/")) {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.replace("/*", "/"))
        }
        return file.type === type
      }
      return false
    })

    if (!hasValidExt) {
      return `File type not accepted. Expected: ${getReadableTypes(acceptedTypes.join(","))}`
    }
  }

  return null
}

export function FileUpload({
  accept,
  maxSizeMB = 10,
  multiple = false,
  onFilesSelected,
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const acceptedTypes = React.useMemo(() => parseAcceptedTypes(accept), [accept])

  const handleFiles = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return

      const files = Array.from(fileList)
      const errors: string[] = []
      const valid: File[] = []

      for (const file of files) {
        const err = validateFile(file, acceptedTypes, maxSizeMB)
        if (err) {
          errors.push(`${file.name}: ${err}`)
        } else {
          valid.push(file)
        }
      }

      if (errors.length > 0) {
        setError(errors.join(". "))
      } else {
        setError(null)
      }

      if (valid.length > 0) {
        onFilesSelected(valid)
      }
    },
    [acceptedTypes, maxSizeMB, onFilesSelected]
  )

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) setIsDragOver(true)
    },
    [disabled]
  )

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
    },
    []
  )

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      if (!disabled) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [disabled, handleFiles]
  )

  const handleClick = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = ""
    },
    [handleFiles]
  )

  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleClick()
          }
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-8 transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted hover:border-muted-foreground/30",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
        aria-label="File upload drop zone"
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-[13px] text-foreground">
          Drag &amp; drop or click to upload
        </p>
        <p className="text-[11px] text-muted-foreground">
          {getReadableTypes(accept)} &middot; Max {maxSizeMB}MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      {error && (
        <p className="text-[11px] text-destructive mt-2">{error}</p>
      )}
    </div>
  )
}
