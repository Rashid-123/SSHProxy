
export interface TerminalSocketOptions {
    sessionId: string;
    backendUrl: string;
    onData: (data: string) => void;
    onClose: (code?:number , reason?:string) => void;
    onError: (err: Event) => void;
}

interface ServerHeartbeatPing {
    type: 'heartbeat_ping';
    timestamp?: number;
}

export class TerminalSocket {
    private ws: WebSocket | null = null;
    

    constructor(private options: TerminalSocketOptions) { }

    connect() {
        // console.log("Connecting to WebSocket with sessionId: ", this.options.sessionId);
        const url = `${this.options.backendUrl}/api/terminal?sessionId=${this.options.sessionId}`;
        this.ws = new WebSocket(url);

        // Receive data from SSH (via backend) — write to xterm
        this.ws.onmessage = (event) => {
            console.log("Received data from WebSocket: ", event.data);

            if (typeof event.data === 'string') {
                try {
                    const parsed = JSON.parse(event.data) as ServerHeartbeatPing;

                    if (parsed.type === 'heartbeat_ping') {
                        this.ws?.send(JSON.stringify({
                            type: 'heartbeat_pong',
                            timeStamp: Date.now(),
                        }));
                        return;
                    }

                } catch {

                }

                this.options.onData(event.data);
                return;
            }

            this.options.onData(event.data);
        };

        this.ws.onclose = (event) => {
            console.log("WebSocket connection closed");
            this.options.onClose(event.code, event.reason);
        };

        this.ws.onerror = (err) => {
            console.error("WebSocket error: ", err);
            this.options.onError(err);
        };
    }

    // Send raw keystrokes to SSH
    sendInput(data: string) {
        console.log("Sending input to WebSocket: ", data);
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(data);
        }
    }

    // Send resize event as JSON — backend distinguishes this from raw input
    sendResize(cols: number, rows: number) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "resize", cols, rows }));
        }
    }

    disconnect() {
        this.ws?.close();
        this.ws = null;
    }
}