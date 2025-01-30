/// <reference types="vite/client" />

declare const __VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_WORLD_API_HTTP_URL: string;
  readonly VITE_WORLD_API_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
