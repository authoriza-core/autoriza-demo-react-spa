/**  Индивидуальные настройки для проекта */
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
  || '2386ed26-7474-412c-ba51-d33d574eca07';
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
  || 'http://localhost:5173/callback';

/**  Редко изменяющиеся настройки. В большинстве случаев можно оставить как есть. */
export const OIDC_PROVIDER = import.meta.env.VITE_OIDC_PROVIDER
  || 'https://oidc.authoriza.ru/oidc';
export const SCOPE = import.meta.env.VITE_SCOPE
  || 'openid offline_access email profile';
