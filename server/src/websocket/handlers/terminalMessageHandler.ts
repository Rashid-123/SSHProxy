import { ClientControlMessage } from "./terminalConfig";
import { ActivityTracker } from "./terminalState";
import { resizeSSHShell } from "@/services/sshService";

export const handleClientMessage = (
  message: Buffer | string,
  sshStream: any,
  tracker: ActivityTracker
) => {
  tracker.markSeen();

  const text = message.toString();

  try {
    const parsed = JSON.parse(text) as ClientControlMessage;

    if (parsed.type === "resize" && sshStream) {
      tracker.markDataActivity();
      resizeSSHShell(sshStream, { rows: parsed.rows, cols: parsed.cols });
      return;
    }

    if (parsed.type === "heartbeat_pong") {
      tracker.markSeen();
      return;
    }
  } catch {
    // Not JSON — raw terminal input, write directly to SSH
    tracker.markDataActivity();
    console.log(message.toString());
    if (sshStream) {
      sshStream.write(message);
    }
  }
};