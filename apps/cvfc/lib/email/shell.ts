/**
 * Email-safe HTML shell + helpers for CVFC transactional email.
 *
 * Email clients don't support modern CSS — these use tables, inline styles,
 * and hex colors (mirrors the site tokens in styles/globals.css). The site's
 * fonts don't load in mail clients, so we fall back to a clean system sans
 * stack to keep the same sans-serif character.
 *
 * Brand mark: the site crest is an inline SVG, which email clients can't
 * render reliably — so the header uses a typographic wordmark in the brand
 * style. When a hosted PNG of the crest exists, set `BRAND.crestUrl`.
 */

import { siteConfig } from "@/lib/site-config";

export const BRAND = {
  midnight: "#061c48",
  midnightMedium: "#253759",
  midnightBright: "#3f456c",
  gold: "#a08629",
  goldBright: "#b59f59",
  bone: "#f7f5ee",
  ink: "#0a0e2a",
  white: "#ffffff",
  /** Hosted PNG of the crest — set once a hosted asset exists. */
  crestUrl: "",
} as const;

/** System sans stack — matches the site's sans-serif character. */
export const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** HTML-escape a dynamic value before injecting it into email markup. */
export function esc(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Gold CTA button — compact, centered (table-based for client compatibility). */
export function emailButton(href: string, label: string): string {
  return `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:18px auto;">
          <tr>
            <td align="center" bgcolor="${BRAND.gold}" style="border-radius:4px;">
              <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:10px 22px;font-family:${FONT};font-size:13px;font-weight:bold;line-height:1;color:#ffffff;text-decoration:none;letter-spacing:0.04em;border-radius:4px;">${esc(label)}</a>
            </td>
          </tr>
        </table>`;
}

/** A label / value row for the coach detail table. */
export function infoRow(label: string, value: string): string {
  return `
          <tr>
            <td style="padding:9px 0;border-bottom:1px solid #ece8da;font-family:${FONT};font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.gold};width:42%;vertical-align:top;">${esc(label)}</td>
            <td style="padding:9px 0;border-bottom:1px solid #ece8da;font-family:${FONT};font-size:15px;color:${BRAND.midnight};vertical-align:top;">${esc(value)}</td>
          </tr>`;
}

/** Wordmark lockup used in the email header (sans, midnight, gold eyebrow). */
function brandLockup(): string {
  return `
                <div style="font-family:${FONT};font-size:24px;font-weight:700;letter-spacing:0.02em;color:${BRAND.midnight};">Chula Vista FC</div>
                <div style="width:36px;height:2px;background:${BRAND.gold};margin:12px auto 0;font-size:0;line-height:0;">&nbsp;</div>
                <div style="margin-top:12px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.gold};">Est. ${esc(siteConfig.foundingDate)} &middot; San Diego, California</div>`;
}

function footerHtml(): string {
  const { social, contact, motto, address, foundingDate } = siteConfig;
  const links = [
    ["Facebook", social.facebook],
    ["Instagram", social.instagram],
    ["YouTube", social.youtube],
  ]
    .map(
      ([label, href]) =>
        `<a href="${href}" target="_blank" style="color:${BRAND.white};text-decoration:none;font-family:${FONT};font-size:13px;">${label}</a>`,
    )
    .join(`<span style="color:#6f76a0;">&nbsp;&middot;&nbsp;</span>`);

  const addr = `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}`;

  return `
      <tr>
        <td bgcolor="${BRAND.midnightMedium}" style="padding:32px 36px;text-align:center;">
          <p style="margin:0 0 18px;font-family:${FONT};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:${BRAND.white};">${esc(motto)}</p>
          <div style="width:36px;height:1px;background:${BRAND.gold};margin:0 auto 18px;font-size:0;line-height:0;">&nbsp;</div>
          <p style="margin:0 0 14px;">${links}</p>
          <p style="margin:0 0 5px;font-family:${FONT};font-size:13px;color:#c9cee0;">
            <a href="mailto:${contact.email}" style="color:#c9cee0;text-decoration:none;">${contact.email}</a>
            &nbsp;&middot;&nbsp;
            <a href="tel:${contact.phone}" style="color:#c9cee0;text-decoration:none;">${contact.phone}</a>
          </p>
          <p style="margin:0;font-family:${FONT};font-size:11px;color:#b9c0d8;">${esc(addr)} &middot; Nonprofit 501(c)(3) since ${esc(foundingDate)}</p>
        </td>
      </tr>`;
}

/** Wrap body HTML in the branded CVFC email shell (wordmark header + footer). */
export function emailShell({
  previewText,
  bodyHtml,
}: {
  previewText: string;
  bodyHtml: string;
}): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${esc(siteConfig.name)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bone};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BRAND.bone};">${esc(previewText)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.bone};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid #ece8da;border-radius:12px;overflow:hidden;">
            <tr><td style="height:4px;background:${BRAND.gold};font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr>
              <td align="center" style="padding:34px 36px 26px;background:#ffffff;">
                ${brandLockup()}
              </td>
            </tr>
            <tr><td style="padding:0 36px;"><div style="border-top:1px solid #ece8da;font-size:0;line-height:0;">&nbsp;</div></td></tr>
            <tr>
              <td style="padding:48px 24px;font-family:${FONT};font-size:15px;line-height:1.6;color:#2c2c2c;">
                ${bodyHtml}
              </td>
            </tr>
            <tr><td style="height:12px;font-size:0;line-height:0;">&nbsp;</td></tr>
            ${footerHtml()}
          </table>
          <p style="margin:16px 0 0;font-family:${FONT};font-size:11px;color:#9a9a90;">You're receiving this email because you requested an evauation with  ${esc(siteConfig.name)}.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
