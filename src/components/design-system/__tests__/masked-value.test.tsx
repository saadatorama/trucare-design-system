import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MaskedValue, maskSSN, maskDOB, maskMRN } from "../masked-value"

// MaskedValue uses Copyable which uses Tooltip, so wrap in TooltipProvider
function renderWithTooltip(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>)
}

describe("maskSSN", () => {
  it("masks SSN to last 4 digits", () => {
    expect(maskSSN("123-45-6789")).toBe("***-**-6789")
    expect(maskSSN("123456789")).toBe("***-**-6789")
  })
})

describe("maskDOB", () => {
  it("masks DOB preserving year", () => {
    expect(maskDOB("01/15/1990")).toBe("**/**/1990")
    expect(maskDOB("1990-01-15")).toBe("**/**/1990")
  })
})

describe("maskMRN", () => {
  it("masks MRN to last 4", () => {
    expect(maskMRN("MRN-00482916")).toBe("MRN-****2916")
    expect(maskMRN("00482916")).toBe("MRN-****2916")
  })
})

describe("MaskedValue", () => {
  it("shows masked value by default", () => {
    renderWithTooltip(
      <MaskedValue value="123-45-6789" maskedValue="***-**-6789" />
    )
    expect(screen.getByText("***-**-6789")).toBeInTheDocument()
  })

  it("reveals value on click and fires onReveal callback", async () => {
    const onReveal = vi.fn()
    renderWithTooltip(
      <MaskedValue
        value="123-45-6789"
        maskedValue="***-**-6789"
        onReveal={onReveal}
      />
    )
    const revealBtn = screen.getByLabelText("Reveal value")
    await userEvent.click(revealBtn)
    expect(screen.getByText("123-45-6789")).toBeInTheDocument()
    expect(onReveal).toHaveBeenCalledWith("123-45-6789")
  })

  it("hides value when clicking reveal again", async () => {
    renderWithTooltip(
      <MaskedValue value="123-45-6789" maskedValue="***-**-6789" />
    )
    const revealBtn = screen.getByLabelText("Reveal value")
    await userEvent.click(revealBtn)
    expect(screen.getByText("123-45-6789")).toBeInTheDocument()

    const hideBtn = screen.getByLabelText("Hide value")
    await userEvent.click(hideBtn)
    expect(screen.getByText("***-**-6789")).toBeInTheDocument()
  })

  it("adds data-phi attribute when sensitive", () => {
    const { container } = renderWithTooltip(
      <MaskedValue value="123-45-6789" maskedValue="***-**-6789" sensitive />
    )
    expect(container.querySelector("[data-phi='true']")).toBeInTheDocument()
  })
})
