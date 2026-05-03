# Authoriza React Demo (PKCE + Refresh Token)

Этот репозиторий — минимальный пример React-приложения, которое показывает, как подключить
ваше веб-приложение к сервису авторизации **Авториза** и выполнить:

* вход пользователя через OpenID Connect (Authorization Code + PKCE)
* получение `access_token` и `id_token`
* автоматическое обновление токенов через `refresh_token`
* отображение содержимого ID Token (claims)

---

# 🔐 Что такое Авториза?

**Авториза ([https://authoriza.ru/](https://authoriza.ru/))** — сервис аутентификации и
авторизации, который предоставляет простой и безопасный способ подключения авторизации
в веб-приложения. Совместим с OpenID Connect.

* локальная инфраструктура (сервера и разработка на территории РФ)
* OpenID Connect и OAuth2 совместимость (OIDC)
* поддержка PKCE + Refresh Token

Подходит для:

* стартапов и инди-разработчиков
* SaaS-сервисов
* Публичных информационных b2b и b2c систем 
* Внутренних систем с доступом во внешнюю сеть

---

# 🎯 Цель проекта

Показать, как:

1. Подключить SPA (React + Vite) к Авторизе.
2. Реализовать PKCE-поток и обработку `authorization_code`.
3. Хранить токены в IndexedDB (через `localforage`) вместо localStorage.
4. Автоматически обновлять `access_token`.
5. Отображать расшифрованный токен.

Этот пример подходит как стартовый шаблон.

---

# 📁 Структура проекта

### Основные элементы

| Файл                      | Функция                                                              |
|---------------------------|----------------------------------------------------------------------|
| **AuthorizaProvider.tsx** | Управляет состоянием аутентификации, хранением и обновлением токенов |
| **pkce.ts**               | Генерация пары `code_verifier` / `code_challenge`                    |
| **authorize.ts**          | Редирект на страницу логина Авторизы                                 |
| **callback.ts**           | Обмен `code` на токены                                               |
| **refresh.ts**            | Автоматическое обновление access_token                               |
| **tokenStorage.ts**       | Хранение токенов в IndexedDB                                         |
| **const.ts**              | Настройки подключения к Авторизе                                     |

---

# ⚙ Установка и запуск

```bash
npm install
npm run dev
```

Откройте:
**[http://localhost:5173](http://localhost:5173)**

---

# 🔧 Настройка подключения к Authoriza

## 1. Создайте приложение в кабинете Авторизы

Укажите:

* название приложения
* redirect_uri: `http://localhost:5173/callback`
* тип клиента: **Public**


## 2. Добавьте параметры в `src/feature/auth/config/const.ts`

> Для реальной разработки лучше использовать `.env`

```
export const CLIENT_ID = '2386ed26-7474-412c-ba51-d33d574eca07';
export const REDIRECT_URI = 'http://localhost:5173/callback';

/**  Редко изменяющиеся настройки. В большинстве случаев можно оставить как есть. */
export const OIDC_PROVIDER = 'https://oidc.authoriza.ru/oidc';
export const SCOPE = 'openid offline_access email profile';
```

Готово.
После этого:

* нажмите "Login"
* вас перекинет на страницу Авторизы
* после логина вы вернётесь на `/callback`
* SPA загрузит `access_token`, `id_token`, `refresh_token`
* автоматический refresh заработает сам
* на странице вы увидите содержимое токена

---

# 🧩 Поток авторизации (кратко)

Проект использует **Authorization Code Flow + PKCE**, как рекомендовано для SPA.

1. SPA → Генерирует PKCE (code_verifier + code_challenge)
2. SPA → Делает redirect на Авторизу
3. Авториза → Запрашивает логин пользователя
4. Авториза → Возвращает `code` в браузер
5. SPA → Обменивает `code` на:
   * `access_token`
   * `id_token`
   * `refresh_token`
6. SPA → Автоматически обновляет access_token при истечении срока действия

---

# 🧩 Мини-справка по OpenID Connect (в контексте Авторизы)

Авториза полностью соответствует OIDC Core Spec и использует стандартную модель токенов.

### 🔹 **ID Token**

* JWT, содержащий информацию о пользователе.
* Подписан сервером Авторизы.
* Используется для отображения профиля.

Примеры claim’ов:

* `sub` — уникальный идентификатор пользователя
* `email`
* `name`

### 🔹 **Access Token**

Используется для доступа к защищённым API вашего продукта.

Передаётся как заголовок запроса:

```
Authorization: Bearer <access_token>
```

### 🔹 **Refresh Token**

Позволяет обновлять access_token без нового логина.

Используется в SPA:

* *только в PKCE-потоке*
* хранить лучше в IndexedDB
* никогда не передаём в URL

### 🔹 Почему PKCE?

Потому что:

* implicit flow считается небезопасным
* PKCE исключает перехват authorization code
* не требует client_secret

Это стандарт для всех современных авторизационных систем.

---

# ❗ Разбор ошибок и способы отладки

### ❌ 1. Ошибка: `invalid_grant`

Значит:

* неверный `code_verifier`
* истёк срок действия `authorization_code`
* попытка повторного обмена `code`

**Проверить:** хранящийся в IndexedDB code_verifier.

---

### ❌ 2. Ошибка CORS

Проверьте, что redirect_uri в кабинете совпадает **1 в 1**:

* http/https
* порт
* отсутствие/наличие слэша

---

### ❌ 3. Страница callback загружается без токена

Значит:

* ваш клиент некорректно настроен
* неверный domain Authoriza

Проверьте параметры:

```
VITE_AUTHORIZA_DOMAIN=
VITE_AUTHORIZA_CLIENT_ID=
VITE_AUTHORIZA_REDIRECT_URI=
```

---

### ❌ 4. Refresh Token не обновляет access_token

Проверьте:

* включена ли выдача refresh token в кабинете
* refresh_token не истёк
* отправляется ли grant_type=refresh_token

---

### 🔍 Отладка

Запускайте devtools:

* вкладка Network → фильтр `token`
* вкладка Application → IndexedDB → localforage
* консоль: ошибки OIDC выводятся там же

---

# 🌐 Как указать redirect_uri в проде

Если вы разворачиваете приложение, например:

```
https://demo.yourdomain.ru
```

То ваш redirect_uri должен быть:

```
https://demo.yourdomain.ru/callback
```

По Этому адресу вы должны принимать запросы и обрабатывать аналогично тому как сделано здесь.
Укажите этот redirect_uri в **настройках приложения в Авторизе**, иначе запрос будет отклонён.

---

# 🔐 Security Guidelines

SPA — это уязвимая с точки зрения XSS среда. Поэтому:

## ✔ Токены храним в IndexedDB, а не localStorage

Потому что:

* localStorage → синхронен
* доступен при XSS мгновенно
* IndexedDB → сложнее украсть

localforage делает работу удобной.

---

## ✔ Refresh Token хранится только в браузере клиента

И:

* не передаётся по URL
* не пишется в localStorage
* не логируется в консоль

---

## ✔ Используйте HTTPS

Без HTTPS токены могут быть перехвачены.

---

## ✔ Никогда не вставляйте токен в HTML

Только:

* React state
* IndexedDB

---

## ✔ Проверяйте токены на бекенде

Access_token должен быть проверен по:

* подписи (JWKS)
* сроку жизни
* аудитам (aud)

---

# 🔧 Пример использования access_token на backend

Ниже — пример проверки токена вашего API, если front передаёт:

```
Authorization: Bearer <access_token>
```

---

## Node.js (jsonwebtoken)

```js
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://oidc.authoriza.ru/oidc/jwks"
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    callback(null, key.getPublicKey());
  });
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ["RS256"],
        audience: "your-api", // или CLIENT_ID
        issuer: "https://oidc.authoriza.ru/oidc/"
      },
      (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      }
    );
  });
}
```

---

## curl для тестирования API:

```bash
curl -H "Authorization: Bearer <access_token>" \
     https://api.yourservice.ru/me
```

---

## Python (PyJWT)

```python
import jwt
import requests

jwks = requests.get("https://oidc.authoriza.ru/oidc/.well-known/jwks.json").json()
decoded = jwt.decode(
    token,
    jwks,
    algorithms=["RS256"],
    audience="your-api",
    issuer="https://oidc.authoriza.ru/oidc/"
)
print(decoded)
```
