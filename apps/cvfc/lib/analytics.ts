/**
 * dataLayer event helper.
 *
 * Pushes are unconditional. Consent Mode v2 gates whether GTM tags act on
 * them, so gating here too would double-suppress and lose events that are
 * legitimately allowed once a visitor accepts.
 *
 * `Window.dataLayer` is declared globally in `lib/cookie-consent.ts`.
 */
export function trackEvent(
  event: string,
  params: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
