import Script from 'next/script'

const ga4TagId = process.env.NEXT_PUBLIC_GTAG_ID
const conversionLabel = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL
const adsTagIdFromLabel =
  conversionLabel?.startsWith('AW-') === true
    ? conversionLabel.split('/')[0]
    : ''

const tagIds = Array.from(
  new Set([adsTagIdFromLabel, ga4TagId].filter((value): value is string => Boolean(value)))
)

export function GoogleTags() {
  if (tagIds.length === 0) {
    return null
  }

  const loaderTagId = tagIds[0]
  const configCalls = tagIds.map((id) => `gtag('config', '${id}');`).join('\n          ')

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          ${configCalls}
        `}
      </Script>
    </>
  )
}