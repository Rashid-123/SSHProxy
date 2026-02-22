import { WebSocket } from "ws";
import prisma from "@/lib/prisma";
import { getSession, deleteSession } from "@/lib/sessionStore";
import { connectSSH } from "@/lib/ssh";

export const handleTerminalConnection = async (
  ws: WebSocket,
  sessionId: string
) => {
  const session = getSession(sessionId);

  if (!session) {
    ws.close();
    return;
  }

  deleteSession(sessionId); // 

  const machine = await prisma.machine.findUnique({
    where: { id: session.machineId },
  });

  if (!machine) {
    ws.close();
    return;
  }

  const sshClient = await connectSSH(
    machine.hostname,
    machine.port,
    machine.username,
    session.privateKey,
    session.passphrase
  );

  sshClient.shell((err, stream) => {
    if (err) {
      ws.close();
      return;
    }

    stream.on("data", (data: Buffer) => {
      ws.send(data.toString("utf8"));
    });

    ws.on("message", (msg : any) => {
      stream.write(msg.toString());
    });

    ws.on("close", () => {
      stream.end();
      sshClient.end();
    });
  });
};