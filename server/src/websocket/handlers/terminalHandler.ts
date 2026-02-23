import WebSocket from "ws";
import { IncomingMessage } from "http";
import { consumeSession } from "@/lib/sessionStore";
import { createSSHShell, resizeSSHShell } from "@/services/sshService";
import prisma from "@/lib/prisma";
import logger from "@/config/logger";

interface ResizeMessage {
  type: "resize";
  cols: number;
  rows: number;
}

export const handleTerminalConnection = async (
  ws: WebSocket,
  req: IncomingMessage,
  userId: string
) => {

  const url = new URL(req.url!, `http://localhost`);
  const sessionId = url.searchParams.get("sessionId");

  console.log("-------- Handling terminal connection, sessionId: ", sessionId, " for user ", userId);

  if (!sessionId) {
    console.log("-------- No sessionId provided in WebSocket connection");
    ws.close(4000, "Missing sessionId");
    return;
  }

  // Consume session — validates ownership + marks as used
  const session = consumeSession(sessionId);
  
  console.log("-------- Session consumed: for sessionId ", sessionId);
  if (!session) {
    ws.close(4001, "Invalid or expired session");
    return;
  }

  // Cross-check: session must belong to the authenticated user
  if (session.userId !== userId) {
    ws.close(4003, "Session does not belong to this user");
    return;
  }

  // Fetch machine details (hostname, port, username)
  const machine = await prisma.machine.findFirst({
    where: { id: session.machineId, ownerId: userId },
    select: { hostname: true, port: true, username: true },
  });

  if (!machine) {
    ws.close(4004, "Machine not found");
    return;
  }

  // Capture credentials before they're cleared
  const privateKey = session.privateKey;
  const passphrase = session.passphrase;

  let sshStream: any = null;

  try {
    console.log("-------- Establishing SSH connection to ", machine.hostname, " for user ", userId);
    const { stream } = await createSSHShell(
      {
        hostname: machine.hostname,
        port: machine.port,
        username: machine.username,
        privateKey,
        passphrase,
      },
      { rows: 24, cols: 80 }, // default — client will send resize immediately
      (data) => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log("-------- Sending data to WebSocket (frontend): ", data);
          ws.send(data.toString());
        }
      },
      () => {
        // SSH closed
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, "SSH connection closed");
        }
      },
      (err) => {
        logger.error({ err }, "SSH error");
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1011, "SSH error");
        }
      }
    );
     
    console.log("-------- SSH connection established for ", machine.hostname, " user ", userId);
    sshStream = stream;

    ws.on("message", (message: Buffer | string) => {
      try {
        // Try to parse as JSON for control messages (resize)
        const text = message.toString();
        const parsed = JSON.parse(text) as ResizeMessage;

        if (parsed.type === "resize" && sshStream) {
          console.log("-------- Resizing SSH shell to cols: ", parsed.cols, " rows: ", parsed.rows);
          resizeSSHShell(sshStream, { rows: parsed.rows, cols: parsed.cols });
        }
      } catch {
        // Not JSON — raw terminal input, write directly to SSH
        console.log("-------- Received message from WebSocket (frontend), writing to SSH stream", message.toString());
        if (sshStream) {
          sshStream.write(message);
        }
      }
    });

    ws.on("close", () => {
      if (sshStream) {
        sshStream.end();
        sshStream = null;
      }
    });

    ws.on("error", (err) => {
      logger.error({ err }, "WebSocket error");
      if (sshStream) {
        sshStream.end();
        sshStream = null;
      }
    });
  } catch (err) {
    logger.error({ err }, "Failed to establish SSH connection");
    ws.close(1011, "Failed to connect to machine");
  }
};