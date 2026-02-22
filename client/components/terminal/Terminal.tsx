'use client';

import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { TerminalSocket } from '@/lib/websocket/terminalSocket';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
    sessionId: string;
}

export default function Terminal({ sessionId }: TerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const socketRef = useRef<TerminalSocket | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;
            if (socketRef.current) return;
        console.log("Terminal useEffect running");

        // Init xterm
        const xterm = new XTerm({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: { background: '#1e1e1e', foreground: '#d4d4d4' },
            scrollback: 1000,
        });

        const fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);
        xterm.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = xterm;
        fitAddonRef.current = fitAddon;

        // Init WebSocket
        const socket = new TerminalSocket({
            sessionId,
            backendUrl: process.env.NEXT_PUBLIC_WS_URL!,
            onData: (data) => xterm.write(data),
            onClose: () => xterm.write('\r\n\x1b[31mConnection closed.\x1b[0m\r\n'),
            onError: () => xterm.write('\r\n\x1b[31mConnection error.\x1b[0m\r\n'),
        });

        socket.connect();
        socketRef.current = socket;

        // Keystrokes → WebSocket → SSH
        xterm.onData((data) => {
            socket.sendInput(data);
        });

        // Handle terminal resize
        const handleResize = () => {
            fitAddon.fit();
            socket.sendResize(xterm.cols, xterm.rows);
        };

        window.addEventListener('resize', handleResize);

        // Send initial dimensions once connected
        // Small delay to ensure WS is open
        setTimeout(() => {
            socket.sendResize(xterm.cols, xterm.rows);
        }, 300);

        return () => {
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            xterm.dispose();
        };
    }, [sessionId]);

    return (
        <div
            ref={terminalRef}
            style={{ width: '100%', height: '100%', background: '#1e1e1e' }}
        />
    );
}