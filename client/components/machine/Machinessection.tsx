
'use client';

import { useState, useEffect, useCallback } from 'react';
import { listMachines, createMachine, deleteMachine } from '@/lib/api/machine';
import type { MachineBasicInfo, CreateMachineRequest } from '@/types/index';
import AddMachineModal from './Addmachinemodal';
import MachineList from './MachineList';

export default function MachinesSection() {
  const [machines, setMachines] = useState<MachineBasicInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMachines = useCallback(async () => {
    try {
      setError(null);
      const res = await listMachines();
      setMachines(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load machines');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  const handleCreate = async (data: CreateMachineRequest) => {
    await createMachine(data);
    await fetchMachines();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this machine?')) return;
    setDeleting(id);
    try {
      await deleteMachine(id);
      setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete machine');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-text">Machines</h2>
          <p className="text-slate-muted text-xs mt-0.5">{machines.length} machine{machines.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-sm bg-brand-primary hover:bg-brand-primaryHover text-slate-text transition-colors rounded-sm"
        >
          + Add Machine
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 border border-brand-danger text-brand-danger text-sm rounded-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-muted text-sm">Loading machines...</p>
      ) : (
        <MachineList machines={machines} onDelete={handleDelete} deleting={deleting} />
      )}

      {showModal && (
        <AddMachineModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />
      )}
    </div>
  );
}