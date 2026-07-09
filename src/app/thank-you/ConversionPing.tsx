"use client"

import { useEffect } from 'react'

import { trackConversion } from '../../lib/analytics'

export function ConversionPing() {
  useEffect(() => {
    trackConversion()
  }, [])

  return null
}