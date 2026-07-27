"use client"

import { useEffect } from 'react'

import {
  hasTrackedConversionThisSession,
  trackConversion,
} from '../../lib/analytics'

export function ConversionPing() {
  useEffect(() => {
    if (hasTrackedConversionThisSession()) {
      return
    }

    trackConversion()
  }, [])

  return null
}