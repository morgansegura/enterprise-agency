import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    // App code logs through `lib/logger` so production output stays structured.
    rules: { "no-console": "error" },
  },
  {
    // CLI scripts and the logger's own transport write to the console directly.
    files: ["scripts/**", "lib/logger.ts"],
    rules: { "no-console": "off" },
  },
]);

export default eslintConfig;
