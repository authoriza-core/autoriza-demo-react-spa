import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { tokenStorage } from "../lib/tokenStorage";
import { refreshTokens } from "../lib/refresh";
import jwtDecode from "jwt-decode";

interface AuthContextState {
  tokens: any | null;
  user: any | null;              // декодированный id_token
  accessPayload: any | null;     // декодированный access_token
  isAuthenticated: boolean;
  logout: () => void;
  setTokensFromCallback: (t: any) => Promise<void>;
}

const AuthorizaContext = createContext<AuthContextState | null>(null);

export const AuthorizaProvider = ({ children }: any) => {
  const [tokens, setTokens] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [accessPayload, setAccessPayload] = useState<any | null>(null);

  const saveDecodedTokens = useCallback((tokens: any) => {
    if (!tokens) return;

    setTokens(tokens);

    // Декодируем id_token → профиль пользователя
    if (tokens.id_token) {
      try {
        setUser(jwtDecode(tokens.id_token));
      } catch (e) {
        console.warn("Не удалось декодировать id_token", e);
      }
    }

    // Декодируем access_token (обычно используется для бекенда)
    if (tokens.access_token) {
      try {
        setAccessPayload(jwtDecode(tokens.access_token));
      } catch (e) {
        console.warn("Не удалось декодировать access_token", e);
      }
    }
  }, [setAccessPayload])

  // Загружаем сохранённые токены при старте приложения
  useEffect(() => {
    tokenStorage.get().then(saveDecodedTokens);
  }, [saveDecodedTokens]);

  // --- Автообновление access_token по refresh_token ---
  useEffect(() => {
    // Без времени жизни и refresh_token — обновлять нечего
    if (!tokens?.expires_in || !tokens?.refresh_token) return;

    // Обновляем access_token за 60 сек до истечения
    const refreshDelay = (tokens.expires_in - 60) * 1000;

    const timer = setTimeout(async () => {
      const updated = await refreshTokens(tokens.refresh_token);
      saveDecodedTokens(updated);
    }, refreshDelay);

    return () => clearTimeout(timer);
  }, [tokens, saveDecodedTokens]);

  const logout = async () => {
    await tokenStorage.clear();
    setTokens(null);
    setUser(null);
    setAccessPayload(null);
  };

  const setTokensFromCallback = useCallback(async (newTokens: any) => {
    saveDecodedTokens(newTokens);
    await tokenStorage.set(newTokens);
  }, [setTokens, setUser]);

  return (
    <AuthorizaContext.Provider
      value={{
        tokens,
        user,
        accessPayload,
        isAuthenticated: !!tokens?.access_token,
        logout,
        setTokensFromCallback,
      }}
    >
      {children}
    </AuthorizaContext.Provider>
  );
};

export const useAuthoriza = () => useContext(AuthorizaContext)!;
