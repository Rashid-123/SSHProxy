export interface TerminalSocketOptions {
    sessionId: string;
    backendUrl: string;
    onData: (data: string) => void;
    onClose: () => void;
    onError: (err: Event) => void;
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
            this.options.onData(event.data);
        };

        this.ws.onclose = () => {
            console.log("WebSocket connection closed");
            this.options.onClose();
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