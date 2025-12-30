import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "architecture/index": "src/architecture/index.ts",
    "primitives/index": "src/primitives/index.ts",
    "semantic/index": "src/semantic/index.ts",
    "components/index": "src/components/index.ts",
    "ui/index": "src/ui/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
