import { Client, ConnectConfig } from "ssh2";

export interface SSHConnectionOptions {
  hostname: string;
  port: number;
  username: string;
  privateKey: string;
  passphrase?: string;
}

export interface TerminalDimensions {
  rows: number;
  cols: number;
}

export interface SSHShellResult {
  stream: any;
  client: Client;
}

export const createSSHShell = (
  options: SSHConnectionOptions,
  dimensions: TerminalDimensions,
  onData: (data: Buffer) => void,
  onClose: () => void,
  onError: (err: Error) => void
): Promise<SSHShellResult> => {

  return new Promise((resolve, reject) => {

    const client = new Client();
    console.log("-------- Connecting to SSH host ", options.hostname, " with username ", options.username);
    
    const connectConfig: ConnectConfig = {
      host: options.hostname,
      port: options.port,
      username: options.username,
      privateKey: options.privateKey,
      ...(options.passphrase && { passphrase: options.passphrase }),
      readyTimeout: 20000,
      keepaliveInterval: 10000,
    };

    client.on("ready", () => {
      client.shell(
        {
          term: "xterm-256color",
          rows: dimensions.rows,
          cols: dimensions.cols,
        },
        (err, stream) => {
          if (err) {
            client.end();
            return reject(err);
          }

          stream.on("data", (data: Buffer) => {
            console.log("-------- Data received from SSH stream: ", data.toString());
            onData(data);
          });

          stream.stderr.on("data", (data: Buffer) => {

            onData(data);
          });

          stream.on("close", () => {
            client.end();
            onClose();
          });

          resolve({ stream, client });
        }
      );
    });
    console.log("-------- SSH client connecting to ", options.hostname, " with username ", options.username);
    client.on("error", (err) => {
      onError(err);
      reject(err);
    });

    client.on("close", () => {
      onClose();
    });

    client.connect(connectConfig);
  });
};

export const resizeSSHShell = (stream: any, dimensions: TerminalDimensions) => {
  try {
    stream.setWindow(dimensions.rows, dimensions.cols, 0, 0);
  } catch (err) {
   
  }
};