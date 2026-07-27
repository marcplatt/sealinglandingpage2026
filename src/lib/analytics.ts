declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const conversionLabel = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL
const callConversionLabel = process.env.NEXT_PUBLIC_GADS_CALL_CONVERSION_LABEL
const conversionTrackedSessionKey = 'rw_conversion_event_sent'

type TrackConversionOptions = {
  eventCallback?: () => void
  eventTimeoutMs?: number
}

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

export function hasTrackedConversionThisSession() {
  if (!canUseSessionStorage()) {
    return false
  }
  return window.sessionStorage.getItem(conversionTrackedSessionKey) === '1'
}

export function markConversionTrackedThisSession() {
  if (!canUseSessionStorage()) {
    return
  }
  window.sessionStorage.setItem(conversionTrackedSessionKey, '1')
}

function trackAdsConversion(sendTo: string | undefined, options?: TrackConversionOptions) {
  if (!sendTo || typeof window === 'undefined' || !window.gtag) {
    return false
  }

  const payload: Record<string, unknown> = {
    send_to: sendTo,
  }

  if (options?.eventCallback) {
    payload.event_callback = options.eventCallback
  }
  if (options?.eventTimeoutMs) {
    payload.event_timeout = options.eventTimeoutMs
  }

  window.gtag('event', 'conversion', {
    ...payload,
  })

  return true
}

export function trackConversion(options?: TrackConversionOptions) {
  const tracked = trackAdsConversion(conversionLabel, options)

  if (!tracked) {
    return false
  }

  markConversionTrackedThisSession()
  return true
}

export function trackCallConversion(options?: TrackConversionOptions) {
  return trackAdsConversion(callConversionLabel, options)
}

export function getConversionLabel() {
  return conversionLabel ?? ''
}