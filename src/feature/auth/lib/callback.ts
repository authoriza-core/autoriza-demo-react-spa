import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { CLIENT_ID, OIDC_PROVIDER } from '../config/const';

// Обмен кода (из redirect) на access+refresh токены.
// Это главный запрос в OAuth2 PKCE flow.

export async function exchangeCodeForTokens({
  code,
  redirectUri,
  codeVerifier,
}: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}) {
  // отправляем POST /token на Authoriza
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", codeVerifier);

  const response = await axios({
    url: `${OIDC_PROVIDER}/token`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const tokens = response.data;

  // сохраняем токены в localforage
  await tokenStorage.set(tokens);

  return tokens;
}
