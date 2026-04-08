import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge, EligibilityBadge } from "../status-badge"

describe("StatusBadge", () => {
  it("renders claim status label", () => {
    render(<StatusBadge status="draft" />)
    expect(screen.getByText("Draft")).toBeInTheDocument()
  })

  it("renders all 14 claim statuses without error", () => {
    const statuses = [
      "draft", "submitted", "accepted", "rejected", "in-review",
      "pending", "denied", "appealed", "corrected", "paid",
      "partially-paid", "written-off", "voided", "on-hold",
    ] as const

    for (const status of statuses) {
      const { unmount } = render(<StatusBadge status={status} />)
      expect(screen.getByText(/.+/)).toBeInTheDocument()
      unmount()
    }
  })

  it("renders dot indicator when dot prop is true", () => {
    const { container } = render(<StatusBadge status="paid" dot />)
    const dot = container.querySelector("[aria-hidden='true']")
    expect(dot).toBeInTheDocument()
  })

  it("applies correct size classes", () => {
    const { container } = render(<StatusBadge status="denied" size="sm" />)
    const badge = container.querySelector("span")
    expect(badge?.className).toContain("h-5")
  })
})

describe("EligibilityBadge", () => {
  it("renders eligibility status label", () => {
    render(<EligibilityBadge status="eligible" />)
    expect(screen.getByText("Eligible")).toBeInTheDocument()
  })

  it("renders all 4 eligibility statuses", () => {
    const statuses = ["eligible", "ineligible", "pending", "unknown"] as const
    for (const status of statuses) {
      const { unmount } = render(<EligibilityBadge status={status} />)
      expect(screen.getByText(/.+/)).toBeInTheDocument()
      unmount()
    }
  })
})
