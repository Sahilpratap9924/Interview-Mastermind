const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const listeners = /* @__PURE__ */ new Set();
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  listeners.forEach((l) => l(user));
}
function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  listeners.forEach((l) => l(null));
}
function onAuthChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export {
  getStoredUser as a,
  clearSession as c,
  getToken as g,
  onAuthChange as o,
  setSession as s
};
