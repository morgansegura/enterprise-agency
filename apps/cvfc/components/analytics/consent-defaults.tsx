/**
 * Google Consent Mode v2 — default-deny. A raw inline <script> in <head> so it
 * runs at parse time, before GTM loads, with no analytics/ad storage until the
 * visitor opts in via the cookie banner. (Inline beats next/script here: it
 * guarantees ordering and avoids the App-Router beforeInteractive caveat.)
 */
export function ConsentDefaults() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});gtag('set','ads_data_redaction',true);`,
      }}
    />
  );
}
