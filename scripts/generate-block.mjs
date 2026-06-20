#!/usr/bin/env node
// Scaffold a CMS-connected section in one shot:
//   • Payload block schema      → apps/cms/src/blocks/<Name>.ts
//   • register it               → apps/cms/src/collections/Pages.ts (layout.blocks)
//   • typed FE feature          → apps/<tenant>/components/feature/<name>/
//   • FE mapper                 → apps/<tenant>/lib/cms-blocks.ts (fallback-safe)
//   • bind + seed hints         → printed for the screen
//
//   bun run gen:block <name> [tenant=cvfc]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const c = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
};
const log = (m, col = "reset") => console.log(`${c[col]}${m}${c.reset}`);

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
const pascal = (s) =>
  kebab(s)
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
const camel = (s) => {
  const p = pascal(s);
  return p[0].toLowerCase() + p.slice(1);
};
const title = (s) =>
  kebab(s)
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const [rawName, tenant = "cvfc"] = process.argv.slice(2);
if (!rawName) {
  log("usage: bun run gen:block <name> [tenant=cvfc]", "red");
  process.exit(1);
}

const k = kebab(rawName);
const P = pascal(rawName);
const slug = camel(rawName);
const T = title(rawName);

function write(file, content) {
  if (fs.existsSync(file)) {
    log(`• exists ${path.relative(ROOT, file)}`, "dim");
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  log(`✓ ${path.relative(ROOT, file)}`, "green");
}

// 1) Payload block schema
write(
  path.join(ROOT, "apps/cms/src/blocks", `${P}.ts`),
  `import type { Block } from 'payload'

export const ${P}: Block = {
  slug: '${slug}',
  labels: { singular: '${T}', plural: '${T}s' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
  ],
}
`,
);

// 2) Register in Pages.ts (import + layout.blocks array)
const pagesFile = path.join(ROOT, "apps/cms/src/collections/Pages.ts");
let pages = fs.readFileSync(pagesFile, "utf8");
if (pages.includes(`blocks/${P}'`)) {
  log(`• ${P} already registered in Pages.ts`, "dim");
} else {
  const importRe = /import \{[^}]+\} from '\.\.\/blocks\/[^']+'\n/g;
  let m;
  let last;
  while ((m = importRe.exec(pages))) last = m;
  if (last) {
    const at = last.index + last[0].length;
    pages =
      pages.slice(0, at) +
      `import { ${P} } from '../blocks/${P}'\n` +
      pages.slice(at);
  }
  pages = pages.replace(
    /(blocks:\s*\[)([^\]]*)(\])/,
    (_, open, items, close) => {
      const list = items.trim() ? `${items.replace(/\s+$/, "")}, ${P}` : P;
      return `${open}${list}${close}`;
    },
  );
  fs.writeFileSync(pagesFile, pages);
  log(`✓ registered ${P} in Pages.ts layout.blocks`, "green");
}

// 3) Typed FE feature (props match the block fields)
const featDir = path.join(ROOT, "apps", tenant, "components/feature", k);
write(
  path.join(featDir, `${k}.tsx`),
  `import { cn } from "@/lib/utils";

import "./${k}.css";

export type ${P}Props = {
  className?: string;
  heading?: string;
  body?: string;
};

export function ${P}({ className, heading, body }: ${P}Props) {
  return (
    <section className={cn("${k}", className)}>
      {heading ? <h2 className="${k}-heading">{heading}</h2> : null}
      {body ? <p className="${k}-body">{body}</p> : null}
    </section>
  );
}
`,
);
write(
  path.join(featDir, `${k}.css`),
  `@reference "tailwindcss";

.${k} {
  @apply relative;
}
`,
);
write(
  path.join(featDir, "index.ts"),
  `export { ${P}, type ${P}Props } from "./${k}";\n`,
);

// 4) FE mapper in lib/cms-blocks.ts (fallback-safe: empty CMS → feature defaults)
const cmsBlocksFile = path.join(ROOT, "apps", tenant, "lib/cms-blocks.ts");
const mapperFn = `
export function ${slug}FromPage(page: Page | null) {
  const b = blockOf(page, "${slug}");
  if (!b) return undefined;
  return {
    heading: str(b.heading),
    body: str(b.body),
  };
}
`;
if (fs.existsSync(cmsBlocksFile)) {
  const existing = fs.readFileSync(cmsBlocksFile, "utf8");
  if (existing.includes(`${slug}FromPage`)) {
    log(`• ${slug}FromPage already in cms-blocks.ts`, "dim");
  } else {
    fs.writeFileSync(cmsBlocksFile, `${existing.trimEnd()}\n${mapperFn}`);
    log(`✓ added ${slug}FromPage mapper to lib/cms-blocks.ts`, "green");
  }
} else {
  write(
    cmsBlocksFile,
    `import { blockOf, type Page } from "@/lib/cms";

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v : undefined;
${mapperFn}`,
  );
}

// 5) Next steps
log(`\nNext steps:`, "cyan");
log(`  1. bun --cwd apps/cms run generate:types`, "dim");
log(
  `  2. Flesh out fields in apps/cms/src/blocks/${P}.ts + the ${slug}FromPage mapper`,
  "dim",
);
log(`  3. Bind in the screen (async server component):`, "dim");
log(`       const ${slug} = ${slug}FromPage(page);`, "dim");
log(`       <${P} {...${slug}} />`, "dim");
log(
  `  4. Seed content: add a ${slug} block to apps/cms/src/seed/${tenant}.ts`,
  "dim",
);
