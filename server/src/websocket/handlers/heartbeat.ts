import WebSocket from "ws";
import logger from "@/config/logger";
import { ActivityTracker } from "./terminalState";
import {
  HEARTBEAT_INTERVAL_MS,
  CLIENT_LIVENESS_TIMEOUT_MS,
  IDLE_DATA_TIMEOUT_MS,
} from "./terminalConfig";

export const startHeartbeat = (
  ws: WebSocket,
  tracker: ActivityTracker,
  closeConnection: (code: number, reason: string) => void,
  context: { userId: string; sessionId: string }
): NodeJS.Timeout => {
  return setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const now = Date.now();

    if (now - tracker.getLastSeenAt() > CLIENT_LIVENESS_TIMEOUT_MS) {
      logger.warn(context, "Terminal liveness timeout");
      closeConnection(4006, "client not responding");
      return;
    }

    if (now - tracker.getLastDataActivityAt() > IDLE_DATA_TIMEOUT_MS) {
      logger.info(context, "Terminal idle timeout");
      closeConnection(4008, "Terminal idle timeout");
      return;
    }

    ws.send(
      JSON.stringify({
        type: "heartbeat_ping",
        timestamp: now,
      })
    );
  }, HEARTBEAT_INTERVAL_MS);
};