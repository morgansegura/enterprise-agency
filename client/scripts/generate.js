#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✓ Created directory: ${dirPath}`, "green");
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  log(`✓ Created file: ${filePath}`, "green");
}

// Component template
function generateComponentTemplate(componentName) {
  return `import { cn } from '@/lib/utils'
import './${toKebabCase(componentName)}.css'

type ${componentName}Props = {
  children?: React.ReactNode
  className?: string
}

export function ${componentName}({ children, className }: ${componentName}Props) {
  return (
    <div className={cn("${toKebabCase(componentName)}", className)}>
      {children}
    </div>
  )
}
`;
}

// Component CSS template
function generateComponentCSSTemplate(componentName) {
  return `
  @reference "tailwindcss";

  .${toKebabCase(componentName)} {
    @apply relative;
  }
`;
}

// Component index file template
function generateComponentIndexTemplate(componentName) {
  return `export { ${componentName} } from './${toKebabCase(componentName)}'
`;
}

// Page template
function generatePageTemplate(pageName, route) {
  const title = pageName
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title}",
  description: "${title} page for MH Bible Baptist Church.",
  openGraph: {
    title: "${title} | MH Bible Baptist Church",
    description: "${title} page for MH Bible Baptist Church.",
    url: "https://mhbiblebaptist.org${route}",
    siteName: "MH Bible Baptist Church",
    images: [
      {
        url: "https://mhbiblebaptist.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "${title} | MH Bible Baptist Church",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "${title} | MH Bible Baptist Church",
    description: "${title} page for MH Bible Baptist Church.",
    images: ["https://mhbiblebaptist.org/og-image.jpg"],
  },
};

export default function ${toPascalCase(pageName)}Page() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">${title}</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <p>
            ${title} content goes here.
          </p>
        </section>
      </div>
    </div>
  );
}
`;
}

// Generate component
function generateComponent(componentPath) {
  const parts = componentPath.split("/");
  const componentName = toPascalCase(parts[parts.length - 1]);
  const componentDir = path.join(
    process.cwd(),
    "components",
    ...parts.slice(0, -1),
    toKebabCase(parts[parts.length - 1]),
  );

  createDirectory(componentDir);

  // Create component file
  const componentFile = path.join(
    componentDir,
    `${toKebabCase(componentName)}.tsx`,
  );
  writeFile(componentFile, generateComponentTemplate(componentName));

  // Create CSS file
  const cssFile = path.join(componentDir, `${toKebabCase(componentName)}.css`);
  writeFile(cssFile, generateComponentCSSTemplate(componentName));

  // Create index file
  const indexFile = path.join(componentDir, "index.ts");
  writeFile(indexFile, generateComponentIndexTemplate(componentName));

  log(
    `\n${colors.bright}${colors.green}✓ Component "${componentName}" created successfully!${colors.reset}`,
    "bright",
  );
  log(
    `\nImport with: import { ${componentName} } from '@/components/${parts.join("/")}'\n`,
    "blue",
  );
}

// Generate page
function generatePage(pagePath) {
  const route = "/" + pagePath.replace(/\\/g, "/");
  const pageName = pagePath.split("/").pop();
  const pageDir = path.join(process.cwd(), "app", pagePath);

  createDirectory(pageDir);

  // Create page file
  const pageFile = path.join(pageDir, "page.tsx");
  writeFile(pageFile, generatePageTemplate(pageName, route));

  log(
    `\n${colors.bright}${colors.green}✓ Page created successfully!${colors.reset}`,
    "bright",
  );
  log(`\nRoute: ${route}`, "blue");
  log(`File: app/${pagePath}/page.tsx\n`, "blue");
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    log("Usage:", "yellow");
    log("  npm run generate component <path/to/component-name>", "blue");
    log("  npm run generate page <route/name>", "blue");
    log("\nExamples:", "yellow");
    log("  npm run generate component ui/button", "blue");
    log("  npm run generate component layout/header/nav-menu", "blue");
    log("  npm run generate page contact", "blue");
    log("  npm run generate page ministries/youth", "blue");
    process.exit(1);
  }

  const [type, ...pathParts] = args;
  const itemPath = pathParts.join(" ").trim();

  if (!itemPath) {
    log("Error: Please provide a name/path", "red");
    process.exit(1);
  }

  switch (type.toLowerCase()) {
    case "component":
    case "c":
      generateComponent(itemPath);
      break;
    case "page":
    case "p":
      generatePage(itemPath);
      break;
    default:
      log(`Error: Unknown type "${type}". Use "component" or "page"`, "red");
      process.exit(1);
  }
}

main();
