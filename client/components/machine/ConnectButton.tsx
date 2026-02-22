'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ConnectButtonProps {
  machineId: string;
}

export default function ConnectButton({ machineId }: ConnectButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!password) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/machine/${machineId}/connect`,
        { password },
        { withCredentials: true }
      );

      const { sessionId } = res.data;

      // Store in sessionStorage — never in URL
      sessionStorage.setItem(`terminalSession_${machineId}`, sessionId);

      router.push(`/machine/${machineId}/terminal`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to connect');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
      >
        Connect
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Enter your password</h2>
            <p className="text-sm text-gray-500 mb-4">
              This is the password you used when adding this machine.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              placeholder="Password"
              className="w-full border rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />

            {error && (
              <p className="text-red-600 text-sm mb-3">{error}</p>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowModal(false); setPassword(''); setError(null); }}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={loading || !password}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}