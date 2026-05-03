// Генерация PKCE-пары: code_verifier и code_challenge
// Это обязательная часть современного безопасного OAuth2 в браузере.

export async function generatePKCE() {
  // создаём длинный случайный verifier
  const codeVerifier = crypto.randomUUID() + crypto.randomUUID();

  // считаем SHA256
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  // преобразуем в Base64URL (требование протокола)
  const base64Url = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return {
    codeVerifier,
    codeChallenge: base64Url,
  };
}
