import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Banner } from "../banner"

describe("Banner", () => {
  it("renders with title and description", () => {
    render(
      <Banner variant="info" title="System Update">
        Scheduled maintenance tonight.
      </Banner>
    )
    expect(screen.getByText("System Update")).toBeInTheDocument()
    expect(screen.getByText("Scheduled maintenance tonight.")).toBeInTheDocument()
  })

  it("renders all four variants without error", () => {
    const variants = ["info", "warning", "destructive", "success"] as const
    for (const variant of variants) {
      const { unmount } = render(
        <Banner variant={variant}>Test content</Banner>
      )
      expect(screen.getByRole("alert")).toBeInTheDocument()
      unmount()
    }
  })

  it("shows dismiss button when dismissible", async () => {
    const onDismiss = vi.fn()
    render(
      <Banner variant="warning" dismissible onDismiss={onDismiss}>
        Dismissible banner
      </Banner>
    )
    const dismissBtn = screen.getByLabelText("Dismiss")
    expect(dismissBtn).toBeInTheDocument()
    await userEvent.click(dismissBtn)
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("renders action button", async () => {
    const onClick = vi.fn()
    render(
      <Banner variant="destructive" action={{ label: "Retry", onClick }}>
        Something failed.
      </Banner>
    )
    const actionBtn = screen.getByText("Retry")
    await userEvent.click(actionBtn)
    expect(onClick).toHaveBeenCalledOnce()
  })
})
