/// <reference types="vite/client" />

import { SCOPE } from './src/feature/auth/config/const.ts';

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_OIDC_PROVIDER: string;
  readonly VITE_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
