import { BrowserRouter } from "react-router-dom";
import { AuthorizaProvider } from "./feature/auth";
import { AppRouter } from "./router";

// Оборачиваем приложение в Router + наш Auth-контекст.
// Именно AuthorizaProvider управляет токенами, refresh, логином и разлогином.
export default function App() {
  return (
    <AuthorizaProvider>
      <BrowserRouter>
          <AppRouter />
      </BrowserRouter>
    </AuthorizaProvider>
  );
}
