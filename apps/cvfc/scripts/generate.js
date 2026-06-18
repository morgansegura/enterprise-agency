#!/usr/bin/env node
// Scaffold components / screens / pages in the WF conventions:
//   node scripts/generate.js component <group>/<name>
//   node scripts/generate.js feature <name>          (a components/feature/<name> block)
//   node scripts/generate.js screen <name>
//   node scripts/generate.js page <route>            (thin page → imports a screen)
// For a CMS-connected section (Payload block + registration + feature + binding),
// use the repo-root `bun run gen:block <name>` instead.
import fs from "node:fs";
import path from "node:path";

const c = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
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
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

function write(file, content) {
  if (fs.existsSync(file)) return log(`• exists ${file}`, "dim");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  log(`✓ ${file}`, "green");
}

function component(name, group) {
  const k = kebab(name);
  const P = pascal(name);
  const dir = path.join("components", group, k);
  write(
    path.join(dir, `${k}.tsx`),
    `import { cn } from '@/lib/utils'\n\nimport './${k}.css'\n\nexport function ${P}({ className }: { className?: string }) {\n  return <div className={cn('${k}', className)} />\n}\n`,
  );
  write(
    path.join(dir, `${k}.css`),
    `@reference "tailwindcss";\n\n.${k} {\n  @apply relative;\n}\n`,
  );
  write(path.join(dir, "index.ts"), `export { ${P} } from './${k}'\n`);
}

function screen(name) {
  const base = kebab(name).replace(/-screen$/, "");
  component(`${base}-screen`, "screen");
}

function page(route) {
  const clean = route.replace(/^\/+|\/+$/g, "");
  const screenName = (clean.split("/").pop() || "landing") + "-screen";
  const P = pascal(screenName);
  const file = path.join("app", clean, "page.tsx");
  write(
    file,
    `import { ${P} } from '@/components/screen/${kebab(screenName)}'\n\nexport default function Page() {\n  return <${P} />\n}\n`,
  );
}

const [kind, arg] = process.argv.slice(2);
if (!kind || !arg) {
  log(
    "usage: generate <component|feature|screen|page> <name|group/name|route>",
    "red",
  );
  process.exit(1);
}
if (kind === "component") {
  const [group, name] = arg.includes("/") ? arg.split("/") : ["ui", arg];
  component(name, group);
} else if (kind === "feature") component(arg, "feature");
else if (kind === "screen") screen(arg);
else if (kind === "page") page(arg);
else {
  log(`unknown kind: ${kind}`, "red");
  process.exit(1);
}
