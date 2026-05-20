import { createMiddleware } from "@tanstack/react-start";
import { getToken } from "./auth-client";

// Attaches Bearer token to every server function call from the browser.
// Must be registered as a global functionMiddleware in src/start.ts.
export const attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const token = getToken();
  return next({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
});
