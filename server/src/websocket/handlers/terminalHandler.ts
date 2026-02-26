
import WebSocket from "ws";
import { IncomingMessage } from "http";
import { createSSHShell } from "@/services/sshService";
import logger from "@/config/logger";
import { validateSessionOwnership, fetchMachine } from "./terminalValidation";
import { createActivityTracker } from "./terminalState";
import { startHeartbeat } from "./heartbeat";
import { handleClientMessage } from "./terminalMessageHandler";

export const handleTerminalConnection = async (
  ws: WebSocket,
  req: IncomingMessage,
  userId: string
) => {
  // -------------------- Parse Session ID -------------------------------------
  const url = new URL(req.url!, `http://localhost`);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    ws.close(4000, "Missing sessionId");
    return;
  }

  // ------------------------- Validate Session & Machine --------------------------------
  const session = await validateSessionOwnership(sessionId, userId, ws);
  if (!session) return;

  const machine = await fetchMachine(session.machineId, userId, ws);
  if (!machine) return;

  // -------------- State Setup ----------------------------------
  const tracker = createActivityTracker();
  const { privateKey, passphrase } = session;

  let sshStream: any = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;
  let closed = false;

  const cleanup = () => {
    if (closed) return;
    closed = true;

    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    if (sshStream) {
      sshStream.end();
      sshStream = null;
    }
  };

  const closeConnection = (code: number, reason: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close(code, reason);
    }
    cleanup();
  };

  // ----------------- SSH Connection -------------------------------------
  try {
    const { stream } = await createSSHShell(
      { hostname: machine.hostname, port: machine.port, username: machine.username, privateKey, passphrase },
      { rows: 24, cols: 80 },
      (data) => {
        tracker.markDataActivity();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data.toString());
        }
      },
      () => closeConnection(1000, "SSH connection closed"),
      (err) => {
        logger.error({ err }, "SSH error");
        closeConnection(1011, "SSH error");
      }
    );

    sshStream = stream;

    // ------------ HeartbeatInterval -------------------------------------------
    heartbeatInterval = startHeartbeat(ws, tracker, closeConnection, { userId, sessionId });

    // -------------- WebSocket Listeners ------------------------------------
    ws.on("message", (message: Buffer | string) => {
      handleClientMessage(message, sshStream, tracker);
    });

    ws.on("close", () => cleanup());

    ws.on("error", (err) => {
      logger.error({ err }, "WebSocket error");
      cleanup();
    });

  } catch (err) {
    logger.error({ err }, "Failed to establish SSH connection");
    closeConnection(1011, "Failed to connect to machine");
  }
};