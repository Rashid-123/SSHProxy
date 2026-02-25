'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMachine, deleteMachine } from '@/lib/api/machine';
import type { MachineBasicInfo } from '@/types/index';
import MachineDetailCard from '@/components/machine/MachineDetailCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Terminal, Trash2 } from 'lucide-react';

export default function MachinePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [machine, setMachine] = useState<MachineBasicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        const res = await getMachine(id);
        setMachine(res.data);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setError('Machine not found.');
        } else {
          setError(err?.response?.data?.error || 'Failed to load machine.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!machine) return;
    if (!confirm(`Delete "${machine.name}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      await deleteMachine(machine.id);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete machine.');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-muted hover:text-slate-text transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
        <div className="p-4 border border-brand-danger text-brand-danger rounded-sm text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!machine) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Back */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-1.5 text-sm text-slate-muted hover:text-slate-text transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-text">{machine.name}</h1>
          <p className="text-slate-muted text-sm font-mono mt-1">{machine.hostname}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/machine/${id}/terminal`)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-primary hover:bg-brand-primaryHover text-slate-text transition-colors rounded-sm"
          >
            <Terminal size={14} />
            Connect
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-border text-slate-muted hover:border-brand-danger hover:text-brand-danger disabled:opacity-50 transition-colors rounded-sm"
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Detail card */}
      <MachineDetailCard machine={machine} />
    </div>
  );
}