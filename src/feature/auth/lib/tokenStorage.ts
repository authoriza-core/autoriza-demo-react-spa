import localforage from "localforage";

// отдельный слой чтобы гибко менять стратегию хранения токена
// localforage = IndexedDB (безопаснее чем localStorage)
export const tokenStorage = {
  get: () => localforage.getItem<any>("tokens"),
  set: (tokens: any) => localforage.setItem("tokens", tokens),
  clear: () => localforage.removeItem("tokens")
};
