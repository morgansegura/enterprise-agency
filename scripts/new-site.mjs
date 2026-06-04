#!/usr/bin/env node
// Scaffold a new client FE app from templates/site, wired to the central CMS.
//   node scripts/new-site.mjs <name> [--display "Name"] [--tenant slug] [--port 4011] [--cms http://localhost:4010]
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith("--"));
const flag = (f, d) => {
  const i = args.indexOf(`--${f}`);
  return i >= 0 ? args[i + 1] : d;
};

if (!name) {
  console.error(
    'usage: new-site <name> [--display "Name"] [--tenant slug] [--port 4011] [--cms url]',
  );
  process.exit(1);
}

const root = process.cwd();
const src = path.join(root, "templates", "site");
const dest = path.join(root, "apps", name);
if (!fs.existsSync(src)) {
  console.error(`template not found: ${src}`);
  process.exit(1);
}
if (fs.existsSync(dest)) {
  console.error(
    `apps/${name} already exists — pick another name or remove it.`,
  );
  process.exit(1);
}

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
const title = (s) =>
  kebab(s)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const SITE_NAME = kebab(name);
const tokens = {
  SITE_NAME,
  SITE_DISPLAY_NAME: flag("display", title(name)),
  PORT: flag("port", "4011"),
  TENANT_SLUG: flag("tenant", SITE_NAME),
  CMS_URL: flag("cms", "http://localhost:4010"),
};

const TEXT = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".md"]);
const isText = (f) =>
  TEXT.has(path.extname(f)) || path.basename(f) === ".gitignore";
const sub = (s) =>
  s.replace(/\{\{(\w+)\}\}/g, (_, k) => tokens[k] ?? `{{${k}}}`);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const f = path.join(from, e.name);
    const t = path.join(to, e.name);
    if (e.isDirectory()) copyDir(f, t);
    else if (isText(f)) fs.writeFileSync(t, sub(fs.readFileSync(f, "utf8")));
    else fs.copyFileSync(f, t);
  }
}

copyDir(src, dest);

console.log(`\n✓ Created apps/${name}`);
console.log(
  `  name=${tokens.SITE_NAME}  port=${tokens.PORT}  tenant=${tokens.TENANT_SLUG}  cms=${tokens.CMS_URL}`,
);
console.log(`\nNext:`);
console.log(`  cd apps/${name} && bun install`);
console.log(`  bun run dev          # http://localhost:${tokens.PORT}`);
console.log(
  `  (run apps/cms on :4010 + create a CMS tenant with slug "${tokens.TENANT_SLUG}" for live data)\n`,
);
