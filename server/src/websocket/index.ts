import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { authenticateWSUpgrade } from "./auth/wsAuth";
import { handleTerminalConnection } from "./handlers/terminalHandler";
import logger from "@/config/logger";

export const setupWebSocketServer = (server: HTTPServer) => {
  const wss = new WebSocketServer({ noServer: true });

  // Intercept HTTP upgrade requests
  server.on("upgrade", (req, socket, head) => {
    console.log("-------- Upgrade request received for ", req.url);
    // Only handle /terminal path
    const url = new URL(req.url!, `http://localhost`);
    if (url.pathname !== "/api/terminal") {
        console.warn("-------- Upgrade request for unsupported path: ", url.pathname);
      socket.destroy();
      return;
    }
    
    // Authenticate during upgrade — before connection is accepted
    let userId: string;
    try {
      const auth = authenticateWSUpgrade(req);
      userId = auth.userId;
    } catch (err) {
      logger.warn({ err }, "WebSocket auth failed during upgrade");
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
       
    console.log("-------- WebSocket authenticated for user ", userId);
    wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
      handleTerminalConnection(ws, req, userId);
    });
  });

  logger.info("WebSocket server attached");
};