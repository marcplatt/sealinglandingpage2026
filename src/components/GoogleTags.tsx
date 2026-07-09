import Script from 'next/script'

const gtagId = process.env.NEXT_PUBLIC_GTAG_ID

export function GoogleTags() {
  if (!gtagId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${gtagId}');
        `}
      </Script>
    </>
  )
}