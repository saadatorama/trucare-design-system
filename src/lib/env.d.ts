// Type declarations for import.meta.env (Vite runtime)
// This file allows the library build to compile without vite/client types
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
