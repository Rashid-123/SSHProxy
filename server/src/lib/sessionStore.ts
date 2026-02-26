
import { redisClient, connectRedis } from "@/config/redisClient";

interface SessionData {
  privateKey: string;
  passphrase: string;
  userId: string;
  machineId: string;
  consumed: boolean;
}

type CreateSessionInput = Omit<SessionData, "consumed">;
const SESSION_TTL_SECOND = 90;

/**
 * Ensures Redis is ready before every command. 
 * Prevents "Client is closed" errors during server cold-starts or blips.
 */
const ensureConnected = async () => {
  if (!redisClient.isOpen) {
    await connectRedis();
  }
};

export const createSession = async (sessionId: string, data: CreateSessionInput): Promise<void> => {
  await ensureConnected();
  const session: SessionData = { ...data, consumed: false };
  
  await redisClient.set(`session:${sessionId}`, JSON.stringify(session), {
    EX: SESSION_TTL_SECOND,
  });
};

export const getSession = async (sessionId: string): Promise<SessionData | null> => {
  await ensureConnected();
  const data = await redisClient.get(`session:${sessionId}`);
  if (!data) return null;
  return JSON.parse(data) as SessionData;
};

export const consumeSession = async (sessionId: string): Promise<SessionData | null> => {
  await ensureConnected();
  const key = `session:${sessionId}`;
  const data = await redisClient.get(key);
  
  if (!data) return null;

  const session: SessionData = JSON.parse(data);
  if (session.consumed) {
    await redisClient.del(key);
    return null;
  }

  session.consumed = true;
  await redisClient.set(key, JSON.stringify(session), { EX: 5 });
  return session;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await ensureConnected();
  await redisClient.del(`session:${sessionId}`);
};

export const getSessionCount = async (): Promise<number> => {
  await ensureConnected();
  const keys = await redisClient.keys("session:*");
  return keys.length;
};