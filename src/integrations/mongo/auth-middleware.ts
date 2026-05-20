import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getDb } from "./client.server";
import { verifyToken } from "./jwt.server";

export const requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const request = getRequest();
  const authHeader = request?.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing Bearer token");
  }
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) throw new Error("Unauthorized: empty token");

  let claims;
  try {
    claims = verifyToken(token);
  } catch {
    throw new Error("Unauthorized: invalid token");
  }

  const db = await getDb();
  return next({
    context: {
      db,
      userId: claims.sub,
      claims,
    },
  });
});
