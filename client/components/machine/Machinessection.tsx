'use client';

import { useState, useEffect, useCallback } from 'react';
import { listMachines, createMachine, deleteMachine } from '@/lib/machine';
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
    console.log(data)
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Machines</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Machine
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading machines...</p>
      ) : (
        <MachineList machines={machines} onDelete={handleDelete} deleting={deleting} />
      )}

      {showModal && (
        <AddMachineModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />
      )}
    </div>
  );
}