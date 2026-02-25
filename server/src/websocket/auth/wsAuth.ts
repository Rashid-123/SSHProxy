import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import { config } from "@/config/env";

export interface WSAuthResult {
  userId: string;
}

export const authenticateWSUpgrade = (req: IncomingMessage): WSAuthResult => {
  console.log("-------- Authenticating WebSocket upgrade ------");

  let token: string | undefined;

  //  Check Authorization Header (Bearer)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("Token found in Authorization header");
  }

  //  If not found, check cookies
  if (!token) {
    const cookieHeader = req.headers.cookie;

    if (cookieHeader) {
      const cookies = parseCookie(cookieHeader);
      token = cookies["auth_token"];

      if (token) {
        console.log("Token found in cookies");
      }
    }
  }

  //  If still no token
  if (!token) {
    console.warn("No token provided in header or cookies");
    throw new Error("Unauthorized: No token provided");
  }

  //  Verify token
  const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

  return { userId: decoded.userId };
};