import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "content-blocks/index": "src/content-blocks/index.ts",
    "container-blocks/index": "src/container-blocks/index.ts",
    "renderer/index": "src/renderer/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ["react", "next", "@enterprise/tokens", "@enterprise/ui"],
  treeshake: true,
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
