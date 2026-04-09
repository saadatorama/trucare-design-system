import { toast as sonnerToast } from "sonner"

interface ToastOptions {
  description?: string
}

/**
 * Checks for common PHI patterns in dev mode and warns.
 * NOT a security control — just a development-time guardrail.
 */
function devCheckPHI(message: string, description?: string) {
  if (process.env.NODE_ENV === "production") return
  const text = `${message} ${description ?? ""}`
  const patterns = [
    /\d{3}-\d{2}-\d{4}/, // SSN
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/, // Email
    /\b(MRN|mrn)[-:]?\s?\d{5,}/, // MRN
    /\b\d{10}\b/, // NPI (10-digit)
  ]
  for (const p of patterns) {
    if (p.test(text)) {
      console.warn(
        `[TruCare Toast] Possible PHI detected in toast message. ` +
        `Toast messages must NOT contain patient identifiers. ` +
        `Use generic confirmations only. Pattern matched: ${p.source}`
      )
      break
    }
  }
}

/**
 * TruCare typed toast helpers.
 *
 * COMPLIANCE: Toast messages MUST NOT contain patient identifiers (names, MRN,
 * SSN, DOB, email, NPI). Use generic confirmations only:
 *   GOOD: "Claim submitted successfully"
 *   BAD:  "Claim for Sarah Johnson (MRN-00482916) submitted"
 *
 * Usage:
 *   toast.success("Patient verified")
 *   toast.error("Claim submission failed", { description: "Payer timeout after 30s" })
 *   toast.promise(submitClaim(), { loading: "Submitting...", success: "Submitted", error: "Failed" })
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    devCheckPHI(message, options?.description)
    return sonnerToast.success(message, options)
  },

  error: (message: string, options?: ToastOptions) => {
    devCheckPHI(message, options?.description)
    return sonnerToast.error(message, options)
  },

  warning: (message: string, options?: ToastOptions) => {
    devCheckPHI(message, options?.description)
    return sonnerToast.warning(message, options)
  },

  info: (message: string, options?: ToastOptions) => {
    devCheckPHI(message, options?.description)
    return sonnerToast.info(message, options)
  },

  default: (message: string, options?: ToastOptions) => {
    devCheckPHI(message, options?.description)
    return sonnerToast(message, options)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    devCheckPHI(messages.loading)
    devCheckPHI(messages.success)
    devCheckPHI(messages.error)
    return sonnerToast.promise(promise, messages)
  },
}
