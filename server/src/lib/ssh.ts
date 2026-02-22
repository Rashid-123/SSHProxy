import { Client } from "ssh2";

export const connectSSH = (
  host: string,
  port: number,
  username: string,
  privateKey: string,
  passphrase?: string
): Promise<Client> => {
  return new Promise((resolve, reject) => {
    const client = new Client();

    client
      .on("ready", () => resolve(client))
      .on("error", reject)
      .connect({
        host,
        port,
        username,
        privateKey,
        passphrase,
      });
  });
};