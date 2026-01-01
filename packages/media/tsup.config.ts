import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "types/index": "src/types/index.ts",
    "primitives/index": "src/primitives/index.ts",
    "primitives/image/index": "src/primitives/image/index.ts",
    "primitives/video/index": "src/primitives/video/index.ts",
    "lightbox/index": "src/lightbox/index.ts",
    "library/index": "src/library/index.ts",
    "hooks/index": "src/hooks/index.ts",
    "utils/index": "src/utils/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@tanstack/react-query",
    "@enterprise/tokens",
  ],
  treeshake: true,
  minify: false,
});
