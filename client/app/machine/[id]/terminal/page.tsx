
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import axios from 'axios';

type PageState = 'password' | 'connecting' | 'connected';

export default function TerminalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>('password');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    console.log("Attempting to connect with password: ", password)
    if (!password) return;

    setPageState('connecting');
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/machine/${id}/connect`,
        { password },
        { withCredentials: true }
      );

      setSessionId(res.data.sessionId);
      setPageState('connected');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to connect');
      setPageState('password');
    }
  };

  // Password modal
  if (pageState === 'password' || pageState === 'connecting') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
          <h2 className="text-lg font-semibold mb-1">Connect to Machine</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the password you used when adding this machine.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
            placeholder="Password"
            disabled={pageState === 'connecting'}
            className="w-full border rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            autoFocus
          />

          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => router.push(`/machine/${id}`)}
              disabled={pageState === 'connecting'}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={pageState === 'connecting' || !password}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {pageState === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Terminal — only mounts after sessionId is ready
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1e1e1e' }}>
      <Terminal sessionId={sessionId!} />
    </div>
  );
}