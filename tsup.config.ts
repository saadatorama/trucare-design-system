import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/components/design-system/index.ts",
    "lib/index": "src/lib/index.ts",
  },
  format: ["esm"],
  dts: {
    tsconfig: "tsconfig.build.json",
    compilerOptions: {
      jsx: "react-jsx",
      module: "ESNext",
      moduleResolution: "bundler",
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
      },
    },
  },
  splitting: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@tanstack/react-table",
    "@tanstack/react-virtual",
    "tailwindcss",
  ],
  esbuildOptions(options) {
    // Resolve @/ path alias at build time
    options.alias = {
      "@": "./src",
    }
  },
})
