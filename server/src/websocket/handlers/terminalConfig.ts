export const HEARTBEAT_INTERVAL_MS = 10_000;
export const CLIENT_LIVENESS_TIMEOUT_MS = 30_000;
export const IDLE_DATA_TIMEOUT_MS = 1 * 60_000;

export interface ResizeMessage {
  type: "resize";
  cols: number;
  rows: number;
}

export interface HeartbeatPongMessage {
  type: "heartbeat_pong";
  timestamp?: number;
}

export type ClientControlMessage = ResizeMessage | HeartbeatPongMessage;