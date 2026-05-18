import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForTokens } from "../feature/auth";
import { useAuthoriza } from '../feature/auth/ui/AuthorizaProvider';

// Компонент Callback — сюда возвращается пользователь после успешного логина в Authoriza.
// В URL есть параметры: ?code=...&state=...
// Наша задача: один раз (!) обменять code → access_token / refresh_token.
export default function Callback() {
  const navigate = useNavigate();
  const { setTokensFromCallback } = useAuthoriza();
  const [error, setError] = useState<string | null>(null);

  // React.StrictMode в dev дважды монтирует компонент.
  // Поэтому используем ref как флаг — чтобы гарантировать единственный вызов.
  const hasExchanged = useRef(false);

  useEffect(() => {
    // Если обмен уже был — выходим.
    if (hasExchanged.current) return;
    hasExchanged.current = true;

    // 1. Считываем параметры из URL (/callback?code=...&state=...)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // Читаем сохранённый state (создан в момент начала PKCE-авторизации)
    const savedState = sessionStorage.getItem("pkce_state");
    const returnedState = params.get("state");

    // 2. Проверка state — обязательная защита от CSRF-атак
    if (savedState !== returnedState) {
      console.error("Ошибка: state mismatch — возвращённое state не совпадает.");
      return;
    }

    // Достаём code_verifier, который мы ранее сохранили перед редиректом в Authoriza
    const codeVerifier = sessionStorage.getItem("pkce_verifier");
    if (!code || !codeVerifier) {
      console.error("Нет code или code_verifier — обмен невозможен.");
      return;
    }

    // 3. Выполняем обмен кода на токены
    (async () => {
      try {
        // Отправляем запрос в Authoriza /token
        const result = await exchangeCodeForTokens({
          code,
          codeVerifier,
          redirectUri: "http://localhost:5173/callback",
        });

        await setTokensFromCallback(result);

        // 4. После успешного обмена отправляем пользователя на домашнюю страницу
        navigate("/");
      } catch (err) {
        const errorString = "Ошибка при обмене code → tokens:"
        console.error("Ошибка при обмене code → tokens:", err);
        setError(`${errorString}${err instanceof Error ? err.message : err}`)
      }
    })();
  }, [navigate, setTokensFromCallback]);

  return (
    <div style={{ padding: 20 }}>
      {
        error || 'Завершаем вход через Authoriza...'
      }
    </div>
  );
}
