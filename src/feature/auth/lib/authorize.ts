// Функция делает redirect на страницу Авториза,
// передавая PKCE challenge и нужные параметры OIDC.

import { CLIENT_ID, OIDC_PROVIDER, REDIRECT_URI, SCOPE } from '../config/const';

export function redirectToAuthorizaAuth({
  codeChallenge,
}: {
  codeChallenge: string;
}) {
  const state = crypto.randomUUID(); // рандомный state для защиты
  sessionStorage.setItem("pkce_state", state);

  const url = new URL(`${OIDC_PROVIDER}/auth`);

  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPE);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);

  // отправляем пользователя на страницу логина Authoriza
  window.location.href = url.toString();
}
