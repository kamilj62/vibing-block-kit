/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly TEST: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
