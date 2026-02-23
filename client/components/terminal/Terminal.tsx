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
    const resizeHandlerRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        let cancelled = false;

        const init = () => {
            if (cancelled) return;
            if (!terminalRef.current) return;

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

            const socket = new TerminalSocket({
                sessionId,
                backendUrl: process.env.NEXT_PUBLIC_WS_URL!,
                onData: (data) => xterm.write(data),
                onClose: () => xterm.write('\r\n\x1b[31mConnection closed.\x1b[0m\r\n'),
                onError: () => xterm.write('\r\n\x1b[31mConnection error.\x1b[0m\r\n'),
            });

            socket.connect();
            socketRef.current = socket;

            xterm.onData((data) => socket.sendInput(data));

            const handleResize = () => {
                fitAddon.fit();
                socket.sendResize(xterm.cols, xterm.rows);
            };

            window.addEventListener('resize', handleResize);
            resizeHandlerRef.current = handleResize;

            setTimeout(() => {
                socket.sendResize(xterm.cols, xterm.rows);
            }, 300);
        };

        const timer = setTimeout(init, 100);

        return () => {
            cancelled = true;
            clearTimeout(timer);

            if (resizeHandlerRef.current) {
                window.removeEventListener('resize', resizeHandlerRef.current);
                resizeHandlerRef.current = null;
            }

            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            if (xtermRef.current) {
                xtermRef.current.dispose();
                xtermRef.current = null;
            }

            fitAddonRef.current = null;
        };
    }, [sessionId]);

    return (
        <div
            ref={terminalRef}
            style={{ width: '100%', height: '100%', background: '#1e1e1e' }}
        />
    );
}