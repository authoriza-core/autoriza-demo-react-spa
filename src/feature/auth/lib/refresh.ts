import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { OIDC_PROVIDER } from '../config/const';

// автоматическое обновление access_token
export async function refreshTokens(refreshToken: string) {
  const response = await axios.post(`${OIDC_PROVIDER}/token`, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const newTokens = response.data;

  // обновляем хранилище
  await tokenStorage.set(newTokens);

  return newTokens;
}
