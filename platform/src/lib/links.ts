/** True for hrefs that should open in a new tab (off-site, mail, tel). */
export function isExternalLink(href?: string | null): boolean {
  if (!href) return false
  return /^(https?:|mailto:|tel:)/i.test(href)
}
