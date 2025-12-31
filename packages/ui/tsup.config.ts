import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/button/index": "src/components/button/index.ts",
    "components/heading/index": "src/components/heading/index.ts",
    "components/text/index": "src/components/text/index.ts",
    "utils/index": "src/utils/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "@radix-ui/react-slot"],
});
