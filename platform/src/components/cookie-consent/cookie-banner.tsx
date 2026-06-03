'use client'

import React from 'react'

const KEY = 'cookie-consent-v1'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}
function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}
function getSnapshot() {
  return Boolean(localStorage.getItem(KEY))
}
// SSR: assume decided so the banner never flashes server-side.
function getServerSnapshot() {
  return true
}

/** Cookie banner that updates Google Consent Mode v2 + persists the choice. */
export function CookieBanner() {
  const decided = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  if (decided) return null

  function decide(granted: boolean) {
    const v = granted ? 'granted' : 'denied'
    window.gtag?.('consent', 'update', {
      ad_storage: v,
      analytics_storage: v,
      ad_user_data: v,
      ad_personalization: v,
    })
    localStorage.setItem(KEY, granted ? 'all' : 'necessary')
    emit()
  }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <p className="cookie-banner-text">
        We use cookies to analyze traffic and improve your experience.
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="button" onClick={() => decide(true)}>
          Accept all
        </button>
        <button
          type="button"
          className="cookie-banner-reject"
          onClick={() => decide(false)}
        >
          Reject
        </button>
      </div>
    </div>
  )
}
