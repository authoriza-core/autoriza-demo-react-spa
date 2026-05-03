import { useAuthoriza } from "../feature/auth/ui/AuthorizaProvider";
import { login } from '../shared/lib/login';
import TokenViewer from '../shared/ui/TokenViewer';

// Главная страница с простыми ссылками
export default function Home() {
  const {
    isAuthenticated,
    tokens,
    accessPayload,
    user,
    logout,
  } = useAuthoriza();

  return (
    <div style={{ padding: 20 }}>
      <h1>Authoriza Demo</h1>

      {isAuthenticated ? (
        <>
          <p>Вы вошли.</p>
          <h2>Профиль</h2>

          <h3>ID Token (payload):</h3>
          <TokenViewer data={user} />

          <h3>Access Token (payload):</h3>
          <TokenViewer data={accessPayload} />

          <h3>Raw tokens:</h3>
          <TokenViewer data={tokens} />

          <button onClick={logout}>Выйти</button>
        </>
      ) : (
        <>
          <p>Вы не авторизованы.</p>
          <div>
            {/* По клику начинаем PKCE flow */}
            <button onClick={login}>Войти через Authoriza</button>
          </div>
        </>
      )}
    </div>
  );
}
