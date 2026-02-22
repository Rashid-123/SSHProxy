import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import { config } from "@/config/env";

export interface WSAuthResult {
  userId: string;
}

export const authenticateWSUpgrade = (req: IncomingMessage): WSAuthResult => {
  const cookieHeader = req.headers.cookie;
  console.log("-------- Authenticating WebSocket upgrade ------");

  if (!cookieHeader) {
    console.warn("-------- No cookie header in WebSocket upgrade request");
    throw new Error("No cookie header");
  }

  const cookies = parseCookie(cookieHeader);
  const token = cookies["auth_token"];

  if (!token) {
    throw new Error("No auth token in cookies");
  }

  const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

  return { userId: decoded.userId };
};