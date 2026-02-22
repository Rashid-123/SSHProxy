import crypto from "crypto";

interface SessionData {
  privateKey: string;
  passphrase: string;
  userId: string;
  machineId: string;
  consumed: boolean;
  expiresAt: number;
}

type CreateSessionInput = Omit<SessionData, "consumed" | "expiresAt">;

const sessions = new Map<string, SessionData>();

const SESSION_TTL_MS = 90 * 1000; // 90 seconds

// Auto cleanup expired sessions every 60s
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(id);
    }
  }
}, 60 * 1000);

export const createSession = (
  sessionId: string,
  data: CreateSessionInput
): void => {
  console.log("-------- Creating session with ID: ", sessionId, " for user ", data.userId);
  sessions.set(sessionId, {
    ...data,
    consumed: false,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
};

export const getSession = (sessionId: string): SessionData | null => {
  const session = sessions.get(sessionId);

  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
};

export const consumeSession = (sessionId: string): SessionData | null => {
  console.log("-------- Consuming session with ID: ", sessionId);
  const session = getSession(sessionId);
   console.log("-------- Session retrieved for consumption: with ID: ", sessionId);
  if (!session) return null;

  // Reject if already consumed — no reuse
  if (session.consumed) {
    sessions.delete(sessionId);
    return null;
  }

  // Mark consumed immediately before returning
  session.consumed = true;

  // Schedule deletion — credentials cleared from memory after caller uses them
  setTimeout(() => {
    sessions.delete(sessionId);
  }, 0);

  return session;
};

export const deleteSession = (sessionId: string): void => {
  sessions.delete(sessionId);
};

export const getSessionCount = (): number => {
  return sessions.size;
};