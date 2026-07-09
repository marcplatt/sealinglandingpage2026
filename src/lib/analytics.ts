declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const conversionLabel = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL

export function trackConversion() {
  if (!conversionLabel || typeof window === 'undefined' || !window.gtag) {
    return false
  }

  window.gtag('event', 'conversion', {
    send_to: conversionLabel,
  })
  return true
}

export function getConversionLabel() {
  return conversionLabel ?? ''
}