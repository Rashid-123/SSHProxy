'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMachine, deleteMachine } from '@/lib/machine';
import type { MachineBasicInfo } from '@/types/index';
import MachineDetailCard from '@/components/machine/MachineDetailCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MachinePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [machine, setMachine] = useState< MachineBasicInfo | null>(null);
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
        <button onClick={() => router.push('/dashboard')} className="text-sm text-blue-600 hover:underline mb-6 block">
          ← Back to Dashboard
        </button>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>
      </div>
    );
  }

  if (!machine) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => router.push('/dashboard')} className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{machine.name}</h1>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Machine'}
          </button>
        </div>
      </div>

      {/* Detail card */}
      <MachineDetailCard machine={machine} />
    </div>
  );
}