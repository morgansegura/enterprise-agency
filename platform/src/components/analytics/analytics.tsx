import Script from 'next/script'

/**
 * Per-tenant analytics with Google Consent Mode v2 (default-deny). The cookie
 * banner flips consent to granted. GTM preferred; falls back to direct GA4.
 */
export function Analytics({
  gtmId,
  ga4Id,
}: {
  gtmId?: string | null
  ga4Id?: string | null
}) {
  if (!gtmId && !ga4Id) return null
  return (
    <>
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`,
        }}
      />
      {gtmId ? (
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
        `}</Script>
      ) : null}
      {!gtmId && ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">{`
            gtag('js',new Date());gtag('config','${ga4Id}');
          `}</Script>
        </>
      ) : null}
    </>
  )
}
