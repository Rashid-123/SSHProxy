import WebSocket from "ws";
import { consumeSession } from "@/lib/sessionStore";
import prisma from "@/lib/prisma";

export const validateSessionOwnership = async (
  sessionId: string,
  userId: string,
  ws: WebSocket
) => {
  const session = await consumeSession(sessionId);

  if (!session) {
    ws.close(4001, "Invalid or expired session");
    return null;
  }

  if (session.userId !== userId) {
    ws.close(4003, "Session does not belong to this user");
    return null;
  }

  return session;
};

export const fetchMachine = async (
  machineId: string,
  userId: string,
  ws: WebSocket
) => {
  const machine = await prisma.machine.findFirst({
    where: { id: machineId, ownerId: userId },
    select: { hostname: true, port: true, username: true },
  });

  if (!machine) {
    ws.close(4004, "Machine not found");
    return null;
  }

  return machine;
};