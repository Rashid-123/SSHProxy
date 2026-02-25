'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Terminal from '@/components/terminal/Terminal';
import axios from 'axios';
import { Terminal as TerminalIcon, Lock, AlertCircle } from 'lucide-react';

type PageState = 'password' | 'connecting' | 'connected';

export default function TerminalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>('password');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
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

  // Password screen
  if (pageState === 'password' || pageState === 'connecting') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-page px-4">
        <div className="w-full max-w-sm border border-slate-border bg-slate-card rounded-sm shadow-xl">

          {/* Modal header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-sm bg-slate-page border border-slate-border flex items-center justify-center">
                <TerminalIcon size={16} className="text-slate-muted" />
              </div>
              <div>
                <h2 className="text-slate-text font-semibold text-base">Connect to Machine</h2>
                <p className="text-slate-muted text-xs">SSH session will open after verification</p>
              </div>
            </div>
          </div>

          {/* Modal body */}
          <div className="px-6 py-5 space-y-4">

            {/* Info message */}
            <div className="flex items-start gap-2 p-3 bg-slate-page border border-slate-border rounded-sm">
              <Lock size={13} className="text-slate-muted mt-0.5 flex-shrink-0" />
              <p className="text-slate-muted text-xs leading-relaxed">
                Enter the password you set when adding this machine. This is used to decrypt your stored SSH credentials — it is not your system password.
              </p>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs text-slate-muted mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="Enter your password"
                disabled={pageState === 'connecting'}
                className="w-full border border-slate-border bg-slate-page text-slate-text rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-slate-muted disabled:opacity-50 transition-colors"
                autoFocus
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 border border-brand-danger rounded-sm">
                <AlertCircle size={13} className="text-brand-danger flex-shrink-0" />
                <p className="text-brand-danger text-xs">{error}</p>
              </div>
            )}
          </div>

          {/* Modal footer */}
          <div className="px-6 pb-6 flex gap-3 justify-end">
            <button
              onClick={() => router.push(`/machine/${id}`)}
              disabled={pageState === 'connecting'}
              className="px-4 py-2 text-sm border border-slate-border text-slate-muted hover:text-slate-text hover:border-slate-muted rounded-sm disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={pageState === 'connecting' || !password}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-primary hover:bg-brand-primaryHover text-slate-text rounded-sm disabled:opacity-50 transition-colors"
            >
              <TerminalIcon size={13} />
              {pageState === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Terminal — fills remaining height below navbar
  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-terminal overflow-hidden">
      <Terminal sessionId={sessionId!} />
    </div>
  );
}