import type { Context, Next } from "hono";
import { StatusCodes } from "http-status-codes";
import { verifyJwtToken } from "../utils/jwtUtils.ts";
import logger from "../utils/logger.ts";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(
      "Authentication failed - missing or invalid Authorization header"
    );
    return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyJwtToken(token);

  if (!payload) {
    logger.warn("Authentication failed - invalid token");
    return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
  }

  // Add the user ID to the context for use in route handlers
  c.set("userId", payload.userId);

  await next();
}
