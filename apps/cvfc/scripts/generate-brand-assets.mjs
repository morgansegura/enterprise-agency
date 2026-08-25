// Build the downloadable brand kit served at /brand from the one crest that
// ships in the app (components/layout/logo-icon). The component is the master:
// re-run `bun run gen:brand-assets` after any crest change so the files partners
// download can never drift from the crest the site renders.
//
// Output → public/brand/ : the crest, a keylined version for dark backgrounds,
// and a grayscale version — as SVG plus PNGs at several sizes — a square navy
// avatar, and the zip the page links as "download all".

import { execFile } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import sharp from "sharp";

const run = promisify(execFile);
const out = (msg) => process.stdout.write(`${msg}\n`);

const SOURCE = "components/layout/logo-icon/logo-icon.tsx";
const DEST = "public/brand";

// Mirrors the fills in logo-icon.css. Kept here as literals because a
// downloaded file can't resolve a CSS custom property.
const CREST_COLORS = {
  "logo-color-1": "#ffffff",
  "logo-color-2": "#141d45",
  "logo-color-3": "#b59f59",
  "logo-color-4": "#0284c7",
};

// Newsprint / single-color reproduction: same artwork, tonal separation kept.
const GRAYSCALE = {
  "#141d45": "#1c1c1c",
  "#0284c7": "#7a7a7a",
  "#b59f59": "#9a9a9a",
};

const NAVY = "#061c48";

/** The crest JSX → a standalone, self-describing SVG file. */
function crestSvg() {
  const src = readFileSync(SOURCE, "utf8");
  const body = src.slice(src.indexOf("<svg"), src.indexOf("</svg>") + 6);

  const markup = body
    .replace(/\s+className=\{[^}]*\}/g, "")
    .replace(/\s+(role|aria-hidden|id|data-name)="[^"]*"/g, "")
    .replace(
      /className="(logo-color-\d)"/g,
      (_, token) => `fill="${CREST_COLORS[token]}"`,
    )
    .replace(
      /<svg\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/,
      `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title"`,
    )
    .replace(/>/, `>\n  <title id="title">Chula Vista FC crest</title>`);

  // The JSX carried its own indentation; re-flow it so the file reads cleanly
  // when a partner opens it in an editor or Illustrator.
  const lines = markup
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return `${lines
    .map((line, i) =>
      i === 0 || line.startsWith("</svg") ? line : `  ${line}`,
    )
    .join("\n")}\n`;
}

/**
 * On dark backgrounds the crest's navy edge merges into the page. Knock the
 * outermost circle — and only that one — to white: a thin keyline, the same
 * ring the header logo carries. Anything wider becomes a different logo.
 */
const onDark = (svg) =>
  svg.replace(
    `<circle fill="${CREST_COLORS["logo-color-2"]}" cx="481.54" cy="481.54" r="481.54" />`,
    `<circle fill="#ffffff" cx="481.54" cy="481.54" r="481.54" />`,
  );

const grayscale = (svg) =>
  Object.entries(GRAYSCALE).reduce(
    (acc, [from, to]) => acc.replaceAll(from, to),
    svg,
  );

const png = (svg, size, file) =>
  sharp(Buffer.from(svg), { density: 600 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(path.join(DEST, file));

/** Square, padded, navy-backed crest — profile pictures and partner decks. */
async function avatar(svg, size, file) {
  const inset = Math.round(size * 0.78);
  const crest = await sharp(Buffer.from(svg), { density: 600 })
    .resize(inset, inset, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const offset = Math.round((size - inset) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: NAVY,
    },
  })
    .composite([{ input: crest, top: offset, left: offset }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(DEST, file));
}

async function main() {
  rmSync(DEST, { recursive: true, force: true });
  mkdirSync(DEST, { recursive: true });

  const primary = crestSvg();
  const dark = onDark(primary);
  const gray = grayscale(primary);

  writeFileSync(path.join(DEST, "cvfc-crest.svg"), primary);
  writeFileSync(path.join(DEST, "cvfc-crest-on-dark.svg"), dark);
  writeFileSync(path.join(DEST, "cvfc-crest-grayscale.svg"), gray);

  await Promise.all([
    png(primary, 512, "cvfc-crest-512.png"),
    png(primary, 1024, "cvfc-crest-1024.png"),
    png(primary, 2048, "cvfc-crest-2048.png"),
    png(dark, 512, "cvfc-crest-on-dark-512.png"),
    png(dark, 1024, "cvfc-crest-on-dark-1024.png"),
    png(gray, 1024, "cvfc-crest-grayscale-1024.png"),
    // The avatar is the dark-background crest, so its keyline reads on navy.
    avatar(dark, 1024, "cvfc-crest-avatar-1024.png"),
  ]);

  // `zip` ships with macOS/Linux; the kit is built by hand, not in CI.
  const files = readdirSync(DEST).sort();
  await run("zip", [
    "-j",
    "-q",
    path.join(DEST, "cvfc-brand-kit.zip"),
    ...files.map((f) => path.join(DEST, f)),
  ]);

  for (const file of readdirSync(DEST).sort()) out(`  ${file}`);
  out(`\nbrand kit written to ${DEST}/`);
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`);
  process.exit(1);
});
