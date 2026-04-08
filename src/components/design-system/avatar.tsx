import { cn } from "@/lib/utils"

const AVATAR_COLORS = [
  { bg: "#604FF8", text: "#FFFFFF" }, // violet
  { bg: "#095BCE", text: "#FFFFFF" }, // blue
  { bg: "#22D3C1", text: "#151A20" }, // teal (dark text for contrast)
  { bg: "#3B30A1", text: "#FFFFFF" }, // violet-dark
  { bg: "#05377C", text: "#FFFFFF" }, // blue-mid
  { bg: "#147F74", text: "#FFFFFF" }, // teal-mid
  { bg: "#404D60", text: "#FFFFFF" }, // slate
  { bg: "#889AB3", text: "#151A20" }, // mist (dark text for contrast)
] as const

const SIZE_MAP = {
  xs: { container: "h-5 w-5", fontSize: "text-[10px]" },
  sm: { container: "h-6 w-6", fontSize: "text-[11px]" },
  md: { container: "h-8 w-8", fontSize: "text-[13px]" },
  lg: { container: "h-10 w-10", fontSize: "text-[16px]" },
} as const

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function getInitial(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    return name.trim()[0].toUpperCase()
  }
  if (email && email.trim().length > 0) {
    const prefix = email.split("@")[0]
    return prefix[0].toUpperCase()
  }
  return "?"
}

export interface AvatarProps {
  name?: string
  email?: string
  size?: "xs" | "sm" | "md" | "lg"
  /** Override the default aria-label (which uses name or email). */
  ariaLabel?: string
  className?: string
}

export function Avatar({ name, email, size = "md", ariaLabel, className }: AvatarProps) {
  const initial = getInitial(name, email)
  const seed = name || email || "?"
  const colorIndex = hashString(seed) % AVATAR_COLORS.length
  const color = AVATAR_COLORS[colorIndex]
  const sizeConfig = SIZE_MAP[size]

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold shrink-0 select-none",
        sizeConfig.container,
        sizeConfig.fontSize,
        className
      )}
      style={{ backgroundColor: color.bg, color: color.text }}
      aria-label={ariaLabel ?? name ?? email ?? "Avatar"}
      role="img"
    >
      {initial}
    </span>
  )
}
