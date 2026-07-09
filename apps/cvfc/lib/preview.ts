/** Cookie the preview render reads to target Live Preview messages at the exact
 *  CMS origin (deterministic — no browser-dependent origin guessing). Set by
 *  /api/preview, read by the block renderer. */
export const CMS_ORIGIN_COOKIE = "cms-preview-origin";
